const hre = require("hardhat");

async function main() {
  // Get the deployed contract address
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  
  if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
    console.error("❌ Contract address not set in .env");
    console.log("   Please set NEXT_PUBLIC_CONTRACT_ADDRESS");
    process.exit(1);
  }
  
  console.log("Setting demo reputation scores...");
  console.log("Contract:", contractAddress);

  // Get contract instance
  const CharaNFT = await hre.ethers.getContractAt("CharaNFT", contractAddress);
  
  // Get signer (your wallet)
  const [signer] = await hre.ethers.getSigners();
  console.log("Setting reputation for:", signer.address);

  // Set a good reputation score (Level 7 - Veteran)
  // Components: transactionVolume, loanHistory, liquidityProvision, 
  //            protocolDiversity, governanceScore, accountAge
  // Each out of 100
  
  console.log("\nSetting Level 7 (Veteran) reputation...");
  const tx = await CharaNFT.updateReputationScore(
    signer.address,
    70,  // transactionVolume (70/100)
    80,  // loanHistory (80/100) - most important
    65,  // liquidityProvision (65/100)
    60,  // protocolDiversity (60/100)
    50,  // governanceScore (50/100)
    75   // accountAge (75/100)
  );
  
  await tx.wait();
  console.log("✅ Reputation set!");

  // Verify the score
  const score = await CharaNFT.getReputationScore(signer.address);
  console.log("\n📊 Reputation Details:");
  console.log("- Transaction Volume:", score.transactionVolume.toString());
  console.log("- Loan History:", score.loanHistory.toString());
  console.log("- Liquidity Provision:", score.liquidityProvision.toString());
  console.log("- Protocol Diversity:", score.protocolDiversity.toString());
  console.log("- Governance Score:", score.governanceScore.toString());
  console.log("- Account Age:", score.accountAge.toString());
  console.log("- Total Score:", score.totalScore.toString(), "/ 1000");
  console.log("- Reputation Level:", score.reputationLevel.toString(), "/ 10");

  // Check benefits
  const multiplier = await CharaNFT.getReputationMultiplier(signer.address);
  const discount = await CharaNFT.getInterestRateDiscount(signer.address);
  const qualifies = await CharaNFT.qualifiesForUndercollateralizedLoan(signer.address);

  console.log("\n🎁 Benefits:");
  console.log("- Reward Multiplier:", (Number(multiplier) / 100).toFixed(1) + "x");
  console.log("- Interest Discount:", (Number(discount) / 100).toFixed(2) + "%");
  console.log("- Undercollateralized Loans:", qualifies ? "✅ Qualified" : "❌ Not yet");

  console.log("\n✨ Demo reputation set successfully!");
  console.log("Visit your live link to see the reputation dashboard!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
