export const AGROBRIDGE_PRICING_MODEL = {
  // Base production costs per ton (Nigerian reality)
  PRODUCTION_COSTS: {
    maize: {
      inputs: 120000, // Seed + fertilizer
      mechanization: 80000, // Land prep + planting + harvest
      logistics: 50000, // Storage + transport
      total: 250000,
      perTonCost: 220000, // For 1.14 tons average yield
    },
    rice: {
      inputs: 180000,
      mechanization: 120000,
      logistics: 70000,
      total: 370000,
      perTonCost: 300000,
    },
    soybean: {
      inputs: 140000,
      mechanization: 90000,
      logistics: 60000,
      total: 290000,
      perTonCost: 250000,
    },
  },

  // Market offtaker prices per ton
  MARKET_PRICES: {
    maize: 300000,
    rice: 450000,
    soybean: 380000,
    sorghum: 280000,
    groundnut: 420000,
  },

  // AgroBridge multi-layered monetization
  MONETIZATION_LAYERS: {
    // Layer 1: Input margin (10-15%)
    inputMargin: {
      percentage: 0.125, // 12.5% average
      perHectare: 15000,
      description: "Bulk procurement advantage + quality assurance",
    },

    // Layer 2: Mechanization margin (10-20%)
    mechanizationMargin: {
      percentage: 0.15, // 15% average
      perHectare: 12000,
      description: "Aggregated demand + scheduled reliability",
    },

    // Layer 3: Coordination & orchestration fee (5-8%)
    coordinationFee: {
      percentage: 0.06, // 6% of total service value
      perHectare: 15000,
      description: "Platform infrastructure + execution assurance",
    },

    // Layer 4: Risk & predictability premium
    riskPremium: {
      perTon: 8000,
      perHectare: 9000,
      description: "Portfolio-level risk pooling + yield smoothing",
    },

    // Layer 5: Offtaker infrastructure fee (2-6%)
    offtakerFee: {
      percentage: 0.04, // 4% of contracted value
      description: "Supply predictability + quality + single counterparty",
    },
  },

  // Total AgroBridge revenue per hectare
  TOTAL_REVENUE_PER_HECTARE: {
    conservative: 45000, // ₦45k per hectare
    optimistic: 55000, // ₦55k per hectare
    average: 50000, // Used for projections
  },

  // Per ton revenue breakdown
  PER_TON_REVENUE: {
    inputEfficiency: 10000, // ₦10k
    mechanizationSpread: 8000, // ₦8k
    coordinationMargin: 7000, // ₦7k
    riskPremium: 8000, // ₦8k
    dataValue: 5000, // ₦5k (implicit)
    total: 38000, // ₦38k average per ton
    conservative: 25000, // Floor
    aggressive: 45000, // Ceiling
  },

  // Pay-at-harvest farmer allocation
  FARMER_PAYOUT_MODEL: {
    maize: {
      offtakerPrice: 300000,
      aagridgeDeductions: {
        aaasServices: 35000, // Inputs + mechanization + logistics
        riskCoordination: 10000, // Risk buffer + coordination
        totalDeduction: 45000,
      },
      farmerNetPayout: 245000, // 11% profit over ₦220k cost
      farmerProfit: 25000,
    },
    rice: {
      offtakerPrice: 450000,
      aagridgeDeductions: {
        aaasServices: 55000,
        riskCoordination: 15000,
        totalDeduction: 70000,
      },
      farmerNetPayout: 380000,
      farmerProfit: 80000,
    },
  },

  // Contract farming infrastructure fees
  CONTRACT_INFRASTRUCTURE_FEES: {
    offtakerExecutionFee: {
      percentage: 0.04, // 4% of contracted value
      description: "Predictable volume + quality + timing + single counterparty",
      example: {
        contractValue: 1000000000, // ₦1bn contract
        agrobridgeFee: 40000000, // ₦40m
      },
    },

    embeddedMargin: {
      perTon: 25000, // ₦25k embedded invisibly
      description: "Service efficiency + aggregation + coordination",
    },

    financingEnablementFee: {
      percentage: 0.02, // 2-3% of financed amount
      paidBy: ["banks", "DFIs", "embedded_lenders"],
      description: "Verified production + monitoring + guaranteed offtake",
      example: {
        financedAmount: 500000000, // ₦500m input finance
        agrobridgeFee: 10000000, // ₦10m
      },
    },

    riskInsuranceEnablement: {
      percentageOfPremium: 0.15, // 10-20% of insurance premium
      description: "Crop data + yield estimates + loss verification",
    },

    dataIntelligenceLicensing: {
      annualPerClient: 1000000, // ₦1m per institutional client
      clients: ["banks", "insurers", "processors", "governments", "NGOs"],
      products: ["Farmer risk scorecards", "Corridor productivity reports", "Portfolio monitoring dashboards"],
    },
  },

  // Stress-test scenarios (yield variance)
  YIELD_VARIANCE_SCENARIOS: {
    normal: {
      yieldVariance: 0, // 100% yield
      farmerPayout: 245000,
      agrobridgeMargin: 38000,
      outcome: "Both parties win",
    },
    mildShock: {
      yieldVariance: -0.1, // 90% yield (0.9 ton)
      farmerPayout: 230000,
      agrobridgeMargin: 30000,
      outcome: "Model survives, farmer breaks even",
    },
    moderateShock: {
      yieldVariance: -0.2, // 80% yield (0.8 ton)
      farmerPayout: 200000,
      agrobridgeMargin: 20000,
      outcome: "Margin compressed, relationship management needed",
    },
    severeShock: {
      yieldVariance: -0.3, // 70% yield (0.7 ton)
      farmerPayout: 210000,
      agrobridgeMargin: 0,
      outcome: "Portfolio-level absorption, agent retains farmer",
    },
  },

  // Portfolio logic (critical for investor confidence)
  PORTFOLIO_RISK_MANAGEMENT: {
    assumption: "Risk is managed at corridor level, not individual farmer level",
    corridorSize: 5000, // farmers
    yieldDistribution: {
      underperformers: 0.12, // 12% deliver <80%
      normal: 0.78, // 78% deliver 90-110%
      overperformers: 0.1, // 10% deliver >110%
    },
    portfolioMarginHolds: true,
    description: "Like insurance/telcos/logistics platforms - win on aggregate",
  },

  // Unit economics at scale
  SCALE_ECONOMICS: {
    perCorridorPerSeason: {
      farmers: 5000,
      avgYieldTons: 1,
      totalVolume: 5000,
      agrobridgeRevenuePerTon: 38000,
      totalRevenue: 190000000, // ₦190m per corridor per season
    },
    threeYearProjection: {
      year1: {
        corridors: 3,
        farmers: 15000,
        revenue: 570000000, // ₦570m (~$380k)
      },
      year2: {
        corridors: 10,
        farmers: 50000,
        revenue: 1900000000, // ₦1.9bn (~$1.27m)
        offtakerPremiums: 250000000, // Additional ₦250m
      },
      year3: {
        corridors: 20,
        farmers: 100000,
        revenue: 3800000000, // ₦3.8bn (~$2.5m)
        additionalStreams: 500000000, // Data + finance + exports
        totalRevenue: 4300000000, // ~$2.9m
      },
    },
  },
}

