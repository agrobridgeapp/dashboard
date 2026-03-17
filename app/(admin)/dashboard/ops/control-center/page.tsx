"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Search,
  Filter,
  MapPin,
  Users,
  Truck,
  FileText,
  Package,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Building2,
  Leaf,
  Wallet,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  Eye,
  RefreshCw,
  Activity,
  Layers,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Pause,
  Play,
  Ban,
  Settings,
  ExternalLink,
} from "lucide-react"
import { toast } from "sonner"

// Mock data for Control Center
const corridorsSummary = [
  {
    id: "corridor-001",
    name: "Kaduna North Corridor",
    status: "active",
    farmers: 1247,
    agents: 12,
    partners: 8,
    hectares: 3420,
    activeTasks: 45,
    pendingDeliveries: 23,
    riskLevel: "low",
    buyers: 3,
    contracts: 5,
  },
  {
    id: "corridor-002",
    name: "Kaduna Central Corridor",
    status: "active",
    farmers: 892,
    agents: 8,
    partners: 5,
    hectares: 2180,
    activeTasks: 32,
    pendingDeliveries: 15,
    riskLevel: "medium",
    buyers: 2,
    contracts: 3,
  },
  {
    id: "corridor-003",
    name: "Kano South Corridor",
    status: "planned",
    farmers: 0,
    agents: 0,
    partners: 0,
    hectares: 0,
    activeTasks: 0,
    pendingDeliveries: 0,
    riskLevel: "low",
    buyers: 1,
    contracts: 1,
  },
  {
    id: "corridor-004",
    name: "Niger East Corridor",
    status: "paused",
    farmers: 456,
    agents: 4,
    partners: 3,
    hectares: 1120,
    activeTasks: 0,
    pendingDeliveries: 8,
    riskLevel: "high",
    buyers: 1,
    contracts: 2,
  },
]

const buyersSummary = [
  {
    id: "buyer-001",
    name: "Olam Nigeria",
    status: "active",
    contracts: 3,
    totalVolume: 2500,
    deliveredVolume: 1850,
    pendingDeliveries: 650,
    planningInterests: 2,
    corridors: ["Kaduna North", "Kaduna Central"],
    paymentStatus: "current",
  },
  {
    id: "buyer-002",
    name: "Flour Mills of Nigeria",
    status: "active",
    contracts: 2,
    totalVolume: 1800,
    deliveredVolume: 1200,
    pendingDeliveries: 600,
    planningInterests: 1,
    corridors: ["Kaduna North"],
    paymentStatus: "current",
  },
  {
    id: "buyer-003",
    name: "Dangote Farms",
    status: "active",
    contracts: 1,
    totalVolume: 1000,
    deliveredVolume: 450,
    pendingDeliveries: 550,
    planningInterests: 3,
    corridors: ["Kano South"],
    paymentStatus: "overdue",
  },
]

const agentsSummary = [
  {
    id: "agent-001",
    name: "Blessing Okonkwo",
    status: "active",
    corridor: "Kaduna North",
    farmers: 342,
    activeTasks: 12,
    completionRate: 94.2,
    qualityScore: 96.5,
    overdueItems: 0,
  },
  {
    id: "agent-002",
    name: "Chinedu Eze",
    status: "active",
    corridor: "Kaduna North",
    farmers: 298,
    activeTasks: 8,
    completionRate: 89.5,
    qualityScore: 92.1,
    overdueItems: 2,
  },
  {
    id: "agent-003",
    name: "Amina Ibrahim",
    status: "suspended",
    corridor: "Kaduna Central",
    farmers: 276,
    activeTasks: 0,
    completionRate: 72.3,
    qualityScore: 78.5,
    overdueItems: 15,
  },
]

// Fallback mock data for dashboard initialization
const INITIAL_TASKS = {
  total: 0,
  notStarted: 0,
  inProgress: 0,
  blocked: 0,
  completed: 0,
  overdue: 0,
  planned: 0,
  scheduled: 0
}

const INITIAL_DELIVERIES = {
  total: 0,
  pending: 0,
  inTransit: 0,
  received: 0,
  verified: 0,
  rejected: 0,
}

const INITIAL_SETTLEMENTS = {
  pendingFarmer: 0,
  pendingPartner: 0,
  processedThisMonth: 0,
  disputes: 0,
  grossTotal: 0,
  netTotal: 0
}

