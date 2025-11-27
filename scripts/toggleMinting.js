const hre = require("hardhat");

async function main() {
  console.log("🔄 Toggling minting status...\n");

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  
  if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
    console.error("❌ Contract address not set in .env");
    console.log("   Please set NEXT_PUBLIC_CONTRACT_ADDRESS");
    process.exit(1);
  }

  const CharaNFT = await hre.ethers.getContractFactory("CharaNFT");
  const contract = await CharaNFT.attach(contractAddress);

  // Get current status
  const currentStatus = await contract.mintingActive();
  console.log(`Current minting status: ${currentStatus ? '✅ Active' : '❌ Inactive'}`);

  // Toggle
  console.log("\n⏳ Toggling...");
  const tx = await contract.toggleMinting();
  await tx.wait();

  // Get new status
  const newStatus = await contract.mintingActive();
  console.log(`\n✅ Minting is now: ${newStatus ? '✅ Active' : '❌ Inactive'}`);
  console.log(`Transaction: ${tx.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
