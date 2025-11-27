const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting Chara NFT deployment...\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "POL\n");

  // Contract parameters
  const NAME = "Chara";
  const SYMBOL = "CHARA";
  const BASE_URI = "ipfs://QmPlaceholder/"; // Will be updated after IPFS setup

  console.log("📋 Contract Configuration:");
  console.log("   Name:", NAME);
  console.log("   Symbol:", SYMBOL);
  console.log("   Base URI:", BASE_URI);
  console.log("");

  // Deploy CharaNFT
  console.log("⏳ Deploying CharaNFT contract...");
  const CharaNFT = await hre.ethers.getContractFactory("CharaNFT");
  const charaNFT = await CharaNFT.deploy(NAME, SYMBOL, BASE_URI);
  
  await charaNFT.waitForDeployment();
  const contractAddress = await charaNFT.getAddress();
  
  console.log("✅ CharaNFT deployed to:", contractAddress);
  console.log("");

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber(),
    contractName: "CharaNFT",
    parameters: {
      name: NAME,
      symbol: SYMBOL,
      baseURI: BASE_URI,
    },
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const filename = `${hre.network.name}-${Date.now()}.json`;
  const filepath = path.join(deploymentsDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(deploymentInfo, null, 2));

  // Also save latest deployment
  const latestFilepath = path.join(deploymentsDir, `${hre.network.name}-latest.json`);
  fs.writeFileSync(latestFilepath, JSON.stringify(deploymentInfo, null, 2));

  console.log("💾 Deployment info saved to:", filename);
  console.log("");

  // Display next steps
  console.log("📌 Next Steps:");
  console.log("1. Update .env with contract address:");
  console.log(`   NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`);
  console.log("");
  console.log("2. Verify contract on Polygonscan:");
  console.log(`   npx hardhat verify --network ${hre.network.name} ${contractAddress} "${NAME}" "${SYMBOL}" "${BASE_URI}"`);
  console.log("");
  console.log("3. Enable minting:");
  console.log("   Run: node scripts/toggleMinting.js");
  console.log("");
  console.log("4. View on explorer:");
  
  if (hre.network.name === "polygon_amoy") {
    console.log(`   https://amoy.polygonscan.com/address/${contractAddress}`);
  } else if (hre.network.name === "polygon_mainnet") {
    console.log(`   https://polygonscan.com/address/${contractAddress}`);
  }
  console.log("");

  // Wait for block confirmations before verification
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("⏳ Waiting for block confirmations...");
    await charaNFT.deploymentTransaction().wait(5);
    console.log("✅ Confirmations received");
    console.log("");

    // Auto-verify if API key is available
    if (process.env.POLYGONSCAN_API_KEY) {
      console.log("🔍 Attempting automatic verification...");
      try {
        await hre.run("verify:verify", {
          address: contractAddress,
          constructorArguments: [NAME, SYMBOL, BASE_URI],
        });
        console.log("✅ Contract verified successfully!");
      } catch (error) {
        console.log("⚠️  Verification failed:", error.message);
        console.log("   You can verify manually later");
      }
    }
  }

  console.log("\n🎉 Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
