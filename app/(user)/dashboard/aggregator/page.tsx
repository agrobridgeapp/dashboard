"use client"

import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth-context"
import useSWR from "swr"
import Link from "next/link"
import {
  Package,
  Truck,
  Users,
  TrendingUp,
  Calendar,
  MapPin,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface SupplyOrder {
  id: string
  reference_id: string
  crop_type: string
  crop_grade: string
  assigned_volume_mt: number
  confirmed_volume_mt: number
  collected_volume_mt: number
  delivery_location: string
  delivery_deadline: string
  status: string
  corridor_name: string | null
  allocation_count: number
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  assigned: { label: "New Assignment", color: "bg-blue-100 text-blue-700", icon: Clock },
  in_progress: { label: "In Progress", color: "bg-amber-100 text-amber-700", icon: TrendingUp },
  ready: { label: "Ready for Pickup", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  dispatched: { label: "Dispatched", color: "bg-purple-100 text-purple-700", icon: Truck },
  completed: { label: "Completed", color: "bg-gray-100 text-gray-700", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700", icon: AlertTriangle },
}

export default function AggregatorDashboardPage() {
  const { user } = useAuth()
  const { data, isLoading } = useSWR<{ success: boolean; data: SupplyOrder[] }>(
    user?.id ? `/api/supply-orders?aggregator_id=${user.id}` : null,
    fetcher,
    { refreshInterval: 30000 },
  )

  const orders = data?.success ? data.data : []

  // Calculate stats
  const activeOrders = orders.filter((o) => ["assigned", "in_progress"].includes(o.status))
  const readyOrders = orders.filter((o) => o.status === "ready")
  const totalAssigned = orders.reduce((sum, o) => sum + Number(o.assigned_volume_mt), 0)
  const totalCollected = orders.reduce((sum, o) => sum + Number(o.collected_volume_mt), 0)

  const stats = [
    { name: "Active Orders", value: activeOrders.length.toString(), icon: Package, color: "text-blue-600 bg-blue-100" },
    { name: "Ready for Pickup", value: readyOrders.length.toString(), icon: Truck, color: "text-emerald-600 bg-emerald-100" },
    { name: "Total Assigned", value: `${totalAssigned.toFixed(0)} MT`, icon: TrendingUp, color: "text-amber-600 bg-amber-100" },
    { name: "Total Collected", value: `${totalCollected.toFixed(0)} MT`, icon: CheckCircle2, color: "text-primary bg-primary/10" },
  ]

  // Urgent orders (deadline within 7 days and not completed)
  const today = new Date()
  const urgentOrders = orders.filter((o) => {
    if (["completed", "cancelled", "dispatched"].includes(o.status)) return false
    const deadline = new Date(o.delivery_deadline)
    const daysUntil = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntil <= 7
  })

  return (
    <DashboardLayout allowedRoles={["aggregator"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Aggregator Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage supply orders, track collections, and coordinate deliveries
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/aggregator/supply-orders">
              View All Orders
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.name} className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Urgent Orders */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Urgent Orders
                </CardTitle>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  {urgentOrders.length} orders
                </Badge>
              </div>
              <CardDescription>Orders with deadlines within 7 days</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                <div className="text-sm text-muted-foreground py-4 text-center">Loading...</div>
              ) : urgentOrders.length === 0 ? (
                <div className="text-sm text-muted-foreground py-4 text-center">No urgent orders</div>
              ) : (
                urgentOrders.slice(0, 4).map((order) => {
                  const deadline = new Date(order.delivery_deadline)
                  const daysUntil = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                  const progress = order.assigned_volume_mt > 0
                    ? (Number(order.collected_volume_mt) / Number(order.assigned_volume_mt)) * 100
                    : 0

                  return (
                    <Link
                      key={order.id}
                      href={`/dashboard/aggregator/supply-orders/${order.id}`}
                      className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="font-medium text-sm">{order.reference_id}</p>
                          <p className="text-xs text-muted-foreground">
                            {order.crop_type} {order.crop_grade ? `(${order.crop_grade})` : ""}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={daysUntil <= 3 ? "bg-red-50 text-red-700 border-red-200" : "bg-amber-50 text-amber-700 border-amber-200"}
                        >
                          {daysUntil <= 0 ? "Overdue" : `${daysUntil} days left`}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <MapPin className="h-3 w-3" />
                        {order.delivery_location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={progress} className="h-1.5 flex-1" />
                        <span className="text-xs font-medium">
                          {Number(order.collected_volume_mt).toFixed(1)} / {Number(order.assigned_volume_mt).toFixed(1)} MT
                        </span>
                      </div>
                    </Link>
                  )
                })
              )}
            </CardContent>
          </Card>

          {/* Active Supply Orders */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Active Supply Orders</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/aggregator/supply-orders">View All</Link>
                </Button>
              </div>
              <CardDescription>Orders requiring your attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                <div className="text-sm text-muted-foreground py-4 text-center">Loading...</div>
              ) : activeOrders.length === 0 ? (
                <div className="text-sm text-muted-foreground py-4 text-center">No active orders</div>
              ) : (
                activeOrders.slice(0, 4).map((order) => {
                  const config = statusConfig[order.status] || statusConfig.assigned
                  const StatusIcon = config.icon

                  return (
                    <Link
                      key={order.id}
                      href={`/dashboard/aggregator/supply-orders/${order.id}`}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${config.color}`}>
                          <StatusIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{order.reference_id}</p>
                          <p className="text-xs text-muted-foreground">
                            {order.crop_type} - {Number(order.assigned_volume_mt).toFixed(0)} MT
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className={config.color}>
                          {config.label}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {order.allocation_count} allocations
                        </p>
                      </div>
                    </Link>
                  )
                })
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
            <CardDescription>Common tasks for managing your supply orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="justify-start h-auto py-3" asChild>
                <Link href="/dashboard/aggregator/supply-orders?status=assigned">
                  <Package className="h-4 w-4 mr-2 text-blue-600" />
                  <div className="text-left">
                    <p className="font-medium text-sm">New Assignments</p>
                    <p className="text-xs text-muted-foreground">Review and accept</p>
                  </div>
                </Link>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3" asChild>
                <Link href="/dashboard/aggregator/supply-orders?status=in_progress">
                  <Users className="h-4 w-4 mr-2 text-amber-600" />
                  <div className="text-left">
                    <p className="font-medium text-sm">Manage Allocations</p>
                    <p className="text-xs text-muted-foreground">Assign to farmers</p>
                  </div>
                </Link>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3" asChild>
                <Link href="/dashboard/aggregator/collections">
                  <TrendingUp className="h-4 w-4 mr-2 text-emerald-600" />
                  <div className="text-left">
                    <p className="font-medium text-sm">Record Collection</p>
                    <p className="text-xs text-muted-foreground">Log pickup data</p>
                  </div>
                </Link>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3" asChild>
                <Link href="/dashboard/aggregator/supply-orders?status=ready">
                  <Truck className="h-4 w-4 mr-2 text-purple-600" />
                  <div className="text-left">
                    <p className="font-medium text-sm">Ready for Dispatch</p>
                    <p className="text-xs text-muted-foreground">Coordinate pickup</p>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
