"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Warehouse, Users, TrendingUp, Package, Activity } from "lucide-react"

// Zone data with coordinates and metrics
const activeZones = [
  {
    id: 1,
    name: "Zaria",
    state: "Kaduna",
    coordinates: { lat: 11.11, lng: 7.72 },
    farmers: 145,
    activeJobs: 12,
    warehouses: 1,
    warehouseName: "Zaria Central",
    inventory: "₦12.5M",
    fieldAgents: 2,
    status: "active",
    color: "bg-emerald-500",
  },
  {
    id: 2,
    name: "Giwa",
    state: "Kaduna",
    coordinates: { lat: 11.29, lng: 7.72 },
    farmers: 118,
    activeJobs: 8,
    warehouses: 0,
    fieldAgents: 1,
    status: "active",
    color: "bg-blue-500",
  },
  {
    id: 3,
    name: "Sabon Gari",
    state: "Kaduna",
    coordinates: { lat: 10.99, lng: 7.45 },
    farmers: 162,
    activeJobs: 15,
    warehouses: 0,
    fieldAgents: 2,
    status: "active",
    color: "bg-purple-500",
  },
  {
    id: 4,
    name: "Kaduna South",
    state: "Kaduna",
    coordinates: { lat: 10.49, lng: 7.44 },
    farmers: 98,
    activeJobs: 6,
    warehouses: 0,
    fieldAgents: 1,
    status: "active",
    color: "bg-amber-500",
  },
  {
    id: 5,
    name: "Igabi",
    state: "Kaduna",
    coordinates: { lat: 11.12, lng: 7.57 },
    farmers: 87,
    activeJobs: 5,
    warehouses: 0,
    fieldAgents: 1,
    status: "active",
    color: "bg-pink-500",
  },
  {
    id: 6,
    name: "Kano Central",
    state: "Kano",
    coordinates: { lat: 12.0, lng: 8.52 },
    farmers: 234,
    activeJobs: 18,
    warehouses: 2,
    warehouseName: "Kano Central",
    inventory: "₦18.3M",
    fieldAgents: 3,
    status: "active",
    color: "bg-rose-500",
  },
  {
    id: 7,
    name: "Kaduna Hub",
    state: "Kaduna",
    coordinates: { lat: 10.52, lng: 7.43 },
    farmers: 189,
    activeJobs: 10,
    warehouses: 1,
    warehouseName: "Kaduna Hub",
    inventory: "₦9.8M",
    fieldAgents: 2,
    status: "active",
    color: "bg-cyan-500",
  },
]

const totalStats = {
  zones: activeZones.length,
  farmers: activeZones.reduce((sum, z) => sum + z.farmers, 0),
  activeJobs: activeZones.reduce((sum, z) => sum + z.activeJobs, 0),
  warehouses: activeZones.reduce((sum, z) => sum + z.warehouses, 0),
  fieldAgents: activeZones.reduce((sum, z) => sum + z.fieldAgents, 0),
}

export function OpsZonesMap() {
  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Active Zones Map
            </CardTitle>
            <CardDescription>Real-time operational overview across all zones</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1 bg-background">
              <Activity className="h-3 w-3" />
              {totalStats.zones} Active Zones
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Users className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Farmers</p>
              <p className="text-lg font-bold">{totalStats.farmers.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <div>
              <p className="text-xs text-muted-foreground">Active Jobs</p>
              <p className="text-lg font-bold">{totalStats.activeJobs}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Warehouse className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-xs text-muted-foreground">Warehouses</p>
              <p className="text-lg font-bold">{totalStats.warehouses}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Users className="h-4 w-4 text-purple-600" />
            <div>
              <p className="text-xs text-muted-foreground">Field Agents</p>
              <p className="text-lg font-bold">{totalStats.fieldAgents}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Package className="h-4 w-4 text-amber-600" />
            <div>
              <p className="text-xs text-muted-foreground">Zones</p>
              <p className="text-lg font-bold">{totalStats.zones}</p>
            </div>
          </div>
        </div>

        {/* Map Visualization */}
        <div className="relative h-[400px] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl border-2 border-border overflow-hidden mb-6">
          {/* Background map style */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(0,0,0,.05) 50px, rgba(0,0,0,.05) 51px),
                               repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(0,0,0,.05) 50px, rgba(0,0,0,.05) 51px)`,
              }}
            />
          </div>

          {/* State label */}
          <div className="absolute top-4 left-4 z-10">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm border-border">
              <MapPin className="h-3 w-3 mr-1" />
              Northern Nigeria
            </Badge>
          </div>

          {/* Legend */}
          <div className="absolute top-4 right-4 z-10 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-3 space-y-1">
            <p className="text-xs font-semibold mb-2">Legend</p>
            <div className="flex items-center gap-2 text-xs">
              <Warehouse className="h-3 w-3 text-primary" />
              <span>Warehouse</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span>Zone</span>
            </div>
          </div>

          {/* Zone markers */}
          {activeZones.map((zone, idx) => {
            // Calculate position (simulated map projection)
            const xPos = ((zone.coordinates.lng - 7.2) / (8.7 - 7.2)) * 100
            const yPos = ((12.5 - zone.coordinates.lat) / (12.5 - 10.3)) * 100

            return (
              <div
                key={zone.id}
                className="absolute group cursor-pointer"
                style={{
                  left: `${xPos}%`,
                  top: `${yPos}%`,
                  transform: "translate(-50%, -50%)",
                  zIndex: 20 + idx,
                }}
              >
                {/* Pulse animation for active zones */}
                <div className={`absolute inset-0 ${zone.color} rounded-full opacity-20 animate-ping`} />

                {/* Zone marker */}
                <div
                  className={`relative ${zone.color} rounded-full p-2 border-2 border-white shadow-lg transition-transform group-hover:scale-125`}
                >
                  {zone.warehouses > 0 ? (
                    <Warehouse className="h-4 w-4 text-white" />
                  ) : (
                    <MapPin className="h-4 w-4 text-white" />
                  )}
                </div>

                {/* Tooltip on hover */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:block w-56 bg-background border border-border rounded-lg shadow-xl p-3 z-50">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{zone.name}</p>
                      <Badge variant="secondary" className="text-xs">
                        {zone.state}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span>{zone.farmers} farmers</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-emerald-600" />
                        <span>{zone.activeJobs} jobs</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-purple-600" />
                        <span>{zone.fieldAgents} agents</span>
                      </div>
                      {zone.warehouses > 0 && (
                        <>
                          <div className="flex items-center gap-1">
                            <Warehouse className="h-3 w-3 text-blue-600" />
                            <span>{zone.warehouseName}</span>
                          </div>
                          <div className="col-span-2 flex items-center gap-1">
                            <Package className="h-3 w-3 text-amber-600" />
                            <span>Inventory: {zone.inventory}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Zone Details List */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold mb-3">Zone Details</h3>
          <div className="grid gap-2 md:grid-cols-2">
            {activeZones.map((zone) => (
              <div
                key={zone.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-accent/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`${zone.color} rounded-full p-2`}>
                    {zone.warehouses > 0 ? (
                      <Warehouse className="h-4 w-4 text-white" />
                    ) : (
                      <MapPin className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{zone.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {zone.farmers} farmers • {zone.activeJobs} active jobs
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {zone.warehouses > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      <Warehouse className="h-3 w-3 mr-1" />
                      Warehouse
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                    Active
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
