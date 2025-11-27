# Chara - Deployment Checklist

## 🎯 Hackathon Deployment Strategy

**Goal**: Get a working demo as fast as possible for judges

**Timeline**: ~2-3 hours total

---

## ✅ Phase 1: Smart Contract Deployment (30 min) - **DO THIS FIRST**

### Step 1.1: Get Required API Keys (10 min)

- [ ] **Polygon Amoy RPC** (Free)
  - Option A: Use public RPC: `https://rpc-amoy.polygon.technology/`
  - Option B: Get from Alchemy: https://www.alchemy.com/
  - Option C: Get from Infura: https://www.infura.io/

- [ ] **Polygonscan API Key** (Free)
  - Visit: https://polygonscan.com/apis
  - Sign up and get API key
  - Needed for contract verification

- [ ] **Get Testnet POL** (Free)
  - Visit: https://www.alchemy.com/faucets/polygon-amoy
  - Enter your wallet address
  - Request 0.5 POL (enough for deployment + testing)

### Step 1.2: Configure Environment (5 min)

```bash
# Edit .env file
PRIVATE_KEY_DEPLOYER=your_metamask_private_key_here
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology/
POLYGONSCAN_API_KEY=your_polygonscan_api_key_here
```

**How to get private key:**
1. Open MetaMask
2. Click 3 dots → Account Details → Export Private Key
3. Enter password
4. Copy key (NEVER share this!)

### Step 1.3: Install Dependencies (5 min)

```bash
# Already done for root ✅
# Install frontend
cd frontend && npm install && cd ..

# Install backend
cd backend && npm install && cd ..
```

### Step 1.4: Deploy Contract (10 min)

```bash
# Compile
npm run compile

# Run tests (optional but recommended)
npm run test

# Deploy to Polygon Amoy
npm run deploy:testnet
```

**Expected Output:**
```
🚀 Deploying CharaNFT to polygon_amoy...
✅ CharaNFT deployed to: 0xYourContractAddress
```

**SAVE THIS ADDRESS!** You'll need it everywhere.

### Step 1.5: Verify Contract (5 min)

```bash
# Verify on Polygonscan
npx hardhat verify --network polygon_amoy YOUR_CONTRACT_ADDRESS "Chara NFT" "CHARA" "ipfs://QmBase/"
```

### Step 1.6: Enable Minting (2 min)

```bash
# Update .env with contract address
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress

# Enable minting
npx hardhat run scripts/toggleMinting.js --network polygon_amoy
```

### Step 1.7: Test Contract (3 min)

```bash
# Check status
npx hardhat run scripts/checkStatus.js --network polygon_amoy
```

**Expected Output:**
```
✅ Minting Active: Yes
📊 Total Minted: 0
💰 Mint Price: 0.001 POL
```

---

## ✅ Phase 2: Frontend Deployment (45 min) - **GET LIVE LINK**

### Step 2.1: Get WalletConnect Project ID (5 min)

- [ ] Visit: https://cloud.walletconnect.com/
- [ ] Sign up (free)
- [ ] Create new project
- [ ] Copy Project ID

### Step 2.2: Configure Frontend Environment (5 min)

```bash
# Create frontend/.env.local
cd frontend
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
NEXT_PUBLIC_CHAIN_ID=80002
NEXT_PUBLIC_RPC_URL=https://rpc-amoy.polygon.technology/
```

### Step 2.3: Test Frontend Locally (5 min)

```bash
# From frontend directory
npm run dev
```

Visit: http://localhost:3000

**Test:**
- [ ] Page loads
- [ ] Can connect wallet
- [ ] Can see mint price and supply
- [ ] Can mint NFT (try it!)

### Step 2.4: Deploy to Vercel (15 min)

**Option A: Via Vercel Dashboard (Recommended)**

1. Visit: https://vercel.com/
2. Sign up with GitHub
3. Click "New Project"
4. Import `AlexD-Great/Chara` repository
5. Set Root Directory: `frontend`
6. Add Environment Variables:
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`
   - `NEXT_PUBLIC_CHAIN_ID=80002`
   - `NEXT_PUBLIC_RPC_URL=https://rpc-amoy.polygon.technology/`
7. Click "Deploy"

**Option B: Via CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd frontend
vercel --prod
```

### Step 2.5: Get Live Link (1 min)

After deployment completes:
- Vercel will give you a URL: `https://chara-xyz.vercel.app`
- **SAVE THIS LINK** for hackathon submission!

### Step 2.6: Test Live Site (5 min)

- [ ] Visit your live URL
- [ ] Connect MetaMask (switch to Polygon Amoy)
- [ ] Mint an NFT
- [ ] Check transaction on Polygonscan

---

## ✅ Phase 3: Backend Deployment (45 min) - **EVOLUTION SYSTEM**

### Step 3.1: Get IPFS API Keys (10 min)

- [ ] Visit: https://pinata.cloud/
- [ ] Sign up (free tier is enough)
- [ ] Go to API Keys
- [ ] Create new key with pinning permissions
- [ ] Save: API Key, API Secret, JWT

### Step 3.2: Get AI API Key (10 min)

