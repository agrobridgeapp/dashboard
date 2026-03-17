import { Card, CardContent } from "@/components/ui/card"
import { Users, Tractor, FileCheck, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"

const stats = [
  {
    title: "Active Farmers",
    value: "2,847",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    description: "vs last month",
  },
  {
    title: "Pending Requests",
    value: "156",
    change: "+23",
    trend: "up",
    icon: Tractor,
    description: "new this week",
  },
  {
    title: "Active Contracts",
    value: "89",
    change: "-3",
    trend: "down",
    icon: FileCheck,
    description: "completed this week",
  },
  {
    title: "Yield Improvement",
    value: "34%",
    change: "+8%",
    trend: "up",
    icon: TrendingUp,
    description: "avg. across farmers",
  },
]

export function StatsOverview() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === "up" ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {stat.change}
                {stat.trend === "up" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
