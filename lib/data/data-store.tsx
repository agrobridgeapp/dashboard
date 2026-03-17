"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type {
  Farmer,
  LandPlot,
  CropCycle,
  ServiceEvent,
  OfftakeContract,
  Partner,
  FieldAgent,
  Delivery,
  PaymentRecord,
  Advisory,
  FarmVisit,
  CorridorMetrics,
  Corridor,
  Season,
  ServiceEventStatus,
  FarmerStatus,
} from "./types"

// =====================================================
// SNAKE → CAMEL CONVERSION UTILITIES
// =====================================================

function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

function convertKeysToCamel(obj: any): any {
  if (Array.isArray(obj)) return obj.map(convertKeysToCamel)
  if (obj !== null && typeof obj === "object" && !(obj instanceof Date)) {
    return Object.keys(obj).reduce((acc, key) => {
      acc[snakeToCamel(key)] = convertKeysToCamel(obj[key])
      return acc
    }, {} as any)
  }
  return obj
}

// =====================================================
// ENTITY MAPPERS (backend snake_case → frontend camelCase)
// =====================================================

function mapFarmer(raw: any): Farmer {
  const c = convertKeysToCamel(raw)
  return {
    id: c.id,
    corridorId: c.corridorId || "",
    clusterId: c.clusterId || "",
    seasonId: c.seasonId || "",
    firstName: c.firstName || "",
    lastName: c.lastName || "",
    phone: c.phone || "",
    email: c.email,
    gender: c.gender || "male",
    dateOfBirth: c.dateOfBirth,
    state: c.state || "",
    lga: c.lga || "",
    village: c.village || "",
    bvn: c.bvn,
    idType: c.idType,
    idNumber: c.idNumber,
    bankName: c.bankName,
    accountNumber: c.accountNumber,
    farmingExperience: c.farmingExperience || "",
    assignedAgentId: c.assignedAgentId || "",
    recruitedByAgentId: c.recruitedByAgentId || "",
    status: c.status || "pending",
    verifiedAt: c.verifiedAt,
    verifiedBy: c.verifiedBy,
    createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: c.updatedAt ? new Date(c.updatedAt).toISOString() : new Date().toISOString(),
    createdBy: c.createdBy || "",
  }
}

function mapLandPlot(raw: any): LandPlot {
  const c = convertKeysToCamel(raw)
  return {
    id: c.id,
    farmerId: c.farmerId || "",
    corridorId: c.corridorId || "",
    seasonId: c.seasonId || "",
    village: c.village || "",
    sizeHectares: c.sizeHectares || 0,
    soilType: c.soilType,
    irrigationAccess: c.irrigationAccess || false,
    status: c.status || "pending_verification",
    verifiedAt: c.verifiedAt,
    verifiedBy: c.verifiedBy,
    createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: c.updatedAt ? new Date(c.updatedAt).toISOString() : new Date().toISOString(),
  }
}

function mapCropCycle(raw: any): CropCycle {
  const c = convertKeysToCamel(raw)
  return {
    id: c.id,
    farmerId: c.farmerId || "",
    landPlotId: c.landPlotId || "",
    corridorId: c.corridorId || "",
    seasonId: c.seasonId || "",
    cropType: c.cropType || "maize",
    variety: c.variety,
    plantingDate: c.plantingDate ? new Date(c.plantingDate).toISOString() : "",
    expectedHarvestDate: c.expectedHarvestDate ? new Date(c.expectedHarvestDate).toISOString() : "",
    hectaresPlanted: c.hectaresPlanted || 0,
    expectedYieldTons: c.expectedYieldTons || 0,
    actualYieldTons: c.actualYieldTons,
    status: c.status || "planned",
    serviceEvents: c.serviceEvents || [],
    contractId: c.contractId,
    createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: c.updatedAt ? new Date(c.updatedAt).toISOString() : new Date().toISOString(),
  }
}

function mapServiceEvent(raw: any): ServiceEvent {
  const c = convertKeysToCamel(raw)
  return {
    id: c.id,
    cropCycleId: c.cropCycleId || "",
    farmerId: c.farmerId || "",
    corridorId: c.corridorId || "",
    seasonId: c.seasonId || "",
    serviceType: c.serviceType || "land_prep",
    description: c.description || "",
    plannedDateStart: c.plannedDateStart ? new Date(c.plannedDateStart).toISOString() : "",
    plannedDateEnd: c.plannedDateEnd ? new Date(c.plannedDateEnd).toISOString() : "",
    actualDate: c.actualDate,
    scheduledDate: c.scheduledDate,
    assignedPartnerId: c.assignedPartnerId,
    assignedPartnerName: c.assignedPartnerName,
    status: c.status || "planned",
    completedAt: c.completedAt,
    completedBy: c.completedBy,
    verifiedAt: c.verifiedAt,
    verifiedBy: c.verifiedBy,
    progress: c.progress,
    proofImageUrl: c.proofImageUrl,
    notes: c.notes,
    estimatedCost: c.estimatedCost || 0,
    actualCost: c.actualCost,
    slaWindowDays: c.slaWindowDays,
    isWithinSla: c.isWithinSla,
    rating: c.rating,
    ratingFeedback: c.ratingFeedback,
    createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: c.updatedAt ? new Date(c.updatedAt).toISOString() : new Date().toISOString(),
  }
}

