# Chara SDK - Protocol Integration Guide

Integrate Chara's reputation system into your DeFi protocol to offer tiered benefits based on verified on-chain activity.

## Quick Start

### Installation

```bash
npm install ethers
```

### Basic Usage

```javascript
const CharaSDK = require('./CharaSDK');
const { ethers } = require('ethers');

// Initialize
const provider = new ethers.JsonRpcProvider('YOUR_RPC_URL');
const charaAddress = '0x...'; // Chara NFT contract address
const charaABI = [...]; // Chara NFT ABI

const chara = new CharaSDK(charaAddress, provider, charaABI);

// Get user's reputation
const score = await chara.getReputationScore(userAddress);
console.log(`Reputation Level: ${score.reputationLevel}`);
console.log(`Total Score: ${score.totalScore}`);

// Calculate adjusted interest rate
const baseRate = 500; // 5%
const adjustedRate = await chara.calculateAdjustedInterestRate(baseRate, userAddress);
console.log(`Adjusted Rate: ${adjustedRate / 100}%`);
```

## Features

### Reputation Verification

```javascript
// Get full reputation score
const score = await chara.getReputationScore(userAddress);

// Verify reputation (requires protocol integration)
const { level, score } = await chara.verifyReputation(userAddress, signer);
```

### Lending Integration

```javascript
// Check if user qualifies for undercollateralized loans
const qualifies = await chara.qualifiesForUndercollateralizedLoan(userAddress);

// Get interest rate discount
const discount = await chara.getInterestRateDiscount(userAddress);

// Calculate adjusted rate
const adjustedRate = await chara.calculateAdjustedInterestRate(500, userAddress);
```

### Rewards Integration

```javascript
// Get reputation multiplier
const multiplier = await chara.getReputationMultiplier(userAddress);
// Returns: 100 = 1x, 150 = 1.5x, 200 = 2x

// Calculate adjusted reward
const baseReward = ethers.parseEther('100');
const adjustedReward = await chara.calculateAdjustedReward(baseReward, userAddress);
```

### Benefits Information

```javascript
// Get level name
const levelName = chara.getReputationLevelName(7); // "Veteran"

// Get benefits for level
const benefits = chara.getBenefitsForLevel(7);
console.log(benefits);
// {
//   level: 7,
//   name: 'Veteran',
//   rewardMultiplier: '1.7x',
//   interestDiscount: '3.5%',
//   undercollateralizedLoans: true,
//   priorityAccess: true,
//   governanceWeight: true
// }
```

## Smart Contract Integration

### Lending Protocol Example

```solidity
interface ICharaNFT {
    function verifyReputation(address wallet) external view returns (uint256 level, uint256 score);
    function getInterestRateDiscount(address wallet) external view returns (uint256);
    function qualifiesForUndercollateralizedLoan(address wallet) external view returns (bool);
}

contract MyLendingProtocol {
    ICharaNFT public chara;
    uint256 public baseRate = 500; // 5%
    
    function getInterestRate(address borrower) public view returns (uint256) {
        uint256 discount = chara.getInterestRateDiscount(borrower);
        return baseRate > discount ? baseRate - discount : 200; // Min 2%
    }
}
```

See `examples/` folder for complete integration examples:
- `LendingProtocolIntegration.sol` - Tiered interest rates
- `DEXIntegration.sol` - Fee discounts
- `YieldFarmIntegration.sol` - Bonus rewards

## Reputation Levels

| Level | Name | Score Range | Benefits |
|-------|------|-------------|----------|
| 0 | Newcomer | 0 | Base rates |
| 1 | Explorer | 1-99 | 1.1x rewards, 0.5% discount |
| 2 | Participant | 100-199 | 1.2x rewards, 1% discount |
| 3 | Contributor | 200-299 | 1.3x rewards, 1.5% discount |
| 4 | Active User | 300-399 | 1.4x rewards, 2% discount |
| 5 | Engaged Member | 400-499 | 1.5x rewards, 2.5% discount |
| 6 | Trusted User | 500-599 | 1.6x rewards, 3% discount |
| 7 | Veteran | 600-699 | 1.7x rewards, 3.5% discount, Undercollateralized loans |
| 8 | Expert | 700-799 | 1.8x rewards, 4% discount, Undercollateralized loans |
| 9 | Master | 800-899 | 1.9x rewards, 4.5% discount, Undercollateralized loans |
| 10 | Legend | 900-1000 | 2x rewards, 5% discount, Undercollateralized loans |

## Score Components

Reputation score is calculated from:

- **Transaction Volume** (20%): Total DeFi transaction value
- **Loan History** (25%): Repayment record and borrowing patterns
- **Liquidity Provision** (20%): LP duration, size, and management
- **Protocol Diversity** (15%): Engagement across multiple protocols
- **Governance Participation** (10%): Voting and proposal activity
- **Account Age** (10%): Time since first on-chain activity

## Integration Steps

### 1. Contact Chara Team

Request protocol integration by providing:
- Protocol name and description
- Contract address (if deployed)
- Planned benefits for reputation holders

### 2. Get Whitelisted

Your protocol address will be added to the integrated protocols list.

### 3. Implement Integration

Use the SDK or smart contract interface to verify reputation and apply benefits.

### 4. Test on Testnet

Test your integration on Polygon Amoy testnet before mainnet deployment.

### 5. Go Live

Deploy to mainnet and announce integration to attract high-reputation users.

## API Reference

### CharaSDK Methods

#### `getReputationScore(walletAddress)`
Returns full reputation score breakdown.

**Returns:**
```javascript
{
  transactionVolume: string,
  loanHistory: string,
  liquidityProvision: string,
  protocolDiversity: string,
  governanceScore: string,
  accountAge: string,
  totalScore: string,
  reputationLevel: string,
  lastUpdated: string
}
```

#### `verifyReputation(walletAddress, signer)`
Verify reputation (requires protocol integration).

**Returns:**
```javascript
{
  level: string,
  score: string
}
```

#### `getReputationMultiplier(walletAddress)`
Get reward multiplier (100 = 1x, 200 = 2x).

**Returns:** `number`

#### `qualifiesForUndercollateralizedLoan(walletAddress)`
Check if user qualifies for lower collateral (level >= 7).

**Returns:** `boolean`

#### `getInterestRateDiscount(walletAddress)`
Get interest rate discount in basis points.

**Returns:** `number`

#### `calculateAdjustedInterestRate(baseRate, walletAddress)`
Calculate interest rate with reputation discount.

**Returns:** `number`

#### `calculateAdjustedReward(baseReward, walletAddress)`
Calculate reward with reputation multiplier.

**Returns:** `string`

## Support

- **Documentation**: https://github.com/AlexD-Great/Chara
- **Integration Help**: Open an issue on GitHub
- **Contract Address**: Check README for latest deployment

## License

MIT
