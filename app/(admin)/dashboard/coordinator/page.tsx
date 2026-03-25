"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Target, TrendingUp, AlertCircle, Phone, MapPin, Award, FileCheck, Headset } from "lucide-react"
import Link from "next/link"
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
import { toast } from "sonner"

export default function StateCoordinatorDashboard() {
  const [selectedReview, setSelectedReview] = useState<(typeof pendingReviews)[0] | null>(null)
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [resolutionNotes, setResolutionNotes] = useState("")

  const pendingReviews = [
    {
      id: "1",
      type: "Farmer Verification",
      agent: "Chioma Okafor",
      farmer: "Akpan Daniel",
      cluster: "Gboko Central",
      issue: "Land plot boundary dispute with neighbor",
      priority: "high",
      submittedAt: "3 hours ago",
    },
    {
      id: "2",
      type: "Service Quality",
      agent: "Grace Adeyemi",
      farmer: "Emeka Onyeka",
      cluster: "Gboko South",
      issue: "Farmer complaint about delayed planting service",
      priority: "medium",
      submittedAt: "1 day ago",
    },
    {
      id: "3",
      type: "Offtaker Escalation",
      agent: "System",
      farmer: "GrainCorp Nigeria",
      cluster: "State-wide",
      issue: "Delivery quality concern - moisture content above contract specification",
      priority: "high",
      submittedAt: "6 hours ago",
    },
  ]

  const pendingServiceRequests = [
    {
      id: "SR-001",
      agent: "Chioma Okafor",
      farmer: "Akpan Daniel",
      service: "Fertilizer Application",
      estimatedCost: 75000,
      urgency: "high",
      submittedAt: "4 hours ago",
      reason: "Urgent need before rains, farmer willing to pay partial upfront",
    },
    {
      id: "SR-002",
      agent: "Ibrahim Musa",
      farmer: "Fatima Bello",
      service: "Plowing",
      estimatedCost: 60000,
      urgency: "normal",
      submittedAt: "1 day ago",
      reason: "Standard land preparation for new season",
    },
  ]

  const stats = [
    { label: "Field Agents", value: "12", change: "+2 this month", icon: Users, color: "text-blue-600" },
    { label: "Total Farmers", value: "324", change: "+45 this week", icon: Target, color: "text-green-600" },
    {
      label: "Team Completion Rate",
      value: "87%",
      change: "+3% vs last month",
      icon: TrendingUp,
      color: "text-emerald-600",
    },
    {
      label: "Pending Reviews",
      value: String(pendingReviews.length + pendingServiceRequests.length),
      change: "3 urgent",
      icon: AlertCircle,
      color: "text-amber-600",
    },
  ]

  const agents = [
    {
      id: "1",
      name: "Chioma Okafor",
      clusters: ["Gboko Central", "Makurdi North"],
      farmersAssigned: 28,
      completionRate: 92,
      qualityScore: 88,
      status: "active",
      lastActive: "2 hours ago",
      phone: "0803-XXX-1234",
    },
    {
      id: "2",
      name: "Ibrahim Musa",
      clusters: ["Otukpo East"],
      farmersAssigned: 25,
      completionRate: 85,
      qualityScore: 91,
      status: "active",
      lastActive: "4 hours ago",
      phone: "0805-XXX-5678",
    },
    {
      id: "3",
      name: "Grace Adeyemi",
      clusters: ["Gboko South", "Buruku"],
      farmersAssigned: 31,
      completionRate: 78,
      qualityScore: 76,
      status: "attention",
      lastActive: "1 day ago",
      phone: "0807-XXX-9012",
    },
  ]

  const handleReview = (review: (typeof pendingReviews)[0]) => {
    setSelectedReview(review)
    setIsReviewOpen(true)
    setResolutionNotes("")
  }

  const handleApproveServiceRequest = (requestId: string) => {
    toast.success("Service request approved successfully")
    // In production: update database, notify agent and farmer
  }

  const handleRejectServiceRequest = (requestId: string) => {
    toast.error("Service request rejected")
    // In production: update database, notify agent with reason
  }

  const handleResolveIssue = () => {
    if (!resolutionNotes.trim()) {
      toast.error("Please enter resolution notes")
      return
    }
    toast.success("Issue resolved successfully")
    setIsReviewOpen(false)
    setSelectedReview(null)
    setResolutionNotes("")
  }

  const handleEscalateIssue = () => {
    toast.success("Issue escalated to operations team")
    setIsReviewOpen(false)
    setSelectedReview(null)
    setResolutionNotes("")
  }

  return (
    <DashboardLayout allowedRoles={["state_coordinator"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">State Coordinator Dashboard</h1>
          <p className="text-muted-foreground">Benue State - Managing 12 agents across 4 corridors</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${stat.color} bg-opacity-10`}
                  >
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground truncate">{stat.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle>Field Agent Performance</CardTitle>
              <CardDescription>Monitor your team's activity and quality scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between p-4 border border-border/50 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium truncate">{agent.name}</p>
                        {agent.status === "attention" && (
                          <Badge variant="destructive" className="text-xs shrink-0">
                            Needs Attention
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">{agent.clusters.join(", ")}</span>
                        </span>
                        <span className="flex items-center gap-1 shrink-0">
                          <Users className="h-3 w-3" />
                          {agent.farmersAssigned} farmers
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <span>
                          Completion: <span className="font-medium">{agent.completionRate}%</span>
                        </span>
                        <span>
                          Quality: <span className="font-medium">{agent.qualityScore}/100</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4 shrink-0">
                      <Button variant="outline" size="sm" asChild>
                        <a href={`tel:${agent.phone}`}>
                          <Phone className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/coordinator/agents/${agent.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-border/50">
              <CardHeader className="pb-4">
                <CardTitle>Pending Escalations</CardTitle>
                <CardDescription>Issues escalated requiring your action</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingReviews.map((review) => (
                    <div key={review.id} className="p-4 border border-border/50 rounded-lg space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant={review.priority === "high" ? "destructive" : "secondary"}
                              className="text-xs shrink-0"
                            >
                              {review.priority}
                            </Badge>
                            <span className="text-sm font-medium truncate">{review.type}</span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {review.agent !== "System" ? `Agent: ${review.agent} • ` : ""}Farmer: {review.farmer}
                          </p>
                          <p className="text-sm mt-1">{review.issue}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-muted-foreground">{review.submittedAt}</span>
                        <Button size="sm" onClick={() => handleReview(review)}>
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                  {pendingReviews.length === 0 && (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                      <Award className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      No pending escalations. Your team is running smoothly!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="pb-4">
                <CardTitle>Service Request Approvals</CardTitle>
                <CardDescription>Agent requests requiring coordinator approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingServiceRequests.map((request) => (
                    <div key={request.id} className="p-4 border border-border/50 rounded-lg space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Headset className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium">{request.service}</span>
                            <Badge variant="outline" className="text-xs">
                              ₦{request.estimatedCost.toLocaleString()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Agent: {request.agent} • Farmer: {request.farmer}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">{request.reason}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-muted-foreground">{request.submittedAt}</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleRejectServiceRequest(request.id)}>
                            Reject
                          </Button>
                          <Button size="sm" onClick={() => handleApproveServiceRequest(request.id)}>
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {pendingServiceRequests.length === 0 && (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                      <FileCheck className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      No pending service requests
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Issue</DialogTitle>
              <DialogDescription>Review and take action on this escalated issue</DialogDescription>
            </DialogHeader>
            {selectedReview && (
              <div className="space-y-6 py-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Issue Type</Label>
                    <p className="text-lg font-semibold mt-1">{selectedReview.type}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Field Agent</Label>
                      <p className="font-medium mt-1">{selectedReview.agent}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Farmer</Label>
                      <p className="font-medium mt-1">{selectedReview.farmer}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Cluster</Label>
                    <p className="font-medium mt-1">{selectedReview.cluster}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Issue Description</Label>
                    <p className="mt-1 p-3 bg-muted rounded-lg">{selectedReview.issue}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Priority</Label>
                      <div className="mt-1">
                        <Badge variant={selectedReview.priority === "high" ? "destructive" : "secondary"}>
                          {selectedReview.priority}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Submitted</Label>
                      <p className="font-medium mt-1">{selectedReview.submittedAt}</p>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="resolution">Resolution Notes</Label>
                    <Textarea
                      id="resolution"
                      placeholder="Enter your resolution notes and actions taken..."
                      className="mt-1"
                      rows={4}
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={() => setIsReviewOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="outline" onClick={handleEscalateIssue}>
                    Escalate
                  </Button>
                  <Button onClick={handleResolveIssue}>Resolve Issue</Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