function mapContract(raw: any): OfftakeContract {
  const c = convertKeysToCamel(raw)
  return {
    id: c.id,
    corridorId: c.corridorId || "",
    seasonId: c.seasonId || "",
    offtakerId: c.offtakerId || "",
    offtakerName: c.offtakerName || "",
    cropType: c.cropType || "maize",
    variety: c.variety,
    contractedVolumeTons: c.contractedVolumeTons || c.targetVolumeTons || 0,
    deliveredVolumeTons: c.deliveredVolumeTons || 0,
    remainingVolumeTons: c.remainingVolumeTons || 0,
    minimumGrade: c.minimumGrade || c.minimumGrade || "A",
    qualityParameters: c.qualityParameters || { moistureMax: 0, foreignMatterMax: 0, brokenGrainsMax: 0 },
    pricePerTon: c.pricePerTon || 0,
    currency: "NGN",
    totalContractValue: c.totalContractValue || 0,
    deliveryWindowStart: c.deliveryWindowStart ? new Date(c.deliveryWindowStart).toISOString() : "",
    deliveryWindowEnd: c.deliveryWindowEnd ? new Date(c.deliveryWindowEnd).toISOString() : "",
    assignedFarmerIds: c.assignedFarmerIds || [],
    assignedCropCycleIds: c.assignedCropCycleIds || [],
    status: c.status || "draft",
    createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: c.updatedAt ? new Date(c.updatedAt).toISOString() : new Date().toISOString(),
  }
}

function mapDelivery(raw: any): Delivery {
  const c = convertKeysToCamel(raw)
  return {
    id: c.id,
    contractId: c.contractId || "",
    corridorId: c.corridorId || "",
    seasonId: c.seasonId || "",
    farmerId: c.farmerId || "",
    farmerName: c.farmerName || "",
    cropCycleId: c.cropCycleId || "",
    quantityTons: c.quantityTons || c.quantityKg ? (c.quantityKg || 0) / 1000 : 0,
    grade: c.grade || c.qualityGrade || "A",
    moistureLevel: c.moistureLevel || c.moistureContent || 0,
    foreignMatter: c.foreignMatter || 0,
    vehicleNumber: c.vehicleNumber,
    driverName: c.driverName,
    driverPhone: c.driverPhone,
    dispatchedAt: c.dispatchedAt,
    receivedAt: c.receivedAt,
    status: c.status || "pending",
    rejectionReason: c.rejectionReason,
    createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: c.updatedAt ? new Date(c.updatedAt).toISOString() : new Date().toISOString(),
  }
}

function mapPartner(raw: any): Partner {
  const c = convertKeysToCamel(raw)
  return {
    id: c.id,
    corridorIds: c.corridorIds || (c.corridorId ? [c.corridorId] : []),
    seasonId: c.seasonId || "",
    companyName: c.companyName || "",
    contactName: c.contactName || "",
    phone: c.phone || "",
    email: c.email,
    partnerType: c.partnerType || "input_supplier",
    servicesOffered: c.servicesOffered || c.services || [],
    coverageAreas: c.coverageAreas || c.regions || [],
    weeklyCapacityHectares: c.weeklyCapacityHectares || 0,
    currentUtilizationPercent: c.currentUtilizationPercent || 0,
    slaTerms: c.slaTerms || { maxResponseHours: 24, completionGuaranteePercent: 95 },
    completedJobs: c.completedJobs || 0,
    averageRating: c.averageRating || 0,
    slaAdherenceRate: c.slaAdherenceRate || 0,
    status: c.status || "pending",
    createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: c.updatedAt ? new Date(c.updatedAt).toISOString() : new Date().toISOString(),
  }
}

