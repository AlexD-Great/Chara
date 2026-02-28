const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');
const STATE_FILE = path.join(DATA_DIR, 'state.json');

const DEFAULT_STATE = {
  wallets: {},
  tokenOwnership: {},
  protocols: {},
  updatedAt: null
};

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STATE_FILE)) {
    fs.writeFileSync(STATE_FILE, JSON.stringify(DEFAULT_STATE, null, 2));
  }
}

function loadState() {
  ensureStore();
  try {
    const raw = fs.readFileSync(STATE_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATE,
      ...parsed,
      wallets: parsed.wallets || {},
      tokenOwnership: parsed.tokenOwnership || {},
      protocols: parsed.protocols || {}
    };
  } catch (error) {
    console.error('Failed to load state store:', error.message);
    return { ...DEFAULT_STATE };
  }
}

function saveState(nextState) {
  ensureStore();
  const payload = {
    ...DEFAULT_STATE,
    ...nextState,
    updatedAt: new Date().toISOString()
  };
  fs.writeFileSync(STATE_FILE, JSON.stringify(payload, null, 2));
}

module.exports = {
  loadState,
  saveState
};
