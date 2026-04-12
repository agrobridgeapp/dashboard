"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Calendar, AlertCircle, CheckCircle2, Clock, XCircle, Loader2, Send, RefreshCw, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"

interface TaskRequest {
  id: string
  title: string
  description: string
  issue_type: string
  urgency: string
  status: string
  farmer_id?: string
  farmer_name?: string
  corridor_id?: string
  corridor_name?: string
  rejection_reason?: string
  review_notes?: string
  reviewed_by_name?: string
  reviewed_at?: string
  service_event_id?: string
  created_at: string
}

const urgencyStyles: Record<string, string> = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-blue-100 text-blue-700 border-blue-200",
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "Pending Review", color: "bg-amber-100 text-amber-700", icon: Clock },
  approved: { label: "Approved", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  converted: { label: "Task Created", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700", icon: XCircle },
}

const issueTypeLabels: Record<string, string> = {
  mechanization: "Mechanization",
  inputs: "Inputs (Seeds/Fertilizer)",
  inspection: "Inspection",
  logistics: "Logistics/Transport",
  pest_control: "Pest Control",
  irrigation: "Irrigation",
  storage: "Storage",
  other: "Other",
}

export default function AgentTasksPage() {
  const [requests, setRequests] = useState<TaskRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [newRequestOpen, setNewRequestOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [farmers, setFarmers] = useState<any[]>([])
  const { toast } = useToast()

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true)
      const res = await apiClient.taskRequests.list()
      if (res.success) {
        setRequests(res.data || [])
      }
    } catch (err) {
      console.error("Failed to fetch task requests:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchFarmers = useCallback(async () => {
    try {
      const res = await apiClient.agentMe.getFarmers()
      if (res.success) {
        setFarmers((res as any).data?.farmers || (res as any).data || [])
      }
    } catch {
      // Non-critical
    }
  }, [])

  useEffect(() => {
    fetchRequests()
    fetchFarmers()
  }, [fetchRequests, fetchFarmers])

  const pendingRequests = requests.filter((r) => r.status === "pending")
  const approvedRequests = requests.filter((r) => r.status === "approved" || r.status === "converted")
  const rejectedRequests = requests.filter((r) => r.status === "rejected")

  const handleSubmitRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    try {
      const res = await apiClient.taskRequests.create({
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        issue_type: formData.get("issue_type") as string,
        urgency: formData.get("urgency") as string,
        farmer_id: (formData.get("farmer_id") as string) || undefined,
      })

      if (res.success) {
        setNewRequestOpen(false)
        toast({ title: "Request Submitted", description: "Your task request has been sent to Ops for review." })
        fetchRequests()
      } else {
        toast({ title: "Error", description: (res as any).error || "Failed to submit request", variant: "destructive" })
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to submit request", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const RequestItem = ({ request }: { request: TaskRequest }) => {
    const cfg = statusConfig[request.status] || statusConfig.pending
    const StatusIcon = cfg.icon

    return (
      <div className="p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Badge className={`${cfg.color} border-0`}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {cfg.label}
              </Badge>
              <Badge variant="outline" className={urgencyStyles[request.urgency] || ""}>
                {request.urgency}
              </Badge>
              <Badge variant="outline">{issueTypeLabels[request.issue_type] || request.issue_type}</Badge>
            </div>
            <p className="font-medium">{request.title}</p>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{request.description}</p>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
              {request.farmer_name && (
                <span>Farmer: {request.farmer_name}</span>
              )}
              {request.corridor_name && (
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{request.corridor_name}</span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(request.created_at).toLocaleDateString()}
              </span>
            </div>

            {request.status === "rejected" && request.rejection_reason && (
              <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded text-xs text-red-700">
                <strong>Reason:</strong> {request.rejection_reason}
              </div>
            )}

            {request.review_notes && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-100 rounded text-xs text-blue-700">
                <strong>Ops Notes:</strong> {request.review_notes}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout allowedRoles={["field_agent"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Task Requests</h1>
            <p className="text-muted-foreground">Submit service requests to Operations for review</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchRequests} disabled={loading} className="bg-transparent">
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Dialog open={newRequestOpen} onOpenChange={setNewRequestOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  New Request
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Submit Task Request</DialogTitle>
                  <DialogDescription>
                    Request a service or task for a farmer. Operations will review and create the task.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmitRequest}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Request Title *</Label>
                      <Input id="title" name="title" placeholder="e.g., Land preparation needed for planting" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="issue_type">Service Type *</Label>
                        <Select name="issue_type" defaultValue="mechanization">
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {Object.entries(issueTypeLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="urgency">Urgency</Label>
                        <Select name="urgency" defaultValue="medium">
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {farmers.length > 0 && (
                      <div className="space-y-2">
                        <Label htmlFor="farmer_id">Related Farmer (optional)</Label>
                        <Select name="farmer_id">
                          <SelectTrigger><SelectValue placeholder="Select a farmer..." /></SelectTrigger>
                          <SelectContent>
                            {farmers.map((f: any) => (
                              <SelectItem key={f.id} value={f.id}>{f.first_name} {f.last_name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea id="description" name="description" placeholder="Describe the issue and what service is needed..." rows={4} required />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setNewRequestOpen(false)} className="bg-transparent">Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Submitting...</>
                      ) : (
                        <><Send className="h-4 w-4 mr-2" />Submit Request</>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingRequests.length}</p>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{approvedRequests.length}</p>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{rejectedRequests.length}</p>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Tabs */}
        {!loading && (
          <Tabs defaultValue="pending">
            <TabsList>
              <TabsTrigger value="pending">
                Pending ({pendingRequests.length})
              </TabsTrigger>
              <TabsTrigger value="approved">Approved ({approvedRequests.length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({rejectedRequests.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-4">
              <Card className="border-border/50">
                <CardContent className="p-4 space-y-3">
                  {pendingRequests.length > 0 ? (
                    pendingRequests.map((r) => <RequestItem key={r.id} request={r} />)
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No pending requests. Use &quot;New Request&quot; to submit one.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="approved" className="mt-4">
              <Card className="border-border/50">
                <CardContent className="p-4 space-y-3">
                  {approvedRequests.length > 0 ? (
                    approvedRequests.map((r) => <RequestItem key={r.id} request={r} />)
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No approved requests yet</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rejected" className="mt-4">
              <Card className="border-border/50">
                <CardContent className="p-4 space-y-3">
                  {rejectedRequests.length > 0 ? (
                    rejectedRequests.map((r) => <RequestItem key={r.id} request={r} />)
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No rejected requests</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  )
}
