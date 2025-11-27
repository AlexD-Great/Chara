# Chara - Deployment Guide

Complete guide to deploy and run the Chara evolving NFT platform.

## 📋 Prerequisites

### Required Tools
- Node.js v18+ 
- Git
- MetaMask wallet
- Polygon Amoy testnet POL tokens

### Required API Keys
1. **WalletConnect Project ID** - https://cloud.walletconnect.com/
2. **Polygonscan API Key** - https://polygonscan.com/apis
3. **Pinata API Keys** - https://pinata.cloud/ (for IPFS)
4. **Hugging Face API Key** (optional) - https://huggingface.co/settings/tokens
5. **Stability AI API Key** (optional) - https://platform.stability.ai/

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Root dependencies (Hardhat, contracts)
npm install

# Frontend dependencies
cd frontend
npm install
cd ..

# Backend dependencies
cd backend
npm install
cd ..
```

### 2. Configure Environment Variables

Create `.env` file in the root directory:

```bash
# Copy example file
cp .env.example .env
```

Edit `.env` with your values:

```env
# Blockchain Configuration
PRIVATE_KEY_DEPLOYER=your_private_key_here
POLYGONSCAN_API_KEY=your_polygonscan_api_key_here

# Network RPC URLs
POLYGON_MAINNET_RPC=https://polygon-rpc.com/
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology

# Frontend Configuration
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
NEXT_PUBLIC_CONTRACT_ADDRESS=will_be_filled_after_deployment
NEXT_PUBLIC_CHAIN_ID=80002

# IPFS Configuration
PINATA_API_KEY=your_pinata_api_key_here
PINATA_SECRET_KEY=your_pinata_secret_key_here
PINATA_JWT=your_pinata_jwt_here

# AI Image Generation (choose one)
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
# OR
STABILITY_API_KEY=your_stability_ai_api_key_here

# Backend Configuration
BACKEND_PORT=3001
```

Create `frontend/.env.local`:

```bash
cd frontend
cp .env.example .env.local
```

Edit with your values:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
NEXT_PUBLIC_CONTRACT_ADDRESS=will_be_filled_after_deployment
NEXT_PUBLIC_CHAIN_ID=80002
NEXT_PUBLIC_RPC_URL=https://rpc-amoy.polygon.technology
```

### 3. Get Testnet Tokens

Get POL tokens for Polygon Amoy testnet:

- **Alchemy Faucet**: https://www.alchemy.com/faucets/polygon-amoy
- **QuickNode Faucet**: https://faucet.quicknode.com/polygon/amoy
- **Polygon Faucet**: https://faucet.polygon.technology

You'll need ~0.1 POL for deployment and testing.

## 📝 Smart Contract Deployment

### Compile Contracts

```bash
npm run compile
```

### Run Tests

```bash
npm run test
```

Expected output: All tests should pass ✅

### Deploy to Polygon Amoy Testnet

```bash
npm run deploy:testnet
```

**Important**: Save the contract address from the output!

Example output:
```
✅ CharaNFT deployed to: 0x1234567890abcdef...
```

### Update Environment Variables

1. Copy the contract address
2. Update `.env`:
   ```env
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890abcdef...
   ```
3. Update `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890abcdef...
   ```

### Enable Minting

The contract is deployed with minting disabled. Enable it:

```bash
# Using Hardhat console
npx hardhat console --network polygon_amoy

# In console:
const CharaNFT = await ethers.getContractFactory("CharaNFT");
const contract = await CharaNFT.attach("YOUR_CONTRACT_ADDRESS");
await contract.toggleMinting();
```

Or create a script `scripts/toggleMinting.js`:

```javascript
const hre = require("hardhat");

async function main() {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const CharaNFT = await hre.ethers.getContractFactory("CharaNFT");
  const contract = await CharaNFT.attach(contractAddress);
  
  const tx = await contract.toggleMinting();
  await tx.wait();
  
  console.log("✅ Minting enabled!");
}

main().catch(console.error);
```

Run: `npx hardhat run scripts/toggleMinting.js --network polygon_amoy`

### Verify Contract on Polygonscan

```bash
npx hardhat verify --network polygon_amoy YOUR_CONTRACT_ADDRESS "Chara" "CHARA" "ipfs://QmPlaceholder/"
```

## 🎨 Frontend Deployment

### Local Development

```bash
cd frontend
npm run dev
```

Visit: http://localhost:3000

### Production Build

```bash
cd frontend
npm run build
npm start
```

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`
   - `NEXT_PUBLIC_CHAIN_ID`
   - `NEXT_PUBLIC_RPC_URL`
4. Deploy!

## 🔧 Backend Deployment

### Local Development

```bash
cd backend
npm run dev
```

Backend runs on: http://localhost:3001

### Production Deployment

#### Option 1: Railway

1. Create account at https://railway.app/
2. Create new project
3. Connect GitHub repository
4. Set environment variables
5. Deploy!

#### Option 2: Heroku

```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create chara-backend

