"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CropSelectItems } from "@/components/ui/crop-select-items"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Wheat,
  BarChart3,
  Truck,
  Banknote,
  ClipboardCheck,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Step Definitions ─────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Crop Details",     icon: Wheat,          key: "crop"     },
  { id: 2, label: "Demand Volume",    icon: BarChart3,       key: "demand"   },
  { id: 3, label: "Delivery",         icon: Truck,           key: "delivery" },
  { id: 4, label: "Pricing",          icon: Banknote,        key: "pricing"  },
  { id: 5, label: "Review",           icon: ClipboardCheck,  key: "review"   },
]

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  // Identity (pre-filled from user session)
  buyer_name: string
  company_name: string
  contact_email: string
  contact_phone: string

  // Step 1: Crop
  crop_type: string
  crop_grade: string
  intended_use: string

  // Step 2: Demand
  total_volume_mt: string
  delivery_frequency: string
  delivery_duration: string
  min_batch_size_mt: string

  // Step 3: Delivery
  delivery_state: string
  delivery_facility: string
  preferred_start_date: string
  delivery_flexibility: string
  flexibility_days: string
  offloading_notes: string

  // Step 4: Pricing
  target_price_min: string
  target_price_max: string
  payment_terms: string
  has_existing_suppliers: boolean
}

const EMPTY_FORM: FormData = {
  buyer_name: "",
  company_name: "",
  contact_email: "",
  contact_phone: "",
  crop_type: "",
  crop_grade: "",
  intended_use: "",
  total_volume_mt: "",
  delivery_frequency: "",
  delivery_duration: "",
  min_batch_size_mt: "",
  delivery_state: "",
  delivery_facility: "",
  preferred_start_date: "",
  delivery_flexibility: "flexible",
  flexibility_days: "",
  offloading_notes: "",
  target_price_min: "",
  target_price_max: "",
  payment_terms: "",
  has_existing_suppliers: false,
}

// ─── Step Validation ──────────────────────────────────────────────────────────

