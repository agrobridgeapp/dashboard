"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2, AlertCircle, Leaf, ShieldCheck } from "lucide-react"

export default function InviteAcceptPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [tokenData, setTokenData] = useState<{
    role: string
    first_name: string
    last_name: string
    email: string | null
    phone: string
  } | null>(null)

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [email, setEmail] = useState("")

  // Verify token on load
  useEffect(() => {
    if (!token) {
      setError("No invite token provided. Please use the link from your approval notification.")
      setLoading(false)
      return
    }

    const verifyToken = async () => {
      try {
        const res = await fetch(`/api/auth/invite?token=${encodeURIComponent(token)}`)
        const data = await res.json()
        if (!data.success) throw new Error(data.error || "Invalid token")
        const inv = data.invite
        setTokenData({
          role: inv.role,
          first_name: inv.firstName,
          last_name: inv.lastName,
          email: inv.email,
          phone: inv.phone,
        })
        if (inv.email) setEmail(inv.email)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Invalid or expired invite link")
      } finally {
        setLoading(false)
      }
    }

    verifyToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email) {
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
        body: JSON.stringify({ token, email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create account")
      setSuccess(true)
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login/app")
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
            <Leaf className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">AgroBridge</span>
        </div>

        {loading && (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        )}

        {!loading && error && !tokenData && (
          <Card>
            <CardContent className="py-8">
              <div className="text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Invalid Invite Link</h3>
                  <p className="text-sm text-muted-foreground mt-1">{error}</p>
                </div>
                <Button variant="outline" onClick={() => router.push("/login/app")}>
                  Go to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!loading && success && (
          <Card>
            <CardContent className="py-8">
              <div className="text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Account Created Successfully</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Redirecting you to the login page...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!loading && tokenData && !success && (
          <Card>
            <CardHeader className="text-center">
              <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
              </div>
              <CardTitle className="text-xl">Welcome, {tokenData.first_name}!</CardTitle>
              <CardDescription>
                Your {tokenData.role === "field_agent" ? "Field Agent" : "Farmer"} registration has been approved.
                Set your password to complete your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be your login email
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">
                    Password <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    required
                    minLength={8}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Confirm Password <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Create Account
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
