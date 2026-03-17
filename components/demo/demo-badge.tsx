"use client"

import { useDemo } from "@/lib/demo/demo-context"
import { Badge } from "@/components/ui/badge"
import { FlaskConical } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function DemoBadge() {
  const { isDemo, tenantName } = useDemo()

  if (!isDemo) return null

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 cursor-default gap-1.5 font-medium"
          >
            <FlaskConical className="h-3 w-3" />
            DEMO
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <p className="font-medium">{tenantName}</p>
          <p className="text-xs text-muted-foreground mt-1">
            This is a demo environment. Actions here do not affect live operations.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
