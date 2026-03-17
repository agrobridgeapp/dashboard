import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, CheckCircle, Truck, FileText } from "lucide-react"

const activities = [
  {
    id: 1,
    icon: UserPlus,
    title: "New farmer registered",
    description: "Hassan Usman joined from Zaria",
    time: "10 min ago",
    color: "text-primary",
  },
  {
    id: 2,
    icon: CheckCircle,
    title: "Service completed",
    description: "Plowing for Fatima Abubakar",
    time: "1 hour ago",
    color: "text-emerald-600",
  },
  {
    id: 3,
    icon: Truck,
    title: "Input delivery dispatched",
    description: "Fertilizer to Giwa cluster",
    time: "2 hours ago",
    color: "text-amber-600",
  },
  {
    id: 4,
    icon: FileText,
    title: "Contract signed",
    description: "Offtake agreement with MaizeCo",
    time: "3 hours ago",
    color: "text-blue-600",
  },
]

export function RecentActivity() {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Recent Activity</CardTitle>
        <CardDescription>Latest platform updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-3">
              <div className={`mt-0.5 ${activity.color}`}>
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
