"use client"

import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Truck, CheckCircle, Clock, Calendar, MapPin, Scale, Wheat, PackageCheck } from "lucide-react"
import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"
import { PaginationControls } from "@/components/ui/pagination-controls"

type Delivery = {
  id: string
  contract: string
  corridor: string
  crop: string
  quantity: number
  unit: string
  scheduledDate: string
  location: string
  status: "scheduled" | "in-transit" | "received" | string
  qualityStatus: "ok" | "issues" | null
  notes: string | null
  receivedAt: string | null
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "scheduled":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
          <Clock className="mr-1 h-3 w-3" />
          Scheduled
        </Badge>
      )
    case "in-transit":
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
          <Truck className="mr-1 h-3 w-3" />
          In Transit
        </Badge>
      )
    case "received":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          <CheckCircle className="mr-1 h-3 w-3" />
          Received
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const LIMIT = 20

export default function BuyerDeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [corridorFilter, setCorridorFilter] = useState<string>("all")
  const [cropFilter, setCropFilter] = useState<string>("all")
  const [page, setPage] = useState(1)

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null)
  const [qualityStatus, setQualityStatus] = useState<string>("ok")
  const [notes, setNotes] = useState("")
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    loadDeliveries()
  }, [])

  const loadDeliveries = () => {
    setLoading(true)
    apiClient.offtakerDeliveries
      .list()
      .then((res) => {
        if (res.success) setDeliveries(res.data.deliveries)
      })
      .catch(() => toast.error("Failed to load deliveries"))
      .finally(() => setLoading(false))
  }

  const allCorridors = [...new Set(deliveries.map((d) => d.corridor))].filter(Boolean)
  const allCrops = [...new Set(deliveries.map((d) => d.crop))].filter(Boolean)

  useEffect(() => { setPage(1) }, [searchTerm, corridorFilter, cropFilter])

  const filteredDeliveries = deliveries.filter((d) => {
    if (corridorFilter !== "all" && d.corridor !== corridorFilter) return false
    if (cropFilter !== "all" && d.crop !== cropFilter) return false
    if (
      searchTerm &&
      !d.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !d.crop.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !d.corridor.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false
    return true
  })

  const pagedDeliveries = filteredDeliveries.slice((page - 1) * LIMIT, page * LIMIT)

  const scheduledCount = deliveries.filter((d) => d.status === "scheduled").length
  const inTransitCount = deliveries.filter((d) => d.status === "in-transit").length
  const receivedCount = deliveries.filter((d) => d.status === "received").length
  const totalVolume = deliveries.reduce((sum, d) => sum + d.quantity, 0)

  const handleConfirmClick = (delivery: Delivery) => {
    setSelectedDelivery(delivery)
    setQualityStatus("ok")
    setNotes("")
    setConfirmDialogOpen(true)
  }

  const handleConfirmDelivery = async () => {
    if (!selectedDelivery) return
    setConfirming(true)
    try {
      await apiClient.offtakerDeliveries.confirm(selectedDelivery.id, {
        notes: qualityStatus === "issues" && notes ? notes : notes || undefined,
      })
      toast.success("Delivery confirmed successfully")
      setConfirmDialogOpen(false)
      setSelectedDelivery(null)
      loadDeliveries()
    } catch (err: any) {
      toast.error(err.message || "Failed to confirm delivery")
    } finally {
      setConfirming(false)
    }
  }

  return (
    <DashboardLayout allowedRoles={["offtaker"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Deliveries</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Track and confirm deliveries for AgroBridge-coordinated supply
          </p>
        </div>

        <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-4">
          <Card className="border-border/50">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="rounded-lg bg-blue-100 p-1.5 sm:p-2">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                <div>
                  {loading ? (
                    <Skeleton className="h-7 w-8" />
                  ) : (
                    <p className="text-xl sm:text-2xl font-bold">{scheduledCount}</p>
                  )}
                  <p className="text-xs sm:text-sm text-muted-foreground">Scheduled</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="rounded-lg bg-amber-100 p-1.5 sm:p-2">
                  <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                </div>
                <div>
                  {loading ? (
                    <Skeleton className="h-7 w-8" />
                  ) : (
                    <p className="text-xl sm:text-2xl font-bold">{inTransitCount}</p>
                  )}
                  <p className="text-xs sm:text-sm text-muted-foreground">In Transit</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="rounded-lg bg-green-100 p-1.5 sm:p-2">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                </div>
                <div>
                  {loading ? (
                    <Skeleton className="h-7 w-8" />
                  ) : (
                    <p className="text-xl sm:text-2xl font-bold">{receivedCount}</p>
                  )}
                  <p className="text-xs sm:text-sm text-muted-foreground">Received</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="rounded-lg bg-[#1B5E3C]/10 p-1.5 sm:p-2">
                  <Scale className="h-4 w-4 sm:h-5 sm:w-5 text-[#1B5E3C]" />
                </div>
                <div>
                  {loading ? (
                    <Skeleton className="h-7 w-16" />
                  ) : (
                    <p className="text-xl sm:text-2xl font-bold">{totalVolume} MT</p>
                  )}
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Volume</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
          <Select value={corridorFilter} onValueChange={setCorridorFilter}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="All Corridors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Corridors</SelectItem>
              {allCorridors.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={cropFilter} onValueChange={setCropFilter}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="All Crops" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Crops</SelectItem>
              {allCrops.map((c) => (
                <SelectItem key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative w-full sm:flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search deliveries..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="w-full sm:w-auto overflow-x-auto">
            <TabsTrigger value="all" className="text-xs sm:text-sm">
              All
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="text-xs sm:text-sm">
              Scheduled
            </TabsTrigger>
            <TabsTrigger value="in-transit" className="text-xs sm:text-sm">
              In Transit
            </TabsTrigger>
            <TabsTrigger value="received" className="text-xs sm:text-sm">
              Received
            </TabsTrigger>
          </TabsList>

          {["all", "scheduled", "in-transit", "received"].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-4">
              <Card className="border-border/50">
                <CardContent className="p-0">
                  {loading ? (
                    <div className="p-4 space-y-3">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-16 w-full rounded" />
                      ))}
                    </div>
                  ) : (
                    <>
                      {/* Mobile Cards */}
                      <div className="sm:hidden divide-y">
                        {pagedDeliveries
                          .filter((d) => tab === "all" || d.status === tab)
                          .map((delivery) => (
                            <div key={delivery.id} className="p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="rounded-md bg-amber-100 p-1.5">
                                    <Wheat className="h-3.5 w-3.5 text-amber-600" />
                                  </div>
                                  <span className="font-medium capitalize">{delivery.crop}</span>
                                </div>
                                {getStatusBadge(delivery.status)}
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <p className="text-xs text-muted-foreground">Corridor</p>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                    <span>{delivery.corridor}</span>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Volume</p>
                                  <span className="font-medium">
                                    {delivery.quantity} {delivery.unit}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Date</p>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                    <span>{delivery.scheduledDate ? new Date(delivery.scheduledDate).toLocaleDateString() : "—"}</span>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Location</p>
                                  <span className="text-xs truncate block">{delivery.location || "—"}</span>
                                </div>
                              </div>
                              {(delivery.status === "scheduled" || delivery.status === "in-transit") && (
                                <Button
                                  size="sm"
                                  className="w-full bg-[#1B5E3C] hover:bg-[#154a30]"
                                  onClick={() => handleConfirmClick(delivery)}
                                >
                                  <PackageCheck className="h-4 w-4 mr-1.5" />
                                  Confirm Received
                                </Button>
                              )}
                              {delivery.status === "received" && delivery.receivedAt && (
                                <p className="text-xs text-muted-foreground text-center">
                                  Received {new Date(delivery.receivedAt).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          ))}
                        {pagedDeliveries.filter((d) => tab === "all" || d.status === tab).length === 0 && (
                          <div className="p-8 text-center text-muted-foreground text-sm">No deliveries found.</div>
                        )}
                      </div>

                      {/* Desktop Table */}
                      <div className="hidden sm:block overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/50">
                              <TableHead className="font-semibold">Corridor</TableHead>
                              <TableHead className="font-semibold">Crop</TableHead>
                              <TableHead className="font-semibold">Expected Volume</TableHead>
                              <TableHead className="font-semibold">Delivery Date</TableHead>
                              <TableHead className="font-semibold">Location</TableHead>
                              <TableHead className="font-semibold">Status</TableHead>
                              <TableHead className="font-semibold text-right">Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pagedDeliveries
                              .filter((d) => tab === "all" || d.status === tab)
                              .map((delivery) => (
                                <TableRow key={delivery.id} className="hover:bg-muted/30">
                                  <TableCell>
                                    <div className="flex items-center gap-1.5">
                                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                      {delivery.corridor}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <div className="rounded-md bg-amber-100 p-1.5">
                                        <Wheat className="h-3.5 w-3.5 text-amber-600" />
                                      </div>
                                      <span className="capitalize">{delivery.crop}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="font-medium">
                                    {delivery.quantity} {delivery.unit}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                      <Calendar className="h-3.5 w-3.5" />
                                      {delivery.scheduledDate
                                        ? new Date(delivery.scheduledDate).toLocaleDateString()
                                        : "—"}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-muted-foreground">{delivery.location || "—"}</TableCell>
                                  <TableCell>
                                    <div className="flex flex-col gap-1">
                                      {getStatusBadge(delivery.status)}
                                      {delivery.status === "received" && delivery.qualityStatus === "issues" && (
                                        <Badge variant="outline" className="text-amber-600 border-amber-300 text-xs">
                                          Quality Issues
                                        </Badge>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {delivery.status === "scheduled" || delivery.status === "in-transit" ? (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-[#1B5E3C] border-[#1B5E3C]/30 hover:bg-[#1B5E3C]/10 bg-transparent"
                                        onClick={() => handleConfirmClick(delivery)}
                                      >
                                        <PackageCheck className="h-4 w-4 mr-1.5" />
                                        Confirm Received
                                      </Button>
                                    ) : (
                                      <span className="text-xs text-muted-foreground">
                                        {delivery.receivedAt && new Date(delivery.receivedAt).toLocaleDateString()}
                                      </span>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            {pagedDeliveries.filter((d) => tab === "all" || d.status === tab).length === 0 && (
                              <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                  {deliveries.length === 0
                                    ? "No deliveries yet. Deliveries appear once contracts are active."
                                    : "No deliveries match your filters."}
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <PaginationControls
          page={page}
          pages={Math.ceil(filteredDeliveries.length / LIMIT)}
          total={filteredDeliveries.length}
          limit={LIMIT}
          onPageChange={setPage}
        />

        <p className="text-xs text-muted-foreground text-center">
          Delivery data reflects AgroBridge-coordinated supply only. Confirmed deliveries cannot be edited without ops
          intervention.
        </p>
      </div>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Confirm Delivery Received</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Confirm receipt of this delivery. Once submitted, the status will be updated and ops will be notified for
              settlement.
            </DialogDescription>
          </DialogHeader>

          {selectedDelivery && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg bg-muted/50 p-3 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Corridor</span>
                  <span className="font-medium">{selectedDelivery.corridor}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Crop</span>
                  <span className="font-medium capitalize">{selectedDelivery.crop}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Expected Volume</span>
                  <span className="font-medium">
                    {selectedDelivery.quantity} {selectedDelivery.unit}
                  </span>
                </div>
                {selectedDelivery.scheduledDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Scheduled Date</span>
                    <span className="font-medium">
                      {new Date(selectedDelivery.scheduledDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Quality Status</Label>
                <Select value={qualityStatus} onValueChange={setQualityStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ok">OK - Meets specifications</SelectItem>
                    <SelectItem value="issues">Issues - Report to ops</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm">
                  Notes (optional)
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Any observations about the delivery..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
              disabled={confirming}
              className="w-full sm:flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelivery}
              disabled={confirming}
              className="w-full sm:flex-1 bg-[#1B5E3C] hover:bg-[#154a30]"
            >
              <CheckCircle className="h-4 w-4 mr-1.5" />
              {confirming ? "Confirming..." : "Confirm Delivery Received"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
