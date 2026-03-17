"use client"

import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { useDataStore } from "@/lib/data/data-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  DollarSign,
  TrendingUp,
  Package,
  Truck,
  Warehouse,
  Tractor,
  Leaf,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react"
import { AGROBRIDGE_PRICING_MODEL } from "@/lib/pricing/agrobridge-pricing-model"

export default function RevenueStreamsPage() {
  const { serviceEvents, landPlots, cropCycles, partners, corridors } = useDataStore()

  // Calculate comprehensive revenue data
  const calculateRevenueStreams = () => {
    let totalTons = 0
    let totalHectares = 0
    const farmersSet = new Set<string>()

    // Track by corridor
    const corridorRevenue: Record<
      string,
      {
        name: string
        tons: number
        hectares: number
        farmers: number
        coordinationRevenue: number
        inputRevenue: number
        mechanizationRevenue: number
        logisticsRevenue: number
        storageRevenue: number
        totalRevenue: number
        totalCosts: number
        profit: number
      }
    > = {}

    // Initialize corridors
    corridors.forEach((c) => {
      corridorRevenue[c.id] = {
        name: c.name,
        tons: 0,
        hectares: 0,
        farmers: 0,
        coordinationRevenue: 0,
        inputRevenue: 0,
        mechanizationRevenue: 0,
        logisticsRevenue: 0,
        storageRevenue: 0,
        totalRevenue: 0,
        totalCosts: 0,
        profit: 0,
      }
    })

    // Calculate from verified service events
    serviceEvents
      .filter((event) => event.status === "verified" || event.status === "completed")
      .forEach((event) => {
        const cropCycle = cropCycles.find((c) => c.id === event.cropCycleId)
        const landPlot = landPlots.find((l) => l.id === cropCycle?.landPlotId)
        const hectares = landPlot?.areaHectares || 1
        const avgYield = 1.14
        const tons = hectares * avgYield

        totalHectares += hectares
        totalTons += tons
        if (landPlot?.farmerId) farmersSet.add(landPlot.farmerId)

        // Find corridor for this event
        const corridorId = Object.keys(corridorRevenue)[0] || "default"
        if (corridorRevenue[corridorId]) {
          corridorRevenue[corridorId].hectares += hectares
          corridorRevenue[corridorId].tons += tons
          corridorRevenue[corridorId].farmers += 1
        }
      })

    // Use pricing model for accurate calculations
    const pricing = AGROBRIDGE_PRICING_MODEL

    // 1. Coordination Margin Per Ton (spread between buy and sell)
    const avgBuyPrice = 220000 // Cost to farmer per ton
    const avgSellPrice = 300000 // Offtaker price per ton
    const coordinationMarginPerTon = pricing.CONTRACT_INFRASTRUCTURE_FEES.embeddedMargin.perTon // ₦25,000
    const coordinationRevenue = totalTons * coordinationMarginPerTon

    // 2. Input Margin (profit from fertilizer, seeds, chemicals)
    const inputMarginPerHectare = pricing.MONETIZATION_LAYERS.inputMargin.perHectare // ₦15,000
    const inputMarginPercentage = pricing.MONETIZATION_LAYERS.inputMargin.percentage // 12.5%
    const totalInputValue = totalHectares * 120000 // Total input cost
    const inputRevenue = totalHectares * inputMarginPerHectare

    // 3. Machinery Facilitation Fees (commission from services)
    const mechMarginPerHectare = pricing.MONETIZATION_LAYERS.mechanizationMargin.perHectare // ₦12,000
    const mechMarginPercentage = pricing.MONETIZATION_LAYERS.mechanizationMargin.percentage // 15%
    const totalMechValue = totalHectares * 80000 // Total mechanization cost
    const mechanizationRevenue = totalHectares * mechMarginPerHectare

    // 4. Service Partner Fees (logistics, storage, processing)
    const logisticsPerTon = 8000
    const storagePerTon = 5000
    const processingPerTon = 3000
    const logisticsRevenue = totalTons * logisticsPerTon
    const storageRevenue = totalTons * storagePerTon
    const processingRevenue = totalTons * processingPerTon
    const servicePartnerRevenue = logisticsRevenue + storageRevenue + processingRevenue

    // 5. Offtaker Platform Fee
    const avgContractValue = totalTons * avgSellPrice
    const offtakerFeePercentage = pricing.MONETIZATION_LAYERS.offtakerFee.percentage // 4%
    const offtakerPlatformFee = avgContractValue * offtakerFeePercentage

    // 6. Risk Premium
    const riskPremiumPerTon = pricing.MONETIZATION_LAYERS.riskPremium.perTon // ₦8,000
    const riskPremiumRevenue = totalTons * riskPremiumPerTon

    // Total AgroBridge Revenue
    const totalRevenue =
      coordinationRevenue +
      inputRevenue +
      mechanizationRevenue +
      servicePartnerRevenue +
      offtakerPlatformFee +
      riskPremiumRevenue

    // Calculate costs (estimated at 65% of revenue for ops)
    const operationalCosts = totalRevenue * 0.65
    const netProfit = totalRevenue - operationalCosts
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0

    // Update corridor profitability
    Object.keys(corridorRevenue).forEach((id) => {
      const c = corridorRevenue[id]
      if (c.tons > 0) {
        c.coordinationRevenue = c.tons * coordinationMarginPerTon
        c.inputRevenue = c.hectares * inputMarginPerHectare
        c.mechanizationRevenue = c.hectares * mechMarginPerHectare
        c.logisticsRevenue = c.tons * logisticsPerTon
        c.storageRevenue = c.tons * storagePerTon
        c.totalRevenue =
          c.coordinationRevenue + c.inputRevenue + c.mechanizationRevenue + c.logisticsRevenue + c.storageRevenue
        c.totalCosts = c.totalRevenue * 0.65
        c.profit = c.totalRevenue - c.totalCosts
      }
    })

    return {
      streams: {
        coordination: {
          name: "Coordination Margin",
          description: "Spread between farmer buy price and offtaker sell price",
          perTon: coordinationMarginPerTon,
          total: coordinationRevenue,
          icon: TrendingUp,
          color: "text-emerald-600",
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-200",
          details: {
            buyPrice: avgBuyPrice,
            sellPrice: avgSellPrice,
            spread: avgSellPrice - avgBuyPrice,
            marginPerTon: coordinationMarginPerTon,
          },
        },
        inputs: {
          name: "Input Margin",
          description: "Profit from fertilizer, seeds, and agrochemicals",
          perHectare: inputMarginPerHectare,
          percentage: inputMarginPercentage * 100,
          total: inputRevenue,
          icon: Leaf,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          details: {
            totalInputValue: totalInputValue,
            marginPercentage: inputMarginPercentage * 100,
            marginPerHectare: inputMarginPerHectare,
          },
        },
        mechanization: {
          name: "Machinery Facilitation",
          description: "Commission from land prep, planting, and harvest services",
          perHectare: mechMarginPerHectare,
          percentage: mechMarginPercentage * 100,
          total: mechanizationRevenue,
          icon: Tractor,
          color: "text-amber-600",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          details: {
            totalMechValue: totalMechValue,
            marginPercentage: mechMarginPercentage * 100,
            marginPerHectare: mechMarginPerHectare,
          },
        },
        servicePartners: {
          name: "Service Partner Fees",
          description: "Revenue from logistics, storage, and processing coordination",
          perTon: logisticsPerTon + storagePerTon + processingPerTon,
          total: servicePartnerRevenue,
          icon: Truck,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          breakdown: {
            logistics: { perTon: logisticsPerTon, total: logisticsRevenue },
            storage: { perTon: storagePerTon, total: storageRevenue },
            processing: { perTon: processingPerTon, total: processingRevenue },
          },
        },
        offtakerFee: {
          name: "Offtaker Platform Fee",
          description: "4% fee on contracted supply value",
          percentage: offtakerFeePercentage * 100,
          total: offtakerPlatformFee,
          icon: Package,
          color: "text-purple-600",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200",
          details: {
            contractValue: avgContractValue,
            feePercentage: offtakerFeePercentage * 100,
          },
        },
        riskPremium: {
          name: "Risk & Predictability Premium",
          description: "Portfolio-level risk pooling and yield smoothing",
          perTon: riskPremiumPerTon,
          total: riskPremiumRevenue,
          icon: DollarSign,
          color: "text-rose-600",
          bgColor: "bg-rose-50",
          borderColor: "border-rose-200",
        },
      },
      totals: {
        totalRevenue,
        operationalCosts,
        netProfit,
        profitMargin,
        totalTons,
        totalHectares,
        farmersServed: farmersSet.size,
        revenuePerTon: totalTons > 0 ? totalRevenue / totalTons : 0,
        revenuePerHectare: totalHectares > 0 ? totalRevenue / totalHectares : 0,
        revenuePerFarmer: farmersSet.size > 0 ? totalRevenue / farmersSet.size : 0,
      },
      corridorProfitability: Object.values(corridorRevenue).filter((c) => c.tons > 0),
    }
  }

  const revenue = calculateRevenueStreams()

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) return `₦${(value / 1000000000).toFixed(2)}B`
    if (value >= 1000000) return `₦${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `₦${(value / 1000).toFixed(0)}K`
    return `₦${value.toLocaleString()}`
  }

  const streamsList = Object.values(revenue.streams)
  const totalFromStreams = streamsList.reduce((acc, s) => acc + s.total, 0)

  return (
    <DashboardLayout role="ops_admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">AgroBridge Revenue Streams</h1>
          <p className="text-muted-foreground mt-1">
            Detailed breakdown of all revenue channels and per-corridor profitability
          </p>
        </div>

        {/* Top Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{formatCurrency(revenue.totals.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground mt-1">{formatCurrency(revenue.totals.revenuePerTon)}/ton</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(revenue.totals.netProfit)}</div>
              <p className="text-xs text-muted-foreground mt-1">{revenue.totals.profitMargin.toFixed(1)}% margin</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Volume Coordinated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{revenue.totals.totalTons.toFixed(0)} MT</div>
              <p className="text-xs text-muted-foreground mt-1">{revenue.totals.totalHectares.toFixed(0)} hectares</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Farmers Served</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{revenue.totals.farmersServed.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(revenue.totals.revenuePerFarmer)}/farmer
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="streams" className="space-y-4">
          <TabsList>
            <TabsTrigger value="streams">Revenue Streams</TabsTrigger>
            <TabsTrigger value="corridors">Per-Corridor Profitability</TabsTrigger>
            <TabsTrigger value="unit-economics">Unit Economics</TabsTrigger>
          </TabsList>

          {/* Revenue Streams Tab */}
          <TabsContent value="streams" className="space-y-4">
            {/* Revenue Stream Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {streamsList.map((stream, index) => {
                const Icon = stream.icon
                const percentage = totalFromStreams > 0 ? (stream.total / totalFromStreams) * 100 : 0
                return (
                  <Card key={index} className={`${stream.borderColor} border-2`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className={`p-2 rounded-lg ${stream.bgColor}`}>
                          <Icon className={`h-5 w-5 ${stream.color}`} />
                        </div>
                        <Badge variant="outline" className={stream.color}>
                          {percentage.toFixed(1)}%
                        </Badge>
                      </div>
                      <CardTitle className="text-base mt-2">{stream.name}</CardTitle>
                      <CardDescription className="text-xs">{stream.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-baseline">
                        <span className={`text-2xl font-bold ${stream.color}`}>{formatCurrency(stream.total)}</span>
                      </div>

                      <Progress value={percentage} className="h-2" />

                      <div className="pt-2 border-t space-y-1">
                        {"perTon" in stream && (
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Per Ton</span>
                            <span className="font-medium">{formatCurrency(stream.perTon)}</span>
                          </div>
                        )}
                        {"perHectare" in stream && (
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Per Hectare</span>
                            <span className="font-medium">{formatCurrency(stream.perHectare)}</span>
                          </div>
                        )}
                        {"percentage" in stream && (
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Margin Rate</span>
                            <span className="font-medium">{stream.percentage}%</span>
                          </div>
                        )}
                      </div>

                      {/* Service Partner Breakdown */}
                      {"breakdown" in stream && stream.breakdown && (
                        <div className="pt-2 border-t space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Truck className="h-3 w-3" /> Logistics
                            </span>
                            <span className="font-medium">{formatCurrency(stream.breakdown.logistics.total)}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Warehouse className="h-3 w-3" /> Storage
                            </span>
                            <span className="font-medium">{formatCurrency(stream.breakdown.storage.total)}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Package className="h-3 w-3" /> Processing
                            </span>
                            <span className="font-medium">{formatCurrency(stream.breakdown.processing.total)}</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Detailed Revenue Table */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Stream Details</CardTitle>
                <CardDescription>Complete breakdown of all AgroBridge revenue channels</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Revenue Stream</TableHead>
                      <TableHead className="text-right">Rate</TableHead>
                      <TableHead className="text-right">Volume</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                      <TableHead className="text-right">% of Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Coordination Margin</div>
                        <div className="text-xs text-muted-foreground">Buy/Sell spread per ton</div>
                      </TableCell>
                      <TableCell className="text-right">₦25,000/ton</TableCell>
                      <TableCell className="text-right">{revenue.totals.totalTons.toFixed(0)} MT</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(revenue.streams.coordination.total)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="text-emerald-600">
                          {((revenue.streams.coordination.total / totalFromStreams) * 100).toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Input Margin</div>
                        <div className="text-xs text-muted-foreground">Fertilizer, seeds, chemicals</div>
                      </TableCell>
                      <TableCell className="text-right">₦15,000/ha (12.5%)</TableCell>
                      <TableCell className="text-right">{revenue.totals.totalHectares.toFixed(0)} ha</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(revenue.streams.inputs.total)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="text-green-600">
                          {((revenue.streams.inputs.total / totalFromStreams) * 100).toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Machinery Facilitation</div>
                        <div className="text-xs text-muted-foreground">Land prep, planting, harvest</div>
                      </TableCell>
                      <TableCell className="text-right">₦12,000/ha (15%)</TableCell>
                      <TableCell className="text-right">{revenue.totals.totalHectares.toFixed(0)} ha</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(revenue.streams.mechanization.total)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="text-amber-600">
                          {((revenue.streams.mechanization.total / totalFromStreams) * 100).toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Service Partner Fees</div>
                        <div className="text-xs text-muted-foreground">Logistics, storage, processing</div>
                      </TableCell>
                      <TableCell className="text-right">₦16,000/ton</TableCell>
                      <TableCell className="text-right">{revenue.totals.totalTons.toFixed(0)} MT</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(revenue.streams.servicePartners.total)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="text-blue-600">
                          {((revenue.streams.servicePartners.total / totalFromStreams) * 100).toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Offtaker Platform Fee</div>
                        <div className="text-xs text-muted-foreground">Contract facilitation</div>
                      </TableCell>
                      <TableCell className="text-right">4% of contract value</TableCell>
                      <TableCell className="text-right">-</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(revenue.streams.offtakerFee.total)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="text-purple-600">
                          {((revenue.streams.offtakerFee.total / totalFromStreams) * 100).toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Risk Premium</div>
                        <div className="text-xs text-muted-foreground">Portfolio risk pooling</div>
                      </TableCell>
                      <TableCell className="text-right">₦8,000/ton</TableCell>
                      <TableCell className="text-right">{revenue.totals.totalTons.toFixed(0)} MT</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(revenue.streams.riskPremium.total)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="text-rose-600">
                          {((revenue.streams.riskPremium.total / totalFromStreams) * 100).toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow className="bg-primary/5 font-bold border-t-2">
                      <TableCell className="font-bold">Total Revenue</TableCell>
                      <TableCell className="text-right">-</TableCell>
                      <TableCell className="text-right">-</TableCell>
                      <TableCell className="text-right text-lg text-primary">
                        {formatCurrency(totalFromStreams)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className="bg-primary">100%</Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Per-Corridor Profitability Tab */}
          <TabsContent value="corridors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Per-Corridor Profitability
                </CardTitle>
                <CardDescription>Total revenue vs costs by region</CardDescription>
              </CardHeader>
              <CardContent>
                {revenue.corridorProfitability.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Corridor</TableHead>
                        <TableHead className="text-right">Farmers</TableHead>
                        <TableHead className="text-right">Hectares</TableHead>
                        <TableHead className="text-right">Volume (MT)</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                        <TableHead className="text-right">Costs</TableHead>
                        <TableHead className="text-right">Profit</TableHead>
                        <TableHead className="text-right">Margin</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {revenue.corridorProfitability.map((corridor, index) => {
                        const margin = corridor.totalRevenue > 0 ? (corridor.profit / corridor.totalRevenue) * 100 : 0
                        const isProfit = corridor.profit > 0
                        return (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{corridor.name}</TableCell>
                            <TableCell className="text-right">{corridor.farmers.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{corridor.hectares.toFixed(0)}</TableCell>
                            <TableCell className="text-right">{corridor.tons.toFixed(0)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(corridor.totalRevenue)}</TableCell>
                            <TableCell className="text-right text-muted-foreground">
                              {formatCurrency(corridor.totalCosts)}
                            </TableCell>
                            <TableCell
                              className={`text-right font-medium ${isProfit ? "text-emerald-600" : "text-red-600"}`}
                            >
                              {formatCurrency(corridor.profit)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge
                                variant="outline"
                                className={
                                  isProfit ? "text-emerald-600 border-emerald-200" : "text-red-600 border-red-200"
                                }
                              >
                                {isProfit && <ArrowUpRight className="h-3 w-3 mr-1" />}
                                {!isProfit && corridor.profit < 0 && <ArrowDownRight className="h-3 w-3 mr-1" />}
                                {corridor.profit === 0 && <Minus className="h-3 w-3 mr-1" />}
                                {margin.toFixed(1)}%
                              </Badge>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No corridor data available yet</p>
                    <p className="text-sm">Complete service events to see corridor profitability</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Corridor Revenue Breakdown */}
            {revenue.corridorProfitability.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {revenue.corridorProfitability.map((corridor, index) => {
                  const margin = corridor.totalRevenue > 0 ? (corridor.profit / corridor.totalRevenue) * 100 : 0
                  return (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center justify-between">
                          {corridor.name}
                          <Badge
                            variant={margin >= 30 ? "default" : margin >= 20 ? "secondary" : "outline"}
                            className={margin >= 30 ? "bg-emerald-600" : ""}
                          >
                            {margin.toFixed(1)}% margin
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <div className="text-lg font-bold">{corridor.farmers}</div>
                            <div className="text-xs text-muted-foreground">Farmers</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold">{corridor.hectares.toFixed(0)}</div>
                            <div className="text-xs text-muted-foreground">Hectares</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold">{corridor.tons.toFixed(0)}</div>
                            <div className="text-xs text-muted-foreground">MT</div>
                          </div>
                        </div>
                        <div className="pt-2 border-t space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Coordination</span>
                            <span>{formatCurrency(corridor.coordinationRevenue)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Inputs</span>
                            <span>{formatCurrency(corridor.inputRevenue)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Mechanization</span>
                            <span>{formatCurrency(corridor.mechanizationRevenue)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Logistics + Storage</span>
                            <span>{formatCurrency(corridor.logisticsRevenue + corridor.storageRevenue)}</span>
                          </div>
                          <div className="flex justify-between text-sm font-medium pt-2 border-t">
                            <span>Net Profit</span>
                            <span className="text-emerald-600">{formatCurrency(corridor.profit)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* Unit Economics Tab */}
          <TabsContent value="unit-economics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="border-2 border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-base">Revenue per Ton</CardTitle>
                  <CardDescription>All-in revenue per metric ton coordinated</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-600">
                    {formatCurrency(revenue.totals.revenuePerTon)}
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Coordination margin</span>
                      <span>₦25,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Service partner fees</span>
                      <span>₦16,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Risk premium</span>
                      <span>₦8,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-base">Revenue per Hectare</CardTitle>
                  <CardDescription>All-in revenue per hectare managed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {formatCurrency(revenue.totals.revenuePerHectare)}
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Input margin</span>
                      <span>₦15,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Mechanization</span>
                      <span>₦12,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Coordination fee</span>
                      <span>₦15,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-base">Revenue per Farmer</CardTitle>
                  <CardDescription>Average revenue per farmer served</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">
                    {formatCurrency(revenue.totals.revenuePerFarmer)}
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avg farm size</span>
                      <span>
                        {revenue.totals.farmersServed > 0
                          ? (revenue.totals.totalHectares / revenue.totals.farmersServed).toFixed(1)
                          : 0}{" "}
                        ha
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avg yield</span>
                      <span>
                        {revenue.totals.farmersServed > 0
                          ? (revenue.totals.totalTons / revenue.totals.farmersServed).toFixed(2)
                          : 0}{" "}
                        MT
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Net per farmer</span>
                      <span>{formatCurrency(revenue.totals.revenuePerFarmer * 0.35)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pricing Model Reference */}
            <Card>
              <CardHeader>
                <CardTitle>AgroBridge Pricing Model Reference</CardTitle>
                <CardDescription>Standard rates used for revenue calculation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Per-Ton Rates</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm p-2 bg-muted/50 rounded">
                        <span>Coordination margin (buy/sell spread)</span>
                        <span className="font-medium">₦25,000</span>
                      </div>
                      <div className="flex justify-between text-sm p-2 bg-muted/50 rounded">
                        <span>Logistics fee</span>
                        <span className="font-medium">₦8,000</span>
                      </div>
                      <div className="flex justify-between text-sm p-2 bg-muted/50 rounded">
                        <span>Storage fee</span>
                        <span className="font-medium">₦5,000</span>
                      </div>
                      <div className="flex justify-between text-sm p-2 bg-muted/50 rounded">
                        <span>Processing fee</span>
                        <span className="font-medium">₦3,000</span>
                      </div>
                      <div className="flex justify-between text-sm p-2 bg-muted/50 rounded">
                        <span>Risk premium</span>
                        <span className="font-medium">₦8,000</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Per-Hectare & Percentage Rates</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm p-2 bg-muted/50 rounded">
                        <span>Input margin (12.5%)</span>
                        <span className="font-medium">₦15,000/ha</span>
                      </div>
                      <div className="flex justify-between text-sm p-2 bg-muted/50 rounded">
                        <span>Mechanization margin (15%)</span>
                        <span className="font-medium">₦12,000/ha</span>
                      </div>
                      <div className="flex justify-between text-sm p-2 bg-muted/50 rounded">
                        <span>Coordination fee</span>
                        <span className="font-medium">₦15,000/ha</span>
                      </div>
                      <div className="flex justify-between text-sm p-2 bg-muted/50 rounded">
                        <span>Offtaker platform fee</span>
                        <span className="font-medium">4% of contract</span>
                      </div>
                      <div className="flex justify-between text-sm p-2 bg-muted/50 rounded">
                        <span>Operational efficiency</span>
                        <span className="font-medium">35% net margin</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
