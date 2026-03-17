"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Clock,
  CheckCircle2,
  Info,
  RefreshCw,
} from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"
import { PaginationControls } from "@/components/ui/pagination-controls"

const LIMIT = 20

export default function FarmerPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState({ count: 0, pages: 1 })

  const fetchPayments = useCallback(async (p = 1) => {
    setIsLoading(true)
    try {
      const res = await apiClient.farmerMe.getPayments({ page: p, limit: LIMIT })
      setPayments(res.data ?? [])
      setMeta({ count: (res as any).count ?? 0, pages: (res as any).pages ?? 1 })
    } catch (err: any) {
      toast.error("Failed to load payments")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchPayments(page) }, [fetchPayments, page])

  const getAmount = (p: any) => Number(p.amount || p.net_amount || p.gross_amount || 0)
  const getType = (p: any) => p.payment_type || p.type || "payment"
  const isCredit = (p: any) => !["deduction", "fee", "repayment"].includes(getType(p).toLowerCase())
  const getDate = (p: any) => p.created_at || p.payment_date || p.settled_at

  const settled = payments.filter((p) => p.status === "settled" || p.status === "paid" || p.status === "completed")
  const pending = payments.filter((p) => p.status === "pending" || p.status === "processing" || p.status === "under_review")

  const totalSettled = settled.filter(isCredit).reduce((sum, p) => sum + getAmount(p), 0)
  const totalPending = pending.reduce((sum, p) => sum + getAmount(p), 0)
  const totalDeductions = payments.filter((p) => !isCredit(p)).reduce((sum, p) => sum + getAmount(p), 0)

  if (isLoading && payments.length === 0) {
    return (
      <DashboardLayout allowedRoles={["farmer"]}>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </DashboardLayout>
    )
  }

  const PaymentRow = ({ p }: { p: any }) => {
    const credit = isCredit(p)
    const amount = getAmount(p)
    const date = getDate(p)
    const isSettled = p.status === "settled" || p.status === "paid" || p.status === "completed"

    return (
      <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
        <div className="flex items-center gap-4">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${credit ? "bg-emerald-100" : "bg-red-100"}`}>
            {credit
              ? <ArrowUpRight className="h-5 w-5 text-emerald-600" />
              : <ArrowDownRight className="h-5 w-5 text-red-600" />}
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate capitalize">{getType(p).replace(/_/g, " ")}</p>
            {p.notes && <p className="text-xs text-muted-foreground italic mt-0.5">{p.notes}</p>}
            {date && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Calendar className="h-3 w-3" />
                {new Date(date).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className={`font-semibold ${credit ? "text-emerald-600" : "text-red-600"}`}>
            {credit ? "+" : "-"}₦{amount.toLocaleString()}
          </p>
          <Badge
            variant="outline"
            className={isSettled
              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
              : "bg-amber-100 text-amber-700 border-amber-200"}
          >
            {isSettled ? <CheckCircle2 className="mr-1 h-3 w-3 inline" /> : <Clock className="mr-1 h-3 w-3 inline" />}
            {p.status}
          </Badge>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout allowedRoles={["farmer"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settlements</h1>
            <p className="text-muted-foreground">Track your harvest settlements and service deductions</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => fetchPayments(page)} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
          <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">How settlements work</p>
            <p className="mt-1">
              AgroBridge coordinates services throughout your crop cycle. At harvest, your delivery value is calculated
              and service costs are deducted. The net amount is your settlement payout.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-bold truncate">₦{totalSettled.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Settled</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-bold truncate">₦{totalPending.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Pending Settlement</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-100">
                  <ArrowDownRight className="h-6 w-6 text-red-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-bold truncate">₦{totalDeductions.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Service Deductions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>All payment activities</CardDescription>
              </div>
              {pending.length > 0 && (
                <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
                  <Clock className="mr-1 h-3 w-3" />
                  {pending.length} Pending
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All ({payments.length})</TabsTrigger>
                <TabsTrigger value="earnings">Earnings</TabsTrigger>
                <TabsTrigger value="deductions">Deductions</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <div className="space-y-3">
                  {payments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">No transactions recorded.</div>
                  ) : (
                    payments.map((p) => <PaymentRow key={p.id} p={p} />)
                  )}
                </div>
              </TabsContent>

              <TabsContent value="earnings" className="mt-4">
                <div className="space-y-3">
                  {payments.filter(isCredit).length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">No earnings recorded.</div>
                  ) : (
                    payments.filter(isCredit).map((p) => <PaymentRow key={p.id} p={p} />)
                  )}
                </div>
              </TabsContent>

              <TabsContent value="deductions" className="mt-4">
                <div className="space-y-3">
                  {payments.filter((p) => !isCredit(p)).length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">No deductions recorded.</div>
                  ) : (
                    payments.filter((p) => !isCredit(p)).map((p) => <PaymentRow key={p.id} p={p} />)
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <PaginationControls
          page={page}
          pages={meta.pages}
          total={meta.count}
          limit={LIMIT}
          onPageChange={(p) => setPage(p)}
        />
      </div>
    </DashboardLayout>
  )
}
