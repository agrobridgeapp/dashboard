"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Search,
  TrendingUp,
  TrendingDown,
  Timer,
  Tractor,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"

// SLA performance by service type
const serviceTypeSLA = [
  {
    type: "Land Preparation",
    totalJobs: 145,
    onTime: 132,
    delayed: 10,
    failed: 3,
    avgResponseTime: 2.3, // days
    targetResponseTime: 3,
    slaPercentage: 91,
  },
  {
    type: "Planting",
    totalJobs: 138,
    onTime: 128,
    delayed: 8,
    failed: 2,
    avgResponseTime: 1.8,
    targetResponseTime: 2,
    slaPercentage: 93,
  },
  {
    type: "Fertilizer Application",
    totalJobs: 256,
    onTime: 238,
    delayed: 15,
    failed: 3,
    avgResponseTime: 1.5,
    targetResponseTime: 2,
    slaPercentage: 93,
  },
  {
    type: "Pest Control",
    totalJobs: 89,
    onTime: 78,
    delayed: 8,
    failed: 3,
    avgResponseTime: 1.2,
    targetResponseTime: 1,
    slaPercentage: 88,
  },
  {
    type: "Harvesting",
    totalJobs: 112,
    onTime: 95,
    delayed: 12,
    failed: 5,
    avgResponseTime: 2.8,
    targetResponseTime: 3,
    slaPercentage: 85,
  },
]

// Partner SLA performance
const partnerSLA = [
  {
    id: "P001",
    name: "AgriMech Services",
    type: "Mechanization",
    totalJobs: 85,
    onTime: 78,
    delayed: 5,
    failed: 2,
    avgRating: 4.6,
    slaPercentage: 92,
    trend: "up",
  },
  {
    id: "P002",
    name: "FarmInputs Plus",
    type: "Input Supplier",
    totalJobs: 120,
    onTime: 108,
    delayed: 10,
    failed: 2,
    avgRating: 4.4,
    slaPercentage: 90,
    trend: "stable",
  },
  {
    id: "P003",
    name: "GreenField Tractors",
    type: "Mechanization",
    totalJobs: 68,
    onTime: 58,
    delayed: 7,
    failed: 3,
    avgRating: 4.2,
    slaPercentage: 85,
    trend: "down",
  },
  {
    id: "P004",
    name: "CropCare Solutions",
    type: "Agro-Chemical",
    totalJobs: 95,
    onTime: 82,
    delayed: 10,
    failed: 3,
    avgRating: 4.3,
    slaPercentage: 86,
    trend: "up",
  },
  {
    id: "P005",
    name: "HarvestPro Ltd",
    type: "Mechanization",
    totalJobs: 45,
    onTime: 36,
    delayed: 6,
    failed: 3,
    avgRating: 3.9,
    slaPercentage: 80,
    trend: "down",
  },
]

// Recent SLA breaches
const recentBreaches = [
  {
    id: "SVC-2024-456",
    farmer: "Musa Abdullahi",
    service: "Fertilizer Application",
    partner: "FarmInputs Plus",
    dueDate: "2024-10-10",
    completedDate: "2024-10-12",
    delayDays: 2,
    reason: "Stock shortage",
    corridor: "Kaduna North",
  },
  {
    id: "SVC-2024-478",
    farmer: "Amina Ibrahim",
    service: "Land Preparation",
    partner: "GreenField Tractors",
    dueDate: "2024-10-08",
    completedDate: "2024-10-11",
    delayDays: 3,
    reason: "Equipment breakdown",
    corridor: "Kaduna Central",
  },
  {
    id: "SVC-2024-492",
    farmer: "Yusuf Bello",
    service: "Pest Control",
    partner: "CropCare Solutions",
    dueDate: "2024-10-12",
    completedDate: null,
    delayDays: 4,
    reason: "Pending",
    corridor: "Kaduna South",
  },
]

