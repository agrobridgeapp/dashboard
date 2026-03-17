"use client"

import React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  FileText,
  Search,
  Filter,
  ThumbsUp,
  ThumbsDown,
  Eye,
  ArrowRight,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock task requests from field agents
const initialRequests = [
  {
    id: "req-001",
    agentId: "agent-001",
    agentName: "Blessing Okonkwo",
    farmerName: "Audu Garba",
    farmerId: "farmer-003",
    corridor: "Kaduna North",
    issueType: "mechanization",
    urgency: "high",
    description:
      "Farmer needs urgent land preparation. Rains expected next week and farmer is worried about missing the planting window. Has 4.5 hectares ready for plowing.",
    submittedAt: "2024-01-26T10:30:00Z",
    status: "pending",
  },
  {
    id: "req-002",
    agentId: "agent-002",
    agentName: "Chinedu Eze",
    farmerName: "Bello Abubakar",
    farmerId: "farmer-005",
    corridor: "Kaduna North",
    issueType: "inputs",
    urgency: "medium",
    description:
      "Fertilizer delivery delayed. Farmer running low on NPK for second application. Needs 5 bags urgently to complete treatment on time.",
    submittedAt: "2024-01-25T14:15:00Z",
    status: "pending",
  },
  {
    id: "req-003",
    agentId: "agent-003",
    agentName: "Amina Ibrahim",
    farmerName: "Halima Mohammed",
    farmerId: "farmer-004",
    corridor: "Kaduna North",
    issueType: "inspection",
    urgency: "low",
    description:
      "Farmer reports possible pest infestation on maize crop. Requesting inspection to verify and determine appropriate treatment.",
    submittedAt: "2024-01-24T09:45:00Z",
    status: "pending",
  },
  {
    id: "req-004",
    agentId: "agent-001",
    agentName: "Blessing Okonkwo",
    farmerName: "Musa Abdullahi",
    farmerId: "farmer-001",
    corridor: "Kaduna North",
    issueType: "logistics",
    urgency: "high",
    description:
      "Harvest ready for transport to aggregation center. Approximately 15 tons of maize needs collection within 2 days to prevent quality loss.",
    submittedAt: "2024-01-23T16:20:00Z",
    status: "approved",
    approvedAt: "2024-01-24T08:00:00Z",
    approvedBy: "ops-admin",
    taskId: "task-gen-001",
  },
  {
    id: "req-005",
    agentId: "agent-004",
    agentName: "Yakubu Danladi",
    farmerName: "Ibrahim Yusuf",
    farmerId: "farmer-006",
    corridor: "Kaduna North",
    issueType: "other",
    urgency: "low",
    description: "Farmer requesting meeting to discuss next season planning and potential expansion.",
    submittedAt: "2024-01-22T11:00:00Z",
    status: "rejected",
    rejectedAt: "2024-01-22T15:30:00Z",
    rejectedBy: "ops-admin",
    rejectionReason:
      "This type of planning meeting can be conducted by the field agent directly. No service task required.",
  },
]

const urgencyStyles: Record<string, string> = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-blue-100 text-blue-700 border-blue-200",
}

const issueTypeLabels: Record<string, string> = {
  land_prep: "Land Preparation",
  inputs: "Inputs (Seeds/Fertilizer)",
  mechanization: "Mechanization",
  logistics: "Logistics/Transport",
  inspection: "Inspection Required",
  other: "Other",
}

// Mock assignees
const assignees = {
  agents: [
    { id: "agent-001", name: "Blessing Okonkwo", cluster: "Zaria Central" },
    { id: "agent-002", name: "Chinedu Eze", cluster: "Zaria West" },
    { id: "agent-003", name: "Amina Ibrahim", cluster: "Giwa East" },
    { id: "agent-004", name: "Yakubu Danladi", cluster: "Igabi South" },
  ],
  partners: [
    { id: "partner-001", name: "SwiftAgri Logistics", type: "logistics" },
    { id: "partner-002", name: "FarmTech Mechanization", type: "mechanization" },
    { id: "partner-003", name: "AgriPro Inputs Ltd", type: "inputs" },
  ],
}

