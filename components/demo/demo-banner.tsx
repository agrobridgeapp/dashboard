"use client"

import { useDemo } from "@/lib/demo/demo-context"
import { X, FlaskConical, AlertCircle } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function DemoBanner() {
  const { isDemo } = useDemo()
  const [dismissed, setDismissed] = useState(false)

  if (!isDemo || dismissed) return null

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <FlaskConical className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-amber-900">Demo Mode Active</p>
            <div className="flex items-center gap-2 text-xs text-amber-700">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>
                <strong>No real data is persisted.</strong> This is a demonstration environment. All actions are
                simulated and will not affect live operations or databases.
              </span>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-amber-600 hover:text-amber-800 hover:bg-amber-100 flex-shrink-0"
          onClick={() => setDismissed(true)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </Button>
      </div>
    </div>
  )
}