function mapFieldAgent(raw: any): FieldAgent {
  const c = convertKeysToCamel(raw)
  const firstName = c.firstName || ""
  const lastName = c.lastName || ""
  return {
    id: c.id,
    corridorId: c.corridorId || "",
    stateCoordinatorId: c.stateCoordinatorId || "",
    name: c.name || `${firstName} ${lastName}`.trim(),
    phone: c.phone || "",
    email: c.email,
    assignedClusterIds: c.assignedClusterIds || [],
    assignedFarmerIds: c.assignedFarmerIds || [],
    activeFarmerCount: c.activeFarmerCount || 0,
    pendingTasks: c.pendingTasks || 0,
    completedVisitsThisWeek: c.completedVisitsThisWeek || 0,
    onboardedFarmersCount: c.onboardedFarmersCount || 0,
    verificationAccuracy: c.verificationAccuracy || 0,
    averageVisitsPerDay: c.averageVisitsPerDay || 0,
    recruitedFarmerIds: c.recruitedFarmerIds || [],
    totalHectaresActivated: c.totalHectaresActivated || 0,
    currentTier: c.currentTier || "AGENT",
    qualityScore: c.qualityScore || 0,
    referredAgentIds: c.referredAgentIds || [],
    referredByAgentId: c.referredByAgentId,
    status: c.status === "approved" || c.status === "active" ? "active" : "inactive",
    createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: c.updatedAt ? new Date(c.updatedAt).toISOString() : new Date().toISOString(),
  }
}

function mapPayment(raw: any): PaymentRecord {
  const c = convertKeysToCamel(raw)
  return {
    id: c.id,
    farmerId: c.farmerId || "",
    corridorId: c.corridorId || "",
    seasonId: c.seasonId || "",
    cropCycleId: c.cropCycleId,
    contractId: c.contractId,
    type: c.type || "harvest_payment",
    grossAmount: c.grossAmount || c.amount || 0,
    deductions: c.deductions || [],
    netAmount: c.netAmount || c.amount || 0,
    currency: "NGN",
    status: c.status || "pending",
    processedAt: c.processedAt,
    settledAt: c.settledAt,
    transactionRef: c.transactionRef,
    bankReference: c.bankReference,
    createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: c.updatedAt ? new Date(c.updatedAt).toISOString() : new Date().toISOString(),
  }
}

function mapCorridor(raw: any): Corridor {
  const c = convertKeysToCamel(raw)
  return {
    id: c.id,
    name: c.name || "",
    state: c.state || "",
    lgas: c.lgas || [],
    clusters: c.clusters || [],
    seasonId: c.seasonId || "",
    status: c.status || "active",
    createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: c.updatedAt ? new Date(c.updatedAt).toISOString() : new Date().toISOString(),
  }
}

function mapSeason(raw: any): Season {
  const c = convertKeysToCamel(raw)
  return {
    id: c.id,
    name: c.name || "",
    startDate: c.startDate ? new Date(c.startDate).toISOString() : "",
    endDate: c.endDate ? new Date(c.endDate).toISOString() : "",
    status: c.status || "active",
    corridorIds: c.corridorIds || c.corridors || [],
  }
}

// =====================================================
// DATA FETCHER
// =====================================================

