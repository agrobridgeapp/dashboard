"use client"

import { useState } from "react"
import useSWR from "swr"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  MapPin,
  Package,
  Truck,
  TrendingUp,
  TrendingDown,
  Target,
  Building2,
  Leaf,
  Eye,
  ExternalLink,
  Activity,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface SupplyExecutionData {
  success: boolean
  data: {
    stats: {
      totalBuyerDemands: number
      totalDemandMT: number
      totalSupplyOrders: number
      totalAllocatedMT: number
      totalCollectedMT: number
      supplyGapMT: number
      deliveriesReady: number
      activeCorridors: number
    }
    corridors: Array<{
      id: number
      name: string
      crop_focus: string
      primary_delivery_hub: string
      active: boolean
      demand_mt: number
      allocated_mt: number
      collected_mt: number
      next_deadline: string | null
    }>
    buyerDemands: Array<{
      id: string
      reference_id: string
      buyer_name: string
      company_name: string
      crop_type: string
      crop_grade: string
      total_volume_mt: number
      delivery_state: string
      preferred_start_date: string
      status: string
      created_at: string
    }>
    supplyOrders: Array<{
      id: string
      reference_id: string
      crop_type: string
      crop_grade: string
      assigned_volume_mt: number
      collected_volume_mt: number
      confirmed_volume_mt: number
      delivery_deadline: string
      delivery_location: string
      status: string
      corridor_id: number
      corridor_name: string
      buyer_name: string
      company_name: string
    }>
    alerts: Array<{
      id: string
      type: string
      severity: "high" | "medium" | "low"
      message: string
      corridor?: string
      entityId?: string
    }>
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "draft":
    case "pending":
      return "bg-slate-100 text-slate-700 border-slate-200"
    case "submitted":
    case "allocating":
      return "bg-blue-100 text-blue-700 border-blue-200"
    case "under_review":
    case "collecting":
      return "bg-amber-100 text-amber-700 border-amber-200"
    case "approved":
    case "ready_for_delivery":
      return "bg-emerald-100 text-emerald-700 border-emerald-200"
    case "rejected":
    case "cancelled":
      return "bg-red-100 text-red-700 border-red-200"
    case "delivered":
      return "bg-green-100 text-green-700 border-green-200"
    default:
      return "bg-slate-100 text-slate-700 border-slate-200"
  }
}

function getCorridorStatus(corridor: { demand_mt: number; allocated_mt: number; collected_mt: number; next_deadline: string | null }) {
  const demand = Number(corridor.demand_mt || 0)
  const allocated = Number(corridor.allocated_mt || 0)
  const collected = Number(corridor.collected_mt || 0)
  
  // Check deadline risk
  if (corridor.next_deadline) {
    const deadline = new Date(corridor.next_deadline)
    const daysUntil = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (daysUntil < 0) return { status: "critical", label: "Overdue", color: "bg-red-100 text-red-700 border-red-200" }
    if (daysUntil < 7 && collected < allocated * 0.7) return { status: "at_risk", label: "At Risk", color: "bg-amber-100 text-amber-700 border-amber-200" }
  }
  
  // Check supply gap
  const gap = demand - allocated
  if (gap > demand * 0.3) return { status: "planning", label: "Planning", color: "bg-blue-100 text-blue-700 border-blue-200" }
  
  // Check collection progress
  if (allocated > 0 && collected >= allocated * 0.9) return { status: "ready", label: "Ready", color: "bg-emerald-100 text-emerald-700 border-emerald-200" }
  if (allocated > 0) return { status: "active", label: "Active", color: "bg-green-100 text-green-700 border-green-200" }
  
  return { status: "planning", label: "Planning", color: "bg-slate-100 text-slate-700 border-slate-200" }
}

