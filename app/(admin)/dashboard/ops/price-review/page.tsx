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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Banknote,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  History,
  TrendingUp,
  TrendingDown,
  Target,
  User,
  MapPin,
  Wheat,
  Calendar,
  Filter,
  Search,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Mock price proposals from agents (assisted supply only)
const mockPriceProposals = [
  {
    id: "PP-001",
    declarationId: "DEC-002",
    agentId: "AGT-042",
    agentName: "Chioma Okafor",
    corridor: "Kaduna North",
    crop: "Soybean",
    volumeRange: "150-200 MT",
    proposedPricePerTon: 450000,
    proposedPricePerBag: 22500,
    priceNotes: "Prices rising due to seasonal demand",
    buyerTargetPrice: 420000,
    corridorMarginImpact: -7.1,
    isAssistedSupply: true,
    submittedAt: "2024-07-25T10:30:00Z",
    status: "pending",
  },
  {
    id: "PP-002",
    declarationId: "DEC-005",
    agentId: "AGT-078",
    agentName: "Ibrahim Musa",
    corridor: "Kaduna North",
    crop: "Maize",
    volumeRange: "100-150 MT",
    proposedPricePerTon: 295000,
    proposedPricePerBag: 14750,
    priceNotes: "Local market rate stable. Farmers need quick payment for school fees.",
    buyerTargetPrice: 280000,
    corridorMarginImpact: -5.4,
    isAssistedSupply: true,
    submittedAt: "2024-07-26T14:15:00Z",
    status: "pending",
  },
  {
    id: "PP-003",
    declarationId: "DEC-006",
    agentId: "AGT-091",
    agentName: "Fatima Yusuf",
    corridor: "Kaduna South",
    crop: "Maize",
    volumeRange: "200-250 MT",
    proposedPricePerTon: 275000,
    proposedPricePerBag: 13750,
    priceNotes: "Good quality from registered farmers",
    buyerTargetPrice: 280000,
    corridorMarginImpact: 1.8,
    isAssistedSupply: true,
    submittedAt: "2024-07-26T09:00:00Z",
    status: "pending",
  },
  {
    id: "PP-004",
    declarationId: "DEC-007",
    agentId: "AGT-023",
    agentName: "Bello Abubakar",
    corridor: "Kano Central",
    crop: "Rice",
    volumeRange: "80-120 MT",
    proposedPricePerTon: 520000,
    proposedPricePerBag: 26000,
    priceNotes: "Premium quality local rice",
    buyerTargetPrice: 500000,
    corridorMarginImpact: -4.0,
    isAssistedSupply: true,
    submittedAt: "2024-07-27T11:45:00Z",
    status: "pending",
  },
]

// Mock reviewed proposals (audit history)
const mockReviewedProposals = [
  {
    id: "PP-100",
    declarationId: "DEC-001",
    agentId: "AGT-042",
    agentName: "Chioma Okafor",
    corridor: "Kaduna North",
    crop: "Maize",
    volumeRange: "200-300 MT",
    proposedPricePerTon: 285000,
    proposedPricePerBag: 14250,
    priceNotes: "Local market rate is around NGN 280,000-290,000/MT",
    buyerTargetPrice: 280000,
    corridorMarginImpact: -1.8,
    isAssistedSupply: true,
    submittedAt: "2024-07-20T10:30:00Z",
    status: "approved",
    reviewedAt: "2024-07-22T09:15:00Z",
    reviewedBy: "Ops Admin",
    approvedPricePerTon: 280000,
    adjustmentReason: "Aligned with corridor margin targets",
  },
  {
    id: "PP-101",
    declarationId: "DEC-004",
    agentId: "AGT-023",
    agentName: "Bello Abubakar",
    corridor: "Kaduna North",
    crop: "Maize",
    volumeRange: "50-100 MT",
    proposedPricePerTon: 310000,
    proposedPricePerBag: 15500,
    priceNotes: "Urgent - farmers need cash for school fees",
    buyerTargetPrice: 280000,
    corridorMarginImpact: -10.7,
    isAssistedSupply: true,
    submittedAt: "2024-07-10T16:00:00Z",
    status: "rejected",
    reviewedAt: "2024-07-12T11:30:00Z",
    reviewedBy: "Ops Admin",
    rejectionReason: "Price exceeds corridor margin threshold by more than 10%",
  },
]

