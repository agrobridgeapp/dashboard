// Partner Referral System for Field Agents

export const PARTNER_REFERRAL_BONUSES = {
  // One-time bonuses when partner is approved and becomes active
  INPUT_SUPPLIER: 15000, // ₦15,000 per approved input supplier
  MECHANIZATION: 20000, // ₦20,000 per approved mechanization partner
  LOGISTICS: 18000, // ₦18,000 per approved logistics partner
  OFFTAKER: 25000, // ₦25,000 per approved offtaker
} as const

export const PARTNER_ONGOING_COMMISSION = {
  // Monthly recurring commission from active partner transactions
  INPUT_SUPPLIER: 0.005, // 0.5% of monthly transaction value
  MECHANIZATION: 0.008, // 0.8% of monthly transaction value
  LOGISTICS: 0.006, // 0.6% of monthly transaction value
  OFFTAKER: 0.01, // 1% of monthly transaction value
} as const

export type PartnerType = keyof typeof PARTNER_REFERRAL_BONUSES

// Calculate partner referral bonus
export function calculatePartnerReferralBonus(approvedPartners: Array<{ type: PartnerType; monthlyVolume: number }>): {
  oneTimeBonuses: number
  recurringCommission: number
  totalEarnings: number
  breakdown: Array<{ type: PartnerType; oneTime: number; recurring: number }>
} {
  let oneTimeBonuses = 0
  let recurringCommission = 0
  const breakdown: Array<{ type: PartnerType; oneTime: number; recurring: number }> = []

  approvedPartners.forEach((partner) => {
    const oneTime = PARTNER_REFERRAL_BONUSES[partner.type]
    const recurring = partner.monthlyVolume * PARTNER_ONGOING_COMMISSION[partner.type]

    oneTimeBonuses += oneTime
    recurringCommission += recurring

    breakdown.push({
      type: partner.type,
      oneTime,
      recurring,
    })
  })

  return {
    oneTimeBonuses,
    recurringCommission,
    totalEarnings: oneTimeBonuses + recurringCommission,
    breakdown,
  }
}

// Partner referral status
export type PartnerReferralStatus = "pending_review" | "approved" | "active" | "rejected" | "inactive"

export function getPartnerStatusBadgeColor(status: PartnerReferralStatus): string {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800"
    case "approved":
      return "bg-blue-100 text-blue-800"
    case "pending_review":
      return "bg-yellow-100 text-yellow-800"
    case "rejected":
      return "bg-red-100 text-red-800"
    case "inactive":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}
