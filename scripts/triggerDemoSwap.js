const hre = require("hardhat");

async function main() {
  const address = process.env.DEMO_SWAP_CONTRACT;
  if (!address) {
    console.error("Missing DEMO_SWAP_CONTRACT in env");
    process.exit(1);
  }

  const [signer] = await hre.ethers.getSigners();
  console.log("Triggering demo swap from:", signer.address);
  console.log("Contract:", address);

  const abi = ["function demoSwap(uint256 amountOut) external payable"];
  const demo = new hre.ethers.Contract(address, abi, signer);
  const tx = await demo.demoSwap(1000, { value: hre.ethers.parseEther("0.001") });
  console.log("tx:", tx.hash);
  await tx.wait();
  console.log("Demo swap emitted successfully");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
