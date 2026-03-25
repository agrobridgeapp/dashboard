"use client"

import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MapPin, Users, TrendingUp, Leaf } from "lucide-react"

export default function CoordinatorCorridorsPage() {
  // Demo data - corridors in coordinator's state
  const corridors = [
    {
      id: "COR001",
      name: "Enugu North Maize",
      lead: "John Okafor",
      farmers: 45,
      hectares: 123.5,
      crops: ["Maize"],
      agents: 3,
      completion: 78,
      status: "on_track",
    },
    {
      id: "COR002",
      name: "Enugu Central Mixed",
      lead: "Mary Eze",
      farmers: 38,
      hectares: 98.2,
      crops: ["Maize", "Cassava", "Yam"],
      agents: 2,
      completion: 65,
      status: "on_track",
    },
    {
      id: "COR003",
      name: "Enugu South Rice",
      lead: "Paul Eze",
      farmers: 29,
      hectares: 156.8,
      crops: ["Rice"],
      agents: 2,
      completion: 52,
      status: "at_risk",
    },
  ]

  const totalStats = {
    totalFarmers: corridors.reduce((sum, c) => sum + c.farmers, 0),
    totalHectares: corridors.reduce((sum, c) => sum + c.hectares, 0),
    totalAgents: corridors.reduce((sum, c) => sum + c.agents, 0),
    avgCompletion: Math.round(corridors.reduce((sum, c) => sum + c.completion, 0) / corridors.length),
  }

  return (
    <DashboardLayout allowedRoles={["state_coordinator"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Corridors Overview</h1>
          <p className="text-muted-foreground">Monitor performance across all corridors in your state</p>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Corridors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{corridors.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Farmers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.totalFarmers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Hectares</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.totalHectares.toFixed(1)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.avgCompletion}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Corridors List */}
        <div className="space-y-4">
          {corridors.map((corridor) => (
            <Card key={corridor.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{corridor.name}</CardTitle>
                    <CardDescription>Lead: {corridor.lead}</CardDescription>
                  </div>
                  <Badge variant={corridor.status === "on_track" ? "default" : "destructive"}>
                    {corridor.status === "on_track" ? "On Track" : "At Risk"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{corridor.farmers}</div>
                      <div className="text-xs text-muted-foreground">Farmers</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{corridor.hectares} ha</div>
                      <div className="text-xs text-muted-foreground">Total Land</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{corridor.agents}</div>
                      <div className="text-xs text-muted-foreground">Field Agents</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{corridor.crops.join(", ")}</div>
                      <div className="text-xs text-muted-foreground">Crops</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Service Completion</span>
                    <span className="font-medium">{corridor.completion}%</span>
                  </div>
                  <Progress value={corridor.completion} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
