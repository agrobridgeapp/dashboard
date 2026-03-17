"use client"

import type React from "react"
import { useState, Suspense } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2, ShoppingCart, Eye, EyeOff, CheckCircle2 } from "lucide-react"

function BuyerSignupForm() {
  const router = useRouter()
  const { loginWithData } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    password: "",
    confirmPassword: "",
  })

  const passwordChecks = {
    length: formData.password.length >= 8,
    upper: /[A-Z]/.test(formData.password),
    lower: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
  }
  const passwordStrong = Object.values(passwordChecks).every(Boolean)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password) {
      setError("Please fill in all required fields")
      return
    }
    if (!passwordStrong) {
      setError("Password does not meet requirements")
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: "offtaker",
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          metadata: {
            companyName: formData.companyName,
          },
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Signup failed")
        return
      }
      // Update auth context and localStorage
      if (data.user && data.token) {
        loginWithData(data.user, data.token)
      }
      router.push("/dashboard/offtaker")
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="AgroBridge" width={120} height={30} className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">Already have an account?</span>
            <Button variant="outline" asChild size="sm" className="bg-transparent">
              <Link href="/login/app">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-lg">
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
            <ShoppingCart className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-balance">Create Your Buyer Account</h1>
          <p className="text-muted-foreground mt-1">
            Access guaranteed supply from verified farmers
          </p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Account Details</CardTitle>
            <CardDescription>You'll complete your company profile after signing up</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">First Name <span className="text-destructive">*</span></Label>
                  <Input id="firstName" value={formData.firstName} onChange={(e) => updateField("firstName", e.target.value)} placeholder="First name" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">Last Name <span className="text-destructive">*</span></Label>
                  <Input id="lastName" value={formData.lastName} onChange={(e) => updateField("lastName", e.target.value)} placeholder="Last name" required />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} placeholder="you@company.com" required />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number <span className="text-destructive">*</span></Label>
                <Input id="phone" type="tel" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+234 800 000 0000" required />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" value={formData.companyName} onChange={(e) => updateField("companyName", e.target.value)} placeholder="Your company (optional)" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    placeholder="Create a strong password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {formData.password && (
                  <div className="grid grid-cols-2 gap-1.5 mt-2">
                    {[
                      { label: "8+ characters", ok: passwordChecks.length },
                      { label: "Uppercase", ok: passwordChecks.upper },
                      { label: "Lowercase", ok: passwordChecks.lower },
                      { label: "Number", ok: passwordChecks.number },
                    ].map((check) => (
                      <div key={check.label} className={`flex items-center gap-1 text-xs ${check.ok ? "text-emerald-600" : "text-muted-foreground"}`}>
                        <CheckCircle2 className={`h-3 w-3 ${check.ok ? "text-emerald-600" : "text-muted-foreground/40"}`} />
                        {check.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm Password <span className="text-destructive">*</span></Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateField("confirmPassword", e.target.value)}
                  placeholder="Confirm your password"
                  required
                />
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-destructive">Passwords do not match</p>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By signing up you agree to our Terms of Service and Privacy Policy
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function BuyerSignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <BuyerSignupForm />
    </Suspense>
  )
}
