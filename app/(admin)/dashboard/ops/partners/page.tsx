"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Star,
  Tractor,
  Package,
  Truck,
  MoreHorizontal,
  CheckCircle,
  Clock,
  Users,
  DollarSign,
  Activity,
  Loader2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"
import { PaginationControls } from "@/components/ui/pagination-controls"

const partnerTypeConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  input_supplier: { label: "Input Supplier", icon: Package, color: "bg-blue-100 text-blue-800" },
  mechanization: { label: "Mechanization", icon: Tractor, color: "bg-green-100 text-green-800" },
  logistics: { label: "Logistics", icon: Truck, color: "bg-orange-100 text-orange-800" },
  storage: { label: "Storage", icon: Package, color: "bg-purple-100 text-purple-800" },
  offtaker: { label: "Offtaker", icon: Users, color: "bg-gray-100 text-gray-800" },
}

type Partner = {
  id: string
  name: string
  type: string
  phone: string
  email: string
  location: string
  status: string
  rating: number
  completedJobs: number
  activeJobs: number
  slaAdherence: number
  coverageArea: string[]
  services: string[]
  joinedDate: string
}

function mapPartner(raw: any): Partner {
  const services = Array.isArray(raw.services_offered)
    ? raw.services_offered
    : typeof raw.services_offered === "string"
    ? JSON.parse(raw.services_offered || "[]")
    : []

  const coverageArea = Array.isArray(raw.coverage_areas)
    ? raw.coverage_areas
    : typeof raw.coverage_areas === "string"
    ? JSON.parse(raw.coverage_areas || "[]")
    : []

  return {
    id: raw.id,
    name: raw.company_name,
    type: raw.partner_type,
    phone: raw.phone || "",
    email: raw.email || "",
    location: raw.state ? `${raw.state}, Nigeria` : raw.address || "",
    status: raw.status,
    rating: Number(raw.average_rating) || 0,
    completedJobs: Number(raw.completed_jobs) || 0,
    activeJobs: 0,
    slaAdherence: Number(raw.sla_adherence_rate) || 0,
    coverageArea,
    services,
    joinedDate: raw.created_at || "",
  }
}

