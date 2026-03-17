// =====================================================
// AGROBRIDGE CORE DATA OBJECTS
// Following PRD Build Order: Data Integrity First
// Every object has: Corridor ID, Season ID, Status lifecycle
// No free-text critical fields, No deletions (only status changes)
// =====================================================

// =====================================================
// ENUMS & STATUS LIFECYCLES
// =====================================================

export type FarmerStatus = "pending" | "verified" | "active" | "suspended" | "inactive"
export type LandPlotStatus = "pending_verification" | "verified" | "active" | "disputed" | "inactive"
export type CropCycleStatus = "planned" | "active" | "harvesting" | "completed" | "cancelled"
export type ServiceEventStatus = "planned" | "scheduled" | "in_progress" | "completed" | "verified" | "cancelled"
export type ContractStatus = "draft" | "active" | "in_delivery" | "fulfilled" | "cancelled"
export type DeliveryStatus = "pending" | "in_transit" | "received" | "verified" | "rejected"
export type PaymentStatus = "pending" | "processed" | "settled" | "failed"
export type PartnerStatus = "pending" | "verified" | "active" | "suspended" | "inactive"
export type UserRole =
  | "super_admin"
  | "ops_admin"
  | "regional_manager"
  | "state_coordinator"
  | "field_agent"
  | "farmer"
  | "partner"
  | "offtaker"

export type PartnerType = "input_supplier" | "mechanization" | "logistics" | "storage"
export type ServiceType =
  | "land_prep"
  | "planting"
  | "fertilizer"
  | "pest_control"
  | "irrigation"
  | "harvest"
  | "transport"
  | "storage"
export type CropType = "maize" | "rice" | "soybean" | "sorghum" | "millet" | "groundnut" | "cassava" | "cowpea"
export type QualityGrade = "A" | "B" | "C" | "rejected"

// =====================================================
// CORE GEOGRAPHIC OBJECTS
// =====================================================

export interface Corridor {
  id: string
  name: string
  state: string
  lgas: string[]
  clusters: Cluster[]
  seasonId: string
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

export interface Cluster {
  id: string
  corridorId: string
  name: string
  villages: string[]
  assignedAgentId: string | null
  farmerCount: number
  totalHectares: number
}

export interface Season {
  id: string
  name: string // e.g., "2024 Wet Season"
  startDate: string
  endDate: string
  status: "planning" | "active" | "completed"
  corridorIds: string[]
}

// =====================================================
// FARMER & LAND OBJECTS
// =====================================================

export interface Farmer {
  id: string
  corridorId: string
  clusterId: string
  seasonId: string

  // Personal Info
  firstName: string
  lastName: string
  phone: string
  email?: string
  gender: "male" | "female"
  dateOfBirth?: string

  // Location
  state: string
  lga: string
  village: string

  // KYC
  bvn?: string
  idType?: "nin" | "voters" | "drivers" | "passport"
  idNumber?: string

  // Banking
  bankName?: string
  accountNumber?: string

  // Farm Profile
  farmingExperience: string

  // Assignment
  assignedAgentId: string
  recruitedByAgentId: string

  // Status Lifecycle
  status: FarmerStatus
  verifiedAt?: string
  verifiedBy?: string

  // Audit
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface LandPlot {
  id: string
  farmerId: string
  corridorId: string
  seasonId: string

  // Location
  coordinates?: { lat: number; lng: number }
  polygonCoords?: { lat: number; lng: number }[]
  village: string

  // Details
  sizeHectares: number
  soilType?: "sandy" | "loamy" | "clay" | "mixed"
  irrigationAccess: boolean

  // Status
  status: LandPlotStatus
  verifiedAt?: string
  verifiedBy?: string

  // Audit
  createdAt: string
  updatedAt: string
}

// =====================================================
// CROP CYCLE & SERVICE OBJECTS
// =====================================================

export interface CropCycle {
  id: string
  farmerId: string
  landPlotId: string
  corridorId: string
  seasonId: string

