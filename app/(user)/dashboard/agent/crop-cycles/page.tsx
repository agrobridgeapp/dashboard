"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  Play,
  Calendar,
  User,
  Wheat,
  ChevronRight,
  MapPin,
  Tractor,
  Droplets,
  Bug,
  Truck,
  Warehouse,
  Leaf,
  Loader2,
} from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

const serviceTypeIcons: Record<string, typeof Tractor> = {
  land_prep: Tractor,
  planting: Leaf,
  fertilizer: Droplets,
  pest_control: Bug,
  irrigation: Droplets,
  harvest: Wheat,
  transport: Truck,
  storage: Warehouse,
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: typeof Clock }> = {
  planned: { label: "Planned", color: "text-slate-600", bgColor: "bg-slate-100", icon: Calendar },
  scheduled: { label: "Scheduled", color: "text-blue-700", bgColor: "bg-blue-100", icon: Clock },
  in_progress: { label: "In Progress", color: "text-amber-700", bgColor: "bg-amber-100", icon: Play },
  completed: { label: "Done", color: "text-emerald-700", bgColor: "bg-emerald-100", icon: CheckCircle },
  verified: { label: "Verified", color: "text-green-700", bgColor: "bg-green-100", icon: CheckCircle },
  overdue: { label: "OVERDUE", color: "text-red-700", bgColor: "bg-red-100", icon: AlertTriangle },
}

const cropIcons: Record<string, string> = {
  maize: "🌽", rice: "🌾", soybean: "🫘", sorghum: "🌾",
  millet: "🌾", groundnut: "🥜", cassava: "🥔", cowpea: "🫘",
}

function getEventStatus(event: any): string {
  if (event.status === "completed" || event.status === "verified") return event.status
  if (event.status === "in_progress") return "in_progress"
  if (event.scheduled_date && new Date(event.scheduled_date) < new Date() && event.status !== "completed") return "overdue"
  if (event.status === "scheduled") return "scheduled"
  return "planned"
}

function cycleProgress(events: any[]): number {
  if (!events.length) return 0
  const done = events.filter((e) => e.status === "completed" || e.status === "verified").length
  return Math.round((done / events.length) * 100)
}

function getNextAction(events: any[]): { event: any; isOverdue: boolean } | null {
  const overdue = events.find((e) => getEventStatus(e) === "overdue")
  if (overdue) return { event: overdue, isOverdue: true }
  const inProgress = events.find((e) => e.status === "in_progress")
  if (inProgress) return { event: inProgress, isOverdue: false }
  const scheduled = events.find((e) => e.status === "scheduled")
  if (scheduled) return { event: scheduled, isOverdue: false }
  return null
}

