"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  User,
  MapPin,
  Leaf,
  ChevronRight,
  WifiOff,
  Wifi,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Navigation,
  Save,
} from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

type CropType = "maize" | "rice" | "soybean" | "sorghum" | "millet" | "groundnut"

type FormSection = "personal" | "farm" | "crop"

interface ValidationErrors {
  [key: string]: string
}

const CROPS: { value: CropType; label: string }[] = [
  { value: "maize", label: "Maize" },
  { value: "rice", label: "Rice" },
  { value: "soybean", label: "Soybean" },
  { value: "sorghum", label: "Sorghum" },
  { value: "millet", label: "Millet" },
  { value: "groundnut", label: "Groundnut" },
]

export default function AgentFarmerRegistrationPage() {
  const router = useRouter()

  const [isOnline, setIsOnline] = useState(true)
  const [activeSection, setActiveSection] = useState<FormSection>("personal")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSavedOffline, setIsSavedOffline] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [gpsLoading, setGpsLoading] = useState(false)

  const [form, setForm] = useState({
    // Personal
    firstName: "",
    lastName: "",
    phone: "",
    gender: "" as "male" | "female" | "",
    // Farm
    lga: "",
    village: "",
    farmSize: "",
    lat: "",
    lng: "",
    // Crop
    cropType: "" as CropType | "",
    hectares: "",
    plantingDate: "",
    hasIrrigation: false,
  })

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    setIsOnline(navigator.onLine)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Load saved offline data on mount
  useEffect(() => {
    const savedData = localStorage.getItem("agrobridge_draft_farmer")
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setForm(parsed)
        setIsSavedOffline(true)
      } catch (e) {
        // Invalid data, ignore
      }
    }
  }, [])

  const updateForm = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
    // Auto-save to localStorage for offline
    const updated = { ...form, [field]: value }
    localStorage.setItem("agrobridge_draft_farmer", JSON.stringify(updated))
    setIsSavedOffline(true)
  }

  const captureGPS = () => {
    if (!navigator.geolocation) {
      setErrors((prev) => ({ ...prev, gps: "GPS not supported on this device" }))
      return
    }

    setGpsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6),
        }))
        setGpsLoading(false)
      },
      (error) => {
        setErrors((prev) => ({ ...prev, gps: "Failed to get location. Please try again." }))
        setGpsLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  const validateSection = (section: FormSection): boolean => {
    const newErrors: ValidationErrors = {}

    if (section === "personal") {
      if (!form.firstName.trim()) newErrors.firstName = "Required"
      if (!form.lastName.trim()) newErrors.lastName = "Required"
      if (!form.phone.trim()) newErrors.phone = "Required"
      else if (!/^(\+234|0)[0-9]{10}$/.test(form.phone.replace(/\s/g, ""))) {
        newErrors.phone = "Invalid phone number"
      }
      if (!form.gender) newErrors.gender = "Required"
    }

    if (section === "farm") {
      if (!form.lga) newErrors.lga = "Required"
      if (!form.village.trim()) newErrors.village = "Required"
      if (!form.farmSize) newErrors.farmSize = "Required"
      else if (Number(form.farmSize) <= 0) newErrors.farmSize = "Must be greater than 0"
    }

    if (section === "crop") {
      if (!form.cropType) newErrors.cropType = "Required"
      if (!form.hectares) newErrors.hectares = "Required"
      else if (Number(form.hectares) <= 0) newErrors.hectares = "Must be greater than 0"
      else if (Number(form.hectares) > Number(form.farmSize)) {
        newErrors.hectares = "Cannot exceed farm size"
      }
      if (!form.plantingDate) newErrors.plantingDate = "Required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const goToSection = (section: FormSection) => {
    // Validate current section before moving forward
    const sections: FormSection[] = ["personal", "farm", "crop"]
    const currentIndex = sections.indexOf(activeSection)
    const targetIndex = sections.indexOf(section)

    if (targetIndex > currentIndex) {
      if (!validateSection(activeSection)) return
    }
    setActiveSection(section)
  }

  const handleSubmit = async () => {
    // Validate all sections
    if (!validateSection("personal") || !validateSection("farm") || !validateSection("crop")) {
      return
    }

    setIsSubmitting(true)

    try {
      // Create farmer
      const farmerRes = await apiClient.farmers.create({
        full_name: `${form.firstName} ${form.lastName}`,
        phone: form.phone,
        gender: form.gender,
        state: "Kaduna",
        lga: form.lga,
        village: form.village,
        status: "pending",
      })

      const farmerId = farmerRes.data?.id

      if (farmerId) {
        // Create land plot
        const landPlotRes = await apiClient.landPlots.create({
          farmer_id: farmerId,
          village: form.village,
          size_hectares: Number(form.farmSize),
          latitude: form.lat ? Number(form.lat) : undefined,
          longitude: form.lng ? Number(form.lng) : undefined,
          irrigation_access: form.hasIrrigation,
          status: "pending_verification",
        })

        const landPlotId = landPlotRes.data?.id

        // Create crop cycle
        const plantDate = new Date(form.plantingDate)
        const harvestDate = new Date(plantDate)
        harvestDate.setDate(harvestDate.getDate() + 100)

        await apiClient.cropCycles.create({
          farmer_id: farmerId,
          land_plot_id: landPlotId,
          crop_type: form.cropType,
          planting_date: form.plantingDate,
          expected_harvest_date: harvestDate.toISOString().split("T")[0],
          hectares_planted: Number(form.hectares),
          expected_yield_tons: Number(form.hectares) * 3,
          status: "planned",
        })
      }

      // Clear offline draft
      localStorage.removeItem("agrobridge_draft_farmer")

      setSubmitSuccess(true)

      // Redirect after delay
      setTimeout(() => {
        router.push("/dashboard/agent/farmers")
      }, 2000)
    } catch (error: any) {
      setErrors({ submit: error.message || "Failed to register farmer. Please try again." })
      toast.error("Failed to register farmer")
    } finally {
      setIsSubmitting(false)
    }
  }

  const saveOffline = () => {
    localStorage.setItem("agrobridge_draft_farmer", JSON.stringify(form))
    setIsSavedOffline(true)
  }

  // Success state
  if (submitSuccess) {
    return (
      <DashboardLayout allowedRoles={["field_agent"]}>
        <div className="min-h-[60vh] flex items-center justify-center p-4">
          <div className="text-center space-y-4 max-w-sm">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold">Farmer Registered</h2>
            <p className="text-muted-foreground text-sm">
              {form.firstName} {form.lastName} has been added to your farmers list.
            </p>
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => {
                  setSubmitSuccess(false)
                  setForm({
                    firstName: "",
                    lastName: "",
                    phone: "",
                    gender: "",
                    lga: "",
                    village: "",
                    farmSize: "",
                    lat: "",
                    lng: "",
                    cropType: "",
                    hectares: "",
                    plantingDate: "",
                    hasIrrigation: false,
                  })
                  setActiveSection("personal")
                }}
              >
                Register Another
              </Button>
              <Button className="flex-1" onClick={() => router.push("/dashboard/agent/farmers")}>
                View Farmers
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout allowedRoles={["field_agent"]}>
      <div className="max-w-lg mx-auto pb-24">
        {/* Header with offline indicator */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold">Register Farmer</h1>
            <p className="text-sm text-muted-foreground">Quick registration form</p>
          </div>
          <div className="flex items-center gap-2">
            {isSavedOffline && (
              <Badge variant="secondary" className="text-xs gap-1">
                <Save className="w-3 h-3" />
                Draft
              </Badge>
            )}
            <Badge
              variant={isOnline ? "default" : "destructive"}
              className={`text-xs gap-1 ${isOnline ? "bg-emerald-600" : ""}`}
            >
              {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {isOnline ? "Online" : "Offline"}
            </Badge>
          </div>
        </div>

        {/* Section tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg mb-6">
          {[
            { id: "personal" as FormSection, label: "Personal", icon: User },
            { id: "farm" as FormSection, label: "Farm", icon: MapPin },
            { id: "crop" as FormSection, label: "Crop", icon: Leaf },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeSection === tab.id
            const sections: FormSection[] = ["personal", "farm", "crop"]
            const isComplete = sections.indexOf(tab.id) < sections.indexOf(activeSection)

            return (
              <button
                key={tab.id}
                onClick={() => goToSection(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-background text-foreground shadow-sm"
                    : isComplete
                      ? "text-emerald-600"
                      : "text-muted-foreground"
                }`}
              >
                {isComplete ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Form sections */}
        <div className="space-y-4">
          {/* Personal Info Section */}
          {activeSection === "personal" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="Enter first name"
                  value={form.firstName}
                  onChange={(e) => updateForm("firstName", e.target.value)}
                  className={errors.firstName ? "border-destructive" : ""}
                  autoComplete="off"
                />
                {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Enter last name"
                  value={form.lastName}
                  onChange={(e) => updateForm("lastName", e.target.value)}
                  className={errors.lastName ? "border-destructive" : ""}
                  autoComplete="off"
                />
                {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+234 800 000 0000"
                  value={form.phone}
                  onChange={(e) => updateForm("phone", e.target.value)}
                  className={errors.phone ? "border-destructive" : ""}
                  autoComplete="off"
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <Label>Gender *</Label>
                <div className="flex gap-2">
                  {["male", "female"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => updateForm("gender", g)}
                      className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium transition-colors ${
                        form.gender === g
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:border-primary/50"
                      } ${errors.gender ? "border-destructive" : ""}`}
                    >
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </button>
                  ))}
                </div>
                {errors.gender && <p className="text-xs text-destructive">{errors.gender}</p>}
              </div>
            </>
          )}

          {/* Farm Location Section */}
          {activeSection === "farm" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="lga">Local Government Area *</Label>
                <Input
                  id="lga"
                  placeholder="Enter LGA"
                  value={form.lga}
                  onChange={(e) => updateForm("lga", e.target.value)}
                  className={errors.lga ? "border-destructive" : ""}
                  autoComplete="off"
                />
                {errors.lga && <p className="text-xs text-destructive">{errors.lga}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="village">Village / Community *</Label>
                <Input
                  id="village"
                  placeholder="Enter village name"
                  value={form.village}
                  onChange={(e) => updateForm("village", e.target.value)}
                  className={errors.village ? "border-destructive" : ""}
                  autoComplete="off"
                />
                {errors.village && <p className="text-xs text-destructive">{errors.village}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="farmSize">Total Farm Size (Hectares) *</Label>
                <Input
                  id="farmSize"
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  min="0.1"
                  placeholder="e.g., 5.0"
                  value={form.farmSize}
                  onChange={(e) => updateForm("farmSize", e.target.value)}
                  className={errors.farmSize ? "border-destructive" : ""}
                />
                {errors.farmSize && <p className="text-xs text-destructive">{errors.farmSize}</p>}
              </div>

              <div className="space-y-2">
                <Label>GPS Coordinates (Optional)</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Latitude"
                    value={form.lat}
                    onChange={(e) => updateForm("lat", e.target.value)}
                    className="flex-1"
                    readOnly
                  />
                  <Input
                    placeholder="Longitude"
                    value={form.lng}
                    onChange={(e) => updateForm("lng", e.target.value)}
                    className="flex-1"
                    readOnly
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={captureGPS}
                    disabled={gpsLoading}
                    className="shrink-0 bg-transparent"
                  >
                    {gpsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.gps && <p className="text-xs text-destructive">{errors.gps}</p>}
                {form.lat && form.lng && (
                  <p className="text-xs text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Location captured
                  </p>
                )}
              </div>
            </>
          )}

          {/* Crop Cycle Section */}
          {activeSection === "crop" && (
            <>
              <div className="space-y-2">
                <Label>Crop Type *</Label>
                <div className="grid grid-cols-3 gap-2">
                  {CROPS.map((crop) => (
                    <button
                      key={crop.value}
                      type="button"
                      onClick={() => updateForm("cropType", crop.value)}
                      className={`py-3 px-2 rounded-lg border text-sm font-medium transition-colors ${
                        form.cropType === crop.value
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:border-primary/50"
                      } ${errors.cropType ? "border-destructive" : ""}`}
                    >
                      {crop.label}
                    </button>
                  ))}
                </div>
                {errors.cropType && <p className="text-xs text-destructive">{errors.cropType}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hectares">Hectares to Plant *</Label>
                <Input
                  id="hectares"
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  min="0.1"
                  max={form.farmSize || undefined}
                  placeholder={`Max: ${form.farmSize || "—"} ha`}
                  value={form.hectares}
                  onChange={(e) => updateForm("hectares", e.target.value)}
                  className={errors.hectares ? "border-destructive" : ""}
                />
                {errors.hectares && <p className="text-xs text-destructive">{errors.hectares}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="plantingDate">Expected Planting Date *</Label>
                <Input
                  id="plantingDate"
                  type="date"
                  value={form.plantingDate}
                  onChange={(e) => updateForm("plantingDate", e.target.value)}
                  className={errors.plantingDate ? "border-destructive" : ""}
                />
                {errors.plantingDate && <p className="text-xs text-destructive">{errors.plantingDate}</p>}
              </div>

              <div className="flex items-center gap-3 py-2">
                <Checkbox
                  id="irrigation"
                  checked={form.hasIrrigation}
                  onCheckedChange={(checked) => updateForm("hasIrrigation", checked as boolean)}
                />
                <Label htmlFor="irrigation" className="font-normal cursor-pointer">
                  Farm has irrigation access
                </Label>
              </div>

              {/* Summary */}
              {form.cropType && form.hectares && (
                <div className="bg-muted/50 rounded-lg p-4 space-y-2 mt-4">
                  <p className="text-sm font-medium">Registration Summary</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Farmer:</span>
                    <span>
                      {form.firstName} {form.lastName}
                    </span>
                    <span className="text-muted-foreground">Location:</span>
                    <span>
                      {form.village}, {form.lga}
                    </span>
                    <span className="text-muted-foreground">Crop:</span>
                    <span>{form.cropType.charAt(0).toUpperCase() + form.cropType.slice(1)}</span>
                    <span className="text-muted-foreground">Area:</span>
                    <span>{form.hectares} hectares</span>
                    <span className="text-muted-foreground">Est. Yield:</span>
                    <span>{(Number(form.hectares) * 3).toFixed(1)} tons</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Error message */}
        {errors.submit && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg mt-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p className="text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Fixed bottom action bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 md:pl-64">
          <div className="max-w-lg mx-auto flex gap-3">
            {activeSection !== "personal" && (
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => {
                  const sections: FormSection[] = ["personal", "farm", "crop"]
                  const currentIndex = sections.indexOf(activeSection)
                  if (currentIndex > 0) {
                    setActiveSection(sections[currentIndex - 1])
                  }
                }}
              >
                Back
              </Button>
            )}

            {!isOnline && activeSection === "crop" ? (
              <Button className="flex-1" onClick={saveOffline}>
                <Save className="w-4 h-4 mr-2" />
                Save Offline
              </Button>
            ) : activeSection === "crop" ? (
              <Button className="flex-1" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit & Continue
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                className="flex-1"
                onClick={() => {
                  if (validateSection(activeSection)) {
                    const sections: FormSection[] = ["personal", "farm", "crop"]
                    const currentIndex = sections.indexOf(activeSection)
                    if (currentIndex < sections.length - 1) {
                      setActiveSection(sections[currentIndex + 1])
                    }
                  }
                }}
              >
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