  // Crop Info
  cropType: CropType
  variety?: string
  plantingDate: string
  expectedHarvestDate: string

  // Area
  hectaresPlanted: number

  // Yield Tracking
  expectedYieldTons: number
  actualYieldTons?: number

  // Status
  status: CropCycleStatus

  // Generated Services
  serviceEvents: string[] // ServiceEvent IDs

  // Contract Assignment
  contractId?: string

  // Audit
  createdAt: string
  updatedAt: string
}

export interface ServiceEvent {
  id: string
  cropCycleId: string
  farmerId: string
  corridorId: string
  seasonId: string

  // Service Details
  serviceType: ServiceType
  description: string

  // Scheduling
  plannedDateStart: string
  plannedDateEnd: string
  actualDate?: string
  scheduledDate?: string // Added for farmer request scheduling

  // Assignment
  assignedPartnerId?: string
  assignedPartnerName?: string

  // Execution
  status: ServiceEventStatus
  completedAt?: string
  completedBy?: string
  verifiedAt?: string
  verifiedBy?: string
  progress?: number // Added for tracking execution progress

  // Proof
  proofImageUrl?: string
  notes?: string

  // Cost Tracking (Critical for Unit Economics)
  estimatedCost: number
  actualCost?: number
  currency?: "NGN"

  // SLA Tracking
  slaWindowDays?: number
  isWithinSla?: boolean

  // Rating (farmer feedback) Added rating fields
  rating?: number
  ratingFeedback?: string

  // Audit
  createdAt: string
  updatedAt: string
}

// Service Template - Auto-generates services for crop cycles
export interface ServiceTemplate {
  id: string
  cropType: CropType
  services: {
    serviceType: ServiceType
    name: string
    description: string
    daysFromPlanting: number // Negative = before planting, Positive = after
    windowDays: number // SLA window
    estimatedCostPerHectare: number
    isRequired: boolean
  }[]
}

// =====================================================
// CONTRACT & FULFILMENT OBJECTS
// =====================================================

export interface OfftakeContract {
  id: string
  corridorId: string
  seasonId: string

  // Offtaker
  offtakerId: string
  offtakerName: string

  // Crop
  cropType: CropType
  variety?: string

  // Volume
  contractedVolumeTons: number
  deliveredVolumeTons: number
  remainingVolumeTons: number

  // Quality
  minimumGrade: QualityGrade
  qualityParameters: {
    moistureMax: number
    foreignMatterMax: number
    brokenGrainsMax: number
  }

  // Pricing
  pricePerTon: number
  currency: "NGN"
  totalContractValue: number

  // Timeline
  deliveryWindowStart: string
  deliveryWindowEnd: string

  // Farmer Assignments
  assignedFarmerIds: string[]
  assignedCropCycleIds: string[]

  // Status
  status: ContractStatus

  // Audit
  createdAt: string
  updatedAt: string
}

export interface Delivery {
  id: string
  contractId: string
  corridorId: string
  seasonId: string

  // Source
  farmerId: string
  farmerName: string
  cropCycleId: string

  // Volume
  quantityTons: number

  // Quality Assessment
  grade: QualityGrade
  moistureLevel: number
  foreignMatter: number

  // Logistics
  vehicleNumber?: string
  driverName?: string
  driverPhone?: string

  // Timeline
  dispatchedAt?: string
  receivedAt?: string

  // Status
  status: DeliveryStatus
  rejectionReason?: string

  // Audit
  createdAt: string
  updatedAt: string
}

// =====================================================
// YIELD & OUTCOME TRACKING
// =====================================================

export interface YieldOutcome {
  id: string
  cropCycleId: string
  farmerId: string
  corridorId: string
  seasonId: string

  // Expected vs Actual
  expectedYieldTons: number
  actualYieldTons: number
  variancePercent: number

  // Quality Distribution
  gradeAPercent: number
  gradeBPercent: number
  gradeCPercent: number
  rejectedPercent: number

