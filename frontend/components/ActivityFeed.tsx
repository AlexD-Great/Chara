'use client'

import { useState, useEffect } from 'react'
import { Activity, TrendingUp, Droplet, Vote, ArrowUpRight, ArrowDownLeft, ExternalLink } from 'lucide-react'
import { BACKEND_URL } from '@/lib/api'

interface ActivityItem {
  txHash: string
  timestamp: number
  blockNumber: number
  type?: string
  value?: number
  protocolAddress?: string
  protocolName?: string | null
}

interface WalletActivity {
  address: string
  recentActivities: ActivityItem[]
  protocols: string[]
}

function activityIcon(type?: string) {
  if (type === 'swap') return <TrendingUp className="w-4 h-4" />
  if (type === 'liquidity') return <Droplet className="w-4 h-4" />
  if (type === 'governance') return <Vote className="w-4 h-4" />
  if (type === 'borrow') return <ArrowUpRight className="w-4 h-4" />
  if (type === 'repay') return <ArrowDownLeft className="w-4 h-4" />
  return <Activity className="w-4 h-4" />
}

function activityColor(type?: string) {
  if (type === 'swap') return 'text-cyan-200 bg-cyan-300/10 border-cyan-300/25'
  if (type === 'liquidity') return 'text-indigo-200 bg-indigo-300/10 border-indigo-300/25'
  if (type === 'governance') return 'text-emerald-200 bg-emerald-300/10 border-emerald-300/25'
  if (type === 'borrow' || type === 'repay') return 'text-amber-200 bg-amber-300/10 border-amber-300/25'
  return 'text-slate-200 bg-slate-300/10 border-slate-300/25'
}

function timeAgo(timestamp: number) {
  const diff = Date.now() - timestamp
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'Just now'
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  return `${Math.floor(hr / 24)}d ago`
}

export function ActivityFeed({
  address,
  onLoaded
}: {
  address: string
  onLoaded?: (payload: { activityCount: number; protocolCount: number }) => void
}) {
  const [activity, setActivity] = useState<WalletActivity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [monitored, setMonitored] = useState(false)

  useEffect(() => {
    if (!address) return

    const fetchActivity = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/wallet/${address}/activity`)
        if (response.status === 404) {
          setMonitored(false)
          setError('Wallet not monitored yet')
          return
        }
        if (!response.ok) throw new Error('Failed to fetch wallet activity')
        const payload = await response.json()
        setActivity(payload)
        setMonitored(true)
        setError('')
        onLoaded?.({
          activityCount: payload.recentActivities?.length || 0,
          protocolCount: payload.protocols?.length || 0
        })
      } catch (err: any) {
        setError(err.message || 'Failed to load activity')
      } finally {
        setLoading(false)
      }
    }

    fetchActivity()
    const timer = setInterval(fetchActivity, 15000)
    return () => clearInterval(timer)
  }, [address, onLoaded])

  const startMonitoring = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${BACKEND_URL}/api/wallet/${address}/monitor`, { method: 'POST' })
      if (!response.ok) throw new Error('Unable to start monitoring')
      setError('')
      setMonitored(true)
    } catch (err: any) {
      setError(err.message || 'Unable to start monitoring')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass rounded-2xl p-6 border border-cyan-100/15">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-200" />
          <h3 className="text-xl font-bold">Recent Activity</h3>
        </div>
        {monitored && <span className="text-xs px-2 py-1 rounded-full bg-emerald-400/15 text-emerald-100">LIVE</span>}
      </div>

      {loading && !activity && <div className="text-slate-300/70 text-sm">Loading activity...</div>}

      {!loading && error === 'Wallet not monitored yet' && (
        <div className="rounded-xl border border-cyan-200/15 bg-cyan-200/5 p-4">
          <p className="text-slate-200/80 text-sm mb-3">Start monitoring to track live DeFi interactions for this wallet.</p>
          <button onClick={startMonitoring} className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-300 to-emerald-300 text-slate-950 font-semibold text-sm">
            Start Monitoring
          </button>
        </div>
      )}

      {!loading && error && error !== 'Wallet not monitored yet' && <div className="text-red-200 text-sm">{error}</div>}

      {activity && activity.recentActivities.length > 0 && (
        <div className="space-y-3">
          {activity.recentActivities.slice(0, 12).map((item) => (
            <div key={`${item.txHash}-${item.blockNumber}`} className={`rounded-xl border p-3 ${activityColor(item.type)}`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-950/35 flex items-center justify-center">{activityIcon(item.type)}</div>
                  <div className="min-w-0">
                    <div className="capitalize font-semibold">{item.type || 'activity'}</div>
                    <div className="text-xs opacity-80 truncate">{item.protocolName || item.protocolAddress || 'Protocol detected'}</div>
                  </div>
                </div>
                <div className="text-xs opacity-80 whitespace-nowrap">{timeAgo(item.timestamp)}</div>
              </div>
              <div className="mt-2 text-xs flex items-center justify-between">
                <span>Block #{item.blockNumber}</span>
                <a href={`https://amoy.polygonscan.com/tx/${item.txHash}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline">
                  View <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {activity && activity.recentActivities.length === 0 && (
        <div className="text-slate-300/70 text-sm">No tracked DeFi transactions yet for this wallet.</div>
      )}
    </div>
  )
}
