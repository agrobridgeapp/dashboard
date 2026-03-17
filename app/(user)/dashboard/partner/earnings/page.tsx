"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, TrendingUp, Calendar, ArrowUpRight, Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`
}

function eventCost(event: any): number {
  return Number(event.actual_cost ?? event.estimated_cost ?? 0)
}

function isPending(event: any): boolean {
  return ["scheduled", "in_progress"].includes(event.status)
}

function isCompleted(event: any): boolean {
  return event.status === "completed"
}

function eventMonthKey(event: any): string {
  const d = new Date(event.actual_date || event.scheduled_date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

function formatMonthKey(key: string): string {
  const [year, month] = key.split("-")
  return new Date(Number(year), Number(month) - 1).toLocaleDateString("en-NG", { month: "short", year: "numeric" })
}

function eventLabel(event: any): string {
  return (event.service_type || "Service").replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())
}

export default function PartnerSettlementsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await apiClient.partnerMe.getServiceEvents()
      if (res.success) setEvents(res.data.events)
    } catch {
      toast.error("Failed to load settlements")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const now = new Date()
  const thisMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1)
  const lastMonthKey = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, "0")}`

  const completedEvents = events.filter(isCompleted)
  const pendingEvents = events.filter(isPending)

  const thisMonthTotal = completedEvents
    .filter((e) => eventMonthKey(e) === thisMonthKey)
    .reduce((sum, e) => sum + eventCost(e), 0)

  const lastMonthTotal = completedEvents
    .filter((e) => eventMonthKey(e) === lastMonthKey)
    .reduce((sum, e) => sum + eventCost(e), 0)

  const pendingTotal = pendingEvents.reduce((sum, e) => sum + eventCost(e), 0)

  const growth = lastMonthTotal > 0
    ? Math.round(((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100)
    : null

  // Monthly summary — last 6 months of completed events
  const monthlyMap: Record<string, { total: number; count: number }> = {}
  for (const e of completedEvents) {
    const key = eventMonthKey(e)
    if (!monthlyMap[key]) monthlyMap[key] = { total: 0, count: 0 }
    monthlyMap[key].total += eventCost(e)
    monthlyMap[key].count += 1
  }
  const monthlySummary = Object.entries(monthlyMap)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 6)

  const allEvents = [...completedEvents, ...pendingEvents].sort((a, b) => {
    const da = new Date(a.actual_date || a.scheduled_date).getTime()
    const db = new Date(b.actual_date || b.scheduled_date).getTime()
    return db - da
  })

  function EventRow({ event, showJobs = true }: { event: any; showJobs?: boolean }) {
    const settled = isCompleted(event)
    const cost = eventCost(event)
    const dateStr = event.actual_date || event.scheduled_date
      ? new Date(event.actual_date || event.scheduled_date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })
      : "—"
    return (
      <div className="flex items-center justify-between p-4 rounded-lg border border-border/50">
        <div className="flex items-center gap-4">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${settled ? "bg-emerald-100" : "bg-amber-100"}`}>
            <ArrowUpRight className={`h-5 w-5 ${settled ? "text-emerald-600" : "text-amber-600"}`} />
          </div>
          <div>
            <p className="font-medium">{eventLabel(event)}</p>
            {showJobs && (
              <p className="text-xs text-muted-foreground">
                {event.notes ? event.notes.slice(0, 60) : dateStr}
              </p>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className={`font-semibold ${settled ? "text-emerald-600" : "text-amber-600"}`}>
            {cost > 0 ? formatNaira(cost) : "—"}
          </p>
          <div className="flex items-center justify-end gap-2 mt-0.5">
            <span className="text-xs text-muted-foreground">{dateStr}</span>
            <Badge
              variant="outline"
              className={settled
                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                : "bg-amber-100 text-amber-700 border-amber-200"}
            >
              {settled ? "completed" : event.status.replace("_", " ")}
            </Badge>
          </div>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout allowedRoles={["partner"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settlements</h1>
          <p className="text-muted-foreground">Track payments for completed AgroBridge-coordinated jobs</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                  <Wallet className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{loading ? "—" : formatNaira(thisMonthTotal)}</p>
                  <p className="text-sm text-muted-foreground">This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{loading ? "—" : formatNaira(lastMonthTotal)}</p>
                  <p className="text-sm text-muted-foreground">Last Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${growth !== null && growth >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {loading || growth === null ? "—" : `${growth >= 0 ? "+" : ""}${growth}%`}
                  </p>
                  <p className="text-sm text-muted-foreground">Growth</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                  <Wallet className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{loading ? "—" : formatNaira(pendingTotal)}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <p className="text-xs text-muted-foreground -mt-2">
          Settlements reflect completed and approved AgroBridge-coordinated jobs only.
        </p>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Transactions */}
            <div className="lg:col-span-2">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Settlement History</CardTitle>
                  <CardDescription>Your recent settlements from completed jobs</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all">
                    <TabsList>
                      <TabsTrigger value="all">All ({allEvents.length})</TabsTrigger>
                      <TabsTrigger value="completed">Completed ({completedEvents.length})</TabsTrigger>
                      <TabsTrigger value="pending">Pending ({pendingEvents.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="mt-4">
                      {allEvents.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">No job history yet</p>
                      ) : (
                        <div className="space-y-3">
                          {allEvents.map((e) => <EventRow key={e.id} event={e} />)}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="completed" className="mt-4">
                      {completedEvents.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">No completed jobs yet</p>
                      ) : (
                        <div className="space-y-3">
                          {completedEvents.map((e) => <EventRow key={e.id} event={e} />)}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="pending" className="mt-4">
                      {pendingEvents.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">No pending jobs</p>
                      ) : (
                        <div className="space-y-3">
                          {pendingEvents.map((e) => <EventRow key={e.id} event={e} />)}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Summary */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Monthly Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {monthlySummary.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No completed jobs yet</p>
                ) : (
                  <div className="space-y-4">
                    {monthlySummary.map(([key, { total, count }]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{formatMonthKey(key)}</p>
                          <p className="text-xs text-muted-foreground">{count} job{count !== 1 ? "s" : ""} completed</p>
                        </div>
                        <p className="font-semibold">{formatNaira(total)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
