"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { NigeriaLocationSelect, type LocationValue } from "@/components/location/nigeria-location-select"

export function AgentOnboardingForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const [location, setLocation] = useState<LocationValue>({
    stateId: "",
    stateName: "",
    lgaId: "",
    lgaName: "",
    communityName: "",
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
    references: "",
    motivation: "",
    referredBy: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.firstName || !formData.lastName || !formData.phone || !location.stateId) {
      setError("Please fill in all required fields including your location.")
      return
    }

    if (!formData.email) {
      setError("An email address is required so we can send your account invite once approved.")
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
          email: formData.email,
          state_id: location.stateId || undefined,
          lga_id: location.lgaId || undefined,
          community_name: location.communityName || undefined,
          education: formData.education || undefined,
          experience: formData.experience || undefined,
          farming_knowledge: formData.farmingKnowledge || undefined,
          has_bike: formData.hasBike,
          has_smartphone: formData.hasSmartphone,
          references_text: formData.references || undefined,
          motivation: formData.motivation || undefined,
          referred_by: formData.referredBy || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error || "Submission failed. Please try again.")
        return
      }

      router.push("/onboarding/agent/success")
    } catch {
      setError("Something went wrong. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">
              First Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              placeholder="Enter first name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">
              Last Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              placeholder="Enter last name"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+234 800 000 0000"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="your.email@example.com"
              required
            />
            <p className="text-xs text-muted-foreground">Your invite will be sent here if approved</p>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Location</h3>
        <NigeriaLocationSelect
          value={location}
          onChange={setLocation}
          showCommunity={true}
          allowNewCommunity={true}
          requiredFields={["state", "lga"]}
        />
      </div>

      {/* Qualifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Qualifications</h3>

        <div className="space-y-2">
          <Label htmlFor="education">Highest Education Level</Label>
          <Select value={formData.education} onValueChange={(value) => handleChange("education", value)}>
            <SelectTrigger id="education">
              <SelectValue placeholder="Select education level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="primary">Primary School</SelectItem>
              <SelectItem value="secondary">Secondary School</SelectItem>
              <SelectItem value="ond">OND/NCE</SelectItem>
              <SelectItem value="hnd">HND/Bachelor's</SelectItem>
              <SelectItem value="postgraduate">Postgraduate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience">Previous Work Experience</Label>
          <Textarea
            id="experience"
            value={formData.experience}
            onChange={(e) => handleChange("experience", e.target.value)}
            placeholder="Describe any previous work experience (agricultural, sales, community organizing, etc.)"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="farmingKnowledge">Knowledge of Farming Practices</Label>
          <Textarea
            id="farmingKnowledge"
            value={formData.farmingKnowledge}
            onChange={(e) => handleChange("farmingKnowledge", e.target.value)}
            placeholder="Tell us about your understanding of local farming practices, crops, and seasons"
            rows={3}
          />
        </div>
      </div>

      {/* Resources */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Resources & Mobility</h3>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasBike"
              checked={formData.hasBike}
              onCheckedChange={(checked) => handleChange("hasBike", checked as boolean)}
            />
            <Label htmlFor="hasBike" className="text-sm font-normal cursor-pointer">
              I have a motorcycle or bicycle for field visits
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasSmartphone"
              checked={formData.hasSmartphone}
              onCheckedChange={(checked) => handleChange("hasSmartphone", checked as boolean)}
            />
            <Label htmlFor="hasSmartphone" className="text-sm font-normal cursor-pointer">
              I have a smartphone with internet access
            </Label>
          </div>
        </div>
      </div>

      {/* Referral */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Referral (Optional)</h3>

        <div className="space-y-2">
          <Label htmlFor="referredBy">Referral Code</Label>
          <Input
            id="referredBy"
            value={formData.referredBy}
            onChange={(e) => handleChange("referredBy", e.target.value.toUpperCase())}
            placeholder="Enter referral code if you were referred (e.g., AGR-ABC123)"
          />
          <p className="text-xs text-muted-foreground">
            If another agent referred you, enter their code to help them earn rewards
          </p>
        </div>
      </div>

      {/* References & Motivation */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="references">References (Optional)</Label>
          <Textarea
            id="references"
            value={formData.references}
            onChange={(e) => handleChange("references", e.target.value)}
            placeholder="Provide names and phone numbers of 2 people who can speak to your character and work ethic"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="motivation">Why do you want to be a field agent?</Label>
          <Textarea
            id="motivation"
            value={formData.motivation}
            onChange={(e) => handleChange("motivation", e.target.value)}
            placeholder="Tell us what motivates you to work with farmers in your community"
            rows={4}
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Submitting Application...
          </>
        ) : (
          <>
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Submit Application
          </>
        )}
      </Button>

      <p className="text-sm text-muted-foreground text-center">
        We'll review your application and contact you within 3–5 business days
      </p>
    </form>
  )
}
