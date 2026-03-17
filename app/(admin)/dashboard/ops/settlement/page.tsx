"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import {
  DollarSign,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Eye,
  CreditCard,
} from "lucide-react"

// Demo settlement data
const settlements = [
  {
    id: "SET-001",
    farmerId: "F-001",
    farmerName: "Aminu Yusuf",
    corridor: "Kano South",
    cropCycle: "Maize 2024",
    grossValue: 485000,
    deliveredTons: 4.85,
    pricePerTon: 100000,
    serviceDeductions: [
      { type: "Land Prep", amount: 25000 },
      { type: "Planting", amount: 15000 },
      { type: "Fertilizer (NPK)", amount: 45000 },
      { type: "Fertilizer (Urea)", amount: 30000 },
      { type: "Harvest", amount: 35000 },
    ],
    totalDeductions: 150000,
    netPayout: 335000,
    status: "pending",
    hectares: 2.5,
  },
  {
    id: "SET-002",
    farmerId: "F-002",
    farmerName: "Fatima Ibrahim",
    corridor: "Kano South",
    cropCycle: "Maize 2024",
    grossValue: 320000,
    deliveredTons: 3.2,
    pricePerTon: 100000,
    serviceDeductions: [
      { type: "Land Prep", amount: 18000 },
      { type: "Planting", amount: 12000 },
      { type: "Fertilizer (NPK)", amount: 35000 },
      { type: "Fertilizer (Urea)", amount: 22000 },
      { type: "Harvest", amount: 28000 },
    ],
    totalDeductions: 115000,
    netPayout: 205000,
    status: "approved",
    hectares: 1.8,
  },
  {
    id: "SET-003",
    farmerId: "F-003",
    farmerName: "Musa Abdullahi",
    corridor: "Kaduna North",
    cropCycle: "Rice 2024",
    grossValue: 720000,
    deliveredTons: 4.8,
    pricePerTon: 150000,
    serviceDeductions: [
      { type: "Land Prep", amount: 30000 },
      { type: "Transplanting", amount: 25000 },
      { type: "Fertilizer", amount: 55000 },
      { type: "Pest Control", amount: 20000 },
      { type: "Harvest", amount: 45000 },
    ],
    totalDeductions: 175000,
    netPayout: 545000,
    status: "disbursed",
    disbursedAt: "2024-06-10",
    hectares: 3.0,
  },
  {
    id: "SET-004",
    farmerId: "F-004",
    farmerName: "Aisha Mohammed",
    corridor: "Kaduna North",
    cropCycle: "Soybean 2024",
    grossValue: 280000,
    deliveredTons: 2.0,
    pricePerTon: 140000,
    serviceDeductions: [
      { type: "Land Prep", amount: 15000 },
      { type: "Planting", amount: 10000 },
      { type: "Fertilizer", amount: 25000 },
      { type: "Harvest", amount: 22000 },
    ],
    totalDeductions: 72000,
    netPayout: 208000,
    status: "approved",
    hectares: 1.5,
  },
]

// Summary stats
const summaryStats = {
  totalGrossValue: settlements.reduce((sum, s) => sum + s.grossValue, 0),
  totalDeductions: settlements.reduce((sum, s) => sum + s.totalDeductions, 0),
  totalNetPayout: settlements.reduce((sum, s) => sum + s.netPayout, 0),
  pendingCount: settlements.filter((s) => s.status === "pending").length,
  approvedCount: settlements.filter((s) => s.status === "approved").length,
  disbursedCount: settlements.filter((s) => s.status === "disbursed").length,
}

