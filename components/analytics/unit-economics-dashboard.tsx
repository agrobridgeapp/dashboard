"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { AGROBRIDGE_PRICING_MODEL, calculateUnitEconomics } from "@/lib/pricing/unit-economics-calculator"
import { TrendingUp, DollarSign, Users, Leaf, AlertTriangle, CheckCircle2 } from "lucide-react"

export function UnitEconomicsDashboard() {
  // Calculate scenarios
  const normalScenario = calculateUnitEconomics({
    cropType: "maize",
    hectares: 5000,
    farmersCount: 5000,
    avgYieldTonsPerHectare: 1,
    contractedOfftakerPrice: 300000,
    yieldVariance: 0,
  })

  const mildShock = calculateUnitEconomics({
    cropType: "maize",
    hectares: 5000,
    farmersCount: 5000,
    avgYieldTonsPerHectare: 1,
    contractedOfftakerPrice: 300000,
    yieldVariance: -0.1,
  })

  const moderateShock = calculateUnitEconomics({
    cropType: "maize",
    hectares: 5000,
    farmersCount: 5000,
    avgYieldTonsPerHectare: 1,
    contractedOfftakerPrice: 300000,
    yieldVariance: -0.2,
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">AgroBridge Unit Economics</h2>
        <p className="text-muted-foreground mt-2">
          Multi-layered monetization model with portfolio-level risk management
        </p>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Per Hectare</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(normalScenario.revenuePerHectare)}</div>
            <p className="text-xs text-muted-foreground mt-1">₦45k - ₦55k range</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Per Farmer</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(normalScenario.revenuePerFarmer)}</div>
            <p className="text-xs text-muted-foreground mt-1">Invisible to farmer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AgroBridge Margin</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{normalScenario.agrobridgeMarginPercent.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(normalScenario.agrobridgeGrossRevenue)} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Farmer Profit Margin</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{normalScenario.farmerProfitMargin.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(normalScenario.avgPayoutPerFarmer)} avg payout
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Multi-Layered Revenue Breakdown</CardTitle>
          <CardDescription>5 invisible monetization layers per corridor (5,000 farmers)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Layer 1: Input Margin (12.5%)</span>
                <span className="text-muted-foreground">
                  {formatCurrency(normalScenario.agrobridgeRevenueBreakdown.inputMargin)}
                </span>
              </div>
              <Progress
                value={
                  (normalScenario.agrobridgeRevenueBreakdown.inputMargin / normalScenario.agrobridgeGrossRevenue) * 100
                }
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">Bulk procurement + quality assurance</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Layer 2: Mechanization Margin (15%)</span>
                <span className="text-muted-foreground">
                  {formatCurrency(normalScenario.agrobridgeRevenueBreakdown.mechanizationMargin)}
                </span>
              </div>
              <Progress
                value={
                  (normalScenario.agrobridgeRevenueBreakdown.mechanizationMargin /
                    normalScenario.agrobridgeGrossRevenue) *
                  100
                }
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">Aggregated demand + scheduled reliability</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Layer 3: Coordination Fee (6%)</span>
                <span className="text-muted-foreground">
                  {formatCurrency(normalScenario.agrobridgeRevenueBreakdown.coordinationFee)}
                </span>
              </div>
              <Progress
                value={
                  (normalScenario.agrobridgeRevenueBreakdown.coordinationFee / normalScenario.agrobridgeGrossRevenue) *
                  100
                }
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">Platform infrastructure + execution assurance</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Layer 4: Risk Premium</span>
                <span className="text-muted-foreground">
                  {formatCurrency(normalScenario.agrobridgeRevenueBreakdown.riskPremium)}
                </span>
              </div>
              <Progress
                value={
                  (normalScenario.agrobridgeRevenueBreakdown.riskPremium / normalScenario.agrobridgeGrossRevenue) * 100
                }
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">Portfolio-level risk pooling + yield smoothing</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Layer 5: Offtaker Fee (4%)</span>
                <span className="text-muted-foreground">
                  {formatCurrency(normalScenario.agrobridgeRevenueBreakdown.offtakerFee)}
                </span>
              </div>
              <Progress
                value={
                  (normalScenario.agrobridgeRevenueBreakdown.offtakerFee / normalScenario.agrobridgeGrossRevenue) * 100
                }
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">Supply predictability + quality + single counterparty</p>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between font-bold">
                <span>Total AgroBridge Revenue</span>
                <span className="text-primary">{formatCurrency(normalScenario.agrobridgeGrossRevenue)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stress Test Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle>Yield Variance Stress Tests</CardTitle>
          <CardDescription>Portfolio-level risk management across scenarios</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="normal" className="space-y-4">
            <TabsList>
              <TabsTrigger value="normal">Normal (100%)</TabsTrigger>
              <TabsTrigger value="mild">Mild Shock (-10%)</TabsTrigger>
              <TabsTrigger value="moderate">Moderate (-20%)</TabsTrigger>
            </TabsList>

            <TabsContent value="normal" className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="font-semibold">Base Case: Both Parties Win</span>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Volume</p>
                  <p className="text-2xl font-bold">{normalScenario.totalTons.toLocaleString()} tons</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Farmer Avg Payout</p>
                  <p className="text-2xl font-bold">{formatCurrency(normalScenario.avgPayoutPerFarmer)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">AgroBridge Revenue</p>
                  <p className="text-2xl font-bold">{formatCurrency(normalScenario.agrobridgeGrossRevenue)}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Farmer makes ₦25k profit over production cost. AgroBridge captures full margin invisibly.
              </p>
            </TabsContent>

            <TabsContent value="mild" className="space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="font-semibold">Mild Shock: Model Survives</span>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Volume</p>
                  <p className="text-2xl font-bold">{mildShock.totalTons.toLocaleString()} tons</p>
                  <Badge variant="outline" className="text-yellow-600">
                    -10% yield
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Farmer Avg Payout</p>
                  <p className="text-2xl font-bold">{formatCurrency(mildShock.avgPayoutPerFarmer)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">AgroBridge Revenue</p>
                  <p className="text-2xl font-bold">{formatCurrency(mildShock.agrobridgeGrossRevenue)}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Farmer breaks even. AgroBridge margin compresses but still profitable. No defaults.
              </p>
            </TabsContent>

            <TabsContent value="moderate" className="space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <span className="font-semibold">Moderate Shock: Relationship Management Needed</span>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Volume</p>
                  <p className="text-2xl font-bold">{moderateShock.totalTons.toLocaleString()} tons</p>
                  <Badge variant="outline" className="text-orange-600">
                    -20% yield
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Farmer Avg Payout</p>
                  <p className="text-2xl font-bold">{formatCurrency(moderateShock.avgPayoutPerFarmer)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">AgroBridge Revenue</p>
                  <p className="text-2xl font-bold">{formatCurrency(moderateShock.agrobridgeGrossRevenue)}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Farmer takes small loss. AgroBridge margin significantly compressed. Portfolio-level absorption kicks
                in.
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 3-Year Revenue Projection */}
      <Card>
        <CardHeader>
          <CardTitle>3-Year Revenue Projection</CardTitle>
          <CardDescription>Conservative scale-up with multi-stream monetization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(AGROBRIDGE_PRICING_MODEL.SCALE_ECONOMICS.threeYearProjection).map(([year, data]) => (
              <div key={year} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold capitalize">{year}</h4>
                  <Badge variant={year === "year3" ? "default" : "secondary"}>
                    {formatCurrency(data.revenue + (data.offtakerPremiums || 0) + (data.additionalStreams || 0))}
                  </Badge>
                </div>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{data.corridors} corridors</span>
                    <span className="text-muted-foreground">{data.farmers.toLocaleString()} farmers</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Core AaaS Revenue</span>
                    <span className="font-medium">{formatCurrency(data.revenue)}</span>
                  </div>
                  {data.offtakerPremiums && (
                    <div className="flex justify-between">
                      <span>Offtaker Premiums</span>
                      <span className="font-medium">{formatCurrency(data.offtakerPremiums)}</span>
                    </div>
                  )}
                  {data.additionalStreams && (
                    <div className="flex justify-between">
                      <span>Data + Finance + Exports</span>
                      <span className="font-medium">{formatCurrency(data.additionalStreams)}</span>
                    </div>
                  )}
                </div>
                <Progress value={(Number.parseInt(year.replace("year", "")) / 3) * 100} className="h-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
