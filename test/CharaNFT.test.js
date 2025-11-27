const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CharaNFT", function () {
  let charaNFT;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  const NAME = "Chara";
  const SYMBOL = "CHARA";
  const BASE_URI = "ipfs://QmTest/";
  const MINT_PRICE = ethers.parseEther("0.001");

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    const CharaNFT = await ethers.getContractFactory("CharaNFT");
    charaNFT = await CharaNFT.deploy(NAME, SYMBOL, BASE_URI);
    await charaNFT.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await charaNFT.name()).to.equal(NAME);
      expect(await charaNFT.symbol()).to.equal(SYMBOL);
    });

    it("Should set the correct owner", async function () {
      expect(await charaNFT.owner()).to.equal(owner.address);
    });

    it("Should have minting disabled by default", async function () {
      expect(await charaNFT.mintingActive()).to.equal(false);
    });

    it("Should authorize owner as updater", async function () {
      expect(await charaNFT.authorizedUpdaters(owner.address)).to.equal(true);
    });
  });

  describe("Minting", function () {
    beforeEach(async function () {
      await charaNFT.toggleMinting();
    });

    it("Should mint an NFT successfully", async function () {
      await expect(
        charaNFT.connect(addr1).mint({ value: MINT_PRICE })
      ).to.emit(charaNFT, "NFTMinted");

      expect(await charaNFT.balanceOf(addr1.address)).to.equal(1);
      expect(await charaNFT.totalMinted()).to.equal(1);
    });

    it("Should fail if minting is not active", async function () {
      await charaNFT.toggleMinting();
      await expect(
        charaNFT.connect(addr1).mint({ value: MINT_PRICE })
      ).to.be.revertedWithCustomError(charaNFT, "MintingNotActive");
    });

    it("Should fail if payment is insufficient", async function () {
      await expect(
        charaNFT.connect(addr1).mint({ value: ethers.parseEther("0.0001") })
      ).to.be.revertedWithCustomError(charaNFT, "InsufficientPayment");
    });

    it("Should enforce max per wallet limit", async function () {
      await charaNFT.connect(addr1).mint({ value: MINT_PRICE });
      
      await expect(
        charaNFT.connect(addr1).mint({ value: MINT_PRICE })
      ).to.be.revertedWithCustomError(charaNFT, "MaxPerWalletReached");
    });

    it("Should initialize evolution level to 0", async function () {
      await charaNFT.connect(addr1).mint({ value: MINT_PRICE });
      const tokenId = 0;
      
      expect(await charaNFT.evolutionLevel(tokenId)).to.equal(0);
    });
  });

  describe("Soulbound Functionality", function () {
    beforeEach(async function () {
      await charaNFT.toggleMinting();
      await charaNFT.connect(addr1).mint({ value: MINT_PRICE });
    });

    it("Should prevent transfers", async function () {
      const tokenId = 0;
      
      await expect(
        charaNFT.connect(addr1).transferFrom(addr1.address, addr2.address, tokenId)
      ).to.be.revertedWithCustomError(charaNFT, "TransferNotAllowed");
    });

    it("Should prevent safe transfers", async function () {
      const tokenId = 0;
      
      await expect(
        charaNFT.connect(addr1)["safeTransferFrom(address,address,uint256)"](
          addr1.address,
          addr2.address,
          tokenId
        )
      ).to.be.revertedWithCustomError(charaNFT, "TransferNotAllowed");
    });
  });

  describe("Evolution", function () {
    beforeEach(async function () {
      await charaNFT.toggleMinting();
      await charaNFT.connect(addr1).mint({ value: MINT_PRICE });
    });

    it("Should evolve NFT successfully", async function () {
      const tokenId = 0;
      const newURI = "ipfs://QmNewMetadata/0.json";

      await expect(
        charaNFT.evolveNFT(tokenId, newURI)
      ).to.emit(charaNFT, "NFTEvolved");

      expect(await charaNFT.evolutionLevel(tokenId)).to.equal(1);
      expect(await charaNFT.tokenMetadataURI(tokenId)).to.equal(newURI);
    });

    it("Should fail if caller is not authorized", async function () {
      const tokenId = 0;
      const newURI = "ipfs://QmNewMetadata/0.json";

      await expect(
        charaNFT.connect(addr1).evolveNFT(tokenId, newURI)
      ).to.be.revertedWithCustomError(charaNFT, "Unauthorized");
    });

    it("Should update metadata URI", async function () {
      const tokenId = 0;
      const newURI = "ipfs://QmNewMetadata/0.json";

      await charaNFT.evolveNFT(tokenId, newURI);
      expect(await charaNFT.tokenURI(tokenId)).to.equal(newURI);
    });

    it("Should increment evolution level multiple times", async function () {
      const tokenId = 0;

      await charaNFT.evolveNFT(tokenId, "ipfs://QmEvolution1/");
      expect(await charaNFT.evolutionLevel(tokenId)).to.equal(1);

      await charaNFT.evolveNFT(tokenId, "ipfs://QmEvolution2/");
      expect(await charaNFT.evolutionLevel(tokenId)).to.equal(2);

      await charaNFT.evolveNFT(tokenId, "ipfs://QmEvolution3/");
      expect(await charaNFT.evolutionLevel(tokenId)).to.equal(3);
    });
  });

  describe("Activity Recording", function () {
    it("Should record activity successfully", async function () {
      await expect(
        charaNFT.recordActivity(addr1.address, 1, 100)
      ).to.emit(charaNFT, "ActivityRecorded");

      expect(await charaNFT.activityScore(addr1.address)).to.equal(100);
    });

    it("Should accumulate activity scores", async function () {
      await charaNFT.recordActivity(addr1.address, 1, 100);
      await charaNFT.recordActivity(addr1.address, 2, 50);
      
      expect(await charaNFT.activityScore(addr1.address)).to.equal(150);
    });

    it("Should fail if caller is not authorized", async function () {
      await expect(
        charaNFT.connect(addr1).recordActivity(addr1.address, 1, 100)
      ).to.be.revertedWithCustomError(charaNFT, "Unauthorized");
    });
  });

  describe("Admin Functions", function () {
    it("Should toggle minting", async function () {
      expect(await charaNFT.mintingActive()).to.equal(false);
      await charaNFT.toggleMinting();
      expect(await charaNFT.mintingActive()).to.equal(true);
    });

    it("Should update mint price", async function () {
      const newPrice = ethers.parseEther("0.002");
      await charaNFT.setMintPrice(newPrice);
      expect(await charaNFT.mintPrice()).to.equal(newPrice);
    });

    it("Should update max supply", async function () {
      await charaNFT.setMaxSupply(5000);
      expect(await charaNFT.maxSupply()).to.equal(5000);
    });

    it("Should authorize updaters", async function () {
      await charaNFT.setAuthorizedUpdater(addr1.address, true);
      expect(await charaNFT.authorizedUpdaters(addr1.address)).to.equal(true);

      await charaNFT.setAuthorizedUpdater(addr1.address, false);
      expect(await charaNFT.authorizedUpdaters(addr1.address)).to.equal(false);
    });

    it("Should allow owner to mint", async function () {
      await charaNFT.ownerMint(addr1.address, 5);
      expect(await charaNFT.balanceOf(addr1.address)).to.equal(5);
    });

    it("Should withdraw funds", async function () {
      await charaNFT.toggleMinting();
      await charaNFT.connect(addr1).mint({ value: MINT_PRICE });

      const initialBalance = await ethers.provider.getBalance(owner.address);
      await charaNFT.withdraw();
      const finalBalance = await ethers.provider.getBalance(owner.address);

      expect(finalBalance).to.be.gt(initialBalance);
    });
  });

  describe("Metadata", function () {
    beforeEach(async function () {
      await charaNFT.toggleMinting();
      await charaNFT.connect(addr1).mint({ value: MINT_PRICE });
    });

    it("Should return base URI for non-evolved tokens", async function () {
      const tokenId = 0;
      const expectedURI = BASE_URI + tokenId + ".json";
      expect(await charaNFT.tokenURI(tokenId)).to.equal(expectedURI);
    });

    it("Should return custom URI for evolved tokens", async function () {
      const tokenId = 0;
      const customURI = "ipfs://QmCustom/evolved.json";
      
      await charaNFT.evolveNFT(tokenId, customURI);
      expect(await charaNFT.tokenURI(tokenId)).to.equal(customURI);
    });

    it("Should update base URI", async function () {
      const newBaseURI = "ipfs://QmNewBase/";
      await charaNFT.setBaseURI(newBaseURI);
      
      const tokenId = 0;
      const expectedURI = newBaseURI + tokenId + ".json";
      expect(await charaNFT.tokenURI(tokenId)).to.equal(expectedURI);
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      await charaNFT.toggleMinting();
      await charaNFT.connect(addr1).mint({ value: MINT_PRICE });
    });

    it("Should return evolution data", async function () {
      const tokenId = 0;
      const data = await charaNFT.getEvolutionData(tokenId);
      
      expect(data.level).to.equal(0);
      expect(data.owner).to.equal(addr1.address);
      expect(data.lastEvolution).to.be.gt(0);
    });

    it("Should check if token exists", async function () {
      expect(await charaNFT.exists(0)).to.equal(true);
      expect(await charaNFT.exists(999)).to.equal(false);
    });

    it("Should return number minted by address", async function () {
      expect(await charaNFT.numberMinted(addr1.address)).to.equal(1);
      expect(await charaNFT.numberMinted(addr2.address)).to.equal(0);
    });
  });
});