export default function PriceReviewQueuePage() {
  const { toast } = useToast()
  const [proposals, setProposals] = useState(mockPriceProposals)
  const [reviewedProposals] = useState(mockReviewedProposals)
  const [selectedProposal, setSelectedProposal] = useState<typeof mockPriceProposals[0] | null>(null)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false)
  const [filterCorridor, setFilterCorridor] = useState("all")
  const [filterCrop, setFilterCrop] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Review form state
  const [reviewAction, setReviewAction] = useState<"approve" | "adjust" | "reject">("approve")
  const [adjustedPrice, setAdjustedPrice] = useState("")
  const [reviewReason, setReviewReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const pendingCount = proposals.filter(p => p.status === "pending").length
  const negativeMarginCount = proposals.filter(p => p.status === "pending" && p.corridorMarginImpact < 0).length

  const handleOpenReview = (proposal: typeof mockPriceProposals[0]) => {
    setSelectedProposal(proposal)
    setReviewAction("approve")
    setAdjustedPrice(proposal.proposedPricePerTon.toString())
    setReviewReason("")
    setReviewDialogOpen(true)
  }

  const handleSubmitReview = async () => {
    if (!selectedProposal) return
    if (reviewAction === "adjust" && !adjustedPrice) return
    if ((reviewAction === "adjust" || reviewAction === "reject") && !reviewReason) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Update local state
    setProposals(prev => prev.filter(p => p.id !== selectedProposal.id))

    const actionMessages = {
      approve: `Price proposal approved at NGN ${selectedProposal.proposedPricePerTon.toLocaleString()}/MT`,
      adjust: `Price adjusted to NGN ${Number(adjustedPrice).toLocaleString()}/MT`,
      reject: "Price proposal rejected",
    }

    toast({
      title: reviewAction === "reject" ? "Proposal Rejected" : "Proposal Approved",
      description: actionMessages[reviewAction],
    })

    setReviewDialogOpen(false)
    setSelectedProposal(null)
    setIsSubmitting(false)
  }

  const filteredProposals = proposals.filter(p => {
    if (filterCorridor !== "all" && p.corridor !== filterCorridor) return false
    if (filterCrop !== "all" && p.crop !== filterCrop) return false
    if (searchQuery && !p.agentName.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const getMarginBadge = (impact: number) => {
    if (impact > 0) {
      return (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
          <TrendingUp className="h-3 w-3 mr-1" />
          +{impact.toFixed(1)}%
        </Badge>
      )
    } else if (impact < -5) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <TrendingDown className="h-3 w-3 mr-1" />
          {impact.toFixed(1)}%
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          <TrendingDown className="h-3 w-3 mr-1" />
          {impact.toFixed(1)}%
        </Badge>
      )
    }
  }

  return (
    <DashboardLayout allowedRoles={["ops_admin", "super_admin"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Price Review Queue</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Review and approve agent price proposals for assisted supply
            </p>
          </div>
          <Button
            variant="outline"
            className="gap-2 bg-transparent"
            onClick={() => setHistoryDialogOpen(true)}
          >
            <History className="h-4 w-4" />
            Review History
          </Button>
        </div>

        {/* Governance Banner */}
        <Alert className="bg-slate-900 border-slate-800">
          <Target className="h-4 w-4 text-white" />
          <AlertDescription className="text-slate-300">
            <span className="font-medium text-white">Price Governance:</span> Agents surface market reality. Ops enforces economic discipline. Only approved prices flow into margin calculations.
          </AlertDescription>
        </Alert>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card className="border-amber-200 bg-amber-50/50">
            <CardContent className="pt-4">
              <div className="text-2xl font-semibold text-amber-700">{pendingCount}</div>
              <p className="text-sm text-amber-600">Pending Review</p>
            </CardContent>
          </Card>
          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="pt-4">
              <div className="text-2xl font-semibold text-red-700">{negativeMarginCount}</div>
              <p className="text-sm text-red-600">Negative Margin Impact</p>
            </CardContent>
          </Card>
          <Card className="border-emerald-200 bg-emerald-50/50">
            <CardContent className="pt-4">
              <div className="text-2xl font-semibold text-emerald-700">
                {reviewedProposals.filter(p => p.status === "approved").length}
              </div>
              <p className="text-sm text-emerald-600">Approved (This Week)</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="pt-4">
              <div className="text-2xl font-semibold text-slate-700">
                {reviewedProposals.filter(p => p.status === "rejected").length}
              </div>
              <p className="text-sm text-slate-600">Rejected (This Week)</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by agent name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterCorridor} onValueChange={setFilterCorridor}>
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Corridor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Corridors</SelectItem>
                    <SelectItem value="Kaduna North">Kaduna North</SelectItem>
                    <SelectItem value="Kaduna South">Kaduna South</SelectItem>
                    <SelectItem value="Kano Central">Kano Central</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterCrop} onValueChange={setFilterCrop}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Crop" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Crops</SelectItem>
                    <SelectItem value="Maize">Maize</SelectItem>
                    <SelectItem value="Soybean">Soybean</SelectItem>
                    <SelectItem value="Rice">Rice</SelectItem>
                    <SelectItem value="Sorghum">Sorghum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Proposals Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pending Price Proposals</CardTitle>
            <CardDescription>
              Review agent-submitted prices for assisted supply declarations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredProposals.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-1">All caught up!</h3>
                <p className="text-sm text-muted-foreground">
                  No pending price proposals to review
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agent</TableHead>
                      <TableHead>Corridor</TableHead>
                      <TableHead>Crop</TableHead>
                      <TableHead>Volume</TableHead>
                      <TableHead className="text-right">Proposed Price</TableHead>
                      <TableHead className="text-right">Buyer Target</TableHead>
                      <TableHead className="text-center">Margin Impact</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProposals.map((proposal) => (
                      <TableRow key={proposal.id} className={proposal.corridorMarginImpact < -5 ? "bg-red-50/30" : ""}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-sm">{proposal.agentName}</p>
                              <p className="text-xs text-muted-foreground">{proposal.agentId}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            {proposal.corridor}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Wheat className="h-3 w-3 text-muted-foreground" />
                            {proposal.crop}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{proposal.volumeRange}</TableCell>
                        <TableCell className="text-right">
                          <span className="font-medium">NGN {proposal.proposedPricePerTon.toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground">/MT</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-muted-foreground">NGN {proposal.buyerTargetPrice.toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground">/MT</span>
                        </TableCell>
                        <TableCell className="text-center">
                          {getMarginBadge(proposal.corridorMarginImpact)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(proposal.submittedAt).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                            })}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenReview(proposal)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Review Dialog */}
        <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Review Price Proposal</DialogTitle>
              <DialogDescription>
                Approve, adjust, or reject this agent's proposed price
              </DialogDescription>
            </DialogHeader>

            {selectedProposal && (
              <div className="space-y-4">
                {/* Proposal Details */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Agent</p>
                    <p className="font-medium">{selectedProposal.agentName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Corridor</p>
                    <p className="font-medium">{selectedProposal.corridor}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Crop</p>
                    <p className="font-medium">{selectedProposal.crop}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Volume Range</p>
                    <p className="font-medium">{selectedProposal.volumeRange}</p>
                  </div>
                </div>

                {/* Price Comparison */}
                <div className="grid grid-cols-3 gap-4">
                  <Card className="border-blue-200 bg-blue-50/50">
                    <CardContent className="pt-4 text-center">
                      <p className="text-xs text-blue-600 mb-1">Agent Proposed</p>
                      <p className="text-lg font-bold text-blue-700">
                        NGN {selectedProposal.proposedPricePerTon.toLocaleString()}
                      </p>
                      <p className="text-xs text-blue-600">/MT</p>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200">
                    <CardContent className="pt-4 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Buyer Target</p>
                      <p className="text-lg font-bold text-slate-700">
                        NGN {selectedProposal.buyerTargetPrice.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">/MT</p>
                    </CardContent>
                  </Card>
                  <Card className={`border-${selectedProposal.corridorMarginImpact < 0 ? "red" : "emerald"}-200 bg-${selectedProposal.corridorMarginImpact < 0 ? "red" : "emerald"}-50/50`}>
                    <CardContent className="pt-4 text-center">
                      <p className={`text-xs ${selectedProposal.corridorMarginImpact < 0 ? "text-red-600" : "text-emerald-600"} mb-1`}>
                        Margin Impact
                      </p>
                      <p className={`text-lg font-bold ${selectedProposal.corridorMarginImpact < 0 ? "text-red-700" : "text-emerald-700"}`}>
                        {selectedProposal.corridorMarginImpact > 0 ? "+" : ""}{selectedProposal.corridorMarginImpact.toFixed(1)}%
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Agent Notes */}
                {selectedProposal.priceNotes && (
                  <div className="p-3 bg-slate-100 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Agent's Market Context</p>
                    <p className="text-sm italic">"{selectedProposal.priceNotes}"</p>
                  </div>
                )}

                {/* Review Action */}
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label>Action</Label>
                    <Tabs value={reviewAction} onValueChange={(v) => setReviewAction(v as typeof reviewAction)}>
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="approve" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Approve
                        </TabsTrigger>
                        <TabsTrigger value="adjust" className="gap-1">
                          <Banknote className="h-3 w-3" />
                          Adjust
                        </TabsTrigger>
                        <TabsTrigger value="reject" className="gap-1">
                          <XCircle className="h-3 w-3" />
                          Reject
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  {reviewAction === "adjust" && (
                    <div className="space-y-2">
                      <Label htmlFor="adjustedPrice">Adjusted Price (NGN/MT) *</Label>
                      <Input
                        id="adjustedPrice"
                        type="number"
                        value={adjustedPrice}
                        onChange={(e) => setAdjustedPrice(e.target.value)}
                        placeholder="Enter adjusted price"
                      />
                    </div>
                  )}

                  {(reviewAction === "adjust" || reviewAction === "reject") && (
                    <div className="space-y-2">
                      <Label htmlFor="reason">
                        {reviewAction === "adjust" ? "Reason for Adjustment *" : "Reason for Rejection *"}
                      </Label>
                      <Textarea
                        id="reason"
                        value={reviewReason}
                        onChange={(e) => setReviewReason(e.target.value)}
                        placeholder={reviewAction === "adjust" 
                          ? "Explain why the price was adjusted..."
                          : "Explain why the proposal was rejected..."
                        }
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmitReview}
                disabled={isSubmitting || (reviewAction !== "approve" && !reviewReason) || (reviewAction === "adjust" && !adjustedPrice)}
                className={reviewAction === "reject" ? "bg-red-600 hover:bg-red-700" : "bg-emerald-700 hover:bg-emerald-800"}
              >
                {isSubmitting ? "Processing..." : reviewAction === "approve" ? "Approve Price" : reviewAction === "adjust" ? "Approve with Adjustment" : "Reject Proposal"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* History Dialog */}
        <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Price Review History</DialogTitle>
              <DialogDescription>
                Audit trail of all price proposal reviews
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {reviewedProposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className={`p-4 rounded-lg border ${
                    proposal.status === "approved"
                      ? "bg-emerald-50/50 border-emerald-200"
                      : "bg-red-50/50 border-red-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={
                            proposal.status === "approved"
                              ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                              : "bg-red-100 text-red-700 border-red-300"
                          }
                        >
                          {proposal.status === "approved" ? (
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                          ) : (
                            <XCircle className="h-3 w-3 mr-1" />
                          )}
                          {proposal.status === "approved" ? "Approved" : "Rejected"}
                        </Badge>
                        <span className="text-sm font-medium">{proposal.agentName}</span>
                        <span className="text-xs text-muted-foreground">• {proposal.corridor}</span>
                      </div>
                      <p className="text-sm">
                        <span className="font-medium">{proposal.crop}</span> • {proposal.volumeRange}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span>
                          Proposed: <span className="font-medium">NGN {proposal.proposedPricePerTon.toLocaleString()}/MT</span>
                        </span>
                        {proposal.status === "approved" && proposal.approvedPricePerTon && (
                          <>
                            <span className="text-muted-foreground">→</span>
                            <span className="text-emerald-700 font-medium">
                              Approved: NGN {proposal.approvedPricePerTon.toLocaleString()}/MT
                            </span>
                          </>
                        )}
                      </div>
                      {(proposal.adjustmentReason || proposal.rejectionReason) && (
                        <p className="text-sm text-muted-foreground italic">
                          "{proposal.adjustmentReason || proposal.rejectionReason}"
                        </p>
                      )}
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <p>Reviewed by {proposal.reviewedBy}</p>
                      <p>
                        {new Date(proposal.reviewedAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
