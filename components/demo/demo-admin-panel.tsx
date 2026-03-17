"use client"

import { useState } from "react"
import { useDemo } from "@/lib/demo/demo-context"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings, RefreshCw, Copy, CheckCircle2, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { getDemoCredentials } from "@/lib/demo/demo-users"

export function DemoAdminPanel() {
  const { isDemo, config, resetDemoData, tenantName } = useDemo()
  const [isResetting, setIsResetting] = useState(false)
  const [open, setOpen] = useState(false)

  if (!isDemo) return null

  const handleReset = async () => {
    setIsResetting(true)
    try {
      await resetDemoData()
      toast.success("Demo data has been reset to default state")
    } catch (error) {
      toast.error("Failed to reset demo data")
    } finally {
      setIsResetting(false)
    }
  }

  const handleCopyCredentials = () => {
    const credentials = getDemoCredentials()
    const text = credentials.map((c) => `${c.role}: ${c.email} / ${c.password}`).join("\n")
    navigator.clipboard.writeText(text)
    toast.success("Demo credentials copied to clipboard")
  }

  const lastReset = config.tenant?.lastResetAt ? new Date(config.tenant.lastResetAt).toLocaleString() : "Never"

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Settings className="h-4 w-4" />
          Demo Controls
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">Demo Environment Controls</DialogTitle>
          <DialogDescription>Manage your demo tenant for sales and investor presentations</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Tenant Info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tenant Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">{tenantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  DEMO
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Reset</span>
                <span className="text-xs">{lastReset}</span>
              </div>
            </CardContent>
          </Card>

          {/* Demo Safety Status */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Demo Safety Status</CardTitle>
              <CardDescription className="text-xs">
                These protections ensure demo actions don't affect production
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Real payments disabled
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Notifications suppressed
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  External integrations blocked
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Fast-forward enabled
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="justify-start gap-2 bg-transparent" onClick={handleCopyCredentials}>
              <Copy className="h-4 w-4" />
              Copy Demo Credentials
            </Button>
            <Button
              variant="outline"
              className="justify-start gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 bg-transparent"
              onClick={handleReset}
              disabled={isResetting}
            >
              <RefreshCw className={`h-4 w-4 ${isResetting ? "animate-spin" : ""}`} />
              {isResetting ? "Resetting..." : "Reset Demo Data"}
            </Button>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg text-xs text-amber-800">
            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>
              Resetting will restore all demo data to its default state. Any changes made during this session will be
              lost.
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