export default function SLAMonitoringPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  // Calculate overall metrics
  const totalJobs = serviceTypeSLA.reduce((sum, s) => sum + s.totalJobs, 0)
  const totalOnTime = serviceTypeSLA.reduce((sum, s) => sum + s.onTime, 0)
  const totalDelayed = serviceTypeSLA.reduce((sum, s) => sum + s.delayed, 0)
  const totalFailed = serviceTypeSLA.reduce((sum, s) => sum + s.failed, 0)
  const overallSLA = Math.round((totalOnTime / totalJobs) * 100)

  const filteredPartners = partnerSLA.filter((partner) => {
    const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || partner.type.toLowerCase().includes(typeFilter.toLowerCase())
    return matchesSearch && matchesType
  })

  const stats = [
    {
      name: "Overall SLA",
      value: `${overallSLA}%`,
      icon: BarChart3,
      color: "text-primary bg-primary/10",
      trend: overallSLA >= 90 ? "good" : "warning",
    },
    {
      name: "On-Time Delivery",
      value: totalOnTime.toString(),
      icon: CheckCircle,
      color: "text-emerald-600 bg-emerald-100",
    },
    { name: "Delayed Services", value: totalDelayed.toString(), icon: Clock, color: "text-amber-600 bg-amber-100" },
    { name: "Failed/Cancelled", value: totalFailed.toString(), icon: XCircle, color: "text-red-600 bg-red-100" },
  ]

  return (
    <DashboardLayout allowedRoles={["ops_admin"]}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">SLA Monitoring</h1>
          <p className="text-muted-foreground">Track service level agreement performance across partners</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.name} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", stat.color)}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* SLA by Service Type */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>SLA by Service Type</CardTitle>
            <CardDescription>Performance breakdown for each service category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {serviceTypeSLA.map((service) => (
                <div key={service.type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tractor className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{service.type}</span>
                      <Badge variant="secondary" className="text-xs">
                        {service.totalJobs} jobs
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-emerald-600">{service.onTime} on-time</span>
                      <span className="text-amber-600">{service.delayed} delayed</span>
                      <span
                        className={cn(
                          "font-bold",
                          service.slaPercentage >= 90
                            ? "text-emerald-600"
                            : service.slaPercentage >= 80
                              ? "text-amber-600"
                              : "text-red-600",
                        )}
                      >
                        {service.slaPercentage}%
                      </span>
                    </div>
                  </div>
                  <Progress
                    value={service.slaPercentage}
                    className={cn(
                      "h-2",
                      service.slaPercentage >= 90
                        ? "[&>div]:bg-emerald-500"
                        : service.slaPercentage >= 80
                          ? "[&>div]:bg-amber-500"
                          : "[&>div]:bg-red-500",
                    )}
                  />
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Timer className="h-3 w-3" />
                    Avg response: {service.avgResponseTime} days (target: {service.targetResponseTime} days)
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Partner SLA Performance */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Partner SLA Performance</CardTitle>
                <CardDescription>Individual partner service level tracking</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search partner..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-48"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="mechanization">Mechanization</SelectItem>
                    <SelectItem value="input">Input Supplier</SelectItem>
                    <SelectItem value="agro">Agro-Chemical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-center">Jobs</TableHead>
                  <TableHead className="text-center">On-Time</TableHead>
                  <TableHead className="text-center">Delayed</TableHead>
                  <TableHead className="text-center">Rating</TableHead>
                  <TableHead className="text-right">SLA %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPartners.map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{partner.name}</span>
                        {partner.trend === "up" && <TrendingUp className="h-4 w-4 text-emerald-600" />}
                        {partner.trend === "down" && <TrendingDown className="h-4 w-4 text-red-600" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{partner.type}</Badge>
                    </TableCell>
                    <TableCell className="text-center">{partner.totalJobs}</TableCell>
                    <TableCell className="text-center text-emerald-600">{partner.onTime}</TableCell>
                    <TableCell className="text-center text-amber-600">{partner.delayed}</TableCell>
                    <TableCell className="text-center">{partner.avgRating}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className={cn(
                          partner.slaPercentage >= 90
                            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                            : partner.slaPercentage >= 80
                              ? "bg-amber-100 text-amber-700 border-amber-200"
                              : "bg-red-100 text-red-700 border-red-200",
                        )}
                      >
                        {partner.slaPercentage}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent SLA Breaches */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Recent SLA Breaches
            </CardTitle>
            <CardDescription>Services that missed their delivery targets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentBreaches.map((breach) => (
                <div
                  key={breach.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-red-50/50 border-red-200"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-white">
                        {breach.id}
                      </Badge>
                      <span className="font-medium">{breach.service}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Farmer: {breach.farmer} • Partner: {breach.partner}
                    </p>
                    <p className="text-xs text-muted-foreground">Corridor: {breach.corridor}</p>
                  </div>
                  <div className="mt-2 sm:mt-0 sm:text-right">
                    <Badge variant="destructive" className="mb-1">
                      {breach.delayDays} days late
                    </Badge>
                    <p className="text-xs text-muted-foreground">Due: {breach.dueDate}</p>
                    <p className="text-xs text-red-600">Reason: {breach.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
