## Full stack NFT marketplace 


To run this project locally, follow these steps.

1. Clone the project locally, change into the directory, and install the dependencies:

```sh


# install ONLY use Yarn


yarn
```

2. Start the local Hardhat node (only for localhost), we test it on Ropsten, don't need step 2)

```sh
npx hardhat node
```

3. With the network running, deploy the contracts to the local network in a separate terminal window

```sh
npx hardhat run scripts/deploy.js
```

4. Start the app

```
yarn build
yarn dev
```

5. verify your smart contracts on Etherscan

ceate .env with (use your Etherscan API token)
```
ETHERSCAN_API_KEY=IYXRK5YX25T99ISP1DQXCTRKFJDZYT25
```

then, find your smart contracts addresses in config.js
```
  export const nftmarketaddress = "0x2505A01DFaDb8ee45168e9061Cd93552ca14CF60"
  export const nftaddress = "0xF69fca30D6BF365A31650cB3Be2bf752cD1A2De2"
```


```sh
npx hardhat verify 0x2505A01DFaDb8ee45168e9061Cd93552ca14CF60
npx hardhat verify 0xF69fca30D6BF365A31650cB3Be2bf752cD1A2De2 "0x2505A01DFaDb8ee45168e9061Cd93552ca14CF60"
```

### Configuration

To deploy to Polygon test or main networks, update the configurations located in __hardhat.config.js__ to use a private key and, optionally, deploy to a private RPC like Infura.

```javascript
require("@nomiclabs/hardhat-waffle");
const fs = require('fs');
const privateKey = fs.readFileSync(".secret").toString().trim() || "01234567890123456789";

// infuraId is optional if you are using Infura RPC
const infuraId = fs.readFileSync(".infuraid").toString().trim() || "";

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      // Infura
      // url: `https://polygon-mumbai.infura.io/v3/${infuraId}`
      url: "https://rpc-mumbai.matic.today",
      accounts: [privateKey]
    },
    matic: {
      // Infura
      // url: `https://polygon-mainnet.infura.io/v3/${infuraId}`,
      url: "https://rpc-mainnet.maticvigil.com",
      accounts: [privateKey]
    }
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};



