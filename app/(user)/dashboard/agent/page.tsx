"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  MapPin,
  ClipboardCheck,
  Calendar,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { AgentTierBadge } from "@/components/agent/agent-tier-badge"
import { calculateAgentTier } from "@/lib/agent-tier-system"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"

const statusIcons: Record<string, { icon: typeof CheckCircle; color: string }> = {
  completed: { icon: CheckCircle, color: "text-emerald-600" },
  in_progress: { icon: Clock, color: "text-blue-600" },
  scheduled: { icon: Calendar, color: "text-muted-foreground" },
}

const priorityStyles: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-blue-100 text-blue-700",
}

export default function AgentDashboardPage() {
  const { user } = useAuth()

  const [farmers, setFarmers] = useState<any[]>([])
  const [farmersLoading, setFarmersLoading] = useState(true)

  const [serviceEvents, setServiceEvents] = useState<any[]>([])
  const [eventsLoading, setEventsLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    try {
      setFarmersLoading(true)
      const res = await apiClient.agentMe.getFarmers()
      const raw = res.data ?? []
      setFarmers(Array.isArray(raw) ? raw : [])
    } catch {
      // non-critical
    } finally {
      setFarmersLoading(false)
    }

    try {
      setEventsLoading(true)
      const res = await apiClient.agentMe.getServiceEvents()
      const raw = res.data?.events ?? []
      setServiceEvents(Array.isArray(raw) ? raw : [])
    } catch {
      // non-critical
    } finally {
      setEventsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const today = new Date().toDateString()
  const todayEvents = serviceEvents.filter((e) => {
    const d = e.scheduled_date ? new Date(e.scheduled_date).toDateString() : null
    return d === today
  })

  const scheduledCount = todayEvents.length
  const pendingEvents = serviceEvents.filter((e) => e.status === "scheduled")
  const completedThisWeek = serviceEvents.filter((e) => {
    if (e.status !== "completed" || !e.scheduled_date) return false
    const d = new Date(e.scheduled_date)
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    return d >= weekAgo
  })

  const activeFarmers = farmers.filter((f) => f.status === "active" || !f.status).length
  const qualityScore = 88 // no quality API yet
  const currentTier = calculateAgentTier(activeFarmers, 0, qualityScore)

  const stats = [
    {
      name: "Scheduled Today",
      value: eventsLoading ? "…" : scheduledCount.toString(),
      icon: Calendar,
      color: "text-amber-600 bg-amber-100",
    },
    {
      name: "Tasks Pending",
      value: eventsLoading ? "…" : pendingEvents.length.toString(),
      icon: ClipboardCheck,
      color: "text-blue-600 bg-blue-100",
    },
    {
      name: "Visits This Week",
      value: eventsLoading ? "…" : completedThisWeek.length.toString(),
      icon: MapPin,
      color: "text-emerald-600 bg-emerald-100",
    },
    {
      name: "Farmers Covered",
      value: farmersLoading ? "…" : activeFarmers.toString(),
      icon: Users,
      color: "text-primary bg-primary/10",
    },
  ]

  const recentFarmers = farmers.slice(0, 3).map((f) => ({
    name: f.full_name || f.name || "Farmer",
    status: f.status || "active",
    lastVisit: f.updated_at ? new Date(f.updated_at).toLocaleDateString() : "—",
  }))

  return (
    <DashboardLayout allowedRoles={["field_agent"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back, {user?.name?.split(" ")[0] ?? "Agent"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Field Agent Dashboard</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {farmersLoading ? "Loading…" : `Responsible for ${activeFarmers} farmers`}
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Role:</span>
              <AgentTierBadge tier={currentTier} size="md" />
            </div>
            <span className="text-xs text-muted-foreground">
              Reflects scope of coverage and operational responsibility
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.name} className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground truncate">{stat.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Today's Schedule */}
          <div className="lg:col-span-2">
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle>Today&apos;s Schedule</CardTitle>
                  <CardDescription>Your farm visits for today</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/agent/visits">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {eventsLoading ? (
                  <div className="flex items-center justify-center h-20">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : todayEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No visits scheduled for today</p>
                ) : (
                  <div className="space-y-4">
                    {todayEvents.slice(0, 5).map((event) => {
                      const statusKey =
                        event.status === "in_progress"
                          ? "in_progress"
                          : event.status === "completed"
                            ? "completed"
                            : "scheduled"
                      const StatusIcon = statusIcons[statusKey]?.icon ?? Calendar
                      const iconColor = statusIcons[statusKey]?.color ?? "text-muted-foreground"
                      return (
                        <div
                          key={event.id}
                          className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="text-sm text-muted-foreground w-20 shrink-0">
                            {event.scheduled_date
                              ? new Date(event.scheduled_date).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "—"}
                          </div>
                          <div className={iconColor}>
                            <StatusIcon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{event.service_type || event.serviceType || "Service"}</p>
                            {event.notes && (
                              <p className="text-sm text-muted-foreground truncate">{event.notes}</p>
                            )}
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              event.status === "completed"
                                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                : event.status === "in_progress"
                                  ? "bg-blue-100 text-blue-700 border-blue-200"
                                  : "bg-muted text-muted-foreground"
                            }
                          >
                            {event.status}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weekly Progress */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Weekly Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {eventsLoading ? (
                  <div className="flex items-center justify-center h-16">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>Visits Completed</span>
                        <span className="font-medium">{completedThisWeek.length}</span>
                      </div>
                      <Progress
                        value={
                          serviceEvents.length > 0
                            ? Math.round((completedThisWeek.length / serviceEvents.length) * 100)
                            : 0
                        }
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>Tasks Pending</span>
                        <span className="font-medium">{pendingEvents.length}</span>
                      </div>
                      <Progress
                        value={
                          serviceEvents.length > 0
                            ? Math.round(
                                ((serviceEvents.length - pendingEvents.length) / serviceEvents.length) * 100
                              )
                            : 0
                        }
                        className="h-2"
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Pending Tasks */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Pending Tasks</CardTitle>
                  <Badge variant="secondary">{eventsLoading ? "…" : pendingEvents.length}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {eventsLoading ? (
                  <div className="flex items-center justify-center h-16">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : pendingEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-2">No pending tasks</p>
                ) : (
                  <div className="space-y-3">
                    {pendingEvents.slice(0, 4).map((event) => (
                      <div key={event.id} className="flex items-start gap-3">
                        <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">{event.service_type || "Service visit"}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {event.scheduled_date
                                ? new Date(event.scheduled_date).toLocaleDateString()
                                : "TBD"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
                  <Link href="/dashboard/agent/tasks">
                    View All Tasks
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Farmers */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Recent Farmers</CardTitle>
              </CardHeader>
              <CardContent>
                {farmersLoading ? (
                  <div className="flex items-center justify-center h-16">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : recentFarmers.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-2">No farmers yet</p>
                ) : (
                  <div className="space-y-3">
                    {recentFarmers.map((farmer, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {farmer.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{farmer.name}</p>
                          <p className="text-xs text-muted-foreground">Updated: {farmer.lastVisit}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            farmer.status === "active"
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                              : "bg-amber-100 text-amber-700 border-amber-200"
                          }
                        >
                          {farmer.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
                <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
                  <Link href="/dashboard/agent/farmers">
                    View All Farmers
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
