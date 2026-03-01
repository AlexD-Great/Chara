const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying DemoSwapEmitter with:", deployer.address);

  const DemoSwapEmitter = await hre.ethers.getContractFactory("DemoSwapEmitter");
  const demoSwap = await DemoSwapEmitter.deploy();
  await demoSwap.waitForDeployment();

  const address = await demoSwap.getAddress();
  console.log("DemoSwapEmitter deployed:", address);
  console.log(`Set env var: DEMO_SWAP_CONTRACT=${address}`);
  console.log(`Set frontend env: NEXT_PUBLIC_DEMO_SWAP_ADDRESS=${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
