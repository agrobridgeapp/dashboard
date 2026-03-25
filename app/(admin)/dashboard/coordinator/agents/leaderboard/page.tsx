"use client"

import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AgentLeaderboard } from "@/components/agent/agent-leaderboard"
import { Trophy, TrendingUp, Download } from "lucide-react"
import { useState } from "react"

export default function AgentLeaderboardPage() {
  const [period, setPeriod] = useState<"week" | "month" | "quarter">("month")

  const leaderboardAgents = [
    {
      id: "agent-002",
      name: "Chinedu Eze",
      tier: "PRINCIPAL_AGENT" as const,
      farmersRecruited: 42,
      hectaresActivated: 138,
      qualityScore: 98.2,
      totalEarnings: 487000,
      rank: 1,
      targetProgress: 115,
    },
    {
      id: "agent-001",
      name: "Blessing Okonkwo",
      tier: "LEAD_AGENT" as const,
      farmersRecruited: 38,
      hectaresActivated: 124,
      qualityScore: 96.5,
      totalEarnings: 432000,
      rank: 2,
      targetProgress: 102,
    },
    {
      id: "agent-004",
      name: "Yakubu Danladi",
      tier: "SENIOR_AGENT" as const,
      farmersRecruited: 35,
      hectaresActivated: 115,
      qualityScore: 97.1,
      totalEarnings: 398000,
      rank: 3,
      targetProgress: 98,
    },
    {
      id: "agent-003",
      name: "Amina Ibrahim",
      tier: "AGENT" as const,
      farmersRecruited: 28,
      hectaresActivated: 92,
      qualityScore: 94.8,
      totalEarnings: 312000,
      rank: 4,
      targetProgress: 87,
    },
  ]

  const totalEarnings = leaderboardAgents.reduce((sum, agent) => sum + agent.totalEarnings, 0)
  const totalFarmers = leaderboardAgents.reduce((sum, agent) => sum + agent.farmersRecruited, 0)
  const totalHectares = leaderboardAgents.reduce((sum, agent) => sum + agent.hectaresActivated, 0)
  const avgQuality = leaderboardAgents.reduce((sum, agent) => sum + agent.qualityScore, 0) / leaderboardAgents.length

  return (
    <DashboardLayout allowedRoles={["state_coordinator", "regional_manager", "ops_admin"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Agent Leaderboard</h1>
            <p className="text-muted-foreground">Performance rankings and targets</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <Button variant={period === "week" ? "secondary" : "ghost"} size="sm" onClick={() => setPeriod("week")}>
                Week
              </Button>
              <Button variant={period === "month" ? "secondary" : "ghost"} size="sm" onClick={() => setPeriod("month")}>
                Month
              </Button>
              <Button
                variant={period === "quarter" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setPeriod("quarter")}
              >
                Quarter
              </Button>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 text-amber-600" />
              <span className="text-sm text-muted-foreground">Total Agents</span>
            </div>
            <div className="text-2xl font-bold">{leaderboardAgents.length}</div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm text-muted-foreground">Total Earnings</span>
            </div>
            <div className="text-2xl font-bold">₦{(totalEarnings / 1000000).toFixed(1)}M</div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-muted-foreground">Farmers Recruited</span>
            </div>
            <div className="text-2xl font-bold">{totalFarmers}</div>
            <div className="text-xs text-muted-foreground">{totalHectares} hectares</div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-muted-foreground">Avg Quality Score</span>
            </div>
            <div className="text-2xl font-bold">{avgQuality.toFixed(1)}%</div>
            <Badge variant="outline" className="mt-1">
              Excellent
            </Badge>
          </Card>
        </div>

        {/* Leaderboard */}
        <AgentLeaderboard agents={leaderboardAgents} period={period} />
      </div>
    </DashboardLayout>
  )
}
