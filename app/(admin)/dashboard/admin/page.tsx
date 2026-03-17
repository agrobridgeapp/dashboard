"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { DemoWatermark } from "@/components/demo/demo-watermark"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Shield, Activity, Database, AlertCircle, CheckCircle, Globe } from "lucide-react"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

interface PlatformStats {
  totalUsers: number
  activeUsers: number
  totalFarmers: number
  totalAgents: number
  approvedAgents: number
  totalPartners: number
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.admin.getStats()
        if (res.success) setStats(res.data)
      } catch (err) {
        console.error("[AdminDashboard] Failed to fetch stats:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const coordinationLayer = [
    { role: "Ops Admins", count: stats?.totalUsers ?? 0, color: "text-blue-600" },
    { role: "Field Agents", count: stats?.totalAgents ?? 0, color: "text-purple-600" },
    { role: "Partners", count: stats?.totalPartners ?? 0, color: "text-green-600" },
  ]

  const executionLayer = [
    { role: "Farmers", count: stats?.totalFarmers ?? 0, color: "text-emerald-600" },
    { role: "Approved Agents", count: stats?.approvedAgents ?? 0, color: "text-orange-600" },
  ]

  return (
    <DashboardLayout role="super_admin">
      <DemoWatermark />
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Platform-wide administration and user management</p>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-md w-fit">
          <Globe className="h-4 w-4 text-slate-500" />
          <span className="text-sm text-slate-600">Scope:</span>
          <span className="text-sm font-medium text-slate-800">Platform-wide</span>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.totalUsers?.toLocaleString() ?? "—"}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stats?.activeUsers?.toLocaleString() ?? "—"} active</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Excellent</div>
              <p className="text-xs text-emerald-600 mt-1">All systems operational</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Farmers</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.totalFarmers?.toLocaleString() ?? "—"}</div>
                  <p className="text-xs text-muted-foreground mt-1">Registered farmers</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Security Status</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Secure</div>
              <p className="text-xs text-emerald-600 mt-1">No threats detected</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Coordination Layer */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Platform Users</CardTitle>
              <CardDescription>Staff and partners managing platform operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading
                  ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)
                  : coordinationLayer.map((item) => (
                      <div key={item.role} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Users className={`h-5 w-5 ${item.color}`} />
                          <span className="font-medium">{item.role}</span>
                        </div>
                        <span className="text-2xl font-bold">{item.count.toLocaleString()}</span>
                      </div>
                    ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Total</span>
                  <span className="font-medium">
                    {loading ? "..." : coordinationLayer.reduce((sum, item) => sum + item.count, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Execution Layer */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Execution Layer</CardTitle>
              <CardDescription>Field participants in the supply network</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading
                  ? Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)
                  : executionLayer.map((item) => (
                      <div key={item.role} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Users className={`h-5 w-5 ${item.color}`} />
                          <span className="font-medium">{item.role}</span>
                        </div>
                        <span className="text-2xl font-bold">{item.count.toLocaleString()}</span>
                      </div>
                    ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Total Execution</span>
                  <span className="font-medium">
                    {loading ? "..." : executionLayer.reduce((sum, item) => sum + item.count, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status Information */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current platform health and activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Service Events", icon: CheckCircle, note: "Real-time data from database", status: "success" },
                { action: "Field Agent Management", icon: CheckCircle, note: "Connected to backend", status: "success" },
                { action: "Farmer Records", icon: CheckCircle, note: "Live data pipeline active", status: "success" },
                { action: "Data Quality Monitor", icon: AlertCircle, note: "Running integrity checks", status: "warning" },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                  {item.status === "success" ? (
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{item.action}</p>
                    <p className="text-sm text-muted-foreground">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
