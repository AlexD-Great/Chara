# Chara - Your DeFi Reputation Score

> Soulbound NFTs that unlock better rates, rewards, and benefits across Polygon DeFi

🌐 **Live Demo**: [https://chara-one.vercel.app/](https://chara-one.vercel.app/)

## Overview

Chara is a reputation-based NFT platform that transforms your on-chain activity into verifiable credit scores and unlocks exclusive benefits across Polygon DeFi protocols. Each Chara NFT is soulbound (non-transferable), evolves with your engagement, and serves as your universal reputation passport for better lending rates, fee discounts, and priority access.

## ✨ Core Features

### 🏦 DeFi Credit Scoring
- **On-Chain Reputation Score**: Verifiable credit rating based on DeFi history
- **Risk Assessment**: Analyze transaction patterns, loan repayment, and LP behavior
- **Tiered Interest Rates**: Better rates on lending protocols for higher scores
- **Undercollateralized Lending**: Unlock lower collateral requirements with proven reputation
- **Real-Time Updates**: Score adjusts dynamically with your activity

### 🎁 Universal Rewards System
- **Cross-Protocol Benefits**: Use one NFT across all integrated Polygon protocols
- **Fee Discounts**: Reduced trading fees on DEXs based on reputation level
- **Yield Multipliers**: Bonus APY on farms and staking for high-reputation users
- **Priority Access**: Early access to new pools, IDOs, and governance proposals
- **Loyalty Rewards**: Accumulate points redeemable across the ecosystem

### 🔐 Soulbound Identity
- **Non-Transferable**: Permanently tied to your wallet address
- **Tamper-Proof**: Can't be bought, sold, or faked
- **Portable Reputation**: One score works across all integrated protocols
- **Privacy-Preserving**: On-chain verification without revealing personal data

### 📊 Dynamic Evolution
- **Visual Progression**: NFT artwork evolves with your reputation level
- **AI-Generated Art**: Unique visuals for each evolution stage
- **Activity Tracking**: Monitors swaps, LP positions, loans, and governance
- **Evolution History**: Complete record of your DeFi journey
- **Achievement Badges**: Unlock special traits for milestones

## 🏗️ Architecture

```
chara/
├── contracts/          # Smart contracts (Hardhat)
│   └── CharaNFT.sol   # Soulbound NFT with reputation system
├── frontend/          # Next.js minting dApp
│   ├── components/    # React components (Navbar, Hero, ReputationDashboard)
│   └── config/        # Contract ABI and configuration
├── backend/           # Activity monitoring & reputation updates
│   └── services/      # Event listener & activity analyzer
├── sdk/               # Protocol integration SDK
│   ├── CharaSDK.js    # JavaScript SDK for protocols
│   └── examples/      # Integration examples (Lending, DEX, Yield)
└── scripts/           # Deployment & utility scripts
```

### Production-Ready Activity Tracking

The backend monitors real DeFi activity on Polygon and automatically updates reputation scores:

- **Real-Time Monitoring**: Scans every block for DeFi transactions
- **Protocol Detection**: Identifies swaps, LP positions, loans, and governance votes
- **Automatic Updates**: Updates on-chain reputation scores every 60 seconds
- **Multi-Protocol Support**: Tracks QuickSwap, Aave, Uniswap V3, and more
- **REST API**: Provides activity data to frontend and external integrations

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MetaMask wallet
- Polygon Amoy testnet POL tokens

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Compile contracts
npm run compile

# Run tests
npm run test

# Deploy to testnet
npm run deploy:testnet
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to see the minting interface.

### Backend Activity Monitor

```bash
cd backend
npm install
npm run dev
```

The backend will:
- Monitor Polygon Amoy blockchain for DeFi activity
- Track swaps, LP positions, loans, and governance votes
- Automatically update reputation scores every 60 seconds
- Expose REST API at `http://localhost:3001`

**API Endpoints:**
- `GET /api/wallet/:address/activity` - Get wallet activity metrics
- `POST /api/wallet/:address/monitor` - Add wallet to monitoring
- `GET /api/monitored-wallets` - List all monitored wallets
- `POST /api/update-scores` - Trigger reputation score update

## 📝 Smart Contract

The core contract is an ERC-721A soulbound NFT with dynamic metadata:

- **Contract**: `CharaNFT.sol`
- **Standard**: ERC-721A (gas-optimized)
- **Features**: Soulbound, Dynamic Metadata, Evolution Tracking

## 🔧 Tech Stack

- **Blockchain**: Polygon PoS
- **Smart Contracts**: Solidity, Hardhat, ERC-721A
- **Frontend**: Next.js, React, TailwindCSS, Ethers.js
- **Backend**: Node.js, The Graph, Express
- **AI**: Stable Diffusion API / Hugging Face
- **Storage**: IPFS (Pinata)
- **Wallet**: WalletConnect, MetaMask

## � How It Works

### For Users
1. **Mint Your Chara**: Get your soulbound reputation NFT
2. **Engage in DeFi**: Trade, provide liquidity, take loans, participate in governance
3. **Build Reputation**: Your score increases with responsible DeFi activity
4. **Unlock Benefits**: Access better rates, discounts, and exclusive opportunities
5. **Evolve**: Watch your NFT transform as your reputation grows

### For Protocols
1. **Integrate Chara SDK**: Simple integration with our reputation verification system
2. **Define Benefits**: Set tiered rewards based on reputation levels
3. **Attract Quality Users**: Incentivize high-reputation users to your protocol
4. **Reduce Risk**: Make better lending decisions with verified on-chain history
5. **Build Loyalty**: Reward long-term engaged users automatically

## 📈 Reputation Scoring Algorithm

Your Chara score is calculated based on:

- **Transaction Volume** (20%): Total value of DeFi interactions
- **Loan History** (25%): Repayment record and borrowing patterns
- **Liquidity Provision** (20%): LP duration, size, and impermanent loss management
- **Protocol Diversity** (15%): Engagement across multiple protocols
- **Governance Participation** (10%): Voting and proposal activity
- **Account Age** (10%): Time since first on-chain activity

**Score Range**: 0-1000 points across 10 reputation levels

## � Roadmap

### Phase 1: Core Infrastructure ✅
- Soulbound NFT smart contract with ERC-721A
- Dynamic metadata and evolution system
- Basic activity tracking
- Frontend minting interface
- Comprehensive test suite

### Phase 2: Reputation System ✅
- Multi-factor reputation scoring algorithm
- Credit score calculation (0-1000 points)
- Reputation levels (0-10)
- Real-time score updates
- Reputation verification API for protocols
- Interest rate discount calculation
- Reward multiplier system
- Undercollateralized loan qualification

### Phase 3: Protocol Integrations ✅
- Chara SDK JavaScript library
- Smart contract integration interfaces
- Lending protocol example (tiered interest rates)
- DEX integration example (fee discounts)
- Yield farming example (bonus rewards)
- Comprehensive SDK documentation
- Protocol integration management

### Phase 4: Advanced Features ✅
- Achievement badge system (12 unlockable badges)
- Reputation analytics dashboard with charts
- Leaderboard system with categories
- Protocol integration showcase
- Activity feed with real-time updates

### Phase 5: Ecosystem Expansion
- Partnership with major Polygon protocols
- Community governance DAO
- Reputation marketplace (view-only)
- Mobile application
- Multi-chain deployment (zkEVM, other L2s)

## 💼 Use Cases

### For DeFi Users
- **Lower Borrowing Costs**: Get better interest rates with proven repayment history
- **Trading Discounts**: Pay less fees on DEXs as your reputation grows
- **Exclusive Access**: Early access to new pools, IDOs, and opportunities
- **Higher Yields**: Earn bonus APY on farms and staking protocols
- **Governance Power**: Increased voting weight in DAOs

### For Protocols
- **Risk Mitigation**: Offer undercollateralized loans to verified users
- **User Acquisition**: Attract high-quality, engaged users
- **Loyalty Programs**: Reward long-term users automatically
- **Competitive Advantage**: Differentiate with reputation-based benefits
- **Reduced Defaults**: Better assess borrower creditworthiness

### For the Ecosystem
- **Reputation Layer**: Universal identity system for Polygon DeFi
- **Network Effects**: More protocols = more value for all participants
- **Anti-Sybil**: Prevent fake accounts and bot manipulation
- **Merit-Based Access**: Reward genuine engagement over capital
- **Composability**: Reputation works across all integrated protocols

## 🔗 Links

- **Live Demo**: https://chara-one.vercel.app/
- **GitHub**: https://github.com/AlexD-Great/Chara
- **Contract**: [0x5239ad0C0872E9ECB3b8fcd0aB5418C7015C0978](https://amoy.polygonscan.com/address/0x5239ad0C0872E9ECB3b8fcd0aB5418C7015C0978)
- **Documentation**: Coming soon

## 📜 License

MIT License