  // Contributing Factors
  serviceCompletionRate: number
  slaAdherenceRate: number
  weatherImpact?: "positive" | "neutral" | "negative"
  pestImpact?: "none" | "minor" | "moderate" | "severe"

  // Audit
  recordedAt: string
  recordedBy: string
}

// =====================================================
// PAYMENT & SETTLEMENT OBJECTS
// =====================================================

export interface PaymentRecord {
  id: string
  farmerId: string
  corridorId: string
  seasonId: string
  cropCycleId?: string
  contractId?: string

  // Type
  type: "harvest_payment" | "service_deduction" | "bonus" | "penalty" | "advance"

  // Amount
  grossAmount: number
  deductions: {
    description: string
    amount: number
    serviceEventId?: string
  }[]
  netAmount: number
  currency: "NGN"

  // Status
  status: PaymentStatus
  processedAt?: string
  settledAt?: string

  // Reference
  transactionRef?: string
  bankReference?: string

  // Audit
  createdAt: string
  updatedAt: string
}

export interface FarmerSettlement {
  id: string
  farmerId: string
  corridorId: string
  seasonId: string
  cropCycleId: string

  // Revenue
  grossHarvestValue: number
  deliveredVolumeTons: number
  pricePerTon: number

  // Deductions
  totalServiceCosts: number
  serviceBreakdown: {
    serviceType: ServiceType
    amount: number
  }[]

  // Net
  netFarmerPayout: number

  // Status
  status: "pending" | "calculated" | "approved" | "disbursed"

  // Audit
  calculatedAt: string
  approvedAt?: string
  disbursedAt?: string
}

// =====================================================
// PARTNER OBJECTS
// =====================================================

export interface Partner {
  id: string
  corridorIds: string[]
  seasonId: string

  // Company Info
  companyName: string
  contactName: string
  phone: string
  email?: string

  // Type & Services
  partnerType: PartnerType
  servicesOffered: ServiceType[]

  // Coverage
  coverageAreas: string[] // LGAs

  // Capacity
  weeklyCapacityHectares: number
  currentUtilizationPercent: number

  // SLA
  slaTerms: {
    maxResponseHours: number
    completionGuaranteePercent: number
  }

  // Performance
  completedJobs: number
  averageRating: number
  slaAdherenceRate: number

  // Status
  status: PartnerStatus

  // Audit
  createdAt: string
  updatedAt: string
}

// =====================================================
// FIELD AGENT OBJECTS
// =====================================================

export interface FieldAgent {
  id: string
  corridorId: string
  stateCoordinatorId: string // Added supervisor linkage

  // Personal
  name: string
  phone: string
  email?: string

  // Assignment
  assignedClusterIds: string[]
  assignedFarmerIds: string[]

  assignedTerritory?: {
    lgas: string[]
    villages: string[]
    isExclusive: boolean
  }

  // Workload
  activeFarmerCount: number
  pendingTasks: number
  completedVisitsThisWeek: number

  // Performance
  onboardedFarmersCount: number
  verificationAccuracy: number
  averageVisitsPerDay: number

  recruitedFarmerIds: string[]
  totalHectaresActivated: number

  currentTier: "AGENT" | "SENIOR_AGENT" | "SUPER_AGENT" | "MASTER_AGENT" | "GRAND_MASTER_AGENT"
  qualityScore: number
  referredAgentIds: string[]
  referredByAgentId?: string

  // Status
  status: "active" | "inactive"

  // Audit
  createdAt: string
  updatedAt: string
}

export interface FarmVisit {
  id: string
  agentId: string
  farmerId: string
  landPlotId?: string
  corridorId: string
  seasonId: string

  // Visit Details
  visitType: "onboarding" | "verification" | "monitoring" | "service_check" | "harvest_assessment"
  scheduledDate: string
  actualDate?: string

  // Location
  gpsCoordinates?: { lat: number; lng: number }

  // Observations
  notes: string
  issues: string[]
  recommendations: string[]

  // Media
  photos: string[]

  // Status
  status: "scheduled" | "completed" | "cancelled" | "rescheduled"

