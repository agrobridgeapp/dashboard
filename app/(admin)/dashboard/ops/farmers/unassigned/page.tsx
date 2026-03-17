"use client"

import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { useDataStore } from "@/lib/data/data-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { UserPlus, MapPin, Sprout, Calendar, Phone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function UnassignedFarmersPage() {
  const { farmers, fieldAgents, updateFarmer } = useDataStore()
  const { toast } = useToast()
  const [selectedFarmer, setSelectedFarmer] = useState<string | null>(null)
  const [selectedAgent, setSelectedAgent] = useState<string>("")
  const [isAssigning, setIsAssigning] = useState(false)

  // Get farmers pending assignment (status = pending and no assigned agent)
  const unassignedFarmers = farmers.filter(
    (f) => f.status === "pending" && (f.assignedAgentId === "" || !f.assignedAgentId),
  )

  const handleAssignAgent = async () => {
    if (!selectedFarmer || !selectedAgent) return

    setIsAssigning(true)
    try {
      const farmer = farmers.find((f) => f.id === selectedFarmer)
      const agent = fieldAgents.find((a) => a.id === selectedAgent)

      if (farmer && agent) {
        updateFarmer(selectedFarmer, {
          assignedAgentId: selectedAgent,
          clusterId: agent.assignedClusterIds[0] || "", // Assign to agent's first cluster
          status: "verified", // Move to verified status once assigned
        })

        toast({
          title: "Agent Assigned",
          description: `${farmer.firstName} ${farmer.lastName} has been assigned to ${agent.name}`,
        })

        setSelectedFarmer(null)
        setSelectedAgent("")
      }
    } catch (error) {
      toast({
        title: "Assignment Failed",
        description: "Failed to assign field agent. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAssigning(false)
    }
  }

  return (
    <DashboardLayout allowedRoles={["ops_admin", "super_admin"]}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Unassigned Farmers</h1>
          <p className="text-muted-foreground">
            Farmers who registered directly and are waiting for field agent assignment
          </p>
        </div>

        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Pending Assignments
            </CardTitle>
            <CardDescription>
              {unassignedFarmers.length} {unassignedFarmers.length === 1 ? "farmer" : "farmers"} waiting for field agent
              assignment
            </CardDescription>
          </CardHeader>
          <CardContent>
            {unassignedFarmers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No unassigned farmers at the moment</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Farmer</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Farm Details</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unassignedFarmers.map((farmer) => (
                    <TableRow key={farmer.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {farmer.firstName} {farmer.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {farmer.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start gap-1">
                          <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                          <div className="text-sm">
                            <div>{farmer.village}</div>
                            <div className="text-muted-foreground">
                              {farmer.lga}, {farmer.state}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Sprout className="h-4 w-4 text-muted-foreground" />
                          <span>{farmer.farmingExperience} experience</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(farmer.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          Pending Assignment
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" onClick={() => setSelectedFarmer(farmer.id)}>
                              Assign Agent
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Assign Field Agent</DialogTitle>
                              <DialogDescription>
                                Assign {farmer.firstName} {farmer.lastName} to a field agent in {farmer.state}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label>Field Agent</Label>
                                <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select field agent" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {fieldAgents
                                      .filter((agent) => agent.status === "active")
                                      .map((agent) => (
                                        <SelectItem key={agent.id} value={agent.id}>
                                          {agent.name} ({agent.activeFarmerCount} farmers)
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button onClick={handleAssignAgent} disabled={!selectedAgent || isAssigning}>
                                {isAssigning ? "Assigning..." : "Confirm Assignment"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
