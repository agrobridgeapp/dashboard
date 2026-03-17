"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import {
  UserPlus, Search, CheckCircle2, XCircle, Clock, Eye,
  MapPin, Phone, Mail, RefreshCw, LinkIcon, Loader2, Copy, ExternalLink,
} from "lucide-react"

type Registration = {
  id: string
  role: "field_agent" | "farmer"
  first_name: string
  last_name: string
  phone: string
  email: string | null
  status: "pending" | "approved" | "rejected" | "invited" | "active"
  state_name: string | null
  lga_name: string | null
  community_name: string | null
  created_at: string
  reviewed_at: string | null
  invite_sent_to: string | null
}

type ApiResponse = { registrations: Registration[]; counts: Record<string, number> }


function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string; icon: React.ReactNode }> = {
    pending: { cls: "border-amber-400 text-amber-700 bg-amber-50 dark:bg-amber-900/20", label: "Pending", icon: <Clock className="h-3 w-3 mr-1" /> },
    approved:         { cls: "border-emerald-500 text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20", label: "Approved", icon: <CheckCircle2 className="h-3 w-3 mr-1" /> },
    invited:          { cls: "border-blue-400 text-blue-700 bg-blue-50 dark:bg-blue-900/20", label: "Invited", icon: <Mail className="h-3 w-3 mr-1" /> },
    rejected:         { cls: "border-destructive text-destructive bg-destructive/5", label: "Rejected", icon: <XCircle className="h-3 w-3 mr-1" /> },
  }
  const { cls, label, icon } = map[status] ?? map.pending
  return <Badge variant="outline" className={cls}>{icon}{label}</Badge>
}

