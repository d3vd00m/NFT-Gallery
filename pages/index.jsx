import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import NFTCard from "./components/nftCard"

const Home = () => {
  // Create Two Variables to Store Wallet and Collection Addresses
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  // Create a new useState() variable to store the NFTs fetched by using the Alchemy NFT API:
  const [NFTs, setNFTs] = useState([]);
  // Create a new useState() variable to verify if the checkbox is activated
  // (check if you want to search by collection (true) or wallet address (false))
  const [fetchForCollection, setFetchForCollection] = useState(false);

  // Create the fetchNFTs function to get the NFTs owned by a wallet address
  // by using the getNFTs endpoint of the Alchemy NFT API.
  const fetchNFTs = async () => {
    let nfts;
    console.log("fetching nfts");
    // const api_key = "Your Alchemy API KEY"
    // const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTs/`;
    // We use .env.local file instead for the baseURL
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_API_KEY}/getNFTs/`;

    // If collection address is NOT provided => the API will retrieve all the NFTs owned by the 
    // provided wallet address.
    if (!collection.length) {
      var requestOptions = {
        method: 'GET'
      };

      const fetchURL = `${baseURL}?owner=${wallet}`;
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())

      // If collection address is provided => the NFT API will filter the fetched NFTs by collection 
    } else {
      console.log("fetching nfts for collection owned by address")
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    }

    // Inside the fetched object you have more info than you need.
    // We only need the array containing the NFTs owned by the wallet.
    // To do that in the setNFTs() function you're feeding nfts.ownedNfts and not just nfts.
    if (nfts) {
      console.log("nfts:", nfts)
      setNFTs(nfts.ownedNfts)
    }

  }

  // Create the fetchNFTs by collection function to get the NFTs for collection
  // by using getNFTsForCollection Alchemy endpoint.

  const fetchNFTsForCollection = async () => {
    if (collection.length) {
      var requestOptions = {
        method: 'GET'
      };
      // const api_key = "Your Alchemy API KEY"
      // const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTsForCollection/`;
      // We use .env.local file instead for the baseURL
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_API_KEY}/getNFTsForCollection/`;
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}`;
      const nfts = await fetch(fetchURL, requestOptions).then(data => data.json())

      if (nfts) {
        console.log("NFTs in collection:", nfts)
        setNFTs(nfts.nfts)
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input disabled={fetchForCollection} className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" onChange={(e) => { setWalletAddress(e.target.value) }} value={wallet} type={"text"} placeholder="Add your wallet address"></input>
        <input className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" onChange={(e) => { setCollectionAddress(e.target.value) }} value={collection} type={"text"} placeholder="Add the collection address"></input>
        <label className="text-gray-600 "><input onChange={(e) => { setFetchForCollection(e.target.checked) }} type={"checkbox"} className="mr-2"></input>Fetch for collection</label>
        <button className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"} onClick={
          () => {
            if (fetchForCollection) {
              fetchNFTsForCollection()
            } else fetchNFTs()
          }
        }>Let's go! </button>
      </div>
      <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
        {
          NFTs.length && NFTs.map(nft => {
            return (
              <NFTCard nft={nft}></NFTCard>
            )
          })
        }
      </div>
    </div>
  )
}

export default Home