  // Audit
  createdAt: string
  updatedAt: string
}

// =====================================================
// MANAGEMENT HIERARCHY OBJECTS
// =====================================================

export interface StateCoordinator {
  id: string
  name: string
  phone: string
  email: string
  state: string
  corridorIds: string[]
  regionId: string
  supervisorId: string // Regional Manager ID

  // Team Management
  assignedAgentIds: string[]

  // Performance
  totalFarmersUnderSupervision: number
  activeAgentsCount: number
  teamCompletionRate: number
  teamQualityScore: number

  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

export interface RegionalManager {
  id: string
  name: string
  phone: string
  email: string
  region: string // e.g., "North Central", "South West"
  states: string[]
  corridorIds: string[]

  // Team Management
  assignedCoordinatorIds: string[]

  // Performance
  totalFarmersInRegion: number
  totalAgentsInRegion: number
  totalCoordinatorsInRegion: number
  regionCompletionRate: number
  regionQualityScore: number

  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

// =====================================================
// ADVISORY & ALERTS
// =====================================================

export interface Advisory {
  id: string
  targetType: "farmer" | "corridor" | "cluster" | "all"
  targetId?: string

  // Content
  type: "reminder" | "alert" | "recommendation" | "warning"
  title: string
  message: string

  // Trigger
  triggerCondition: string // e.g., "service_due_in_3_days"

  // Delivery
  channels: ("sms" | "whatsapp" | "app")[]
  sentAt?: string

  // Status
  status: "pending" | "sent" | "acknowledged"

  // Audit
  createdAt: string
  expiresAt?: string
}

// =====================================================
// ANALYTICS & METRICS
// =====================================================

export interface CorridorMetrics {
  corridorId: string
  seasonId: string

  // Farmer Metrics
  totalFarmers: number
  activeFarmers: number
  totalHectares: number

  // Service Metrics
  totalServiceEvents: number
  completedServices: number
  slaAdherencePercent: number

  // Yield Metrics
  expectedYieldTons: number
  actualYieldTons: number
  yieldVariancePercent: number

  // Financial Metrics
  totalServiceCosts: number
  totalHarvestValue: number
  grossMargin: number
  marginPerHectare: number

  // Contract Metrics
  activeContracts: number
  contractedVolumeTons: number
  deliveredVolumeTons: number
  fulfilmentPercent: number

  // Updated
  calculatedAt: string
}

export interface AgentPerformanceMetrics {
  agentId: string
  periodType: "week" | "month" | "quarter"
  periodStart: string
  periodEnd: string

  // Recruitment
  farmersRecruited: number
  hectaresActivated: number

  // Targets
  farmerTarget: number
  hectareTarget: number

  // Progress
  farmerTargetProgress: number
  hectareTargetProgress: number

  // Commission
  baseRetainer: number
  volumeCommission: number
  tierBonus: number
  referralBonus: number
  totalEarnings: number

  // Ranking
  rank: number
  totalAgents: number

  calculatedAt: string
}

export interface AgentTargets {
  agentId: string
  periodType: "weekly" | "monthly" | "quarterly"
  startDate: string
  endDate: string

  farmerRecruitmentTarget: number
  hectareActivationTarget: number
  serviceCompletionTarget: number
  qualityScoreTarget: number

  status: "active" | "completed" | "missed"
  createdAt: string
  updatedAt: string
}

// =====================================================
// TASK & TASK REQUEST OBJECTS
// Tasks are ONLY created by Operations
// Field Agents submit Task Requests for Ops approval
// =====================================================

export type TaskStatus = "not_started" | "in_progress" | "blocked" | "completed" | "cancelled" | "paused"
export type TaskRequestStatus = "pending" | "approved" | "rejected"
export type TaskType =
  | "farmer_onboarding"
  | "yield_verification"
  | "service_inspection"
  | "data_collection"
  | "logistics"
  | "mechanization"
  | "inputs_delivery"

export interface Task {
  id: string
  corridorId: string
  seasonId: string

