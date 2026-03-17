// =====================================================
// DEMO SEED DATA - Immutable, Controlled Datasets
// =====================================================

import type { Farmer, Contract, Delivery } from "@/lib/data/types"

// =====================================================
// IMMUTABLE SEED DATA
// These are the "pristine" datasets that demos start with
// =====================================================

export const DEMO_SEED_FARMERS: Readonly<Farmer[]> = Object.freeze([
  {
    id: "demo-farmer-001",
    firstName: "Musa",
    lastName: "Abdullahi",
    phone: "+234 803 456 7890",
    email: "",
    village: "Tudun Wada",
    lga: "Zaria",
    state: "Kaduna",
    corridorId: "corridor-kaduna-001",
    clusterId: "cluster-zaria-001",
    agentId: "agent-001",
    status: "active",
    totalLandHectares: 5.2,
    crops: ["maize", "soybean"],
    farmingExperience: 10,
    registrationDate: "2024-02-15",
    lastVisitDate: "2025-01-03",
    coordinates: { lat: 11.0876, lng: 7.7279 },
    createdAt: "2024-02-15T00:00:00Z",
    updatedAt: "2025-01-03T00:00:00Z",
  },
  {
    id: "demo-farmer-002",
    firstName: "Fatima",
    lastName: "Yusuf",
    phone: "+234 805 678 1234",
    email: "",
    village: "Samaru",
    lga: "Zaria",
    state: "Kaduna",
    corridorId: "corridor-kaduna-001",
    clusterId: "cluster-zaria-001",
    agentId: "agent-001",
    status: "active",
    totalLandHectares: 3.8,
    crops: ["rice", "maize"],
    farmingExperience: 8,
    registrationDate: "2024-03-01",
    lastVisitDate: "2025-01-05",
    coordinates: { lat: 11.0945, lng: 7.7289 },
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2025-01-05T00:00:00Z",
  },
  {
    id: "demo-farmer-003",
    firstName: "Audu",
    lastName: "Garba",
    phone: "+234 806 789 2345",
    email: "",
    village: "Kufena",
    lga: "Sabon Gari",
    state: "Kaduna",
    corridorId: "corridor-kaduna-001",
    clusterId: "cluster-sabon-gari-001",
    agentId: "agent-002",
    status: "active",
    totalLandHectares: 4.5,
    crops: ["soybean", "groundnut"],
    farmingExperience: 4,
    registrationDate: "2024-03-15",
    lastVisitDate: "2025-01-04",
    coordinates: { lat: 11.1256, lng: 7.6834 },
    createdAt: "2024-03-15T00:00:00Z",
    updatedAt: "2025-01-04T00:00:00Z",
  },
  {
    id: "demo-farmer-004",
    firstName: "Halima",
    lastName: "Mohammed",
    phone: "+234 807 890 3456",
    email: "",
    village: "Galadimawa",
    lga: "Giwa",
    state: "Kaduna",
    corridorId: "corridor-kaduna-001",
    clusterId: "cluster-giwa-001",
    agentId: "agent-003",
    status: "active",
    totalLandHectares: 6.0,
    crops: ["maize", "millet"],
    farmingExperience: 7,
    registrationDate: "2024-02-20",
    lastVisitDate: "2025-01-06",
    coordinates: { lat: 11.2451, lng: 7.8923 },
    createdAt: "2024-02-20T00:00:00Z",
    updatedAt: "2025-01-06T00:00:00Z",
  },
  {
    id: "demo-farmer-005",
    firstName: "Bello",
    lastName: "Abubakar",
    phone: "+234 808 901 4567",
    email: "",
    village: "Rigasa",
    lga: "Igabi",
    state: "Kaduna",
    corridorId: "corridor-kaduna-001",
    clusterId: "cluster-igabi-001",
    agentId: "agent-004",
    status: "active",
    totalLandHectares: 7.5,
    crops: ["maize", "sorghum"],
    farmingExperience: 12,
    registrationDate: "2024-01-25",
    lastVisitDate: "2025-01-02",
    coordinates: { lat: 10.9834, lng: 7.6123 },
    createdAt: "2024-01-25T00:00:00Z",
    updatedAt: "2025-01-02T00:00:00Z",
  },
])