export default function TaskRequestsPage() {
  const [requests, setRequests] = useState(initialRequests)
  const [selectedRequest, setSelectedRequest] = useState<(typeof initialRequests)[0] | null>(null)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterUrgency, setFilterUrgency] = useState<string>("all")
  const { toast } = useToast()

  const pendingRequests = requests.filter((r) => r.status === "pending")
  const approvedRequests = requests.filter((r) => r.status === "approved")
  const rejectedRequests = requests.filter((r) => r.status === "rejected")

  // Filter requests
  const filterRequests = (reqs: typeof requests) => {
    return reqs.filter((req) => {
      const matchesSearch =
        req.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesUrgency = filterUrgency === "all" || req.urgency === filterUrgency

      return matchesSearch && matchesUrgency
    })
  }

  // Approve request and create task
  const handleApproveRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedRequest) return

    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedRequest.id
          ? {
              ...r,
              status: "approved",
              approvedAt: new Date().toISOString(),
              approvedBy: "ops-admin",
              taskId: `task-${Date.now()}`,
            }
          : r
      )
    )

    setApproveDialogOpen(false)
    setSelectedRequest(null)
    setIsSubmitting(false)

    toast({
      title: "Request Approved",
      description: "A task has been created and assigned.",
    })
  }

  // Reject request
  const handleRejectRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedRequest) return

    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const reason = formData.get("reason") as string

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedRequest.id
          ? {
              ...r,
              status: "rejected",
              rejectedAt: new Date().toISOString(),
              rejectedBy: "ops-admin",
              rejectionReason: reason,
            }
          : r
      )
    )

    setRejectDialogOpen(false)
    setSelectedRequest(null)
    setIsSubmitting(false)

    toast({
      title: "Request Rejected",
      description: "The agent will be notified of the rejection.",
    })
  }

  const RequestCard = ({
    request,
    showActions = true,
  }: {
    request: (typeof requests)[0]
    showActions?: boolean
  }) => (
    <Card className="border-border/50 hover:border-border transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className={urgencyStyles[request.urgency]}>
                {request.urgency} urgency
              </Badge>
              <Badge variant="outline">{issueTypeLabels[request.issueType] || request.issueType}</Badge>
              {request.status === "approved" && (
                <Badge className="bg-emerald-100 text-emerald-700 border-0">Approved</Badge>
              )}
              {request.status === "rejected" && (
                <Badge className="bg-red-100 text-red-700 border-0">Rejected</Badge>
              )}
            </div>

            <h4 className="font-medium text-foreground">
              Service Request: {request.farmerName}
            </h4>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {request.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                From: {request.agentName}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {request.corridor}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(request.submittedAt).toLocaleDateString()}
              </span>
            </div>

            {request.status === "rejected" && request.rejectionReason && (
              <div className="mt-3 p-2 bg-red-50 border border-red-100 rounded text-xs text-red-700">
                <strong>Rejection Reason:</strong> {request.rejectionReason}
              </div>
            )}
          </div>

          {showActions && request.status === "pending" && (
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                className="bg-emerald-700 hover:bg-emerald-800"
                onClick={() => {
                  setSelectedRequest(request)
                  setApproveDialogOpen(true)
                }}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                onClick={() => {
                  setSelectedRequest(request)
                  setRejectDialogOpen(true)
                }}
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                Reject
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="bg-transparent"
                onClick={() => {
                  setSelectedRequest(request)
                  setViewDialogOpen(true)
                }}
              >
                <Eye className="h-4 w-4 mr-1" />
                Details
              </Button>
            </div>
          )}

          {!showActions && (
            <Button
              size="sm"
              variant="ghost"
              className="bg-transparent"
              onClick={() => {
                setSelectedRequest(request)
                setViewDialogOpen(true)
              }}
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
        <div>
          <h1 className="text-3xl font-bold">Task Requests</h1>
          <p className="text-muted-foreground">
            Review and approve service requests from field agents
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{pendingRequests.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting decision</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Urgency</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {pendingRequests.filter((r) => r.urgency === "high").length}
              </div>
              <p className="text-xs text-muted-foreground">Needs immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{approvedRequests.length}</div>
              <p className="text-xs text-muted-foreground">Converted to tasks</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rejectedRequests.length}</div>
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

        {/* Tabs */}
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
            {filterRequests(pendingRequests).length > 0 ? (
              filterRequests(pendingRequests).map((request) => (
                <RequestCard key={request.id} request={request} />
              ))
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
            {filterRequests(approvedRequests).length > 0 ? (
              filterRequests(approvedRequests).map((request) => (
                <RequestCard key={request.id} request={request} showActions={false} />
              ))
            ) : (
              <Card className="border-border/50">
                <CardContent className="p-8 text-center text-muted-foreground">
                  No approved requests yet
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="mt-4 space-y-3">
            {filterRequests(rejectedRequests).length > 0 ? (
              filterRequests(rejectedRequests).map((request) => (
                <RequestCard key={request.id} request={request} showActions={false} />
              ))
            ) : (
              <Card className="border-border/50">
                <CardContent className="p-8 text-center text-muted-foreground">
                  No rejected requests
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Approve Dialog */}
        <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Approve & Create Task</DialogTitle>
              <DialogDescription>
                Review the request and create an official task.
              </DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <form onSubmit={handleApproveRequest}>
                <div className="space-y-4 py-4">
                  {/* Request Summary */}
                  <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Original Request</span>
                      <Badge variant="outline" className={urgencyStyles[selectedRequest.urgency]}>
                        {selectedRequest.urgency}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedRequest.description}</p>
                    <div className="text-xs text-muted-foreground">
                      From: {selectedRequest.agentName} | Farmer: {selectedRequest.farmerName}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <ArrowRight className="h-4 w-4" />
                      Task Details
                    </h4>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="taskTitle">Task Title *</Label>
                        <Input
                          id="taskTitle"
                          name="taskTitle"
                          defaultValue={`${issueTypeLabels[selectedRequest.issueType] || selectedRequest.issueType} - ${selectedRequest.farmerName}`}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="taskDescription">Task Description</Label>
                        <Textarea
                          id="taskDescription"
                          name="taskDescription"
                          defaultValue={selectedRequest.description}
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="priority">Priority</Label>
                          <Select name="priority" defaultValue={selectedRequest.urgency}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dueDate">Due Date *</Label>
                          <Input id="dueDate" name="dueDate" type="date" required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="assignee">Assign To *</Label>
                        <Select name="assignee" defaultValue={selectedRequest.agentId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select assignee..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="header-agents" disabled>
                              -- Field Agents --
                            </SelectItem>
                            {assignees.agents.map((agent) => (
                              <SelectItem key={agent.id} value={agent.id}>
                                {agent.name} ({agent.cluster})
                              </SelectItem>
                            ))}
                            <SelectItem value="header-partners" disabled>
                              -- Partners --
                            </SelectItem>
                            {assignees.partners.map((partner) => (
                              <SelectItem key={partner.id} value={partner.id}>
                                {partner.name} ({partner.type})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setApproveDialogOpen(false)}
                    className="bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-emerald-700 hover:bg-emerald-800"
                  >
                    {isSubmitting ? "Creating Task..." : "Approve & Create Task"}
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
              <DialogDescription>
                Provide a reason for rejecting this request. The agent will be notified.
              </DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <form onSubmit={handleRejectRequest}>
                <div className="space-y-4 py-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium">{selectedRequest.farmerName}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {selectedRequest.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Rejection Reason *</Label>
                    <Textarea
                      id="reason"
                      name="reason"
                      placeholder="Explain why this request is being rejected..."
                      rows={4}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      This will be visible to the requesting agent.
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setRejectDialogOpen(false)}
                    className="bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="destructive"
                  >
                    {isSubmitting ? "Rejecting..." : "Reject Request"}
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
                    <Label className="text-muted-foreground">Farmer</Label>
                    <p className="font-medium">{selectedRequest.farmerName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Farmer ID</Label>
                    <p className="font-medium">{selectedRequest.farmerId}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Requesting Agent</Label>
                    <p className="font-medium">{selectedRequest.agentName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Corridor</Label>
                    <p className="font-medium">{selectedRequest.corridor}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Issue Type</Label>
                    <p className="font-medium">
                      {issueTypeLabels[selectedRequest.issueType] || selectedRequest.issueType}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Urgency</Label>
                    <Badge variant="outline" className={urgencyStyles[selectedRequest.urgency]}>
                      {selectedRequest.urgency}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="mt-1">{selectedRequest.description}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">Submitted</Label>
                  <p>{new Date(selectedRequest.submittedAt).toLocaleString()}</p>
                </div>

                {selectedRequest.status === "approved" && (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                    <p className="text-sm font-medium text-emerald-700">Approved</p>
                    <p className="text-xs text-emerald-600">
                      Task ID: {selectedRequest.taskId}
                    </p>
                  </div>
                )}

                {selectedRequest.status === "rejected" && selectedRequest.rejectionReason && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                    <p className="text-sm font-medium text-red-700">Rejected</p>
                    <p className="text-xs text-red-600">{selectedRequest.rejectionReason}</p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setViewDialogOpen(false)}
                className="bg-transparent"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
