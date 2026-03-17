// AgroBridge Platform Scenario Management
// Handles all edge cases and failure scenarios from the comprehensive test matrix

export interface FarmerIdentity {
  id: string
  name: string
  alternateNames?: string[] // Handle spelling inconsistencies
  phoneNumbers: string[] // Multiple contact numbers
  hasFormID: boolean
  verificationMethod: "id" | "community" | "agent" | "biometric"
  verificationStatus: "verified" | "pending" | "unverified"
  verifiedBy?: string
  verificationDate?: string
}

export interface LandPlot {
  id: string
  farmerId: string
  plotNumber: number
  size: number // hectares
  location: { lat?: number; lng?: number; description: string }
  ownership: "owned" | "rented" | "family" | "communal"
  ownershipProof?: string
  boundaries?: string
  isContiguous: boolean
  adjacentPlots?: string[]
}

export interface CropCycle {
  id: string
  farmerId: string
  plotId: string
  corridorId: string
  season: string
  crop: string
  plantingDate: string
  expectedHarvestDate: string
  actualHarvestDate?: string
  status: "planned" | "planted" | "growing" | "harvested" | "failed"
  expectedYield: number // kg
  actualYield?: number // kg
  yieldVariance?: number // percentage
  failureReason?: string
  services: ServiceExecution[]
}

export interface ServiceExecution {
  id: string
  cropCycleId: string
  serviceType: string
  partnerId: string
  scheduledDate: string
  actualDate?: string
  status: "scheduled" | "in-progress" | "completed" | "delayed" | "failed" | "cancelled"
  delayReason?: string
  failureReason?: string
  cost: number
  qualityScore?: number
  agentVerified: boolean
  verifiedBy?: string
  verificationDate?: string
  corrections?: ServiceCorrection[]
}

export interface ServiceCorrection {
  id: string
  correctedBy: string
  correctionDate: string
  reason: string
  originalData: any
  correctedData: any
  approved: boolean
  approvedBy?: string
}

export interface ContractStatus {
  id: string
  offtakerId: string
  corridorId: string
  crop: string
  expectedVolume: number // kg
  committedVolume: number
  deliveredVolume: number
  status: "active" | "at-risk" | "breached" | "fulfilled" | "cancelled"
  deliverySchedule: ContractDelivery[]
  shortfallReason?: string
  riskFactors: string[]
}

export interface ContractDelivery {
  id: string
  contractId: string
  scheduledDate: string
  actualDate?: string
  expectedQuantity: number
  actualQuantity?: number
  quality?: "passed" | "failed" | "pending"
  qualityIssues?: string[]
  status: "scheduled" | "delivered" | "partial" | "rejected" | "delayed"
}

export interface CorridorHealth {
  corridorId: string
  season: string
  status: "active" | "at-risk" | "paused" | "critical"
  riskLevel: "low" | "medium" | "high" | "critical"
  execution: {
    servicesOnTime: number
    servicesDelayed: number
    servicesFailed: number
    slaAdherence: number // percentage
  }
  yield: {
    expectedTotal: number
    projectedActual: number
    variancePercentage: number
    farmersUnderperforming: number
    farmersOverperforming: number
    totalCropFailures: number
  }
  contracts: {
    totalActive: number
    atRisk: number
    projectedShortfall: number
  }
  operations: {
    activeAgents: number
    agentsNeedingAttention: number
    activeFarmers: number
    inactiveFarmers: number
  }
  pauseReason?: string
  recoveryPlan?: string
}

export interface PaymentSettlement {
  id: string
  farmerId: string
  contractId: string
  cropCycleId: string
  grossRevenue: number
  serviceDeductions: ServiceDeduction[]
  totalDeductions: number
  netPayment: number
  status: "pending" | "calculated" | "disputed" | "paid"
  disputeReason?: string
  disputeResolution?: string
  paymentDate?: string
  isNegative: boolean // Costs exceeded revenue
}

export interface ServiceDeduction {
  serviceId: string
  serviceName: string
  cost: number
  disputed: boolean
  disputeReason?: string
}

export interface DataQualityIssue {
  id: string
  type: "missing" | "conflicting" | "suspicious" | "correction"
  entityType: "farmer" | "service" | "yield" | "contract"
  entityId: string
  description: string
  detectedBy: "system" | "agent" | "coordinator" | "ops"
  detectedDate: string
  severity: "low" | "medium" | "high" | "critical"
  resolved: boolean
  resolution?: string
  resolvedBy?: string
  resolutionDate?: string
}

export interface PlatformAlert {
  id: string
  type: "service_delay" | "yield_risk" | "contract_risk" | "agent_performance" | "data_quality" | "corridor_health"
  priority: "low" | "medium" | "high" | "critical"
  corridorId?: string
  farmerId?: string
  agentId?: string
  contractId?: string
  title: string
  description: string
  actionRequired: string
  assignedTo: string
  createdAt: string
  dueDate?: string
  status: "open" | "acknowledged" | "in-progress" | "resolved" | "escalated"
  resolution?: string
  escalatedTo?: string
}

