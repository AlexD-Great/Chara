# Chara - Quick Start Guide

Get your Chara NFT platform running in 10 minutes!

## 🚀 One-Command Setup (Coming Soon)

```bash
npm run setup
```

## 📝 Manual Setup

### Step 1: Install Dependencies (2 min)

```bash
# Root (smart contracts)
npm install

# Frontend
cd frontend && npm install && cd ..

# Backend
cd backend && npm install && cd ..
```

### Step 2: Configure Environment (3 min)

```bash
# Copy example files
cp .env.example .env
cp frontend/.env.example frontend/.env.local
```

**Edit `.env` with your values:**

```env
# Required for deployment
PRIVATE_KEY_DEPLOYER=your_metamask_private_key

# Required for frontend
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=get_from_walletconnect.com

# Optional (for full features)
PINATA_API_KEY=your_pinata_key
HUGGINGFACE_API_KEY=your_hf_key
```

### Step 3: Get Testnet Tokens (1 min)

Visit: https://www.alchemy.com/faucets/polygon-amoy

Request 0.5 POL to your wallet address.

### Step 4: Deploy Contract (2 min)

```bash
# Compile
npm run compile

# Deploy to testnet
npm run deploy:testnet
```

**Copy the contract address from output!**

### Step 5: Update Contract Address (1 min)

Edit `.env`:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
```

### Step 6: Enable Minting (1 min)

```bash
npx hardhat run scripts/toggleMinting.js --network polygon_amoy
```

### Step 7: Start Everything! (30 sec)

```bash
# Terminal 1: Frontend
cd frontend && npm run dev

# Terminal 2: Backend
cd backend && npm run dev
```

## 🎉 You're Live!

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001/health
- **Contract**: https://amoy.polygonscan.com/address/YOUR_ADDRESS

## 🧪 Test Your Setup

### 1. Check Contract Status

```bash
npx hardhat run scripts/checkStatus.js --network polygon_amoy
```

### 2. Mint an NFT

1. Open http://localhost:3000
2. Connect MetaMask (switch to Polygon Amoy)
3. Click "Mint Now"
4. Confirm transaction
5. Wait ~5 seconds

### 3. Test Evolution

```bash
# Evolve token ID 0 to level 1
npx hardhat run scripts/testEvolution.js --network polygon_amoy
```

## 🐛 Common Issues

### "Insufficient funds"
- Get more POL from faucet
- Need ~0.1 POL for testing

### "Wrong network"
- Switch MetaMask to Polygon Amoy
- Chain ID: 80002

### "Contract not found"
- Verify `NEXT_PUBLIC_CONTRACT_ADDRESS` is set
- Check address is correct

### "Cannot connect wallet"
- Get WalletConnect Project ID
- Set in `.env` files

## 📚 Next Steps

1. **Customize**: Edit `CharaNFT.sol` for your needs
2. **Design**: Update frontend styling in `frontend/app/globals.css`
3. **AI Art**: Set up Hugging Face or Stability AI keys
4. **Deploy**: Follow `DEPLOYMENT_GUIDE.md` for production

## 🎯 Development Workflow

```bash
# Make changes to contract
npm run compile
npm run test

# Redeploy if needed
npm run deploy:testnet

# Update frontend/backend with new address

# Test locally
cd frontend && npm run dev
```

## 📞 Need Help?

- **Deployment Guide**: See `DEPLOYMENT_GUIDE.md`
- **README**: See `README.md`
- **Issues**: https://github.com/AlexD-Great/Chara/issues

## ⚡ Pro Tips

1. **Use Hardhat Console** for quick testing:
   ```bash
   npx hardhat console --network polygon_amoy
   ```

2. **Monitor Events** in backend logs:
   ```bash
   cd backend && npm run dev
   ```

3. **Check Gas Costs**:
   ```bash
   REPORT_GAS=true npm run test
   ```

4. **Verify Contract** on Polygonscan:
   ```bash
   npm run verify
   ```

---

**Happy Building! 🚀**

Built for Polygon Hackathon with 💜
