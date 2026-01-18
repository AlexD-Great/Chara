'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react'

interface AnalyticsProps {
  reputation: {
    transactionVolume: number
    loanHistory: number
    liquidityProvision: number
    protocolDiversity: number
    governanceScore: number
    accountAge: number
    totalScore: number
    reputationLevel: number
  } | null
}

export function Analytics({ reputation }: AnalyticsProps) {
  const [scoreHistory, setScoreHistory] = useState<number[]>([])

  useEffect(() => {
    if (reputation) {
      // Simulate score history (in production, this would come from backend)
      const history = Array.from({ length: 7 }, (_, i) => {
        const factor = (i + 1) / 7
        return Math.floor(reputation.totalScore * factor)
      })
      setScoreHistory(history)
    }
  }, [reputation])

  if (!reputation) {
    return (
      <div className="glass rounded-2xl p-8 border border-white/10">
        <div className="flex items-center space-x-2 mb-6">
          <BarChart3 className="w-6 h-6 text-purple-400" />
          <h3 className="text-2xl font-bold text-white">Analytics</h3>
        </div>
        <p className="text-white/60 text-center py-8">
          Connect your wallet to view analytics
        </p>
      </div>
    )
  }

  const components = [
    { name: 'Transaction Volume', value: reputation.transactionVolume, color: 'bg-blue-500' },
    { name: 'Loan History', value: reputation.loanHistory, color: 'bg-green-500' },
    { name: 'Liquidity', value: reputation.liquidityProvision, color: 'bg-purple-500' },
    { name: 'Protocols', value: reputation.protocolDiversity, color: 'bg-yellow-500' },
    { name: 'Governance', value: reputation.governanceScore, color: 'bg-pink-500' },
    { name: 'Account Age', value: reputation.accountAge, color: 'bg-cyan-500' }
  ]

  const maxValue = Math.max(...components.map(c => c.value))
  const totalValue = components.reduce((sum, c) => sum + c.value, 0)

  return (
    <div className="space-y-8">
      {/* Score Trend */}
      <div className="glass rounded-2xl p-8 border border-white/10">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="w-6 h-6 text-green-400" />
          <h3 className="text-2xl font-bold text-white">Score Progression</h3>
        </div>

        <div className="relative h-64">
          <div className="absolute inset-0 flex items-end justify-between gap-2">
            {scoreHistory.map((score, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-purple-600 to-pink-500 rounded-t-lg transition-all duration-500 hover:opacity-80"
                  style={{ height: `${(score / 1000) * 100}%` }}
                ></div>
                <div className="text-xs text-white/60 mt-2">
                  {index === 0 ? 'Start' : index === scoreHistory.length - 1 ? 'Now' : ''}
                </div>
              </div>
            ))}
          </div>
          
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-white/40 -ml-8">
            <span>1000</span>
            <span>750</span>
            <span>500</span>
            <span>250</span>
            <span>0</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-white">{reputation.totalScore}</div>
            <div className="text-sm text-white/60">Current Score</div>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-green-400">
              +{scoreHistory.length > 1 ? scoreHistory[scoreHistory.length - 1] - scoreHistory[0] : 0}
            </div>
            <div className="text-sm text-white/60">Total Growth</div>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">
              {1000 - reputation.totalScore}
            </div>
            <div className="text-sm text-white/60">To Max Level</div>
          </div>
        </div>
      </div>

      {/* Component Distribution */}
      <div className="glass rounded-2xl p-8 border border-white/10">
        <div className="flex items-center space-x-2 mb-6">
          <PieChart className="w-6 h-6 text-purple-400" />
          <h3 className="text-2xl font-bold text-white">Score Distribution</h3>
        </div>

        <div className="space-y-4">
          {components.map((component, index) => (
            <div key={index}>
              <div className="flex justify-between mb-2">
                <span className="text-white/70 text-sm">{component.name}</span>
                <span className="text-white text-sm font-semibold">
                  {component.value}/100 ({totalValue > 0 ? Math.round((component.value / totalValue) * 100) : 0}%)
                </span>
              </div>
              <div className="flex gap-1">
                <div className="flex-1 overflow-hidden h-3 rounded-full bg-white/10">
                  <div
                    style={{ width: `${component.value}%` }}
                    className={`h-full ${component.color} transition-all duration-500`}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-purple-400" />
            <span className="text-white font-semibold">Insights</span>
          </div>
          <ul className="text-sm text-white/70 space-y-1">
            {reputation.loanHistory > 50 && (
              <li>• Strong loan repayment history - great for lending protocols</li>
            )}
            {reputation.liquidityProvision > 50 && (
              <li>• Active liquidity provider - eligible for LP rewards</li>
            )}
            {reputation.protocolDiversity < 30 && (
              <li>• Try using more protocols to increase diversity score</li>
            )}
            {reputation.governanceScore < 30 && (
              <li>• Participate in governance to boost your score</li>
            )}
            {reputation.totalScore >= 700 && (
              <li>• Excellent reputation! You qualify for premium benefits</li>
            )}
          </ul>
        </div>
      </div>

      {/* Percentile Ranking */}
      <div className="glass rounded-2xl p-8 border border-white/10">
        <div className="flex items-center space-x-2 mb-6">
          <BarChart3 className="w-6 h-6 text-yellow-400" />
          <h3 className="text-2xl font-bold text-white">Network Ranking</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl">
            <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
              Top {Math.max(5, Math.floor((1000 - reputation.totalScore) / 10))}%
            </div>
            <div className="text-white/70">Network Percentile</div>
            <div className="text-sm text-white/50 mt-2">
              Better than {100 - Math.max(5, Math.floor((1000 - reputation.totalScore) / 10))}% of users
            </div>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">
              #{Math.max(1, Math.floor((1000 - reputation.totalScore) * 5))}
            </div>
            <div className="text-white/70">Estimated Rank</div>
            <div className="text-sm text-white/50 mt-2">
              Out of ~{Math.floor((1000 - reputation.totalScore) * 50)} users
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-sm text-white/60 mb-2">Your Position</div>
          <div className="relative h-8 bg-white/5 rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-gradient-to-r from-purple-500 to-pink-500"
              style={{ width: `${(reputation.totalScore / 1000) * 100}%` }}
            ></div>
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-purple-500 shadow-lg"
              style={{ left: `${(reputation.totalScore / 1000) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-white/40 mt-1">
            <span>Newcomer</span>
            <span>Legend</span>
          </div>
        </div>
      </div>
    </div>
  )
}
