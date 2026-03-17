// Agent Commission & Earnings Calculation System
// Based on GTM Strategy: Retainer + Volume Bonuses
// Conservative rates for sustainable business model

// Commission Rate Structure
export const COMMISSION_RATES = {
  // Per Hectare Activated Commission (reduced from 5k-10k to 2k-4k)
  HECTARE_ACTIVATION: {
    TIER_1: 500, // 0-50 hectares (was 2000)
    TIER_2: 500, // 51-150 hectares (was 3000)
    TIER_3: 500, // 151+ hectares (was 4000)
  },

  // Per Ton Aggregated Commission - earnings for actual produce volume
  TON_AGGREGATED: {
    TIER_1: 500, // 0-50 tons
    TIER_2: 750, // 51-200 tons
    TIER_3: 1000, // 201+ tons
  },

  // Per Farmer Onboarded Bonus (reduced from 2500 to 1000)
  FARMER_ONBOARDING: 1000, // was 2500

  // Base Monthly Retainer
  BASE_RETAINER: {
    AGENT: 25000, // Updated from 20000 to 25000
    SENIOR_AGENT: 35000, // Updated from 30000
    SUPER_AGENT: 50000, // Updated from 45000
    MASTER_AGENT: 70000, // Updated from 65000
    GRAND_MASTER_AGENT: 95000, // Updated from 85000
  },

  // Quality Score Multiplier (slightly reduced)
  QUALITY_MULTIPLIER: {
    EXCELLENT: 1.15, // 90%+ (was 1.2)
    GOOD: 1.08, // 80-89% (was 1.1)
    AVERAGE: 1.0, // 70-79%
    POOR: 0.92, // 60-69% (was 0.9)
    CRITICAL: 0.85, // <60% (was 0.8)
  },

  // Performance Bonuses
  PERFORMANCE_BONUSES: {
    // Volume Target Bonuses (% of base retainer)
    VOLUME_TARGET: {
      MEETS_TARGET: 0.1, // 10% bonus for meeting 100% of targets
      EXCEEDS_TARGET: 0.2, // 20% bonus for exceeding targets by 25%+
      EXCEPTIONAL: 0.35, // 35% bonus for exceeding targets by 50%+
    },
    // Data Accuracy Bonuses
    DATA_ACCURACY: {
      EXCELLENT: 5000, // 95%+ accuracy
      GOOD: 3000, // 90-94% accuracy
      ACCEPTABLE: 1000, // 85-89% accuracy
    },
    // Timely Delivery Bonuses
    TIMELY_DELIVERY: {
      EXCELLENT: 5000, // 95%+ on-time
      GOOD: 3000, // 90-94% on-time
      ACCEPTABLE: 1000, // 85-89% on-time
    },
  },
} as const

export type AgentTier = keyof typeof COMMISSION_RATES.BASE_RETAINER

// Calculate hectare activation commission
export function calculateHectareCommission(hectaresActivated: number): number {
  return hectaresActivated * COMMISSION_RATES.HECTARE_ACTIVATION.TIER_1
}

// Calculate ton aggregated commission
export function calculateTonCommission(tonsAggregated: number): number {
  if (tonsAggregated <= 50) {
    return tonsAggregated * COMMISSION_RATES.TON_AGGREGATED.TIER_1
  } else if (tonsAggregated <= 200) {
    return 50 * COMMISSION_RATES.TON_AGGREGATED.TIER_1 + (tonsAggregated - 50) * COMMISSION_RATES.TON_AGGREGATED.TIER_2
  } else {
    return (
      50 * COMMISSION_RATES.TON_AGGREGATED.TIER_1 +
      150 * COMMISSION_RATES.TON_AGGREGATED.TIER_2 +
      (tonsAggregated - 200) * COMMISSION_RATES.TON_AGGREGATED.TIER_3
    )
  }
}

// Calculate farmer onboarding bonus
export function calculateOnboardingBonus(farmersOnboarded: number): number {
  return farmersOnboarded * COMMISSION_RATES.FARMER_ONBOARDING
}

// Get quality multiplier
export function getQualityMultiplier(qualityScore: number): number {
  if (qualityScore >= 90) return COMMISSION_RATES.QUALITY_MULTIPLIER.EXCELLENT
  if (qualityScore >= 80) return COMMISSION_RATES.QUALITY_MULTIPLIER.GOOD
  if (qualityScore >= 70) return COMMISSION_RATES.QUALITY_MULTIPLIER.AVERAGE
  if (qualityScore >= 60) return COMMISSION_RATES.QUALITY_MULTIPLIER.POOR
  return COMMISSION_RATES.QUALITY_MULTIPLIER.CRITICAL
}