async function fetchJson<T>(url: string): Promise<T[]> {
  try {
    const res = await fetch(url)
    if (!res.ok) return []
    const json = await res.json()
    const data = json.data || json.farmers || json.agents || json.contracts || []
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

// =====================================================
// CONTEXT TYPE
// =====================================================

interface DataStoreContextType {
  isLoading: boolean

  // Core Data
  corridor: Corridor
  season: Season
  metrics: CorridorMetrics
  corridors: Corridor[]

  // Entities
  farmers: Farmer[]
  landPlots: LandPlot[]
  cropCycles: CropCycle[]
  serviceEvents: ServiceEvent[]
  contracts: OfftakeContract[]
  partners: Partner[]
  fieldAgents: FieldAgent[]
  deliveries: Delivery[]
  payments: PaymentRecord[]
  advisories: Advisory[]
  farmVisits: FarmVisit[]

  // Farmer Operations
  addFarmer: (farmer: Omit<Farmer, "id" | "createdAt" | "updatedAt">) => Farmer
  updateFarmerStatus: (farmerId: string, status: FarmerStatus) => void
  updateFarmer: (farmerId: string, updates: Partial<Farmer>) => void
  getFarmerById: (id: string) => Farmer | undefined
  getFarmersByCluster: (clusterId: string) => Farmer[]
  getFarmersByAgent: (agentId: string) => Farmer[]

  // Land Plot Operations
  addLandPlot: (plot: Omit<LandPlot, "id" | "createdAt" | "updatedAt">) => LandPlot
  getLandPlotsByFarmer: (farmerId: string) => LandPlot[]

  // Crop Cycle Operations
  addCropCycle: (cycle: Omit<CropCycle, "id" | "createdAt" | "updatedAt" | "serviceEvents">) => CropCycle
  getCropCyclesByFarmer: (farmerId: string) => CropCycle[]
  getCropCyclesByContract: (contractId: string) => CropCycle[]

  // Service Event Operations
  addServiceEvent: (event: Omit<ServiceEvent, "id" | "createdAt" | "updatedAt">) => ServiceEvent
  updateServiceStatus: (eventId: string, status: ServiceEventStatus, data?: Partial<ServiceEvent>) => void
  assignPartnerToService: (eventId: string, partnerId: string, partnerName: string) => void
  getServicesByFarmer: (farmerId: string) => ServiceEvent[]
  getServicesByCropCycle: (cycleId: string) => ServiceEvent[]
  getPendingServices: () => ServiceEvent[]
  getOverdueServices: () => ServiceEvent[]

  // Contract Operations
  addContract: (contract: Omit<OfftakeContract, "id" | "createdAt" | "updatedAt">) => OfftakeContract
  assignFarmersToContract: (contractId: string, farmerIds: string[], cycleIds: string[]) => void
  getContractsByOfftaker: (offtakerId: string) => OfftakeContract[]

  // Delivery Operations
  addDelivery: (delivery: Omit<Delivery, "id" | "createdAt" | "updatedAt">) => Delivery
  updateDeliveryStatus: (deliveryId: string, status: Delivery["status"], data?: Partial<Delivery>) => void
  getDeliveriesByContract: (contractId: string) => Delivery[]
  getDeliveriesByFarmer: (farmerId: string) => Delivery[]

  // Partner Operations
  getPartnerById: (id: string) => Partner | undefined
  getPartnersByServiceType: (serviceType: ServiceEvent["serviceType"]) => Partner[]

  // Agent Operations
  getAgentById: (id: string) => FieldAgent | undefined

  // Farm Visit Operations
  addFarmVisit: (visit: Omit<FarmVisit, "id" | "createdAt" | "updatedAt">) => FarmVisit
  updateFarmVisit: (visitId: string, data: Partial<FarmVisit>) => void
  getVisitsByAgent: (agentId: string) => FarmVisit[]
  getVisitsByFarmer: (farmerId: string) => FarmVisit[]

  // Advisory Operations
  addAdvisory: (advisory: Omit<Advisory, "id" | "createdAt">) => Advisory

  // Analytics
  refreshMetrics: () => void
}

// =====================================================
// DEFAULTS
// =====================================================

const DEFAULT_CORRIDOR: Corridor = {
  id: "", name: "", state: "", lgas: [], clusters: [], seasonId: "", status: "active", createdAt: "", updatedAt: "",
}

const DEFAULT_SEASON: Season = {
  id: "", name: "", startDate: "", endDate: "", status: "active", corridorIds: [],
}

const DEFAULT_METRICS: CorridorMetrics = {
  corridorId: "", seasonId: "", totalFarmers: 0, activeFarmers: 0, totalHectares: 0,
  totalServiceEvents: 0, completedServices: 0, slaAdherencePercent: 0,
  expectedYieldTons: 0, actualYieldTons: 0, yieldVariancePercent: 0,
  totalServiceCosts: 0, totalHarvestValue: 0, grossMargin: 0, marginPerHectare: 0,
  activeContracts: 0, contractedVolumeTons: 0, deliveredVolumeTons: 0, fulfilmentPercent: 0,
  calculatedAt: "",
}

const DataStoreContext = createContext<DataStoreContextType>({
  isLoading: true,
  corridor: DEFAULT_CORRIDOR, season: DEFAULT_SEASON, metrics: DEFAULT_METRICS, corridors: [],
  farmers: [], landPlots: [], cropCycles: [], serviceEvents: [], contracts: [],
  partners: [], fieldAgents: [], deliveries: [], payments: [], advisories: [], farmVisits: [],
  addFarmer: () => ({ id: "", corridorId: "", clusterId: "", seasonId: "", firstName: "", lastName: "", phone: "", gender: "male", state: "", lga: "", village: "", farmingExperience: "", assignedAgentId: "", recruitedByAgentId: "", status: "pending", createdAt: "", updatedAt: "", createdBy: "" }),
  updateFarmerStatus: () => {}, updateFarmer: () => {}, getFarmerById: () => undefined,
  getFarmersByCluster: () => [], getFarmersByAgent: () => [],
  addLandPlot: () => ({ id: "", farmerId: "", corridorId: "", seasonId: "", village: "", sizeHectares: 0, irrigationAccess: false, status: "pending_verification", createdAt: "", updatedAt: "" }),
  getLandPlotsByFarmer: () => [],
  addCropCycle: () => ({ id: "", farmerId: "", landPlotId: "", corridorId: "", seasonId: "", cropType: "maize", plantingDate: "", expectedHarvestDate: "", hectaresPlanted: 0, expectedYieldTons: 0, status: "planned", serviceEvents: [], createdAt: "", updatedAt: "" }),
  getCropCyclesByFarmer: () => [], getCropCyclesByContract: () => [],
  addServiceEvent: () => ({ id: "", cropCycleId: "", farmerId: "", corridorId: "", seasonId: "", serviceType: "land_prep", description: "", plannedDateStart: "", plannedDateEnd: "", status: "planned", estimatedCost: 0, createdAt: "", updatedAt: "" }),
  updateServiceStatus: () => {}, assignPartnerToService: () => {},
  getServicesByFarmer: () => [], getServicesByCropCycle: () => [],
  getPendingServices: () => [], getOverdueServices: () => [],
  addContract: () => ({ id: "", corridorId: "", seasonId: "", offtakerId: "", offtakerName: "", cropType: "maize", contractedVolumeTons: 0, deliveredVolumeTons: 0, remainingVolumeTons: 0, minimumGrade: "A", qualityParameters: { moistureMax: 0, foreignMatterMax: 0, brokenGrainsMax: 0 }, pricePerTon: 0, currency: "NGN", totalContractValue: 0, deliveryWindowStart: "", deliveryWindowEnd: "", assignedFarmerIds: [], assignedCropCycleIds: [], status: "draft", createdAt: "", updatedAt: "" }),
  assignFarmersToContract: () => {}, getContractsByOfftaker: () => [],
  addDelivery: () => ({ id: "", contractId: "", corridorId: "", seasonId: "", farmerId: "", farmerName: "", cropCycleId: "", quantityTons: 0, grade: "A", moistureLevel: 0, foreignMatter: 0, status: "pending", createdAt: "", updatedAt: "" }),
  updateDeliveryStatus: () => {}, getDeliveriesByContract: () => [], getDeliveriesByFarmer: () => [],
  getPartnerById: () => undefined, getPartnersByServiceType: () => [],
  getAgentById: () => undefined,
  addFarmVisit: () => ({ id: "", agentId: "", farmerId: "", corridorId: "", seasonId: "", visitType: "routine" as any, scheduledDate: "", notes: "", issues: [], recommendations: [], photos: [], status: "scheduled", createdAt: "", updatedAt: "" }),
  updateFarmVisit: () => {}, getVisitsByAgent: () => [], getVisitsByFarmer: () => [],
  addAdvisory: () => ({ id: "", targetType: "all", type: "reminder", title: "", message: "", triggerCondition: "", channels: [], status: "pending", createdAt: "" }),
  refreshMetrics: () => {},
})

// =====================================================
// PROVIDER
// =====================================================

export function DataStoreProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [farmers, setFarmers] = useState<Farmer[]>([])
  const [landPlots, setLandPlots] = useState<LandPlot[]>([])
  const [cropCycles, setCropCycles] = useState<CropCycle[]>([])
  const [serviceEvents, setServiceEvents] = useState<ServiceEvent[]>([])
  const [contracts, setContracts] = useState<OfftakeContract[]>([])
  const [partners, setPartners] = useState<Partner[]>([])
  const [fieldAgents, setFieldAgents] = useState<FieldAgent[]>([])
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [advisories] = useState<Advisory[]>([])
  const [farmVisits, setFarmVisits] = useState<FarmVisit[]>([])
  const [corridors, setCorridors] = useState<Corridor[]>([])
  const [seasons, setSeasons] = useState<Season[]>([])
  const [metrics, setMetrics] = useState<CorridorMetrics>(DEFAULT_METRICS)

  // Load all data from backend APIs on mount
  useEffect(() => {
    async function loadAll() {
      try {
        const [
          farmersRes, landPlotsRes, cropCyclesRes, serviceEventsRes,
          contractsRes, partnersRes, agentsRes, deliveriesRes,
          paymentsRes, corridorsRes, seasonsRes,
        ] = await Promise.allSettled([
          fetch("/api/farmers").then((r) => r.json()),
          fetch("/api/land-plots").then((r) => r.json()),
          fetch("/api/crop-cycles").then((r) => r.json()),
          fetch("/api/service-events").then((r) => r.json()),
          fetch("/api/contracts").then((r) => r.json()),
          fetch("/api/partners").then((r) => r.json()),
          fetch("/api/agents").then((r) => r.json()),
          fetch("/api/deliveries").then((r) => r.json()),
          fetch("/api/payments").then((r) => r.json()),
          fetch("/api/corridors").then((r) => r.json()),
          fetch("/api/seasons").then((r) => r.json()),
        ])

        const safe = (result: PromiseSettledResult<any>, key = "data"): any[] => {
          if (result.status === "fulfilled" && result.value?.success !== false) {
            const val = result.value
            if (Array.isArray(val)) return val
            const extracted = val[key] || val.data || val.farmers || val.agents || val.contracts
            return Array.isArray(extracted) ? extracted : []
          }
          return []
        }

        setFarmers(safe(farmersRes).map(mapFarmer))
        setLandPlots(safe(landPlotsRes).map(mapLandPlot))
        setCropCycles(safe(cropCyclesRes).map(mapCropCycle))
        setServiceEvents(safe(serviceEventsRes).map(mapServiceEvent))
        setContracts(safe(contractsRes).map(mapContract))
        setPartners(safe(partnersRes).map(mapPartner))
        setFieldAgents(safe(agentsRes).map(mapFieldAgent))
        setDeliveries(safe(deliveriesRes).map(mapDelivery))
        setPayments(safe(paymentsRes).map(mapPayment))

        const mappedCorridors = safe(corridorsRes).map(mapCorridor)
        setCorridors(mappedCorridors)

        const mappedSeasons = safe(seasonsRes).map(mapSeason)
        setSeasons(mappedSeasons)

        // Build metrics from admin stats if available
        try {
          const statsRes = await fetch("/api/admin/stats")
          if (statsRes.ok) {
            const statsJson = await statsRes.json()
            const s = statsJson.data || statsJson
            setMetrics((prev) => ({
              ...prev,
              totalFarmers: s.totalFarmers ?? prev.totalFarmers,
              activeFarmers: s.activeFarmers ?? prev.activeFarmers,
              totalHectares: s.totalHectares ?? prev.totalHectares,
              totalServiceEvents: s.totalServiceEvents ?? prev.totalServiceEvents,
              completedServices: s.completedServices ?? prev.completedServices,
              activeContracts: s.activeContracts ?? prev.activeContracts,
              deliveredVolumeTons: s.deliveredVolumeTons ?? prev.deliveredVolumeTons,
              calculatedAt: new Date().toISOString(),
            }))
          }
        } catch {
          // metrics remain at defaults
        }
      } catch (err) {
        console.error("[DataStore] Failed to load data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadAll()
  }, [])

  // =====================================================
  // MUTATIONS (optimistic + API call)
  // =====================================================

  const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  const addFarmer = useCallback((farmerData: Omit<Farmer, "id" | "createdAt" | "updatedAt">): Farmer => {
    const tempId = generateId("farmer")
    const now = new Date().toISOString()
    const newFarmer: Farmer = { ...farmerData, id: tempId, createdAt: now, updatedAt: now }
    setFarmers((prev) => [...prev, newFarmer])
    fetch("/api/farmers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(farmerData),
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data) {
          const real = mapFarmer(json.data)
          setFarmers((prev) => prev.map((f) => (f.id === tempId ? real : f)))
        }
      })
      .catch(() => setFarmers((prev) => prev.filter((f) => f.id !== tempId)))
    return newFarmer
  }, [])

  const updateFarmerStatus = useCallback((farmerId: string, status: FarmerStatus) => {
    setFarmers((prev) =>
      prev.map((f) => (f.id === farmerId ? { ...f, status, updatedAt: new Date().toISOString() } : f)),
    )
    fetch(`/api/farmers/${farmerId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).catch(console.error)
  }, [])

  const updateFarmer = useCallback((farmerId: string, updates: Partial<Farmer>) => {
    setFarmers((prev) =>
      prev.map((f) => (f.id === farmerId ? { ...f, ...updates, updatedAt: new Date().toISOString() } : f)),
    )
    fetch(`/api/farmers/${farmerId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    }).catch(console.error)
  }, [])

  const getFarmerById = useCallback((id: string) => farmers.find((f) => f.id === id), [farmers])
  const getFarmersByCluster = useCallback((clusterId: string) => farmers.filter((f) => f.clusterId === clusterId), [farmers])
  const getFarmersByAgent = useCallback((agentId: string) => farmers.filter((f) => f.assignedAgentId === agentId), [farmers])

  const addLandPlot = useCallback((plotData: Omit<LandPlot, "id" | "createdAt" | "updatedAt">): LandPlot => {
    const tempId = generateId("plot")
    const now = new Date().toISOString()
    const newPlot: LandPlot = { ...plotData, id: tempId, createdAt: now, updatedAt: now }
    setLandPlots((prev) => [...prev, newPlot])
    fetch("/api/land-plots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(plotData),
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data) {
          const real = mapLandPlot(json.data)
          setLandPlots((prev) => prev.map((p) => (p.id === tempId ? real : p)))
        }
      })
      .catch(() => setLandPlots((prev) => prev.filter((p) => p.id !== tempId)))
    return newPlot
  }, [])

  const getLandPlotsByFarmer = useCallback((farmerId: string) => landPlots.filter((p) => p.farmerId === farmerId), [landPlots])

  const addCropCycle = useCallback(
    (cycleData: Omit<CropCycle, "id" | "createdAt" | "updatedAt" | "serviceEvents">): CropCycle => {
      const tempId = generateId("cycle")
      const now = new Date().toISOString()
      const newCycle: CropCycle = { ...cycleData, id: tempId, serviceEvents: [], createdAt: now, updatedAt: now }
      setCropCycles((prev) => [...prev, newCycle])
      fetch("/api/crop-cycles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cycleData),
      })
        .then((r) => r.json())
        .then((json) => {
          if (json.success && json.data) {
            const real = mapCropCycle(json.data)
            setCropCycles((prev) => prev.map((c) => (c.id === tempId ? real : c)))
          }
        })
        .catch(() => setCropCycles((prev) => prev.filter((c) => c.id !== tempId)))
      return newCycle
    },
    [],
  )

  const getCropCyclesByFarmer = useCallback((farmerId: string) => cropCycles.filter((c) => c.farmerId === farmerId), [cropCycles])
  const getCropCyclesByContract = useCallback((contractId: string) => cropCycles.filter((c) => c.contractId === contractId), [cropCycles])

  const addServiceEvent = useCallback(
    (eventData: Omit<ServiceEvent, "id" | "createdAt" | "updatedAt">): ServiceEvent => {
      const tempId = generateId("svc")
      const now = new Date().toISOString()
      const newEvent: ServiceEvent = { ...eventData, id: tempId, createdAt: now, updatedAt: now }
      setServiceEvents((prev) => [...prev, newEvent])
      fetch("/api/service-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      })
        .then((r) => r.json())
        .then((json) => {
          if (json.success && json.data) {
            const real = mapServiceEvent(json.data)
            setServiceEvents((prev) => prev.map((e) => (e.id === tempId ? real : e)))
          }
        })
        .catch(() => setServiceEvents((prev) => prev.filter((e) => e.id !== tempId)))
      return newEvent
    },
    [],
  )

  const updateServiceStatus = useCallback(
    (eventId: string, status: ServiceEventStatus, data?: Partial<ServiceEvent>) => {
      setServiceEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, ...data, status, updatedAt: new Date().toISOString() } : e)),
      )
      fetch(`/api/service-events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, ...data }),
      }).catch(console.error)
    },
    [],
  )

  const assignPartnerToService = useCallback((eventId: string, partnerId: string, partnerName: string) => {
    setServiceEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? { ...e, assignedPartnerId: partnerId, assignedPartnerName: partnerName, status: "scheduled" as const, updatedAt: new Date().toISOString() }
          : e,
      ),
    )
    fetch(`/api/service-events/${eventId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assigned_partner_id: partnerId, assigned_partner_name: partnerName, status: "scheduled" }),
    }).catch(console.error)
  }, [])

  const getServicesByFarmer = useCallback((farmerId: string) => serviceEvents.filter((s) => s.farmerId === farmerId), [serviceEvents])
  const getServicesByCropCycle = useCallback((cycleId: string) => serviceEvents.filter((s) => s.cropCycleId === cycleId), [serviceEvents])
  const getPendingServices = useCallback(() => serviceEvents.filter((s) => ["planned", "scheduled"].includes(s.status)), [serviceEvents])
  const getOverdueServices = useCallback(() => {
    const today = new Date()
    return serviceEvents.filter((s) => {
      if (["completed", "verified", "cancelled"].includes(s.status)) return false
      return s.plannedDateEnd ? new Date(s.plannedDateEnd) < today : false
    })
  }, [serviceEvents])

  const addContract = useCallback(
    (contractData: Omit<OfftakeContract, "id" | "createdAt" | "updatedAt">): OfftakeContract => {
      const tempId = generateId("contract")
      const now = new Date().toISOString()
      const newContract: OfftakeContract = { ...contractData, id: tempId, createdAt: now, updatedAt: now }
      setContracts((prev) => [...prev, newContract])
      fetch("/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contractData),
      })
        .then((r) => r.json())
        .then((json) => {
          if (json.success && json.data) {
            const real = mapContract(json.data)
            setContracts((prev) => prev.map((c) => (c.id === tempId ? real : c)))
          }
        })
        .catch(() => setContracts((prev) => prev.filter((c) => c.id !== tempId)))
      return newContract
    },
    [],
  )

  const assignFarmersToContract = useCallback((contractId: string, farmerIds: string[], cycleIds: string[]) => {
    setContracts((prev) =>
      prev.map((c) =>
        c.id === contractId
          ? { ...c, assignedFarmerIds: [...c.assignedFarmerIds, ...farmerIds], assignedCropCycleIds: [...c.assignedCropCycleIds, ...cycleIds], updatedAt: new Date().toISOString() }
          : c,
      ),
    )
    fetch(`/api/contracts/${contractId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ farmer_ids: farmerIds, crop_cycle_ids: cycleIds }),
    }).catch(console.error)
  }, [])

  const getContractsByOfftaker = useCallback((offtakerId: string) => contracts.filter((c) => c.offtakerId === offtakerId), [contracts])

  const addDelivery = useCallback((deliveryData: Omit<Delivery, "id" | "createdAt" | "updatedAt">): Delivery => {
    const tempId = generateId("delivery")
    const now = new Date().toISOString()
    const newDelivery: Delivery = { ...deliveryData, id: tempId, createdAt: now, updatedAt: now }
    setDeliveries((prev) => [...prev, newDelivery])
    setContracts((prev) =>
      prev.map((c) =>
        c.id === deliveryData.contractId
          ? { ...c, deliveredVolumeTons: c.deliveredVolumeTons + deliveryData.quantityTons, remainingVolumeTons: c.remainingVolumeTons - deliveryData.quantityTons, updatedAt: now }
          : c,
      ),
    )
    fetch("/api/deliveries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(deliveryData),
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data) {
          const real = mapDelivery(json.data)
          setDeliveries((prev) => prev.map((d) => (d.id === tempId ? real : d)))
        }
      })
      .catch(() => setDeliveries((prev) => prev.filter((d) => d.id !== tempId)))
    return newDelivery
  }, [])

  const updateDeliveryStatus = useCallback(
    (deliveryId: string, status: Delivery["status"], data?: Partial<Delivery>) => {
      setDeliveries((prev) =>
        prev.map((d) => (d.id === deliveryId ? { ...d, ...data, status, updatedAt: new Date().toISOString() } : d)),
      )
      fetch(`/api/deliveries/${deliveryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, ...data }),
      }).catch(console.error)
    },
    [],
  )

  const getDeliveriesByContract = useCallback((contractId: string) => deliveries.filter((d) => d.contractId === contractId), [deliveries])
  const getDeliveriesByFarmer = useCallback((farmerId: string) => deliveries.filter((d) => d.farmerId === farmerId), [deliveries])

  const getPartnerById = useCallback((id: string) => partners.find((p) => p.id === id), [partners])
  const getPartnersByServiceType = useCallback(
    (serviceType: ServiceEvent["serviceType"]) => partners.filter((p) => p.servicesOffered.includes(serviceType)),
    [partners],
  )

  const getAgentById = useCallback((id: string) => fieldAgents.find((a) => a.id === id), [fieldAgents])

  const addFarmVisit = useCallback((visitData: Omit<FarmVisit, "id" | "createdAt" | "updatedAt">): FarmVisit => {
    const newVisit: FarmVisit = {
      ...visitData,
      id: generateId("visit"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setFarmVisits((prev) => [...prev, newVisit])
    return newVisit
  }, [])

  const updateFarmVisit = useCallback((visitId: string, data: Partial<FarmVisit>) => {
    setFarmVisits((prev) =>
      prev.map((v) => (v.id === visitId ? { ...v, ...data, updatedAt: new Date().toISOString() } : v)),
    )
  }, [])

  const getVisitsByAgent = useCallback((agentId: string) => farmVisits.filter((v) => v.agentId === agentId), [farmVisits])
  const getVisitsByFarmer = useCallback((farmerId: string) => farmVisits.filter((v) => v.farmerId === farmerId), [farmVisits])

  const addAdvisory = useCallback((advisoryData: Omit<Advisory, "id" | "createdAt">): Advisory => {
    return {
      ...advisoryData,
      id: generateId("advisory"),
      createdAt: new Date().toISOString(),
    }
  }, [])

  const refreshMetrics = useCallback(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((json) => {
        const s = json.data || json
        setMetrics((prev) => ({
          ...prev,
          totalFarmers: s.totalFarmers ?? prev.totalFarmers,
          activeFarmers: s.activeFarmers ?? prev.activeFarmers,
          totalHectares: s.totalHectares ?? prev.totalHectares,
          calculatedAt: new Date().toISOString(),
        }))
      })
      .catch(console.error)
  }, [])

  // Derive current corridor and season from loaded data
  const corridor = corridors[0] ?? DEFAULT_CORRIDOR
  const season = seasons.find((s) => s.status === "active") ?? seasons[0] ?? DEFAULT_SEASON

  const value: DataStoreContextType = {
    isLoading,
    corridor,
    season,
    metrics,
    corridors,
    farmers,
    landPlots,
    cropCycles,
    serviceEvents,
    contracts,
    partners,
    fieldAgents,
    deliveries,
    payments,
    advisories,
    farmVisits,
    addFarmer,
    updateFarmerStatus,
    updateFarmer,
    getFarmerById,
    getFarmersByCluster,
    getFarmersByAgent,
    addLandPlot,
    getLandPlotsByFarmer,
    addCropCycle,
    getCropCyclesByFarmer,
    getCropCyclesByContract,
    addServiceEvent,
    updateServiceStatus,
    assignPartnerToService,
    getServicesByFarmer,
    getServicesByCropCycle,
    getPendingServices,
    getOverdueServices,
    addContract,
    assignFarmersToContract,
    getContractsByOfftaker,
    addDelivery,
    updateDeliveryStatus,
    getDeliveriesByContract,
    getDeliveriesByFarmer,
    getPartnerById,
    getPartnersByServiceType,
    getAgentById,
    addFarmVisit,
    updateFarmVisit,
    getVisitsByAgent,
    getVisitsByFarmer,
    addAdvisory,
    refreshMetrics,
  }

  return <DataStoreContext.Provider value={value}>{children}</DataStoreContext.Provider>
}

export function useDataStore() {
  return useContext(DataStoreContext)
}