# Set environment variables
heroku config:set PRIVATE_KEY_DEPLOYER=your_key
heroku config:set NEXT_PUBLIC_CONTRACT_ADDRESS=your_address
# ... set all other variables

# Deploy
git push heroku main
```

#### Option 3: VPS (DigitalOcean, AWS, etc.)

```bash
# SSH into server
ssh user@your-server

# Clone repository
git clone https://github.com/AlexD-Great/Chara.git
cd Chara/backend

# Install dependencies
npm install

# Set up PM2 for process management
npm install -g pm2

# Start backend
pm2 start src/index.js --name chara-backend

# Save PM2 configuration
pm2 save
pm2 startup
```

## 🧪 Testing the Full Stack

### 1. Test Smart Contract

```bash
npm run test
```

### 2. Test Minting

1. Open frontend: http://localhost:3000
2. Connect MetaMask (Polygon Amoy network)
3. Click "Mint Now"
4. Confirm transaction
5. Wait for confirmation

### 3. Test Evolution

Trigger a test evolution:

```bash
cd backend
node -e "
const { triggerEvolution } = require('./src/services/evolutionService');
triggerEvolution(0, 1).then(console.log);
"
```

### 4. Monitor Activity

Check backend logs for:
- Event listening
- Activity monitoring
- Evolution triggers

## 📊 Monitoring & Maintenance

### Check Contract Status

```bash
npx hardhat console --network polygon_amoy

const contract = await ethers.getContractAt("CharaNFT", "YOUR_ADDRESS");
await contract.totalMinted(); // Check minted count
await contract.mintingActive(); // Check if minting is active
```

### View on Polygonscan

https://amoy.polygonscan.com/address/YOUR_CONTRACT_ADDRESS

### Backend Health Check

```bash
curl http://localhost:3001/health
```

## 🐛 Troubleshooting

### Contract Deployment Fails

**Issue**: "Insufficient funds"
- **Solution**: Get more POL from faucets

**Issue**: "Nonce too high"
- **Solution**: Reset MetaMask account (Settings → Advanced → Clear activity data)

### Frontend Won't Connect

**Issue**: "Wrong network"
- **Solution**: Switch MetaMask to Polygon Amoy (Chain ID: 80002)

**Issue**: "Contract not found"
- **Solution**: Verify `NEXT_PUBLIC_CONTRACT_ADDRESS` is set correctly

### Backend Not Starting

**Issue**: "Missing environment variables"
- **Solution**: Ensure all required variables are set in `.env`

**Issue**: "Cannot connect to RPC"
- **Solution**: Check `POLYGON_AMOY_RPC` URL is correct

### AI Generation Fails

**Issue**: "No API key"
- **Solution**: Set `HUGGINGFACE_API_KEY` or `STABILITY_API_KEY`

**Issue**: "Rate limited"
- **Solution**: Wait or upgrade API plan

## 📈 Scaling for Production

### 1. Database Integration

Add PostgreSQL or MongoDB to store:
- NFT metadata
- User activity history
- Evolution logs

### 2. The Graph Integration

Create subgraph for efficient querying:

```bash
# Install Graph CLI
npm install -g @graphprotocol/graph-cli

# Initialize subgraph
graph init --studio chara-nfts

# Deploy
graph deploy --studio chara-nfts
```

### 3. Caching Layer

Add Redis for:
- Activity score caching
- Rate limiting
- Session management

### 4. Load Balancing

Use multiple RPC providers:
- Alchemy
- QuickNode
- Infura

## 🔐 Security Best Practices

1. **Never commit private keys**
   - Use `.env` files
   - Add to `.gitignore`

2. **Use separate wallets**
   - Deployment wallet
   - Backend automation wallet
   - Testing wallet

3. **Rate limiting**
   - Implement on backend API
   - Use API key rotation

4. **Contract auditing**
   - Run Slither: `slither contracts/`
   - Get professional audit before mainnet

## 🎉 Launch Checklist

- [ ] Smart contract deployed and verified
- [ ] Minting enabled
- [ ] Frontend deployed and accessible
- [ ] Backend running and monitoring
- [ ] AI generation working
- [ ] IPFS uploads functional
- [ ] All environment variables set
- [ ] Testnet testing complete
- [ ] Documentation updated
- [ ] Social media ready
- [ ] Community Discord/Telegram setup

## 📞 Support

- **GitHub Issues**: https://github.com/AlexD-Great/Chara/issues
- **Documentation**: https://github.com/AlexD-Great/Chara#readme

## 🚀 Next Steps

After successful deployment:

1. **Genesis Mint**: Mint initial collection for community
2. **Marketing**: Announce on Twitter, Discord, Reddit
3. **Partnerships**: Collaborate with other Polygon projects
4. **Features**: Add governance, staking, marketplace
5. **Mainnet**: Deploy to Polygon PoS mainnet

---

**Built with 💜 for the Polygon Hackathon**
