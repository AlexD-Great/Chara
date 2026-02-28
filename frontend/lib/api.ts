export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

export interface LeaderboardEntry {
  rank: number
  address: string
  score: number
  level: number
  updatedAt: number
}

export interface AnalyticsResponse {
  monitoredWallets: number
  active24h: number
  averageScore: number
  trackedTransactions: number
  levelDistribution: Array<{ level: number; count: number }>
}

export interface ProtocolRow {
  address: string
  name: string
  category: string
  activityCount: number
  uniqueWalletCount: number
  lastSeen: number
}

export async function fetchLeaderboard(limit = 20): Promise<LeaderboardEntry[]> {
  const response = await fetch(`${BACKEND_URL}/api/leaderboard?limit=${limit}`, { cache: 'no-store' })
  if (!response.ok) throw new Error('Failed to fetch leaderboard')
  const payload = await response.json()
  return payload.entries || []
}

export async function fetchAnalytics(): Promise<AnalyticsResponse> {
  const response = await fetch(`${BACKEND_URL}/api/analytics`, { cache: 'no-store' })
  if (!response.ok) throw new Error('Failed to fetch analytics')
  return response.json()
}

export async function fetchProtocols(): Promise<ProtocolRow[]> {
  const response = await fetch(`${BACKEND_URL}/api/protocols`, { cache: 'no-store' })
  if (!response.ok) throw new Error('Failed to fetch protocols')
  const payload = await response.json()
  return payload.protocols || []
}
