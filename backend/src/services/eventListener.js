const { ethers } = require('ethers');
const { triggerEvolution } = require('./evolutionService');

// Contract ABI - only events we need
const CONTRACT_ABI = [
  "event NFTMinted(address indexed minter, uint256 indexed tokenId, uint256 timestamp)",
  "event NFTEvolved(uint256 indexed tokenId, uint256 newLevel, uint256 timestamp)",
  "event ActivityRecorded(address indexed wallet, uint256 activityType, uint256 score)"
];

let provider;
let contract;

function initializeContract() {
  const rpcUrl = process.env.POLYGON_AMOY_RPC || 'https://rpc-amoy.polygon.technology';
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  provider = new ethers.JsonRpcProvider(rpcUrl);
  contract = new ethers.Contract(contractAddress, CONTRACT_ABI, provider);

  console.log(`✅ Connected to contract: ${contractAddress}`);
  console.log(`📡 RPC: ${rpcUrl}`);
}

async function startEventListener() {
  try {
    initializeContract();

    // Listen for NFT Minted events
    contract.on('NFTMinted', async (minter, tokenId, timestamp, event) => {
      console.log(`\n🎨 NFT Minted!`);
      console.log(`   Minter: ${minter}`);
      console.log(`   Token ID: ${tokenId.toString()}`);
      console.log(`   Timestamp: ${new Date(Number(timestamp) * 1000).toISOString()}`);
      console.log(`   Tx: ${event.log.transactionHash}`);

      // Store initial NFT data
      // TODO: Save to database
    });

    // Listen for NFT Evolved events
    contract.on('NFTEvolved', async (tokenId, newLevel, timestamp, event) => {
      console.log(`\n✨ NFT Evolved!`);
      console.log(`   Token ID: ${tokenId.toString()}`);
      console.log(`   New Level: ${newLevel.toString()}`);
      console.log(`   Timestamp: ${new Date(Number(timestamp) * 1000).toISOString()}`);
      console.log(`   Tx: ${event.log.transactionHash}`);
    });

    // Listen for Activity Recorded events
    contract.on('ActivityRecorded', async (wallet, activityType, score, event) => {
      console.log(`\n📊 Activity Recorded!`);
      console.log(`   Wallet: ${wallet}`);
      console.log(`   Activity Type: ${activityType.toString()}`);
      console.log(`   Score: ${score.toString()}`);
      console.log(`   Tx: ${event.log.transactionHash}`);

      // Check if evolution should be triggered
      await checkAndTriggerEvolution(wallet, activityType, score);
    });

    console.log('✅ Event listener started successfully');
  } catch (error) {
    console.error('❌ Error starting event listener:', error.message);
  }
}

async function checkAndTriggerEvolution(wallet, activityType, score) {
  try {
    // Get user's NFT token ID
    const balance = await contract.balanceOf(wallet);
    
    if (balance > 0) {
      // For simplicity, assume token ID 0 for first NFT
      // In production, you'd query tokenOfOwnerByIndex
      const tokenId = 0; // This should be fetched properly
      
      // Get current evolution data
      const evolutionData = await contract.getEvolutionData(tokenId);
      const currentLevel = evolutionData.level;
      
      // Trigger evolution based on activity score
      // Example: Evolve every 100 activity points
      if (Number(score) >= 100) {
        console.log(`🚀 Triggering evolution for Token ID: ${tokenId}`);
        await triggerEvolution(tokenId, Number(currentLevel) + 1);
      }
    }
  } catch (error) {
    console.error('Error checking evolution:', error.message);
  }
}

module.exports = { startEventListener };
