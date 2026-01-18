const hre = require("hardhat");

async function main() {
  console.log("📊 Checking Chara NFT Contract Status\n");

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  
  if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
    console.error("❌ Contract address not set in .env");
    process.exit(1);
  }

  const CharaNFT = await hre.ethers.getContractFactory("CharaNFT");
  const contract = await CharaNFT.attach(contractAddress);

  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Network: ${hre.network.name}\n`);

  // Get contract data
  const name = await contract.name();
  const symbol = await contract.symbol();
  const totalMinted = await contract.totalMinted();
  const maxSupply = await contract.maxSupply();
  const mintPrice = await contract.mintPrice();
  const mintingActive = await contract.mintingActive();
  const owner = await contract.owner();

  console.log("📋 Contract Information:");
  console.log(`   Name: ${name}`);
  console.log(`   Symbol: ${symbol}`);
  console.log(`   Owner: ${owner}`);
  console.log("");

  console.log("📊 Minting Statistics:");
  console.log(`   Total Minted: ${totalMinted.toString()}`);
  console.log(`   Max Supply: ${maxSupply.toString()}`);
  console.log(`   Mint Price: ${hre.ethers.formatEther(mintPrice)} POL`);
  console.log(`   Minting Active: ${mintingActive ? '✅ Yes' : '❌ No'}`);
  console.log(`   Remaining: ${Number(maxSupply) - Number(totalMinted)}`);
  console.log("");

  // Calculate progress
  const progress = (Number(totalMinted) / Number(maxSupply)) * 100;
  console.log(`Progress: ${progress.toFixed(2)}%`);
  
  // Progress bar
  const barLength = 50;
  const filledLength = Math.floor((progress / 100) * barLength);
  const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
  console.log(`[${bar}]`);
  console.log("");

  // Check specific wallet
  const walletToCheck = "0x774A693E52e6882b10f739bB7b84b3F4438ADb4B";
  const walletMinted = await contract.numberMinted(walletToCheck);
  console.log(`\n👤 Wallet ${walletToCheck.slice(0,6)}...${walletToCheck.slice(-4)}:`);
  console.log(`   Already Minted: ${walletMinted.toString()}`);
  console.log(`   Can Mint More: ${Number(walletMinted) < 1 ? '✅ Yes' : '❌ No (max 1 per wallet)'}`);
  console.log("");

  // Explorer link
  if (hre.network.name === "polygon_amoy") {
    console.log(`🔍 View on Explorer:`);
    console.log(`   https://amoy.polygonscan.com/address/${contractAddress}`);
  } else if (hre.network.name === "polygon_mainnet") {
    console.log(`🔍 View on Explorer:`);
    console.log(`   https://polygonscan.com/address/${contractAddress}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
