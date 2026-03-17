import { Card, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function AlertsLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />

      <div className="space-y-3">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <Skeleton className="h-10 w-10 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