// Calculate volume target bonus
export function calculateVolumeTargetBonus(
  baseRetainer: number,
  achievementPercentage: number,
): { bonus: number; level: string } {
  if (achievementPercentage >= 150) {
    return {
      bonus: baseRetainer * COMMISSION_RATES.PERFORMANCE_BONUSES.VOLUME_TARGET.EXCEPTIONAL,
      level: "Exceptional",
    }
  } else if (achievementPercentage >= 125) {
    return {
      bonus: baseRetainer * COMMISSION_RATES.PERFORMANCE_BONUSES.VOLUME_TARGET.EXCEEDS_TARGET,
      level: "Exceeds Target",
    }
  } else if (achievementPercentage >= 100) {
    return {
      bonus: baseRetainer * COMMISSION_RATES.PERFORMANCE_BONUSES.VOLUME_TARGET.MEETS_TARGET,
      level: "Meets Target",
    }
  }
  return { bonus: 0, level: "Below Target" }
}

// Calculate data accuracy bonus
export function calculateDataAccuracyBonus(accuracyPercentage: number): { bonus: number; level: string } {
  if (accuracyPercentage >= 95) {
    return { bonus: COMMISSION_RATES.PERFORMANCE_BONUSES.DATA_ACCURACY.EXCELLENT, level: "Excellent" }
  } else if (accuracyPercentage >= 90) {
    return { bonus: COMMISSION_RATES.PERFORMANCE_BONUSES.DATA_ACCURACY.GOOD, level: "Good" }
  } else if (accuracyPercentage >= 85) {
    return { bonus: COMMISSION_RATES.PERFORMANCE_BONUSES.DATA_ACCURACY.ACCEPTABLE, level: "Acceptable" }
  }
  return { bonus: 0, level: "Needs Improvement" }
}

// Calculate timely delivery bonus
export function calculateTimelyDeliveryBonus(onTimePercentage: number): { bonus: number; level: string } {
  if (onTimePercentage >= 95) {
    return { bonus: COMMISSION_RATES.PERFORMANCE_BONUSES.TIMELY_DELIVERY.EXCELLENT, level: "Excellent" }
  } else if (onTimePercentage >= 90) {
    return { bonus: COMMISSION_RATES.PERFORMANCE_BONUSES.TIMELY_DELIVERY.GOOD, level: "Good" }
  } else if (onTimePercentage >= 85) {
    return { bonus: COMMISSION_RATES.PERFORMANCE_BONUSES.TIMELY_DELIVERY.ACCEPTABLE, level: "Acceptable" }
  }
  return { bonus: 0, level: "Needs Improvement" }
}

// Calculate referral earnings
export function calculateReferralEarnings(
  totalReferredAgents: number,
  activeReferredAgents: number,
): {
  signupBonus: number
  monthlyRecurring: number
  total: number
} {
  const SIGNUP_BONUS = 1500 // was 2000
  const MONTHLY_PER_ACTIVE = 300 // was 500

  return {
    signupBonus: totalReferredAgents * SIGNUP_BONUS,
    monthlyRecurring: activeReferredAgents * MONTHLY_PER_ACTIVE,
    total: totalReferredAgents * SIGNUP_BONUS + activeReferredAgents * MONTHLY_PER_ACTIVE,
  }
}

