"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Database,
  User,
  MapPin,
  Calendar,
  ArrowLeft,
  ChevronDown,
} from "lucide-react"
import Link from "next/link"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useToast } from "@/hooks/use-toast"

// Mock data - would come from API/database
const mockIssues: Record<string, any> = {
  "DQ-001": {
    id: "DQ-001",
    type: "missing",
    entityType: "service",
    entityId: "SVC-1234",
    description: "Service marked complete but no completion date recorded",
    severity: "high",
    detected: "2 hours ago",
    status: "active",
    detectedAt: "2024-01-08T05:00:00Z",
    details: {
      service: {
        type: "Plowing",
        farmer: "Akpan Daniel",
        agent: "Chioma Okafor",
        location: "Enugu, Nsukka",
        requestedDate: "2024-01-05",
        completedDate: null,
        markedComplete: "2024-01-08",
      },
      impact: "Payment processing delayed, farmer satisfaction at risk",
      suggestedFix: "Contact agent to confirm actual completion date",
    },
  },
  "DQ-002": {
    id: "DQ-002",
    type: "suspicious",
    entityType: "yield",
    entityId: "YIELD-5678",
    description: "Yield variance of 65% seems abnormally high",
    severity: "medium",
    detected: "1 day ago",
    status: "active",
    detectedAt: "2024-01-07T10:00:00Z",
    details: {
      yield: {
        farmer: "Ibrahim Musa",
        agent: "Grace Adeyemi",
        location: "Kaduna, Zaria",
        crop: "Maize",
        expectedYield: "3,000 kg",
        actualYield: "3,200 kg",
        variance: "65%",
      },
      impact: "Contract settlement accuracy affected",
      suggestedFix: "Verify yield measurement methodology and equipment calibration",
    },
  },
}

