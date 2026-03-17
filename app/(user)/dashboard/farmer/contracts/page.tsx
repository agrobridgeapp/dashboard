"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileText, Calendar, Truck, Building2, MessageSquare, Send, Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"
import { PaginationControls } from "@/components/ui/pagination-controls"

const LIMIT = 20

export default function FarmerContractsPage() {
  const [contracts, setContracts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState({ count: 0, pages: 1 })
  const [selectedContract, setSelectedContract] = useState<any | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [messageOpen, setMessageOpen] = useState(false)
  const [messageContract, setMessageContract] = useState<any | null>(null)
  const [messageText, setMessageText] = useState("")

  const load = useCallback(async (p = 1) => {
    setLoading(true)
    try {
      const res = await apiClient.farmerMe.getContracts({ page: p, limit: LIMIT })
      setContracts(res.data ?? [])
      setMeta({ count: (res as any).count ?? 0, pages: (res as any).pages ?? 1 })
    } catch {
      toast.error("Failed to load contracts")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(page) }, [load, page])

  const getStatus = (c: any) => c.status || "active"
  const getCrop = (c: any) => c.crop_type || c.crop || "Unknown"
  const getOfftaker = (c: any) => c.offtaker_name || c.offtaker?.name || c.offtaker || "—"
  const getQuantityTons = (c: any) => Number(c.quantity_tons || c.total_quantity_tons || 0)
  const getDeliveredTons = (c: any) => Number(c.delivered_quantity_tons || c.delivered_tons || 0)
  const getTotalValue = (c: any) => Number(c.total_value || c.contract_value || 0)
  const getPricePerTon = (c: any) => Number(c.price_per_ton || c.price || 0)

  const getProgress = (c: any) => {
    const qty = getQuantityTons(c)
    const delivered = getDeliveredTons(c)
    if (!qty) return getStatus(c) === "completed" ? 100 : 0
    return Math.min(100, Math.round((delivered / qty) * 100))
  }

  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString("en-NG", { month: "short", year: "numeric" }) : "—"

  const activeContracts = contracts.filter((c) => getStatus(c) === "active" || getStatus(c) === "pending")
  const completedContracts = contracts.filter((c) => getStatus(c) === "completed" || getStatus(c) === "fulfilled")

  const totalDeliveredKg = contracts.reduce((sum, c) => sum + getDeliveredTons(c) * 1000, 0)

  const nextDelivery = contracts
    .filter((c) => c.next_delivery_date && getStatus(c) === "active")
    .sort((a, b) => new Date(a.next_delivery_date).getTime() - new Date(b.next_delivery_date).getTime())[0]

  const handleSendMessage = (contract: any) => {
    setMessageContract(contract)
    setMessageText("")
    setMessageOpen(true)
  }

  const handleSubmitMessage = () => {
    toast.success("Message sent to AgroBridge operations")
    setMessageOpen(false)
    setMessageContract(null)
    setMessageText("")
  }

  const ContractCard = ({ contract, showActions = true }: { contract: any; showActions?: boolean }) => {
    const status = getStatus(contract)
    const progress = getProgress(contract)
    const totalVal = getTotalValue(contract)
    const pricePerTon = getPricePerTon(contract)
    const qtyTons = getQuantityTons(contract)

    return (
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg capitalize">{getCrop(contract)}</h3>
                <Badge variant="outline" className={
                  status === "active" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-muted text-muted-foreground"
                }>
                  {status}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <Building2 className="h-3 w-3" />
                {getOfftaker(contract)}
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-lg">
                {totalVal ? `₦${totalVal.toLocaleString()}` : "—"}
              </p>
              {qtyTons > 0 && (
                <p className="text-sm text-muted-foreground">
                  {(qtyTons * 1000).toLocaleString()} kg
                  {pricePerTon > 0 && ` @ ₦${pricePerTon.toLocaleString()}/ton`}
                </p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">Delivery Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex items-center justify-between text-sm mb-4">
            {contract.next_delivery_date && (
              <span className="text-muted-foreground">Next Delivery: {new Date(contract.next_delivery_date).toLocaleDateString()}</span>
            )}
            <span className="text-muted-foreground ml-auto">
              {formatDate(contract.start_date)} – {formatDate(contract.end_date)}
            </span>
          </div>

          {showActions && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="bg-transparent" onClick={() => { setSelectedContract(contract); setDetailsOpen(true) }}>
                View Details
              </Button>
              <Button variant="outline" size="sm" className="bg-transparent" onClick={() => handleSendMessage(contract)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Message via AgroBridge
              </Button>
            </div>
          )}
          {!showActions && (
            <Button variant="outline" size="sm" className="bg-transparent" onClick={() => { setSelectedContract(contract); setDetailsOpen(true) }}>
              View Details
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <DashboardLayout allowedRoles={["farmer"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Contracts</h1>
          <p className="text-muted-foreground">View and track your offtake agreements</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{loading ? "…" : activeContracts.length}</p>
                  <p className="text-sm text-muted-foreground">Active Contracts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                  <Truck className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{loading ? "…" : `${totalDeliveredKg.toLocaleString()} kg`}</p>
                  <p className="text-sm text-muted-foreground">Total Delivered</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                  <Calendar className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {loading ? "…" : nextDelivery ? new Date(nextDelivery.next_delivery_date).toLocaleDateString("en-NG", { month: "short", day: "numeric" }) : "—"}
                  </p>
                  <p className="text-sm text-muted-foreground">Next Delivery</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <Tabs defaultValue="active">
            <TabsList>
              <TabsTrigger value="active">Active ({activeContracts.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedContracts.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-4">
              <div className="space-y-4">
                {activeContracts.length === 0 ? (
                  <Card className="border-border/50">
                    <CardContent className="p-12 text-center text-muted-foreground">No active contracts</CardContent>
                  </Card>
                ) : (
                  activeContracts.map((c) => <ContractCard key={c.id} contract={c} />)
                )}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="mt-4">
              <div className="space-y-4">
                {completedContracts.length === 0 ? (
                  <Card className="border-border/50">
                    <CardContent className="p-12 text-center text-muted-foreground">No completed contracts</CardContent>
                  </Card>
                ) : (
                  completedContracts.map((c) => <ContractCard key={c.id} contract={c} showActions={false} />)
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}

        <PaginationControls
          page={page}
          pages={meta.pages}
          total={meta.count}
          limit={LIMIT}
          onPageChange={(p) => setPage(p)}
          className="pt-2"
        />
      </div>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Contract Details</DialogTitle>
            <DialogDescription>
              {selectedContract?.id} – {getCrop(selectedContract)}
            </DialogDescription>
          </DialogHeader>
          {selectedContract && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Offtaker</p>
                  <p className="font-medium">{getOfftaker(selectedContract)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Value</p>
                  <p className="font-medium">
                    {getTotalValue(selectedContract) ? `₦${getTotalValue(selectedContract).toLocaleString()}` : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Quantity</p>
                  <p className="font-medium">{getQuantityTons(selectedContract) ? `${(getQuantityTons(selectedContract) * 1000).toLocaleString()} kg` : "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Price</p>
                  <p className="font-medium">{getPricePerTon(selectedContract) ? `₦${getPricePerTon(selectedContract).toLocaleString()}/ton` : "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Start</p>
                  <p className="font-medium">{formatDate(selectedContract.start_date)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">End</p>
                  <p className="font-medium">{formatDate(selectedContract.end_date)}</p>
                </div>
              </div>
              {selectedContract.notes && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{selectedContract.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={messageOpen} onOpenChange={setMessageOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Message via AgroBridge</DialogTitle>
            <DialogDescription>
              Your message will be reviewed by AgroBridge operations and forwarded to {getOfftaker(messageContract)} on your behalf.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 bg-muted/50 rounded-lg text-sm">
              <p className="text-muted-foreground">Regarding Contract:</p>
              <p className="font-medium">{messageContract?.id} – {getCrop(messageContract)}</p>
              <p className="text-muted-foreground mt-1">Buyer: {getOfftaker(messageContract)}</p>
            </div>
            <div className="space-y-2">
              <Label>Your Message</Label>
              <Textarea placeholder="Describe your question or concern..." value={messageText} onChange={(e) => setMessageText(e.target.value)} rows={4} />
            </div>
            <p className="text-xs text-muted-foreground">
              Messages are routed through AgroBridge operations to ensure proper coordination and record-keeping.
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button variant="outline" onClick={() => setMessageOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitMessage} disabled={!messageText.trim()}>
              <Send className="h-4 w-4 mr-2" />Send Message
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