export const DEMO_SEED_CONTRACTS: Readonly<Contract[]> = Object.freeze([
  {
    id: "demo-contract-001",
    contractNumber: "AGR-KDN-2024-001",
    offtakerId: "offtaker-001",
    corridorId: "corridor-kaduna-001",
    cropType: "Maize",
    season: "2024 Wet Season",
    contractedVolumeTons: 500,
    deliveredVolumeTons: 425,
    pricePerTon: 285000,
    totalValue: 142500000,
    qualitySpecs: {
      grade: "A",
      maxMoisture: 14,
      minPurity: 98,
    },
    status: "active",
    startDate: "2024-04-01",
    endDate: "2024-11-30",
    deliveryStartDate: "2024-10-15",
    deliveryEndDate: "2024-11-30",
    createdAt: "2024-04-01T00:00:00Z",
    updatedAt: "2025-01-07T00:00:00Z",
  } as Contract,
  {
    id: "demo-contract-002",
    contractNumber: "AGR-KDN-2024-002",
    offtakerId: "offtaker-001",
    corridorId: "corridor-kaduna-001",
    cropType: "Soybean",
    season: "2024 Wet Season",
    contractedVolumeTons: 300,
    deliveredVolumeTons: 278,
    pricePerTon: 420000,
    totalValue: 126000000,
    qualitySpecs: {
      grade: "A",
      maxMoisture: 12,
      minPurity: 98,
    },
    status: "active",
    startDate: "2024-04-01",
    endDate: "2024-11-30",
    deliveryStartDate: "2024-11-01",
    deliveryEndDate: "2024-12-15",
    createdAt: "2024-04-01T00:00:00Z",
    updatedAt: "2025-01-07T00:00:00Z",
  } as Contract,
  {
    id: "demo-contract-003",
    contractNumber: "AGR-KDN-2024-003",
    offtakerId: "offtaker-002",
    corridorId: "corridor-kaduna-001",
    cropType: "Rice",
    season: "2024 Wet Season",
    contractedVolumeTons: 200,
    deliveredVolumeTons: 200,
    pricePerTon: 380000,
    totalValue: 76000000,
    qualitySpecs: {
      grade: "A",
      maxMoisture: 13,
      minPurity: 99,
    },
    status: "completed",
    startDate: "2024-04-01",
    endDate: "2024-10-30",
    deliveryStartDate: "2024-09-15",
    deliveryEndDate: "2024-10-30",
    createdAt: "2024-04-01T00:00:00Z",
    updatedAt: "2024-10-30T00:00:00Z",
  } as Contract,
])

export const DEMO_SEED_DELIVERIES: Readonly<Delivery[]> = Object.freeze([
  {
    id: "demo-delivery-001",
    contractId: "demo-contract-001",
    farmerId: "demo-farmer-001",
    deliveryNumber: "DEL-001-2025",
    quantityTons: 2.5,
    status: "verified",
    deliveryDate: "2025-01-05",
    qualityGrade: "A",
    moistureContent: 13.2,
    rejectionReason: undefined,
    vehicleNumber: "KD-234-ABC",
    driverName: "Ibrahim Suleiman",
    driverPhone: "+234 801 234 5678",
    warehouseLocation: "Zaria Central Warehouse",
    verifiedBy: "ops-001",
    verifiedAt: "2025-01-05T14:30:00Z",
    createdAt: "2025-01-05T10:00:00Z",
    updatedAt: "2025-01-05T14:30:00Z",
  } as Delivery,
  {
    id: "demo-delivery-002",
    contractId: "demo-contract-001",
    farmerId: "demo-farmer-002",
    deliveryNumber: "DEL-002-2025",
    quantityTons: 1.8,
    status: "verified",
    deliveryDate: "2025-01-04",
    qualityGrade: "A",
    moistureContent: 12.8,
    rejectionReason: undefined,
    vehicleNumber: "KD-567-DEF",
    driverName: "Ahmed Musa",
    driverPhone: "+234 802 345 6789",
    warehouseLocation: "Zaria Central Warehouse",
    verifiedBy: "ops-001",
    verifiedAt: "2025-01-04T16:20:00Z",
    createdAt: "2025-01-04T11:30:00Z",
    updatedAt: "2025-01-04T16:20:00Z",
  } as Delivery,
  {
    id: "demo-delivery-003",
    contractId: "demo-contract-002",
    farmerId: "demo-farmer-003",
    deliveryNumber: "DEL-003-2025",
    quantityTons: 3.2,
    status: "in_transit",
    deliveryDate: "2025-01-07",
    qualityGrade: "A",
    moistureContent: 11.5,
    rejectionReason: undefined,
    vehicleNumber: "KD-890-GHI",
    driverName: "Yusuf Garba",
    driverPhone: "+234 803 456 7890",
    warehouseLocation: "Zaria Central Warehouse",
    verifiedBy: undefined,
    verifiedAt: undefined,
    createdAt: "2025-01-07T08:00:00Z",
    updatedAt: "2025-01-07T08:00:00Z",
  } as Delivery,
])