export default function SettlementPage() {
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSettlement, setSelectedSettlement] = useState<(typeof settlements)[0] | null>(null)
  const [loadingSettlements, setLoadingSettlements] = useState<Record<string, boolean>>({})
  const { toast } = useToast()

  const filteredSettlements = settlements.filter((s) => {
    const matchesFilter = filter === "all" || s.status === filter
    const matchesSearch =
      s.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.corridor.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleApprove = async (settlement: (typeof settlements)[0]) => {
    setLoadingSettlements((prev) => ({ ...prev, [settlement.id]: true }))
    try {
      const response = await fetch(`/api/settlements/${settlement.farmerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Settlement Approved",
          description: `Settlement ${settlement.id} for ${settlement.farmerName} has been approved for disbursement.`,
        })
        setSelectedSettlement(null)
      } else {
        throw new Error(data.error?.message || "Failed to approve settlement")
      }
    } catch (error) {
      console.error("[v0] Approve settlement error:", error)
      toast({
        title: "Error",
        description: "Failed to approve settlement. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingSettlements((prev) => ({ ...prev, [settlement.id]: false }))
    }
  }

  const handleDisburse = async (settlement: (typeof settlements)[0]) => {
    setLoadingSettlements((prev) => ({ ...prev, [`${settlement.id}-disburse`]: true }))
    try {
      const response = await fetch(`/api/settlements/${settlement.farmerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "disburse" }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Disbursement Initiated",
          description: `₦${settlement.netPayout.toLocaleString()} is being transferred to ${settlement.farmerName}.`,
        })
        setSelectedSettlement(null)
      } else {
        throw new Error(data.error?.message || "Failed to process disbursement")
      }
    } catch (error) {
      console.error("[v0] Disburse settlement error:", error)
      toast({
        title: "Error",
        description: "Failed to process disbursement. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingSettlements((prev) => ({ ...prev, [`${settlement.id}-disburse`]: false }))
    }
  }

  return (
    <DashboardLayout role="ops_admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Settlement & Payments</h1>
            <p className="text-muted-foreground">Pay-at-harvest reconciliation and farmer payouts</p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">₦{(summaryStats.totalGrossValue / 1000000).toFixed(2)}M</p>
                  <p className="text-sm text-muted-foreground">Gross Harvest Value</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <TrendingUp className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">₦{(summaryStats.totalDeductions / 1000).toFixed(0)}K</p>
                  <p className="text-sm text-muted-foreground">Total Deductions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">₦{(summaryStats.totalNetPayout / 1000000).toFixed(2)}M</p>
                  <p className="text-sm text-muted-foreground">Net Farmer Payout</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                  <Users className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{settlements.length}</p>
                  <p className="text-sm text-muted-foreground">
                    {summaryStats.pendingCount} pending, {summaryStats.disbursedCount} paid
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <TabsList>
              <TabsTrigger value="all">All ({settlements.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({summaryStats.pendingCount})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({summaryStats.approvedCount})</TabsTrigger>
              <TabsTrigger value="disbursed">Disbursed ({summaryStats.disbursedCount})</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search farmer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-[200px]"
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="disbursed">Disbursed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left py-3 px-4 font-medium">Farmer</th>
                        <th className="text-left py-3 px-4 font-medium">Corridor</th>
                        <th className="text-right py-3 px-4 font-medium">Delivered</th>
                        <th className="text-right py-3 px-4 font-medium">Gross Value</th>
                        <th className="text-right py-3 px-4 font-medium">Deductions</th>
                        <th className="text-right py-3 px-4 font-medium">Net Payout</th>
                        <th className="text-center py-3 px-4 font-medium">Status</th>
                        <th className="text-right py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSettlements.map((settlement) => (
                        <tr key={settlement.id} className="border-b last:border-0 hover:bg-muted/30">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{settlement.farmerName}</p>
                              <p className="text-xs text-muted-foreground">{settlement.cropCycle}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">{settlement.corridor}</td>
                          <td className="py-3 px-4 text-right">{settlement.deliveredTons} tons</td>
                          <td className="py-3 px-4 text-right font-medium">
                            ₦{settlement.grossValue.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right text-red-600">
                            -₦{settlement.totalDeductions.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-green-600">
                            ₦{settlement.netPayout.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Badge
                              variant={
                                settlement.status === "disbursed"
                                  ? "default"
                                  : settlement.status === "approved"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {settlement.status === "disbursed" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                              {settlement.status === "pending" && <Clock className="mr-1 h-3 w-3" />}
                              {settlement.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" onClick={() => setSelectedSettlement(settlement)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              {settlement.status === "pending" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleApprove(settlement)}
                                  disabled={loadingSettlements[settlement.id]}
                                >
                                  {loadingSettlements[settlement.id] ? "Approving..." : "Approve"}
                                </Button>
                              )}
                              {settlement.status === "approved" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleDisburse(settlement)}
                                  disabled={loadingSettlements[`${settlement.id}-disburse`]}
                                >
                                  {loadingSettlements[`${settlement.id}-disburse`] ? "Processing..." : "Disburse"}
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Pending Settlements
                </CardTitle>
                <CardDescription>Settlements awaiting approval</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {summaryStats.pendingCount} settlements pending approval
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved">
            <Card>
              <CardHeader>
                <CardTitle>Approved for Disbursement</CardTitle>
                <CardDescription>Ready to pay out to farmers</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {summaryStats.approvedCount} settlements ready for disbursement
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="disbursed">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Completed Disbursements
                </CardTitle>
                <CardDescription>Successfully paid to farmers</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{summaryStats.disbursedCount} settlements disbursed</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Settlement Detail Dialog */}
        <Dialog open={!!selectedSettlement} onOpenChange={() => setSelectedSettlement(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Settlement Details</DialogTitle>
              <DialogDescription>
                {selectedSettlement?.farmerName} - {selectedSettlement?.cropCycle}
              </DialogDescription>
            </DialogHeader>
            {selectedSettlement && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">Delivered</p>
                    <p className="font-bold">{selectedSettlement.deliveredTons} tons</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">Price/Ton</p>
                    <p className="font-bold">₦{selectedSettlement.pricePerTon.toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Gross Harvest Value</span>
                    <span className="font-bold">₦{selectedSettlement.grossValue.toLocaleString()}</span>
                  </div>

                  <p className="text-sm font-medium text-muted-foreground pt-2">Service Deductions</p>
                  {selectedSettlement.serviceDeductions.map((d, idx) => (
                    <div key={idx} className="flex justify-between text-sm py-1">
                      <span className="text-muted-foreground">{d.type}</span>
                      <span className="text-red-600">-₦{d.amount.toLocaleString()}</span>
                    </div>
                  ))}

                  <div className="flex justify-between py-2 border-t">
                    <span className="font-medium">Total Deductions</span>
                    <span className="font-bold text-red-600">
                      -₦{selectedSettlement.totalDeductions.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between py-3 border-t-2 bg-green-50 -mx-6 px-6">
                    <span className="font-bold">Net Farmer Payout</span>
                    <span className="font-bold text-xl text-green-600">
                      ₦{selectedSettlement.netPayout.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedSettlement(null)}>
                Close
              </Button>
              {selectedSettlement?.status === "pending" && (
                <Button
                  onClick={() => handleApprove(selectedSettlement)}
                  disabled={loadingSettlements[selectedSettlement.id]}
                >
                  {loadingSettlements[selectedSettlement.id] ? "Approving..." : "Approve Settlement"}
                </Button>
              )}
              {selectedSettlement?.status === "approved" && (
                <Button
                  onClick={() => handleDisburse(selectedSettlement)}
                  disabled={loadingSettlements[`${selectedSettlement.id}-disburse`]}
                >
                  {loadingSettlements[`${selectedSettlement.id}-disburse`] ? "Processing..." : "Process Disbursement"}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
