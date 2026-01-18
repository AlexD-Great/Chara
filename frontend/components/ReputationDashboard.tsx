'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { TrendingUp, Award, Shield, Zap, Target, Clock } from 'lucide-react'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/config/contract'
import { ActivityFeed } from './ActivityFeed'

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

export function ReputationDashboard() {
  const [address, setAddress] = useState<string>('')
  const [isConnected, setIsConnected] = useState(false)
  const [reputation, setReputation] = useState<ReputationScore | null>(null)
  const [multiplier, setMultiplier] = useState<number>(100)
  const [interestDiscount, setInterestDiscount] = useState<number>(0)
  const [qualifiesForLoan, setQualifiesForLoan] = useState<boolean>(false)
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
        
        const [score, mult, discount, qualifies] = await Promise.all([
          contract.getReputationScore(address),
          contract.getReputationMultiplier(address),
          contract.getInterestRateDiscount(address),
          contract.qualifiesForUndercollateralizedLoan(address)
        ])
        
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
        
        setMultiplier(Number(mult))
        setInterestDiscount(Number(discount))
        setQualifiesForLoan(qualifies)
      } catch (error) {
        console.error('Error loading reputation:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  const getLevelName = (level: number): string => {
    const levels = ['Newcomer', 'Explorer', 'Participant', 'Contributor', 'Active User', 
                    'Engaged Member', 'Trusted User', 'Veteran', 'Expert', 'Master', 'Legend']
    return levels[level] || 'Unknown'
  }

  const getLevelColor = (level: number): string => {
    if (level >= 9) return 'from-yellow-400 to-orange-500'
    if (level >= 7) return 'from-purple-400 to-pink-500'
    if (level >= 5) return 'from-blue-400 to-cyan-500'
    if (level >= 3) return 'from-green-400 to-emerald-500'
    return 'from-gray-400 to-gray-500'
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

  if (loading) {
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
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold gradient-text mb-4">
            Reputation Dashboard
          </h2>
          <p className="text-white/70">
            Your on-chain reputation unlocks better rates and exclusive benefits
          </p>
        </div>

        {/* Main Score Card */}
        <div className="glass rounded-2xl p-8 border border-white/10 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center md:text-left">
              <div className="text-white/60 text-sm mb-2">Reputation Level</div>
              <div className={`text-5xl font-bold bg-gradient-to-r ${getLevelColor(reputation?.reputationLevel || 0)} bg-clip-text text-transparent mb-2`}>
                {getLevelName(reputation?.reputationLevel || 0)}
              </div>
              <div className="text-white/50 text-sm">Level {reputation?.reputationLevel || 0} / 10</div>
            </div>
            
            <div className="flex-1">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div className="text-white/60 text-sm">Total Score</div>
                  <div className="text-white font-bold">{reputation?.totalScore || 0} / 1000</div>
                </div>
                <div className="overflow-hidden h-4 text-xs flex rounded-full bg-white/10">
                  <div
                    style={{ width: `${((reputation?.totalScore || 0) / 1000) * 100}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r ${getLevelColor(reputation?.reputationLevel || 0)}`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <div>
                <div className="text-white/60 text-sm">Reward Multiplier</div>
                <div className="text-2xl font-bold text-white">{(multiplier / 100).toFixed(1)}x</div>
              </div>
            </div>
            <p className="text-white/50 text-sm">Earn {multiplier - 100}% bonus on yields and rewards</p>
          </div>

          <div className="glass rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-8 h-8 text-yellow-400" />
              <div>
                <div className="text-white/60 text-sm">Interest Discount</div>
                <div className="text-2xl font-bold text-white">{(interestDiscount / 100).toFixed(2)}%</div>
              </div>
            </div>
            <p className="text-white/50 text-sm">Save on borrowing costs with better rates</p>
          </div>

          <div className="glass rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-blue-400" />
              <div>
                <div className="text-white/60 text-sm">Loan Access</div>
                <div className="text-2xl font-bold text-white">
                  {qualifiesForLoan ? '✅' : '❌'}
                </div>
              </div>
            </div>
            <p className="text-white/50 text-sm">
              {qualifiesForLoan ? 'Qualified for undercollateralized loans' : 'Reach level 7 to unlock'}
            </p>
          </div>
        </div>

        {/* Score Breakdown and Activity Feed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Score Breakdown */}
          <div className="glass rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-purple-400" />
              Score Breakdown
            </h3>
            
            <div className="space-y-4">
              <ScoreBar label="Transaction Volume" value={reputation?.transactionVolume || 0} weight={20} />
              <ScoreBar label="Loan History" value={reputation?.loanHistory || 0} weight={25} />
              <ScoreBar label="Liquidity Provision" value={reputation?.liquidityProvision || 0} weight={20} />
              <ScoreBar label="Protocol Diversity" value={reputation?.protocolDiversity || 0} weight={15} />
              <ScoreBar label="Governance" value={reputation?.governanceScore || 0} weight={10} />
              <ScoreBar label="Account Age" value={reputation?.accountAge || 0} weight={10} />
            </div>

            {reputation?.lastUpdated && reputation.lastUpdated > 0 && (
              <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-2 text-white/50 text-sm">
                <Clock className="w-4 h-4" />
                Last updated: {new Date(reputation.lastUpdated * 1000).toLocaleDateString()}
              </div>
            )}
          </div>

          {/* Activity Feed */}
          <ActivityFeed address={address} />
        </div>
      </div>
    </section>
  )
}

function ScoreBar({ label, value, weight }: { label: string; value: number; weight: number }) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-white/70 text-sm">{label}</span>
        <span className="text-white text-sm font-semibold">{value}/100 ({weight}%)</span>
      </div>
      <div className="overflow-hidden h-3 text-xs flex rounded-full bg-white/10">
        <div
          style={{ width: `${value}%` }}
          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-500 to-pink-500"
        ></div>
      </div>
    </div>
  )
}
