const { expect } = require("chai");
const { ethers } = require("hardhat"); 

describe("TGE Contract", function () {
  // global vars
  let Token;
  let tge;
  let owner;
  let addr1;
  let addr2;
  let initialSupply = 1000;
  let tokenName = "Nepse";
  let tokenSymbol = "NEP";

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Token = await ethers.getContractFactory("TGE");
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the contract with dynamic name, symbol, and supply
    tge = await Token.deploy(tokenName, tokenSymbol, initialSupply);
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await tge.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      expect(await tge.balanceOf(owner.address)).to.equal(ethers.parseUnits("1000", 18));
    });

    it("Should have correct name and symbol", async function () {
      expect(await tge.name()).to.equal(tokenName);
      expect(await tge.symbol()).to.equal(tokenSymbol);
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
      ).to.be.revertedWithCustomError(tge, "ERC20InsufficientBalance").withArgs(addr1.address, 0, 1);

      expect(await tge.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await tge.balanceOf(owner.address);

      // Transfer amounts using raw integers (BigInt)
      await tge.transfer(addr1.address, 100); // Transfer 100 tokens
      await tge.transfer(addr2.address, 50);  // Transfer 50 tokens

      const finalOwnerBalance = await tge.balanceOf(owner.address);

      // Calculate expected balance using BigInt
      const expectedOwnerBalance = initialOwnerBalance - BigInt(100 + 50); // 150 tokens transferred out

      expect(finalOwnerBalance).to.equal(expectedOwnerBalance);

      const addr1Balance = await tge.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await tge.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });
});
