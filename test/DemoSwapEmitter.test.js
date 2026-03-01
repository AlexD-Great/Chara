const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DemoSwapEmitter", function () {
  let demoSwap;
  let owner;
  let user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    const DemoSwapEmitter = await ethers.getContractFactory("DemoSwapEmitter");
    demoSwap = await DemoSwapEmitter.deploy();
    await demoSwap.waitForDeployment();
  });

  it("emits swap event with sender as tx caller", async function () {
    const value = ethers.parseEther("0.001");
    await expect(demoSwap.connect(user).demoSwap(1000, { value }))
      .to.emit(demoSwap, "Swap")
      .withArgs(user.address, value, 0, 0, 1000, user.address);
  });

  it("allows owner to withdraw collected value", async function () {
    await demoSwap.connect(user).demoSwap(1000, { value: ethers.parseEther("0.001") });
    await expect(() => demoSwap.connect(owner).withdraw()).to.changeEtherBalances(
      [owner, demoSwap],
      [ethers.parseEther("0.001"), ethers.parseEther("-0.001")]
    );
  });
});
