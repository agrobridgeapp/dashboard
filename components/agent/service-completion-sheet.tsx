"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle,
  Clock,
  Play,
  User,
  Calendar,
  MapPin,
  Tractor,
  Camera,
  AlertTriangle,
  Building2,
  X,
} from "lucide-react"
import type { ServiceEvent, Farmer, Partner, ServiceEventStatus } from "@/lib/data/types"

interface ServiceCompletionSheetProps {
  service: ServiceEvent | null
  open: boolean
  onOpenChange: (open: boolean) => void
  farmers: Farmer[]
  partners: Partner[]
  onComplete: (serviceId: string, partnerId: string, partnerName: string, notes: string, proofUrl?: string) => void
  onUpdateStatus: (serviceId: string, status: ServiceEventStatus) => void
}

const serviceTypeLabels: Record<string, string> = {
  land_preparation: "Land Preparation",
  planting: "Planting",
  fertilizer_application: "Fertilizer Application",
  pest_control: "Pest Control",
  irrigation: "Irrigation",
  harvesting: "Harvesting",
  transport: "Transport",
  storage: "Storage",
}

const statusConfig: Record<string, { label: string; color: string }> = {
  planned: { label: "Planned", color: "bg-slate-100 text-slate-700" },
  scheduled: { label: "Scheduled", color: "bg-blue-100 text-blue-700" },
  in_progress: { label: "In Progress", color: "bg-amber-100 text-amber-700" },
  completed: { label: "Completed", color: "bg-emerald-100 text-emerald-700" },
  verified: { label: "Verified", color: "bg-green-100 text-green-700" },
}

