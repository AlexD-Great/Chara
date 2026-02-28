require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const path = require('path');
const { startEventListener } = require('./services/eventListener');
const {
  startActivityMonitor,
  addWalletToMonitor,
  getWalletActivity,
  getAllMonitoredWallets,
  getProtocolStats,
  updateReputationScores,
  getMonitorSignerAddress,
  getOnchainReputation
} = require('./services/activityMonitor');

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, '../data/assets')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Chara backend is running' });
});

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

    const reputation = await getOnchainReputation(activity.address);
    const response = {
      address: activity.address,
      reputation,
      metrics: {
        transactionVolume: activity.transactionVolume,
        loanHistory: activity.loanHistory,
        liquidityProvision: activity.liquidityProvision,
        protocolDiversity: activity.protocolDiversity.size,
        governanceParticipation: activity.governanceParticipation,
        accountAge: Math.floor((Date.now() - activity.firstSeen) / (1000 * 60 * 60 * 24))
      },
      recentActivities: activity.activities.slice(-30).reverse(),
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
    res.json({ count: wallets.length, wallets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/update-scores', async (req, res) => {
  try {
    await updateReputationScores();
    res.json({ success: true, message: 'Reputation scores update triggered' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(200, Number(req.query.limit) || 50));
    const wallets = getAllMonitoredWallets();
    const entries = [];

    for (const wallet of wallets) {
      const reputation = await getOnchainReputation(wallet);
      if (!reputation) continue;
      entries.push({
        address: wallet,
        score: reputation.totalScore,
        level: reputation.reputationLevel,
        updatedAt: reputation.lastUpdated
      });
    }

    entries.sort((a, b) => b.score - a.score);
    const ranked = entries.slice(0, limit).map((entry, index) => ({
      rank: index + 1,
      ...entry
    }));
    res.json({ count: ranked.length, entries: ranked });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics', async (req, res) => {
  try {
    const wallets = getAllMonitoredWallets();
    const reputationRows = [];
    const now = Date.now();
    let active24h = 0;
    let totalTxTracked = 0;

    for (const wallet of wallets) {
      const activity = getWalletActivity(wallet);
      if (activity && now - activity.lastActivity <= 24 * 60 * 60 * 1000) {
        active24h += 1;
      }
      if (activity) {
        totalTxTracked += activity.activities.length;
      }
      const reputation = await getOnchainReputation(wallet);
      if (reputation) reputationRows.push(reputation);
    }

    const avgScore = reputationRows.length
      ? Math.round(reputationRows.reduce((sum, row) => sum + row.totalScore, 0) / reputationRows.length)
      : 0;

    const levelDistribution = Array.from({ length: 11 }, (_, level) => ({
      level,
      count: reputationRows.filter((row) => row.reputationLevel === level).length
    }));

    res.json({
      monitoredWallets: wallets.length,
      active24h,
      averageScore: avgScore,
      trackedTransactions: totalTxTracked,
      levelDistribution
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/protocols', async (req, res) => {
  try {
    const rows = getProtocolStats()
      .sort((a, b) => b.activityCount - a.activityCount)
      .map((protocol) => ({
        address: protocol.address,
        name: protocol.name,
        category: protocol.category,
        activityCount: protocol.activityCount,
        uniqueWalletCount: protocol.uniqueWalletCount,
        lastSeen: protocol.lastSeen
      }));
    res.json({ count: rows.length, protocols: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, async () => {
  console.log(`Chara backend running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);

  if (process.env.PRIVATE_KEY_DEPLOYER && process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
    startEventListener();
    await startActivityMonitor();

    const signerAddress = getMonitorSignerAddress();
    if (signerAddress) {
      await addWalletToMonitor(signerAddress);
      console.log(`Auto-monitoring signer wallet: ${signerAddress}`);
    }
  } else {
    console.log('Event listener disabled: set PRIVATE_KEY_DEPLOYER and NEXT_PUBLIC_CONTRACT_ADDRESS');
  }
});

process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));