// Scenario handlers
export class ScenarioManager {
  // Handle farmer identity with missing/inconsistent data
  static createFarmerWithPartialIdentity(data: Partial<FarmerIdentity>): FarmerIdentity {
    return {
      id: data.id || `FRM-${Date.now()}`,
      name: data.name || "",
      alternateNames: data.alternateNames || [],
      phoneNumbers: data.phoneNumbers || [],
      hasFormID: data.hasFormID || false,
      verificationMethod: data.hasFormID ? "id" : "community",
      verificationStatus: data.hasFormID ? "verified" : "pending",
      verifiedBy: data.verifiedBy,
      verificationDate: data.verificationDate,
    }
  }

  // Handle multiple/non-contiguous land plots
  static createMultiplePlots(farmerId: string, plotsData: Partial<LandPlot>[]): LandPlot[] {
    return plotsData.map((plot, index) => ({
      id: `PLOT-${farmerId}-${index + 1}`,
      farmerId,
      plotNumber: index + 1,
      size: plot.size || 0,
      location: plot.location || { description: "" },
      ownership: plot.ownership || "owned",
      isContiguous: plotsData.length === 1,
      ...plot,
    }))
  }

  // Handle crop cycle failure
  static recordCropFailure(cycleId: string, reason: string, partialYield?: number): Partial<CropCycle> {
    return {
      status: "failed",
      actualYield: partialYield || 0,
      yieldVariance: partialYield ? -100 : 0,
      failureReason: reason,
      actualHarvestDate: new Date().toISOString(),
    }
  }

  // Calculate contract shortfall and reasons
  static calculateContractShortfall(
    contract: ContractStatus,
    cropCycles: CropCycle[],
  ): {
    shortfall: number
    reasons: string[]
    attributedTo: { [key: string]: number }
  } {
    const totalDelivered = contract.deliveredVolume
    const shortfall = contract.expectedVolume - totalDelivered
    const reasons: string[] = []
    const attributedTo: { [key: string]: number } = {}

    // Analyze crop cycles for failure reasons
    const failedCycles = cropCycles.filter((c) => c.status === "failed")
    const underperformingCycles = cropCycles.filter((c) => c.actualYield && c.actualYield < c.expectedYield * 0.8)

    if (failedCycles.length > 0) {
      const failureVolume = failedCycles.reduce((sum, c) => sum + c.expectedYield, 0)
      attributedTo["crop_failure"] = failureVolume
      reasons.push(`Crop failure: ${failedCycles.length} farmers affected`)
    }

    if (underperformingCycles.length > 0) {
      const underperformanceVolume = underperformingCycles.reduce(
        (sum, c) => sum + (c.expectedYield - (c.actualYield || 0)),
        0,
      )
      attributedTo["yield_underperformance"] = underperformanceVolume
      reasons.push(`Yield underperformance: ${underperformingCycles.length} farmers`)
    }

    return { shortfall, reasons, attributedTo }
  }

  // Calculate payment settlement with deductions
  static calculateSettlement(grossRevenue: number, services: ServiceExecution[]): PaymentSettlement {
    const deductions: ServiceDeduction[] = services
      .filter((s) => s.status === "completed")
      .map((s) => ({
        serviceId: s.id,
        serviceName: s.serviceType,
        cost: s.cost,
        disputed: false,
      }))

    const totalDeductions = deductions.reduce((sum, d) => sum + d.cost, 0)
    const netPayment = grossRevenue - totalDeductions

    return {
      id: `SETTLE-${Date.now()}`,
      farmerId: "",
      contractId: "",
      cropCycleId: "",
      grossRevenue,
      serviceDeductions: deductions,
      totalDeductions,
      netPayment,
      status: "calculated",
      isNegative: netPayment < 0,
    }
  }

  // Assess corridor health
  static assessCorridorHealth(
    corridorId: string,
    services: ServiceExecution[],
    cropCycles: CropCycle[],
    contracts: ContractStatus[],
  ): CorridorHealth {
    const onTimeServices = services.filter((s) => s.status === "completed" && !s.delayReason).length
    const delayedServices = services.filter((s) => s.status === "delayed").length
    const failedServices = services.filter((s) => s.status === "failed").length

    const expectedYield = cropCycles.reduce((sum, c) => sum + c.expectedYield, 0)
    const actualYield = cropCycles.reduce((sum, c) => sum + (c.actualYield || 0), 0)
    const yieldVariance = ((actualYield - expectedYield) / expectedYield) * 100

    const atRiskContracts = contracts.filter((c) => c.status === "at-risk").length

    let status: CorridorHealth["status"] = "active"
    let riskLevel: CorridorHealth["riskLevel"] = "low"

    if (yieldVariance < -20 || atRiskContracts > contracts.length * 0.5) {
      status = "critical"
      riskLevel = "critical"
    } else if (yieldVariance < -10 || delayedServices > services.length * 0.2) {
      status = "at-risk"
      riskLevel = "high"
    }

    return {
      corridorId,
      season: "2024 Wet Season",
      status,
      riskLevel,
      execution: {
        servicesOnTime: onTimeServices,
        servicesDelayed: delayedServices,
        servicesFailed: failedServices,
        slaAdherence: (onTimeServices / services.length) * 100,
      },
      yield: {
        expectedTotal: expectedYield,
        projectedActual: actualYield,
        variancePercentage: yieldVariance,
        farmersUnderperforming: cropCycles.filter((c) => (c.yieldVariance || 0) < -10).length,
        farmersOverperforming: cropCycles.filter((c) => (c.yieldVariance || 0) > 10).length,
        totalCropFailures: cropCycles.filter((c) => c.status === "failed").length,
      },
      contracts: {
        totalActive: contracts.length,
        atRisk: atRiskContracts,
        projectedShortfall: contracts.reduce((sum, c) => sum + (c.expectedVolume - c.committedVolume), 0),
      },
      operations: {
        activeAgents: 0, // To be filled from agent data
        agentsNeedingAttention: 0,
        activeFarmers: cropCycles.filter((c) => c.status !== "failed").length,
        inactiveFarmers: cropCycles.filter((c) => c.status === "failed").length,
      },
    }
  }

