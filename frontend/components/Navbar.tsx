'use client'

import { useWeb3Modal } from '@web3modal/react'
import { useAccount, useDisconnect } from 'wagmi'
import { Sparkles } from 'lucide-react'

export function Navbar() {
  const { open } = useWeb3Modal()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

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
                  <span className="text-sm text-white">{formatAddress(address!)}</span>
                </div>
                <button
                  onClick={() => disconnect()}
                  className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg border border-red-500/30 text-white transition"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={() => open()}
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
