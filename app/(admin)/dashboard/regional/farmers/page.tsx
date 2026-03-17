"use client"

import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Users, TrendingUp } from "lucide-react"

export default function RegionalFarmersPage() {
  // Demo data - farmers across region by state
  const farmersByState = [
    { state: "Lagos", farmers: 145, hectares: 456.8, active: 138, pending: 7 },
    { state: "Enugu", farmers: 112, hectares: 378.5, active: 108, pending: 4 },
    { state: "Ogun", farmers: 98, hectares: 312.5, active: 94, pending: 4 },
    { state: "Kaduna", farmers: 178, hectares: 523.2, active: 165, pending: 13 },
  ]

  const totalStats = {
    farmers: farmersByState.reduce((sum, s) => sum + s.farmers, 0),
    hectares: farmersByState.reduce((sum, s) => sum + s.hectares, 0),
    active: farmersByState.reduce((sum, s) => sum + s.active, 0),
    pending: farmersByState.reduce((sum, s) => sum + s.pending, 0),
  }

  return (
    <DashboardLayout allowedRoles={["regional_manager"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Farmers Overview</h1>
          <p className="text-muted-foreground">Regional summary of all enrolled farmers</p>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Farmers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.pending}</div>
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

        {/* Farmers by State */}
        <Card>
          <CardHeader>
            <CardTitle>Farmers by State</CardTitle>
            <CardDescription>Distribution of farmers across your region</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {farmersByState.map((state) => (
                <div key={state.state} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{state.state}</h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {state.farmers} farmers
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          {state.hectares.toFixed(1)} ha
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {state.active} active · {state.pending} pending
                      </div>
                    </div>
                  </div>
                  <Progress value={(state.active / state.farmers) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
