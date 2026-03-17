// =====================================================
// DEMO DATA SEEDING - Curated, polished data for demos
// =====================================================

// Demo data configuration
export const DEMO_DATA_CONFIG = {
  // Metrics that look healthy but believable
  metrics: {
    totalFarmers: 1228,
    activeFarmers: 1156,
    totalHectares: 4732,
    activeCorridors: 2,
    deliveryReliability: 0.92,
    avgYieldPerHectare: 3.8, // MT
    contractFulfillmentRate: 0.89,
    farmerSatisfaction: 4.6, // out of 5
  },

  // Demo-specific overrides
  overrides: {
    // Make services mostly completed or on-track
    serviceCompletionRate: 0.85,
    // Make contracts look healthy
    contractsOnTrack: 0.88,
    // Make deliveries mostly successful
    deliverySuccessRate: 0.94,
  },
}

// Curated farmer profiles for demos (clean, with good data)
export const DEMO_FARMERS = [
  {
    id: "demo-farmer-001",
    firstName: "Musa",
    lastName: "Abdullahi",
    phone: "+234 803 456 7890",
    village: "Tudun Wada",
    lga: "Zaria",
    state: "Kaduna",
    totalLandHectares: 5.2,
    crops: ["maize", "soybean"],
    status: "active",
    farmingExperience: "10+",
    registrationDate: "2024-02-15",
    lastVisit: "2025-01-03",
  },
  {
    id: "demo-farmer-002",
    firstName: "Fatima",
    lastName: "Yusuf",
    phone: "+234 805 678 1234",
    village: "Samaru",
    lga: "Zaria",
    state: "Kaduna",
    totalLandHectares: 3.8,
    crops: ["rice", "maize"],
    status: "active",
    farmingExperience: "6-10",
    registrationDate: "2024-03-01",
    lastVisit: "2025-01-05",
  },
  {
    id: "demo-farmer-003",
    firstName: "Audu",
    lastName: "Garba",
    phone: "+234 806 789 2345",
    village: "Kufena",
    lga: "Sabon Gari",
    state: "Kaduna",
    totalLandHectares: 4.5,
    crops: ["soybean", "groundnut"],
    status: "active",
    farmingExperience: "3-5",
    registrationDate: "2024-03-15",
    lastVisit: "2025-01-04",
  },
  {
    id: "demo-farmer-004",
    firstName: "Halima",
    lastName: "Mohammed",
    phone: "+234 807 890 3456",
    village: "Galadimawa",
    lga: "Giwa",
    state: "Kaduna",
    totalLandHectares: 6.0,
    crops: ["maize", "millet"],
    status: "active",
    farmingExperience: "6-10",
    registrationDate: "2024-02-20",
    lastVisit: "2025-01-06",
  },
  {
    id: "demo-farmer-005",
    firstName: "Bello",
    lastName: "Abubakar",
    phone: "+234 808 901 4567",
    village: "Rigasa",
    lga: "Igabi",
    state: "Kaduna",
    totalLandHectares: 7.5,
    crops: ["maize", "sorghum"],
    status: "active",
    farmingExperience: "10+",
    registrationDate: "2024-01-25",
    lastVisit: "2025-01-02",
  },
]

// Demo contracts with clean expected vs delivered curves
export const DEMO_CONTRACTS = [
  {
    id: "demo-contract-001",
    crop: "Maize",
    corridor: "Kaduna North",
    season: "2024 Wet Season",
    quantity: 500,
    delivered: 425,
    fulfillmentPercent: 85,
    status: "active",
    deliveryWindow: "Oct 15 - Nov 30, 2024",
    qualitySpec: "Grade A, Max 14% moisture",
    clusters: 4,
    pricePerTon: 285000,
  },
  {
    id: "demo-contract-002",
    crop: "Soybean",
    corridor: "Kaduna North",
    season: "2024 Wet Season",
    quantity: 300,
    delivered: 278,
    fulfillmentPercent: 93,
    status: "active",
    deliveryWindow: "Nov 1 - Dec 15, 2024",
    qualitySpec: "Grade A, Max 12% moisture",
    clusters: 3,
    pricePerTon: 420000,
  },
  {
    id: "demo-contract-003",
    crop: "Rice",
    corridor: "Kaduna North",
    season: "2024 Wet Season",
    quantity: 200,
    delivered: 200,
    fulfillmentPercent: 100,
    status: "completed",
    deliveryWindow: "Sep 15 - Oct 30, 2024",
    qualitySpec: "Grade A, Paddy",
    clusters: 2,
    pricePerTon: 380000,
  },
]

// Demo deliveries (mostly successful)
export const DEMO_DELIVERIES = [
  {
    id: "demo-delivery-001",
    contractId: "demo-contract-001",
    farmerId: "demo-farmer-001",
    quantity: 2.5,
    status: "verified",
    deliveryDate: "2025-01-05",
    qualityGrade: "A",
    moistureContent: 13.2,
    vehicleNumber: "KD-234-ABC",
    driverName: "Ibrahim Suleiman",
  },
  {
    id: "demo-delivery-002",
    contractId: "demo-contract-001",
    farmerId: "demo-farmer-002",
    quantity: 1.8,
    status: "verified",
    deliveryDate: "2025-01-04",
    qualityGrade: "A",
    moistureContent: 12.8,
    vehicleNumber: "KD-567-DEF",
    driverName: "Ahmed Musa",
  },
  {
    id: "demo-delivery-003",
    contractId: "demo-contract-002",
    farmerId: "demo-farmer-003",
    quantity: 3.2,
    status: "in_transit",
    deliveryDate: "2025-01-07",
    qualityGrade: "A",
    moistureContent: 11.5,
    vehicleNumber: "KD-890-GHI",
    driverName: "Yusuf Garba",
  },
]

// Helper to get demo-optimistic metrics
export function getDemoMetrics() {
  return DEMO_DATA_CONFIG.metrics
}

// Helper to check if we should use demo data
export function shouldUseDemoData(userEmail?: string): boolean {
  if (!userEmail) return false
  return userEmail.toLowerCase().includes("demo")
}
