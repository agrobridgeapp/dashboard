import { AGROBRIDGE_PRICING_MODEL } from "./agrobridge-pricing-model"

export { AGROBRIDGE_PRICING_MODEL }

export interface UnitEconomicsInput {
  cropType: "maize" | "rice" | "soybean"
  hectares: number
  farmersCount: number
  avgYieldTonsPerHectare: number
  contractedOfftakerPrice: number
  yieldVariance?: number // -0.3 to 0.3 (stress test)
}

export interface UnitEconomicsOutput {
  // Volume
  totalTons: number

  // Revenue breakdown
  grossContractValue: number
  agrobridgeRevenueBreakdown: {
    inputMargin: number
    mechanizationMargin: number
    coordinationFee: number
    riskPremium: number
    offtakerFee: number
    total: number
  }

  // Farmer economics
  totalFarmerPayout: number
  avgPayoutPerFarmer: number
  farmerProfitMargin: number

  // AgroBridge metrics
  agrobridgeGrossRevenue: number
  agrobridgeMarginPercent: number
  revenuePerHectare: number
  revenuePerFarmer: number

  // Risk scenario
  scenario: "normal" | "mild_shock" | "moderate_shock" | "severe_shock"
  modelSurvives: boolean
}

export function calculateUnitEconomics(input: UnitEconomicsInput): UnitEconomicsOutput {
  const { cropType, hectares, farmersCount, avgYieldTonsPerHectare, contractedOfftakerPrice, yieldVariance = 0 } = input

  // Adjust for yield variance
  const actualYield = avgYieldTonsPerHectare * (1 + yieldVariance)
  const totalTons = hectares * actualYield

  // Gross contract value
  const grossContractValue = totalTons * contractedOfftakerPrice

  // AgroBridge revenue layers
  const inputMargin = hectares * AGROBRIDGE_PRICING_MODEL.MONETIZATION_LAYERS.inputMargin.perHectare
  const mechanizationMargin = hectares * AGROBRIDGE_PRICING_MODEL.MONETIZATION_LAYERS.mechanizationMargin.perHectare
  const coordinationFee = hectares * AGROBRIDGE_PRICING_MODEL.MONETIZATION_LAYERS.coordinationFee.perHectare
  const riskPremium = hectares * AGROBRIDGE_PRICING_MODEL.MONETIZATION_LAYERS.riskPremium.perHectare
  const offtakerFee = grossContractValue * AGROBRIDGE_PRICING_MODEL.MONETIZATION_LAYERS.offtakerFee.percentage

  const agrobridgeGrossRevenue = inputMargin + mechanizationMargin + coordinationFee + riskPremium + offtakerFee

  // Farmer payout
  const productionCost = AGROBRIDGE_PRICING_MODEL.PRODUCTION_COSTS[cropType].perTonCost
  const totalProductionCost = totalTons * productionCost
  const serviceDeductions = inputMargin + mechanizationMargin + coordinationFee + riskPremium
  const totalFarmerPayout = grossContractValue - agrobridgeGrossRevenue

  // Metrics
  const avgPayoutPerFarmer = totalFarmerPayout / farmersCount
  const farmerProfitMargin = ((totalFarmerPayout - totalProductionCost) / totalFarmerPayout) * 100
  const agrobridgeMarginPercent = (agrobridgeGrossRevenue / grossContractValue) * 100
  const revenuePerHectare = agrobridgeGrossRevenue / hectares
  const revenuePerFarmer = agrobridgeGrossRevenue / farmersCount

  // Determine scenario
  let scenario: "normal" | "mild_shock" | "moderate_shock" | "severe_shock" = "normal"
  if (yieldVariance <= -0.25) scenario = "severe_shock"
  else if (yieldVariance <= -0.15) scenario = "moderate_shock"
  else if (yieldVariance <= -0.05) scenario = "mild_shock"

  const modelSurvives = agrobridgeGrossRevenue > 0 && totalFarmerPayout >= totalProductionCost * 0.95

  return {
    totalTons,
    grossContractValue,
    agrobridgeRevenueBreakdown: {
      inputMargin,
      mechanizationMargin,
      coordinationFee,
      riskPremium,
      offtakerFee,
      total: agrobridgeGrossRevenue,
    },
    totalFarmerPayout,
    avgPayoutPerFarmer,
    farmerProfitMargin,
    agrobridgeGrossRevenue,
    agrobridgeMarginPercent,
    revenuePerHectare,
    revenuePerFarmer,
    scenario,
    modelSurvives,
  }
}

// Pre-calculated examples for demo
export const DEMO_UNIT_ECONOMICS = {
  maizeCorridorNormal: calculateUnitEconomics({
    cropType: "maize",
    hectares: 5000,
    farmersCount: 5000,
    avgYieldTonsPerHectare: 1,
    contractedOfftakerPrice: 300000,
    yieldVariance: 0,
  }),

  maizeCorridorMildShock: calculateUnitEconomics({
    cropType: "maize",
    hectares: 5000,
    farmersCount: 5000,
    avgYieldTonsPerHectare: 1,
    contractedOfftakerPrice: 300000,
    yieldVariance: -0.1,
  }),

  riceCorridorNormal: calculateUnitEconomics({
    cropType: "rice",
    hectares: 3000,
    farmersCount: 3000,
    avgYieldTonsPerHectare: 1.2,
    contractedOfftakerPrice: 450000,
    yieldVariance: 0,
  }),
}
