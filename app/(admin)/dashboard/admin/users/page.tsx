"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { UserPlus, Search, MoreVertical, Edit, Trash2, Lock } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"
import { PaginationControls } from "@/components/ui/pagination-controls"

interface PlatformUser {
  id: string
  first_name: string
  last_name: string
  name?: string // Legacy fallback
  email: string
  role: string
  status: string
  phone?: string
  region?: string
  created_at?: string
}

const roleLabels: Record<string, string> = {
  ops_admin: "Ops Admin",
  regional_manager: "Regional Manager",
  state_coordinator: "State Coordinator",
  field_agent: "Field Agent",
  super_admin: "Super Admin",
}

export default function UserManagement() {
  const [searchQuery, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [users, setUsers] = useState<PlatformUser[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "field_agent" as const,
    region: "",
  })

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await apiClient.admin.listUsers({
        role: roleFilter !== "all" ? roleFilter : undefined,
        search: searchQuery || undefined,
      })
      if (res.success) { setUsers(res.data.users); setPage(1) }
    } catch (err) {
      console.error("[UserManagement] Failed to fetch users:", err)
      toast.error("Failed to load users")
    } finally {
      setLoading(false)
    }
  }, [roleFilter, searchQuery])

  useEffect(() => {
    const timeout = setTimeout(fetchUsers, 300)
    return () => clearTimeout(timeout)
  }, [fetchUsers])

  const handleCreateUser = async () => {
    try {
      const res = await apiClient.admin.createUser(newUser)
      if (res.success) {
        toast.success(`User ${newUser.first_name} ${newUser.last_name} created successfully`)
        setIsCreateDialogOpen(false)
        setNewUser({ first_name: "", last_name: "", email: "", phone: "", role: "field_agent", region: "" })
        fetchUsers()
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create user")
    }
  }

  const handleDeleteUser = async (user: PlatformUser) => {
    try {
      await apiClient.admin.deleteUser(user.id)
      toast.success(`User ${user.first_name} ${user.last_name} deleted`)
      fetchUsers()
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user")
    }
  }

  const handleResetPassword = (_user: PlatformUser) => {
    toast.info("Password reset link sent (feature coming soon)")
  }

  const handleEditUser = (_user: PlatformUser) => {
    toast.info("Edit user feature coming soon")
  }

  return (
    <DashboardLayout role="super_admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground mt-1">Create and manage platform users</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Create User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>Add a new user to the AgroBridge platform</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      placeholder="John"
                      value={newUser.first_name}
                      onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      placeholder="Doe"
                      value={newUser.last_name}
                      onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+234 800 000 0000"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value as any })}>
                    <SelectTrigger id="role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ops_admin">Ops Admin</SelectItem>
                      <SelectItem value="regional_manager">Regional Manager</SelectItem>
                      <SelectItem value="state_coordinator">State Coordinator</SelectItem>
                      <SelectItem value="field_agent">Field Agent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region/Area</Label>
                  <Input
                    id="region"
                    placeholder="e.g., Kaduna Region"
                    value={newUser.region}
                    onChange={(e) => setNewUser({ ...newUser, region: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateUser} disabled={!newUser.first_name || !newUser.last_name || !newUser.email}>
                  Create User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by first name, last name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="ops_admin">Ops Admin</SelectItem>
                  <SelectItem value="regional_manager">Regional Manager</SelectItem>
                  <SelectItem value="state_coordinator">State Coordinator</SelectItem>
                  <SelectItem value="field_agent">Field Agent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Users</CardTitle>
            <CardDescription>
              {loading ? "Loading..." : `${users.length} user${users.length !== 1 ? "s" : ""} found`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
              ) : users.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No users found</p>
              ) : (
                users.slice((page - 1) * 20, page * 20).map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-semibold text-primary">
                          {user.first_name?.[0]?.toUpperCase()}{user.last_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{user.first_name} {user.last_name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <Badge variant="secondary">{roleLabels[user.role] ?? user.role}</Badge>
                        {user.region && <p className="text-xs text-muted-foreground mt-1">{user.region}</p>}
                      </div>
                      <div className="text-right min-w-24">
                        <Badge
                          variant="outline"
                          className={
                            user.status === "active"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-50 text-slate-700 border-slate-200"
                          }
                        >
                          {user.status ?? "Active"}
                        </Badge>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                            <Lock className="h-4 w-4 mr-2" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteUser(user)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        <PaginationControls
          page={page}
          pages={Math.ceil(users.length / 20)}
          total={users.length}
          limit={20}
          onPageChange={setPage}
        />
      </div>
    </DashboardLayout>
  )
}
