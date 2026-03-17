"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Award, CheckCircle2, Clock, Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

function monthKey(event: any): string {
  const d = new Date(event.actual_date || event.scheduled_date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

function formatMonthKey(key: string): string {
  const [year, month] = key.split("-")
  return new Date(Number(year), Number(month) - 1).toLocaleDateString("en-NG", { month: "long", year: "numeric" })
}

function wasOnTime(event: any): boolean {
  if (!event.actual_date || !event.scheduled_date) return true
  return new Date(event.actual_date) <= new Date(event.scheduled_date)
}

export default function PartnerPerformancePage() {
  const [events, setEvents] = useState<any[]>([])
  const [partner, setPartner] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [eventsRes, profileRes] = await Promise.all([
        apiClient.partnerMe.getServiceEvents(),
        apiClient.partnerMe.getProfile(),
      ])
      if (eventsRes.success) setEvents(eventsRes.data.events)
      if (profileRes.success) setPartner(profileRes.data)
    } catch {
      toast.error("Failed to load performance data")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const completed = events.filter((e) => e.status === "completed")
  const cancelled = events.filter((e) => e.status === "cancelled")
  const total = events.length

  const now = new Date()
  const thisMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1)
  const lastMonthKey = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, "0")}`

  const completedThisMonth = completed.filter((e) => monthKey(e) === thisMonthKey).length
  const completedLastMonth = completed.filter((e) => monthKey(e) === lastMonthKey).length
  const completedChange = completedLastMonth > 0
    ? completedThisMonth - completedLastMonth
    : null

  const onTimeCount = completed.filter(wasOnTime).length
  const onTimeRate = completed.length > 0 ? Math.round((onTimeCount / completed.length) * 100) : null

  const completionRate = (completed.length + cancelled.length) > 0
    ? Math.round((completed.length / (completed.length + cancelled.length)) * 100)
    : null

  const avgRating = partner?.average_rating ? Number(partner.average_rating).toFixed(1) : null

  // Monthly trend — last 6 months
  const monthlyMap: Record<string, number> = {}
  for (const e of completed) {
    const k = monthKey(e)
    monthlyMap[k] = (monthlyMap[k] || 0) + 1
  }
  const monthlyTrend = Object.entries(monthlyMap)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 6)

  return (
    <DashboardLayout allowedRoles={["partner"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Execution Quality</h1>
          <p className="text-muted-foreground">Track your job completion and service quality metrics</p>
        </div>

        <p className="text-xs text-muted-foreground">
          Quality Score is based on job completion, timeliness, and issue resolution for AgroBridge-coordinated jobs.
        </p>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid gap-6 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Jobs Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{completed.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {completedChange !== null
                      ? `${completedChange >= 0 ? "+" : ""}${completedChange} this month vs last`
                      : `${completedThisMonth} this month`}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">On-Time Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{onTimeRate !== null ? `${onTimeRate}%` : "—"}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {completed.length > 0 ? `${onTimeCount} of ${completed.length} jobs on time` : "No completed jobs yet"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Quality Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{avgRating ? `${avgRating} / 5` : "—"}</div>
                  <p className="text-xs text-muted-foreground mt-1">Based on execution metrics</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{total}</div>
                  <p className="text-xs text-muted-foreground mt-1">Assigned across all time</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Quality Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Execution Quality Breakdown
                  </CardTitle>
                  <CardDescription>Your performance across key operational areas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Job Completion Rate</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {completionRate !== null ? `${completionRate}%` : "—"}
                      </span>
                    </div>
                    <Progress value={completionRate ?? 0} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Timeliness / SLA</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {onTimeRate !== null ? `${onTimeRate}%` : "—"}
                      </span>
                    </div>
                    <Progress value={onTimeRate ?? 0} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Utilization</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {partner?.current_utilization_percent != null
                          ? `${Math.round(Number(partner.current_utilization_percent))}%`
                          : "—"}
                      </span>
                    </div>
                    <Progress value={partner?.current_utilization_percent ? Math.round(Number(partner.current_utilization_percent)) : 0} />
                  </div>
                </CardContent>
              </Card>

              {/* SLA Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    SLA Performance
                  </CardTitle>
                  <CardDescription>Service level agreement compliance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(() => {
                      const onTimePct = onTimeRate ?? 0
                      const compPct = completionRate ?? 0
                      const rows = [
                        {
                          metric: "Jobs Completed On Time",
                          target: "95%",
                          actual: onTimeRate !== null ? `${onTimeRate}%` : "—",
                          status: onTimePct >= 95 ? "met" : "below",
                        },
                        {
                          metric: "Job Completion Rate",
                          target: "90%",
                          actual: completionRate !== null ? `${completionRate}%` : "—",
                          status: compPct >= 90 ? "met" : "below",
                        },
                        {
                          metric: "Capacity Utilization",
                          target: "80%",
                          actual: partner?.current_utilization_percent != null
                            ? `${Math.round(Number(partner.current_utilization_percent))}%`
                            : "—",
                          status: Number(partner?.current_utilization_percent ?? 0) >= 80 ? "met" : "below",
                        },
                      ]
                      return rows.map((sla, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                          <div>
                            <p className="font-medium text-sm">{sla.metric}</p>
                            <p className="text-xs text-muted-foreground">Target: {sla.target}</p>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${sla.status === "met" ? "text-emerald-600" : "text-amber-600"}`}>
                              {sla.actual}
                            </p>
                            <p className={`text-xs ${sla.status === "met" ? "text-emerald-600" : "text-amber-600"}`}>
                              {sla.actual === "—" ? "No data" : sla.status === "met" ? "Target Met" : "Below Target"}
                            </p>
                          </div>
                        </div>
                      ))
                    })()}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Execution Trend</CardTitle>
                <CardDescription>Your job completion over the past 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                {monthlyTrend.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No completed jobs yet</p>
                ) : (
                  <div className="space-y-4">
                    {monthlyTrend.map(([key, count]) => (
                      <div key={key} className="flex items-center justify-between p-3 rounded-lg border">
                        <div>
                          <div className="font-medium">{formatMonthKey(key)}</div>
                          <div className="text-sm text-muted-foreground">{count} job{count !== 1 ? "s" : ""} completed</div>
                        </div>
                        {avgRating && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Quality:</span>
                            <span className="font-semibold">{avgRating} / 5</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