export default function CropCycleOverviewPage() {
  const [cycles, setCycles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [cropFilter, setCropFilter] = useState<string>("all")
  const [selectedCycle, setSelectedCycle] = useState<any | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await apiClient.agentMe.getCropCycles()
      if (res.success) setCycles(res.data)
    } catch {
      toast.error("Failed to load crop cycles")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const overdueCount = useMemo(() =>
    cycles.reduce((count, cycle) =>
      count + (cycle.service_events ?? []).filter((e: any) => getEventStatus(e) === "overdue").length, 0),
    [cycles])

  const filteredCycles = useMemo(() => {
    return cycles.filter((cycle) => {
      const farmerName = cycle.farmer?.full_name || cycle.farmer?.name || ""
      const village = cycle.farmer?.village || ""
      const matchesSearch =
        farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        village.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cycle.crop_type || "").toLowerCase().includes(searchQuery.toLowerCase())

      const hasOverdue = (cycle.service_events ?? []).some((e: any) => getEventStatus(e) === "overdue")
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "overdue" && hasOverdue) ||
        (statusFilter === "active" && !hasOverdue)

      const matchesCrop = cropFilter === "all" || cycle.crop_type === cropFilter

      return matchesSearch && matchesStatus && matchesCrop
    })
  }, [cycles, searchQuery, statusFilter, cropFilter])

  const uniqueCrops = [...new Set(cycles.map((c) => c.crop_type).filter(Boolean))]

  const handleCycleClick = (cycle: any) => {
    setSelectedCycle(cycle)
    setSheetOpen(true)
  }

  const totalInProgress = cycles.reduce(
    (c, cycle) => c + (cycle.service_events ?? []).filter((e: any) => e.status === "in_progress").length, 0)
  const totalCompleted = cycles.reduce(
    (c, cycle) => c + (cycle.service_events ?? []).filter((e: any) => e.status === "completed" || e.status === "verified").length, 0)

  return (
    <DashboardLayout allowedRoles={["field_agent"]}>
      <div className="space-y-4 pb-20">
        <div>
          <h1 className="text-xl font-bold text-foreground">Crop Cycles</h1>
          <p className="text-sm text-muted-foreground">Service events by farmer</p>
        </div>

        {!loading && overdueCount > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-red-800">{overdueCount} Overdue Services</p>
                <p className="text-xs text-red-600">Requires immediate attention</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100 bg-transparent"
                onClick={() => setStatusFilter("overdue")}
              >
                View All
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-4 gap-2">
          <Card className="border-border/50">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold">{loading ? "…" : cycles.length}</p>
              <p className="text-[10px] text-muted-foreground">Cycles</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold text-red-600">{loading ? "…" : overdueCount}</p>
              <p className="text-[10px] text-muted-foreground">Overdue</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold text-amber-600">{loading ? "…" : totalInProgress}</p>
              <p className="text-[10px] text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold text-emerald-600">{loading ? "…" : totalCompleted}</p>
              <p className="text-[10px] text-muted-foreground">Done</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search farmer, village..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[100px] h-10">
              <Filter className="h-4 w-4 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="active">On Track</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {uniqueCrops.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
            <Button
              size="sm"
              variant={cropFilter === "all" ? "default" : "outline"}
              className="shrink-0 h-8 text-xs"
              onClick={() => setCropFilter("all")}
            >
              All Crops
            </Button>
            {uniqueCrops.map((crop) => (
              <Button
                key={crop}
                size="sm"
                variant={cropFilter === crop ? "default" : "outline"}
                className="shrink-0 h-8 text-xs"
                onClick={() => setCropFilter(crop)}
              >
                {cropIcons[crop] ?? "🌱"} {crop.charAt(0).toUpperCase() + crop.slice(1)}
              </Button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCycles.length === 0 ? (
              <Card className="border-border/50">
                <CardContent className="p-8 text-center">
                  <Wheat className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No crop cycles found</p>
                </CardContent>
              </Card>
            ) : (
              filteredCycles.map((cycle) => {
                const events: any[] = cycle.service_events ?? []
                const nextAction = getNextAction(events)
                const hasOverdue = events.some((e) => getEventStatus(e) === "overdue")
                const progress = cycleProgress(events)
                const farmerName = cycle.farmer?.full_name || cycle.farmer?.name || "Unknown Farmer"
                const village = cycle.farmer?.village || "—"

                return (
                  <Card
                    key={cycle.id}
                    className={`border-border/50 cursor-pointer transition-all active:scale-[0.99] ${hasOverdue ? "border-red-200 bg-red-50/50" : ""}`}
                    onClick={() => handleCycleClick(cycle)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-2xl">{cropIcons[cycle.crop_type] ?? "🌱"}</span>
                          <div className="min-w-0">
                            <p className="font-semibold truncate">{farmerName}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>{village}</span>
                              <span className="mx-1">•</span>
                              <span>{cycle.hectares_planted} ha</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                      </div>

                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Cycle Progress</span>
                          <span className="font-medium">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>

                      {events.length > 0 && (
                        <div className="flex gap-1 mb-3 flex-wrap">
                          {events.map((event: any) => {
                            const evStatus = getEventStatus(event)
                            const config = statusConfig[evStatus] ?? statusConfig.planned
                            const ServiceIcon = serviceTypeIcons[event.service_type] ?? Tractor
                            return (
                              <div
                                key={event.id}
                                className={`flex items-center justify-center h-7 w-7 rounded ${config.bgColor}`}
                                title={`${event.service_type}: ${config.label}`}
                              >
                                <ServiceIcon className={`h-3.5 w-3.5 ${config.color}`} />
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {nextAction && (
                        <div className={`p-2 rounded-lg ${nextAction.isOverdue ? "bg-red-100" : "bg-muted/50"}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {nextAction.isOverdue
                                ? <AlertTriangle className="h-4 w-4 text-red-600" />
                                : <Clock className="h-4 w-4 text-muted-foreground" />}
                              <div>
                                <p className={`text-xs font-medium ${nextAction.isOverdue ? "text-red-700" : ""}`}>
                                  {nextAction.isOverdue ? "OVERDUE: " : "Next: "}
                                  {(nextAction.event.service_type || "service").replace(/_/g, " ")}
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                  Due {nextAction.event.scheduled_date
                                    ? new Date(nextAction.event.scheduled_date).toLocaleDateString("en-NG", { month: "short", day: "numeric" })
                                    : "TBD"}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className={`${statusConfig[getEventStatus(nextAction.event)]?.bgColor} ${statusConfig[getEventStatus(nextAction.event)]?.color} border-0 text-[10px]`}
                            >
                              {statusConfig[getEventStatus(nextAction.event)]?.label}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        )}
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-xl">
          {selectedCycle && (() => {
            const events: any[] = selectedCycle.service_events ?? []
            const progress = cycleProgress(events)
            const farmerName = selectedCycle.farmer?.full_name || selectedCycle.farmer?.name || "Unknown"
            const farmerPhone = selectedCycle.farmer?.phone || ""

            return (
              <>
                <SheetHeader className="pb-4 border-b">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{cropIcons[selectedCycle.crop_type] ?? "🌱"}</span>
                    <div>
                      <SheetTitle className="text-left">{farmerName}</SheetTitle>
                      <p className="text-sm text-muted-foreground">
                        {selectedCycle.crop_type?.charAt(0).toUpperCase()}{selectedCycle.crop_type?.slice(1)}
                        {selectedCycle.variety ? ` • ${selectedCycle.variety}` : ""}
                      </p>
                    </div>
                  </div>
                </SheetHeader>

                <div className="py-4 space-y-4 overflow-y-auto max-h-[calc(85vh-120px)]">
                  <Card className="border-border/50">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{farmerName}</p>
                            <p className="text-xs text-muted-foreground">{farmerPhone || "No phone"}</p>
                          </div>
                        </div>
                        {farmerPhone && (
                          <Button size="sm" variant="outline" onClick={() => window.open(`tel:${farmerPhone}`)}>
                            Call
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-2 gap-2">
                    <Card className="border-border/50">
                      <CardContent className="p-3">
                        <p className="text-xs text-muted-foreground">Planted</p>
                        <p className="text-sm font-medium">
                          {selectedCycle.planting_date
                            ? new Date(selectedCycle.planting_date).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })
                            : "—"}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="border-border/50">
                      <CardContent className="p-3">
                        <p className="text-xs text-muted-foreground">Expected Harvest</p>
                        <p className="text-sm font-medium">
                          {selectedCycle.expected_harvest_date
                            ? new Date(selectedCycle.expected_harvest_date).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })
                            : "—"}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-medium">Cycle Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Service Events</h3>
                    {events.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">No service events yet</p>
                    ) : (
                      <div className="space-y-2">
                        {events.map((event: any, index: number) => {
                          const evStatus = getEventStatus(event)
                          const config = statusConfig[evStatus] ?? statusConfig.planned
                          const StatusIcon = config.icon
                          const ServiceIcon = serviceTypeIcons[event.service_type] ?? Tractor
                          const isOverdue = evStatus === "overdue"

                          return (
                            <Card key={event.id} className={`border-border/50 ${isOverdue ? "border-red-300 bg-red-50" : ""}`}>
                              <CardContent className="p-3">
                                <div className="flex items-center gap-3">
                                  <div className="flex flex-col items-center">
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${config.bgColor}`}>
                                      <ServiceIcon className={`h-4 w-4 ${config.color}`} />
                                    </div>
                                    {index < events.length - 1 && (
                                      <div className={`w-0.5 h-4 mt-1 ${event.status === "completed" ? "bg-emerald-300" : "bg-muted"}`} />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <p className={`font-medium text-sm ${isOverdue ? "text-red-700" : ""}`}>
                                        {(event.service_type || "service").replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
                                      </p>
                                      <Badge variant="outline" className={`${config.bgColor} ${config.color} border-0 text-xs shrink-0`}>
                                        <StatusIcon className="h-3 w-3 mr-1" />
                                        {config.label}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                      <Calendar className="h-3 w-3" />
                                      <span>
                                        Due: {event.scheduled_date
                                          ? new Date(event.scheduled_date).toLocaleDateString("en-NG", { month: "short", day: "numeric" })
                                          : "TBD"}
                                      </span>
                                      {event.actual_date && (
                                        <>
                                          <span>•</span>
                                          <CheckCircle className="h-3 w-3 text-emerald-600" />
                                          <span>
                                            Done: {new Date(event.actual_date).toLocaleDateString("en-NG", { month: "short", day: "numeric" })}
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )
          })()}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  )
}
