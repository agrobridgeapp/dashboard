"use client"

import React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Plus,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MoreHorizontal,
  Users,
  ClipboardList,
  MapPin,
  Filter,
  Search,
  Eye,
  Edit,
  XCircle,
  Pause,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock tasks created by Operations
const initialTasks = [
  {
    id: "task-001",
    title: "Complete onboarding for new farmer - Ibrahim Musa",
    description: "Verify documents, collect GPS coordinates, and complete KYC",
    type: "farmer_onboarding",
    priority: "high",
    dueDate: "2024-01-28",
    farmer: { id: "farmer-new-001", name: "Ibrahim Musa" },
    corridor: "Kaduna North",
    assignedTo: { id: "agent-001", name: "Blessing Okonkwo", type: "field_agent" },
    status: "not_started",
    createdBy: "ops-admin",
    createdAt: "2024-01-25T10:00:00Z",
    sla: "48 hours",
  },
  {
    id: "task-002",
    title: "Verify crop yields for contract #1234",
    description: "Measure and document actual yields for Musa Abdullahi. Take photos of harvest and record weight.",
    type: "yield_verification",
    priority: "high",
    dueDate: "2024-01-30",
    farmer: { id: "farmer-001", name: "Musa Abdullahi" },
    corridor: "Kaduna North",
    assignedTo: { id: "agent-001", name: "Blessing Okonkwo", type: "field_agent" },
    status: "in_progress",
    createdBy: "ops-admin",
    createdAt: "2024-01-24T14:00:00Z",
    sla: "72 hours",
  },
  {
    id: "task-003",
    title: "Update GPS coordinates for 5 farms in Zaria cluster",
    description: "Accurate mapping required for service delivery planning",
    type: "data_collection",
    priority: "medium",
    dueDate: "2024-02-01",
    farmer: null,
    corridor: "Kaduna North",
    assignedTo: { id: "agent-002", name: "Chinedu Eze", type: "field_agent" },
    status: "not_started",
    createdBy: "ops-admin",
    createdAt: "2024-01-26T09:00:00Z",
    sla: "1 week",
  },
  {
    id: "task-004",
    title: "Deliver fertilizer to Giwa cluster farms",
    description: "Coordinate NPK delivery for 15 farms in the cluster",
    type: "logistics",
    priority: "high",
    dueDate: "2024-01-29",
    farmer: null,
    corridor: "Kaduna North",
    assignedTo: { id: "partner-001", name: "SwiftAgri Logistics", type: "partner" },
    status: "in_progress",
    createdBy: "ops-admin",
    createdAt: "2024-01-23T11:00:00Z",
    sla: "48 hours",
  },
  {
    id: "task-005",
    title: "Inspect land preparation at Fatima Yusuf farm",
    description: "Verify partner completed plowing service. Document quality and any issues.",
    type: "service_inspection",
    priority: "medium",
    dueDate: "2024-01-29",
    farmer: { id: "farmer-002", name: "Fatima Yusuf" },
    corridor: "Kaduna North",
    assignedTo: { id: "agent-003", name: "Amina Ibrahim", type: "field_agent" },
    status: "completed",
    createdBy: "ops-admin",
    createdAt: "2024-01-20T08:00:00Z",
    completedAt: "2024-01-27T16:30:00Z",
    sla: "24 hours",
  },
]

// Mock agents and partners for assignment
const assignees = {
  agents: [
    { id: "agent-001", name: "Blessing Okonkwo", corridor: "Kaduna North", cluster: "Zaria Central" },
    { id: "agent-002", name: "Chinedu Eze", corridor: "Kaduna North", cluster: "Zaria West" },
    { id: "agent-003", name: "Amina Ibrahim", corridor: "Kaduna North", cluster: "Giwa East" },
    { id: "agent-004", name: "Yakubu Danladi", corridor: "Kaduna North", cluster: "Igabi South" },
  ],
  partners: [
    { id: "partner-001", name: "SwiftAgri Logistics", type: "logistics" },
    { id: "partner-002", name: "FarmTech Mechanization", type: "mechanization" },
    { id: "partner-003", name: "AgriPro Inputs Ltd", type: "inputs" },
  ],
}

