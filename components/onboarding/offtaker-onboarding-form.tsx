"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, User, CheckCircle, ArrowRight, ArrowLeft, Phone, Mail, Briefcase } from "lucide-react"
import { NigeriaLocationSelect, type LocationValue } from "@/components/location/nigeria-location-select"

const steps = [
  { id: 1, title: "Company Info", icon: Building2 },
  { id: 2, title: "Contact Person", icon: User },
  { id: 3, title: "Sourcing Needs", icon: Briefcase },
  { id: 4, title: "Review", icon: CheckCircle },
]

const buyerTypes = [
  { value: "processor", label: "Food Processor" },
  { value: "exporter", label: "Exporter" },
  { value: "aggregator", label: "Aggregator" },
  { value: "retailer", label: "Retailer / Distributor" },
  { value: "manufacturer", label: "Manufacturer" },
  { value: "other", label: "Other" },
]

const crops = [
  "Maize",
  "Rice",
  "Soybean",
  "Wheat",
  "Sorghum",
  "Millet",
  "Sesame",
  "Groundnut",
  "Cowpea",
  "Cassava",
  "Yam",
  "Cocoa",
  "Cashew",
  "Coffee",
  "Cotton",
  "Palm Oil",
  "Vegetables",
  "Fruits",
  "Poultry",
  "Cattle",
  "Goats",
  "Sheep",
  "Fish",
  "Dairy",
  "Eggs",
  "Honey",
  "Other",
]

const volumeRanges = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
]

const qualityGrades = [
  { value: "grade1", label: "Grade 1" },
  { value: "grade2", label: "Grade 2" },
  { value: "grade3", label: "Grade 3" },
]