  // Task Details
  title: string
  description: string
  type: TaskType
  priority: "high" | "medium" | "low"

  // Related Entities
  farmerId?: string
  farmerName?: string
  landPlotId?: string

  // Assignment (Only Ops can create/assign)
  assignedToType: "field_agent" | "partner"
  assignedToId: string
  assignedToName: string

  // Timeline
  dueDate: string
  sla?: string

  // Execution Status
  status: TaskStatus
  completedAt?: string
  completedBy?: string

  // Evidence (required for completion)
  evidence?: {
    photos?: string[]
    notes?: string
    gpsLocation?: { lat: number; lng: number }
    timestamp?: string
  }

  // Approval Tracking
  createdBy: string // Always Ops user ID
  approvalTimestamp: string // When Ops approved/created this task

  // Link to original request (if created from TaskRequest)
  sourceRequestId?: string

  // Audit
  createdAt: string
  updatedAt: string
}

export interface TaskRequest {
  id: string
  corridorId: string
  seasonId: string

  // Submitting Agent
  agentId: string
  agentName: string

  // Related Farmer/Plot
  farmerId?: string
  farmerName: string
  landPlotId?: string

  // Request Details
  issueType: "land_prep" | "inputs" | "mechanization" | "logistics" | "inspection" | "other"
  urgency: "high" | "medium" | "low"
  description: string

  // Status (starts as pending)
  status: TaskRequestStatus

  // Approval/Rejection
  approvedAt?: string
  approvedBy?: string
  taskId?: string // ID of created Task if approved

  rejectedAt?: string
  rejectedBy?: string
  rejectionReason?: string

  // Audit
  submittedAt: string
  createdAt: string
  updatedAt: string
}

// NOTE: TaskRequests must NEVER appear in buyer dashboards
// Only approved Tasks with status from execution appear in buyer views

// =====================================================
// ASSISTED SUPPLY PRICE PROPOSAL OBJECTS
// Agents propose prices, Ops approves/adjusts/rejects
// Only Ops-approved prices flow into margin calculations
// Buyers NEVER see agent proposed prices
// =====================================================

export type PriceProposalStatus = "pending" | "approved" | "adjusted" | "rejected"

export interface AssistedSupplyDeclaration {
  id: string
  corridorId: string
  seasonId: string
  agentId: string
  agentName: string

  // Crop & Volume
  cropType: CropType
  volumeMin: number // MT
  volumeMax: number // MT
  availabilityStart: string
  availabilityEnd: string
  sourceType: "farmer_cluster" | "market_aggregation" | "mixed"
  notes?: string

  // Price Proposal (Agent submits)
  proposedPricePerTon: number | null // NGN
  proposedPricePerBag: number | null // NGN (optional)
  priceNotes?: string // Local market context, urgency, farmer constraints

  // Ops Price Review
  approvedPricePerTon: number | null // NGN (only set after Ops approval)
  priceReviewStatus: PriceProposalStatus
  priceReviewedAt?: string
  priceReviewedBy?: string
  priceAdjustmentReason?: string // Required if adjusted or rejected

  // Declaration Status
  status: "submitted" | "under_review" | "approved" | "declined" | "expired"

  // Audit
  submittedAt: string
  reviewedAt?: string
  createdAt: string
  updatedAt: string
}

export interface PriceProposalAuditLog {
  id: string
  declarationId: string
  corridorId: string
  seasonId: string

  // Who
  agentId: string
  agentName: string
  reviewedBy: string

  // What
  action: "submitted" | "approved" | "adjusted" | "rejected"
  proposedPricePerTon: number
  approvedPricePerTon?: number
  reason?: string

  // Context
  buyerTargetPrice?: number
  corridorMarginImpact?: number

  // When
  timestamp: string
}

// NOTE: Buyers NEVER see proposedPricePerTon or priceNotes
// Buyers ONLY see approved delivery terms after Ops approval
// This enforces: "Agents surface market reality. Ops enforces economic discipline."
