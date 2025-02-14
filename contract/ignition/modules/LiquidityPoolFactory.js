
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("LiquiditySwapModule", (m) => {
  const liquidityPoolFactory = m.contract("LiquidityPoolFactory", []);
  const swap = m.contract("Swap", []);

  return { liquidityPoolFactory, swap };
});
