const fs = require('fs');
const path = require('path');

console.log('🔍 Chara Pre-Flight Deployment Check\n');

let errors = [];
let warnings = [];
let ready = true;

// Check .env file exists
console.log('📋 Checking environment configuration...');

const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  errors.push('.env file not found! Copy .env.example to .env');
  ready = false;
} else {
  // Read .env and check required variables
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  const requiredVars = [
    'PRIVATE_KEY_DEPLOYER',
    'POLYGON_AMOY_RPC',
    'POLYGONSCAN_API_KEY',
    'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID'
  ];
  
  const optionalVars = [
    'PINATA_API_KEY',
    'PINATA_SECRET_KEY',
    'HUGGINGFACE_API_KEY'
  ];
  
  requiredVars.forEach(varName => {
    if (!envContent.includes(varName + '=') || 
        envContent.includes(varName + '=your_') ||
        envContent.includes(varName + '=0x0000')) {
      errors.push(`${varName} not configured in .env`);
      ready = false;
    } else {
      console.log(`  ✅ ${varName}`);
    }
  });
  
  optionalVars.forEach(varName => {
    if (!envContent.includes(varName + '=') || 
        envContent.includes(varName + '=your_')) {
      warnings.push(`${varName} not configured (optional for MVP)`);
    } else {
      console.log(`  ✅ ${varName}`);
    }
  });
}

console.log('');

// Check frontend .env.local
console.log('📋 Checking frontend configuration...');

const frontendEnvPath = path.join(__dirname, '..', 'frontend', '.env.local');
if (!fs.existsSync(frontendEnvPath)) {
  warnings.push('frontend/.env.local not found - create it before deploying frontend');
  console.log('  ⚠️  frontend/.env.local not found');
} else {
  console.log('  ✅ frontend/.env.local exists');
}

console.log('');

// Check node_modules
console.log('📦 Checking dependencies...');

const rootNodeModules = path.join(__dirname, '..', 'node_modules');
const frontendNodeModules = path.join(__dirname, '..', 'frontend', 'node_modules');
const backendNodeModules = path.join(__dirname, '..', 'backend', 'node_modules');

if (!fs.existsSync(rootNodeModules)) {
  errors.push('Root dependencies not installed - run: npm install');
  ready = false;
  console.log('  ❌ Root node_modules missing');
} else {
  console.log('  ✅ Root dependencies installed');
}

if (!fs.existsSync(frontendNodeModules)) {
  warnings.push('Frontend dependencies not installed - run: cd frontend && npm install');
  console.log('  ⚠️  Frontend node_modules missing');
} else {
  console.log('  ✅ Frontend dependencies installed');
}

if (!fs.existsSync(backendNodeModules)) {
  warnings.push('Backend dependencies not installed - run: cd backend && npm install');
  console.log('  ⚠️  Backend node_modules missing');
} else {
  console.log('  ✅ Backend dependencies installed');
}

console.log('');

// Check contracts compiled
console.log('🔨 Checking smart contracts...');

const artifactsPath = path.join(__dirname, '..', 'artifacts', 'contracts', 'CharaNFT.sol', 'CharaNFT.json');
if (!fs.existsSync(artifactsPath)) {
  warnings.push('Contracts not compiled - run: npm run compile');
  console.log('  ⚠️  Contracts not compiled');
} else {
  console.log('  ✅ Contracts compiled');
}

console.log('');

// Summary
console.log('═'.repeat(60));
console.log('📊 PRE-FLIGHT CHECK SUMMARY\n');

if (errors.length === 0 && warnings.length === 0) {
  console.log('🎉 ALL SYSTEMS GO! Ready for deployment!\n');
  console.log('Next steps:');
  console.log('  1. npm run compile');
  console.log('  2. npm run test');
  console.log('  3. npm run deploy:testnet');
} else {
  if (errors.length > 0) {
    console.log('❌ CRITICAL ERRORS (must fix before deployment):\n');
    errors.forEach((err, i) => {
      console.log(`  ${i + 1}. ${err}`);
    });
    console.log('');
  }
  
  if (warnings.length > 0) {
    console.log('⚠️  WARNINGS (recommended to fix):\n');
    warnings.forEach((warn, i) => {
      console.log(`  ${i + 1}. ${warn}`);
    });
    console.log('');
  }
  
  if (ready) {
    console.log('✅ MINIMUM REQUIREMENTS MET');
    console.log('   You can deploy the smart contract now!');
    console.log('   Fix warnings for full functionality.\n');
    console.log('Next steps:');
    console.log('  1. npm run compile');
    console.log('  2. npm run deploy:testnet');
  } else {
    console.log('❌ NOT READY FOR DEPLOYMENT');
    console.log('   Fix critical errors first!\n');
    console.log('Quick fix guide:');
    console.log('  1. Copy .env.example to .env');
    console.log('  2. Fill in required API keys');
    console.log('  3. Run: npm install');
    console.log('  4. Run this check again: node scripts/preflightCheck.js');
  }
}

console.log('═'.repeat(60));

process.exit(ready ? 0 : 1);
