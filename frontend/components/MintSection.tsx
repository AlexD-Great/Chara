'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Loader2, CheckCircle, XCircle, Sparkles } from 'lucide-react'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/config/contract'

declare global {
  interface Window {
    ethereum?: any
  }
}

export function MintSection() {
  const [address, setAddress] = useState<string>('')
  const [isConnected, setIsConnected] = useState(false)
  const [isMinting, setIsMinting] = useState(false)
  const [txHash, setTxHash] = useState<string>('')
  const [mintPrice, setMintPrice] = useState<string>('0.001')
  const [totalMinted, setTotalMinted] = useState<number>(0)
  const [maxSupply, setMaxSupply] = useState<number>(10000)
  const [mintingActive, setMintingActive] = useState<boolean>(true)
  const [numberMinted, setNumberMinted] = useState<number>(0)
  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')

  useEffect(() => {
    checkConnection()
    loadContractData()
  }, [])

  useEffect(() => {
    if (address) {
      loadUserData()
    }
  }, [address])

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setAddress(accounts[0])
          setIsConnected(true)
        }
      } catch (error) {
        console.error('Error checking connection:', error)
      }
    }
  }

  const loadContractData = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
        
        const [price, minted, supply, active] = await Promise.all([
          contract.mintPrice(),
          contract.totalMinted(),
          contract.maxSupply(),
          contract.mintingActive()
        ])
        
        setMintPrice(ethers.formatEther(price))
        setTotalMinted(Number(minted))
        setMaxSupply(Number(supply))
        setMintingActive(active)
      } catch (error) {
        console.error('Error loading contract data:', error)
      }
    }
  }

  const loadUserData = async () => {
    if (typeof window.ethereum !== 'undefined' && address) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
        
        const minted = await contract.numberMinted(address)
        setNumberMinted(Number(minted))
      } catch (error) {
        console.error('Error loading user data:', error)
      }
    }
  }

  const handleMint = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first!')
      return
    }

    if (!mintingActive) {
      alert('Minting is not active!')
      return
    }

    try {
      setIsMinting(true)
      setTxStatus('pending')
      
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
      
      const price = await contract.mintPrice()
      const tx = await contract.mint({ value: price })
      
      setTxHash(tx.hash)
      
      await tx.wait()
      
      setTxStatus('success')
      setIsMinting(false)
      
      // Reload data
      await loadContractData()
      await loadUserData()
      
    } catch (error: any) {
      console.error('Mint error:', error)
      setTxStatus('error')
      setIsMinting(false)
      alert(`Minting failed: ${error.message || 'Unknown error'}`)
    }
  }

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        })
        setAddress(accounts[0])
        setIsConnected(true)
        
        // Switch to Polygon Amoy testnet
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x13882' }], // 80002 in hex
          })
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x13882',
                chainName: 'Polygon Amoy Testnet',
                nativeCurrency: {
                  name: 'POL',
                  symbol: 'POL',
                  decimals: 18
                },
                rpcUrls: ['https://rpc-amoy.polygon.technology'],
                blockExplorers: [{
                  name: 'PolygonScan',
                  url: 'https://amoy.polygonscan.com'
                }]
              }],
            })
          }
        }
        
        await loadUserData()
      } catch (error) {
        console.error('Error connecting wallet:', error)
        alert('Please install MetaMask!')
      }
    } else {
      alert('Please install MetaMask!')
    }
  }

  return (
    <section id="mint" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="glass rounded-2xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold gradient-text mb-4">
              Mint Your Chara
            </h2>
            <p className="text-white/70">
              Create your evolving digital identity on Polygon
            </p>
          </div>

          {/* Contract Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-purple-600/10 rounded-lg p-4 border border-purple-500/20">
              <div className="text-white/60 text-sm mb-1">Mint Price</div>
              <div className="text-2xl font-bold text-white">{mintPrice} POL</div>
            </div>
            <div className="bg-purple-600/10 rounded-lg p-4 border border-purple-500/20">
              <div className="text-white/60 text-sm mb-1">Minted</div>
              <div className="text-2xl font-bold text-white">{totalMinted} / {maxSupply}</div>
            </div>
            <div className="bg-purple-600/10 rounded-lg p-4 border border-purple-500/20">
              <div className="text-white/60 text-sm mb-1">Status</div>
              <div className="text-2xl font-bold text-white">
                {mintingActive ? '✅ Active' : '❌ Inactive'}
              </div>
            </div>
          </div>

          {/* User Stats */}
          {isConnected && (
            <div className="bg-blue-600/10 rounded-lg p-4 border border-blue-500/20 mb-6">
              <div className="text-white/60 text-sm mb-1">Your Minted</div>
              <div className="text-xl font-bold text-white">{numberMinted} Chara NFTs</div>
            </div>
          )}

          {/* Mint Button */}
          <div className="space-y-4">
            {!isConnected ? (
              <button
                onClick={connectWallet}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white font-semibold text-lg transition transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>Connect Wallet to Mint</span>
              </button>
            ) : (
              <button
                onClick={handleMint}
                disabled={isMinting || !mintingActive}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white font-semibold text-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {isMinting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Minting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Mint Now</span>
                  </>
                )}
              </button>
            )}

            {/* Transaction Status */}
            {txStatus === 'pending' && txHash && (
              <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4 flex items-start space-x-3">
                <Loader2 className="w-5 h-5 text-blue-400 animate-spin flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-white font-semibold mb-1">Transaction Pending</div>
                  <div className="text-white/60 text-sm break-all">
                    Hash: {txHash}
                  </div>
                </div>
              </div>
            )}

            {txStatus === 'success' && (
              <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4 flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-white font-semibold mb-1">Minting Successful!</div>
                  <div className="text-white/60 text-sm">
                    Your Chara NFT has been minted successfully!
                  </div>
                  {txHash && (
                    <div className="text-white/40 text-xs mt-2 break-all">
                      TX: {txHash}
                    </div>
                  )}
                </div>
              </div>
            )}

            {txStatus === 'error' && (
              <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-4 flex items-start space-x-3">
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-white font-semibold mb-1">Minting Failed</div>
                  <div className="text-white/60 text-sm">
                    Please try again or check your wallet.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="mt-6 text-center text-white/50 text-sm">
            <p>Contract: {CONTRACT_ADDRESS.slice(0, 6)}...{CONTRACT_ADDRESS.slice(-4)}</p>
            <p className="mt-1">Network: Polygon Amoy Testnet (Chain ID: 80002)</p>
          </div>
        </div>
      </div>
    </section>
  )
}
