"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UnitEconomicsDashboard } from "@/components/analytics/unit-economics-dashboard"
import { AGROBRIDGE_REVENUE_PROJECTIONS, formatCurrency } from "@/lib/pricing/agrobridge-revenue-projections"
import {
  Search,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react"

// Demo data for corridors
const corridorEconomics = [
  {
    id: "COR001",
    name: "Kaduna North",
    farmers: 342,
    hectares: 1580,
    totalCost: 12450000,
    totalRevenue: 18675000,
    margin: 6225000,
    marginPercent: 33.3,
    costPerHectare: 7879,
    revenuePerHectare: 11820,
    costPerFarmer: 36404,
    revenuePerFarmer: 54605,
    status: "profitable",
    season: "2024 Main",
  },
  {
    id: "COR002",
    name: "Kano Central",
    farmers: 528,
    hectares: 2340,
    totalCost: 19890000,
    totalRevenue: 28050000,
    margin: 8160000,
    marginPercent: 29.1,
    costPerHectare: 8500,
    revenuePerHectare: 11987,
    costPerFarmer: 37670,
    revenuePerFarmer: 53125,
    status: "profitable",
    season: "2024 Main",
  },
  {
    id: "COR003",
    name: "Plateau East",
    farmers: 187,
    hectares: 890,
    totalCost: 8234000,
    totalRevenue: 7890000,
    margin: -344000,
    marginPercent: -4.4,
    costPerHectare: 9251,
    revenuePerHectare: 8865,
    costPerFarmer: 44032,
    revenuePerFarmer: 42193,
    status: "loss",
    season: "2024 Main",
  },
  {
    id: "COR004",
    name: "Niger South",
    farmers: 412,
    hectares: 1920,
    totalCost: 14760000,
    totalRevenue: 21120000,
    margin: 6360000,
    marginPercent: 30.1,
    costPerHectare: 7688,
    revenuePerHectare: 11000,
    costPerFarmer: 35825,
    revenuePerFarmer: 51262,
    status: "profitable",
    season: "2024 Main",
  },
  {
    id: "COR005",
    name: "Nasarawa West",
    farmers: 156,
    hectares: 680,
    totalCost: 5984000,
    totalRevenue: 6120000,
    margin: 136000,
    marginPercent: 2.2,
    costPerHectare: 8800,
    revenuePerHectare: 9000,
    costPerFarmer: 38359,
    revenuePerFarmer: 39231,
    status: "breakeven",
    season: "2024 Main",
  },
]

// Demo data for farmer-level economics
const farmerEconomics = [
  {
    id: "FRM001",
    name: "Ibrahim Musa",
    corridor: "Kaduna North",
    hectares: 4.5,
    crop: "Maize",
    inputCost: 145000,
    serviceCost: 78000,
    totalCost: 223000,
    yieldMT: 18.5,
    revenue: 351500,
    margin: 128500,
    marginPercent: 36.6,
    status: "profitable",
  },
  {
    id: "FRM002",
    name: "Amina Bello",
    corridor: "Kano Central",
    hectares: 3.2,
    crop: "Rice",
    inputCost: 112000,
    serviceCost: 56000,
    totalCost: 168000,
    yieldMT: 9.6,
    revenue: 288000,
    margin: 120000,
    marginPercent: 41.7,
    status: "profitable",
  },
  {
    id: "FRM003",
    name: "Yusuf Danjuma",
    corridor: "Plateau East",
    hectares: 2.8,
    crop: "Sorghum",
    inputCost: 89000,
    serviceCost: 45000,
    totalCost: 134000,
    yieldMT: 5.2,
    revenue: 104000,
    margin: -30000,
    marginPercent: -28.8,
    status: "loss",
  },
  {
    id: "FRM004",
    name: "Fatima Abdullahi",
    corridor: "Niger South",
    hectares: 5.0,
    crop: "Maize",
    inputCost: 165000,
    serviceCost: 82000,
    totalCost: 247000,
    yieldMT: 21.0,
    revenue: 399000,
    margin: 152000,
    marginPercent: 38.1,
    status: "profitable",
  },
  {
    id: "FRM005",
    name: "Mohammed Sani",
    corridor: "Kaduna North",
    hectares: 6.2,
    crop: "Soybean",
    inputCost: 198000,
    serviceCost: 95000,
    totalCost: 293000,
    yieldMT: 12.4,
    revenue: 310000,
    margin: 17000,
    marginPercent: 5.5,
    status: "breakeven",
  },
  {
    id: "FRM006",
    name: "Hauwa Garba",
    corridor: "Kano Central",
    hectares: 2.0,
    crop: "Rice",
    inputCost: 72000,
    serviceCost: 38000,
    totalCost: 110000,
    yieldMT: 6.2,
    revenue: 186000,
    margin: 76000,
    marginPercent: 40.9,
    status: "profitable",
  },
  {
    id: "FRM007",
    name: "Abubakar Tanko",
    corridor: "Nasarawa West",
    hectares: 3.5,
    crop: "Maize",
    inputCost: 115000,
    serviceCost: 58000,
    totalCost: 173000,
    yieldMT: 10.5,
    revenue: 178500,
    margin: 5500,
    marginPercent: 3.1,
    status: "breakeven",
  },
  {
    id: "FRM008",
    name: "Zainab Umar",
    corridor: "Plateau East",
    hectares: 4.0,
    crop: "Sorghum",
    inputCost: 128000,
    serviceCost: 62000,
    totalCost: 190000,
    yieldMT: 7.2,
    revenue: 144000,
    margin: -46000,
    marginPercent: -31.9,
    status: "loss",
  },
]

// Cost breakdown by category
const costBreakdown = [
  { category: "Seeds & Inputs", amount: 18450000, percent: 30.2 },
  { category: "Land Preparation", amount: 9870000, percent: 16.1 },
  { category: "Fertilizer", amount: 12340000, percent: 20.2 },
  { category: "Mechanization", amount: 8920000, percent: 14.6 },
  { category: "Agrochemicals", amount: 5680000, percent: 9.3 },
  { category: "Harvest & Logistics", amount: 5890000, percent: 9.6 },
]

export default function UnitEconomicsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [corridorFilter, setCorridorFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedFarmer, setSelectedFarmer] = useState<(typeof farmerEconomics)[0] | null>(null)

  // Calculate totals
  const totalCost = corridorEconomics.reduce((sum, c) => sum + c.totalCost, 0)
  const totalRevenue = corridorEconomics.reduce((sum, c) => sum + c.totalRevenue, 0)
  const totalMargin = totalRevenue - totalCost
  const overallMarginPercent = ((totalMargin / totalRevenue) * 100).toFixed(1)
  const totalFarmers = corridorEconomics.reduce((sum, c) => sum + c.farmers, 0)
  const profitableCorridors = corridorEconomics.filter((c) => c.status === "profitable").length
  const lossMakingCorridors = corridorEconomics.filter((c) => c.status === "loss").length

  // Filter farmers
  const filteredFarmers = farmerEconomics.filter((farmer) => {
    const matchesSearch =
      farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCorridor = corridorFilter === "all" || farmer.corridor === corridorFilter
    const matchesStatus = statusFilter === "all" || farmer.status === statusFilter
    return matchesSearch && matchesCorridor && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "profitable":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Profitable</Badge>
      case "loss":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Loss</Badge>
      case "breakeven":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Breakeven</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getMarginIndicator = (percent: number) => {
    if (percent > 10) {
      return <ArrowUpRight className="h-4 w-4 text-green-600" />
    } else if (percent < 0) {
      return <ArrowDownRight className="h-4 w-4 text-red-600" />
    }
    return <Minus className="h-4 w-4 text-amber-600" />
  }

  return (
    <DashboardLayout role="ops_admin">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Unit Economics</h1>
          <p className="text-sm text-muted-foreground">Cost, revenue, and margin analysis per corridor and farmer</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="space-y-6">
        <UnitEconomicsDashboard />

        {/* Primary Financial Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <DollarSign className="h-5 w-5" />
                <span className="text-sm font-medium">Total Cost</span>
              </div>
              <p className="text-3xl font-bold">{formatCurrency(totalCost)}</p>
              <p className="text-xs text-muted-foreground mt-1">All operational expenses</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-medium">Total Revenue</span>
              </div>
              <p className="text-3xl font-bold">{formatCurrency(totalRevenue)}</p>
              <p className="text-xs text-muted-foreground mt-1">Aggregate sales across corridors</p>
            </CardContent>
          </Card>
          <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-2">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-medium">Gross Margin</span>
              </div>
              <p className="text-3xl font-bold text-green-700 dark:text-green-400">{formatCurrency(totalMargin)}</p>
              <p className="text-sm font-semibold text-green-600 dark:text-green-500 mt-1">
                {overallMarginPercent}% margin
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Metrics - Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Users className="h-4 w-4" />
                    <span className="text-xs font-medium">Total Farmers</span>
                  </div>
                  <p className="text-2xl font-bold">{totalFarmers.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-xs font-medium">Profitable Corridors</span>
                  </div>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-400">{profitableCorridors}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-400 mb-1">
                    <TrendingDown className="h-4 w-4" />
                    <span className="text-xs font-medium">Loss Making Corridors</span>
                  </div>
                  <p className="text-2xl font-bold text-red-700 dark:text-red-400">{lossMakingCorridors}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
                  <TableHead className="font-bold">Revenue Stream</TableHead>
                  <TableHead className="text-right font-bold">Year 1</TableHead>
                  <TableHead className="text-right font-bold">Year 2</TableHead>
                  <TableHead className="text-right font-bold">Year 3</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
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
                <TableRow>
                  <TableCell className="font-medium">Marketplace Revenue</TableCell>
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
                <TableRow>
                  <TableCell className="font-medium">Offtake/Data Revenue</TableCell>
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
                <TableRow className="bg-primary/10 font-bold border-t-2">
                  <TableCell className="font-bold text-lg">Total Net Revenue</TableCell>
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
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="corridors" className="space-y-4">
          <TabsList>
            <TabsTrigger value="corridors">By Corridor</TabsTrigger>
            <TabsTrigger value="farmers">By Farmer</TabsTrigger>
            <TabsTrigger value="breakdown">Cost Breakdown</TabsTrigger>
          </TabsList>

          {/* Corridor Economics Tab */}
          <TabsContent value="corridors" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Corridor Unit Economics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Corridor</TableHead>
                        <TableHead className="text-right">Farmers</TableHead>
                        <TableHead className="text-right">Hectares</TableHead>
                        <TableHead className="text-right">Total Cost</TableHead>
                        <TableHead className="text-right">Total Revenue</TableHead>
                        <TableHead className="text-right">Margin</TableHead>
                        <TableHead className="text-right">Margin %</TableHead>
                        <TableHead className="text-right">Cost/Ha</TableHead>
                        <TableHead className="text-right">Rev/Ha</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {corridorEconomics.map((corridor) => (
                        <TableRow key={corridor.id} className={corridor.status === "loss" ? "bg-red-50" : ""}>
                          <TableCell className="font-medium">{corridor.name}</TableCell>
                          <TableCell className="text-right">{corridor.farmers}</TableCell>
                          <TableCell className="text-right">{corridor.hectares.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{formatCurrency(corridor.totalCost)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(corridor.totalRevenue)}</TableCell>
                          <TableCell
                            className={`text-right font-medium ${corridor.margin < 0 ? "text-red-600" : "text-green-600"}`}
                          >
                            {formatCurrency(corridor.margin)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              {getMarginIndicator(corridor.marginPercent)}
                              <span className={corridor.marginPercent < 0 ? "text-red-600" : "text-green-600"}>
                                {corridor.marginPercent.toFixed(1)}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(corridor.costPerHectare)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(corridor.revenuePerHectare)}</TableCell>
                          <TableCell>{getStatusBadge(corridor.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Per Farmer Averages by Corridor */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Per Farmer Averages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Corridor</TableHead>
                        <TableHead className="text-right">Avg Cost/Farmer</TableHead>
                        <TableHead className="text-right">Avg Revenue/Farmer</TableHead>
                        <TableHead className="text-right">Avg Margin/Farmer</TableHead>
                        <TableHead className="text-right">Avg Hectares/Farmer</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {corridorEconomics.map((corridor) => {
                        const avgMarginPerFarmer = corridor.revenuePerFarmer - corridor.costPerFarmer
                        const avgHectaresPerFarmer = (corridor.hectares / corridor.farmers).toFixed(1)
                        return (
                          <TableRow key={corridor.id} className={corridor.status === "loss" ? "bg-red-50" : ""}>
                            <TableCell className="font-medium">{corridor.name}</TableCell>
                            <TableCell className="text-right">{formatCurrency(corridor.costPerFarmer)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(corridor.revenuePerFarmer)}</TableCell>
                            <TableCell
                              className={`text-right font-medium ${avgMarginPerFarmer < 0 ? "text-red-600" : "text-green-600"}`}
                            >
                              {formatCurrency(avgMarginPerFarmer)}
                            </TableCell>
                            <TableCell className="text-right">{avgHectaresPerFarmer} ha</TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Farmer Economics Tab */}
          <TabsContent value="farmers" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="text-base font-semibold">Farmer-Level Economics</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search farmer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 w-48"
                      />
                    </div>
                    <Select value={corridorFilter} onValueChange={setCorridorFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Corridor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Corridors</SelectItem>
                        {corridorEconomics.map((c) => (
                          <SelectItem key={c.id} value={c.name}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="profitable">Profitable</SelectItem>
                        <SelectItem value="breakeven">Breakeven</SelectItem>
                        <SelectItem value="loss">Loss</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Farmer</TableHead>
                        <TableHead>Corridor</TableHead>
                        <TableHead>Crop</TableHead>
                        <TableHead className="text-right">Hectares</TableHead>
                        <TableHead className="text-right">Input Cost</TableHead>
                        <TableHead className="text-right">Service Cost</TableHead>
                        <TableHead className="text-right">Total Cost</TableHead>
                        <TableHead className="text-right">Yield (MT)</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                        <TableHead className="text-right">Margin</TableHead>
                        <TableHead className="text-right">Margin %</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFarmers.map((farmer) => (
                        <TableRow
                          key={farmer.id}
                          className={`cursor-pointer hover:bg-muted/50 ${farmer.status === "loss" ? "bg-red-50" : ""}`}
                          onClick={() => setSelectedFarmer(farmer)}
                        >
                          <TableCell className="font-medium">{farmer.name}</TableCell>
                          <TableCell>{farmer.corridor}</TableCell>
                          <TableCell>{farmer.crop}</TableCell>
                          <TableCell className="text-right">{farmer.hectares}</TableCell>
                          <TableCell className="text-right">{formatCurrency(farmer.inputCost)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(farmer.serviceCost)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(farmer.totalCost)}</TableCell>
                          <TableCell className="text-right">{farmer.yieldMT}</TableCell>
                          <TableCell className="text-right">{formatCurrency(farmer.revenue)}</TableCell>
                          <TableCell
                            className={`text-right font-medium ${farmer.margin < 0 ? "text-red-600" : "text-green-600"}`}
                          >
                            {formatCurrency(farmer.margin)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              {getMarginIndicator(farmer.marginPercent)}
                              <span className={farmer.marginPercent < 0 ? "text-red-600" : "text-green-600"}>
                                {farmer.marginPercent.toFixed(1)}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(farmer.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {filteredFarmers.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">No farmers found matching your filters.</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cost Breakdown Tab */}
          <TabsContent value="breakdown" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Cost Breakdown by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">% of Total</TableHead>
                        <TableHead className="w-64">Distribution</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {costBreakdown.map((item) => (
                        <TableRow key={item.category}>
                          <TableCell className="font-medium">{item.category}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                          <TableCell className="text-right">{item.percent}%</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full" style={{ width: `${item.percent}%` }} />
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Summary */}
                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Costs</span>
                    <span className="font-bold text-lg">{formatCurrency(totalCost)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Key Cost Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Avg Cost per Farmer</span>
                      <span className="font-medium">{formatCurrency(totalCost / totalFarmers)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Avg Cost per Hectare</span>
                      <span className="font-medium">
                        {formatCurrency(totalCost / corridorEconomics.reduce((sum, c) => sum + c.hectares, 0))}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Input Cost Ratio</span>
                      <span className="font-medium">30.2%</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground">Service Cost Ratio</span>
                      <span className="font-medium">69.8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Key Revenue Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Avg Revenue per Farmer</span>
                      <span className="font-medium">{formatCurrency(totalRevenue / totalFarmers)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Avg Revenue per Hectare</span>
                      <span className="font-medium">
                        {formatCurrency(totalRevenue / corridorEconomics.reduce((sum, c) => sum + c.hectares, 0))}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Gross Margin Ratio</span>
                      <span className="font-medium text-green-600">{overallMarginPercent}%</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground">Avg Margin per Farmer</span>
                      <span className="font-medium text-green-600">{formatCurrency(totalMargin / totalFarmers)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Farmer Detail Dialog */}
      <Dialog open={!!selectedFarmer} onOpenChange={() => setSelectedFarmer(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Farmer Economics Detail</DialogTitle>
          </DialogHeader>
          {selectedFarmer && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{selectedFarmer.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedFarmer.corridor} • {selectedFarmer.crop}
                  </p>
                </div>
                {getStatusBadge(selectedFarmer.status)}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-muted-foreground">Farm Size</p>
                  <p className="font-semibold">{selectedFarmer.hectares} ha</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-muted-foreground">Yield</p>
                  <p className="font-semibold">{selectedFarmer.yieldMT} MT</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Cost Breakdown</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-muted-foreground">Input Cost</span>
                    <span>{formatCurrency(selectedFarmer.inputCost)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-muted-foreground">Service Cost</span>
                    <span>{formatCurrency(selectedFarmer.serviceCost)}</span>
                  </div>
                  <div className="flex justify-between py-1 font-medium">
                    <span>Total Cost</span>
                    <span>{formatCurrency(selectedFarmer.totalCost)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Revenue & Margin</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-muted-foreground">Gross Revenue</span>
                    <span>{formatCurrency(selectedFarmer.revenue)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-muted-foreground">Less: Total Cost</span>
                    <span className="text-red-600">-{formatCurrency(selectedFarmer.totalCost)}</span>
                  </div>
                  <div className="flex justify-between py-1 font-medium">
                    <span>Net Margin</span>
                    <span className={selectedFarmer.margin < 0 ? "text-red-600" : "text-green-600"}>
                      {formatCurrency(selectedFarmer.margin)} ({selectedFarmer.marginPercent.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm pt-2">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-muted-foreground">Cost per Hectare</p>
                  <p className="font-semibold">{formatCurrency(selectedFarmer.totalCost / selectedFarmer.hectares)}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-muted-foreground">Revenue per Hectare</p>
                  <p className="font-semibold">{formatCurrency(selectedFarmer.revenue / selectedFarmer.hectares)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
