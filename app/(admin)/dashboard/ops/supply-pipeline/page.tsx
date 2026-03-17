"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Truck,
  Search,
  Filter,
  RefreshCw,
  Wheat,
  Leaf,
  AlertCircle,
  CheckCircle2,
  Clock,
  MapPin,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts"

// Demo data - Corridor Supply Summary
const corridorSupplyData = [
  {
    id: "COR-001",
    name: "Zaria Central",
    crop: "Maize",
    farmers: 245,
    hectares: 612,
    expectedYield: 1836,
    actualYield: 1654,
    delivered: 1420,
    fulfillmentRate: 77.3,
    status: "at_risk",
    shortfall: 416,
    dueDate: "2024-12-30",
  },
  {
    id: "COR-002",
    name: "Giwa",
    crop: "Rice",
    farmers: 189,
    hectares: 473,
    expectedYield: 1892,
    actualYield: 1945,
    delivered: 1780,
    fulfillmentRate: 94.1,
    status: "on_track",
    shortfall: 0,
    dueDate: "2024-12-28",
  },
  {
    id: "COR-003",
    name: "Sabon Gari",
    crop: "Sorghum",
    farmers: 312,
    hectares: 780,
    expectedYield: 2340,
    actualYield: 1872,
    delivered: 1560,
    fulfillmentRate: 66.7,
    status: "critical",
    shortfall: 780,
    dueDate: "2024-12-25",
  },
  {
    id: "COR-004",
    name: "Kaduna South",
    crop: "Maize",
    farmers: 156,
    hectares: 390,
    expectedYield: 1170,
    actualYield: 1112,
    delivered: 980,
    fulfillmentRate: 83.8,
    status: "on_track",
    shortfall: 0,
    dueDate: "2025-01-05",
  },
  {
    id: "COR-005",
    name: "Igabi",
    crop: "Cowpea",
    farmers: 98,
    hectares: 196,
    expectedYield: 392,
    actualYield: 310,
    delivered: 245,
    fulfillmentRate: 62.5,
    status: "critical",
    shortfall: 147,
    dueDate: "2024-12-22",
  },
]

// Demo data - Contract fulfillment
const contractFulfillment = [
  {
    id: "CTR-001",
    offtaker: "Olam Nigeria",
    crop: "Maize",
    contractVolume: 2500,
    expectedYield: 2800,
    delivered: 1980,
    remaining: 520,
    progress: 79.2,
    dueDate: "2024-12-30",
    status: "on_track",
    corridors: ["Zaria Central", "Kaduna South"],
  },
  {
    id: "CTR-002",
    offtaker: "Dangote Foods",
    crop: "Rice",
    contractVolume: 1800,
    expectedYield: 1892,
    delivered: 1780,
    remaining: 20,
    progress: 98.9,
    dueDate: "2024-12-28",
    status: "on_track",
    corridors: ["Giwa"],
  },
  {
    id: "CTR-003",
    offtaker: "Flour Mills",
    crop: "Sorghum",
    contractVolume: 2000,
    expectedYield: 2340,
    delivered: 1560,
    remaining: 440,
    progress: 78.0,
    dueDate: "2024-12-25",
    status: "at_risk",
    corridors: ["Sabon Gari"],
  },
  {
    id: "CTR-004",
    offtaker: "Premier Seeds",
    crop: "Cowpea",
    contractVolume: 350,
    expectedYield: 392,
    delivered: 245,
    remaining: 105,
    progress: 70.0,
    dueDate: "2024-12-22",
    status: "critical",
    corridors: ["Igabi"],
  },
]

// Demo data - Risk items
const riskItems = [
  {
    id: "RISK-001",
    type: "Yield Shortfall",
    corridor: "Sabon Gari",
    crop: "Sorghum",
    impact: "780 MT below target",
    severity: "critical",
    reason: "Late planting + pest damage",
    affectedFarmers: 78,
  },
  {
    id: "RISK-002",
    type: "Delivery Delay",
    corridor: "Igabi",
    crop: "Cowpea",
    impact: "Contract deadline in 3 days",
    severity: "critical",
    reason: "Transport unavailable",
    affectedFarmers: 45,
  },
  {
    id: "RISK-003",
    type: "Quality Rejection",
    corridor: "Zaria Central",
    crop: "Maize",
    impact: "120 MT rejected (high moisture)",
    severity: "high",
    reason: "Improper drying",
    affectedFarmers: 23,
  },
  {
    id: "RISK-004",
    type: "Harvest Delay",
    corridor: "Kaduna South",
    crop: "Maize",
    impact: "15% unharvested",
    severity: "medium",
    reason: "Labor shortage",
    affectedFarmers: 31,
  },
]

