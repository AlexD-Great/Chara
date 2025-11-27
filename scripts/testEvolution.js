const hre = require("hardhat");

async function main() {
  console.log("🧪 Testing NFT Evolution\n");

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  
  if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
    console.error("❌ Contract address not set in .env");
    process.exit(1);
  }

  const CharaNFT = await hre.ethers.getContractFactory("CharaNFT");
  const contract = await CharaNFT.attach(contractAddress);

  // Get token ID to test (default to 0)
  const tokenId = process.argv[2] || 0;
  
  console.log(`Testing evolution for Token ID: ${tokenId}\n`);

  // Check if token exists
  const exists = await contract.exists(tokenId);
  if (!exists) {
    console.error(`❌ Token ID ${tokenId} does not exist`);
    process.exit(1);
  }

  // Get current evolution data
  const evolutionData = await contract.getEvolutionData(tokenId);
  console.log("📊 Current State:");
  console.log(`   Level: ${evolutionData.level.toString()}`);
  console.log(`   Owner: ${evolutionData.owner}`);
  console.log(`   Last Evolution: ${new Date(Number(evolutionData.lastEvolution) * 1000).toISOString()}`);
  console.log("");

  // Evolve NFT
  const newLevel = Number(evolutionData.level) + 1;
  const newMetadataURI = `ipfs://QmTest${newLevel}/${tokenId}.json`;

  console.log(`🚀 Evolving to Level ${newLevel}...`);
  console.log(`   New Metadata URI: ${newMetadataURI}`);
  console.log("");

  const tx = await contract.evolveNFT(tokenId, newMetadataURI);
  console.log(`⏳ Transaction sent: ${tx.hash}`);
  
  const receipt = await tx.wait();
  console.log(`✅ Transaction confirmed in block: ${receipt.blockNumber}`);
  console.log("");

  // Get updated evolution data
  const updatedData = await contract.getEvolutionData(tokenId);
  console.log("📊 New State:");
  console.log(`   Level: ${updatedData.level.toString()}`);
  console.log(`   Last Evolution: ${new Date(Number(updatedData.lastEvolution) * 1000).toISOString()}`);
  console.log("");

  console.log("🎉 Evolution successful!");
  
  if (hre.network.name === "polygon_amoy") {
    console.log(`\n🔍 View transaction:`);
    console.log(`   https://amoy.polygonscan.com/tx/${tx.hash}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
