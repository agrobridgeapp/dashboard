"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  User,
  Users,
  ClipboardList,
  MapPin,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  Star,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ExternalLink,
  Pause,
  Play,
  XCircle,
} from "lucide-react"
import { toast } from "sonner"

// Mock agent data
function getAgentData(id: string) {
  const agents: Record<string, any> = {
    "agent-001": {
      id: "agent-001",
      name: "Blessing Okonkwo",
      status: "active",
      email: "blessing.okonkwo@agrobridge.app",
      phone: "+234 803 456 7890",
      corridor: "Kaduna North",
      joinedDate: "2023-06-15",
      farmersAssigned: 342,
      activeTasks: 12,
      completedTasks: 458,
      completionRate: 94.2,
      qualityScore: 96.5,
      overdueItems: 0,
      recentTasks: [
        { id: "TSK-001", type: "Farm Visit", farmer: "Ibrahim Musa", status: "completed", date: "2025-01-20" },
        { id: "TSK-002", type: "Data Collection", farmer: "Amina Bello", status: "in_progress", date: "2025-01-21" },
        { id: "TSK-003", type: "Service Coordination", farmer: "Yusuf Abdullahi", status: "pending", date: "2025-01-22" },
      ],
      farmers: [
        { id: "FRM-001", name: "Ibrahim Musa", village: "Zaria", hectares: 2.5, crop: "Maize", status: "active" },
        { id: "FRM-002", name: "Amina Bello", village: "Giwa", hectares: 3.0, crop: "Rice", status: "active" },
        { id: "FRM-003", name: "Yusuf Abdullahi", village: "Sabon Gari", hectares: 4.0, crop: "Sorghum", status: "active" },
      ],
      performance: {
        thisMonth: { visits: 45, tasks: 38, rating: 4.8 },
        lastMonth: { visits: 42, tasks: 35, rating: 4.7 },
      },
    },
    "agent-002": {
      id: "agent-002",
      name: "Chinedu Eze",
      status: "active",
      email: "chinedu.eze@agrobridge.app",
      phone: "+234 805 123 4567",
      corridor: "Kaduna North",
      joinedDate: "2023-09-01",
      farmersAssigned: 298,
      activeTasks: 8,
      completedTasks: 312,
      completionRate: 89.5,
      qualityScore: 92.1,
      overdueItems: 2,
      recentTasks: [
        { id: "TSK-004", type: "Farm Visit", farmer: "Fatima Garba", status: "completed", date: "2025-01-19" },
        { id: "TSK-005", type: "Yield Assessment", farmer: "Mohammed Sani", status: "overdue", date: "2025-01-18" },
        { id: "TSK-006", type: "Data Collection", farmer: "Hassan Danladi", status: "overdue", date: "2025-01-17" },
      ],
      farmers: [
        { id: "FRM-004", name: "Fatima Garba", village: "Kaduna South", hectares: 1.5, crop: "Maize", status: "active" },
        { id: "FRM-005", name: "Mohammed Sani", village: "Zaria", hectares: 2.0, crop: "Cowpea", status: "active" },
      ],
      performance: {
        thisMonth: { visits: 38, tasks: 30, rating: 4.5 },
        lastMonth: { visits: 40, tasks: 32, rating: 4.6 },
      },
    },
    "agent-003": {
      id: "agent-003",
      name: "Amina Ibrahim",
      status: "suspended",
      email: "amina.ibrahim@agrobridge.app",
      phone: "+234 807 987 6543",
      corridor: "Kaduna Central",
      joinedDate: "2023-03-20",
      farmersAssigned: 276,
      activeTasks: 0,
      completedTasks: 189,
      completionRate: 72.3,
      qualityScore: 78.5,
      overdueItems: 15,
      suspensionReason: "Multiple consecutive missed visits and data quality issues",
      recentTasks: [
        { id: "TSK-007", type: "Farm Visit", farmer: "Aisha Umar", status: "overdue", date: "2025-01-10" },
        { id: "TSK-008", type: "Data Collection", farmer: "Suleiman Baba", status: "overdue", date: "2025-01-08" },
      ],
      farmers: [
        { id: "FRM-006", name: "Aisha Umar", village: "Kubau", hectares: 2.0, crop: "Maize", status: "unattended" },
        { id: "FRM-007", name: "Suleiman Baba", village: "Soba", hectares: 5.0, crop: "Sorghum", status: "unattended" },
      ],
      performance: {
        thisMonth: { visits: 8, tasks: 5, rating: 2.8 },
        lastMonth: { visits: 15, tasks: 12, rating: 3.2 },
      },
    },
  }
  return agents[id] || agents["agent-001"]
}

