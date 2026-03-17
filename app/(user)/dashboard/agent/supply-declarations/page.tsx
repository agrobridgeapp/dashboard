"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertTriangle,
  Plus,
  FileText,
  Calendar,
  MapPin,
  Wheat,
  Info,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CropSelectItems } from "@/components/ui/crop-select-items"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive"; icon: typeof Clock }
> = {
  submitted: { label: "Submitted", variant: "secondary", icon: Clock },
  under_review: { label: "Under Review", variant: "secondary", icon: HelpCircle },
  approved: { label: "Approved (Planning)", variant: "outline", icon: CheckCircle2 },
  declined: { label: "Declined", variant: "destructive", icon: XCircle },
  expired: { label: "Expired", variant: "default", icon: Clock },
}

export default function AssistedSupplyDeclarationsPage() {
  const [declarations, setDeclarations] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [agentProfile, setAgentProfile] = useState<any>(null)
  const [formData, setFormData] = useState({
    crop: "",
    volumeMin: "",
    volumeMax: "",
    availabilityStart: "",
    availabilityEnd: "",
    sourceType: "",
    notes: "",
  })

  const load = useCallback(async () => {
    try {
      const [profileRes, interestsRes] = await Promise.all([
        apiClient.agentMe.getProfile(),
        apiClient.planningInterests.list(),
      ])
      if (profileRes.success) setAgentProfile(profileRes.data)
      if (interestsRes.success) setDeclarations(interestsRes.data)
    } catch {
      // non-critical
    }
  }, [])

  useEffect(() => { load() }, [load])

  const agentCorridor = agentProfile?.assigned_corridors?.[0] || "—"

  const handleSubmit = async () => {
    if (
      !formData.crop ||
      !formData.volumeMin ||
      !formData.volumeMax ||
      !formData.availabilityStart ||
      !formData.availabilityEnd ||
      !formData.sourceType
    ) return

    setSubmitting(true)
    try {
      await apiClient.planningInterests.create({
        crop_type: formData.crop,
        estimated_volume_tons: Number(formData.volumeMax),
        target_season: `${formData.availabilityStart} to ${formData.availabilityEnd}`,
        notes: [formData.sourceType, formData.notes].filter(Boolean).join(" — ") || undefined,
      })
      toast.success("Declaration submitted")
      setFormData({ crop: "", volumeMin: "", volumeMax: "", availabilityStart: "", availabilityEnd: "", sourceType: "", notes: "" })
      setIsDialogOpen(false)
      load()
    } catch (err: any) {
      toast.error(err.message || "Failed to submit")
    } finally {
      setSubmitting(false)
    }
  }

  const activeCount = declarations.filter(
    (d) => d.status === "submitted" || d.status === "under_review" || d.status === "approved" || d.status === "reviewed",
  ).length
  const approvedCount = declarations.filter((d) => d.status === "approved").length

  return (
    <DashboardLayout allowedRoles={["field_agent"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Assisted Supply Declarations</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Declare potential supply availability to support AgroBridge coordination
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Plus className="h-4 w-4" />
                New Declaration
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>New Supply Declaration</DialogTitle>
                <DialogDescription>Declare potential supply availability for AgroBridge planning</DialogDescription>
              </DialogHeader>

              {/* Non-binding disclaimer */}
              <Alert className="bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800 text-sm">
                  Assisted supply declarations are non-binding and subject to AgroBridge review and verification. They
                  do not guarantee delivery or compensation.
                </AlertDescription>
              </Alert>

              <div className="space-y-4 py-2">
                {/* Crop */}
                <div className="space-y-2">
                  <Label htmlFor="crop">Crop *</Label>
                  <Select value={formData.crop} onValueChange={(value) => setFormData({ ...formData, crop: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select crop" />
                    </SelectTrigger>
                    <SelectContent>
                      <CropSelectItems />
                    </SelectContent>
                  </Select>
                </div>

                {/* Corridor - Auto-filled */}
                <div className="space-y-2">
                  <Label htmlFor="corridor">Corridor</Label>
                  <Input id="corridor" value={agentCorridor} disabled className="bg-muted" />
                  <p className="text-xs text-muted-foreground">Auto-filled based on your coverage area</p>
                </div>

                {/* Volume Range */}
                <div className="space-y-2">
                  <Label>Indicative Volume Range (MT) *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={formData.volumeMin}
                      onChange={(e) => setFormData({ ...formData, volumeMin: e.target.value })}
                      className="w-full"
                    />
                    <span className="text-muted-foreground">to</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={formData.volumeMax}
                      onChange={(e) => setFormData({ ...formData, volumeMax: e.target.value })}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Availability Window */}
                <div className="space-y-2">
                  <Label>Availability Window *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="date"
                      value={formData.availabilityStart}
                      onChange={(e) => setFormData({ ...formData, availabilityStart: e.target.value })}
                      className="w-full"
                    />
                    <span className="text-muted-foreground">to</span>
                    <Input
                      type="date"
                      value={formData.availabilityEnd}
                      onChange={(e) => setFormData({ ...formData, availabilityEnd: e.target.value })}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Source Type */}
                <div className="space-y-2">
                  <Label htmlFor="sourceType">Source Type *</Label>
                  <Select
                    value={formData.sourceType}
                    onValueChange={(value) => setFormData({ ...formData, sourceType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select source type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Farmer cluster">Farmer cluster</SelectItem>
                      <SelectItem value="Market aggregation">Market aggregation</SelectItem>
                      <SelectItem value="Mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional context about the declared availability..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter className="flex-col gap-2 sm:flex-row">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={
                    !formData.crop ||
                    !formData.volumeMin ||
                    !formData.volumeMax ||
                    !formData.availabilityStart ||
                    !formData.availabilityEnd ||
                    !formData.sourceType ||
                  submitting
                  }
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  {submitting ? "Submitting…" : "Submit Declaration"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Info Banner */}
        <Alert className="bg-slate-50 border-slate-200">
          <Info className="h-4 w-4 text-slate-600" />
          <AlertDescription className="text-slate-700 text-sm">
            Declarations help AgroBridge plan for potential demand gaps. Compensation applies only to volumes delivered
            under approved AgroBridge coordination.
          </AlertDescription>
        </Alert>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card className="border-slate-200">
            <CardContent className="pt-4">
              <div className="text-2xl font-semibold text-slate-700">{declarations.length}</div>
              <p className="text-sm text-muted-foreground">Total Declarations</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="pt-4">
              <div className="text-2xl font-semibold text-slate-700">{activeCount}</div>
              <p className="text-sm text-muted-foreground">Active</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="pt-4">
              <div className="text-2xl font-semibold text-slate-700">{approvedCount}</div>
              <p className="text-sm text-muted-foreground">Approved (Planning)</p>
            </CardContent>
          </Card>
          <Card className="border-amber-200 bg-amber-50/50">
            <CardContent className="pt-4">
              <div className="text-2xl font-semibold text-amber-700">
                {declarations.filter((d) => d.status === "under_review").length}
              </div>
              <p className="text-sm text-amber-600">Under Review</p>
            </CardContent>
          </Card>
        </div>

        {/* Declarations List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Declarations</CardTitle>
            <CardDescription>
              Declarations are subject to verification and do not guarantee compensation
            </CardDescription>
          </CardHeader>
          <CardContent>
            {declarations.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-1">No declarations yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Submit a declaration to signal potential supply availability
                </p>
                <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Declaration
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {declarations.map((declaration) => {
                  const status = statusConfig[declaration.status]
                  const StatusIcon = status.icon

                  return (
                    <div key={declaration.id} className="border rounded-lg p-4 bg-slate-50/50">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Wheat className="h-4 w-4 text-slate-500" />
                            <span className="font-medium capitalize">{declaration.crop_type || declaration.crop}</span>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-sm text-muted-foreground">{declaration.id?.slice(0, 8)}</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>{declaration.preferred_corridor || declaration.corridor || "—"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{declaration.target_season || declaration.availabilityStart}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-foreground font-medium">
                              Volume: {declaration.estimated_volume_tons
                                ? `${declaration.estimated_volume_tons} MT`
                                : declaration.volumeRange}
                            </span>
                          </div>

                          {declaration.notes && (
                            <p className="text-sm text-muted-foreground italic">"{declaration.notes}"</p>
                          )}

                          <p className="text-xs text-muted-foreground">
                            Submitted:{" "}
                            {new Date(declaration.created_at || declaration.submittedAt).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>

                        <div className="flex items-center">
                          <Badge
                            variant={status.variant}
                            className={`gap-1 ${
                              declaration.status === "approved"
                                ? "bg-slate-100 text-slate-700 border-slate-300"
                                : declaration.status === "under_review"
                                  ? "bg-amber-100 text-amber-700 border-amber-300"
                                  : ""
                            }`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {status.label}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Note */}
        <p className="text-xs text-muted-foreground text-center">
          Declarations are for planning purposes only. They do not create binding commitments or guarantee compensation.
        </p>
      </div>
    </DashboardLayout>
  )
}
