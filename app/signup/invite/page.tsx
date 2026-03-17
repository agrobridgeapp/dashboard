"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle2, Shield, Eye, EyeOff, AlertCircle, MapPin, User } from "lucide-react"
import { Header } from "@/components/header"
import { useAuth } from "@/lib/auth-context"

interface InviteData {
  token: string
  role: string
  email: string | null
  phone: string
  registrationId: string
  firstName: string
  lastName: string
  stateName: string | null
  lgaName: string | null
  communityName: string | null
  expiresAt: string
}

export default function InviteSignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { loginWithData } = useAuth()
  const token = searchParams.get("token")

  const [invite, setInvite] = useState<InviteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setError("No invite token provided. Please check the link you received.")
      setLoading(false)
      return
    }

    const verifyToken = async () => {
      try {
        const res = await fetch(`/api/auth/invite?token=${encodeURIComponent(token)}`)
        const data = await res.json()

        if (!data.success) {
          setError(data.error || "Invalid invite token")
          setLoading(false)
          return
        }

        setInvite(data.invite)
        if (data.invite.email) {
          setEmail(data.invite.email)
        }
      } catch (err) {
        setError("Failed to verify invite. Please try again.")
      }
      setLoading(false)
    }

    verifyToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email.trim()) {
      setError("Email address is required")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch("/api/auth/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email: email.trim(), password }),
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.error || "Account creation failed")
        setSubmitting(false)
        return
      }

      // Update auth context state and localStorage
      if (data.user && data.token) {
        loginWithData(data.user, data.token)
      }

      setSuccess(true)

      // Redirect to the role dashboard after a brief success message
      setTimeout(() => {
        const dashboardRoutes: Record<string, string> = {
          field_agent: "/dashboard/agent",
          farmer: "/dashboard/farmer",
          partner: "/dashboard/partner",
          offtaker: "/dashboard/offtaker",
        }
        const role = data.user?.role || invite?.role || "farmer"
        router.push(dashboardRoutes[role] || "/dashboard")
      }, 2000)
    } catch (err) {
      setError("Something went wrong. Please try again.")
      setSubmitting(false)
    }
  }

  const roleLabels: Record<string, string> = {
    field_agent: "Field Agent",
    farmer: "Farmer",
    partner: "Service Partner",
    offtaker: "Buyer / Offtaker",
  }

  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 8 ? 2 : /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password) ? 4 : 3

  return (
    <div className="min-h-screen bg-[#F5F3EE]">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24 max-w-lg">
        {/* Loading */}
        {loading && (
          <Card className="border-0 shadow-lg">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Verifying your invite...</p>
            </CardContent>
          </Card>
        )}

        {/* Error state */}
        {!loading && error && !invite && (
          <Card className="border-0 shadow-lg">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-destructive/10 p-4 rounded-full mb-4">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Invalid Invite</h2>
              <p className="text-muted-foreground mb-6 max-w-sm">{error}</p>
              <Button asChild variant="outline">
                <Link href="/login">Go to Login</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Success state */}
        {success && (
          <Card className="border-0 shadow-lg">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Account Created!</h2>
              <p className="text-muted-foreground mb-2">
                Welcome aboard, {invite?.firstName}. Redirecting you to complete your profile...
              </p>
              <Loader2 className="h-5 w-5 animate-spin text-primary mt-3" />
            </CardContent>
          </Card>
        )}

        {/* Main form */}
        {!loading && invite && !success && (
          <div className="space-y-6">
            {/* Welcome header */}
            <div className="text-center">
              <Image src="/logo.png" alt="AgroBridge" width={180} height={44} className="h-11 w-auto mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground">
                Welcome, {invite.firstName}!
              </h1>
              <p className="text-muted-foreground mt-1">
                Your application has been approved. Set up your account to get started.
              </p>
            </div>

            {/* Registration summary card */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-medium">{invite.firstName} {invite.lastName}</span>
                      <Badge variant="secondary" className="text-xs">
                        {roleLabels[invite.role] || invite.role}
                      </Badge>
                    </div>
                    {invite.phone && (
                      <p className="text-sm text-muted-foreground">{invite.phone}</p>
                    )}
                    {(invite.stateName || invite.lgaName) && (
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {[invite.communityName, invite.lgaName, invite.stateName].filter(Boolean).join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account setup form */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="h-5 w-5 text-primary" />
                  Set Up Your Account
                </CardTitle>
                <CardDescription>
                  Choose an email and password to secure your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      disabled={submitting}
                    />
                    <p className="text-xs text-muted-foreground">
                      You will use this email to log in
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 8 characters"
                        required
                        minLength={8}
                        disabled={submitting}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">{showPassword ? "Hide" : "Show"} password</span>
                      </Button>
                    </div>
                    {/* Strength indicator */}
                    {password.length > 0 && (
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              passwordStrength >= level
                                ? level <= 1
                                  ? "bg-destructive"
                                  : level <= 2
                                    ? "bg-orange-400"
                                    : level <= 3
                                      ? "bg-yellow-400"
                                      : "bg-primary"
                                : "bg-muted"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter your password"
                        required
                        minLength={8}
                        disabled={submitting}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowConfirm(!showConfirm)}
                      >
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">{showConfirm ? "Hide" : "Show"} password</span>
                      </Button>
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-xs text-destructive">Passwords do not match</p>
                    )}
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-[#0F3D2E] hover:bg-[#0F3D2E]/90"
                    disabled={submitting || !email || password.length < 8 || password !== confirmPassword}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account & Continue"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login/app" className="text-primary hover:underline font-medium">
                Log in
              </Link>
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
