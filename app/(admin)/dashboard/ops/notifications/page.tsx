"use client"

import { useState } from "react"
import useSWR from "swr"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Empty } from "@/components/ui/empty"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Search,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  Send,
} from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pending", color: "bg-amber-100 text-amber-800", icon: Clock },
  sent: { label: "Sent", color: "bg-blue-100 text-blue-800", icon: Send },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-800", icon: CheckCircle },
  read: { label: "Read", color: "bg-emerald-100 text-emerald-800", icon: CheckCircle },
  failed: { label: "Failed", color: "bg-red-100 text-red-800", icon: XCircle },
}

const typeLabels: Record<string, string> = {
  SUPPLY_ORDER_ASSIGNED: "Supply Order Assigned",
  PLANNING_INTEREST_SUBMITTED: "Demand Submitted",
  PLANNING_INTEREST_APPROVED: "Demand Approved",
  COLLECTION_REMINDER: "Collection Reminder",
  DELIVERY_CONFIRMATION: "Delivery Confirmed",
  PAYMENT_NOTIFICATION: "Payment Notice",
}

export default function OpsNotificationsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [search, setSearch] = useState("")

  // Build query params
  const params = new URLSearchParams()
  if (statusFilter !== "all") params.set("status", statusFilter)
  if (typeFilter !== "all") params.set("type", typeFilter)
  if (search) params.set("search", search)

  const { data: logsResponse, error: logsError, isLoading: logsLoading, mutate } = useSWR(
    `/api/notifications?${params.toString()}`,
    fetcher,
    { refreshInterval: 30000 }
  )

  const { data: statsResponse, isLoading: statsLoading } = useSWR(
    "/api/notifications/stats",
    fetcher,
    { refreshInterval: 60000 }
  )

  const logs = logsResponse?.data || []
  const stats = {
    total: statsResponse?.data?.total ?? 0,
    delivered: statsResponse?.data?.delivered ?? 0,
    failed: statsResponse?.data?.failed ?? 0,
    pending: statsResponse?.data?.pending ?? 0,
  }

  const handleRetry = async (notificationId: string) => {
    try {
      const res = await fetch(`/api/notifications/${notificationId}/retry`, { method: "POST" })
      if (res.ok) {
        mutate()
      }
    } catch (error) {
      console.error("Retry failed:", error)
    }
  }

  return (
    <DashboardLayout
      title="Notification Center"
      description="Monitor and manage WhatsApp notifications across the platform"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Sent</p>
                      <p className="text-2xl font-bold">{stats.total.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Delivered</p>
                      <p className="text-2xl font-bold text-green-600">{stats.delivered.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-100">
                      <XCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Failed</p>
                      <p className="text-2xl font-bold text-red-600">{stats.failed.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-100">
                      <Clock className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="text-2xl font-bold text-amber-600">{stats.pending.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Delivery Rate */}
        {!statsLoading && stats.total > 0 && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Delivery Rate</p>
                    <p className="text-sm text-muted-foreground">Last 30 days</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">
                    {((stats.delivered / stats.total) * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {stats.delivered} of {stats.total} delivered
                  </p>
                </div>
              </div>
              <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${(stats.delivered / stats.total) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Logs
            </CardTitle>
            <CardDescription>
              View and manage all outbound notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by recipient name or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="SUPPLY_ORDER_ASSIGNED">Supply Order</SelectItem>
                  <SelectItem value="PLANNING_INTEREST_SUBMITTED">Demand Submitted</SelectItem>
                  <SelectItem value="PLANNING_INTEREST_APPROVED">Demand Approved</SelectItem>
                  <SelectItem value="COLLECTION_REMINDER">Collection Reminder</SelectItem>
                  <SelectItem value="DELIVERY_CONFIRMATION">Delivery Confirmed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            {logsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : logsError ? (
              <Card className="border-destructive/50 bg-destructive/5">
                <CardContent className="p-6 text-center">
                  <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
                  <p className="text-destructive font-medium">Failed to load notifications</p>
                </CardContent>
              </Card>
            ) : logs.length === 0 ? (
              <Empty
                icon={Bell}
                title="No notifications yet"
                description="Notifications will appear here when system events trigger WhatsApp messages to users."
              />
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Channel</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sent At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log: any) => {
                      const status = statusConfig[log.status] || statusConfig.pending
                      const StatusIcon = status.icon
                      return (
                        <TableRow key={log.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{log.recipient_name || "Unknown"}</p>
                              <p className="text-sm text-muted-foreground">{log.recipient_phone}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {typeLabels[log.notification_type] || log.notification_type}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {log.channel}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={status.color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {log.sent_at
                                ? new Date(log.sent_at).toLocaleString("en-NG", {
                                    dateStyle: "short",
                                    timeStyle: "short",
                                  })
                                : "—"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            {log.status === "failed" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRetry(log.id)}
                              >
                                <RefreshCw className="h-4 w-4 mr-1" />
                                Retry
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
