const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

const POLYGON_PROTOCOLS = {
  QUICKSWAP_ROUTER: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',
  QUICKSWAP_FACTORY: '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32',
  AAVE_POOL: '0x6C9fB0D5bD9429eb9Cd96B85B81d872281771E6B',
  UNISWAP_V3_ROUTER: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
};

const EVENT_SIGNATURES = {
  SWAP: '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822',
  MINT_LP: '0x4c209b5fc8ad50758f13e2e1088ba56a560dff690a1c6fef26394f4c03821c4f',
  BURN_LP: '0xdccd412f0b1252819cb1fd330b93224ca42612892bb3f4f789976e6d81936496',
  BORROW: '0xc6a898309e823ee50bac64e45ca8adba6690e99e7841c45d754e2a38e9019d9b',
  REPAY: '0xa534c8dbe71f871f9f3530e97a74601fea17b426cae02e1c5aee42c96c784051',
  VOTE_CAST: '0xb8910b9960c443aac3240b98585384e3a6f109fbf6969e264c3f183d69aba7e1',
};

let provider;
let charaContract;
let signer;
const walletActivity = new Map();
const lastProcessedBlock = { value: 0 };

async function initializeMonitor() {
  try {
    const rpcUrl = process.env.POLYGON_AMOY_RPC || 'https://rpc-amoy.polygon.technology';
    provider = new ethers.JsonRpcProvider(rpcUrl);
    
    const privateKey = process.env.PRIVATE_KEY_DEPLOYER;
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    
    if (!privateKey || !contractAddress) {
      throw new Error('Missing PRIVATE_KEY_DEPLOYER or NEXT_PUBLIC_CONTRACT_ADDRESS');
    }
    
    signer = new ethers.Wallet(privateKey, provider);
    
    const contractABI = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../../../artifacts/contracts/CharaNFT.sol/CharaNFT.json'), 'utf8')
    ).abi;
    
    charaContract = new ethers.Contract(contractAddress, contractABI, signer);
    
    const currentBlock = await provider.getBlockNumber();
    lastProcessedBlock.value = currentBlock;
    
    console.log('✅ Activity monitor initialized');
    console.log(`   Contract: ${contractAddress}`);
    console.log(`   Starting from block: ${currentBlock}`);
    console.log(`   Signer: ${signer.address}`);
  } catch (error) {
    console.error('❌ Failed to initialize monitor:', error.message);
    throw error;
  }
}

async function startActivityMonitor() {
  try {
    await initializeMonitor();

    provider.on('block', async (blockNumber) => {
      if (blockNumber % 10 === 0) {
        console.log(`📦 Block: ${blockNumber} | Monitoring ${walletActivity.size} wallets`);
      }
      
      await scanBlockForActivity(blockNumber);
    });

    setInterval(async () => {
      await updateReputationScores();
    }, 60000);

    console.log('✅ Activity monitor started');
    console.log('   Scanning for DeFi activity on Polygon Amoy');
    console.log('   Auto-updating reputation scores every 60 seconds');
  } catch (error) {
    console.error('❌ Error starting activity monitor:', error.message);
  }
}

