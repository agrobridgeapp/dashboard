"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { useDataStore } from "@/lib/data/data-store"
import { PaginationControls } from "@/components/ui/pagination-controls"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import {
  Search,
  Filter,
  Download,
  Eye,
  Phone,
  MapPin,
  Wheat,
  Calendar,
  TrendingUp,
  Users,
  Layers,
  CheckCircle,
} from "lucide-react"

export default function OpsFarmersPage() {
  const dataStore = useDataStore()
  const farmers = Array.isArray(dataStore?.farmers) ? dataStore.farmers : []
  const landPlots = Array.isArray(dataStore?.landPlots) ? dataStore.landPlots : []
  const cropCycles = Array.isArray(dataStore?.cropCycles) ? dataStore.cropCycles : []
  const corridors = Array.isArray(dataStore?.corridors) ? dataStore.corridors : []
  const serviceEvents = Array.isArray(dataStore?.serviceEvents) ? dataStore.serviceEvents : []

  const [searchTerm, setSearchTerm] = useState("")
  const [corridorFilter, setCorridorFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedFarmer, setSelectedFarmer] = useState<(typeof farmers)[0] | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => { setPage(1) }, [searchTerm, corridorFilter, statusFilter])

  const LIMIT = 20
  const filteredFarmers = farmers.filter((farmer) => {
    const matchesSearch =
      (farmer?.firstName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (farmer?.lastName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (farmer?.phone || "").includes(searchTerm)
    const matchesCorridor = corridorFilter === "all" || farmer?.corridorId === corridorFilter
    const matchesStatus = statusFilter === "all" || farmer?.status === statusFilter
    return matchesSearch && matchesCorridor && matchesStatus
  })

  const pagedFarmers = filteredFarmers.slice((page - 1) * LIMIT, page * LIMIT)
  const getFarmerLandPlots = (farmerId: string) => landPlots.filter((lp) => lp?.farmerId === farmerId)
  const getFarmerCropCycles = (farmerId: string) => cropCycles.filter((cc) => cc?.farmerId === farmerId)
  const getFarmerServices = (farmerId: string) => {
    const farmerCycles = getFarmerCropCycles(farmerId)
    return serviceEvents.filter((se) => farmerCycles.some((cc) => cc?.id === se?.cropCycleId))
  }
  const getCorridorName = (corridorId: string) => corridors.find((c) => c?.id === corridorId)?.name || "Unknown"

  const totalHectares = landPlots.reduce((sum, lp) => sum + (lp?.size || 0), 0)
  const activeFarmers = farmers.filter((f) => f?.status === "active").length
  const pendingFarmers = farmers.filter((f) => f?.status === "pending_verification").length
  const activeCropCycles = cropCycles.filter((cc) => cc?.status === "active").length

  const handleExport = () => {
    toast.success("Exporting farmer data...")
    // In production: generate CSV/Excel export
  }

  return (
    <DashboardLayout role="ops_admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Farmer Directory</h1>
          <p className="text-muted-foreground">Manage and view all registered farmers across corridors</p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Farmers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(farmers.length || 0).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{activeFarmers} active</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Hectares</CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(totalHectares || 0).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Across all corridors</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingFarmers}</div>
              <p className="text-xs text-muted-foreground">Awaiting KYC approval</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Crop Cycles</CardTitle>
              <Wheat className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCropCycles}</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Farmers</CardTitle>
            <CardDescription>View and manage farmer profiles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
              <div className="flex flex-1 gap-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={corridorFilter} onValueChange={setCorridorFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Corridor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Corridors</SelectItem>
                    {corridors.map((corridor) => (
                      <SelectItem key={corridor?.id || Math.random()} value={corridor?.id || ""}>
                        {corridor?.name || "Unknown"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending_verification">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Farmer</TableHead>
                    <TableHead>Corridor</TableHead>
                    <TableHead>Land (Ha)</TableHead>
                    <TableHead>Crop Cycles</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFarmers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No farmers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    pagedFarmers.map((farmer) => {
                      const farmerPlots = getFarmerLandPlots(farmer?.id || "")
                      const farmerCycles = getFarmerCropCycles(farmer?.id || "")
                      const totalLand = farmerPlots.reduce((sum, lp) => sum + (lp?.size || 0), 0)

                      return (
                        <TableRow key={farmer?.id || Math.random()}>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {farmer?.firstName || ""} {farmer?.lastName || ""}
                              </p>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Phone className="h-3 w-3" /> {farmer?.phone || "N/A"}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              {getCorridorName(farmer?.corridorId || "")}
                            </div>
                          </TableCell>
                          <TableCell>{totalLand.toFixed(1)}</TableCell>
                          <TableCell>{farmerCycles.length}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                farmer?.status === "active"
                                  ? "default"
                                  : farmer?.status === "pending_verification"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {(farmer?.status || "unknown").replace(/_/g, " ")}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedFarmer(farmer)}>
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>
                                    {farmer?.firstName || ""} {farmer?.lastName || ""}
                                  </DialogTitle>
                                  <DialogDescription>Farmer Profile</DialogDescription>
                                </DialogHeader>
                                <Tabs defaultValue="overview" className="mt-4">
                                  <TabsList>
                                    <TabsTrigger value="overview">Overview</TabsTrigger>
                                    <TabsTrigger value="land">Land Plots</TabsTrigger>
                                    <TabsTrigger value="cycles">Crop Cycles</TabsTrigger>
                                    <TabsTrigger value="services">Services</TabsTrigger>
                                  </TabsList>
                                  <TabsContent value="overview" className="space-y-4 mt-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm text-muted-foreground">Phone</p>
                                        <p className="font-medium">{farmer?.phone || "N/A"}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-muted-foreground">Email</p>
                                        <p className="font-medium">{farmer?.email || "N/A"}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-muted-foreground">Corridor</p>
                                        <p className="font-medium">{getCorridorName(farmer?.corridorId || "")}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-muted-foreground">Cluster</p>
                                        <p className="font-medium">{farmer?.cluster || "N/A"}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-muted-foreground">Total Land</p>
                                        <p className="font-medium">{totalLand.toFixed(1)} Ha</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-muted-foreground">Status</p>
                                        <Badge variant={farmer?.status === "active" ? "default" : "secondary"}>
                                          {(farmer?.status || "unknown").replace(/_/g, " ")}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">KYC Status</p>
                                      <div className="flex items-center gap-2 mt-1">
                                        {farmer?.kycStatus === "verified" ? (
                                          <Badge className="bg-primary">
                                            <CheckCircle className="h-3 w-3 mr-1" /> Verified
                                          </Badge>
                                        ) : (
                                          <Badge variant="secondary">{farmer?.kycStatus || "pending"}</Badge>
                                        )}
                                      </div>
                                    </div>
                                  </TabsContent>
                                  <TabsContent value="land" className="mt-4">
                                    {farmerPlots.length === 0 ? (
                                      <p className="text-muted-foreground text-center py-4">No land plots registered</p>
                                    ) : (
                                      <div className="space-y-3">
                                        {farmerPlots.map((plot) => (
                                          <Card key={plot?.id || Math.random()}>
                                            <CardContent className="pt-4">
                                              <div className="flex justify-between items-start">
                                                <div>
                                                  <p className="font-medium">{plot?.size || 0} Hectares</p>
                                                  <p className="text-sm text-muted-foreground">
                                                    {(plot?.coordinates?.lat || 0).toFixed(4)},{" "}
                                                    {(plot?.coordinates?.lng || 0).toFixed(4)}
                                                  </p>
                                                </div>
                                                <Badge variant="outline">{plot?.soilType || "Unknown soil"}</Badge>
                                              </div>
                                            </CardContent>
                                          </Card>
                                        ))}
                                      </div>
                                    )}
                                  </TabsContent>
                                  <TabsContent value="cycles" className="mt-4">
                                    {farmerCycles.length === 0 ? (
                                      <p className="text-muted-foreground text-center py-4">No crop cycles</p>
                                    ) : (
                                      <div className="space-y-3">
                                        {farmerCycles.map((cycle) => (
                                          <Card key={cycle?.id || Math.random()}>
                                            <CardContent className="pt-4">
                                              <div className="flex justify-between items-start">
                                                <div>
                                                  <p className="font-medium">{cycle?.crop || "Unknown"}</p>
                                                  <p className="text-sm text-muted-foreground">
                                                    {cycle?.plantingDate
                                                      ? new Date(cycle.plantingDate).toLocaleDateString()
                                                      : "N/A"}{" "}
                                                    -{" "}
                                                    {cycle?.expectedHarvestDate
                                                      ? new Date(cycle.expectedHarvestDate).toLocaleDateString()
                                                      : "N/A"}
                                                  </p>
                                                </div>
                                                <Badge variant={cycle?.status === "active" ? "default" : "secondary"}>
                                                  {cycle?.status || "unknown"}
                                                </Badge>
                                              </div>
                                              <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                  <TrendingUp className="h-3 w-3" />
                                                  Expected: {(cycle?.expectedYield || 0).toLocaleString()} kg
                                                </span>
                                              </div>
                                            </CardContent>
                                          </Card>
                                        ))}
                                      </div>
                                    )}
                                  </TabsContent>
                                  <TabsContent value="services" className="mt-4">
                                    {getFarmerServices(farmer?.id || "").length === 0 ? (
                                      <p className="text-muted-foreground text-center py-4">No services scheduled</p>
                                    ) : (
                                      <div className="space-y-2">
                                        {getFarmerServices(farmer?.id || "")
                                          .slice(0, 5)
                                          .map((service) => (
                                            <div
                                              key={service?.id || Math.random()}
                                              className="flex justify-between items-center p-3 border rounded-lg"
                                            >
                                              <div>
                                                <p className="font-medium text-sm">
                                                  {(service?.serviceType || "unknown").replace(/_/g, " ")}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                  {service?.scheduledDate
                                                    ? new Date(service.scheduledDate).toLocaleDateString()
                                                    : "N/A"}
                                                </p>
                                              </div>
                                              <Badge
                                                variant={
                                                  service?.status === "completed"
                                                    ? "default"
                                                    : service?.status === "in_progress"
                                                      ? "secondary"
                                                      : "outline"
                                                }
                                              >
                                                {(service?.status || "unknown").replace(/_/g, " ")}
                                              </Badge>
                                            </div>
                                          ))}
                                      </div>
                                    )}
                                  </TabsContent>
                                </Tabs>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
            <PaginationControls
              page={page}
              pages={Math.ceil(filteredFarmers.length / LIMIT)}
              total={filteredFarmers.length}
              limit={LIMIT}
              onPageChange={setPage}
              className="mt-4"
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
