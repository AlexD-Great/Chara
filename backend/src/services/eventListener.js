const { ethers } = require('ethers');
const { triggerEvolution } = require('./evolutionService');
const { loadState, saveState } = require('./stateStore');

const CONTRACT_ABI = [
  'event NFTMinted(address indexed minter, uint256 indexed tokenId, uint256 timestamp)',
  'event NFTEvolved(uint256 indexed tokenId, uint256 newLevel, uint256 timestamp)',
  'event ActivityRecorded(address indexed wallet, uint256 activityType, uint256 score)',
  'function getEvolutionData(uint256 tokenId) external view returns (uint256 level, uint256 lastEvolution, address owner)'
];

let provider;
let contract;

function initializeContract() {
  const rpcUrl = process.env.POLYGON_AMOY_RPC || 'https://rpc-amoy.polygon.technology';
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  if (!contractAddress) {
    throw new Error('NEXT_PUBLIC_CONTRACT_ADDRESS is required');
  }

  provider = new ethers.JsonRpcProvider(rpcUrl);
  contract = new ethers.Contract(contractAddress, CONTRACT_ABI, provider);

  console.log(`Connected to contract: ${contractAddress}`);
  console.log(`RPC: ${rpcUrl}`);
}

function recordTokenOwnership(minter, tokenId) {
  const state = loadState();
  const wallet = minter.toLowerCase();
  const current = state.tokenOwnership[wallet] || [];
  if (!current.includes(Number(tokenId))) {
    state.tokenOwnership[wallet] = [...current, Number(tokenId)];
    saveState(state);
  }
}

function getWalletTokenIds(wallet) {
  const state = loadState();
  return state.tokenOwnership[wallet.toLowerCase()] || [];
}

async function resolveEvolvableTokenId(wallet) {
  const tokenIds = getWalletTokenIds(wallet);
  if (!tokenIds.length) return null;

  let newest = tokenIds[tokenIds.length - 1];
  let newestTimestamp = 0;

  for (const tokenId of tokenIds) {
    try {
      const evolution = await contract.getEvolutionData(tokenId);
      const lastEvolution = Number(evolution.lastEvolution || 0);
      if (lastEvolution >= newestTimestamp) {
        newestTimestamp = lastEvolution;
        newest = tokenId;
      }
    } catch (error) {
      // skip invalid/stale ids
    }
  }

  return newest;
}

async function startEventListener() {
  try {
    initializeContract();

    contract.on('NFTMinted', async (minter, tokenId, timestamp, event) => {
      console.log(`NFT Minted | wallet ${minter} | token ${tokenId.toString()} | tx ${event.log.transactionHash}`);
      recordTokenOwnership(minter, Number(tokenId));
      const iso = new Date(Number(timestamp) * 1000).toISOString();
      console.log(`Mint timestamp: ${iso}`);
    });

    contract.on('NFTEvolved', async (tokenId, newLevel, timestamp, event) => {
      console.log(`NFT Evolved | token ${tokenId.toString()} | level ${newLevel.toString()} | tx ${event.log.transactionHash}`);
      const iso = new Date(Number(timestamp) * 1000).toISOString();
      console.log(`Evolution timestamp: ${iso}`);
    });

    contract.on('ActivityRecorded', async (wallet, activityType, score, event) => {
      console.log(`ActivityRecorded | wallet ${wallet} | type ${activityType.toString()} | score ${score.toString()} | tx ${event.log.transactionHash}`);
      await checkAndTriggerEvolution(wallet, Number(score));
    });

    console.log('Event listener started');
  } catch (error) {
    console.error('Error starting event listener:', error.message);
  }
}

async function checkAndTriggerEvolution(wallet, score) {
  try {
    if (score < 100) return;
    const tokenId = await resolveEvolvableTokenId(wallet);
    if (tokenId === null) return;

    const evolution = await contract.getEvolutionData(tokenId);
    const currentLevel = Number(evolution.level || 0);
    console.log(`Trigger evolution | wallet ${wallet} | token ${tokenId} | ${currentLevel} -> ${currentLevel + 1}`);
    await triggerEvolution(tokenId, currentLevel + 1);
  } catch (error) {
    console.error('Error checking evolution:', error.message);
  }
}

module.exports = { startEventListener };