// Calculate total agent earnings
export function calculateAgentEarnings(params: {
  tier: AgentTier
  farmersOnboarded: number
  hectaresActivated: number
  tonsAggregated: number
  qualityScore: number
  dataAccuracy: number
  timelyDeliveryRate: number
  volumeAchievementPercentage: number
  totalReferredAgents: number
  activeReferredAgents: number
  tierMonthlyBonus: number
}): {
  baseRetainer: number
  onboardingBonus: number
  hectareCommission: number
  tonCommission: number
  qualityAdjustedCommission: number
  volumeTargetBonus: { bonus: number; level: string }
  dataAccuracyBonus: { bonus: number; level: string }
  timelyDeliveryBonus: { bonus: number; level: string }
  tierBonus: number
  referralEarnings: number
  totalMonthly: number
  breakdown: string[]
} {
  const {
    tier,
    farmersOnboarded,
    hectaresActivated,
    tonsAggregated,
    qualityScore,
    dataAccuracy,
    timelyDeliveryRate,
    volumeAchievementPercentage,
    tierMonthlyBonus,
  } = params

  const baseRetainer = COMMISSION_RATES.BASE_RETAINER[tier]
  const onboardingBonus = calculateOnboardingBonus(farmersOnboarded)
  const rawHectareCommission = calculateHectareCommission(hectaresActivated)
  const tonCommission = calculateTonCommission(tonsAggregated)
  const qualityMultiplier = getQualityMultiplier(qualityScore)
  const qualityAdjustedCommission = rawHectareCommission * qualityMultiplier
  const referralEarnings = calculateReferralEarnings(params.totalReferredAgents, params.activeReferredAgents).total

  // Performance bonuses
  const volumeTargetBonus = calculateVolumeTargetBonus(baseRetainer, volumeAchievementPercentage)
  const dataAccuracyBonus = calculateDataAccuracyBonus(dataAccuracy)
  const timelyDeliveryBonus = calculateTimelyDeliveryBonus(timelyDeliveryRate)

  const totalMonthly =
    baseRetainer +
    onboardingBonus +
    qualityAdjustedCommission +
    tonCommission +
    volumeTargetBonus.bonus +
    dataAccuracyBonus.bonus +
    timelyDeliveryBonus.bonus +
    tierMonthlyBonus +
    referralEarnings

  return {
    baseRetainer,
    onboardingBonus,
    hectareCommission: rawHectareCommission,
    tonCommission,
    qualityAdjustedCommission,
    volumeTargetBonus,
    dataAccuracyBonus,
    timelyDeliveryBonus,
    tierBonus: tierMonthlyBonus,
    referralEarnings,
    totalMonthly,
    breakdown: [
      `Base Retainer: ₦${baseRetainer.toLocaleString()}`,
      `Farmer Onboarding (${farmersOnboarded} farmers): ₦${onboardingBonus.toLocaleString()}`,
      `Hectare Commission (${hectaresActivated} ha × ${qualityMultiplier}): ₦${qualityAdjustedCommission.toLocaleString()}`,
      `Ton Commission (${tonsAggregated} tons): ₦${tonCommission.toLocaleString()}`,
      `Volume Target Bonus: ₦${volumeTargetBonus.bonus.toLocaleString()}`,
      `Data Accuracy Bonus: ₦${dataAccuracyBonus.bonus.toLocaleString()}`,
      `Timely Delivery Bonus: ₦${timelyDeliveryBonus.bonus.toLocaleString()}`,
      `Tier Bonus: ₦${tierMonthlyBonus.toLocaleString()}`,
      `Referral Earnings: ₦${referralEarnings.toLocaleString()}`,
    ],
  }
}

// Generate monthly targets for agent
export function generateAgentTargets(
  currentTier: AgentTier,
  currentFarmers: number,
  currentHectares: number,
): {
  weeklyFarmerTarget: number
  weeklyHectareTarget: number
  monthlyFarmerTarget: number
  monthlyHectareTarget: number
  monthlyTonTarget: number
  quarterlyFarmerTarget: number
  quarterlyHectareTarget: number
} {
  // Base targets scale with tier (reduced for more realistic goals)
  const tierMultipliers = {
    AGENT: 1.0,
    SENIOR_AGENT: 1.3, // was 1.5
    SUPER_AGENT: 1.6, // was 2.0
    MASTER_AGENT: 2.0, // was 2.5
    GRAND_MASTER_AGENT: 2.5, // was 3.0
  }

  const multiplier = tierMultipliers[currentTier]
  const baseFarmersPerMonth = 15 // was 20
  const baseHectaresPerMonth = 45 // was 60
  const baseTonsPerMonth = 30 // Added for ton targets

  return {
    weeklyFarmerTarget: Math.ceil((baseFarmersPerMonth * multiplier) / 4),
    weeklyHectareTarget: Math.ceil((baseHectaresPerMonth * multiplier) / 4),
    monthlyFarmerTarget: Math.ceil(baseFarmersPerMonth * multiplier),
    monthlyHectareTarget: Math.ceil(baseHectaresPerMonth * multiplier),
    monthlyTonTarget: Math.ceil(baseTonsPerMonth * multiplier),
    quarterlyFarmerTarget: Math.ceil(baseFarmersPerMonth * multiplier * 3),
    quarterlyHectareTarget: Math.ceil(baseHectaresPerMonth * multiplier * 3),
  }
}
