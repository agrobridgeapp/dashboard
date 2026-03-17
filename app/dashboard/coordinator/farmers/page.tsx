"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Leaf, TrendingUp } from "lucide-react"

export default function CoordinatorFarmersPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Demo data - farmers in coordinator's state
  const farmers = [
    {
      id: "F001",
      name: "Chidi Amadi",
      location: "Nsukka",
      corridor: "Enugu North Maize",
      agent: "John Okafor",
      hectares: 2.5,
      crops: ["Maize"],
      status: "active",
      lastVisit: "2024-01-15",
    },
    {
      id: "F002",
      name: "Emmanuel Obi",
      location: "Udi",
      corridor: "Enugu Central Mixed",
      agent: "Mary Eze",
      hectares: 3.2,
      crops: ["Maize", "Cassava"],
      status: "active",
      lastVisit: "2024-01-16",
    },
    {
      id: "F003",
      name: "Grace Nwosu",
      location: "Nsukka",
      corridor: "Enugu North Maize",
      agent: "John Okafor",
      hectares: 1.8,
      crops: ["Maize"],
      status: "active",
      lastVisit: "2024-01-14",
    },
    {
      id: "F004",
      name: "Chioma Okeke",
      location: "Awgu",
      corridor: "Enugu South Rice",
      agent: "Paul Eze",
      hectares: 4.5,
      crops: ["Rice"],
      status: "pending",
      lastVisit: "2024-01-17",
    },
  ]

  const filteredFarmers = farmers.filter(
    (farmer) =>
      farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.agent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.corridor.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const stats = {
    total: farmers.length,
    active: farmers.filter((f) => f.status === "active").length,
    totalHectares: farmers.reduce((sum, f) => sum + f.hectares, 0),
    avgHectares: (farmers.reduce((sum, f) => sum + f.hectares, 0) / farmers.length).toFixed(1),
  }

  return (
    <DashboardLayout allowedRoles={["state_coordinator"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Farmers Overview</h1>
          <p className="text-muted-foreground">All farmers registered in your state</p>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Farmers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Farmers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Hectares</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalHectares.toFixed(1)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Farm Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgHectares} ha</div>
            </CardContent>
          </Card>
        </div>

        {/* Farmers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Farmers Directory</CardTitle>
            <CardDescription>Browse all farmers managed by your field agents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, location, agent, or corridor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="space-y-3">
              {filteredFarmers.map((farmer) => (
                <Card key={farmer.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{farmer.name}</h3>
                          <Badge variant={farmer.status === "active" ? "default" : "secondary"}>{farmer.status}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {farmer.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <Leaf className="h-4 w-4" />
                            {farmer.crops.join(", ")}
                          </div>
                          <div>Agent: {farmer.agent}</div>
                          <div>
                            <TrendingUp className="h-4 w-4 inline mr-1" />
                            {farmer.hectares} ha
                          </div>
                          <div className="col-span-2">Corridor: {farmer.corridor}</div>
                          <div className="col-span-2 text-xs">Last visit: {farmer.lastVisit}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredFarmers.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No farmers found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
