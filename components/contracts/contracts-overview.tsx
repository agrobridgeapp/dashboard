"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  MoreHorizontal,
  Plus,
  FileText,
  TrendingUp,
  Package,
  Truck,
  CheckCircle2,
  Building2,
  Users,
  AlertTriangle,
  Eye,
  Scale,
  Droplets,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"
import { useDataStore } from "@/lib/data/data-store"
import type { QualityGrade } from "@/lib/data/types"
import { PaginationControls } from "@/components/ui/pagination-controls"

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-slate-100 text-slate-700 border-slate-200",
  active: "bg-blue-100 text-blue-700 border-blue-200",
  in_delivery: "bg-primary/10 text-primary border-primary/20",
  fulfilled: "bg-emerald-100 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
}

const DELIVERY_STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  in_transit: "bg-blue-100 text-blue-700 border-blue-200",
  received: "bg-primary/10 text-primary border-primary/20",
  verified: "bg-emerald-100 text-emerald-700 border-emerald-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
}

const GRADE_COLORS: Record<string, string> = {
  A: "bg-emerald-100 text-emerald-700",
  B: "bg-blue-100 text-blue-700",
  C: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
}

type ApiContract = {
  id: string
  offtaker_name: string
  offtaker_id: string
  crop_type: string
  contracted_volume_tons: number
  delivered_volume_tons: number
  remaining_volume_tons: number
  total_contract_value: number
  price_per_ton: number
  minimum_grade: string
  quality_parameters: any
  delivery_window_start: string
  delivery_window_end: string
  assigned_farmer_ids: string[]
  status: string
  contract_number: string
}