export default function AgentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const agentId = params.id as string
  const agent = getAgentData(agentId)
  
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"suspend" | "reactivate" | "">("")
  const [actionReason, setActionReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAgentAction = (action: "suspend" | "reactivate") => {
    setActionType(action)
    setActionDialogOpen(true)
  }

  const handleSubmitAction = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      toast.success(`Agent ${actionType === "suspend" ? "suspended" : "reactivated"} successfully`)
      setIsSubmitting(false)
      setActionDialogOpen(false)
      setActionReason("")
    }, 1000)
  }

  return (
    <DashboardLayout allowedRoles={["ops_admin", "super_admin"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <User className="h-6 w-6 text-emerald-700" />
              <h1 className="text-2xl font-bold text-foreground">{agent.name}</h1>
              <Badge
                variant="outline"
                className={
                  agent.status === "active"
                    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                    : agent.status === "suspended"
                    ? "bg-red-100 text-red-700 border-red-200"
                    : "bg-slate-100 text-slate-700 border-slate-200"
                }
              >
                {agent.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Field Agent - {agent.corridor}</p>
          </div>
          <div className="flex gap-2">
            {agent.status === "active" ? (
              <Button variant="outline" className="text-amber-600 border-amber-300 bg-transparent" onClick={() => handleAgentAction("suspend")}>
                <Pause className="h-4 w-4 mr-2" />
                Suspend Agent
              </Button>
            ) : agent.status === "suspended" ? (
              <Button variant="outline" className="text-emerald-600 border-emerald-300 bg-transparent" onClick={() => handleAgentAction("reactivate")}>
                <Play className="h-4 w-4 mr-2" />
                Reactivate Agent
              </Button>
            ) : null}
            <Link href="/dashboard/ops/field-operations">
              <Button variant="outline">
                All Agents
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Suspension Alert */}
        {agent.status === "suspended" && agent.suspensionReason && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-red-700">Agent Suspended</p>
                  <p className="text-sm text-red-600">{agent.suspensionReason}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-6">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{agent.farmersAssigned}</p>
                  <p className="text-xs text-muted-foreground">Farmers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                  <ClipboardList className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{agent.activeTasks}</p>
                  <p className="text-xs text-muted-foreground">Active Tasks</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{agent.completedTasks}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{agent.completionRate}%</p>
                  <p className="text-xs text-muted-foreground">Completion Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                  <Star className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{agent.qualityScore}</p>
                  <p className="text-xs text-muted-foreground">Quality Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={agent.overdueItems > 0 ? "border-red-200 bg-red-50" : "border-border/50"}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${agent.overdueItems > 0 ? "bg-red-100" : "bg-slate-100"}`}>
                  <AlertTriangle className={`h-5 w-5 ${agent.overdueItems > 0 ? "text-red-600" : "text-slate-600"}`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${agent.overdueItems > 0 ? "text-red-700" : ""}`}>{agent.overdueItems}</p>
                  <p className="text-xs text-muted-foreground">Overdue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact & Performance */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{agent.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{agent.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{agent.corridor} Corridor</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {agent.joinedDate}</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Monthly Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{agent.performance.thisMonth.visits}</p>
                  <p className="text-xs text-muted-foreground">Visits</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{agent.performance.thisMonth.tasks}</p>
                  <p className="text-xs text-muted-foreground">Tasks</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{agent.performance.thisMonth.rating}</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="tasks" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tasks">Recent Tasks ({agent.recentTasks.length})</TabsTrigger>
            <TabsTrigger value="farmers">Assigned Farmers ({agent.farmers.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks">
            <Card className="border-border/50">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Farmer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agent.recentTasks.map((task: any) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.id}</TableCell>
                        <TableCell>{task.type}</TableCell>
                        <TableCell>{task.farmer}</TableCell>
                        <TableCell>{task.date}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              task.status === "completed"
                                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                : task.status === "in_progress"
                                ? "bg-blue-100 text-blue-700 border-blue-200"
                                : task.status === "overdue"
                                ? "bg-red-100 text-red-700 border-red-200"
                                : "bg-amber-100 text-amber-700 border-amber-200"
                            }
                          >
                            {task.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="farmers">
            <Card className="border-border/50">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Farmer ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Village</TableHead>
                      <TableHead>Crop</TableHead>
                      <TableHead className="text-right">Hectares</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agent.farmers.map((farmer: any) => (
                      <TableRow key={farmer.id}>
                        <TableCell className="font-medium">{farmer.id}</TableCell>
                        <TableCell>{farmer.name}</TableCell>
                        <TableCell>{farmer.village}</TableCell>
                        <TableCell>{farmer.crop}</TableCell>
                        <TableCell className="text-right">{farmer.hectares}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              farmer.status === "active"
                                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                : "bg-red-100 text-red-700 border-red-200"
                            }
                          >
                            {farmer.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "suspend" ? "Suspend Agent" : "Reactivate Agent"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "suspend"
                ? "This will suspend the agent and reassign their farmers to other agents."
                : "This will reactivate the agent and allow them to resume their duties."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder={actionType === "suspend" ? "Explain why this agent is being suspended..." : "Explain why this agent is being reactivated..."}
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitAction}
              disabled={isSubmitting || !actionReason}
              className={actionType === "suspend" ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"}
            >
              {isSubmitting ? "Processing..." : actionType === "suspend" ? "Suspend Agent" : "Reactivate Agent"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
