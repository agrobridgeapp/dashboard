"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, MapPin, Tractor, FileText, CheckCircle2, Leaf, Calendar, AlertCircle, Loader2 } from "lucide-react"
import { useDataStore } from "@/lib/data/data-store"
import { SERVICE_TEMPLATES } from "@/lib/data/mock-data"
import type { CropType } from "@/lib/data/types"
import { NigeriaLocationSelect, type LocationValue } from "@/components/location/nigeria-location-select"

// =====================================================
// PRD WORKFLOW: Agent registers farmer → Geo-tags land →
// Assigns crop + season → Assigns corridor & cluster →
// Farmer accepts contract
// HARD RULES: No land → no crop cycle, No crop cycle → no services
// =====================================================

const steps = [
  { id: 1, title: "Personal Info", icon: User, description: "Basic farmer information" },
  { id: 2, title: "Farm Location", icon: MapPin, description: "Land plot details and geo-tagging" },
  { id: 3, title: "Corridor Assignment", icon: Tractor, description: "Assign to corridor and cluster" },
  { id: 4, title: "Crop Cycle", icon: Leaf, description: "Set up crop cycle and services" },
  { id: 5, title: "Documents", icon: FileText, description: "KYC and banking details" },
  { id: 6, title: "Review & Accept", icon: CheckCircle2, description: "Review and accept terms" },
]

const CROP_OPTIONS: { value: CropType; label: string; variety: string }[] = [
  { value: "maize", label: "Maize", variety: "SAMMAZ 15" },
  { value: "rice", label: "Rice", variety: "FARO 44" },
  { value: "soybean", label: "Soybean", variety: "TGx 1448-2E" },
  { value: "sorghum", label: "Sorghum", variety: "SAMSORG 17" },
  { value: "millet", label: "Millet", variety: "SOSAT-C88" },
  { value: "groundnut", label: "Groundnut", variety: "SAMNUT 24" },
]

