"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Calendar,
  AlertTriangle,
  Droplets,
  Bug,
  Leaf,
  Send,
  Clock,
  CheckCircle2,
  Users,
  MapPin,
  Filter,
  Plus,
  MessageSquare,
  Smartphone,
  Bell,
} from "lucide-react"

// Demo advisory data - rules-based, not AI
const advisories = [
  {
    id: "ADV-001",
    type: "reminder",
    category: "planting",
    title: "Planting Window Opening - Maize",
    message:
      "Optimal planting window for maize in Kano South corridor begins in 3 days. Ensure land preparation is complete.",
    targetType: "corridor",
    targetName: "Kano South",
    affectedFarmers: 245,
    triggerCondition: "planting_window_approaching",
    priority: "high",
    channels: ["sms", "whatsapp"],
    status: "pending",
    scheduledFor: "2024-06-15",
    createdAt: "2024-06-12",
  },
  {
    id: "ADV-002",
    type: "alert",
    category: "fertilizer",
    title: "First Fertilizer Application Due",
    message:
      "NPK fertilizer application due for maize planted on June 1st. Apply within 14-21 days of planting for optimal results.",
    targetType: "cluster",
    targetName: "Dawaki Cluster",
    affectedFarmers: 87,
    triggerCondition: "days_since_planting >= 14",
    priority: "high",
    channels: ["sms", "whatsapp", "app"],
    status: "sent",
    sentAt: "2024-06-14 08:00",
    createdAt: "2024-06-14",
  },
  {
    id: "ADV-003",
    type: "warning",
    category: "pest",
    title: "Fall Armyworm Alert - Moderate Risk",
    message:
      "Fall armyworm activity reported in neighboring areas. Scout fields regularly and report any signs of infestation.",
    targetType: "corridor",
    targetName: "Kaduna North",
    affectedFarmers: 312,
    triggerCondition: "pest_report_nearby",
    priority: "medium",
    channels: ["sms", "whatsapp"],
    status: "sent",
    sentAt: "2024-06-13 14:30",
    createdAt: "2024-06-13",
  },
  {
    id: "ADV-004",
    type: "recommendation",
    category: "irrigation",
    title: "Irrigation Advisory - Dry Spell Expected",
    message: "Weather forecast indicates 7-day dry spell. Prioritize irrigation for crops at flowering stage.",
    targetType: "corridor",
    targetName: "Kano South",
    affectedFarmers: 156,
    triggerCondition: "weather_dry_spell_forecast",
    priority: "medium",
    channels: ["sms"],
    status: "pending",
    scheduledFor: "2024-06-16",
    createdAt: "2024-06-14",
  },
  {
    id: "ADV-005",
    type: "reminder",
    category: "harvest",
    title: "Harvest Window Approaching",
    message: "Maize crops planted in March are approaching harvest maturity. Schedule harvest within next 14 days.",
    targetType: "farmer",
    targetName: "23 Farmers",
    affectedFarmers: 23,
    triggerCondition: "days_to_harvest <= 14",
    priority: "high",
    channels: ["sms", "whatsapp", "app"],
    status: "sent",
    sentAt: "2024-06-14 09:00",
    createdAt: "2024-06-14",
  },
]

// Planting calendar data
const plantingCalendar = [
  { crop: "Maize", corridor: "Kano South", windowStart: "2024-06-15", windowEnd: "2024-07-15", status: "upcoming" },
  { crop: "Maize", corridor: "Kaduna North", windowStart: "2024-06-10", windowEnd: "2024-07-10", status: "active" },
  { crop: "Rice", corridor: "Kano South", windowStart: "2024-06-20", windowEnd: "2024-07-20", status: "upcoming" },
  { crop: "Soybean", corridor: "Kaduna North", windowStart: "2024-06-25", windowEnd: "2024-07-25", status: "upcoming" },
]

// Fertilizer schedule
const fertilizerSchedule = [
  {
    crop: "Maize",
    application: "Basal NPK",
    timing: "At planting",
    daysFromPlanting: 0,
    status: "completed",
    farmersCompliant: 89,
  },
  {
    crop: "Maize",
    application: "First Urea",
    timing: "2-3 weeks",
    daysFromPlanting: 14,
    status: "due",
    farmersCompliant: 45,
  },
  {
    crop: "Maize",
    application: "Second Urea",
    timing: "5-6 weeks",
    daysFromPlanting: 35,
    status: "upcoming",
    farmersCompliant: 0,
  },
  {
    crop: "Rice",
    application: "Basal NPK",
    timing: "At transplanting",
    daysFromPlanting: 0,
    status: "upcoming",
    farmersCompliant: 0,
  },
]

