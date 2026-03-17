"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Map, Wheat, TrendingUp, Truck, Calendar } from "lucide-react"
import { PaginationControls } from "@/components/ui/pagination-controls"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

type Corridor = {
  id: string
  name: string
  state: string
  crops: string[]
  totalHectares: number
  farmerCount: number
  activeContracts: number
  expectedVolume: number
  deliveredVolume: number
  status: string
  nextDelivery: string | null
}

const LIMIT = 20

export default function CorridorsPage() {
  const [corridors, setCorridors] = useState<Corridor[]>([])
  const [loading, setLoading] = useState(true)
  const [stateFilter, setStateFilter] = useState<string>("all")
  const [cropFilter, setCropFilter] = useState<string>("all")
  const [page, setPage] = useState(1)

  useEffect(() => {
    apiClient.offtakerCorridors
      .list()
      .then((res) => {
        if (res.success) setCorridors(res.data.corridors)
      })
      .catch(() => toast.error("Failed to load corridors"))
      .finally(() => setLoading(false))
  }, [])

  const allStates = [...new Set(corridors.map((c) => c.state))].filter(Boolean)
  const allCrops = [...new Set(corridors.flatMap((c) => c.crops))].filter(Boolean)

  const filteredCorridors = corridors.filter((corridor) => {
    if (stateFilter !== "all" && corridor.state !== stateFilter) return false
    if (cropFilter !== "all" && !corridor.crops.includes(cropFilter)) return false
    return true
  })

  const pagedCorridors = filteredCorridors.slice((page - 1) * LIMIT, page * LIMIT)

  const totalHectares = filteredCorridors.reduce((sum, c) => sum + c.totalHectares, 0)
  const totalExpected = filteredCorridors.reduce((sum, c) => sum + c.expectedVolume, 0)
  const totalDelivered = filteredCorridors.reduce((sum, c) => sum + c.deliveredVolume, 0)

  return (
    <DashboardLayout allowedRoles={["offtaker"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Corridors</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Geographic view of your AgroBridge supply corridors
          </p>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4">
          <Select value={stateFilter} onValueChange={(v) => { setStateFilter(v); setPage(1) }}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All States" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {allStates.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={cropFilter} onValueChange={(v) => { setCropFilter(v); setPage(1) }}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Crops" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Crops</SelectItem>
              {allCrops.map((c) => (
                <SelectItem key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Active Corridors</CardTitle>
              <Map className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-xl sm:text-2xl font-bold">{filteredCorridors.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Across {new Set(filteredCorridors.map((c) => c.state)).size} states
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Hectares</CardTitle>
              <Wheat className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-xl sm:text-2xl font-bold">{totalHectares.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Under coordination</p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Expected Volume</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-xl sm:text-2xl font-bold">{totalExpected.toLocaleString()} MT</div>
                  <p className="text-xs text-muted-foreground">This season</p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Delivered</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-xl sm:text-2xl font-bold">{totalDelivered.toLocaleString()} MT</div>
                  <p className="text-xs text-muted-foreground">
                    {totalExpected > 0 ? Math.round((totalDelivered / totalExpected) * 100) : 0}% of expected
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Your Supply Corridors</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Corridor-level view of contracted supply. No individual farmer data exposed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-40 w-full rounded-lg" />
                ))}
              </div>
            ) : filteredCorridors.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {corridors.length === 0
                  ? "No corridors found. Corridors appear once you have active contracts."
                  : "No corridors match your filters."}
              </div>
            ) : (
              <div className="space-y-4">
                {pagedCorridors.map((corridor) => (
                  <div key={corridor.id} className="rounded-lg border p-4 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold">{corridor.name}</h3>
                          <Badge variant={corridor.status === "active" ? "default" : "secondary"}>
                            {corridor.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{corridor.state} State</p>
                      </div>
                      <div className="sm:text-right">
                        <p className="text-xs text-muted-foreground">{corridor.activeContracts} active contract(s)</p>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-4 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs sm:text-sm">Crops</p>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {corridor.crops.map((crop) => (
                            <Badge key={crop} variant="outline" className="text-xs">
                              {crop.charAt(0).toUpperCase() + crop.slice(1)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs sm:text-sm">Coverage</p>
                        <p className="font-medium">{corridor.totalHectares.toLocaleString()} ha</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs sm:text-sm">Expected Volume</p>
                        <p className="font-medium">{corridor.expectedVolume.toLocaleString()} MT</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs sm:text-sm">Next Delivery</p>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <p className="font-medium">{corridor.nextDelivery || "—"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground text-xs sm:text-sm">Delivery Progress</span>
                        <span className="font-medium text-xs sm:text-sm">
                          {corridor.deliveredVolume.toLocaleString()} / {corridor.expectedVolume.toLocaleString()} MT
                        </span>
                      </div>
                      <Progress
                        value={corridor.expectedVolume > 0 ? (corridor.deliveredVolume / corridor.expectedVolume) * 100 : 0}
                        className="h-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <PaginationControls
          page={page}
          pages={Math.ceil(filteredCorridors.length / LIMIT)}
          total={filteredCorridors.length}
          limit={LIMIT}
          onPageChange={setPage}
        />

        <p className="text-xs text-muted-foreground text-center">
          Corridor data reflects AgroBridge-coordinated supply only. For questions about specific corridors, contact
          your account manager.
        </p>
      </div>
    </DashboardLayout>
  )
}
