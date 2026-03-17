// Agent Tier System Configuration
export const AGENT_TIERS = {
  AGENT: {
    name: "Field Agent",
    level: 1,
    minFarmers: 0,
    minReferrals: 0,
    minQualityScore: 0,
    monthlyBonus: 0,
    quarterlyBonus: 3000,
    color: "text-slate-600",
    bgColor: "bg-slate-100",
    borderColor: "border-slate-300",
    icon: "",
  },
  SENIOR_AGENT: {
    name: "Senior Field Agent",
    level: 2,
    minFarmers: 30,
    minReferrals: 2,
    minQualityScore: 75,
    monthlyBonus: 3000,
    quarterlyBonus: 10000,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-300",
    icon: "",
  },
  LEAD_AGENT: {
    name: "Lead Agent",
    level: 3,
    minFarmers: 50,
    minReferrals: 5,
    minQualityScore: 80,
    monthlyBonus: 7000,
    quarterlyBonus: 20000,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-300",
    icon: "",
  },
  PRINCIPAL_AGENT: {
    name: "Principal Agent",
    level: 5,
    minFarmers: 100,
    minReferrals: 20,
    minQualityScore: 90,
    monthlyBonus: 25000,
    quarterlyBonus: 75000,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
    borderColor: "border-emerald-300",
    icon: "",
  },
} as const

export type AgentTierKey = keyof typeof AGENT_TIERS

// Calculate agent tier based on metrics
export function calculateAgentTier(activeFarmers: number, totalReferrals: number, qualityScore: number): AgentTierKey {
  const tiers = Object.entries(AGENT_TIERS).reverse() // Check from highest to lowest

  for (const [key, tier] of tiers) {
    if (
      activeFarmers >= tier.minFarmers &&
      totalReferrals >= tier.minReferrals &&
      qualityScore >= tier.minQualityScore
    ) {
      return key as AgentTierKey
    }
  }

  return "AGENT"
}

// Get next tier requirements
export function getNextTierRequirements(currentTier: AgentTierKey) {
  const tierKeys = Object.keys(AGENT_TIERS) as AgentTierKey[]
  const currentIndex = tierKeys.indexOf(currentTier)

  if (currentIndex === tierKeys.length - 1) {
    return null // Already at max tier
  }

  const nextTierKey = tierKeys[currentIndex + 1]
  return {
    tier: AGENT_TIERS[nextTierKey],
    key: nextTierKey,
  }
}

// Calculate progression percentage to next tier
export function calculateTierProgress(
  activeFarmers: number,
  totalReferrals: number,
  qualityScore: number,
  currentTier: AgentTierKey,
) {
  const nextTier = getNextTierRequirements(currentTier)
  if (!nextTier) return 100 // Max tier reached

  const farmerProgress = (activeFarmers / nextTier.tier.minFarmers) * 100
  const referralProgress = (totalReferrals / nextTier.tier.minReferrals) * 100
  const qualityProgress = (qualityScore / nextTier.tier.minQualityScore) * 100

  return Math.min(Math.round((farmerProgress + referralProgress + qualityProgress) / 3), 100)
}

// Calculate referral bonus
export function calculateReferralBonus(totalReferrals: number, activeReferrals: number): number {
  const REFERRAL_SIGNUP_BONUS = 1500 // was 2000 - One-time bonus per successful referral
  const ACTIVE_REFERRAL_MONTHLY = 300 // was 500 - Monthly bonus per active referred agent

  return totalReferrals * REFERRAL_SIGNUP_BONUS + activeReferrals * ACTIVE_REFERRAL_MONTHLY
}

// Calculate total monthly earnings with tier bonuses
export function calculateTotalEarnings(
  baseRetainer: number,
  activityEarnings: number,
  qualityMultiplier: number,
  currentTier: AgentTierKey,
  totalReferrals: number,
  activeReferrals: number,
): {
  baseRetainer: number
  adjustedActivityEarnings: number
  tierBonus: number
  referralBonus: number
  totalMonthly: number
} {
  const tier = AGENT_TIERS[currentTier]
  const adjustedActivityEarnings = activityEarnings * qualityMultiplier
  const tierBonus = tier.monthlyBonus
  const referralBonus = calculateReferralBonus(totalReferrals, activeReferrals)

  return {
    baseRetainer,
    adjustedActivityEarnings,
    tierBonus,
    referralBonus,
    totalMonthly: baseRetainer + adjustedActivityEarnings + tierBonus + referralBonus,
  }
}
