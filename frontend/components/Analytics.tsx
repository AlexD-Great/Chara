'use client'

import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { BarChart3, Activity, Users, Layers } from 'lucide-react'
import { fetchAnalytics, type AnalyticsResponse } from '@/lib/api'

interface AnalyticsProps {
  reputation: {
    totalScore: number
    reputationLevel: number
  } | null
}

export function Analytics({ reputation }: AnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const payload = await fetchAnalytics()
        setAnalytics(payload)
      } catch (err: any) {
        setError(err.message || 'Failed to load analytics')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const maxLevelCount = useMemo(() => {
    if (!analytics?.levelDistribution?.length) return 1
    return Math.max(1, ...analytics.levelDistribution.map((row) => row.count))
  }, [analytics])

  return (
    <div className="glass rounded-2xl p-6 border border-cyan-100/15">
      <div className="flex items-center gap-2 mb-5">
        <BarChart3 className="w-5 h-5 text-cyan-200" />
        <h3 className="text-2xl font-bold">Network Analytics</h3>
      </div>

      {loading && <div className="text-slate-300/70 text-sm">Loading analytics...</div>}
      {!loading && error && <div className="text-red-200 text-sm">{error}</div>}

      {!loading && !error && analytics && (
        <>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <Metric icon={<Users className="w-4 h-4" />} label="Monitored Wallets" value={analytics.monitoredWallets.toString()} />
            <Metric icon={<Activity className="w-4 h-4" />} label="Active (24h)" value={analytics.active24h.toString()} />
            <Metric icon={<Layers className="w-4 h-4" />} label="Avg Score" value={analytics.averageScore.toString()} />
            <Metric icon={<BarChart3 className="w-4 h-4" />} label="Tracked Tx" value={analytics.trackedTransactions.toString()} />
          </div>

          <div className="rounded-xl border border-cyan-100/15 bg-slate-900/35 p-4">
            <div className="text-sm text-slate-300/70 mb-3">Reputation Level Distribution</div>
            <div className="grid grid-cols-11 gap-1 items-end h-28">
              {analytics.levelDistribution.map((row) => (
                <div key={row.level} className="flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-cyan-300/70 to-emerald-300/90"
                    style={{ height: `${Math.max(8, (row.count / maxLevelCount) * 100)}%` }}
                    title={`Level ${row.level}: ${row.count}`}
                  />
                  <span className="text-[10px] text-slate-300/70">{row.level}</span>
                </div>
              ))}
            </div>
          </div>

          {reputation && (
            <div className="mt-4 text-sm text-slate-200/75">
              Your current position: <strong>Level {reputation.reputationLevel}</strong> with score <strong>{reputation.totalScore}</strong>.
            </div>
          )}
        </>
      )}
    </div>
  )
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-cyan-100/15 bg-slate-900/40 p-3">
      <div className="flex items-center gap-2 text-xs text-slate-300/75 mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  )
}
