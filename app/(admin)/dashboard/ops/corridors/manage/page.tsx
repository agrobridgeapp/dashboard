"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, MapPin, Users, Building2, Settings, Edit, CheckCircle, AlertCircle } from "lucide-react"
import { useDataStore } from "@/lib/data/data-store"
import type { Corridor } from "@/lib/data/types"

export default function CorridorManagementPage() {
  const dataStore = useDataStore()

  const corridors = dataStore?.corridors || []
  const partners = dataStore?.partners || []
  const fieldAgents = dataStore?.fieldAgents || []

  const [selectedCorridor, setSelectedCorridor] = useState<Corridor | null>(corridors[0] || null)
  const [addCorridorOpen, setAddCorridorOpen] = useState(false)
  const [addClusterOpen, setAddClusterOpen] = useState(false)
  const [assignPartnerOpen, setAssignPartnerOpen] = useState(false)

  // Form states
  const [newCorridorName, setNewCorridorName] = useState("")
  const [newCorridorState, setNewCorridorState] = useState("")
  const [newClusterName, setNewClusterName] = useState("")
  const [newClusterLga, setNewClusterLga] = useState("")
  const [newClusterVillages, setNewClusterVillages] = useState("")
  const [selectedPartner, setSelectedPartner] = useState("")
  const [selectedServiceType, setSelectedServiceType] = useState("")

  const getCorridorStats = (corridor: Corridor) => {
    const totalFarmers = corridor.clusters?.reduce((sum, c) => sum + (c.farmerCount || 0), 0) || 0
    const totalHectares = corridor.clusters?.reduce((sum, c) => sum + (c.totalHectares || 0), 0) || 0
    const assignedAgents = corridor.clusters?.filter((c) => c.assignedAgentId).length || 0
    return { totalFarmers, totalHectares, assignedAgents }
  }

  const getAssignedPartnersForCorridor = (corridorId: string) => {
    return partners.filter((p) => p.corridorIds?.includes(corridorId))
  }

  const handleAddCorridor = () => {
    // In real implementation, this would call dataStore.addCorridor
    console.log("Adding corridor:", { name: newCorridorName, state: newCorridorState })
    setAddCorridorOpen(false)
    setNewCorridorName("")
    setNewCorridorState("")
  }

  const handleAddCluster = () => {
    console.log("Adding cluster:", {
      name: newClusterName,
      lga: newClusterLga,
      villages: newClusterVillages.split(",").map((v) => v.trim()),
    })
    setAddClusterOpen(false)
    setNewClusterName("")
    setNewClusterLga("")
    setNewClusterVillages("")
  }

  const handleAssignPartner = () => {
    console.log("Assigning partner:", { partnerId: selectedPartner, serviceType: selectedServiceType })
    setAssignPartnerOpen(false)
    setSelectedPartner("")
    setSelectedServiceType("")
  }

  return (
    <DashboardLayout allowedRoles={["ops_admin", "super_admin"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Corridor Management</h1>
            <p className="text-muted-foreground">Configure corridors, clusters, and partner assignments</p>
          </div>
          <Dialog open={addCorridorOpen} onOpenChange={setAddCorridorOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Corridor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Corridor</DialogTitle>
                <DialogDescription>Create a new operational corridor</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Corridor Name</Label>
                  <Input
                    placeholder="e.g., Kaduna North Corridor"
                    value={newCorridorName}
                    onChange={(e) => setNewCorridorName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Select value={newCorridorState} onValueChange={setNewCorridorState}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kaduna">Kaduna</SelectItem>
                      <SelectItem value="kano">Kano</SelectItem>
                      <SelectItem value="plateau">Plateau</SelectItem>
                      <SelectItem value="niger">Niger</SelectItem>
                      <SelectItem value="nasarawa">Nasarawa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddCorridorOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCorridor}>Create Corridor</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Corridor List */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Corridors</CardTitle>
              <CardDescription>Select a corridor to manage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {corridors.map((corridor) => {
                const stats = getCorridorStats(corridor)
                const isSelected = selectedCorridor?.id === corridor.id

                return (
                  <button
                    key={corridor.id}
                    onClick={() => setSelectedCorridor(corridor)}
                    className={`w-full p-4 rounded-lg border text-left transition-colors ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border/50 hover:border-border hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{corridor.name}</h3>
                          <Badge
                            variant="outline"
                            className={
                              corridor.status === "active"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-700"
                            }
                          >
                            {corridor.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{corridor.state}</p>
                      </div>
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                      <div>
                        <div className="text-sm font-medium">{stats.totalFarmers}</div>
                        <div className="text-xs text-muted-foreground">Farmers</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{stats.totalHectares}</div>
                        <div className="text-xs text-muted-foreground">Hectares</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{corridor.clusters?.length || 0}</div>
                        <div className="text-xs text-muted-foreground">Clusters</div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </CardContent>
          </Card>

          {/* Corridor Details */}
          <div className="lg:col-span-2 space-y-6">
            {selectedCorridor ? (
              <>
                <Card className="border-border/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{selectedCorridor.name}</CardTitle>
                        <CardDescription>
                          {selectedCorridor.state} • {selectedCorridor.status}
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                    </div>
                  </CardHeader>
                </Card>

                <Tabs defaultValue="clusters">
                  <TabsList>
                    <TabsTrigger value="clusters">Clusters</TabsTrigger>
                    <TabsTrigger value="partners">Partners</TabsTrigger>
                    <TabsTrigger value="agents">Field Agents</TabsTrigger>
                  </TabsList>

                  <TabsContent value="clusters" className="mt-4">
                    <Card className="border-border/50">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Clusters</CardTitle>
                          <Dialog open={addClusterOpen} onOpenChange={setAddClusterOpen}>
                            <DialogTrigger asChild>
                              <Button size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Cluster
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Add New Cluster</DialogTitle>
                                <DialogDescription>Create a cluster within {selectedCorridor.name}</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label>Cluster Name</Label>
                                  <Input
                                    placeholder="e.g., Zaria Central"
                                    value={newClusterName}
                                    onChange={(e) => setNewClusterName(e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>LGA</Label>
                                  <Input
                                    placeholder="Local Government Area"
                                    value={newClusterLga}
                                    onChange={(e) => setNewClusterLga(e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Villages (comma-separated)</Label>
                                  <Textarea
                                    placeholder="Tudun Wada, Samaru, Hanwa"
                                    value={newClusterVillages}
                                    onChange={(e) => setNewClusterVillages(e.target.value)}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setAddClusterOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleAddCluster}>Create Cluster</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedCorridor.clusters?.map((cluster) => {
                            const agent = fieldAgents.find((a) => a.id === cluster.assignedAgentId)

                            return (
                              <div key={cluster.id} className="p-4 border border-border/50 rounded-lg">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-medium">{cluster.name}</h4>
                                    <p className="text-sm text-muted-foreground">{cluster.villages?.join(", ")}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 mt-3">
                                  <div>
                                    <div className="text-sm font-medium">{cluster.farmerCount || 0}</div>
                                    <div className="text-xs text-muted-foreground">Farmers</div>
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium">{cluster.totalHectares || 0}</div>
                                    <div className="text-xs text-muted-foreground">Hectares</div>
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium flex items-center gap-1">
                                      {agent ? (
                                        <>
                                          <CheckCircle className="h-3 w-3 text-emerald-500" />
                                          {agent.name?.split(" ")[0]}
                                        </>
                                      ) : (
                                        <>
                                          <AlertCircle className="h-3 w-3 text-amber-500" />
                                          Unassigned
                                        </>
                                      )}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Agent</div>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="partners" className="mt-4">
                    <Card className="border-border/50">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Assigned Partners</CardTitle>
                          <Dialog open={assignPartnerOpen} onOpenChange={setAssignPartnerOpen}>
                            <DialogTrigger asChild>
                              <Button size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Assign Partner
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Assign Partner</DialogTitle>
                                <DialogDescription>
                                  Assign a service partner to {selectedCorridor.name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label>Partner</Label>
                                  <Select value={selectedPartner} onValueChange={setSelectedPartner}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select partner" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {partners.map((partner) => (
                                        <SelectItem key={partner.id} value={partner.id}>
                                          {partner.companyName}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Service Type</Label>
                                  <Select value={selectedServiceType} onValueChange={setSelectedServiceType}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select service" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="land_prep">Land Preparation</SelectItem>
                                      <SelectItem value="planting">Planting</SelectItem>
                                      <SelectItem value="fertilizer">Fertilizer</SelectItem>
                                      <SelectItem value="harvest">Harvest</SelectItem>
                                      <SelectItem value="transport">Transport</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setAssignPartnerOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleAssignPartner}>Assign Partner</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {getAssignedPartnersForCorridor(selectedCorridor.id).map((partner) => (
                            <div key={partner.id} className="p-4 border border-border/50 rounded-lg">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                    <Building2 className="h-5 w-5 text-primary" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{partner.companyName}</h4>
                                    <p className="text-sm text-muted-foreground capitalize">
                                      {partner.partnerType?.replace("_", " ")}
                                    </p>
                                  </div>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={
                                    partner.status === "active"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : "bg-slate-100 text-slate-700"
                                  }
                                >
                                  {partner.status}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-3 gap-4 mt-3">
                                <div>
                                  <div className="text-sm font-medium">{partner.completedJobs || 0}</div>
                                  <div className="text-xs text-muted-foreground">Jobs Done</div>
                                </div>
                                <div>
                                  <div className="text-sm font-medium">{partner.averageRating || 0}/5</div>
                                  <div className="text-xs text-muted-foreground">Rating</div>
                                </div>
                                <div>
                                  <div className="text-sm font-medium">{partner.slaAdherenceRate || 0}%</div>
                                  <div className="text-xs text-muted-foreground">SLA Rate</div>
                                </div>
                              </div>
                            </div>
                          ))}
                          {getAssignedPartnersForCorridor(selectedCorridor.id).length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                              <Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p>No partners assigned yet</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="agents" className="mt-4">
                    <Card className="border-border/50">
                      <CardHeader>
                        <CardTitle className="text-lg">Field Agents</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {fieldAgents
                            .filter((a) => a.corridorId === selectedCorridor.id)
                            .map((agent) => (
                              <div key={agent.id} className="p-4 border border-border/50 rounded-lg">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                                      <Users className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                      <h4 className="font-medium">{agent.name}</h4>
                                      <p className="text-sm text-muted-foreground">{agent.phone}</p>
                                    </div>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className={
                                      agent.status === "active"
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-slate-100 text-slate-700"
                                    }
                                  >
                                    {agent.status}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-3 gap-4 mt-3">
                                  <div>
                                    <div className="text-sm font-medium">{agent.activeFarmerCount || 0}</div>
                                    <div className="text-xs text-muted-foreground">Farmers</div>
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium">{agent.completedVisitsThisWeek || 0}</div>
                                    <div className="text-xs text-muted-foreground">Visits/Week</div>
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium">{agent.verificationAccuracy || 0}%</div>
                                    <div className="text-xs text-muted-foreground">Accuracy</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <Card className="border-border/50">
                <CardContent className="p-12 text-center">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Select a corridor to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