export function ServiceCompletionSheet({
  service,
  open,
  onOpenChange,
  farmers,
  partners,
  onComplete,
  onUpdateStatus,
}: ServiceCompletionSheetProps) {
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>("")
  const [notes, setNotes] = useState("")
  const [proofUrl, setProofUrl] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState<"details" | "partner" | "confirm">("details")

  // Reset state when service changes
  useEffect(() => {
    if (service) {
      setSelectedPartnerId(service.assignedPartnerId || "")
      setNotes(service.notes || "")
      setProofUrl("")
      setStep(service.status === "in_progress" ? "partner" : "details")
    }
  }, [service])

  if (!service) return null

  const farmer = farmers.find((f) => f.id === service.farmerId)
  const farmerName = farmer ? `${farmer.firstName} ${farmer.lastName}` : "Unknown"
  const config = statusConfig[service.status] || statusConfig.planned

  // Filter partners that offer this service type
  const availablePartners = partners.filter((p) => p.servicesOffered.includes(service.serviceType))

  const selectedPartner = partners.find((p) => p.id === selectedPartnerId)
  const dueDate = new Date(service.plannedDateEnd)
  const isOverdue = dueDate < new Date() && service.status !== "completed" && service.status !== "verified"

  const handleStartService = () => {
    onUpdateStatus(service.id, "in_progress")
    setStep("partner")
  }

  const handleComplete = async () => {
    if (!selectedPartnerId) return

    setIsSubmitting(true)

    // Simulate a brief delay for UX
    await new Promise((resolve) => setTimeout(resolve, 300))

    const partner = partners.find((p) => p.id === selectedPartnerId)
    onComplete(service.id, selectedPartnerId, partner?.companyName || "Unknown Partner", notes, proofUrl || undefined)

    setIsSubmitting(false)
  }

  const handlePhotoCapture = () => {
    // In production, this would open camera or file picker
    // For demo, we'll set a placeholder
    setProofUrl("/service-completion-photo-proof.jpg")
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-4 pb-3 border-b">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <SheetTitle className="flex items-center gap-2 text-lg">
                  <Tractor className="h-5 w-5 text-primary" />
                  {serviceTypeLabels[service.serviceType] || service.serviceType}
                </SheetTitle>
                <SheetDescription className="flex items-center gap-2 mt-1">
                  <User className="h-3.5 w-3.5" />
                  {farmerName}
                </SheetDescription>
              </div>
              <Badge variant="outline" className={config.color}>
                {config.label}
              </Badge>
            </div>
          </SheetHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Service Details */}
            {step === "details" && (
              <div className="space-y-4">
                {/* Status Alert */}
                {isOverdue && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium text-red-700 text-sm">Service Overdue</p>
                      <p className="text-xs text-red-600">Due date was {dueDate.toLocaleDateString("en-NG")}</p>
                    </div>
                  </div>
                )}

                {/* Info Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs font-medium">Due Date</span>
                    </div>
                    <p className="font-semibold text-sm">
                      {dueDate.toLocaleDateString("en-NG", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <MapPin className="h-4 w-4" />
                      <span className="text-xs font-medium">Location</span>
                    </div>
                    <p className="font-semibold text-sm">{farmer?.village || "N/A"}</p>
                  </div>
                </div>

                {/* Current Partner */}
                {service.assignedPartnerName && (
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <Building2 className="h-4 w-4" />
                      <span className="text-xs font-medium">Assigned Partner</span>
                    </div>
                    <p className="font-semibold text-sm">{service.assignedPartnerName}</p>
                  </div>
                )}

                {/* Cost */}
                <div className="p-3 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Estimated Cost</span>
                    <span className="font-bold">
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                        maximumFractionDigits: 0,
                      }).format(service.estimatedCost)}
                    </span>
                  </div>
                </div>

                {/* Description */}
                {service.description && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Description</Label>
                    <p className="text-sm mt-1">{service.description}</p>
                  </div>
                )}
              </div>
            )}

            {/* Partner Selection */}
            {step === "partner" && (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Select Partner Used</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">Choose the partner that executed this service</p>
                </div>

                <RadioGroup value={selectedPartnerId} onValueChange={setSelectedPartnerId} className="space-y-2">
                  {availablePartners.length > 0 ? (
                    availablePartners.map((partner) => (
                      <label
                        key={partner.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedPartnerId === partner.id
                            ? "border-primary bg-primary/5"
                            : "border-border/50 hover:border-border"
                        }`}
                      >
                        <RadioGroupItem value={partner.id} />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{partner.companyName}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-muted-foreground">{partner.contactName}</span>
                            <span className="text-xs text-muted-foreground">
                              • {partner.averageRating.toFixed(1)} rating
                            </span>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {partner.slaAdherenceRate}% SLA
                        </Badge>
                      </label>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Building2 className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No partners available for this service type</p>
                    </div>
                  )}
                </RadioGroup>

                <Separator />

                {/* Notes */}
                <div>
                  <Label htmlFor="notes" className="text-sm font-medium">
                    Completion Notes (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any observations or notes..."
                    className="mt-2 min-h-[80px]"
                  />
                </div>

                {/* Photo Proof */}
                <div>
                  <Label className="text-sm font-medium">Photo Proof (Optional)</Label>
                  <div className="mt-2">
                    {proofUrl ? (
                      <div className="relative">
                        <img
                          src={proofUrl || "/placeholder.svg"}
                          alt="Proof"
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute top-2 right-2 h-7 w-7 bg-background"
                          onClick={() => setProofUrl("")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full h-20 border-dashed bg-transparent"
                        onClick={handlePhotoCapture}
                      >
                        <Camera className="h-5 w-5 mr-2" />
                        Take Photo
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Confirmation */}
            {step === "confirm" && selectedPartner && (
              <div className="space-y-4">
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-lg">Confirm Completion</h3>
                  <p className="text-sm text-muted-foreground mt-1">Review the details before submitting</p>
                </div>

                <div className="space-y-3 bg-muted/50 rounded-lg p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-medium">{serviceTypeLabels[service.serviceType]}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Farmer</span>
                    <span className="font-medium">{farmerName}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Partner</span>
                    <span className="font-medium">{selectedPartner.companyName}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cost</span>
                    <span className="font-medium">
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                        maximumFractionDigits: 0,
                      }).format(service.estimatedCost)}
                    </span>
                  </div>
                  {notes && (
                    <>
                      <Separator />
                      <div className="text-sm">
                        <span className="text-muted-foreground block mb-1">Notes</span>
                        <span className="text-xs">{notes}</span>
                      </div>
                    </>
                  )}
                  {proofUrl && (
                    <>
                      <Separator />
                      <div className="text-sm">
                        <span className="text-muted-foreground block mb-1">Photo</span>
                        <img
                          src={proofUrl || "/placeholder.svg"}
                          alt="Proof"
                          className="w-full h-20 object-cover rounded-lg"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t bg-background">
            {step === "details" && (
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
                {service.status === "scheduled" && (
                  <Button className="flex-1" onClick={handleStartService}>
                    <Play className="h-4 w-4 mr-2" />
                    Start Service
                  </Button>
                )}
                {service.status === "in_progress" && (
                  <Button className="flex-1" onClick={() => setStep("partner")}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Complete
                  </Button>
                )}
              </div>
            )}

            {step === "partner" && (
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep("details")}>
                  Back
                </Button>
                <Button className="flex-1" disabled={!selectedPartnerId} onClick={() => setStep("confirm")}>
                  Continue
                </Button>
              </div>
            )}

            {step === "confirm" && (
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep("partner")}>
                  Back
                </Button>
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  onClick={handleComplete}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirm Completion
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