// Utility functions for pricing calculations
export function calculateAgrobridgeRevenue(
  tons: number,
  cropType: keyof typeof AGROBRIDGE_PRICING_MODEL.PRODUCTION_COSTS,
) {
  const perTonRevenue = AGROBRIDGE_PRICING_MODEL.PER_TON_REVENUE.total
  return tons * perTonRevenue
}

export function calculateFarmerPayout(
  tons: number,
  cropType: keyof typeof AGROBRIDGE_PRICING_MODEL.FARMER_PAYOUT_MODEL,
  yieldVariance = 0,
) {
  const payoutModel = AGROBRIDGE_PRICING_MODEL.FARMER_PAYOUT_MODEL[cropType]
  const adjustedTons = tons * (1 + yieldVariance)
  const grossValue = adjustedTons * payoutModel.offtakerPrice
  const deductions = payoutModel.aagridgeDeductions.totalDeduction
  return Math.max(grossValue - deductions, 0)
}

export function calculateOfftakerFee(contractValue: number) {
  const feePercentage = AGROBRIDGE_PRICING_MODEL.CONTRACT_INFRASTRUCTURE_FEES.offtakerExecutionFee.percentage
  return contractValue * feePercentage
}

export function calculateFinancingFee(financedAmount: number) {
  const feePercentage = AGROBRIDGE_PRICING_MODEL.CONTRACT_INFRASTRUCTURE_FEES.financingEnablementFee.percentage
  return financedAmount * feePercentage
}

export function getCorridorRevenueProjection(
  farmers: number,
  avgYieldPerFarmer = 1,
  perTonRevenue: number = AGROBRIDGE_PRICING_MODEL.PER_TON_REVENUE.total,
) {
  const totalTons = farmers * avgYieldPerFarmer
  return totalTons * perTonRevenue
}
