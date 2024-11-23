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
      const factoryAddress = await tokenFactory.getAddress();
      expect(factoryAddress).to.be.properAddress;
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
      expect(tokens[0]).to.be.properAddress;
    });

    it("Should emit TokenCreated event on token creation", async function () {
      const tx = await tokenFactory.createToken(tokenName, tokenSymbol, initialSupply);
      const receipt = await tx.wait();
      
      const event = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "TokenCreated"
      );
      
      expect(event).to.not.be.undefined;
      expect(event.args[0]).to.equal(owner.address);
      expect(event.args[1]).to.be.properAddress;
      expect(event.args[2]).to.equal(tokenName);
      expect(event.args[3]).to.equal(tokenSymbol);
    });
  });

  describe("Transactions with created tokens", function () {
    let tokenContract;

    beforeEach(async function () {
      const tx = await tokenFactory.createToken(tokenName, tokenSymbol, initialSupply);
      const receipt = await tx.wait();
      
      const event = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "TokenCreated"
      );
      
      tokenContract = await ethers.getContractAt("TGE", event.args[1]);
    });

    it("Should allow transfers between accounts", async function () {
      await tokenContract.transfer(addr1.address, 100);
      const addr1Balance = await tokenContract.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      await tokenContract.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await tokenContract.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const transferAmount = ethers.parseUnits("1", 18);
      await expect(
        tokenContract.connect(addr1).transfer(addr2.address, transferAmount)
      ).to.be.revertedWithCustomError(tokenContract, "ERC20InsufficientBalance");
    });
  });
});