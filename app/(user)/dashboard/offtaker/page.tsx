"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { DemoWatermark } from "@/components/demo/demo-watermark"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  FileText,
  TrendingUp,
  Truck,
  MapPin,
  Wheat,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  MessageSquarePlus,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { CropSelectItems } from "@/components/ui/crop-select-items"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

type ContractRow = {
  id: string
  crop_type: string
  corridor_id: string
  season_id: string
  contracted_volume_tons: number
  delivered_volume_tons: number
  remaining_volume_tons: number
  status: string
}

export default function BuyerDashboard() {
  const [contracts, setContracts] = useState<ContractRow[]>([])
  const [contractsLoading, setContractsLoading] = useState(true)

  const [cropFilter, setCropFilter] = useState<string>("all")
  const [corridorFilter, setCorridorFilter] = useState<string>("all")

  const [planningInterests, setPlanningInterests] = useState<any[]>([])
  const [planningLoading, setPlanningLoading] = useState(true)
  const [showPlanningModal, setShowPlanningModal] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [planningForm, setPlanningForm] = useState({
    crop: "",
    season: "",
    volumeRange: "",
    deliveryWindow: "",
    notes: "",
  })

  const fetchContracts = useCallback(async () => {
    try {
      setContractsLoading(true)
      const res = await apiClient.contracts.list()
      const raw = res.data?.contracts ?? res.data ?? []
      setContracts(
        raw.map((c: any) => ({
          ...c,
          contracted_volume_tons: Number(c.contracted_volume_tons),
          delivered_volume_tons: Number(c.delivered_volume_tons),
          remaining_volume_tons: Number(c.remaining_volume_tons),
        }))
      )
    } catch (err: any) {
      toast.error(err.message || "Failed to load contracts")
    } finally {
      setContractsLoading(false)
    }
  }, [])

  const fetchPlanningInterests = useCallback(async () => {
    try {
      setPlanningLoading(true)
      const res = await apiClient.planningInterests.list()
      setPlanningInterests(res.data || [])
    } catch {
      // Non-critical — silently ignore
    } finally {
      setPlanningLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchContracts()
    fetchPlanningInterests()
  }, [fetchContracts, fetchPlanningInterests])

  const filteredSupply = contracts.filter((item) => {
    if (cropFilter !== "all" && item.crop_type.toLowerCase() !== cropFilter.toLowerCase()) return false
    if (corridorFilter !== "all" && item.corridor_id !== corridorFilter) return false
    return true
  })

  const totalContracted = filteredSupply.reduce((sum, item) => sum + item.contracted_volume_tons, 0)
  const totalDelivered = filteredSupply.reduce((sum, item) => sum + item.delivered_volume_tons, 0)
  const fulfilmentRate = totalContracted > 0 ? Math.round((totalDelivered / totalContracted) * 100) : 0
  const activeContracts = filteredSupply.filter((c) => ["active", "in_delivery"].includes(c.status)).length

  const handlePlanningSubmit = async () => {
    if (!planningForm.crop || !planningForm.season || !planningForm.volumeRange) return

    setSubmitLoading(true)
    try {
      await apiClient.planningInterests.create({
        cropType: planningForm.crop,
        season: planningForm.season,
        volumeRange: planningForm.volumeRange,
        deliveryWindow: planningForm.deliveryWindow,
        notes: planningForm.notes,
      })
      setPlanningForm({ crop: "", season: "", volumeRange: "", deliveryWindow: "", notes: "" })
      setShowPlanningModal(false)
      setShowConfirmation(true)
      setTimeout(() => setShowConfirmation(false), 5000)
      fetchPlanningInterests()
    } catch (err: any) {
      toast.error(err.message || "Failed to submit planning interest")
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <DashboardLayout allowedRoles={["offtaker"]}>
      <DemoWatermark />
      <div className="space-y-6">
        {showConfirmation && (
          <div className="rounded-lg bg-[#1B5E3C]/10 border border-[#1B5E3C]/20 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#1B5E3C] mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-[#1B5E3C]">Planning interest received</p>
                <p className="text-sm text-muted-foreground">Our team may follow up to discuss feasibility.</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Buyer Dashboard</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Visibility into AgroBridge-coordinated supply and fulfilment.
            </p>
          </div>

          <Dialog open={showPlanningModal} onOpenChange={setShowPlanningModal}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-fit text-muted-foreground hover:text-foreground bg-transparent"
              >
                <MessageSquarePlus className="mr-2 h-4 w-4" />
                Share Planning Interest
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Share Planning Interest</DialogTitle>
                <DialogDescription>Help us plan future corridors and crop coverage.</DialogDescription>
              </DialogHeader>

              <div className="rounded-md bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
                This is a non-binding expression of interest to support planning. It is not an order or commitment.
              </div>

              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="crop">
                    Crop <span className="text-red-500">*</span>
                  </Label>
                  <Select value={planningForm.crop} onValueChange={(v) => setPlanningForm({ ...planningForm, crop: v })}>
                    <SelectTrigger id="crop">
                      <SelectValue placeholder="Select crop" />
                    </SelectTrigger>
                    <SelectContent>
                      <CropSelectItems />
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="season">
                    Season <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={planningForm.season}
                    onValueChange={(v) => setPlanningForm({ ...planningForm, season: v })}
                  >
                    <SelectTrigger id="season">
                      <SelectValue placeholder="Select season" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dry 2025">Dry 2025</SelectItem>
                      <SelectItem value="Wet 2025">Wet 2025</SelectItem>
                      <SelectItem value="Dry 2026">Dry 2026</SelectItem>
                      <SelectItem value="Wet 2026">Wet 2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="volume">
                    Indicative Volume Range <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={planningForm.volumeRange}
                    onValueChange={(v) => setPlanningForm({ ...planningForm, volumeRange: v })}
                  >
                    <SelectTrigger id="volume">
                      <SelectValue placeholder="Select volume range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100-500">100 - 500 MT</SelectItem>
                      <SelectItem value="500-1000">500 - 1,000 MT</SelectItem>
                      <SelectItem value="1000-2500">1,000 - 2,500 MT</SelectItem>
                      <SelectItem value="2500-5000">2,500 - 5,000 MT</SelectItem>
                      <SelectItem value="5000+">5,000+ MT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="delivery">
                    Preferred Delivery Window <span className="text-muted-foreground text-xs">(optional)</span>
                  </Label>
                  <Select
                    value={planningForm.deliveryWindow}
                    onValueChange={(v) => setPlanningForm({ ...planningForm, deliveryWindow: v })}
                  >
                    <SelectTrigger id="delivery">
                      <SelectValue placeholder="Select window" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Jan - Mar">Jan - Mar</SelectItem>
                      <SelectItem value="Apr - Jun">Apr - Jun</SelectItem>
                      <SelectItem value="Jul - Sep">Jul - Sep</SelectItem>
                      <SelectItem value="Oct - Dec">Oct - Dec</SelectItem>
                      <SelectItem value="Flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">
                    Notes <span className="text-muted-foreground text-xs">(optional)</span>
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional context or requirements..."
                    value={planningForm.notes}
                    onChange={(e) => setPlanningForm({ ...planningForm, notes: e.target.value })}
                    className="h-20 resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowPlanningModal(false)}
                  className="flex-1"
                  disabled={submitLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePlanningSubmit}
                  className="flex-1 bg-[#1B5E3C] hover:bg-[#154a30]"
                  disabled={!planningForm.crop || !planningForm.season || !planningForm.volumeRange || submitLoading}
                >
                  {submitLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Interest
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {!planningLoading && planningInterests.length > 0 && (
          <Link href="/dashboard/offtaker/planning-interests" className="inline-block">
            <span className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline">
              View {planningInterests.length} submitted planning interest{planningInterests.length !== 1 ? "s" : ""} →
            </span>
          </Link>
        )}

        <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
          <Select value={cropFilter} onValueChange={setCropFilter}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="All Crops" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Crops</SelectItem>
              <CropSelectItems />
            </SelectContent>
          </Select>
          <Select value={corridorFilter} onValueChange={setCorridorFilter}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="All Corridors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Corridors</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
          <Card className="border-border/50">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1B5E3C]/10">
                  <FileText className="h-5 w-5 text-[#1B5E3C]" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{contractsLoading ? "—" : activeContracts}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Active AgroBridge Contracts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1B5E3C]/10">
                  <TrendingUp className="h-5 w-5 text-[#1B5E3C]" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{contractsLoading ? "—" : `${fulfilmentRate}%`}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">AgroBridge Fulfilment Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1B5E3C]/10">
                  <Truck className="h-5 w-5 text-[#1B5E3C]" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {contractsLoading ? "—" : `${totalContracted.toLocaleString()} MT`}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Contracted Volume</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contracted Supply Table */}
        <Card className="border-border/50">
          <div className="p-4 sm:p-6 border-b">
            <h2 className="text-base sm:text-lg font-semibold">Contracted Supply Status</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              AgroBridge contracts with delivery progress and status
            </p>
          </div>
          <CardContent className="p-0">
            {contractsLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredSupply.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                No contracts found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm text-muted-foreground">
                      <th className="pb-3 px-4 sm:px-6 pt-4 font-medium">Crop</th>
                      <th className="pb-3 pr-4 pt-4 font-medium text-right">Contracted</th>
                      <th className="pb-3 pr-4 pt-4 font-medium text-right">Delivered</th>
                      <th className="pb-3 pr-4 pt-4 font-medium text-right">Remaining</th>
                      <th className="pb-3 pr-4 pt-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSupply.map((item) => (
                      <tr key={item.id} className="border-b border-border/50 last:border-0">
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center gap-2">
                            <div className="rounded bg-amber-100 p-1.5">
                              <Wheat className="h-4 w-4 text-amber-600" />
                            </div>
                            <span className="font-medium capitalize">{item.crop_type}</span>
                          </div>
                        </td>
                        <td className="py-4 pr-4 text-right font-medium">
                          {item.contracted_volume_tons.toLocaleString()} MT
                        </td>
                        <td className="py-4 pr-4 text-right text-[#1B5E3C] font-medium">
                          {item.delivered_volume_tons.toLocaleString()} MT
                        </td>
                        <td className="py-4 pr-4 text-right text-muted-foreground">
                          {item.remaining_volume_tons.toLocaleString()} MT
                        </td>
                        <td className="py-4 pr-4">
                          <Badge
                            className={
                              item.status === "fulfilled"
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : item.status === "active" || item.status === "in_delivery"
                                  ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                                  : item.status === "cancelled"
                                    ? "bg-red-100 text-red-700 hover:bg-red-100"
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-100"
                            }
                          >
                            {item.status === "fulfilled" ? (
                              <>
                                <CheckCircle2 className="mr-1 h-3 w-3" /> Fulfilled
                              </>
                            ) : item.status === "active" ? (
                              <>
                                <TrendingUp className="mr-1 h-3 w-3" /> On Track
                              </>
                            ) : (
                              item.status.replace("_", " ")
                            )}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-muted/30">
                      <td className="py-3 px-4 sm:px-6 font-medium">Total</td>
                      <td className="py-3 pr-4 text-right font-bold">{totalContracted.toLocaleString()} MT</td>
                      <td className="py-3 pr-4 text-right font-bold text-[#1B5E3C]">
                        {totalDelivered.toLocaleString()} MT
                      </td>
                      <td className="py-3 pr-4 text-right font-medium text-muted-foreground">
                        {(totalContracted - totalDelivered).toLocaleString()} MT
                      </td>
                      <td className="py-3 pr-4"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground text-center">
          This dashboard shows AgroBridge-coordinated supply only. Data refreshes daily.
        </p>
      </div>
    </DashboardLayout>
  )
}
