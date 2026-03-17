"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, UserPlus, AlertCircle } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "completed",
    message: "Plowing completed for Ibrahim G.",
    time: "10 mins ago",
    icon: CheckCircle,
  },
  {
    id: 2,
    type: "assigned",
    message: "FarmMech assigned to REQ-003",
    time: "25 mins ago",
    icon: UserPlus,
  },
  {
    id: 3,
    type: "pending",
    message: "New request from Fatima A.",
    time: "1 hour ago",
    icon: Clock,
  },
  {
    id: 4,
    type: "alert",
    message: "Low stock alert: Fertilizer",
    time: "2 hours ago",
    icon: AlertCircle,
  },
]

const iconColors: Record<string, string> = {
  completed: "text-emerald-600 bg-emerald-100",
  assigned: "text-blue-600 bg-blue-100",
  pending: "text-amber-600 bg-amber-100",
  alert: "text-red-600 bg-red-100",
}

export function OpsRecentActivity() {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Recent Activity</CardTitle>
        <CardDescription>Latest updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${iconColors[activity.type]}`}>
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">{activity.message}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
