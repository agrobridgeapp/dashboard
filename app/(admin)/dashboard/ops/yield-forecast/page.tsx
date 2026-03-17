"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  BarChart3,
  Target,
  Leaf,
  CloudRain,
  Bug,
  CheckCircle2,
} from "lucide-react"

// Demo yield forecast data - statistical, not ML
const corridorForecasts = [
  {
    corridor: "Kano South",
    crop: "Maize",
    hectares: 450,
    farmers: 245,
    // Statistical yield range based on historical data
    expectedYieldLow: 1800, // tons (conservative)
    expectedYieldMid: 2025, // tons (likely)
    expectedYieldHigh: 2250, // tons (optimistic)
    currentProgress: 78, // % of crop cycle complete
    serviceCompletion: 85,
    weatherImpact: "positive",
    pestRisk: "low",
    confidenceLevel: 75, // % confidence in forecast
    riskFactors: ["Late fertilizer in 12% of farms"],
    deviationAlerts: [],
  },
  {
    corridor: "Kaduna North",
    crop: "Maize",
    hectares: 380,
    farmers: 198,
    expectedYieldLow: 1400,
    expectedYieldMid: 1710,
    expectedYieldHigh: 1900,
    currentProgress: 72,
    serviceCompletion: 79,
    weatherImpact: "neutral",
    pestRisk: "moderate",
    confidenceLevel: 68,
    riskFactors: ["Fall armyworm activity reported", "15% service delays"],
    deviationAlerts: ["Yield tracking 8% below mid-range estimate"],
  },
  {
    corridor: "Kano South",
    crop: "Rice",
    hectares: 180,
    farmers: 95,
    expectedYieldLow: 540,
    expectedYieldMid: 630,
    expectedYieldHigh: 720,
    currentProgress: 45,
    serviceCompletion: 92,
    weatherImpact: "positive",
    pestRisk: "low",
    confidenceLevel: 62, // Lower confidence because earlier in cycle
    riskFactors: [],
    deviationAlerts: [],
  },
  {
    corridor: "Kaduna North",
    crop: "Soybean",
    hectares: 220,
    farmers: 112,
    expectedYieldLow: 264,
    expectedYieldMid: 330,
    expectedYieldHigh: 396,
    currentProgress: 55,
    serviceCompletion: 88,
    weatherImpact: "neutral",
    pestRisk: "low",
    confidenceLevel: 65,
    riskFactors: ["Moisture stress in some areas"],
    deviationAlerts: [],
  },
]

// Historical variance data
const historicalVariance = [
  { season: "2023 Wet", corridor: "Kano South", crop: "Maize", expected: 1800, actual: 1720, variance: -4.4 },
  { season: "2023 Wet", corridor: "Kaduna North", crop: "Maize", expected: 1500, actual: 1380, variance: -8.0 },
  { season: "2023 Dry", corridor: "Kano South", crop: "Rice", expected: 500, actual: 485, variance: -3.0 },
  { season: "2022 Wet", corridor: "Kano South", crop: "Maize", expected: 1650, actual: 1590, variance: -3.6 },
]

const weatherIcons = {
  positive: { icon: CloudRain, color: "text-green-600", bg: "bg-green-100" },
  neutral: { icon: CloudRain, color: "text-gray-600", bg: "bg-gray-100" },
  negative: { icon: CloudRain, color: "text-red-600", bg: "bg-red-100" },
}

const pestIcons = {
  low: { icon: Bug, color: "text-green-600", bg: "bg-green-100" },
  moderate: { icon: Bug, color: "text-amber-600", bg: "bg-amber-100" },
  high: { icon: Bug, color: "text-red-600", bg: "bg-red-100" },
}

