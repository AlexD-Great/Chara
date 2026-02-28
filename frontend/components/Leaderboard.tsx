'use client'

import { useEffect, useState } from 'react'
import { Crown, Medal, Trophy } from 'lucide-react'
import { fetchLeaderboard, type LeaderboardEntry } from '@/lib/api'

interface LeaderboardProps {
  currentUserAddress?: string
  currentUserScore?: number
}

function iconForRank(rank: number) {
  if (rank === 1) return <Crown className="w-5 h-5 text-amber-200" />
  if (rank === 2) return <Medal className="w-5 h-5 text-slate-200" />
  if (rank === 3) return <Medal className="w-5 h-5 text-orange-200" />
  return <span className="text-slate-300/80 font-semibold">#{rank}</span>
}

function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function Leaderboard({ currentUserAddress, currentUserScore = 0 }: LeaderboardProps) {
  const [rows, setRows] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        const data = await fetchLeaderboard(20)
        setRows(data)
      } catch (err: any) {
        setError(err.message || 'Failed to load leaderboard')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const currentUserRow = currentUserAddress
    ? rows.find((row) => row.address.toLowerCase() === currentUserAddress.toLowerCase())
    : undefined

  return (
    <div className="glass rounded-2xl p-6 border border-cyan-100/15">
      <div className="flex items-center gap-2 mb-5">
        <Trophy className="w-5 h-5 text-cyan-200" />
        <h3 className="text-2xl font-bold">Leaderboard</h3>
      </div>

      {loading && <div className="text-slate-300/70 text-sm">Loading rankings...</div>}
      {!loading && error && <div className="text-red-200 text-sm">{error}</div>}

      {!loading && !error && rows.length === 0 && <div className="text-slate-300/70 text-sm">No monitored wallets yet.</div>}

      {!loading && !error && rows.length > 0 && (
        <div className="space-y-3">
          {rows.slice(0, 10).map((row) => {
            const isCurrent = currentUserAddress && row.address.toLowerCase() === currentUserAddress.toLowerCase()
            return (
              <div
                key={row.address}
                className={`rounded-xl border p-3 flex items-center justify-between ${isCurrent ? 'border-cyan-200/35 bg-cyan-200/10' : 'border-cyan-100/15 bg-slate-900/35'}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 flex justify-center">{iconForRank(row.rank)}</div>
                  <div className="min-w-0">
                    <div className="font-mono text-sm truncate">{shortAddress(row.address)}</div>
                    <div className="text-xs text-slate-300/70">Level {row.level}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">{row.score}</div>
                  <div className="text-xs text-slate-300/70">score</div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {currentUserAddress && (
        <div className="mt-5 pt-4 border-t border-cyan-100/10 text-sm text-slate-200/80">
          {currentUserRow ? (
            <span>
              Your rank: <strong>#{currentUserRow.rank}</strong> with <strong>{currentUserRow.score}</strong>
            </span>
          ) : (
            <span>
              Wallet not yet ranked. Current score: <strong>{currentUserScore}</strong>
            </span>
          )}
        </div>
      )}
    </div>
  )
}