// Chart data - Expected vs Delivered by Corridor
const yieldComparisonData = corridorSupplyData.map((c) => ({
  name: c.name.length > 10 ? c.name.substring(0, 10) + "..." : c.name,
  fullName: c.name,
  expected: c.expectedYield,
  actual: c.actualYield,
  delivered: c.delivered,
  shortfall: Math.max(0, c.expectedYield - c.delivered),
}))

// Chart data - Crop distribution
const cropDistribution = [
  { crop: "Maize", expected: 3006, delivered: 2400, gap: 606 },
  { crop: "Rice", expected: 1892, delivered: 1780, gap: 112 },
  { crop: "Sorghum", expected: 2340, delivered: 1560, gap: 780 },
  { crop: "Cowpea", expected: 392, delivered: 245, gap: 147 },
]

export default function SupplyPipelinePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [cropFilter, setCropFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const handleRefresh = () => {
    setLastRefresh(new Date())
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Calculate totals
  const totalExpected = corridorSupplyData.reduce((sum, c) => sum + c.expectedYield, 0)
  const totalActual = corridorSupplyData.reduce((sum, c) => sum + c.actualYield, 0)
  const totalDelivered = corridorSupplyData.reduce((sum, c) => sum + c.delivered, 0)
  const totalShortfall = totalExpected - totalDelivered
  const overallFulfillment = Math.round((totalDelivered / totalExpected) * 100)
  const criticalCount = corridorSupplyData.filter((c) => c.status === "critical").length
  const atRiskCount = corridorSupplyData.filter((c) => c.status === "at_risk").length

  // Filter corridors
  const filteredCorridors = corridorSupplyData.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCrop = cropFilter === "all" || c.crop.toLowerCase() === cropFilter.toLowerCase()
    const matchesStatus = statusFilter === "all" || c.status === statusFilter
    return matchesSearch && matchesCrop && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "at_risk":
        return <Badge className="bg-amber-500 hover:bg-amber-600">At Risk</Badge>
      case "on_track":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600">On Track</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "text-red-600"
      case "at_risk":
        return "text-amber-600"
      case "on_track":
        return "text-emerald-600"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <DashboardLayout allowedRoles={["ops_admin"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Supply Pipeline</h1>
            <p className="text-sm text-muted-foreground">
              Expected vs Delivered Yield • Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2 bg-transparent">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Summary Stats - Data First */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-6">
          {/* Total Expected */}
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Expected</p>
                <p className="text-2xl font-bold">{totalExpected.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">MT Total</p>
              </div>
            </CardContent>
          </Card>

          {/* Actual Yield */}
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Actual Yield</p>
                <p className="text-2xl font-bold">{totalActual.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-xs">
                  {totalActual >= totalExpected ? (
                    <TrendingUp className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={totalActual >= totalExpected ? "text-emerald-600" : "text-red-600"}>
                    {Math.round(((totalActual - totalExpected) / totalExpected) * 100)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivered */}
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Delivered</p>
                <p className="text-2xl font-bold">{totalDelivered.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{overallFulfillment}% fulfilled</p>
              </div>
            </CardContent>
          </Card>

          {/* Shortfall */}
          <Card className={`border ${totalShortfall > 500 ? "border-red-300 bg-red-50" : "border-border"}`}>
            <CardContent className="p-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Shortfall</p>
                <p className={`text-2xl font-bold ${totalShortfall > 500 ? "text-red-600" : "text-foreground"}`}>
                  {totalShortfall.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">MT remaining</p>
              </div>
            </CardContent>
          </Card>

          {/* Critical */}
          <Card className={`border ${criticalCount > 0 ? "border-red-300 bg-red-50" : "border-border"}`}>
            <CardContent className="p-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Critical</p>
                <p className={`text-2xl font-bold ${criticalCount > 0 ? "text-red-600" : "text-foreground"}`}>
                  {criticalCount}
                </p>
                <p className="text-xs text-muted-foreground">Corridors</p>
              </div>
            </CardContent>
          </Card>

          {/* At Risk */}
          <Card className={`border ${atRiskCount > 0 ? "border-amber-300 bg-amber-50" : "border-border"}`}>
            <CardContent className="p-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">At Risk</p>
                <p className={`text-2xl font-bold ${atRiskCount > 0 ? "text-amber-600" : "text-foreground"}`}>
                  {atRiskCount}
                </p>
                <p className="text-xs text-muted-foreground">Corridors</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="corridors" className="space-y-4">
          <TabsList>
            <TabsTrigger value="corridors" className="gap-2">
              <MapPin className="h-4 w-4" />
              By Corridor
            </TabsTrigger>
            <TabsTrigger value="contracts" className="gap-2">
              <Truck className="h-4 w-4" />
              Contract Fulfillment
            </TabsTrigger>
            <TabsTrigger value="risks" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              Risks
              {criticalCount + atRiskCount > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 px-1.5 text-xs">
                  {criticalCount + atRiskCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="charts" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Charts
            </TabsTrigger>
          </TabsList>

          {/* Corridors Tab */}
          <TabsContent value="corridors" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search corridor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-[200px]"
                  />
                </div>
                <Select value={cropFilter} onValueChange={setCropFilter}>
                  <SelectTrigger className="w-[130px]">
                    <Wheat className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Crop" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Crops</SelectItem>
                    <SelectItem value="maize">Maize</SelectItem>
                    <SelectItem value="rice">Rice</SelectItem>
                    <SelectItem value="sorghum">Sorghum</SelectItem>
                    <SelectItem value="cowpea">Cowpea</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="at_risk">At Risk</SelectItem>
                    <SelectItem value="on_track">On Track</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Corridor Table */}
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Corridor</TableHead>
                    <TableHead>Crop</TableHead>
                    <TableHead className="text-right">Farmers</TableHead>
                    <TableHead className="text-right">Expected (MT)</TableHead>
                    <TableHead className="text-right">Actual (MT)</TableHead>
                    <TableHead className="text-right">Delivered (MT)</TableHead>
                    <TableHead className="text-right">Shortfall</TableHead>
                    <TableHead>Fulfillment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCorridors.map((corridor) => (
                    <TableRow
                      key={corridor.id}
                      className={
                        corridor.status === "critical"
                          ? "bg-red-50"
                          : corridor.status === "at_risk"
                            ? "bg-amber-50"
                            : ""
                      }
                    >
                      <TableCell className="font-medium">{corridor.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-emerald-600" />
                          {corridor.crop}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{corridor.farmers}</TableCell>
                      <TableCell className="text-right font-medium">
                        {corridor.expectedYield.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={
                            corridor.actualYield >= corridor.expectedYield ? "text-emerald-600" : "text-red-600"
                          }
                        >
                          {corridor.actualYield.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">{corridor.delivered.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        {corridor.shortfall > 0 ? (
                          <span className="text-red-600 font-medium">-{corridor.shortfall.toLocaleString()}</span>
                        ) : (
                          <span className="text-emerald-600">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <Progress
                            value={corridor.fulfillmentRate}
                            className={`h-2 flex-1 ${
                              corridor.status === "critical"
                                ? "[&>div]:bg-red-500"
                                : corridor.status === "at_risk"
                                  ? "[&>div]:bg-amber-500"
                                  : "[&>div]:bg-emerald-500"
                            }`}
                          />
                          <span className="text-xs font-medium w-10">{corridor.fulfillmentRate.toFixed(0)}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(corridor.status)}</TableCell>
                      <TableCell className="text-sm">{new Date(corridor.dueDate).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Contract Fulfillment Tab */}
          <TabsContent value="contracts" className="space-y-4">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Offtaker</TableHead>
                    <TableHead>Crop</TableHead>
                    <TableHead className="text-right">Contract (MT)</TableHead>
                    <TableHead className="text-right">Delivered (MT)</TableHead>
                    <TableHead className="text-right">Remaining</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Corridors</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contractFulfillment.map((contract) => (
                    <TableRow
                      key={contract.id}
                      className={
                        contract.status === "critical"
                          ? "bg-red-50"
                          : contract.status === "at_risk"
                            ? "bg-amber-50"
                            : ""
                      }
                    >
                      <TableCell className="font-medium">{contract.offtaker}</TableCell>
                      <TableCell>{contract.crop}</TableCell>
                      <TableCell className="text-right font-medium">
                        {contract.contractVolume.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">{contract.delivered.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        {contract.remaining > 0 ? (
                          <span className={contract.status !== "on_track" ? "text-red-600 font-medium" : ""}>
                            {contract.remaining.toLocaleString()}
                          </span>
                        ) : (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 inline" />
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <Progress
                            value={contract.progress}
                            className={`h-2 flex-1 ${
                              contract.status === "critical"
                                ? "[&>div]:bg-red-500"
                                : contract.status === "at_risk"
                                  ? "[&>div]:bg-amber-500"
                                  : "[&>div]:bg-emerald-500"
                            }`}
                          />
                          <span className="text-xs font-medium w-10">{contract.progress.toFixed(0)}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {new Date(contract.dueDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {contract.corridors.map((c) => (
                            <Badge key={c} variant="outline" className="text-xs">
                              {c}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(contract.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Risks Tab */}
          <TabsContent value="risks" className="space-y-4">
            {riskItems.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-4" />
                  <p className="text-lg font-medium">No active risks</p>
                  <p className="text-sm text-muted-foreground">All corridors are performing as expected</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {riskItems.map((risk) => (
                  <Card
                    key={risk.id}
                    className={
                      risk.severity === "critical"
                        ? "border-red-300 bg-red-50"
                        : risk.severity === "high"
                          ? "border-amber-300 bg-amber-50"
                          : "border-border"
                    }
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                              risk.severity === "critical"
                                ? "bg-red-100"
                                : risk.severity === "high"
                                  ? "bg-amber-100"
                                  : "bg-muted"
                            }`}
                          >
                            <AlertTriangle
                              className={`h-5 w-5 ${
                                risk.severity === "critical"
                                  ? "text-red-600"
                                  : risk.severity === "high"
                                    ? "text-amber-600"
                                    : "text-muted-foreground"
                              }`}
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{risk.type}</span>
                              <Badge
                                variant={risk.severity === "critical" ? "destructive" : "secondary"}
                                className={risk.severity === "high" ? "bg-amber-500 hover:bg-amber-600" : ""}
                              >
                                {risk.severity}
                              </Badge>
                            </div>
                            <p className="text-sm">
                              <span className="text-muted-foreground">Corridor:</span>{" "}
                              <span className="font-medium">{risk.corridor}</span>
                              <span className="mx-2 text-muted-foreground">•</span>
                              <span className="text-muted-foreground">Crop:</span>{" "}
                              <span className="font-medium">{risk.crop}</span>
                            </p>
                            <p
                              className={`text-sm font-medium ${getStatusColor(risk.severity === "critical" ? "critical" : risk.severity === "high" ? "at_risk" : "on_track")}`}
                            >
                              {risk.impact}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              <AlertCircle className="h-3 w-3 inline mr-1" />
                              {risk.reason} • {risk.affectedFarmers} farmers affected
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Charts Tab */}
          <TabsContent value="charts" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Expected vs Delivered by Corridor */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Expected vs Delivered by Corridor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={yieldComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                          formatter={(value: number) => [`${value.toLocaleString()} MT`]}
                        />
                        <Legend />
                        <Bar dataKey="expected" name="Expected" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="delivered" name="Delivered" radius={[4, 4, 0, 0]}>
                          {yieldComparisonData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                entry.delivered >= entry.expected * 0.9
                                  ? "#10b981"
                                  : entry.delivered >= entry.expected * 0.7
                                    ? "#f59e0b"
                                    : "#ef4444"
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Crop Distribution */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Supply Gap by Crop</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={cropDistribution}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis type="number" className="text-xs" />
                        <YAxis dataKey="crop" type="category" className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                          formatter={(value: number) => [`${value.toLocaleString()} MT`]}
                        />
                        <Legend />
                        <Bar dataKey="delivered" name="Delivered" fill="#10b981" radius={[0, 4, 4, 0]} />
                        <Bar dataKey="gap" name="Gap" fill="#ef4444" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary Table */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Crop Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Crop</TableHead>
                      <TableHead className="text-right">Expected (MT)</TableHead>
                      <TableHead className="text-right">Delivered (MT)</TableHead>
                      <TableHead className="text-right">Gap (MT)</TableHead>
                      <TableHead>Fulfillment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cropDistribution.map((crop) => {
                      const fulfillment = Math.round((crop.delivered / crop.expected) * 100)
                      return (
                        <TableRow key={crop.crop}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Wheat className="h-4 w-4 text-amber-600" />
                              {crop.crop}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{crop.expected.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{crop.delivered.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <span className="text-red-600 font-medium">-{crop.gap.toLocaleString()}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 min-w-[120px]">
                              <Progress
                                value={fulfillment}
                                className={`h-2 flex-1 ${
                                  fulfillment < 70
                                    ? "[&>div]:bg-red-500"
                                    : fulfillment < 90
                                      ? "[&>div]:bg-amber-500"
                                      : "[&>div]:bg-emerald-500"
                                }`}
                              />
                              <span className="text-xs font-medium w-10">{fulfillment}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
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