export default function YieldForecastPage() {
  const [selectedCorridor, setSelectedCorridor] = useState("all")

  const filteredForecasts =
    selectedCorridor === "all" ? corridorForecasts : corridorForecasts.filter((f) => f.corridor === selectedCorridor)

  const totalExpectedMid = filteredForecasts.reduce((sum, f) => sum + f.expectedYieldMid, 0)
  const totalHectares = filteredForecasts.reduce((sum, f) => sum + f.hectares, 0)
  const avgConfidence = Math.round(
    filteredForecasts.reduce((sum, f) => sum + f.confidenceLevel, 0) / filteredForecasts.length,
  )
  const alertCount = filteredForecasts.filter((f) => f.deviationAlerts.length > 0).length

  return (
    <DashboardLayout role="ops_admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Yield Forecasting</h1>
            <p className="text-muted-foreground">Statistical yield predictions with confidence bands</p>
          </div>
          <Select value={selectedCorridor} onValueChange={setSelectedCorridor}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter corridor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Corridors</SelectItem>
              <SelectItem value="Kano South">Kano South</SelectItem>
              <SelectItem value="Kaduna North">Kaduna North</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalExpectedMid.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Expected Yield (tons)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <Leaf className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalHectares.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Hectares Under Forecast</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{avgConfidence}%</p>
                  <p className="text-sm text-muted-foreground">Avg Confidence Level</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={alertCount > 0 ? "border-amber-300" : ""}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${alertCount > 0 ? "bg-amber-100" : "bg-gray-100"}`}
                >
                  <AlertTriangle className={`h-6 w-6 ${alertCount > 0 ? "text-amber-600" : "text-gray-400"}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{alertCount}</p>
                  <p className="text-sm text-muted-foreground">Deviation Alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="forecasts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="forecasts">Current Forecasts</TabsTrigger>
            <TabsTrigger value="historical">Historical Accuracy</TabsTrigger>
          </TabsList>

          <TabsContent value="forecasts" className="space-y-4">
            {filteredForecasts.map((forecast, idx) => {
              const WeatherIcon = weatherIcons[forecast.weatherImpact as keyof typeof weatherIcons]
              const PestIcon = pestIcons[forecast.pestRisk as keyof typeof pestIcons]
              const hasAlerts = forecast.deviationAlerts.length > 0

              return (
                <Card key={idx} className={hasAlerts ? "border-l-4 border-l-amber-500" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {forecast.corridor} - {forecast.crop}
                        </CardTitle>
                        <CardDescription>
                          {forecast.farmers} farmers | {forecast.hectares} hectares | {forecast.currentProgress}%
                          complete
                        </CardDescription>
                      </div>
                      <Badge variant={forecast.confidenceLevel >= 70 ? "default" : "secondary"}>
                        {forecast.confidenceLevel}% confidence
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Yield Range Visualization */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Yield Forecast Range (tons)</span>
                        <span className="font-medium">{forecast.expectedYieldMid.toLocaleString()} likely</span>
                      </div>
                      <div className="relative h-8 bg-muted rounded-full overflow-hidden">
                        {/* Range bar */}
                        <div
                          className="absolute h-full bg-green-200"
                          style={{
                            left: `${(forecast.expectedYieldLow / forecast.expectedYieldHigh) * 100 - 10}%`,
                            width: `${((forecast.expectedYieldHigh - forecast.expectedYieldLow) / forecast.expectedYieldHigh) * 100 + 10}%`,
                          }}
                        />
                        {/* Mid point marker */}
                        <div
                          className="absolute h-full w-1 bg-green-600"
                          style={{ left: `${(forecast.expectedYieldMid / forecast.expectedYieldHigh) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{forecast.expectedYieldLow.toLocaleString()} (low)</span>
                        <span>{forecast.expectedYieldHigh.toLocaleString()} (high)</span>
                      </div>
                    </div>

                    {/* Contributing Factors */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${WeatherIcon.bg}`}>
                          <WeatherIcon.icon className={`h-4 w-4 ${WeatherIcon.color}`} />
                        </div>
                        <div className="text-sm">
                          <p className="font-medium capitalize">{forecast.weatherImpact}</p>
                          <p className="text-xs text-muted-foreground">Weather</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${PestIcon.bg}`}>
                          <PestIcon.icon className={`h-4 w-4 ${PestIcon.color}`} />
                        </div>
                        <div className="text-sm">
                          <p className="font-medium capitalize">{forecast.pestRisk}</p>
                          <p className="text-xs text-muted-foreground">Pest Risk</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${forecast.serviceCompletion >= 85 ? "bg-green-100" : "bg-amber-100"}`}
                        >
                          <CheckCircle2
                            className={`h-4 w-4 ${forecast.serviceCompletion >= 85 ? "text-green-600" : "text-amber-600"}`}
                          />
                        </div>
                        <div className="text-sm">
                          <p className="font-medium">{forecast.serviceCompletion}%</p>
                          <p className="text-xs text-muted-foreground">Service SLA</p>
                        </div>
                      </div>
                    </div>

                    {/* Alerts & Risk Factors */}
                    {(forecast.deviationAlerts.length > 0 || forecast.riskFactors.length > 0) && (
                      <div className="space-y-2 pt-2 border-t">
                        {forecast.deviationAlerts.map((alert, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 p-2 rounded"
                          >
                            <AlertTriangle className="h-4 w-4" />
                            {alert}
                          </div>
                        ))}
                        {forecast.riskFactors.map((risk, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                            {risk}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>

          <TabsContent value="historical" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historical Forecast Accuracy</CardTitle>
                <CardDescription>Comparing past predictions to actual outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Season</th>
                        <th className="text-left py-3 px-4 font-medium">Corridor</th>
                        <th className="text-left py-3 px-4 font-medium">Crop</th>
                        <th className="text-right py-3 px-4 font-medium">Expected</th>
                        <th className="text-right py-3 px-4 font-medium">Actual</th>
                        <th className="text-right py-3 px-4 font-medium">Variance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historicalVariance.map((row, idx) => (
                        <tr key={idx} className="border-b last:border-0">
                          <td className="py-3 px-4">{row.season}</td>
                          <td className="py-3 px-4">{row.corridor}</td>
                          <td className="py-3 px-4">{row.crop}</td>
                          <td className="py-3 px-4 text-right">{row.expected.toLocaleString()} tons</td>
                          <td className="py-3 px-4 text-right">{row.actual.toLocaleString()} tons</td>
                          <td className="py-3 px-4 text-right">
                            <span
                              className={`flex items-center justify-end gap-1 ${row.variance < 0 ? "text-red-600" : "text-green-600"}`}
                            >
                              {row.variance < 0 ? (
                                <TrendingDown className="h-4 w-4" />
                              ) : (
                                <TrendingUp className="h-4 w-4" />
                              )}
                              {row.variance}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