// Pest alerts
const pestAlerts = [
  {
    pest: "Fall Armyworm",
    severity: "moderate",
    corridors: ["Kaduna North"],
    reportedDate: "2024-06-13",
    status: "active",
  },
  { pest: "Stem Borer", severity: "low", corridors: ["Kano South"], reportedDate: "2024-06-10", status: "monitoring" },
]

const categoryIcons = {
  planting: Calendar,
  fertilizer: Droplets,
  pest: Bug,
  harvest: Leaf,
  irrigation: Droplets,
}

const categoryColors = {
  planting: "bg-green-100 text-green-700",
  fertilizer: "bg-blue-100 text-blue-700",
  pest: "bg-red-100 text-red-700",
  harvest: "bg-amber-100 text-amber-700",
  irrigation: "bg-cyan-100 text-cyan-700",
}

export default function AdvisoryPage() {
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewAdvisory, setShowNewAdvisory] = useState(false)

  const filteredAdvisories = advisories.filter((adv) => {
    const matchesFilter = filter === "all" || adv.status === filter || adv.category === filter
    const matchesSearch =
      adv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      adv.targetName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const pendingCount = advisories.filter((a) => a.status === "pending").length
  const sentToday = advisories.filter((a) => a.sentAt?.includes("2024-06-14")).length
  const totalReached = advisories.filter((a) => a.status === "sent").reduce((sum, a) => sum + a.affectedFarmers, 0)

  return (
    <DashboardLayout role="ops_admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Advisory Intelligence</h1>
            <p className="text-muted-foreground">Rules-based guidance for farmers and field agents</p>
          </div>
          <Button onClick={() => setShowNewAdvisory(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Advisory
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <Send className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{sentToday}</p>
                  <p className="text-sm text-muted-foreground">Sent Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalReached.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Farmers Reached</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pestAlerts.filter((p) => p.status === "active").length}</p>
                  <p className="text-sm text-muted-foreground">Active Pest Alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="advisories" className="space-y-4">
          <TabsList>
            <TabsTrigger value="advisories">Advisories</TabsTrigger>
            <TabsTrigger value="calendar">Planting Calendar</TabsTrigger>
            <TabsTrigger value="fertilizer">Fertilizer Schedule</TabsTrigger>
            <TabsTrigger value="pest">Pest Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="advisories" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1 max-w-sm">
                <Input
                  placeholder="Search advisories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Advisories</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="planting">Planting</SelectItem>
                  <SelectItem value="fertilizer">Fertilizer</SelectItem>
                  <SelectItem value="pest">Pest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Advisory List */}
            <div className="space-y-3">
              {filteredAdvisories.map((advisory) => {
                const Icon = categoryIcons[advisory.category as keyof typeof categoryIcons] || Bell
                return (
                  <Card key={advisory.id} className={advisory.priority === "high" ? "border-l-4 border-l-red-500" : ""}>
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${categoryColors[advisory.category as keyof typeof categoryColors]}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{advisory.title}</h3>
                              <p className="text-sm text-muted-foreground">{advisory.message}</p>
                            </div>
                            <Badge variant={advisory.status === "sent" ? "default" : "secondary"}>
                              {advisory.status === "sent" ? (
                                <>
                                  <CheckCircle2 className="mr-1 h-3 w-3" /> Sent
                                </>
                              ) : (
                                <>
                                  <Clock className="mr-1 h-3 w-3" /> Pending
                                </>
                              )}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {advisory.targetName}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {advisory.affectedFarmers} farmers
                            </span>
                            <span className="flex items-center gap-1">
                              {advisory.channels.includes("whatsapp") && <MessageSquare className="h-3 w-3" />}
                              {advisory.channels.includes("sms") && <Smartphone className="h-3 w-3" />}
                              {advisory.channels.join(", ")}
                            </span>
                            {advisory.sentAt && <span>Sent: {advisory.sentAt}</span>}
                            {advisory.scheduledFor && advisory.status === "pending" && (
                              <span>Scheduled: {advisory.scheduledFor}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Planting Calendar</CardTitle>
                <CardDescription>Optimal planting windows by crop and corridor</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Crop</th>
                        <th className="text-left py-3 px-4 font-medium">Corridor</th>
                        <th className="text-left py-3 px-4 font-medium">Window Start</th>
                        <th className="text-left py-3 px-4 font-medium">Window End</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plantingCalendar.map((item, idx) => (
                        <tr key={idx} className="border-b last:border-0">
                          <td className="py-3 px-4 font-medium">{item.crop}</td>
                          <td className="py-3 px-4">{item.corridor}</td>
                          <td className="py-3 px-4">{item.windowStart}</td>
                          <td className="py-3 px-4">{item.windowEnd}</td>
                          <td className="py-3 px-4">
                            <Badge variant={item.status === "active" ? "default" : "secondary"}>{item.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fertilizer" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Fertilizer Application Schedule</CardTitle>
                <CardDescription>Recommended fertilizer timing by crop stage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Crop</th>
                        <th className="text-left py-3 px-4 font-medium">Application</th>
                        <th className="text-left py-3 px-4 font-medium">Timing</th>
                        <th className="text-left py-3 px-4 font-medium">Days from Planting</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                        <th className="text-right py-3 px-4 font-medium">Compliance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fertilizerSchedule.map((item, idx) => (
                        <tr
                          key={idx}
                          className={`border-b last:border-0 ${item.status === "due" ? "bg-amber-50" : ""}`}
                        >
                          <td className="py-3 px-4 font-medium">{item.crop}</td>
                          <td className="py-3 px-4">{item.application}</td>
                          <td className="py-3 px-4">{item.timing}</td>
                          <td className="py-3 px-4">Day {item.daysFromPlanting}</td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                item.status === "completed"
                                  ? "default"
                                  : item.status === "due"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {item.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            {item.farmersCompliant > 0 ? `${item.farmersCompliant}%` : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pest" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Pest & Disease Alerts</CardTitle>
                <CardDescription>Current pest and disease monitoring status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pestAlerts.map((alert, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        alert.severity === "moderate"
                          ? "border-amber-300 bg-amber-50"
                          : alert.severity === "high"
                            ? "border-red-300 bg-red-50"
                            : "border-border"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            alert.severity === "moderate"
                              ? "bg-amber-200"
                              : alert.severity === "high"
                                ? "bg-red-200"
                                : "bg-muted"
                          }`}
                        >
                          <Bug
                            className={`h-5 w-5 ${
                              alert.severity === "moderate"
                                ? "text-amber-700"
                                : alert.severity === "high"
                                  ? "text-red-700"
                                  : "text-muted-foreground"
                            }`}
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{alert.pest}</h4>
                          <p className="text-sm text-muted-foreground">
                            {alert.corridors.join(", ")} | Reported: {alert.reportedDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={alert.status === "active" ? "destructive" : "secondary"}>
                          {alert.severity} risk
                        </Badge>
                        <Badge variant="outline">{alert.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Advisory Dialog */}
        <Dialog open={showNewAdvisory} onOpenChange={setShowNewAdvisory}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Advisory</DialogTitle>
              <DialogDescription>Send rules-based guidance to farmers</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Advisory Type</Label>
                <Select defaultValue="reminder">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reminder">Reminder</SelectItem>
                    <SelectItem value="alert">Alert</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="recommendation">Recommendation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select defaultValue="planting">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planting">Planting</SelectItem>
                    <SelectItem value="fertilizer">Fertilizer</SelectItem>
                    <SelectItem value="pest">Pest & Disease</SelectItem>
                    <SelectItem value="irrigation">Irrigation</SelectItem>
                    <SelectItem value="harvest">Harvest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input placeholder="Advisory title..." />
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea placeholder="Write the advisory message..." rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Target</Label>
                  <Select defaultValue="corridor">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Farmers</SelectItem>
                      <SelectItem value="corridor">Corridor</SelectItem>
                      <SelectItem value="cluster">Cluster</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Corridor</Label>
                  <Select defaultValue="kano-south">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kano-south">Kano South</SelectItem>
                      <SelectItem value="kaduna-north">Kaduna North</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Channels</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="rounded" />
                    SMS
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="rounded" />
                    WhatsApp
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    App
                  </label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewAdvisory(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowNewAdvisory(false)}>
                <Send className="mr-2 h-4 w-4" />
                Send Advisory
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
