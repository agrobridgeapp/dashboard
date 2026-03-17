"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  MoreHorizontal,
  Filter,
  Tractor,
  Package,
  Eye,
  UserPlus,
  RefreshCw,
  Phone,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  Leaf,
  Droplets,
  Bug,
  Truck,
} from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { PaginationControls } from "@/components/ui/pagination-controls"
import type { ServiceEventStatus } from "@/lib/data/types"

type ServiceEvent = {
  id: string
  farmerId: string
  farmer_name?: string
  partner_name?: string
  serviceType: string
  service_type?: string
  status: ServiceEventStatus
  plannedDateStart: string
  plannedDateEnd: string
  scheduled_date?: string
  description?: string
  estimatedCost?: number
  actualCost?: number
  completionNotes?: string
  isWithinSla?: boolean
  assigned_partner_id?: string
  assigned_partner_name?: string
  [key: string]: any
}

const STATUS_CONFIG: Record<
  ServiceEventStatus,
  { label: string; color: string; bgColor: string; icon: typeof Clock; nextStatus?: ServiceEventStatus }
> = {
  planned: {
    label: "Planned",
    color: "text-slate-700",
    bgColor: "bg-slate-100 border-slate-200",
    icon: Clock,
    nextStatus: "scheduled",
  },
  scheduled: {
    label: "Scheduled",
    color: "text-blue-700",
    bgColor: "bg-blue-100 border-blue-200",
    icon: Clock,
    nextStatus: "in_progress",
  },
  in_progress: {
    label: "In Progress",
    color: "text-amber-700",
    bgColor: "bg-amber-100 border-amber-200",
    icon: RefreshCw,
    nextStatus: "completed",
  },
  completed: {
    label: "Completed",
    color: "text-emerald-700",
    bgColor: "bg-emerald-100 border-emerald-200",
    icon: CheckCircle2,
    nextStatus: "verified",
  },
  verified: {
    label: "Verified",
    color: "text-primary",
    bgColor: "bg-primary/10 border-primary/20",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-700",
    bgColor: "bg-red-100 border-red-200",
    icon: AlertTriangle,
  },
}

const SERVICE_TYPE_ICONS: Record<string, typeof Tractor> = {
  land_prep: Tractor,
  planting: Leaf,
  fertilizer: Package,
  pest_control: Bug,
  irrigation: Droplets,
  harvest: Tractor,
  transport: Truck,
  storage: Package,
}