export function FarmerOnboardingForm() {
  const router = useRouter()
  const { addFarmer, addLandPlot, addCropCycle, corridor, season } = useDataStore()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const [farmLocation, setFarmLocation] = useState<LocationValue>({
    stateId: "",
    stateName: "",
    lgaId: "",
    lgaName: "",
    communityName: "",
  })

  const [formData, setFormData] = useState({
    // Personal Info
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    gender: "" as "male" | "female" | "",
    dateOfBirth: "",

    // Farm Location (kept for backward compat — populated from farmLocation)
    state: "",
    lga: "",
    village: "",
    coordinates: "",
    farmSize: "",
    soilType: "" as "sandy" | "loamy" | "clay" | "mixed" | "",
    irrigationAccess: false,

    // Corridor Assignment (Auto-assigned based on location)
    corridorId: corridor?.id || "",
    clusterId: "",
    seasonId: season?.id || "",
    assignedAgentId: "",

    // Crop Cycle
    cropType: "" as CropType | "",
    variety: "",
    plantingDate: "",
    hectaresToPlant: "",
    expectedYield: "",

    // Documents
    bvn: "",
    idType: "" as "nin" | "voters" | "drivers" | "passport" | "",
    idNumber: "",
    bankName: "",
    accountNumber: "",

    // Farm Details
    farmingExperience: "",
    challenges: "",

    // Agreement
    agreeToTerms: false,
    agreeToDeductions: false,
  })

  // Sync IDs once corridor/season are loaded from API
  useEffect(() => {
    if (corridor?.id) setFormData((prev) => ({ ...prev, corridorId: corridor.id }))
  }, [corridor?.id])

  useEffect(() => {
    if (season?.id) setFormData((prev) => ({ ...prev, seasonId: season.id }))
  }, [season?.id])

  const progress = (currentStep / steps.length) * 100

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }

      // Auto-assign cluster and agent based on LGA selection
      if (field === "lga") {
        const clusters = corridor?.clusters || []
        const cluster =
          clusters.find(
            (c: any) =>
              c.villages.some((v: string) => v.toLowerCase().includes(value.toLowerCase())) ||
              value.toLowerCase().includes(c.name.toLowerCase().split(" ")[0]),
          ) || clusters.find((c: any) => c.name.includes(value))

        if (cluster) {
          updated.clusterId = cluster.id
          updated.assignedAgentId = cluster.assignedAgentId || ""
        }
      }

      // Auto-set variety when crop type changes
      if (field === "cropType") {
        const cropOption = CROP_OPTIONS.find((c) => c.value === value)
        if (cropOption) {
          updated.variety = cropOption.variety
        }
      }

      // Calculate expected yield based on hectares and crop type
      if (field === "hectaresToPlant" || field === "cropType") {
        const hectares = field === "hectaresToPlant" ? Number(value) : Number(updated.hectaresToPlant)
        const crop = field === "cropType" ? value : updated.cropType

        if (hectares && crop) {
          // Average yields per hectare by crop
          const yieldPerHectare: Record<string, number> = {
            maize: 3.0,
            rice: 4.0,
            soybean: 1.6,
            sorghum: 2.5,
            millet: 2.0,
            groundnut: 1.8,
          }
          const expectedYield = hectares * (yieldPerHectare[crop] || 2.5)
          updated.expectedYield = expectedYield.toFixed(1)
        }
      }

      return updated
    })
  }

  const getClusterForLga = (lga: string) => {
    const lgaClusterMap: Record<string, string> = {
      zaria: "cluster-zaria-001",
      "sabon-gari": "cluster-zaria-002",
      giwa: "cluster-giwa-001",
      igabi: "cluster-igabi-001",
    }
    return lgaClusterMap[lga] || ""
  }

  const getServicesForCrop = (cropType: CropType) => {
    const template = SERVICE_TEMPLATES.find((t) => t.cropType === cropType)
    return template?.services || []
  }

  const calculateTotalServiceCost = () => {
    if (!formData.cropType || !formData.hectaresToPlant) return 0
    const services = getServicesForCrop(formData.cropType as CropType)
    const hectares = Number(formData.hectaresToPlant)
    return services.reduce((sum, svc) => sum + svc.estimatedCostPerHectare * hectares, 0)
  }

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.phone && formData.gender
      case 2:
        return farmLocation.stateId && farmLocation.lgaId && formData.farmSize
      case 3:
        return formData.clusterId && formData.assignedAgentId
      case 4:
        return formData.cropType && formData.plantingDate && formData.hectaresToPlant
      case 5:
        return formData.bvn && formData.idType && formData.idNumber && formData.bankName && formData.accountNumber
      case 6:
        return formData.agreeToTerms && formData.agreeToDeductions
      default:
        return true
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // 1. Create Farmer
      const farmer = addFarmer({
        corridorId: formData.corridorId,
        clusterId: formData.clusterId,
        seasonId: formData.seasonId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email || undefined,
        gender: formData.gender as "male" | "female",
        dateOfBirth: formData.dateOfBirth || undefined,
        state: farmLocation.stateName || formData.state,
        lga: farmLocation.lgaName || formData.lga,
        village: farmLocation.communityName || formData.village,
        bvn: formData.bvn,
        idType: formData.idType as "nin" | "voters" | "drivers" | "passport",
        idNumber: formData.idNumber,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        farmingExperience: formData.farmingExperience,
        assignedAgentId: formData.assignedAgentId,
        status: "pending",
        createdBy: "self-onboarding",
      })

      // 2. Create Land Plot (Required before crop cycle)
      const coords = formData.coordinates.split(",").map((c) => Number.parseFloat(c.trim()))
      const landPlot = addLandPlot({
        farmerId: farmer.id,
        corridorId: formData.corridorId,
        seasonId: formData.seasonId,
        coordinates: coords.length === 2 ? { lat: coords[0], lng: coords[1] } : undefined,
        village: formData.village,
        sizeHectares: Number(formData.farmSize),
        soilType: formData.soilType as "sandy" | "loamy" | "clay" | "mixed" | undefined,
        irrigationAccess: formData.irrigationAccess,
        status: "pending_verification",
      })

      // 3. Create Crop Cycle (Required for services)
      const plantDate = new Date(formData.plantingDate)
      const harvestDate = new Date(plantDate)
      harvestDate.setDate(harvestDate.getDate() + (formData.cropType === "rice" ? 120 : 100))

      addCropCycle({
        farmerId: farmer.id,
        landPlotId: landPlot.id,
        corridorId: formData.corridorId,
        seasonId: formData.seasonId,
        cropType: formData.cropType as CropType,
        variety: formData.variety,
        plantingDate: formData.plantingDate,
        expectedHarvestDate: harvestDate.toISOString().split("T")[0],
        hectaresPlanted: Number(formData.hectaresToPlant),
        expectedYieldTons: Number(formData.expectedYield),
        status: "planned",
      })

      setSubmitSuccess(true)

      // Redirect after short delay
      setTimeout(() => {
        router.push("/onboarding/success")
      }, 2000)
    } catch (error) {
      console.error("Onboarding error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Registration Submitted!</h3>
            <p className="text-muted-foreground">
              Your application has been received. A field agent will visit your farm within 3-5 business days to verify
              your land and complete the onboarding process.
            </p>
            <Badge variant="outline" className="text-primary border-primary">
              Pending Verification
            </Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <Progress value={progress} className="h-2 mb-4" />
        <div className="flex justify-between overflow-x-auto pb-2">
          {steps.map((step) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isComplete = currentStep > step.id
            return (
              <div
                key={step.id}
                className={`flex flex-col items-center gap-2 min-w-[80px] ${
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
                <span className="text-xs font-medium hidden sm:block text-center">{step.title}</span>
              </div>
            )
          })}
        </div>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={(e) => updateFormData("lastName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="+234 800 000 0000"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select value={formData.gender} onValueChange={(v) => updateFormData("gender", v)}>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 2: Farm Location */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Your farm location must be within an active AgroBridge corridor to participate in the program.
                </AlertDescription>
              </Alert>

              <NigeriaLocationSelect
                value={farmLocation}
                onChange={(loc) => {
                  setFarmLocation(loc)
                  // Try to auto-assign cluster based on LGA name
                  const clusters = corridor?.clusters || []
                  const cluster =
                    clusters.find(
                      (c: any) =>
                        c.villages.some((v: string) => v.toLowerCase().includes(loc.lgaName.toLowerCase())) ||
                        loc.lgaName.toLowerCase().includes(c.name.toLowerCase().split(" ")[0]),
                    ) || undefined
                  if (cluster) {
                    updateFormData("clusterId", cluster.id)
                    updateFormData("assignedAgentId", cluster.assignedAgentId || "")
                  }
                }}
                showCommunity={true}
                allowNewCommunity={true}
                requiredFields={["state", "lga"]}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="farmSize">Total Farm Size (Hectares) *</Label>
                  <Input
                    id="farmSize"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 5.0"
                    value={formData.farmSize}
                    onChange={(e) => updateFormData("farmSize", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="soilType">Soil Type</Label>
                  <Select value={formData.soilType} onValueChange={(v) => updateFormData("soilType", v)}>
                    <SelectTrigger id="soilType">
                      <SelectValue placeholder="Select soil type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="loamy">Loamy</SelectItem>
                      <SelectItem value="sandy">Sandy</SelectItem>
                      <SelectItem value="clay">Clay</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="coordinates">GPS Coordinates (Optional)</Label>
                  <Input
                    id="coordinates"
                    placeholder="e.g., 11.0801, 7.7069"
                    value={formData.coordinates}
                    onChange={(e) => updateFormData("coordinates", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    A field agent will capture exact coordinates during verification visit
                  </p>
                </div>
                <div className="flex items-center space-x-2 sm:col-span-2">
                  <Checkbox
                    id="irrigation"
                    checked={formData.irrigationAccess}
                    onCheckedChange={(checked) => updateFormData("irrigationAccess", checked as boolean)}
                  />
                  <Label htmlFor="irrigation" className="font-normal cursor-pointer">
                    Farm has access to irrigation
                  </Label>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Corridor Assignment */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Corridor</span>
                  <Badge variant="outline">{corridor?.name || "Loading..."}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Season</span>
                  <Badge variant="outline">{season?.name || "Loading..."}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Season Dates</span>
                  <span className="text-sm">
                    {season?.startDate ? new Date(season.startDate).toLocaleDateString() : "—"} -{" "}
                    {season?.endDate ? new Date(season.endDate).toLocaleDateString() : "—"}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Select Your Cluster *</Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(corridor?.clusters || []).map((cluster: any) => (
                    <div
                      key={cluster.id}
                      onClick={() => {
                        updateFormData("clusterId", cluster.id)
                        updateFormData("assignedAgentId", cluster.assignedAgentId || "")
                      }}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        formData.clusterId === cluster.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="font-medium">{cluster.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">Villages: {cluster.villages.join(", ")}</div>
                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{cluster.farmerCount} farmers</span>
                        <span>{cluster.totalHectares} ha</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {formData.clusterId && (
                <Alert className="bg-primary/5 border-primary/20">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <AlertDescription>
                    You will be assigned a dedicated field agent who will support you throughout the season.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Step 4: Crop Cycle */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <Alert>
                <Calendar className="h-4 w-4" />
                <AlertDescription>
                  Based on your crop selection, we will auto-generate required services and schedule them according to
                  best agricultural practices.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cropType">Crop Type *</Label>
                  <Select value={formData.cropType} onValueChange={(v) => updateFormData("cropType", v)}>
                    <SelectTrigger id="cropType">
                      <SelectValue placeholder="Select crop" />
                    </SelectTrigger>
                    <SelectContent>
                      {CROP_OPTIONS.map((crop) => (
                        <SelectItem key={crop.value} value={crop.value}>
                          {crop.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="variety">Variety</Label>
                  <Input
                    id="variety"
                    value={formData.variety}
                    onChange={(e) => updateFormData("variety", e.target.value)}
                    placeholder="Will be auto-filled"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plantingDate">Planned Planting Date *</Label>
                  <Input
                    id="plantingDate"
                    type="date"
                    value={formData.plantingDate}
                    onChange={(e) => updateFormData("plantingDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hectaresToPlant">Hectares to Plant *</Label>
                  <Input
                    id="hectaresToPlant"
                    type="number"
                    step="0.1"
                    max={formData.farmSize || undefined}
                    placeholder={`Max: ${formData.farmSize || "N/A"} ha`}
                    value={formData.hectaresToPlant}
                    onChange={(e) => updateFormData("hectaresToPlant", e.target.value)}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Expected Yield (Auto-calculated)</Label>
                  <div className="bg-muted rounded-lg p-3 flex items-center justify-between">
                    <span className="text-muted-foreground">Based on average yields for your crop and area</span>
                    <Badge variant="secondary" className="text-lg">
                      {formData.expectedYield || "0"} tons
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Service Preview */}
              {formData.cropType && (
                <div className="space-y-3">
                  <Label>Services to be Scheduled</Label>
                  <div className="border rounded-lg divide-y">
                    {getServicesForCrop(formData.cropType as CropType).map((svc, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{svc.name}</div>
                          <div className="text-xs text-muted-foreground">{svc.description}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {svc.daysFromPlanting < 0
                              ? `${Math.abs(svc.daysFromPlanting)} days before planting`
                              : `${svc.daysFromPlanting} days after planting`}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            ₦{(svc.estimatedCostPerHectare * Number(formData.hectaresToPlant || 0)).toLocaleString()}
                          </div>
                          <Badge variant={svc.isRequired ? "default" : "outline"} className="text-xs mt-1">
                            {svc.isRequired ? "Required" : "Optional"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-primary/5 rounded-lg p-3 flex items-center justify-between">
                    <span className="font-medium">Total Estimated Service Cost</span>
                    <span className="font-bold text-lg">₦{calculateTotalServiceCost().toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Service costs will be deducted from your harvest payment at the end of the season.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Documents */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bvn">BVN (Bank Verification Number) *</Label>
                <Input
                  id="bvn"
                  placeholder="Enter 11-digit BVN"
                  maxLength={11}
                  value={formData.bvn}
                  onChange={(e) => updateFormData("bvn", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Required for KYC verification and payment processing</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="idType">ID Type *</Label>
                  <Select value={formData.idType} onValueChange={(v) => updateFormData("idType", v)}>
                    <SelectTrigger id="idType">
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nin">National ID (NIN)</SelectItem>
                      <SelectItem value="voters">Voter&apos;s Card</SelectItem>
                      <SelectItem value="drivers">Driver&apos;s License</SelectItem>
                      <SelectItem value="passport">International Passport</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idNumber">ID Number *</Label>
                  <Input
                    id="idNumber"
                    placeholder="Enter ID number"
                    value={formData.idNumber}
                    onChange={(e) => updateFormData("idNumber", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name *</Label>
                  <Select value={formData.bankName} onValueChange={(v) => updateFormData("bankName", v)}>
                    <SelectTrigger id="bankName">
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gtbank">GTBank</SelectItem>
                      <SelectItem value="firstbank">First Bank</SelectItem>
                      <SelectItem value="uba">UBA</SelectItem>
                      <SelectItem value="zenith">Zenith Bank</SelectItem>
                      <SelectItem value="access">Access Bank</SelectItem>
                      <SelectItem value="fidelity">Fidelity Bank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number *</Label>
                  <Input
                    id="accountNumber"
                    placeholder="Enter 10-digit account number"
                    maxLength={10}
                    value={formData.accountNumber}
                    onChange={(e) => updateFormData("accountNumber", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Farming Experience</Label>
                <Select
                  value={formData.farmingExperience}
                  onValueChange={(v) => updateFormData("farmingExperience", v)}
                >
                  <SelectTrigger id="experience">
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-2">0-2 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="6-10">6-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="challenges">Current Farming Challenges (Optional)</Label>
                <Textarea
                  id="challenges"
                  placeholder="Describe any challenges you face (e.g., access to inputs, pest issues, market access)"
                  value={formData.challenges}
                  onChange={(e) => updateFormData("challenges", e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 6: Review & Accept */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Personal Info</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-muted-foreground">Name:</span> {formData.firstName} {formData.lastName}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Phone:</span> {formData.phone}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Gender:</span> {formData.gender}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Farm Location</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-muted-foreground">Location:</span> {formData.village}, {formData.lga},
                      Kaduna
                    </p>
                    <p>
                      <span className="text-muted-foreground">Farm Size:</span> {formData.farmSize} hectares
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Crop Cycle</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-muted-foreground">Crop:</span> {formData.cropType} ({formData.variety})
                    </p>
                    <p>
                      <span className="text-muted-foreground">Area:</span> {formData.hectaresToPlant} hectares
                    </p>
                    <p>
                      <span className="text-muted-foreground">Expected Yield:</span> {formData.expectedYield} tons
                    </p>
                    <p>
                      <span className="text-muted-foreground">Planting Date:</span> {formData.plantingDate}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Financial</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-muted-foreground">Bank:</span> {formData.bankName}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Account:</span> ******{formData.accountNumber.slice(-4)}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Est. Service Cost:</span> ₦
                      {calculateTotalServiceCost().toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => updateFormData("agreeToTerms", checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm font-normal leading-relaxed cursor-pointer">
                    I confirm that all information provided is accurate and I agree to the AgroBridge Terms of Service
                    and Privacy Policy. I understand that a field agent will verify my farm before final enrollment.
                  </Label>
                </div>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="deductions"
                    checked={formData.agreeToDeductions}
                    onCheckedChange={(checked) => updateFormData("agreeToDeductions", checked as boolean)}
                  />
                  <Label htmlFor="deductions" className="text-sm font-normal leading-relaxed cursor-pointer">
                    I agree that service costs (estimated at ₦{calculateTotalServiceCost().toLocaleString()}) will be
                    deducted from my harvest payment at the end of the season. I understand the pay-at-harvest model.
                  </Label>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
              Previous
            </Button>
            {currentStep < steps.length ? (
              <Button onClick={nextStep} disabled={!canProceed()}>
                Continue
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!canProceed() || isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
