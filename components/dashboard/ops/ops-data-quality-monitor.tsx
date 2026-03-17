// Data Quality Monitoring Component
// Detects and flags data issues across the platform

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { AlertTriangle, CheckCircle2, Clock, Database } from "lucide-react"

interface DataQualityIssue {
  id: string
  type: "missing" | "conflicting" | "suspicious" | "correction"
  entityType: string
  entityId: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  detected: string
  resolved: boolean
}

interface DataQualityMonitorProps {
  issues: DataQualityIssue[]
}

export function OpsDataQualityMonitor({ issues }: DataQualityMonitorProps) {
  const router = useRouter()
  const { toast } = useToast()

  const criticalIssues = issues.filter((i) => i.severity === "critical" && !i.resolved)
  const highIssues = issues.filter((i) => i.severity === "high" && !i.resolved)
  const resolvedToday = issues.filter(
    (i) => i.resolved && new Date(i.detected).toDateString() === new Date().toDateString(),
  )

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600 bg-red-100 border-red-200"
      case "high":
        return "text-amber-600 bg-amber-100 border-amber-200"
      case "medium":
        return "text-blue-600 bg-blue-100 border-blue-200"
      default:
        return "text-gray-600 bg-gray-100 border-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "missing":
        return AlertTriangle
      case "conflicting":
        return AlertTriangle
      case "suspicious":
        return AlertTriangle
      default:
        return Database
    }
  }

  const handleReviewIssue = (issue: DataQualityIssue) => {
    router.push(`/dashboard/ops/data-quality/${issue.id}`)
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Data Quality Monitor</CardTitle>
            <CardDescription>Track and resolve data integrity issues</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="destructive" className="h-6">
              {criticalIssues.length} Critical
            </Badge>
            <Badge variant="secondary" className="bg-amber-100 text-amber-700 h-6">
              {highIssues.length} High
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 border border-red-200 rounded-lg bg-red-50">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-900">Critical Issues</span>
            </div>
            <p className="text-2xl font-bold text-red-700">{criticalIssues.length}</p>
          </div>
          <div className="p-3 border border-amber-200 rounded-lg bg-amber-50">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-900">High Priority</span>
            </div>
            <p className="text-2xl font-bold text-amber-700">{highIssues.length}</p>
          </div>
          <div className="p-3 border border-emerald-200 rounded-lg bg-emerald-50">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-900">Resolved Today</span>
            </div>
            <p className="text-2xl font-bold text-emerald-700">{resolvedToday.length}</p>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t">
          <h4 className="text-sm font-medium">Active Issues</h4>
          {issues
            .filter((i) => !i.resolved)
            .slice(0, 5)
            .map((issue) => {
              const Icon = getTypeIcon(issue.type)
              return (
                <div key={issue.id} className="flex items-start gap-3 p-3 border border-border/50 rounded-lg">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 ${getSeverityColor(issue.severity)}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={`text-xs ${getSeverityColor(issue.severity)}`}>
                        {issue.severity}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {issue.entityType}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{issue.entityId}</span>
                    </div>
                    <p className="text-sm">{issue.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">Detected {issue.detected}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleReviewIssue(issue)}>
                    Review
                  </Button>
                </div>
              )
            })}
          {issues.filter((i) => !i.resolved).length === 0 && (
            <div className="text-center py-8 text-sm text-muted-foreground">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-emerald-600 opacity-50" />
              <p>No active data quality issues</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
