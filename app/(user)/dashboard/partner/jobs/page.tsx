"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import {
  Search,
  MapPin,
  Calendar,
  Phone,
  Play,
  CheckCircle,
  Clock,
  Tractor,
  Package,
  Leaf,
  Bug,
  Truck,
  Droplets,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

const SERVICE_TYPE_ICONS: Record<string, any> = {
  land_prep: Tractor,
  planting: Leaf,
  fertilizer: Package,
  pest_control: Bug,
  irrigation: Droplets,
  harvest: Tractor,
  transport: Truck,
  storage: Package,
}

const statusStyles: Record<string, string> = {
  planned: "bg-slate-100 text-slate-700 border-slate-200",
  scheduled: "bg-blue-100 text-blue-700 border-blue-200",
  in_progress: "bg-amber-100 text-amber-700 border-amber-200",
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  verified: "bg-primary/10 text-primary border-primary/20",
  cancelled: "bg-red-100 text-red-700 border-red-200",
}

export default function PartnerJobsPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [farmerMap, setFarmerMap] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [startDialogOpen, setStartDialogOpen] = useState(false)
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false)
  const [progressValue, setProgressValue] = useState([50])
  const [completionNotes, setCompletionNotes] = useState("")
  const [actualCost, setActualCost] = useState("")
  const [submitting, setSubmitting] = useState(false)

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
        for (const f of farmersRes.value.data) {
          map[f.id] = f
        }
        setFarmerMap(map)
      }
    } catch {
      toast.error("Failed to load jobs")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const getFarmerName = (farmerId: string) => {
    const f = farmerMap[farmerId]
    return f ? `${f.first_name} ${f.last_name}` : "Unknown Farmer"
  }

  const getFarmerLocation = (farmerId: string) => {
    const f = farmerMap[farmerId]
    return f ? `${f.village || ""}, ${f.lga || ""}`.replace(/^, |, $/, "") : ""
  }

  const getFarmerPhone = (farmerId: string) => {
    return farmerMap[farmerId]?.phone || ""
  }

  const pendingJobs = jobs.filter((j) => j.status === "scheduled")
  const activeJobs = jobs.filter((j) => j.status === "in_progress")
  const completedJobs = jobs.filter((j) => ["completed", "verified"].includes(j.status))

  const filteredJobs = (jobList: any[]) =>
    jobList.filter(
      (job) =>
        getFarmerName(job.farmer_id).toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.service_type || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        getFarmerLocation(job.farmer_id).toLowerCase().includes(searchQuery.toLowerCase()),
    )

  const handleStartJob = async () => {
    if (!selectedJob) return
    setSubmitting(true)
    try {
      await apiClient.serviceEvents.update(selectedJob.id, {
        status: "in_progress",
        actual_date: new Date().toISOString().split("T")[0],
      })
      toast.success("Job started")
      setStartDialogOpen(false)
      setSelectedJob(null)
      loadData()
    } catch (err: any) {
      toast.error(err.message || "Failed to start job")
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateProgress = async () => {
    if (!selectedJob) return
    setSubmitting(true)
    try {
      await apiClient.serviceEvents.update(selectedJob.id, {
        progress: progressValue[0],
        notes: completionNotes || undefined,
      })
      toast.success("Progress updated")
      setUpdateDialogOpen(false)
      setProgressValue([50])
      setCompletionNotes("")
      setSelectedJob(null)
      loadData()
    } catch (err: any) {
      toast.error(err.message || "Failed to update progress")
    } finally {
      setSubmitting(false)
    }
  }

  const handleCompleteJob = async () => {
    if (!selectedJob) return
    setSubmitting(true)
    try {
      await apiClient.serviceEvents.update(selectedJob.id, {
        status: "completed",
        actual_cost: actualCost ? Number(actualCost) : selectedJob.estimated_cost,
        notes: completionNotes || undefined,
      })
      toast.success("Job marked as complete")
      setCompleteDialogOpen(false)
      setCompletionNotes("")
      setActualCost("")
      setSelectedJob(null)
      loadData()
    } catch (err: any) {
      toast.error(err.message || "Failed to complete job")
    } finally {
      setSubmitting(false)
    }
  }

  const JobCard = ({ job }: { job: any }) => {
    const ServiceIcon = SERVICE_TYPE_ICONS[job.service_type] || Package
    const isOverdue =
      job.planned_date_end &&
      new Date(job.planned_date_end) < new Date() &&
      !["completed", "verified"].includes(job.status)

    return (
      <Card className={`border-border/50 ${isOverdue ? "border-red-200 bg-red-50/30" : ""}`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ServiceIcon className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold capitalize">
                    {(job.service_type || "Service").replace(/_/g, " ")}
                  </h3>
                  <Badge variant="outline" className={statusStyles[job.status] ?? ""}>
                    {job.status === "in_progress" ? "In Progress" : job.status}
                  </Badge>
                  {isOverdue && (
                    <Badge variant="destructive" className="text-xs">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Overdue
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{getFarmerName(job.farmer_id)}</p>
              </div>
            </div>
            <div className="text-right shrink-0 ml-2">
              <p className="font-semibold">₦{Number(job.estimated_cost || 0).toLocaleString()}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {job.planned_date_start
                  ? new Date(job.planned_date_start).toLocaleDateString()
                  : job.scheduled_date
                    ? new Date(job.scheduled_date).toLocaleDateString()
                    : "TBD"}
              </div>
            </div>
          </div>

          {getFarmerLocation(job.farmer_id) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <MapPin className="h-3 w-3" />
              {getFarmerLocation(job.farmer_id)}
            </div>
          )}

          {job.notes && (
            <p className="text-sm text-muted-foreground mb-3 italic">&quot;{job.notes}&quot;</p>
          )}

          {job.status === "in_progress" && job.progress != null && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{job.progress}%</span>
              </div>
              <Progress value={job.progress} className="h-2" />
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {job.status === "scheduled" && (
              <Button
                size="sm"
                onClick={() => {
                  setSelectedJob(job)
                  setStartDialogOpen(true)
                }}
              >
                <Play className="h-4 w-4 mr-2" />
                Start Job
              </Button>
            )}
            {job.status === "in_progress" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-transparent"
                  onClick={() => {
                    setSelectedJob(job)
                    setProgressValue([job.progress ?? 50])
                    setUpdateDialogOpen(true)
                  }}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Update Progress
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedJob(job)
                    setCompleteDialogOpen(true)
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete
                </Button>
              </>
            )}
            {getFarmerPhone(job.farmer_id) && (
              <Button
                size="sm"
                variant="outline"
                className="bg-transparent"
                onClick={() => window.open(`tel:${getFarmerPhone(job.farmer_id)}`)}
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Farmer
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <DashboardLayout allowedRoles={["partner"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Job Requests</h1>
          <p className="text-muted-foreground">Manage jobs assigned to you by AgroBridge</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              {loading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : (
                <div className="text-2xl font-bold">{jobs.length}</div>
              )}
              <div className="text-sm text-muted-foreground">Total Jobs</div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-blue-50/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-700">{loading ? "…" : pendingJobs.length}</div>
              <div className="text-sm text-blue-600">Pending</div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-amber-50/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-700">{loading ? "…" : activeJobs.length}</div>
              <div className="text-sm text-amber-600">In Progress</div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-emerald-50/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-700">{loading ? "…" : completedJobs.length}</div>
              <div className="text-sm text-emerald-600">Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by farmer, service, or location..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">Pending ({pendingJobs.length})</TabsTrigger>
            <TabsTrigger value="active">In Progress ({activeJobs.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedJobs.length})</TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <TabsContent value="pending" className="mt-4">
                <div className="grid gap-4">
                  {filteredJobs(pendingJobs).length > 0 ? (
                    filteredJobs(pendingJobs).map((job) => <JobCard key={job.id} job={job} />)
                  ) : (
                    <Card className="border-border/50">
                      <CardContent className="p-12 text-center">
                        <Clock className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground">No pending jobs</p>
                        <p className="text-sm text-muted-foreground mt-1">New assignments will appear here</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="active" className="mt-4">
                <div className="grid gap-4">
                  {filteredJobs(activeJobs).length > 0 ? (
                    filteredJobs(activeJobs).map((job) => <JobCard key={job.id} job={job} />)
                  ) : (
                    <Card className="border-border/50">
                      <CardContent className="p-12 text-center">
                        <Tractor className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground">No active jobs</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="completed" className="mt-4">
                <div className="grid gap-4">
                  {filteredJobs(completedJobs).length > 0 ? (
                    filteredJobs(completedJobs).map((job) => <JobCard key={job.id} job={job} />)
                  ) : (
                    <Card className="border-border/50">
                      <CardContent className="p-12 text-center">
                        <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground">No completed jobs yet</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>

      {/* Start Job Dialog */}
      <Dialog open={startDialogOpen} onOpenChange={setStartDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start Job</DialogTitle>
            <DialogDescription>Confirm you are starting work on this service request</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 rounded-lg bg-muted/50 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Service</span>
                <span className="font-medium capitalize">
                  {(selectedJob?.service_type || "").replace(/_/g, " ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Farmer</span>
                <span className="font-medium">{selectedJob ? getFarmerName(selectedJob.farmer_id) : ""}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Location</span>
                <span className="font-medium">{selectedJob ? getFarmerLocation(selectedJob.farmer_id) : ""}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Payment</span>
                <span className="font-medium text-emerald-600">
                  ₦{Number(selectedJob?.estimated_cost || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStartDialogOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleStartJob} disabled={submitting}>
              <Play className="h-4 w-4 mr-2" />
              {submitting ? "Starting…" : "Start Job"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Progress Dialog */}
      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Progress</DialogTitle>
            <DialogDescription>Update the progress of this job</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Progress</Label>
                <span className="font-semibold">{progressValue[0]}%</span>
              </div>
              <Slider value={progressValue} onValueChange={setProgressValue} max={100} step={5} className="w-full" />
            </div>
            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea
                placeholder="Add any notes about the progress..."
                rows={3}
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateDialogOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProgress} disabled={submitting}>
              {submitting ? "Updating…" : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Job Dialog */}
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Job</DialogTitle>
            <DialogDescription>Mark this job as completed</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 rounded-lg bg-muted/50 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Service</span>
                <span className="font-medium capitalize">
                  {(selectedJob?.service_type || "").replace(/_/g, " ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Farmer</span>
                <span className="font-medium">{selectedJob ? getFarmerName(selectedJob.farmer_id) : ""}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Estimated Payment</span>
                <span className="font-medium text-emerald-600">
                  ₦{Number(selectedJob?.estimated_cost || 0).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Actual Cost (if different)</Label>
              <Input
                type="number"
                placeholder={`${selectedJob?.estimated_cost || 0}`}
                value={actualCost}
                onChange={(e) => setActualCost(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Completion Notes</Label>
              <Textarea
                placeholder="Any final notes or observations..."
                rows={3}
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompleteDialogOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleCompleteJob} disabled={submitting}>
              <CheckCircle className="h-4 w-4 mr-2" />
              {submitting ? "Saving…" : "Mark Complete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