async function addWalletToMonitor(walletAddress) {
  const addr = walletAddress.toLowerCase();
  if (!walletActivity.has(addr)) {
    walletActivity.set(addr, {
      address: addr,
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
    console.log(`👀 Now monitoring wallet: ${walletAddress}`);
  }
  return walletActivity.get(addr);
}

async function scanBlockForActivity(blockNumber) {
  try {
    if (blockNumber <= lastProcessedBlock.value) return;
    
    const block = await provider.getBlock(blockNumber, true);
    if (!block || !block.prefetchedTransactions) return;

    for (const tx of block.prefetchedTransactions) {
      const from = tx.from.toLowerCase();
      const to = tx.to ? tx.to.toLowerCase() : null;

      if (walletActivity.has(from)) {
        const receipt = await provider.getTransactionReceipt(tx.hash);
        if (receipt) {
          await analyzeTransaction(from, receipt, tx);
        }
      }
    }
    
    lastProcessedBlock.value = blockNumber;
  } catch (error) {
    if (!error.message.includes('rate limit')) {
      console.error('Error scanning block:', error.message);
    }
  }
}

async function analyzeTransaction(walletAddress, receipt, tx) {
  try {
    const activity = walletActivity.get(walletAddress);
    if (!activity) return;

    const value = parseFloat(ethers.formatEther(tx.value || 0));
    let activityDetected = false;

    for (const log of receipt.logs) {
      const topic = log.topics[0];
      const protocol = log.address.toLowerCase();

      if (topic === EVENT_SIGNATURES.SWAP) {
        activity.transactionVolume += value > 0 ? value * 100 : 10;
        activity.protocolDiversity.add(protocol);
        activityDetected = true;
        console.log(`💱 Swap detected: ${walletAddress.slice(0, 8)}... | Value: ${value.toFixed(4)} POL`);
      }
      else if (topic === EVENT_SIGNATURES.MINT_LP || topic === EVENT_SIGNATURES.BURN_LP) {
        activity.liquidityProvision += 20;
        activity.protocolDiversity.add(protocol);
        activityDetected = true;
        console.log(`💧 LP activity: ${walletAddress.slice(0, 8)}...`);
      }
      else if (topic === EVENT_SIGNATURES.BORROW || topic === EVENT_SIGNATURES.REPAY) {
        activity.loanHistory += topic === EVENT_SIGNATURES.REPAY ? 30 : 15;
        activity.protocolDiversity.add(protocol);
        activityDetected = true;
        console.log(`🏦 Loan activity: ${walletAddress.slice(0, 8)}...`);
      }
      else if (topic === EVENT_SIGNATURES.VOTE_CAST) {
        activity.governanceParticipation += 25;
        activity.protocolDiversity.add(protocol);
        activityDetected = true;
        console.log(`🗳️  Governance vote: ${walletAddress.slice(0, 8)}...`);
      }
    }

    if (activityDetected) {
      activity.lastActivity = Date.now();
      activity.activities.push({
        txHash: receipt.hash,
        timestamp: Date.now(),
        blockNumber: receipt.blockNumber
      });
      
      if (activity.activities.length > 100) {
        activity.activities = activity.activities.slice(-100);
      }
    }
  } catch (error) {
    console.error('Error analyzing transaction:', error.message);
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
        const currentScore = await charaContract.getReputationScore(address);
        
        const hasChanges = 
          scores.transactionVolume !== Number(currentScore.transactionVolume) ||
          scores.loanHistory !== Number(currentScore.loanHistory) ||
          scores.liquidityProvision !== Number(currentScore.liquidityProvision) ||
          scores.protocolDiversity !== Number(currentScore.protocolDiversity) ||
          scores.governanceScore !== Number(currentScore.governanceScore) ||
          scores.accountAge !== Number(currentScore.accountAge);

        if (hasChanges) {
          console.log(`\n📊 Updating reputation for ${address.slice(0, 8)}...`);
          console.log(`   Transaction Volume: ${scores.transactionVolume}/100`);
          console.log(`   Loan History: ${scores.loanHistory}/100`);
          console.log(`   Liquidity Provision: ${scores.liquidityProvision}/100`);
          console.log(`   Protocol Diversity: ${scores.protocolDiversity}/100 (${activity.protocolDiversity.size} protocols)`);
          console.log(`   Governance: ${scores.governanceScore}/100`);
          console.log(`   Account Age: ${scores.accountAge}/100`);

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
          console.log(`✅ Reputation updated! TX: ${tx.hash}`);
        }
      } catch (error) {
        if (!error.message.includes('call revert')) {
          console.error(`Error updating ${address}:`, error.message);
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

module.exports = {
  startActivityMonitor,
  addWalletToMonitor,
  getWalletActivity,
  getAllMonitoredWallets,
  updateReputationScores
};
