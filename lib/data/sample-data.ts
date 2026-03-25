// =====================================================
// SAMPLE DATA — DEVELOPER REFERENCE ONLY
//
// This file documents the expected shape of every
// production entity in the AgroBridge system.
//
// DO NOT import this file in any component, API route,
// or service. It exists purely as a schema reference for
// developers building new features or DB migrations.
// =====================================================

// ---- CORRIDOR ----------------------------------------
export const SAMPLE_CORRIDOR = {
  id: "corridor-uuid-here",
  name: "Kaduna North Corridor",
  state: "Kaduna",
  region: "North-West",
  primaryDeliveryHub: "Zaria Aggregation Hub",
  cropFocus: "maize",
  description: "Primary maize corridor covering Zaria, Sabon Gari and surrounding LGAs.",
  clusters: [
    { id: "cluster-uuid-1", name: "Zaria North", lgaName: "Zaria" },
    { id: "cluster-uuid-2", name: "Sabon Gari", lgaName: "Sabon Gari" },
  ],
  status: "active",           // "active" | "planned" | "inactive"
  createdAt: "2025-01-15T08:00:00.000Z",
  updatedAt: "2025-06-01T10:30:00.000Z",
}

// ---- FARMER ------------------------------------------
export const SAMPLE_FARMER = {
  id: "farmer-uuid-here",
  firstName: "Abubakar",
  lastName: "Musa",
  phone: "+2348012345678",
  gender: "male",             // "male" | "female"
  dateOfBirth: "1985-04-12",
  stateOfOrigin: "Kaduna",
  lgaOfOrigin: "Zaria",
  address: "Zaria North, Kaduna State",
  corridorId: "corridor-uuid-here",
  seasonId: "season-uuid-here",
  clusterId: "cluster-uuid-1",
  assignedAgentId: "agent-uuid-here",
  status: "active",           // "active" | "pending" | "inactive" | "suspended"
  kycStatus: "verified",      // "pending" | "submitted" | "verified" | "rejected"
  totalHectares: 2.5,
  primaryCrop: "maize",
  bankName: "First Bank",
  bankAccountNumber: "3012345678",
  bvn: "22312345678",
  createdAt: "2025-02-01T09:00:00.000Z",
  updatedAt: "2025-06-10T14:00:00.000Z",
}

// ---- LAND PLOT ---------------------------------------
export const SAMPLE_LAND_PLOT = {
  id: "plot-uuid-here",
  farmerId: "farmer-uuid-here",
  corridorId: "corridor-uuid-here",
  seasonId: "season-uuid-here",
  name: "Main Farm",
  coordinates: { lat: 11.1125, lng: 7.7227 },
  sizeHectares: 2.5,
  soilType: "loamy",
  irrigationType: "rainfed",  // "rainfed" | "irrigated" | "supplemental"
  status: "active",
  createdAt: "2025-02-05T09:00:00.000Z",
  updatedAt: "2025-02-05T09:00:00.000Z",
}

// ---- CROP CYCLE --------------------------------------
export const SAMPLE_CROP_CYCLE = {
  id: "cycle-uuid-here",
  farmerId: "farmer-uuid-here",
  landPlotId: "plot-uuid-here",
  corridorId: "corridor-uuid-here",
  seasonId: "season-uuid-here",
  contractId: "contract-uuid-here",
  cropType: "maize",          // "maize" | "soya" | "sorghum" | "rice" | "wheat"
  plantingDate: "2025-05-10",
  expectedHarvestDate: "2025-09-20",
  status: "growing",          // "planned" | "planted" | "growing" | "harvesting" | "completed" | "failed"
  expectedYieldTons: 5.0,
  actualYieldTons: null,      // populated after harvest
  serviceEvents: [],          // ServiceEvent IDs
  createdAt: "2025-05-01T07:00:00.000Z",
  updatedAt: "2025-05-12T11:00:00.000Z",
}

// ---- OFFTAKE CONTRACT --------------------------------
export const SAMPLE_CONTRACT = {
  id: "contract-uuid-here",
  corridorId: "corridor-uuid-here",
  seasonId: "season-uuid-here",
  offtakerId: "user-uuid-buyer",
  offtakerName: "Dangote Flour Mills Ltd",
  cropType: "maize",
  targetVolumeTons: 500,
  deliveredVolumeTons: 120,
  remainingVolumeTons: 380,
  pricePerTon: 185000,        // NGN
  qualityParameters: {
    maxMoisturePercent: 13.5,
    maxForeignMatterPercent: 2,
    minGrade: "A",            // "A" | "B" | "C"
  },
  deliveryWindowStart: "2025-10-01",
  deliveryWindowEnd: "2025-11-30",
  status: "active",           // "draft" | "active" | "fulfilled" | "cancelled" | "expired"
  assignedFarmerIds: ["farmer-uuid-1", "farmer-uuid-2"],
  assignedCropCycleIds: ["cycle-uuid-1", "cycle-uuid-2"],
  createdAt: "2025-04-15T10:00:00.000Z",
  updatedAt: "2025-10-05T08:00:00.000Z",
}

