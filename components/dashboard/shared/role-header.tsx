"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth, type User, type UserRole } from "@/lib/auth-context"
import { DemoBadge } from "@/components/demo/demo-badge"
import { DemoAdminPanel } from "@/components/demo/demo-admin-panel"

// Sample notifications per role
const notificationsByRole: Record<UserRole, { title: string; description: string; time: string }[]> = {
  super_admin: [
    { title: "System update", description: "Platform maintenance scheduled for tonight", time: "1h ago" },
    { title: "New partner", description: "AgriTech Solutions pending verification", time: "3h ago" },
  ],
  ops_admin: [
    { title: "New service request", description: "Farmer Musa Abdullahi requested plowing service", time: "5m ago" },
    { title: "Contract completed", description: "Offtake contract #1234 marked as fulfilled", time: "1h ago" },
    { title: "Partner joined", description: "AgriPro Inputs verified and activated", time: "2h ago" },
  ],
  field_agent: [
    { title: "New farmer assigned", description: "Ibrahim Garba assigned to your portfolio", time: "10m ago" },
    { title: "Visit reminder", description: "Farm visit scheduled for tomorrow at 9 AM", time: "30m ago" },
    { title: "Task completed", description: "Soil sampling task marked complete", time: "1h ago" },
  ],
  farmer: [
    { title: "Service approved", description: "Your plowing request has been approved", time: "15m ago" },
    { title: "Payment received", description: "NGN 150,000 credited to your account", time: "2h ago" },
    { title: "Contract update", description: "New delivery schedule available", time: "1d ago" },
  ],
  partner: [
    { title: "New job assigned", description: "Plowing job for 5 hectares in Zaria", time: "5m ago" },
    { title: "Payment processed", description: "NGN 85,000 transferred to your account", time: "3h ago" },
    { title: "Rating received", description: "You received a 5-star rating from Musa A.", time: "1d ago" },
  ],
  offtaker: [
    { title: "Delivery incoming", description: "500kg maize delivery scheduled for today", time: "20m ago" },
    { title: "Contract milestone", description: "Contract #1234 reached 75% fulfillment", time: "4h ago" },
    { title: "New farmer available", description: "12 new farmers in your region", time: "1d ago" },
  ],
  state_coordinator: [
    { title: "Agent needs support", description: "Grace Adeyemi flagged a verification issue", time: "1h ago" },
    { title: "Monthly report due", description: "Submit your team performance report by Friday", time: "2h ago" },
    { title: "New agent onboarded", description: "Chioma Okafor completed training", time: "1d ago" },
  ],
  regional_manager: [
    { title: "Corridor target alert", description: "Kaduna corridor at 68% of monthly target", time: "30m ago" },
    { title: "Budget review required", description: "Q1 budget variance needs your approval", time: "3h ago" },
    { title: "New coordinator assigned", description: "John Adeleke assigned to Plateau State", time: "1d ago" },
  ],
}

interface RoleHeaderProps {
  user: User
  onMenuClick: () => void
}

export function RoleHeader({ user, onMenuClick }: RoleHeaderProps) {
  const { logout, isDemo } = useAuth()
  const [profileOpen, setProfileOpen] = useState(false)
  const notifications = notificationsByRole[user.role] || []

  const dashboardBase = user.role === "ops_admin" ? "/dashboard/ops" : `/dashboard/${user.role}`

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-card px-4 lg:px-6">
        <Button variant="ghost" size="icon" className="lg:hidden flex-shrink-0" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        <div className="flex-1 flex items-center gap-3 min-w-0">
          <DemoBadge />

          <div className="relative hidden sm:flex max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9 h-9 bg-background border-border text-sm" />
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {isDemo && (user.role === "super_admin" || user.role === "ops_admin") && <DemoAdminPanel />}

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-primary">
                  {notifications.length}
                </Badge>
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                Notifications
                <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary">
                  Mark all read
                </Button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notification, i) => (
                <DropdownMenuItem key={i} className="flex flex-col items-start gap-1 py-3 cursor-pointer">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium text-sm">{notification.title}</span>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{notification.description}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-primary cursor-pointer text-sm">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 h-9 px-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.region}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setProfileOpen(true)} className="cursor-pointer">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`${dashboardBase}/settings`}>Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Profile Modal */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>My Profile</DialogTitle>
            <DialogDescription>Your account information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarFallback className="bg-primary text-primary-foreground text-lg font-medium">
                  {user.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-muted-foreground capitalize">{user.role.replace("_", " ")}</p>
              </div>
            </div>
            <div className="space-y-3 pt-4 border-t">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="text-sm font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Phone</span>
                <span className="text-sm font-medium">{user.phone || "Not set"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Region</span>
                <span className="text-sm font-medium">{user.region || "Not set"}</span>
              </div>
              {user.companyName && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Company</span>
                  <span className="text-sm font-medium">{user.companyName}</span>
                </div>
              )}
              {user.farmSize && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Farm Size</span>
                  <span className="text-sm font-medium">{user.farmSize}</span>
                </div>
              )}
            </div>
            <div className="pt-4">
              <Button className="w-full bg-transparent" variant="outline" onClick={() => setProfileOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