// =====================================================
// DEMO STATE MANAGEMENT
// =====================================================

/**
 * Deep clone utility for creating mutable copies from frozen seed data
 */
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * DemoDataStore - In-memory transient storage for demo sessions
 * All mutations happen here, never touching the seed data
 */
class DemoDataStore {
  private farmers: Farmer[] = []
  private contracts: Contract[] = []
  private deliveries: Delivery[] = []
  private lastResetAt: Date = new Date()

  constructor() {
    this.reset()
  }

  /**
   * Reset all demo data to pristine seed state
   */
  reset(): void {
    console.log("[v0] Resetting demo data to seed state...")
    this.farmers = deepClone(DEMO_SEED_FARMERS as Farmer[])
    this.contracts = deepClone(DEMO_SEED_CONTRACTS as Contract[])
    this.deliveries = deepClone(DEMO_SEED_DELIVERIES as Delivery[])
    this.lastResetAt = new Date()
    console.log("[v0] Demo data reset complete:", {
      farmers: this.farmers.length,
      contracts: this.contracts.length,
      deliveries: this.deliveries.length,
    })
  }

  /**
   * Get current demo state (returns mutable copies for repositories)
   */
  getFarmers(): Farmer[] {
    return [...this.farmers]
  }

  getContracts(): Contract[] {
    return [...this.contracts]
  }

  getDeliveries(): Delivery[] {
    return [...this.deliveries]
  }

  /**
   * Update state (for repositories to mutate)
   */
  setFarmers(farmers: Farmer[]): void {
    this.farmers = farmers
  }

  setContracts(contracts: Contract[]): void {
    this.contracts = contracts
  }

  setDeliveries(deliveries: Delivery[]): void {
    this.deliveries = deliveries
  }

  getLastResetAt(): Date {
    return this.lastResetAt
  }
}

// Singleton demo data store
const demoStore = new DemoDataStore()

/**
 * Get the demo data store instance
 */
export function getDemoStore(): DemoDataStore {
  return demoStore
}

/**
 * Reset demo data to pristine seed state
 */
export function resetDemoData(): void {
  demoStore.reset()
}

/**
 * Get demo metrics (for impressive dashboards)
 */
export const DEMO_METRICS = Object.freeze({
  totalFarmers: 1228,
  activeFarmers: 1156,
  totalHectares: 4732,
  activeCorridors: 2,
  deliveryReliability: 0.92,
  avgYieldPerHectare: 3.8, // MT
  contractFulfillmentRate: 0.89,
  farmerSatisfaction: 4.6, // out of 5
  serviceCompletionRate: 0.85,
  contractsOnTrack: 0.88,
  deliverySuccessRate: 0.94,
})

/**
 * Check if an email belongs to a demo user
 */
export function isDemoUser(email?: string): boolean {
  if (!email) return false
  return email.toLowerCase().includes("demo-") || email.toLowerCase().includes("@agrobridge.app")
}
