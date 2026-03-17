"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Users, ArrowLeft, Shield, MapPin, Headphones } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

const staffRoles = [
  { email: "admin@agrobridge.com", role: "Super Admin", icon: Shield, description: "Platform-wide administration" },
  { email: "ops@agrobridge.com", role: "Ops Admin", icon: Users, description: "Manage operations & requests" },
  {
    email: "regional@agrobridge.com",
    role: "Regional Manager",
    icon: MapPin,
    description: "Oversee state coordinators",
  },
  {
    email: "coordinator@agrobridge.com",
    role: "State Coordinator",
    icon: Headphones,
    description: "Supervise field agents",
  },
]

export function StaffLoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const result = await login(email, password)

    if (!result.success) {
      setError(result.error || "Login failed")
    }
    setIsLoading(false)
  }

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword("demo123")
    setError("")
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <Card className="border-border/50 shadow-lg">
        <CardHeader className="text-center pb-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 text-sm justify-center"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to role selection
          </Link>

          <div className="flex justify-center mb-3">
            <div className="bg-[#0F3D2E] p-4 rounded-2xl">
              <Image
                src="/logo-icon.png"
                alt="AgroBridge"
                width={48}
                height={48}
                className="h-12 w-auto brightness-0 invert"
              />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Staff Login</CardTitle>
          <CardDescription>Internal operations & administration</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">{error}</div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@agrobridge.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                Remember me for 30 days
              </Label>
            </div>
            <Button type="submit" className="w-full h-12" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col pt-0">
          <p className="text-xs text-center text-muted-foreground">
            Staff accounts are created by administrators. Contact IT for access.
          </p>
        </CardFooter>
      </Card>

      {/* Demo Staff Accounts */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Demo Staff Accounts</CardTitle>
          <CardDescription className="text-xs">Click to auto-fill credentials (Password: demo123)</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
          {staffRoles.map((account) => (
            <button
              key={account.email}
              type="button"
              onClick={() => handleDemoLogin(account.email)}
              className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/50 hover:border-primary/30 transition-colors text-left"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F3D2E]/10">
                <account.icon className="h-4 w-4 text-[#0F3D2E]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{account.role}</p>
                <p className="text-xs text-muted-foreground truncate">{account.description}</p>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
