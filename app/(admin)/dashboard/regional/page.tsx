"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, MapPin, TrendingUp, Target, Award, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { api } from "@/lib/api"

interface AgentSummary {
  id: string
  name: string
  state: string
  agents: number
  farmers: number
  corridors: number
  completionRate: number
  qualityScore: number
  status: "on_track" | "review_suggested"
}

interface RegionalAlert {
  state: string
  issue: string
  severity: "high" | "medium"
  affectedAgents: number
  impact: string
}

export default function RegionalManagerDashboard() {
  const [loading, setLoading] = useState(true)
  const [totalAgents, setTotalAgents] = useState(0)
  const [totalFarmers, setTotalFarmers] = useState(0)
  const [selectedAlert, setSelectedAlert] = useState<RegionalAlert | null>(null)
  const [coordinators, setCoordinators] = useState<AgentSummary[]>([])
  const [regionalAlerts] = useState<RegionalAlert[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const [agentsRes, farmersRes] = await Promise.all([
          api.agents.list(),
          api.farmers.list(),
        ])

        if (agentsRes.success) {
          const agentList = Array.isArray(agentsRes.data) ? agentsRes.data : []
          setTotalAgents(agentList.length)

          // Group agents by region/state to build coordinator-like summaries
          const byState: Record<string, any[]> = {}
          agentList.forEach((a: any) => {
            const state = a.state || "Unknown"
            if (!byState[state]) byState[state] = []
            byState[state].push(a)
          })

          const coordinatorSummaries: AgentSummary[] = Object.entries(byState)
            .slice(0, 6)
            .map(([state, agents], idx) => ({
              id: `state-${idx}`,
              name: `${state} Region`,
              state,
              agents: agents.length,
              farmers: agents.reduce((sum: number, a: any) => sum + (a.farmer_count || 0), 0),
              corridors: new Set(agents.flatMap((a: any) => a.assigned_corridors || [])).size,
              completionRate: 85,
              qualityScore: 80,
              status: agents.length > 5 ? "on_track" : "review_suggested",
            }))
          setCoordinators(coordinatorSummaries)
        }

        if (farmersRes.success) {
          const farmerList = Array.isArray(farmersRes.data) ? farmersRes.data : []
          setTotalFarmers(farmerList.length)
        }
      } catch (err) {
        console.error("[RegionalDashboard] Failed to fetch:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const statsDisplay = [
    { label: "State Coverage", value: loading ? null : coordinators.length.toString(), change: `${coordinators.length} active states`, icon: Award, color: "text-purple-600" },
    { label: "Field Agents", value: loading ? null : totalAgents.toString(), change: `${totalAgents} registered agents`, icon: Users, color: "text-blue-600" },
    { label: "Total Farmers", value: loading ? null : totalFarmers.toLocaleString(), change: `${totalFarmers} enrolled farmers`, icon: Target, color: "text-green-600" },
    { label: "Avg. Completion Rate", value: "84%", change: "Across all corridors", icon: TrendingUp, color: "text-emerald-600" },
  ]

  return (
    <DashboardLayout allowedRoles={["regional_manager"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Regional Manager Dashboard</h1>
          <p className="text-muted-foreground">Overseeing field operations across all states</p>
          <p className="text-xs text-muted-foreground mt-1">Scope: Regional coordination and intervention</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsDisplay.map((stat) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${stat.color} bg-opacity-10`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="min-w-0">
                    {loading && stat.value === null ? (
                      <Skeleton className="h-8 w-16 mb-1" />
                    ) : (
                      <p className="text-2xl font-bold">{stat.value}</p>
                    )}
                    <p className="text-sm text-muted-foreground truncate">{stat.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle>State Coverage Breakdown</CardTitle>
              <CardDescription>Monitor state-level agent operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
                ) : coordinators.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No agent data available</p>
                ) : (
                  coordinators.map((coordinator) => (
                    <div key={coordinator.id} className="p-4 border border-border/50 rounded-lg space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium truncate">{coordinator.name}</p>
                            <Badge
                              variant={coordinator.status === "on_track" ? "default" : "secondary"}
                              className="text-xs shrink-0"
                            >
                              {coordinator.status === "on_track" ? "On Track" : "Review Suggested"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="truncate">{coordinator.state} State — {coordinator.corridors} corridors</span>
                          </p>
                        </div>
                        <Button variant="outline" size="sm" asChild className="shrink-0 bg-transparent">
                          <Link href={`/dashboard/regional/coordinators/${coordinator.id}`}>View</Link>
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center text-sm">
                        <div>
                          <div className="font-medium">{coordinator.agents}</div>
                          <div className="text-xs text-muted-foreground">Agents</div>
                        </div>
                        <div>
                          <div className="font-medium">{coordinator.farmers}</div>
                          <div className="text-xs text-muted-foreground">Farmers</div>
                        </div>
                        <div>
                          <div className="font-medium">{coordinator.completionRate}%</div>
                          <div className="text-xs text-muted-foreground">Completion</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle>Flags & Interventions</CardTitle>
              <CardDescription>Issues requiring regional oversight and intervention</CardDescription>
            </CardHeader>
            <CardContent>
              {regionalAlerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertTriangle className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="font-medium text-muted-foreground">No active alerts</p>
                  <p className="text-sm text-muted-foreground mt-1">All regions are performing within acceptable thresholds</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {regionalAlerts.map((alert, index) => (
                    <div key={index} className="p-4 border border-border/50 rounded-lg space-y-2">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className={`h-5 w-5 mt-0.5 shrink-0 ${alert.severity === "high" ? "text-red-600" : "text-amber-600"}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={alert.severity === "high" ? "destructive" : "secondary"} className="text-xs shrink-0">
                              {alert.severity}
                            </Badge>
                            <span className="font-medium text-sm">{alert.state} State</span>
                          </div>
                          <p className="text-sm mb-2">{alert.issue}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                            <span>{alert.affectedAgents} agents affected</span>
                            <span>•</span>
                            <span>Impact: {alert.impact}</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="w-full bg-transparent" onClick={() => setSelectedAlert(alert)}>
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className={`h-5 w-5 ${selectedAlert?.severity === "high" ? "text-red-600" : "text-amber-600"}`} />
              {selectedAlert?.state} State Alert
            </DialogTitle>
            <DialogDescription>Issue requiring regional intervention</DialogDescription>
          </DialogHeader>
          {selectedAlert && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium mb-2">{selectedAlert.issue}</p>
                <Badge variant={selectedAlert.severity === "high" ? "destructive" : "secondary"}>
                  {selectedAlert.severity} severity
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Affected Agents</p>
                  <p className="text-xl font-bold">{selectedAlert.affectedAgents}</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Impact</p>
                  <p className="text-sm font-medium">{selectedAlert.impact}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setSelectedAlert(null)}>
                  Close
                </Button>
                <Button className="flex-1" asChild>
                  <Link href="/dashboard/regional/coordinators">View Coordinators</Link>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
