"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Server, Database, Wifi, HardDrive, Activity, CheckCircle, RefreshCw, AlertCircle } from "lucide-react"

const IconMap: Record<string, any> = {
  Server,
  Database,
  Wifi,
  HardDrive
}

export default function SystemHealth() {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchHealth = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/system/health')
      if (res.ok) {
        const health = await res.json()
        setData(health)
      }
    } catch (error) {
      console.error("Failed to fetch system health:", error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchHealth()
    const interval = setInterval(fetchHealth, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [fetchHealth])

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchHealth()
  }

  if (isLoading) {
    return (
      <DashboardLayout role="super_admin">
        <div className="flex items-center justify-center min-h-[400px]">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    )
  }

  const overall = data?.overall || { status: "Unknown", uptime: "---", lastIncident: "---" }
  const performance = data?.performance || { avgResponseTime: "---", requestsPerMin: 0, errorRate: "---" }
  const infrastructure = data?.infrastructure || []
  const services = data?.services || []

  return (
    <DashboardLayout role="super_admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">System Health</h1>
            <p className="text-muted-foreground mt-1">Real-time platform infrastructure monitoring</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {overall.status.includes("Operational") ? (
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                )}
                Overall Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Platform Status</span>
                  <Badge className={overall.status.includes("Operational") ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>
                    {overall.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Uptime (30d)</span>
                  <span className="font-semibold">{overall.uptime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Incident</span>
                  <span className="font-semibold">{overall.lastIncident}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Avg Response Time</span>
                  <span className="font-semibold">{performance.avgResponseTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Requests/min</span>
                  <span className="font-semibold">{performance.requestsPerMin.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Error Rate</span>
                  <span className="font-semibold text-emerald-600">{performance.errorRate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Infrastructure Status</CardTitle>
            <CardDescription>Core system components and resources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {infrastructure.map((metric: any) => {
                const Icon = IconMap[metric.icon] || Server
                return (
                  <div key={metric.name} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className={metric.status === 'operational' ? "p-2 bg-emerald-100 rounded-lg" : "p-2 bg-amber-100 rounded-lg"}>
                      <Icon className={metric.status === 'operational' ? "h-5 w-5 text-emerald-700" : "h-5 w-5 text-amber-700"} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{metric.name}</h3>
                        <Badge className={metric.status === 'operational' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>
                          {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Uptime:</span>
                          <span className="font-medium text-foreground">{metric.uptime}</span>
                        </div>
                        {metric.responseTime && (
                          <div className="flex justify-between">
                            <span>Response Time:</span>
                            <span className="font-medium text-foreground">{metric.responseTime}</span>
                          </div>
                        )}
                        {metric.connections && (
                          <div className="flex justify-between">
                            <span>Connections:</span>
                            <span className="font-medium text-foreground">{metric.connections}</span>
                          </div>
                        )}
                        {metric.used && (
                          <div className="flex justify-between">
                            <span>Used:</span>
                            <span className="font-medium text-foreground">{metric.used} ({metric.usage})</span>
                          </div>
                        )}
                        {metric.bandwidth && (
                          <div className="flex justify-between">
                            <span>Bandwidth:</span>
                            <span className="font-medium text-foreground">{metric.bandwidth}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Status</CardTitle>
            <CardDescription>Third-party integrations and platform services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {services.map((service: any) => (
                <div key={service.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span className="font-medium">{service.name}</span>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700">Operational</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

function Button({ children, ...props }: any) {
  return <button {...props} className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 ${props.className || ""}`}>{children}</button>
}