const riskAlerts = [
  {
    id: "alert-001",
    type: "sla_breach",
    severity: "high",
    message: "12 tasks overdue by more than 48 hours",
    corridor: "Kaduna Central",
    timestamp: "2024-01-28T08:30:00Z",
  },
  {
    id: "alert-002",
    type: "delivery_variance",
    severity: "medium",
    message: "Delivery variance >15% for Olam contract #OLM-2024-003",
    corridor: "Kaduna North",
    timestamp: "2024-01-28T09:15:00Z",
  },
  {
    id: "alert-003",
    type: "agent_performance",
    severity: "high",
    message: "Agent Amina Ibrahim quality score dropped below 80%",
    corridor: "Kaduna Central",
    timestamp: "2024-01-28T07:00:00Z",
  },
  {
    id: "alert-004",
    type: "buyer_confirmation",
    severity: "medium",
    message: "3 deliveries awaiting buyer confirmation for >7 days",
    corridor: "Kaduna North",
    timestamp: "2024-01-27T16:00:00Z",
  },
]

export default function OperationsControlCenterPage() {
  const router = useRouter()
  const [selectedCorridor, setSelectedCorridor] = useState<string>("all")
  const [selectedBuyer, setSelectedBuyer] = useState<string>("all")
  const [selectedCrop, setSelectedCrop] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const [stats, setStats] = useState<any>(null)
  const [corridors, setCorridors] = useState<any[]>([])
  const [agents, setAgents] = useState<any[]>([])
  const [buyers, setBuyers] = useState<any[]>([])
  const [partners, setPartners] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [statsRes, corridorsRes, agentsRes, buyersRes, partnersRes] = await Promise.all([
        fetch('/api/admin/control-center/stats'),
        fetch('/api/admin/control-center/corridors'),
        fetch('/api/admin/control-center/agents'),
        fetch('/api/admin/control-center/buyers'),
        fetch('/api/admin/control-center/partners')
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (corridorsRes.ok) {
        const corridorsData = await corridorsRes.json()
        setCorridors(corridorsData)
      }

      if (agentsRes.ok) {
        const agentsData = await agentsRes.json()
        setAgents(agentsData)
      }

      if (buyersRes.ok) {
        const buyersData = await buyersRes.json()
        setBuyers(buyersData)
      }

      if (partnersRes.ok) {
        const partnersData = await partnersRes.json()
        setPartners(partnersData)
      }
    } catch (error) {
      console.error("Failed to fetch control center data:", error)
      toast.error("Failed to load dashboard data")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Handle investigate button - route to relevant page based on alert type
  const handleInvestigate = (alert: (typeof riskAlerts)[0]) => {
    switch (alert.type) {
      case "sla_breach":
        router.push("/dashboard/ops/tasks?filter=overdue")
        break
      case "delivery_variance":
        router.push("/dashboard/ops/contracts")
        break
      case "agent_performance":
        router.push("/dashboard/ops/field-operations")
        break
      case "buyer_confirmation":
        router.push("/dashboard/ops/contracts")
        break
      default:
        router.push("/dashboard/ops/audit-log")
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchData()
    setIsRefreshing(false)
    toast.success("Control Center data refreshed")
  }

  const handleCorridorAction = (corridorId: string, action: "pause" | "resume" | "view") => {
    if (action === "pause") {
      toast.success("Corridor paused. All active tasks have been suspended.")
    } else if (action === "resume") {
      toast.success("Corridor resumed. Tasks are now active.")
    }
  }

  // Map backend stats to component needs
  const tSummary = stats?.tasks || INITIAL_TASKS
  const dSummary = stats?.deliveries || INITIAL_DELIVERIES
  const sSummary = stats?.settlements || INITIAL_SETTLEMENTS
  
  const platformStats = {
    totalCorridors: stats?.platform?.totalCorridors || 0,
    activeCorridors: stats?.platform?.activeCorridors || 0,
    totalFarmers: corridors.reduce((sum, c) => sum + (c.farmers || 0), 0),
    totalAgents: agents.length,
    totalPartners: partners.length,
    totalHectares: corridors.reduce((sum, c) => sum + (c.hectares || 0), 0),
    totalBuyers: buyers.length,
    totalContracts: buyers.reduce((sum, b) => sum + (b.contracts || 0), 0),
  }

  return (
    <DashboardLayout allowedRoles={["ops_admin", "super_admin"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Operations Control Center</h1>
            <p className="text-muted-foreground">
              Complete platform visibility and control. Ops sees everything.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Link href="/dashboard/ops/audit-log">
              <Button variant="outline" size="sm">
                <Activity className="h-4 w-4 mr-2" />
                Audit Log
              </Button>
            </Link>
          </div>
        </div>

        {/* Global Filters */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              <Select value={selectedCorridor} onValueChange={setSelectedCorridor}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All Corridors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Corridors</SelectItem>
                  {corridors.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedBuyer} onValueChange={setSelectedBuyer}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All Buyers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Buyers</SelectItem>
                  {buyers.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="All Crops" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Crops</SelectItem>
                  <SelectItem value="maize">Maize</SelectItem>
                  <SelectItem value="rice">Rice</SelectItem>
                  <SelectItem value="soybean">Soybean</SelectItem>
                  <SelectItem value="sorghum">Sorghum</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="at_risk">At Risk</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search farmers, agents, contracts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Alerts */}
        {riskAlerts.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  Active Risk Alerts ({riskAlerts.length})
                </CardTitle>
                <Link href="/dashboard/ops/audit-log">
                  <Button variant="ghost" size="sm" className="text-red-700 hover:text-red-800">
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {riskAlerts.slice(0, 3).map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-100"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className={
                          alert.severity === "high"
                            ? "bg-red-100 text-red-700 border-red-200"
                            : "bg-amber-100 text-amber-700 border-amber-200"
                        }
                      >
                        {alert.severity}
                      </Badge>
                      <span className="text-sm font-medium text-foreground">{alert.message}</span>
                      <Badge variant="outline" className="text-xs">
                        {alert.corridor}
                      </Badge>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleInvestigate(alert)}
                    >
                      Investigate
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Platform Overview Stats */}
        <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-8">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{platformStats.activeCorridors}/{platformStats.totalCorridors}</p>
                  <p className="text-xs text-muted-foreground">Corridors</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{platformStats.totalFarmers.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Farmers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                  <Target className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{platformStats.totalAgents}</p>
                  <p className="text-xs text-muted-foreground">Agents</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                  <Building2 className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{platformStats.totalPartners}</p>
                  <p className="text-xs text-muted-foreground">Partners</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100">
                  <Leaf className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{platformStats.totalHectares.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Hectares</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
                  <Building2 className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{platformStats.totalBuyers}</p>
                  <p className="text-xs text-muted-foreground">Buyers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-100">
                  <FileText className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{platformStats.totalContracts}</p>
                  <p className="text-xs text-muted-foreground">Contracts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{tSummary?.overdue || 0}</p>
                  <p className="text-xs text-muted-foreground">Overdue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="corridors" className="space-y-4">
          <div className="overflow-x-auto pb-1">
          <TabsList className="flex w-max min-w-full">
            <TabsTrigger value="corridors">Corridors</TabsTrigger>
            <TabsTrigger value="buyers">Buyers</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="partners">Partners</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
            <TabsTrigger value="settlements">Settlements</TabsTrigger>
          </TabsList>
          </div>

          {/* Corridors Tab */}
          <TabsContent value="corridors" className="space-y-4">
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Corridors</CardTitle>
                    <CardDescription>Complete corridor visibility with intervention controls</CardDescription>
                  </div>
                  <Link href="/dashboard/ops/corridors">
                    <Button variant="outline" size="sm">
                      Manage Corridors
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Corridor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Farmers</TableHead>
                      <TableHead className="text-right">Agents</TableHead>
                      <TableHead className="text-right">Partners</TableHead>
                      <TableHead className="text-right">Hectares</TableHead>
                      <TableHead className="text-right">Active Tasks</TableHead>
                      <TableHead>Risk</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {corridors.length > 0 ? corridors.map((corridor) => (
                      <TableRow key={corridor.id}>
                        <TableCell>
                          <Link
                            href={`/dashboard/ops/control-center/corridor/${corridor.id}`}
                            className="font-medium text-foreground hover:underline"
                          >
                            {corridor.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              corridor.status === "active"
                                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                : corridor.status === "paused"
                                ? "bg-amber-100 text-amber-700 border-amber-200"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                            }
                          >
                            {corridor.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{(corridor.farmers || 0).toLocaleString()}</TableCell>
                        <TableCell className="text-right">{corridor.agents || 0}</TableCell>
                        <TableCell className="text-right">{corridor.partners || 0}</TableCell>
                        <TableCell className="text-right">{(corridor.hectares || 0).toLocaleString()}</TableCell>
                        <TableCell className="text-right">{corridor.activeTasks || 0}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              corridor.riskLevel === "high"
                                ? "bg-red-100 text-red-700 border-red-200"
                                : corridor.riskLevel === "medium"
                                ? "bg-amber-100 text-amber-700 border-amber-200"
                                : "bg-emerald-100 text-emerald-700 border-emerald-200"
                            }
                          >
                            {corridor.riskLevel}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/dashboard/ops/control-center/corridor/${corridor.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            {corridor.status === "active" ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCorridorAction(corridor.id, "pause")}
                              >
                                <Pause className="h-4 w-4 text-amber-600" />
                              </Button>
                            ) : corridor.status === "paused" ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCorridorAction(corridor.id, "resume")}
                              >
                                <Play className="h-4 w-4 text-emerald-600" />
                              </Button>
                            ) : null}
                          </div>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                          {isLoading ? "Loading corridors..." : "No corridors found"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Buyers Tab */}
          <TabsContent value="buyers" className="space-y-4">
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Buyers</CardTitle>
                    <CardDescription>Buyer accounts, contracts, and delivery status</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/dashboard/ops/supply-pipeline">
                      <Button variant="outline" size="sm">
                        Planning Interests
                      </Button>
                    </Link>
                    <Link href="/dashboard/ops/contracts">
                      <Button variant="outline" size="sm">
                        All Contracts
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Contracts</TableHead>
                      <TableHead className="text-right">Total Volume (MT)</TableHead>
                      <TableHead className="text-right">Delivered</TableHead>
                      <TableHead className="text-right">Pending</TableHead>
                      <TableHead>Corridors</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {buyers.length > 0 ? buyers.map((buyer) => (
                      <TableRow key={buyer.id}>
                        <TableCell>
                          <Link
                            href={`/dashboard/ops/control-center/buyer/${buyer.id}`}
                            className="font-medium text-foreground hover:underline"
                          >
                            {buyer.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-emerald-100 text-emerald-700 border-emerald-200"
                          >
                            {buyer.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{buyer.contracts}</TableCell>
                        <TableCell className="text-right">{(buyer.totalVolume || 0).toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <span className="text-emerald-600">{(buyer.deliveredVolume || 0).toLocaleString()}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-amber-600">{(buyer.pendingDeliveries || 0).toLocaleString()}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {(buyer.corridors || []).map((c: string) => (
                              <Badge key={c} variant="outline" className="text-xs">
                                {c}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              buyer.paymentStatus === "current"
                                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                : "bg-red-100 text-red-700 border-red-200"
                            }
                          >
                            {buyer.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/dashboard/ops/control-center/buyer/${buyer.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                          {isLoading ? "Loading buyers..." : "No buyers found"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Agents Tab */}
          <TabsContent value="agents" className="space-y-4">
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Agents</CardTitle>
                    <CardDescription>Agent performance, tasks, and status management</CardDescription>
                  </div>
                  <Link href="/dashboard/ops/field-operations">
                    <Button variant="outline" size="sm">
                      Field Operations
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Corridor</TableHead>
                      <TableHead className="text-right">Farmers</TableHead>
                      <TableHead className="text-right">Active Tasks</TableHead>
                      <TableHead className="text-right">Completion %</TableHead>
                      <TableHead className="text-right">Quality Score</TableHead>
                      <TableHead className="text-right">Overdue</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agents.length > 0 ? agents.map((agent) => (
                      <TableRow key={agent.id}>
                        <TableCell>
                          <Link
                            href={`/dashboard/ops/control-center/agent/${agent.id}`}
                            className="font-medium text-foreground hover:underline"
                          >
                            {agent.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              agent.status === "active"
                                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                : "bg-red-100 text-red-700 border-red-200"
                            }
                          >
                            {agent.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{agent.corridor}</TableCell>
                        <TableCell className="text-right">{agent.farmers || 0}</TableCell>
                        <TableCell className="text-right">{agent.activeTasks || 0}</TableCell>
                        <TableCell className="text-right">
                          <span
                            className={
                              agent.completionRate >= 90
                                ? "text-emerald-600"
                                : agent.completionRate >= 75
                                ? "text-amber-600"
                                : "text-red-600"
                            }
                          >
                            {agent.completionRate}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={
                              agent.qualityScore >= 90
                                ? "text-emerald-600"
                                : agent.qualityScore >= 80
                                ? "text-amber-600"
                                : "text-red-600"
                            }
                          >
                            {agent.qualityScore}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {agent.overdueItems > 0 ? (
                            <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                              {agent.overdueItems}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">0</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/dashboard/ops/control-center/agent/${agent.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            {agent.status === "active" ? (
                              <Button variant="ghost" size="sm">
                                <Ban className="h-4 w-4 text-red-600" />
                              </Button>
                            ) : (
                              <Button variant="ghost" size="sm">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                          {isLoading ? "Loading agents..." : "No agents found"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Partners Tab */}
          <TabsContent value="partners" className="space-y-4">
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Partners</CardTitle>
                    <CardDescription>Partner assignments, jobs, and performance</CardDescription>
                  </div>
                  <Link href="/dashboard/ops/partners">
                    <Button variant="outline" size="sm">
                      Partner Management
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Partner</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Corridors</TableHead>
                      <TableHead className="text-right">Active Jobs</TableHead>
                      <TableHead className="text-right">Completed</TableHead>
                      <TableHead className="text-right">Rating</TableHead>
                      <TableHead className="text-right">Pending Settlement</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {partners.length > 0 ? partners.map((partner) => (
                      <TableRow key={partner.id}>
                        <TableCell>
                          <Link
                            href={`/dashboard/ops/control-center/partner/${partner.id}`}
                            className="font-medium text-foreground hover:underline"
                          >
                            {partner.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {partner.type?.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              partner.status === "active"
                                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                            }
                          >
                            {partner.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{partner.coverage}</TableCell>
                        <TableCell className="text-right">{partner.activeJobs}</TableCell>
                        <TableCell className="text-right">{partner.completedJobs}</TableCell>
                        <TableCell className="text-right">
                          <span className="text-amber-600">{partner.rating}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          NGN {((partner.pendingSettlement || 0) / 1000000).toFixed(2)}M
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/dashboard/ops/control-center/partner/${partner.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                          {isLoading ? "Loading partners..." : "No partners found"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-6">
              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold">{tSummary?.total || 0}</p>
                  <p className="text-xs text-muted-foreground">Total Tasks</p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-slate-600">{tSummary?.planned || 0}</p>
                  <p className="text-xs text-muted-foreground">Planned</p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">{tSummary?.in_progress || 0}</p>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-amber-600">{tSummary?.scheduled || 0}</p>
                  <p className="text-xs text-muted-foreground">Scheduled</p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-600">{tSummary?.completed || 0}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </CardContent>
              </Card>
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-red-600">{tSummary?.overdue || 0}</p>
                  <p className="text-xs text-red-700">Overdue</p>
                </CardContent>
              </Card>
            </div>
            <div className="flex justify-end gap-2">
              <Link href="/dashboard/ops/task-requests">
                <Button variant="outline">
                  Task Requests Queue
                </Button>
              </Link>
              <Link href="/dashboard/ops/tasks">
                <Button className="bg-emerald-700 hover:bg-emerald-800">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Task Management
                </Button>
              </Link>
            </div>
          </TabsContent>

          {/* Deliveries Tab */}
          <TabsContent value="deliveries" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-5">
              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold">{dSummary?.total || 0}</p>
                  <p className="text-xs text-muted-foreground">Total Deliveries</p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-amber-600">{dSummary?.pending || 0}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">{dSummary?.in_transit || 0}</p>
                  <p className="text-xs text-muted-foreground">In Transit</p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-purple-600">{dSummary?.received || 0}</p>
                  <p className="text-xs text-muted-foreground">Received</p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-600">{dSummary?.verified || 0}</p>
                  <p className="text-xs text-muted-foreground">Verified</p>
                </CardContent>
              </Card>
            </div>
            <div className="flex justify-end">
              <Link href="/dashboard/ops/supply-pipeline">
                <Button className="bg-emerald-700 hover:bg-emerald-800">
                  <Truck className="h-4 w-4 mr-2" />
                  Delivery Management
                </Button>
              </Link>
            </div>
          </TabsContent>

          {/* Settlements Tab */}
          <TabsContent value="settlements" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-5">
              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-amber-600">
                    NGN {((sSummary?.pendingFarmer || 0) / 1000000).toFixed(2)}M
                  </p>
                  <p className="text-xs text-muted-foreground">Pending Farmer Settlements</p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    NGN {((sSummary?.pendingPartner || 0) / 1000000).toFixed(2)}M
                  </p>
                  <p className="text-xs text-muted-foreground">Pending Partner Settlements</p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-slate-800">
                    NGN {((sSummary?.grossTotal || 0) / 1000000).toFixed(2)}M
                  </p>
                  <p className="text-xs text-muted-foreground">Gross Total Value</p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-600">
                    NGN {((sSummary?.netTotal || 0) / 1000000).toFixed(2)}M
                  </p>
                  <p className="text-xs text-muted-foreground">Net Settled Amount</p>
                </CardContent>
              </Card>
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-red-600">{sSummary?.disputes || 0}</p>
                  <p className="text-xs text-red-700">Active Disputes</p>
                </CardContent>
              </Card>
            </div>
            <div className="flex justify-end">
              <Link href="/dashboard/ops/settlement">
                <Button className="bg-emerald-700 hover:bg-emerald-800">
                  <Wallet className="h-4 w-4 mr-2" />
                  Settlement Management
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
