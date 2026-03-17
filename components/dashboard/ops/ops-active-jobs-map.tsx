"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"

const activeJobs = [
  { id: 1, location: "Zaria", type: "Plowing", partner: "FarmMech", status: "in-progress" },
  { id: 2, location: "Giwa", type: "Delivery", partner: "AgriPro", status: "en-route" },
  { id: 3, location: "Sabon Gari", type: "Irrigation", partner: "GreenField", status: "in-progress" },
]

const statusColors: Record<string, string> = {
  "in-progress": "bg-primary/10 text-primary",
  "en-route": "bg-blue-100 text-blue-700",
}

export function OpsActiveJobsMap() {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Active Jobs</CardTitle>
        <CardDescription>Real-time job tracking</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Map placeholder */}
        <div className="relative h-32 bg-muted/50 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('/map-of-kaduna-nigeria-satellite.jpg')] bg-cover bg-center opacity-50" />
          <div className="relative flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            Kaduna Region
          </div>
          {/* Job markers */}
          <div className="absolute top-4 left-8 w-3 h-3 bg-primary rounded-full animate-pulse" />
          <div className="absolute top-8 right-12 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
          <div className="absolute bottom-6 left-16 w-3 h-3 bg-primary rounded-full animate-pulse" />
        </div>

        <div className="space-y-3">
          {activeJobs.map((job) => (
            <div key={job.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span>{job.location}</span>
                <span className="text-muted-foreground">• {job.type}</span>
              </div>
              <Badge variant="secondary" className={statusColors[job.status]}>
                {job.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
