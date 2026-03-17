"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MoreHorizontal, Filter, Tractor, Droplets, Package } from "lucide-react"

const requests = [
  {
    id: "REQ-001",
    farmer: "Musa Abdullahi",
    location: "Zaria, Kaduna",
    service: "Plowing",
    type: "mechanization",
    farmSize: "5 ha",
    status: "pending",
    date: "2024-01-15",
  },
  {
    id: "REQ-002",
    farmer: "Amina Ibrahim",
    location: "Giwa, Kaduna",
    service: "Seeds + Fertilizer",
    type: "inputs",
    farmSize: "3 ha",
    status: "assigned",
    date: "2024-01-15",
  },
  {
    id: "REQ-003",
    farmer: "Yusuf Bello",
    location: "Sabon Gari, Kaduna",
    service: "Irrigation Setup",
    type: "mechanization",
    farmSize: "8 ha",
    status: "in-progress",
    date: "2024-01-14",
  },
  {
    id: "REQ-004",
    farmer: "Fatima Abubakar",
    location: "Igabi, Kaduna",
    service: "Herbicides",
    type: "inputs",
    farmSize: "2 ha",
    status: "completed",
    date: "2024-01-14",
  },
  {
    id: "REQ-005",
    farmer: "Ibrahim Garba",
    location: "Makarfi, Kaduna",
    service: "Harvesting",
    type: "mechanization",
    farmSize: "12 ha",
    status: "pending",
    date: "2024-01-13",
  },
]

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  assigned: "bg-blue-100 text-blue-800 border-blue-200",
  "in-progress": "bg-primary/10 text-primary border-primary/20",
  completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
}

const typeIcons: Record<string, typeof Tractor> = {
  mechanization: Tractor,
  inputs: Package,
  irrigation: Droplets,
}

export function ServiceRequestsTable() {
  const [filter, setFilter] = useState("all")

  const filteredRequests = filter === "all" ? requests : requests.filter((r) => r.status === filter)

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Service Requests</CardTitle>
            <CardDescription>Manage and assign incoming service requests</CardDescription>
          </div>
          <Button>New Request</Button>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search requests..." className="pl-9" />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Request ID</TableHead>
              <TableHead>Farmer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Farm Size</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.map((request) => {
              const TypeIcon = typeIcons[request.type] || Package
              return (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{request.farmer}</p>
                      <p className="text-xs text-muted-foreground">{request.location}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TypeIcon className="h-4 w-4 text-muted-foreground" />
                      {request.service}
                    </div>
                  </TableCell>
                  <TableCell>{request.farmSize}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusStyles[request.status]}>
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Assign Partner</DropdownMenuItem>
                        <DropdownMenuItem>Update Status</DropdownMenuItem>
                        <DropdownMenuItem>Contact Farmer</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
