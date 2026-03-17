"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, ArrowLeft, CheckCircle2, TrendingUp } from "lucide-react"
import { DASHBOARD_ROUTES, type AnyRole } from "@/lib/auth/role-constants"
import { useAuth } from "@/lib/auth-context"

interface RoleLoginFormProps {
  role: string
  title: string
  subtitle: string
  image: string
  benefits: string[]
  earningsHighlight?: string
  demoEmail?: string
  registerPath?: string
}

export function RoleLoginForm({
  role,
  title,
  subtitle,
  image,
  benefits,
  earningsHighlight,
  registerPath,
}: RoleLoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const { loginWithData } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        const errMsg =
          typeof data.error === "string" ? data.error : data.error?.message || "Login failed"
        setError(errMsg)
        return
      }

      const { user, token } = data.data
      // Update auth context state so DashboardLayout sees the authenticated user
      loginWithData(user, token)

      const redirectPath = DASHBOARD_ROUTES[user.role as AnyRole] ?? "/login"
      router.push(redirectPath)
    } catch (err: any) {
      setError(err.message || "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-5xl px-3 sm:px-4 lg:px-0">
      <Card className="overflow-hidden border-border/50 shadow-xl">
        <div className="grid lg:grid-cols-2">
          {/* Left Side - Image & Benefits */}
          <div className="relative hidden lg:block bg-[#0F3D2E]">
            <div className="absolute inset-0">
              <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover opacity-40" />
            </div>
            <div className="relative h-full flex flex-col justify-between p-6 xl:p-8 text-white">
              <div>
                <Link
                  href="/login/app"
                  className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 xl:mb-8"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="text-sm">Back to role selection</span>
                </Link>

                <h2 className="text-xl xl:text-2xl font-bold mb-2">{title}</h2>
                <p className="text-white/80 text-sm mb-6 xl:mb-8">{subtitle}</p>

                {earningsHighlight && (
                  <Badge className="bg-white/20 text-white hover:bg-white/30 mb-6 xl:mb-8 text-xs xl:text-sm py-1 xl:py-1.5">
                    <TrendingUp className="h-3.5 w-3.5 xl:h-4 xl:w-4 mr-2" />
                    {earningsHighlight}
                  </Badge>
                )}
              </div>

              <div>
                <p className="text-xs xl:text-sm text-white/60 mb-3 xl:mb-4 uppercase tracking-wider">What you get</p>
                <ul className="space-y-2 xl:space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 xl:gap-3">
                      <CheckCircle2 className="h-4 w-4 xl:h-5 xl:w-5 text-green-400 mt-0.5 shrink-0" />
                      <span className="text-sm xl:text-base text-white/90">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <CardContent className="p-5 sm:p-6 lg:p-8 xl:p-10">
            {/* Mobile/Tablet Back Link */}
            <Link
              href="/login/app"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 sm:mb-6 lg:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to role selection</span>
            </Link>

            <div className="flex justify-center mb-4 sm:mb-6">
              <Image src="/logo-icon.png" alt="AgroBridge" width={64} height={64} className="h-12 sm:h-16 w-auto" />
            </div>

            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2">Welcome back</h1>
              <p className="text-sm text-muted-foreground">Sign in to your {title.toLowerCase()}</p>
            </div>

            {/* Mobile/Tablet Benefits */}
            <div className="lg:hidden mb-5 sm:mb-6 p-3 sm:p-4 bg-primary/5 rounded-lg">
              {earningsHighlight && (
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 mb-2 sm:mb-3 text-xs">
                  <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1.5" />
                  {earningsHighlight}
                </Badge>
              )}
              <ul className="space-y-1.5 sm:space-y-2">
                {benefits.slice(0, 2).map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary mt-0.5 shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {error && (
                <div className="p-2.5 sm:p-3 text-xs sm:text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="email" className="text-sm">
                  Email or Phone
                </Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Enter your email or phone number"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-10 sm:h-12"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm">
                    Password
                  </Label>
                  <Link href="/forgot-password" className="text-xs sm:text-sm text-primary hover:underline">
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
                    className="h-10 sm:h-12 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-xs sm:text-sm font-normal cursor-pointer">
                  Remember me for 30 days
                </Label>
              </div>

              <Button type="submit" className="w-full h-10 sm:h-12 text-sm sm:text-base" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            {/* Register Link */}
            {registerPath && (
              <p className="text-center text-xs sm:text-sm text-muted-foreground mt-5 sm:mt-6">
                {"Don't have an account? "}
                <Link href={registerPath} className="text-primary font-medium hover:underline">
                  Register now
                </Link>
              </p>
            )}
          </CardContent>
        </div>
      </Card>
    </div>
  )
}
