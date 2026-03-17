"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertTriangle,
  Plus,
  Clock,
  FileText,
  User,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  Eye,
  History,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { CropSelectItems } from "@/components/ui/crop-select-items"

// Mock data for assisted supply requests
const assistedSupplyRequests = [
  {
    id: "ASR-001",
    crop: "Maize",
    corridors: ["Kaduna North", "Kaduna South"],
    shortfallVolume: 450,
    allowedRangeMin: 10,
    allowedRangeMax: 50,
    deliveryWindowStart: "2024-09-15",
    deliveryWindowEnd: "2024-10-15",
    confidenceLabel: "Medium",
    expiryDate: "2024-08-30",
    status: "active",
    initiatedBy: "Ops Admin",
    initiatedAt: "2024-08-01T10:30:00Z",
    reason: "Buyer confirmed 800MT but coordinated supply only covers 350MT",
    declarationsCount: 8,
    approvedVolume: 280,
  },
  {
    id: "ASR-002",
    crop: "Soybean",
    corridors: ["Kano Central"],
    shortfallVolume: 200,
    allowedRangeMin: 5,
    allowedRangeMax: 30,
    deliveryWindowStart: "2024-10-01",
    deliveryWindowEnd: "2024-11-01",
    confidenceLabel: "Medium",
    expiryDate: "2024-09-15",
    status: "expired",
    initiatedBy: "Regional Manager",
    initiatedAt: "2024-07-15T14:00:00Z",
    reason: "Seasonal demand spike - coordinated supply insufficient",
    declarationsCount: 5,
    approvedVolume: 120,
    outcome: "partial",
  },
]

// Mock agent declarations for a request
const agentDeclarations = [
  {
    id: "DEC-001",
    agentName: "Agent 1",
    agentId: "AGT-042",
    corridor: "Kaduna North",
    declaredVolumeMin: 15,
    declaredVolumeMax: 25,
    sourceType: "Existing farmer network",
    qualityScore: 4.2,
    submittedAt: "2024-08-03T09:15:00Z",
    status: "approved",
    approvedVolume: 20,
  },
  {
    id: "DEC-002",
    agentName: "Agent 2",
    agentId: "AGT-078",
    corridor: "Kaduna North",
    declaredVolumeMin: 20,
    declaredVolumeMax: 40,
    sourceType: "Adjacent clusters",
    qualityScore: 3.8,
    submittedAt: "2024-08-04T11:30:00Z",
    status: "under_review",
  },
  {
    id: "DEC-003",
    agentName: "Agent 3",
    agentId: "AGT-091",
    corridor: "Kaduna South",
    declaredVolumeMin: 30,
    declaredVolumeMax: 50,
    sourceType: "Existing farmer network",
    qualityScore: 4.5,
    submittedAt: "2024-08-05T08:45:00Z",
    status: "approved",
    approvedVolume: 45,
  },
  {
    id: "DEC-004",
    agentName: "Agent 4",
    agentId: "AGT-023",
    corridor: "Kaduna South",
    declaredVolumeMin: 10,
    declaredVolumeMax: 20,
    sourceType: "New sourcing",
    qualityScore: 3.2,
    submittedAt: "2024-08-06T16:00:00Z",
    status: "rejected",
    rejectionReason: "Quality score below threshold",
  },
]

