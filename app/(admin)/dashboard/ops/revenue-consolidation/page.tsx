"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useDataStore } from "@/lib/data/data-store"
import {
  TrendingUp,
  DollarSign,
  Activity,
  Target,
  CheckCircle2,
  AlertCircle,
  Calendar,
  TrendingDown,
  Package,
  ThumbsUp,
} from "lucide-react"

export default function OperationsPerformancePage() {
  const { corridors } = useDataStore()
  const [selectedCorridor, setSelectedCorridor] = useState("corridor-kaduna-001")
  const [selectedSeason, setSelectedSeason] = useState("season-2024-wet")

  const operationalData = {
    // Core metrics
    corridorName: "Kaduna Maize Corridor",
    season: "2024 Wet Season",
    status: "Harvest Complete",
    seasonStart: "2024-04-15",
    seasonEnd: "2024-09-15",
    daysElapsed: 153,

    // Farmer metrics
    totalFarmers: 1228,
    activeFarmers: 1156,
    farmerEngagementRate: 94.1,
    avgFarmerSatisfaction: 4.3,

    // Land metrics
    totalHectares: 4732,
    avgHectaresPerFarmer: 3.85,

    // Service delivery metrics
    totalServices: 8596,
    completedServices: 7324,
    serviceCompletionRate: 85.2,
    slaAdherence: 87.3,
    pendingServices: 248,

    // Yield performance
    expectedYield: 14196,
    actualYield: 12891,
    yieldVariance: -9.2,
    avgYieldPerHectare: 2.72,

    // Financial performance
    totalValueDelivered: 377000000, // ₦377m
    totalServiceCosts: 282000000, // ₦282m
    coordinationValue: 95000000, // ₦95m
    efficiencyRatio: 25.2,

    // Contract performance
    activeContracts: 3,
    contractedVolume: 800,
    deliveredVolume: 487,
    contractFulfillment: 60.9,
  }

  const serviceStreams = [
    {
      name: "Core Farmer Services",
      description: "Land prep, inputs, mechanization, harvest",
      valueDelivered: 165600000,
      percentage: 43.9,
      servicesCompleted: 6156,
      completionRate: 98.2,
      status: "excellent",
    },
    {
      name: "Offtake Coordination",
      description: "Buyer matching, logistics, quality assurance",
      valueDelivered: 146400000,
      percentage: 38.8,
      servicesCompleted: 892,
      completionRate: 86.4,
      status: "good",
    },
    {
      name: "Advisory & Monitoring",
      description: "Agronomist visits, field monitoring, recommendations",
      valueDelivered: 65000000,
      percentage: 17.2,
      servicesCompleted: 276,
      completionRate: 82.1,
      status: "attention",
    },
  ]

  const operationalAlerts = [
    {
      type: "attention",
      message: "248 pending service requests need assignment",
      action: "Review & assign",
      priority: "high",
    },
    {
      type: "warning",
      message: "Contract fulfillment at 60.9% - 313 tons remaining",
      action: "Accelerate harvest & logistics",
      priority: "high",
    },
    {
      type: "info",
      message: "Yield variance -9.2% due to rainfall timing in Zone B",
      action: "Review advisory schedule",
      priority: "medium",
    },
    {
      type: "success",
      message: "87.3% SLA adherence - 4 corridors above target",
      action: "Share best practices",
      priority: "low",
    },
  ]

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `₦${(amount / 1000000).toFixed(1)}M`
    }
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-NG").format(num)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-500"
      case "good":
        return "bg-blue-500"
      case "attention":
        return "bg-amber-500"
      default:
        return "bg-gray-400"
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-amber-600" />
      case "attention":
        return <AlertCircle className="h-4 w-4 text-orange-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-blue-600" />
    }
  }

  return (
    <DashboardLayout role="ops_admin">
      <div className="space-y-6">
        {/* Header with Executive Summary */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Corridor Operations Command Center</h1>
              <p className="text-muted-foreground mt-2">
                Real-time performance tracking, service delivery monitoring, and operational intelligence
              </p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {operationalData.status}
            </Badge>
          </div>

          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <p className="text-sm leading-relaxed">
                <strong>{operationalData.corridorName}</strong> completed the {operationalData.season} with{" "}
                <strong>{formatNumber(operationalData.activeFarmers)} active farmers</strong> managing{" "}
                <strong>{formatNumber(operationalData.totalHectares)} hectares</strong>. We delivered{" "}
                <strong>{formatCurrency(operationalData.coordinationValue)}</strong> in coordination value at{" "}
                <strong>{operationalData.efficiencyRatio.toFixed(1)}% efficiency</strong>, achieving{" "}
                <strong>{operationalData.serviceCompletionRate.toFixed(1)}%</strong> service completion and{" "}
                <strong>{operationalData.slaAdherence.toFixed(1)}%</strong> SLA adherence.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center">
          <div className="flex-1 max-w-xs">
            <label className="text-sm font-medium mb-2 block">Corridor</label>
            <Select value={selectedCorridor} onValueChange={setSelectedCorridor}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="corridor-kaduna-001">Kaduna Maize Corridor</SelectItem>
                <SelectItem value="corridor-niger-002">Niger Rice Corridor</SelectItem>
                <SelectItem value="corridor-benue-003">Benue Soybean Corridor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 max-w-xs">
            <label className="text-sm font-medium mb-2 block">Season</label>
            <Select value={selectedSeason} onValueChange={setSelectedSeason}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="season-2024-wet">2024 Wet Season</SelectItem>
                <SelectItem value="season-2024-dry">2024 Dry Season</SelectItem>
                <SelectItem value="season-2023-wet">2023 Wet Season</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertCircle className="h-5 w-5" />
              Action Items & Alerts
            </CardTitle>
            <CardDescription>Items requiring attention or operational updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {operationalAlerts.map((alert, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.action}</p>
                  </div>
                  <Badge variant={alert.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                    {alert.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Service Completion</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{operationalData.serviceCompletionRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatNumber(operationalData.completedServices)} of {formatNumber(operationalData.totalServices)}{" "}
                services
              </p>
              <div className="mt-2 h-1 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: `${operationalData.serviceCompletionRate}%` }} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SLA Performance</CardTitle>
              <Target className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{operationalData.slaAdherence.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1">On-time delivery adherence</p>
              <div className="mt-2 h-1 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${operationalData.slaAdherence}%` }} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Farmer Engagement</CardTitle>
              <ThumbsUp className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{operationalData.farmerEngagementRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatNumber(operationalData.activeFarmers)} of {formatNumber(operationalData.totalFarmers)} active
              </p>
              <p className="text-xs text-emerald-600 font-medium mt-1">
                Satisfaction: {operationalData.avgFarmerSatisfaction}/5.0
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Yield Performance</CardTitle>
              {operationalData.yieldVariance < 0 ? (
                <TrendingDown className="h-4 w-4 text-amber-600" />
              ) : (
                <TrendingUp className="h-4 w-4 text-green-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{operationalData.avgYieldPerHectare.toFixed(2)} t/ha</div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatNumber(operationalData.actualYield)} tons total
              </p>
              <p
                className={`text-xs font-medium mt-1 ${operationalData.yieldVariance < 0 ? "text-amber-600" : "text-green-600"}`}
              >
                {operationalData.yieldVariance > 0 ? "+" : ""}
                {operationalData.yieldVariance.toFixed(1)}% vs expected
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Season Timeline & Progress
            </CardTitle>
            <CardDescription>
              {operationalData.seasonStart} to {operationalData.seasonEnd} ({operationalData.daysElapsed} days elapsed)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="space-y-2">
                  <div className="h-2 w-full bg-green-500 rounded-full" />
                  <p className="text-sm font-medium">Land Prep</p>
                  <p className="text-xs text-green-600">Complete</p>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-green-500 rounded-full" />
                  <p className="text-sm font-medium">Planting</p>
                  <p className="text-xs text-green-600">Complete</p>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-blue-500 rounded-full" />
                  <p className="text-sm font-medium">Harvest</p>
                  <p className="text-xs text-blue-600">95% Complete</p>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-amber-500 rounded-full" />
                  <p className="text-sm font-medium">Delivery</p>
                  <p className="text-xs text-amber-600">61% Complete</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Service Stream Performance
              </CardTitle>
              <CardDescription>Value delivered and completion rates by service category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {serviceStreams.map((stream) => (
                <div key={stream.name} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium leading-none">{stream.name}</p>
                        <div className={`h-2 w-2 rounded-full ${getStatusColor(stream.status)}`} />
                      </div>
                      <p className="text-xs text-muted-foreground">{stream.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span>{formatNumber(stream.servicesCompleted)} services</span>
                        <span>•</span>
                        <span className="font-medium text-foreground">{stream.completionRate}% complete</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{formatCurrency(stream.valueDelivered)}</p>
                      <p className="text-xs text-muted-foreground">{stream.percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getStatusColor(stream.status)}`}
                      style={{ width: `${stream.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Performance
              </CardTitle>
              <CardDescription>Value creation and operational efficiency</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b">
                  <span className="text-sm text-muted-foreground">Total Value Delivered</span>
                  <span className="text-lg font-bold">{formatCurrency(operationalData.totalValueDelivered)}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b">
                  <span className="text-sm text-muted-foreground">Service & Execution Costs</span>
                  <span className="text-lg font-medium">{formatCurrency(operationalData.totalServiceCosts)}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b">
                  <span className="text-sm font-medium">Coordination Value Created</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(operationalData.coordinationValue)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-medium">Operational Efficiency</span>
                  <div className="text-right">
                    <span className="text-lg font-bold text-blue-600">
                      {operationalData.efficiencyRatio.toFixed(1)}%
                    </span>
                    <p className="text-xs text-muted-foreground">Target: 20-30%</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase">Unit Economics</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Per Farmer</p>
                    <p className="text-lg font-bold">
                      {formatCurrency(operationalData.coordinationValue / operationalData.totalFarmers)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Per Hectare</p>
                    <p className="text-lg font-bold">
                      {formatCurrency(operationalData.coordinationValue / operationalData.totalHectares)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Contract Fulfillment & Offtake
            </CardTitle>
            <CardDescription>Buyer contract delivery performance and logistics status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Active Contracts</p>
                <p className="text-3xl font-bold">{operationalData.activeContracts}</p>
                <p className="text-xs text-muted-foreground">With 3 offtaker partners</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Contracted Volume</p>
                <p className="text-3xl font-bold">{formatNumber(operationalData.contractedVolume)}</p>
                <p className="text-xs text-muted-foreground">tons total commitment</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Fulfillment Rate</p>
                <p className="text-3xl font-bold">{operationalData.contractFulfillment.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(operationalData.deliveredVolume)} of {formatNumber(operationalData.contractedVolume)}{" "}
                  tons delivered
                </p>
              </div>
            </div>

            <div className="mt-4">
              <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-green-500"
                  style={{ width: `${operationalData.contractFulfillment}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {formatNumber(operationalData.contractedVolume - operationalData.deliveredVolume)} tons remaining •
                Estimated completion in 18 days
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
