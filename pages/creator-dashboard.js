import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import {
  nftmarketaddress, nftaddress
} from '../config'

import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import { Provider } from '@ethersproject/abstract-provider'

export default function CreatorDashboard() {
  const [nfts, setNfts] = useState([])
  const [sold, setSold] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner();
      
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)

    const data = await marketContract.fetchItemsCreated()
    
      const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        sold: i.sold,
        image: meta.data.image,
      }
      return item
    }))
    /* create a filtered array of items that have been sold */
    const soldItems = items.filter(i => i.sold)
    setSold(soldItems)
    setNfts(items)
    setLoadingState('loaded') 
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No assets created</h1>)
  return (
    
    <div>
      <br/>
      <img src="https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=2710&amp;q=80" alt=""/>

      <br/>
      <h2 className="text-4xl py-2 text-center">Items Created</h2>
      
      <div className="flex justify-center">
      <div className="shadow hover:shadow-lg transition duration-300 ease-in-out xl:mb-0 lg:mb-0 md:mb-0 mb-6 cursor-pointer group" style={{ maxWidth: '1100px'}}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div className="w-65 " >
              <div key={i} className="shadow hover:shadow-lg transition duration-300 ease-in-out xl:mb-0 lg:mb-0 md:mb-0 mb-6 cursor-pointer group">
                   <div className="overflow-hidden relative">
                <img src={nft.image} className="w-full h-56 transition duration-700 ease-in-out group-hover:opacity-60" />

                <div className="p-4 bg-white">
                  <p className="text-2xl font-bold text-black">Price - {nft.price} Eth</p>
                </div>

              </div>
              </div>
              </div>
            ))
          }
        </div>
        
      </div>
      </div>
        <div className="px-4">
        {
          Boolean(sold.length) && (
            <div>
              <h2 className="text-4xl py-2 text-center">Items sold</h2>
              <div className="flex justify-center">
      <div className="shadow hover:shadow-lg transition duration-300 ease-in-out xl:mb-0 lg:mb-0 md:mb-0 mb-6 cursor-pointer group" style={{ maxWidth: '1100px'}}>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                {
                  sold.map((nft, i) => (
                    <div className="w-65 " > 
                    <div key={i} className="shadow hover:shadow-lg transition duration-300 ease-in-out xl:mb-0 lg:mb-0 md:mb-0 mb-6 cursor-pointer group">
                    <div className="overflow-hidden relative">
                      <img src={nft.image} className="w-full h-56 transition duration-700 ease-in-out group-hover:opacity-60" />
                      <div className="p-4 bg-white">
                        <p className="text-2xl font-bold text-black">Price - {nft.price} Eth</p>
                      </div>
                    </div>
                    </div>
                    </div>
                    
                  ))
                }
              </div>
              </div>
              </div>
            </div>
          )
        }
        </div>
        
    </div>
  )
}