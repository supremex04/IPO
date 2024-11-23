const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokenFactory and TGE Contracts", function () {
  let TokenFactory, TGE;
  let tokenFactory, owner, addr1, addr2;
  let tokenName = "Nepse";
  let tokenSymbol = "NEP";
  let initialSupply = 1000;

  beforeEach(async function () {
    TokenFactory = await ethers.getContractFactory("TokenFactory");
    TGE = await ethers.getContractFactory("TGE");
    [owner, addr1, addr2] = await ethers.getSigners();

    tokenFactory = await TokenFactory.deploy();
    await tokenFactory.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy the TokenFactory contract", async function () {
      const factoryAddress = tokenFactory.target;
      expect(factoryAddress).to.properAddress;
    });

    it("Should initialize with no created tokens", async function () {
      const createdTokens = await tokenFactory.getCreatedTokens();
      expect(createdTokens.length).to.equal(0);
    });
  });

  describe("Token Creation", function () {
    it("Should create a new token and track its address", async function () {
      const tx = await tokenFactory.createToken(tokenName, tokenSymbol, initialSupply);
      await tx.wait();

      const tokens = await tokenFactory.getCreatedTokens();
      expect(tokens.length).to.equal(1);
      expect(tokens[0]).to.properAddress;
    });

    it("Should emit TokenCreated event on token creation", async function () {
      const tx = await tokenFactory.createToken(tokenName, tokenSymbol, initialSupply);
      const receipt = await tx.wait();
    
      // Check if events exist in the receipt
      if (!receipt.events || receipt.events.length === 0) {
        throw new Error("No events emitted");
      }
    
      // Locate the "TokenCreated" event
      const event = receipt.events.find((e) => e.event === "TokenCreated");
      if (!event) {
        throw new Error('TokenCreated event not found in receipt');
      }
    
      const { creator, tokenAddress, name, symbol } = event.args;
    
      // Assert the event arguments
      expect(creator).to.equal(owner.address);
      expect(tokenAddress).to.properAddress;
      expect(name).to.equal(tokenName);
      expect(symbol).to.equal(tokenSymbol);
    });
    
    
  });

  describe("Transactions with created tokens", function () {
    let tokenContract;

    beforeEach(async function () {
      const tx = await tokenFactory.createToken(tokenName, tokenSymbol, initialSupply);
      const receipt = await tx.wait();
      const tokenAddress = receipt.events.find((e) => e.event === "TokenCreated").args.tokenAddress;

      tokenContract = await ethers.getContractAt("TGE", tokenAddress);
    });

    it("Should allow transfers between accounts", async function () {
      await tokenContract.transfer(addr1.address, ethers.parseUnits("100", 18));
      const addr1Balance = await tokenContract.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(ethers.parseUnits("100", 18));

      await tokenContract.connect(addr1).transfer(addr2.address, ethers.parseUnits("50", 18));
      const addr2Balance = await tokenContract.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(ethers.parseUnits("50", 18));
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      await expect(
        tokenContract.connect(addr1).transfer(addr2.address, ethers.parseUnits("1", 18))
      ).to.be.revertedWithCustomError(tokenContract, "ERC20InsufficientBalance");
    });
  });
});
