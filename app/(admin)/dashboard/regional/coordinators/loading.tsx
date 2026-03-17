import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function CoordinatorsLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />

      <div className="grid gap-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-4">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="space-y-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
