'use client'

import { useState, useEffect } from 'react'
import { Trophy, Medal, Crown, TrendingUp, Award } from 'lucide-react'

interface LeaderboardEntry {
  rank: number
  address: string
  score: number
  level: number
  change: number
}

interface LeaderboardProps {
  currentUserAddress?: string
  currentUserScore?: number
}

export function Leaderboard({ currentUserAddress, currentUserScore = 0 }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [category, setCategory] = useState<'overall' | 'volume' | 'loans' | 'lp'>('overall')

  useEffect(() => {
    // In production, this would fetch from backend API
    // For now, generate mock leaderboard data
    const mockData: LeaderboardEntry[] = [
      { rank: 1, address: '0x1234...5678', score: 950, level: 10, change: 2 },
      { rank: 2, address: '0x2345...6789', score: 920, level: 9, change: 0 },
      { rank: 3, address: '0x3456...7890', score: 890, level: 9, change: -1 },
      { rank: 4, address: '0x4567...8901', score: 850, level: 8, change: 1 },
      { rank: 5, address: '0x5678...9012', score: 820, level: 8, change: 3 },
      { rank: 6, address: '0x6789...0123', score: 780, level: 7, change: 0 },
      { rank: 7, address: '0x7890...1234', score: 750, level: 7, change: -2 },
      { rank: 8, address: '0x8901...2345', score: 720, level: 7, change: 1 },
      { rank: 9, address: '0x9012...3456', score: 690, level: 6, change: 0 },
      { rank: 10, address: '0x0123...4567', score: 650, level: 6, change: 2 }
    ]

    // Add current user if they have a score
    if (currentUserAddress && currentUserScore > 0) {
      const userRank = mockData.filter(e => e.score > currentUserScore).length + 1
      if (userRank > 10) {
        mockData.push({
          rank: userRank,
          address: currentUserAddress,
          score: currentUserScore,
          level: Math.floor(currentUserScore / 100),
          change: 0
        })
      }
    }

    setLeaderboard(mockData)
  }, [currentUserAddress, currentUserScore, category])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />
      case 3:
        return <Medal className="w-6 h-6 text-orange-400" />
      default:
        return <span className="text-white/60 font-bold">#{rank}</span>
    }
  }

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30'
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30'
      case 3:
        return 'bg-gradient-to-r from-orange-400/20 to-orange-500/20 border-orange-400/30'
      default:
        return 'bg-white/5 border-white/10'
    }
  }

  const isCurrentUser = (address: string) => {
    return currentUserAddress?.toLowerCase() === address.toLowerCase()
  }

  return (
    <div className="glass rounded-2xl p-8 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h3 className="text-2xl font-bold text-white">Leaderboard</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCategory('overall')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              category === 'overall'
                ? 'bg-purple-600 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Overall
          </button>
          <button
            onClick={() => setCategory('volume')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              category === 'volume'
                ? 'bg-purple-600 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Volume
          </button>
          <button
            onClick={() => setCategory('loans')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              category === 'loans'
                ? 'bg-purple-600 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Loans
          </button>
          <button
            onClick={() => setCategory('lp')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              category === 'lp'
                ? 'bg-purple-600 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            LP
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {leaderboard.slice(0, 10).map((entry) => (
          <div
            key={entry.rank}
            className={`flex items-center justify-between p-4 rounded-lg border transition ${getRankBg(entry.rank)} ${
              isCurrentUser(entry.address) ? 'ring-2 ring-purple-500' : ''
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 flex items-center justify-center">
                {getRankIcon(entry.rank)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-sm ${isCurrentUser(entry.address) ? 'text-purple-400 font-bold' : 'text-white/70'}`}>
                    {entry.address}
                  </span>
                  {isCurrentUser(entry.address) && (
                    <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded text-xs text-purple-300">
                      You
                    </span>
                  )}
                </div>
                <div className="text-xs text-white/50">Level {entry.level}</div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-lg font-bold text-white">{entry.score}</div>
                <div className="text-xs text-white/50">points</div>
              </div>
              {entry.change !== 0 && (
                <div className={`flex items-center gap-1 ${entry.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  <TrendingUp className={`w-4 h-4 ${entry.change < 0 ? 'rotate-180' : ''}`} />
                  <span className="text-sm font-medium">{Math.abs(entry.change)}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {currentUserAddress && currentUserScore > 0 && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-purple-400" />
              <div>
                <div className="text-white font-medium">Your Rank</div>
                <div className="text-sm text-white/60">Keep climbing!</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-400">
                #{leaderboard.find(e => isCurrentUser(e.address))?.rank || '?'}
              </div>
              <div className="text-xs text-white/50">{currentUserScore} points</div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-white/5 rounded-lg">
          <div className="text-xl font-bold text-white">1,247</div>
          <div className="text-xs text-white/60">Total Users</div>
        </div>
        <div className="text-center p-3 bg-white/5 rounded-lg">
          <div className="text-xl font-bold text-green-400">+89</div>
          <div className="text-xs text-white/60">This Week</div>
        </div>
        <div className="text-center p-3 bg-white/5 rounded-lg">
          <div className="text-xl font-bold text-purple-400">642</div>
          <div className="text-xs text-white/60">Avg Score</div>
        </div>
      </div>
    </div>
  )
}
