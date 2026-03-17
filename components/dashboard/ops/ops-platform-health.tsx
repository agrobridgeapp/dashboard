// OPS Platform Health Dashboard Component
// Shows real-time platform health across all critical scenarios

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Activity,
  TrendingDown,
  TrendingUp,
  Wheat,
  FileText,
  AlertCircle,
} from "lucide-react"

interface PlatformHealthProps {
  corridors: any[]
  services: any[]
  contracts: any[]
  alerts: any[]
}

export function OpsPlatformHealth({ corridors, services, contracts, alerts }: PlatformHealthProps) {
  // Calculate platform-wide metrics
  const totalCorridors = corridors.length
  const healthyCorridors = corridors.filter((c) => c.status === "active").length
  const atRiskCorridors = corridors.filter((c) => c.status === "at-risk").length
  const criticalCorridors = corridors.filter((c) => c.status === "critical").length

  const avgSLA = corridors.reduce((sum, c) => sum + (c.slaAdherence || 0), 0) / corridors.length
  const avgYieldVariance =
    corridors.reduce((sum, c) => sum + (c.avgYieldPerformance || 100), 0) / corridors.length - 100

  const activeContracts = contracts.filter((c) => c.status === "active").length
  const atRiskContracts = contracts.filter((c) => c.status === "at-risk").length

  const criticalAlerts = alerts.filter((a) => a.priority === "critical" && a.status === "open").length
  const highAlerts = alerts.filter((a) => a.priority === "high" && a.status === "open").length

  const handleViewContractDetails = () => {
    toast.info("Navigating to contract details dashboard...")
  }

  const handleViewAllAlerts = () => {
    toast.info("Opening alerts management panel...")
  }

  return (
    <div className="space-y-6">
      {/* Platform Health Status */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Platform Health Status</CardTitle>
              <CardDescription>Real-time system health across all corridors</CardDescription>
            </div>
            <Badge
              variant={criticalCorridors > 0 ? "destructive" : atRiskCorridors > 0 ? "secondary" : "default"}
              className={
                criticalCorridors > 0
                  ? ""
                  : atRiskCorridors > 0
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-100 text-emerald-700"
              }
            >
              {criticalCorridors > 0 ? "Critical" : atRiskCorridors > 0 ? "Attention Needed" : "Healthy"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-4 p-4 border border-border/50 rounded-lg bg-emerald-50/50">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              <div>
                <p className="text-2xl font-bold text-emerald-900">{healthyCorridors}</p>
                <p className="text-sm text-emerald-700">Healthy Corridors</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 border border-border/50 rounded-lg bg-amber-50/50">
              <AlertTriangle className="h-8 w-8 text-amber-600" />
              <div>
                <p className="text-2xl font-bold text-amber-900">{atRiskCorridors}</p>
                <p className="text-sm text-amber-700">At Risk</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 border border-border/50 rounded-lg bg-red-50/50">
              <XCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-900">{criticalCorridors}</p>
                <p className="text-sm text-red-700">Critical</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Execution Health */}
        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-base">Execution Health</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">SLA Adherence</span>
                <span
                  className={`text-sm font-bold ${avgSLA >= 90 ? "text-emerald-600" : avgSLA >= 80 ? "text-amber-600" : "text-red-600"}`}
                >
                  {avgSLA.toFixed(1)}%
                </span>
              </div>
              <Progress value={avgSLA} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Target: 90% | {avgSLA >= 90 ? "On track" : "Below target"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-2xl font-bold text-emerald-600">
                  {services.filter((s) => s.status === "completed").length}
                </p>
                <p className="text-sm text-muted-foreground">Services Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">
                  {services.filter((s) => s.status === "delayed").length}
                </p>
                <p className="text-sm text-muted-foreground">Services Delayed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Yield Performance */}
        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Wheat className="h-5 w-5 text-emerald-600" />
              <CardTitle className="text-base">Yield Performance</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Avg Yield vs Expected</span>
                <span
                  className={`flex items-center gap-1 text-sm font-bold ${avgYieldVariance >= 0 ? "text-emerald-600" : "text-red-600"}`}
                >
                  {avgYieldVariance >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {avgYieldVariance >= 0 ? "+" : ""}
                  {avgYieldVariance.toFixed(1)}%
                </span>
              </div>
              <Progress value={Math.max(0, 100 + avgYieldVariance)} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {avgYieldVariance >= 0 ? "Above target" : "Below expected, investigate causes"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-2xl font-bold text-emerald-600">
                  {corridors.reduce((sum, c) => sum + (c.activeFarmers || 0), 0)}
                </p>
                <p className="text-sm text-muted-foreground">Active Farmers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">
                  {corridors.reduce((sum, c) => sum + (c.cropFailures || 0), 0)}
                </p>
                <p className="text-sm text-muted-foreground">Crop Failures</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contract Health */}
        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-base">Contract Health</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border border-emerald-200 rounded-lg bg-emerald-50">
                <p className="text-2xl font-bold text-emerald-700">{activeContracts}</p>
                <p className="text-sm text-emerald-600">Active Contracts</p>
              </div>
              <div className="p-3 border border-amber-200 rounded-lg bg-amber-50">
                <p className="text-2xl font-bold text-amber-700">{atRiskContracts}</p>
                <p className="text-sm text-amber-600">At Risk</p>
              </div>
            </div>

            {atRiskContracts > 0 && (
              <div className="p-3 border border-amber-200 rounded-lg bg-amber-50/50">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-900">Action Required</span>
                </div>
                <p className="text-xs text-amber-700">
                  {atRiskContracts} contracts need immediate attention to prevent breach
                </p>
              </div>
            )}

            <Button variant="outline" className="w-full bg-transparent" size="sm" onClick={handleViewContractDetails}>
              View Contract Details
            </Button>
          </CardContent>
        </Card>

        {/* Critical Alerts */}
        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <CardTitle className="text-base">Critical Alerts</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border border-red-200 rounded-lg bg-red-50">
                <p className="text-2xl font-bold text-red-700">{criticalAlerts}</p>
                <p className="text-sm text-red-600">Critical</p>
              </div>
              <div className="p-3 border border-amber-200 rounded-lg bg-amber-50">
                <p className="text-2xl font-bold text-amber-700">{highAlerts}</p>
                <p className="text-sm text-amber-600">High Priority</p>
              </div>
            </div>

            {criticalAlerts > 0 && (
              <div className="p-3 border border-red-200 rounded-lg bg-red-50/50">
                <p className="text-sm font-medium text-red-900 mb-2">Immediate Action Required</p>
                <ul className="text-xs text-red-700 space-y-1">
                  {alerts
                    .filter((a) => a.priority === "critical" && a.status === "open")
                    .slice(0, 3)
                    .map((alert) => (
                      <li key={alert.id}>• {alert.title}</li>
                    ))}
                </ul>
              </div>
            )}

            <Button variant="outline" className="w-full bg-transparent" size="sm" onClick={handleViewAllAlerts}>
              View All Alerts
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ChecklistItem({
  label,
  status,
  description,
}: {
  label: string
  status: boolean
  description: string
}) {
  return (
    <div className="flex items-start gap-3 p-3 border border-border/50 rounded-lg">
      {status ? (
        <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
      ) : (
        <XCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Badge variant={status ? "default" : "destructive"} className={status ? "bg-emerald-100 text-emerald-700" : ""}>
        {status ? "Pass" : "Fail"}
      </Badge>
    </div>
  )
}
