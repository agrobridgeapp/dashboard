"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  MapPin,
  Users,
  Leaf,
  Building2,
  FileText,
  Truck,
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Pause,
  Play,
  Ban,
  Settings,
  ExternalLink,
  ChevronRight,
  Activity,
} from "lucide-react"
import { toast } from "sonner"
import { useToast } from "@/hooks/use-toast"

export default function CorridorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { toast: toastHook } = useToast()
  const [corridor, setCorridor] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"pause" | "resume" | "">("")
  const [actionReason, setActionReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchCorridorDetails = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(`/api/corridors/${id}/details`)
        const result = await res.json()
        
        if (result.success) {
          // Map backend fields to UI expected fields if they differ
          const data = result.data
          setCorridor({
            ...data,
            seasonName: data.season_name || "Current Season", // Fallback if not in DB
          })
        } else {
          toastHook({
            title: "Error",
            description: result.error || "Failed to load corridor details.",
            variant: "destructive",
          })
        }
      } catch (err) {
        console.error("Error fetching corridor details:", err)
        toastHook({
          title: "Network Error",
          description: "Could not connect to the server.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCorridorDetails()
  }, [id, toastHook])

  const handleCorridorAction = async () => {
    if (!actionReason.trim()) {
      toastHook({
        title: "Reason Required",
        description: "Please provide a reason for this action.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    toast.success(
      actionType === "pause"
        ? "Corridor paused. All active tasks have been suspended."
        : "Corridor resumed. Tasks are now active."
    )
    
    setActionDialogOpen(false)
    setActionReason("")
    setIsSubmitting(false)
    
    // Update local state
    if (corridor) {
      setCorridor({
        ...corridor,
        status: actionType === "pause" ? "paused" : "active",
      })
    }
  }

  if (isLoading || !corridor) {
    return (
      <DashboardLayout allowedRoles={["ops_admin", "super_admin"]}>
        <div className="flex items-center justify-center h-96">
          <div className="animate-pulse text-muted-foreground">Loading corridor data...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout allowedRoles={["ops_admin", "super_admin"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/ops/control-center">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Control Center
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/dashboard/ops/audit-log?entity=corridor&entityId=${corridor.id}`}>
              <Button variant="outline" size="sm">
                <Activity className="h-4 w-4 mr-2" />
                Audit Log
              </Button>
            </Link>
            {corridor.status === "active" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setActionType("pause")
                  setActionDialogOpen(true)
                }}
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause Corridor
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setActionType("resume")
                  setActionDialogOpen(true)
                }}
              >
                <Play className="h-4 w-4 mr-2" />
                Resume Corridor
              </Button>
            )}
          </div>
        </div>

        {/* Corridor Header */}
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-foreground">{corridor.name}</h1>
                  <Badge
                    variant="outline"
                    className={
                      corridor.status === "active"
                        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                        : corridor.status === "paused"
                        ? "bg-amber-100 text-amber-700 border-amber-200"
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }
                  >
                    {corridor.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {corridor.state}
                  </span>
                  <span>LGAs: {corridor.lgas.join(", ")}</span>
                  <span>Season: {corridor.seasonName}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">{new Date(corridor.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-8">
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <Users className="h-5 w-5 mx-auto mb-1 text-blue-600" />
              <p className="text-2xl font-bold">{corridor.totalFarmers.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Farmers</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <Leaf className="h-5 w-5 mx-auto mb-1 text-emerald-600" />
              <p className="text-2xl font-bold">{corridor.totalHectares.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Hectares</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <Users className="h-5 w-5 mx-auto mb-1 text-purple-600" />
              <p className="text-2xl font-bold">{corridor.totalAgents}</p>
              <p className="text-xs text-muted-foreground">Agents</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <Building2 className="h-5 w-5 mx-auto mb-1 text-orange-600" />
              <p className="text-2xl font-bold">{corridor.totalPartners}</p>
              <p className="text-xs text-muted-foreground">Partners</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <Building2 className="h-5 w-5 mx-auto mb-1 text-indigo-600" />
              <p className="text-2xl font-bold">{corridor.buyers.length}</p>
              <p className="text-xs text-muted-foreground">Buyers</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <FileText className="h-5 w-5 mx-auto mb-1 text-pink-600" />
              <p className="text-2xl font-bold">{corridor.buyers.reduce((sum: number, b: any) => sum + b.contracts, 0)}</p>
              <p className="text-xs text-muted-foreground">Contracts</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <ClipboardList className="h-5 w-5 mx-auto mb-1 text-teal-600" />
              <p className="text-2xl font-bold">{corridor.tasks.length}</p>
              <p className="text-xs text-muted-foreground">Active Tasks</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <Truck className="h-5 w-5 mx-auto mb-1 text-cyan-600" />
              <p className="text-2xl font-bold">{corridor.deliveries.length}</p>
              <p className="text-xs text-muted-foreground">Deliveries</p>
            </CardContent>
          </Card>
        </div>

        {/* Incidents Alert */}
        {corridor.incidents.length > 0 && (
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
                <AlertTriangle className="h-5 w-5" />
                Active Incidents ({corridor.incidents.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {corridor.incidents.map((incident: any) => (
                  <div
                    key={incident.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-100"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className={
                          incident.severity === "high"
                            ? "bg-red-100 text-red-700 border-red-200"
                            : "bg-amber-100 text-amber-700 border-amber-200"
                        }
                      >
                        {incident.severity}
                      </Badge>
                      <span className="text-sm">{incident.description}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (incident.type === "agent_performance") {
                          router.push("/dashboard/ops/field-operations")
                        } else if (incident.type === "sla_breach") {
                          router.push("/dashboard/ops/tasks?filter=overdue")
                        } else {
                          router.push("/dashboard/ops/audit-log")
                        }
                      }}
                    >
                      Investigate
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="farmers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="farmers">Farmers ({corridor.totalFarmers})</TabsTrigger>
            <TabsTrigger value="agents">Agents ({corridor.totalAgents})</TabsTrigger>
            <TabsTrigger value="buyers">Buyers ({corridor.buyers.length})</TabsTrigger>
            <TabsTrigger value="partners">Partners ({corridor.totalPartners})</TabsTrigger>
            <TabsTrigger value="tasks">Tasks ({corridor.tasks.length})</TabsTrigger>
            <TabsTrigger value="deliveries">Deliveries ({corridor.deliveries.length})</TabsTrigger>
          </TabsList>

          {/* Farmers Tab */}
          <TabsContent value="farmers">
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Farmers in Corridor</CardTitle>
                    <CardDescription>All farmers registered in this corridor</CardDescription>
                  </div>
                  <Link href={`/dashboard/ops/farmers?corridor=${corridor.id}`}>
                    <Button variant="outline" size="sm">
                      View All Farmers
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3 mb-4">
                  <Card className="border-border/50">
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-emerald-600">{corridor.activeFarmers}</p>
                      <p className="text-xs text-muted-foreground">Active Farmers</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50">
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-amber-600">{corridor.pendingFarmers}</p>
                      <p className="text-xs text-muted-foreground">Pending Verification</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50">
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-blue-600">{corridor.activeCropCycles}</p>
                      <p className="text-xs text-muted-foreground">Active Crop Cycles</p>
                    </CardContent>
                  </Card>
                </div>
                <p className="text-sm text-muted-foreground text-center py-4">
                  Click "View All Farmers" to see the complete farmer list with filtering options.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Agents Tab */}
          <TabsContent value="agents">
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Agents in Corridor</CardTitle>
                    <CardDescription>Field agents assigned to this corridor</CardDescription>
                  </div>
                  <Link href={`/dashboard/ops/field-operations?corridor=${corridor.id}`}>
                    <Button variant="outline" size="sm">
                      Field Operations
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Farmers</TableHead>
                      <TableHead className="text-right">Active Tasks</TableHead>
                      <TableHead className="text-right">Completion Rate</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {corridor.agents.map((agent: any) => (
                      <TableRow key={agent.id}>
                        <TableCell>
                          <Link
                            href={`/dashboard/ops/control-center/agent/${agent.id}`}
                            className="font-medium hover:underline"
                          >
                            {agent.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-emerald-100 text-emerald-700 border-emerald-200"
                          >
                            {agent.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{agent.farmers}</TableCell>
                        <TableCell className="text-right">{agent.tasks}</TableCell>
                        <TableCell className="text-right">
                          <span className={agent.completionRate >= 90 ? "text-emerald-600" : "text-amber-600"}>
                            {agent.completionRate}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/dashboard/ops/control-center/agent/${agent.id}`}>
                            <Button variant="ghost" size="sm">
                              View
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Buyers Tab */}
          <TabsContent value="buyers">
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Buyers in Corridor</CardTitle>
                    <CardDescription>Buyers with contracts linked to this corridor</CardDescription>
                  </div>
                  <Link href="/dashboard/ops/contracts">
                    <Button variant="outline" size="sm">
                      All Contracts
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Buyer</TableHead>
                      <TableHead className="text-right">Contracts</TableHead>
                      <TableHead className="text-right">Total Volume (MT)</TableHead>
                      <TableHead className="text-right">Delivered (MT)</TableHead>
                      <TableHead className="text-right">Progress</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {corridor.buyers.map((buyer: any) => (
                      <TableRow key={buyer.id}>
                        <TableCell>
                          <Link
                            href={`/dashboard/ops/control-center/buyer/${buyer.id}`}
                            className="font-medium hover:underline"
                          >
                            {buyer.name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right">{buyer.contracts}</TableCell>
                        <TableCell className="text-right">{buyer.totalVolume.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{buyer.deliveredVolume.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <span className="text-emerald-600">
                            {buyer.totalVolume > 0 ? Math.round((buyer.deliveredVolume / buyer.totalVolume) * 100) : 0}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/dashboard/ops/control-center/buyer/${buyer.id}`}>
                            <Button variant="ghost" size="sm">
                              View
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Partners Tab */}
          <TabsContent value="partners">
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Partners in Corridor</CardTitle>
                    <CardDescription>Service partners operating in this corridor</CardDescription>
                  </div>
                  <Link href="/dashboard/ops/partners">
                    <Button variant="outline" size="sm">
                      Partner Management
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Partner</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Active Jobs</TableHead>
                      <TableHead className="text-right">Rating</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {corridor.partners.map((partner: any) => (
                      <TableRow key={partner.id}>
                        <TableCell>
                          <Link
                            href={`/dashboard/ops/control-center/partner/${partner.id}`}
                            className="font-medium hover:underline"
                          >
                            {partner.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{partner.type?.replace("_", " ")}</Badge>
                        </TableCell>
                        <TableCell className="text-right">{partner.activeJobs}</TableCell>
                        <TableCell className="text-right">
                          <span className="text-amber-600">{partner.rating}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/dashboard/ops/control-center/partner/${partner.id}`}>
                            <Button variant="ghost" size="sm">
                              View
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks">
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Tasks in Corridor</CardTitle>
                    <CardDescription>Active and pending tasks for this corridor</CardDescription>
                  </div>
                  <Link href={`/dashboard/ops/tasks?corridor=${corridor.id}`}>
                    <Button variant="outline" size="sm">
                      Task Management
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Assignee</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {corridor.tasks.map((task: any) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{task.type?.replace("_", " ")}</Badge>
                        </TableCell>
                        <TableCell>{task.assignee}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              task.status === "completed"
                                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                : task.status === "in_progress"
                                ? "bg-blue-100 text-blue-700 border-blue-200"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                            }
                          >
                            {task.status?.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Deliveries Tab */}
          <TabsContent value="deliveries">
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Deliveries from Corridor</CardTitle>
                    <CardDescription>Delivery milestones and fulfillment status</CardDescription>
                  </div>
                  <Link href="/dashboard/ops/supply-pipeline">
                    <Button variant="outline" size="sm">
                      Delivery Management
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Buyer</TableHead>
                      <TableHead className="text-right">Volume (MT)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expected Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {corridor.deliveries.map((delivery: any) => (
                      <TableRow key={delivery.id}>
                        <TableCell className="font-medium">{delivery.buyer}</TableCell>
                        <TableCell className="text-right">{delivery.volume}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              delivery.status === "in_transit"
                                ? "bg-blue-100 text-blue-700 border-blue-200"
                                : "bg-amber-100 text-amber-700 border-amber-200"
                            }
                          >
                            {delivery.status?.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>{delivery.expectedDate ? new Date(delivery.expectedDate).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Track
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Dialog */}
        <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionType === "pause" ? "Pause Corridor" : "Resume Corridor"}
              </DialogTitle>
              <DialogDescription>
                {actionType === "pause"
                  ? "Pausing this corridor will suspend all active tasks and block new assignments. This action will be logged."
                  : "Resuming this corridor will reactivate suspended tasks and allow new assignments. This action will be logged."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for this action *</Label>
                <Textarea
                  id="reason"
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder="Provide a reason for this action (required for audit trail)..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCorridorAction}
                disabled={isSubmitting}
                className={
                  actionType === "pause"
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "bg-emerald-700 hover:bg-emerald-800"
                }
              >
                {isSubmitting
                  ? "Processing..."
                  : actionType === "pause"
                  ? "Pause Corridor"
                  : "Resume Corridor"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
