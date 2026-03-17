"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth-context"
import { apiClient } from "@/lib/api-client"
import {
  ClipboardList,
  Wallet,
  ArrowRight,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  Target,
  Loader2,
} from "lucide-react"
import Link from "next/link"

const statusStyles: Record<string, string> = {
  in_progress: "bg-blue-100 text-blue-700 border-blue-200",
  scheduled: "bg-amber-100 text-amber-700 border-amber-200",
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
}

export default function PartnerDashboardPage() {
  const { user } = useAuth()

  const [serviceEvents, setServiceEvents] = useState<any[]>([])
  const [eventsLoading, setEventsLoading] = useState(true)
  const [partnerProfile, setPartnerProfile] = useState<any>(null)

  const fetchAll = useCallback(async () => {
    setEventsLoading(true)
    try {
      const [eventsRes, profileRes] = await Promise.allSettled([
        apiClient.partnerMe.getServiceEvents(),
        apiClient.partnerMe.getProfile(),
      ])
      if (eventsRes.status === 'fulfilled' && eventsRes.value.success) {
        const raw = eventsRes.value.data?.events ?? []
        setServiceEvents(Array.isArray(raw) ? raw : [])
      }
      if (profileRes.status === 'fulfilled' && profileRes.value.success) {
        setPartnerProfile(profileRes.value.data)
      }
    } catch {
      // non-critical
    } finally {
      setEventsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const activeJobs = serviceEvents.filter(
    (e) => e.status === "scheduled" || e.status === "in_progress"
  )

  const completedEvents = serviceEvents.filter((e) => e.status === "completed" || e.status === "verified")

  const completedThisWeek = completedEvents.filter((e) => {
    if (!e.completed_at) return false
    return new Date(e.completed_at) >= weekAgo
  })
  const completionRate =
    serviceEvents.length > 0
      ? Math.round((completedThisWeek.length / serviceEvents.length) * 100)
      : 0
  const settledThisMonth = completedEvents.filter((e) => {
    const date = e.completed_at || e.updated_at
    return date && new Date(date) >= monthStart
  })

  const upcomingEvents = serviceEvents
    .filter((e) => e.status === "scheduled" && e.scheduled_date)
    .sort(
      (a, b) =>
        new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime()
    )
    .slice(0, 3)

  const stats = [
    {
      name: "Active Jobs",
      value: eventsLoading ? "…" : activeJobs.length.toString(),
      icon: ClipboardList,
      color: "text-primary bg-primary/10",
    },
    {
      name: "Completion Rate",
      value: eventsLoading ? "…" : `${completionRate}%`,
      icon: CheckCircle2,
      color: "text-blue-600 bg-blue-100",
    },
    {
      name: "Quality Score",
      value: eventsLoading
        ? "…"
        : partnerProfile?.average_rating
          ? `${Number(partnerProfile.average_rating).toFixed(1)}/5`
          : "—",
      icon: Target,
      color: "text-amber-600 bg-amber-100",
    },
    {
      name: "Earnings This Month",
      value: eventsLoading
        ? "…"
        : settledThisMonth.length > 0
          ? `₦${(settledThisMonth.reduce((s: number, e: any) => s + Number(e.actual_cost || e.estimated_cost || 0), 0) / 1000).toFixed(0)}K`
          : "₦0",
      icon: Wallet,
      color: "text-emerald-600 bg-emerald-100",
    },
  ]

  return (
    <DashboardLayout allowedRoles={["partner"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome, {user?.name}
          </h1>
          <p className="text-muted-foreground">Service Partner Dashboard</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.name} className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${stat.color}`}
                  >
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

        <p className="text-xs text-muted-foreground -mt-2">
          Quality Score based on job completion, timeliness, and issue resolution.
        </p>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Active Jobs */}
          <div className="lg:col-span-2">
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle>Active Jobs</CardTitle>
                  <CardDescription>AgroBridge-assigned jobs in your coverage area</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/partner/jobs">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {eventsLoading ? (
                  <div className="flex items-center justify-center h-20">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : activeJobs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No active jobs</p>
                ) : (
                  <div className="space-y-4">
                    {activeJobs.slice(0, 5).map((job) => (
                      <div key={job.id} className="p-4 rounded-lg border border-border/50">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">
                                {job.service_type || job.serviceType || "Service"}
                              </p>
                              <Badge
                                variant="outline"
                                className={statusStyles[job.status] ?? "bg-muted text-muted-foreground"}
                              >
                                {job.status}
                              </Badge>
                            </div>
                            {job.notes && (
                              <p className="text-sm text-muted-foreground mt-1">{job.notes}</p>
                            )}
                          </div>
                          {job.scheduled_date && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {new Date(job.scheduled_date).toLocaleDateString()}
                            </div>
                          )}
                        </div>

                        {job.status === "scheduled" && (
                          <Button size="sm" className="mt-2" disabled>
                            Start Job
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* This Week Performance */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">This Week</CardTitle>
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
                        <span>Jobs Completed</span>
                        <span className="font-medium">
                          {completedThisWeek.length}/{serviceEvents.length}
                        </span>
                      </div>
                      <Progress value={completionRate} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>Active Jobs</span>
                        <span className="font-medium">{activeJobs.length}</span>
                      </div>
                      <Progress
                        value={
                          serviceEvents.length > 0
                            ? Math.round((activeJobs.length / serviceEvents.length) * 100)
                            : 0
                        }
                        className="h-2"
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Recent Completed Jobs / Earnings */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Recent Completed Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                {eventsLoading ? (
                  <div className="flex items-center justify-center h-16">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : completedEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-2">No completed jobs yet</p>
                ) : (
                  <div className="space-y-3">
                    {completedEvents.slice(0, 3).map((event) => (
                      <div key={event.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium capitalize">
                            {(event.service_type || "Service").replace(/_/g, " ")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {event.completed_at
                              ? new Date(event.completed_at).toLocaleDateString()
                              : "—"}
                          </p>
                        </div>
                        <span className="font-medium text-emerald-600">
                          ₦{Number(event.actual_cost || event.estimated_cost || 0).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground pt-2 border-t mt-3">
                  Earnings reflect completed and approved AgroBridge-coordinated jobs.
                </p>
                <Button variant="outline" className="w-full mt-2 bg-transparent" size="sm" asChild>
                  <Link href="/dashboard/partner/earnings">
                    View Earnings
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Schedule */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Upcoming Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                {eventsLoading ? (
                  <div className="flex items-center justify-center h-16">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : upcomingEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-2">No upcoming jobs</p>
                ) : (
                  <div className="space-y-3">
                    {upcomingEvents.map((event, index) => (
                      <div key={event.id ?? index} className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                          <Clock className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {event.service_type || event.serviceType || "Service"}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {new Date(event.scheduled_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Button variant="outline" className="w-full mt-3 bg-transparent" size="sm" asChild>
                  <Link href="/dashboard/partner/schedule">
                    View Full Schedule
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
