// Centralized crop list for the entire platform
export const CROPS = [
  "Maize (White)",
  "Maize (Yellow)",
  "Rice (Paddy)",
  "Rice (Milled)",
  "Sorghum",
  "Millet",
  "Soybeans",
  "Groundnut (Shelled)",
  "Groundnut (Unshelled)",
  "Sesame Seed",
  "Cowpea (Beans – Brown)",
  "Cowpea (Beans – White)",
  "Cassava Tubers",
  "Cassava Chips",
  "Gari (White)",
  "Palm Oil (Crude)",
  "Palm Kernel",
  "Cocoa Beans",
  "Ginger (Dry Split)",
  "Garlic (Dry)",
  "Onion (Dry)",
  "Tomatoes (Fresh)",
  "Pepper (Dry Red)",
  "Yam Tubers",
  "Plantain",
  "Banana",
  "Pineapple",
  "Sugarcane",
  "Cotton (Seed Cotton)",
] as const

export type CropName = (typeof CROPS)[number]

// For backwards compatibility with existing code using lowercase values
export const CROP_VALUES = CROPS.map((crop) => ({
  value: crop.toLowerCase().replace(/[^a-z0-9]/g, "-"),
  label: crop,
}))
