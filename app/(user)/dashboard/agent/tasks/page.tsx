"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Plus, Calendar, AlertCircle } from "lucide-react"

const priorityStyles: Record<string, string> = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-blue-100 text-blue-700 border-blue-200",
}

const STORAGE_KEY = "agrobridge_agent_tasks"

export default function AgentTasksPage() {
  const [tasks, setTasks] = useState<any[]>(() => {
    if (typeof window === "undefined") return []
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [newTaskOpen, setNewTaskOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch {
      // Storage quota exceeded or unavailable — silently ignore
    }
  }, [tasks])

  const pendingTasks = tasks.filter((t) => t.status === "pending")
  const completedTasks = tasks.filter((t) => t.status === "completed")

  const toggleTask = (taskId: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: t.status === "pending" ? "completed" : "pending" } : t)),
    )
  }

  const handleAddTask = (formData: FormData) => {
    const newTask = {
      id: Date.now(),
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      priority: formData.get("priority") as string,
      due: formData.get("due") as string,
      farmer: (formData.get("farmer") as string) || null,
      status: "pending",
    }
    setTasks((prev) => [newTask, ...prev])
    setNewTaskOpen(false)
  }

  const TaskItem = ({ task }: { task: (typeof tasks)[0] }) => (
    <div className="flex items-start gap-4 p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
      <Checkbox checked={task.status === "completed"} onCheckedChange={() => toggleTask(task.id)} className="mt-1" />
      <div className="flex-1 min-w-0">
        <p className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
          {task.title}
        </p>
        <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
        <div className="flex items-center gap-3 mt-2">
          <Badge variant="outline" className={priorityStyles[task.priority]}>
            {task.priority}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {task.due}
          </span>
          {task.farmer && <span className="text-xs text-muted-foreground">• {task.farmer}</span>}
        </div>
      </div>
    </div>
  )

  return (
    <DashboardLayout allowedRoles={["field_agent"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
            <p className="text-muted-foreground">Manage your daily tasks and assignments</p>
          </div>
          <Dialog open={newTaskOpen} onOpenChange={setNewTaskOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogDescription>Create a new task for yourself</DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleAddTask(new FormData(e.currentTarget))
                }}
              >
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Task Title</Label>
                    <Input id="title" name="title" placeholder="Enter task title" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" placeholder="Task details..." rows={3} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
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
                    <div className="space-y-2">
                      <Label htmlFor="due">Due Date</Label>
                      <Input id="due" name="due" placeholder="e.g., Tomorrow" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="farmer">Related Farmer (optional)</Label>
                    <Input id="farmer" name="farmer" placeholder="Farmer name" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setNewTaskOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Task</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingTasks.length}</p>
                  <p className="text-sm text-muted-foreground">Pending Tasks</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingTasks.filter((t) => t.priority === "high").length}</p>
                  <p className="text-sm text-muted-foreground">High Priority</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                  <AlertCircle className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{completedTasks.length}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">Pending ({pendingTasks.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="pending" className="mt-4">
            <Card className="border-border/50">
              <CardContent className="p-4 space-y-3">
                {pendingTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
                {pendingTasks.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">All tasks completed!</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="completed" className="mt-4">
            <Card className="border-border/50">
              <CardContent className="p-4 space-y-3">
                {completedTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
                {completedTasks.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No completed tasks yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
