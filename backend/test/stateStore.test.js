const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const storePath = path.join(__dirname, '../data/state.json');
const { loadState, saveState } = require('../src/services/stateStore');

test('state store persists wallets and protocols', () => {
  const snapshot = loadState();
  saveState({
    ...snapshot,
    wallets: {
      '0xabc': {
        address: '0xabc',
        transactionVolume: 10,
        loanHistory: 0,
        liquidityProvision: 0,
        protocolDiversity: [],
        governanceParticipation: 0,
        accountAge: 0,
        firstSeen: Date.now(),
        lastActivity: Date.now(),
        activities: []
      }
    },
    protocols: {
      '0xdef': {
        address: '0xdef',
        name: 'Test Protocol',
        category: 'dex',
        activityCount: 1,
        uniqueWallets: ['0xabc'],
        lastSeen: Date.now()
      }
    }
  });

  const reloaded = loadState();
  assert.equal(reloaded.wallets['0xabc'].address, '0xabc');
  assert.equal(reloaded.protocols['0xdef'].name, 'Test Protocol');
  assert.ok(fs.existsSync(storePath));
});
