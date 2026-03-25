"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import useSWR from "swr"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, MapPin, Wheat, Building2, Save, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const CROP_OPTIONS = [
  "Maize",
  "Sorghum",
  "Soybean",
  "Rice",
  "Groundnut",
  "Cowpea",
  "Sesame",
  "Millet",
  "Wheat",
  "Multi-crop",
]

export default function CreateCorridorPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [name, setName] = useState("")
  const [cropFocus, setCropFocus] = useState("")
  const [primaryDeliveryHub, setPrimaryDeliveryHub] = useState("")
  const [description, setDescription] = useState("")
  const [selectedState, setSelectedState] = useState<string>("")
  const [selectedLgas, setSelectedLgas] = useState<number[]>([])

  // Fetch states
  const { data: statesData, isLoading: statesLoading } = useSWR<{ success: boolean; data: Array<{ id: number; name: string }> }>(
    "/api/geography/states",
    fetcher
  )

  // Fetch LGAs for selected state
  const { data: lgasData, isLoading: lgasLoading } = useSWR<{ success: boolean; data: Array<{ id: number; name: string }> }>(
    selectedState ? `/api/geography/lgas?state_id=${selectedState}` : null,
    fetcher
  )

  const states = statesData?.success ? statesData.data : []
  const lgas = lgasData?.success ? lgasData.data : []

  const handleLgaToggle = (lgaId: number) => {
    setSelectedLgas((prev) =>
      prev.includes(lgaId) ? prev.filter((id) => id !== lgaId) : [...prev, lgaId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("Please enter a corridor name")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/corridors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          crop_focus: cropFocus || null,
          primary_delivery_hub: primaryDeliveryHub || null,
          description: description || null,
          lga_ids: selectedLgas,
          created_by: user?.id || "system",
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Corridor created successfully")
        router.push("/dashboard/ops/corridors")
      } else {
        toast.error(result.error || "Failed to create corridor")
      }
    } catch (error) {
      console.error("Create corridor error:", error)
      toast.error("Failed to create corridor")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardLayout allowedRoles={["ops_admin", "super_admin"]}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/ops/corridors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Create Corridor</h1>
            <p className="text-muted-foreground">Set up a new agricultural supply corridor</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <Card className="border-border/50 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-primary" />
                Corridor Details
              </CardTitle>
              <CardDescription>Basic information about the corridor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Corridor Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Zaria-Kaduna Maize Corridor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="crop">Primary Crop Focus</Label>
                  <Select value={cropFocus} onValueChange={setCropFocus}>
                    <SelectTrigger id="crop">
                      <SelectValue placeholder="Select crop" />
                    </SelectTrigger>
                    <SelectContent>
                      {CROP_OPTIONS.map((crop) => (
                        <SelectItem key={crop} value={crop}>
                          {crop}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hub">Primary Delivery Hub</Label>
                  <Input
                    id="hub"
                    placeholder="e.g., Kaduna Central Warehouse"
                    value={primaryDeliveryHub}
                    onChange={(e) => setPrimaryDeliveryHub(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the corridor's purpose, coverage area, and key characteristics..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Geographic Coverage */}
          <Card className="border-border/50 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5 text-primary" />
                Geographic Coverage
              </CardTitle>
              <CardDescription>Select the state and LGAs covered by this corridor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                {statesLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select value={selectedState} onValueChange={(val) => {
                    setSelectedState(val)
                    setSelectedLgas([])
                  }}>
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state.id} value={state.id.toString()}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {selectedState && (
                <div className="space-y-2">
                  <Label>LGAs (Select all that apply)</Label>
                  {lgasLoading ? (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-6 w-full" />
                      ))}
                    </div>
                  ) : lgas.length > 0 ? (
                    <div className="grid gap-2 sm:grid-cols-2 max-h-60 overflow-y-auto p-2 border rounded-md">
                      {lgas.map((lga) => (
                        <div key={lga.id} className="flex items-center gap-2">
                          <Checkbox
                            id={`lga-${lga.id}`}
                            checked={selectedLgas.includes(lga.id)}
                            onCheckedChange={() => handleLgaToggle(lga.id)}
                          />
                          <Label htmlFor={`lga-${lga.id}`} className="text-sm font-normal cursor-pointer">
                            {lga.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground py-4 text-center">
                      No LGAs found for this state
                    </p>
                  )}
                  {selectedLgas.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {selectedLgas.length} LGA{selectedLgas.length > 1 ? "s" : ""} selected
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-3">
            <Button type="button" variant="outline" asChild className="flex-1">
              <Link href="/dashboard/ops/corridors">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting || !name.trim()} className="flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Corridor
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
