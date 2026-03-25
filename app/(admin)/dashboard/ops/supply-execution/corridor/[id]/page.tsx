"use client"

import { useState, use } from "react"
import useSWR from "swr"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ArrowLeft,
  MapPin,
  Target,
  Package,
  Truck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Users,
  Leaf,
  Building2,
  RefreshCw,
  UserPlus,
  Settings,
  Phone,
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface CorridorSupplyData {
  success: boolean
  data: {
    corridor: {
      id: number
      name: string
      crop_focus: string
      primary_delivery_hub: string
      active: boolean
      description: string
      lga_count: number
      community_count: number
    }
    buyerDemands: Array<{
      id: string
      reference_id: string
      buyer_name: string
      company_name: string
      crop_type: string
      crop_grade: string
      total_volume_mt: number
      delivery_state: string
      delivery_facility: string
      preferred_start_date: string
      payment_terms: string
      status: string
    }>
    supplyOverview: {
      totalDemandMT: number
      totalAllocatedMT: number
      totalCollectedMT: number
      totalConfirmedMT: number
      supplyGapMT: number
      totalOrders: number
      readyOrders: number
      earliestDeadline: string | null
      allocationProgress: number
      collectionProgress: number
    }
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
      aggregator_name: string
      aggregator_phone: string
      buyer_name: string
      company_name: string
    }>
    aggregatorBreakdown: Array<{
      aggregator_id: string
      aggregator_name: string
      aggregator_phone: string
      order_count: number
      total_assigned_mt: number
      total_collected_mt: number
      status: string
      next_deadline: string | null
    }>
    recentCollections: Array<{
      id: string
      quantity_mt: number
      quality_grade: string
      collection_date: string
      collection_point: string
      farmer_name: string
      order_reference: string
    }>
    readinessStatus: Array<{
      id: string
      total_aggregated_mt: number
      storage_location: string
      quality_confirmed: boolean
      quality_notes: string
      marked_ready_at: string
      order_reference: string
      marked_by_name: string
    }>
    alerts: Array<{
      id: string
      type: string
      severity: "high" | "medium" | "low"
      message: string
      entityId?: string
    }>
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "not_started":
      return "bg-slate-100 text-slate-700 border-slate-200"
    case "in_progress":
    case "collecting":
      return "bg-blue-100 text-blue-700 border-blue-200"
    case "ready":
    case "ready_for_delivery":
      return "bg-emerald-100 text-emerald-700 border-emerald-200"
    case "delayed":
      return "bg-red-100 text-red-700 border-red-200"
    default:
      return "bg-slate-100 text-slate-700 border-slate-200"
  }
}

function getAggregatorStatusLabel(status: string) {
  switch (status) {
    case "not_started":
      return "Not Started"
    case "in_progress":
      return "In Progress"
    case "ready":
      return "Ready"
    case "delayed":
      return "Delayed"
    default:
      return status
  }
}

