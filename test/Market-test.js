const { expect } = require("chai");
const { ethers } = require("hardhat");

contract("Market", function ( accounts ) {

  it("assert true", async function () {
    await Market.deployed();
    return assert.isTrue(true);
  });
  
  it("admin role", async() => {
    let NFTMarketIn = await Market.deployed();
    let marketplaceOwner = await NFTMarketIn.getMarketplaceOwner.call();
    let ADMIN_ROLE = web3.utils.soliditySha3('ADMIN_ROLE');
    let isOwnerAnAdmin = await NFTMarketIn.hasRole(ADMIN_ROLE,marketplaceOwner);
    assert.equal(isOwnerAnAdmin,true,"Owner should be the admin");
  });

  it('listing price of 25000000 gwei', async() => {
    let NFTMarketIn = await Market.deployed();
    let price = await NFTMarketIn.getListingPrice.call();
    let listingPrice = web3.utils.toWei(price.toString(),'gwei');
    let expectedPrice = web3.utils.toWei('25000000','gwei');
    assert.equal(listingPrice,expectedPrice,'Price should be 25000000 gwei');
  });
  
  describe('Change Price', async () => {
    it('price should be 30000000 gwei',async() => {
      let NFTMarketIn = await Market.deployed();
      await NFTMarketIn.Pause({from:accounts[0]});
      let changeListingPrice = await NFTMarketIn.changeListingPrice(30000000,{from: accounts[0]});
      await NFTMarketIn.Unpause({from:accounts[0]});
      let price = await NFTMarketIn.getListingPrice.call();
      let listingPrice = web3.utils.toWei(price.toString(),'gwei');
      let expectedPrice = web3.utils.toWei('30000000','gwei');
      truffleAssert.eventEmitted(changeListingPrice,'logListingPriceChanged',(event) => {
        return (event.newListingPrice == 30000000);
      })
      assert.equal(listingPrice,expectedPrice,'Price should be 30000000 gwei');
    })
  })

  describe('validator role', async () => {
    it('grant validtor role',async () => {
      let NFTMarketIn = await Market.deployed();
      let validator = accounts[1];
      let admin = await NFTMarketIn.getMarketplaceOwner.call();
      let VALIDATOR_ROLE = web3.utils.soliditySha3('VALIDATOR_ROLE');
      let grantValidator = await NFTMarketIn.grantValidator(validator,{from: admin});
      let result = await NFTMarketIn.hasRole(VALIDATOR_ROLE,validator);
      assert.equal(result,true,`${validator} should granted validator role`)
      truffleAssert.eventEmitted(grantValidator,'RoleGranted',(event) => {
        return (event.role == VALIDATOR_ROLE && event.account == validator && event.sender == admin);
      })
    })

    it('revoke validtor role',async () => {
      let NFTMarketIn = await Market.deployed();
      let validator = accounts[1];
      let admin = await NFTMarketIn.getMarketplaceOwner.call();
      let VALIDATOR_ROLE = web3.utils.soliditySha3('VALIDATOR_ROLE');
      let revokeValidator = await NFTMarketIn.revokeValidator(validator,{from: admin});
      let result = await NFTMarketIn.hasRole(VALIDATOR_ROLE,validator);
      assert.equal(result,false,`${validator} should revoked validator role`)
      truffleAssert.eventEmitted(revokeValidator,'RoleRevoked',(event) => {
        return (event.role == VALIDATOR_ROLE && event.account == validator && event.sender == admin);
      })
    })
  })
});