export function OfftakerOnboardingForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [companyLocation, setCompanyLocation] = useState<LocationValue>({
    stateId: "",
    stateName: "",
    lgaId: "",
    lgaName: "",
  })
  const [formData, setFormData] = useState({
    // Company Info
    companyName: "",
    buyerType: "",
    registrationNumber: "",
    taxId: "",
    address: "",
    city: "",
    state: "",
    country: "",
    website: "",

    // Contact Person
    contactName: "",
    contactRole: "",
    contactPhone: "",
    contactEmail: "",
    alternatePhone: "",

    // Sourcing Needs
    interestedCrops: [] as string[],
    otherProduct: "",
    volumeRange: "",
    qualityGrade: "",
    deliveryLocations: "",
    paymentTerms: "",
    additionalRequirements: "",

    // Terms
    acceptTerms: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const updateField = (field: string, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const toggleCrop = (crop: string) => {
    const current = formData.interestedCrops
    if (current.includes(crop)) {
      updateField(
        "interestedCrops",
        current.filter((c) => c !== crop),
      )
    } else {
      updateField("interestedCrops", [...current, crop])
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.companyName.trim()) newErrors.companyName = "Company name is required"
      if (!formData.buyerType) newErrors.buyerType = "Please select buyer type"
      if (!formData.address.trim()) newErrors.address = "Address is required"
      if (!formData.city.trim()) newErrors.city = "City is required"
      if (!formData.country.trim()) newErrors.country = "Country is required"
    }

    if (step === 2) {
      if (!formData.contactName.trim()) newErrors.contactName = "Contact name is required"
      if (!formData.contactPhone.trim()) newErrors.contactPhone = "Phone number is required"
      if (!formData.contactEmail.trim()) {
        newErrors.contactEmail = "Email is required"
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
        newErrors.contactEmail = "Invalid email format"
      }
    }

    if (step === 3) {
      if (formData.interestedCrops.length === 0) newErrors.interestedCrops = "Select at least one product"
      if (formData.interestedCrops.includes("Other") && !formData.otherProduct.trim()) {
        newErrors.otherProduct = "Please specify the product"
      }
      if (!formData.volumeRange) newErrors.volumeRange = "Please select volume range"
      if (!formData.qualityGrade) newErrors.qualityGrade = "Please select quality grade"
    }

    if (step === 4) {
      if (!formData.acceptTerms) newErrors.acceptTerms = "You must accept the terms"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4))
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(4)) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    router.push("/onboarding/offtaker/success")
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  currentStep >= step.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {currentStep > step.id ? <CheckCircle className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
              </div>
              <span
                className={`text-xs mt-2 hidden sm:block ${
                  currentStep >= step.id ? "text-primary font-medium" : "text-muted-foreground"
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 sm:w-24 h-1 mx-2 rounded ${currentStep > step.id ? "bg-primary" : "bg-muted"}`} />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="p-6 md:p-8">
          {/* Step 1: Company Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Company Information</h2>
                <p className="text-muted-foreground">Tell us about your organization</p>
              </div>

              <div className="space-y-5">
                <div>
                  <Label htmlFor="companyName" className="text-sm font-medium mb-2 block">
                    Company Name *
                  </Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => updateField("companyName", e.target.value)}
                    placeholder="Enter company name"
                    className={errors.companyName ? "border-destructive" : ""}
                  />
                  {errors.companyName && <p className="text-sm text-destructive mt-1.5">{errors.companyName}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="buyerType" className="text-sm font-medium mb-2 block">
                      Buyer Type *
                    </Label>
                    <Select value={formData.buyerType} onValueChange={(v) => updateField("buyerType", v)}>
                      <SelectTrigger className={errors.buyerType ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {buyerTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.buyerType && <p className="text-sm text-destructive mt-1.5">{errors.buyerType}</p>}
                  </div>

                  <div>
                    <Label htmlFor="registrationNumber" className="text-sm font-medium mb-2 block">
                      Registration Number
                    </Label>
                    <Input
                      id="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={(e) => updateField("registrationNumber", e.target.value)}
                      placeholder="RC Number / Business ID"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="taxId" className="text-sm font-medium mb-2 block">
                      Tax ID
                    </Label>
                    <Input
                      id="taxId"
                      value={formData.taxId}
                      onChange={(e) => updateField("taxId", e.target.value)}
                      placeholder="TIN / VAT Number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="website" className="text-sm font-medium mb-2 block">
                      Website
                    </Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => updateField("website", e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address" className="text-sm font-medium mb-2 block">
                    Business Address *
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    placeholder="Street address"
                    className={errors.address ? "border-destructive" : ""}
                  />
                  {errors.address && <p className="text-sm text-destructive mt-1.5">{errors.address}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="city" className="text-sm font-medium mb-2 block">
                      City *
                    </Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      placeholder="City"
                      className={errors.city ? "border-destructive" : ""}
                    />
                    {errors.city && <p className="text-sm text-destructive mt-1.5">{errors.city}</p>}
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">State / Region</Label>
                    <NigeriaLocationSelect
                      value={companyLocation}
                      onChange={(loc) => {
                        setCompanyLocation(loc)
                        updateField("state", loc.stateName)
                      }}
                      showCommunity={false}
                      requiredFields={[]}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="country" className="text-sm font-medium mb-2 block">
                    Country *
                  </Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => updateField("country", e.target.value)}
                    placeholder="Country"
                    className={errors.country ? "border-destructive" : ""}
                  />
                  {errors.country && <p className="text-sm text-destructive mt-1.5">{errors.country}</p>}
                </div>
              </div>
              {/* End of changes */}
            </div>
          )}

          {/* Step 2: Contact Person */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">Contact Person</h2>
                <p className="text-sm text-muted-foreground">Primary contact for sourcing coordination</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactName">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="contactName"
                      value={formData.contactName}
                      onChange={(e) => updateField("contactName", e.target.value)}
                      placeholder="Contact person name"
                      className={`pl-10 ${errors.contactName ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.contactName && <p className="text-sm text-destructive mt-1">{errors.contactName}</p>}
                </div>

                <div>
                  <Label htmlFor="contactRole">Role / Position</Label>
                  <Input
                    id="contactRole"
                    value={formData.contactRole}
                    onChange={(e) => updateField("contactRole", e.target.value)}
                    placeholder="e.g. Procurement Manager"
                  />
                </div>

                <div>
                  <Label htmlFor="contactPhone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="contactPhone"
                      value={formData.contactPhone}
                      onChange={(e) => updateField("contactPhone", e.target.value)}
                      placeholder="+234 800 000 0000"
                      className={`pl-10 ${errors.contactPhone ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.contactPhone && <p className="text-sm text-destructive mt-1">{errors.contactPhone}</p>}
                </div>

                <div>
                  <Label htmlFor="alternatePhone">Alternate Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="alternatePhone"
                      value={formData.alternatePhone}
                      onChange={(e) => updateField("alternatePhone", e.target.value)}
                      placeholder="+234 800 000 0000"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="contactEmail">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => updateField("contactEmail", e.target.value)}
                      placeholder="email@company.com"
                      className={`pl-10 ${errors.contactEmail ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.contactEmail && <p className="text-sm text-destructive mt-1">{errors.contactEmail}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Sourcing Needs */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">Sourcing Requirements</h2>
                <p className="text-sm text-muted-foreground">What are you looking to source?</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="mb-3 block">Products of Interest *</Label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {crops.map((crop) => (
                      <button
                        key={crop}
                        type="button"
                        onClick={() => toggleCrop(crop)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          formData.interestedCrops.includes(crop)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80 text-muted-foreground"
                        }`}
                      >
                        {crop}
                      </button>
                    ))}
                  </div>
                  {errors.interestedCrops && <p className="text-sm text-destructive mt-2">{errors.interestedCrops}</p>}
                </div>

                {formData.interestedCrops.includes("Other") && (
                  <div>
                    <Label htmlFor="otherProduct">Please specify the product *</Label>
                    <Input
                      id="otherProduct"
                      value={formData.otherProduct}
                      onChange={(e) => updateField("otherProduct", e.target.value)}
                      placeholder="e.g. Shea butter, Ginger, Turmeric, etc."
                      className={errors.otherProduct ? "border-destructive" : ""}
                    />
                    {errors.otherProduct && <p className="text-sm text-destructive mt-1">{errors.otherProduct}</p>}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="volumeRange">Expected Volume *</Label>
                    <Select value={formData.volumeRange} onValueChange={(v) => updateField("volumeRange", v)}>
                      <SelectTrigger className={errors.volumeRange ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select volume range" />
                      </SelectTrigger>
                      <SelectContent>
                        {volumeRanges.map((range) => (
                          <SelectItem key={range.value} value={range.value}>
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.volumeRange && <p className="text-sm text-destructive mt-1">{errors.volumeRange}</p>}
                  </div>

                  <div>
                    <Label htmlFor="qualityGrade">Quality Grade *</Label>
                    <Select value={formData.qualityGrade} onValueChange={(v) => updateField("qualityGrade", v)}>
                      <SelectTrigger className={errors.qualityGrade ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select quality grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {qualityGrades.map((grade) => (
                          <SelectItem key={grade.value} value={grade.value}>
                            {grade.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.qualityGrade && <p className="text-sm text-destructive mt-1">{errors.qualityGrade}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="deliveryLocations">Delivery Location(s)</Label>
                  <Textarea
                    id="deliveryLocations"
                    value={formData.deliveryLocations}
                    onChange={(e) => updateField("deliveryLocations", e.target.value)}
                    placeholder="Enter delivery addresses / warehouse locations"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="paymentTerms">Preferred Payment Terms</Label>
                  <Input
                    id="paymentTerms"
                    value={formData.paymentTerms}
                    onChange={(e) => updateField("paymentTerms", e.target.value)}
                    placeholder="e.g. Net 30, LC, Cash on Delivery"
                  />
                </div>

                <div>
                  <Label htmlFor="additionalRequirements">Additional Requirements</Label>
                  <Textarea
                    id="additionalRequirements"
                    value={formData.additionalRequirements}
                    onChange={(e) => updateField("additionalRequirements", e.target.value)}
                    placeholder="Any specific quality certifications, packaging requirements, etc."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">Review & Submit</h2>
                <p className="text-sm text-muted-foreground">Verify your information before submitting</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Company Details</h3>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <p className="font-semibold">{formData.companyName}</p>
                    <p className="text-sm text-muted-foreground">
                      {buyerTypes.find((t) => t.value === formData.buyerType)?.label}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formData.address}, {formData.city}, {formData.state} {formData.country}
                    </p>
                    {formData.website && <p className="text-sm text-primary">{formData.website}</p>}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Contact Person</h3>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <p className="font-semibold">{formData.contactName}</p>
                    {formData.contactRole && <p className="text-sm text-muted-foreground">{formData.contactRole}</p>}
                    <p className="text-sm text-muted-foreground">{formData.contactPhone}</p>
                    <p className="text-sm text-muted-foreground">{formData.contactEmail}</p>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Sourcing Requirements
                  </h3>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Products of Interest</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.interestedCrops.map((crop) => (
                          <span
                            key={crop}
                            className="px-2 py-1 rounded-md bg-primary/10 text-primary text-sm font-medium"
                          >
                            {crop}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Volume</p>
                        <p className="font-medium">
                          {volumeRanges.find((r) => r.value === formData.volumeRange)?.label}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Quality Grade</p>
                        <p className="font-medium">
                          {qualityGrades.find((g) => g.value === formData.qualityGrade)?.label}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => updateField("acceptTerms", checked as boolean)}
                  />
                  <div>
                    <Label htmlFor="acceptTerms" className="cursor-pointer">
                      I agree to the AgroBridge Buyer Terms and Conditions
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      By registering, you agree to our sourcing policies, payment terms, and quality standards.
                    </p>
                  </div>
                </div>
                {errors.acceptTerms && <p className="text-sm text-destructive mt-2">{errors.acceptTerms}</p>}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="gap-2 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            {currentStep < 4 ? (
              <Button onClick={handleNext} className="gap-2">
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
                {isSubmitting ? "Submitting..." : "Submit Registration"}
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