export function ContractsOverview() {
  const { deliveries, farmers, cropCycles, addDelivery, updateDeliveryStatus } = useDataStore()

  const [contracts, setContracts] = useState<ApiContract[]>([])
  const [contractsLoading, setContractsLoading] = useState(true)
  const [seasons, setSeasons] = useState<any[]>([])
  const [corridors, setCorridors] = useState<any[]>([])

  const [showNewContract, setShowNewContract] = useState(false)
  const [showNewDelivery, setShowNewDelivery] = useState(false)
  const [showContractDetail, setShowContractDetail] = useState(false)
  const [selectedContract, setSelectedContract] = useState<ApiContract | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [createLoading, setCreateLoading] = useState(false)
  const [page, setPage] = useState(1)

  const [deliveryForm, setDeliveryForm] = useState({
    contractId: "",
    farmerId: "",
    quantityTons: "",
    grade: "" as QualityGrade | "",
    moistureLevel: "",
    foreignMatter: "",
    vehicleNumber: "",
    driverName: "",
    driverPhone: "",
  })

  const [contractForm, setContractForm] = useState({
    offtakerName: "",
    cropType: "",
    contractedVolumeTons: "",
    pricePerTon: "",
    minimumGrade: "B" as QualityGrade,
    moistureMax: "14",
    foreignMatterMax: "2",
    brokenGrainsMax: "5",
    deliveryWindowStart: "",
    deliveryWindowEnd: "",
    corridorId: "",
    seasonId: "",
  })

  const fetchContracts = useCallback(async () => {
    try {
      setContractsLoading(true)
      const res = await apiClient.contracts.list()
      const raw = res.data?.contracts ?? res.data ?? []
      setContracts(
        raw.map((c: any) => ({
          ...c,
          contracted_volume_tons: Number(c.contracted_volume_tons),
          delivered_volume_tons: Number(c.delivered_volume_tons),
          remaining_volume_tons: Number(c.remaining_volume_tons),
          total_contract_value: Number(c.total_contract_value),
          price_per_ton: Number(c.price_per_ton),
          assigned_farmer_ids: Array.isArray(c.assigned_farmer_ids)
            ? c.assigned_farmer_ids
            : typeof c.assigned_farmer_ids === "string"
            ? JSON.parse(c.assigned_farmer_ids || "[]")
            : [],
        }))
      )
    } catch (err: any) {
      toast.error(err.message || "Failed to load contracts")
    } finally {
      setContractsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchContracts()
    // Load corridors and seasons for the create form
    apiClient.corridors.list().then((res) => setCorridors(res.data || [])).catch(() => {})
    apiClient.seasons.list().then((res) => setSeasons(res.data || [])).catch(() => {})
  }, [fetchContracts])

  const totalContractValue = contracts.reduce((sum, c) => sum + c.total_contract_value, 0)
  const totalDelivered = contracts.reduce((sum, c) => sum + c.delivered_volume_tons, 0)
  const totalContracted = contracts.reduce((sum, c) => sum + c.contracted_volume_tons, 0)
  const activeContracts = contracts.filter((c) => ["active", "in_delivery"].includes(c.status)).length
  const totalFarmers = new Set(contracts.flatMap((c) => c.assigned_farmer_ids)).size

  const getFarmerName = (farmerId: string) => {
    const farmer = farmers.find((f) => f.id === farmerId)
    return farmer ? `${farmer.firstName} ${farmer.lastName}` : farmerId
  }

  const handleCreateDelivery = () => {
    if (!deliveryForm.contractId || !deliveryForm.farmerId || !deliveryForm.quantityTons || !deliveryForm.grade) return

    const farmer = farmers.find((f) => f.id === deliveryForm.farmerId)
    const cropCycle = cropCycles.find((c) => c.farmerId === deliveryForm.farmerId)

    addDelivery({
      contractId: deliveryForm.contractId,
      corridorId: "corridor-kaduna-001",
      seasonId: "season-2024-wet",
      farmerId: deliveryForm.farmerId,
      farmerName: farmer ? `${farmer.firstName} ${farmer.lastName}` : "Unknown",
      cropCycleId: cropCycle?.id || "",
      quantityTons: Number(deliveryForm.quantityTons),
      grade: deliveryForm.grade as QualityGrade,
      moistureLevel: Number(deliveryForm.moistureLevel) || 0,
      foreignMatter: Number(deliveryForm.foreignMatter) || 0,
      vehicleNumber: deliveryForm.vehicleNumber,
      driverName: deliveryForm.driverName,
      driverPhone: deliveryForm.driverPhone,
      dispatchedAt: new Date().toISOString(),
      status: "pending",
    })

    setDeliveryForm({
      contractId: "",
      farmerId: "",
      quantityTons: "",
      grade: "",
      moistureLevel: "",
      foreignMatter: "",
      vehicleNumber: "",
      driverName: "",
      driverPhone: "",
    })
    setShowNewDelivery(false)
  }

  const handleCreateContract = async () => {
    if (
      !contractForm.offtakerName ||
      !contractForm.cropType ||
      !contractForm.contractedVolumeTons ||
      !contractForm.pricePerTon ||
      !contractForm.deliveryWindowStart ||
      !contractForm.deliveryWindowEnd
    ) {
      toast.error("Please fill in all required fields")
      return
    }

    setCreateLoading(true)
    try {
      await apiClient.contracts.create({
        offtakerName: contractForm.offtakerName,
        cropType: contractForm.cropType,
        contractedVolumeTons: Number(contractForm.contractedVolumeTons),
        pricePerTon: Number(contractForm.pricePerTon),
        minimumGrade: contractForm.minimumGrade,
        qualityParameters: {
          moistureMax: Number(contractForm.moistureMax),
          foreignMatterMax: Number(contractForm.foreignMatterMax),
          brokenGrainsMax: Number(contractForm.brokenGrainsMax),
        },
        deliveryWindowStart: contractForm.deliveryWindowStart,
        deliveryWindowEnd: contractForm.deliveryWindowEnd,
        corridorId: contractForm.corridorId || undefined,
        seasonId: contractForm.seasonId || undefined,
      })

      toast.success("Contract created successfully")
      setContractForm({
        offtakerName: "",
        cropType: "",
        contractedVolumeTons: "",
        pricePerTon: "",
        minimumGrade: "B",
        moistureMax: "14",
        foreignMatterMax: "2",
        brokenGrainsMax: "5",
        deliveryWindowStart: "",
        deliveryWindowEnd: "",
        corridorId: "",
        seasonId: "",
      })
      setShowNewContract(false)
      fetchContracts()
    } catch (err: any) {
      toast.error(err.message || "Failed to create contract")
    } finally {
      setCreateLoading(false)
    }
  }

  const filteredContracts = contracts.filter(
    (c) =>
      c.offtaker_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.crop_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const pagedContracts = filteredContracts.slice((page - 1) * 20, page * 20)

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{contractsLoading ? "—" : activeContracts}</p>
                <p className="text-xs text-muted-foreground">Active Contracts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-100 p-2.5">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {contractsLoading ? "—" : `₦${(totalContractValue / 1000000).toFixed(0)}M`}
                </p>
                <p className="text-xs text-muted-foreground">Total Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2.5">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{contractsLoading ? "—" : `${totalDelivered.toFixed(1)}t`}</p>
                <p className="text-xs text-muted-foreground">Delivered</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-100 p-2.5">
                <Scale className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {contractsLoading
                    ? "—"
                    : `${((totalDelivered / Math.max(totalContracted, 1)) * 100).toFixed(0)}%`}
                </p>
                <p className="text-xs text-muted-foreground">Fulfilment</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2.5">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{contractsLoading ? "—" : totalFarmers}</p>
                <p className="text-xs text-muted-foreground">Farmers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="contracts" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
            <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
            <TabsTrigger value="yield">Yield Tracking</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            {/* Record Delivery dialog (still uses data store) */}
            <Dialog open={showNewDelivery} onOpenChange={setShowNewDelivery}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Truck className="h-4 w-4 mr-2" />
                  Record Delivery
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Record New Delivery</DialogTitle>
                  <DialogDescription>Log a commodity delivery against a contract</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Contract</Label>
                    <Select
                      value={deliveryForm.contractId}
                      onValueChange={(v) => setDeliveryForm((f) => ({ ...f, contractId: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select contract" />
                      </SelectTrigger>
                      <SelectContent>
                        {contracts
                          .filter((c) => ["active", "in_delivery"].includes(c.status))
                          .map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.offtaker_name} - {c.crop_type} ({c.remaining_volume_tons}t remaining)
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {deliveryForm.contractId && (
                    <div className="space-y-2">
                      <Label>Farmer</Label>
                      <Select
                        value={deliveryForm.farmerId}
                        onValueChange={(v) => setDeliveryForm((f) => ({ ...f, farmerId: v }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select farmer" />
                        </SelectTrigger>
                        <SelectContent>
                          {farmers.map((f) => (
                            <SelectItem key={f.id} value={f.id}>
                              {f.firstName} {f.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Quantity (tons)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="e.g., 5.5"
                        value={deliveryForm.quantityTons}
                        onChange={(e) => setDeliveryForm((f) => ({ ...f, quantityTons: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Quality Grade</Label>
                      <Select
                        value={deliveryForm.grade}
                        onValueChange={(v) => setDeliveryForm((f) => ({ ...f, grade: v as QualityGrade }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">Grade A (Premium)</SelectItem>
                          <SelectItem value="B">Grade B (Standard)</SelectItem>
                          <SelectItem value="C">Grade C (Below Standard)</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Moisture Level (%)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="e.g., 12.5"
                        value={deliveryForm.moistureLevel}
                        onChange={(e) => setDeliveryForm((f) => ({ ...f, moistureLevel: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Foreign Matter (%)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="e.g., 1.2"
                        value={deliveryForm.foreignMatter}
                        onChange={(e) => setDeliveryForm((f) => ({ ...f, foreignMatter: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Vehicle Number</Label>
                    <Input
                      placeholder="e.g., KAD-123-XY"
                      value={deliveryForm.vehicleNumber}
                      onChange={(e) => setDeliveryForm((f) => ({ ...f, vehicleNumber: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Driver Name</Label>
                      <Input
                        placeholder="Driver name"
                        value={deliveryForm.driverName}
                        onChange={(e) => setDeliveryForm((f) => ({ ...f, driverName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Driver Phone</Label>
                      <Input
                        placeholder="+234..."
                        value={deliveryForm.driverPhone}
                        onChange={(e) => setDeliveryForm((f) => ({ ...f, driverPhone: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowNewDelivery(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateDelivery}>Record Delivery</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* New Contract dialog */}
            <Dialog open={showNewContract} onOpenChange={setShowNewContract}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Contract
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Offtake Contract</DialogTitle>
                  <DialogDescription>Set up a new contract with an offtaker</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Offtaker Name <span className="text-red-500">*</span></Label>
                      <Input
                        placeholder="e.g., GrainCorp Nigeria"
                        value={contractForm.offtakerName}
                        onChange={(e) => setContractForm((f) => ({ ...f, offtakerName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Crop Type <span className="text-red-500">*</span></Label>
                      <Select
                        value={contractForm.cropType}
                        onValueChange={(v) => setContractForm((f) => ({ ...f, cropType: v }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select crop" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maize">Maize</SelectItem>
                          <SelectItem value="rice">Rice</SelectItem>
                          <SelectItem value="soybean">Soybean</SelectItem>
                          <SelectItem value="sorghum">Sorghum</SelectItem>
                          <SelectItem value="millet">Millet</SelectItem>
                          <SelectItem value="groundnut">Groundnut</SelectItem>
                          <SelectItem value="cassava">Cassava</SelectItem>
                          <SelectItem value="cowpea">Cowpea</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Volume (tons) <span className="text-red-500">*</span></Label>
                      <Input
                        type="number"
                        placeholder="e.g., 500"
                        value={contractForm.contractedVolumeTons}
                        onChange={(e) => setContractForm((f) => ({ ...f, contractedVolumeTons: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Price per Ton (₦) <span className="text-red-500">*</span></Label>
                      <Input
                        type="number"
                        placeholder="e.g., 280000"
                        value={contractForm.pricePerTon}
                        onChange={(e) => setContractForm((f) => ({ ...f, pricePerTon: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Delivery Window Start <span className="text-red-500">*</span></Label>
                      <Input
                        type="date"
                        value={contractForm.deliveryWindowStart}
                        onChange={(e) => setContractForm((f) => ({ ...f, deliveryWindowStart: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Delivery Window End <span className="text-red-500">*</span></Label>
                      <Input
                        type="date"
                        value={contractForm.deliveryWindowEnd}
                        onChange={(e) => setContractForm((f) => ({ ...f, deliveryWindowEnd: e.target.value }))}
                      />
                    </div>
                    {corridors.length > 0 && (
                      <div className="space-y-2">
                        <Label>Corridor</Label>
                        <Select
                          value={contractForm.corridorId}
                          onValueChange={(v) => setContractForm((f) => ({ ...f, corridorId: v }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select corridor (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            {corridors.map((c: any) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    {seasons.length > 0 && (
                      <div className="space-y-2">
                        <Label>Season</Label>
                        <Select
                          value={contractForm.seasonId}
                          onValueChange={(v) => setContractForm((f) => ({ ...f, seasonId: v }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select season (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            {seasons.map((s: any) => (
                              <SelectItem key={s.id} value={s.id}>
                                {s.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label>Quality Parameters</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Min Grade</Label>
                        <Select
                          value={contractForm.minimumGrade}
                          onValueChange={(v) => setContractForm((f) => ({ ...f, minimumGrade: v as QualityGrade }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">Grade A</SelectItem>
                            <SelectItem value="B">Grade B</SelectItem>
                            <SelectItem value="C">Grade C</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Max Moisture (%)</Label>
                        <Input
                          type="number"
                          value={contractForm.moistureMax}
                          onChange={(e) => setContractForm((f) => ({ ...f, moistureMax: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Max Foreign Matter (%)</Label>
                        <Input
                          type="number"
                          value={contractForm.foreignMatterMax}
                          onChange={(e) => setContractForm((f) => ({ ...f, foreignMatterMax: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                  {contractForm.contractedVolumeTons && contractForm.pricePerTon && (
                    <Alert className="bg-primary/5 border-primary/20">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <AlertDescription>
                        Total Contract Value: ₦
                        {(
                          Number(contractForm.contractedVolumeTons) * Number(contractForm.pricePerTon)
                        ).toLocaleString()}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowNewContract(false)} disabled={createLoading}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateContract} disabled={createLoading}>
                    {createLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Contract
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <TabsContent value="contracts">
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search contracts..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Offtaker</TableHead>
                    <TableHead>Crop</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Window</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contractsLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ) : filteredContracts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        No contracts found
                      </TableCell>
                    </TableRow>
                  ) : (
                    pagedContracts.map((contract) => {
                      const progress = contract.contracted_volume_tons > 0
                        ? (contract.delivered_volume_tons / contract.contracted_volume_tons) * 100
                        : 0
                      const isOverdue =
                        new Date(contract.delivery_window_end) < new Date() && contract.status !== "fulfilled"

                      return (
                        <TableRow key={contract.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{contract.offtaker_name}</p>
                                <p className="text-xs text-muted-foreground">{contract.contract_number || contract.id}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="capitalize">{contract.crop_type}</TableCell>
                          <TableCell>
                            <div className="space-y-1 min-w-32">
                              <div className="flex justify-between text-xs">
                                <span>
                                  {contract.delivered_volume_tons.toFixed(1)}/{contract.contracted_volume_tons}t
                                </span>
                                <span>{progress.toFixed(0)}%</span>
                              </div>
                              <Progress value={progress} className="h-2" />
                            </div>
                          </TableCell>
                          <TableCell>₦{(contract.total_contract_value / 1000000).toFixed(1)}M</TableCell>
                          <TableCell>
                            <div className="text-xs">
                              <p>{new Date(contract.delivery_window_start).toLocaleDateString()}</p>
                              <p className="text-muted-foreground">
                                to {new Date(contract.delivery_window_end).toLocaleDateString()}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={STATUS_STYLES[contract.status] || ""}>
                                {contract.status.replace("_", " ")}
                              </Badge>
                              {isOverdue && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedContract(contract)
                                    setShowContractDetail(true)
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setDeliveryForm((f) => ({ ...f, contractId: contract.id }))
                                    setShowNewDelivery(true)
                                  }}
                                >
                                  <Truck className="h-4 w-4 mr-2" />
                                  Record Delivery
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <PaginationControls
            page={page}
            pages={Math.ceil(filteredContracts.length / 20)}
            total={filteredContracts.length}
            limit={20}
            onPageChange={setPage}
            className="mt-4"
          />
        </TabsContent>

        <TabsContent value="deliveries">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Delivery Records</CardTitle>
              <CardDescription>Track commodity deliveries and quality assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Farmer</TableHead>
                    <TableHead>Contract</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Quality</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell className="font-medium text-xs">{delivery.id.slice(0, 12)}...</TableCell>
                      <TableCell>{delivery.farmerName}</TableCell>
                      <TableCell>
                        {contracts.find((c) => c.id === delivery.contractId)?.offtaker_name || delivery.contractId}
                      </TableCell>
                      <TableCell>{delivery.quantityTons.toFixed(1)}t</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge className={GRADE_COLORS[delivery.grade]}>{delivery.grade}</Badge>
                          <div className="flex gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Droplets className="h-3 w-3" />
                              {delivery.moistureLevel}%
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {delivery.receivedAt ? new Date(delivery.receivedAt).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={DELIVERY_STATUS_STYLES[delivery.status]}>
                          {delivery.status === "verified" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                          {delivery.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {delivery.status === "pending" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  updateDeliveryStatus(delivery.id, "received", {
                                    receivedAt: new Date().toISOString(),
                                  })
                                }
                              >
                                Mark Received
                              </DropdownMenuItem>
                            )}
                            {delivery.status === "received" && (
                              <DropdownMenuItem onClick={() => updateDeliveryStatus(delivery.id, "verified")}>
                                Verify Delivery
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="yield">
          <YieldTrackingTab />
        </TabsContent>
      </Tabs>

      {/* Contract Detail Dialog */}
      <Dialog open={showContractDetail} onOpenChange={setShowContractDetail}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contract Details</DialogTitle>
          </DialogHeader>
          {selectedContract && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Offtaker</p>
                  <p className="font-medium">{selectedContract.offtaker_name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Crop</p>
                  <p className="font-medium capitalize">{selectedContract.crop_type}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Contracted Volume</p>
                  <p className="font-medium">{selectedContract.contracted_volume_tons} tons</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Delivered Volume</p>
                  <p className="font-medium">{selectedContract.delivered_volume_tons} tons</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Price per Ton</p>
                  <p className="font-medium">₦{selectedContract.price_per_ton.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="font-medium">₦{selectedContract.total_contract_value.toLocaleString()}</p>
                </div>
              </div>

              {selectedContract.quality_parameters && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Quality Requirements</p>
                  <div className="flex gap-4 text-sm">
                    <span>Min Grade: {selectedContract.minimum_grade}</span>
                    {selectedContract.quality_parameters.moistureMax !== undefined && (
                      <span>Max Moisture: {selectedContract.quality_parameters.moistureMax}%</span>
                    )}
                    {selectedContract.quality_parameters.foreignMatterMax !== undefined && (
                      <span>Max Foreign: {selectedContract.quality_parameters.foreignMatterMax}%</span>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Fulfilment Progress</p>
                <Progress
                  value={
                    selectedContract.contracted_volume_tons > 0
                      ? (selectedContract.delivered_volume_tons / selectedContract.contracted_volume_tons) * 100
                      : 0
                  }
                  className="h-3"
                />
                <p className="text-sm text-muted-foreground">{selectedContract.remaining_volume_tons} tons remaining</p>
              </div>

              {selectedContract.assigned_farmer_ids.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Assigned Farmers ({selectedContract.assigned_farmer_ids.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedContract.assigned_farmer_ids.map((farmerId) => (
                      <Badge key={farmerId} variant="secondary">
                        {getFarmerName(farmerId)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function YieldTrackingTab() {
  const { cropCycles, farmers } = useDataStore()

  const getFarmerName = (farmerId: string) => {
    const farmer = farmers.find((f) => f.id === farmerId)
    return farmer ? `${farmer.firstName} ${farmer.lastName}` : "Unknown"
  }

  const completedCycles = cropCycles.filter((c) => c.actualYieldTons !== undefined)
  const totalExpected = completedCycles.reduce((sum, c) => sum + c.expectedYieldTons, 0)
  const totalActual = completedCycles.reduce((sum, c) => sum + (c.actualYieldTons || 0), 0)
  const variancePercent = totalExpected > 0 ? ((totalActual - totalExpected) / totalExpected) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Expected Yield</p>
            <p className="text-2xl font-bold">{totalExpected.toFixed(1)}t</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Actual Yield</p>
            <p className="text-2xl font-bold">{totalActual.toFixed(1)}t</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Variance</p>
            <p className={`text-2xl font-bold ${variancePercent >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              {variancePercent >= 0 ? "+" : ""}
              {variancePercent.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Cycles Completed</p>
            <p className="text-2xl font-bold">
              {completedCycles.length}/{cropCycles.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Yield by Crop Cycle</CardTitle>
          <CardDescription>Expected vs actual yield per farmer</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Farmer</TableHead>
                <TableHead>Crop</TableHead>
                <TableHead>Hectares</TableHead>
                <TableHead>Expected</TableHead>
                <TableHead>Actual</TableHead>
                <TableHead>Variance</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cropCycles.map((cycle) => {
                const variance =
                  cycle.actualYieldTons !== undefined
                    ? ((cycle.actualYieldTons - cycle.expectedYieldTons) / cycle.expectedYieldTons) * 100
                    : null

                return (
                  <TableRow key={cycle.id}>
                    <TableCell className="font-medium">{getFarmerName(cycle.farmerId)}</TableCell>
                    <TableCell className="capitalize">{cycle.cropType}</TableCell>
                    <TableCell>{cycle.hectaresPlanted} ha</TableCell>
                    <TableCell>{cycle.expectedYieldTons.toFixed(1)}t</TableCell>
                    <TableCell>{cycle.actualYieldTons?.toFixed(1) || "—"}t</TableCell>
                    <TableCell>
                      {variance !== null ? (
                        <span className={variance >= 0 ? "text-emerald-600" : "text-red-600"}>
                          {variance >= 0 ? "+" : ""}
                          {variance.toFixed(1)}%
                        </span>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          cycle.status === "completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : cycle.status === "active"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-slate-100 text-slate-700"
                        }
                      >
                        {cycle.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