// ---- DELIVERY ----------------------------------------
export const SAMPLE_DELIVERY = {
  id: "delivery-uuid-here",
  contractId: "contract-uuid-here",
  farmerId: "farmer-uuid-here",
  corridorId: "corridor-uuid-here",
  seasonId: "season-uuid-here",
  quantityTons: 4.8,
  qualityGrade: "A",
  moisturePercent: 12.8,
  foreignMatterPercent: 1.2,
  unitPrice: 185000,
  totalValue: 888000,         // NGN
  deliveryDate: "2025-10-12",
  waybillNumber: "WB-2025-0042",
  vehicleNumber: "KD-452-AA",
  driverName: "Ibrahim Yusuf",
  driverPhone: "+2348023456789",
  status: "delivered",        // "scheduled" | "in_transit" | "delivered" | "rejected" | "partial"
  rejectionReason: null,
  createdAt: "2025-10-10T06:00:00.000Z",
  updatedAt: "2025-10-12T15:30:00.000Z",
}

// ---- FIELD AGENT -------------------------------------
export const SAMPLE_FIELD_AGENT = {
  id: "agent-uuid-here",
  userId: "user-uuid-here",
  firstName: "Sani",
  lastName: "Bello",
  phone: "+2348034567890",
  email: "sani.bello@agrobridge.app",
  corridorId: "corridor-uuid-here",
  clusterId: "cluster-uuid-1",
  status: "active",           // "active" | "inactive" | "on_leave"
  farmersAssigned: 45,
  totalVisitsCompleted: 120,
  joinedAt: "2025-01-20T08:00:00.000Z",
}

// ---- PARTNER (Input/Service Provider) ----------------
export const SAMPLE_PARTNER = {
  id: "partner-uuid-here",
  companyName: "AgriServe Nigeria Ltd",
  contactPerson: "Emmanuel Okafor",
  phone: "+2348045678901",
  email: "info@agriserve.ng",
  corridorIds: ["corridor-uuid-here"],
  partnerType: "input_supplier", // "input_supplier" | "equipment_provider" | "logistics" | "offtaker"
  servicesOffered: ["seed_supply", "fertilizer_supply"],
  status: "active",
  contractedSince: "2025-02-01",
  createdAt: "2025-02-01T08:00:00.000Z",
}

// ---- PLANNING INTEREST (Buyer Demand Signal) ---------
export const SAMPLE_PLANNING_INTEREST = {
  id: "interest-uuid-here",
  buyerId: "user-uuid-buyer",
  buyerName: "Honeywell Flour Mills",
  corridorId: "corridor-uuid-here",
  cropType: "maize",
  estimatedVolumeTons: 300,
  targetDeliveryDate: "2025-11-01",
  priceExpectationPerTon: 180000,  // NGN
  qualityNotes: "Max 13% moisture, Grade A only",
  status: "submitted",        // "submitted" | "under_review" | "matched" | "contracted" | "declined"
  createdAt: "2025-03-10T09:00:00.000Z",
  updatedAt: "2025-03-12T11:00:00.000Z",
}

// ---- SUPPLY ORDER ------------------------------------
export const SAMPLE_SUPPLY_ORDER = {
  id: "order-uuid-here",
  corridorId: "corridor-uuid-here",
  aggregatorId: "user-uuid-aggregator",
  aggregatorName: "Musa Ibrahim",
  cropType: "maize",
  targetVolumeTons: 50,
  pricePerTon: 182000,
  deliveryDeadline: "2025-10-30",
  pickupLocation: "Zaria Aggregation Hub, Kaduna",
  qualityRequirements: "Max 13.5% moisture, Grade A/B",
  status: "open",             // "open" | "partially_filled" | "filled" | "cancelled" | "delivered"
  allocatedTons: 20,
  notes: "Priority order for Dangote contract fulfilment",
  createdAt: "2025-09-01T08:00:00.000Z",
  updatedAt: "2025-09-15T10:00:00.000Z",
}

// ---- CORRIDOR METRICS --------------------------------
export const SAMPLE_CORRIDOR_METRICS = {
  corridorId: "corridor-uuid-here",
  seasonId: "season-uuid-here",
  totalFarmers: 0,
  activeFarmers: 0,
  totalHectares: 0,
  totalServiceEvents: 0,
  completedServices: 0,
  pendingServices: 0,
  slaAdherencePercent: 0,
  totalContractedVolumeTons: 0,
  totalDeliveredTons: 0,
  avgYieldPerHectare: 0,
  totalRevenue: 0,
  totalCosts: 0,
  grossMargin: 0,
  costPerFarmer: 0,
  costPerHectare: 0,
  calculatedAt: "2025-10-01T00:00:00.000Z",
  // PRODUCTION: Populate via DB aggregation job or materialized view
}

// ---- SEASON ------------------------------------------
export const SAMPLE_SEASON = {
  id: "season-uuid-here",
  name: "2025 Wet Season",
  startDate: "2025-04-01",
  endDate: "2025-11-30",
  status: "active",           // "planned" | "active" | "completed"
  corridorId: "corridor-uuid-here",
  createdAt: "2025-01-10T08:00:00.000Z",
}
