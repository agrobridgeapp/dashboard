"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Users, Star, TrendingUp, TrendingDown, AlertTriangle, Search, Filter, Eye, Award } from "lucide-react"

// Demo farmer reliability data
const farmerScores = [
  {
    id: "F-001",
    name: "Aminu Yusuf",
    corridor: "Kano South",
    cluster: "Dawaki",
    hectares: 2.5,
    seasonsWithUs: 3,
    reliabilityTag: "high",
    reliabilityScore: 92,
    serviceAdoption: 95,
    yieldPerformance: 88,
    paymentHistory: 100,
    inputEligibility: "premium",
    factors: {
      onTimeServiceCompletion: 94,
      qualityGradeConsistency: 90,
      contractFulfillment: 100,
      communicationResponse: 85,
    },
    trend: "stable",
    lastUpdated: "2024-06-14",
  },
  {
    id: "F-002",
    name: "Fatima Ibrahim",
    corridor: "Kano South",
    cluster: "Dawaki",
    hectares: 1.8,
    seasonsWithUs: 2,
    reliabilityTag: "high",
    reliabilityScore: 88,
    serviceAdoption: 90,
    yieldPerformance: 92,
    paymentHistory: 100,
    inputEligibility: "premium",
    factors: {
      onTimeServiceCompletion: 88,
      qualityGradeConsistency: 95,
      contractFulfillment: 100,
      communicationResponse: 78,
    },
    trend: "improving",
    lastUpdated: "2024-06-14",
  },
  {
    id: "F-003",
    name: "Musa Abdullahi",
    corridor: "Kaduna North",
    cluster: "Zaria East",
    hectares: 3.0,
    seasonsWithUs: 4,
    reliabilityTag: "medium",
    reliabilityScore: 72,
    serviceAdoption: 78,
    yieldPerformance: 70,
    paymentHistory: 85,
    inputEligibility: "standard",
    factors: {
      onTimeServiceCompletion: 70,
      qualityGradeConsistency: 75,
      contractFulfillment: 80,
      communicationResponse: 65,
    },
    trend: "declining",
    lastUpdated: "2024-06-14",
  },
  {
    id: "F-004",
    name: "Aisha Mohammed",
    corridor: "Kaduna North",
    cluster: "Zaria East",
    hectares: 1.5,
    seasonsWithUs: 1,
    reliabilityTag: "medium",
    reliabilityScore: 68,
    serviceAdoption: 85,
    yieldPerformance: 65,
    paymentHistory: 100,
    inputEligibility: "standard",
    factors: {
      onTimeServiceCompletion: 75,
      qualityGradeConsistency: 60,
      contractFulfillment: 70,
      communicationResponse: 70,
    },
    trend: "improving",
    lastUpdated: "2024-06-14",
  },
  {
    id: "F-005",
    name: "Ibrahim Sani",
    corridor: "Kano South",
    cluster: "Gwarzo",
    hectares: 4.0,
    seasonsWithUs: 2,
    reliabilityTag: "low",
    reliabilityScore: 45,
    serviceAdoption: 55,
    yieldPerformance: 40,
    paymentHistory: 60,
    inputEligibility: "restricted",
    factors: {
      onTimeServiceCompletion: 45,
      qualityGradeConsistency: 50,
      contractFulfillment: 40,
      communicationResponse: 45,
    },
    trend: "declining",
    lastUpdated: "2024-06-14",
  },
]

const reliabilityColors = {
  high: { bg: "bg-green-100", text: "text-green-700", badge: "default" as const },
  medium: { bg: "bg-amber-100", text: "text-amber-700", badge: "secondary" as const },
  low: { bg: "bg-red-100", text: "text-red-700", badge: "destructive" as const },
}

const eligibilityColors = {
  premium: { bg: "bg-purple-100", text: "text-purple-700" },
  standard: { bg: "bg-blue-100", text: "text-blue-700" },
  restricted: { bg: "bg-gray-100", text: "text-gray-700" },
}

