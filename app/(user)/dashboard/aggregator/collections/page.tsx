"use client"

import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import useSWR from "swr"
import { useState, useMemo } from "react"
import { Search, Package, Calendar, MapPin, Scale, Filter } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface Collection {
  id: string
  supply_order_id: string
  farmer_name: string
  cluster_name: string | null
  collected_volume_mt: number
  quality_grade: string
  collection_date: string
  collected_by: string
  notes: string | null
  reference_id: string
  crop_type: string
}

const gradeColors: Record<string, string> = {
  A: "bg-emerald-100 text-emerald-700",
  B: "bg-blue-100 text-blue-700",
  C: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
}

export default function CollectionsPage() {
  const { user } = useAuth()
  const [search, setSearch] = useState("")
  const [gradeFilter, setGradeFilter] = useState("all")

  const { data, isLoading } = useSWR<{ success: boolean; data: Collection[] }>(
    user?.id ? `/api/aggregator/collections?aggregator_id=${user.id}` : null,
    fetcher,
  )

  const collections = data?.success ? data.data : []

  const filtered = useMemo(() => {
    return collections.filter((c) => {
      const matchesSearch =
        !search ||
        c.farmer_name.toLowerCase().includes(search.toLowerCase()) ||
        c.reference_id.toLowerCase().includes(search.toLowerCase()) ||
        c.crop_type.toLowerCase().includes(search.toLowerCase())
      const matchesGrade = gradeFilter === "all" || c.quality_grade === gradeFilter
      return matchesSearch && matchesGrade
    })
  }, [collections, search, gradeFilter])

  const totalCollected = filtered.reduce((sum, c) => sum + Number(c.collected_volume_mt), 0)

  return (
    <DashboardLayout allowedRoles={["aggregator"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Collection History</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View all collections across your supply orders
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{filtered.length}</div>
              <p className="text-xs text-muted-foreground">Total Collections</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{totalCollected.toFixed(1)} MT</div>
              <p className="text-xs text-muted-foreground">Volume Collected</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">
                {filtered.filter((c) => c.quality_grade === "A").length}
              </div>
              <p className="text-xs text-muted-foreground">Grade A Collections</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">
                {filtered.filter((c) => c.quality_grade === "rejected").length}
              </div>
              <p className="text-xs text-muted-foreground">Rejected</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by farmer, reference, or crop..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={gradeFilter} onValueChange={setGradeFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              <SelectItem value="A">Grade A</SelectItem>
              <SelectItem value="B">Grade B</SelectItem>
              <SelectItem value="C">Grade C</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Collections List */}
        <div className="space-y-3">
          {isLoading ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Loading collections...
              </CardContent>
            </Card>
          ) : filtered.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">
                  {collections.length === 0 ? "No collections recorded yet" : "No collections match your filters"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filtered.map((c) => (
              <Card key={c.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{c.farmer_name}</span>
                        <Badge variant="outline" className={gradeColors[c.quality_grade] || ""}>
                          Grade {c.quality_grade}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Package className="h-3.5 w-3.5" />
                          {c.crop_type} · {c.reference_id}
                        </span>
                        <span className="flex items-center gap-1">
                          <Scale className="h-3.5 w-3.5" />
                          {Number(c.collected_volume_mt).toFixed(2)} MT
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(c.collection_date).toLocaleDateString()}
                        </span>
                        {c.cluster_name && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {c.cluster_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
