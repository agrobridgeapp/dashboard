"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Tractor, Package, User, Calendar, AlertTriangle } from "lucide-react"

interface Farmer {
  id: string
  name: string
  farmSize: string
  location: string
  phone: string
}

interface AgentServiceRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  farmer: Farmer | null
}

export function AgentServiceRequestDialog({ open, onOpenChange, farmer }: AgentServiceRequestDialogProps) {
  const [step, setStep] = useState<"form" | "approval-pending" | "success">("form")
  const [serviceCategory, setServiceCategory] = useState("")
  const [serviceType, setServiceType] = useState("")
  const [approvalLevel, setApprovalLevel] = useState<"field" | "coordinator" | "manager" | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    // Determine approval level based on service value
    const estimatedCost = Number.parseFloat(formData.get("estimated_cost") as string)
    let approval: "field" | "coordinator" | "manager" = "field"

    if (estimatedCost > 100000) {
      approval = "manager"
    } else if (estimatedCost > 50000) {
      approval = "coordinator"
    }

    setApprovalLevel(approval)
    setStep("approval-pending")

    // Simulate auto-approval after 2 seconds for demo
    setTimeout(() => {
      setStep("success")
    }, 2000)
  }

  const handleClose = () => {
    setStep("form")
    setServiceCategory("")
    setServiceType("")
    setApprovalLevel(null)
    onOpenChange(false)
  }

  const getApprovalInfo = () => {
    switch (approvalLevel) {
      case "manager":
        return {
          title: "Regional Operations Manager",
          time: "within 24 hours",
          reason: "High-value request (>₦100,000)",
          icon: AlertCircle,
          color: "text-red-600",
        }
      case "coordinator":
        return {
          title: "State Coordinator",
          time: "within 12 hours",
          reason: "Medium-value request (>₦50,000)",
          icon: AlertTriangle,
          color: "text-amber-600",
        }
      default:
        return {
          title: "Field Supervisor",
          time: "within 4 hours",
          reason: "Standard request",
          icon: CheckCircle,
          color: "text-emerald-600",
        }
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {step === "form" && (
          <>
            <DialogHeader>
              <DialogTitle>Request Service for Farmer</DialogTitle>
              <DialogDescription>Submit a service request on behalf of {farmer?.name}</DialogDescription>
            </DialogHeader>

            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm text-blue-900">
                All service requests require approval based on value. You'll be notified once approved.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Farmer Information */}
              <div className="p-4 rounded-lg border bg-muted/50">
                <div className="flex items-center gap-3 mb-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Farmer Details</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <p className="font-medium">{farmer?.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Farm Size:</span>
                    <p className="font-medium">{farmer?.farmSize}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Location:</span>
                    <p className="font-medium">{farmer?.location}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">ID:</span>
                    <p className="font-medium">{farmer?.id}</p>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Service Category *</Label>
                  <Select name="category" value={serviceCategory} onValueChange={setServiceCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mechanization">
                        <div className="flex items-center gap-2">
                          <Tractor className="h-4 w-4" />
                          Mechanization Services
                        </div>
                      </SelectItem>
                      <SelectItem value="inputs">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          Farm Inputs
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service">Service Type *</Label>
                  <Select name="service" value={serviceType} onValueChange={setServiceType} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceCategory === "mechanization" ? (
                        <>
                          <SelectItem value="plowing">Plowing</SelectItem>
                          <SelectItem value="harrowing">Harrowing</SelectItem>
                          <SelectItem value="planting">Planting</SelectItem>
                          <SelectItem value="harvesting">Harvesting</SelectItem>
                        </>
                      ) : serviceCategory === "inputs" ? (
                        <>
                          <SelectItem value="seeds">Seeds</SelectItem>
                          <SelectItem value="fertilizer">Fertilizer</SelectItem>
                          <SelectItem value="herbicides">Herbicides</SelectItem>
                          <SelectItem value="pesticides">Pesticides</SelectItem>
                        </>
                      ) : (
                        <SelectItem value="" disabled>
                          Select category first
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="estimated_cost">Estimated Cost (₦) *</Label>
                    <Input
                      id="estimated_cost"
                      name="estimated_cost"
                      type="number"
                      placeholder="50000"
                      required
                      min="1"
                    />
                    <p className="text-xs text-muted-foreground">Determines approval level</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferred_date">Preferred Date *</Label>
                    <Input id="preferred_date" name="preferred_date" type="date" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Request Details & Justification *</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Explain why the farmer needs this service and any special requirements..."
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="urgency">Urgency Level *</Label>
                  <Select name="urgency" defaultValue="normal">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Can wait 1-2 weeks</SelectItem>
                      <SelectItem value="normal">Normal - Within 1 week</SelectItem>
                      <SelectItem value="high">High - Within 3 days</SelectItem>
                      <SelectItem value="urgent">Urgent - Immediate attention needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Approval Info */}
              <div className="p-4 rounded-lg border bg-amber-50 border-amber-200">
                <p className="text-sm text-amber-900">
                  <strong>Approval Process:</strong> Based on cost, this request will be routed to the appropriate
                  authority:
                </p>
                <ul className="text-xs text-amber-800 mt-2 space-y-1 ml-4 list-disc">
                  <li>Under ₦50,000: Field Supervisor (4 hours)</li>
                  <li>₦50,000 - ₦100,000: State Coordinator (12 hours)</li>
                  <li>Over ₦100,000: Regional Operations Manager (24 hours)</li>
                </ul>
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Submit Request
                </Button>
              </div>
            </form>
          </>
        )}

        {step === "approval-pending" && (
          <>
            <DialogHeader>
              <DialogTitle>Request Submitted for Approval</DialogTitle>
              <DialogDescription>Your service request is being reviewed</DialogDescription>
            </DialogHeader>

            <div className="py-6 space-y-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-amber-600 animate-pulse" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Pending Approval</h3>
                <p className="text-sm text-muted-foreground">
                  Request for {farmer?.name} is being reviewed by {getApprovalInfo().title}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg border bg-muted/50">
                  {(() => {
                    const Icon = getApprovalInfo().icon
                    return <Icon className={`h-5 w-5 mt-0.5 ${getApprovalInfo().color}`} />
                  })()}
                  <div>
                    <p className="text-sm font-medium">Requires {getApprovalInfo().title} Approval</p>
                    <p className="text-xs text-muted-foreground mt-1">{getApprovalInfo().reason}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg border">
                  <Calendar className="h-5 w-5 mt-0.5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Expected Response Time</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      You'll receive a notification {getApprovalInfo().time}
                    </p>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    You can track this request in your Tasks dashboard. The farmer will be notified once approved.
                  </AlertDescription>
                </Alert>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleClose} className="flex-1">
                Done
              </Button>
            </div>
          </>
        )}

        {step === "success" && (
          <>
            <DialogHeader>
              <DialogTitle>Request Approved!</DialogTitle>
              <DialogDescription>Service request has been approved and assigned</DialogDescription>
            </DialogHeader>

            <div className="py-6 space-y-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Approved & Assigned</h3>
                <p className="text-sm text-muted-foreground">
                  The service request for {farmer?.name} has been approved and a partner will be assigned shortly
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-lg border bg-emerald-50 border-emerald-200">
                  <p className="text-sm font-medium text-emerald-900">Next Steps:</p>
                  <ul className="text-xs text-emerald-800 mt-2 space-y-1 ml-4 list-disc">
                    <li>Partner will be assigned within 2 hours</li>
                    <li>Farmer will receive SMS notification</li>
                    <li>You can track progress in Services tab</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleClose} className="flex-1">
                Done
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
