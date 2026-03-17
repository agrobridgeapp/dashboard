"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, MoreHorizontal, Filter, Plus, MapPin, Phone, Wheat } from "lucide-react"

const farmers = [
  {
    id: "FRM-001",
    name: "Musa Abdullahi",
    phone: "+234 803 456 7890",
    location: "Zaria, Kaduna",
    farmSize: 5,
    crops: ["Maize", "Soybean"],
    status: "active",
    contracts: 2,
    joinDate: "2023-03-15",
  },
  {
    id: "FRM-002",
    name: "Amina Ibrahim",
    phone: "+234 805 123 4567",
    location: "Giwa, Kaduna",
    farmSize: 3,
    crops: ["Rice", "Maize"],
    status: "active",
    contracts: 1,
    joinDate: "2023-05-20",
  },
  {
    id: "FRM-003",
    name: "Yusuf Bello",
    phone: "+234 807 890 1234",
    location: "Sabon Gari, Kaduna",
    farmSize: 8,
    crops: ["Sorghum", "Millet"],
    status: "active",
    contracts: 3,
    joinDate: "2023-01-10",
  },
  {
    id: "FRM-004",
    name: "Fatima Abubakar",
    phone: "+234 809 567 8901",
    location: "Igabi, Kaduna",
    farmSize: 2,
    crops: ["Maize"],
    status: "pending",
    contracts: 0,
    joinDate: "2024-01-05",
  },
  {
    id: "FRM-005",
    name: "Ibrahim Garba",
    phone: "+234 802 345 6789",
    location: "Makarfi, Kaduna",
    farmSize: 12,
    crops: ["Rice", "Soybean", "Maize"],
    status: "active",
    contracts: 4,
    joinDate: "2022-11-18",
  },
]

const statusStyles: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800 border-emerald-200",
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  inactive: "bg-gray-100 text-gray-800 border-gray-200",
}

export function FarmersDirectory() {
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredFarmers = statusFilter === "all" ? farmers : farmers.filter((f) => f.status === statusFilter)

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">2,847</p>
            <p className="text-sm text-muted-foreground">Total Farmers</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">2,450</p>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">156</p>
            <p className="text-sm text-muted-foreground">Pending Verification</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">12,450 ha</p>
            <p className="text-sm text-muted-foreground">Total Farm Area</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search farmers by name, location, or ID..." className="pl-9" />
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Farmer
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Farmer</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Farm Size</TableHead>
                <TableHead>Crops</TableHead>
                <TableHead>Contracts</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFarmers.map((farmer) => (
                <TableRow key={farmer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {farmer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{farmer.name}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {farmer.phone}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {farmer.location}
                    </div>
                  </TableCell>
                  <TableCell>{farmer.farmSize} ha</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Wheat className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{farmer.crops.join(", ")}</span>
                    </div>
                  </TableCell>
                  <TableCell>{farmer.contracts}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusStyles[farmer.status]}>
                      {farmer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit Details</DropdownMenuItem>
                        <DropdownMenuItem>View Contracts</DropdownMenuItem>
                        <DropdownMenuItem>Service History</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
