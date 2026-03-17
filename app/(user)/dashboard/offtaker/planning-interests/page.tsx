"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wheat, Calendar, Package, FileText, Clock, RefreshCw } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { apiClient } from "@/lib/api-client"
import { PaginationControls } from "@/components/ui/pagination-controls"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

const volumeRangeLabels: Record<string, string> = {
  "100-500": "100 - 500 MT",
  "500-1000": "500 - 1,000 MT",
  "1000-2500": "1,000 - 2,500 MT",
  "2500-5000": "2,500 - 5,000 MT",
  "5000+": "5,000+ MT",
}

const LIMIT = 20

export default function PlanningInterestsPage() {
  const { user } = useAuth()
  const [interests, setInterests] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const fetchInterests = async () => {
    setIsLoading(true)
    try {
      const response = await apiClient.planningInterests.list()
      if (response.success) {
        setInterests(response.data)
      }
    } catch (err) {
      console.error("[v0] PlanningInterests: Fetch failed:", err)
      toast.error("Failed to load planning interests")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInterests()
  }, [])

  const mappedInterests = interests.map((i) => ({
    id: i.id,
    crop: i.crop,
    season: i.season,
    volumeRange: i.volume_range || i.volumeRange,
    deliveryWindow: i.delivery_window || i.deliveryWindow,
    notes: i.notes,
    status: i.status === "reviewed" ? "reviewed" : "received",
    submittedAt: new Date(i.created_at || i.createdAt).toLocaleDateString(),
  }))

  const pagedInterests = mappedInterests.slice((page - 1) * LIMIT, page * LIMIT)

  return (
    <DashboardLayout allowedRoles={["offtaker"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Planning Interests</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Your submitted planning signals for future supply coordination.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchInterests} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {/* Info banner */}
        <div className="rounded-lg bg-muted/50 border p-4 text-sm text-muted-foreground">
          <p>
            Planning interests are non-binding signals to help AgroBridge plan future corridor and crop coverage. They
            do not create orders, contracts, or capacity reservations.
          </p>
        </div>

        {isLoading && interests.length === 0 ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : mappedInterests.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No planning interests submitted yet.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Share your planning interest from the dashboard to help us plan future supply.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pagedInterests.map((interest) => (
              <Card key={interest.id} className="border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="rounded-md bg-amber-100 p-2">
                        <Wheat className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{interest.crop}</CardTitle>
                        <CardDescription className="text-sm">{interest.season}</CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        interest.status === "reviewed"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-gray-50 text-gray-600 border-gray-200"
                      }
                    >
                      {interest.status === "reviewed" ? "Reviewed" : "Received"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground text-xs">Volume Range</p>
                        <p className="font-medium">{volumeRangeLabels[interest.volumeRange] || interest.volumeRange}</p>
                      </div>
                    </div>
                    {interest.deliveryWindow && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground text-xs">Preferred Delivery</p>
                          <p className="font-medium">{interest.deliveryWindow}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground text-xs">Submitted</p>
                        <p className="font-medium">{interest.submittedAt}</p>
                      </div>
                    </div>
                  </div>
                  {interest.notes && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs text-muted-foreground mb-1">Notes</p>
                      <p className="text-sm">{interest.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <PaginationControls
          page={page}
          pages={Math.ceil(mappedInterests.length / LIMIT)}
          total={mappedInterests.length}
          limit={LIMIT}
          onPageChange={setPage}
        />

        {/* Footer note */}
        <p className="text-xs text-muted-foreground text-center">
          Submitted interests cannot be edited. Contact AgroBridge if you need to update your planning signals.
        </p>
      </div>
    </DashboardLayout>
  )
}