export function OpsServiceRequestsTable() {
  const router = useRouter()

  const [serviceEvents, setServiceEvents] = useState<ServiceEvent[]>([])
  const [farmers, setFarmers] = useState<any[]>([])
  const [partners, setPartners] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(true)

  const fetchData = useCallback(async () => {
    setLoadingData(true)
    try {
      const [eventsRes, farmersRes, partnersRes] = await Promise.all([
        apiClient.serviceEvents.list(),
        apiClient.farmers.list(),
        apiClient.partners.list(),
      ])
      if (eventsRes.success) {
        const events = Array.isArray(eventsRes.data) ? eventsRes.data : []
        setServiceEvents(
          events.map((e: any) => ({
            ...e,
            farmerId: e.farmer_id || e.farmerId || "",
            serviceType: e.service_type || e.serviceType || "",
            plannedDateStart: e.scheduled_date || e.planned_date_start || e.plannedDateStart || "",
            plannedDateEnd: e.scheduled_date || e.planned_date_end || e.plannedDateEnd || "",
          }))
        )
      }
      if (farmersRes.success) setFarmers(Array.isArray(farmersRes.data) ? farmersRes.data : [])
      if (partnersRes.success) setPartners(Array.isArray(partnersRes.data) ? partnersRes.data : [])
    } catch (err) {
      console.error("[OpsServiceRequestsTable] Fetch error:", err)
    } finally {
      setLoadingData(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const updateServiceStatus = async (id: string, status: ServiceEventStatus) => {
    try {
      await apiClient.serviceEvents.update(id, { status })
      setServiceEvents((prev) => prev.map((e) => e.id === id ? { ...e, status } : e))
    } catch (err) {
      console.error("[OpsServiceRequestsTable] Status update error:", err)
    }
  }

  const assignPartnerToService = async (serviceId: string, partnerId: string, partnerName: string) => {
    try {
      await apiClient.serviceEvents.update(serviceId, { assigned_partner_id: partnerId, assigned_partner_name: partnerName })
      setServiceEvents((prev) =>
        prev.map((e) => e.id === serviceId
          ? { ...e, assigned_partner_id: partnerId, partner_name: partnerName }
          : e
        )
      )
    } catch (err) {
      console.error("[OpsServiceRequestsTable] Partner assignment error:", err)
    }
  }

  const getPartnersByServiceType = (_serviceType: string) => partners

  const [filter, setFilter] = useState("all")
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<ServiceEvent | null>(null)
  const [selectedPartner, setSelectedPartner] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<ServiceEventStatus | "">("")
  const [completionNotes, setCompletionNotes] = useState("")
  const [actualCost, setActualCost] = useState("")

  const getFarmerName = (farmerId: string) => {
    const farmer = farmers.find((f) => f.id === farmerId)
    if (farmer) {
      return [
        farmer.first_name || farmer.firstName,
        farmer.last_name || farmer.lastName,
      ].filter(Boolean).join(" ") || farmer.name || "Unknown Farmer"
    }
    return "Unknown Farmer"
  }

  const getFarmerLocation = (farmerId: string) => {
    const farmer = farmers.find((f) => f.id === farmerId)
    return farmer ? `${farmer.village || farmer.lga || farmer.community || ""}`.trim() : ""
  }

  const getFarmerPhone = (farmerId: string) => {
    const farmer = farmers.find((f) => f.id === farmerId)
    return farmer?.phone || ""
  }

  // Filter service events
  const filteredEvents = serviceEvents.filter((e) => {
    const matchesStatus = filter === "all" || e.status === filter
    const matchesType = serviceTypeFilter === "all" || e.serviceType === serviceTypeFilter
    const farmerName = getFarmerName(e.farmerId).toLowerCase()
    const matchesSearch =
      searchQuery === "" ||
      farmerName.includes(searchQuery.toLowerCase()) ||
      (e.id || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.description || "").toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesType && matchesSearch
  })

  // Sort by date (most urgent first)
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const priorityOrder: Record<ServiceEventStatus, number> = {
      planned: 1,
      scheduled: 2,
      in_progress: 3,
      completed: 4,
      verified: 5,
      cancelled: 6,
    }
    if (priorityOrder[a.status] !== priorityOrder[b.status]) {
      return priorityOrder[a.status] - priorityOrder[b.status]
    }
    return new Date(a.plannedDateStart).getTime() - new Date(b.plannedDateStart).getTime()
  })

  // Calculate stats
  const stats = {
    total: serviceEvents.length,
    planned: serviceEvents.filter((e) => e.status === "planned").length,
    scheduled: serviceEvents.filter((e) => e.status === "scheduled").length,
    inProgress: serviceEvents.filter((e) => e.status === "in_progress").length,
    completed: serviceEvents.filter((e) => e.status === "completed").length,
    verified: serviceEvents.filter((e) => e.status === "verified").length,
    overdue: serviceEvents.filter((e) => {
      if (["completed", "verified", "cancelled"].includes(e.status)) return false
      return new Date(e.plannedDateEnd) < new Date()
    }).length,
  }

  const slaAdherence =
    stats.verified > 0 ? Math.round((serviceEvents.filter((e) => e.isWithinSla).length / stats.verified) * 100) : 0

  const handleAssignPartner = async () => {
    if (selectedEvent && selectedPartner) {
      const partner = partners.find((p) => p.id === selectedPartner)
      if (partner) {
        await assignPartnerToService(selectedEvent.id, partner.id, partner.name || partner.companyName || "")
      }
      setAssignDialogOpen(false)
      setSelectedPartner("")
      setSelectedEvent(null)
    }
  }

  const handleUpdateStatus = async () => {
    if (selectedEvent && selectedStatus) {
      const extraData: Record<string, any> = {}

      if (selectedStatus === "completed") {
        extraData.completed_at = new Date().toISOString()
        extraData.notes = completionNotes
        if (actualCost) extraData.actual_cost = Number(actualCost)
        extraData.is_within_sla = new Date() <= new Date(selectedEvent.plannedDateEnd)
      }

      if (selectedStatus === "verified") {
        extraData.verified_at = new Date().toISOString()
      }

      if (selectedStatus === "in_progress") {
        extraData.actual_date = new Date().toISOString().split("T")[0]
      }

      await apiClient.serviceEvents.update(selectedEvent.id, { status: selectedStatus, ...extraData })
      setServiceEvents((prev) =>
        prev.map((e) => e.id === selectedEvent.id ? { ...e, status: selectedStatus, ...extraData } : e)
      )
      setStatusDialogOpen(false)
      setSelectedStatus("")
      setCompletionNotes("")
      setActualCost("")
      setSelectedEvent(null)
    }
  }

  const availablePartnersForService = selectedEvent ? getPartnersByServiceType(selectedEvent.serviceType) : []

  useEffect(() => { setPage(1) }, [filter, serviceTypeFilter, searchQuery])

  const isOverdue = (event: ServiceEvent) => {
    if (["completed", "verified", "cancelled"].includes(event.status)) return false
    return new Date(event.plannedDateEnd) < new Date()
  }

  const getDaysStatus = (event: ServiceEvent) => {
    const today = new Date()
    const startDate = new Date(event.plannedDateStart)
    const endDate = new Date(event.plannedDateEnd)

    if (["completed", "verified"].includes(event.status)) {
      return { text: "Done", variant: "success" as const }
    }

    const daysUntilStart = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    const daysOverdue = Math.ceil((today.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24))

    if (daysOverdue > 0) {
      return { text: `${daysOverdue}d overdue`, variant: "destructive" as const }
    } else if (daysUntilStart > 0) {
      return { text: `In ${daysUntilStart}d`, variant: "outline" as const }
    } else {
      return { text: "Due now", variant: "secondary" as const }
    }
  }

  if (serviceEvents.length === 0) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Service Orchestration</CardTitle>
          <CardDescription>Manage service scheduling, partner assignment, and execution tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Tractor className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No service requests yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Service requests will appear here once farmers are onboarded
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Service Orchestration</CardTitle>
              <CardDescription>Manage service scheduling, partner assignment, and execution tracking</CardDescription>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-4">
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="bg-slate-100 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-slate-700">{stats.planned}</div>
              <div className="text-xs text-slate-600">Planned</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-700">{stats.scheduled}</div>
              <div className="text-xs text-blue-600">Scheduled</div>
            </div>
            <div className="bg-amber-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-amber-700">{stats.inProgress}</div>
              <div className="text-xs text-amber-600">In Progress</div>
            </div>
            <div className="bg-emerald-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-emerald-700">{stats.completed + stats.verified}</div>
              <div className="text-xs text-emerald-600">Completed</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-red-700">{stats.overdue}</div>
              <div className="text-xs text-red-600">Overdue</div>
            </div>
            <div className="bg-primary/5 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-primary">{slaAdherence}%</div>
              <div className="text-xs text-primary/70">SLA Rate</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by farmer, ID, or service..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
              </SelectContent>
            </Select>
            <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Service Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="land_prep">Land Prep</SelectItem>
                <SelectItem value="planting">Planting</SelectItem>
                <SelectItem value="fertilizer">Fertilizer</SelectItem>
                <SelectItem value="pest_control">Pest Control</SelectItem>
                <SelectItem value="harvest">Harvest</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Farmer</TableHead>
                  <TableHead>Window</TableHead>
                  <TableHead>Partner</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedEvents.slice((page - 1) * 20, page * 20).map((event) => {
                  const statusConfig = STATUS_CONFIG[event.status] || STATUS_CONFIG.planned
                  const StatusIcon = statusConfig.icon
                  const ServiceIcon = SERVICE_TYPE_ICONS[event.serviceType] || Package
                  const daysStatus = getDaysStatus(event)

                  return (
                    <TableRow key={event.id} className={isOverdue(event) ? "bg-red-50/50" : undefined}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <ServiceIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{event.description || "Service"}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {(event.serviceType || "").replace("_", " ")}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{getFarmerName(event.farmerId)}</p>
                          <p className="text-xs text-muted-foreground">{getFarmerLocation(event.farmerId)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-xs">
                            {event.plannedDateStart ? new Date(event.plannedDateStart).toLocaleDateString() : "N/A"} -{" "}
                            {event.plannedDateEnd ? new Date(event.plannedDateEnd).toLocaleDateString() : "N/A"}
                          </p>
                          <Badge variant={daysStatus.variant === "success" ? "default" : daysStatus.variant as any} className={`text-xs ${daysStatus.variant === "success" ? "bg-emerald-100 text-emerald-700" : ""}`}>
                            {daysStatus.text}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {event.assignedPartnerName ? (
                          <span className="text-sm">{event.assignedPartnerName}</span>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs bg-transparent"
                            onClick={() => {
                              setSelectedEvent(event)
                              setAssignDialogOpen(true)
                            }}
                          >
                            <UserPlus className="h-3 w-3 mr-1" />
                            Assign
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>₦{(event.estimatedCost || 0).toLocaleString()}</p>
                          {event.actualCost && (
                            <p className="text-xs text-muted-foreground">
                              Actual: ₦{event.actualCost.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusConfig.bgColor}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedEvent(event)
                                setDetailDialogOpen(true)
                              }}
                              className="cursor-pointer"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {!event.assignedPartnerId && (
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedEvent(event)
                                  setAssignDialogOpen(true)
                                }}
                                className="cursor-pointer"
                              >
                                <UserPlus className="h-4 w-4 mr-2" />
                                Assign Partner
                              </DropdownMenuItem>
                            )}
                            {statusConfig.nextStatus && (
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedEvent(event)
                                  setSelectedStatus(statusConfig.nextStatus!)
                                  setStatusDialogOpen(true)
                                }}
                                className="cursor-pointer"
                              >
                                <ArrowUpRight className="h-4 w-4 mr-2" />
                                Move to {STATUS_CONFIG[statusConfig.nextStatus!].label}
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                const phone = getFarmerPhone(event.farmerId)
                                if (phone) window.open(`tel:${phone}`)
                              }}
                              className="cursor-pointer"
                            >
                              <Phone className="h-4 w-4 mr-2" />
                              Contact Farmer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {sortedEvents.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No services match your filters</div>
          )}
          <PaginationControls
            page={page}
            pages={Math.ceil(sortedEvents.length / 20)}
            total={sortedEvents.length}
            limit={20}
            onPageChange={setPage}
            className="mt-4"
          />
        </CardContent>
      </Card>

      {/* Assign Partner Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Partner</DialogTitle>
            <DialogDescription>
              Select a partner to handle {selectedEvent?.description || "this service"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Available Partners</Label>
              {availablePartnersForService.length > 0 ? (
                <Select value={selectedPartner} onValueChange={setSelectedPartner}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a partner" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePartnersForService.map((partner) => (
                      <SelectItem key={partner.id} value={partner.id}>
                        {partner.companyName} - {partner.rating || 0}/5 rating
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm text-muted-foreground">No partners available for this service type</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignPartner} disabled={!selectedPartner}>
              Assign Partner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Service Status</DialogTitle>
            <DialogDescription>
              Move {selectedEvent?.description || "service"} to{" "}
              {selectedStatus ? STATUS_CONFIG[selectedStatus]?.label : "next status"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedStatus === "completed" && (
              <>
                <div className="space-y-2">
                  <Label>Completion Notes</Label>
                  <Textarea
                    placeholder="Enter any notes about the completion..."
                    value={completionNotes}
                    onChange={(e) => setCompletionNotes(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Actual Cost (₦)</Label>
                  <Input
                    type="number"
                    placeholder="Enter actual cost"
                    value={actualCost}
                    onChange={(e) => setActualCost(e.target.value)}
                  />
                </div>
              </>
            )}
            {selectedStatus === "verified" && (
              <p className="text-sm text-muted-foreground">
                Verifying this service confirms the work was completed satisfactorily.
              </p>
            )}
            {selectedStatus === "in_progress" && (
              <p className="text-sm text-muted-foreground">This will mark the service as currently being executed.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Service Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.description || "Service Details"}</DialogTitle>
            <DialogDescription>{selectedEvent?.serviceType?.replace("_", " ")} service details</DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Farmer</p>
                  <p className="font-medium">{getFarmerName(selectedEvent.farmerId)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{getFarmerLocation(selectedEvent.farmerId) || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Planned Window</p>
                  <p className="font-medium">
                    {selectedEvent.plannedDateStart
                      ? new Date(selectedEvent.plannedDateStart).toLocaleDateString()
                      : "N/A"}{" "}
                    -{" "}
                    {selectedEvent.plannedDateEnd ? new Date(selectedEvent.plannedDateEnd).toLocaleDateString() : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="outline" className={STATUS_CONFIG[selectedEvent.status]?.bgColor || ""}>
                    {STATUS_CONFIG[selectedEvent.status]?.label || selectedEvent.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Cost</p>
                  <p className="font-medium">₦{(selectedEvent.estimatedCost || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Assigned Partner</p>
                  <p className="font-medium">{selectedEvent.assignedPartnerName || "Unassigned"}</p>
                </div>
              </div>
              {selectedEvent.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm mt-1">{selectedEvent.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
