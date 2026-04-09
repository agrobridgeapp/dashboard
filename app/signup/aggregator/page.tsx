"use client"

import type React from "react"
import { useState, Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Loader2, Package, CheckCircle2, Clock } from "lucide-react"
import { NigeriaLocationSelect, type LocationValue } from "@/components/location/nigeria-location-select"

function AggregatorRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const [location, setLocation] = useState<LocationValue>({
    stateId: "", stateName: "", lgaId: "", lgaName: "", communityName: "",
  })

  const [formData, setFormData] = useState({
    businessName: "",
    contactName: "",
    phone: "",
    email: "",
    yearsInOperation: "",
    monthlyCapacity: "",
    primaryCrops: "",
    hasWarehouse: false,
    hasVehicles: false,
    additionalInfo: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.businessName || !formData.contactName || !formData.phone || !location.stateId || !location.lgaId) {
      setError("Please fill in all required fields including State and LGA")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "aggregator",
          first_name: formData.contactName.split(" ")[0],
          last_name: formData.contactName.split(" ").slice(1).join(" ") || formData.businessName,
          phone: formData.phone,
          email: formData.email || undefined,
          state_id: location.stateId || undefined,
          lga_id: location.lgaId || undefined,
          community_name: location.communityName || undefined,
          metadata: {
            businessName: formData.businessName,
            yearsInOperation: formData.yearsInOperation,
            monthlyCapacity: formData.monthlyCapacity,
            primaryCrops: formData.primaryCrops,
            hasWarehouse: formData.hasWarehouse,
            hasVehicles: formData.hasVehicles,
            additionalInfo: formData.additionalInfo,
          },
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        const rawError = data.error || "Registration failed"
        const friendlyError = rawError
          .replace(/\bfirst_name\b/g, "First Name")
          .replace(/\blast_name\b/g, "Last Name")
          .replace(/\bphone\b/g, "Phone Number")
          .replace(/\brole\b/g, "Role")
        setError(friendlyError)
        return
      }
      setSubmitted(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-8 space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
              <Clock className="h-8 w-8 text-amber-600" />
            </div>
            <h2 className="text-xl font-bold">Application Submitted</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Thank you! Your application to become an AgroBridge Aggregator is under review.
              We will contact you on <span className="font-medium text-foreground">{formData.phone}</span> once your application is approved.
            </p>
            <div className="pt-2 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                No password needed until approved
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Review takes 2-5 business days
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
            <span className="text-sm text-muted-foreground hidden sm:inline">Already approved?</span>
            <Button variant="outline" asChild size="sm" className="bg-transparent">
              <Link href="/login/app">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3">
            <Package className="h-6 w-6 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-balance">Apply to Become an Aggregator</h1>
          <p className="text-muted-foreground mt-1">
            Receive supply orders and grow your aggregation business
          </p>
          <p className="text-xs text-muted-foreground mt-2 bg-muted/50 rounded-lg px-3 py-2 inline-block">
            No password required now. You'll create your account after approval.
          </p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Application Form</CardTitle>
            <CardDescription>Fields marked * are required</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Business Info */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Business Information</h3>
                <div className="space-y-1.5">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input id="businessName" value={formData.businessName} onChange={(e) => updateField("businessName", e.target.value)} placeholder="Your company or trade name" required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="contactName">Contact Person *</Label>
                    <Input id="contactName" value={formData.contactName} onChange={(e) => updateField("contactName", e.target.value)} placeholder="Full name" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" type="tel" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+234 800 000 0000" required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} placeholder="email@example.com" />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Business Location *</h3>
                <NigeriaLocationSelect
                  value={location}
                  onChange={setLocation}
                  showCommunity={true}
                  allowNewCommunity={true}
                  requiredFields={["state", "lga"]}
                />
              </div>

              {/* Capacity */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Capacity & Experience</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Years in Operation</Label>
                    <Select value={formData.yearsInOperation} onValueChange={(v) => updateField("yearsInOperation", v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">Less than 1 year</SelectItem>
                        <SelectItem value="1-3">1-3 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="5+">5+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Monthly Capacity (MT)</Label>
                    <Select value={formData.monthlyCapacity} onValueChange={(v) => updateField("monthlyCapacity", v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-50">0-50 MT</SelectItem>
                        <SelectItem value="50-100">50-100 MT</SelectItem>
                        <SelectItem value="100-500">100-500 MT</SelectItem>
                        <SelectItem value="500+">500+ MT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="primaryCrops">Primary Crops You Handle</Label>
                  <Input id="primaryCrops" value={formData.primaryCrops} onChange={(e) => updateField("primaryCrops", e.target.value)} placeholder="e.g., Maize, Soybean, Sorghum" />
                </div>
              </div>

              {/* Resources */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Resources</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox id="hasWarehouse" checked={formData.hasWarehouse} onCheckedChange={(v) => updateField("hasWarehouse", v as boolean)} />
                    <Label htmlFor="hasWarehouse" className="font-normal cursor-pointer text-sm">I have warehouse or storage space</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="hasVehicles" checked={formData.hasVehicles} onCheckedChange={(v) => updateField("hasVehicles", v as boolean)} />
                    <Label htmlFor="hasVehicles" className="font-normal cursor-pointer text-sm">I have vehicles for transportation</Label>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-1.5">
                <Label htmlFor="additionalInfo">Tell us about your business (optional)</Label>
                <Textarea id="additionalInfo" value={formData.additionalInfo} onChange={(e) => updateField("additionalInfo", e.target.value)} placeholder="Coverage areas, farmer networks, why you want to partner with AgroBridge" rows={3} />
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
                  "Submit Application"
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                We'll review and contact you within 3-5 business days
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AggregatorSignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <AggregatorRegistrationForm />
    </Suspense>
  )
}