function RoleBadge({ role }: { role: string }) {
  return (
    <Badge variant="secondary" className={role === "field_agent" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"}>
      {role === "field_agent" ? "Field Agent" : "Farmer"}
    </Badge>
  )
}

export default function RegistrationQueuePage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab]         = useState("pending")
  const [roleFilter, setRoleFilter]       = useState("all")
  const [search, setSearch]               = useState("")
  const [selectedReg, setSelectedReg]     = useState<Registration | null>(null)
  const [detailOpen, setDetailOpen]       = useState(false)
  const [approveOpen, setApproveOpen]     = useState(false)
  const [rejectOpen, setRejectOpen]       = useState(false)
  const [inviteEmail, setInviteEmail]     = useState("")
  const [opsNotes, setOpsNotes]           = useState("")
  const [rejectReason, setRejectReason]   = useState("")
  const [actionLoading, setActionLoading] = useState(false)
  const [generatedLink, setGeneratedLink] = useState("")

  const [data, setData] = useState<ApiResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchRegistrations = useCallback(async () => {
    setIsLoading(true)
    try {
      const qs = new URLSearchParams({
        status: activeTab,
        ...(roleFilter !== "all" && { role: roleFilter }),
        ...(search && { search }),
      }).toString()
      const res = await fetch(`/api/auth/registrations?${qs}`)
      const json = await res.json()
      if (res.ok) {
        setData(json)
      }
    } catch (err) {
      console.error("Failed to fetch registrations:", err)
      toast({ title: "Error", description: "Failed to load registrations", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }, [activeTab, roleFilter, search, toast])

  useEffect(() => {
    fetchRegistrations()
  }, [fetchRegistrations])

  const mutate = () => fetchRegistrations()

  const registrations = data?.registrations ?? []
  const counts = data?.counts ?? {}

  const openApprove = (reg: Registration) => { setSelectedReg(reg); setInviteEmail(reg.email ?? ""); setOpsNotes(""); setGeneratedLink(""); setApproveOpen(true) }
  const openReject  = (reg: Registration) => { setSelectedReg(reg); setRejectReason(""); setOpsNotes(""); setRejectOpen(true) }
  const openDetail  = (reg: Registration) => { setSelectedReg(reg); setGeneratedLink(""); setDetailOpen(true) }

  const handleApprove = async () => {
    if (!selectedReg) return
    setActionLoading(true)
    try {
      const res  = await fetch(`/api/auth/register/${selectedReg.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "approve", inviteEmail: inviteEmail || undefined, opsNotes: opsNotes || undefined }) })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      mutate()
      setApproveOpen(false)
      if (json.invite?.link) { setGeneratedLink(json.invite.link); setDetailOpen(true) }
      toast({ title: "Registration approved", description: `Invite link generated for ${selectedReg.first_name} ${selectedReg.last_name}` })
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally { setActionLoading(false) }
  }

  const handleReject = async () => {
    if (!selectedReg) return
    setActionLoading(true)
    try {
      const res  = await fetch(`/api/auth/register/${selectedReg.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "reject", rejectionReason: rejectReason || undefined, opsNotes: opsNotes || undefined }) })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      mutate()
      setRejectOpen(false)
      toast({ title: "Registration rejected" })
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally { setActionLoading(false) }
  }

  const tabCounts = (key: string, label: string) => `${label}${counts[key] ? ` (${counts[key]})` : ""}`

  return (
    <DashboardLayout allowedRoles={["ops_admin", "super_admin"]}>
      <div className="space-y-6 p-4 lg:p-6">

        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Registration Queue</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Review Agent and Farmer registration requests before granting access</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => mutate()}>
            <RefreshCw className="h-4 w-4 mr-2" />Refresh
          </Button>
        </div>

        {/* Stat chips */}
        <div className="flex flex-wrap gap-3">
          {[
            { key: "pending", label: "Pending", cls: "text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800" },
            { key: "approved",         label: "Approved / Invited", cls: "text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800" },
            { key: "rejected",         label: "Rejected", cls: "text-destructive bg-destructive/5 border-destructive/20" },
          ].map(({ key, label, cls }) => (
            <div key={key} className={`border rounded-lg px-4 py-2 text-sm font-medium ${cls}`}>
              <span className="text-2xl font-bold mr-2">{counts[key] ?? 0}</span>{label}
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name or phone..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="field_agent">Agents only</SelectItem>
              <SelectItem value="farmer">Farmers only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full overflow-x-auto flex w-max gap-0">
            <TabsTrigger value="pending">{tabCounts("pending", "Pending")}</TabsTrigger>
            <TabsTrigger value="approved">{tabCounts("approved", "Approved")}</TabsTrigger>
            <TabsTrigger value="rejected">{tabCounts("rejected", "Rejected")}</TabsTrigger>
          </TabsList>

          {(["pending", "approved", "rejected"] as const).map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-4 space-y-3">
              {isLoading ? (
                <div className="flex items-center justify-center py-16 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />Loading...
                </div>
              ) : registrations.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <UserPlus className="h-10 w-10 text-muted-foreground/30 mb-3" />
                    <p className="font-medium text-muted-foreground">No {tab.replace("_", " ")} registrations</p>
                  </CardContent>
                </Card>
              ) : (
                registrations.map((reg) => (
                  <Card key={reg.id} className="border-border/50 hover:border-border transition-colors">
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold">{reg.first_name} {reg.last_name}</span>
                            <RoleBadge role={reg.role} />
                            <StatusBadge status={reg.status} />
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{reg.phone}</span>
                            {reg.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{reg.email}</span>}
                            {(reg.state_name || reg.lga_name) && (
                              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{[reg.lga_name, reg.state_name].filter(Boolean).join(", ")}</span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Submitted {new Date(reg.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button variant="outline" size="sm" onClick={() => openDetail(reg)}>
                            <Eye className="h-4 w-4 sm:mr-1" /><span className="hidden sm:inline">View</span>
                          </Button>
                          {tab === "pending" && (
                            <>
                              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => openApprove(reg)}>
                                <CheckCircle2 className="h-4 w-4 sm:mr-1" /><span className="hidden sm:inline">Approve</span>
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => openReject(reg)}>
                                <XCircle className="h-4 w-4 sm:mr-1" /><span className="hidden sm:inline">Reject</span>
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Registration Detail</DialogTitle>
            <DialogDescription>{selectedReg?.first_name} {selectedReg?.last_name}</DialogDescription>
          </DialogHeader>
          {selectedReg && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Role</p><RoleBadge role={selectedReg.role} /></div>
                <div><p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Status</p><StatusBadge status={selectedReg.status} /></div>
                <div><p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Phone</p><p>{selectedReg.phone}</p></div>
                <div><p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Email</p><p>{selectedReg.email ?? "Not provided"}</p></div>
                {selectedReg.state_name && <div><p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">State</p><p>{selectedReg.state_name}</p></div>}
                {selectedReg.lga_name && <div><p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">LGA</p><p>{selectedReg.lga_name}</p></div>}
                {selectedReg.community_name && <div className="col-span-2"><p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Community</p><p>{selectedReg.community_name}</p></div>}
              </div>

              {generatedLink && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />Invite Link Generated
                  </p>
                  <div className="flex gap-2 items-center bg-muted rounded-md p-2">
                    <code className="text-xs flex-1 break-all truncate">{generatedLink}</code>
                    <Button size="sm" variant="ghost" className="flex-shrink-0" onClick={() => { navigator.clipboard.writeText(generatedLink); toast({ title: "Copied to clipboard" }) }}>
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Send this link to the registrant. Expires in 7 days.</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailOpen(false)}>Close</Button>
            {selectedReg?.status === "pending" && (
              <>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => { setDetailOpen(false); openApprove(selectedReg) }}>Approve</Button>
                <Button variant="destructive" onClick={() => { setDetailOpen(false); openReject(selectedReg) }}>Reject</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Registration</DialogTitle>
            <DialogDescription>Approving {selectedReg?.first_name} {selectedReg?.last_name}. An invite link will be generated so they can create their password.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="inviteEmail">Invite Email {selectedReg?.role === "field_agent" && <span className="text-destructive">*</span>}</Label>
              <Input id="inviteEmail" type="email" placeholder="email@example.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
              <p className="text-xs text-muted-foreground">The registrant will use this to access their invite link.</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="opsNotes">Ops Notes <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Textarea id="opsNotes" rows={2} placeholder="Internal notes about this approval..." value={opsNotes} onChange={(e) => setOpsNotes(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveOpen(false)} disabled={actionLoading}>Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleApprove} disabled={actionLoading || (selectedReg?.role === "field_agent" && !inviteEmail)}>
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
              Approve &amp; Generate Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Registration</DialogTitle>
            <DialogDescription>{selectedReg?.first_name} {selectedReg?.last_name}'s request will be rejected.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="rejectReason">Reason for Rejection</Label>
              <Textarea id="rejectReason" rows={3} placeholder="e.g. Outside active corridor, incomplete information..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rejectNotes">Internal Notes <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Textarea id="rejectNotes" rows={2} value={opsNotes} onChange={(e) => setOpsNotes(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)} disabled={actionLoading}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
