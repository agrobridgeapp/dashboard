"use client"

import { use, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import useSWR, { mutate } from "swr"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Package,
  Calendar,
  MapPin,
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  Users,
  TrendingUp,
  Truck,
  AlertTriangle,
} from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface Allocation {
  id: string
  allocation_type: string
  farmer_name: string | null
  farmer_phone: string | null
  farmer_location: string | null
  cluster_name: string | null
  cluster_farmer_count: number | null
  allocated_volume_mt: number
  collected_volume_mt: number
  total_collected: number
  status: string
  notes: string | null
}

interface CollectionEntry {
  id: string
  allocation_id: string
  quantity_mt: number
  collection_date: string
  quality_grade: string | null
  quality_notes: string | null
  collection_point: string | null
  farmer_name: string | null
  cluster_name: string | null
}

interface Readiness {
  total_aggregated_mt: number
  storage_location: string
  quality_confirmed: boolean
  quality_notes: string | null
  marked_ready_at: string | null
}

interface SupplyOrderDetail {
  id: string
  reference_id: string
  crop_type: string
  crop_grade: string
  assigned_volume_mt: number
  confirmed_volume_mt: number
  collected_volume_mt: number
  delivery_location: string
  delivery_deadline: string
  status: string
  corridor_name: string | null
  aggregator_name: string | null
  ops_notes: string | null
  allocations: Allocation[]
  readiness: Readiness | null
}

const statusConfig: Record<string, { label: string; color: string; step: number }> = {
  assigned: { label: "New Assignment", color: "bg-blue-100 text-blue-700", step: 1 },
  in_progress: { label: "In Progress", color: "bg-amber-100 text-amber-700", step: 2 },
  ready: { label: "Ready for Pickup", color: "bg-emerald-100 text-emerald-700", step: 3 },
  dispatched: { label: "Dispatched", color: "bg-purple-100 text-purple-700", step: 4 },
  completed: { label: "Completed", color: "bg-gray-100 text-gray-700", step: 4 },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700", step: 0 },
}

const workflowSteps = [
  { id: 1, name: "Review", description: "Accept assignment" },
  { id: 2, name: "Allocate", description: "Assign to farmers" },
  { id: 3, name: "Collect", description: "Track collections" },
  { id: 4, name: "Ready", description: "Mark for pickup" },
]

