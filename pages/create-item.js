import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'


const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({
     price: '',
      name: '',
       description: '',
       category:'' })
  const router = useRouter()

  async function onChange(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }
  async function createMarket() {
    const { name, description, price ,category} = formInput
    if (!name || !description || !price || !fileUrl||!category) return
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl, category: category
    })
    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      createSale(url, category)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function createSale(url, category) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner();
    
    /* next, create the item */
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
    let transaction = await contract.createToken(url)
    let tx = await transaction.wait()
    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()

    const price = ethers.utils.parseUnits(formInput.price, 'ether')
  
    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()

    transaction = await contract.createMarketItem(nftaddress,
       tokenId, category, price, { value: listingPrice })
    await transaction.wait()
    router.push('/')
  }
 
  return (
    <div>

      
        <img src="https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=2710&amp;q=80" alt=""/>
      <br/>
      <section className=" py-1 bg-blueGray-50">
      <div className="w-full lg:w-8/12 px-4 mx-auto mt-6">
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
      <div className="rounded-t bg-gray-100 mb-0 px-6 py-6">
     <div className="text-center flex justify-between">
     <h6 className="text-blueGray-700 text-xl font-bold">
        Create New Item
      </h6>  
    </div>   
  </div>
  <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
      <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
     
        <input 
          placeholder="Name"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
           <select className="mt-8 border rounded p-4" name="category" id="category" 
       onChange={e => updateFormInput({ ...formInput, category: e.target.value })}>
                  <option value="">Select a category</option>
                  <option value="0">All Nft</option>
                  <option value="1">Art</option>
                  <option value="2">Music</option>
                  <option value="3">Video</option>
                  <option value="4">Meme</option>
                  <option value="5">Gif</option>
         </select>
        <textarea
          placeholder=" Description"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        <input
          type="file"
          name="Asset"
          className="my-4"
          onChange={onChange}
        />
        {
          fileUrl && (
            <img className="rounded mt-4" width="350" src={fileUrl} />
          )
        }
         
        <button onClick={
          createMarket} className="font-bold mt-4 bg-blue-500 text-white rounded p-4 shadow-lg">
          Submit
        </button>
      </div>
    </div>
     
      
</div>

</div>

</div>
</section>
    </div>
  )
}