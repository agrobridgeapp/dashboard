"use client"

import useSWR, { mutate } from "swr"
import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Wheat,
  Package,
  Truck,
  Calendar,
  Building2,
  Search,
  ChevronRight,
  Loader2,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface PlanningInterest {
  id: string
  reference_id: string
  buyer_name: string
  company_name: string
  contact_email: string | null
  contact_phone: string | null
  crop_type: string
  crop_grade: string | null
  intended_use: string
  total_volume_mt: number
  delivery_frequency: string
  delivery_duration: string
  min_batch_size_mt: number | null
  delivery_state: string | null
  delivery_facility: string | null
  preferred_start_date: string | null
  delivery_flexibility: string | null
  flexibility_days: number | null
  offloading_notes: string | null
  target_price_min: number | null
  target_price_max: number | null
  payment_terms: string | null
  has_existing_suppliers: boolean
  status: string
  ops_notes: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  is_draft: boolean
  created_at: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  new:                "bg-sky-50 text-sky-700 border-sky-200",
  under_review:       "bg-amber-50 text-amber-700 border-amber-200",
  corridor_activated: "bg-green-50 text-green-700 border-green-200",
  rejected:           "bg-red-50 text-red-700 border-red-200",
  duplicate:          "bg-gray-50 text-gray-500 border-gray-200",
}
const STATUS_LABELS: Record<string, string> = {
  new:                "New",
  under_review:       "Under Review",
  corridor_activated: "Corridor Activated",
  rejected:           "Rejected",
  duplicate:          "Duplicate",
}
const FREQ_LABELS: Record<string, string> = {
  one_time: "One-time",
  weekly:   "Weekly",
  monthly:  "Monthly",
}
const PAYMENT_LABELS: Record<string, string> = {
  advance:     "Full Advance",
  on_delivery: "On Delivery",
  structured:  "Structured",
}

function fmtDate(iso?: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })
}
function fmt(v?: string | null) { return v || "—" }

