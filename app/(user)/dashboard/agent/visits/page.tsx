"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { MapPin, Clock, CheckCircle, User, Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

const statusStyles: Record<string, string> = {
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  verified: "bg-emerald-100 text-emerald-700 border-emerald-200",
  in_progress: "bg-blue-100 text-blue-700 border-blue-200",
  scheduled: "bg-muted text-muted-foreground",
}

export default function AgentVisitsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await apiClient.agentMe.getServiceEvents()
      if (res.success) setEvents(res.data.events)
    } catch {
      toast.error("Failed to load visits")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  // Filter events to selected calendar date
  const selectedDateStr = date?.toDateString()
  const visitsForDate = selectedDateStr
    ? events.filter((e) => {
        const d = e.scheduled_date ? new Date(e.scheduled_date).toDateString() : null
        return d === selectedDateStr
      })
    : events

  // Days that have events (for calendar highlighting)
  const eventDays = events
    .filter((e) => e.scheduled_date)
    .map((e) => new Date(e.scheduled_date))

  return (
    <DashboardLayout allowedRoles={["field_agent"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Farm Visits</h1>
            <p className="text-muted-foreground">Track your farm visits and service events</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Calendar */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md"
                modifiers={{ hasEvent: eventDays }}
                modifiersClassNames={{ hasEvent: "font-bold underline" }}
              />
              {date && (
                <Button variant="ghost" size="sm" className="w-full mt-2 text-xs" onClick={() => setDate(undefined)}>
                  Show all dates
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Visits List */}
          <div className="lg:col-span-2">
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  {date
                    ? `Visits for ${date.toLocaleDateString("en-NG", { month: "long", day: "numeric" })}`
                    : "All Service Events"}
                  {!loading && <span className="text-muted-foreground font-normal ml-2 text-sm">({visitsForDate.length})</span>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : visitsForDate.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    {date ? "No visits scheduled for this day" : "No service events yet"}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {visitsForDate.map((event) => {
                      const farmerName = event.farmer?.full_name || event.farmer?.name || "Farmer"
                      const location = [event.farmer?.village, event.farmer?.lga].filter(Boolean).join(", ") || "—"
                      const serviceLabel = (event.service_type || "Visit").replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())
                      const isCompleted = event.status === "completed" || event.status === "verified"

                      return (
                        <div
                          key={event.id}
                          className="flex items-start gap-4 p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
                        >
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            isCompleted ? "bg-emerald-100 text-emerald-600"
                            : event.status === "in_progress" ? "bg-blue-100 text-blue-600"
                            : "bg-muted text-muted-foreground"
                          }`}>
                            {isCompleted ? <CheckCircle className="h-5 w-5" /> : <User className="h-5 w-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="font-medium">{farmerName}</p>
                                <p className="text-sm text-muted-foreground">{serviceLabel}</p>
                              </div>
                              <Badge variant="outline" className={statusStyles[event.status] ?? "bg-muted text-muted-foreground"}>
                                {event.status.replace("_", " ")}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              {event.scheduled_date && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(event.scheduled_date).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {location}
                              </span>
                            </div>
                            {event.notes && (
                              <p className="text-sm mt-2 text-muted-foreground italic">{event.notes}</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
