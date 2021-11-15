import 'tailwindcss/tailwind.css'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'




export default function Home() {
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
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
    const data = await marketContract.fetchMarketItems()
    
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
        name: meta.data.name,
        description: meta.data.description,
        category:meta.data.category,
      }
      console.log(item)
      return item
    }))
    setNfts(items)
    setLoadingState('loaded') 
  }

  async function loadNFTsbycat(o) {    
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
    const data = await marketContract.fetchMarketItemsbycat(o)
    
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
        name: meta.data.name,
        description: meta.data.description,
        category:meta.data.category,
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded') 
  }
  async function buyNft(nft) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {
      value: price
    })
    await transaction.wait()
    loadNFTs()
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)
  return (

    <div>
    <div className="flex justify-center">
    <div className="container mx-auto px-6 sm:px-12 flex flex-col sm:flex-row items-center relative z-10">
      
     
    </div>
    </div>

    <br/><br/><br/><br/><br/><br/><br/><br/>
    <div className="flex flex-wrap mt-0 justify-center">
        <div className="m-1">
          <a href="#" title="All Nft"
             className="md:w-32 bg-white tracking-wide text-blue-800 font-bold rounded border-2 border-blue-500 hover:blue-400 hover:bg-blue-600 hover:text-white shadow-md py-2 px-6 inline-flex items-center" onClick={() => loadNFTsbycat(1)} >
            <span className="mx-auto">All Nft</span>
          </a>
        </div>
        <div className="m-1">
          <a href="#" title="Art"
             className="md:w-32 bg-white tracking-wide text-blue-800 font-bold rounded border-2 border-blue-500 hover:blue-400 hover:bg-blue-600 hover:text-white shadow-md py-2 px-6 inline-flex items-center">
            <span className="mx-auto"  onClick={() => loadNFTsbycat(2)}>Art</span>
          </a>
        </div>
        <div className="m-1">
          <a href="/" title="Music"
             className="md:w-32 bg-white tracking-wide text-blue-800 font-bold rounded border-2 border-blue-500 hover:blue-400 hover:bg-blue-600 hover:text-white shadow-md py-2 px-6 inline-flex items-center">
            <span className="mx-auto">Music</span>
          </a>
        </div>
        <div className="m-1">
          <a href="/" title="video"
             className="md:w-32 bg-white tracking-wide text-blue-800 font-bold rounded border-2 border-blue-500 hover:blue-400 hover:bg-blue-600 hover:text-white shadow-md py-2 px-6 inline-flex items-center">
            <span className="mx-auto">video</span>
          </a>
        </div>

        <div className="m-1">
          <a href="/" title="video"
             className="md:w-32 bg-white tracking-wide text-blue-800 font-bold rounded border-2 border-blue-500 hover:blue-400 hover:bg-blue-600 hover:text-white shadow-md py-2 px-6 inline-flex items-center">
            <span className="mx-auto">video</span>
          </a>
        </div>

        <div className="m-1">
          <a href="/" title="Meme"
             className="md:w-32 bg-white tracking-wide text-blue-800 font-bold rounded border-2 border-blue-500 hover:blue-400 hover:bg-blue-600 hover:text-white shadow-md py-2 px-6 inline-flex items-center">
            <span className="mx-auto">Meme</span>
          </a>
        </div>

        <div className="m-1">
          <a href="/" title="gif"
            className="md:w-32 bg-white tracking-wide text-blue-800 font-bold rounded border-2 border-blue-500 hover:blue-400 hover:bg-blue-600 hover:text-white shadow-md py-2 px-6 inline-flex items-center">
            <span className="mx-auto">Gif</span>
          </a>
        </div>


      </div>
      
<br/> <br/> 

      
    <div className="flex justify-center ">
      <div className="shadow hover:shadow-lg transition duration-300 ease-in-out xl:mb-0 lg:mb-0 md:mb-0 mb-6 cursor-pointer group" style={{ maxWidth: '1100px'}}>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
         

            //  <div key={i} className="border shadow rounded-xl overflow-hidden">
               // <img classname ="w-full transition duration-700 ease-in-out group-hover:opacity-60" src={nft.image} />

               // <div className="p-4">
               //   <p style={{ height: '64px' }} className="text-gereen-800 font-semibold text-lg hover:text-blue-600 transition duration-300 ease-in-out">{nft.name}</p>
                //  <div style={{ height: '70px', overflow: 'hidden' }}>
//<p className="text-gereen-800 font-semibold text-lg hover:text-blue-600 transition duration-300 ease-in-out">{nft.description}</p>
                //  </div>
                //</div>

                
               //// <div className="p-4 bg-gray-500">
                ////  <p className="text-2xl mb-4 font-bold text-white">{nft.price} ETH</p>
                // // <button className="w-full bg-blue-500 text-white font-bold py-2 px-12 rounded" onClick={() => buyNft(nft)}>Buy</button>
               //// </div>
              //</div>

              <div className="w-65 " >  
            <div key={i} className="shadow hover:shadow-lg transition duration-300 ease-in-out xl:mb-0 lg:mb-0 md:mb-0 mb-6 cursor-pointer group">
                <div className="overflow-hidden relative">
                <img className="w-full h-56 transition duration-700 ease-in-out group-hover:opacity-60" src={nft.image} alt="image" />                    
            </div>
          
            <div className="px-4 py-3 bg-white">
                <a href="#" className=""><h1 className="text-gray-800 font-semibold text-lg hover:text-red-500 transition duration-300 ease-in-out">{nft.name}</h1></a>
                <a href="#" className=""><h2 className="text-gray-800 font-semibold text-lg hover:text-red-500 transition duration-300 ease-in-out">{nft.description}</h2></a>

                <a href="#" className=""><h2 className="text-gray-800 font-semibold text-lg hover:text-red-500 transition duration-300 ease-in-out">{nft.category}</h2></a>

                <div className="flex py-2">
                    <p className="mr-2 text-xs text-gray-600">{nft.price} ETH </p>
                       
                </div>
                <div className="px-4">
                 
                    <button className="w-full bg-blue-600 text-white font-bold py-2 px-12 rounded" onClick={() => buyNft(nft)}>Buy</button>
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
