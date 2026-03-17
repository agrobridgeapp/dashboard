"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import useSWR from "swr"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Search,
  Filter,
  Activity,
  User,
  Clock,
  FileText,
  ChevronRight,
  ChevronLeft,
  Download,
  RefreshCw,
  Eye,
  Plus,
  CheckCircle2,
  XCircle,
  Pause,
  Play,
  Ban,
  ArrowLeft,
  Loader2,
} from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const actionIcons: Record<string, typeof Activity> = {
  task_created: Plus,
  task_completed: CheckCircle2,
  task_request_approved: CheckCircle2,
  task_request_rejected: XCircle,
  task_request_submitted: FileText,
  corridor_paused: Pause,
  corridor_resumed: Play,
  agent_suspended: Ban,
  agent_activated: CheckCircle2,
  contract_created: Plus,
  delivery_verified: CheckCircle2,
  settlement_approved: CheckCircle2,
}

const actionColors: Record<string, string> = {
  task_created: "bg-blue-100 text-blue-700",
  task_completed: "bg-emerald-100 text-emerald-700",
  task_request_approved: "bg-emerald-100 text-emerald-700",
  task_request_rejected: "bg-red-100 text-red-700",
  task_request_submitted: "bg-blue-100 text-blue-700",
  corridor_paused: "bg-amber-100 text-amber-700",
  corridor_resumed: "bg-emerald-100 text-emerald-700",
  agent_suspended: "bg-red-100 text-red-700",
  agent_activated: "bg-emerald-100 text-emerald-700",
  contract_created: "bg-blue-100 text-blue-700",
  delivery_verified: "bg-emerald-100 text-emerald-700",
  settlement_approved: "bg-emerald-100 text-emerald-700",
}

