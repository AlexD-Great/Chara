# 🔑 API Keys & Configuration Guide

## ⚡ CRITICAL - Get These Keys NOW

### 1. **Polygon Amoy Testnet POL** 🪙

**Why:** Deploy smart contract and test minting  
**Cost:** FREE  
**Time:** 2 minutes

**Steps:**
1. Visit: https://www.alchemy.com/faucets/polygon-amoy
2. Create free Alchemy account (or login)
3. Enter your MetaMask wallet address
4. Click "Send Me POL"
5. Wait 30 seconds

**How to verify:**
- Open MetaMask
- Switch network to "Polygon Amoy Testnet"
- Should see 0.5 POL balance

**If network not in MetaMask:**
1. Click "Add Network" manually
2. Network Name: `Polygon Amoy Testnet`
3. RPC URL: `https://rpc-amoy.polygon.technology/`
4. Chain ID: `80002`
5. Currency Symbol: `POL`
6. Block Explorer: `https://amoy.polygonscan.com/`

---

### 2. **WalletConnect Project ID** 🔗

**Why:** Enable wallet connection in frontend  
**Cost:** FREE  
**Time:** 3 minutes

**Steps:**
1. Visit: https://cloud.walletconnect.com/
2. Sign up (use GitHub for quick signup)
3. Click "Create New Project"
4. Project Name: `Chara NFT`
5. Copy the **Project ID**

**Example Project ID:**
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

**Where to use:**
- `.env` → `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=`
- `frontend/.env.local` → `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=`

---

### 3. **Polygonscan API Key** 🔍

**Why:** Verify smart contract on Polygonscan  
**Cost:** FREE  
**Time:** 3 minutes

**Steps:**
1. Visit: https://polygonscan.com/apis
2. Sign up (email + password)
3. Verify email
4. Go to "API Keys" section
5. Click "Add" to create new key
6. Name it: `Chara Deployment`
7. Copy the API key

**Example API Key:**
```
ABC123DEF456GHI789JKL012MNO345PQ
```

**Where to use:**
- `.env` → `POLYGONSCAN_API_KEY=`

---

### 4. **MetaMask Private Key** 🔐

**Why:** Deploy smart contract from your wallet  
**Cost:** FREE (but need POL for gas)  
**Time:** 1 minute

**⚠️ CRITICAL SECURITY WARNING:**
- NEVER share this key
- NEVER commit to GitHub
- Use a TEST wallet, not your main wallet
- Only use for testnet deployment

**Steps:**
1. Open MetaMask
2. Click 3 dots (⋮) next to your account
3. Click "Account Details"
4. Click "Export Private Key"
5. Enter MetaMask password
6. Copy the private key (64 characters)

**Example Private Key:**
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

**Where to use:**
- `.env` → `PRIVATE_KEY_DEPLOYER=` (NO 0x prefix!)

---

## 🎨 OPTIONAL - For Full Features

### 5. **Pinata API Keys** 📌

**Why:** Upload NFT metadata and images to IPFS  
**Cost:** FREE (1GB storage, 100k requests/month)  
**Time:** 5 minutes

**Steps:**
1. Visit: https://pinata.cloud/
2. Sign up (email or GitHub)
3. Go to "API Keys" in sidebar
4. Click "New Key"
5. Enable "Pinning" permissions
6. Name it: `Chara Backend`
7. Create key
8. **SAVE ALL THREE VALUES:**
   - API Key
   - API Secret
   - JWT Token

