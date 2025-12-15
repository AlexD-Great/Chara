// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Example DEX Integration
 * @notice Shows how a DEX can integrate Chara reputation for fee discounts
 */

interface ICharaNFT {
    function verifyReputation(address wallet) external view returns (uint256 level, uint256 score);
    function getReputationMultiplier(address wallet) external view returns (uint256);
}

contract ExampleDEX {
    ICharaNFT public charaContract;
    
    uint256 public baseTradingFee = 30; // 0.3% in basis points
    uint256 public maxDiscount = 15; // Maximum 0.15% discount (50% off)
    
    constructor(address _charaContract) {
        charaContract = ICharaNFT(_charaContract);
    }
    
    /**
     * @notice Get trading fee for a user based on reputation
     * @param trader Trader address
     * @return Fee in basis points
     */
    function getTradingFee(address trader) public view returns (uint256) {
        (uint256 level, ) = charaContract.verifyReputation(trader);
        
        // Calculate discount: 1.5 basis points per level (max 15 bp at level 10)
        uint256 discount = (level * 15) / 10;
        if (discount > maxDiscount) discount = maxDiscount;
        
        // Apply discount
        uint256 adjustedFee = baseTradingFee > discount ? baseTradingFee - discount : 10;
        
        return adjustedFee;
    }
    
    /**
     * @notice Calculate fee amount for a trade
     * @param trader Trader address
     * @param tradeAmount Trade amount
     * @return Fee amount
     */
    function calculateFee(address trader, uint256 tradeAmount) external view returns (uint256) {
        uint256 feeRate = getTradingFee(trader);
        return (tradeAmount * feeRate) / 10000;
    }
    
    /**
     * @notice Get fee discount percentage for display
     * @param trader Trader address
     * @return Discount percentage (e.g., 50 = 50% off)
     */
    function getFeeDiscountPercentage(address trader) external view returns (uint256) {
        uint256 userFee = getTradingFee(trader);
        uint256 discount = baseTradingFee > userFee ? baseTradingFee - userFee : 0;
        
        return (discount * 100) / baseTradingFee;
    }
}
