"use client"

import useSWR from "swr"
import { use } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Wheat } from "lucide-react"

const STATUS_STYLES: Record<string, string> = {
  new:                "bg-sky-50 text-sky-700 border-sky-200",
  under_review:       "bg-amber-50 text-amber-700 border-amber-200",
  corridor_activated: "bg-green-50 text-green-700 border-green-200",
  rejected:           "bg-red-50 text-red-700 border-red-200",
  duplicate:          "bg-gray-50 text-gray-500 border-gray-200",
}
const STATUS_LABELS: Record<string, string> = {
  new:                "New — Pending Review",
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
  advance:      "Full Advance Payment",
  on_delivery:  "Payment on Delivery",
  structured:   "Structured / Milestone",
}

function fmt(v?: string | null) { return v || "—" }
function fmtDate(iso?: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function PlanningInterestDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params.id
  const { data, isLoading } = useSWR(
    `/api/planning-interests/${id}`,
    fetcher,
  )
  const item = data?.data

  return (
    <DashboardLayout allowedRoles={["offtaker"]}>
      <div className="space-y-5 max-w-2xl">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="-ml-1">
            <Link href="/dashboard/offtaker/planning-interests">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Link>
          </Button>
        </div>

        {isLoading && (
          <Card>
            <CardContent className="p-6 space-y-3">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        )}

        {!isLoading && item && (
          <>
            {/* Header card */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-amber-100 flex items-center justify-center">
                      <Wheat className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{item.crop_type}</CardTitle>
                      <p className="text-xs text-muted-foreground font-mono">{item.reference_id}</p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${STATUS_STYLES[item.status] ?? ""}`}
                  >
                    {STATUS_LABELS[item.status] ?? item.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0 text-sm space-y-1 text-muted-foreground">
                <p>Submitted by <span className="text-foreground font-medium">{item.buyer_name}</span> — {item.company_name}</p>
                <p>Submitted on {fmtDate(item.created_at)}</p>
              </CardContent>
            </Card>

            {/* Detail sections */}
            <DetailSection title="Crop Details">
              <Row label="Crop Type"    value={fmt(item.crop_type)} />
              <Row label="Grade"        value={fmt(item.crop_grade)} />
              <Row label="Intended Use" value={fmt(item.intended_use)} />
            </DetailSection>

            <DetailSection title="Demand & Volume">
              <Row label="Total Volume"       value={item.total_volume_mt ? `${item.total_volume_mt} MT` : "—"} />
              <Row label="Min Batch Size"     value={item.min_batch_size_mt ? `${item.min_batch_size_mt} MT` : "—"} />
              <Row label="Delivery Frequency" value={FREQ_LABELS[item.delivery_frequency] ?? fmt(item.delivery_frequency)} />
              <Row label="Duration"           value={fmt(item.delivery_duration)} />
            </DetailSection>

            <DetailSection title="Delivery">
              <Row label="Delivery State"     value={fmt(item.delivery_state)} />
              <Row label="Facility"           value={fmt(item.delivery_facility)} />
              <Row label="Start Date"         value={fmtDate(item.preferred_start_date)} />
              <Row label="Flexibility"        value={item.delivery_flexibility === "fixed" ? "Fixed date" : item.flexibility_days ? `Flexible ±${item.flexibility_days} days` : "Flexible"} />
              <Row label="Offloading Notes"   value={fmt(item.offloading_notes)} />
            </DetailSection>

            <DetailSection title="Pricing">
              <Row
                label="Target Price"
                value={
                  item.target_price_min || item.target_price_max
                    ? `NGN ${item.target_price_min ?? "?"} – ${item.target_price_max ?? "?"} /MT`
                    : "Not specified"
                }
              />
              <Row label="Payment Terms"       value={PAYMENT_LABELS[item.payment_terms] ?? fmt(item.payment_terms)} />
              <Row label="Existing Suppliers"  value={item.has_existing_suppliers ? "Yes" : "No"} />
            </DetailSection>

            {/* Ops notes (visible when set) */}
            {item.ops_notes && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">AgroBridge Notes</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 text-sm text-muted-foreground whitespace-pre-wrap">
                  {item.ops_notes}
                </CardContent>
              </Card>
            )}
          </>
        )}

        {!isLoading && !item && (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground text-sm">
              Planning interest not found.
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 divide-y divide-muted">{children}</CardContent>
    </Card>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-medium text-right">{value}</span>
    </div>
  )
}
