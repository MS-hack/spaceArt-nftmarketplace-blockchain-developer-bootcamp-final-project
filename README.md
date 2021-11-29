# Space Art Full stack NFT marketplace is final-project to blockchain developer bootcamp-2021
 Space Art  is an NFT store built on Polygon Blockchain ( Reposten Testnet )
 
 # Tagline 

 Space Art is marketplace and community where you can buy , sell and create NFT items through the usage of ethers and track the ownership of digital assets We’ll make the world where human creativity is fully respected

# What I did for the Consensys blockchain developer Bootcamp :
•	Upload website on IPFS 
•	NFT Marketplace

 # Problem it Solves 
* **Duplicate Asset Problem**: Duplication of digital assets is not possible due to non fungibility of NFT's.

* **No Tampering of Data**: No one can easily tamper the data as the data is stored on the blockchain. 

* **Quick Transactions from Polygon**: Polygon provided us with *quick transaction speed* which boosted the *User Experience* of our website.

* **Ownership Record Maintainance**: Ownership can be tracked easily as smart contract passes the ownership from the seller to buyer directly.

* **Data Storage problem of Blockchain**: Blockchain can't be used for storing media files for media assets in an efficient manner, so we used IPFS for digital assets.

# Challenges 
1-	I was unaware of the development technology behind NFT tokens. Consequently, the most difficult thing for me, was to overcome the fear of learning a new technology such as blockchain. Thanks to Polygon, it was easily able to build NFT tokens
2-	First time use Taiwindcss with Next.js


# public wallet address
0x34E8E400BE58476977EB37c18d3C005878AB6d0C 


# screencast link :
https://www.youtube.com/watch?v=4xjcNGW6Khc


# Technologies Used
Polygon
IPFS
Next.js
Hardhat
Ethereum
Solidity
Metamask
JavaScript
Tailwindcss


# To run this project locally, follow these steps.

1. Clone the project locally, change into the directory, and install the dependencies:

```sh


# install using NPM or Yarn
npm install

# or

yarn
```

2. Start the local Hardhat node

```sh
npx hardhat node
```

3. With the network running, deploy the contracts to the local network in a separate terminal window

```sh
npx hardhat run scripts/deploy.js --network localhost
```

4. Start the app

```
npm run dev
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