const fetcher = (url: string) => fetch(url).then((r) => r.json())

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OpsPlannningInterestsPage() {
  const [statusFilter, setStatusFilter] = useState("new")
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<PlanningInterest | null>(null)
  const [reviewStatus, setReviewStatus] = useState("")
  const [reviewNotes, setReviewNotes] = useState("")
  const [reviewing, setReviewing] = useState(false)
  const [reviewError, setReviewError] = useState("")

  const queryParams = new URLSearchParams()
  if (statusFilter !== "all") queryParams.set("status", statusFilter)
  if (search) queryParams.set("search", search)

  const apiUrl = `/api/planning-interests?${queryParams.toString()}`
  const { data, isLoading } = useSWR<{ success: boolean; data: PlanningInterest[] }>(
    apiUrl,
    fetcher,
    { refreshInterval: 30000 },
  )
  const items = (data?.data ?? []).filter((i) => !i.is_draft)

  async function handleReview() {
    if (!selected || !reviewStatus) {
      setReviewError("Please select a status.")
      return
    }
    setReviewing(true)
    setReviewError("")
    try {
      const res = await fetch(`/api/planning-interests/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "review",
          status: reviewStatus,
          ops_notes: reviewNotes || null,
        }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        setReviewError(json.error || "Update failed")
        return
      }
      mutate(apiUrl)
      setSelected(null)
      setReviewStatus("")
      setReviewNotes("")
    } catch {
      setReviewError("Network error. Please try again.")
    } finally {
      setReviewing(false)
    }
  }

  return (
    <DashboardLayout role="ops_admin" allowedRoles={["ops_admin", "super_admin"]}>
      <div className="space-y-5">

        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Planning Interests</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Buyer demand signals submitted for supply corridor planning.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search buyer, company, reference..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="corridor_activated">Corridor Activated</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="duplicate">Duplicate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loading skeletons */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && items.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center text-muted-foreground text-sm">
              No planning interests match the current filters.
            </CardContent>
          </Card>
        )}

        {/* List */}
        {!isLoading && items.length > 0 && (
          <div className="space-y-3">
            {items.map((item) => (
              <Card
                key={item.id}
                className="border hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => {
                  setSelected(item)
                  setReviewStatus(item.status)
                  setReviewNotes(item.ops_notes ?? "")
                  setReviewError("")
                }}
              >
                <CardHeader className="pb-2 pt-4 px-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-md bg-amber-100 flex items-center justify-center shrink-0">
                        <Wheat className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold">
                          {item.crop_type}
                          <span className="ml-2 font-mono font-normal text-muted-foreground text-xs">
                            {item.reference_id}
                          </span>
                        </CardTitle>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {item.company_name} — {item.buyer_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline" className={`text-xs ${STATUS_STYLES[item.status] ?? ""}`}>
                        {STATUS_LABELS[item.status] ?? item.status}
                      </Badge>
                      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 pb-4 px-5">
                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Package className="w-3.5 h-3.5" />
                      {item.total_volume_mt} MT
                    </span>
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" />
                      {FREQ_LABELS[item.delivery_frequency] ?? item.delivery_frequency}
                      {" · "}{item.delivery_duration}
                    </span>
                    {item.delivery_state && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {item.delivery_state}
                        {item.preferred_start_date && ` — ${fmtDate(item.preferred_start_date)}`}
                      </span>
                    )}
                    <span className="text-muted-foreground/60">
                      Submitted {fmtDate(item.created_at)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Review Dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wheat className="w-5 h-5 text-amber-600" />
              {selected?.crop_type} — {selected?.reference_id}
            </DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-5">
              {/* Buyer info */}
              <Section title="Buyer">
                <Row label="Name"    value={fmt(selected.buyer_name)} />
                <Row label="Company" value={fmt(selected.company_name)} />
                <Row label="Email"   value={fmt(selected.contact_email)} />
                <Row label="Phone"   value={fmt(selected.contact_phone)} />
              </Section>

              <Section title="Crop & Demand">
                <Row label="Crop"           value={fmt(selected.crop_type)} />
                <Row label="Grade"          value={fmt(selected.crop_grade)} />
                <Row label="Intended Use"   value={fmt(selected.intended_use)} />
                <Row label="Total Volume"   value={`${selected.total_volume_mt} MT`} />
                <Row label="Min Batch"      value={selected.min_batch_size_mt ? `${selected.min_batch_size_mt} MT` : "—"} />
                <Row label="Frequency"      value={FREQ_LABELS[selected.delivery_frequency] ?? selected.delivery_frequency} />
                <Row label="Duration"       value={fmt(selected.delivery_duration)} />
              </Section>

              <Section title="Delivery">
                <Row label="State"       value={fmt(selected.delivery_state)} />
                <Row label="Facility"    value={fmt(selected.delivery_facility)} />
                <Row label="Start Date"  value={fmtDate(selected.preferred_start_date)} />
                <Row label="Flexibility" value={
                  selected.delivery_flexibility === "fixed"
                    ? "Fixed"
                    : selected.flexibility_days
                      ? `Flexible ±${selected.flexibility_days} days`
                      : "Flexible"
                } />
                {selected.offloading_notes && (
                  <Row label="Notes" value={selected.offloading_notes} />
                )}
              </Section>

              <Section title="Pricing">
                <Row
                  label="Target Price"
                  value={
                    selected.target_price_min || selected.target_price_max
                      ? `NGN ${selected.target_price_min ?? "?"} – ${selected.target_price_max ?? "?"} /MT`
                      : "Not specified"
                  }
                />
                <Row label="Payment Terms"      value={PAYMENT_LABELS[selected.payment_terms ?? ""] ?? fmt(selected.payment_terms)} />
                <Row label="Existing Suppliers" value={selected.has_existing_suppliers ? "Yes" : "No"} />
              </Section>

              {/* Review form */}
              <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
                <h4 className="text-sm font-semibold">Ops Review</h4>
                <div className="space-y-1.5">
                  <Label>Update Status</Label>
                  <Select value={reviewStatus} onValueChange={setReviewStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="corridor_activated">Corridor Activated</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="duplicate">Duplicate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Ops Notes</Label>
                  <Textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Internal notes or message to buyer..."
                    rows={3}
                  />
                </div>
                {reviewError && (
                  <p className="text-sm text-destructive">{reviewError}</p>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSelected(null)}>
              Cancel
            </Button>
            <Button onClick={handleReview} disabled={reviewing}>
              {reviewing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Review"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">{title}</p>
      <div className="divide-y divide-muted rounded-md border overflow-hidden">
        {children}
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 px-3 py-2 text-sm bg-background">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-medium text-right max-w-[60%]">{value}</span>
    </div>
  )
}
