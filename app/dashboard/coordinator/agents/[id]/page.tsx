"use client"

import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Phone, Mail, MapPin, Calendar, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export default function AgentDetailPage() {
  const params = useParams()
  const agentId = params.id as string
  const { toast } = useToast()
  const [agent, setAgent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const response = await fetch(`/api/agents/${agentId}`)
        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || "Failed to load agent")
        }

        setAgent(result.data)
      } catch (err) {
        console.error("[v0] Failed to fetch agent:", err)
        toast({
          title: "Error",
          description: "Failed to load agent details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAgent()
  }, [agentId, toast])

  const handleCall = () => {
    if (agent?.phone) {
      window.location.href = `tel:${agent.phone}`
      toast({
        title: "Initiating Call",
        description: `Calling ${agent.name} at ${agent.phone}`,
      })
    }
  }

  const handleEmail = () => {
    if (agent?.email) {
      window.location.href = `mailto:${agent.email}`
      toast({
        title: "Opening Email",
        description: `Sending email to ${agent.email}`,
      })
    }
  }

  if (loading) {
    return (
      <DashboardLayout allowedRoles={["state_coordinator"]}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading agent details...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!agent) {
    return (
      <DashboardLayout allowedRoles={["state_coordinator"]}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-3">
            <p className="text-destructive">Agent not found</p>
            <Button asChild>
              <Link href="/dashboard/coordinator/agents">Back to Agents</Link>
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const clusterNames = agent.clusters || agent.assignedClusterIds || []
  const displayLocation =
    Array.isArray(clusterNames) && clusterNames.length > 0 ? clusterNames.join(", ") : "No clusters assigned"
  const farmersCount = agent.farmersAssigned || agent.activeFarmerCount || 0
  const activeCount = agent.activeFarmers || agent.activeFarmerCount || 0
  const completionRate = agent.completionRate || 0
  const qualityScore = agent.qualityScore || 0
  const overdueItems = agent.overdueItems || agent.pendingTasks || 0

  return (
    <DashboardLayout allowedRoles={["state_coordinator"]}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/coordinator/agents">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-bold">{agent.name}</h1>
              <Badge variant={agent.status === "active" ? "default" : "destructive"}>
                {agent.status === "active" ? "Active" : "Needs Attention"}
              </Badge>
              {overdueItems > 0 && (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {overdueItems} overdue
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">Field Agent Performance and Activity</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCall}>
              <Phone className="h-4 w-4 mr-2" />
              Call Agent
            </Button>
            <Button variant="outline" onClick={handleEmail}>
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Farmers Assigned</CardDescription>
              <CardTitle className="text-3xl">{farmersCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">{activeCount} active</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Completion Rate</CardDescription>
              <CardTitle className="text-3xl">{completionRate}%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">This month</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Quality Score</CardDescription>
              <CardTitle className="text-3xl">{qualityScore}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">Out of 100</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Coverage Area</CardDescription>
              <CardTitle className="text-3xl">{Array.isArray(clusterNames) ? clusterNames.length : 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">Clusters</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="farmers">Farmers</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{agent.phone}</span>
                </div>
                {agent.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{agent.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{displayLocation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined {new Date(agent.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Last active: {agent.lastActive || "Recently"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">Activity timeline coming soon...</div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="farmers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Assigned Farmers</CardTitle>
                <CardDescription>{farmersCount} farmers in total</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">Farmer list coming soon...</div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Activity Log</CardTitle>
                <CardDescription>Recent field activities and submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">Activity log coming soon...</div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Detailed performance analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Completion Rate</span>
                      <span className="text-sm text-muted-foreground">{completionRate}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${completionRate}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Quality Score</span>
                      <span className="text-sm text-muted-foreground">{qualityScore}/100</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${qualityScore}%` }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
