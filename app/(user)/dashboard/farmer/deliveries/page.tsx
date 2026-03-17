"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Truck, Calendar, MapPin, Package, CheckCircle, Clock, Building2, CreditCard, FileText, Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"
import { PaginationControls } from "@/components/ui/pagination-controls"

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  completed: { label: "Completed", color: "bg-green-500/10 text-green-700 border-green-200", icon: CheckCircle },
  delivered: { label: "Delivered", color: "bg-green-500/10 text-green-700 border-green-200", icon: CheckCircle },
  in_transit: { label: "In Transit", color: "bg-blue-500/10 text-blue-700 border-blue-200", icon: Truck },
  pending: { label: "Pending", color: "bg-amber-500/10 text-amber-700 border-amber-200", icon: Clock },
  scheduled: { label: "Scheduled", color: "bg-amber-500/10 text-amber-700 border-amber-200", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-emerald-500/10 text-emerald-700 border-emerald-200", icon: CheckCircle },
}

const LIMIT = 20

export default function FarmerDeliveriesPage() {
  const [deliveries, setDeliveries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState({ count: 0, pages: 1 })
  const [selectedDelivery, setSelectedDelivery] = useState<any | null>(null)

  const load = useCallback(async (p = 1) => {
    setLoading(true)
    try {
      const res = await apiClient.farmerMe.getDeliveries({ page: p, limit: LIMIT })
      setDeliveries(res.data ?? [])
      setMeta({ count: (res as any).count ?? 0, pages: (res as any).pages ?? 1 })
    } catch {
      toast.error("Failed to load deliveries")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(page) }, [load, page])

  const getStatus = (d: any) => d.status || "pending"
  const getQtyKg = (d: any) => {
    if (d.quantity_kg) return Number(d.quantity_kg)
    if (d.quantity_tons) return Number(d.quantity_tons) * 1000
    if (d.quantity) return Number(d.quantity)
    return 0
  }
  const getCrop = (d: any) => d.crop_type || d.crop || "—"
  const getBuyer = (d: any) => d.buyer_name || d.buyer?.name || d.offtaker_name || "—"
  const getLocation = (d: any) => d.delivery_location || d.location || d.collection_center || "—"
  const getDate = (d: any) => d.delivery_date || d.actual_date || d.scheduled_date || null
  const getPayment = (d: any) => d.payment_status || d.payment || (getStatus(d) === "completed" ? "Completed" : "Pending")

  const completedDeliveries = deliveries.filter((d) => getStatus(d) === "completed" || getStatus(d) === "delivered" || getStatus(d) === "confirmed")
  const scheduledDeliveries = deliveries.filter((d) => getStatus(d) === "scheduled" || getStatus(d) === "pending" || getStatus(d) === "in_transit")

  const totalDeliveredKg = completedDeliveries.reduce((sum, d) => sum + getQtyKg(d), 0)
  const scheduledKg = scheduledDeliveries.reduce((sum, d) => sum + getQtyKg(d), 0)
  const pendingPayments = deliveries.filter((d) => (getPayment(d) || "").toLowerCase().includes("pending")).length

  return (
    <DashboardLayout allowedRoles={["farmer"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Deliveries</h1>
          <p className="text-muted-foreground">Track your produce deliveries and payments</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Delivered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "…" : `${totalDeliveredKg.toLocaleString()} kg`}</div>
              <p className="text-xs text-muted-foreground mt-1">This season</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Scheduled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "…" : `${scheduledKg.toLocaleString()} kg`}</div>
              <p className="text-xs text-muted-foreground mt-1">Upcoming deliveries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Payment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${pendingPayments > 0 ? "text-amber-600" : "text-green-600"}`}>
                {loading ? "…" : pendingPayments > 0 ? "Pending" : "Up to date"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {loading ? "" : `${pendingPayments} pending payment${pendingPayments !== 1 ? "s" : ""}`}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Schedule</CardTitle>
            <CardDescription>View and track all your deliveries</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : deliveries.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No deliveries found</p>
            ) : (
              <div className="space-y-4">
                {deliveries.map((delivery) => {
                  const status = getStatus(delivery)
                  const config = statusConfig[status] || statusConfig.pending
                  const StatusIcon = config.icon
                  const qtyKg = getQtyKg(delivery)
                  const date = getDate(delivery)

                  return (
                    <div
                      key={delivery.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold text-lg">
                            {qtyKg > 0 ? `${qtyKg.toLocaleString()} kg` : "—"} of {getCrop(delivery)}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            <span className="font-medium">{delivery.id?.slice(0, 8)}</span> · {getBuyer(delivery)}
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            {date && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(date).toLocaleDateString()}
                              </span>
                            )}
                            {getLocation(delivery) !== "—" && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {getLocation(delivery)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <Badge className={config.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {config.label}
                          </Badge>
                          <div className="text-xs text-muted-foreground mt-2">
                            Payment: <span className="font-medium">{getPayment(delivery)}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setSelectedDelivery(delivery)}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <PaginationControls
          page={page}
          pages={meta.pages}
          total={meta.count}
          limit={LIMIT}
          onPageChange={(p) => setPage(p)}
        />
      </div>

      <Dialog open={!!selectedDelivery} onOpenChange={(open) => !open && setSelectedDelivery(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delivery Details</DialogTitle>
            <DialogDescription>
              {selectedDelivery?.id?.slice(0, 8)} · {getCrop(selectedDelivery)}
            </DialogDescription>
          </DialogHeader>

          {selectedDelivery && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge className={statusConfig[getStatus(selectedDelivery)]?.color || statusConfig.pending.color}>
                  {statusConfig[getStatus(selectedDelivery)]?.label || getStatus(selectedDelivery)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    Quantity
                  </div>
                  <p className="font-medium">{getQtyKg(selectedDelivery).toLocaleString()} kg</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    Quality Grade
                  </div>
                  <p className="font-medium">{selectedDelivery.quality_grade || selectedDelivery.grade || "—"}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    Buyer
                  </div>
                  <p className="font-medium">{getBuyer(selectedDelivery)}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    Payment
                  </div>
                  <p className="font-medium">{getPayment(selectedDelivery)}</p>
                </div>

                {getDate(selectedDelivery) && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Delivery Date
                    </div>
                    <p className="font-medium">{new Date(getDate(selectedDelivery)).toLocaleDateString()}</p>
                  </div>
                )}

                {getLocation(selectedDelivery) !== "—" && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      Location
                    </div>
                    <p className="font-medium">{getLocation(selectedDelivery)}</p>
                  </div>
                )}
              </div>

              {selectedDelivery.contract_id && (
                <div className="pt-2 border-t">
                  <div className="text-sm text-muted-foreground mb-1">Contract Reference</div>
                  <p className="font-medium">{selectedDelivery.contract_id}</p>
                </div>
              )}

              {selectedDelivery.notes && (
                <div className="pt-2 border-t">
                  <div className="text-sm text-muted-foreground mb-1">Notes</div>
                  <p className="text-sm">{selectedDelivery.notes}</p>
                </div>
              )}

              <p className="text-xs text-muted-foreground pt-2 border-t">
                Deliveries are coordinated by AgroBridge. For questions, contact your field agent or use the Help & Support section.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