export default function CorridorSupplyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const corridorId = resolvedParams.id
  
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [reassignDialogOpen, setReassignDialogOpen] = useState(false)
  const [selectedAggregator, setSelectedAggregator] = useState<string | null>(null)
  const [triggerDeliveryOpen, setTriggerDeliveryOpen] = useState(false)

  const { data, error, isLoading, mutate } = useSWR<CorridorSupplyData>(
    `/api/ops/supply-execution/corridor/${corridorId}`,
    fetcher,
    { refreshInterval: 30000 }
  )

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await mutate()
    setIsRefreshing(false)
    toast.success("Corridor data refreshed")
  }

  if (error) {
    return (
      <DashboardLayout allowedRoles={["ops_admin", "super_admin"]}>
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <AlertTriangle className="h-12 w-12 text-red-500" />
          <h2 className="text-lg font-semibold">Failed to load corridor data</h2>
          <p className="text-muted-foreground">Please try again later</p>
          <Link href="/dashboard/ops/supply-execution">
            <Button variant="outline">Back to Control Center</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const corridor = data?.data?.corridor
  const buyerDemands = data?.data?.buyerDemands || []
  const supplyOverview = data?.data?.supplyOverview
  const supplyOrders = data?.data?.supplyOrders || []
  const aggregatorBreakdown = data?.data?.aggregatorBreakdown || []
  const recentCollections = data?.data?.recentCollections || []
  const readinessStatus = data?.data?.readinessStatus || []
  const alerts = data?.data?.alerts || []

  return (
    <DashboardLayout allowedRoles={["ops_admin", "super_admin"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/ops/supply-execution">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Control Center
              </Button>
            </Link>
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
            <Link href={`/dashboard/ops/control-center/corridor/${corridorId}`}>
              <Button variant="outline" size="sm">
                <Activity className="h-4 w-4 mr-2" />
                Full Corridor View
              </Button>
            </Link>
          </div>
        </div>

        {/* Corridor Header */}
        {isLoading ? (
          <Card className="border-border/50">
            <CardContent className="p-6">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ) : corridor && (
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">{corridor.name}</h1>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span>{corridor.crop_focus || "Multiple crops"}</span>
                      <span>-</span>
                      <span>{corridor.lga_count} LGAs</span>
                      <span>-</span>
                      <span>{corridor.community_count} Communities</span>
                      {corridor.primary_delivery_hub && (
                        <>
                          <span>-</span>
                          <span>Hub: {corridor.primary_delivery_hub}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={corridor.active ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-700 border-slate-200"}
                >
                  {corridor.active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Risk Alerts */}
        {alerts.length > 0 && (
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
                <AlertTriangle className="h-5 w-5" />
                Corridor Alerts ({alerts.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-100"
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
                      <span className="text-sm font-medium">{alert.message}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      Action
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section 1 & 2: Buyer Demand Summary + Supply Overview */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Buyer Demand Summary */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-indigo-600" />
                Buyer Demand Summary
              </CardTitle>
              <CardDescription>Active demand requiring supply allocation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <Skeleton className="h-32 w-full" />
              ) : buyerDemands.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No active buyer demands</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-100">
                      <p className="text-3xl font-bold text-indigo-700">
                        {supplyOverview?.totalDemandMT?.toLocaleString() || 0}
                      </p>
                      <p className="text-sm text-indigo-600">Total Demand (MT)</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-3xl font-bold">{buyerDemands.length}</p>
                      <p className="text-sm text-muted-foreground">Active Buyers</p>
                    </div>
                  </div>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {buyerDemands.slice(0, 5).map((demand) => (
                      <div key={demand.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                        <div>
                          <p className="font-medium">{demand.buyer_name}</p>
                          <p className="text-xs text-muted-foreground">{demand.company_name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{Number(demand.total_volume_mt).toLocaleString()} MT</p>
                          <Badge variant="secondary" className="text-xs">{demand.crop_type}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Supply Overview */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-emerald-600" />
                Supply Overview
              </CardTitle>
              <CardDescription>Allocation and collection progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <Skeleton className="h-32 w-full" />
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-center">
                      <p className="text-2xl font-bold text-emerald-700">
                        {supplyOverview?.totalAllocatedMT?.toLocaleString() || 0}
                      </p>
                      <p className="text-xs text-emerald-600">Allocated (MT)</p>
                    </div>
                    <div className="p-3 rounded-lg bg-teal-50 border border-teal-100 text-center">
                      <p className="text-2xl font-bold text-teal-700">
                        {supplyOverview?.totalCollectedMT?.toLocaleString() || 0}
                      </p>
                      <p className="text-xs text-teal-600">Collected (MT)</p>
                    </div>
                    <div className={cn(
                      "p-3 rounded-lg text-center border",
                      (supplyOverview?.supplyGapMT || 0) > 0 
                        ? "bg-amber-50 border-amber-100" 
                        : "bg-green-50 border-green-100"
                    )}>
                      <p className={cn(
                        "text-2xl font-bold",
                        (supplyOverview?.supplyGapMT || 0) > 0 ? "text-amber-700" : "text-green-700"
                      )}>
                        {Math.abs(supplyOverview?.supplyGapMT || 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Gap (MT)</p>
                    </div>
                  </div>

                  {/* Allocation Progress */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Allocation Progress</span>
                      <span className="font-medium">{(supplyOverview?.allocationProgress || 0).toFixed(0)}%</span>
                    </div>
                    <Progress
                      value={supplyOverview?.allocationProgress || 0}
                      className="h-2 [&>div]:bg-indigo-500"
                    />
                  </div>

                  {/* Collection Progress */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Collection Progress</span>
                      <span className="font-medium">{(supplyOverview?.collectionProgress || 0).toFixed(0)}%</span>
                    </div>
                    <Progress
                      value={supplyOverview?.collectionProgress || 0}
                      className={cn(
                        "h-2",
                        (supplyOverview?.collectionProgress || 0) >= 80
                          ? "[&>div]:bg-emerald-500"
                          : (supplyOverview?.collectionProgress || 0) >= 50
                            ? "[&>div]:bg-amber-500"
                            : "[&>div]:bg-red-500"
                      )}
                    />
                  </div>

                  {/* Deadline */}
                  {supplyOverview?.earliestDeadline && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Earliest Deadline
                      </span>
                      <span className="font-medium">
                        {new Date(supplyOverview.earliestDeadline).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Section 3: Aggregator Breakdown */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Aggregator Breakdown
                </CardTitle>
                <CardDescription>Supply collection by aggregator</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setReassignDialogOpen(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Adjust Allocation
                </Button>
                <Button variant="outline" size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Aggregator
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : aggregatorBreakdown.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No aggregators assigned to this corridor</p>
                <Button variant="outline" className="mt-4">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Assign Aggregator
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aggregator</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="text-right">Assigned (MT)</TableHead>
                    <TableHead className="text-right">Collected (MT)</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aggregatorBreakdown.map((agg) => {
                    const progress = Number(agg.total_assigned_mt) > 0
                      ? (Number(agg.total_collected_mt) / Number(agg.total_assigned_mt)) * 100
                      : 0
                    return (
                      <TableRow key={agg.aggregator_id}>
                        <TableCell>
                          <p className="font-medium">{agg.aggregator_name || "Unknown"}</p>
                          <p className="text-xs text-muted-foreground">{agg.order_count} orders</p>
                        </TableCell>
                        <TableCell>
                          {agg.aggregator_phone && (
                            <span className="flex items-center gap-1 text-sm">
                              <Phone className="h-3 w-3" />
                              {agg.aggregator_phone}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {Number(agg.total_assigned_mt || 0).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {Number(agg.total_collected_mt || 0).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="w-24">
                            <Progress
                              value={progress}
                              className={cn(
                                "h-2",
                                progress >= 80 ? "[&>div]:bg-emerald-500" :
                                progress >= 50 ? "[&>div]:bg-amber-500" : "[&>div]:bg-red-500"
                              )}
                            />
                            <span className="text-xs text-muted-foreground">{progress.toFixed(0)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {agg.next_deadline
                            ? new Date(agg.next_deadline).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(agg.status)}>
                            {getAggregatorStatusLabel(agg.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedAggregator(agg.aggregator_id)
                              setReassignDialogOpen(true)
                            }}
                          >
                            Reassign
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Section 4 & 5: Recent Collections + Logistics Readiness */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Collections */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-teal-600" />
                Recent Collections
              </CardTitle>
              <CardDescription>Latest collection entries from aggregators</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-48 w-full" />
              ) : recentCollections.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Leaf className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No collections recorded yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {recentCollections.map((collection) => (
                    <div key={collection.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                      <div>
                        <p className="font-medium">{collection.farmer_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {collection.collection_point} - {new Date(collection.collection_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{Number(collection.quantity_mt).toFixed(2)} MT</p>
                        <Badge variant="secondary" className="text-xs">{collection.quality_grade}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Logistics Readiness */}
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-green-600" />
                    Logistics Readiness
                  </CardTitle>
                  <CardDescription>Supply ready for delivery</CardDescription>
                </div>
                <Button onClick={() => setTriggerDeliveryOpen(true)}>
                  <Truck className="h-4 w-4 mr-2" />
                  Trigger Delivery
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-48 w-full" />
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="p-4 rounded-lg bg-green-50 border border-green-100 text-center">
                      <p className="text-2xl font-bold text-green-700">
                        {supplyOverview?.readyOrders || 0}
                      </p>
                      <p className="text-xs text-green-600">Orders Ready</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 text-center">
                      <p className="text-2xl font-bold">
                        {readinessStatus.reduce((sum, r) => sum + Number(r.total_aggregated_mt || 0), 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Total Ready (MT)</p>
                    </div>
                    <div className="p-4 rounded-lg bg-amber-50 border border-amber-100 text-center">
                      <p className="text-2xl font-bold text-amber-700">
                        {(supplyOverview?.totalOrders || 0) - (supplyOverview?.readyOrders || 0)}
                      </p>
                      <p className="text-xs text-amber-600">Pending</p>
                    </div>
                  </div>

                  {readinessStatus.length > 0 ? (
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {readinessStatus.map((status) => (
                        <div key={status.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                          <div>
                            <p className="font-medium">{status.order_reference}</p>
                            <p className="text-xs text-muted-foreground">
                              {status.storage_location} - Ready {new Date(status.marked_ready_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{Number(status.total_aggregated_mt).toFixed(2)} MT</p>
                            {status.quality_confirmed && (
                              <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Quality OK
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Truck className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No deliveries ready yet</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* All Supply Orders */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>All Supply Orders</CardTitle>
            <CardDescription>Complete list of supply orders for this corridor</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Aggregator</TableHead>
                  <TableHead>Crop</TableHead>
                  <TableHead className="text-right">Assigned</TableHead>
                  <TableHead className="text-right">Collected</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={9}>
                        <Skeleton className="h-8 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : supplyOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                      No supply orders for this corridor
                    </TableCell>
                  </TableRow>
                ) : (
                  supplyOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.reference_id || order.id.slice(0, 8)}
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{order.buyer_name || "N/A"}</p>
                        <p className="text-xs text-muted-foreground">{order.company_name}</p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{order.aggregator_name || "Unassigned"}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{order.crop_type}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {Number(order.assigned_volume_mt || 0).toLocaleString()} MT
                      </TableCell>
                      <TableCell className="text-right">
                        {Number(order.collected_volume_mt || 0).toLocaleString()} MT
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
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Reassign Dialog */}
      <Dialog open={reassignDialogOpen} onOpenChange={setReassignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Supply Allocation</DialogTitle>
            <DialogDescription>
              Reassign or adjust supply volumes between aggregators
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Source Aggregator</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select aggregator" />
                </SelectTrigger>
                <SelectContent>
                  {aggregatorBreakdown.map((agg) => (
                    <SelectItem key={agg.aggregator_id} value={agg.aggregator_id}>
                      {agg.aggregator_name} ({Number(agg.total_assigned_mt).toLocaleString()} MT)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Target Aggregator</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select aggregator" />
                </SelectTrigger>
                <SelectContent>
                  {aggregatorBreakdown.map((agg) => (
                    <SelectItem key={agg.aggregator_id} value={agg.aggregator_id}>
                      {agg.aggregator_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Volume to Reassign (MT)</Label>
              <Input type="number" placeholder="Enter volume" />
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Textarea placeholder="Reason for reassignment..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReassignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast.success("Supply allocation updated")
              setReassignDialogOpen(false)
            }}>
              Confirm Reassignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Trigger Delivery Dialog */}
      <Dialog open={triggerDeliveryOpen} onOpenChange={setTriggerDeliveryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Trigger Delivery</DialogTitle>
            <DialogDescription>
              Initiate delivery for ready supply batches
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Ready Orders</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {readinessStatus.map((status) => (
                  <div key={status.id} className="flex items-center gap-3 p-3 rounded-lg border">
                    <input type="checkbox" id={status.id} className="h-4 w-4" />
                    <label htmlFor={status.id} className="flex-1 cursor-pointer">
                      <p className="font-medium">{status.order_reference}</p>
                      <p className="text-xs text-muted-foreground">
                        {Number(status.total_aggregated_mt).toFixed(2)} MT - {status.storage_location}
                      </p>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Delivery Date</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Logistics Notes</Label>
              <Textarea placeholder="Vehicle details, driver info, special instructions..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTriggerDeliveryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast.success("Delivery triggered successfully")
              setTriggerDeliveryOpen(false)
            }}>
              <Truck className="h-4 w-4 mr-2" />
              Trigger Delivery
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
