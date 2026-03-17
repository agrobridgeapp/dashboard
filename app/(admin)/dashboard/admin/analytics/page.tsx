"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Activity, Map, Target, Server, Database, RefreshCw, AlertCircle } from "lucide-react"

export default function SystemMetrics() {
  const [metrics, setMetrics] = useState<any>(null)
  const [health, setHealth] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const [metricsRes, healthRes] = await Promise.all([
        fetch('/api/admin/system/metrics'),
        fetch('/api/admin/system/health')
      ])

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json()
        setMetrics(metricsData)
      }

      if (healthRes.ok) {
        const healthData = await healthRes.json()
        setHealth(healthData)
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [fetchData])

  if (isLoading) {
    return (
      <DashboardLayout role="super_admin">
        <div className="flex items-center justify-center min-h-[400px]">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    )
  }

  const overview = metrics?.overview || { totalUsers: 0, activeCorridors: 0, totalHectares: 0, activeSessions: 0 }
  const roles = metrics?.roles || { farmers: 0, partners: 0, agents: 0, buyers: 0 }
  const performance = health?.performance || { avgResponseTime: "---", requestsPerMin: 0, errorRate: "---" }
  const overallStatus = health?.overall?.status || "Unknown"

  return (
    <DashboardLayout role="super_admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">System Metrics</h1>
            <p className="text-muted-foreground mt-1">Platform health, usage, and operational metrics</p>
          </div>
          <button 
            onClick={() => { setIsLoading(true); fetchData(); }}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium border rounded-md hover:bg-accent"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="health">System Health</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overview.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">Registered on platform</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Corridors</CardTitle>
                  <Map className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overview.activeCorridors}</div>
                  <p className="text-xs text-muted-foreground mt-1">Across managed states</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Hectares</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overview.totalHectares.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">Under coordination</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overview.activeSessions}</div>
                  <p className="text-xs text-muted-foreground mt-1">Users currently active</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Platform Usage</CardTitle>
                <CardDescription>User registration and activity metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Farmers Registered</span>
                    <span className="text-2xl font-bold">{roles.farmers.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Service Partners</span>
                    <span className="text-2xl font-bold">{roles.partners.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Field Agents</span>
                    <span className="text-2xl font-bold">{roles.agents.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Buyers</span>
                    <span className="text-2xl font-bold">{roles.buyers.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Metrics</CardTitle>
                <CardDescription>Detailed registration and activity tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2 text-sm uppercase text-muted-foreground">Top States</h4>
                    <p className="text-2xl font-bold">Lagos, Kano, Oyo</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2 text-sm uppercase text-muted-foreground">New Users (24h)</h4>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="operations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Operational Metrics</CardTitle>
                <CardDescription>Service delivery and execution tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Operations metrics dashboard coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Server Status</CardTitle>
                  <Server className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${overallStatus.includes('Operational') ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {overallStatus.includes('Operational') ? 'Operational' : 'Degraded'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Platform core services</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Database Status</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${overallStatus.includes('Operational') ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {overallStatus.includes('Operational') ? 'Healthy' : 'Disconnected'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Persistence layer status</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>System Health Performance</CardTitle>
                <CardDescription>Real-time infrastructure and service metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-medium text-muted-foreground">API Load</span>
                    <span className="text-lg font-bold">{performance.requestsPerMin} req/min</span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-medium text-muted-foreground">Avg Latency</span>
                    <span className="text-lg font-bold">{performance.avgResponseTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-muted-foreground">Error Rate</span>
                    <span className={`text-lg font-bold ${parseFloat(performance.errorRate) > 1 ? 'text-red-600' : 'text-emerald-600'}`}>
                      {performance.errorRate}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
