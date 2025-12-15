// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Example Yield Farm Integration
 * @notice Shows how a yield farm can integrate Chara reputation for bonus rewards
 */

interface ICharaNFT {
    function verifyReputation(address wallet) external view returns (uint256 level, uint256 score);
    function getReputationMultiplier(address wallet) external view returns (uint256);
}

contract ExampleYieldFarm {
    ICharaNFT public charaContract;
    
    uint256 public baseAPY = 1000; // 10% base APY in basis points
    
    constructor(address _charaContract) {
        charaContract = ICharaNFT(_charaContract);
    }
    
    /**
     * @notice Get APY for a user based on reputation
     * @param user User address
     * @return APY in basis points
     */
    function getUserAPY(address user) public view returns (uint256) {
        uint256 multiplier = charaContract.getReputationMultiplier(user);
        
        // multiplier: 100 = 1x, 200 = 2x
        // Apply multiplier to base APY
        uint256 adjustedAPY = (baseAPY * multiplier) / 100;
        
        return adjustedAPY;
    }
    
    /**
     * @notice Calculate rewards for a user
     * @param user User address
     * @param stakedAmount Amount staked
     * @param stakingDuration Duration in seconds
     * @return Reward amount
     */
    function calculateRewards(
        address user,
        uint256 stakedAmount,
        uint256 stakingDuration
    ) external view returns (uint256) {
        uint256 apy = getUserAPY(user);
        
        // Calculate rewards: (amount * APY * duration) / (365 days * 10000)
        uint256 rewards = (stakedAmount * apy * stakingDuration) / (365 days * 10000);
        
        return rewards;
    }
    
    /**
     * @notice Get bonus percentage for display
     * @param user User address
     * @return Bonus percentage (e.g., 100 = 100% bonus)
     */
    function getBonusPercentage(address user) external view returns (uint256) {
        uint256 multiplier = charaContract.getReputationMultiplier(user);
        
        // Convert multiplier to bonus percentage
        // 100 = 0% bonus, 200 = 100% bonus
        return multiplier > 100 ? multiplier - 100 : 0;
    }
    
    /**
     * @notice Get user's farming details
     * @param user User address
     * @return level Reputation level
     * @return apy User's APY
     * @return bonusPercentage Bonus percentage
     */
    function getUserFarmingDetails(address user) 
        external 
        view 
        returns (
            uint256 level,
            uint256 apy,
            uint256 bonusPercentage
        ) 
    {
        (level, ) = charaContract.verifyReputation(user);
        apy = getUserAPY(user);
        uint256 multiplier = charaContract.getReputationMultiplier(user);
        bonusPercentage = multiplier > 100 ? multiplier - 100 : 0;
        
        return (level, apy, bonusPercentage);
    }
}
