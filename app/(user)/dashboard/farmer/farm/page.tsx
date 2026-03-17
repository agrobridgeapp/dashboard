"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, MapPin, Calendar, Droplet, RefreshCw } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth-context"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

export default function FarmerFarmPage() {
  const { user } = useAuth()
  const [plots, setPlots] = useState<any[]>([])
  const [cycles, setCycles] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [plotsRes, cyclesRes, servicesRes] = await Promise.all([
        apiClient.farmerMe.getLandPlots(),
        apiClient.farmerMe.getCropCycles(),
        apiClient.farmerMe.getServiceEvents(),
      ])

      setPlots(plotsRes.data ?? [])
      setCycles(cyclesRes.data ?? [])
      const upcoming = (servicesRes.data ?? [])
        .filter((s: any) => s.status === "planned" || s.status === "scheduled")
        .sort((a: any, b: any) => new Date(a.scheduled_date || a.plannedDateStart).getTime() - new Date(b.scheduled_date || b.plannedDateStart).getTime())
        .slice(0, 5)
      setActivities(upcoming)
    } catch (err) {
      console.error("[v0] FarmPage: Fetch failed:", err)
      toast.error("Failed to load farm data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Map plots to UI format, enriching with current cycle info
  // Backend uses snake_case; also handle camelCase from older mock data
  const mappedPlots = plots.map(plot => {
    const plotId = plot.id
    const currentCycle = cycles.find(c => (c.land_plot_id || c.landPlotId) === plotId && c.status === "active") ||
                        cycles.find(c => (c.land_plot_id || c.landPlotId) === plotId)

    let progress = 0
    if (currentCycle) {
      const startRaw = currentCycle.planting_date || currentCycle.plantingDate
      const endRaw = currentCycle.expected_harvest_date || currentCycle.expectedHarvestDate
      if (startRaw && endRaw) {
        const start = new Date(startRaw).getTime()
        const end = new Date(endRaw).getTime()
        const now = new Date().getTime()
        if (now > start && end > start) {
          progress = Math.min(100, Math.round(((now - start) / (end - start)) * 100))
        }
      }
    }

    return {
      id: plotId,
      name: plot.name || plot.plot_name || `Plot ${plotId?.slice(0, 6)}`,
      size: plot.size_hectares || plot.sizeHectares || plot.size || 0,
      location: plot.location || plot.lga || `Corridor ${plot.corridor_id || plot.corridorId || "—"}`,
      soilType: plot.soil_type || plot.soilType,
      currentCrop: currentCycle?.crop_type || currentCycle?.cropType || "No active crop",
      plantingDate: currentCycle?.planting_date || currentCycle?.plantingDate || "-",
      expectedHarvest: currentCycle?.expected_harvest_date || currentCycle?.expectedHarvestDate || "-",
      growthStage: currentCycle?.status === "active" ? "Growing" : (currentCycle?.status || "Idle"),
      progress,
    }
  })

  // Calculate stats
  const totalLand = plots.reduce((acc, p) => acc + Number(p.size_hectares || p.sizeHectares || p.size || 0), 0)
  const activeCrops = Array.from(new Set(cycles.filter(c => c.status === "active").map(c => c.crop_type || c.cropType)))

  const getNextHarvest = () => {
    const activeCycles = cycles.filter(c => c.status === "active" && (c.expected_harvest_date || c.expectedHarvestDate))
    if (activeCycles.length === 0) return null
    const next = activeCycles.sort((a, b) => {
      const aDate = new Date(a.expected_harvest_date || a.expectedHarvestDate).getTime()
      const bDate = new Date(b.expected_harvest_date || b.expectedHarvestDate).getTime()
      return aDate - bDate
    })[0]
    const harvestDate = next.expected_harvest_date || next.expectedHarvestDate
    const days = Math.ceil((new Date(harvestDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return { days, cycle: { ...next, cropType: next.crop_type || next.cropType } }
  }

  const nextHarvest = getNextHarvest()

  return (
    <DashboardLayout allowedRoles={["farmer"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Farm</h1>
            <p className="text-muted-foreground">Manage your land and track crop cycles</p>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {isLoading && plots.length === 0 ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Land</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalLand.toFixed(1)} ha</div>
                <p className="text-xs text-muted-foreground mt-1">{plots.length} active plots</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Crops</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeCrops.length}</div>
                <p className="text-xs text-muted-foreground mt-1">{activeCrops.join(", ") || "None"}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Next Harvest</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{nextHarvest ? `${nextHarvest.days} days` : "N/A"}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {nextHarvest ? `${nextHarvest.cycle.cropType.charAt(0).toUpperCase() + nextHarvest.cycle.cropType.slice(1)}` : "No active harvest"}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Land Plots</h2>
            {isLoading && plots.length === 0 ? (
              [1, 2].map(i => <Skeleton key={i} className="h-48 w-full" />)
            ) : mappedPlots.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-10 text-center text-muted-foreground">
                  No land plots registered yet.
                </CardContent>
              </Card>
            ) : (
              mappedPlots.map((plot) => (
                <Card key={plot.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Leaf className="h-5 w-5 text-primary" />
                          {plot.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {plot.location}
                        </CardDescription>
                      </div>
                      <Badge>{plot.size} ha</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Current Crop:</span>
                        <div className="font-medium capitalize">{plot.currentCrop}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Soil Type:</span>
                        <div className="font-medium">{plot.soilType || "Not specified"}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Planting Date:</span>
                        <div className="font-medium">{plot.plantingDate !== "-" ? new Date(plot.plantingDate).toLocaleDateString() : "-"}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Expected Harvest:</span>
                        <div className="font-medium">{plot.expectedHarvest !== "-" ? new Date(plot.expectedHarvest).toLocaleDateString() : "-"}</div>
                      </div>
                    </div>

                    {plot.currentCrop !== "No active crop" && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium capitalize">{plot.growthStage}</span>
                          <span className="text-sm text-muted-foreground">{plot.progress}%</span>
                        </div>
                        <Progress value={plot.progress} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Upcoming Activities</h2>
            <Card>
              <CardContent className="pt-6">
                {activities.length === 0 ? (
                  <div className="py-6 text-center text-muted-foreground text-sm">
                    No upcoming activities.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activities.map((activity, index) => (
                      <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium capitalize">{(activity.service_type || activity.serviceType || "Service").replace(/_/g, " ")}</div>
                          <div className="text-sm text-muted-foreground">Plot: {activity.land_plot_id || activity.landPlotId || activity.crop_cycle_id || activity.cropCycleId || "—"}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(activity.scheduled_date || activity.plannedDateStart || Date.now()).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Weather widget remains static (or could be API too, but let's stick to core domain) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplet className="h-5 w-5 text-blue-500" />
                  Weather & Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Temperature</span>
                    <span className="font-medium">28°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Humidity</span>
                    <span className="font-medium">65%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rainfall (7 days)</span>
                    <span className="font-medium">12mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Soil Moisture</span>
                    <span className="font-medium text-green-600">Good</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
