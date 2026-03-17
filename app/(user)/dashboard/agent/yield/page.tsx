"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Wheat, Scale, MapPin, CheckCircle, Clock, Camera, Search, AlertTriangle, TrendingUp, TrendingDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

const qualityGrades = [
  { value: "A", label: "Grade A - Premium Quality" },
  { value: "B", label: "Grade B - Standard Quality" },
  { value: "C", label: "Grade C - Below Standard" },
  { value: "rejected", label: "Rejected - Does not meet standards" },
]

export default function YieldCapturePage() {
  const [cycles, setCycles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedCycle, setSelectedCycle] = useState<any | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [actualYield, setActualYield] = useState("")
  const [qualityGrade, setQualityGrade] = useState("")
  const [moistureContent, setMoistureContent] = useState("")
  const [notes, setNotes] = useState("")

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

  // "Ready for capture" = active/harvesting cycles without actual_yield_tons
  const pending = cycles.filter((c) => (c.status === "active" || c.status === "harvesting") && !c.actual_yield_tons)
  const captured = cycles.filter((c) => c.actual_yield_tons)
  const inProgress = cycles.filter((c) => c.status === "harvesting" && !c.actual_yield_tons)

  const filteredPending = pending.filter((c) => {
    const name = c.farmer?.full_name || c.farmer?.name || ""
    const q = searchQuery.toLowerCase()
    const matchesSearch = name.toLowerCase().includes(q) || (c.crop_type || "").toLowerCase().includes(q)
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "ready" && c.status === "active") ||
      (statusFilter === "in-progress" && c.status === "harvesting") ||
      (statusFilter === "pending" && c.status === "planned")
    return matchesSearch && matchesStatus
  })

  const handleOpenDialog = (cycle: any) => {
    setSelectedCycle(cycle)
    setActualYield("")
    setQualityGrade("")
    setMoistureContent("")
    setNotes("")
    setIsDialogOpen(true)
  }

  const handleSubmitYield = async () => {
    if (!selectedCycle || !actualYield || !qualityGrade) return
    setIsSubmitting(true)
    try {
      await apiClient.cropCycles.update(selectedCycle.id, {
        actual_yield_tons: Number(actualYield) / 1000, // kg → tons
        status: "completed",
        notes: [qualityGrade && `Grade: ${qualityGrade}`, moistureContent && `Moisture: ${moistureContent}%`, notes].filter(Boolean).join(" | ") || undefined,
      })
      toast.success("Yield captured successfully")
      setIsDialogOpen(false)
      load()
    } catch (err: any) {
      toast.error(err.message || "Failed to submit yield")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getVariance = (expected: number, actual: number) => ((actual - expected) / expected) * 100

  return (
    <DashboardLayout allowedRoles={["field_agent"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Yield Capture</h1>
          <p className="text-muted-foreground">Record and verify harvest yields for farmers</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "Ready for Capture", value: loading ? "…" : pending.filter((c) => c.status === "active").length, icon: Wheat, color: "text-emerald-600 bg-emerald-100" },
            { name: "Harvesting", value: loading ? "…" : inProgress.length, icon: Clock, color: "text-blue-600 bg-blue-100" },
            { name: "Captured", value: loading ? "…" : captured.length, icon: CheckCircle, color: "text-primary bg-primary/10" },
            { name: "Total Cycles", value: loading ? "…" : cycles.length, icon: AlertTriangle, color: "text-amber-600 bg-amber-100" },
          ].map((stat) => (
            <Card key={stat.name} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", stat.color)}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search farmer or crop..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="in-progress">Harvesting</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Farmers Ready for Yield Capture</CardTitle>
            <CardDescription>Active crop cycles awaiting harvest yield recording</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Farmer</TableHead>
                      <TableHead>Crop</TableHead>
                      <TableHead className="hidden md:table-cell">Plot Size</TableHead>
                      <TableHead className="hidden lg:table-cell">Expected Yield</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPending.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No crop cycles ready for yield capture
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPending.map((cycle) => {
                        const name = cycle.farmer?.full_name || cycle.farmer?.name || "Unknown"
                        const location = [cycle.farmer?.village, cycle.farmer?.lga].filter(Boolean).join(", ")
                        const expectedKg = cycle.expected_yield_tons ? Number(cycle.expected_yield_tons) * 1000 : null
                        return (
                          <TableRow key={cycle.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{name}</p>
                                {location && (
                                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />{location}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium capitalize">{cycle.crop_type}</p>
                                {cycle.variety && <p className="text-xs text-muted-foreground">{cycle.variety}</p>}
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{cycle.hectares_planted} ha</TableCell>
                            <TableCell className="hidden lg:table-cell">
                              {expectedKg ? `${expectedKg.toLocaleString()} kg` : "—"}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={cn(
                                cycle.status === "active" && "bg-emerald-100 text-emerald-700 border-emerald-200",
                                cycle.status === "harvesting" && "bg-blue-100 text-blue-700 border-blue-200",
                              )}>
                                {cycle.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button size="sm" onClick={() => handleOpenDialog(cycle)}>
                                <Scale className="h-4 w-4 mr-1" />
                                Capture
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {captured.length > 0 && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Recent Yield Captures</CardTitle>
              <CardDescription>Cycles where yield has been recorded</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {captured.slice(0, 10).map((cycle) => {
                  const expectedKg = cycle.expected_yield_tons ? Number(cycle.expected_yield_tons) * 1000 : null
                  const actualKg = Number(cycle.actual_yield_tons) * 1000
                  const variance = expectedKg ? getVariance(expectedKg, actualKg) : null
                  const name = cycle.farmer?.full_name || cycle.farmer?.name || "Unknown"
                  return (
                    <div key={cycle.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Wheat className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{name}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {cycle.crop_type} • {cycle.updated_at ? new Date(cycle.updated_at).toLocaleDateString() : "—"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{actualKg.toLocaleString()} kg</p>
                          {variance !== null && (
                            <div className={cn("flex items-center text-xs", variance >= 0 ? "text-emerald-600" : "text-red-600")}>
                              {variance >= 0 ? <TrendingUp className="h-3 w-3 mr-0.5" /> : <TrendingDown className="h-3 w-3 mr-0.5" />}
                              {Math.abs(variance).toFixed(1)}%
                            </div>
                          )}
                        </div>
                        <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                          {cycle.status}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Capture Yield</DialogTitle>
              <DialogDescription>
                Record harvest yield for {selectedCycle?.farmer?.full_name || selectedCycle?.farmer?.name || "farmer"}
              </DialogDescription>
            </DialogHeader>

            {selectedCycle && (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Crop</span>
                    <span className="font-medium capitalize">{selectedCycle.crop_type}{selectedCycle.variety ? ` (${selectedCycle.variety})` : ""}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Plot Size</span>
                    <span className="font-medium">{selectedCycle.hectares_planted} ha</span>
                  </div>
                  {selectedCycle.expected_yield_tons && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Expected Yield</span>
                      <span className="font-medium">{(Number(selectedCycle.expected_yield_tons) * 1000).toLocaleString()} kg</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Actual Yield (kg) *</Label>
                  <Input type="number" placeholder="Enter measured yield in kg" value={actualYield} onChange={(e) => setActualYield(e.target.value)} />
                  {actualYield && selectedCycle.expected_yield_tons && (
                    <p className={cn("text-xs", Number(actualYield) >= Number(selectedCycle.expected_yield_tons) * 1000 ? "text-emerald-600" : "text-amber-600")}>
                      {(((Number(actualYield) - Number(selectedCycle.expected_yield_tons) * 1000) / (Number(selectedCycle.expected_yield_tons) * 1000)) * 100).toFixed(1)}%
                      {Number(actualYield) >= Number(selectedCycle.expected_yield_tons) * 1000 ? " above" : " below"} expected
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Quality Grade *</Label>
                  <Select value={qualityGrade} onValueChange={setQualityGrade}>
                    <SelectTrigger><SelectValue placeholder="Select quality grade" /></SelectTrigger>
                    <SelectContent>
                      {qualityGrades.map((g) => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Moisture Content (%) — optional</Label>
                  <Input type="number" step="0.1" placeholder="e.g. 12.5" value={moistureContent} onChange={(e) => setMoistureContent(e.target.value)} />
                  {moistureContent && Number(moistureContent) > 14 && (
                    <p className="text-xs text-amber-600 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />High moisture may affect quality grade
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Photo Evidence (Optional)</Label>
                  <Button variant="outline" className="w-full bg-transparent" type="button">
                    <Camera className="h-4 w-4 mr-2" />Take Photo
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Notes (Optional)</Label>
                  <Input placeholder="Any harvest observations..." value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmitYield} disabled={!actualYield || !qualityGrade || isSubmitting}>
                {isSubmitting ? "Submitting…" : "Submit Yield"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
