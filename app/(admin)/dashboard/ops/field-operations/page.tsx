"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Award, Users, Phone, Mail, ChevronRight, AlertCircle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"

interface RawAgent {
  id: string
  first_name?: string
  last_name?: string
  firstname?: string
  phone?: string
  email?: string
  state?: string
  assigned_corridors?: string[]
  corridor?: string
  farmer_count?: number
  status?: string
  updated_at?: string
  lga?: string
  community?: string
}

interface AgentRow {
  id: string
  name: string
  phone: string
  email: string
  state: string
  corridor: string
  farmers: number
  performance: number
  status: string
  coordinator: string
}

interface PendingAgent {
  id: string
  name: string
  phone: string
  state: string
  preferredCorridor: string
  experience: string
  appliedDate: string
  status: "pending_review" | "pending_interview"
}

function toAgentRow(a: RawAgent): AgentRow {
  return {
    id: a.id,
    name: [a.first_name, a.last_name].filter(Boolean).join(" ") || a.firstname || "(Unknown)",
    phone: a.phone || "",
    email: a.email || "",
    state: a.state || "",
    corridor: Array.isArray(a.assigned_corridors) ? a.assigned_corridors[0] : (a.corridor || ""),
    farmers: a.farmer_count || 0,
    performance: 80,
    status: a.status || "active",
    coordinator: "",
  }
}

