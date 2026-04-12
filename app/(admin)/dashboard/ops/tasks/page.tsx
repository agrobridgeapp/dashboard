"use client"

import React, { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Plus,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MoreHorizontal,
  Users,
  ClipboardList,
  Filter,
  Search,
  Eye,
  XCircle,
  RefreshCw,
  Loader2,
  ShieldCheck,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"

interface ServiceEvent {
  id: string
  service_type: string
  status: string
  farmer_id?: string
  farmer_name?: string
  partner_id?: string
  assigned_partner_name?: string
  corridor_id?: string
  corridor_name?: string
  planned_date_start?: string
  planned_date_end?: string
  scheduled_date?: string
  actual_date?: string
  estimated_cost?: number
  actual_cost?: number
  notes?: string
  sla_window_days?: number
  sla_deadline?: string
  is_within_sla?: boolean
  created_at: string
  updated_at?: string
}

const statusStyles: Record<string, { bg: string; text: string }> = {
  planned: { bg: "bg-slate-100", text: "text-slate-700" },
  scheduled: { bg: "bg-blue-100", text: "text-blue-700" },
  in_progress: { bg: "bg-amber-100", text: "text-amber-700" },
  completed: { bg: "bg-emerald-100", text: "text-emerald-700" },
  verified: { bg: "bg-green-100", text: "text-green-700" },
  cancelled: { bg: "bg-gray-100", text: "text-gray-700" },
}

const statusLabels: Record<string, string> = {
  planned: "Planned",
  scheduled: "Scheduled",
  in_progress: "In Progress",
  completed: "Completed",
  verified: "Verified",
  cancelled: "Cancelled",
}

const serviceTypeLabels: Record<string, string> = {
  land_preparation: "Land Preparation",
  land_prep: "Land Preparation",
  planting: "Planting",
  fertilizer_application: "Fertilizer",
  fertilizer: "Fertilizer",
  pest_control: "Pest Control",
  irrigation: "Irrigation",
  harvesting: "Harvesting",
  harvest: "Harvesting",
  transport: "Transport",
  storage: "Storage",
  mechanization: "Mechanization",
  inputs: "Inputs Delivery",
  inspection: "Inspection",
  other: "Other",
}

export default function OpsTasksPage() {
  const [events, setEvents] = useState<ServiceEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<ServiceEvent | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterSla, setFilterSla] = useState<string>("all")
  const { toast } = useToast()

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true)
      const params: any = {}
      if (filterStatus !== "all") params.status = filterStatus
      if (filterSla !== "all") params.sla = filterSla
      const res = await apiClient.serviceEvents.list(params)
      if (res.success) {
        setEvents(res.data || [])
      }
    } catch (err) {
      console.error("Failed to fetch service events:", err)
      toast({ title: "Error", description: "Failed to load tasks", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [filterStatus, filterSla, toast])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  // Filter by search locally
  const filteredEvents = events.filter((ev) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      (ev.service_type || "").toLowerCase().includes(q) ||
      (ev.farmer_name || "").toLowerCase().includes(q) ||
      (ev.assigned_partner_name || "").toLowerCase().includes(q) ||
      (ev.corridor_name || "").toLowerCase().includes(q) ||
      (ev.notes || "").toLowerCase().includes(q)
    )
  })

  // Stats
  const totalEvents = events.length
  const activeEvents = events.filter((e) => !["completed", "verified", "cancelled"].includes(e.status))
  const completedEvents = events.filter((e) => e.status === "completed" || e.status === "verified")
  const overdueEvents = events.filter((e) => e.is_within_sla === false && !["completed", "verified", "cancelled"].includes(e.status))
  const inProgressEvents = events.filter((e) => e.status === "in_progress")

  // Create new service event (ops only)
  const handleCreateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    try {
      const res = await apiClient.serviceEvents.create({
        service_type: formData.get("service_type") as string,
        farmer_id: (formData.get("farmer_id") as string) || undefined,
        planned_date_start: (formData.get("planned_date_start") as string) || undefined,
        planned_date_end: (formData.get("planned_date_end") as string) || undefined,
        estimated_cost: formData.get("estimated_cost") ? Number(formData.get("estimated_cost")) : undefined,
        sla_window_days: formData.get("sla_window_days") ? Number(formData.get("sla_window_days")) : 7,
        notes: (formData.get("notes") as string) || undefined,
      })

      if (res.success) {
        setCreateDialogOpen(false)
        toast({ title: "Task Created", description: "Service event has been created successfully." })
        fetchEvents()
      } else {
        toast({ title: "Error", description: (res as any).error || "Failed to create task", variant: "destructive" })
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to create task", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Verify a completed service event
  const handleVerify = async (eventId: string) => {
    try {
      const res = await apiClient.serviceEvents.verify(eventId, "Verified by ops")
      if (res.success) {
        toast({ title: "Verified", description: "Service event has been verified." })
        setEvents((prev) => prev.map((e) => e.id === eventId ? { ...e, status: "verified" } : e))
      }
    } catch {
      toast({ title: "Error", description: "Failed to verify", variant: "destructive" })
    }
  }

  // Cancel a service event
  const handleCancel = async (eventId: string) => {
    try {
      const res = await apiClient.serviceEvents.cancel(eventId, "Cancelled by ops admin")
      if (res.success) {
        toast({ title: "Cancelled", description: "Service event has been cancelled." })
        setEvents((prev) => prev.map((e) => e.id === eventId ? { ...e, status: "cancelled" } : e))
      }
    } catch {
      toast({ title: "Error", description: "Failed to cancel", variant: "destructive" })
    }
  }

  return (
    <DashboardLayout allowedRoles={["ops_admin", "super_admin"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Task Management</h1>
            <p className="text-muted-foreground">
              Create, manage, and track service events across corridors
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchEvents} disabled={loading} className="bg-transparent">
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-700 hover:bg-emerald-800">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create Service Event</DialogTitle>
                  <DialogDescription>
                    Create a new service event task. Only ops admins can create tasks directly.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateEvent}>
                  <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="service_type">Service Type *</Label>
                        <Select name="service_type" defaultValue="land_preparation">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="land_preparation">Land Preparation</SelectItem>
                            <SelectItem value="planting">Planting</SelectItem>
                            <SelectItem value="fertilizer_application">Fertilizer</SelectItem>
                            <SelectItem value="pest_control">Pest Control</SelectItem>
                            <SelectItem value="irrigation">Irrigation</SelectItem>
                            <SelectItem value="harvesting">Harvesting</SelectItem>
                            <SelectItem value="transport">Transport</SelectItem>
                            <SelectItem value="storage">Storage</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sla_window_days">SLA Window (days)</Label>
                        <Select name="sla_window_days" defaultValue="7">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 day</SelectItem>
                            <SelectItem value="2">2 days</SelectItem>
                            <SelectItem value="3">3 days</SelectItem>
                            <SelectItem value="7">7 days</SelectItem>
                            <SelectItem value="14">14 days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="planned_date_start">Planned Start Date</Label>
                        <Input id="planned_date_start" name="planned_date_start" type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="planned_date_end">Planned End Date</Label>
                        <Input id="planned_date_end" name="planned_date_end" type="date" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="farmer_id">Farmer ID (optional)</Label>
                        <Input id="farmer_id" name="farmer_id" placeholder="e.g., farmer-001" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="estimated_cost">Estimated Cost (₦)</Label>
                        <Input id="estimated_cost" name="estimated_cost" type="number" placeholder="e.g., 50000" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea id="notes" name="notes" placeholder="Task details or instructions..." rows={3} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)} className="bg-transparent">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="bg-emerald-700 hover:bg-emerald-800">
                      {isSubmitting ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Creating...</>
                      ) : (
                        "Create Task"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "…" : totalEvents}</div>
              <p className="text-xs text-muted-foreground">All service events</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "…" : activeEvents.length}</div>
              <p className="text-xs text-muted-foreground">Planned / scheduled / in progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <AlertCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{loading ? "…" : inProgressEvents.length}</div>
              <p className="text-xs text-muted-foreground">Currently being executed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SLA Overdue</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{loading ? "…" : overdueEvents.length}</div>
              <p className="text-xs text-muted-foreground">Past SLA deadline</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{loading ? "…" : completedEvents.length}</div>
              <p className="text-xs text-muted-foreground">Completed &amp; verified</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by service type, farmer, partner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); }}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterSla} onValueChange={(v) => { setFilterSla(v); }}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <SelectValue placeholder="SLA filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All SLA</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="at_risk">At Risk</SelectItem>
              <SelectItem value="on_track">On Track</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Tasks Table */}
        {!loading && (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[180px]">Service</TableHead>
                      <TableHead className="min-w-[130px]">Farmer</TableHead>
                      <TableHead className="min-w-[130px]">Partner</TableHead>
                      <TableHead className="min-w-[100px]">SLA</TableHead>
                      <TableHead className="min-w-[110px]">Status</TableHead>
                      <TableHead className="min-w-[100px]">Cost</TableHead>
                      <TableHead className="text-right min-w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.map((ev) => {
                      const style = statusStyles[ev.status] || statusStyles.planned
                      const isOverdue = ev.is_within_sla === false && !["completed", "verified", "cancelled"].includes(ev.status)

                      return (
                        <TableRow key={ev.id}>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-medium">
                                {serviceTypeLabels[ev.service_type] || (ev.service_type || "").replace(/_/g, " ")}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {ev.corridor_name && (
                                  <span>{ev.corridor_name}</span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {ev.planned_date_start ? new Date(ev.planned_date_start).toLocaleDateString() : new Date(ev.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {ev.farmer_name ? (
                              <div className="flex items-center gap-2">
                                <Users className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm">{ev.farmer_name}</span>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {ev.assigned_partner_name ? (
                              <span className="text-sm">{ev.assigned_partner_name}</span>
                            ) : (
                              <span className="text-xs text-muted-foreground">Unassigned</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {ev.sla_deadline ? (
                              <div>
                                <span className={`text-xs ${isOverdue ? "text-red-600 font-semibold" : "text-muted-foreground"}`}>
                                  {new Date(ev.sla_deadline).toLocaleDateString()}
                                </span>
                                {isOverdue && (
                                  <Badge variant="outline" className="ml-1 bg-red-100 text-red-700 border-red-200 text-xs">
                                    Overdue
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={`${style.bg} ${style.text} border-0`}>
                              {statusLabels[ev.status] || ev.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              ₦{(Number(ev.actual_cost || ev.estimated_cost || 0)).toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="bg-transparent">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => { setSelectedEvent(ev); setViewDialogOpen(true) }}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                {ev.status === "completed" && (
                                  <DropdownMenuItem onClick={() => handleVerify(ev.id)}>
                                    <ShieldCheck className="h-4 w-4 mr-2" />
                                    Verify
                                  </DropdownMenuItem>
                                )}
                                {!["completed", "verified", "cancelled"].includes(ev.status) && (
                                  <DropdownMenuItem onClick={() => handleCancel(ev.id)} className="text-red-600">
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Cancel Task
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    {filteredEvents.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No service events found matching your filters
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* View Details Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Service Event Details</DialogTitle>
              <DialogDescription>View complete task information</DialogDescription>
            </DialogHeader>
            {selectedEvent && (
              <div className="space-y-4 py-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Service Type</p>
                  <p className="text-base capitalize">{serviceTypeLabels[selectedEvent.service_type] || (selectedEvent.service_type || "").replace(/_/g, " ")}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge className={`${(statusStyles[selectedEvent.status] || statusStyles.planned).bg} ${(statusStyles[selectedEvent.status] || statusStyles.planned).text}`}>
                      {statusLabels[selectedEvent.status] || selectedEvent.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">SLA</p>
                    {selectedEvent.sla_deadline ? (
                      <p className={`text-sm ${selectedEvent.is_within_sla === false ? "text-red-600 font-semibold" : ""}`}>
                        {new Date(selectedEvent.sla_deadline).toLocaleDateString()}
                        {selectedEvent.is_within_sla === false && " (Overdue)"}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">—</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Farmer</p>
                    <p className="text-sm">{selectedEvent.farmer_name || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Partner</p>
                    <p className="text-sm">{selectedEvent.assigned_partner_name || "Unassigned"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Planned Start</p>
                    <p className="text-sm">{selectedEvent.planned_date_start ? new Date(selectedEvent.planned_date_start).toLocaleDateString() : "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Planned End</p>
                    <p className="text-sm">{selectedEvent.planned_date_end ? new Date(selectedEvent.planned_date_end).toLocaleDateString() : "—"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Estimated Cost</p>
                    <p className="text-sm">₦{(Number(selectedEvent.estimated_cost || 0)).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Actual Cost</p>
                    <p className="text-sm">{selectedEvent.actual_cost ? `₦${Number(selectedEvent.actual_cost).toLocaleString()}` : "—"}</p>
                  </div>
                </div>
                {selectedEvent.notes && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Notes</p>
                    <p className="text-sm">{selectedEvent.notes}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p className="text-sm">{new Date(selectedEvent.created_at).toLocaleString()}</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewDialogOpen(false)} className="bg-transparent">
                Close
              </Button>
              {selectedEvent?.status === "completed" && (
                <Button onClick={() => { handleVerify(selectedEvent.id); setViewDialogOpen(false) }} className="bg-emerald-700 hover:bg-emerald-800">
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Verify
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
