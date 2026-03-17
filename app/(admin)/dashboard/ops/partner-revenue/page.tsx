"use client"

import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { useDataStore } from "@/lib/data/data-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, Package, Truck, Tractor, Store, ArrowUpRight, Calendar, Users } from "lucide-react"
import { AGROBRIDGE_PRICING_MODEL } from "@/lib/pricing/agrobridge-pricing-model"

export default function PartnerRevenuePage() {
  const { partners, serviceEvents, landPlots, cropCycles } = useDataStore()

  const calculatePartnerRevenue = () => {
    const inputRevenue: Record<string, { revenue: number; jobs: number; hectares: number }> = {}
    const mechanizationRevenue: Record<string, { revenue: number; jobs: number; hectares: number }> = {}
    const logisticsRevenue: Record<string, { revenue: number; jobs: number; tons: number }> = {}
    const storageRevenue: Record<string, { revenue: number; jobs: number; tons: number }> = {}

    let totalInputMargin = 0
    let totalMechanizationMargin = 0
    let totalLogisticsMargin = 0
    let totalStorageMargin = 0

    // Process completed service events
    serviceEvents
      .filter((event) => event.status === "verified" || event.status === "completed")
      .forEach((event) => {
        const partner = partners.find((p) => p.id === event.assignedPartnerId)
        if (!partner) return

        const cropCycle = cropCycles.find((c) => c.id === event.cropCycleId)
        const landPlot = landPlots.find((l) => l.id === cropCycle?.landPlotId)
        const hectares = landPlot?.areaHectares || 1

        // Calculate AgroBridge margin based on pricing model
        if (partner.partnerType === "input_supplier") {
          const marginPerHectare = AGROBRIDGE_PRICING_MODEL.MONETIZATION_LAYERS.inputMargin.perHectare
          const margin = marginPerHectare * hectares

          if (!inputRevenue[partner.id]) {
            inputRevenue[partner.id] = { revenue: 0, jobs: 0, hectares: 0 }
          }
          inputRevenue[partner.id].revenue += margin
          inputRevenue[partner.id].jobs += 1
          inputRevenue[partner.id].hectares += hectares
          totalInputMargin += margin
        } else if (partner.partnerType === "mechanization") {
          const marginPerHectare = AGROBRIDGE_PRICING_MODEL.MONETIZATION_LAYERS.mechanizationMargin.perHectare
          const margin = marginPerHectare * hectares

          if (!mechanizationRevenue[partner.id]) {
            mechanizationRevenue[partner.id] = { revenue: 0, jobs: 0, hectares: 0 }
          }
          mechanizationRevenue[partner.id].revenue += margin
          mechanizationRevenue[partner.id].jobs += 1
          mechanizationRevenue[partner.id].hectares += hectares
          totalMechanizationMargin += margin
        } else if (partner.partnerType === "logistics") {
          // Logistics revenue is per-ton based
          const avgYield = 1.14 // tons per hectare
          const tons = hectares * avgYield
          const marginPerTon = 8000 // ₦8k per ton logistics component
          const margin = tons * marginPerTon

          if (!logisticsRevenue[partner.id]) {
            logisticsRevenue[partner.id] = { revenue: 0, jobs: 0, tons: 0 }
          }
          logisticsRevenue[partner.id].revenue += margin
          logisticsRevenue[partner.id].jobs += 1
          logisticsRevenue[partner.id].tons += tons
          totalLogisticsMargin += margin
        } else if (partner.partnerType === "storage") {
          const avgYield = 1.14
          const tons = hectares * avgYield
          const marginPerTon = 5000 // ₦5k per ton storage component
          const margin = tons * marginPerTon

          if (!storageRevenue[partner.id]) {
            storageRevenue[partner.id] = { revenue: 0, jobs: 0, tons: 0 }
          }
          storageRevenue[partner.id].revenue += margin
          storageRevenue[partner.id].jobs += 1
          storageRevenue[partner.id].tons += tons
          totalStorageMargin += margin
        }
      })

    return {
      inputRevenue,
      mechanizationRevenue,
      logisticsRevenue,
      storageRevenue,
      totalInputMargin,
      totalMechanizationMargin,
      totalLogisticsMargin,
      totalStorageMargin,
      grandTotal: totalInputMargin + totalMechanizationMargin + totalLogisticsMargin + totalStorageMargin,
    }
  }

  const revenueData = calculatePartnerRevenue()

  // Get active partners by type
  const inputPartners = partners.filter((p) => p.partnerType === "input_supplier" && p.status === "active")
  const mechanizationPartners = partners.filter((p) => p.partnerType === "mechanization" && p.status === "active")
  const logisticsPartners = partners.filter((p) => p.partnerType === "logistics" && p.status === "active")
  const storagePartners = partners.filter((p) => p.partnerType === "storage" && p.status === "active")

  return (
    <DashboardLayout role="ops_admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Partner Service Delivery</h1>
          <p className="text-muted-foreground mt-1">
            Value generated through partner operations - current year performance
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card className="border-2 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Partner Value</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">₦{(revenueData.grandTotal / 1000000).toFixed(2)}m</div>
              <p className="text-xs text-muted-foreground">All service categories</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Input Services</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{(revenueData.totalInputMargin / 1000000).toFixed(2)}M</div>
              <p className="text-xs text-muted-foreground">
                {AGROBRIDGE_PRICING_MODEL.MONETIZATION_LAYERS.inputMargin.percentage * 100}% coordination value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mechanization</CardTitle>
              <Tractor className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{(revenueData.totalMechanizationMargin / 1000000).toFixed(2)}M</div>
              <p className="text-xs text-muted-foreground">
                {AGROBRIDGE_PRICING_MODEL.MONETIZATION_LAYERS.mechanizationMargin.percentage * 100}% coordination value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Logistics</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{(revenueData.totalLogisticsMargin / 1000000).toFixed(2)}M</div>
              <p className="text-xs text-muted-foreground">₦8k per ton coordination</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{(revenueData.totalStorageMargin / 1000000).toFixed(2)}M</div>
              <p className="text-xs text-muted-foreground">₦5k per ton coordination</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Partner Service Model</CardTitle>
            <CardDescription>How AgroBridge generates value through partner service coordination</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Input Coordination</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">
                    ₦{AGROBRIDGE_PRICING_MODEL.MONETIZATION_LAYERS.inputMargin.perHectare.toLocaleString()}/ha
                  </span>
                </div>
                <p className="text-sm text-muted-foreground pl-2">
                  {AGROBRIDGE_PRICING_MODEL.MONETIZATION_LAYERS.inputMargin.description}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Tractor className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Mechanization Coordination</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    ₦{AGROBRIDGE_PRICING_MODEL.MONETIZATION_LAYERS.mechanizationMargin.perHectare.toLocaleString()}/ha
                  </span>
                </div>
                <p className="text-sm text-muted-foreground pl-2">
                  {AGROBRIDGE_PRICING_MODEL.MONETIZATION_LAYERS.mechanizationMargin.description}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium">Logistics Coordination</span>
                  </div>
                  <span className="text-lg font-bold text-yellow-600">₦8,000/ton</span>
                </div>
                <p className="text-sm text-muted-foreground pl-2">Transport aggregation and route optimization</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Store className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">Storage Management</span>
                  </div>
                  <span className="text-lg font-bold text-purple-600">₦5,000/ton</span>
                </div>
                <p className="text-sm text-muted-foreground pl-2">Warehouse aggregation and inventory management</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="inputs" className="space-y-4">
          <TabsList>
            <TabsTrigger value="inputs">
              <Package className="h-4 w-4 mr-2" />
              Input Suppliers ({inputPartners.length})
            </TabsTrigger>
            <TabsTrigger value="mechanization">
              <Tractor className="h-4 w-4 mr-2" />
              Mechanization ({mechanizationPartners.length})
            </TabsTrigger>
            <TabsTrigger value="logistics">
              <Truck className="h-4 w-4 mr-2" />
              Logistics ({logisticsPartners.length})
            </TabsTrigger>
            <TabsTrigger value="storage">
              <Store className="h-4 w-4 mr-2" />
              Storage ({storagePartners.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inputs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Input Supplier Value Delivery</CardTitle>
                <CardDescription>
                  Value generated from {AGROBRIDGE_PRICING_MODEL.MONETIZATION_LAYERS.inputMargin.percentage * 100}%
                  coordination on bulk procurement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inputPartners.map((partner) => {
                    const revenue = revenueData.inputRevenue[partner.id] || { revenue: 0, jobs: 0, hectares: 0 }
                    return (
                      <div key={partner.id} className="flex items-center justify-between border-b pb-4">
                        <div className="space-y-1">
                          <p className="font-medium">{partner.companyName}</p>
                          <p className="text-sm text-muted-foreground">{partner.contactName}</p>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {revenue.jobs} jobs completed
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {revenue.hectares.toFixed(1)} hectares
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">₦{(revenue.revenue / 1000).toFixed(0)}k</p>
                          <Badge variant="outline" className="mt-1">
                            {partner.averageRating.toFixed(1)} ⭐
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mechanization" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mechanization Value Delivery</CardTitle>
                <CardDescription>
                  Value from {AGROBRIDGE_PRICING_MODEL.MONETIZATION_LAYERS.mechanizationMargin.percentage * 100}%
                  coordination on aggregated services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mechanizationPartners.map((partner) => {
                    const revenue = revenueData.mechanizationRevenue[partner.id] || { revenue: 0, jobs: 0, hectares: 0 }
                    return (
                      <div key={partner.id} className="flex items-center justify-between border-b pb-4">
                        <div className="space-y-1">
                          <p className="font-medium">{partner.companyName}</p>
                          <p className="text-sm text-muted-foreground">{partner.contactName}</p>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {revenue.jobs} jobs completed
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {revenue.hectares.toFixed(1)} hectares
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">₦{(revenue.revenue / 1000).toFixed(0)}k</p>
                          <Badge variant="outline" className="mt-1">
                            {partner.averageRating.toFixed(1)} ⭐
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logistics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Logistics Value Delivery</CardTitle>
                <CardDescription>Value from ₦8k per ton transport coordination</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {logisticsPartners.map((partner) => {
                    const revenue = revenueData.logisticsRevenue[partner.id] || { revenue: 0, jobs: 0, tons: 0 }
                    return (
                      <div key={partner.id} className="flex items-center justify-between border-b pb-4">
                        <div className="space-y-1">
                          <p className="font-medium">{partner.companyName}</p>
                          <p className="text-sm text-muted-foreground">{partner.contactName}</p>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {revenue.jobs} jobs completed
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              {revenue.tons.toFixed(1)} tons
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">₦{(revenue.revenue / 1000).toFixed(0)}k</p>
                          <Badge variant="outline" className="mt-1">
                            {partner.averageRating.toFixed(1)} ⭐
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="storage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Storage Value Delivery</CardTitle>
                <CardDescription>Value from ₦5k per ton storage management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {storagePartners.length > 0 ? (
                    storagePartners.map((partner) => {
                      const revenue = revenueData.storageRevenue[partner.id] || { revenue: 0, jobs: 0, tons: 0 }
                      return (
                        <div key={partner.id} className="flex items-center justify-between border-b pb-4">
                          <div className="space-y-1">
                            <p className="font-medium">{partner.companyName}</p>
                            <p className="text-sm text-muted-foreground">{partner.contactName}</p>
                            <div className="flex gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {revenue.jobs} jobs completed
                              </span>
                              <span className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                {revenue.tons.toFixed(1)} tons
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">₦{(revenue.revenue / 1000).toFixed(0)}k</p>
                            <Badge variant="outline" className="mt-1">
                              {partner.averageRating.toFixed(1)} ⭐
                            </Badge>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Store className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No storage partners active yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Revenue Growth Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Partner Value Insights</CardTitle>
            <CardDescription>How partner margins contribute to platform value</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Margin Capture Rate</span>
                </div>
                <p className="text-2xl font-bold">
                  {(
                    (revenueData.grandTotal / (serviceEvents.filter((s) => s.status === "verified").length * 50000) ||
                      0) * 100
                  ).toFixed(1)}
                  %
                </p>
                <p className="text-xs text-muted-foreground">Average margin per service event</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Value Per Partner</span>
                </div>
                <p className="text-2xl font-bold">
                  ₦{(revenueData.grandTotal / partners.filter((p) => p.status === "active").length / 1000).toFixed(0)}k
                </p>
                <p className="text-xs text-muted-foreground">Average across all active partners</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Total Jobs Completed</span>
                </div>
                <p className="text-2xl font-bold">
                  {serviceEvents.filter((s) => s.status === "verified" || s.status === "completed").length}
                </p>
                <p className="text-xs text-muted-foreground">Across all partner types</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