export default function FieldOperationsPage() {
  const [loadingApplications, setLoadingApplications] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [fieldAgents, setFieldAgents] = useState<AgentRow[]>([])
  const [pendingAgents, setPendingAgents] = useState<PendingAgent[]>([])
  const { toast } = useToast()

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [activeRes, pendingRes] = await Promise.all([
        api.agents.list({ status: "active" } as any),
        api.agents.list({ status: "pending" } as any),
      ])

      if (activeRes.success) {
        const agentList: RawAgent[] = Array.isArray(activeRes.data) ? activeRes.data : []
        setFieldAgents(agentList.map(toAgentRow))
      }

      if (pendingRes.success) {
        const pendingList: RawAgent[] = Array.isArray(pendingRes.data) ? pendingRes.data : []
        setPendingAgents(
          pendingList.map((a) => ({
            id: a.id,
            name: [a.first_name, a.last_name].filter(Boolean).join(" ") || a.firstname || "(Unknown)",
            phone: a.phone || "",
            state: a.state || "",
            preferredCorridor: Array.isArray(a.assigned_corridors) ? a.assigned_corridors[0] : (a.corridor || ""),
            experience: "—",
            appliedDate: a.updated_at ? new Date(a.updated_at).toLocaleDateString() : "—",
            status: "pending_review",
          })),
        )
      }
    } catch (err) {
      console.error("[FieldOperations] Fetch error:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleReviewApplication = async (applicantId: string, applicantName: string) => {
    setLoadingApplications((prev) => ({ ...prev, [applicantId]: true }))
    try {
      const response = await fetch(`/api/agent-applications/${applicantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Application Approved",
          description: `${applicantName}'s agent application has been approved.`,
        })
        fetchData()
      } else {
        throw new Error(data.error?.message || "Failed to approve application")
      }
    } catch (error) {
      console.error("[v0] Approve application error:", error)
      toast({
        title: "Error",
        description: "Failed to approve application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingApplications((prev) => ({ ...prev, [applicantId]: false }))
    }
  }

  const handleContact = async (applicantId: string, applicantName: string) => {
    setLoadingApplications((prev) => ({ ...prev, [`${applicantId}-contact`]: true }))
    try {
      const response = await fetch(`/api/agent-applications/${applicantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "contact" }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Contact Initiated",
          description: `Initiating contact with ${applicantName}.`,
        })
      } else {
        throw new Error(data.error?.message || "Failed to initiate contact")
      }
    } catch (error) {
      console.error("[v0] Contact error:", error)
      toast({
        title: "Error",
        description: "Failed to initiate contact. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingApplications((prev) => ({ ...prev, [`${applicantId}-contact`]: false }))
    }
  }

  const activeAgents = fieldAgents.filter((a) => a.status === "active")

  // Group active agents by state for a hierarchy-like view
  const byState = activeAgents.reduce<Record<string, AgentRow[]>>((acc, agent) => {
    const state = agent.state || "Unknown"
    if (!acc[state]) acc[state] = []
    acc[state].push(agent)
    return acc
  }, {})

  return (
    <DashboardLayout role="ops_admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Field Operations Management</h1>
          <p className="text-muted-foreground">
            Manage field agents across all locations
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">States Covered</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{Object.keys(byState).length}</div>
                  <p className="text-xs text-muted-foreground">Active states</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Field Agents</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{fieldAgents.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {activeAgents.length} active agents
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Farmers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {activeAgents.reduce((sum, a) => sum + (a.farmers || 0), 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">Across all agents</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
              <AlertCircle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{pendingAgents.length}</div>
                  <p className="text-xs text-muted-foreground">Awaiting review</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="hierarchy" className="space-y-4">
          <TabsList>
            <TabsTrigger value="hierarchy">Hierarchy View</TabsTrigger>
            <TabsTrigger value="agents">Field Agents</TabsTrigger>
            <TabsTrigger value="pending">
              Pending Applications
              {pendingAgents.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {pendingAgents.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Hierarchy View – grouped by state */}
          <TabsContent value="hierarchy" className="space-y-4">
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-48 w-full" />)
            ) : Object.keys(byState).length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No active agents found</p>
                </CardContent>
              </Card>
            ) : (
              Object.entries(byState).map(([state, agents]) => (
                <Card key={state}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Award className="h-5 w-5 text-emerald-600" />
                          <CardTitle>{state} State</CardTitle>
                          <Badge variant="secondary">{agents.length} agents</Badge>
                        </div>
                        <CardDescription>
                          {agents.reduce((sum, a) => sum + a.farmers, 0)} farmers covered
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-600">
                          {agents.length > 0 ? Math.round(agents.reduce((s, a) => s + a.performance, 0) / agents.length) : 0}%
                        </div>
                        <p className="text-xs text-muted-foreground">Avg Performance</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {agents.map((agent) => (
                        <div key={agent.id} className="flex items-center justify-between text-sm py-2 border-b last:border-0">
                          <div className="flex items-center gap-2">
                            <ChevronRight className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium">{agent.name}</span>
                            {agent.corridor && (
                              <span className="text-muted-foreground">• {agent.corridor}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-muted-foreground">{agent.farmers} farmers</span>
                            <Badge variant="outline" className="h-5">
                              {agent.performance}%
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Field Agents Tab */}
          <TabsContent value="agents" className="space-y-4">
            {loading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
              </div>
            ) : fieldAgents.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No field agents found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {fieldAgents.map((agent) => (
                  <Card key={agent.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold">{agent.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {agent.corridor ? `${agent.corridor} Corridor` : agent.state}
                          </p>
                        </div>
                        <Badge variant="secondary">{agent.status}</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        {agent.state && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">State</span>
                            <span className="font-medium">{agent.state}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Farmers</span>
                          <span className="font-medium">{agent.farmers}</span>
                        </div>
                      </div>
                      <div className="space-y-2 pt-3 border-t mt-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Performance</span>
                          <span className="font-semibold text-emerald-600">{agent.performance}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 transition-all"
                            style={{ width: `${agent.performance}%` }}
                          />
                        </div>
                      </div>
                      {(agent.phone || agent.email) && (
                        <div className="flex items-center gap-2 mt-3">
                          {agent.phone && (
                            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                              <Phone className="h-3 w-3 mr-1" />
                              Call
                            </Button>
                          )}
                          {agent.email && (
                            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                              <Mail className="h-3 w-3 mr-1" />
                              Email
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Pending Applications Tab */}
          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Agent Applications</CardTitle>
                <CardDescription>Review and approve new field agent applications</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
                  </div>
                ) : pendingAgents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <CheckCircle className="h-12 w-12 text-emerald-500 mb-4" />
                    <p className="text-lg font-medium">No pending applications</p>
                    <p className="text-sm text-muted-foreground">All agent applications have been reviewed</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingAgents.map((applicant) => (
                      <Card key={applicant.id} className="border-amber-200 bg-amber-50/50">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="font-semibold">{applicant.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {applicant.state}
                                {applicant.preferredCorridor && ` • ${applicant.preferredCorridor}`}
                              </p>
                            </div>
                            <Badge variant="outline" className="border-amber-500 text-amber-700">
                              {applicant.status === "pending_review" ? "Pending Review" : "Pending Interview"}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                            <div>
                              <p className="text-muted-foreground">Experience</p>
                              <p className="font-medium">{applicant.experience}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Applied Date</p>
                              <p className="font-medium">{applicant.appliedDate}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => handleReviewApplication(applicant.id, applicant.name)}
                              disabled={loadingApplications[applicant.id]}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {loadingApplications[applicant.id] ? "Processing..." : "Review Application"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 bg-transparent"
                              onClick={() => handleContact(applicant.id, applicant.name)}
                              disabled={loadingApplications[`${applicant.id}-contact`]}
                            >
                              <Phone className="h-3 w-3 mr-1" />
                              {loadingApplications[`${applicant.id}-contact`] ? "Calling..." : "Contact"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
