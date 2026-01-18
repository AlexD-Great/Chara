require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const { startEventListener } = require('./services/eventListener');
const { 
  startActivityMonitor, 
  addWalletToMonitor, 
  getWalletActivity, 
  getAllMonitoredWallets,
  updateReputationScores 
} = require('./services/activityMonitor');

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
app.get('/api/wallet/:address/activity', async (req, res) => {
  try {
    const { address } = req.params;
    const activity = getWalletActivity(address);
    
    if (!activity) {
      return res.status(404).json({ 
        error: 'Wallet not monitored',
        message: 'This wallet is not currently being monitored for activity'
      });
    }

    const response = {
      address: activity.address,
      metrics: {
        transactionVolume: activity.transactionVolume,
        loanHistory: activity.loanHistory,
        liquidityProvision: activity.liquidityProvision,
        protocolDiversity: activity.protocolDiversity.size,
        governanceParticipation: activity.governanceParticipation,
        accountAge: Math.floor((Date.now() - activity.firstSeen) / (1000 * 60 * 60 * 24))
      },
      recentActivities: activity.activities.slice(-20).reverse(),
      firstSeen: activity.firstSeen,
      lastActivity: activity.lastActivity,
      protocols: Array.from(activity.protocolDiversity)
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/wallet/:address/monitor', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    const activity = await addWalletToMonitor(address);
    res.json({ 
      success: true, 
      message: 'Wallet added to monitoring',
      address: activity.address
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/monitored-wallets', async (req, res) => {
  try {
    const wallets = getAllMonitoredWallets();
    res.json({ 
      count: wallets.length,
      wallets 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/update-scores', async (req, res) => {
  try {
    await updateReputationScores();
    res.json({ 
      success: true, 
      message: 'Reputation scores update triggered'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Chara backend running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`\n📋 API Endpoints:`);
  console.log(`   GET  /api/wallet/:address/activity`);
  console.log(`   POST /api/wallet/:address/monitor`);
  console.log(`   GET  /api/monitored-wallets`);
  console.log(`   POST /api/update-scores`);
  
  // Start blockchain event listener
  if (process.env.PRIVATE_KEY_DEPLOYER && process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
    console.log('\n🔍 Starting event listener...');
    startEventListener();
    
    console.log('📊 Starting activity monitor...');
    await startActivityMonitor();
    
    // Auto-monitor the deployer wallet
    const deployerAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    if (deployerAddress) {
      await addWalletToMonitor('0x774A693E52e6882b10f739bB7b84b3F4438ADb4B');
      console.log('\n✅ Auto-monitoring deployer wallet for testing');
    }
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
