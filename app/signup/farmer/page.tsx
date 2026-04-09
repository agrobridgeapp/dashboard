"use client"

import type React from "react"
import { useState, Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Loader2, Leaf, CheckCircle2, Clock } from "lucide-react"
import { NigeriaLocationSelect, type LocationValue } from "@/components/location/nigeria-location-select"

function FarmerRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const [location, setLocation] = useState<LocationValue>({
    stateId: "", stateName: "", lgaId: "", lgaName: "", communityName: "",
  })

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    gender: "",
    farmSize: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.firstName || !formData.lastName || !formData.phone || !location.stateId || !location.lgaId) {
      setError("Please fill in all required fields including State and LGA")
      return
    }

    const phoneRegex = /^(\+234|0)[789]\d{9}$/
    if (!phoneRegex.test(formData.phone.replace(/\s+/g, ""))) {
      setError("Please enter a valid Nigerian phone number (e.g. 08012345678 or +2348012345678)")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "farmer",
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          state_id: location.stateId || undefined,
          lga_id: location.lgaId || undefined,
          community_name: location.communityName || undefined,
          farm_size: formData.farmSize ? Number(formData.farmSize) : undefined,
          metadata: {
            gender: formData.gender,
            stateName: location.stateName,
            lgaName: location.lgaName,
          },
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        const rawError = data.error || "Registration failed"
        // Replace raw API field names with user-friendly labels
        const friendlyError = rawError
          .replace(/\bfirst_name\b/g, "First Name")
          .replace(/\blast_name\b/g, "Last Name")
          .replace(/\bphone\b/g, "Phone Number")
          .replace(/\brole\b/g, "Role")
        setError(friendlyError)
        return
      }
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-8 space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <Clock className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold">Registration Received</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Thank you, {formData.firstName}! Your registration has been received and is being reviewed.
              A field agent or AgroBridge team member will contact you on <span className="font-medium text-foreground">{formData.phone}</span>.
            </p>
            <div className="pt-2 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                No password needed now
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                A verification visit will be scheduled
              </div>
            </div>
            <Button asChild variant="outline" className="mt-4 bg-transparent">
              <Link href="/">Return Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="AgroBridge" width={120} height={30} className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">Already registered?</span>
            <Button variant="outline" asChild size="sm" className="bg-transparent">
              <Link href="/login/app">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-lg">
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
            <Leaf className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-balance">Register as a Farmer</h1>
          <p className="text-muted-foreground mt-1">
            Access inputs, guaranteed markets, and fair prices
          </p>
          <p className="text-xs text-muted-foreground mt-2 bg-muted/50 rounded-lg px-3 py-2 inline-block">
            Quick registration - no password needed. A field agent will verify your details.
          </p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Farmer Details</CardTitle>
            <CardDescription>Fields marked * are required</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Personal Info */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" value={formData.firstName} onChange={(e) => updateField("firstName", e.target.value)} placeholder="First name" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" value={formData.lastName} onChange={(e) => updateField("lastName", e.target.value)} placeholder="Last name" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" type="tel" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+234 800 000 0000" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Gender</Label>
                    <Select value={formData.gender} onValueChange={(v) => updateField("gender", v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Farm Location *</h3>
                <NigeriaLocationSelect
                  value={location}
                  onChange={setLocation}
                  showCommunity={true}
                  allowNewCommunity={true}
                  requiredFields={["state", "lga"]}
                />
              </div>

              {/* Farm Size */}
              <div className="space-y-1.5">
                <Label htmlFor="farmSize">Estimated Farm Size (Hectares)</Label>
                <Input id="farmSize" type="number" step="0.1" min="0" value={formData.farmSize} onChange={(e) => updateField("farmSize", e.target.value)} placeholder="e.g. 3.5" />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</>
                ) : (
                  "Submit Registration"
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                A field agent will visit to verify your farm details
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function FarmerSignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <FarmerRegistrationForm />
    </Suspense>
  )
}
