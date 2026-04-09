"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, CheckCircle2, MapPin, User, Sprout, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const nigerianStates = [
  "Kaduna", "Kano", "Katsina", "Sokoto", "Zamfara",
  "Kebbi", "Niger", "Benue", "Plateau", "Nasarawa", "Kogi", "Kwara",
]

export function FarmerDirectSignupForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    state: "",
    lga: "",
    village: "",
    farmSizeHectares: "",
    cropInterest: "",
    farmingExperience: "",
    additionalInfo: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "farmer",
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          email: formData.email || undefined,
          community_name: formData.village,
          farm_size: formData.farmSizeHectares ? Number(formData.farmSizeHectares) : undefined,
          crop_types: formData.cropInterest ? [formData.cropInterest] : undefined,
          experience: formData.farmingExperience || undefined,
          motivation: formData.additionalInfo || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        const rawError = data.error || "Registration failed. Please try again."
        const friendlyError = rawError
          .replace(/\bfirst_name\b/g, "First Name")
          .replace(/\blast_name\b/g, "Last Name")
          .replace(/\bphone\b/g, "Phone Number")
          .replace(/\brole\b/g, "Role")
        setError(friendlyError)
        return
      }

      setIsSuccess(true)
    } catch {
      setError("Something went wrong. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center py-8">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-3">
            <CheckCircle2 className="h-16 w-16 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">Registration Received!</h3>
          <p className="text-muted-foreground">
            Thank you, {formData.firstName}. Your application is now in our review queue.
          </p>
        </div>
        <Alert>
          <AlertDescription className="text-left space-y-2">
            <p className="font-medium">What happens next:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Our ops team will review your application within 24–48 hours</li>
              <li>Once approved, you'll receive an email to set up your account</li>
              <li>After setup, you can log in and access the farmer dashboard</li>
              {formData.phone && <li>We may also reach you on {formData.phone} for verification</li>}
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <User className="h-4 w-4" />
          Personal Information
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              required
              placeholder="08012345678"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="farmer@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">Used to send your account invite</p>
          </div>
        </div>
      </div>

      {/* Location Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <MapPin className="h-4 w-4" />
          Farm Location
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="state">State *</Label>
            <Select
              required
              value={formData.state}
              onValueChange={(value) => setFormData({ ...formData, state: value })}
            >
              <SelectTrigger id="state">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {nigerianStates.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lga">Local Government Area *</Label>
            <Input
              id="lga"
              required
              placeholder="e.g., Kaduna North"
              value={formData.lga}
              onChange={(e) => setFormData({ ...formData, lga: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="village">Village/Community *</Label>
          <Input
            id="village"
            required
            placeholder="Your village name"
            value={formData.village}
            onChange={(e) => setFormData({ ...formData, village: e.target.value })}
          />
        </div>
      </div>

      {/* Farm Details */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Sprout className="h-4 w-4" />
          Farm Details
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="farmSize">Farm Size (Hectares) *</Label>
            <Input
              id="farmSize"
              type="number"
              step="0.1"
              min="0"
              required
              placeholder="e.g., 2.5"
              value={formData.farmSizeHectares}
              onChange={(e) => setFormData({ ...formData, farmSizeHectares: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cropInterest">Crop of Interest *</Label>
            <Select
              required
              value={formData.cropInterest}
              onValueChange={(value) => setFormData({ ...formData, cropInterest: value })}
            >
              <SelectTrigger id="cropInterest">
                <SelectValue placeholder="Select crop" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maize">Maize</SelectItem>
                <SelectItem value="rice">Rice</SelectItem>
                <SelectItem value="soybean">Soybean</SelectItem>
                <SelectItem value="sorghum">Sorghum</SelectItem>
                <SelectItem value="cassava">Cassava</SelectItem>
                <SelectItem value="groundnut">Groundnut</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="experience">Years of Farming Experience *</Label>
          <Input
            id="experience"
            required
            placeholder="e.g., 5 years"
            value={formData.farmingExperience}
            onChange={(e) => setFormData({ ...formData, farmingExperience: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
          <Textarea
            id="additionalInfo"
            placeholder="Tell us more about your farm, challenges, or questions..."
            value={formData.additionalInfo}
            onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
            rows={3}
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Alert>
        <AlertDescription className="text-sm">
          <p className="font-medium mb-2">Important:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Your registration will be reviewed by our operations team</li>
            <li>Once approved, you'll receive an email to set up your dashboard account</li>
            <li>Provide a valid email address — it will be used to send your invite</li>
          </ul>
        </AlertDescription>
      </Alert>

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Registration"
        )}
      </Button>
    </form>
  )
}
