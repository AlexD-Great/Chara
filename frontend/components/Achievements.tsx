'use client'

import { useState, useEffect } from 'react'
import { Trophy, Star, Zap, Target, TrendingUp, Award, Crown, Flame } from 'lucide-react'

interface Achievement {
  id: string
  name: string
  description: string
  icon: any
  requirement: number
  category: 'volume' | 'activity' | 'reputation' | 'streak'
  unlocked: boolean
  progress: number
  color: string
}

interface AchievementProps {
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
  activityCount?: number
}

const ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'progress'>[] = [
  {
    id: 'first_mint',
    name: 'Genesis',
    description: 'Mint your first Chara NFT',
    icon: Star,
    requirement: 1,
    category: 'activity',
    color: 'from-blue-400 to-cyan-500'
  },
  {
    id: 'first_swap',
    name: 'Trader',
    description: 'Complete your first swap',
    icon: TrendingUp,
    requirement: 10,
    category: 'volume',
    color: 'from-green-400 to-emerald-500'
  },
  {
    id: 'volume_100',
    name: 'Volume Starter',
    description: 'Reach 100 transaction volume',
    icon: Target,
    requirement: 100,
    category: 'volume',
    color: 'from-purple-400 to-pink-500'
  },
  {
    id: 'first_lp',
    name: 'Liquidity Provider',
    description: 'Provide liquidity for the first time',
    icon: Zap,
    requirement: 20,
    category: 'activity',
    color: 'from-yellow-400 to-orange-500'
  },
  {
    id: 'reputation_500',
    name: 'Rising Star',
    description: 'Reach 500 reputation score',
    icon: Award,
    requirement: 500,
    category: 'reputation',
    color: 'from-indigo-400 to-purple-500'
  },
  {
    id: 'reputation_700',
    name: 'Veteran',
    description: 'Reach 700 reputation score',
    icon: Trophy,
    requirement: 700,
    category: 'reputation',
    color: 'from-purple-500 to-pink-600'
  },
  {
    id: 'reputation_900',
    name: 'Legend',
    description: 'Reach 900 reputation score',
    icon: Crown,
    requirement: 900,
    category: 'reputation',
    color: 'from-yellow-500 to-orange-600'
  },
  {
    id: 'protocol_diversity_3',
    name: 'Explorer',
    description: 'Use 3 different protocols',
    icon: Target,
    requirement: 60,
    category: 'activity',
    color: 'from-cyan-400 to-blue-500'
  },
  {
    id: 'governance_active',
    name: 'Governance Participant',
    description: 'Participate in governance',
    icon: Flame,
    requirement: 25,
    category: 'activity',
    color: 'from-red-400 to-pink-500'
  },
  {
    id: 'loan_repaid',
    name: 'Trustworthy Borrower',
    description: 'Repay your first loan',
    icon: Award,
    requirement: 30,
    category: 'activity',
    color: 'from-green-500 to-teal-500'
  },
  {
    id: 'account_age_30',
    name: 'Seasoned User',
    description: 'Be active for 30 days',
    icon: Star,
    requirement: 30,
    category: 'streak',
    color: 'from-blue-500 to-purple-500'
  },
  {
    id: 'max_level',
    name: 'Master',
    description: 'Reach maximum reputation level',
    icon: Crown,
    requirement: 10,
    category: 'reputation',
    color: 'from-yellow-400 to-orange-500'
  }
]