export default function AuditLogPage() {
  const searchParams = useSearchParams()
  const entityFilter = searchParams.get("entity") || "all"
  const entityIdFilter = searchParams.get("entityId") || ""

  const [selectedEntityType, setSelectedEntityType] = useState(entityFilter)
  const [selectedAction, setSelectedAction] = useState("all")
  const [selectedCorridor, setSelectedCorridor] = useState("all")
  const [searchQuery, setSearchQuery] = useState(entityIdFilter)
  const [selectedLog, setSelectedLog] = useState<any | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const logsPerPage = 10

  const { data: swrResponse, error, isLoading, mutate, isValidating } = useSWR(
    `/api/admin/audit-logs?entityType=${selectedEntityType}&action=${selectedAction}&corridor=${selectedCorridor}&search=${searchQuery}&page=${currentPage}&limit=${logsPerPage}`,
    fetcher,
    { keepPreviousData: true }
  )

  const auditLogs = useMemo(() => swrResponse?.data?.data || [], [swrResponse])
  const totalLogs = swrResponse?.data?.count || 0
  const totalPages = Math.ceil(totalLogs / logsPerPage)

  const handleRefresh = async () => {
    mutate()
  }

  const handleViewDetails = (log: any) => {
    let changes = log.changes
    if (typeof changes === "string") {
      try {
        changes = JSON.parse(changes)
      } catch (e) {
        changes = {}
      }
    }
    setSelectedLog({ ...log, changes })
    setDetailDialogOpen(true)
  }

  const handleExport = () => {
    alert("Export functionality would download audit logs as CSV")
  }

  return (
    <DashboardLayout allowedRoles={["ops_admin", "super_admin"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/ops/control-center">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Control Center
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Platform Audit Log</h1>
              <p className="text-muted-foreground">
                Complete record of all platform actions and changes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isValidating}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isValidating ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              <Select value={selectedEntityType} onValueChange={(v) => { setSelectedEntityType(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Entity Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  <SelectItem value="farmer">Farmers</SelectItem>
                  <SelectItem value="task">Tasks</SelectItem>
                  <SelectItem value="task_request">Task Requests</SelectItem>
                  <SelectItem value="corridor">Corridors</SelectItem>
                  <SelectItem value="agent">Agents</SelectItem>
                  <SelectItem value="partner">Partners</SelectItem>
                  <SelectItem value="contract">Contracts</SelectItem>
                  <SelectItem value="delivery">Deliveries</SelectItem>
                  <SelectItem value="settlement">Settlements</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedAction} onValueChange={(v) => { setSelectedAction(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Action Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="task_created">Task Created</SelectItem>
                  <SelectItem value="task_completed">Task Completed</SelectItem>
                  <SelectItem value="task_request_approved">Request Approved</SelectItem>
                  <SelectItem value="task_request_rejected">Request Rejected</SelectItem>
                  <SelectItem value="corridor_paused">Corridor Paused</SelectItem>
                  <SelectItem value="agent_suspended">Agent Suspended</SelectItem>
                  <SelectItem value="settlement_approved">Settlement Approved</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedCorridor} onValueChange={(v) => { setSelectedCorridor(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Corridor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Corridors</SelectItem>
                  <SelectItem value="Kaduna North">Kaduna North</SelectItem>
                  <SelectItem value="Kaduna Central">Kaduna Central</SelectItem>
                  <SelectItem value="Niger East">Niger East</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by user, entity name, or ID..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="pl-9"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Log Table */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Audit Log ({totalLogs} entries)
            </CardTitle>
            <CardDescription>
              Every action on the platform is recorded with full traceability
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && !auditLogs.length ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p>Loading audit logs...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 text-destructive">
                <XCircle className="h-8 w-8 mb-4" />
                <p>Failed to load audit logs. Please try again.</p>
                <Button variant="link" onClick={handleRefresh} className="mt-2">Retry</Button>
              </div>
            ) : auditLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Search className="h-8 w-8 mb-4 opacity-20" />
                <p>No audit logs found matching your criteria.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Entity</TableHead>
                        <TableHead>Corridor</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogs.map((log: any) => {
                        const ActionIcon = actionIcons[log.action] || Activity
                        return (
                          <TableRow key={log.id}>
                            <TableCell className="whitespace-nowrap">
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p>{new Date(log.timestamp).toLocaleDateString()}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(log.timestamp).toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{log.user_name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={actionColors[log.action] || "bg-slate-100 text-slate-700"}
                              >
                                <ActionIcon className="h-3 w-3 mr-1" />
                                {log.action.replace(/_/g, " ")}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium text-sm">{log.entity_name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {log.entity_type} • {log.entity_id}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {log.corridor || "Global"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm text-muted-foreground max-w-[200px] truncate">
                                {log.description}
                              </p>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewDetails(log)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                      Showing {(currentPage - 1) * logsPerPage + 1} to{" "}
                      {Math.min(currentPage * logsPerPage, totalLogs)} of {totalLogs} entries
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Detail Dialog */}
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Audit Log Details</DialogTitle>
              <DialogDescription>
                Complete details of this platform action
              </DialogDescription>
            </DialogHeader>
            {selectedLog && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Timestamp</p>
                    <p className="font-medium">
                      {new Date(selectedLog.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">User</p>
                    <p className="font-medium">{selectedLog.user_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Action</p>
                    <Badge
                      variant="outline"
                      className={actionColors[selectedLog.action] || "bg-slate-100 text-slate-700"}
                    >
                      {selectedLog.action.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Corridor</p>
                    <p className="font-medium">{selectedLog.corridor || "Global"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Entity Type</p>
                    <p className="font-medium capitalize">{selectedLog.entity_type.replace(/_/g, " ")}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Entity ID</p>
                    <p className="font-medium font-mono text-sm">{selectedLog.entity_id}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Entity Name</p>
                  <p className="font-medium">{selectedLog.entity_name}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
                  <p>{selectedLog.description}</p>
                </div>

                {selectedLog.changes && Object.keys(selectedLog.changes).length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Changes</p>
                    <Card className="border-border/50">
                      <CardContent className="p-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Field</TableHead>
                              <TableHead>Before</TableHead>
                              <TableHead>After</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {Object.entries(selectedLog.changes).map(([field, change]: [string, any]) => (
                              <TableRow key={field}>
                                <TableCell className="font-medium capitalize">
                                  {field.replace(/([A-Z])/g, " $1").trim()}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {change.before === null ? <span className="italic">null</span> : String(change.before)}
                                </TableCell>
                                <TableCell className="text-emerald-700 font-medium">
                                  {String(change.after)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">IP Address</p>
                    <p className="font-mono text-sm">{selectedLog.ip_address || "Unknown"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Log ID</p>
                    <p className="font-mono text-sm">{selectedLog.id}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
