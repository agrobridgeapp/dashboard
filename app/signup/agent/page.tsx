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
import { AlertCircle, Loader2, Users, CheckCircle2, Clock } from "lucide-react"
import { NigeriaLocationSelect, type LocationValue } from "@/components/location/nigeria-location-select"

function AgentRegistrationForm() {
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
    email: "",
    education: "",
    experience: "",
    farmingKnowledge: "",
    hasBike: false,
    hasSmartphone: false,
    motivation: "",
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
          role: "field_agent",
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          email: formData.email || undefined,
          state_id: location.stateId || undefined,
          lga_id: location.lgaId || undefined,
          community_name: location.communityName || undefined,
          education: formData.education || undefined,
          experience: formData.experience || undefined,
          farming_knowledge: formData.farmingKnowledge || undefined,
          has_bike: formData.hasBike || false,
          has_smartphone: formData.hasSmartphone || false,
          motivation: formData.motivation || undefined,
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
    } catch (err: any) {
      setError(err.message || "Something went wrong")
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
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <Clock className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold">Application Submitted</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Thank you, {formData.firstName}! Your application to become an AgroBridge Field Agent is under review.
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
          <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-balance">Apply to Become a Field Agent</h1>
          <p className="text-muted-foreground mt-1">
            Earn income empowering farmers in your community
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
              {/* Personal Info */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Personal Information</h3>
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
                    <Label htmlFor="email">Email (optional)</Label>
                    <Input id="email" type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} placeholder="email@example.com" />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Location *</h3>
                <NigeriaLocationSelect
                  value={location}
                  onChange={setLocation}
                  showCommunity={true}
                  allowNewCommunity={true}
                  requiredFields={["state", "lga"]}
                />
              </div>

              {/* Qualifications */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Qualifications</h3>
                <div className="space-y-1.5">
                  <Label>Highest Education</Label>
                  <Select value={formData.education} onValueChange={(v) => updateField("education", v)}>
                    <SelectTrigger><SelectValue placeholder="Select education level" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary">Primary School</SelectItem>
                      <SelectItem value="secondary">Secondary School</SelectItem>
                      <SelectItem value="ond">OND/NCE</SelectItem>
                      <SelectItem value="hnd">HND/Bachelor&apos;s</SelectItem>
                      <SelectItem value="postgraduate">Postgraduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="experience">Previous Experience</Label>
                  <Textarea id="experience" value={formData.experience} onChange={(e) => updateField("experience", e.target.value)} placeholder="Describe relevant work experience" rows={3} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="farmingKnowledge">Farming Knowledge</Label>
                  <Textarea id="farmingKnowledge" value={formData.farmingKnowledge} onChange={(e) => updateField("farmingKnowledge", e.target.value)} placeholder="Your understanding of local farming practices" rows={3} />
                </div>
              </div>

              {/* Resources */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Resources</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox id="hasBike" checked={formData.hasBike} onCheckedChange={(v) => updateField("hasBike", v as boolean)} />
                    <Label htmlFor="hasBike" className="font-normal cursor-pointer text-sm">I have a motorcycle or bicycle</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="hasSmartphone" checked={formData.hasSmartphone} onCheckedChange={(v) => updateField("hasSmartphone", v as boolean)} />
                    <Label htmlFor="hasSmartphone" className="font-normal cursor-pointer text-sm">I have a smartphone with internet</Label>
                  </div>
                </div>
              </div>

              {/* Motivation */}
              <div className="space-y-1.5">
                <Label htmlFor="motivation">Why do you want to join? (optional)</Label>
                <Textarea id="motivation" value={formData.motivation} onChange={(e) => updateField("motivation", e.target.value)} placeholder="What motivates you to work with farmers?" rows={3} />
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

export default function AgentSignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <AgentRegistrationForm />
    </Suspense>
  )
}