**Option A: Hugging Face (Recommended - Free)**
- [ ] Visit: https://huggingface.co/settings/tokens
- [ ] Create new token
- [ ] Copy token

**Option B: Stability AI (Paid)**
- [ ] Visit: https://platform.stability.ai/
- [ ] Get API key

### Step 3.3: Configure Backend Environment (5 min)

Edit root `.env`:
```env
# Add these to existing .env
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret
PINATA_JWT=your_pinata_jwt
HUGGINGFACE_API_KEY=your_hf_token
```

### Step 3.4: Test Backend Locally (5 min)

```bash
cd backend
npm run dev
```

**Check:**
- [ ] Server starts on port 3001
- [ ] Visit: http://localhost:3001/health
- [ ] Should see: `{"status":"ok"}`
- [ ] Check logs for "Event listener started"

### Step 3.5: Deploy Backend (15 min)

**Option A: Railway (Recommended)**

1. Visit: https://railway.app/
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `AlexD-Great/Chara`
5. Set Root Directory: `backend`
6. Add all environment variables from `.env`
7. Deploy

**Option B: Heroku**

```bash
# Install Heroku CLI
# From backend directory
heroku create chara-backend
git subtree push --prefix backend heroku main
```

**Option C: Run on VPS**

```bash
# SSH to your server
git clone https://github.com/AlexD-Great/Chara.git
cd Chara/backend
npm install
npm install -g pm2
pm2 start src/index.js --name chara-backend
```

### Step 3.6: Test Backend (5 min)

- [ ] Visit: `https://your-backend-url.com/health`
- [ ] Check logs for event listening
- [ ] Mint an NFT from frontend
- [ ] Check backend logs for "NFT Minted" event

---

## ✅ Phase 4: Testing & Polish (30 min)

### Step 4.1: End-to-End Test (15 min)

1. **Mint NFT**
   - [ ] Visit live frontend
   - [ ] Connect wallet
   - [ ] Mint NFT
   - [ ] Check transaction on Polygonscan

2. **Check NFT**
   - [ ] View on OpenSea testnet: `https://testnets.opensea.io/assets/polygon-amoy/YOUR_CONTRACT/0`
   - [ ] Verify metadata loads
   - [ ] Check image displays

3. **Test Evolution** (if backend deployed)
   - [ ] Make a swap on QuickSwap testnet
   - [ ] Wait for backend to detect activity
   - [ ] Check if NFT evolves

4. **Test Soulbound**
   - [ ] Try to transfer NFT
   - [ ] Should fail with "Transfer not allowed"

### Step 4.2: Create Demo Video (10 min)

Record screen showing:
1. Live website
2. Wallet connection
3. Minting process
4. Transaction confirmation
5. NFT on OpenSea
6. Contract on Polygonscan

### Step 4.3: Prepare Submission (5 min)

- [ ] Update README with live links
- [ ] Add demo video link
- [ ] Screenshot of working dApp
- [ ] List of deployed addresses

---

## 🎯 Minimum Viable Demo (If Time is Short)

**Priority Order:**

1. ✅ **Smart Contract Deployed** - MUST HAVE
2. ✅ **Contract Verified on Polygonscan** - MUST HAVE
3. ✅ **Frontend Live Link** - MUST HAVE
4. ✅ **Can Mint NFT** - MUST HAVE
5. ⚠️ Backend Deployed - NICE TO HAVE
6. ⚠️ Evolution Working - NICE TO HAVE
7. ⚠️ AI Generation - NICE TO HAVE

**If you only have 1 hour:**
- Deploy contract (30 min)
- Deploy frontend to Vercel (30 min)
- Done! You have a working demo.

---

## 🐛 Troubleshooting

### "Insufficient funds for gas"
- Get more POL from faucet
- Need ~0.1 POL for deployment

### "Invalid API Key"
- Double-check .env file
- No quotes around values
- No spaces

### "Network not found"
- Check hardhat.config.js
- Verify RPC URL is correct
- Try public RPC: `https://rpc-amoy.polygon.technology/`

### "Contract verification failed"
- Wait 1-2 minutes after deployment
- Try again
- Check constructor arguments match

### Frontend shows wrong network
- Switch MetaMask to Polygon Amoy
- Chain ID: 80002

---

## 📊 Current Status

- [x] Smart contracts written
- [x] Frontend built
- [x] Backend built
- [x] Tests written
- [x] Documentation complete
- [x] Code on GitHub
- [ ] **Contract deployed** ← YOU ARE HERE
- [ ] Frontend live
- [ ] Backend live
- [ ] Full demo ready

---

## 🏆 Success Criteria

**Minimum (Hackathon Submission):**
- ✅ Contract deployed and verified
- ✅ Live frontend URL
- ✅ Can mint NFTs
- ✅ GitHub repository

**Ideal (Winning Submission):**
- ✅ All of above
- ✅ Backend deployed and monitoring
- ✅ NFTs evolving based on activity
- ✅ AI-generated artwork
- ✅ Demo video
- ✅ OpenSea integration

---

**Next Command to Run:**

```bash
# Install frontend dependencies
cd frontend && npm install
```

Then proceed with Phase 1: Smart Contract Deployment!
