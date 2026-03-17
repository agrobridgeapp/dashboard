"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Building2, Package, FileCheck, CheckCircle2 } from "lucide-react"
import { NigeriaLocationSelect, type LocationValue } from "@/components/location/nigeria-location-select"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

/** Partner onboarding step definitions */
const steps = [
  { id: 1, title: "Company Info", icon: Building2 },
  { id: 2, title: "Services", icon: Package },
  { id: 3, title: "Documents", icon: FileCheck },
  { id: 4, title: "Review", icon: CheckCircle2 },
]

export function PartnerOnboardingForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [location, setLocation] = useState<LocationValue>({
    stateId: "",
    stateName: "",
    lgaId: "",
    lgaName: "",
  })
  const [formData, setFormData] = useState({
    partnerType: "",
    companyName: "",
    rcNumber: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    state: "",
    // Service specific
    inputTypes: [] as string[],
    mechanizationServices: [] as string[],
    offtakerCrops: [] as string[],
    logisticsServices: [] as string[],
    storageServices: [] as string[], // Added separate storageServices array to fix bug
    storageCapacity: "",
    coverageAreas: [] as string[],
    capacity: "",
    // Documents
    cacCertificate: false,
    taxClearance: false,
    bankDetails: "",
    // Agreement
    agreeToTerms: false,
  })

  const progress = (currentStep / steps.length) * 100

  const updateFormData = (field: string, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleArrayToggle = (field: string, value: string) => {
    const current = formData[field as keyof typeof formData] as string[]
    if (current.includes(value)) {
      updateFormData(
        field,
        current.filter((v) => v !== value),
      )
    } else {
      updateFormData(field, [...current, value])
    }
  }

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const partnerTypeMap: Record<string, string> = {
        "input-supplier": "input_supplier",
        mechanization: "mechanization",
        logistics: "logistics",
        storage: "storage",
        offtaker: "offtaker",
      }

      const services = [
        ...formData.inputTypes,
        ...formData.mechanizationServices,
        ...formData.offtakerCrops,
        ...formData.logisticsServices,
        ...formData.storageServices,
      ]

      await apiClient.partners.create({
        company_name: formData.companyName,
        partner_type: partnerTypeMap[formData.partnerType] || formData.partnerType,
        rc_number: formData.rcNumber,
        contact_name: formData.contactName,
        email: formData.contactEmail || null,
        phone: formData.contactPhone,
        address: formData.address,
        state: formData.state,
        services,
        regions: formData.coverageAreas,
        capacity: formData.capacity || formData.storageCapacity || null,
        bank_details: formData.bankDetails || null,
        agree_to_terms: formData.agreeToTerms,
        status: "pending",
      })

      router.push("/onboarding/success")
    } catch (err: any) {
      toast.error(err.message || "Failed to submit application. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <Progress value={progress} className="h-2 mb-4" />
        <div className="flex justify-between">
          {steps.map((step) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isComplete = currentStep > step.id
            return (
              <div
                key={step.id}
                className={`flex flex-col items-center gap-2 ${
                  isActive ? "text-primary" : isComplete ? "text-primary/70" : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : isComplete
                        ? "border-primary bg-primary/10"
                        : "border-muted-foreground/30"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium hidden sm:block">{step.title}</span>
              </div>
            )
          })}
        </div>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>
            {currentStep === 1 && "Tell us about your organization"}
            {currentStep === 2 && "Define your service offerings"}
            {currentStep === 3 && "Upload verification documents"}
            {currentStep === 4 && "Review and submit your application"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Company Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Partner Type</Label>
                <RadioGroup
                  value={formData.partnerType}
                  onValueChange={(v) => updateFormData("partnerType", v)}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                  {[
                    { value: "input-supplier", label: "Input Supplier", desc: "Seeds, fertilizers, agrochemicals" },
                    { value: "mechanization", label: "Mechanization", desc: "Tractors, planters, harvesters" },
                    { value: "logistics", label: "Logistics", desc: "Transportation, fleet management" },
                    { value: "storage", label: "Storage", desc: "Warehousing, cold storage facilities" },
                    { value: "offtaker", label: "Offtaker", desc: "Commodity buyers, processors" },
                  ].map((option) => (
                    <Label
                      key={option.value}
                      htmlFor={option.value}
                      className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        formData.partnerType === option.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs text-muted-foreground text-center mt-1">{option.desc}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="Enter registered company name"
                    value={formData.companyName}
                    onChange={(e) => updateFormData("companyName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rcNumber">RC Number</Label>
                  <Input
                    id="rcNumber"
                    placeholder="CAC registration number"
                    value={formData.rcNumber}
                    onChange={(e) => updateFormData("rcNumber", e.target.value)}
                  />
                </div>
              </div>

              <NigeriaLocationSelect
                value={location}
                onChange={(loc) => {
                  setLocation(loc)
                  updateFormData("state", loc.stateName)
                }}
                showCommunity={false}
                requiredFields={["state"]}
              />

              <div className="space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter full business address"
                  value={formData.address}
                  onChange={(e) => updateFormData("address", e.target.value)}
                  rows={2}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Person</Label>
                  <Input
                    id="contactName"
                    placeholder="Full name"
                    value={formData.contactName}
                    onChange={(e) => updateFormData("contactName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="email@company.com"
                    value={formData.contactEmail}
                    onChange={(e) => updateFormData("contactEmail", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Phone</Label>
                  <Input
                    id="contactPhone"
                    placeholder="+234 800 000 0000"
                    value={formData.contactPhone}
                    onChange={(e) => updateFormData("contactPhone", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Services */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {formData.partnerType === "input-supplier" && (
                <div className="space-y-3">
                  <Label>Input Categories</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Seeds", "Fertilizers", "Herbicides", "Pesticides", "Fungicides", "Growth Regulators"].map(
                      (item) => (
                        <div key={item} className="flex items-center space-x-2">
                          <Checkbox
                            id={item}
                            checked={formData.inputTypes.includes(item)}
                            onCheckedChange={() => handleArrayToggle("inputTypes", item)}
                          />
                          <Label htmlFor={item} className="text-sm font-normal cursor-pointer">
                            {item}
                          </Label>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {formData.partnerType === "mechanization" && (
                <div className="space-y-3">
                  <Label>Mechanization Services</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "Land Clearing",
                      "Plowing",
                      "Harrowing",
                      "Planting",
                      "Spraying",
                      "Harvesting",
                      "Transportation",
                    ].map((item) => (
                      <div key={item} className="flex items-center space-x-2">
                        <Checkbox
                          id={item}
                          checked={formData.mechanizationServices.includes(item)}
                          onCheckedChange={() => handleArrayToggle("mechanizationServices", item)}
                        />
                        <Label htmlFor={item} className="text-sm font-normal cursor-pointer">
                          {item}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData.partnerType === "offtaker" && (
                <div className="space-y-3">
                  <Label>Commodities of Interest</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Maize", "Rice", "Soybean", "Sorghum", "Sesame", "Ginger", "Cashew", "Cocoa"].map((item) => (
                      <div key={item} className="flex items-center space-x-2">
                        <Checkbox
                          id={item}
                          checked={formData.offtakerCrops.includes(item)}
                          onCheckedChange={() => handleArrayToggle("offtakerCrops", item)}
                        />
                        <Label htmlFor={item} className="text-sm font-normal cursor-pointer">
                          {item}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData.partnerType === "logistics" && (
                <>
                  <div className="space-y-3">
                    <Label>Logistics Services</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        "Farm-to-Market Transport",
                        "Input Delivery",
                        "Inter-state Haulage",
                        "Cold Chain Transport",
                        "Last Mile Delivery",
                        "Fleet Management",
                      ].map((item) => (
                        <div key={item} className="flex items-center space-x-2">
                          <Checkbox
                            id={item}
                            checked={formData.logisticsServices.includes(item)}
                            onCheckedChange={() => handleArrayToggle("logisticsServices", item)}
                          />
                          <Label htmlFor={item} className="text-sm font-normal cursor-pointer">
                            {item}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Fleet Size & Vehicle Types</Label>
                    <Textarea
                      id="capacity"
                      placeholder="e.g., 10 trucks (5-ton capacity), 3 refrigerated vans"
                      value={formData.capacity}
                      onChange={(e) => updateFormData("capacity", e.target.value)}
                      rows={2}
                    />
                  </div>
                </>
              )}

              {formData.partnerType === "storage" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="storageCapacity">Total Storage Capacity (MT)</Label>
                    <Input
                      id="storageCapacity"
                      placeholder="Total capacity in metric tons"
                      value={formData.storageCapacity}
                      onChange={(e) => updateFormData("storageCapacity", e.target.value)}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label>Storage Facilities</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        "Standard Warehouse",
                        "Climate Controlled",
                        "Cold Storage",
                        "Grain Silos",
                        "Fumigation Services",
                        "Quality Testing Lab",
                      ].map((item) => (
                        <div key={item} className="flex items-center space-x-2">
                          <Checkbox
                            id={item}
                            checked={formData.storageServices.includes(item)}
                            onCheckedChange={() => handleArrayToggle("storageServices", item)}
                          />
                          <Label htmlFor={item} className="text-sm font-normal cursor-pointer">
                            {item}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-3">
                <Label>Coverage Areas</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {["North Central", "North East", "North West", "South East", "South South", "South West"].map(
                    (area) => (
                      <div key={area} className="flex items-center space-x-2">
                        <Checkbox
                          id={area}
                          checked={formData.coverageAreas.includes(area)}
                          onCheckedChange={() => handleArrayToggle("coverageAreas", area)}
                        />
                        <Label htmlFor={area} className="text-sm font-normal cursor-pointer">
                          {area}
                        </Label>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">
                  {formData.partnerType === "input-supplier" && "Annual Supply Capacity (NGN value)"}
                  {formData.partnerType === "mechanization" && "Fleet Size / Service Capacity"}
                  {formData.partnerType === "logistics" && "Fleet Details"}
                  {formData.partnerType === "storage" && "Additional Capacity Details"}
                  {formData.partnerType === "offtaker" && "Annual Offtake Volume (MT)"}
                  {!formData.partnerType && "Capacity"}
                </Label>
                {formData.partnerType === "logistics" ? (
                  <Textarea
                    id="capacity"
                    placeholder="Describe your fleet and capacity"
                    value={formData.capacity}
                    onChange={(e) => updateFormData("capacity", e.target.value)}
                    rows={2}
                  />
                ) : (
                  <Input
                    id="capacity"
                    placeholder="Enter your capacity"
                    value={formData.capacity}
                    onChange={(e) => updateFormData("capacity", e.target.value)}
                  />
                )}
              </div>
            </div>
          )}

          {/* Step 3: Documents */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">CAC Certificate</p>
                    <p className="text-sm text-muted-foreground">Company registration certificate</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Upload
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Tax Clearance Certificate</p>
                    <p className="text-sm text-muted-foreground">Valid tax clearance document</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Upload
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Company Profile</p>
                    <p className="text-sm text-muted-foreground">Overview of your business operations</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Upload
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankDetails">Bank Account Details</Label>
                <Textarea
                  id="bankDetails"
                  placeholder="Bank Name, Account Name, Account Number"
                  value={formData.bankDetails}
                  onChange={(e) => updateFormData("bankDetails", e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Company</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-muted-foreground">Type:</span> {formData.partnerType}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Name:</span> {formData.companyName}
                    </p>
                    <p>
                      <span className="text-muted-foreground">RC:</span> {formData.rcNumber}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Contact</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-muted-foreground">Name:</span> {formData.contactName}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Email:</span> {formData.contactEmail}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Phone:</span> {formData.contactPhone}
                    </p>
                  </div>
                </div>
                <div className="space-y-4 sm:col-span-2">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Coverage</h3>
                  <p className="text-sm">{formData.coverageAreas.join(", ") || "None selected"}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 pt-4 border-t">
                <Checkbox
                  id="partnerTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => updateFormData("agreeToTerms", checked as boolean)}
                />
                <Label htmlFor="partnerTerms" className="text-sm font-normal leading-relaxed cursor-pointer">
                  I confirm that all information provided is accurate and I agree to the AgroBridge Partner Agreement
                  and Terms of Service
                </Label>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
              Previous
            </Button>
            {currentStep < steps.length ? (
              <Button onClick={nextStep}>Continue</Button>
            ) : (
              <Button disabled={!formData.agreeToTerms || submitting} onClick={handleSubmit}>
                {submitting ? "Submitting..." : "Submit Application"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
