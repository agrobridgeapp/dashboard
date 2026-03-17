"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle } from "lucide-react"

interface EscalationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  context: {
    type: "delivery" | "farmer" | "contract" | "quality"
    entityName: string
    entityId: string
    details: string
  }
}

export function EscalationDialog({ open, onOpenChange, context }: EscalationDialogProps) {
  const [escalationLevel, setEscalationLevel] = useState<string>("")
  const [issueCategory, setIssueCategory] = useState<string>("")
  const [priority, setPriority] = useState<string>("medium")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSuccess(true)

    setTimeout(() => {
      setIsSuccess(false)
      setEscalationLevel("")
      setIssueCategory("")
      setPriority("medium")
      setDescription("")
      onOpenChange(false)
    }, 2000)
  }

  const isFormValid = escalationLevel && issueCategory && description.trim().length >= 20

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        {!isSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle>Escalate Issue</DialogTitle>
              <DialogDescription>
                Submit this issue to AgroBridge support team. All communications remain within the platform for your
                protection.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Context Information */}
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-muted-foreground">Context</Label>
                  <Badge variant="outline">{context.type}</Badge>
                </div>
                <p className="font-medium">{context.entityName}</p>
                <p className="text-sm text-muted-foreground">{context.details}</p>
              </div>

              {/* Escalation Level */}
              <div className="space-y-2">
                <Label htmlFor="escalation-level">
                  Escalate To <span className="text-destructive">*</span>
                </Label>
                <Select value={escalationLevel} onValueChange={setEscalationLevel}>
                  <SelectTrigger id="escalation-level">
                    <SelectValue placeholder="Select escalation level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="field_agent">Field Agent (Local Support)</SelectItem>
                    <SelectItem value="state_coordinator">State Coordinator (Regional Oversight)</SelectItem>
                    <SelectItem value="regional_manager">Regional Operations Manager (Executive Level)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {escalationLevel === "field_agent" && "For on-ground issues requiring immediate local attention"}
                  {escalationLevel === "state_coordinator" && "For state-level coordination and dispute resolution"}
                  {escalationLevel === "regional_manager" && "For complex issues requiring executive intervention"}
                </p>
              </div>

              {/* Issue Category */}
              <div className="space-y-2">
                <Label htmlFor="issue-category">
                  Issue Category <span className="text-destructive">*</span>
                </Label>
                <Select value={issueCategory} onValueChange={setIssueCategory}>
                  <SelectTrigger id="issue-category">
                    <SelectValue placeholder="Select issue category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delivery_delay">Delivery Delay</SelectItem>
                    <SelectItem value="quality_concern">Quality Concern</SelectItem>
                    <SelectItem value="quantity_mismatch">Quantity Mismatch</SelectItem>
                    <SelectItem value="communication_breakdown">Communication Breakdown</SelectItem>
                    <SelectItem value="contract_dispute">Contract Dispute</SelectItem>
                    <SelectItem value="payment_issue">Payment Issue</SelectItem>
                    <SelectItem value="logistics_problem">Logistics Problem</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Priority Level */}
              <div className="space-y-2">
                <Label htmlFor="priority">Priority Level</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Can wait 2-3 days</SelectItem>
                    <SelectItem value="medium">Medium - Needs response within 24 hours</SelectItem>
                    <SelectItem value="high">High - Urgent, same-day response needed</SelectItem>
                    <SelectItem value="critical">Critical - Immediate attention required</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Issue Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Issue Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide detailed information about the issue, including what happened, when it occurred, and what resolution you're seeking..."
                  rows={5}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {description.length}/500 characters (minimum 20 required)
                </p>
              </div>

              {/* Protection Notice */}
              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
                <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">AgroBridge Platform Protection</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    All escalations are logged and monitored. Direct contact information remains protected. Our team
                    will mediate communication and work toward resolution while maintaining platform integrity.
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!isFormValid || isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Escalation"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold">Escalation Submitted</h3>
              <p className="text-muted-foreground max-w-md">
                Your issue has been escalated to the {escalationLevel?.replace("_", " ")} team. You'll receive a
                response within the priority timeframe.
              </p>
              <p className="text-sm text-muted-foreground">Ticket ID: ESC-{Date.now().toString().slice(-6)}</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
