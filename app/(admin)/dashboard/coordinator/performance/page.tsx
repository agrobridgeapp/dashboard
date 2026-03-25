"use client"

import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Users, Target, Award } from "lucide-react"

export default function CoordinatorPerformancePage() {
  const monthlyPerformance = [
    { month: "Jan", farmers: 245, completion: 84, quality: 82 },
    { month: "Feb", farmers: 278, completion: 87, quality: 85 },
    { month: "Mar", farmers: 302, completion: 89, quality: 86 },
    { month: "Apr", farmers: 324, completion: 87, quality: 84 },
  ]

  const metrics = [
    {
      label: "Total Farmers Onboarded",
      value: "324",
      change: "+22 vs last month",
      trend: "up",
      icon: Users,
    },
    {
      label: "Team Completion Rate",
      value: "87%",
      change: "-2% vs last month",
      trend: "down",
      icon: Target,
    },
    {
      label: "Team Quality Score",
      value: "84/100",
      change: "Same as last month",
      trend: "neutral",
      icon: Award,
    },
  ]

  return (
    <DashboardLayout allowedRoles={["state_coordinator"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Team Performance</h1>
          <p className="text-muted-foreground">Track your team's progress and key metrics over time</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {metrics.map((metric) => (
            <Card key={metric.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                <metric.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  {metric.trend === "up" && <TrendingUp className="h-3 w-3 text-green-600" />}
                  {metric.trend === "down" && <TrendingDown className="h-3 w-3 text-red-600" />}
                  {metric.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
            <CardDescription>Track your team's performance over the last 4 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Month</th>
                    <th className="text-right p-3 font-medium">Farmers Onboarded</th>
                    <th className="text-right p-3 font-medium">Completion Rate</th>
                    <th className="text-right p-3 font-medium">Quality Score</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyPerformance.map((month) => (
                    <tr key={month.month} className="border-b">
                      <td className="p-3 font-medium">{month.month}</td>
                      <td className="text-right p-3">{month.farmers}</td>
                      <td className="text-right p-3">{month.completion}%</td>
                      <td className="text-right p-3">{month.quality}/100</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