export default function OpsPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [addForm, setAddForm] = useState({ name: "", type: "", phone: "", email: "", location: "" })
  const [addLoading, setAddLoading] = useState(false)

  const fetchPartners = useCallback(async () => {
    try {
      setLoading(true)
      const params: Record<string, string> = {}
      if (typeFilter !== "all") params.type = typeFilter
      if (statusFilter !== "all") params.status = statusFilter
      const res = await apiClient.partners.list(params)
      setPartners((res.data || []).map(mapPartner))
    } catch (err: any) {
      toast.error(err.message || "Failed to load partners")
    } finally {
      setLoading(false)
    }
  }, [typeFilter, statusFilter])

  useEffect(() => {
    fetchPartners()
  }, [fetchPartners])

  useEffect(() => { setPage(1) }, [searchQuery, typeFilter, statusFilter])

  const filteredPartners = partners.filter((partner) => {
    return (
      partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const pagedPartners = filteredPartners.slice((page - 1) * 20, page * 20)

  const stats = {
    total: partners.length,
    active: partners.filter((p) => p.status === "active").length,
    pending: partners.filter((p) => p.status === "pending").length,
  }

  const handleApprovePartner = async (partner: Partner) => {
    try {
      await apiClient.partners.update(partner.id, { status: "active" })
      toast.success(`${partner.name} has been approved and activated`)
      fetchPartners()
    } catch (err: any) {
      toast.error(err.message || "Failed to approve partner")
    }
  }

  const handleDeactivatePartner = async (partner: Partner) => {
    try {
      await apiClient.partners.update(partner.id, { status: "inactive" })
      toast.warning(`${partner.name} has been deactivated`)
      fetchPartners()
      if (selectedPartner?.id === partner.id) setSelectedPartner(null)
    } catch (err: any) {
      toast.error(err.message || "Failed to deactivate partner")
    }
  }

  const handleAddPartner = async () => {
    if (!addForm.name || !addForm.type) {
      toast.error("Partner name and type are required")
      return
    }
    setAddLoading(true)
    try {
      await apiClient.partners.create({
        companyName: addForm.name,
        partnerType: addForm.type,
        phone: addForm.phone,
        email: addForm.email,
        state: addForm.location,
      })
      toast.success("Partner added successfully")
      setShowAddDialog(false)
      setAddForm({ name: "", type: "", phone: "", email: "", location: "" })
      fetchPartners()
    } catch (err: any) {
      toast.error(err.message || "Failed to add partner")
    } finally {
      setAddLoading(false)
    }
  }

  return (
    <DashboardLayout allowedRoles={["ops_admin"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Partners</h1>
            <p className="text-muted-foreground">Manage service providers and track their performance</p>
          </div>
          <Button onClick={() => setShowAddDialog(true)} className="bg-[#1B5E3C] hover:bg-[#154a2f]">
            <Plus className="mr-2 h-4 w-4" />
            Add Partner
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Partners</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "—" : stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{loading ? "—" : stats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{loading ? "—" : stats.pending}</div>
            </CardContent>
          </Card>
        </div>

        {/* SLA Monitoring Card */}
        {!loading && partners.length > 0 && (
          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5" />
                SLA Performance Overview
              </CardTitle>
              <CardDescription>Service Level Agreement adherence across all partners</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Excellent (90%+)</span>
                    <span className="text-sm font-medium text-emerald-600">
                      {partners.filter((p) => p.slaAdherence >= 90).length} partners
                    </span>
                  </div>
                  <Progress
                    value={(partners.filter((p) => p.slaAdherence >= 90).length / partners.length) * 100}
                    className="h-2 [&>div]:bg-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Good (80-89%)</span>
                    <span className="text-sm font-medium text-amber-600">
                      {partners.filter((p) => p.slaAdherence >= 80 && p.slaAdherence < 90).length} partners
                    </span>
                  </div>
                  <Progress
                    value={
                      (partners.filter((p) => p.slaAdherence >= 80 && p.slaAdherence < 90).length / partners.length) *
                      100
                    }
                    className="h-2 [&>div]:bg-amber-500"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Needs Improvement</span>
                    <span className="text-sm font-medium text-red-600">
                      {partners.filter((p) => p.slaAdherence < 80).length} partners
                    </span>
                  </div>
                  <Progress
                    value={(partners.filter((p) => p.slaAdherence < 80).length / partners.length) * 100}
                    className="h-2 [&>div]:bg-red-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search partners..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Partner Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="mechanization">Mechanization</SelectItem>
                  <SelectItem value="input_supplier">Input Supplier</SelectItem>
                  <SelectItem value="logistics">Logistics</SelectItem>
                  <SelectItem value="storage">Storage</SelectItem>
                  <SelectItem value="offtaker">Offtaker</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Partners Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Completed Jobs</TableHead>
                  <TableHead>SLA</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ) : filteredPartners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No partners found
                    </TableCell>
                  </TableRow>
                ) : (
                  pagedPartners.map((partner) => {
                    const typeConfig = partnerTypeConfig[partner.type] ?? partnerTypeConfig.input_supplier
                    const TypeIcon = typeConfig.icon
                    return (
                      <TableRow
                        key={partner.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedPartner(partner)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                              <TypeIcon className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <div className="font-medium">{partner.name}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {partner.location}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={typeConfig.color}>
                            {typeConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              partner.status === "active"
                                ? "default"
                                : partner.status === "pending"
                                  ? "secondary"
                                  : "outline"
                            }
                            className={
                              partner.status === "active"
                                ? "bg-green-100 text-green-800"
                                : partner.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : ""
                            }
                          >
                            {partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {partner.rating > 0 ? (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{partner.rating.toFixed(1)}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{partner.completedJobs}</span>
                        </TableCell>
                        <TableCell>
                          {partner.slaAdherence > 0 ? (
                            <span
                              className={
                                partner.slaAdherence >= 90
                                  ? "text-green-600"
                                  : partner.slaAdherence >= 80
                                    ? "text-yellow-600"
                                    : "text-red-600"
                              }
                            >
                              {partner.slaAdherence}%
                            </span>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedPartner(partner)}>
                                View Details
                              </DropdownMenuItem>
                              {partner.status === "pending" && (
                                <DropdownMenuItem
                                  className="text-green-600"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleApprovePartner(partner)
                                  }}
                                >
                                  Approve Partner
                                </DropdownMenuItem>
                              )}
                              {partner.status === "active" && (
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeactivatePartner(partner)
                                  }}
                                >
                                  Deactivate
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <PaginationControls
          page={page}
          pages={Math.ceil(filteredPartners.length / 20)}
          total={filteredPartners.length}
          limit={20}
          onPageChange={setPage}
        />

        {/* Partner Detail Dialog */}
        <Dialog open={!!selectedPartner} onOpenChange={() => setSelectedPartner(null)}>
          <DialogContent className="max-w-2xl">
            {selectedPartner && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      {(() => {
                        const typeConfig = partnerTypeConfig[selectedPartner.type] ?? partnerTypeConfig.input_supplier
                        const TypeIcon = typeConfig.icon
                        return <TypeIcon className="h-6 w-6 text-muted-foreground" />
                      })()}
                    </div>
                    <div>
                      <DialogTitle>{selectedPartner.name}</DialogTitle>
                      <DialogDescription className="flex items-center gap-2">
                        {(() => {
                          const typeConfig = partnerTypeConfig[selectedPartner.type] ?? partnerTypeConfig.input_supplier
                          return (
                            <Badge variant="secondary" className={typeConfig.color}>
                              {typeConfig.label}
                            </Badge>
                          )
                        })()}
                        <Badge
                          variant={selectedPartner.status === "active" ? "default" : "secondary"}
                          className={
                            selectedPartner.status === "active"
                              ? "bg-green-100 text-green-800"
                              : selectedPartner.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : ""
                          }
                        >
                          {selectedPartner.status.charAt(0).toUpperCase() + selectedPartner.status.slice(1)}
                        </Badge>
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <Tabs defaultValue="overview" className="mt-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="coverage">Coverage</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4 mt-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">Phone</Label>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {selectedPartner.phone || "N/A"}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">Email</Label>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {selectedPartner.email || "N/A"}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-muted-foreground">Location</Label>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {selectedPartner.location || "N/A"}
                        </div>
                      </div>
                      {selectedPartner.joinedDate && (
                        <div className="space-y-1">
                          <Label className="text-muted-foreground">Joined</Label>
                          <div>{new Date(selectedPartner.joinedDate).toLocaleDateString()}</div>
                        </div>
                      )}
                    </div>

                    {selectedPartner.services.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Services Offered</Label>
                        <div className="flex flex-wrap gap-2">
                          {selectedPartner.services.map((service) => (
                            <Badge key={service} variant="outline">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="performance" className="space-y-4 mt-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Rating</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            <span className="text-2xl font-bold">
                              {selectedPartner.rating > 0 ? selectedPartner.rating.toFixed(1) : "N/A"}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">SLA Adherence</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {selectedPartner.slaAdherence > 0 ? `${selectedPartner.slaAdherence}%` : "N/A"}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{selectedPartner.completedJobs}</div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="coverage" className="space-y-4 mt-4">
                    {selectedPartner.coverageArea.length > 0 ? (
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Coverage Areas</Label>
                        <div className="flex flex-wrap gap-2">
                          {selectedPartner.coverageArea.map((area) => (
                            <Badge key={area} variant="secondary">
                              <MapPin className="mr-1 h-3 w-3" />
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">No coverage areas specified.</p>
                    )}
                    <Card className="bg-muted/50">
                      <CardContent className="p-4 text-center text-muted-foreground">
                        Map visualization coming soon
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setSelectedPartner(null)}>
                    Close
                  </Button>
                  {selectedPartner.status === "pending" && (
                    <Button
                      className="bg-[#1B5E3C] hover:bg-[#154a2f]"
                      onClick={() => {
                        handleApprovePartner(selectedPartner)
                        setSelectedPartner(null)
                      }}
                    >
                      Approve Partner
                    </Button>
                  )}
                  {selectedPartner.status === "active" && (
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleDeactivatePartner(selectedPartner)
                      }}
                    >
                      Deactivate
                    </Button>
                  )}
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Partner Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Partner</DialogTitle>
              <DialogDescription>Register a new service provider to the platform</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Partner Name</Label>
                <Input
                  placeholder="Enter partner name"
                  value={addForm.name}
                  onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Partner Type</Label>
                <Select value={addForm.type} onValueChange={(v) => setAddForm((f) => ({ ...f, type: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mechanization">Mechanization</SelectItem>
                    <SelectItem value="input_supplier">Input Supplier</SelectItem>
                    <SelectItem value="logistics">Logistics</SelectItem>
                    <SelectItem value="storage">Storage</SelectItem>
                    <SelectItem value="offtaker">Offtaker</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    placeholder="+234 800 000 0000"
                    value={addForm.phone}
                    onChange={(e) => setAddForm((f) => ({ ...f, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="partner@example.com"
                    value={addForm.email}
                    onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input
                  placeholder="e.g. Kaduna"
                  value={addForm.location}
                  onChange={(e) => setAddForm((f) => ({ ...f, location: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)} disabled={addLoading}>
                Cancel
              </Button>
              <Button className="bg-[#1B5E3C] hover:bg-[#154a2f]" onClick={handleAddPartner} disabled={addLoading}>
                {addLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Partner
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
