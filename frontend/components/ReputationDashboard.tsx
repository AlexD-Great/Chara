'use client'

import { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { Shield, TrendingUp, Target, Clock } from 'lucide-react'
import { CONTRACT_ADDRESS, CONTRACT_ABI, HAS_CONTRACT_CONFIG } from '@/config/contract'
import { ActivityFeed } from './ActivityFeed'
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

const LEVELS = ['Newcomer', 'Explorer', 'Participant', 'Contributor', 'Active User', 'Engaged Member', 'Trusted User', 'Veteran', 'Expert', 'Master', 'Legend']

export function ReputationDashboard() {
  const [address, setAddress] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [reputation, setReputation] = useState<ReputationScore | null>(null)
  const [multiplier, setMultiplier] = useState(100)
  const [interestDiscount, setInterestDiscount] = useState(0)
  const [qualifiesForLoan, setQualifiesForLoan] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activityCount, setActivityCount] = useState(0)
  const [error, setError] = useState('')

  const checkConnection = async () => {
    if (!window.ethereum) return
    const accounts = await window.ethereum.request({ method: 'eth_accounts' })
    if (accounts.length) {
      setAddress(accounts[0])
      setIsConnected(true)
    }
  }

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('MetaMask not detected.')
      return
    }
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    setAddress(accounts[0])
    setIsConnected(true)
  }

  const loadReputationData = useCallback(async () => {
    if (!window.ethereum) return
    setLoading(true)
    setError('')
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
      setQualifiesForLoan(Boolean(qualifies))
    } catch (err: any) {
      setError(err.message || 'Unable to load reputation data')
    } finally {
      setLoading(false)
    }
  }, [address])

  const handleActivityLoaded = useCallback((payload: { activityCount: number }) => {
    setActivityCount(payload.activityCount)
  }, [])

  useEffect(() => {
    checkConnection()
  }, [])

  useEffect(() => {
    if (address && HAS_CONTRACT_CONFIG) {
      loadReputationData()
    }
  }, [address, loadReputationData])

  if (!HAS_CONTRACT_CONFIG) {
    return (
      <section id="dashboard" className="py-14 px-4">
        <div className="max-w-6xl mx-auto glass rounded-2xl p-8 border border-cyan-100/15">
          <h2 className="text-3xl font-bold">Reputation Dashboard</h2>
          <p className="text-slate-200/75 mt-2">Set `NEXT_PUBLIC_CONTRACT_ADDRESS` in your frontend environment to enable live contract reads.</p>
        </div>
      </section>
    )
  }

  if (!isConnected) {
    return (
      <section id="dashboard" className="py-14 px-4">
        <div className="max-w-6xl mx-auto glass rounded-2xl p-10 text-center border border-cyan-100/15 reveal">
          <Shield className="w-12 h-12 mx-auto text-cyan-200 mb-3" />
          <h2 className="text-4xl font-bold">Reputation Dashboard</h2>
          <p className="text-slate-200/75 mt-2 mb-6">Connect your wallet to load your on-chain reputation profile.</p>
          <button onClick={connectWallet} className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-300 to-emerald-300 text-slate-950 font-bold">
            Connect Wallet
          </button>
          {error && <p className="text-red-200 text-sm mt-3">{error}</p>}
        </div>
      </section>
    )
  }

  return (
    <section id="dashboard" className="py-14 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-4xl font-bold">Reputation Dashboard</h2>
          <p className="text-slate-200/75 mt-2">Track score, rewards, and live protocol activity for {address.slice(0, 6)}...{address.slice(-4)}.</p>
        </div>

        {loading && <div className="glass rounded-2xl p-6 mb-6">Loading reputation data...</div>}
        {error && !loading && <div className="glass rounded-2xl p-6 mb-6 text-red-200">{error}</div>}

        <div className="glass rounded-2xl p-7 mb-6 border border-cyan-100/15">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Metric title="Level" value={LEVELS[reputation?.reputationLevel || 0]} subtitle={`Level ${reputation?.reputationLevel || 0} / 10`} />
            <Metric title="Multiplier" value={`${(multiplier / 100).toFixed(1)}x`} subtitle="Rewards boost" />
            <Metric title="Interest Discount" value={`${(interestDiscount / 100).toFixed(2)}%`} subtitle={qualifiesForLoan ? 'Undercollateralized: eligible' : 'Undercollateralized: locked'} />
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2 text-sm text-slate-300/75">
              <span>Total Score</span>
              <span>{reputation?.totalScore || 0} / 1000</span>
            </div>
            <div className="h-3 rounded-full bg-slate-900/65 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-300 to-emerald-300" style={{ width: `${((reputation?.totalScore || 0) / 1000) * 100}%` }} />
            </div>
            {reputation?.lastUpdated ? (
              <div className="mt-3 text-xs text-slate-300/70 inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Last updated {new Date(reputation.lastUpdated * 1000).toLocaleString()}
              </div>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6 border border-cyan-100/15">
            <h3 className="text-2xl font-bold mb-5 inline-flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-200" />
              Score Breakdown
            </h3>
            <div className="space-y-3">
              <ScoreBar label="Transaction Volume" value={reputation?.transactionVolume || 0} />
              <ScoreBar label="Loan History" value={reputation?.loanHistory || 0} />
              <ScoreBar label="Liquidity Provision" value={reputation?.liquidityProvision || 0} />
              <ScoreBar label="Protocol Diversity" value={reputation?.protocolDiversity || 0} />
              <ScoreBar label="Governance" value={reputation?.governanceScore || 0} />
              <ScoreBar label="Account Age" value={reputation?.accountAge || 0} />
            </div>
          </div>
          <ActivityFeed address={address} onLoaded={handleActivityLoaded} />
        </div>

        <div className="mt-6">
          <Achievements reputation={reputation} activityCount={activityCount} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Analytics reputation={reputation} />
          <Leaderboard currentUserAddress={address} currentUserScore={reputation?.totalScore} />
        </div>
      </div>
    </section>
  )
}

function Metric({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return (
    <div className="rounded-xl border border-cyan-100/15 bg-slate-900/35 p-4">
      <div className="text-sm text-slate-300/70">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      <div className="text-xs text-slate-300/70 mt-1">{subtitle}</div>
    </div>
  )
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-slate-200/75">{label}</span>
        <span>{value}/100</span>
      </div>
      <div className="h-2.5 rounded-full bg-slate-900/65 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-cyan-300 to-emerald-300" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}
