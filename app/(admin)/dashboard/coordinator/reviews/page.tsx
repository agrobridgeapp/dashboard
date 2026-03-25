"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, XCircle, Search, Clock, User, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CoordinatorReviewsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [loadingReviews, setLoadingReviews] = useState<Record<string, boolean>>({})
  const { toast } = useToast()

  const pendingReviews = [
    {
      id: "REV001",
      type: "farmer_registration",
      agentName: "John Okafor",
      farmerName: "Chidi Amadi",
      location: "Enugu, Nsukka",
      submittedDate: "2024-01-18",
      details: "New farmer registration with 2.5 hectares maize farm",
    },
    {
      id: "REV002",
      type: "yield_capture",
      agentName: "Mary Eze",
      farmerName: "Emmanuel Obi",
      location: "Enugu, Udi",
      submittedDate: "2024-01-18",
      details: "Harvest yield: 3,200 kg maize (expected: 3,000 kg)",
    },
    {
      id: "REV003",
      type: "service_completion",
      agentName: "John Okafor",
      farmerName: "Grace Nwosu",
      location: "Enugu, Nsukka",
      submittedDate: "2024-01-17",
      details: "Fertilizer application service completed with photo evidence",
    },
    {
      id: "REV004",
      type: "farmer_registration",
      agentName: "Paul Eze",
      farmerName: "Chioma Okeke",
      location: "Enugu, Awgu",
      submittedDate: "2024-01-17",
      details: "New farmer registration with 1.8 hectares rice farm",
    },
  ]

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "farmer_registration":
        return "Farmer Registration"
      case "yield_capture":
        return "Yield Capture"
      case "service_completion":
        return "Service Completion"
      default:
        return type
    }
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "farmer_registration":
        return "bg-blue-100 text-blue-700"
      case "yield_capture":
        return "bg-green-100 text-green-700"
      case "service_completion":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const filteredReviews = pendingReviews.filter((review) => {
    const matchesSearch =
      review.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === "all" || review.type === filterType
    return matchesSearch && matchesFilter
  })

  const handleApprove = async (reviewId: string, farmerName: string) => {
    setLoadingReviews((prev) => ({ ...prev, [reviewId]: true }))
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Review Approved",
          description: `${farmerName}'s submission has been approved successfully.`,
        })
        // Refresh or update local state here
      } else {
        throw new Error(data.error?.message || "Failed to approve review")
      }
    } catch (error) {
      console.error("[v0] Approve review error:", error)
      toast({
        title: "Error",
        description: "Failed to approve review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingReviews((prev) => ({ ...prev, [reviewId]: false }))
    }
  }

  const handleReject = async (reviewId: string, farmerName: string) => {
    setLoadingReviews((prev) => ({ ...prev, [reviewId]: true }))
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", feedback: "Does not meet requirements" }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Review Rejected",
          description: `${farmerName}'s submission has been rejected.`,
          variant: "destructive",
        })
        // Refresh or update local state here
      } else {
        throw new Error(data.error?.message || "Failed to reject review")
      }
    } catch (error) {
      console.error("[v0] Reject review error:", error)
      toast({
        title: "Error",
        description: "Failed to reject review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingReviews((prev) => ({ ...prev, [reviewId]: false }))
    }
  }

  return (
    <DashboardLayout allowedRoles={["state_coordinator"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Pending Reviews</h1>
          <p className="text-muted-foreground">Review and approve submissions from field agents</p>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingReviews.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">New Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pendingReviews.filter((r) => r.type === "farmer_registration").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Review Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.3 hrs</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Review Queue</CardTitle>
            <CardDescription>Review and validate field agent submissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by farmer, agent, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="farmer_registration">Farmer Registration</SelectItem>
                  <SelectItem value="yield_capture">Yield Capture</SelectItem>
                  <SelectItem value="service_completion">Service Completion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reviews List */}
            <div className="space-y-3">
              {filteredReviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getTypeBadgeColor(review.type)}>{getTypeLabel(review.type)}</Badge>
                          <span className="text-sm text-muted-foreground">#{review.id}</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{review.farmerName}</span>
                            <span className="text-muted-foreground">submitted by {review.agentName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {review.location}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {review.submittedDate}
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">{review.details}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 bg-transparent"
                          onClick={() => handleReject(review.id, review.farmerName)}
                          disabled={loadingReviews[review.id]}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          {loadingReviews[review.id] ? "Rejecting..." : "Reject"}
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(review.id, review.farmerName)}
                          disabled={loadingReviews[review.id]}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {loadingReviews[review.id] ? "Approving..." : "Approve"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredReviews.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No pending reviews found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