export function Achievements({ reputation, activityCount = 0 }: AchievementProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [unlockedCount, setUnlockedCount] = useState(0)

  useEffect(() => {
    if (!reputation) return

    const processedAchievements = ACHIEVEMENTS.map(achievement => {
      let progress = 0
      let unlocked = false

      switch (achievement.id) {
        case 'first_mint':
          progress = activityCount > 0 ? 100 : 0
          unlocked = activityCount > 0
          break
        case 'first_swap':
          progress = Math.min(100, (reputation.transactionVolume / achievement.requirement) * 100)
          unlocked = reputation.transactionVolume >= achievement.requirement
          break
        case 'volume_100':
          progress = Math.min(100, (reputation.transactionVolume / achievement.requirement) * 100)
          unlocked = reputation.transactionVolume >= achievement.requirement
          break
        case 'first_lp':
          progress = Math.min(100, (reputation.liquidityProvision / achievement.requirement) * 100)
          unlocked = reputation.liquidityProvision >= achievement.requirement
          break
        case 'reputation_500':
        case 'reputation_700':
        case 'reputation_900':
          progress = Math.min(100, (reputation.totalScore / achievement.requirement) * 100)
          unlocked = reputation.totalScore >= achievement.requirement
          break
        case 'protocol_diversity_3':
          progress = Math.min(100, (reputation.protocolDiversity / achievement.requirement) * 100)
          unlocked = reputation.protocolDiversity >= achievement.requirement
          break
        case 'governance_active':
          progress = Math.min(100, (reputation.governanceScore / achievement.requirement) * 100)
          unlocked = reputation.governanceScore >= achievement.requirement
          break
        case 'loan_repaid':
          progress = Math.min(100, (reputation.loanHistory / achievement.requirement) * 100)
          unlocked = reputation.loanHistory >= achievement.requirement
          break
        case 'account_age_30':
          progress = Math.min(100, (reputation.accountAge / achievement.requirement) * 100)
          unlocked = reputation.accountAge >= achievement.requirement
          break
        case 'max_level':
          progress = Math.min(100, (reputation.reputationLevel / achievement.requirement) * 100)
          unlocked = reputation.reputationLevel >= achievement.requirement
          break
      }

      return {
        ...achievement,
        progress: Math.round(progress),
        unlocked
      }
    })

    setAchievements(processedAchievements)
    setUnlockedCount(processedAchievements.filter(a => a.unlocked).length)
  }, [reputation, activityCount])

  if (!reputation) {
    return (
      <div className="glass rounded-2xl p-8 border border-white/10">
        <div className="flex items-center space-x-2 mb-6">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h3 className="text-2xl font-bold text-white">Achievements</h3>
        </div>
        <p className="text-white/60 text-center py-8">
          Connect your wallet to view your achievements
        </p>
      </div>
    )
  }

  return (
    <div className="glass rounded-2xl p-8 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h3 className="text-2xl font-bold text-white">Achievements</h3>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{unlockedCount}/{achievements.length}</div>
          <div className="text-sm text-white/60">Unlocked</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => {
          const Icon = achievement.icon
          return (
            <div
              key={achievement.id}
              className={`relative p-4 rounded-xl border transition-all ${
                achievement.unlocked
                  ? `bg-gradient-to-br ${achievement.color} bg-opacity-10 border-white/20`
                  : 'bg-white/5 border-white/10 opacity-60'
              }`}
            >
              {achievement.unlocked && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}

              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${
                achievement.unlocked
                  ? `bg-gradient-to-br ${achievement.color}`
                  : 'bg-white/10'
              }`}>
                <Icon className={`w-6 h-6 ${achievement.unlocked ? 'text-white' : 'text-white/40'}`} />
              </div>

              <h4 className={`font-bold mb-1 ${achievement.unlocked ? 'text-white' : 'text-white/60'}`}>
                {achievement.name}
              </h4>
              <p className={`text-sm mb-3 ${achievement.unlocked ? 'text-white/70' : 'text-white/40'}`}>
                {achievement.description}
              </p>

              {!achievement.unlocked && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-white/60">
                    <span>Progress</span>
                    <span>{achievement.progress}%</span>
                  </div>
                  <div className="overflow-hidden h-2 text-xs flex rounded-full bg-white/10">
                    <div
                      style={{ width: `${achievement.progress}%` }}
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r ${achievement.color}`}
                    ></div>
                  </div>
                </div>
              )}

              {achievement.unlocked && (
                <div className="text-xs text-green-400 font-semibold">
                  ✓ Unlocked
                </div>
              )}
            </div>
          )
        })}
      </div>

      {unlockedCount === achievements.length && (
        <div className="mt-6 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg text-center">
          <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-white font-bold">🎉 Achievement Master!</p>
          <p className="text-white/70 text-sm">You have unlocked all achievements!</p>
        </div>
      )}
    </div>
  )
}
