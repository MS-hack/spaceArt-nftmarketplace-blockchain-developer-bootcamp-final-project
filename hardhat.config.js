require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config()
const fs = require('fs');
const privateKey = fs.readFileSync(".secret").toString().trim() || "";
const infuraId = fs.readFileSync(".infuraid").toString().trim() || "";
console.log('infuraId:',infuraId)
module.exports = {
  defaultNetwork: "ropsten",
  networks: {
    hardhat: {
      chainId: 1337,
   
    },
    ropsten: {
      // Infura
      // url: `https://polygon-mumbai.infura.io/v3/${infuraId}`
      url: `https://ropsten.infura.io/v3/${infuraId}`,
      accounts: [privateKey],
  
    },
    mumbai: {
      // Infura
      // url: `https://polygon-mumbai.infura.io/v3/${infuraId}`
      url: `https://polygon-mumbai.infura.io/v3/${infuraId}`,
      accounts: [privateKey]
    },
   
    matic: {
      // Infura
      // url: `https://polygon-mainnet.infura.io/v3/${infuraId}`,
      url: `https://polygon-mainnet.infura.io/v3/${infuraId}`,
      accounts: [privateKey]
    }
    
  },
  solidity: {
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

