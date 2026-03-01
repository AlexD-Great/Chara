const { ethers } = require('ethers');
const { loadState, saveState } = require('./stateStore');

const KNOWN_PROTOCOLS = {
  '0xa5e0829caced8ffdd4de3c43696c57f7d7a678ff': { name: 'QuickSwap Router', category: 'dex' },
  '0x5757371414417b8c6caad45baef941abc7d3ab32': { name: 'QuickSwap Factory', category: 'dex' },
  '0x6c9fb0d5bd9429eb9cd96b85b81d872281771e6b': { name: 'Aave Pool', category: 'lending' },
  '0xe592427a0aece92de3edee1f18e0157c05861564': { name: 'Uniswap V3 Router', category: 'dex' }
};

if (process.env.DEMO_SWAP_CONTRACT) {
  KNOWN_PROTOCOLS[process.env.DEMO_SWAP_CONTRACT.toLowerCase()] = {
    name: 'Chara DemoSwapEmitter',
    category: 'demo'
  };
}

const EVENT_SIGNATURES = {
  SWAP: '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822',
  MINT_LP: '0x4c209b5fc8ad50758f13e2e1088ba56a560dff690a1c6fef26394f4c03821c4f',
  BURN_LP: '0xdccd412f0b1252819cb1fd330b93224ca42612892bb3f4f789976e6d81936496',
  BORROW: '0xc6a898309e823ee50bac64e45ca8adba6690e99e7841c45d754e2a38e9019d9b',
  REPAY: '0xa534c8dbe71f871f9f3530e97a74601fea17b426cae02e1c5aee42c96c784051',
  VOTE_CAST: '0xb8910b9960c443aac3240b98585384e3a6f109fbf6969e264c3f183d69aba7e1'
};

let provider;
let charaContract;
let signer;
const walletActivity = new Map();
const protocolStats = new Map();
const lastProcessedBlock = { value: 0 };
let persistTimer = null;

const CHARA_MONITOR_ABI = [
  'function getReputationScore(address wallet) view returns ((uint256 transactionVolume,uint256 loanHistory,uint256 liquidityProvision,uint256 protocolDiversity,uint256 governanceScore,uint256 accountAge,uint256 totalScore,uint256 reputationLevel,uint256 lastUpdated))',
  'function updateReputationScore(address wallet,uint256 transactionVolume,uint256 loanHistory,uint256 liquidityProvision,uint256 protocolDiversity,uint256 governanceScore,uint256 accountAge) external'
];

function hydrateFromStore() {
  const state = loadState();

  Object.values(state.wallets || {}).forEach((entry) => {
    walletActivity.set(entry.address, {
      ...entry,
      protocolDiversity: new Set(entry.protocolDiversity || []),
      activities: entry.activities || []
    });
  });

  Object.entries(state.protocols || {}).forEach(([address, entry]) => {
    protocolStats.set(address, {
      ...entry,
      uniqueWallets: new Set(entry.uniqueWallets || [])
    });
  });
}

function queuePersist() {
  if (persistTimer) return;
  persistTimer = setTimeout(() => {
    persistTimer = null;
    persistToStore();
  }, 2000);
}

function persistToStore() {
  const state = loadState();

  const wallets = {};
  for (const [address, activity] of walletActivity.entries()) {
    wallets[address] = {
      ...activity,
      protocolDiversity: Array.from(activity.protocolDiversity || []),
      activities: (activity.activities || []).slice(-200)
    };
  }

  const protocols = {};
  for (const [address, stats] of protocolStats.entries()) {
    protocols[address] = {
      ...stats,
      uniqueWallets: Array.from(stats.uniqueWallets || [])
    };
  }

  saveState({
    ...state,
    wallets,
    protocols
  });
}

function classifyActivity(topic) {
  if (topic === EVENT_SIGNATURES.SWAP) return 'swap';
  if (topic === EVENT_SIGNATURES.MINT_LP || topic === EVENT_SIGNATURES.BURN_LP) return 'liquidity';
  if (topic === EVENT_SIGNATURES.BORROW || topic === EVENT_SIGNATURES.REPAY) return topic === EVENT_SIGNATURES.REPAY ? 'repay' : 'borrow';
  if (topic === EVENT_SIGNATURES.VOTE_CAST) return 'governance';
  return null;
}

