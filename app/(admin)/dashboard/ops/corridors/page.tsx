"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { PaginationControls } from "@/components/ui/pagination-controls"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  MapPin,
  Users,
  Tractor,
  Wheat,
  TrendingUp,
  TrendingDown,
  Search,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Target,
  Truck,
  CloudRain,
  Bug,
  Leaf,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Demo corridor data
const corridors = [
  {
    id: "COR-001",
    name: "Kaduna North",
    state: "Kaduna",
    totalFarmers: 450,
    activeFarmers: 420,
    totalHectares: 1250,
    clusters: 8,
    activeServices: 45,
    completedServices: 180,
    pendingServices: 12,
    avgYieldPerformance: 108,
    slaAdherence: 94,
    status: "active",
    season: "2024 Wet Season",
    crops: ["Maize", "Rice", "Soybean"],
    fieldAgents: 5,
    partners: 12,
    contracts: 8,
    expectedVolume: 3750000, // kg
    deliveredVolume: 2100000,
    revenue: 125000000, // Naira
  },
  {
    id: "COR-002",
    name: "Kaduna Central",
    state: "Kaduna",
    totalFarmers: 320,
    activeFarmers: 305,
    totalHectares: 890,
    clusters: 6,
    activeServices: 32,
    completedServices: 145,
    pendingServices: 8,
    avgYieldPerformance: 95,
    slaAdherence: 88,
    status: "active",
    season: "2024 Wet Season",
    crops: ["Maize", "Sorghum"],
    fieldAgents: 4,
    partners: 9,
    contracts: 5,
    expectedVolume: 2670000,
    deliveredVolume: 1450000,
    revenue: 87000000,
  },
  {
    id: "COR-003",
    name: "Kaduna South",
    state: "Kaduna",
    totalFarmers: 280,
    activeFarmers: 250,
    totalHectares: 720,
    clusters: 5,
    activeServices: 28,
    completedServices: 110,
    pendingServices: 18,
    avgYieldPerformance: 92,
    slaAdherence: 82,
    status: "at-risk",
    season: "2024 Wet Season",
    crops: ["Rice", "Cassava"],
    fieldAgents: 3,
    partners: 7,
    contracts: 4,
    expectedVolume: 2160000,
    deliveredVolume: 980000,
    revenue: 58000000,
  },
  {
    id: "COR-004",
    name: "Kano East",
    state: "Kano",
    totalFarmers: 520,
    activeFarmers: 495,
    totalHectares: 1480,
    clusters: 10,
    activeServices: 52,
    completedServices: 220,
    pendingServices: 15,
    avgYieldPerformance: 112,
    slaAdherence: 96,
    status: "active",
    season: "2024 Wet Season",
    crops: ["Maize", "Rice", "Groundnut"],
    fieldAgents: 6,
    partners: 14,
    contracts: 10,
    expectedVolume: 4440000,
    deliveredVolume: 2800000,
    revenue: 168000000,
  },
]

// Cluster details for selected corridor
const clusterDetails = [
  { name: "Cluster A - Zaria", farmers: 65, hectares: 180, services: 8, sla: 96 },
  { name: "Cluster B - Giwa", farmers: 52, hectares: 145, services: 6, sla: 92 },
  { name: "Cluster C - Sabon Gari", farmers: 48, hectares: 130, services: 5, sla: 94 },
  { name: "Cluster D - Soba", farmers: 45, hectares: 120, services: 7, sla: 88 },
  { name: "Cluster E - Makarfi", farmers: 58, hectares: 165, services: 6, sla: 91 },
]

