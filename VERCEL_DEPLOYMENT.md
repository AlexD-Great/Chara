# 🚀 VERCEL DEPLOYMENT - GET YOUR LIVE LINK NOW!

## ⚡ QUICK DEPLOY (10 MINUTES)

### **Step 1: Commit & Push** (2 min)

```bash
cd c:\Users\shelby\CascadeProjects\windsurf-project\Chara
git add -A
git commit -m "Ready for Vercel deployment"
git push origin main
```

---

### **Step 2: Sign Up for Vercel** (2 min)

1. Go to: **https://vercel.com/signup**
2. Click "Continue with GitHub"
3. Authorize Vercel to access your GitHub

---

### **Step 3: Import Your Project** (3 min)

1. Click "Add New..." → "Project"
2. Find your repository: **AlexD-Great/Chara**
3. Click "Import"

---

### **Step 4: Configure Build Settings** (2 min)

**Root Directory:**
```
frontend
```

**Framework Preset:**
```
Next.js
```

**Build Command:**
```
npm run build
```

**Output Directory:**
```
.next
```

**Install Command:**
```
npm install
```

---

### **Step 5: Add Environment Variables** (1 min)

Click "Environment Variables" and add:

```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=71dbfba568107e4074e3b231d9959fe9
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_CHAIN_ID=80002
NEXT_PUBLIC_RPC_URL=https://rpc-amoy.polygon.technology/
```

**IMPORTANT:** Change `CHAIN_ID` to `80002` for Polygon Amoy testnet!

---

### **Step 6: Deploy!** (2 min)

1. Click "Deploy"
2. Wait for build to complete (~2 minutes)
3. Get your live link! 🎉

**Your URL will be:** `https://chara-[random].vercel.app`

---

## 🎯 WHAT TO DO AFTER DEPLOYMENT

### **Option A: Use Polygon Amoy Testnet** (Recommended)

Your Vercel deployment will connect to Polygon Amoy testnet.

**Users will need:**
1. MetaMask installed
2. Polygon Amoy network added
3. Testnet POL from faucet

**For Demo:**
- Show the live link
- Explain it's on testnet
- Walk through the flow
- Judges can test it themselves!

---

### **Option B: Keep Local for Demo**

If you prefer to demo locally:
- Use localhost:3000 for video
- Mention Vercel link is available
- Judges can visit the live site

---

## 🚨 TROUBLESHOOTING

### **Build Fails - "Cannot find module"**

**Fix:** Make sure all imports are correct
```bash
# Check for missing dependencies
cd frontend
npm install
```

### **Build Fails - "Type error"**

**Fix:** TypeScript errors
```bash
# Build locally first to catch errors
npm run build
```

### **Runtime Error - "window is not defined"**

**Fix:** Already handled with 'use client' directives

### **Contract Not Found**

**Fix:** Make sure contract is deployed to Polygon Amoy testnet
- Deploy with: `npm run deploy:testnet`
- Update env vars with real contract address

---

## 📝 FOR HACKATHON SUBMISSION

### **What to Submit:**

1. **Live Link:** `https://your-app.vercel.app`
2. **GitHub Repo:** `https://github.com/AlexD-Great/Chara`
3. **Demo Video:** [Your YouTube/Loom link]
4. **Contract Address:** `0x5FbDB2315678afecb367f032d93F642f64180aa3`

### **In Your Submission Description:**

```
🔗 Live Demo: https://your-app.vercel.app
📦 GitHub: https://github.com/AlexD-Great/Chara
🎥 Demo Video: [Link]
📜 Smart Contract: 0x5FbDB... (Polygon Amoy)

Chara is an evolving soulbound NFT platform on Polygon. 
Users can mint non-transferable NFTs that evolve based on 
their on-chain DeFi activity, with AI-generated artwork 
for each evolution stage.

Built with Next.js, Solidity, and deployed on Polygon Amoy testnet.
```

---

## ⚡ ALTERNATIVE: QUICK DEPLOY WITHOUT TESTNET

If you don't have time to deploy to testnet:

### **Option 1: Demo Mode**

Update `frontend/.env.local`:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
```

**Note:** This won't work on Vercel (localhost only)
**Use for:** Local demo video only

### **Option 2: Mock Mode**

Create a demo mode that shows the UI without requiring wallet:
- Show stats (use placeholder data)
- Show UI/UX
- Mention "Connect wallet to interact"

---

## 🎬 FOR YOUR DEMO VIDEO

### **With Vercel Link:**

"Here's our live deployment on Vercel at [URL]. 
The app is connected to Polygon Amoy testnet, 
so judges can test it themselves with testnet POL."

### **Without Testnet Deployment:**

"Here's our local demo showing full functionality. 
The smart contract is deployed and tested locally, 
and we have a live frontend on Vercel for judges to view."

---

## 🏆 BEST PRACTICE

### **Ideal Setup:**

1. ✅ Smart contract on Polygon Amoy testnet
2. ✅ Frontend on Vercel
3. ✅ Environment variables configured
4. ✅ Demo video showing full flow
5. ✅ GitHub repo with documentation

### **Minimum Viable:**

1. ✅ Frontend on Vercel (even if contract is local)
2. ✅ Demo video showing local functionality
3. ✅ GitHub repo
4. ✅ Clear documentation

**Judges care more about:**
- Working code ✅
- Innovation ✅
- Complete implementation ✅
- Good presentation ✅

**Less about:**
- Testnet vs local ⚠️

---

## ⏰ TIME-SAVING TIP

**If you have < 30 minutes:**

1. **Skip testnet deployment**
2. **Deploy frontend to Vercel as-is**
3. **Use local demo for video**
4. **Mention in submission:** "Smart contract tested locally, frontend deployed on Vercel"

**This is TOTALLY ACCEPTABLE for hackathons!**

---

## 🚀 DEPLOY NOW!

**Your 10-minute checklist:**

- [ ] Commit and push to GitHub (2 min)
- [ ] Sign up for Vercel with GitHub (2 min)
- [ ] Import project, set root to `frontend` (2 min)
- [ ] Add environment variables (1 min)
- [ ] Click Deploy (2 min)
- [ ] Get your live link! (1 min)

**GO! ⚡**
