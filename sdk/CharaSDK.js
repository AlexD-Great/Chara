/**
 * Chara SDK - Reputation Verification for DeFi Protocols
 * 
 * Simple integration library for protocols to verify user reputation
 * and implement tiered benefits based on Chara NFT scores.
 */

const { ethers } = require('ethers');

class CharaSDK {
  /**
   * Initialize Chara SDK
   * @param {string} charaContractAddress - Address of CharaNFT contract
   * @param {object} provider - Ethers provider
   * @param {array} abi - CharaNFT contract ABI
   */
  constructor(charaContractAddress, provider, abi) {
    this.contractAddress = charaContractAddress;
    this.provider = provider;
    this.contract = new ethers.Contract(charaContractAddress, abi, provider);
  }

  /**
   * Get reputation score for a wallet
   * @param {string} walletAddress - User's wallet address
   * @returns {Promise<object>} Reputation score details
   */
  async getReputationScore(walletAddress) {
    try {
      const score = await this.contract.getReputationScore(walletAddress);
      return {
        transactionVolume: score.transactionVolume.toString(),
        loanHistory: score.loanHistory.toString(),
        liquidityProvision: score.liquidityProvision.toString(),
        protocolDiversity: score.protocolDiversity.toString(),
        governanceScore: score.governanceScore.toString(),
        accountAge: score.accountAge.toString(),
        totalScore: score.totalScore.toString(),
        reputationLevel: score.reputationLevel.toString(),
        lastUpdated: score.lastUpdated.toString()
      };
    } catch (error) {
      console.error('Error fetching reputation score:', error);
      throw error;
    }
  }

  /**
   * Verify reputation level (requires protocol integration)
   * @param {string} walletAddress - User's wallet address
   * @param {object} signer - Ethers signer (must be integrated protocol)
   * @returns {Promise<object>} Level and score
   */
  async verifyReputation(walletAddress, signer) {
    try {
      const contractWithSigner = this.contract.connect(signer);
      const [level, score] = await contractWithSigner.verifyReputation(walletAddress);
      return {
        level: level.toString(),
        score: score.toString()
      };
    } catch (error) {
      console.error('Error verifying reputation:', error);
      throw error;
    }
  }

  /**
   * Get reputation multiplier for rewards
   * @param {string} walletAddress - User's wallet address
   * @returns {Promise<number>} Multiplier (100 = 1x, 200 = 2x)
   */
  async getReputationMultiplier(walletAddress) {
    try {
      const multiplier = await this.contract.getReputationMultiplier(walletAddress);
      return parseInt(multiplier.toString());
    } catch (error) {
      console.error('Error fetching multiplier:', error);
      throw error;
    }
  }

  /**
   * Check if user qualifies for undercollateralized loans
   * @param {string} walletAddress - User's wallet address
   * @returns {Promise<boolean>} True if qualified (level >= 7)
   */
  async qualifiesForUndercollateralizedLoan(walletAddress) {
    try {
      const qualified = await this.contract.qualifiesForUndercollateralizedLoan(walletAddress);
      return qualified;
    } catch (error) {
      console.error('Error checking loan qualification:', error);
      throw error;
    }
  }

  /**
   * Get interest rate discount based on reputation
   * @param {string} walletAddress - User's wallet address
   * @returns {Promise<number>} Discount in basis points
   */
  async getInterestRateDiscount(walletAddress) {
    try {
      const discount = await this.contract.getInterestRateDiscount(walletAddress);
      return parseInt(discount.toString());
    } catch (error) {
      console.error('Error fetching interest rate discount:', error);
      throw error;
    }
  }

  /**
   * Calculate adjusted interest rate with reputation discount
   * @param {number} baseRate - Base interest rate in basis points
   * @param {string} walletAddress - User's wallet address
   * @returns {Promise<number>} Adjusted rate in basis points
   */
  async calculateAdjustedInterestRate(baseRate, walletAddress) {
    try {
      const discount = await this.getInterestRateDiscount(walletAddress);
      return Math.max(0, baseRate - discount);
    } catch (error) {
      console.error('Error calculating adjusted rate:', error);
      throw error;
    }
  }

  /**
   * Calculate reward with reputation multiplier
   * @param {string} baseReward - Base reward amount (as string to handle big numbers)
   * @param {string} walletAddress - User's wallet address
   * @returns {Promise<string>} Adjusted reward amount
   */
  async calculateAdjustedReward(baseReward, walletAddress) {
    try {
      const multiplier = await this.getReputationMultiplier(walletAddress);
      const baseRewardBigInt = typeof baseReward === 'bigint' ? baseReward : BigInt(baseReward.toString());
      const adjustedReward = (baseRewardBigInt * BigInt(multiplier)) / 100n;
      return adjustedReward.toString();
    } catch (error) {
      console.error('Error calculating adjusted reward:', error);
      throw error;
    }
  }

  /**
   * Get reputation level name
   * @param {number} level - Reputation level (0-10)
   * @returns {string} Level name
   */
  getReputationLevelName(level) {
    const levels = {
      0: 'Newcomer',
      1: 'Explorer',
      2: 'Participant',
      3: 'Contributor',
      4: 'Active User',
      5: 'Engaged Member',
      6: 'Trusted User',
      7: 'Veteran',
      8: 'Expert',
      9: 'Master',
      10: 'Legend'
    };
    return levels[level] || 'Unknown';
  }

  /**
   * Get benefits description for reputation level
   * @param {number} level - Reputation level (0-10)
   * @returns {object} Benefits details
   */
  getBenefitsForLevel(level) {
    return {
      level,
      name: this.getReputationLevelName(level),
      rewardMultiplier: `${1 + (level * 0.1)}x`,
      interestDiscount: `${level * 0.5}%`,
      undercollateralizedLoans: level >= 7,
      priorityAccess: level >= 5,
      governanceWeight: level >= 3
    };
  }
}

module.exports = CharaSDK;
