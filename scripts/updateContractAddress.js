const fs = require('fs');
const path = require('path');

const contractAddress = process.argv[2];

if (!contractAddress) {
  console.error('❌ Please provide contract address');
  console.log('Usage: node scripts/updateContractAddress.js 0xYourAddress');
  process.exit(1);
}

console.log(`📝 Updating contract address to: ${contractAddress}\n`);

// Update frontend contract.ts
const contractTsPath = path.join(__dirname, '..', 'frontend', 'config', 'contract.ts');
let contractTs = fs.readFileSync(contractTsPath, 'utf8');
contractTs = contractTs.replace(
  /export const CONTRACT_ADDRESS = ['"]0x[a-fA-F0-9]{40}['"]/,
  `export const CONTRACT_ADDRESS = '${contractAddress}'`
);
fs.writeFileSync(contractTsPath, contractTs);
console.log('✅ Updated frontend/config/contract.ts');

console.log('\n🎉 Contract address updated successfully!');
console.log(`\n📍 Contract: ${contractAddress}`);
console.log('\n🚀 Next steps:');
console.log('1. Enable minting: npx hardhat run scripts/toggleMinting.js --network localhost');
console.log('2. Start frontend: cd frontend && npm run dev');