export default function AssistedSupplyRequestsPage() {
  const { toast } = useToast()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showDeclarationsDialog, setShowDeclarationsDialog] = useState(false)
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<(typeof assistedSupplyRequests)[0] | null>(null)
  const [selectedDeclaration, setSelectedDeclaration] = useState<(typeof agentDeclarations)[0] | null>(null)
  const [approvalVolume, setApprovalVolume] = useState("")

  // Form state
  const [formData, setFormData] = useState({
    crop: "",
    corridors: [] as string[],
    shortfallVolume: "",
    allowedRangeMin: "",
    allowedRangeMax: "",
    deliveryWindowStart: "",
    deliveryWindowEnd: "",
    expiryDate: "",
    reason: "",
  })

  const handleCreateRequest = () => {
    toast({
      title: "Request Initiated",
      description: "Assisted supply request ASR-003 has been created and sent to agents in selected corridors.",
    })
    setShowCreateDialog(false)
    setFormData({
      crop: "",
      corridors: [],
      shortfallVolume: "",
      allowedRangeMin: "",
      allowedRangeMax: "",
      deliveryWindowStart: "",
      deliveryWindowEnd: "",
      expiryDate: "",
      reason: "",
    })
  }

  const handleApproveDeclaration = (type: "full" | "partial" | "reject") => {
    const messages = {
      full: "Declaration approved for planning",
      partial: `Declaration partially approved (${approvalVolume}MT) for planning`,
      reject: "Declaration rejected",
    }
    toast({
      title: type === "reject" ? "Declaration Rejected" : "Declaration Approved",
      description: messages[type],
    })
    setShowApprovalDialog(false)
    setSelectedDeclaration(null)
    setApprovalVolume("")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Active
          </Badge>
        )
      case "expired":
        return (
          <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200">
            Expired
          </Badge>
        )
      case "closed":
        return (
          <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200">
            Closed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getDeclarationStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-300">
            Approved for Planning
          </Badge>
        )
      case "under_review":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Under Review
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-slate-100 text-slate-500 border-slate-200">
            Declined
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const activeRequests = assistedSupplyRequests.filter((r) => r.status === "active")
  const expiredRequests = assistedSupplyRequests.filter((r) => r.status === "expired" || r.status === "closed")

  return (
    <DashboardLayout allowedRoles={["ops_admin", "super_admin"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Assisted Supply Requests</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage temporary demand shortfalls through agent-declared supply
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)} className="bg-slate-800 hover:bg-slate-700">
            <Plus className="h-4 w-4 mr-2" />
            Initiate Assisted Supply Request
          </Button>
        </div>

        {/* Warning Banner */}
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="py-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">Internal Ops Feature</p>
                <p className="mt-0.5">
                  Assisted supply is used only when AgroBridge-coordinated supply cannot meet confirmed buyer demand.
                  Declarations are non-binding and do not carry the same guarantees as coordinated supply.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Requests</CardTitle>
            <CardDescription>Requests currently accepting agent declarations</CardDescription>
          </CardHeader>
          <CardContent>
            {activeRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No active assisted supply requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeRequests.map((request) => (
                  <Card key={request.id} className="border-slate-200">
                    <CardContent className="py-4">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-sm text-muted-foreground">{request.id}</span>
                            {getStatusBadge(request.status)}
                          </div>
                          <h4 className="font-semibold">
                            {request.crop} - {request.shortfallVolume}MT Shortfall
                          </h4>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {request.corridors.join(", ")}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              Delivery: {new Date(request.deliveryWindowStart).toLocaleDateString()} -{" "}
                              {new Date(request.deliveryWindowEnd).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              Expires: {new Date(request.expiryDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                          <div className="text-sm">
                            <p className="text-muted-foreground">Declarations</p>
                            <p className="font-semibold">{request.declarationsCount} received</p>
                          </div>
                          <div className="text-sm">
                            <p className="text-muted-foreground">Approved (Planning)</p>
                            <p className="font-semibold">{request.approvedVolume}MT</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request)
                              setShowDeclarationsDialog(true)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Declarations
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Audit Trail / History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="h-5 w-5" />
              Request History & Audit Trail
            </CardTitle>
            <CardDescription>Expired and closed requests with outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Crop</TableHead>
                    <TableHead>Corridors</TableHead>
                    <TableHead>Shortfall</TableHead>
                    <TableHead>Approved</TableHead>
                    <TableHead>Initiated By</TableHead>
                    <TableHead>Outcome</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expiredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-mono text-sm">{request.id}</TableCell>
                      <TableCell>{request.crop}</TableCell>
                      <TableCell className="max-w-[150px] truncate">{request.corridors.join(", ")}</TableCell>
                      <TableCell>{request.shortfallVolume}MT</TableCell>
                      <TableCell>{request.approvedVolume}MT</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{request.initiatedBy}</p>
                          <p className="text-muted-foreground text-xs">
                            {new Date(request.initiatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
                          {request.outcome === "partial"
                            ? "Partial"
                            : request.outcome === "fulfilled"
                              ? "Fulfilled"
                              : "Expired"}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Create Request Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Initiate Assisted Supply Request</DialogTitle>
              <DialogDescription>
                Create a time-bound request for agent-declared supply to address demand shortfall
              </DialogDescription>
            </DialogHeader>

            {/* Mandatory Disclaimer */}
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="py-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    Assisted supply is non-binding, time-bound, and does not carry the same guarantees as
                    AgroBridge-coordinated supply.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="crop">Crop *</Label>
                  <Select value={formData.crop} onValueChange={(v) => setFormData({ ...formData, crop: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select crop" />
                    </SelectTrigger>
                    <SelectContent>
                      <CropSelectItems />
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shortfall">Demand Shortfall Volume (MT) *</Label>
                  <Input
                    id="shortfall"
                    type="number"
                    placeholder="e.g., 450"
                    value={formData.shortfallVolume}
                    onChange={(e) => setFormData({ ...formData, shortfallVolume: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Corridor(s) *</Label>
                <Select onValueChange={(v) => setFormData({ ...formData, corridors: [...formData.corridors, v] })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select corridors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kaduna-north">Kaduna North</SelectItem>
                    <SelectItem value="kaduna-south">Kaduna South</SelectItem>
                    <SelectItem value="kano-central">Kano Central</SelectItem>
                    <SelectItem value="katsina-east">Katsina East</SelectItem>
                  </SelectContent>
                </Select>
                {formData.corridors.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formData.corridors.map((c) => (
                      <Badge key={c} variant="secondary" className="capitalize">
                        {c.replace("-", " ")}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Allowed Volume Range Per Agent (MT) *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={formData.allowedRangeMin}
                      onChange={(e) => setFormData({ ...formData, allowedRangeMin: e.target.value })}
                    />
                    <span className="text-muted-foreground">to</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={formData.allowedRangeMax}
                      onChange={(e) => setFormData({ ...formData, allowedRangeMax: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Confidence Label</Label>
                  <Input value="Medium" disabled className="bg-slate-50" />
                  <p className="text-xs text-muted-foreground">Assisted supply is always Medium confidence</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Delivery Window *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="date"
                      value={formData.deliveryWindowStart}
                      onChange={(e) => setFormData({ ...formData, deliveryWindowStart: e.target.value })}
                    />
                    <span className="text-muted-foreground">to</span>
                    <Input
                      type="date"
                      value={formData.deliveryWindowEnd}
                      onChange={(e) => setFormData({ ...formData, deliveryWindowEnd: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date *</Label>
                  <Input
                    id="expiry"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">Request auto-expires on this date</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Initiation *</Label>
                <Textarea
                  id="reason"
                  placeholder="Explain why coordinated supply is insufficient..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateRequest} className="bg-slate-800 hover:bg-slate-700">
                Initiate Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Declarations Dialog */}
        <Dialog open={showDeclarationsDialog} onOpenChange={setShowDeclarationsDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Agent Declarations - {selectedRequest?.id}</DialogTitle>
              <DialogDescription>
                {selectedRequest?.crop} | {selectedRequest?.shortfallVolume}MT shortfall |{" "}
                {selectedRequest?.corridors.join(", ")}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-slate-50">
                  <CardContent className="py-3 text-center">
                    <p className="text-2xl font-semibold">{agentDeclarations.length}</p>
                    <p className="text-sm text-muted-foreground">Total Declarations</p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-50">
                  <CardContent className="py-3 text-center">
                    <p className="text-2xl font-semibold">
                      {agentDeclarations.filter((d) => d.status === "under_review").length}
                    </p>
                    <p className="text-sm text-muted-foreground">Under Review</p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-50">
                  <CardContent className="py-3 text-center">
                    <p className="text-2xl font-semibold">
                      {agentDeclarations
                        .filter((d) => d.status === "approved")
                        .reduce((sum, d) => sum + (d.approvedVolume || 0), 0)}
                      MT
                    </p>
                    <p className="text-sm text-muted-foreground">Approved for Planning</p>
                  </CardContent>
                </Card>
              </div>

              {/* Declarations Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agent</TableHead>
                      <TableHead>Corridor</TableHead>
                      <TableHead>Declared Range</TableHead>
                      <TableHead>Source Type</TableHead>
                      <TableHead>Quality Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agentDeclarations.map((declaration) => (
                      <TableRow key={declaration.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                              <User className="h-4 w-4 text-slate-600" />
                            </div>
                            <div>
                              <p className="font-medium">{declaration.agentName}</p>
                              <p className="text-xs text-muted-foreground">{declaration.agentId}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{declaration.corridor}</TableCell>
                        <TableCell>
                          {declaration.declaredVolumeMin}-{declaration.declaredVolumeMax}MT
                        </TableCell>
                        <TableCell className="text-sm">{declaration.sourceType}</TableCell>
                        <TableCell>
                          <span
                            className={declaration.qualityScore >= 4 ? "text-slate-700 font-medium" : "text-slate-500"}
                          >
                            {declaration.qualityScore}/5
                          </span>
                        </TableCell>
                        <TableCell>
                          {getDeclarationStatusBadge(declaration.status)}
                          {declaration.status === "approved" && declaration.approvedVolume && (
                            <p className="text-xs text-muted-foreground mt-1">{declaration.approvedVolume}MT</p>
                          )}
                        </TableCell>
                        <TableCell>
                          {declaration.status === "under_review" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedDeclaration(declaration)
                                setShowApprovalDialog(true)
                              }}
                            >
                              Review
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Agent declarations are visible to Ops only. Agents cannot see buyer identity, pricing, or competing
                declarations.
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeclarationsDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Approval Dialog */}
        <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Review Declaration</DialogTitle>
              <DialogDescription>
                {selectedDeclaration?.agentName} - {selectedDeclaration?.declaredVolumeMin}-
                {selectedDeclaration?.declaredVolumeMax}MT
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Corridor</p>
                  <p className="font-medium">{selectedDeclaration?.corridor}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Source Type</p>
                  <p className="font-medium">{selectedDeclaration?.sourceType}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Quality Score</p>
                  <p className="font-medium">{selectedDeclaration?.qualityScore}/5</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Submitted</p>
                  <p className="font-medium">
                    {selectedDeclaration?.submittedAt && new Date(selectedDeclaration.submittedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Approval Volume (MT)</Label>
                <Input
                  type="number"
                  placeholder={`Max: ${selectedDeclaration?.declaredVolumeMax}MT`}
                  value={approvalVolume}
                  onChange={(e) => setApprovalVolume(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Leave blank to approve full declared range</p>
              </div>

              <Card className="border-slate-200 bg-slate-50">
                <CardContent className="py-3">
                  <p className="text-sm text-slate-600">
                    Approved declarations will be marked as "Approved for planning – not guaranteed". No declaration
                    auto-converts to delivery.
                  </p>
                </CardContent>
              </Card>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                className="text-slate-600 bg-transparent"
                onClick={() => handleApproveDeclaration("reject")}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
              <Button variant="outline" onClick={() => handleApproveDeclaration("partial")} disabled={!approvalVolume}>
                Partial Approve
              </Button>
              <Button className="bg-slate-800 hover:bg-slate-700" onClick={() => handleApproveDeclaration("full")}>
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Approve for Planning
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
