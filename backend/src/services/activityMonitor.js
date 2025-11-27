const { ethers } = require('ethers');

// Monitor on-chain activity for wallet addresses
// This service watches for swaps, LP provisions, etc.

const ACTIVITY_TYPES = {
  SWAP: 1,
  LP_PROVIDE: 2,
  MINT: 3,
  GOVERNANCE: 4,
  SOCIAL: 5
};

const ACTIVITY_SCORES = {
  SWAP: 10,
  LP_PROVIDE: 25,
  MINT: 15,
  GOVERNANCE: 20,
  SOCIAL: 5
};

let provider;
let contract;
const monitoredWallets = new Set();

function initializeMonitor() {
  const rpcUrl = process.env.POLYGON_AMOY_RPC || 'https://rpc-amoy.polygon.technology';
  provider = new ethers.JsonRpcProvider(rpcUrl);
  
  console.log('✅ Activity monitor initialized');
}

async function startActivityMonitor() {
  try {
    initializeMonitor();

    // Monitor new blocks for activity
    provider.on('block', async (blockNumber) => {
      if (blockNumber % 10 === 0) { // Log every 10 blocks
        console.log(`📦 Block: ${blockNumber}`);
      }
      
      // Check monitored wallets for activity
      await checkWalletActivity(blockNumber);
    });

    console.log('✅ Activity monitor started');
  } catch (error) {
    console.error('❌ Error starting activity monitor:', error.message);
  }
}

async function addWalletToMonitor(walletAddress) {
  monitoredWallets.add(walletAddress.toLowerCase());
  console.log(`👀 Now monitoring wallet: ${walletAddress}`);
}

async function checkWalletActivity(blockNumber) {
  try {
    // Get block with transactions
    const block = await provider.getBlock(blockNumber, true);
    
    if (!block || !block.transactions) return;

    for (const tx of block.transactions) {
      const txReceipt = await provider.getTransactionReceipt(tx);
      
      if (!txReceipt) continue;

      // Check if transaction involves monitored wallets
      const from = txReceipt.from.toLowerCase();
      const to = txReceipt.to ? txReceipt.to.toLowerCase() : null;

      if (monitoredWallets.has(from) || (to && monitoredWallets.has(to))) {
        await analyzeTransaction(txReceipt);
      }
    }
  } catch (error) {
    // Silently handle errors to avoid spam
    if (error.message.includes('rate limit')) {
      console.log('⚠️  Rate limited, slowing down...');
    }
  }
}

async function analyzeTransaction(txReceipt) {
  try {
    // Analyze transaction to determine activity type
    const logs = txReceipt.logs;
    
    // Simple heuristic: check for common DEX/DeFi signatures
    for (const log of logs) {
      const topics = log.topics;
      
      // Swap event signature (Uniswap V2/V3 style)
      if (topics[0] === '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822') {
        console.log(`💱 Swap detected in tx: ${txReceipt.hash}`);
        await recordActivity(txReceipt.from, ACTIVITY_TYPES.SWAP, ACTIVITY_SCORES.SWAP);
        return;
      }
      
      // Mint/Burn events for LP
      if (topics[0] === '0x4c209b5fc8ad50758f13e2e1088ba56a560dff690a1c6fef26394f4c03821c4f') {
        console.log(`💧 LP activity detected in tx: ${txReceipt.hash}`);
        await recordActivity(txReceipt.from, ACTIVITY_TYPES.LP_PROVIDE, ACTIVITY_SCORES.LP_PROVIDE);
        return;
      }
    }
  } catch (error) {
    console.error('Error analyzing transaction:', error.message);
  }
}

async function recordActivity(walletAddress, activityType, score) {
  try {
    // In production, this would call the smart contract's recordActivity function
    console.log(`📝 Recording activity for ${walletAddress}:`);
    console.log(`   Type: ${activityType}, Score: ${score}`);
    
    // TODO: Call contract.recordActivity(walletAddress, activityType, score)
    // This requires a wallet with authorization
  } catch (error) {
    console.error('Error recording activity:', error.message);
  }
}

module.exports = {
  startActivityMonitor,
  addWalletToMonitor,
  ACTIVITY_TYPES,
  ACTIVITY_SCORES
};
