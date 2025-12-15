// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Example Lending Protocol Integration
 * @notice Shows how a lending protocol can integrate Chara reputation for tiered rates
 */

interface ICharaNFT {
    function verifyReputation(address wallet) external view returns (uint256 level, uint256 score);
    function getInterestRateDiscount(address wallet) external view returns (uint256);
    function qualifiesForUndercollateralizedLoan(address wallet) external view returns (bool);
}

contract ExampleLendingProtocol {
    ICharaNFT public charaContract;
    
    uint256 public baseInterestRate = 500; // 5% in basis points
    uint256 public minCollateralRatio = 15000; // 150% in basis points
    uint256 public undercollateralizedMinRatio = 11000; // 110% for high reputation users
    
    constructor(address _charaContract) {
        charaContract = ICharaNFT(_charaContract);
    }
    
    /**
     * @notice Get interest rate for a borrower based on reputation
     * @param borrower Borrower address
     * @return Interest rate in basis points
     */
    function getInterestRate(address borrower) public view returns (uint256) {
        uint256 discount = charaContract.getInterestRateDiscount(borrower);
        
        // Apply discount, ensure rate doesn't go below minimum (e.g., 2%)
        uint256 adjustedRate = baseInterestRate > discount ? baseInterestRate - discount : 200;
        
        return adjustedRate;
    }
    
    /**
     * @notice Get required collateral ratio for a borrower
     * @param borrower Borrower address
     * @return Collateral ratio in basis points
     */
    function getRequiredCollateralRatio(address borrower) public view returns (uint256) {
        bool qualifiesForLowerCollateral = charaContract.qualifiesForUndercollateralizedLoan(borrower);
        
        return qualifiesForLowerCollateral ? undercollateralizedMinRatio : minCollateralRatio;
    }
    
    /**
     * @notice Calculate loan terms for a borrower
     * @param borrower Borrower address
     * @param loanAmount Desired loan amount
     * @return interestRate Interest rate in basis points
     * @return requiredCollateral Required collateral amount
     * @return isUndercollateralized Whether loan is undercollateralized
     */
    function calculateLoanTerms(address borrower, uint256 loanAmount) 
        external 
        view 
        returns (
            uint256 interestRate,
            uint256 requiredCollateral,
            bool isUndercollateralized
        ) 
    {
        interestRate = getInterestRate(borrower);
        uint256 collateralRatio = getRequiredCollateralRatio(borrower);
        requiredCollateral = (loanAmount * collateralRatio) / 10000;
        isUndercollateralized = collateralRatio < minCollateralRatio;
        
        return (interestRate, requiredCollateral, isUndercollateralized);
    }
    
    /**
     * @notice Get borrower's reputation details
     * @param borrower Borrower address
     * @return level Reputation level
     * @return score Reputation score
     */
    function getBorrowerReputation(address borrower) external view returns (uint256 level, uint256 score) {
        return charaContract.verifyReputation(borrower);
    }
}
