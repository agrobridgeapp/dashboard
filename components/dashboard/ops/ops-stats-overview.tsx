"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, Tractor, FileText, TrendingUp, ArrowUpRight, Leaf, AlertTriangle, CheckCircle2 } from "lucide-react"
import { useDataStore } from "@/lib/data/data-store"

export function OpsStatsOverview() {
  const dataStore = useDataStore()

  const metrics = dataStore?.metrics || {
    activeFarmers: 0,
    totalFarmers: 0,
    totalHectares: 0,
    slaAdherencePercent: 0,
    completedServices: 0,
    totalServiceEvents: 0,
    fulfilmentPercent: 0,
    deliveredVolumeTons: 0,
    contractedVolumeTons: 0,
    grossMargin: 0,
    marginPerHectare: 0,
    totalServiceCosts: 0,
  }
  const serviceEvents = Array.isArray(dataStore?.serviceEvents) ? dataStore.serviceEvents : []
  const contracts = Array.isArray(dataStore?.contracts) ? dataStore.contracts : []

  const pendingServices = serviceEvents.filter((s) => ["planned", "scheduled"].includes(s.status)).length
  const overdueServices = serviceEvents.filter((s) => {
    if (["completed", "verified", "cancelled"].includes(s.status)) return false
    return new Date(s.plannedDateEnd) < new Date()
  }).length

  const stats = [
    {
      name: "Active Farmers",
      value: (metrics.activeFarmers || 0).toLocaleString(),
      subValue: `${(metrics.totalFarmers || 0).toLocaleString()} total`,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      name: "Total Hectares",
      value: (metrics.totalHectares || 0).toLocaleString(),
      subValue: `${((metrics.totalHectares || 0) / Math.max(metrics.activeFarmers || 1, 1)).toFixed(1)} avg/farmer`,
      icon: Leaf,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      name: "Pending Services",
      value: pendingServices.toString(),
      subValue: overdueServices > 0 ? `${overdueServices} overdue` : "None overdue",
      icon: overdueServices > 0 ? AlertTriangle : Tractor,
      color: overdueServices > 0 ? "text-amber-600" : "text-blue-600",
      bgColor: overdueServices > 0 ? "bg-amber-100" : "bg-blue-100",
    },
    {
      name: "SLA Adherence",
      value: `${metrics.slaAdherencePercent || 0}%`,
      subValue: `${metrics.completedServices || 0}/${metrics.totalServiceEvents || 0} verified`,
      icon: CheckCircle2,
      color: (metrics.slaAdherencePercent || 0) >= 85 ? "text-emerald-600" : "text-amber-600",
      bgColor: (metrics.slaAdherencePercent || 0) >= 85 ? "bg-emerald-100" : "bg-amber-100",
    },
    {
      name: "Active Contracts",
      value: contracts.filter((c) => ["active", "in_delivery"].includes(c.status)).length.toString(),
      subValue: `₦${(contracts.reduce((sum, c) => sum + (c.totalContractValue || 0), 0) / 1000000).toFixed(1)}M value`,
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      name: "Fulfilment Rate",
      value: `${metrics.fulfilmentPercent || 0}%`,
      subValue: `${metrics.deliveredVolumeTons || 0}/${metrics.contractedVolumeTons || 0} tons`,
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      name: "Gross Margin",
      value: `₦${((metrics.grossMargin || 0) / 1000000000).toFixed(2)}B`,
      subValue: `₦${(metrics.marginPerHectare || 0).toLocaleString()}/ha`,
      icon: ArrowUpRight,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      name: "Service Costs",
      value: `₦${((metrics.totalServiceCosts || 0) / 1000000).toFixed(1)}M`,
      subValue: `₦${Math.round((metrics.totalServiceCosts || 0) / Math.max(metrics.totalHectares || 1, 1)).toLocaleString()}/ha`,
      icon: Tractor,
      color: "text-slate-600",
      bgColor: "bg-slate-100",
    },
  ]

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.name} className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xl font-bold truncate">{stat.value}</p>
                <p className="text-xs text-muted-foreground truncate">{stat.name}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 truncate">{stat.subValue}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