export default function CorridorsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedCorridor, setSelectedCorridor] = useState<(typeof corridors)[0] | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [page, setPage] = useState(1)

  const filteredCorridors = corridors.filter((corridor) => {
    const matchesSearch =
      corridor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      corridor.state.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || corridor.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleViewCorridor = (corridor: (typeof corridors)[0]) => {
    setSelectedCorridor(corridor)
    setIsDetailOpen(true)
  }

  // Aggregate stats
  const totalFarmers = corridors.reduce((sum, c) => sum + c.totalFarmers, 0)
  const totalHectares = corridors.reduce((sum, c) => sum + c.totalHectares, 0)
  const avgSLA = Math.round(corridors.reduce((sum, c) => sum + c.slaAdherence, 0) / corridors.length)
  const atRiskCount = corridors.filter((c) => c.status === "at-risk").length

  const stats = [
    { name: "Total Corridors", value: corridors.length.toString(), icon: MapPin, color: "text-primary bg-primary/10" },
    { name: "Total Farmers", value: totalFarmers.toLocaleString(), icon: Users, color: "text-blue-600 bg-blue-100" },
    {
      name: "Total Hectares",
      value: totalHectares.toLocaleString(),
      icon: Wheat,
      color: "text-emerald-600 bg-emerald-100",
    },
    { name: "At Risk", value: atRiskCount.toString(), icon: AlertTriangle, color: "text-red-600 bg-red-100" },
  ]

  return (
    <DashboardLayout allowedRoles={["ops_admin"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Corridor Management</h1>
            <p className="text-muted-foreground">Monitor and manage agricultural corridors</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.name} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", stat.color)}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search corridor or state..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="at-risk">At Risk</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Corridors Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {filteredCorridors.slice((page - 1) * 20, page * 20).map((corridor) => (
            <Card key={corridor.id} className="border-border/50 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{corridor.name}</CardTitle>
                      <CardDescription>
                        {corridor.state} • {corridor.season}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      corridor.status === "active" && "bg-emerald-100 text-emerald-700 border-emerald-200",
                      corridor.status === "at-risk" && "bg-red-100 text-red-700 border-red-200",
                      corridor.status === "inactive" && "bg-gray-100 text-gray-700 border-gray-200",
                    )}
                  >
                    {corridor.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">{corridor.totalFarmers}</p>
                    <p className="text-xs text-muted-foreground">Farmers</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{corridor.totalHectares.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Hectares</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{corridor.clusters}</p>
                    <p className="text-xs text-muted-foreground">Clusters</p>
                  </div>
                </div>

                {/* SLA Progress */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">SLA Adherence</span>
                    <span
                      className={cn(
                        "font-medium",
                        corridor.slaAdherence >= 90
                          ? "text-emerald-600"
                          : corridor.slaAdherence >= 80
                            ? "text-amber-600"
                            : "text-red-600",
                      )}
                    >
                      {corridor.slaAdherence}%
                    </span>
                  </div>
                  <Progress
                    value={corridor.slaAdherence}
                    className={cn(
                      "h-2",
                      corridor.slaAdherence >= 90
                        ? "[&>div]:bg-emerald-500"
                        : corridor.slaAdherence >= 80
                          ? "[&>div]:bg-amber-500"
                          : "[&>div]:bg-red-500",
                    )}
                  />
                </div>

                {/* Yield Performance */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Yield Performance</span>
                  <div
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium",
                      corridor.avgYieldPerformance >= 100 ? "text-emerald-600" : "text-amber-600",
                    )}
                  >
                    {corridor.avgYieldPerformance >= 100 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {corridor.avgYieldPerformance}% of target
                  </div>
                </div>

                {/* Services Status */}
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>{corridor.completedServices} completed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span>{corridor.activeServices} active</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-amber-500" />
                    <span>{corridor.pendingServices} pending</span>
                  </div>
                </div>

                {/* Crops */}
                <div className="flex flex-wrap gap-1">
                  {corridor.crops.map((crop) => (
                    <Badge key={crop} variant="secondary" className="text-xs">
                      {crop}
                    </Badge>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => handleViewCorridor(corridor)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <PaginationControls
          page={page}
          pages={Math.ceil(filteredCorridors.length / 20)}
          total={filteredCorridors.length}
          limit={20}
          onPageChange={setPage}
        />

        {/* Corridor Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                {selectedCorridor?.name}
              </DialogTitle>
              <DialogDescription>
                {selectedCorridor?.state} • {selectedCorridor?.season}
              </DialogDescription>
            </DialogHeader>

            {selectedCorridor && (
              <Tabs defaultValue="overview" className="mt-4">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="clusters">Clusters</TabsTrigger>
                  <TabsTrigger value="supply">Supply</TabsTrigger>
                  <TabsTrigger value="yield">Yield</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4 mt-4">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-3 rounded-lg bg-muted/50 text-center">
                      <Users className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-lg font-bold">{selectedCorridor.totalFarmers}</p>
                      <p className="text-xs text-muted-foreground">Farmers</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 text-center">
                      <Wheat className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-lg font-bold">{selectedCorridor.totalHectares.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Hectares</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 text-center">
                      <Tractor className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-lg font-bold">{selectedCorridor.partners}</p>
                      <p className="text-xs text-muted-foreground">Partners</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 text-center">
                      <Activity className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-lg font-bold">{selectedCorridor.fieldAgents}</p>
                      <p className="text-xs text-muted-foreground">Field Agents</p>
                    </div>
                  </div>

                  {/* Volume Progress */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Delivery Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Volume Delivered</span>
                          <span className="font-medium">
                            {(selectedCorridor.deliveredVolume / 1000).toLocaleString()} /{" "}
                            {(selectedCorridor.expectedVolume / 1000).toLocaleString()} MT
                          </span>
                        </div>
                        <Progress
                          value={(selectedCorridor.deliveredVolume / selectedCorridor.expectedVolume) * 100}
                          className="h-3"
                        />
                        <p className="text-xs text-muted-foreground">
                          {((selectedCorridor.deliveredVolume / selectedCorridor.expectedVolume) * 100).toFixed(1)}% of
                          target
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Revenue */}
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-primary">
                      ₦{(selectedCorridor.revenue / 1000000).toFixed(1)}M
                    </p>
                  </div>
                </TabsContent>

                {/* Clusters Tab */}
                <TabsContent value="clusters" className="mt-4">
                  <div className="space-y-3">
                    {clusterDetails.map((cluster) => (
                      <div
                        key={cluster.name}
                        className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <p className="font-medium">{cluster.name}</p>
                          <Badge
                            variant="outline"
                            className={cn(
                              cluster.sla >= 90
                                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                : cluster.sla >= 80
                                  ? "bg-amber-100 text-amber-700 border-amber-200"
                                  : "bg-red-100 text-red-700 border-red-200",
                            )}
                          >
                            {cluster.sla}% SLA
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Farmers</p>
                            <p className="font-medium">{cluster.farmers}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Hectares</p>
                            <p className="font-medium">{cluster.hectares}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Active Services</p>
                            <p className="font-medium">{cluster.services}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="supply" className="mt-4 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Expected vs Delivered</CardTitle>
                      <CardDescription>Corridor supply fulfillment tracking</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-sm text-muted-foreground">Expected</p>
                            <p className="text-2xl font-bold">
                              {(selectedCorridor.expectedVolume / 1000).toLocaleString()} MT
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Delivered</p>
                            <p className="text-2xl font-bold text-emerald-600">
                              {(selectedCorridor.deliveredVolume / 1000).toLocaleString()} MT
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Shortfall</p>
                            <p className="text-2xl font-bold text-red-600">
                              {(
                                (selectedCorridor.expectedVolume - selectedCorridor.deliveredVolume) /
                                1000
                              ).toLocaleString()}{" "}
                              MT
                            </p>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Fulfillment Rate</span>
                            <span className="font-medium">
                              {((selectedCorridor.deliveredVolume / selectedCorridor.expectedVolume) * 100).toFixed(1)}%
                            </span>
                          </div>
                          <Progress
                            value={(selectedCorridor.deliveredVolume / selectedCorridor.expectedVolume) * 100}
                            className="h-3"
                          />
                        </div>

                        {selectedCorridor.contracts > 0 && (
                          <div className="pt-4 border-t">
                            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                              <Truck className="h-4 w-4" />
                              Active Contracts
                            </h4>
                            <div className="space-y-2">
                              {selectedCorridor.crops.map((crop, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                  <div className="flex items-center gap-2">
                                    <Leaf className="h-4 w-4 text-emerald-600" />
                                    <span className="font-medium">{crop}</span>
                                  </div>
                                  <Badge variant="outline">Contract #{idx + 1}</Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {selectedCorridor.status === "at-risk" && (
                    <Card className="border-red-200 bg-red-50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2 text-red-700">
                          <AlertTriangle className="h-4 w-4" />
                          Supply Risks
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-600 mt-2" />
                            <span>Delivery volumes tracking below target</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-600 mt-2" />
                            <span>Service completion delays affecting harvest timeline</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="yield" className="mt-4 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Yield Forecast
                      </CardTitle>
                      <CardDescription>Statistical predictions based on historical data</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedCorridor.crops.map((crop, idx) => {
                          const baseYield = selectedCorridor.expectedVolume / selectedCorridor.crops.length / 1000
                          const yieldLow = baseYield * 0.85
                          const yieldMid = baseYield
                          const yieldHigh = baseYield * 1.15

                          return (
                            <div key={idx} className="p-4 rounded-lg border">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                  <Leaf className="h-5 w-5 text-emerald-600" />
                                  <span className="font-medium">{crop}</span>
                                </div>
                                <Badge>
                                  {selectedCorridor.avgYieldPerformance >= 95 ? "High" : "Medium"} Confidence
                                </Badge>
                              </div>

                              <div className="space-y-3">
                                <div>
                                  <div className="flex justify-between text-sm mb-2">
                                    <span className="text-muted-foreground">Expected Range (MT)</span>
                                    <span className="font-medium">{yieldMid.toFixed(0)} likely</span>
                                  </div>
                                  <div className="relative h-8 bg-muted rounded-full overflow-hidden">
                                    <div
                                      className="absolute h-full bg-emerald-200"
                                      style={{
                                        left: "10%",
                                        width: "80%",
                                      }}
                                    />
                                    <div className="absolute h-full w-1 bg-emerald-600 left-1/2" />
                                  </div>
                                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                    <span>{yieldLow.toFixed(0)} (low)</span>
                                    <span>{yieldHigh.toFixed(0)} (high)</span>
                                  </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                  <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                                      <CloudRain className="h-4 w-4 text-emerald-600" />
                                    </div>
                                    <div className="text-xs">
                                      <p className="font-medium">Good</p>
                                      <p className="text-muted-foreground">Weather</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                                      <Bug className="h-4 w-4 text-emerald-600" />
                                    </div>
                                    <div className="text-xs">
                                      <p className="font-medium">Low</p>
                                      <p className="text-muted-foreground">Pest Risk</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                                    </div>
                                    <div className="text-xs">
                                      <p className="font-medium">{selectedCorridor.slaAdherence}%</p>
                                      <p className="text-muted-foreground">Service SLA</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Historical Accuracy</CardTitle>
                      <CardDescription>Past forecast vs actual performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Season</TableHead>
                            <TableHead>Crop</TableHead>
                            <TableHead className="text-right">Expected</TableHead>
                            <TableHead className="text-right">Actual</TableHead>
                            <TableHead className="text-right">Variance</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedCorridor.crops.slice(0, 3).map((crop, idx) => {
                            const variance = -3.5 - idx * 1.5
                            return (
                              <TableRow key={idx}>
                                <TableCell>2023 Wet</TableCell>
                                <TableCell>{crop}</TableCell>
                                <TableCell className="text-right">1,200</TableCell>
                                <TableCell className="text-right">1,158</TableCell>
                                <TableCell className="text-right">
                                  <span className="flex items-center justify-end gap-1 text-red-600">
                                    <TrendingDown className="h-4 w-4" />
                                    {variance.toFixed(1)}%
                                  </span>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Performance Tab */}
                <TabsContent value="performance" className="mt-4 space-y-4">
                  {/* SLA Breakdown */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">SLA Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Overall SLA Adherence</span>
                        <span
                          className={cn(
                            "font-bold",
                            selectedCorridor.slaAdherence >= 90 ? "text-emerald-600" : "text-amber-600",
                          )}
                        >
                          {selectedCorridor.slaAdherence}%
                        </span>
                      </div>
                      <Progress value={selectedCorridor.slaAdherence} className="h-3" />

                      <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                        <div className="text-center">
                          <CheckCircle className="h-5 w-5 mx-auto mb-1 text-emerald-600" />
                          <p className="text-lg font-bold">{selectedCorridor.completedServices}</p>
                          <p className="text-xs text-muted-foreground">Completed</p>
                        </div>
                        <div className="text-center">
                          <Clock className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                          <p className="text-lg font-bold">{selectedCorridor.activeServices}</p>
                          <p className="text-xs text-muted-foreground">In Progress</p>
                        </div>
                        <div className="text-center">
                          <AlertTriangle className="h-5 w-5 mx-auto mb-1 text-amber-600" />
                          <p className="text-lg font-bold">{selectedCorridor.pendingServices}</p>
                          <p className="text-xs text-muted-foreground">Pending</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Yield Performance */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Yield Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center gap-4 py-4">
                        <div
                          className={cn(
                            "h-20 w-20 rounded-full flex items-center justify-center text-2xl font-bold",
                            selectedCorridor.avgYieldPerformance >= 100
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700",
                          )}
                        >
                          {selectedCorridor.avgYieldPerformance}%
                        </div>
                        <div className="text-sm">
                          <p className="text-muted-foreground">of expected yield achieved</p>
                          <p
                            className={cn(
                              "font-medium flex items-center gap-1",
                              selectedCorridor.avgYieldPerformance >= 100 ? "text-emerald-600" : "text-amber-600",
                            )}
                          >
                            {selectedCorridor.avgYieldPerformance >= 100 ? (
                              <>
                                <TrendingUp className="h-4 w-4" /> Above target
                              </>
                            ) : (
                              <>
                                <TrendingDown className="h-4 w-4" /> Below target
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
