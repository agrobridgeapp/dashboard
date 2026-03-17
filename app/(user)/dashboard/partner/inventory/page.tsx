"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Info, Loader2, Pencil } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

const ALL_SERVICES = [
  { value: "land_prep", label: "Land Preparation" },
  { value: "planting", label: "Planting" },
  { value: "fertilizer", label: "Fertilizer Application" },
  { value: "pest_control", label: "Pest Control" },
  { value: "irrigation", label: "Irrigation" },
  { value: "harvest", label: "Harvesting" },
  { value: "transport", label: "Transport / Logistics" },
  { value: "storage", label: "Storage" },
]

export default function PartnerDeclaredCapacityPage() {
  const [partner, setPartner] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  // Edit form state
  const [weeklyCapacity, setWeeklyCapacity] = useState("")
  const [storageCapacity, setStorageCapacity] = useState("")
  const [capacityDescription, setCapacityDescription] = useState("")
  const [servicesOffered, setServicesOffered] = useState<string[]>([])

  const loadProfile = useCallback(async () => {
    setLoading(true)
    try {
      const res = await apiClient.partnerMe.getProfile()
      if (res.success) setPartner(res.data)
    } catch {
      toast.error("Failed to load capacity data")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadProfile() }, [loadProfile])

  const openEdit = () => {
    if (!partner) return
    setWeeklyCapacity(partner.weekly_capacity_hectares?.toString() || "")
    setStorageCapacity(partner.storage_capacity || "")
    setCapacityDescription(partner.capacity_description || "")
    const raw = partner.services_offered
    setServicesOffered(
      Array.isArray(raw) ? raw : typeof raw === "string" ? JSON.parse(raw || "[]") : []
    )
    setIsEditOpen(true)
  }

  const toggleService = (value: string) => {
    setServicesOffered((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await apiClient.partnerMe.updateCapacity({
        weekly_capacity_hectares: weeklyCapacity ? Number(weeklyCapacity) : undefined,
        capacity_description: capacityDescription || undefined,
        storage_capacity: storageCapacity || undefined,
        services_offered: servicesOffered,
      })
      toast.success("Capacity updated")
      setIsEditOpen(false)
      loadProfile()
    } catch (err: any) {
      toast.error(err.message || "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  const servicesArray: string[] = (() => {
    if (!partner) return []
    const raw = partner.services_offered
    if (Array.isArray(raw)) return raw
    if (typeof raw === "string") { try { return JSON.parse(raw) } catch { return [] } }
    return []
  })()

  const utilization = partner?.current_utilization_percent
    ? Math.round(Number(partner.current_utilization_percent))
    : 0

  return (
    <DashboardLayout allowedRoles={["partner"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Declared Capacity</h1>
            <p className="text-muted-foreground">Your declared service capacity for AgroBridge job assignments</p>
          </div>
          <Button onClick={openEdit} disabled={loading || !partner}>
            <Pencil className="h-4 w-4 mr-2" />
            Update Capacity
          </Button>
        </div>

        <Alert className="bg-muted/50 border-muted">
          <Info className="h-4 w-4" />
          <AlertDescription>
            This shows your declared service capacity. AgroBridge uses this information to match and assign jobs to you.
            Keep it accurate to receive the right job volume.
          </AlertDescription>
        </Alert>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : !partner ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Package className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p>No capacity data found. Complete your partner profile to get started.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Weekly Capacity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {partner.weekly_capacity_hectares
                      ? `${Number(partner.weekly_capacity_hectares).toLocaleString()} ha`
                      : "—"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Hectares per week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Services Offered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{servicesArray.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Service types declared</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{utilization}%</div>
                  <p className="text-xs text-muted-foreground mt-1">Current capacity in use</p>
                </CardContent>
              </Card>
            </div>

            {/* Capacity Details */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Capacity Details</CardTitle>
                <CardDescription>Your current declared service profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Services */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">Services Offered</p>
                  {servicesArray.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">No services declared yet</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {servicesArray.map((s: string) => {
                        const svc = ALL_SERVICES.find((x) => x.value === s)
                        return (
                          <Badge key={s} variant="secondary">
                            {svc?.label || s.replace(/_/g, " ")}
                          </Badge>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Capacity Description */}
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Capacity Description</p>
                  <p className="text-sm">
                    {partner.capacity_description || (
                      <span className="italic text-muted-foreground">No description provided</span>
                    )}
                  </p>
                </div>

                {/* Storage Capacity (if set) */}
                {partner.storage_capacity && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Storage Capacity</p>
                    <p className="text-sm">{partner.storage_capacity} MT</p>
                  </div>
                )}

                {/* Partner Type */}
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Partner Type</p>
                  <Badge variant="outline" className="capitalize">
                    {(partner.partner_type || "").replace(/_/g, " ")}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Declared Capacity</DialogTitle>
            <DialogDescription>
              Update your service capacity so AgroBridge can match the right jobs to you.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <Label>Weekly Capacity (hectares)</Label>
              <Input
                type="number"
                min="0"
                placeholder="e.g. 50"
                value={weeklyCapacity}
                onChange={(e) => setWeeklyCapacity(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">How many hectares of service you can handle per week</p>
            </div>

            <div className="space-y-2">
              <Label>Storage Capacity (MT) — optional</Label>
              <Input
                type="number"
                min="0"
                placeholder="e.g. 500"
                value={storageCapacity}
                onChange={(e) => setStorageCapacity(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label>Services Offered</Label>
              <div className="grid grid-cols-2 gap-2">
                {ALL_SERVICES.map((svc) => (
                  <div key={svc.value} className="flex items-center gap-2">
                    <Checkbox
                      id={svc.value}
                      checked={servicesOffered.includes(svc.value)}
                      onCheckedChange={() => toggleService(svc.value)}
                    />
                    <Label htmlFor={svc.value} className="text-sm font-normal cursor-pointer">
                      {svc.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Capacity Description (optional)</Label>
              <Textarea
                placeholder="Describe your equipment, fleet size, or any other capacity details..."
                value={capacityDescription}
                onChange={(e) => setCapacityDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save Capacity"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
