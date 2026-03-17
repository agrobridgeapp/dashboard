"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Download, TrendingUp, Users, Tractor, ArrowUpRight, ArrowDownRight, Target } from "lucide-react"

const farmerGrowthData = [
  { month: "Jul", farmers: 1200, active: 980 },
  { month: "Aug", farmers: 1450, active: 1150 },
  { month: "Sep", farmers: 1680, active: 1380 },
  { month: "Oct", farmers: 2100, active: 1750 },
  { month: "Nov", farmers: 2450, active: 2100 },
  { month: "Dec", farmers: 2847, active: 2450 },
]

const serviceData = [
  { month: "Jul", mechanization: 45, inputs: 78, irrigation: 12 },
  { month: "Aug", mechanization: 62, inputs: 95, irrigation: 18 },
  { month: "Sep", mechanization: 88, inputs: 120, irrigation: 25 },
  { month: "Oct", mechanization: 75, inputs: 145, irrigation: 32 },
  { month: "Nov", mechanization: 95, inputs: 168, irrigation: 28 },
  { month: "Dec", mechanization: 110, inputs: 190, irrigation: 35 },
]

const yieldData = [
  { crop: "Maize", baseline: 2.1, current: 3.2 },
  { crop: "Rice", baseline: 2.8, current: 4.1 },
  { crop: "Soybean", baseline: 1.5, current: 2.3 },
  { crop: "Sorghum", baseline: 1.8, current: 2.6 },
]

const regionDistribution = [
  { name: "Kaduna", value: 1250, color: "#1B5E3C" },
  { name: "Kano", value: 680, color: "#2E7D52" },
  { name: "Niger", value: 420, color: "#4CAF50" },
  { name: "Plateau", value: 310, color: "#81C784" },
  { name: "Others", value: 187, color: "#C8E6C9" },
]

const revenueData = [
  { month: "Jul", revenue: 45, target: 50 },
  { month: "Aug", revenue: 62, target: 60 },
  { month: "Sep", revenue: 78, target: 75 },
  { month: "Oct", revenue: 95, target: 90 },
  { month: "Nov", revenue: 115, target: 110 },
  { month: "Dec", revenue: 142, target: 130 },
]

const kpis = [
  {
    title: "Total Farmers",
    value: "2,847",
    change: "+15.2%",
    trend: "up",
    icon: Users,
    description: "vs last quarter",
  },
  {
    title: "Services Delivered",
    value: "1,245",
    change: "+23.8%",
    trend: "up",
    icon: Tractor,
    description: "this quarter",
  },
  {
    title: "Avg Yield Improvement",
    value: "34%",
    change: "+8%",
    trend: "up",
    icon: TrendingUp,
    description: "across crops",
  },
  {
    title: "Contract Fulfilment",
    value: "87%",
    change: "-3%",
    trend: "down",
    icon: Target,
    description: "on-time delivery",
  },
]

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      {/* Time Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Select defaultValue="6m">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last 30 days</SelectItem>
              <SelectItem value="3m">Last 3 months</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="kaduna">Kaduna</SelectItem>
              <SelectItem value="kano">Kano</SelectItem>
              <SelectItem value="niger">Niger</SelectItem>
              <SelectItem value="plateau">Plateau</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-primary/10 p-2.5">
                  <kpi.icon className="h-5 w-5 text-primary" />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    kpi.trend === "up" ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {kpi.change}
                  {kpi.trend === "up" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">{kpi.value}</p>
                <p className="text-sm text-muted-foreground">{kpi.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{kpi.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="growth" className="space-y-4">
        <TabsList>
          <TabsTrigger value="growth">Farmer Growth</TabsTrigger>
          <TabsTrigger value="services">Service Analytics</TabsTrigger>
          <TabsTrigger value="yield">Yield Impact</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="growth" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2 border-border/50">
              <CardHeader>
                <CardTitle>Farmer Registration Trend</CardTitle>
                <CardDescription>Total vs active farmers over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={farmerGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="farmers"
                        name="Total Farmers"
                        stroke="#1B5E3C"
                        fill="#1B5E3C"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="active"
                        name="Active Farmers"
                        stroke="#4CAF50"
                        fill="#4CAF50"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Regional Distribution</CardTitle>
                <CardDescription>Farmers by region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={regionDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {regionDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                  {regionDistribution.map((region) => (
                    <div key={region.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: region.color }} />
                        <span>{region.name}</span>
                      </div>
                      <span className="font-medium">{region.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Services by Category</CardTitle>
                <CardDescription>Monthly service delivery breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={serviceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="mechanization" name="Mechanization" fill="#1B5E3C" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="inputs" name="Inputs" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="irrigation" name="Irrigation" fill="#81C784" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Service Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { label: "Average Response Time", value: "4.2 hours", change: "-12%" },
                  { label: "Service Completion Rate", value: "94.5%", change: "+2.3%" },
                  { label: "Partner Utilization", value: "78%", change: "+5%" },
                  { label: "Customer Satisfaction", value: "4.6/5", change: "+0.2" },
                ].map((metric) => (
                  <div key={metric.label} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{metric.label}</p>
                      <p className="text-2xl font-bold text-primary">{metric.value}</p>
                    </div>
                    <span
                      className={`text-sm font-medium ${metric.change.startsWith("+") || metric.change.startsWith("-") ? (metric.change.startsWith("+") ? "text-emerald-600" : "text-emerald-600") : "text-emerald-600"}`}
                    >
                      {metric.change}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="yield" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Yield Improvement by Crop</CardTitle>
                <CardDescription>Baseline vs current yield (tons/hectare)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={yieldData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" stroke="#6b7280" fontSize={12} />
                      <YAxis dataKey="crop" type="category" stroke="#6b7280" fontSize={12} width={80} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="baseline" name="Baseline" fill="#9CA3AF" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="current" name="Current" fill="#1B5E3C" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Impact Summary</CardTitle>
                <CardDescription>Agricultural outcomes improvement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {yieldData.map((crop) => {
                  const improvement = (((crop.current - crop.baseline) / crop.baseline) * 100).toFixed(0)
                  return (
                    <div key={crop.crop} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{crop.crop}</span>
                        <span className="text-emerald-600 font-semibold">+{improvement}%</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>
                          {crop.baseline} → {crop.current} tons/ha
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(crop.current / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2 border-border/50">
              <CardHeader>
                <CardTitle>Revenue vs Target</CardTitle>
                <CardDescription>Monthly platform revenue (₦ Millions)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="target"
                        name="Target"
                        stroke="#9CA3AF"
                        strokeDasharray="5 5"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        name="Actual Revenue"
                        stroke="#1B5E3C"
                        strokeWidth={3}
                        dot={{ fill: "#1B5E3C", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>By service category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { category: "Service Fees", amount: 82.5, percentage: 58 },
                  { category: "Commission", amount: 38.2, percentage: 27 },
                  { category: "Advisory", amount: 14.3, percentage: 10 },
                  { category: "Other", amount: 7.0, percentage: 5 },
                ].map((item) => (
                  <div key={item.category} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{item.category}</span>
                      <span className="font-medium">₦{item.amount}M</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t mt-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Total Revenue</span>
                    <span className="font-bold text-primary">₦142M</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
