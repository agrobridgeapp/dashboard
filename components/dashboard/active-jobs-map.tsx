import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"

const activeJobs = [
  { id: 1, location: "Zaria", type: "Plowing", progress: 75 },
  { id: 2, location: "Giwa", type: "Spraying", progress: 40 },
  { id: 3, location: "Sabon Gari", type: "Input Delivery", progress: 90 },
]

export function ActiveJobsMap() {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Active Jobs</CardTitle>
        <CardDescription>Real-time field operations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Placeholder map area */}
        <div className="relative h-32 rounded-lg bg-muted/50 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-xs">Kaduna Region</p>
            </div>
          </div>
          {/* Simulated map pins */}
          <div className="absolute top-4 left-8 w-3 h-3 bg-primary rounded-full animate-pulse" />
          <div className="absolute top-12 right-12 w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
          <div className="absolute bottom-8 left-16 w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
        </div>

        <div className="space-y-3">
          {activeJobs.map((job) => (
            <div key={job.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div>
                  <p className="text-sm font-medium">{job.type}</p>
                  <p className="text-xs text-muted-foreground">{job.location}</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                {job.progress}%
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
