"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, MapPin, Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"
import { PaginationControls } from "@/components/ui/pagination-controls"

const LIMIT = 20

export default function AgentFarmersPage() {
  const [farmers, setFarmers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await apiClient.agentMe.getFarmers()
      if (res.success) setFarmers(res.data)
    } catch {
      toast.error("Failed to load farmers")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const filteredFarmers = farmers.filter((farmer) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    const name = (farmer.full_name || farmer.name || "").toLowerCase()
    const location = `${farmer.village || ""} ${farmer.lga || ""}`.toLowerCase()
    return name.includes(q) || location.includes(q)
  })

  const pagedFarmers = filteredFarmers.slice((page - 1) * LIMIT, page * LIMIT)

  return (
    <DashboardLayout allowedRoles={["field_agent"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Farmers</h1>
          <p className="text-muted-foreground">
            {loading ? "Loading…" : `${farmers.length} ${farmers.length === 1 ? "farmer" : "farmers"} assigned to you`}
          </p>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search farmers..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
                className="pl-9"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Farmer</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Farm Size</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFarmers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        {searchQuery ? "No farmers found" : "No farmers assigned yet"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    pagedFarmers.map((farmer) => {
                      const name = farmer.full_name || farmer.name || "Unknown"
                      const initials = name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
                      const location = [farmer.village, farmer.lga].filter(Boolean).join(", ") || "—"
                      const farmSize = farmer.total_land_hectares ? `${farmer.total_land_hectares} ha` : "—"

                      return (
                        <TableRow key={farmer.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">{initials}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{name}</p>
                                <p className="text-xs text-muted-foreground">{farmer.id}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              {location}
                            </div>
                          </TableCell>
                          <TableCell>{farmSize}</TableCell>
                          <TableCell className="text-sm">{farmer.phone || "—"}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                farmer.status === "active"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
                              }
                            >
                              {farmer.status || "active"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
        <PaginationControls
          page={page}
          pages={Math.ceil(filteredFarmers.length / LIMIT)}
          total={filteredFarmers.length}
          limit={LIMIT}
          onPageChange={setPage}
        />
      </div>
    </DashboardLayout>
  )
}