export default function DataQualityReviewPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [id, setId] = useState<string>("")
  const [issue, setIssue] = useState<any>(null)

  useEffect(() => {
    setId(params.id)
    const loadedIssue = mockIssues[params.id]
    if (loadedIssue) {
      setIssue(loadedIssue)
    }
  }, [params])

  if (!issue) {
    return <div className="flex-1 p-8">Loading...</div>
  }

  const handleAssignToTeam = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/data-quality/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "assign" }),
      })

      if (!response.ok) throw new Error("Failed to assign issue")

      toast({
        title: "Issue Assigned",
        description: "This issue has been assigned to the team.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign issue. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkFalsePositive = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/data-quality/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "false_positive" }),
      })

      if (!response.ok) throw new Error("Failed to mark as false positive")

      toast({
        title: "Marked as False Positive",
        description: "This issue has been marked as a false positive and will be closed.",
      })

      // Navigate back after a short delay
      setTimeout(() => router.push("/dashboard/ops"), 1500)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark issue. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResolveIssue = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/data-quality/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "resolve",
          resolution: "Issue resolved by operations team",
        }),
      })

      if (!response.ok) throw new Error("Failed to resolve issue")

      const data = await response.json()

      toast({
        title: "Issue Resolved",
        description: data.data.message,
      })

      // Navigate back after a short delay
      setTimeout(() => router.push("/dashboard/ops"), 1500)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resolve issue. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-700 border-red-200"
      case "high":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "medium":
        return "bg-blue-100 text-blue-700 border-blue-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/ops">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">Data Quality Issue</h1>
            <Badge variant="outline" className={getSeverityColor(issue.severity)}>
              {issue.severity}
            </Badge>
            <Badge variant="outline">{issue.entityType}</Badge>
          </div>
          <p className="text-muted-foreground">
            Issue ID: {issue.id} • Entity: {issue.entityId}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleAssignToTeam} disabled={isLoading}>
            Assign to Team
          </Button>
          <Button variant="outline" onClick={handleMarkFalsePositive} disabled={isLoading}>
            Mark as False Positive
          </Button>
          <Button onClick={handleResolveIssue} disabled={isLoading}>
            Resolve Issue
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Issue Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Description</p>
                  <p className="text-sm text-muted-foreground">{issue.description}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Detected</p>
                  <p className="text-sm text-muted-foreground">{issue.detected}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Impact</p>
                  <p className="text-sm text-muted-foreground">{issue.details.impact}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Suggested Fix</p>
                  <p className="text-sm text-emerald-600">{issue.details.suggestedFix}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Related Entity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {issue.entityType === "service" && (
                  <>
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">Service Type:</span> {issue.details.service.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">Farmer:</span> {issue.details.service.farmer}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">Agent:</span> {issue.details.service.agent}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">Location:</span> {issue.details.service.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">Requested:</span> {issue.details.service.requestedDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <span className="text-sm">
                        <span className="font-medium">Marked Complete:</span> {issue.details.service.markedComplete}
                      </span>
                    </div>
                  </>
                )}
                {issue.entityType === "yield" && (
                  <>
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">Crop:</span> {issue.details.yield.crop}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">Farmer:</span> {issue.details.yield.farmer}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">Agent:</span> {issue.details.yield.agent}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">Location:</span> {issue.details.yield.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm">
                        <span className="font-medium">Expected:</span> {issue.details.yield.expectedYield}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <span className="text-sm">
                        <span className="font-medium">Actual:</span> {issue.details.yield.actualYield} (
                        {issue.details.yield.variance} variance)
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Entity Information</CardTitle>
                <CardDescription>Detailed information about the affected entity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {issue.entityType === "service" && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-sm text-muted-foreground">Entity ID</span>
                      <span className="text-sm font-medium">{issue.entityId}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-sm text-muted-foreground">Service Type</span>
                      <span className="text-sm font-medium">{issue.details.service.type}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-sm text-muted-foreground">Farmer</span>
                      <span className="text-sm font-medium">{issue.details.service.farmer}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-sm text-muted-foreground">Agent</span>
                      <span className="text-sm font-medium">{issue.details.service.agent}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-sm text-muted-foreground">Location</span>
                      <span className="text-sm font-medium">{issue.details.service.location}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-sm text-muted-foreground">Requested Date</span>
                      <span className="text-sm font-medium">{issue.details.service.requestedDate}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-sm text-muted-foreground">Completed Date</span>
                      <span className="text-sm font-medium text-red-600">
                        {issue.details.service.completedDate || "Missing"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-sm text-muted-foreground">Marked Complete</span>
                      <span className="text-sm font-medium">{issue.details.service.markedComplete}</span>
                    </div>
                  </>
                )}
                {issue.entityType === "yield" && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-sm text-muted-foreground">Entity ID</span>
                      <span className="text-sm font-medium">{issue.entityId}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-sm text-muted-foreground">Crop</span>
                      <span className="text-sm font-medium">{issue.details.yield.crop}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-sm text-muted-foreground">Farmer</span>
                      <span className="text-sm font-medium">{issue.details.yield.farmer}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-sm text-muted-foreground">Agent</span>
                      <span className="text-sm font-medium">{issue.details.yield.agent}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-sm text-muted-foreground">Location</span>
                      <span className="text-sm font-medium">{issue.details.yield.location}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-sm text-muted-foreground">Expected Yield</span>
                      <span className="text-sm font-medium">{issue.details.yield.expectedYield}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-sm text-muted-foreground">Actual Yield</span>
                      <span className="text-sm font-medium text-amber-600">{issue.details.yield.actualYield}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-sm text-muted-foreground">Variance</span>
                      <span className="text-sm font-medium text-red-600">{issue.details.yield.variance}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Collapsible>
                  <CollapsibleTrigger className="flex w-full items-center justify-between">
                    <div>
                      <CardTitle>Raw Technical Data</CardTitle>
                      <CardDescription>Complete JSON representation for debugging</CardDescription>
                    </div>
                    <ChevronDown className="h-4 w-4 transition-transform" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-4">
                      <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-96">
                        {JSON.stringify(issue, null, 2)}
                      </pre>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Issue History</CardTitle>
              <CardDescription>Timeline of events and actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="w-px h-full bg-border mt-2" />
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-medium">Issue Detected</p>
                    <p className="text-sm text-muted-foreground">{issue.detected}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Automated data quality check identified the issue
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Under Review</p>
                    <p className="text-sm text-muted-foreground">Now</p>
                    <p className="text-xs text-muted-foreground mt-1">Issue is being reviewed by operations team</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resolution Actions</CardTitle>
              <CardDescription>Choose an action to resolve this issue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark as Resolved - Issue Fixed
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <User className="h-4 w-4 mr-2" />
                Contact Agent for Clarification
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Database className="h-4 w-4 mr-2" />
                Update Entity Data
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Escalate to Senior Team
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
