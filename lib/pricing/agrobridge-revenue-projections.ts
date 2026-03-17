export const AGROBRIDGE_REVENUE_PROJECTIONS = {
  // Updated 3-year projection matching investor deck structure
  YEAR_1: {
    farmersOnboarded: 3000,
    avgNetRevenuePerFarmer: 305000,
    aaasRevenue: 915000000, // Gross AaaS revenue
    aaasNetRevenue: 315000000, // Net after service costs
    marketplaceGMV: 5000000000,
    marketplaceTakeRate: 0.05, // 5%
    marketplaceRevenue: 250000000,
    offtakeSubscriptionClients: 30,
    offtakeSubscriptionFeeAnnual: 300000,
    offtakeDataRevenue: 9000000,
    totalNetRevenue: 574000000,
    totalRevenue: 1174000000,
  },
  YEAR_2: {
    farmersOnboarded: 20000,
    avgNetRevenuePerFarmer: 325000,
    aaasRevenue: 6500000000,
    aaasNetRevenue: 2500000000,
    marketplaceGMV: 20000000000,
    marketplaceTakeRate: 0.05,
    marketplaceRevenue: 1000000000,
    offtakeSubscriptionClients: 70,
    offtakeSubscriptionFeeAnnual: 300000,
    offtakeDataRevenue: 21000000,
    totalNetRevenue: 3521000000,
    totalRevenue: 6521000000,
  },
  YEAR_3: {
    farmersOnboarded: 60000,
    avgNetRevenuePerFarmer: 350000,
    aaasRevenue: 21000000000,
    aaasNetRevenue: 9000000000,
    marketplaceGMV: 40000000000,
    marketplaceTakeRate: 0.05,
    marketplaceRevenue: 2000000000,
    offtakeSubscriptionClients: 100,
    offtakeSubscriptionFeeAnnual: 300000,
    offtakeDataRevenue: 30000000,
    totalNetRevenue: 11030000000,
    totalRevenue: 21030000000,
  },
}

// Helper to format currency
export function formatCurrency(value: number): string {
  if (value >= 1000000000) {
    return `₦${(value / 1000000000).toFixed(2)}bn`
  }
  if (value >= 1000000) {
    return `₦${(value / 1000000).toFixed(0)}m`
  }
  return `₦${value.toLocaleString()}`
}

// Helper to get year data
export function getYearData(year: 1 | 2 | 3) {
  switch (year) {
    case 1:
      return AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_1
    case 2:
      return AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_2
    case 3:
      return AGROBRIDGE_REVENUE_PROJECTIONS.YEAR_3
  }
}
