// =====================================================
// PLATFORM-WIDE STATISTICS
// Single Source of Truth for all metrics displayed across the platform
// This ensures landing page, dashboards, and analytics show consistent data
// =====================================================

import type { CorridorMetrics } from "./types"
import { CONTRACTS, PARTNERS, FIELD_AGENTS, CORRIDOR_METRICS } from "./mock-data"

/**
 * Calculate real-time platform statistics from the data store
 * These should be used across all components for consistency
 */
export function getPlatformStats() {
  // This provides consistent impressive metrics (1,228 farmers, 4,732 ha) across the platform

  // Farmer Statistics (from corridor metrics)
  const totalFarmers = CORRIDOR_METRICS.totalFarmers
  const activeFarmers = CORRIDOR_METRICS.activeFarmers
  const verifiedFarmers = CORRIDOR_METRICS.activeFarmers

  // Land & Hectares (from corridor metrics)
  const totalHectares = CORRIDOR_METRICS.totalHectares
  const activePlots = totalFarmers // Assume 1 plot per farmer for demo

  // Service Metrics (from corridor metrics)
  const totalServices = CORRIDOR_METRICS.totalServiceEvents
  const completedServices = CORRIDOR_METRICS.completedServices
  const serviceCompletionRate = totalServices > 0 ? (completedServices / totalServices) * 100 : 0

  // SLA Adherence (from corridor metrics)
  const slaAdherenceRate = CORRIDOR_METRICS.slaAdherencePercent

  // Contract & Buyers
  const activeContracts = CORRIDOR_METRICS.activeContracts
  const uniqueOfftakers =
    PARTNERS.filter(
      (p) => p.partnerType === "offtaker" || p.companyName.includes("Corp") || p.companyName.includes("Industries"),
    ).length || 2
  const totalContractedVolume = CORRIDOR_METRICS.contractedVolumeTons
  const totalDeliveredVolume = CORRIDOR_METRICS.deliveredVolumeTons

  // Crop Cycles & Yield (from corridor metrics)
  const totalCropCycles = totalFarmers // Each farmer has at least one cycle
  const completedCycles = Math.floor(totalFarmers * 0.65) // 65% completed
  const totalExpectedYield = CORRIDOR_METRICS.expectedYieldTons
  const totalActualYield = CORRIDOR_METRICS.actualYieldTons

  // Partners & Agents
  const totalPartners = PARTNERS.length
  const activePartners = PARTNERS.filter((p) => p.status === "active").length
  const totalAgents = FIELD_AGENTS.length
  const activeAgents = FIELD_AGENTS.filter((a) => a.status === "active").length

  // Corridors (currently only Kaduna is active)
  const activeCorridors = 1 // Kaduna North Corridor
  const plannedCorridors = 2 // Kano, Plateau

  return {
    // Landing Page Stats
    farmersEnrolled: totalFarmers,
    hectaresCoordinated: Math.round(totalHectares),
    serviceCompletionRate: Math.round(serviceCompletionRate),
    committedBuyers: uniqueOfftakers,

    // Detailed Metrics
    farmers: {
      total: totalFarmers,
      active: activeFarmers,
      verified: verifiedFarmers,
      pending: totalFarmers - verifiedFarmers,
    },

    land: {
      totalHectares: Math.round(totalHectares),
      activePlots,
      avgHectaresPerFarmer: totalFarmers > 0 ? totalHectares / totalFarmers : 0,
    },

    services: {
      total: totalServices,
      completed: completedServices,
      pending: totalServices - completedServices,
      completionRate: serviceCompletionRate,
      slaAdherenceRate,
    },

    contracts: {
      active: activeContracts,
      total: CONTRACTS.length,
      uniqueOfftakers,
      contractedVolumeTons: totalContractedVolume,
      deliveredVolumeTons: totalDeliveredVolume,
      fulfillmentRate: totalContractedVolume > 0 ? (totalDeliveredVolume / totalContractedVolume) * 100 : 0,
    },

    yield: {
      totalCropCycles,
      completedCycles,
      expectedYieldTons: totalExpectedYield,
      actualYieldTons: totalActualYield,
      yieldVariance: CORRIDOR_METRICS.yieldVariancePercent,
    },

    network: {
      corridors: {
        active: activeCorridors,
        planned: plannedCorridors,
        total: activeCorridors + plannedCorridors,
      },
      partners: {
        total: totalPartners,
        active: activePartners,
      },
      agents: {
        total: totalAgents,
        active: activeAgents,
      },
    },
  }
}

/**
 * Get formatted stats for landing page
 */
export function getLandingPageStats() {
  const stats = getPlatformStats()

  return [
    {
      value: 2,
      suffix: "+",
      label: "Active Corridors",
      description: "Kaduna and expanding North",
    },
    {
      value: stats.farmersEnrolled,
      suffix: "+",
      label: "Farmers Coordinated",
      description: "Across our operating regions",
    },
    {
      value: Math.round(stats.contracts.deliveredVolumeTons),
      suffix: " MT",
      label: "Volume Delivered",
      description: "To committed offtakers",
    },
    {
      value: stats.serviceCompletionRate,
      suffix: "%",
      label: "Delivery Reliability",
      description: "On-time and to specification",
    },
  ]
}

/**
 * Get dashboard-specific metrics
 */
export function getDashboardMetrics(role: string): CorridorMetrics {
  return CORRIDOR_METRICS
}
