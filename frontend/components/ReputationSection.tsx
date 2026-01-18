'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Shield } from 'lucide-react'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/config/contract'
import { ReputationDashboard } from './ReputationDashboard'
import { Achievements } from './Achievements'
import { Analytics } from './Analytics'
import { Leaderboard } from './Leaderboard'

declare global {
  interface Window {
    ethereum?: any
  }
}

interface ReputationScore {
  transactionVolume: number
  loanHistory: number
  liquidityProvision: number
  protocolDiversity: number
  governanceScore: number
  accountAge: number
  totalScore: number
  reputationLevel: number
  lastUpdated: number
}

export function ReputationSection() {
  const [address, setAddress] = useState<string>('')
  const [isConnected, setIsConnected] = useState(false)
  const [reputation, setReputation] = useState<ReputationScore | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkConnection()
  }, [])

  useEffect(() => {
    if (address) {
      loadReputationData()
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

  const loadReputationData = async () => {
    if (typeof window.ethereum !== 'undefined' && address) {
      setLoading(true)
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
        
        const score = await contract.getReputationScore(address)
        
        setReputation({
          transactionVolume: Number(score.transactionVolume),
          loanHistory: Number(score.loanHistory),
          liquidityProvision: Number(score.liquidityProvision),
          protocolDiversity: Number(score.protocolDiversity),
          governanceScore: Number(score.governanceScore),
          accountAge: Number(score.accountAge),
          totalScore: Number(score.totalScore),
          reputationLevel: Number(score.reputationLevel),
          lastUpdated: Number(score.lastUpdated)
        })
      } catch (error) {
        console.error('Error loading reputation:', error)
      } finally {
        setLoading(false)
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
      } catch (error) {
        console.error('Error connecting wallet:', error)
      }
    }
  }

  if (!isConnected) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="glass rounded-2xl p-12 border border-white/10 text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 text-purple-400" />
            <h2 className="text-3xl font-bold gradient-text mb-4">
              Your Reputation Dashboard
            </h2>
            <p className="text-white/70 mb-8">
              Connect your wallet to view your DeFi reputation score and unlock benefits
            </p>
            <button
              onClick={connectWallet}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white font-semibold transition transform hover:scale-105"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (loading && !reputation) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="glass rounded-2xl p-12 border border-white/10 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-white/70">Loading your reputation...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <ReputationDashboard 
        address={address}
        reputation={reputation}
        isConnected={isConnected}
        loading={loading}
      />
      
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <Achievements reputation={reputation} activityCount={1} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Analytics reputation={reputation} />
            <Leaderboard 
              currentUserAddress={address}
              currentUserScore={reputation?.totalScore}
            />
          </div>
        </div>
      </section>
    </>
  )
}
