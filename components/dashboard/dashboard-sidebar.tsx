"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Tractor,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Leaf,
  Handshake,
  Package,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Farmers", href: "/dashboard/farmers", icon: Users },
  { name: "Service Requests", href: "/dashboard/requests", icon: Tractor },
  { name: "Partners", href: "/dashboard/partners", icon: Handshake },
  { name: "Contracts", href: "/dashboard/contracts", icon: FileText },
  { name: "Inventory", href: "/dashboard/inventory", icon: Package },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
]

const bottomNav = [{ name: "Settings", href: "/dashboard/settings", icon: Settings }]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r bg-card lg:flex">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Leaf className="h-6 w-6 text-primary" />
        <span className="font-semibold text-lg">AgroBridge</span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-4 space-y-1">
        {bottomNav.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        ))}
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
