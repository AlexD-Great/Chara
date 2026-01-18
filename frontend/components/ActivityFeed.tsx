'use client'

import { useState, useEffect } from 'react'
import { Activity, TrendingUp, Droplet, Vote, ArrowUpRight, ExternalLink } from 'lucide-react'

interface ActivityItem {
  txHash: string
  timestamp: number
  blockNumber: number
  type?: string
  value?: number
}

interface WalletActivity {
  address: string
  metrics: {
    transactionVolume: number
    loanHistory: number
    liquidityProvision: number
    protocolDiversity: number
    governanceParticipation: number
    accountAge: number
  }
  recentActivities: ActivityItem[]
  firstSeen: number
  lastActivity: number
  protocols: string[]
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'swap':
      return <TrendingUp className="w-4 h-4" />
    case 'lp':
      return <Droplet className="w-4 h-4" />
    case 'governance':
      return <Vote className="w-4 h-4" />
    default:
      return <Activity className="w-4 h-4" />
  }
}

const getActivityColor = (type: string) => {
  switch (type) {
    case 'swap':
      return 'text-blue-400 bg-blue-500/10 border-blue-500/30'
    case 'lp':
      return 'text-purple-400 bg-purple-500/10 border-purple-500/30'
    case 'governance':
      return 'text-green-400 bg-green-500/10 border-green-500/30'
    default:
      return 'text-gray-400 bg-gray-500/10 border-gray-500/30'
  }
}

const formatTimestamp = (timestamp: number) => {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

export function ActivityFeed({ address }: { address: string }) {
  const [activity, setActivity] = useState<WalletActivity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMonitored, setIsMonitored] = useState(false)

  useEffect(() => {
    if (!address) return

    const fetchActivity = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/wallet/${address}/activity`)
        
        if (response.status === 404) {
          setIsMonitored(false)
          setError('Wallet not monitored')
          setLoading(false)
          return
        }

        if (!response.ok) {
          throw new Error('Failed to fetch activity')
        }

        const data = await response.json()
        setActivity(data)
        setIsMonitored(true)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load activity')
      } finally {
        setLoading(false)
      }
    }

    fetchActivity()
    const interval = setInterval(fetchActivity, 10000)

    return () => clearInterval(interval)
  }, [address])

  const handleStartMonitoring = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${BACKEND_URL}/api/wallet/${address}/monitor`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to start monitoring')
      }

      setIsMonitored(true)
      setError(null)
      
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start monitoring')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !activity) {
    return (
      <div className="glass rounded-2xl p-6 border border-white/10">
        <div className="flex items-center space-x-2 mb-4">
          <Activity className="w-5 h-5 text-purple-400" />
          <h3 className="text-xl font-bold text-white">Recent Activity</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      </div>
    )
  }

  if (error === 'Wallet not monitored') {
    return (
      <div className="glass rounded-2xl p-6 border border-white/10">
        <div className="flex items-center space-x-2 mb-4">
          <Activity className="w-5 h-5 text-purple-400" />
          <h3 className="text-xl font-bold text-white">Recent Activity</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-white/60 mb-4">
            Your wallet is not being monitored yet. Start monitoring to track your DeFi activity in real-time.
          </p>
          <button
            onClick={handleStartMonitoring}
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white font-semibold transition transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? 'Starting...' : 'Start Monitoring'}
          </button>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass rounded-2xl p-6 border border-white/10">
        <div className="flex items-center space-x-2 mb-4">
          <Activity className="w-5 h-5 text-purple-400" />
          <h3 className="text-xl font-bold text-white">Recent Activity</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-purple-400" />
          <h3 className="text-xl font-bold text-white">Recent Activity</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-white/60">Live</span>
        </div>
      </div>

      {activity && activity.recentActivities.length > 0 ? (
        <div className="space-y-3">
          {activity.recentActivities.map((item, index) => (
            <div
              key={item.txHash || index}
              className={`flex items-center justify-between p-4 rounded-lg border ${getActivityColor(item.type || 'default')}`}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-white/5">
                  {getActivityIcon(item.type || 'default')}
                </div>
                <div>
                  <p className="text-white font-medium capitalize">
                    {item.type || 'DeFi Activity'}
                  </p>
                  <p className="text-sm text-white/60">
                    Block #{item.blockNumber?.toLocaleString() || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-white/60">
                  {formatTimestamp(item.timestamp)}
                </span>
                <a
                  href={`https://amoy.polygonscan.com/tx/${item.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 transition"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Activity className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <p className="text-white/60 mb-2">No activity detected yet</p>
          <p className="text-sm text-white/40">
            Make some swaps, provide liquidity, or participate in governance to see your activity here
          </p>
        </div>
      )}

      {activity && activity.protocols.length > 0 && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-sm text-white/60 mb-2">Active Protocols</p>
          <div className="flex flex-wrap gap-2">
            {activity.protocols.slice(0, 5).map((protocol, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-xs text-purple-300"
              >
                {protocol.slice(0, 8)}...{protocol.slice(-6)}
              </span>
            ))}
            {activity.protocols.length > 5 && (
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/60">
                +{activity.protocols.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
