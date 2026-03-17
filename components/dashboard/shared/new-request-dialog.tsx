"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"

const farmers = [
  { id: "FRM-001", name: "Musa Abdullahi", location: "Zaria, Kaduna" },
  { id: "FRM-002", name: "Amina Ibrahim", location: "Giwa, Kaduna" },
  { id: "FRM-003", name: "Yusuf Bello", location: "Sabon Gari, Kaduna" },
  { id: "FRM-004", name: "Fatima Abubakar", location: "Igabi, Kaduna" },
  { id: "FRM-005", name: "Ibrahim Garba", location: "Makarfi, Kaduna" },
]

const serviceTypes = [
  { value: "plowing", label: "Plowing", category: "mechanization" },
  { value: "harrowing", label: "Harrowing", category: "mechanization" },
  { value: "planting", label: "Planting", category: "mechanization" },
  { value: "harvesting", label: "Harvesting", category: "mechanization" },
  { value: "seeds", label: "Seeds", category: "inputs" },
  { value: "fertilizer", label: "Fertilizer", category: "inputs" },
  { value: "herbicides", label: "Herbicides", category: "inputs" },
  { value: "pesticides", label: "Pesticides", category: "inputs" },
  { value: "irrigation", label: "Irrigation Setup", category: "mechanization" },
]

interface NewRequestDialogProps {
  onSubmit?: (data: Record<string, string>) => void
}

export function NewRequestDialog({ onSubmit }: NewRequestDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    farmerId: "",
    serviceType: "",
    farmSize: "",
    urgency: "",
    notes: "",
  })

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onSubmit?.(formData)
    setIsSubmitting(false)
    setOpen(false)
    setFormData({ farmerId: "", serviceType: "", farmSize: "", urgency: "", notes: "" })
  }

  const selectedFarmer = farmers.find((f) => f.id === formData.farmerId)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Service Request</DialogTitle>
          <DialogDescription>Create a new service request for a farmer in the network.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="farmer">Farmer</Label>
            <Select value={formData.farmerId} onValueChange={(v) => setFormData({ ...formData, farmerId: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a farmer" />
              </SelectTrigger>
              <SelectContent>
                {farmers.map((farmer) => (
                  <SelectItem key={farmer.id} value={farmer.id}>
                    <div className="flex flex-col">
                      <span>{farmer.name}</span>
                      <span className="text-xs text-muted-foreground">{farmer.location}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedFarmer && <p className="text-xs text-muted-foreground">Location: {selectedFarmer.location}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="service">Service Type</Label>
            <Select value={formData.serviceType} onValueChange={(v) => setFormData({ ...formData, serviceType: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="header-mech" disabled className="font-semibold">
                  Mechanization
                </SelectItem>
                {serviceTypes
                  .filter((s) => s.category === "mechanization")
                  .map((service) => (
                    <SelectItem key={service.value} value={service.value}>
                      {service.label}
                    </SelectItem>
                  ))}
                <SelectItem value="header-inputs" disabled className="font-semibold mt-2">
                  Inputs
                </SelectItem>
                {serviceTypes
                  .filter((s) => s.category === "inputs")
                  .map((service) => (
                    <SelectItem key={service.value} value={service.value}>
                      {service.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="farmSize">Farm Size (hectares)</Label>
              <Input
                id="farmSize"
                type="number"
                placeholder="e.g., 5"
                value={formData.farmSize}
                onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency</Label>
              <Select value={formData.urgency} onValueChange={(v) => setFormData({ ...formData, urgency: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Within 2 weeks</SelectItem>
                  <SelectItem value="normal">Normal - Within 1 week</SelectItem>
                  <SelectItem value="high">High - Within 3 days</SelectItem>
                  <SelectItem value="urgent">Urgent - Within 24 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any special requirements or instructions..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !formData.farmerId || !formData.serviceType}>
            {isSubmitting ? "Creating..." : "Create Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
