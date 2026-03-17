"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, Ruler } from "lucide-react"
import { AgentTierBadge } from "./agent-tier-badge"
import type { AgentTierKey } from "@/lib/agent-tier-system"

interface LeaderboardAgent {
  id: string
  name: string
  tier: AgentTierKey
  farmersRecruited: number
  hectaresActivated: number
  qualityScore: number
  totalEarnings: number
  rank: number
  targetProgress: number
}

interface AgentLeaderboardProps {
  agents: LeaderboardAgent[]
  currentAgentId?: string
  period: "week" | "month" | "quarter"
}

export function AgentLeaderboard({ agents, currentAgentId, period }: AgentLeaderboardProps) {
  const sortedAgents = [...agents].sort((a, b) => b.totalEarnings - a.totalEarnings)
  const topThree = sortedAgents.slice(0, 3)
  const currentAgent = sortedAgents.find((a) => a.id === currentAgentId)

  const periodLabel = {
    week: "This Week",
    month: "This Month",
    quarter: "This Quarter",
  }[period]

  return (
    <div className="space-y-6">
      {/* Top 3 Podium */}
      <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-600" />
            <h3 className="font-semibold text-lg">Top Performers - {periodLabel}</h3>
          </div>
          <Badge variant="outline" className="bg-white">
            {agents.length} Agents
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {topThree.map((agent, index) => {
            const medalColors = ["text-amber-500", "text-slate-400", "text-orange-600"]
            const medalEmojis = ["🥇", "🥈", "🥉"]

            return (
              <div
                key={agent.id}
                className={`p-4 rounded-lg bg-white border-2 ${index === 0 ? "border-amber-400" : "border-slate-200"}`}
              >
                <div className="text-center mb-3">
                  <div className="text-3xl mb-2">{medalEmojis[index]}</div>
                  <div className={`text-2xl font-bold ${medalColors[index]}`}>#{index + 1}</div>
                </div>

                <div className="space-y-2">
                  <div className="font-semibold text-center truncate">{agent.name}</div>
                  <AgentTierBadge tier={agent.tier} size="sm" />

                  <div className="pt-3 border-t space-y-1.5 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Farmers
                      </span>
                      <span className="font-semibold">{agent.farmersRecruited}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Ruler className="h-3 w-3" />
                        Hectares
                      </span>
                      <span className="font-semibold">{agent.hectaresActivated}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-muted-foreground">Earnings</span>
                      <span className="font-bold text-green-600">₦{agent.totalEarnings.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Current Agent Position (if not in top 3) */}
      {currentAgent && currentAgent.rank > 3 && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-bold text-lg">
                #{currentAgent.rank}
              </div>
              <div>
                <div className="font-semibold">Your Position</div>
                <div className="text-sm text-muted-foreground">
                  {currentAgent.farmersRecruited} farmers • {currentAgent.hectaresActivated} ha
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">₦{currentAgent.totalEarnings.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Earnings</div>
            </div>
          </div>
        </Card>
      )}

      {/* Full Leaderboard Table */}
      <Card className="p-6">
        <h4 className="font-semibold mb-4">Complete Leaderboard</h4>
        <div className="space-y-2">
          {sortedAgents.map((agent) => (
            <div
              key={agent.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                agent.id === currentAgentId ? "bg-blue-50 border-blue-200" : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm ${
                    agent.rank <= 3 ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {agent.rank}
                </div>

                <div className="flex-1">
                  <div className="font-medium">{agent.name}</div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{agent.farmersRecruited} farmers</span>
                    <span>•</span>
                    <span>{agent.hectaresActivated} ha</span>
                    <span>•</span>
                    <span>{agent.qualityScore}% quality</span>
                  </div>
                </div>

                <AgentTierBadge tier={agent.tier} size="sm" />
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Target Progress</div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${Math.min(agent.targetProgress, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{agent.targetProgress}%</span>
                  </div>
                </div>

                <div className="text-right min-w-[140px]">
                  <div className="text-lg font-bold text-green-600">₦{agent.totalEarnings.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Total Earnings</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
