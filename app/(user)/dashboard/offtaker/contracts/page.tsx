"use client"

import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Wheat, FileText, Calendar, MapPin, Package, CheckCircle2, AlertTriangle, Eye } from "lucide-react"
import { useState, useEffect } from "react"
import { api } from "@/lib/api-client"

export default function BuyerContractsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [cropFilter, setCropFilter] = useState<string>("all")
  const [corridorFilter, setCorridorFilter] = useState<string>("all")
  const [selectedContract, setSelectedContract] = useState<any | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const [contracts, setContracts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await api.contracts.list()
        console.log("[v0] Contracts response:", response)
        const contractsArray = Array.isArray(response.data) ? response.data : response.data?.contracts || []
        console.log("[v0] Contracts array:", contractsArray)
        console.log("[v0] First contract sample:", contractsArray[0])
        setContracts(contractsArray)
      } catch (err) {
        console.error("[v0] Failed to fetch contracts:", err)
        setError("Failed to load contracts. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchContracts()
  }, [])

  const filteredContracts = contracts.filter((c) => {
    if (cropFilter !== "all" && c.crop !== cropFilter) return false
    if (corridorFilter !== "all" && c.corridor !== corridorFilter) return false
    if (
      searchTerm &&
      !c.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !c.crop.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !c.corridor.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false
    return true
  })

  const activeContracts = contracts.filter((c) => c.status === "active").length
  const totalVolume = contracts.reduce((sum, c) => {
    const quantity = c.quantity || c.contractedVolume || c.volume || 0
    return sum + (typeof quantity === "number" ? quantity : 0)
  }, 0)
  const totalDelivered = contracts.reduce((sum, c) => {
    const delivered = c.delivered || c.deliveredVolume || c.deliveryTotal || 0
    return sum + (typeof delivered === "number" ? delivered : 0)
  }, 0)

  const handleViewDetails = (contract: any) => {
    setSelectedContract(contract)
    setDetailsOpen(true)
  }

  if (loading) {
    return (
      <DashboardLayout allowedRoles={["offtaker"]}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading contracts...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout allowedRoles={["offtaker"]}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-3">
            <p className="text-destructive">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout allowedRoles={["offtaker"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AgroBridge Contracts</h1>
          <p className="text-muted-foreground">View your contracted supply agreements coordinated by AgroBridge</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1B5E3C]/10">
                  <FileText className="h-5 w-5 text-[#1B5E3C]" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeContracts}</p>
                  <p className="text-sm text-muted-foreground">Active Contracts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                  <Package className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalVolume.toLocaleString()} MT</p>
                  <p className="text-sm text-muted-foreground">Total Contracted</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalDelivered.toLocaleString()} MT</p>
                  <p className="text-sm text-muted-foreground">Total Delivered</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <Select value={cropFilter} onValueChange={setCropFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Crops" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Crops</SelectItem>
              <SelectItem value="Maize">Maize</SelectItem>
              <SelectItem value="Rice">Rice</SelectItem>
              <SelectItem value="Soybean">Soybean</SelectItem>
            </SelectContent>
          </Select>
          <Select value={corridorFilter} onValueChange={setCorridorFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Corridors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Corridors</SelectItem>
              <SelectItem value="Kaduna">Kaduna</SelectItem>
              <SelectItem value="Kano">Kano</SelectItem>
              <SelectItem value="Plateau">Plateau</SelectItem>
              <SelectItem value="Nasarawa">Nasarawa</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search contracts..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Contracts</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          {["all", "active", "completed"].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-4">
              <Card className="border-border/50">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Contract ID</TableHead>
                        <TableHead className="font-semibold">Crop</TableHead>
                        <TableHead className="font-semibold">Corridor</TableHead>
                        <TableHead className="font-semibold">Season</TableHead>
                        <TableHead className="font-semibold">Progress</TableHead>
                        <TableHead className="font-semibold">Delivery Window</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredContracts
                        .filter((c) => tab === "all" || c.status === tab)
                        .map((contract) => {
                          const progress = Math.round((contract.delivered / contract.quantity) * 100)
                          return (
                            <TableRow key={contract.id} className="hover:bg-muted/30">
                              <TableCell className="font-medium">{contract.id}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="rounded-md bg-amber-100 p-1.5">
                                    <Wheat className="h-3.5 w-3.5 text-amber-600" />
                                  </div>
                                  {contract.crop}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {contract.corridor}
                                </div>
                              </TableCell>
                              <TableCell className="text-muted-foreground">{contract.season}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3 min-w-[140px]">
                                  <Progress value={progress} className="h-2 flex-1" />
                                  <span className="text-sm font-medium w-20">
                                    {contract.delivered}/{contract.quantity} MT
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {contract.deliveryWindow}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    contract.fulfillmentStatus === "completed"
                                      ? "bg-gray-100 text-gray-700 hover:bg-gray-100"
                                      : contract.fulfillmentStatus === "on-track"
                                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                                        : "bg-red-100 text-red-700 hover:bg-red-100"
                                  }
                                >
                                  {contract.fulfillmentStatus === "completed" ? (
                                    <>
                                      <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
                                    </>
                                  ) : contract.fulfillmentStatus === "on-track" ? (
                                    <>
                                      <CheckCircle2 className="mr-1 h-3 w-3" /> On Track
                                    </>
                                  ) : (
                                    <>
                                      <AlertTriangle className="mr-1 h-3 w-3" /> At Risk
                                    </>
                                  )}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm" onClick={() => handleViewDetails(contract)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Footer note */}
        <p className="text-xs text-muted-foreground text-center">
          Contract data reflects AgroBridge-coordinated supply agreements only.
        </p>
      </div>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Contract Details</DialogTitle>
            <DialogDescription>{selectedContract?.id}</DialogDescription>
          </DialogHeader>
          {selectedContract && (
            <div className="space-y-6 py-4">
              {/* Contract Overview */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Crop</p>
                  <p className="font-semibold text-lg">{selectedContract.crop}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Corridor</p>
                  <p className="font-semibold text-lg">{selectedContract.corridor}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Season</p>
                  <p className="font-medium">{selectedContract.season}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Delivery Window</p>
                  <p className="font-medium">{selectedContract.deliveryWindow}</p>
                </div>
              </div>

              {/* Volume Progress */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fulfilment Progress</span>
                  <span className="font-semibold">
                    {selectedContract.delivered} / {selectedContract.quantity} {selectedContract.unit}
                  </span>
                </div>
                <Progress
                  value={Math.round((selectedContract.delivered / selectedContract.quantity) * 100)}
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Expected Yield: {selectedContract.expectedYield}</span>
                  <span>{Math.round((selectedContract.delivered / selectedContract.quantity) * 100)}% delivered</span>
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-3 text-sm border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quality Specification</span>
                  <span className="font-medium">{selectedContract.qualitySpec}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Clusters Serving</span>
                  <span className="font-medium">{selectedContract.clustersServing}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Delivery</span>
                  <span className="font-medium">{selectedContract.lastDelivery}</span>
                </div>
                {selectedContract.nextDelivery && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next Scheduled Delivery</span>
                    <span className="font-medium">{selectedContract.nextDelivery}</span>
                  </div>
                )}
              </div>

              {/* Risk Note if applicable */}
              {"riskNote" in selectedContract && selectedContract.riskNote && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-800 text-sm">Risk Flag</p>
                      <p className="text-red-700 text-sm">{selectedContract.riskNote}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Badge */}
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge
                  className={
                    selectedContract.fulfillmentStatus === "completed"
                      ? "bg-gray-100 text-gray-700"
                      : selectedContract.fulfillmentStatus === "on-track"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                  }
                >
                  {selectedContract.fulfillmentStatus === "completed" ? (
                    <>
                      <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
                    </>
                  ) : selectedContract.fulfillmentStatus === "on-track" ? (
                    <>
                      <CheckCircle2 className="mr-1 h-3 w-3" /> On Track
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="mr-1 h-3 w-3" /> At Risk
                    </>
                  )}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