  // Detect data quality issues
  static detectDataIssues(entity: any, entityType: string): DataQualityIssue[] {
    const issues: DataQualityIssue[] = []

    // Missing data checks
    if (!entity.id) {
      issues.push({
        id: `DQ-${Date.now()}-1`,
        type: "missing",
        entityType: entityType as any,
        entityId: entity.id || "unknown",
        description: "Missing required ID",
        detectedBy: "system",
        detectedDate: new Date().toISOString(),
        severity: "critical",
        resolved: false,
      })
    }

    // Specific checks by entity type
    if (entityType === "service" && entity.status === "completed" && !entity.actualDate) {
      issues.push({
        id: `DQ-${Date.now()}-2`,
        type: "missing",
        entityType: "service",
        entityId: entity.id,
        description: "Service marked complete but no completion date recorded",
        detectedBy: "system",
        detectedDate: new Date().toISOString(),
        severity: "high",
        resolved: false,
      })
    }

    if (entityType === "yield" && entity.actualYield && Math.abs(entity.yieldVariance) > 50) {
      issues.push({
        id: `DQ-${Date.now()}-3`,
        type: "suspicious",
        entityType: entityType as any,
        entityId: entity.id,
        description: `Yield variance of ${entity.yieldVariance}% seems abnormal`,
        detectedBy: "system",
        detectedDate: new Date().toISOString(),
        severity: "medium",
        resolved: false,
      })
    }

    return issues
  }

  // Generate priority alerts for ops team
  static generatePlatformAlerts(corridorHealth: CorridorHealth): PlatformAlert[] {
    const alerts: PlatformAlert[] = []

    if (corridorHealth.riskLevel === "critical") {
      alerts.push({
        id: `ALERT-${Date.now()}-1`,
        type: "corridor_health",
        priority: "critical",
        corridorId: corridorHealth.corridorId,
        title: "Critical Corridor Health",
        description: `Corridor ${corridorHealth.corridorId} is in critical state with ${corridorHealth.yield.totalCropFailures} crop failures`,
        actionRequired: "Immediate ops review and intervention required",
        assignedTo: "regional_ops",
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status: "open",
      })
    }

    if (corridorHealth.execution.slaAdherence < 80) {
      alerts.push({
        id: `ALERT-${Date.now()}-2`,
        type: "service_delay",
        priority: "high",
        corridorId: corridorHealth.corridorId,
        title: "Service Execution Below Target",
        description: `SLA adherence at ${corridorHealth.execution.slaAdherence.toFixed(1)}% (target: 90%)`,
        actionRequired: "Review partner performance and capacity",
        assignedTo: "state_coordinator",
        createdAt: new Date().toISOString(),
        status: "open",
      })
    }

    if (corridorHealth.contracts.atRisk > 0) {
      alerts.push({
        id: `ALERT-${Date.now()}-3`,
        type: "contract_risk",
        priority: "high",
        corridorId: corridorHealth.corridorId,
        title: "Contracts At Risk",
        description: `${corridorHealth.contracts.atRisk} contracts at risk of breach`,
        actionRequired: "Engage offtakers and prepare mitigation plan",
        assignedTo: "regional_ops",
        createdAt: new Date().toISOString(),
        status: "open",
      })
    }

    return alerts
  }
}

// Validation rules
export const ValidationRules = {
  farmer: {
    requiredFields: ["name", "phoneNumbers"],
    acceptableVerificationMethods: ["id", "community", "agent", "biometric"],
  },
  cropCycle: {
    requiredFields: ["farmerId", "plotId", "corridorId", "season", "crop", "plantingDate"],
    minYieldVarianceForAlert: -20, // Alert if yield is 20% below expected
    maxYieldVarianceForSuspicion: 50, // Flag for review if variance exceeds 50%
  },
  service: {
    requiredFields: ["cropCycleId", "serviceType", "partnerId", "scheduledDate", "cost"],
    maxDelayDaysAcceptable: 7,
    requiresVerification: true,
  },
  contract: {
    requiredFields: ["offtakerId", "corridorId", "crop", "expectedVolume"],
    riskThreshold: 0.2, // Mark at-risk if shortfall exceeds 20%
  },
}