**Example:**
```
API Key: a1b2c3d4e5f6g7h8i9j0
API Secret: x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z9a0
JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Where to use:**
- `.env` → `PINATA_API_KEY=`
- `.env` → `PINATA_SECRET_KEY=`
- `.env` → `PINATA_JWT=`

---

### 6. **Hugging Face API Key** 🤗

**Why:** Generate AI artwork for NFT evolutions  
**Cost:** FREE  
**Time:** 3 minutes

**Steps:**
1. Visit: https://huggingface.co/settings/tokens
2. Sign up (email or GitHub)
3. Click "New token"
4. Name: `Chara AI Generation`
5. Type: `Read`
6. Create token
7. Copy the token

**Example Token:**
```
hf_AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
```

**Where to use:**
- `.env` → `HUGGINGFACE_API_KEY=`

---

### 7. **Stability AI API Key** (Alternative to Hugging Face) 🎨

**Why:** Alternative AI image generation (higher quality)  
**Cost:** PAID ($10 for 1000 images)  
**Time:** 5 minutes

**Steps:**
1. Visit: https://platform.stability.ai/
2. Sign up
3. Add payment method
4. Go to API Keys
5. Create new key
6. Copy key

**Where to use:**
- `.env` → `STABILITY_API_KEY=`

---

## 📝 Configuration Checklist

### Minimum (Deploy Contract + Frontend)

- [ ] Polygon Amoy POL (0.5 POL)
- [ ] MetaMask Private Key
- [ ] Polygonscan API Key
- [ ] WalletConnect Project ID

**With these 4, you can:**
✅ Deploy smart contract  
✅ Verify on Polygonscan  
✅ Deploy frontend  
✅ Mint NFTs  

### Full Features (Evolution + AI)

- [ ] All of above
- [ ] Pinata API Keys (3 values)
- [ ] Hugging Face API Key OR Stability AI Key

**With all keys, you can:**
✅ Everything above  
✅ Upload metadata to IPFS  
✅ Generate AI artwork  
✅ Trigger NFT evolution  

---

## 🔧 Configuration Files

### Root `.env` File

```env
# ============ BLOCKCHAIN CONFIG ============
PRIVATE_KEY_DEPLOYER=your_64_char_private_key_no_0x_prefix
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology/
POLYGONSCAN_API_KEY=your_polygonscan_api_key

# ============ FRONTEND CONFIG ============
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_CHAIN_ID=80002

# ============ IPFS CONFIG (Optional) ============
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
PINATA_JWT=your_pinata_jwt

# ============ AI CONFIG (Optional) ============
HUGGINGFACE_API_KEY=your_huggingface_token
STABILITY_API_KEY=your_stability_key
```

### Frontend `.env.local` File

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_CHAIN_ID=80002
NEXT_PUBLIC_RPC_URL=https://rpc-amoy.polygon.technology/
```

---

## ✅ Verification Steps

### 1. Check POL Balance

```bash
# Open MetaMask
# Switch to Polygon Amoy
# Should see: 0.5 POL
```

### 2. Test Private Key

```bash
# Run pre-flight check
node scripts/preflightCheck.js

# Should show: ✅ PRIVATE_KEY_DEPLOYER
```

### 3. Test WalletConnect

```bash
# Start frontend
cd frontend && npm run dev

# Visit http://localhost:3000
# Click "Connect Wallet"
# Should open WalletConnect modal
```

### 4. Test Polygonscan API

```bash
# After deployment, verify contract
npm run verify

# Should show: ✅ Contract verified successfully
```

---

## 🐛 Common Issues

### "Insufficient funds for gas"

**Problem:** Not enough POL in wallet  
**Solution:** Get more from faucet (need ~0.1 POL for deployment)

### "Invalid private key"

**Problem:** Private key format wrong  
**Solutions:**
- Remove `0x` prefix if present
- Should be exactly 64 characters
- No spaces or quotes
- Use a test wallet, not main wallet

### "WalletConnect Project ID invalid"

**Problem:** Wrong format or not set  
**Solutions:**
- Check it's set in both `.env` and `frontend/.env.local`
- Should be ~32 characters
- No quotes or spaces

### "Polygonscan verification failed"

**Problem:** API key wrong or rate limited  
**Solutions:**
- Check API key is correct
- Wait 1-2 minutes after deployment
- Try verification again

### "Pinata upload failed"

**Problem:** API keys wrong or quota exceeded  
**Solutions:**
- Check all 3 Pinata values are set
- Verify keys are active in Pinata dashboard
- Check free tier limits (1GB)

---

## 🎯 Quick Start Commands

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Edit .env with your keys
# (Use notepad, VS Code, or any text editor)

# 3. Copy frontend environment
cd frontend && cp .env.example .env.local && cd ..

# 4. Edit frontend/.env.local with your keys

# 5. Run pre-flight check
node scripts/preflightCheck.js

# 6. If all green, deploy!
npm run compile
npm run deploy:testnet
```

---

## 📞 Support

**Having trouble getting keys?**

1. Check the official docs:
   - Polygon: https://docs.polygon.technology/
   - WalletConnect: https://docs.walletconnect.com/
   - Pinata: https://docs.pinata.cloud/

2. Common solutions in `DEPLOYMENT_CHECKLIST.md`

3. Pre-flight check: `node scripts/preflightCheck.js`

---

**Status:** Ready to configure  
**Next:** Get API keys and fill in `.env` file!
