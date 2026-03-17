"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MoreHorizontal, Plus, Building2, Star, MapPin, Tractor, Package, ShoppingCart } from "lucide-react"

const partners = {
  mechanization: [
    {
      id: "PTR-001",
      name: "AgriMech Services",
      location: "Kaduna",
      rating: 4.8,
      services: ["Plowing", "Harvesting", "Spraying"],
      jobsCompleted: 245,
      status: "active",
    },
    {
      id: "PTR-002",
      name: "Kaduna Tractors Ltd",
      location: "Zaria",
      rating: 4.5,
      services: ["Plowing", "Harrowing"],
      jobsCompleted: 189,
      status: "active",
    },
  ],
  inputs: [
    {
      id: "PTR-003",
      name: "SeedPro Nigeria",
      location: "Lagos",
      rating: 4.7,
      services: ["Seeds", "Fertilizers"],
      jobsCompleted: 312,
      status: "active",
    },
    {
      id: "PTR-004",
      name: "AgriChem Solutions",
      location: "Kano",
      rating: 4.3,
      services: ["Herbicides", "Pesticides", "Fungicides"],
      jobsCompleted: 156,
      status: "active",
    },
  ],
  buyers: [
    {
      id: "PTR-005",
      name: "MaizeCo Nigeria Ltd",
      location: "Lagos",
      rating: 4.9,
      commodities: ["Maize", "Sorghum"],
      volume: "500 MT",
      status: "active",
    },
    {
      id: "PTR-006",
      name: "SoyPro Foods",
      location: "Kaduna",
      rating: 4.6,
      commodities: ["Soybean"],
      volume: "200 MT",
      status: "active",
    },
  ],
}

export function PartnersDirectory() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <Tractor className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">24</p>
              <p className="text-sm text-muted-foreground">Mechanization</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="rounded-lg bg-emerald-100 p-3">
              <Package className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">18</p>
              <p className="text-sm text-muted-foreground">Input Suppliers</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="rounded-lg bg-blue-100 p-3">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">Buyers</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="rounded-lg bg-amber-100 p-3">
              <Star className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">4.6</p>
              <p className="text-sm text-muted-foreground">Avg. Rating</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="mechanization" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList>
            <TabsTrigger value="mechanization">Mechanization</TabsTrigger>
            <TabsTrigger value="inputs">Input Suppliers</TabsTrigger>
            <TabsTrigger value="buyers">Buyers</TabsTrigger>
          </TabsList>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search partners..." className="pl-9 w-64" />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Partner
            </Button>
          </div>
        </div>

        <TabsContent value="mechanization">
          <Card className="border-border/50">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Partner</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Services</TableHead>
                    <TableHead>Jobs Completed</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partners.mechanization.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-primary/10 p-2">
                            <Building2 className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium">{partner.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {partner.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {partner.services.map((service) => (
                            <Badge key={service} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{partner.jobsCompleted}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <span>{partner.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                          {partner.status}
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
                            <DropdownMenuItem>View Jobs</DropdownMenuItem>
                            <DropdownMenuItem>Contact</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inputs">
          <Card className="border-border/50">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Partner</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Orders Fulfilled</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partners.inputs.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-emerald-100 p-2">
                            <Package className="h-4 w-4 text-emerald-600" />
                          </div>
                          <span className="font-medium">{partner.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {partner.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {partner.services.map((service) => (
                            <Badge key={service} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{partner.jobsCompleted}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <span>{partner.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                          {partner.status}
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
                            <DropdownMenuItem>View Orders</DropdownMenuItem>
                            <DropdownMenuItem>Contact</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="buyers">
          <Card className="border-border/50">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Buyer</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Commodities</TableHead>
                    <TableHead>Contracted Volume</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partners.buyers.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-blue-100 p-2">
                            <ShoppingCart className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-medium">{partner.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {partner.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {partner.commodities.map((commodity) => (
                            <Badge key={commodity} variant="secondary" className="text-xs">
                              {commodity}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{partner.volume}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <span>{partner.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                          {partner.status}
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
                            <DropdownMenuItem>View Contracts</DropdownMenuItem>
                            <DropdownMenuItem>Contact</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
