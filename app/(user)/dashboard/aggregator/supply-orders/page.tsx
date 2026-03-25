"use client"

import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import useSWR from "swr"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState, useMemo } from "react"
import {
  Package,
  Search,
  Calendar,
  MapPin,
  ArrowRight,
  Filter,
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
  created_at: string
}

const statusConfig: Record<string, { label: string; color: string }> = {
  assigned: { label: "New Assignment", color: "bg-blue-100 text-blue-700" },
  in_progress: { label: "In Progress", color: "bg-amber-100 text-amber-700" },
  ready: { label: "Ready", color: "bg-emerald-100 text-emerald-700" },
  dispatched: { label: "Dispatched", color: "bg-purple-100 text-purple-700" },
  completed: { label: "Completed", color: "bg-gray-100 text-gray-700" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700" },
}

export default function SupplyOrdersPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const initialStatus = searchParams.get("status") || "all"

  const [statusFilter, setStatusFilter] = useState(initialStatus)
  const [searchTerm, setSearchTerm] = useState("")

  const { data, isLoading } = useSWR<{ success: boolean; data: SupplyOrder[] }>(
    user?.id ? `/api/supply-orders?aggregator_id=${user.id}` : null,
    fetcher,
    { refreshInterval: 30000 },
  )

  const orders = data?.success ? data.data : []

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = statusFilter === "all" || order.status === statusFilter
      const matchesSearch =
        !searchTerm ||
        order.reference_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.crop_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.delivery_location.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesStatus && matchesSearch
    })
  }, [orders, statusFilter, searchTerm])

  return (
    <DashboardLayout allowedRoles={["aggregator"]}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Supply Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage your assigned supply orders
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by reference, crop, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="assigned">New Assignment</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="dispatched">Dispatched</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Loading supply orders...
              </CardContent>
            </Card>
          ) : filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">
                  {orders.length === 0
                    ? "No supply orders assigned yet"
                    : "No orders match your filters"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => {
              const config = statusConfig[order.status] || statusConfig.assigned
              const progress =
                order.assigned_volume_mt > 0
                  ? (Number(order.collected_volume_mt) / Number(order.assigned_volume_mt)) * 100
                  : 0
              const deadline = new Date(order.delivery_deadline)
              const today = new Date()
              const daysUntil = Math.ceil(
                (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
              )

              return (
                <Card key={order.id} className="hover:border-primary/30 transition-colors">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Order Info */}
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-lg">{order.reference_id}</h3>
                          <Badge variant="outline" className={config.color}>
                            {config.label}
                          </Badge>
                          {daysUntil <= 3 && !["completed", "cancelled", "dispatched"].includes(order.status) && (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              {daysUntil <= 0 ? "Overdue" : `${daysUntil} days left`}
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Package className="h-4 w-4" />
                            {order.crop_type} {order.crop_grade ? `(${order.crop_grade})` : ""}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4" />
                            {order.delivery_location}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            Due: {deadline.toLocaleDateString()}
                          </span>
                        </div>

                        {/* Progress */}
                        <div className="flex items-center gap-3 pt-1">
                          <Progress value={progress} className="h-2 flex-1 max-w-xs" />
                          <span className="text-sm font-medium whitespace-nowrap">
                            {Number(order.collected_volume_mt).toFixed(1)} /{" "}
                            {Number(order.assigned_volume_mt).toFixed(1)} MT
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 lg:flex-col lg:items-end">
                        <div className="text-sm text-muted-foreground text-right hidden lg:block">
                          {order.allocation_count} allocation{order.allocation_count !== 1 ? "s" : ""}
                        </div>
                        <Button asChild>
                          <Link href={`/dashboard/aggregator/supply-orders/${order.id}`}>
                            Manage
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