export default function FarmerScoringPage() {
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFarmer, setSelectedFarmer] = useState<(typeof farmerScores)[0] | null>(null)

  const filteredFarmers = farmerScores.filter((f) => {
    const matchesFilter = filter === "all" || f.reliabilityTag === filter
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.corridor.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const highCount = farmerScores.filter((f) => f.reliabilityTag === "high").length
  const mediumCount = farmerScores.filter((f) => f.reliabilityTag === "medium").length
  const lowCount = farmerScores.filter((f) => f.reliabilityTag === "low").length
  const avgScore = Math.round(farmerScores.reduce((sum, f) => sum + f.reliabilityScore, 0) / farmerScores.length)

  return (
    <DashboardLayout role="ops_admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Farmer Reliability Scoring</h1>
          <p className="text-muted-foreground">Execution patterns and input eligibility signals</p>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{highCount}</p>
                  <p className="text-sm text-muted-foreground">High Reliability</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                  <Star className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mediumCount}</p>
                  <p className="text-sm text-muted-foreground">Medium Reliability</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{lowCount}</p>
                  <p className="text-sm text-muted-foreground">Low Reliability</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{avgScore}</p>
                  <p className="text-sm text-muted-foreground">Avg Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search farmers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Farmers</SelectItem>
              <SelectItem value="high">High Reliability</SelectItem>
              <SelectItem value="medium">Medium Reliability</SelectItem>
              <SelectItem value="low">Low Reliability</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Farmer List */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4 font-medium">Farmer</th>
                    <th className="text-left py-3 px-4 font-medium">Corridor</th>
                    <th className="text-center py-3 px-4 font-medium">Score</th>
                    <th className="text-center py-3 px-4 font-medium">Reliability</th>
                    <th className="text-center py-3 px-4 font-medium">Eligibility</th>
                    <th className="text-center py-3 px-4 font-medium">Trend</th>
                    <th className="text-right py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFarmers.map((farmer) => {
                    const colors = reliabilityColors[farmer.reliabilityTag as keyof typeof reliabilityColors]
                    const eligColors = eligibilityColors[farmer.inputEligibility as keyof typeof eligibilityColors]
                    return (
                      <tr key={farmer.id} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{farmer.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {farmer.hectares} ha | {farmer.seasonsWithUs} seasons
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p>{farmer.corridor}</p>
                            <p className="text-xs text-muted-foreground">{farmer.cluster}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-2">
                            <div className="w-16">
                              <Progress value={farmer.reliabilityScore} className="h-2" />
                            </div>
                            <span className="font-medium">{farmer.reliabilityScore}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant={colors.badge}>{farmer.reliabilityTag}</Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${eligColors.bg} ${eligColors.text}`}
                          >
                            {farmer.inputEligibility}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {farmer.trend === "improving" && (
                            <span className="inline-flex items-center gap-1 text-green-600">
                              <TrendingUp className="h-4 w-4" />
                              <span className="text-xs">Up</span>
                            </span>
                          )}
                          {farmer.trend === "declining" && (
                            <span className="inline-flex items-center gap-1 text-red-600">
                              <TrendingDown className="h-4 w-4" />
                              <span className="text-xs">Down</span>
                            </span>
                          )}
                          {farmer.trend === "stable" && (
                            <span className="inline-flex items-center gap-1 text-gray-500">
                              <span className="text-xs">Stable</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedFarmer(farmer)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Farmer Detail Dialog */}
        <Dialog open={!!selectedFarmer} onOpenChange={() => setSelectedFarmer(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Reliability Profile</DialogTitle>
              <DialogDescription>
                {selectedFarmer?.name} - {selectedFarmer?.corridor}
              </DialogDescription>
            </DialogHeader>
            {selectedFarmer && (
              <div className="space-y-4">
                {/* Score Summary */}
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="text-center">
                    <p className="text-3xl font-bold">{selectedFarmer.reliabilityScore}</p>
                    <p className="text-sm text-muted-foreground">Overall Score</p>
                  </div>
                  <div className="text-center">
                    <Badge
                      variant={reliabilityColors[selectedFarmer.reliabilityTag as keyof typeof reliabilityColors].badge}
                      className="text-lg px-3 py-1"
                    >
                      {selectedFarmer.reliabilityTag}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">Reliability</p>
                  </div>
                  <div className="text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${eligibilityColors[selectedFarmer.inputEligibility as keyof typeof eligibilityColors].bg} ${eligibilityColors[selectedFarmer.inputEligibility as keyof typeof eligibilityColors].text}`}
                    >
                      {selectedFarmer.inputEligibility}
                    </span>
                    <p className="text-sm text-muted-foreground mt-1">Eligibility</p>
                  </div>
                </div>

                {/* Factor Breakdown */}
                <div className="space-y-3">
                  <h4 className="font-medium">Score Factors</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Service Completion</span>
                      <div className="flex items-center gap-2">
                        <Progress value={selectedFarmer.factors.onTimeServiceCompletion} className="w-24 h-2" />
                        <span className="text-sm font-medium w-8">
                          {selectedFarmer.factors.onTimeServiceCompletion}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Quality Consistency</span>
                      <div className="flex items-center gap-2">
                        <Progress value={selectedFarmer.factors.qualityGradeConsistency} className="w-24 h-2" />
                        <span className="text-sm font-medium w-8">
                          {selectedFarmer.factors.qualityGradeConsistency}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Contract Fulfillment</span>
                      <div className="flex items-center gap-2">
                        <Progress value={selectedFarmer.factors.contractFulfillment} className="w-24 h-2" />
                        <span className="text-sm font-medium w-8">{selectedFarmer.factors.contractFulfillment}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Communication</span>
                      <div className="flex items-center gap-2">
                        <Progress value={selectedFarmer.factors.communicationResponse} className="w-24 h-2" />
                        <span className="text-sm font-medium w-8">{selectedFarmer.factors.communicationResponse}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Eligibility Explanation */}
                <div className="p-3 bg-muted/50 rounded-lg text-sm">
                  <p className="font-medium mb-1">Input Eligibility: {selectedFarmer.inputEligibility}</p>
                  <p className="text-muted-foreground">
                    {selectedFarmer.inputEligibility === "premium" &&
                      "Eligible for full input credit, priority service scheduling, and premium partner access."}
                    {selectedFarmer.inputEligibility === "standard" &&
                      "Eligible for standard input packages with normal service scheduling."}
                    {selectedFarmer.inputEligibility === "restricted" &&
                      "Limited to pay-upfront inputs only. Requires improvement in reliability metrics."}
                  </p>
                </div>

                <p className="text-xs text-muted-foreground">Last updated: {selectedFarmer.lastUpdated}</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
