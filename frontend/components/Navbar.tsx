'use client'

import { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'

declare global {
  interface Window {
    ethereum?: any
  }
}

export function Navbar() {
  const [address, setAddress] = useState<string>('')
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    checkConnection()
  }, [])

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

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        })
        setAddress(accounts[0])
        setIsConnected(true)
        
        // Switch to localhost network
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x7A69' }], // 31337 in hex
          })
        } catch (switchError: any) {
          // If network doesn't exist, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x7A69',
                chainName: 'Hardhat Local',
                nativeCurrency: {
                  name: 'Ether',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: ['http://127.0.0.1:8545'],
              }],
            })
          }
        }
      } catch (error) {
        console.error('Error connecting wallet:', error)
        alert('Please install MetaMask!')
      }
    } else {
      alert('Please install MetaMask!')
    }
  }

  const disconnectWallet = () => {
    setAddress('')
    setIsConnected(false)
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold gradient-text">Chara</span>
          </div>

          <div className="flex items-center space-x-4">
            <a href="#mint" className="text-white/80 hover:text-white transition">
              Mint
            </a>
            <a href="#features" className="text-white/80 hover:text-white transition">
              Features
            </a>
            <a href="#about" className="text-white/80 hover:text-white transition">
              About
            </a>

            {isConnected ? (
              <div className="flex items-center space-x-2">
                <div className="px-4 py-2 bg-purple-600/20 rounded-lg border border-purple-500/30">
                  <span className="text-sm text-white">{formatAddress(address)}</span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg border border-red-500/30 text-white transition"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white font-semibold transition transform hover:scale-105"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
