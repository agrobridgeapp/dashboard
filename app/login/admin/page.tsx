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
import { Eye, EyeOff, ArrowLeft, Shield } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function AdminLoginPage() {
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

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
          <Link
            href="/login"
            className="flex items-center gap-1.5 sm:gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back</span>
          </Link>

          <div className="flex items-center gap-3">
            <Image
              src="/logo-white.png"
              alt="AgroBridge"
              width={400}
              height={100}
              className="h-14 sm:h-16 md:h-20 w-auto"
              priority
            />
          </div>

          <Link href="/" className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors">
            Website
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="flex flex-col items-center gap-6 sm:gap-8">
          {/* Login Card */}
          <Card className="w-full max-w-md border-slate-700 bg-slate-800/50 shadow-2xl">
            <CardHeader className="text-center pb-3 sm:pb-4">
              <div className="flex justify-center mb-3 sm:mb-4">
                <div className="bg-slate-700 p-3 sm:p-4 rounded-2xl">
                  <Image
                    src="/logo-icon-white.png"
                    alt="AgroBridge"
                    width={48}
                    height={48}
                    className="h-10 w-10 sm:h-12 sm:w-auto"
                  />
                </div>
              </div>
              <div className="inline-flex items-center gap-2 justify-center mb-2">
                <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400" />
                <span className="text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Internal Platform
                </span>
              </div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-white">AgroBridge Admin</CardTitle>
              <CardDescription className="text-sm text-slate-400">
                Sign in to access operations dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                {error && (
                  <div className="p-2.5 sm:p-3 text-xs sm:text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
                    {error}
                  </div>
                )}
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="email" className="text-sm text-slate-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@agrobridge.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-10 sm:h-12 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-primary"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm text-slate-300">
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
                      className="h-10 sm:h-12 pr-12 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
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
                  <Checkbox
                    id="remember"
                    className="border-slate-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor="remember" className="text-xs sm:text-sm font-normal cursor-pointer text-slate-400">
                    Remember me for 30 days
                  </Label>
                </div>
                <Button type="submit" className="w-full h-10 sm:h-12" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col pt-0 px-4 sm:px-6">
              <p className="text-[10px] sm:text-xs text-center text-slate-500">
                Staff accounts are created by administrators. Contact IT for access.
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
