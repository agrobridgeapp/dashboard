import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, Play, MapPin, User, Calendar, Tractor, RefreshCw } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

const serviceTypeLabels: Record<string, string> = {
  land_preparation: "Land Preparation",
  planting: "Planting",
  fertilizer_application: "Fertilizer",
  pest_control: "Pest Control",
  irrigation: "Irrigation",
  harvesting: "Harvesting",
  transport: "Transport",
  storage: "Storage",
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  planned: { label: "Planned", color: "bg-slate-100 text-slate-700 border-slate-200", icon: Calendar },
  scheduled: { label: "Scheduled", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Clock },
  in_progress: { label: "In Progress", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Play },
  completed: { label: "Completed", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle },
  verified: { label: "Verified", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle },
}

export default function AgentServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchServices = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await apiClient.agentMe.getServiceEvents()
      if (res.success) setServices(res.data.events)
    } catch {
      toast.error("Failed to load services")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchServices() }, [fetchServices])

  const handleUpdateStatus = async (eventId: string, status: string, data?: any) => {
    try {
      await apiClient.serviceEvents.update(eventId, { ...data, status })
      setServices((prev) => prev.map((s) => s.id === eventId ? { ...s, ...data, status } : s))
      toast.success(`Marked as ${status.replace("_", " ")}`)
    } catch {
      toast.error("Failed to update status")
    }
  }

  const agentServices = services.filter((s) => s.status !== "cancelled" && s.status !== "verified")
  const pendingServices = agentServices.filter((s) => s.status === "planned" || s.status === "scheduled")
  const inProgressServices = agentServices.filter((s) => s.status === "in_progress")
  const completedServices = services.filter((s) => s.status === "completed" || s.status === "verified")

  const ServiceCard = ({ service }: { service: any }) => {
    const config = statusConfig[service.status] || statusConfig.planned
    const StatusIcon = config.icon
    const dueDate = service.scheduled_date ? new Date(service.scheduled_date) : null
    const isOverdue = dueDate && dueDate < new Date() && service.status !== "completed" && service.status !== "verified"
    const farmerName = service.farmer?.full_name || service.farmer?.name || "Unknown Farmer"
    const location = [service.farmer?.village, service.farmer?.lga].filter(Boolean).join(", ")

    return (
      <Card
        className={`border-border/50 transition-all hover:shadow-md ${isOverdue ? "border-red-200 bg-red-50/30" : ""}`}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Tractor className="h-4 w-4 text-primary shrink-0" />
                <span className="font-semibold text-sm truncate">
                  {serviceTypeLabels[service.service_type] || (service.service_type || "").replace(/_/g, " ")}
                </span>
                {isOverdue && (
                  <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 text-xs">
                    Overdue
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                <User className="h-3.5 w-3.5" />
                <span className="truncate">{farmerName}</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {dueDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {dueDate.toLocaleDateString("en-NG", { month: "short", day: "numeric" })}
                  </span>
                )}
                {location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {location}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <Badge variant="outline" className={config.color}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {config.label}
              </Badge>

              {service.status === "scheduled" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={(e) => { e.stopPropagation(); handleUpdateStatus(service.id, "in_progress", { actual_date: new Date().toISOString().split("T")[0] }) }}
                >
                  <Play className="h-3 w-3 mr-1" />
                  Start
                </Button>
              )}

              {service.status === "in_progress" && (
                <Button
                  size="sm"
                  className="h-8 text-xs"
                  onClick={(e) => { e.stopPropagation(); handleUpdateStatus(service.id, "completed", { actual_date: new Date().toISOString().split("T")[0] }) }}
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Complete
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <DashboardLayout allowedRoles={["field_agent"]}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Service Tracking</h1>
            <p className="text-muted-foreground text-sm">Mark services complete and track progress</p>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchServices} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-border/50">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-amber-600">{pendingServices.length}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-blue-600">{inProgressServices.length}</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-emerald-600">{completedServices.length}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Service Tabs */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="pending" className="text-xs sm:text-sm">
              Pending ({pendingServices.length})
            </TabsTrigger>
            <TabsTrigger value="progress" className="text-xs sm:text-sm">
              In Progress ({inProgressServices.length})
            </TabsTrigger>
            <TabsTrigger value="done" className="text-xs sm:text-sm">
              Done ({completedServices.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4 space-y-3">
            {pendingServices.length === 0 ? (
              <Card className="border-border/50">
                <CardContent className="p-8 text-center">
                  <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No pending services</p>
                </CardContent>
              </Card>
            ) : (
              pendingServices.map((service) => <ServiceCard key={service.id} service={service} />)
            )}
          </TabsContent>

          <TabsContent value="progress" className="mt-4 space-y-3">
            {inProgressServices.length === 0 ? (
              <Card className="border-border/50">
                <CardContent className="p-8 text-center">
                  <Play className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No services in progress</p>
                </CardContent>
              </Card>
            ) : (
              inProgressServices.map((service) => <ServiceCard key={service.id} service={service} />)
            )}
          </TabsContent>

          <TabsContent value="done" className="mt-4 space-y-3">
            {completedServices.length === 0 ? (
              <Card className="border-border/50">
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No completed services yet</p>
                </CardContent>
              </Card>
            ) : (
              completedServices.slice(0, 10).map((service) => <ServiceCard key={service.id} service={service} />)
            )}
          </TabsContent>
        </Tabs>
      </div>

    </DashboardLayout>
  )
}