const priorityStyles: Record<string, string> = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-blue-100 text-blue-700 border-blue-200",
}

const statusStyles: Record<string, { bg: string; text: string }> = {
  not_started: { bg: "bg-slate-100", text: "text-slate-700" },
  in_progress: { bg: "bg-blue-100", text: "text-blue-700" },
  blocked: { bg: "bg-red-100", text: "text-red-700" },
  completed: { bg: "bg-emerald-100", text: "text-emerald-700" },
  cancelled: { bg: "bg-gray-100", text: "text-gray-700" },
  paused: { bg: "bg-amber-100", text: "text-amber-700" },
}

const taskTypes = [
  { value: "farmer_onboarding", label: "Farmer Onboarding" },
  { value: "yield_verification", label: "Yield Verification" },
  { value: "service_inspection", label: "Service Inspection" },
  { value: "data_collection", label: "Data Collection" },
  { value: "logistics", label: "Logistics" },
  { value: "mechanization", label: "Mechanization" },
  { value: "inputs_delivery", label: "Inputs Delivery" },
]

export default function OpsTasksPage() {
  const [tasks, setTasks] = useState(initialTasks)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<typeof initialTasks[0] | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  // Edit form state
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editPriority, setEditPriority] = useState("")
  const [editDueDate, setEditDueDate] = useState("")
  const [editAssignee, setEditAssignee] = useState("")
  const { toast } = useToast()

  // Task statistics
  const totalTasks = tasks.length
  const pendingTasks = tasks.filter((t) => t.status !== "completed" && t.status !== "cancelled")
  const completedTasks = tasks.filter((t) => t.status === "completed")
  const highPriorityTasks = pendingTasks.filter((t) => t.priority === "high")
  const overdueTasks = pendingTasks.filter((t) => new Date(t.dueDate) < new Date())

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedTo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.farmer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)

    const matchesStatus = filterStatus === "all" || task.status === filterStatus

    return matchesSearch && matchesStatus
  })

  // Create new task
  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const assigneeId = formData.get("assignee") as string
    const assigneeType = formData.get("assigneeType") as string

    let assignee
    if (assigneeType === "field_agent") {
      assignee = assignees.agents.find((a) => a.id === assigneeId)
    } else {
      assignee = assignees.partners.find((p) => p.id === assigneeId)
    }

    const newTask = {
      id: `task-${Date.now()}`,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      type: formData.get("type") as string,
      priority: formData.get("priority") as string,
      dueDate: formData.get("dueDate") as string,
      farmer: formData.get("farmerName")
        ? { id: formData.get("farmerId") as string, name: formData.get("farmerName") as string }
        : null,
      corridor: formData.get("corridor") as string,
      assignedTo: {
        id: assigneeId,
        name: assignee?.name || "Unknown",
        type: assigneeType,
      },
      status: "not_started",
      createdBy: "ops-admin",
      createdAt: new Date().toISOString(),
      sla: formData.get("sla") as string,
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setTasks((prev) => [newTask, ...prev])
    setCreateDialogOpen(false)
    setIsSubmitting(false)

    toast({
      title: "Task Created",
      description: `Task assigned to ${assignee?.name}.`,
    })
  }

  // Update task
  const handleUpdateTask = async (taskId: string, updates: Partial<typeof initialTasks[0]>) => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
    )

    setEditDialogOpen(false)
    setSelectedTask(null)
    setIsSubmitting(false)

    toast({
      title: "Task Updated",
      description: "Task details have been updated.",
    })
  }

  // Cancel task
  const handleCancelTask = async (taskId: string) => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: "cancelled" } : t))
    )

    setIsSubmitting(false)
    toast({
      title: "Task Cancelled",
      description: "The task has been cancelled.",
    })
  }

  // Pause task
  const handlePauseTask = async (taskId: string) => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: "paused" } : t))
    )

    setIsSubmitting(false)
    toast({
      title: "Task Paused",
      description: "The task has been paused.",
    })
  }

  return (
    <DashboardLayout allowedRoles={["ops_admin", "super_admin"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Task Management</h1>
            <p className="text-muted-foreground">
              Create, assign, and manage tasks across field agents and partners
            </p>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-700 hover:bg-emerald-800">
                <Plus className="h-4 w-4 mr-2" />
                Create Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Create and assign a task to a field agent or partner.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateTask}>
                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                  <div className="space-y-2">
                    <Label htmlFor="title">Task Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g., Verify crop yields for contract #1234"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Detailed task instructions..."
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Task Type *</Label>
                      <Select name="type" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {taskTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority *</Label>
                      <Select name="priority" defaultValue="medium">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="corridor">Corridor *</Label>
                      <Select name="corridor" defaultValue="Kaduna North">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Kaduna North">Kaduna North Corridor</SelectItem>
                          <SelectItem value="Kaduna Central">Kaduna Central Corridor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Due Date *</Label>
                      <Input id="dueDate" name="dueDate" type="date" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sla">SLA / Deadline</Label>
                    <Select name="sla" defaultValue="48 hours">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24 hours">24 hours</SelectItem>
                        <SelectItem value="48 hours">48 hours</SelectItem>
                        <SelectItem value="72 hours">72 hours</SelectItem>
                        <SelectItem value="1 week">1 week</SelectItem>
                        <SelectItem value="2 weeks">2 weeks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Assignment</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="assigneeType">Assign To *</Label>
                        <Select name="assigneeType" defaultValue="field_agent">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="field_agent">Field Agent</SelectItem>
                            <SelectItem value="partner">Partner</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assignee">Select Assignee *</Label>
                        <Select name="assignee" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="header-agents" disabled>
                              -- Field Agents --
                            </SelectItem>
                            {assignees.agents.map((agent) => (
                              <SelectItem key={agent.id} value={agent.id}>
                                {agent.name} ({agent.cluster})
                              </SelectItem>
                            ))}
                            <SelectItem value="header-partners" disabled>
                              -- Partners --
                            </SelectItem>
                            {assignees.partners.map((partner) => (
                              <SelectItem key={partner.id} value={partner.id}>
                                {partner.name} ({partner.type})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Related Farmer (Optional)</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="farmerName">Farmer Name</Label>
                        <Input id="farmerName" name="farmerName" placeholder="e.g., Musa Abdullahi" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="farmerId">Farmer ID</Label>
                        <Input id="farmerId" name="farmerId" placeholder="e.g., farmer-001" />
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCreateDialogOpen(false)}
                    className="bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-emerald-700 hover:bg-emerald-800"
                  >
                    {isSubmitting ? "Creating..." : "Create Task"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTasks}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTasks.length}</div>
              <p className="text-xs text-muted-foreground">In progress or not started</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{highPriorityTasks.length}</div>
              <p className="text-xs text-muted-foreground">Requires immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{overdueTasks.length}</div>
              <p className="text-xs text-muted-foreground">Past due date</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{completedTasks.length}</div>
              <p className="text-xs text-muted-foreground">This period</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tasks, assignees, farmers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="not_started">Not Started</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tasks Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[220px]">Task</TableHead>
                  <TableHead className="min-w-[140px]">Assigned To</TableHead>
                  <TableHead className="min-w-[90px]">Priority</TableHead>
                  <TableHead className="min-w-[110px]">Due Date</TableHead>
                  <TableHead className="min-w-[110px]">Status</TableHead>
                  <TableHead className="text-right min-w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => {
                  const statusStyle = statusStyles[task.status] || statusStyles.not_started
                  const isOverdue =
                    new Date(task.dueDate) < new Date() &&
                    task.status !== "completed" &&
                    task.status !== "cancelled"

                  return (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium line-clamp-1">{task.title}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {taskTypes.find((t) => t.value === task.type)?.label || task.type}
                            </Badge>
                            {task.farmer && (
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {task.farmer.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              task.assignedTo.type === "field_agent"
                                ? "bg-blue-500"
                                : "bg-purple-500"
                            }`}
                          />
                          <span className="text-sm">{task.assignedTo.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground capitalize">
                          {task.assignedTo.type.replace("_", " ")}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={priorityStyles[task.priority]}>
                          {task.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className={isOverdue ? "text-red-600 font-medium" : ""}>
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                        {isOverdue && (
                          <span className="text-xs text-red-600">Overdue</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusStyle.bg} ${statusStyle.text} border-0`}>
                          {task.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="bg-transparent">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedTask(task)
                                setEditTitle(task.title)
                                setEditDescription(task.description)
                                setEditPriority(task.priority)
                                setEditDueDate(task.dueDate)
                                setEditAssignee(task.assignedTo.id)
                                setEditDialogOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Task
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedTask(task)
                                setViewDialogOpen(true)
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {task.status !== "completed" && task.status !== "cancelled" && (
                              <>
                                <DropdownMenuItem onClick={() => handlePauseTask(task.id)}>
                                  <Pause className="h-4 w-4 mr-2" />
                                  Pause Task
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleCancelTask(task.id)}
                                  className="text-red-600"
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Cancel Task
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filteredTasks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No tasks found matching your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Task Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>Update task details, deadline, or reassign.</DialogDescription>
            </DialogHeader>
            {selectedTask && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Task Title</Label>
                  <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select value={editPriority} onValueChange={setEditPriority}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Input type="date" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Reassign To</Label>
                  <Select value={editAssignee} onValueChange={setEditAssignee}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {assignees.agents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.name} (Agent)
                        </SelectItem>
                      ))}
                      {assignees.partners.map((partner) => (
                        <SelectItem key={partner.id} value={partner.id}>
                          {partner.name} (Partner)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)} className="bg-transparent">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (selectedTask) {
                    const assignee =
                      assignees.agents.find((a) => a.id === editAssignee) ||
                      assignees.partners.find((p) => p.id === editAssignee)
                    handleUpdateTask(selectedTask.id, {
                      title: editTitle,
                      description: editDescription,
                      priority: editPriority,
                      dueDate: editDueDate,
                      assignedTo: {
                        id: editAssignee,
                        name: assignee?.name || selectedTask.assignedTo.name,
                        type: assignees.agents.find((a) => a.id === editAssignee)
                          ? "field_agent"
                          : "partner",
                      },
                    })
                  }
                }}
                disabled={isSubmitting}
                className="bg-emerald-700 hover:bg-emerald-800"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Task Details Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Task Details</DialogTitle>
              <DialogDescription>View complete task information</DialogDescription>
            </DialogHeader>
            {selectedTask && (
              <div className="space-y-4 py-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Title</p>
                  <p className="text-base">{selectedTask.title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p className="text-sm">{selectedTask.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Type</p>
                    <Badge variant="outline">{selectedTask.type.replace("_", " ")}</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Priority</p>
                    <Badge className={priorityStyles[selectedTask.priority]}>{selectedTask.priority}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Due Date</p>
                    <p className="text-sm">{new Date(selectedTask.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge className={`${statusStyles[selectedTask.status].bg} ${statusStyles[selectedTask.status].text}`}>
                      {selectedTask.status.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Assigned To</p>
                    <p className="text-sm">{selectedTask.assignedTo.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{selectedTask.assignedTo.type.replace("_", " ")}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Corridor</p>
                    <p className="text-sm">{selectedTask.corridor}</p>
                  </div>
                </div>
                {selectedTask.farmer && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Farmer</p>
                    <p className="text-sm">{selectedTask.farmer.name}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">SLA</p>
                    <p className="text-sm">{selectedTask.sla}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created</p>
                    <p className="text-sm">{new Date(selectedTask.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewDialogOpen(false)} className="bg-transparent">
                Close
              </Button>
              <Button
                onClick={() => {
                  setViewDialogOpen(false)
                  if (selectedTask) {
                    setEditTitle(selectedTask.title)
                    setEditDescription(selectedTask.description)
                    setEditPriority(selectedTask.priority)
                    setEditDueDate(selectedTask.dueDate)
                    setEditAssignee(selectedTask.assignedTo.id)
                    setEditDialogOpen(true)
                  }
                }}
                className="bg-emerald-700 hover:bg-emerald-800"
              >
                Edit Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
