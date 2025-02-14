require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-chai-matchers")
require("dotenv").config();
// require("@nomiclabs/hardhat-ethers");

// /** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
    viaIR: true, // ✅ Enable IR to reduce stack depth issues
  },

  networks: {
    ganache: {
      url: "http://127.0.0.1:7545", // RPC URL of Ganache
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
