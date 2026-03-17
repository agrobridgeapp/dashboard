"use client"

import { use } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Phone, Mail, Calendar, CheckCircle2, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CoordinatorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  // Mock coordinator data
  const coordinator = {
    id: id,
    name: "Adewale Ogunleye",
    state: "Kaduna",
    email: "adewale.ogunleye@agrobridge.ng",
    phone: "+234 803 456 7890",
    joinedDate: "2024-01-15",
    agents: 12,
    farmers: 324,
    corridors: 5,
    hectares: 1247.5,
    performance: 85,
    status: "excellent",
    activeServices: 45,
    completedServices: 189,
  }

  const corridors = [
    { id: "COR-001", name: "Zaria - Giwa Maize Corridor", farmers: 85, hectares: 312.5, status: "active" },
    { id: "COR-002", name: "Kaduna South Rice Corridor", farmers: 67, hectares: 289.8, status: "active" },
    { id: "COR-003", name: "Igabi Groundnut Corridor", farmers: 54, hectares: 198.3, status: "active" },
    { id: "COR-004", name: "Sabon Gari Sorghum Corridor", farmers: 73, hectares: 267.1, status: "active" },
    { id: "COR-005", name: "Kachia Mixed Crops Corridor", farmers: 45, hectares: 179.8, status: "planning" },
  ]

  const agents = [
    { id: "AGT-001", name: "Musa Ibrahim", tier: "Super Agent", farmers: 28, performance: 92 },
    { id: "AGT-002", name: "Fatima Abubakar", tier: "Master Agent", farmers: 34, performance: 88 },
    { id: "AGT-003", name: "Ibrahim Garba", tier: "Senior Agent", farmers: 22, performance: 85 },
    { id: "AGT-004", name: "Amina Hassan", tier: "Senior Agent", farmers: 25, performance: 82 },
    { id: "AGT-005", name: "Yusuf Bello", tier: "Agent", farmers: 18, performance: 78 },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "excellent":
        return <Badge className="bg-green-100 text-green-700">Excellent</Badge>
      case "good":
        return <Badge className="bg-blue-100 text-blue-700">Good</Badge>
      case "active":
        return <Badge className="bg-green-100 text-green-700">Active</Badge>
      case "planning":
        return <Badge className="bg-yellow-100 text-yellow-700">Planning</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <DashboardLayout allowedRoles={["regional_manager"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/regional/coordinators">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{coordinator.name}</h1>
            <p className="text-muted-foreground">{coordinator.state} State Coordinator</p>
          </div>
          {getStatusBadge(coordinator.status)}
        </div>

        {/* Contact & Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs">{coordinator.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs">{coordinator.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs">Since {new Date(coordinator.joinedDate).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Network</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Field Agents</span>
                <span className="text-lg font-bold">{coordinator.agents}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Farmers</span>
                <span className="text-lg font-bold">{coordinator.farmers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Corridors</span>
                <span className="text-lg font-bold">{coordinator.corridors}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <div>
                  <div className="text-lg font-bold">{coordinator.activeServices}</div>
                  <div className="text-xs text-muted-foreground">Active</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <div>
                  <div className="text-lg font-bold">{coordinator.completedServices}</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-bold">{coordinator.performance}%</div>
              <Progress value={coordinator.performance} className="h-2" />
              <p className="text-xs text-muted-foreground">{coordinator.hectares.toFixed(1)} hectares managed</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="corridors" className="space-y-4">
          <TabsList>
            <TabsTrigger value="corridors">Corridors</TabsTrigger>
            <TabsTrigger value="agents">Field Agents</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="corridors" className="space-y-4">
            {corridors.map((corridor) => (
              <Card key={corridor.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{corridor.name}</CardTitle>
                      <CardDescription>{corridor.id}</CardDescription>
                    </div>
                    {getStatusBadge(corridor.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Farmers</div>
                      <div className="text-xl font-bold">{corridor.farmers}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Hectares</div>
                      <div className="text-xl font-bold">{corridor.hectares}</div>
                    </div>
                    <div>
                      <Button variant="outline" size="sm" className="mt-1 bg-transparent">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="agents" className="space-y-4">
            {agents.map((agent) => (
              <Card key={agent.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                      <CardDescription>{agent.id}</CardDescription>
                    </div>
                    <Badge variant="secondary">{agent.tier}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Farmers: {agent.farmers}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Performance:</span>
                        <span className="font-medium">{agent.performance}%</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Detailed performance tracking for {coordinator.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Farmer Onboarding Target</span>
                    <span className="font-medium">89%</span>
                  </div>
                  <Progress value={89} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Service Completion Rate</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Agent Activation</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data Quality</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
