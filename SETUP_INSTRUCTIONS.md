# 🚀 Chara - Immediate Setup Instructions

**Status**: Ready for deployment  
**Time Required**: 30-45 minutes  
**Difficulty**: Beginner-friendly

---

## ⚡ CRITICAL: Get These API Keys FIRST

### 1. **Polygon Amoy Testnet POL** (5 min) - REQUIRED

Visit: https://www.alchemy.com/faucets/polygon-amoy

1. Create free Alchemy account
2. Enter your MetaMask wallet address
3. Request 0.5 POL (enough for deployment + 50 mints)
4. Wait ~30 seconds for tokens to arrive

**Check balance:**
- Open MetaMask
- Switch to "Polygon Amoy Testnet"
- Should see 0.5 POL

### 2. **WalletConnect Project ID** (3 min) - REQUIRED

Visit: https://cloud.walletconnect.com/

1. Sign up (free)
2. Create new project
3. Name it "Chara NFT"
4. Copy the **Project ID** (looks like: `a1b2c3d4e5f6...`)

### 3. **Polygonscan API Key** (3 min) - REQUIRED

Visit: https://polygonscan.com/apis

1. Sign up (free)
2. Go to "API Keys"
3. Create new key
4. Copy the key

### 4. **Pinata API Keys** (5 min) - OPTIONAL (for evolution)

Visit: https://pinata.cloud/

1. Sign up (free tier is enough)
2. Go to "API Keys"
3. Create new key with "Pinning" permissions
4. Save:
   - API Key
   - API Secret
   - JWT token

### 5. **Hugging Face API Key** (3 min) - OPTIONAL (for AI art)

Visit: https://huggingface.co/settings/tokens

1. Sign up (free)
2. Create new token
3. Copy token

---

## 📝 STEP-BY-STEP DEPLOYMENT

### Step 1: Configure Root Environment (5 min)

Open `.env` file and fill in:

```env
# ============ REQUIRED FOR DEPLOYMENT ============

# Your MetaMask private key (NEVER share this!)
# Get from: MetaMask → 3 dots → Account Details → Export Private Key
PRIVATE_KEY_DEPLOYER=your_private_key_here

# Polygon Amoy RPC (use this free one)
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology/

# Polygonscan API Key (from step 3 above)
POLYGONSCAN_API_KEY=your_polygonscan_api_key_here

# ============ REQUIRED FOR FRONTEND ============

# WalletConnect Project ID (from step 2 above)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here

# Contract address (leave as is, will update after deployment)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000

# Chain ID for Polygon Amoy
NEXT_PUBLIC_CHAIN_ID=80002

# ============ OPTIONAL (for full features) ============

# Pinata (for IPFS - from step 4 above)
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret
PINATA_JWT=your_pinata_jwt

# Hugging Face (for AI art - from step 5 above)
HUGGINGFACE_API_KEY=your_hf_token

# Stability AI (alternative to Hugging Face)
STABILITY_API_KEY=your_stability_key
```

### Step 2: Configure Frontend Environment (2 min)

Create `frontend/.env.local`:

```bash
cd frontend
cp .env.example .env.local
```

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
NEXT_PUBLIC_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_CHAIN_ID=80002
NEXT_PUBLIC_RPC_URL=https://rpc-amoy.polygon.technology/
```

### Step 3: Compile Smart Contracts (2 min)

```bash
# From root directory
npm run compile
```

**Expected output:**
```
Compiled 1 Solidity file successfully
```

### Step 4: Run Tests (3 min) - OPTIONAL but recommended

```bash
npm run test
```

**Expected output:**
```
✓ Should deploy with correct name and symbol
✓ Should mint NFT
✓ Should prevent transfers (soulbound)
... (50+ tests passing)
```

### Step 5: Deploy to Polygon Amoy (5 min)

```bash
npm run deploy:testnet
```

**Expected output:**
```
🚀 Deploying CharaNFT to polygon_amoy...

📋 Deployment Configuration:
   Network: polygon_amoy
   Deployer: 0xYourAddress
   Balance: 0.5 POL

⏳ Deploying contract...
✅ CharaNFT deployed!

📊 Deployment Summary:
   Contract Address: 0xABCDEF1234567890...
   Transaction Hash: 0x123456...
   Block Number: 12345678
   Gas Used: 2,500,000
   
🔗 View on Polygonscan:
   https://amoy.polygonscan.com/address/0xABCDEF1234567890...
```

**IMPORTANT:** Copy the contract address!

### Step 6: Update Contract Address (2 min)

Update in TWO places:

**1. Root `.env`:**
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddressHere
```

**2. Frontend `.env.local`:**
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddressHere
```

### Step 7: Verify Contract on Polygonscan (3 min)

```bash
npm run verify
```

**Expected output:**
```
✅ Contract verified successfully!
🔗 https://amoy.polygonscan.com/address/0xYourAddress#code
```

### Step 8: Enable Minting (1 min)

```bash
npx hardhat run scripts/toggleMinting.js --network polygon_amoy
```

**Expected output:**
```
Current minting status: ❌ Inactive
⏳ Toggling...
✅ Minting is now: ✅ Active
```

### Step 9: Check Contract Status (1 min)

```bash
npx hardhat run scripts/checkStatus.js --network polygon_amoy
```

**Expected output:**
```
📊 Contract Information:
   Name: Chara NFT
   Symbol: CHARA
   
📊 Minting Statistics:
   Total Minted: 0
   Max Supply: 10000
   Mint Price: 0.001 POL
   Minting Active: ✅ Yes
