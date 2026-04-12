"use client"

import React, { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  User,
  Calendar,
  Search,
  Filter,
  ThumbsUp,
  ThumbsDown,
  Eye,
  ArrowRight,
  Loader2,
  RefreshCw,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"

interface TaskRequest {
  id: string
  agent_id: string
  agent_user_id: string
  agent_name: string
  farmer_id?: string
  farmer_name?: string
  corridor_id?: string
  corridor_name?: string
  issue_type: string
  urgency: string
  title: string
  description: string
  status: string
  reviewed_by?: string
  reviewed_by_name?: string
  reviewed_at?: string
  review_notes?: string
  rejection_reason?: string
  service_event_id?: string
  created_at: string
  updated_at: string
}

const urgencyStyles: Record<string, string> = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-blue-100 text-blue-700 border-blue-200",
}

const issueTypeLabels: Record<string, string> = {
  mechanization: "Mechanization",
  inputs: "Inputs (Seeds/Fertilizer)",
  inspection: "Inspection Required",
  logistics: "Logistics/Transport",
  pest_control: "Pest Control",
  irrigation: "Irrigation",
  storage: "Storage",
  other: "Other",
}

export default function TaskRequestsPage() {
  const [requests, setRequests] = useState<TaskRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, converted: 0, highUrgency: 0, total: 0 })
  const [selectedRequest, setSelectedRequest] = useState<TaskRequest | null>(null)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterUrgency, setFilterUrgency] = useState<string>("all")
  const { toast } = useToast()

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true)
      const [reqRes, statsRes] = await Promise.all([
        apiClient.taskRequests.list({ search: searchQuery || undefined, urgency: filterUrgency !== "all" ? filterUrgency : undefined }),
        apiClient.taskRequests.stats(),
      ])

      if (reqRes.success) {
        setRequests(reqRes.data || [])
      }
      if (statsRes.success && statsRes.data) {
        const sc = statsRes.data.statusCounts || {}
        const uc = statsRes.data.urgencyCounts || {}
        setStats({
          pending: sc.pending || 0,
          approved: (sc.approved || 0) + (sc.converted || 0),
          rejected: sc.rejected || 0,
          converted: sc.converted || 0,
          highUrgency: uc.high || 0,
          total: statsRes.data.total || 0,
        })
      }
    } catch (err) {
      console.error("Failed to fetch task requests:", err)
      toast({ title: "Error", description: "Failed to load task requests", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [searchQuery, filterUrgency, toast])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const pendingRequests = requests.filter((r) => r.status === "pending")
  const approvedRequests = requests.filter((r) => r.status === "approved" || r.status === "converted")
  const rejectedRequests = requests.filter((r) => r.status === "rejected")

  // Approve request
  const handleApproveRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedRequest) return

    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const reviewNotes = formData.get("reviewNotes") as string

    try {
      const res = await apiClient.taskRequests.review(selectedRequest.id, {
        action: "approve",
        review_notes: reviewNotes || undefined,
      })

      if (res.success) {
        setApproveDialogOpen(false)
        setSelectedRequest(null)
        toast({ title: "Request Approved", description: "The task request has been approved." })
        fetchRequests()
      } else {
        toast({ title: "Error", description: (res as any).error || "Failed to approve", variant: "destructive" })
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to approve request", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reject request
  const handleRejectRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedRequest) return

    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const reason = formData.get("reason") as string

    try {
      const res = await apiClient.taskRequests.review(selectedRequest.id, {
        action: "reject",
        rejection_reason: reason,
      })

      if (res.success) {
        setRejectDialogOpen(false)
        setSelectedRequest(null)
        toast({ title: "Request Rejected", description: "The agent will be notified of the rejection." })
        fetchRequests()
      } else {
        toast({ title: "Error", description: (res as any).error || "Failed to reject", variant: "destructive" })
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to reject request", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const RequestCard = ({
    request,
    showActions = true,
  }: {
    request: TaskRequest
    showActions?: boolean
  }) => (
    <Card className="border-border/50 hover:border-border transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="outline" className={urgencyStyles[request.urgency] || ""}>
                {request.urgency} urgency
              </Badge>
              <Badge variant="outline">{issueTypeLabels[request.issue_type] || request.issue_type}</Badge>
              {request.status === "approved" && (
                <Badge className="bg-emerald-100 text-emerald-700 border-0">Approved</Badge>
              )}
              {request.status === "converted" && (
                <Badge className="bg-emerald-100 text-emerald-700 border-0">Converted to Task</Badge>
              )}
              {request.status === "rejected" && (
                <Badge className="bg-red-100 text-red-700 border-0">Rejected</Badge>
              )}
            </div>

            <h4 className="font-medium text-foreground">{request.title}</h4>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{request.description}</p>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                From: {request.agent_name}
              </span>
              {request.farmer_name && (
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  Farmer: {request.farmer_name}
                </span>
              )}
              {request.corridor_name && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {request.corridor_name}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(request.created_at).toLocaleDateString()}
              </span>
            </div>

            {request.status === "rejected" && request.rejection_reason && (
              <div className="mt-3 p-2 bg-red-50 border border-red-100 rounded text-xs text-red-700">
                <strong>Rejection Reason:</strong> {request.rejection_reason}
              </div>
            )}

            {request.reviewed_by_name && request.reviewed_at && (
              <div className="mt-2 text-xs text-muted-foreground">
                Reviewed by {request.reviewed_by_name} on {new Date(request.reviewed_at).toLocaleDateString()}
              </div>
            )}
          </div>

          {showActions && request.status === "pending" && (
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                className="bg-emerald-700 hover:bg-emerald-800"
                onClick={() => { setSelectedRequest(request); setApproveDialogOpen(true) }}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                onClick={() => { setSelectedRequest(request); setRejectDialogOpen(true) }}
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                Reject
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="bg-transparent"
                onClick={() => { setSelectedRequest(request); setViewDialogOpen(true) }}
              >
                <Eye className="h-4 w-4 mr-1" />
                Details
              </Button>
            </div>
          )}

          {(!showActions || request.status !== "pending") && (
            <Button
              size="sm"
              variant="ghost"
              className="bg-transparent"
              onClick={() => { setSelectedRequest(request); setViewDialogOpen(true) }}
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <DashboardLayout allowedRoles={["ops_admin", "super_admin"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Task Requests</h1>
            <p className="text-muted-foreground">Review and approve service requests from field agents</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchRequests} disabled={loading} className="bg-transparent">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting decision</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Urgency</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.highUrgency}</div>
              <p className="text-xs text-muted-foreground">Needs immediate attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{stats.approved}</div>
              <p className="text-xs text-muted-foreground">Converted to tasks</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rejected}</div>
              <p className="text-xs text-muted-foreground">With reason provided</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search requests, farmers, agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterUrgency} onValueChange={setFilterUrgency}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by urgency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Urgency</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
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
                Pending Review
                {pendingRequests.length > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-700">
                    {pendingRequests.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="approved">Approved ({approvedRequests.length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({rejectedRequests.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-4 space-y-3">
              {pendingRequests.length > 0 ? (
                pendingRequests.map((request) => <RequestCard key={request.id} request={request} />)
              ) : (
                <Card className="border-border/50">
                  <CardContent className="p-8 text-center">
                    <CheckCircle2 className="h-12 w-12 mx-auto text-emerald-500 mb-3" />
                    <p className="text-lg font-medium">No pending requests</p>
                    <p className="text-muted-foreground">All service requests have been processed.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="approved" className="mt-4 space-y-3">
              {approvedRequests.length > 0 ? (
                approvedRequests.map((request) => <RequestCard key={request.id} request={request} showActions={false} />)
              ) : (
                <Card className="border-border/50">
                  <CardContent className="p-8 text-center text-muted-foreground">No approved requests yet</CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="rejected" className="mt-4 space-y-3">
              {rejectedRequests.length > 0 ? (
                rejectedRequests.map((request) => <RequestCard key={request.id} request={request} showActions={false} />)
              ) : (
                <Card className="border-border/50">
                  <CardContent className="p-8 text-center text-muted-foreground">No rejected requests</CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}

        {/* Approve Dialog */}
        <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Approve Request</DialogTitle>
              <DialogDescription>Approve this task request from the field agent.</DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <form onSubmit={handleApproveRequest}>
                <div className="space-y-4 py-4">
                  <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{selectedRequest.title}</span>
                      <Badge variant="outline" className={urgencyStyles[selectedRequest.urgency] || ""}>
                        {selectedRequest.urgency}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedRequest.description}</p>
                    <div className="text-xs text-muted-foreground">
                      From: {selectedRequest.agent_name}
                      {selectedRequest.farmer_name && ` | Farmer: ${selectedRequest.farmer_name}`}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reviewNotes">Review Notes (optional)</Label>
                    <Textarea
                      id="reviewNotes"
                      name="reviewNotes"
                      placeholder="Add any notes about this approval..."
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setApproveDialogOpen(false)} className="bg-transparent">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-emerald-700 hover:bg-emerald-800">
                    {isSubmitting ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Approving...</>
                    ) : (
                      "Approve Request"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Request</DialogTitle>
              <DialogDescription>Provide a reason for rejecting this request. The agent will be notified.</DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <form onSubmit={handleRejectRequest}>
                <div className="space-y-4 py-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium">{selectedRequest.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{selectedRequest.description}</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Rejection Reason *</Label>
                    <Textarea id="reason" name="reason" placeholder="Explain why this request is being rejected..." rows={4} required />
                    <p className="text-xs text-muted-foreground">This will be visible to the requesting agent.</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setRejectDialogOpen(false)} className="bg-transparent">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} variant="destructive">
                    {isSubmitting ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Rejecting...</>
                    ) : (
                      "Reject Request"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* View Details Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Details</DialogTitle>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Title</Label>
                    <p className="font-medium">{selectedRequest.title}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <p className="font-medium capitalize">{selectedRequest.status}</p>
                  </div>
                  {selectedRequest.farmer_name && (
                    <div>
                      <Label className="text-muted-foreground">Farmer</Label>
                      <p className="font-medium">{selectedRequest.farmer_name}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-muted-foreground">Requesting Agent</Label>
                    <p className="font-medium">{selectedRequest.agent_name}</p>
                  </div>
                  {selectedRequest.corridor_name && (
                    <div>
                      <Label className="text-muted-foreground">Corridor</Label>
                      <p className="font-medium">{selectedRequest.corridor_name}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-muted-foreground">Issue Type</Label>
                    <p className="font-medium">{issueTypeLabels[selectedRequest.issue_type] || selectedRequest.issue_type}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Urgency</Label>
                    <Badge variant="outline" className={urgencyStyles[selectedRequest.urgency] || ""}>{selectedRequest.urgency}</Badge>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Submitted</Label>
                    <p>{new Date(selectedRequest.created_at).toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="mt-1">{selectedRequest.description}</p>
                </div>

                {selectedRequest.review_notes && (
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="text-sm font-medium text-blue-700">Review Notes</p>
                    <p className="text-xs text-blue-600">{selectedRequest.review_notes}</p>
                  </div>
                )}

                {(selectedRequest.status === "approved" || selectedRequest.status === "converted") && (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                    <p className="text-sm font-medium text-emerald-700">Approved</p>
                    {selectedRequest.reviewed_by_name && (
                      <p className="text-xs text-emerald-600">By: {selectedRequest.reviewed_by_name}</p>
                    )}
                    {selectedRequest.service_event_id && (
                      <p className="text-xs text-emerald-600">Service Event: {selectedRequest.service_event_id}</p>
                    )}
                  </div>
                )}

                {selectedRequest.status === "rejected" && selectedRequest.rejection_reason && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                    <p className="text-sm font-medium text-red-700">Rejected</p>
                    <p className="text-xs text-red-600">{selectedRequest.rejection_reason}</p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewDialogOpen(false)} className="bg-transparent">Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