function applyActivityScore(activity, kind, value) {
  if (kind === 'swap') {
    activity.transactionVolume += value > 0 ? value * 100 : 10;
  } else if (kind === 'liquidity') {
    activity.liquidityProvision += 20;
  } else if (kind === 'borrow') {
    activity.loanHistory += 15;
  } else if (kind === 'repay') {
    activity.loanHistory += 30;
  } else if (kind === 'governance') {
    activity.governanceParticipation += 25;
  }
}

function observeProtocol(protocolAddress, walletAddress) {
  const known = KNOWN_PROTOCOLS[protocolAddress];
  const current = protocolStats.get(protocolAddress) || {
    address: protocolAddress,
    name: known ? known.name : `Protocol ${protocolAddress.slice(0, 6)}...${protocolAddress.slice(-4)}`,
    category: known ? known.category : 'unknown',
    activityCount: 0,
    uniqueWallets: new Set(),
    lastSeen: Date.now()
  };

  current.activityCount += 1;
  current.uniqueWallets.add(walletAddress);
  current.lastSeen = Date.now();
  protocolStats.set(protocolAddress, current);
}

async function initializeMonitor() {
  const rpcUrl = process.env.POLYGON_AMOY_RPC || 'https://rpc-amoy.polygon.technology';
  provider = new ethers.JsonRpcProvider(rpcUrl);

  const privateKey = process.env.PRIVATE_KEY_DEPLOYER;
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  if (!privateKey || !contractAddress) {
    throw new Error('Missing PRIVATE_KEY_DEPLOYER or NEXT_PUBLIC_CONTRACT_ADDRESS');
  }

  signer = new ethers.Wallet(privateKey, provider);
  charaContract = new ethers.Contract(contractAddress, CHARA_MONITOR_ABI, signer);

  hydrateFromStore();

  const currentBlock = await provider.getBlockNumber();
  lastProcessedBlock.value = currentBlock;

  console.log('Activity monitor initialized');
  console.log(`Contract: ${contractAddress}`);
  console.log(`Signer: ${signer.address}`);
  console.log(`Starting from block: ${currentBlock}`);
}

async function startActivityMonitor() {
  try {
    await initializeMonitor();

    provider.on('block', async (blockNumber) => {
      if (blockNumber % 10 === 0) {
        console.log(`Block ${blockNumber} | monitored wallets: ${walletActivity.size}`);
      }
      await scanBlockForActivity(blockNumber);
    });

    setInterval(async () => {
      await updateReputationScores();
    }, 60000);

    console.log('Activity monitor started: live DeFi scan + 60s score updates');
  } catch (error) {
    console.error('Error starting activity monitor:', error.message);
  }
}

async function addWalletToMonitor(walletAddress) {
  const address = walletAddress.toLowerCase();
  if (!walletActivity.has(address)) {
    walletActivity.set(address, {
      address,
      transactionVolume: 0,
      loanHistory: 0,
      liquidityProvision: 0,
      protocolDiversity: new Set(),
      governanceParticipation: 0,
      accountAge: 0,
      firstSeen: Date.now(),
      lastActivity: Date.now(),
      activities: []
    });
    queuePersist();
  }
  return walletActivity.get(address);
}

async function scanBlockForActivity(blockNumber) {
  try {
    if (blockNumber <= lastProcessedBlock.value) return;

    const block = await provider.getBlock(blockNumber, true);
    if (!block || !block.prefetchedTransactions) return;

    for (const tx of block.prefetchedTransactions) {
      const from = (tx.from || '').toLowerCase();
      if (!walletActivity.has(from)) continue;
      const receipt = await provider.getTransactionReceipt(tx.hash);
      if (receipt) {
        await analyzeTransaction(from, receipt, tx);
      }
    }

    lastProcessedBlock.value = blockNumber;
  } catch (error) {
    if (!error.message.toLowerCase().includes('rate limit')) {
      console.error('Error scanning block:', error.message);
    }
  }
}