export default function SupplyOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { user } = useAuth()

  const { data, isLoading } = useSWR<{ success: boolean; data: SupplyOrderDetail }>(
    `/api/supply-orders/${id}`,
    fetcher,
    { refreshInterval: 10000 },
  )

  const order = data?.success ? data.data : null
  const config = order ? statusConfig[order.status] || statusConfig.assigned : statusConfig.assigned
  const currentStep = config.step

  // Allocation dialog state
  const [showAddAllocation, setShowAddAllocation] = useState(false)
  const [allocationType, setAllocationType] = useState<"farmer" | "cluster">("farmer")
  const [allocationForm, setAllocationForm] = useState({
    farmer_name: "",
    farmer_phone: "",
    farmer_location: "",
    cluster_name: "",
    cluster_farmer_count: "",
    allocated_volume_mt: "",
    notes: "",
  })
  const [allocationSubmitting, setAllocationSubmitting] = useState(false)

  // Collection dialog state
  const [showAddCollection, setShowAddCollection] = useState(false)
  const [selectedAllocation, setSelectedAllocation] = useState<string>("")
  const [collectionForm, setCollectionForm] = useState({
    quantity_mt: "",
    collection_date: new Date().toISOString().split("T")[0],
    quality_grade: "",
    quality_notes: "",
    collection_point: "",
  })
  const [collectionSubmitting, setCollectionSubmitting] = useState(false)

  // Readiness dialog state
  const [showReadiness, setShowReadiness] = useState(false)
  const [readinessForm, setReadinessForm] = useState({
    total_aggregated_mt: "",
    storage_location: "",
    quality_confirmed: false,
    quality_notes: "",
  })
  const [readinessSubmitting, setReadinessSubmitting] = useState(false)

  const handleAddAllocation = async () => {
    if (!order) return
    setAllocationSubmitting(true)

    try {
      const payload = {
        allocation_type: allocationType,
        ...(allocationType === "farmer"
          ? {
              farmer_name: allocationForm.farmer_name,
              farmer_phone: allocationForm.farmer_phone,
              farmer_location: allocationForm.farmer_location,
            }
          : {
              cluster_name: allocationForm.cluster_name,
              cluster_farmer_count: allocationForm.cluster_farmer_count,
            }),
        allocated_volume_mt: allocationForm.allocated_volume_mt,
        notes: allocationForm.notes || null,
      }

      const res = await fetch(`/api/supply-orders/${id}/allocations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setShowAddAllocation(false)
        setAllocationForm({
          farmer_name: "",
          farmer_phone: "",
          farmer_location: "",
          cluster_name: "",
          cluster_farmer_count: "",
          allocated_volume_mt: "",
          notes: "",
        })
        mutate(`/api/supply-orders/${id}`)
      }
    } finally {
      setAllocationSubmitting(false)
    }
  }

  const handleDeleteAllocation = async (allocationId: string) => {
    if (!confirm("Delete this allocation?")) return

    await fetch(`/api/supply-orders/${id}/allocations?allocation_id=${allocationId}`, {
      method: "DELETE",
    })
    mutate(`/api/supply-orders/${id}`)
  }

  const handleAddCollection = async () => {
    if (!order || !selectedAllocation) return
    setCollectionSubmitting(true)

    try {
      const res = await fetch(`/api/supply-orders/${id}/collections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          allocation_id: selectedAllocation,
          quantity_mt: collectionForm.quantity_mt,
          collection_date: collectionForm.collection_date,
          quality_grade: collectionForm.quality_grade || null,
          quality_notes: collectionForm.quality_notes || null,
          collection_point: collectionForm.collection_point || null,
          recorded_by: user?.id,
        }),
      })

      if (res.ok) {
        setShowAddCollection(false)
        setCollectionForm({
          quantity_mt: "",
          collection_date: new Date().toISOString().split("T")[0],
          quality_grade: "",
          quality_notes: "",
          collection_point: "",
        })
        setSelectedAllocation("")
        mutate(`/api/supply-orders/${id}`)
      }
    } finally {
      setCollectionSubmitting(false)
    }
  }

  const handleMarkReady = async () => {
    if (!order) return
    setReadinessSubmitting(true)

    try {
      const res = await fetch(`/api/supply-orders/${id}/readiness`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          total_aggregated_mt: readinessForm.total_aggregated_mt || order.collected_volume_mt,
          storage_location: readinessForm.storage_location,
          quality_confirmed: readinessForm.quality_confirmed,
          quality_notes: readinessForm.quality_notes || null,
          marked_ready_by: user?.id,
        }),
      })

      if (res.ok) {
        setShowReadiness(false)
        mutate(`/api/supply-orders/${id}`)
      }
    } finally {
      setReadinessSubmitting(false)
    }
  }

  if (isLoading || !order) {
    return (
      <DashboardLayout allowedRoles={["aggregator"]}>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </DashboardLayout>
    )
  }

  const progress =
    order.assigned_volume_mt > 0
      ? (Number(order.collected_volume_mt) / Number(order.assigned_volume_mt)) * 100
      : 0

  const totalAllocated = order.allocations.reduce((sum, a) => sum + Number(a.allocated_volume_mt), 0)
  const remainingToAllocate = Number(order.assigned_volume_mt) - totalAllocated

  return (
    <DashboardLayout allowedRoles={["aggregator"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <Button variant="ghost" size="sm" className="mb-2 -ml-2" asChild>
              <Link href="/dashboard/aggregator/supply-orders">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Orders
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{order.reference_id}</h1>
              <Badge variant="outline" className={config.color}>
                {config.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {order.crop_type} {order.crop_grade ? `(${order.crop_grade})` : ""} -{" "}
              {Number(order.assigned_volume_mt).toFixed(0)} MT
            </p>
          </div>
        </div>

        {/* Workflow Progress */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              {workflowSteps.map((step, idx) => {
                const isComplete = currentStep > step.id
                const isCurrent = currentStep === step.id
                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                          isComplete
                            ? "bg-primary text-primary-foreground"
                            : isCurrent
                              ? "bg-primary/20 text-primary border-2 border-primary"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isComplete ? <CheckCircle2 className="h-4 w-4" /> : step.id}
                      </div>
                      <p className="text-xs mt-1 font-medium">{step.name}</p>
                      <p className="text-xs text-muted-foreground hidden sm:block">{step.description}</p>
                    </div>
                    {idx < workflowSteps.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-2 ${
                          currentStep > step.id ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Order Details + Progress */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Location</p>
                  <p className="font-medium flex items-center gap-1.5 mt-0.5">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {order.delivery_location}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Deadline</p>
                  <p className="font-medium flex items-center gap-1.5 mt-0.5">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {new Date(order.delivery_deadline).toLocaleDateString()}
                  </p>
                </div>
                {order.corridor_name && (
                  <div>
                    <p className="text-sm text-muted-foreground">Corridor</p>
                    <p className="font-medium mt-0.5">{order.corridor_name}</p>
                  </div>
                )}
                {order.ops_notes && (
                  <div className="sm:col-span-2">
                    <p className="text-sm text-muted-foreground">Ops Notes</p>
                    <p className="text-sm mt-0.5 bg-muted/50 p-2 rounded">{order.ops_notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Collection Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Collected</span>
                  <span className="font-medium">
                    {Number(order.collected_volume_mt).toFixed(1)} / {Number(order.assigned_volume_mt).toFixed(1)} MT
                  </span>
                </div>
                <Progress value={progress} className="h-3" />
                <p className="text-xs text-muted-foreground mt-1">{progress.toFixed(0)}% complete</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-lg font-bold">{order.allocations.length}</p>
                  <p className="text-xs text-muted-foreground">Allocations</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-lg font-bold">{totalAllocated.toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">MT Allocated</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Allocations and Collections */}
        <Tabs defaultValue="allocations" className="space-y-4">
          <TabsList>
            <TabsTrigger value="allocations" className="gap-2">
              <Users className="h-4 w-4" />
              Allocations ({order.allocations.length})
            </TabsTrigger>
            <TabsTrigger value="collections" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Collections
            </TabsTrigger>
            <TabsTrigger value="readiness" className="gap-2">
              <Truck className="h-4 w-4" />
              Readiness
            </TabsTrigger>
          </TabsList>

          {/* Allocations Tab */}
          <TabsContent value="allocations">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-base">Farmer / Cluster Allocations</CardTitle>
                  <CardDescription>
                    {remainingToAllocate > 0
                      ? `${remainingToAllocate.toFixed(1)} MT remaining to allocate`
                      : "All volume allocated"}
                  </CardDescription>
                </div>
                <Dialog open={showAddAllocation} onOpenChange={setShowAddAllocation}>
                  <DialogTrigger asChild>
                    <Button size="sm" disabled={remainingToAllocate <= 0}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Allocation
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Allocation</DialogTitle>
                      <DialogDescription>
                        Assign volume to a farmer or cluster. Remaining: {remainingToAllocate.toFixed(1)} MT
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Allocation Type</Label>
                        <Select
                          value={allocationType}
                          onValueChange={(v) => setAllocationType(v as "farmer" | "cluster")}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="farmer">Individual Farmer</SelectItem>
                            <SelectItem value="cluster">Farmer Cluster</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {allocationType === "farmer" ? (
                        <>
                          <div className="space-y-2">
                            <Label>Farmer Name *</Label>
                            <Input
                              value={allocationForm.farmer_name}
                              onChange={(e) =>
                                setAllocationForm((p) => ({ ...p, farmer_name: e.target.value }))
                              }
                              placeholder="Enter farmer name"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label>Phone</Label>
                              <Input
                                value={allocationForm.farmer_phone}
                                onChange={(e) =>
                                  setAllocationForm((p) => ({ ...p, farmer_phone: e.target.value }))
                                }
                                placeholder="Phone number"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Location</Label>
                              <Input
                                value={allocationForm.farmer_location}
                                onChange={(e) =>
                                  setAllocationForm((p) => ({ ...p, farmer_location: e.target.value }))
                                }
                                placeholder="Village/community"
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="space-y-2">
                            <Label>Cluster Name *</Label>
                            <Input
                              value={allocationForm.cluster_name}
                              onChange={(e) =>
                                setAllocationForm((p) => ({ ...p, cluster_name: e.target.value }))
                              }
                              placeholder="Enter cluster name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Number of Farmers</Label>
                            <Input
                              type="number"
                              value={allocationForm.cluster_farmer_count}
                              onChange={(e) =>
                                setAllocationForm((p) => ({ ...p, cluster_farmer_count: e.target.value }))
                              }
                              placeholder="e.g. 15"
                            />
                          </div>
                        </>
                      )}

                      <div className="space-y-2">
                        <Label>Allocated Volume (MT) *</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={allocationForm.allocated_volume_mt}
                          onChange={(e) =>
                            setAllocationForm((p) => ({ ...p, allocated_volume_mt: e.target.value }))
                          }
                          placeholder={`Max: ${remainingToAllocate.toFixed(1)}`}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Notes</Label>
                        <Textarea
                          value={allocationForm.notes}
                          onChange={(e) =>
                            setAllocationForm((p) => ({ ...p, notes: e.target.value }))
                          }
                          placeholder="Optional notes"
                          rows={2}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddAllocation(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddAllocation}
                        disabled={
                          allocationSubmitting ||
                          !allocationForm.allocated_volume_mt ||
                          (allocationType === "farmer" && !allocationForm.farmer_name) ||
                          (allocationType === "cluster" && !allocationForm.cluster_name)
                        }
                      >
                        {allocationSubmitting ? "Adding..." : "Add Allocation"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {order.allocations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p>No allocations yet</p>
                    <p className="text-sm">Add farmers or clusters to start tracking collections</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {order.allocations.map((alloc) => {
                      const allocProgress =
                        alloc.allocated_volume_mt > 0
                          ? (Number(alloc.total_collected) / Number(alloc.allocated_volume_mt)) * 100
                          : 0

                      return (
                        <div
                          key={alloc.id}
                          className="flex items-center justify-between p-3 rounded-lg border"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">
                                {alloc.allocation_type === "farmer"
                                  ? alloc.farmer_name
                                  : alloc.cluster_name}
                              </p>
                              <Badge variant="outline" className="text-xs">
                                {alloc.allocation_type === "farmer" ? "Farmer" : "Cluster"}
                              </Badge>
                              {alloc.status === "collected" && (
                                <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                                  Complete
                                </Badge>
                              )}
                            </div>
                            {alloc.allocation_type === "farmer" && alloc.farmer_phone && (
                              <p className="text-xs text-muted-foreground">{alloc.farmer_phone}</p>
                            )}
                            {alloc.allocation_type === "cluster" && alloc.cluster_farmer_count && (
                              <p className="text-xs text-muted-foreground">
                                {alloc.cluster_farmer_count} farmers
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Progress value={allocProgress} className="h-1.5 w-24" />
                              <span className="text-xs">
                                {Number(alloc.total_collected).toFixed(1)} /{" "}
                                {Number(alloc.allocated_volume_mt).toFixed(1)} MT
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedAllocation(alloc.id)
                                setShowAddCollection(true)
                              }}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Collection
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteAllocation(alloc.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Collections Tab */}
          <TabsContent value="collections">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-base">Collection Entries</CardTitle>
                  <CardDescription>
                    Track individual collection events from farmers
                  </CardDescription>
                </div>
                <Dialog open={showAddCollection} onOpenChange={setShowAddCollection}>
                  <DialogTrigger asChild>
                    <Button size="sm" disabled={order.allocations.length === 0}>
                      <Plus className="h-4 w-4 mr-1" />
                      Record Collection
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Record Collection</DialogTitle>
                      <DialogDescription>
                        Log a collection event from a farmer or cluster
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Allocation *</Label>
                        <Select value={selectedAllocation} onValueChange={setSelectedAllocation}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select farmer/cluster" />
                          </SelectTrigger>
                          <SelectContent>
                            {order.allocations.map((a) => (
                              <SelectItem key={a.id} value={a.id}>
                                {a.allocation_type === "farmer" ? a.farmer_name : a.cluster_name} (
                                {Number(a.total_collected).toFixed(1)}/{Number(a.allocated_volume_mt).toFixed(1)} MT)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Quantity (MT) *</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={collectionForm.quantity_mt}
                            onChange={(e) =>
                              setCollectionForm((p) => ({ ...p, quantity_mt: e.target.value }))
                            }
                            placeholder="e.g. 2.5"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Collection Date *</Label>
                          <Input
                            type="date"
                            value={collectionForm.collection_date}
                            onChange={(e) =>
                              setCollectionForm((p) => ({ ...p, collection_date: e.target.value }))
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Quality Grade</Label>
                          <Select
                            value={collectionForm.quality_grade}
                            onValueChange={(v) =>
                              setCollectionForm((p) => ({ ...p, quality_grade: v }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select grade" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Grade A">Grade A</SelectItem>
                              <SelectItem value="Grade B">Grade B</SelectItem>
                              <SelectItem value="Grade C">Grade C</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Collection Point</Label>
                          <Input
                            value={collectionForm.collection_point}
                            onChange={(e) =>
                              setCollectionForm((p) => ({ ...p, collection_point: e.target.value }))
                            }
                            placeholder="Location"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Quality Notes</Label>
                        <Textarea
                          value={collectionForm.quality_notes}
                          onChange={(e) =>
                            setCollectionForm((p) => ({ ...p, quality_notes: e.target.value }))
                          }
                          placeholder="Observations about quality"
                          rows={2}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddCollection(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddCollection}
                        disabled={
                          collectionSubmitting ||
                          !selectedAllocation ||
                          !collectionForm.quantity_mt ||
                          !collectionForm.collection_date
                        }
                      >
                        {collectionSubmitting ? "Recording..." : "Record Collection"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center py-6">
                  Collection entries will appear here as you record them
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Readiness Tab */}
          <TabsContent value="readiness">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-base">Aggregation Readiness</CardTitle>
                  <CardDescription>
                    Confirm aggregation is complete and ready for pickup
                  </CardDescription>
                </div>
                {order.status !== "ready" && order.status !== "dispatched" && order.status !== "completed" && (
                  <Dialog open={showReadiness} onOpenChange={setShowReadiness}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Mark Ready
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Mark as Ready for Pickup</DialogTitle>
                        <DialogDescription>
                          Confirm the aggregation details before marking ready
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Total Aggregated Volume (MT) *</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={readinessForm.total_aggregated_mt}
                            onChange={(e) =>
                              setReadinessForm((p) => ({ ...p, total_aggregated_mt: e.target.value }))
                            }
                            placeholder={`Collected: ${Number(order.collected_volume_mt).toFixed(1)}`}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Storage Location *</Label>
                          <Input
                            value={readinessForm.storage_location}
                            onChange={(e) =>
                              setReadinessForm((p) => ({ ...p, storage_location: e.target.value }))
                            }
                            placeholder="Where is the produce stored?"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="quality_confirmed"
                            checked={readinessForm.quality_confirmed}
                            onCheckedChange={(c) =>
                              setReadinessForm((p) => ({ ...p, quality_confirmed: !!c }))
                            }
                          />
                          <Label htmlFor="quality_confirmed" className="text-sm">
                            Quality has been verified
                          </Label>
                        </div>
                        <div className="space-y-2">
                          <Label>Quality Notes</Label>
                          <Textarea
                            value={readinessForm.quality_notes}
                            onChange={(e) =>
                              setReadinessForm((p) => ({ ...p, quality_notes: e.target.value }))
                            }
                            placeholder="Any quality observations"
                            rows={2}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowReadiness(false)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handleMarkReady}
                          disabled={
                            readinessSubmitting ||
                            !readinessForm.storage_location
                          }
                        >
                          {readinessSubmitting ? "Marking..." : "Mark Ready for Pickup"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </CardHeader>
              <CardContent>
                {order.readiness ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="font-medium">Ready for Pickup</span>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Aggregated Volume</p>
                        <p className="font-medium">{Number(order.readiness.total_aggregated_mt).toFixed(1)} MT</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Storage Location</p>
                        <p className="font-medium">{order.readiness.storage_location}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Quality Verified</p>
                        <p className="font-medium">{order.readiness.quality_confirmed ? "Yes" : "No"}</p>
                      </div>
                      {order.readiness.marked_ready_at && (
                        <div>
                          <p className="text-sm text-muted-foreground">Marked Ready</p>
                          <p className="font-medium">
                            {new Date(order.readiness.marked_ready_at).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Truck className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p>Not yet marked as ready</p>
                    <p className="text-sm">Complete collections first, then mark ready for pickup</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
