require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const { startEventListener } = require('./services/eventListener');
const { startActivityMonitor } = require('./services/activityMonitor');

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Chara backend is running' });
});

// API endpoints
app.get('/api/nft/:tokenId', async (req, res) => {
  try {
    const { tokenId } = req.params;
    // TODO: Fetch NFT data from contract
    res.json({ tokenId, message: 'NFT data endpoint' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/wallet/:address', async (req, res) => {
  try {
    const { address } = req.params;
    // TODO: Fetch wallet activity data
    res.json({ address, message: 'Wallet activity endpoint' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Chara backend running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  
  // Start blockchain event listener
  if (process.env.PRIVATE_KEY_DEPLOYER && process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
    console.log('🔍 Starting event listener...');
    startEventListener();
    
    console.log('📊 Starting activity monitor...');
    startActivityMonitor();
  } else {
    console.log('⚠️  Missing environment variables. Event listener not started.');
    console.log('   Required: PRIVATE_KEY_DEPLOYER, NEXT_PUBLIC_CONTRACT_ADDRESS');
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});
