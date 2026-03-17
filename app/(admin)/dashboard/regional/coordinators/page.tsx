"use client"

import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Award, Users, MapPin, TrendingUp } from "lucide-react"

export default function RegionalCoordinatorsPage() {
  // Demo data - state coordinators under regional manager
  const coordinators = [
    {
      id: "SC001",
      name: "Adewale Ogunleye",
      state: "Lagos",
      agents: 12,
      farmers: 145,
      corridors: 4,
      hectares: 456.8,
      performance: 85,
      status: "excellent",
    },
    {
      id: "SC002",
      name: "Amina Bello",
      state: "Ogun",
      agents: 8,
      farmers: 98,
      corridors: 3,
      hectares: 312.5,
      performance: 78,
      status: "good",
    },
    {
      id: "SC003",
      name: "Chinedu Okonkwo",
      state: "Enugu",
      agents: 7,
      farmers: 112,
      corridors: 3,
      hectares: 378.5,
      performance: 72,
      status: "good",
    },
    {
      id: "SC004",
      name: "Fatima Ibrahim",
      state: "Kaduna",
      agents: 10,
      farmers: 178,
      corridors: 5,
      hectares: 523.2,
      performance: 62,
      status: "needs_improvement",
    },
  ]

  const totalStats = {
    coordinators: coordinators.length,
    agents: coordinators.reduce((sum, c) => sum + c.agents, 0),
    farmers: coordinators.reduce((sum, c) => sum + c.farmers, 0),
    hectares: coordinators.reduce((sum, c) => sum + c.hectares, 0),
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "excellent":
        return <Badge className="bg-green-100 text-green-700">Excellent</Badge>
      case "good":
        return <Badge className="bg-blue-100 text-blue-700">Good</Badge>
      case "needs_improvement":
        return <Badge variant="destructive">Needs Improvement</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <DashboardLayout allowedRoles={["regional_manager"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">State Coordinators</h1>
          <p className="text-muted-foreground">Monitor and manage state coordinators across your region</p>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">State Coordinators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.coordinators}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Field Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.agents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Farmers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.farmers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Hectares</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.hectares.toFixed(0)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Coordinators List */}
        <div className="space-y-4">
          {coordinators.map((coordinator) => (
            <Card key={coordinator.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{coordinator.name}</CardTitle>
                    <CardDescription>{coordinator.state} State</CardDescription>
                  </div>
                  {getStatusBadge(coordinator.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{coordinator.agents}</div>
                      <div className="text-xs text-muted-foreground">Field Agents</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{coordinator.farmers}</div>
                      <div className="text-xs text-muted-foreground">Farmers</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{coordinator.hectares.toFixed(1)} ha</div>
                      <div className="text-xs text-muted-foreground">Total Land</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{coordinator.corridors}</div>
                      <div className="text-xs text-muted-foreground">Corridors</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Overall Performance</span>
                    <span className="font-medium">{coordinator.performance}%</span>
                  </div>
                  <Progress value={coordinator.performance} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