function validateStep(step: number, form: FormData): string[] {
  const errors: string[] = []
  if (step === 1) {
    if (!form.buyer_name.trim())    errors.push("Your name is required")
    if (!form.company_name.trim())  errors.push("Company name is required")
    if (!form.crop_type)            errors.push("Crop type is required")
    if (!form.intended_use)         errors.push("Intended use is required")
  }
  if (step === 2) {
    if (!form.total_volume_mt || Number(form.total_volume_mt) <= 0)
      errors.push("Total volume must be greater than 0")
    if (!form.delivery_frequency)   errors.push("Delivery frequency is required")
    if (!form.delivery_duration.trim()) errors.push("Delivery duration is required")
  }
  return errors
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface PlanningInterestFormProps {
  initialData?: Partial<FormData>
  editId?: string
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function PlanningInterestForm({ initialData, editId }: PlanningInterestFormProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>({ ...EMPTY_FORM, ...initialData })
  const [errors, setErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [refId, setRefId] = useState("")

  // Pre-fill buyer info from auth context
  useEffect(() => {
    if (user && !initialData) {
      setForm((prev) => ({
        ...prev,
        buyer_name:    prev.buyer_name    || user.name || "",
        company_name:  prev.company_name  || user.companyName || "",
        contact_email: prev.contact_email || user.email || "",
        contact_phone: prev.contact_phone || user.phone || "",
      }))
    }
  }, [user, initialData])

  function set(field: keyof FormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors([])
  }

  function goNext() {
    const stepErrors = validateStep(step, form)
    if (stepErrors.length > 0) {
      setErrors(stepErrors)
      return
    }
    setErrors([])
    setStep((s) => Math.min(s + 1, 5))
  }

  function goBack() {
    setErrors([])
    setStep((s) => Math.max(s - 1, 1))
  }

  async function handleSubmit(isDraft = false) {
    if (!isDraft) {
      // Run all step validations
      const allErrors: string[] = []
      for (let s = 1; s <= 4; s++) {
        allErrors.push(...validateStep(s, form))
      }
      if (allErrors.length > 0) {
        setErrors(allErrors)
        return
      }
    }

    setSubmitting(true)
    try {
      const payload = {
        user_id:               user?.id || null,
        buyer_name:            form.buyer_name,
        company_name:          form.company_name,
        contact_email:         form.contact_email || null,
        contact_phone:         form.contact_phone || null,
        crop_type:             form.crop_type,
        crop_grade:            form.crop_grade || null,
        intended_use:          form.intended_use,
        total_volume_mt:       Number(form.total_volume_mt) || 0,
        delivery_frequency:    form.delivery_frequency || "one_time",
        delivery_duration:     form.delivery_duration,
        min_batch_size_mt:     form.min_batch_size_mt ? Number(form.min_batch_size_mt) : null,
        delivery_state:        form.delivery_state || null,
        delivery_facility:     form.delivery_facility || null,
        preferred_start_date:  form.preferred_start_date || null,
        delivery_flexibility:  form.delivery_flexibility || null,
        flexibility_days:      form.flexibility_days ? Number(form.flexibility_days) : null,
        offloading_notes:      form.offloading_notes || null,
        target_price_min:      form.target_price_min ? Number(form.target_price_min) : null,
        target_price_max:      form.target_price_max ? Number(form.target_price_max) : null,
        payment_terms:         form.payment_terms || null,
        has_existing_suppliers: form.has_existing_suppliers,
        is_draft:              isDraft,
      }

      const method = editId ? "PATCH" : "POST"
      const url    = editId
        ? `/api/planning-interests/${editId}`
        : "/api/planning-interests"

      const res  = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        setErrors([data.error || "Submission failed. Please try again."])
        return
      }

      if (isDraft) {
        router.push("/dashboard/offtaker/planning-interests")
        return
      }

      setRefId(data.data.reference_id)
      setSubmitted(true)
    } catch {
      setErrors(["Network error. Please check your connection and try again."])
    } finally {
      setSubmitting(false)
    }
  }

  // ─── Success Screen ──────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center border-0 shadow-lg">
          <CardContent className="pt-10 pb-8 space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Interest Submitted</h2>
            <p className="text-muted-foreground text-sm">
              Your planning interest has been received. The AgroBridge operations team will review
              it and get back to you within 2 business days.
            </p>
            <div className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-full">
              <span className="text-xs text-muted-foreground">Reference</span>
              <span className="font-mono font-semibold text-foreground">{refId}</span>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <Button onClick={() => router.push("/dashboard/offtaker/planning-interests")}>
                View My Submissions
              </Button>
              <Button variant="ghost" onClick={() => { setSubmitted(false); setStep(1); setForm({ ...EMPTY_FORM }) }}>
                Submit Another
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ─── Step Indicator ──────────────────────────────────────────────────────────

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((s, i) => {
        const isComplete = step > s.id
        const isActive   = step === s.id
        const Icon       = s.icon
        return (
          <div key={s.id} className="flex items-center">
            <button
              type="button"
              onClick={() => isComplete && setStep(s.id)}
              className={cn(
                "flex flex-col items-center gap-1 group",
                isComplete && "cursor-pointer",
                !isComplete && !isActive && "cursor-default",
              )}
            >
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all",
                  isComplete && "bg-primary border-primary text-primary-foreground",
                  isActive   && "bg-background border-primary text-primary",
                  !isComplete && !isActive && "bg-background border-muted text-muted-foreground",
                )}
              >
                {isComplete
                  ? <CheckCircle2 className="w-4 h-4" />
                  : <Icon className="w-4 h-4" />
                }
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium hidden sm:block",
                  isActive   && "text-primary",
                  isComplete && "text-primary",
                  !isComplete && !isActive && "text-muted-foreground",
                )}
              >
                {s.label}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-8 sm:w-12 mx-1 transition-colors",
                  step > s.id ? "bg-primary" : "bg-muted",
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )

  // ─── Error Banner ────────────────────────────────────────────────────────────

  const ErrorBanner = () =>
    errors.length > 0 ? (
      <div className="bg-destructive/10 border border-destructive/30 rounded-md px-4 py-3 mb-4">
        {errors.map((e, i) => (
          <p key={i} className="text-sm text-destructive">{e}</p>
        ))}
      </div>
    ) : null

  // ─── Step 1: Crop Details ─────────────────────────────────────────────────────

  const Step1 = () => (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="buyer_name">Your Name <span className="text-destructive">*</span></Label>
          <Input
            id="buyer_name"
            value={form.buyer_name}
            onChange={(e) => set("buyer_name", e.target.value)}
            placeholder="Full name"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="company_name">Company / Organisation <span className="text-destructive">*</span></Label>
          <Input
            id="company_name"
            value={form.company_name}
            onChange={(e) => set("company_name", e.target.value)}
            placeholder="Company name"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact_email">Email</Label>
          <Input
            id="contact_email"
            type="email"
            value={form.contact_email}
            onChange={(e) => set("contact_email", e.target.value)}
            placeholder="you@company.com"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact_phone">Phone</Label>
          <Input
            id="contact_phone"
            type="tel"
            value={form.contact_phone}
            onChange={(e) => set("contact_phone", e.target.value)}
            placeholder="+234 or 080..."
          />
        </div>
      </div>

      <Separator />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Crop Type <span className="text-destructive">*</span></Label>
          <Select value={form.crop_type} onValueChange={(v) => set("crop_type", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select crop" />
            </SelectTrigger>
            <SelectContent>
              <CropSelectItems />
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="crop_grade">Grade / Specification</Label>
          <Input
            id="crop_grade"
            value={form.crop_grade}
            onChange={(e) => set("crop_grade", e.target.value)}
            placeholder="e.g. Grade A, 13% moisture"
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label>Intended Use <span className="text-destructive">*</span></Label>
          <Select value={form.intended_use} onValueChange={(v) => set("intended_use", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select use" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="processing">Processing / Manufacturing</SelectItem>
              <SelectItem value="export">Export</SelectItem>
              <SelectItem value="distribution">Local Distribution</SelectItem>
              <SelectItem value="animal_feed">Animal Feed</SelectItem>
              <SelectItem value="flour_milling">Flour Milling</SelectItem>
              <SelectItem value="retail">Retail / Wholesale</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )

  // ─── Step 2: Demand Volume ───────────────────────────────────────────────────

  const Step2 = () => (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="total_volume_mt">
            Total Volume Needed (MT) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="total_volume_mt"
            type="number"
            min="0"
            step="0.01"
            value={form.total_volume_mt}
            onChange={(e) => set("total_volume_mt", e.target.value)}
            placeholder="e.g. 500"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="min_batch_size_mt">Minimum Batch Size (MT)</Label>
          <Input
            id="min_batch_size_mt"
            type="number"
            min="0"
            step="0.01"
            value={form.min_batch_size_mt}
            onChange={(e) => set("min_batch_size_mt", e.target.value)}
            placeholder="e.g. 50"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Delivery Frequency <span className="text-destructive">*</span></Label>
          <Select value={form.delivery_frequency} onValueChange={(v) => set("delivery_frequency", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="one_time">One-time Purchase</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="delivery_duration">
            Duration / Season <span className="text-destructive">*</span>
          </Label>
          <Input
            id="delivery_duration"
            value={form.delivery_duration}
            onChange={(e) => set("delivery_duration", e.target.value)}
            placeholder="e.g. 6 months, Q1 2026"
          />
        </div>
      </div>
    </div>
  )

  // ─── Step 3: Delivery ────────────────────────────────────────────────────────

  const Step3 = () => (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="delivery_state">Delivery State</Label>
          <Input
            id="delivery_state"
            value={form.delivery_state}
            onChange={(e) => set("delivery_state", e.target.value)}
            placeholder="e.g. Lagos, Kano"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="preferred_start_date">Preferred Start Date</Label>
          <Input
            id="preferred_start_date"
            type="date"
            value={form.preferred_start_date}
            onChange={(e) => set("preferred_start_date", e.target.value)}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="delivery_facility">Facility Address / Warehouse</Label>
          <Input
            id="delivery_facility"
            value={form.delivery_facility}
            onChange={(e) => set("delivery_facility", e.target.value)}
            placeholder="Delivery warehouse or facility address"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Date Flexibility</Label>
          <Select value={form.delivery_flexibility} onValueChange={(v) => set("delivery_flexibility", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixed">Fixed date — no flexibility</SelectItem>
              <SelectItem value="flexible">Flexible window</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {form.delivery_flexibility === "flexible" && (
          <div className="space-y-1.5">
            <Label htmlFor="flexibility_days">Flexibility Window (days)</Label>
            <Input
              id="flexibility_days"
              type="number"
              min="1"
              value={form.flexibility_days}
              onChange={(e) => set("flexibility_days", e.target.value)}
              placeholder="e.g. 7"
            />
          </div>
        )}
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="offloading_notes">Offloading / Special Notes</Label>
          <Textarea
            id="offloading_notes"
            value={form.offloading_notes}
            onChange={(e) => set("offloading_notes", e.target.value)}
            placeholder="Any special requirements for offloading, packaging, or logistics"
            rows={3}
          />
        </div>
      </div>
    </div>
  )

  // ─── Step 4: Pricing ─────────────────────────────────────────────────────────

  const Step4 = () => (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Pricing information is optional but helps AgroBridge plan sourcing corridors more effectively.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="target_price_min">Target Price — Min (NGN/MT)</Label>
          <Input
            id="target_price_min"
            type="number"
            min="0"
            value={form.target_price_min}
            onChange={(e) => set("target_price_min", e.target.value)}
            placeholder="e.g. 250000"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="target_price_max">Target Price — Max (NGN/MT)</Label>
          <Input
            id="target_price_max"
            type="number"
            min="0"
            value={form.target_price_max}
            onChange={(e) => set("target_price_max", e.target.value)}
            placeholder="e.g. 350000"
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label>Payment Terms</Label>
          <Select value={form.payment_terms} onValueChange={(v) => set("payment_terms", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select payment terms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="advance">Full Advance Payment</SelectItem>
              <SelectItem value="on_delivery">Payment on Delivery</SelectItem>
              <SelectItem value="structured">Structured / Milestone Payments</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-3 sm:col-span-2 bg-muted/40 rounded-lg p-4">
          <input
            id="has_existing_suppliers"
            type="checkbox"
            className="w-4 h-4 rounded border accent-primary"
            checked={form.has_existing_suppliers}
            onChange={(e) => set("has_existing_suppliers", e.target.checked)}
          />
          <label htmlFor="has_existing_suppliers" className="text-sm text-foreground cursor-pointer">
            I currently have existing suppliers for this commodity
          </label>
        </div>
      </div>
    </div>
  )

  // ─── Step 5: Review ──────────────────────────────────────────────────────────

  const ReviewRow = ({ label, value }: { label: string; value?: string | null }) =>
    value ? (
      <div className="flex justify-between gap-4 py-1.5 border-b border-muted last:border-0">
        <span className="text-sm text-muted-foreground min-w-[140px]">{label}</span>
        <span className="text-sm text-foreground font-medium text-right">{value}</span>
      </div>
    ) : null

  const SectionTitle = ({ title }: { title: string }) => (
    <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mt-5 mb-2">{title}</h4>
  )

  const Step5 = () => (
    <div className="space-y-1">
      <SectionTitle title="Contact" />
      <ReviewRow label="Name"           value={form.buyer_name} />
      <ReviewRow label="Company"        value={form.company_name} />
      <ReviewRow label="Email"          value={form.contact_email} />
      <ReviewRow label="Phone"          value={form.contact_phone} />

      <SectionTitle title="Crop" />
      <ReviewRow label="Crop Type"      value={form.crop_type} />
      <ReviewRow label="Grade"          value={form.crop_grade} />
      <ReviewRow label="Intended Use"   value={form.intended_use} />

      <SectionTitle title="Demand" />
      <ReviewRow label="Total Volume"   value={form.total_volume_mt ? `${form.total_volume_mt} MT` : undefined} />
      <ReviewRow label="Min Batch"      value={form.min_batch_size_mt ? `${form.min_batch_size_mt} MT` : undefined} />
      <ReviewRow label="Frequency"      value={form.delivery_frequency} />
      <ReviewRow label="Duration"       value={form.delivery_duration} />

      <SectionTitle title="Delivery" />
      <ReviewRow label="State"          value={form.delivery_state} />
      <ReviewRow label="Facility"       value={form.delivery_facility} />
      <ReviewRow label="Start Date"     value={form.preferred_start_date} />
      <ReviewRow label="Flexibility"    value={form.delivery_flexibility} />
      <ReviewRow label="Notes"          value={form.offloading_notes} />

      <SectionTitle title="Pricing" />
      <ReviewRow
        label="Target Price"
        value={
          form.target_price_min || form.target_price_max
            ? `NGN ${form.target_price_min || "?"} – ${form.target_price_max || "?"} /MT`
            : undefined
        }
      />
      <ReviewRow label="Payment Terms"  value={form.payment_terms} />
      <ReviewRow
        label="Existing Suppliers"
        value={form.has_existing_suppliers ? "Yes" : "No"}
      />

      <div className="mt-6 bg-primary/5 border border-primary/20 rounded-lg p-4">
        <p className="text-sm text-foreground">
          By submitting, you confirm that the information above is accurate. The AgroBridge team
          will review your interest and contact you within 2 business days.
        </p>
      </div>
    </div>
  )

  // ─── Render ──────────────────────────────────────────────────────────────────

  const stepContent: Record<number, React.ReactNode> = {
    1: <Step1 />,
    2: <Step2 />,
    3: <Step3 />,
    4: <Step4 />,
    5: <Step5 />,
  }

  const stepTitles: Record<number, { title: string; description: string }> = {
    1: { title: "Crop Details",    description: "Tell us which commodity you need and how it will be used." },
    2: { title: "Demand & Volume", description: "Specify how much you need and how often." },
    3: { title: "Delivery",        description: "Where and when should we deliver?" },
    4: { title: "Pricing",         description: "Optional: share your target pricing to help us plan." },
    5: { title: "Review & Submit", description: "Confirm your details before submitting." },
  }

  return (
    <div className="max-w-2xl mx-auto">
      <StepIndicator />

      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{stepTitles[step].title}</CardTitle>
              <CardDescription className="mt-0.5">{stepTitles[step].description}</CardDescription>
            </div>
            <Badge variant="secondary" className="text-xs shrink-0 mt-0.5">
              Step {step} of {STEPS.length}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <ErrorBanner />
          {stepContent[step]}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-4 gap-3">
        <div className="flex gap-2">
          {step > 1 && (
            <Button variant="outline" onClick={goBack} disabled={submitting}>
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back
            </Button>
          )}
          <Button
            variant="ghost"
            className="text-muted-foreground"
            onClick={() => handleSubmit(true)}
            disabled={submitting}
          >
            Save Draft
          </Button>
        </div>

        {step < 5 ? (
          <Button onClick={goNext} disabled={submitting}>
            Continue
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        ) : (
          <Button onClick={() => handleSubmit(false)} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Interest"
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
