"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Plus, Tractor, Package, Calendar, Phone, Star, Leaf, Bug, Truck, Droplets, CheckCircle, Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"
import { PaginationControls } from "@/components/ui/pagination-controls"

const SERVICE_TYPE_ICONS: Record<string, typeof Tractor> = {
  land_preparation: Tractor,
  land_prep: Tractor,
  planting: Leaf,
  fertilizer_application: Package,
  fertilizer: Package,
  pest_control: Bug,
  irrigation: Droplets,
  harvesting: Tractor,
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

const statusLabels: Record<string, string> = {
  planned: "Pending",
  scheduled: "Scheduled",
  in_progress: "In Progress",
  completed: "Completed",
  verified: "Verified",
  cancelled: "Cancelled",
}

const getProgressPercent = (status: string) => {
  const m: Record<string, number> = { planned: 10, scheduled: 30, in_progress: 60, completed: 100, verified: 100, cancelled: 0 }
  return m[status] || 0
}

const LIMIT = 20

export default function FarmerRequestsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState({ count: 0, pages: 1 })
  const [newRequestOpen, setNewRequestOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [rateDialogOpen, setRateDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null)
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")

  const [newRequestService, setNewRequestService] = useState("")
  const [newRequestDate, setNewRequestDate] = useState("")
  const [newRequestNotes, setNewRequestNotes] = useState("")

  const load = useCallback(async (p = 1) => {
    setLoading(true)
    try {
      const res = await apiClient.farmerMe.getServiceEvents({ page: p, limit: LIMIT })
      setEvents(res.data ?? [])
      setMeta({ count: (res as any).count ?? 0, pages: (res as any).pages ?? 1 })
    } catch {
      toast.error("Failed to load service requests")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(page) }, [load, page])

  const activeRequests = events.filter((r) => !["completed", "verified", "cancelled"].includes(r.status))
  const completedRequests = events.filter((r) => ["completed", "verified"].includes(r.status))

  const handleSubmitRequest = async () => {
    if (!newRequestService || !newRequestDate) return
    setSubmitting(true)
    try {
      // Submit as a task request that goes through Ops approval (not direct service event creation)
      await apiClient.taskRequests.create({
        title: `${newRequestService.replace(/_/g, " ")} service requested`,
        description: newRequestNotes || `Farmer requests ${newRequestService.replace(/_/g, " ")} service for ${newRequestDate}`,
        issue_type: serviceToIssueType(newRequestService),
        urgency: "medium",
      })
      toast.success("Service request submitted for review")
      setNewRequestService("")
      setNewRequestDate("")
      setNewRequestNotes("")
      setNewRequestOpen(false)
      setPage(1)
      load(1)
    } catch (err: any) {
      toast.error(err.message || "Failed to submit request")
    } finally {
      setSubmitting(false)
    }
  }

  // Map frontend service types to task request issue types
  const serviceToIssueType = (serviceType: string): string => {
    const map: Record<string, string> = {
      land_preparation: "mechanization",
      planting: "inputs",
      fertilizer_application: "inputs",
      pest_control: "pest_control",
      irrigation: "irrigation",
      harvesting: "mechanization",
      transport: "logistics",
    }
    return map[serviceType] || "other"
  }

  const handleRateService = async () => {
    if (!selectedRequest || rating === 0) return
    try {
      await apiClient.serviceEvents.update(selectedRequest.id, {
        status: "verified",
        rating,
        rating_feedback: feedback,
      })
      toast.success("Rating submitted")
      setEvents((prev) => prev.map((e) => e.id === selectedRequest.id ? { ...e, status: "verified", rating, rating_feedback: feedback } : e))
    } catch {
      toast.error("Failed to submit rating")
    } finally {
      setRateDialogOpen(false)
      setRating(0)
      setFeedback("")
      setSelectedRequest(null)
    }
  }

  const ServiceCard = ({ request, showRating = false }: { request: any; showRating?: boolean }) => {
    const ServiceIcon = SERVICE_TYPE_ICONS[request.service_type] || Package
    const progress = getProgressPercent(request.status)
    const partnerName = request.partner?.name || request.partner?.company_name || request.assigned_partner_name || null

    return (
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ServiceIcon className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold capitalize">{(request.service_type || "Service").replace(/_/g, " ")}</h3>
                  <Badge variant="outline" className={statusStyles[request.status] || ""}>
                    {statusLabels[request.status] || request.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {partnerName || "Partner pending"}{request.notes ? ` • ${request.notes}` : ""}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">₦{(Number(request.estimated_cost || request.actual_cost || 0)).toLocaleString()}</p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <Calendar className="h-3 w-3" />
                {request.scheduled_date ? new Date(request.scheduled_date).toLocaleDateString() : "TBD"}
              </div>
            </div>
          </div>

          {progress > 0 && progress < 100 && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {showRating && request.status === "completed" && !request.rating && (
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent"
              onClick={() => { setSelectedRequest(request); setRateDialogOpen(true) }}
            >
              <Star className="h-4 w-4 mr-2" />
              Rate Service
            </Button>
          )}

          {showRating && request.rating && (
            <div className="flex items-center gap-1 mb-4">
              <span className="text-sm text-muted-foreground mr-2">Your Rating:</span>
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < (request.rating || 0) ? "text-amber-500 fill-amber-500" : "text-muted"}`} />
              ))}
            </div>
          )}

          {!showRating && partnerName && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="bg-transparent" onClick={() => window.open(`tel:`)}>
                <Phone className="h-4 w-4 mr-2" />
                Contact Partner
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <DashboardLayout allowedRoles={["farmer"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Service Requests</h1>
            <p className="text-muted-foreground">Request and track agricultural services</p>
          </div>
          <Dialog open={newRequestOpen} onOpenChange={setNewRequestOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Request Service</DialogTitle>
                <DialogDescription>Submit a new service request to AgroBridge</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Service Type</Label>
                  <Select value={newRequestService} onValueChange={setNewRequestService}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="land_preparation">Land Preparation</SelectItem>
                      <SelectItem value="planting">Planting</SelectItem>
                      <SelectItem value="fertilizer_application">Fertilizer Application</SelectItem>
                      <SelectItem value="pest_control">Pest Control</SelectItem>
                      <SelectItem value="irrigation">Irrigation</SelectItem>
                      <SelectItem value="harvesting">Harvesting</SelectItem>
                      <SelectItem value="transport">Transport</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Preferred Date</Label>
                  <Input type="date" value={newRequestDate} onChange={(e) => setNewRequestDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Additional Notes</Label>
                  <Textarea
                    placeholder="Any special requirements or instructions..."
                    rows={3}
                    value={newRequestNotes}
                    onChange={(e) => setNewRequestNotes(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewRequestOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmitRequest} disabled={!newRequestService || !newRequestDate || submitting}>
                  {submitting ? "Submitting…" : "Submit Request"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{loading ? "…" : events.length}</div>
              <div className="text-sm text-muted-foreground">Total Requests</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-600">{loading ? "…" : activeRequests.length}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600">{loading ? "…" : completedRequests.length}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                <CheckCircle className="h-6 w-6 inline" />
              </div>
              <div className="text-sm text-muted-foreground">All On Track</div>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <Tabs defaultValue="active">
            <TabsList>
              <TabsTrigger value="active">Active ({activeRequests.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedRequests.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-4">
              <div className="grid gap-4">
                {activeRequests.length > 0 ? (
                  activeRequests.map((r) => <ServiceCard key={r.id} request={r} />)
                ) : (
                  <Card className="border-border/50">
                    <CardContent className="p-12 text-center">
                      <Package className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">No active service requests</p>
                      <p className="text-sm text-muted-foreground mt-1">Click "New Request" to get started</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="mt-4">
              <div className="grid gap-4">
                {completedRequests.length > 0 ? (
                  completedRequests.map((r) => <ServiceCard key={r.id} request={r} showRating />)
                ) : (
                  <Card className="border-border/50">
                    <CardContent className="p-12 text-center">
                      <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">No completed services yet</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}

        <PaginationControls
          page={page}
          pages={meta.pages}
          total={meta.count}
          limit={LIMIT}
          onPageChange={(p) => setPage(p)}
          className="pt-2"
        />
      </div>

      <Dialog open={rateDialogOpen} onOpenChange={setRateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate Service</DialogTitle>
            <DialogDescription>
              How was your experience with {selectedRequest?.partner?.name || "the service provider"}?
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} className="p-1 hover:scale-110 transition-transform" onClick={() => setRating(star)}>
                  <Star className={`h-8 w-8 ${star <= rating ? "text-amber-500 fill-amber-500" : "text-muted-foreground"}`} />
                </button>
              ))}
            </div>
            <div className="mt-4">
              <Label>Feedback (optional)</Label>
              <Textarea
                placeholder="Share your experience..."
                className="mt-2"
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRateService} disabled={rating === 0}>Submit Rating</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