export default function SupplyExecutionPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [cropFilter, setCropFilter] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { data, error, isLoading, mutate } = useSWR<SupplyExecutionData>(
    "/api/ops/supply-execution",
    fetcher,
    { refreshInterval: 30000 }
  )

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await mutate()
    setIsRefreshing(false)
    toast.success("Supply execution data refreshed")
  }

  const stats = data?.data?.stats
  const corridors = data?.data?.corridors || []
  const buyerDemands = data?.data?.buyerDemands || []
  const supplyOrders = data?.data?.supplyOrders || []
  const alerts = data?.data?.alerts || []

  // Filter supply orders
  const filteredOrders = supplyOrders.filter((order) => {
    const matchesSearch =
      order.reference_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.buyer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.corridor_name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesCrop = cropFilter === "all" || order.crop_type?.toLowerCase() === cropFilter.toLowerCase()
    return matchesSearch && matchesStatus && matchesCrop
  })

  return (
    <DashboardLayout role="ops_admin" allowedRoles={["ops_admin", "super_admin"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Supply Execution Control Center</h1>
            <p className="text-muted-foreground">
              Monitor demand, supply allocation, collection, and delivery readiness
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", (isRefreshing || isLoading) && "animate-spin")} />
              Refresh
            </Button>
            <Link href="/dashboard/ops/planning-interests">
              <Button variant="outline" size="sm">
                <Building2 className="h-4 w-4 mr-2" />
                Buyer Demands
              </Button>
            </Link>
          </div>
        </div>

        {/* Risk Alerts */}
        {alerts.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  Active Risk Alerts ({alerts.length})
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {alerts.slice(0, 4).map((alert) => (
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
                            : alert.severity === "medium"
                              ? "bg-amber-100 text-amber-700 border-amber-200"
                              : "bg-blue-100 text-blue-700 border-blue-200"
                        }
                      >
                        {alert.severity}
                      </Badge>
                      <span className="text-sm font-medium text-foreground">{alert.message}</span>
                      {alert.corridor && (
                        <Badge variant="outline" className="text-xs">
                          {alert.corridor}
                        </Badge>
                      )}
                    </div>
                    <Button variant="ghost" size="sm">
                      Investigate
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top Summary Stats */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border-border/50">
                <CardContent className="p-4">
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats?.activeCorridors || 0}</p>
                    <p className="text-xs text-muted-foreground">Active Corridors</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
                    <Target className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{(stats?.totalDemandMT || 0).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total Demand (MT)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                    <Package className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{(stats?.totalAllocatedMT || 0).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Supply Allocated (MT)</p>
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
                    <p className="text-2xl font-bold">{(stats?.totalCollectedMT || 0).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Supply Collected (MT)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className={cn("border-border/50", (stats?.supplyGapMT || 0) > 0 && "border-amber-200 bg-amber-50")}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", (stats?.supplyGapMT || 0) > 0 ? "bg-amber-100" : "bg-emerald-100")}>
                    {(stats?.supplyGapMT || 0) > 0 ? (
                      <TrendingDown className="h-5 w-5 text-amber-600" />
                    ) : (
                      <TrendingUp className="h-5 w-5 text-emerald-600" />
                    )}
                  </div>
                  <div>
                    <p className={cn("text-2xl font-bold", (stats?.supplyGapMT || 0) > 0 ? "text-amber-700" : "text-emerald-700")}>
                      {Math.abs(stats?.supplyGapMT || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Supply Gap (MT)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <Truck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats?.deliveriesReady || 0}</p>
                    <p className="text-xs text-muted-foreground">Deliveries Ready</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="corridors" className="space-y-4">
          <TabsList>
            <TabsTrigger value="corridors">Corridors ({corridors.length})</TabsTrigger>
            <TabsTrigger value="supply-orders">Supply Orders ({supplyOrders.length})</TabsTrigger>
            <TabsTrigger value="buyer-demands">Buyer Demands ({buyerDemands.length})</TabsTrigger>
          </TabsList>

          {/* Corridors Tab */}
          <TabsContent value="corridors" className="space-y-4">
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="border-border/50">
                    <CardContent className="p-6">
                      <Skeleton className="h-32 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : corridors.length === 0 ? (
              <Card className="border-border/50">
                <CardContent className="p-12 text-center">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-semibold mb-2">No Active Corridors</h3>
                  <p className="text-muted-foreground mb-4">
                    Create corridors to start coordinating supply execution.
                  </p>
                  <Link href="/dashboard/ops/corridors/manage">
                    <Button>Create Corridor</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {corridors.map((corridor) => {
                  const demand = Number(corridor.demand_mt || 0)
                  const allocated = Number(corridor.allocated_mt || 0)
                  const collected = Number(corridor.collected_mt || 0)
                  const gap = demand - allocated
                  const collectionProgress = allocated > 0 ? (collected / allocated) * 100 : 0
                  const corridorStatus = getCorridorStatus(corridor)

                  return (
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
                                {corridor.crop_focus || "Multiple crops"} - {corridor.primary_delivery_hub || "No hub set"}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge variant="outline" className={corridorStatus.color}>
                            {corridorStatus.label}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Key Metrics */}
                        <div className="grid grid-cols-4 gap-2 text-center">
                          <div className="p-2 rounded-lg bg-muted/50">
                            <p className="text-lg font-bold">{demand.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Demand (MT)</p>
                          </div>
                          <div className="p-2 rounded-lg bg-muted/50">
                            <p className="text-lg font-bold">{allocated.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Allocated</p>
                          </div>
                          <div className="p-2 rounded-lg bg-muted/50">
                            <p className="text-lg font-bold">{collected.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Collected</p>
                          </div>
                          <div className={cn("p-2 rounded-lg", gap > 0 ? "bg-amber-100" : "bg-emerald-100")}>
                            <p className={cn("text-lg font-bold", gap > 0 ? "text-amber-700" : "text-emerald-700")}>
                              {gap.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">Gap</p>
                          </div>
                        </div>

                        {/* Collection Progress */}
                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Collection Progress</span>
                            <span className="font-medium">{collectionProgress.toFixed(0)}%</span>
                          </div>
                          <Progress
                            value={collectionProgress}
                            className={cn(
                              "h-2",
                              collectionProgress >= 90
                                ? "[&>div]:bg-emerald-500"
                                : collectionProgress >= 50
                                  ? "[&>div]:bg-amber-500"
                                  : "[&>div]:bg-red-500"
                            )}
                          />
                        </div>

                        {/* Deadline */}
                        {corridor.next_deadline && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Next Deadline
                            </span>
                            <span className="font-medium">
                              {new Date(corridor.next_deadline).toLocaleDateString()}
                            </span>
                          </div>
                        )}

                        <Link href={`/dashboard/ops/supply-execution/corridor/${corridor.id}`}>
                          <Button variant="outline" className="w-full bg-transparent">
                            <Eye className="h-4 w-4 mr-2" />
                            View Corridor
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* Supply Orders Tab */}
          <TabsContent value="supply-orders" className="space-y-4">
            {/* Filters */}
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Filters:</span>
                  </div>
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by reference, buyer, corridor..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="allocating">Allocating</SelectItem>
                      <SelectItem value="collecting">Collecting</SelectItem>
                      <SelectItem value="ready_for_delivery">Ready</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={cropFilter} onValueChange={setCropFilter}>
                    <SelectTrigger className="w-[140px]">
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
                </div>
              </CardContent>
            </Card>

            {/* Orders Table */}
            <Card className="border-border/50">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Corridor</TableHead>
                      <TableHead>Crop</TableHead>
                      <TableHead className="text-right">Assigned (MT)</TableHead>
                      <TableHead className="text-right">Collected (MT)</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      [...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                          <TableCell colSpan={9}>
                            <Skeleton className="h-8 w-full" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                          No supply orders found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((order) => {
                        const progress = order.assigned_volume_mt > 0
                          ? (Number(order.collected_volume_mt || 0) / Number(order.assigned_volume_mt)) * 100
                          : 0
                        return (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.reference_id || order.id.slice(0, 8)}</TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{order.buyer_name || "N/A"}</p>
                                <p className="text-xs text-muted-foreground">{order.company_name}</p>
                              </div>
                            </TableCell>
                            <TableCell>{order.corridor_name || "Unassigned"}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{order.crop_type}</Badge>
                            </TableCell>
                            <TableCell className="text-right">{Number(order.assigned_volume_mt || 0).toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <span>{Number(order.collected_volume_mt || 0).toLocaleString()}</span>
                                <span className="text-xs text-muted-foreground">({progress.toFixed(0)}%)</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {order.delivery_deadline
                                ? new Date(order.delivery_deadline).toLocaleDateString()
                                : "Not set"}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getStatusColor(order.status)}>
                                {order.status?.replace(/_/g, " ")}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Link href={`/dashboard/ops/supply-execution/order/${order.id}`}>
                                <Button variant="ghost" size="sm">
                                  View
                                  <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Buyer Demands Tab */}
          <TabsContent value="buyer-demands" className="space-y-4">
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Active Buyer Demands</CardTitle>
                    <CardDescription>Planning interests requiring supply allocation</CardDescription>
                  </div>
                  <Link href="/dashboard/ops/planning-interests">
                    <Button variant="outline" size="sm">
                      View All
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Crop</TableHead>
                      <TableHead className="text-right">Volume (MT)</TableHead>
                      <TableHead>Delivery State</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      [...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                          <TableCell colSpan={8}>
                            <Skeleton className="h-8 w-full" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : buyerDemands.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                          No active buyer demands
                        </TableCell>
                      </TableRow>
                    ) : (
                      buyerDemands.map((demand) => (
                        <TableRow key={demand.id}>
                          <TableCell className="font-medium">{demand.reference_id}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{demand.buyer_name}</p>
                              <p className="text-xs text-muted-foreground">{demand.company_name}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{demand.crop_type}</Badge>
                            {demand.crop_grade && (
                              <span className="text-xs text-muted-foreground ml-1">({demand.crop_grade})</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {Number(demand.total_volume_mt || 0).toLocaleString()}
                          </TableCell>
                          <TableCell>{demand.delivery_state || "Not specified"}</TableCell>
                          <TableCell>
                            {demand.preferred_start_date
                              ? new Date(demand.preferred_start_date).toLocaleDateString()
                              : "Flexible"}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusColor(demand.status)}>
                              {demand.status?.replace(/_/g, " ")}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Link href={`/dashboard/ops/planning-interests?id=${demand.id}`}>
                              <Button variant="ghost" size="sm">
                                View
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
