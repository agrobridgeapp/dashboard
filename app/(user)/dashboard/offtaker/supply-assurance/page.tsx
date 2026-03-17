"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowRight } from "lucide-react"
import {
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Wheat,
  Calendar,
  Target,
  Clock,
  RefreshCw,
} from "lucide-react"
import { apiClient } from "@/lib/api-client"

interface DeliveryWeek {
  week: string
  weekKey: string
  expected?: number
  delivered?: number
  status: "complete" | "in-progress" | "upcoming"
}

interface SupplyAssuranceData {
  totalContracted: number
  totalDelivered: number
  unit: string
  quarterLabel: string
  confidenceScore: number
  confidenceFactors: {
    farmerReliability: number
    historicalFulfilment: number
    currentProgress: number
  }
  qualityDistribution: {
    gradeA: number
    gradeB: number
    gradeC: number
    rejected: number
  }
  deliveryTimeline: DeliveryWeek[]
}

const STATIC_RISK_ALERTS = [
  {
    id: 1,
    type: "weather",
    severity: "medium",
    message: "Heavy rainfall expected in Kaduna corridor",
    impact: "45 MT potentially delayed by 5–7 days",
    mitigation: "Alternate logistics arranged from Kano",
    resolved: false,
  },
  {
    id: 2,
    type: "farmer",
    severity: "low",
    message: "2 farmers flagged for late planting",
    impact: "15 MT at risk of quality degradation",
    mitigation: "Reassigned to backup farmers in same cluster",
    resolved: true,
  },
  {
    id: 3,
    type: "logistics",
    severity: "low",
    message: "Transport partner capacity constraint",
    impact: "Week 3 deliveries may shift by 2 days",
    mitigation: "Secondary partner activated",
    resolved: true,
  },
]

function LoadingSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4 sm:p-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-3" />
              <div className="h-8 bg-muted rounded w-1/2 mb-2" />
              <div className="h-3 bg-muted rounded w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function SupplyAssurancePage() {
  const [data, setData] = useState<SupplyAssuranceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res: any = await apiClient.supplyAssurance.get()
      setData(res.data)
      setLastUpdated(new Date())
    } catch {
      // leave data as-is on error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fulfilmentPercentage = data
    ? Math.min(100, Math.round((data.totalDelivered / (data.totalContracted || 1)) * 100))
    : 0

  const activeAlerts = STATIC_RISK_ALERTS.filter((a) => !a.resolved).length
  const resolvedAlerts = STATIC_RISK_ALERTS.filter((a) => a.resolved).length

  const maxBarValue = data
    ? Math.max(...data.deliveryTimeline.map((w) => w.delivered ?? w.expected ?? 0), 1)
    : 300

  return (
    <DashboardLayout allowedRoles={["offtaker"]}>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Supply Assurance</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Predictable, visible, quality-assured supply you can plan around
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <RefreshCw
              className={`h-3.5 w-3.5 sm:h-4 sm:w-4 cursor-pointer hover:text-foreground transition-colors ${loading ? "animate-spin" : ""}`}
              onClick={fetchData}
            />
            {lastUpdated
              ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
              : "Loading..."}
          </div>
        </div>

        {loading && !data ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* Hero Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Card className="border-[#1B5E3C]/20 bg-gradient-to-br from-[#1B5E3C]/5 to-transparent">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Contracted Supply</p>
                      <p className="text-xl sm:text-3xl font-bold mt-1">
                        {(data?.totalContracted ?? 0).toLocaleString()}
                        <span className="text-sm sm:text-lg font-normal text-muted-foreground ml-1">MT</span>
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1 hidden sm:block">
                        Secured for {data?.quarterLabel}
                      </p>
                    </div>
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#1B5E3C]/10 shrink-0 ml-2">
                      <Wheat className="h-5 w-5 sm:h-6 sm:w-6 text-[#1B5E3C]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#1B5E3C]/20 bg-gradient-to-br from-[#1B5E3C]/5 to-transparent">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Fulfilment Confidence</p>
                      <p className="text-xl sm:text-3xl font-bold mt-1">
                        {data?.confidenceScore ?? 0}
                        <span className="text-sm sm:text-lg font-normal text-muted-foreground">%</span>
                      </p>
                      <p className="text-xs text-[#1B5E3C] mt-1 items-center gap-1 hidden sm:flex">
                        <TrendingUp className="h-3 w-3" />
                        Based on delivery progress
                      </p>
                    </div>
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#1B5E3C]/10 shrink-0 ml-2">
                      <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-[#1B5E3C]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#1B5E3C]/20 bg-gradient-to-br from-[#1B5E3C]/5 to-transparent">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Quality Forecast</p>
                      <p className="text-xl sm:text-3xl font-bold mt-1">
                        {((data?.qualityDistribution.gradeA ?? 0) + (data?.qualityDistribution.gradeB ?? 0))}
                        <span className="text-sm sm:text-lg font-normal text-muted-foreground">%</span>
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1 hidden sm:block">Grade A/B assured</p>
                    </div>
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#1B5E3C]/10 shrink-0 ml-2">
                      <Target className="h-5 w-5 sm:h-6 sm:w-6 text-[#1B5E3C]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#1B5E3C]/20 bg-gradient-to-br from-[#1B5E3C]/5 to-transparent">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Risk Alerts</p>
                      <p className="text-xl sm:text-3xl font-bold mt-1">
                        {activeAlerts}
                        <span className="text-sm sm:text-lg font-normal text-muted-foreground ml-1">active</span>
                      </p>
                      <p className="text-xs text-[#1B5E3C] mt-1 items-center gap-1 hidden sm:flex">
                        <CheckCircle2 className="h-3 w-3" />
                        {resolvedAlerts} mitigated this week
                      </p>
                    </div>
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-amber-500/10 shrink-0 ml-2">
                      <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-4 sm:gap-6 xl:grid-cols-3">
              {/* Delivery Progress */}
              <div className="xl:col-span-2 space-y-4 sm:space-y-6">
                <Card>
                  <CardHeader className="pb-3 sm:pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <CardTitle className="text-base sm:text-lg">Fulfilment Progress</CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                          {data?.quarterLabel} delivery tracking
                        </CardDescription>
                      </div>
                      <Badge className="bg-[#1B5E3C] w-fit">{fulfilmentPercentage}% Complete</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    {data && data.totalContracted > 0 ? (
                      <>
                        <div>
                          <div className="flex justify-between text-xs sm:text-sm mb-2">
                            <span className="text-muted-foreground">
                              {data.totalDelivered.toLocaleString()} of {data.totalContracted.toLocaleString()} MT
                            </span>
                            <span className="font-medium">
                              {(data.totalContracted - data.totalDelivered).toLocaleString()} MT remaining
                            </span>
                          </div>
                          <Progress value={fulfilmentPercentage} className="h-2 sm:h-3" />
                        </div>

                        {data.deliveryTimeline.length > 0 && (
                          <div>
                            <h4 className="text-xs sm:text-sm font-medium mb-3 sm:mb-4">Weekly Delivery Timeline</h4>
                            <div className="space-y-2 sm:space-y-3 max-h-[300px] sm:max-h-none overflow-y-auto">
                              {data.deliveryTimeline.map((week) => {
                                const displayValue = week.delivered ?? week.expected ?? 0
                                const barWidth = Math.min(100, (displayValue / maxBarValue) * 100)

                                return (
                                  <div key={week.weekKey} className="flex items-center gap-2 sm:gap-4">
                                    <span className="text-xs sm:text-sm text-muted-foreground w-14 sm:w-16 shrink-0">
                                      {week.week}
                                    </span>
                                    <div className="flex-1 flex items-center gap-2">
                                      <div className="flex-1 h-5 sm:h-6 bg-muted/30 rounded-full overflow-hidden relative">
                                        {week.status === "complete" && (
                                          <div
                                            className="h-full bg-[#1B5E3C] rounded-full flex items-center justify-end pr-2"
                                            style={{ width: `${barWidth}%` }}
                                          >
                                            <span className="text-[10px] sm:text-xs text-white font-medium">
                                              {week.delivered} MT
                                            </span>
                                          </div>
                                        )}
                                        {week.status === "in-progress" && (
                                          <div
                                            className="h-full bg-amber-500 rounded-full flex items-center justify-end pr-2 animate-pulse"
                                            style={{ width: `${barWidth}%` }}
                                          >
                                            <span className="text-[10px] sm:text-xs text-white font-medium">
                                              {displayValue} MT
                                            </span>
                                          </div>
                                        )}
                                        {week.status === "upcoming" && (
                                          <div
                                            className="h-full bg-muted rounded-full flex items-center justify-end pr-2"
                                            style={{ width: `${barWidth}%` }}
                                          >
                                            <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                                              {week.expected} MT
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                      {week.status === "complete" && (
                                        <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#1B5E3C] shrink-0" />
                                      )}
                                      {week.status === "in-progress" && (
                                        <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500 shrink-0" />
                                      )}
                                      {week.status === "upcoming" && (
                                        <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                                      )}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">No active contracts found.</p>
                    )}
                  </CardContent>
                </Card>

                {/* Risk Alerts */}
                <Card>
                  <CardHeader className="pb-3 sm:pb-4">
                    <div>
                      <CardTitle className="text-base sm:text-lg">Risk Monitoring</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Proactive alerts with automatic mitigations
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4">
                    {STATIC_RISK_ALERTS.map((alert) => (
                      <div
                        key={alert.id}
                        className={`rounded-lg border p-3 sm:p-4 ${alert.resolved ? "bg-muted/30 border-muted" : "border-amber-200 bg-amber-50"}`}
                      >
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div
                            className={`rounded-full p-1.5 sm:p-2 shrink-0 ${alert.resolved ? "bg-[#1B5E3C]/10" : "bg-amber-100"}`}
                          >
                            {alert.resolved ? (
                              <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#1B5E3C]" />
                            ) : (
                              <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start sm:items-center gap-2 flex-wrap">
                              <p className="font-medium text-xs sm:text-sm">{alert.message}</p>
                              <Badge
                                variant={alert.resolved ? "secondary" : "outline"}
                                className={`text-[10px] sm:text-xs ${alert.resolved ? "" : "border-amber-300 text-amber-700"}`}
                              >
                                {alert.resolved ? "Resolved" : "Active"}
                              </Badge>
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{alert.impact}</p>
                            <div className="flex items-center gap-1 mt-2 text-xs sm:text-sm text-[#1B5E3C]">
                              <ShieldCheck className="h-3 w-3" />
                              <span>{alert.mitigation}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-4 sm:space-y-6">
                {/* Confidence Breakdown */}
                <Card>
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="text-sm sm:text-base">Confidence Factors</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      What drives your {data?.confidenceScore ?? 0}% score
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4">
                    <div>
                      <div className="flex justify-between text-xs sm:text-sm mb-1">
                        <span className="text-muted-foreground">Delivery Reliability</span>
                        <span className="font-medium">{data?.confidenceFactors.farmerReliability ?? 0}%</span>
                      </div>
                      <Progress value={data?.confidenceFactors.farmerReliability ?? 0} className="h-1.5 sm:h-2" />
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Verified vs total deliveries</p>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs sm:text-sm mb-1">
                        <span className="text-muted-foreground">Historical Fulfilment</span>
                        <span className="font-medium">{data?.confidenceFactors.historicalFulfilment ?? 0}%</span>
                      </div>
                      <Progress value={data?.confidenceFactors.historicalFulfilment ?? 0} className="h-1.5 sm:h-2" />
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Fulfilled vs total contracts</p>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs sm:text-sm mb-1">
                        <span className="text-muted-foreground">Current Progress</span>
                        <span className="font-medium">{data?.confidenceFactors.currentProgress ?? 0}%</span>
                      </div>
                      <Progress value={data?.confidenceFactors.currentProgress ?? 0} className="h-1.5 sm:h-2" />
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Delivered vs contracted volume</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Quality Breakdown */}
                <Card>
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="text-sm sm:text-base">Quality Distribution</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      {data && (data.qualityDistribution.gradeA + data.qualityDistribution.gradeB + data.qualityDistribution.gradeC + data.qualityDistribution.rejected) > 0
                        ? "Based on verified deliveries"
                        : "No deliveries recorded yet"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-[#1B5E3C]" />
                          <span className="text-xs sm:text-sm">Grade A (Premium)</span>
                        </div>
                        <span className="text-xs sm:text-sm font-medium">
                          {data?.qualityDistribution.gradeA ?? 0}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-[#1B5E3C]/60" />
                          <span className="text-xs sm:text-sm">Grade B (Standard)</span>
                        </div>
                        <span className="text-xs sm:text-sm font-medium">
                          {data?.qualityDistribution.gradeB ?? 0}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-muted" />
                          <span className="text-xs sm:text-sm">Grade C (Below Spec)</span>
                        </div>
                        <span className="text-xs sm:text-sm font-medium">
                          {data?.qualityDistribution.gradeC ?? 0}%
                        </span>
                      </div>
                    </div>
                    {data && (data.qualityDistribution.gradeA + data.qualityDistribution.gradeB + data.qualityDistribution.gradeC) > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex h-3 rounded-full overflow-hidden">
                          <div className="bg-[#1B5E3C]" style={{ width: `${data.qualityDistribution.gradeA}%` }} />
                          <div className="bg-[#1B5E3C]/60" style={{ width: `${data.qualityDistribution.gradeB}%` }} />
                          <div className="bg-muted" style={{ width: `${data.qualityDistribution.gradeC}%` }} />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* AgroBridge vs Traditional Procurement */}
                <Card className="border-0 overflow-hidden shadow-lg">
                  <div className="bg-gradient-to-br from-[#1B5E3C] to-[#2D7A4E] p-6">
                    <h3 className="text-lg font-semibold text-white">What You Get With AgroBridge</h3>
                    <p className="text-sm text-white/70 mt-1">Compared to traditional procurement</p>

                    <div className="mt-6 space-y-4">
                      {[
                        { label: "Visibility", traditional: "At delivery", agrobridge: "6 months ahead" },
                        { label: "Default Rate", traditional: "25-40%", agrobridge: "< 8%" },
                        { label: "Quality Variance", traditional: "Unpredictable", agrobridge: "92% Grade A/B" },
                        { label: "Coordination", traditional: "100+ calls/week", agrobridge: "1 dashboard" },
                        { label: "Planning", traditional: "Reactive", agrobridge: "Predictive" },
                      ].map((row, index) => (
                        <div key={index} className="flex items-center justify-between flex-col sm:flex-row">
                          <span className="text-white/90 font-medium text-sm w-24 sm:w-auto">{row.label}</span>
                          <div className="flex items-center gap-3 mt-2 sm:mt-0">
                            <span className="text-white/50 line-through text-sm">{row.traditional}</span>
                            <ArrowRight className="h-4 w-4 text-white/60" />
                            <span className="text-white font-semibold text-sm">{row.agrobridge}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Footer note */}
            <p className="text-xs text-muted-foreground text-center">
              Supply assurance data reflects AgroBridge-coordinated corridors only. Data refreshes on page load.
            </p>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
