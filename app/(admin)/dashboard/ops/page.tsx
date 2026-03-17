"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { DemoWatermark } from "@/components/demo/demo-watermark"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { OpsZonesMap } from "@/components/dashboard/ops/ops-zones-map"
import { OpsPlatformHealth } from "@/components/dashboard/ops/ops-platform-health"
import { OpsDataQualityMonitor } from "@/components/dashboard/ops/ops-data-quality-monitor"
import { toast } from "sonner"
import { api } from "@/lib/api"
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Users,
  Phone,
  MapPin,
  Calendar,
  ChevronRight,
  Search,
  Filter,
  RefreshCw,
  Tractor,
  Leaf,
  Droplets,
  Package,
  Truck,
  UserCheck,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  FileCheck,
  Headset,
} from "lucide-react"

const serviceIcons: Record<string, typeof Tractor> = {
  "Land Preparation": Tractor,
  Planting: Leaf,
  "Fertilizer Application": Package,
  Spraying: Droplets,
  "Irrigation Setup": Droplets,
  Harvest: Truck,
}

const corridors = ["Zaria", "Giwa", "Sabon Gari", "Kaduna South", "Igabi"]

export default function OpsDashboardPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [corridorFilter, setCorridorFilter] = useState("all")
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<any>(null)
  const [selectedPartner, setSelectedPartner] = useState("")
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [loading, setLoading] = useState(true)

  const [pendingServices, setPendingServices] = useState<any[]>([])
  const [overdueServices, setOverdueServices] = useState<any[]>([])
  const [fieldAgents, setFieldAgents] = useState<any[]>([])
  const [partners, setPartners] = useState<any[]>([])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [serviceEventsRes, agentsRes, partnersRes] = await Promise.all([
        api.serviceEvents.list({ status: "planned" } as any),
        api.agents.list(),
        api.partners.list(),
      ])

      const now = new Date()

      if (serviceEventsRes.success) {
        const events = Array.isArray(serviceEventsRes.data)
          ? serviceEventsRes.data
          : (serviceEventsRes as any).events || []
        const overdue = events.filter((e: any) => {
          if (!e.scheduled_date) return false
          const scheduledDate = new Date(e.scheduled_date)
          return scheduledDate < now && e.status !== "completed" && e.status !== "cancelled"
        })
        const pending = events.filter((e: any) => {
          if (!e.scheduled_date) return true
          const scheduledDate = new Date(e.scheduled_date)
          return scheduledDate >= now
        })

        const toServiceRow = (e: any) => {
          const scheduledDate = e.scheduled_date ? new Date(e.scheduled_date) : null
          const daysUntil = scheduledDate
            ? Math.ceil((scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
            : 0
          const daysOverdue = scheduledDate
            ? Math.ceil((now.getTime() - scheduledDate.getTime()) / (1000 * 60 * 60 * 24))
            : 0

          return {
            id: e.id,
            farmer: e.farmer_name || e.farmerId || "Unknown Farmer",
            phone: e.phone || "",
            village: e.village || e.location || "",
            crop: e.crop_type || e.service_type || "",
            service: e.service_type || e.crop_type || "",
            dueDate: e.scheduled_date || "",
            daysUntil,
            daysOverdue,
            hectares: e.area_hectares || e.hectares || 0,
            partner: e.assigned_partner_name || null,
            priority: daysUntil <= 0 ? "critical" : daysUntil <= 1 ? "high" : "medium",
            reason: e.notes || "",
          }
        }

        setOverdueServices(overdue.map(toServiceRow))
        setPendingServices(pending.map(toServiceRow))
      }

      if (agentsRes.success) {
        const agentList = Array.isArray(agentsRes.data) ? agentsRes.data : []
        setFieldAgents(
          agentList.map((a: any) => ({
            id: a.id,
            name: [a.first_name, a.last_name].filter(Boolean).join(" ") || a.firstname || "(Unknown)",
            phone: a.phone || "",
            corridor: Array.isArray(a.assigned_corridors)
              ? a.assigned_corridors[0]
              : a.corridor || "",
            farmersAssigned: a.farmer_count || a.activeFarmerCount || 0,
            tasksToday: a.tasks_today || 0,
            tasksCompleted: a.tasks_completed || 0,
            status: a.status || "active",
            lastActivity: a.updated_at ? new Date(a.updated_at).toLocaleString() : "Unknown",
            location: a.lga || a.community || "",
          })),
        )
      }

      if (partnersRes.success) {
        const partnerList = Array.isArray(partnersRes.data) ? partnersRes.data : []
        setPartners(
          partnerList.map((p: any) => ({
            id: p.id,
            name: p.name || p.company_name || "(Unknown)",
            type: p.service_type || p.type || "Multi-service",
            rating: p.rating || 4.0,
          })),
        )
      }
    } catch (err) {
      console.error("[OpsDashboard] Fetch error:", err)
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
      setLastRefresh(new Date())
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleRefresh = () => fetchData()

  const handleAssignPartner = (service: any) => {
    setSelectedService(service)
    setAssignDialogOpen(true)
  }

  const confirmAssignment = async () => {
    if (!selectedService || !selectedPartner) return
    try {
      await api.serviceEvents.update(selectedService.id, { assigned_partner_id: selectedPartner })
      toast.success("Partner assigned successfully")
      setAssignDialogOpen(false)
      setSelectedService(null)
      setSelectedPartner("")
      fetchData()
    } catch (err: any) {
      toast.error(err.message || "Failed to assign partner")
    }
  }

  const handleCall = (phone: string, name: string) => {
    toast.success(`Calling ${name} at ${phone}`)
  }

  // Computed stats
  const totalPending = pendingServices.length
  const totalOverdue = overdueServices.length
  const dueToday = pendingServices.filter((s) => s.daysUntil === 0).length
  const unassigned = [...pendingServices, ...overdueServices].filter((s) => !s.partner).length
  const activeAgents = fieldAgents.filter((a) => a.status === "active").length
  const totalTasksToday = fieldAgents.reduce((sum, a) => sum + (a.tasksToday || 0), 0)
  const completedTasksToday = fieldAgents.reduce((sum, a) => sum + (a.tasksCompleted || 0), 0)
  const completionRate = totalTasksToday > 0 ? Math.round((completedTasksToday / totalTasksToday) * 100) : 0

  const [pendingServiceApprovals, setPendingServiceApprovals] = useState<any[]>([
    {
      id: "SR-003",
      agent: "Musa Ibrahim",
      farmer: "Yusuf Abdullahi",
      service: "Combined Package (Plowing + Planting + Inputs)",
      estimatedCost: 125000,
      urgency: "urgent",
      submittedAt: "2 hours ago",
      state: "Kaduna",
      reason: "Large farm preparation, farmer secured partial payment from cooperative",
    },
    {
      id: "SR-004",
      agent: "Blessing Okafor",
      farmer: "Hassan Ibrahim",
      service: "Full Mechanization Package",
      estimatedCost: 180000,
      urgency: "high",
      submittedAt: "5 hours ago",
      state: "Kaduna",
      reason: "Commercial farm expansion, requires immediate approval for seasonal timing",
    },
  ])
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [selectedApproval, setSelectedApproval] = useState<any>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [selectedApprovalForAssign, setSelectedApprovalForAssign] = useState<any>(null)
  const [selectedAgentForApproval, setSelectedAgentForApproval] = useState("")

  const handleApproveHighValueRequest = (request: any) => {
    setSelectedApprovalForAssign(request)
    setApproveDialogOpen(true)
  }

  const confirmApproveAndAssign = () => {
    if (selectedApprovalForAssign && selectedAgentForApproval) {
      setPendingServiceApprovals((prev) => prev.filter((r) => r.id !== selectedApprovalForAssign.id))
      const agent = fieldAgents.find((a) => a.id === selectedAgentForApproval)
      toast.success(`Request approved and assigned to ${agent?.name}`)
      setApproveDialogOpen(false)
      setSelectedApprovalForAssign(null)
      setSelectedAgentForApproval("")
    }
  }

  const handleRejectHighValueRequest = (request: any) => {
    setSelectedApproval(request)
    setRejectDialogOpen(true)
  }

  const confirmReject = () => {
    if (selectedApproval) {
      setPendingServiceApprovals((prev) => prev.filter((r) => r.id !== selectedApproval.id))
      toast.error(`Service request rejected: ${rejectReason || "No reason provided"}`)
      setRejectDialogOpen(false)
      setSelectedApproval(null)
      setRejectReason("")
    }
  }

  const pendingApprovals = pendingServiceApprovals.length

  const filteredServices = <T extends { corridor?: string; village?: string; farmer?: string }>(list: T[]) =>
    list.filter((s) => {
      const matchSearch =
        !searchTerm ||
        (s.farmer || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.village || "").toLowerCase().includes(searchTerm.toLowerCase())
      const matchCorridor = corridorFilter === "all" || (s.corridor || "").toLowerCase() === corridorFilter
      return matchSearch && matchCorridor
    })

  return (
    <DashboardLayout allowedRoles={["ops_admin"]}>
      <DemoWatermark />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Daily Operations</h1>
            <p className="text-sm text-muted-foreground">Last updated: {lastRefresh.toLocaleTimeString()}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2 bg-transparent">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-6">
          <Card className={`border-2 ${totalOverdue > 0 ? "border-red-500 bg-red-50" : "border-border"}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${totalOverdue > 0 ? "bg-red-100" : "bg-muted"}`}>
                  <AlertTriangle className={`h-5 w-5 ${totalOverdue > 0 ? "text-red-600" : "text-muted-foreground"}`} />
                </div>
                <div>
                  {loading ? <Skeleton className="h-8 w-10" /> : <p className={`text-2xl font-bold ${totalOverdue > 0 ? "text-red-600" : ""}`}>{totalOverdue}</p>}
                  <p className="text-xs text-muted-foreground">Overdue</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`border ${dueToday > 0 ? "border-amber-300 bg-amber-50" : "border-border"}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${dueToday > 0 ? "bg-amber-100" : "bg-muted"}`}>
                  <Clock className={`h-5 w-5 ${dueToday > 0 ? "text-amber-600" : "text-muted-foreground"}`} />
                </div>
                <div>
                  {loading ? <Skeleton className="h-8 w-10" /> : <p className={`text-2xl font-bold ${dueToday > 0 ? "text-amber-600" : ""}`}>{dueToday}</p>}
                  <p className="text-xs text-muted-foreground">Due Today</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Tractor className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  {loading ? <Skeleton className="h-8 w-10" /> : <p className="text-2xl font-bold">{totalPending}</p>}
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`border ${unassigned > 0 ? "border-purple-300 bg-purple-50" : "border-border"}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${unassigned > 0 ? "bg-purple-100" : "bg-muted"}`}>
                  <UserCheck className={`h-5 w-5 ${unassigned > 0 ? "text-purple-600" : "text-muted-foreground"}`} />
                </div>
                <div>
                  {loading ? <Skeleton className="h-8 w-10" /> : <p className={`text-2xl font-bold ${unassigned > 0 ? "text-purple-600" : ""}`}>{unassigned}</p>}
                  <p className="text-xs text-muted-foreground">Unassigned</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`border ${pendingApprovals > 0 ? "border-blue-300 bg-blue-50" : "border-border"}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${pendingApprovals > 0 ? "bg-blue-100" : "bg-muted"}`}
                >
                  <FileCheck
                    className={`h-5 w-5 ${pendingApprovals > 0 ? "text-blue-600" : "text-muted-foreground"}`}
                  />
                </div>
                <div>
                  {loading ? <Skeleton className="h-8 w-10" /> : <p className={`text-2xl font-bold ${pendingApprovals > 0 ? "text-blue-600" : ""}`}>{pendingApprovals}</p>}
                  <p className="text-xs text-muted-foreground">Approvals</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <FileCheck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  {loading ? <Skeleton className="h-8 w-10" /> : <p className="text-2xl font-bold">{activeAgents}</p>}
                  <p className="text-xs text-muted-foreground">Active Agents</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${completionRate >= 80 ? "bg-emerald-100" : "bg-amber-100"}`}>
                  {completionRate >= 80 ? (
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-amber-600" />
                  )}
                </div>
                <div>
                  {loading ? <Skeleton className="h-8 w-10" /> : <p className={`text-2xl font-bold ${completionRate >= 80 ? "text-emerald-600" : "text-amber-600"}`}>{completionRate}%</p>}
                  <p className="text-xs text-muted-foreground">Task Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Health */}
        <OpsPlatformHealth
          corridors={corridors}
          services={[...pendingServices, ...overdueServices]}
          contracts={[]}
          alerts={[]}
        />

        {/* Data Quality */}
        <OpsDataQualityMonitor issues={[]} />

        {/* Map */}
        <OpsZonesMap />

        {/* Pending Service Request Approvals */}
        {pendingServiceApprovals.length > 0 && (
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-blue-600" />
                    Pending Service Request Approvals
                  </CardTitle>
                  <CardDescription>
                    High-value requests requiring regional manager approval (Over ₦100,000)
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                  {pendingApprovals} pending
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingServiceApprovals.map((request) => (
                  <Card key={request.id} className="border-border bg-white">
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                            <Headset className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{request.service}</span>
                              <Badge
                                variant={request.urgency === "urgent" ? "destructive" : "default"}
                                className="text-xs"
                              >
                                {request.urgency}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                ₦{request.estimatedCost.toLocaleString()}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Agent: {request.agent} • Farmer: {request.farmer}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {request.state}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {request.submittedAt}
                              </span>
                            </div>
                            <p className="text-xs text-blue-700 mt-1">{request.reason}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleRejectHighValueRequest(request)}>
                            Reject
                          </Button>
                          <Button size="sm" onClick={() => handleApproveHighValueRequest(request)}>
                            Approve & Assign
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Tabs */}
        <Tabs defaultValue="overdue" className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList>
              <TabsTrigger value="overdue" className="gap-2">
                <AlertTriangle className="h-4 w-4" />
                Overdue
                {totalOverdue > 0 && (
                  <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                    {totalOverdue}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="pending" className="gap-2">
                <Clock className="h-4 w-4" />
                Pending
                <Badge variant="secondary" className="ml-1">
                  {totalPending}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="agents" className="gap-2">
                <Users className="h-4 w-4" />
                Field Agents
                <Badge variant="secondary" className="ml-1">
                  {activeAgents}/{fieldAgents.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search farmer, village..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-[200px]"
                />
              </div>
              <Select value={corridorFilter} onValueChange={setCorridorFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Corridor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Corridors</SelectItem>
                  {corridors.map((c) => (
                    <SelectItem key={c} value={c.toLowerCase().replace(" ", "-")}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Overdue Tab */}
          <TabsContent value="overdue" className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
            ) : overdueServices.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-4" />
                  <p className="text-lg font-medium">No overdue services</p>
                  <p className="text-sm text-muted-foreground">All services are on track</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredServices(overdueServices).map((service) => {
                  const ServiceIcon = serviceIcons[service.service] || Tractor
                  return (
                    <Card key={service.id} className="border-red-200 bg-red-50/50">
                      <CardContent className="p-4">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                              <ServiceIcon className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{service.farmer}</span>
                                <Badge variant="destructive" className="text-xs">
                                  {service.daysOverdue} days overdue
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {service.service} • {service.hectares} ha • {service.crop}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {service.village}
                                </span>
                                {service.dueDate && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Due: {new Date(service.dueDate).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                              {service.reason && (
                                <p className="text-xs text-red-600 font-medium">
                                  <AlertCircle className="h-3 w-3 inline mr-1" />
                                  {service.reason}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 lg:flex-col lg:items-end">
                            {service.partner ? (
                              <Badge variant="outline" className="bg-white">
                                {service.partner}
                              </Badge>
                            ) : (
                              <Button size="sm" onClick={() => handleAssignPartner(service)} className="bg-red-600 hover:bg-red-700">
                                Assign Partner
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" className="gap-1" onClick={() => handleCall(service.phone, service.farmer)}>
                              <Phone className="h-4 w-4" />
                              Call
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* Pending Tab */}
          <TabsContent value="pending" className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
            ) : (
              <div className="space-y-3">
                {filteredServices(pendingServices).map((service) => {
                  const ServiceIcon = serviceIcons[service.service] || Tractor
                  const isDueToday = service.daysUntil === 0
                  const isDueSoon = service.daysUntil <= 2
                  return (
                    <Card key={service.id} className={`border ${isDueToday ? "border-amber-300 bg-amber-50/50" : isDueSoon ? "border-amber-200" : "border-border"}`}>
                      <CardContent className="p-4">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex items-start gap-4">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${isDueToday ? "bg-amber-100" : "bg-muted"}`}>
                              <ServiceIcon className={`h-6 w-6 ${isDueToday ? "text-amber-600" : "text-muted-foreground"}`} />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{service.farmer}</span>
                                {isDueToday ? (
                                  <Badge className="bg-amber-500 text-xs">Due Today</Badge>
                                ) : (
                                  <Badge variant="secondary" className="text-xs">
                                    {service.daysUntil} days
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {service.service} • {service.hectares} ha • {service.crop}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                {service.village && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {service.village}
                                  </span>
                                )}
                                {service.dueDate && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(service.dueDate).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {service.partner ? (
                              <Badge variant="outline" className="bg-white">
                                <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-500" />
                                {service.partner}
                              </Badge>
                            ) : (
                              <Button size="sm" variant="outline" onClick={() => handleAssignPartner(service)}>
                                Assign Partner
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" onClick={() => handleCall(service.phone, service.farmer)}>
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* Field Agents Tab */}
          <TabsContent value="agents" className="space-y-4">
            {loading ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
              </div>
            ) : fieldAgents.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No field agents found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {fieldAgents.map((agent) => {
                  const taskProgress = agent.tasksToday > 0 ? Math.round((agent.tasksCompleted / agent.tasksToday) * 100) : 0
                  const isIdle = agent.status === "idle"
                  const isBehind = taskProgress < 50 && !isIdle
                  return (
                    <Card key={agent.id} className={`border ${isBehind ? "border-amber-300" : "border-border"}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isIdle ? "bg-slate-100" : isBehind ? "bg-amber-100" : "bg-emerald-100"}`}>
                              <Users className={`h-5 w-5 ${isIdle ? "text-slate-500" : isBehind ? "text-amber-600" : "text-emerald-600"}`} />
                            </div>
                            <div>
                              <p className="font-semibold">{agent.name}</p>
                              <p className="text-xs text-muted-foreground">{agent.corridor ? `${agent.corridor} Corridor` : "No corridor"}</p>
                            </div>
                          </div>
                          <Badge variant={isIdle ? "secondary" : "default"} className={isIdle ? "" : "bg-emerald-500"}>
                            {agent.status}
                          </Badge>
                        </div>

                        <div className="space-y-2 mb-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Today&apos;s Tasks</span>
                            <span className="font-medium">{agent.tasksCompleted}/{agent.tasksToday}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${isIdle ? "bg-slate-400" : taskProgress >= 80 ? "bg-emerald-500" : taskProgress >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                              style={{ width: `${taskProgress}%` }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {agent.farmersAssigned} farmers
                          </div>
                          {agent.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {agent.location}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t">
                          <span className="text-xs text-muted-foreground">Last active: {agent.lastActivity}</span>
                          {agent.phone && (
                            <Button variant="ghost" size="sm" className="h-7 gap-1" onClick={() => handleCall(agent.phone, agent.name)}>
                              <Phone className="h-3 w-3" />
                              Call
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Assign Partner Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Partner</DialogTitle>
            <DialogDescription>
              Select a partner for {selectedService?.service} - {selectedService?.farmer}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              {partners.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No partners available</p>
              ) : (
                partners.map((partner) => (
                  <div
                    key={partner.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedPartner === partner.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedPartner(partner.id)}
                  >
                    <div>
                      <p className="font-medium">{partner.name}</p>
                      <p className="text-sm text-muted-foreground">{partner.type}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-amber-500">★</span>
                      {partner.rating}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmAssignment} disabled={!selectedPartner}>Assign Partner</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
