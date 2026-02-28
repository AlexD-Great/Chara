'use client'

import { useEffect, useMemo, useState } from 'react'
import { Building2, Network, ExternalLink } from 'lucide-react'
import { fetchProtocols, type ProtocolRow } from '@/lib/api'

function shortAddress(address: string) {
  return `${address.slice(0, 8)}...${address.slice(-6)}`
}

export function ProtocolShowcase() {
  const [rows, setRows] = useState<ProtocolRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    ;(async () => {
      try {
        const data = await fetchProtocols()
        setRows(data)
      } catch (err: any) {
        setError(err.message || 'Failed to load protocols')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const categories = useMemo(() => ['all', ...Array.from(new Set(rows.map((row) => row.category)))], [rows])
  const visible = filter === 'all' ? rows : rows.filter((row) => row.category === filter)

  return (
    <section id="protocols" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 reveal">
          <h2 className="text-4xl font-bold">
            Protocol <span className="gradient-text">Activity</span>
          </h2>
          <p className="text-slate-200/75 mt-2">
            Real protocol interactions observed by the monitor. Add wallets to track and this list updates automatically.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-3 py-1.5 rounded-lg text-sm border ${
                filter === category ? 'border-cyan-200/40 bg-cyan-200/12' : 'border-cyan-100/15 bg-slate-900/35'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading && <div className="glass rounded-2xl p-6 text-slate-300/75">Loading protocol stats...</div>}
        {!loading && error && <div className="glass rounded-2xl p-6 text-red-200">{error}</div>}

        {!loading && !error && visible.length === 0 && (
          <div className="glass rounded-2xl p-6 text-slate-300/75">
            No protocol activity yet. Once monitored wallets transact, protocol telemetry appears here.
          </div>
        )}

        {!loading && !error && visible.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map((row) => (
              <div key={row.address} className="glass rounded-2xl p-5 border border-cyan-100/15 reveal">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-200/10 border border-cyan-200/20 flex items-center justify-center">
                    <Network className="w-5 h-5 text-cyan-200" />
                  </div>
                  <span className="text-xs text-slate-300/70 uppercase">{row.category}</span>
                </div>
                <h3 className="text-xl font-semibold">{row.name}</h3>
                <a
                  href={`https://amoy.polygonscan.com/address/${row.address}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 text-sm text-cyan-100/80 inline-flex items-center gap-1"
                >
                  {shortAddress(row.address)} <ExternalLink className="w-3 h-3" />
                </a>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Info label="Events" value={row.activityCount.toString()} />
                  <Info label="Wallets" value={row.uniqueWalletCount.toString()} />
                </div>
                <div className="mt-4 text-xs text-slate-300/70">
                  Last seen: {new Date(row.lastSeen).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 glass rounded-2xl p-6 border border-cyan-100/15">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-5 h-5 text-cyan-200" />
            <h3 className="text-xl font-bold">Integration Flow</h3>
          </div>
          <ol className="space-y-2 text-slate-200/75 text-sm">
            <li>1. Integrate `sdk/CharaSDK.js` in your protocol backend or contracts.</li>
            <li>2. Request whitelisting of protocol wallet addresses.</li>
            <li>3. Consume `verifyReputation`, `getInterestRateDiscount`, and multiplier methods for benefit logic.</li>
            <li>4. Track usage in this dashboard from live monitor events.</li>
          </ol>
        </div>
      </div>
    </section>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-cyan-100/15 bg-slate-900/40 p-3">
      <div className="text-xs text-slate-300/70">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  )
}
