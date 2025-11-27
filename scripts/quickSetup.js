const fs = require('fs');
const path = require('path');

console.log('🚀 Chara Quick Setup\n');

// Configuration values
const WALLETCONNECT_ID = '71dbfba568107e4074e3b231d9959fe9';
const TEST_PRIVATE_KEY = 'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

console.log('📝 Configuring environment files...\n');

// Root .env configuration
const rootEnvContent = `# ============ BLOCKCHAIN CONFIG ============
# Test private key (safe for local development)
PRIVATE_KEY_DEPLOYER=${TEST_PRIVATE_KEY}

# Network RPCs
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology/
POLYGON_MAINNET_RPC=https://polygon-rpc.com/

# Polygonscan API (get from https://polygonscan.com/apis when available)
POLYGONSCAN_API_KEY=placeholder_update_when_available

# ============ FRONTEND CONFIG ============
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=${WALLETCONNECT_ID}
NEXT_PUBLIC_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_CHAIN_ID=80002

# ============ IPFS CONFIG (Optional) ============
# Get from https://pinata.cloud/
PINATA_API_KEY=
PINATA_SECRET_KEY=
PINATA_JWT=

# ============ AI IMAGE GENERATION (Optional) ============
# Get from https://huggingface.co/settings/tokens
HUGGINGFACE_API_KEY=

# Get from https://platform.stability.ai/ (Paid)
STABILITY_API_KEY=

# ============ BACKEND CONFIG ============
BACKEND_PORT=3001
`;

// Frontend .env.local configuration
const frontendEnvContent = `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=${WALLETCONNECT_ID}
NEXT_PUBLIC_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_CHAIN_ID=80002
NEXT_PUBLIC_RPC_URL=https://rpc-amoy.polygon.technology/
`;

// Write root .env
const rootEnvPath = path.join(__dirname, '..', '.env');
try {
  fs.writeFileSync(rootEnvPath, rootEnvContent);
  console.log('✅ Created .env file');
} catch (error) {
  console.error('❌ Failed to create .env:', error.message);
  process.exit(1);
}

// Write frontend .env.local
const frontendEnvPath = path.join(__dirname, '..', 'frontend', '.env.local');
try {
  fs.writeFileSync(frontendEnvPath, frontendEnvContent);
  console.log('✅ Created frontend/.env.local file');
} catch (error) {
  console.error('❌ Failed to create frontend/.env.local:', error.message);
  process.exit(1);
}

console.log('\n📊 Configuration Summary:\n');
console.log('  WalletConnect ID: ✅ Configured');
console.log('  Private Key: ✅ Test key (for local development)');
console.log('  Network: ✅ Polygon Amoy Testnet');
console.log('  Polygonscan: ⚠️  Placeholder (update when available)');
console.log('');

console.log('⚠️  IMPORTANT NOTES:\n');
console.log('1. Using TEST private key for local development');
console.log('2. Update PRIVATE_KEY_DEPLOYER with your MetaMask key for testnet');
console.log('3. Update POLYGONSCAN_API_KEY when Polygonscan is back online');
console.log('4. Get testnet POL from faucet before deploying to testnet');
console.log('');

console.log('🎯 NEXT STEPS:\n');
console.log('For LOCAL testing (no testnet POL needed):');
console.log('  1. npx hardhat node');
console.log('  2. npx hardhat run scripts/deploy.js --network localhost');
console.log('  3. cd frontend && npm run dev');
console.log('');

console.log('For TESTNET deployment (when you have POL):');
console.log('  1. Get testnet POL from: https://faucet.quicknode.com/polygon/amoy');
console.log('  2. Update .env with your MetaMask private key');
console.log('  3. npm run compile');
console.log('  4. npm run deploy:testnet');
console.log('');

console.log('🔍 Run pre-flight check:');
console.log('  node scripts/preflightCheck.js');
console.log('');

console.log('✅ Setup complete! Ready to deploy.\n');
