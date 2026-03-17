"use client"

import type React from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Phone, AlertCircle, Calendar, Search, UserPlus } from "lucide-react"
import { useState, useEffect } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api-client"

export default function CoordinatorAgentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [addAgentOpen, setAddAgentOpen] = useState(false)
  const { toast } = useToast()

  const [agents, setAgents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await api.agents.list()
        setAgents(response.data)
      } catch (err) {
        console.error("[v0] Failed to fetch agents:", err)
        setError("Failed to load agents. Please try again.")
        toast({
          title: "Error",
          description: "Failed to load agents data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAgents()
  }, [toast])

  const filteredAgents = agents.filter((agent) => agent.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleAddAgent = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget as HTMLFormElement)

    try {
      const agentData = {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        clusters: [formData.get("cluster")],
        status: "active",
        tier: "agent",
      }

      const response = await api.agents.create(agentData)

      setAgents([...agents, response.data])

      toast({
        title: "Agent Registered",
        description: "The new field agent has been registered and will receive onboarding instructions.",
      })
      setAddAgentOpen(false)
    } catch (err) {
      console.error("[v0] Failed to register agent:", err)
      toast({
        title: "Registration Failed",
        description: "Could not register agent. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCall = (phone: string, name: string) => {
    window.location.href = `tel:${phone}`
    toast({
      title: "Initiating Call",
      description: `Calling ${name} at ${phone}`,
    })
  }

  if (loading) {
    return (
      <DashboardLayout allowedRoles={["state_coordinator"]}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading agents...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout allowedRoles={["state_coordinator"]}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-3">
            <p className="text-destructive">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout allowedRoles={["state_coordinator"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Field Agents</h1>
          <p className="text-muted-foreground">Manage and monitor your team of {agents.length} field agents</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search agents by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setAddAgentOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Field Agent
          </Button>
        </div>

        <div className="grid gap-4">
          {filteredAgents.map((agent) => {
            // Safe extraction of cluster/location data with fallbacks
            const clusterNames = agent.clusters || agent.assignedClusterIds || []
            const displayLocation =
              Array.isArray(clusterNames) && clusterNames.length > 0 ? clusterNames.join(", ") : "No clusters assigned"

            const farmersCount = agent.farmersAssigned || agent.activeFarmerCount || 0
            const activeCount = agent.activeFarmers || agent.activeFarmerCount || 0
            const completionRate = agent.completionRate || 0
            const qualityScore = agent.qualityScore || 0
            const clusterCount = Array.isArray(clusterNames) ? clusterNames.length : 0
            const overdueItems = agent.overdueItems || agent.pendingTasks || 0
            const lastActive = agent.lastActive || "Recently"
            const joinedDate = agent.joinedDate || new Date(agent.createdAt || Date.now()).toLocaleDateString()

            return (
              <Card key={agent.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{agent.name}</CardTitle>
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
                      <CardDescription>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {agent.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {displayLocation}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Joined {joinedDate}
                          </span>
                        </div>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleCall(agent.phone, agent.name)}>
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button size="sm" asChild>
                        <Link href={`/dashboard/coordinator/agents/${agent.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <div className="text-2xl font-bold">{farmersCount}</div>
                      <div className="text-xs text-muted-foreground">Farmers Assigned</div>
                      <div className="text-xs text-green-600 mt-1">{activeCount} active</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{completionRate}%</div>
                      <div className="text-xs text-muted-foreground">Completion Rate</div>
                      <div className="text-xs text-muted-foreground mt-1">This month</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{qualityScore}</div>
                      <div className="text-xs text-muted-foreground">Quality Score</div>
                      <div className="text-xs text-muted-foreground mt-1">Out of 100</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{clusterCount}</div>
                      <div className="text-xs text-muted-foreground">Clusters</div>
                      <div className="text-xs text-muted-foreground mt-1">Coverage area</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Last Active</div>
                      <div className="text-sm mt-1">{lastActive}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <Dialog open={addAgentOpen} onOpenChange={setAddAgentOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Field Agent</DialogTitle>
            <DialogDescription>Register a new field agent for your state</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddAgent} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="First name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Last name" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+234..." required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="agent@email.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cluster">Assigned Cluster(s)</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select primary cluster" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gboko-central">Gboko Central</SelectItem>
                  <SelectItem value="makurdi-north">Makurdi North</SelectItem>
                  <SelectItem value="otukpo-east">Otukpo East</SelectItem>
                  <SelectItem value="gboko-south">Gboko South</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setAddAgentOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Agent</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
