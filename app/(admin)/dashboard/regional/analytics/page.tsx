"use client"

import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, Users, Target, Award, DollarSign, Leaf } from "lucide-react"
import { AGROBRIDGE_PRICING_MODEL } from "@/lib/pricing/agrobridge-pricing-model"
import { AGROBRIDGE_REVENUE_PROJECTIONS, formatCurrency } from "@/lib/pricing/agrobridge-revenue-projections"

export default function RegionalAnalyticsPage() {
  // Demo data - regional analytics
  const analytics = {
    overview: {
      farmers: 533,
      hectares: 1671,
      services: 1245,
      corridors: 15,
    },
    efficiency: {
      farmerPerAgent: 14.4,
      hectaresPerAgent: 45.2,
      servicesPerMonth: 311,
      completionRate: 83,
    },
    byCrop: [
      { crop: "Maize", farmers: 245, hectares: 756, yield: 2.9 },
      { crop: "Rice", farmers: 145, hectares: 523, yield: 3.2 },
      { crop: "Cassava", farmers: 98, hectares: 267, yield: 15.6 },
      { crop: "Yam", farmers: 45, hectares: 125, yield: 12.3 },
    ],
    performance: [
      { metric: "Farmer Enrollment Rate", value: 89, target: 85 },
      { metric: "Service Completion Rate", value: 83, target: 80 },
      { metric: "Yield Achievement", value: 88, target: 90 },
      { metric: "Agent Retention Rate", value: 92, target: 85 },
    ],
  }

  const totalRevenue = analytics.overview.hectares * AGROBRIDGE_PRICING_MODEL.TOTAL_REVENUE_PER_HECTARE.average
  const revenuePerFarmer = totalRevenue / analytics.overview.farmers
  const revenuePerHectare = AGROBRIDGE_PRICING_MODEL.TOTAL_REVENUE_PER_HECTARE.average

  return (
    <DashboardLayout allowedRoles={["regional_manager"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Regional Analytics</h1>
          <p className="text-muted-foreground">Deep dive into regional performance metrics and revenue</p>
        </div>

        <Tabs defaultValue="operational" className="space-y-6">
          <TabsList>
            <TabsTrigger value="operational">Operational Metrics</TabsTrigger>
            <TabsTrigger value="financial">Financial Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="operational" className="space-y-6">
            {/* Overview Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Farmers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.overview.farmers}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Hectares</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.overview.hectares}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Services Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.overview.services}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Corridors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.overview.corridors}</div>
                </CardContent>
              </Card>
            </div>

            {/* Efficiency Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Operational Efficiency</CardTitle>
                <CardDescription>Key efficiency indicators across your region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <div className="text-2xl font-bold">{analytics.efficiency.farmerPerAgent}</div>
                      <div className="text-sm text-muted-foreground">Farmers per Agent</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <div className="text-2xl font-bold">{analytics.efficiency.hectaresPerAgent}</div>
                      <div className="text-sm text-muted-foreground">Hectares per Agent</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <div className="text-2xl font-bold">{analytics.efficiency.servicesPerMonth}</div>
                      <div className="text-sm text-muted-foreground">Services per Month</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <div className="text-2xl font-bold">{analytics.efficiency.completionRate}%</div>
                      <div className="text-sm text-muted-foreground">Completion Rate</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance vs Target */}
            <Card>
              <CardHeader>
                <CardTitle>Performance vs Target</CardTitle>
                <CardDescription>How your region performs against set targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.performance.map((metric) => (
                    <div key={metric.metric} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{metric.metric}</span>
                        <span className="text-sm text-muted-foreground">
                          {metric.value}% / {metric.target}%
                        </span>
                      </div>
                      <Progress value={metric.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Analytics by Crop */}
            <Card>
              <CardHeader>
                <CardTitle>Analytics by Crop Type</CardTitle>
                <CardDescription>Performance breakdown by crop category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.byCrop.map((crop) => (
                    <div key={crop.crop} className="flex items-center justify-between border-b pb-4 last:border-0">
                      <div>
                        <h4 className="font-semibold">{crop.crop}</h4>
                        <p className="text-sm text-muted-foreground">
                          {crop.farmers} farmers · {crop.hectares} ha
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{crop.yield} t/ha</div>
                        <div className="text-xs text-muted-foreground">Avg. Yield</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            {/* Revenue Overview */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-sm font-medium text-green-600">Total Regional Revenue</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-700">{formatCurrency(totalRevenue)}</div>
                  <p className="text-xs text-muted-foreground mt-1">Across {analytics.overview.corridors} corridors</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-sm font-medium text-muted-foreground">Per Farmer Revenue</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formatCurrency(revenuePerFarmer)}</div>
                  <p className="text-xs text-muted-foreground mt-1">Average per farmer</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-emerald-600" />
                    <CardTitle className="text-sm font-medium text-muted-foreground">Per Hectare Revenue</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formatCurrency(revenuePerHectare)}</div>
                  <p className="text-xs text-muted-foreground mt-1">Conservative model</p>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Layers Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Multi-Layered Revenue Model</CardTitle>
                <CardDescription>5 invisible monetization layers driving regional revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Layer 1: Input Margin (12.5%)</span>
                      <Badge variant="secondary">
                        {formatCurrency(
                          analytics.overview.hectares *
                            AGROBRIDGE_PRICING_MODEL.MONETIZATION_LAYERS.inputMargin.perHectare,
                        )}
                      </Badge>
                    </div>
                    <Progress
                      value={
                        ((analytics.overview.hectares *
                          AGROBRIDGE_PRICING_MODEL.MONETIZATION_LAYERS.inputMargin.perHectare) /
                          totalRevenue) *
                        100
                      }
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground">Bulk procurement + quality assurance</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Layer 2: Mechanization Margin (15%)</span>
                      <Badge variant="secondary">
                        {formatCurrency(
                          analytics.overview.hectares *
                            AGROBRIDGE_PRICING_MODEL.MONETIZATION_LAYERS.mechanizationMargin.perHectare,
                        )}
                      </Badge>
                    </div>
                    <Progress
                      value={
                        ((analytics.overview.hectares *
                          AGROBRIDGE_PRICING_MODEL.MONETIZATION_LAYERS.mechanizationMargin.perHectare) /
                          totalRevenue) *
                        100
                      }
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground">Aggregated demand + scheduled reliability</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Layer 3: Coordination Fee (6%)</span>
                      <Badge variant="secondary">
                        {formatCurrency(
                          analytics.overview.hectares *
                            AGROBRIDGE_PRICING_MODEL.MONETIZATION_LAYERS.coordinationFee.perHectare,
                        )}
                      </Badge>
                    </div>
                    <Progress
                      value={
                        ((analytics.overview.hectares *
                          AGROBRIDGE_PRICING_MODEL.MONETIZATION_LAYERS.coordinationFee.perHectare) /
                          totalRevenue) *
                        100
                      }
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground">Platform infrastructure + execution assurance</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Layer 4: Risk Premium</span>
                      <Badge variant="secondary">
                        {formatCurrency(
                          analytics.overview.hectares *
                            AGROBRIDGE_PRICING_MODEL.MONETIZATION_LAYERS.riskPremium.perHectare,
                        )}
                      </Badge>
                    </div>
                    <Progress
                      value={
                        ((analytics.overview.hectares *
                          AGROBRIDGE_PRICING_MODEL.MONETIZATION_LAYERS.riskPremium.perHectare) /
                          totalRevenue) *
                        100
                      }
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground">Portfolio-level risk pooling + yield smoothing</p>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between font-bold">
                      <span>Total Regional Revenue</span>
                      <span className="text-primary">{formatCurrency(totalRevenue)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform-Wide 3-Year Revenue Projections */}
            <Card>
              <CardHeader>
                <CardTitle>Platform-Wide 3-Year Revenue Projections</CardTitle>
                <CardDescription>Investor-grade revenue model across all streams</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-bold">Metric</TableHead>
                      <TableHead className="text-right font-bold">Year 1</TableHead>
                      <TableHead className="text-right font-bold">Year 2</TableHead>
                      <TableHead className="text-right font-bold">Year 3</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Farmers Onboarded</TableCell>
                      <TableCell className="text-right">
                        {AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_1.farmersOnboarded.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_2.farmersOnboarded.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_3.farmersOnboarded.toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Avg Net Revenue per Farmer (NGN)</TableCell>
                      <TableCell className="text-right">
                        {AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_1.avgNetRevenuePerFarmer.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_2.avgNetRevenuePerFarmer.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_3.avgNetRevenuePerFarmer.toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <TableRow className="bg-blue-50">
                      <TableCell className="font-medium">AaaS Revenue</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_1.aaasRevenue)}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_2.aaasRevenue)}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_3.aaasRevenue)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">AaaS Net Revenue</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_1.aaasNetRevenue)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_2.aaasNetRevenue)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_3.aaasNetRevenue)}
                      </TableCell>
                    </TableRow>
                    <TableRow className="bg-green-50">
                      <TableCell className="font-medium">Marketplace GMV (NGN)</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_1.marketplaceGMV)}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_2.marketplaceGMV)}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_3.marketplaceGMV)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Marketplace Take Rate (5%)</TableCell>
                      <TableCell className="text-right">
                        {(AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_1.marketplaceTakeRate * 100).toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-right">
                        {(AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_2.marketplaceTakeRate * 100).toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-right">
                        {(AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_3.marketplaceTakeRate * 100).toFixed(2)}%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Marketplace Revenue (NGN)</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_1.marketplaceRevenue)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_2.marketplaceRevenue)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_3.marketplaceRevenue)}
                      </TableCell>
                    </TableRow>
                    <TableRow className="bg-purple-50">
                      <TableCell className="font-medium">Offtake Subscription Clients</TableCell>
                      <TableCell className="text-right">
                        {AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_1.offtakeSubscriptionClients}
                      </TableCell>
                      <TableCell className="text-right">
                        {AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_2.offtakeSubscriptionClients}
                      </TableCell>
                      <TableCell className="text-right">
                        {AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_3.offtakeSubscriptionClients}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Offtake Subscription Fee (NGN) (Annual)</TableCell>
                      <TableCell className="text-right">
                        {AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_1.offtakeSubscriptionFeeAnnual.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_2.offtakeSubscriptionFeeAnnual.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_3.offtakeSubscriptionFeeAnnual.toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Offtake/Data Revenue (NGN)</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_1.offtakeDataRevenue)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_2.offtakeDataRevenue)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_3.offtakeDataRevenue)}
                      </TableCell>
                    </TableRow>
                    <TableRow className="bg-muted/50 font-bold border-t-2">
                      <TableCell className="font-bold">Total Net Revenue</TableCell>
                      <TableCell className="text-right text-lg">
                        {formatCurrency(AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_1.totalNetRevenue)}
                      </TableCell>
                      <TableCell className="text-right text-lg">
                        {formatCurrency(AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_2.totalNetRevenue)}
                      </TableCell>
                      <TableCell className="text-right text-lg">
                        {formatCurrency(AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_3.totalNetRevenue)}
                      </TableCell>
                    </TableRow>
                    <TableRow className="bg-primary/10 font-bold border-t">
                      <TableCell className="font-bold text-lg">Total Revenue</TableCell>
                      <TableCell className="text-right text-xl font-bold text-primary">
                        {formatCurrency(AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_1.totalRevenue)}
                      </TableCell>
                      <TableCell className="text-right text-xl font-bold text-primary">
                        {formatCurrency(AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_2.totalRevenue)}
                      </TableCell>
                      <TableCell className="text-right text-xl font-bold text-primary">
                        {formatCurrency(AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_3.totalRevenue)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
