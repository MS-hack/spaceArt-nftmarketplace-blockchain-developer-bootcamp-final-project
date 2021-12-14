import 'tailwindcss/tailwind.css'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import {
  nftmarketaddress, nftaddress
} from '../config'

import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

export default function MyAssets() {
  const [nfts, setNfts] = useState([])
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
    const data = await marketContract.fetchMyNFTs()
    
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded') 
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No assets owned</h1>)
  return (
      <div>
    
       <main className="profile-page">
      
     <section className="relative block h-500-px bg-Gray-700 ">
        <div className="absolute top-0 w-full h-full bg-center bg-gray-700 ">
          <img  src="https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=2710&amp;q=80" alt=""/>
        </div> 
      <span id="blackOverlay" className="w-full h-full absolute opacity-50 bg-black"></span>
      <svg className="absolute bottom-0 overflow-hidden" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" version="1.1" viewBox="0 0 2560 100" x="0" y="0">
        <polygon className="text-blueGray-200 fill-current" points="2560 0 2560 100 0 100"></polygon>
      </svg>
  
  </section>
  
       <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
       
  <section className="relative py-16 bg-blueGray-200">
    <div className="container mx-auto px-4">
      <div className="relative flex flex-col min-w-0 break-words bg-gray-50 w-full mb-6 shadow-xl rounded-lg -mt-64">
        <div className="px-6">
          
        <br/><br/>
        <div><h2 className="text-4xl py-2 text-center">My assets</h2></div>
          <div className="flex justify-center">
      <div className="shadow hover:shadow-lg transition duration-300 ease-in-out xl:mb-0 lg:mb-0 md:mb-0 mb-6 cursor-pointer group" style={{ maxWidth: '1100px'}}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            
            nfts.map((nft, i) => (
              <div key={i} className="w-65 " > 
              <div key={i} className="shadow hover:shadow-lg transition duration-300 ease-in-out xl:mb-0 lg:mb-0 md:mb-0 mb-6 cursor-pointer group">
              <div className="overflow-hidden relative">
                <img src={nft.image} className="w-full h-56 transition duration-700 ease-in-out group-hover:opacity-60" />
                
                
                <div className="px-4 py-3 bg-white">
                <div className="flex py-2">
                  <p className="text-gray-800 font-semibold text-lg hover:text-red-500 transition duration-300 ease-in-out">Price - {nft.price} Eth</p>
                </div>
                </div>

              </div>
              </div>
              </div>
            ))
           
          }
          
        </div>
      </div>
    </div>

          <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
            <div className="flex flex-wrap justify-center">
              <div className="w-full lg:w-9/12 px-4">
              <a href="#pablo" className="font-normal text-blue-500">Show more</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </section>
</main>


      <br/>
     

    
    </div>
  )
}