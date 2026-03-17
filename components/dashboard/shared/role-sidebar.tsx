"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Tractor,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Handshake,
  Package,
  MapPin,
  ClipboardList,
  Truck,
  Wallet,
  Calendar,
  HelpCircle,
  TrendingUp,
  Home,
  Leaf,
  Wrench,
  UserPlus,
  Wheat,
  Map,
  Bell,
  CreditCard,
  Target,
  Award,
  DollarSign,
  Trophy,
  UserCog,
  Database,
  ShieldCheck,
  MessageSquarePlus,
  Gauge,
  Eye,
  AlertTriangle,
  Banknote,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth, type UserRole } from "@/lib/auth-context"

interface NavItem {
  name: string
  href: string
  icon: typeof LayoutDashboard
}

const navigationByRole: Record<UserRole, NavItem[]> = {
  super_admin: [
    // Admin-specific pages
    { name: "Admin Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "User Management", href: "/dashboard/admin/users", icon: UserCog },
    { name: "System Metrics", href: "/dashboard/admin/analytics", icon: Gauge },
    { name: "System Health", href: "/dashboard/admin/system", icon: Database },
    // Full Operations visibility (same as ops_admin)
    { name: "Ops Dashboard", href: "/dashboard/ops", icon: Target },
    { name: "Registration Queue", href: "/dashboard/ops/registrations", icon: UserPlus },
    { name: "Control Center", href: "/dashboard/ops/control-center", icon: Eye },
    { name: "Task Management", href: "/dashboard/ops/tasks", icon: ClipboardList },
    { name: "Task Requests", href: "/dashboard/ops/task-requests", icon: Bell },
    { name: "Corridors", href: "/dashboard/ops/corridors", icon: Map },
    { name: "Field Operations", href: "/dashboard/ops/field-operations", icon: Users },
    { name: "Unassigned Farmers", href: "/dashboard/ops/farmers/unassigned", icon: UserPlus },
    { name: "Partners", href: "/dashboard/ops/partners", icon: Handshake },
    { name: "Unit Economics", href: "/dashboard/ops/revenue", icon: DollarSign },
    { name: "Contracts", href: "/dashboard/ops/contracts", icon: FileText },
    { name: "Settlement", href: "/dashboard/ops/settlement", icon: CreditCard },
    { name: "Partner Inventory Visibility", href: "/dashboard/ops/inventory", icon: Eye },
    { name: "Assisted Supply", href: "/dashboard/ops/assisted-supply", icon: AlertTriangle },
    { name: "Price Review Queue", href: "/dashboard/ops/price-review", icon: Banknote },
    { name: "Audit Log", href: "/dashboard/ops/audit-log", icon: Database },
  ],
  ops_admin: [
    { name: "Dashboard", href: "/dashboard/ops", icon: LayoutDashboard },
    { name: "Registration Queue", href: "/dashboard/ops/registrations", icon: UserPlus },
    { name: "Control Center", href: "/dashboard/ops/control-center", icon: Target },
    { name: "Task Management", href: "/dashboard/ops/tasks", icon: ClipboardList },
    { name: "Task Requests", href: "/dashboard/ops/task-requests", icon: Bell },
    { name: "Corridors", href: "/dashboard/ops/corridors", icon: Map },
    { name: "Field Operations", href: "/dashboard/ops/field-operations", icon: Users },
    { name: "Unassigned Farmers", href: "/dashboard/ops/farmers/unassigned", icon: UserPlus },
    { name: "Partners", href: "/dashboard/ops/partners", icon: Handshake },
    { name: "Unit Economics", href: "/dashboard/ops/revenue", icon: DollarSign },
    { name: "Contracts", href: "/dashboard/ops/contracts", icon: FileText },
    { name: "Settlement", href: "/dashboard/ops/settlement", icon: CreditCard },
    { name: "Partner Inventory Visibility", href: "/dashboard/ops/inventory", icon: Eye },
    { name: "Assisted Supply", href: "/dashboard/ops/assisted-supply", icon: AlertTriangle },
    { name: "Price Review Queue", href: "/dashboard/ops/price-review", icon: Banknote },
    { name: "Audit Log", href: "/dashboard/ops/audit-log", icon: Database },
  ],
  field_agent: [
    { name: "Dashboard", href: "/dashboard/agent", icon: LayoutDashboard },
    { name: "Tasks", href: "/dashboard/agent/tasks", icon: ClipboardList },
    { name: "Services", href: "/dashboard/agent/services", icon: Wrench },
    { name: "Yield Capture", href: "/dashboard/agent/yield", icon: Wheat },
    { name: "Farm Visits", href: "/dashboard/agent/visits", icon: MapPin },
    { name: "Register Farmer", href: "/dashboard/agent/register", icon: UserPlus },
    { name: "My Farmers", href: "/dashboard/agent/farmers", icon: Users },
    { name: "Crop Cycles", href: "/dashboard/agent/crop-cycles", icon: Leaf },
    { name: "Supply Declarations", href: "/dashboard/agent/supply-declarations", icon: FileText },
    { name: "Earnings & Performance", href: "/dashboard/agent/commission", icon: Wallet },
  ],
  farmer: [
    { name: "Dashboard", href: "/dashboard/farmer", icon: Home },
    { name: "My Farm", href: "/dashboard/farmer/farm", icon: Leaf },
    { name: "Service Requests", href: "/dashboard/farmer/requests", icon: Tractor },
    { name: "Contracts", href: "/dashboard/farmer/contracts", icon: FileText },
    { name: "Deliveries", href: "/dashboard/farmer/deliveries", icon: Truck },
    { name: "Settlements", href: "/dashboard/farmer/payments", icon: Wallet },
  ],
  partner: [
    { name: "Dashboard", href: "/dashboard/partner", icon: LayoutDashboard },
    { name: "Job Requests", href: "/dashboard/partner/jobs", icon: ClipboardList },
    { name: "Schedule", href: "/dashboard/partner/schedule", icon: Calendar },
    { name: "Declared Capacity", href: "/dashboard/partner/inventory", icon: Package },
    { name: "Settlements", href: "/dashboard/partner/earnings", icon: Wallet },
    { name: "Performance", href: "/dashboard/partner/performance", icon: TrendingUp },
  ],
  offtaker: [
    { name: "Dashboard", href: "/dashboard/offtaker", icon: LayoutDashboard },
    { name: "Supply Assurance", href: "/dashboard/offtaker/supply-assurance", icon: ShieldCheck },
    { name: "AgroBridge Contracts", href: "/dashboard/offtaker/contracts", icon: FileText },
    { name: "Corridors", href: "/dashboard/offtaker/corridors", icon: Map },
    { name: "Deliveries", href: "/dashboard/offtaker/deliveries", icon: Truck },
    { name: "Planning Interests", href: "/dashboard/offtaker/planning-interests", icon: MessageSquarePlus },
  ],
  state_coordinator: [
    { name: "Dashboard", href: "/dashboard/coordinator", icon: LayoutDashboard },
    { name: "My Agents", href: "/dashboard/coordinator/agents", icon: Users },
    { name: "Agent Leaderboard", href: "/dashboard/coordinator/agents/leaderboard", icon: Trophy },
    { name: "Unassigned Farmers", href: "/dashboard/coordinator/farmers/unassigned", icon: UserPlus },
    { name: "Performance", href: "/dashboard/coordinator/performance", icon: TrendingUp },
    { name: "Pending Reviews", href: "/dashboard/coordinator/reviews", icon: ClipboardList },
    { name: "Farmers Overview", href: "/dashboard/coordinator/farmers", icon: Target },
    { name: "Corridors", href: "/dashboard/coordinator/corridors", icon: Map },
  ],
  regional_manager: [
    { name: "Dashboard", href: "/dashboard/regional", icon: LayoutDashboard },
    { name: "State Coordinators", href: "/dashboard/regional/coordinators", icon: Award },
    { name: "Regional Performance", href: "/dashboard/regional/performance", icon: TrendingUp },
    { name: "Flags & Interventions", href: "/dashboard/regional/alerts", icon: Bell },
    { name: "Farmers Overview", href: "/dashboard/regional/farmers", icon: Target },
    { name: "Corridor Summary", href: "/dashboard/regional/analytics", icon: BarChart3 },
  ],
}

const productLabels: Record<UserRole, { product: string; isAdmin: boolean }> = {
  super_admin: { product: "AgroBridge Admin", isAdmin: true },
  ops_admin: { product: "AgroBridge Admin", isAdmin: true },
  regional_manager: { product: "AgroBridge Admin", isAdmin: true },
  state_coordinator: { product: "AgroBridge Admin", isAdmin: true },
  field_agent: { product: "AgroBridge App", isAdmin: false },
  farmer: { product: "AgroBridge App", isAdmin: false },
  partner: { product: "AgroBridge App", isAdmin: false },
  offtaker: { product: "AgroBridge App", isAdmin: false },
}

const roleLabels: Record<UserRole, string> = {
  super_admin: "Super Admin",
  ops_admin: "Operations",
  regional_manager: "Regional Manager",
  state_coordinator: "State Coordinator",
  field_agent: "Field Agent",
  farmer: "Farmer",
  partner: "Partner",
  offtaker: "Buyer",
}

const getSettingsPath = (role: UserRole): string => {
  const pathMap: Record<UserRole, string> = {
    super_admin: "/dashboard/admin/settings",
    ops_admin: "/dashboard/ops/settings",
    regional_manager: "/dashboard/regional/settings",
    state_coordinator: "/dashboard/coordinator/settings",
    field_agent: "/dashboard/agent/settings",
    farmer: "/dashboard/farmer/settings",
    partner: "/dashboard/partner/settings",
    offtaker: "/dashboard/offtaker/settings",
  }
  return pathMap[role]
}

interface RoleSidebarProps {
  role: UserRole
  className?: string
  onNavigate?: () => void
}

export function RoleSidebar({ role, className, onNavigate }: RoleSidebarProps) {
  const pathname = usePathname()
  const { logout } = useAuth()
  const navigation = navigationByRole[role] || []
  const productInfo = productLabels[role]

  const handleNavClick = () => {
    onNavigate?.()
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 flex-col border-r",
        productInfo.isAdmin ? "bg-slate-900 border-slate-800" : "bg-sidebar",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center py-4 border-b px-4",
          productInfo.isAdmin ? "border-slate-800" : "border-sidebar-border",
        )}
      >
        <Image src="/logo-icon-white.png" alt="AgroBridge" width={48} height={48} className="h-12 w-12" />
      </div>

      <div className={cn("px-4 py-3 border-b", productInfo.isAdmin ? "border-slate-800" : "border-sidebar-border")}>
        <span
          className={cn(
            "text-xs font-medium uppercase tracking-wider",
            productInfo.isAdmin ? "text-slate-500" : "text-sidebar-muted",
          )}
        >
          {roleLabels[role]} Portal
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {navigation.map((item) => {
          const isExactMatch = pathname === item.href
          const isChildRoute = pathname.startsWith(item.href + "/")
          const isDashboard =
            item.href.endsWith("/dashboard") ||
            item.href.endsWith("/ops") ||
            item.href.endsWith("/agent") ||
            item.href.endsWith("/farmer") ||
            item.href.endsWith("/partner") ||
            item.href.endsWith("/offtaker") ||
            item.href.endsWith("/coordinator") ||
            item.href.endsWith("/regional")

          const isActive = isDashboard ? isExactMatch : isExactMatch || isChildRoute

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={handleNavClick}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                productInfo.isAdmin
                  ? isActive
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  : isActive
                    ? "bg-sidebar-accent text-sidebar-foreground"
                    : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className={cn("border-t p-3 space-y-1", productInfo.isAdmin ? "border-slate-800" : "border-sidebar-border")}>
        <Link
          href={getSettingsPath(role)}
          onClick={handleNavClick}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            productInfo.isAdmin
              ? "text-slate-400 hover:bg-slate-800 hover:text-white"
              : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground",
          )}
        >
          <Settings className="h-4 w-4 flex-shrink-0" />
          Settings
        </Link>
        <Link
          href="/help"
          onClick={handleNavClick}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            productInfo.isAdmin
              ? "text-slate-400 hover:bg-slate-800 hover:text-white"
              : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground",
          )}
        >
          <HelpCircle className="h-4 w-4 flex-shrink-0" />
          Help & Support
        </Link>
        <button
          onClick={() => {
            handleNavClick()
            logout()
          }}
          className={cn(
            "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            productInfo.isAdmin
              ? "text-slate-400 hover:bg-slate-800 hover:text-white"
              : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground",
          )}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
