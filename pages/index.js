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
    loadNFTs();
  }, []);
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
    if (data.length === 0){
      var items =[]
    }

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let categoryname= await marketContract.getcategory(meta.data.category)
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
        category:meta.data.category,
        categoryn:categoryname
      }
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
    const data = await marketContract.getItemsByCategory(o)
    console.log('category: ', o)
    console.log('data: ', data)
    
    
   
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
 
  if (loadingState === 'loaded' && !nfts.length) return
   (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)

  return (

    <div>
    <div className="flex justify-center">
    <div className="container mx-auto px-6 sm:px-12 flex flex-col sm:flex-row items-center relative z-10">
      
     
    </div>
    </div>

    <div className="bg-black text-white py-20">
		<div className="container mx-auto flex flex-col md:flex-row items-center my-12 md:my-24">
			<div className="flex flex-col w-full lg:w-1/3 justify-center items-start p-8">
				<h1 className="text-3xl md:text-5xl p-2 text-yellow-300 tracking-loose">SPACE ART </h1>
				<h2 className="text-3xl md:text-5xl leading-relaxed md:leading-snug mb-2">Collect and trade on Space NFT ART
				</h2>
				<p className="text-sm md:text-base text-gray-50 mb-4">Buy and sell NFTs from the world’s top artists.</p>
				<a href="/"
					className="bg-transparent hover:bg-yellow-300 text-yellow-300 hover:text-black rounded shadow hover:shadow-lg py-2 px-4 border border-yellow-300 hover:border-transparent">
					Explore Now</a>
			</div>
			<div className="p-8 mt-12 mb-6 md:mb-0 md:mt-0 ml-0 md:ml-12 lg:w-2/3  justify-center">
				<div className="h-48 flex flex-wrap content-center">
					<div>
						<img className="inline-block mt-28 hidden xl:block" src="https://raw.githubusercontent.com/samar19/pic-/master/bb2.png"/></div>
						<div>
							<img className="inline-block mt-24 md:mt-0 p-8 md:p-0"  src="https://raw.githubusercontent.com/samar19/pic-/master/b1.png"/></div>
							<div>
								<img className="inline-block mt-28 hidden lg:block" src="https://raw.githubusercontent.com/samar19/pic-/master/bb3.png"/></div>
							</div>
						</div>
					</div>
				</div>


    <br/>
    <div className="flex flex-wrap mt-0 justify-center">
        <div className="m-1">
          <a href="#" title="All Nft"
             className="md:w-32 bg-white tracking-wide text-green-800 font-bold rounded border-2 border-green-500 hover:green-400 hover:bg-green-600 hover:text-white shadow-md py-2 px-6 inline-flex items-center" onClick={() => loadNFTs()} >
            <span className="mx-auto">All Nft</span>
          </a>
        </div>
        <div className="m-1">
          <a href="#" title="Art"
             className="md:w-32 bg-white tracking-wide text-green-800 font-bold rounded border-2 border-green-500 hover:green-400 hover:bg-green-600 hover:text-white shadow-md py-2 px-6 inline-flex items-center">
            <span className="mx-auto"  onClick={() => loadNFTsbycat(1)}>Art</span>
          </a>
        </div>
        <div className="m-1">
          <a href="#" title="Music"
             className="md:w-32 bg-white tracking-wide text-green-800 font-bold rounded border-2 border-green-500 hover:green-400 hover:bg-green-600 hover:text-white shadow-md py-2 px-6 inline-flex items-center">
            <span className="mx-auto" onClick={() => loadNFTsbycat(2)}>Music</span>
          </a>
        </div>
        <div className="m-1">
          <a href="#" title="video"
             className="md:w-32 bg-white tracking-wide text-green-800 font-bold rounded border-2 border-green-500 hover:green-400 hover:bg-green-600 hover:text-white shadow-md py-2 px-6 inline-flex items-center">
            <span className="mx-auto" onClick={() => loadNFTsbycat(3)}>video</span>
          </a>
        </div>

        

        <div className="m-1">
          <a href="#" title="Meme"
             className="md:w-32 bg-white tracking-wide text-green-800 font-bold rounded border-2 border-green-500 hover:green-400 hover:bg-green-600 hover:text-white shadow-md py-2 px-6 inline-flex items-center">
            <span className="mx-auto" onClick={() => loadNFTsbycat(4)}>Meme</span>
          </a>
        </div>

        <div className="m-1">
          <a href="#" title="gif"
            className="md:w-32 bg-white tracking-wide text-green-800 font-bold rounded border-2 border-green-500 hover:green-400 hover:bg-green-600 hover:text-white shadow-md py-2 px-6 inline-flex items-center">
            <span className="mx-auto" onClick={() => loadNFTsbycat(5)}>Gif</span>
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
                <a href="#" className="">
                  <h2 className="text-gray-800 font-semibold text-lg hover:text-red-500 transition duration-300 ease-in-out">{nft.description}</h2></a>

                  <a href="#" className=""><h2 className="text-gray-800 font-semibold text-lg hover:text-red-500 transition duration-300 ease-in-out">{nft.categoryn}</h2></a>

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