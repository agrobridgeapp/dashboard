"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock, User, Circle, Loader2, Play, CheckCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export default function PartnerSchedulePage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [farmerMap, setFarmerMap] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [eventsRes, farmersRes] = await Promise.allSettled([
        apiClient.partnerMe.getServiceEvents(),
        apiClient.farmers.list(),
      ])
      if (eventsRes.status === "fulfilled" && eventsRes.value.success) {
        setJobs(eventsRes.value.data?.events ?? [])
      }
      if (farmersRes.status === "fulfilled" && farmersRes.value.success) {
        const map: Record<string, any> = {}
        for (const f of farmersRes.value.data) map[f.id] = f
        setFarmerMap(map)
      }
    } catch {
      toast.error("Failed to load schedule")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const getFarmerName = (farmerId: string) => {
    const f = farmerMap[farmerId]
    return f ? `${f.first_name} ${f.last_name}` : "Unknown Farmer"
  }

  const getFarmerPhone = (farmerId: string) => farmerMap[farmerId]?.phone || ""

  const getLocation = (job: any) => {
    const f = farmerMap[job.farmer_id]
    if (f) return `${f.village || ""}, ${f.lga || ""}`.replace(/^, |, $/, "")
    return job.description || ""
  }

  const now = new Date()
  const todayStart = startOfDay(now)
  const weekEnd = new Date(todayStart.getTime() + 7 * 24 * 60 * 60 * 1000)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const activeJobs = jobs.filter((j) => j.status === "in_progress")

  const todayJobs = jobs.filter((j) => {
    if (j.status === "in_progress") return true
    const date = j.scheduled_date || j.planned_date_start
    return date && isSameDay(new Date(date), now) && j.status === "scheduled"
  })

  const upcomingJobs = jobs.filter((j) => {
    const date = j.scheduled_date || j.planned_date_start
    if (!date || j.status !== "scheduled") return false
    const d = new Date(date)
    return d > now && !isSameDay(d, now)
  })

  // Group upcoming by date string
  const upcomingByDate: Record<string, any[]> = {}
  for (const job of upcomingJobs) {
    const date = job.scheduled_date || job.planned_date_start
    const key = new Date(date).toISOString().split("T")[0]
    if (!upcomingByDate[key]) upcomingByDate[key] = []
    upcomingByDate[key].push(job)
  }
  const upcomingDates = Object.keys(upcomingByDate).sort()

  const thisWeekCount = jobs.filter((j) => {
    const date = j.scheduled_date || j.planned_date_start
    if (!date) return false
    const d = new Date(date)
    return d >= todayStart && d < weekEnd && j.status === "scheduled"
  }).length

  const completedThisMonth = jobs.filter((j) => {
    if (!["completed", "verified"].includes(j.status)) return false
    const date = j.completed_at || j.updated_at
    return date && new Date(date) >= monthStart
  }).length

  const totalThisMonth = jobs.filter((j) => {
    const date = j.scheduled_date || j.planned_date_start || j.created_at
    return date && new Date(date) >= monthStart
  }).length

  const utilization = totalThisMonth > 0
    ? Math.round((completedThisMonth / totalThisMonth) * 100)
    : 0

  const handleStartJob = async (job: any) => {
    setSubmitting(true)
    try {
      await apiClient.serviceEvents.update(job.id, {
        status: "in_progress",
        actual_date: new Date().toISOString().split("T")[0],
      })
      toast.success("Job started")
      setIsDetailsOpen(false)
      loadData()
    } catch (err: any) {
      toast.error(err.message || "Failed to start job")
    } finally {
      setSubmitting(false)
    }
  }

  const handleCompleteJob = async (job: any) => {
    setSubmitting(true)
    try {
      await apiClient.serviceEvents.update(job.id, {
        status: "completed",
        actual_cost: job.estimated_cost,
      })
      toast.success("Job marked as complete")
      setIsDetailsOpen(false)
      loadData()
    } catch (err: any) {
      toast.error(err.message || "Failed to complete job")
    } finally {
      setSubmitting(false)
    }
  }

  const JobRow = ({ job, compact = false }: { job: any; compact?: boolean }) => {
    const date = job.scheduled_date || job.planned_date_start
    const timeStr = date ? new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"

    if (compact) {
      return (
        <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
          <div className="flex items-center gap-4">
            <div className="font-medium text-sm text-muted-foreground">{timeStr}</div>
            <div>
              <div className="font-medium capitalize">{(job.service_type || "Service").replace(/_/g, " ")}</div>
              <div className="text-sm text-muted-foreground">
                {getFarmerName(job.farmer_id)}
                {getLocation(job) ? ` · ${getLocation(job)}` : ""}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => { setSelectedJob(job); setIsDetailsOpen(true) }}>
            Details
          </Button>
        </div>
      )
    }

    return (
      <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border bg-card gap-4">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-lg">{timeStr}</span>
              {job.status === "in_progress" ? (
                <Badge className="bg-blue-500/10 text-blue-700 border-blue-200">
                  <Circle className="h-3 w-3 mr-1 fill-current animate-pulse" />
                  In Progress
                </Badge>
              ) : (
                <Badge className="bg-gray-500/10 text-gray-700 border-gray-200">Scheduled</Badge>
              )}
            </div>
            <div className="font-medium mt-1 capitalize">{(job.service_type || "Service").replace(/_/g, " ")}</div>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {getFarmerName(job.farmer_id)}
              </span>
              {getLocation(job) && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {getLocation(job)}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          {job.status === "in_progress" ? (
            <Button size="sm" disabled={submitting} onClick={() => handleCompleteJob(job)}>
              <CheckCircle className="h-4 w-4 mr-1.5" />
              {submitting ? "Saving…" : "Complete Job"}
            </Button>
          ) : (
            <>
              <Button size="sm" disabled={submitting} onClick={() => handleStartJob(job)}>
                <Play className="h-4 w-4 mr-1.5" />
                {submitting ? "Starting…" : "Start Job"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setSelectedJob(job); setIsDetailsOpen(true) }}>
                Details
              </Button>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout allowedRoles={["partner"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Schedule</h1>
          <p className="text-muted-foreground">Manage your job schedule and appointments</p>
        </div>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Today's Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                <>
                  <div className="text-2xl font-bold">{todayJobs.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">{activeJobs.length} in progress</p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                <>
                  <div className="text-2xl font-bold">{thisWeekCount}</div>
                  <p className="text-xs text-muted-foreground mt-1">Scheduled jobs</p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                <>
                  <div className="text-2xl font-bold">{upcomingJobs.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Future jobs</p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                <>
                  <div className="text-2xl font-bold">{utilization}%</div>
                  <p className="text-xs text-muted-foreground mt-1">This month</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="today" className="space-y-4">
          <TabsList>
            <TabsTrigger value="today">Today ({todayJobs.length})</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming ({upcomingJobs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="today">
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>
                  {now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : todayJobs.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <Calendar className="h-10 w-10 mx-auto mb-3 opacity-40" />
                    <p>No jobs scheduled for today</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {todayJobs.map((job) => <JobRow key={job.id} job={job} />)}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : upcomingDates.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center text-muted-foreground">
                  <Calendar className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p>No upcoming jobs scheduled</p>
                </CardContent>
              </Card>
            ) : (
              upcomingDates.map((dateKey) => (
                <Card key={dateKey}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Calendar className="h-5 w-5" />
                      {new Date(dateKey + "T00:00:00").toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardTitle>
                    <CardDescription>{upcomingByDate[dateKey].length} scheduled job(s)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {upcomingByDate[dateKey].map((job) => (
                        <JobRow key={job.id} job={job} compact />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Job Details</DialogTitle>
            <DialogDescription>Complete information about this scheduled job</DialogDescription>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground text-xs">Service Type</Label>
                  <p className="font-semibold mt-1 capitalize">
                    {(selectedJob.service_type || "Service").replace(/_/g, " ")}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Status</Label>
                  <p className="font-semibold mt-1 capitalize">
                    {selectedJob.status === "in_progress" ? "In Progress" : selectedJob.status}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Farmer</Label>
                  <p className="font-semibold mt-1">{getFarmerName(selectedJob.farmer_id)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Location</Label>
                  <p className="font-semibold mt-1">{getLocation(selectedJob) || "—"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Scheduled Date</Label>
                  <p className="font-semibold mt-1">
                    {(selectedJob.scheduled_date || selectedJob.planned_date_start)
                      ? new Date(selectedJob.scheduled_date || selectedJob.planned_date_start).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Estimated Payment</Label>
                  <p className="font-semibold mt-1 text-emerald-600">
                    ₦{Number(selectedJob.estimated_cost || 0).toLocaleString()}
                  </p>
                </div>
              </div>
              {selectedJob.description && (
                <div>
                  <Label className="text-muted-foreground text-xs">Description</Label>
                  <p className="mt-1 text-sm">{selectedJob.description}</p>
                </div>
              )}
              {selectedJob.notes && (
                <div>
                  <Label className="text-muted-foreground text-xs">Notes</Label>
                  <p className="mt-1 text-sm italic text-muted-foreground">{selectedJob.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Close</Button>
            {getFarmerPhone(selectedJob?.farmer_id) && (
              <Button onClick={() => window.open(`tel:${getFarmerPhone(selectedJob.farmer_id)}`)}>
                Call Farmer
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