```

### Step 10: Test Frontend Locally (3 min)

```bash
cd frontend
npm run dev
```

Visit: http://localhost:3000

**Test checklist:**
- [ ] Page loads without errors
- [ ] Can connect MetaMask wallet
- [ ] Shows correct mint price (0.001 POL)
- [ ] Shows correct supply (0/10000)
- [ ] Minting button is active

### Step 11: Test Minting (2 min)

1. Make sure MetaMask is on Polygon Amoy
2. Click "Mint Now"
3. Confirm transaction in MetaMask
4. Wait ~5 seconds
5. Should see success message

**Check on Polygonscan:**
```
https://amoy.polygonscan.com/address/YOUR_CONTRACT_ADDRESS
```

You should see 1 transaction!

---

## 🌐 DEPLOY TO PRODUCTION

### Option A: Deploy Frontend to Vercel (15 min)

**Via Dashboard (Recommended):**

1. Visit: https://vercel.com/
2. Sign up with GitHub
3. Click "New Project"
4. Import `AlexD-Great/Chara` repository
5. **IMPORTANT:** Set Root Directory to `frontend`
6. Add Environment Variables:
   ```
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_id
   NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourAddress
   NEXT_PUBLIC_CHAIN_ID=80002
   NEXT_PUBLIC_RPC_URL=https://rpc-amoy.polygon.technology/
   ```
7. Click "Deploy"
8. Wait 2-3 minutes
9. Get your live URL: `https://chara-xyz.vercel.app`

**Via CLI:**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd frontend
vercel --prod
```

### Option B: Deploy Backend to Railway (15 min)

1. Visit: https://railway.app/
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `AlexD-Great/Chara`
5. Set Root Directory: `backend`
6. Add all environment variables from `.env`
7. Deploy
8. Get backend URL

---

## ✅ SUCCESS CHECKLIST

### Minimum Viable Demo (Required for Hackathon)

- [ ] Smart contract deployed to Polygon Amoy
- [ ] Contract verified on Polygonscan
- [ ] Minting is enabled
- [ ] Can mint NFT from local frontend
- [ ] Transaction shows on Polygonscan

### Full Demo (Impressive)

- [ ] All of above
- [ ] Frontend deployed to Vercel (live link)
- [ ] Backend deployed to Railway
- [ ] Pinata configured for IPFS
- [ ] AI generation working
- [ ] Can see NFT on OpenSea testnet

---

## 🐛 TROUBLESHOOTING

### "Insufficient funds for gas"
**Solution:** Get more POL from faucet (need ~0.1 POL)

### "Network not found"
**Solution:** Check `.env` has correct RPC URL

### "Invalid private key"
**Solution:** 
- Remove `0x` prefix if present
- Make sure it's 64 characters
- No spaces or quotes

### "Contract verification failed"
**Solution:**
- Wait 1-2 minutes after deployment
- Run `npm run verify` again
- Check Polygonscan API key is correct

### "Cannot connect wallet"
**Solution:**
- Check WalletConnect Project ID is set
- Clear browser cache
- Try different browser

### "Wrong network" in MetaMask
**Solution:**
1. Open MetaMask
2. Click network dropdown
3. Select "Polygon Amoy Testnet"
4. If not there, add manually:
   - Network Name: Polygon Amoy
   - RPC URL: https://rpc-amoy.polygon.technology/
   - Chain ID: 80002
   - Currency: POL

### Frontend shows "Contract not found"
**Solution:**
- Verify `NEXT_PUBLIC_CONTRACT_ADDRESS` is set in `frontend/.env.local`
- Restart dev server: `npm run dev`

---

## 📊 DEPLOYMENT TIMELINE

**Fastest Path (30 min):**
- Get API keys: 10 min
- Configure .env: 5 min
- Deploy contract: 5 min
- Enable minting: 2 min
- Test locally: 8 min

**Full Deployment (1 hour):**
- Everything above: 30 min
- Deploy frontend to Vercel: 15 min
- Deploy backend to Railway: 15 min

**Complete with Testing (2 hours):**
- Full deployment: 1 hour
- End-to-end testing: 30 min
- Demo video creation: 30 min

---

## 🎯 NEXT STEPS AFTER DEPLOYMENT

1. **Test Everything:**
   - Mint multiple NFTs
   - Check OpenSea: `https://testnets.opensea.io/assets/polygon-amoy/YOUR_CONTRACT/0`
   - Try evolution (if backend deployed)

2. **Create Demo:**
   - Record screen showing minting
   - Show contract on Polygonscan
   - Show NFT on OpenSea

3. **Documentation:**
   - Update README with live links
   - Add screenshots
   - Document contract addresses

4. **Hackathon Submission:**
   - Submit live frontend URL
   - Submit contract address
   - Submit demo video
   - Submit GitHub repo

---

## 🔗 IMPORTANT LINKS

**Your Deployed Contract:**
```
https://amoy.polygonscan.com/address/YOUR_CONTRACT_ADDRESS
```

**Your Frontend (after Vercel):**
```
https://your-project.vercel.app
```

**OpenSea Testnet:**
```
https://testnets.opensea.io/assets/polygon-amoy/YOUR_CONTRACT/0
```

**GitHub Repository:**
```
https://github.com/AlexD-Great/Chara
```

---

## 💪 YOU'VE GOT THIS!

Follow these steps in order. Don't skip steps. Test as you go.

**Current Status:** ✅ Code ready, dependencies installing

**Next Action:** Get API keys while dependencies install!

---

**Need help?** Check `DEPLOYMENT_CHECKLIST.md` for detailed troubleshooting.
