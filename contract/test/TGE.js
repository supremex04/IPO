const { expect } = require("chai");
const { ethers } = require("hardhat"); // Import ethers properly

describe("TGE Contract", function () {
  // global vars
  let Token;
  let tge;
  let owner;
  let addr1;
  let addr2;
  let initialSupply = 1000; 

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Token = await ethers.getContractFactory("TGE");
    [owner, addr1, addr2] = await ethers.getSigners();

    tge = await Token.deploy(initialSupply);
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await tge.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      expect(await tge.balanceOf(owner.address)).to.equal(ethers.parseUnits("1000", 18));
    });

    it("Should have correct name and symbol", async function () {
      expect(await tge.name()).to.equal("Nepse");
      expect(await tge.symbol()).to.equal("NEP");
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      await tge.transfer(addr1.address, 100);
      const addr1Balance = await tge.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      await tge.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await tge.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await tge.balanceOf(owner.address);
      await expect(
        tge.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWithCustomError( tge, "ERC20InsufficientBalance").withArgs(addr1.address, 0, 1);

      expect(await tge.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await tge.balanceOf(owner.address);

      await tge.transfer(addr1.address, ethers.utils.parseUnits("200", 18));
      await tge.transfer(addr2.address, ethers.utils.parseUnits("100", 18));

      const finalOwnerBalance = await tge.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(ethers.utils.parseUnits("300", 18)));

      const addr1Balance = await tge.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(ethers.utils.parseUnits("200", 18));

      const addr2Balance = await tge.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(ethers.utils.parseUnits("100", 18));
    });
  });
});
