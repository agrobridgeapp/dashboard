"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Eye, EyeOff, FlaskConical } from "lucide-react"
import { toast } from "sonner"
import { getDemoCredentials } from "@/lib/demo/demo-users"

interface DemoCredentialsCardProps {
  onSelectCredential?: (email: string, password: string) => void
}

export function DemoCredentialsCard({ onSelectCredential }: DemoCredentialsCardProps) {
  const [showPasswords, setShowPasswords] = useState(false)
  const credentials = getDemoCredentials()

  const handleCopy = (email: string, password: string) => {
    navigator.clipboard.writeText(`${email} / ${password}`)
    toast.success("Credentials copied to clipboard")
  }

  return (
    <Card className="border-amber-200 bg-amber-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-amber-600" />
            <CardTitle className="text-sm font-medium">Demo Credentials</CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setShowPasswords(!showPasswords)}>
            {showPasswords ? (
              <>
                <EyeOff className="h-3 w-3 mr-1" /> Hide
              </>
            ) : (
              <>
                <Eye className="h-3 w-3 mr-1" /> Show
              </>
            )}
          </Button>
        </div>
        <CardDescription className="text-xs">Click any credential to use it for login</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {credentials.slice(0, 5).map((cred) => (
          <div
            key={cred.email}
            className="flex items-center justify-between p-2 rounded-md bg-white border border-amber-100 hover:border-amber-300 cursor-pointer transition-colors"
            onClick={() => onSelectCredential?.(cred.email, cred.password)}
          >
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-[10px] font-normal">
                {cred.role}
              </Badge>
              <span className="text-xs font-medium">{cred.email}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">{showPasswords ? cred.password : "••••••"}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  handleCopy(cred.email, cred.password)
                }}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
