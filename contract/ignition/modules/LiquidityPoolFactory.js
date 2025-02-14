const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("LiquiditySwapModule", (m) => {
  // Deploy LiquidityPoolFactory
  const liquidityPoolFactory = m.contract("LiquidityPoolFactory", []);

  // Deploy Swap Contract
  const swap = m.contract("Swap", []);

  return { liquidityPoolFactory, swap };
});
