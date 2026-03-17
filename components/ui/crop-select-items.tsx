"use client"

import { SelectItem } from "@/components/ui/select"
import { CROPS } from "@/lib/data/crops"

export function CropSelectItems() {
  return (
    <>
      {CROPS.map((crop) => (
        <SelectItem key={crop} value={crop}>
          {crop}
        </SelectItem>
      ))}
    </>
  )
}
