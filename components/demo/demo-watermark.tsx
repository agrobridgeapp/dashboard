"use client"

import { useDemo } from "@/lib/demo/demo-context"
import { FlaskConical } from "lucide-react"

export function DemoWatermark() {
  const { isDemo } = useDemo()

  if (!isDemo) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 pointer-events-none select-none">
      <div className="flex items-center gap-2 bg-amber-50/90 backdrop-blur-sm border border-amber-200 rounded-lg px-3 py-2 shadow-lg">
        <FlaskConical className="h-4 w-4 text-amber-600" />
        <div className="text-xs">
          <p className="font-semibold text-amber-800">DEMO MODE</p>
          <p className="text-amber-600">No real data persisted</p>
        </div>
      </div>
    </div>
  )
}