async function analyzeTransaction(walletAddress, receipt, tx) {
  const activity = walletActivity.get(walletAddress);
  if (!activity) return;

  const value = parseFloat(ethers.formatEther(tx.value || 0));
  let detected = false;

  for (const log of receipt.logs) {
    const topic = log.topics[0];
    const kind = classifyActivity(topic);
    if (!kind) continue;

    const protocolAddress = log.address.toLowerCase();
    const known = KNOWN_PROTOCOLS[protocolAddress];

    applyActivityScore(activity, kind, value);
    activity.protocolDiversity.add(protocolAddress);
    observeProtocol(protocolAddress, walletAddress);
    detected = true;

    activity.activities.push({
      txHash: receipt.hash,
      timestamp: Date.now(),
      blockNumber: receipt.blockNumber,
      type: kind,
      protocolAddress,
      protocolName: known ? known.name : null,
      value
    });
  }

  if (detected) {
    activity.lastActivity = Date.now();
    if (activity.activities.length > 200) {
      activity.activities = activity.activities.slice(-200);
    }
    queuePersist();
  }
}

async function updateReputationScores() {
  try {
    for (const [address, activity] of walletActivity.entries()) {
      if (Date.now() - activity.lastActivity > 300000) continue;

      const accountAgeInDays = (Date.now() - activity.firstSeen) / (1000 * 60 * 60 * 24);
      const scores = {
        transactionVolume: Math.min(100, Math.floor(activity.transactionVolume / 10)),
        loanHistory: Math.min(100, Math.floor(activity.loanHistory)),
        liquidityProvision: Math.min(100, Math.floor(activity.liquidityProvision)),
        protocolDiversity: Math.min(100, activity.protocolDiversity.size * 20),
        governanceScore: Math.min(100, Math.floor(activity.governanceParticipation)),
        accountAge: Math.min(100, Math.floor(accountAgeInDays * 5))
      };

      try {
        const current = await charaContract.getReputationScore(address);
        const hasChanges =
          scores.transactionVolume !== Number(current.transactionVolume) ||
          scores.loanHistory !== Number(current.loanHistory) ||
          scores.liquidityProvision !== Number(current.liquidityProvision) ||
          scores.protocolDiversity !== Number(current.protocolDiversity) ||
          scores.governanceScore !== Number(current.governanceScore) ||
          scores.accountAge !== Number(current.accountAge);

        if (!hasChanges) continue;

        const tx = await charaContract.updateReputationScore(
          address,
          scores.transactionVolume,
          scores.loanHistory,
          scores.liquidityProvision,
          scores.protocolDiversity,
          scores.governanceScore,
          scores.accountAge
        );
        await tx.wait();
        console.log(`Updated reputation for ${address.slice(0, 8)}... | tx ${tx.hash}`);
      } catch (error) {
        if (!error.message.toLowerCase().includes('revert')) {
          console.error(`Error updating reputation for ${address}:`, error.message);
        }
      }
    }
  } catch (error) {
    console.error('Error in updateReputationScores:', error.message);
  }
}

function getWalletActivity(address) {
  return walletActivity.get(address.toLowerCase());
}

function getAllMonitoredWallets() {
  return Array.from(walletActivity.keys());
}

function getProtocolStats() {
  return Array.from(protocolStats.values()).map((entry) => ({
    ...entry,
    uniqueWalletCount: entry.uniqueWallets.size,
    uniqueWallets: undefined
  }));
}

function getMonitorSignerAddress() {
  return signer ? signer.address : null;
}

async function getOnchainReputation(address) {
  if (!charaContract) return null;
  try {
    const score = await charaContract.getReputationScore(address);
    return {
      transactionVolume: Number(score.transactionVolume),
      loanHistory: Number(score.loanHistory),
      liquidityProvision: Number(score.liquidityProvision),
      protocolDiversity: Number(score.protocolDiversity),
      governanceScore: Number(score.governanceScore),
      accountAge: Number(score.accountAge),
      totalScore: Number(score.totalScore),
      reputationLevel: Number(score.reputationLevel),
      lastUpdated: Number(score.lastUpdated)
    };
  } catch (error) {
    return null;
  }
}

module.exports = {
  startActivityMonitor,
  addWalletToMonitor,
  getWalletActivity,
  getAllMonitoredWallets,
  getProtocolStats,
  updateReputationScores,
  getMonitorSignerAddress,
  getOnchainReputation
};
