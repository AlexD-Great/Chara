const hre = require("hardhat");

async function main() {
  console.log("🔍 Checking wallet balance...\n");

  const [deployer] = await hre.ethers.getSigners();
  const balance = await hre.ethers.provider.getBalance(deployer.address);

  console.log("Deployer address:", deployer.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "POL");
  console.log("Network:", hre.network.name);
  console.log("Chain ID:", (await hre.ethers.provider.getNetwork()).chainId.toString());

  const minRequired = hre.ethers.parseEther("0.01");
  if (balance < minRequired) {
    console.log("\n⚠️  Warning: Balance is low!");
    console.log("Get testnet POL from: https://faucet.polygon.technology/");
  } else {
    console.log("\n✅ Balance is sufficient for deployment!");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
