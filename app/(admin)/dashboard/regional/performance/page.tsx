"use client"

import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown } from "lucide-react"

export default function RegionalPerformancePage() {
  // Demo data - regional performance metrics
  const performanceData = {
    overall: {
      farmers: { current: 533, target: 600, percentage: 89 },
      hectares: { current: 1671, target: 2000, percentage: 84 },
      services: { current: 1245, target: 1500, percentage: 83 },
      yield: { current: 2.8, target: 3.2, percentage: 88 },
    },
    byState: [
      { state: "Lagos", farmers: 145, hectares: 456.8, services: 345, performance: 85 },
      { state: "Enugu", farmers: 112, hectares: 378.5, services: 298, performance: 72 },
      { state: "Ogun", farmers: 98, hectares: 312.5, services: 267, performance: 78 },
      { state: "Kaduna", farmers: 178, hectares: 523.2, services: 335, performance: 62 },
    ],
    trends: [
      { month: "Oct 2024", farmers: 423, services: 998 },
      { month: "Nov 2024", farmers: 478, services: 1089 },
      { month: "Dec 2024", farmers: 512, services: 1167 },
      { month: "Jan 2025", farmers: 533, services: 1245 },
    ],
  }

  return (
    <DashboardLayout allowedRoles={["regional_manager"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Regional Performance</h1>
          <p className="text-muted-foreground">Track performance metrics across your entire region</p>
        </div>

        {/* Overall Targets */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Farmers Enrolled</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold">
                {performanceData.overall.farmers.current} / {performanceData.overall.farmers.target}
              </div>
              <Progress value={performanceData.overall.farmers.percentage} className="h-2" />
              <p className="text-xs text-muted-foreground">{performanceData.overall.farmers.percentage}% of target</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Hectares Coordinated</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold">
                {performanceData.overall.hectares.current} / {performanceData.overall.hectares.target}
              </div>
              <Progress value={performanceData.overall.hectares.percentage} className="h-2" />
              <p className="text-xs text-muted-foreground">{performanceData.overall.hectares.percentage}% of target</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Services Completed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold">
                {performanceData.overall.services.current} / {performanceData.overall.services.target}
              </div>
              <Progress value={performanceData.overall.services.percentage} className="h-2" />
              <p className="text-xs text-muted-foreground">{performanceData.overall.services.percentage}% of target</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Yield (tons/ha)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold">
                {performanceData.overall.yield.current} / {performanceData.overall.yield.target}
              </div>
              <Progress value={performanceData.overall.yield.percentage} className="h-2" />
              <p className="text-xs text-muted-foreground">{performanceData.overall.yield.percentage}% of target</p>
            </CardContent>
          </Card>
        </div>

        {/* State Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Performance by State</CardTitle>
            <CardDescription>Compare performance across all states in your region</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceData.byState.map((state) => (
                <div key={state.state} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-semibold">{state.state}</h4>
                      <p className="text-sm text-muted-foreground">
                        {state.farmers} farmers · {state.hectares.toFixed(1)} ha · {state.services} services
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{state.performance}%</div>
                      <p className="text-xs text-muted-foreground">Overall Score</p>
                    </div>
                  </div>
                  <Progress value={state.performance} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Growth Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Growth Trends</CardTitle>
            <CardDescription>Month-over-month growth in key metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceData.trends.map((trend, index) => {
                const prevTrend = performanceData.trends[index - 1]
                const farmerGrowth = prevTrend ? ((trend.farmers - prevTrend.farmers) / prevTrend.farmers) * 100 : 0
                const serviceGrowth = prevTrend ? ((trend.services - prevTrend.services) / prevTrend.services) * 100 : 0

                return (
                  <div key={trend.month} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="font-medium">{trend.month}</div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-right">
                        <div className="font-medium">{trend.farmers} farmers</div>
                        {prevTrend && (
                          <div
                            className={`flex items-center gap-1 ${farmerGrowth >= 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {farmerGrowth >= 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {Math.abs(farmerGrowth).toFixed(1)}%
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{trend.services} services</div>
                        {prevTrend && (
                          <div
                            className={`flex items-center gap-1 ${serviceGrowth >= 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {serviceGrowth >= 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {Math.abs(serviceGrowth).toFixed(1)}%
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
