const fs = require('fs');
const path = require('path');

const contractAddress = process.argv[2] || '0x5FbDB2315678afecb367f032d93F642f64180aa3';

console.log(`📝 Updating .env files with contract address: ${contractAddress}\n`);

// Update root .env
const rootEnvPath = path.join(__dirname, '..', '.env');
let rootEnv = fs.readFileSync(rootEnvPath, 'utf8');
rootEnv = rootEnv.replace(
  /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/,
  `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`
);
fs.writeFileSync(rootEnvPath, rootEnv);
console.log('✅ Updated .env');

// Update frontend .env.local
const frontendEnvPath = path.join(__dirname, '..', 'frontend', '.env.local');
let frontendEnv = fs.readFileSync(frontendEnvPath, 'utf8');
frontendEnv = frontendEnv.replace(
  /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/,
  `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`
);
// Also update chain ID for localhost
frontendEnv = frontendEnv.replace(
  /NEXT_PUBLIC_CHAIN_ID=.*/,
  `NEXT_PUBLIC_CHAIN_ID=31337`
);
frontendEnv = frontendEnv.replace(
  /NEXT_PUBLIC_RPC_URL=.*/,
  `NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545`
);
fs.writeFileSync(frontendEnvPath, frontendEnv);
console.log('✅ Updated frontend/.env.local');

// Update frontend contract.ts
const contractTsPath = path.join(__dirname, '..', 'frontend', 'config', 'contract.ts');
let contractTs = fs.readFileSync(contractTsPath, 'utf8');
contractTs = contractTs.replace(
  /export const CONTRACT_ADDRESS = ['"]0x[a-fA-F0-9]{40}['"]/,
  `export const CONTRACT_ADDRESS = '${contractAddress}'`
);
fs.writeFileSync(contractTsPath, contractTs);
console.log('✅ Updated frontend/config/contract.ts');

console.log('\n🎉 All configuration files updated!');
console.log(`📍 Contract Address: ${contractAddress}`);
console.log(`🌐 Network: localhost (Chain ID: 31337)`);
