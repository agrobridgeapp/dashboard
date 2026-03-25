"use client"

import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import useSWR from "swr"
import { useState, useMemo } from "react"
import { Search, Wallet, Calendar, CheckCircle2, Clock, Filter, Banknote } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface Settlement {
  id: string
  reference_id: string
  supply_order_reference: string
  amount_ngn: number
  status: "pending" | "processing" | "paid" | "failed"
  payment_date: string | null
  created_at: string
  bank_name: string
  account_number: string
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700", icon: Clock },
  processing: { label: "Processing", color: "bg-blue-100 text-blue-700", icon: Clock },
  paid: { label: "Paid", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  failed: { label: "Failed", color: "bg-red-100 text-red-700", icon: Clock },
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount)
}

export default function SettlementsPage() {
  const { user } = useAuth()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const { data, isLoading } = useSWR<{ success: boolean; data: Settlement[] }>(
    user?.id ? `/api/aggregator/settlements?aggregator_id=${user.id}` : null,
    fetcher,
  )

  const settlements = data?.success ? data.data : []

  const filtered = useMemo(() => {
    return settlements.filter((s) => {
      const matchesSearch =
        !search ||
        s.reference_id.toLowerCase().includes(search.toLowerCase()) ||
        s.supply_order_reference.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === "all" || s.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [settlements, search, statusFilter])

  const totalPaid = settlements.filter((s) => s.status === "paid").reduce((sum, s) => sum + Number(s.amount_ngn), 0)
  const totalPending = settlements.filter((s) => s.status === "pending" || s.status === "processing").reduce((sum, s) => sum + Number(s.amount_ngn), 0)

  return (
    <DashboardLayout allowedRoles={["aggregator"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settlements</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track payments for your completed supply orders
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{settlements.length}</div>
              <p className="text-xs text-muted-foreground">Total Settlements</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-emerald-600">{formatCurrency(totalPaid)}</div>
              <p className="text-xs text-muted-foreground">Total Paid</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-amber-600">{formatCurrency(totalPending)}</div>
              <p className="text-xs text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{settlements.filter((s) => s.status === "paid").length}</div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by reference..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Settlements List */}
        <div className="space-y-3">
          {isLoading ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Loading settlements...
              </CardContent>
            </Card>
          ) : filtered.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Wallet className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">
                  {settlements.length === 0 ? "No settlements yet" : "No settlements match your filters"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete supply orders to receive payments
                </p>
              </CardContent>
            </Card>
          ) : (
            filtered.map((s) => {
              const config = statusConfig[s.status]
              const StatusIcon = config.icon
              return (
                <Card key={s.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{s.reference_id}</span>
                          <Badge variant="outline" className={config.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {config.label}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Banknote className="h-3.5 w-3.5" />
                            For: {s.supply_order_reference}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {s.payment_date
                              ? `Paid: ${new Date(s.payment_date).toLocaleDateString()}`
                              : `Created: ${new Date(s.created_at).toLocaleDateString()}`}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">{formatCurrency(Number(s.amount_ngn))}</div>
                        <div className="text-xs text-muted-foreground">{s.bank_name}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
