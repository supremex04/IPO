const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TokenFactoryModule", (m) => {
  // Deploy only the factory contract
  const tokenFactory = m.contract("TokenFactory", []);

  return { tokenFactory };
});