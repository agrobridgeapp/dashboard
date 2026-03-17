"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth-context"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"
import {
  Leaf,
  Tractor,
  FileText,
  Receipt,
  ArrowRight,
  Sun,
  Droplets,
  Wind,
  MapPin,
  Loader2,
} from "lucide-react"
import Link from "next/link"

export default function FarmerDashboardPage() {
  const { user } = useAuth()

  const [contracts, setContracts] = useState<any[]>([])
  const [contractsLoading, setContractsLoading] = useState(true)

  const [serviceEvents, setServiceEvents] = useState<any[]>([])
  const [eventsLoading, setEventsLoading] = useState(true)

  const [payments, setPayments] = useState<any[]>([])
  const [paymentsLoading, setPaymentsLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    try {
      setContractsLoading(true)
      const res = await apiClient.farmerMe.getContracts()
      setContracts(res.data ?? [])
    } catch (err: any) {
      toast.error(err.message || "Failed to load contracts")
    } finally {
      setContractsLoading(false)
    }

    try {
      setEventsLoading(true)
      const res = await apiClient.farmerMe.getServiceEvents()
      setServiceEvents(res.data ?? [])
    } catch {
      // non-critical
    } finally {
      setEventsLoading(false)
    }

    try {
      setPaymentsLoading(true)
      const res = await apiClient.farmerMe.getPayments()
      setPayments(res.data ?? [])
    } catch {
      // non-critical
    } finally {
      setPaymentsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const activeServices = serviceEvents.filter(
    (e) => e.status === "scheduled" || e.status === "in_progress"
  )
  const activeContracts = contracts.filter((c) => c.status === "active" || c.status === "in_delivery")
  const totalSettlement = payments
    .filter((p) => p.status === "completed" || p.status === "paid")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0)

  const stats = [
    {
      name: "Active Services",
      value: eventsLoading ? "…" : activeServices.length.toString(),
      icon: Tractor,
      color: "text-blue-600 bg-blue-100",
    },
    {
      name: "Active Contracts",
      value: contractsLoading ? "…" : activeContracts.length.toString(),
      icon: FileText,
      color: "text-amber-600 bg-amber-100",
    },
    {
      name: "Settlement",
      value: paymentsLoading ? "…" : `₦${(totalSettlement / 1000).toFixed(0)}K`,
      icon: Receipt,
      color: "text-emerald-600 bg-emerald-100",
      subtext: "Completed payments",
    },
  ]

  return (
    <DashboardLayout allowedRoles={["farmer"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground">Manage your farm and track your services</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.name} className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${stat.color}`}
                  >
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground truncate">{stat.name}</p>
                    {"subtext" in stat && stat.subtext && (
                      <p className="text-xs text-muted-foreground">{stat.subtext}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Services */}
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle>Active Services</CardTitle>
                  <CardDescription>Track your ongoing service requests</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/farmer/requests">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {eventsLoading ? (
                  <div className="flex items-center justify-center h-20">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : activeServices.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No active services</p>
                ) : (
                  <div className="space-y-4">
                    {activeServices.slice(0, 3).map((event) => (
                      <div key={event.id} className="p-4 rounded-lg border border-border/50">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{event.service_type || event.serviceType}</p>
                              <Badge
                                variant="outline"
                                className={
                                  event.status === "in_progress"
                                    ? "bg-blue-100 text-blue-700 border-blue-200"
                                    : "bg-amber-100 text-amber-700 border-amber-200"
                                }
                              >
                                {event.status}
                              </Badge>
                            </div>
                            {event.notes && (
                              <p className="text-sm text-muted-foreground mt-1">{event.notes}</p>
                            )}
                          </div>
                          {event.scheduled_date && (
                            <span className="text-sm text-muted-foreground">
                              {new Date(event.scheduled_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4 space-y-2">
                  <Button className="w-full" asChild>
                    <Link href="/dashboard/farmer/requests">
                      <Tractor className="h-4 w-4 mr-2" />
                      Request New Service
                    </Link>
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Service requests are reviewed and scheduled by AgroBridge based on your crop cycle and location.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contracts */}
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle>My Contracts</CardTitle>
                  <CardDescription>AgroBridge-coordinated buyer agreements</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/farmer/contracts">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {contractsLoading ? (
                  <div className="flex items-center justify-center h-20">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : activeContracts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No active contracts</p>
                ) : (
                  <div className="space-y-4">
                    {activeContracts.slice(0, 3).map((contract) => {
                      const volumeTons = Number(contract.contracted_volume_tons || 0)
                      const deliveredTons = Number(contract.delivered_volume_tons || 0)
                      const progress = volumeTons > 0 ? Math.round((deliveredTons / volumeTons) * 100) : 0
                      return (
                        <div key={contract.id} className="p-4 rounded-lg border border-border/50">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium capitalize">{contract.crop_type}</p>
                                <Badge
                                  variant="outline"
                                  className="bg-emerald-100 text-emerald-700 border-emerald-200"
                                >
                                  {contract.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {contract.offtaker_name}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{volumeTons.toLocaleString()} kg</p>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-muted-foreground">
                                {contract.delivery_window_end
                                  ? `Delivery by ${new Date(contract.delivery_window_end).toLocaleDateString()}`
                                  : "Delivery TBD"}
                              </span>
                              <span className="font-medium">{progress}% delivered</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weather — static placeholder, would need a weather API integration */}
            <Card className="border-border/50 bg-gradient-to-br from-blue-50 to-amber-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sun className="h-5 w-5 text-amber-500" />
                  Weather Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <p className="text-4xl font-bold">—</p>
                  <p className="text-muted-foreground text-sm">Weather unavailable</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-400" />
                    <span>Humidity: —</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-gray-400" />
                    <span>Wind: —</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Settlement Activity */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Settlement Activity</CardTitle>
                <CardDescription className="text-xs">Pay-at-harvest reconciliation</CardDescription>
              </CardHeader>
              <CardContent>
                {paymentsLoading ? (
                  <div className="flex items-center justify-center h-16">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : payments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-2">No payments yet</p>
                ) : (
                  <div className="space-y-3">
                    {payments.slice(0, 3).map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">
                            {payment.payment_type || "Payment"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {payment.created_at
                              ? new Date(payment.created_at).toLocaleDateString()
                              : "—"}
                          </p>
                        </div>
                        <span
                          className={
                            payment.payment_type === "deduction"
                              ? "text-red-600 font-medium"
                              : "text-emerald-600 font-medium"
                          }
                        >
                          ₦{Number(payment.amount || 0).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <Button variant="outline" className="w-full mt-4 bg-transparent" size="sm" asChild>
                  <Link href="/dashboard/farmer/payments">
                    View All Settlements
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
