"use client"

import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, AlertCircle, Info, Clock } from "lucide-react"

export default function RegionalAlertsPage() {
  // Demo data - alerts and issues
  const alerts = [
    {
      id: "ALT001",
      type: "critical",
      state: "Kaduna",
      title: "Low Service Completion Rate",
      description: "Service completion rate dropped to 58% this month, below 70% threshold",
      timestamp: "2 hours ago",
    },
    {
      id: "ALT002",
      type: "warning",
      state: "Enugu",
      title: "Field Agent Shortage",
      description: "2 field agents inactive for 5+ days, affecting 34 farmers",
      timestamp: "5 hours ago",
    },
    {
      id: "ALT003",
      type: "info",
      state: "Lagos",
      title: "Quarterly Target Achieved",
      description: "Lagos state reached 100% of quarterly farmer enrollment target",
      timestamp: "1 day ago",
    },
    {
      id: "ALT004",
      type: "warning",
      state: "Ogun",
      title: "Pending Reviews Backlog",
      description: "15 farmer registrations pending coordinator review for 3+ days",
      timestamp: "1 day ago",
    },
    {
      id: "ALT005",
      type: "critical",
      state: "Kaduna",
      title: "Yield Variance Alert",
      description: "Actual yield 25% below expected in 3 corridors, needs investigation",
      timestamp: "2 days ago",
    },
  ]

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-600" />
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  const getAlertBadge = (type: string) => {
    switch (type) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "warning":
        return <Badge className="bg-amber-100 text-amber-700">Warning</Badge>
      case "info":
        return <Badge className="bg-blue-100 text-blue-700">Info</Badge>
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  const criticalCount = alerts.filter((a) => a.type === "critical").length
  const warningCount = alerts.filter((a) => a.type === "warning").length
  const infoCount = alerts.filter((a) => a.type === "info").length

  return (
    <DashboardLayout allowedRoles={["regional_manager"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Alerts & Issues</h1>
          <p className="text-muted-foreground">Monitor critical issues and notifications across your region</p>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Critical Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Warnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{warningCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Info Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{infoCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>All alerts and notifications from your region</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <Card key={alert.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {getAlertBadge(alert.type)}
                              <span className="text-sm text-muted-foreground">{alert.state}</span>
                            </div>
                            <h4 className="font-semibold">{alert.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {alert.timestamp}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
