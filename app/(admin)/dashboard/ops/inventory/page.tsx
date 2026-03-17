"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Search, Plus, AlertTriangle, TrendingUp, Warehouse, Truck, Info } from "lucide-react"

// Demo inventory data
const inventoryItems = [
  {
    id: "INV-001",
    name: "NPK Fertilizer 15-15-15",
    category: "Fertilizer",
    quantity: 2500,
    unit: "kg",
    reorderLevel: 500,
    warehouse: "Kano Central",
    status: "in_stock",
    lastRestocked: "2024-01-10",
    unitCost: 850,
  },
  {
    id: "INV-002",
    name: "Urea Fertilizer",
    category: "Fertilizer",
    quantity: 1800,
    unit: "kg",
    reorderLevel: 400,
    warehouse: "Kano Central",
    status: "in_stock",
    lastRestocked: "2024-01-08",
    unitCost: 720,
  },
  {
    id: "INV-003",
    name: "Maize Seeds (Hybrid)",
    category: "Seeds",
    quantity: 320,
    unit: "bags",
    reorderLevel: 100,
    warehouse: "Kaduna Hub",
    status: "in_stock",
    lastRestocked: "2024-01-05",
    unitCost: 15000,
  },
  {
    id: "INV-004",
    name: "Rice Seeds (FARO 44)",
    category: "Seeds",
    quantity: 85,
    unit: "bags",
    reorderLevel: 100,
    warehouse: "Kano Central",
    status: "low_stock",
    lastRestocked: "2023-12-20",
    unitCost: 18000,
  },
  {
    id: "INV-005",
    name: "Herbicide (Glyphosate)",
    category: "Agrochemicals",
    quantity: 450,
    unit: "liters",
    reorderLevel: 200,
    warehouse: "Kaduna Hub",
    status: "in_stock",
    lastRestocked: "2024-01-12",
    unitCost: 3500,
  },
  {
    id: "INV-006",
    name: "Insecticide (Cypermethrin)",
    category: "Agrochemicals",
    quantity: 120,
    unit: "liters",
    reorderLevel: 150,
    warehouse: "Kano Central",
    status: "low_stock",
    lastRestocked: "2023-12-15",
    unitCost: 4200,
  },
  {
    id: "INV-007",
    name: "Knapsack Sprayers",
    category: "Equipment",
    quantity: 45,
    unit: "units",
    reorderLevel: 20,
    warehouse: "Kaduna Hub",
    status: "in_stock",
    lastRestocked: "2024-01-02",
    unitCost: 25000,
  },
  {
    id: "INV-008",
    name: "Irrigation Pipes (50m)",
    category: "Equipment",
    quantity: 8,
    unit: "rolls",
    reorderLevel: 15,
    warehouse: "Kano Central",
    status: "low_stock",
    lastRestocked: "2023-11-28",
    unitCost: 45000,
  },
]

const stockMovements = [
  {
    id: "MOV-001",
    item: "NPK Fertilizer 15-15-15",
    type: "out",
    quantity: 500,
    destination: "Farmer: Aminu Yusuf",
    date: "2024-01-15",
    handler: "Field Agent: Ibrahim",
  },
  {
    id: "MOV-002",
    item: "Maize Seeds (Hybrid)",
    type: "out",
    quantity: 20,
    destination: "Farmer: Fatima Bello",
    date: "2024-01-14",
    handler: "Field Agent: Aisha",
  },
  {
    id: "MOV-003",
    item: "Urea Fertilizer",
    type: "in",
    quantity: 1000,
    destination: "Supplier: AgriChem Ltd",
    date: "2024-01-12",
    handler: "Warehouse Manager",
  },
  {
    id: "MOV-004",
    item: "Herbicide (Glyphosate)",
    type: "out",
    quantity: 50,
    destination: "Partner: GreenSpray Services",
    date: "2024-01-11",
    handler: "Field Agent: Musa",
  },
  {
    id: "MOV-005",
    item: "NPK Fertilizer 15-15-15",
    type: "in",
    quantity: 2000,
    destination: "Supplier: FertilCo Nigeria",
    date: "2024-01-10",
    handler: "Warehouse Manager",
  },
]

export default function InventoryPage() {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [addStockOpen, setAddStockOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<(typeof inventoryItems)[0] | null>(null)
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) || item.id.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const totalValue = inventoryItems.reduce((sum, item) => sum + item.quantity * item.unitCost, 0)
  const lowStockCount = inventoryItems.filter((item) => item.status === "low_stock").length
  const categories = [...new Set(inventoryItems.map((item) => item.category))]

  const handleViewItem = (item: (typeof inventoryItems)[0]) => {
    setSelectedItem(item)
    setIsViewDetailsOpen(true)
  }

  return (
    <DashboardLayout allowedRoles={["ops_admin", "super_admin"]}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Partner Inventory Visibility</h1>
            <p className="text-muted-foreground mt-1">Monitor partner-managed inventory across corridors</p>
            {/* Helper text per spec */}
            <div className="flex items-center gap-2 mt-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-md">
              <Info className="h-4 w-4 text-amber-600 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                Visibility into partner-managed inventory only. AgroBridge does not own inventory.
              </p>
            </div>
          </div>
          <Dialog open={addStockOpen} onOpenChange={setAddStockOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#1B5E3C] hover:bg-[#154a30]">
                <Plus className="mr-2 h-4 w-4" />
                Add Stock
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Stock</DialogTitle>
                <DialogDescription>Record new inventory received at warehouse</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Item</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select item" />
                    </SelectTrigger>
                    <SelectContent>
                      {inventoryItems.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Quantity</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Unit Cost (₦)</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Warehouse</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kano">Kano Central</SelectItem>
                      <SelectItem value="kaduna">Kaduna Hub</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Supplier</Label>
                  <Input placeholder="Enter supplier name" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddStockOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-[#1B5E3C] hover:bg-[#154a30]" onClick={() => setAddStockOpen(false)}>
                  Add Stock
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventoryItems.length}</div>
              <p className="text-xs text-muted-foreground">Across {categories.length} categories</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{(totalValue / 1000000).toFixed(1)}M</div>
              <p className="text-xs text-muted-foreground">Current stock value</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Warehouses</CardTitle>
              <Warehouse className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Active locations</p>
            </CardContent>
          </Card>
          <Card className={lowStockCount > 0 ? "border-amber-200 bg-amber-50" : ""}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Alerts</CardTitle>
              <AlertTriangle className={`h-4 w-4 ${lowStockCount > 0 ? "text-amber-600" : "text-muted-foreground"}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${lowStockCount > 0 ? "text-amber-600" : ""}`}>{lowStockCount}</div>
              <p className="text-xs text-muted-foreground">Items need reorder</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="inventory" className="space-y-4">
          <TabsList>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="movements">Stock Movements</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search items..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="in_stock">In Stock</SelectItem>
                      <SelectItem value="low_stock">Low Stock</SelectItem>
                      <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Inventory Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Warehouse</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.id}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {item.quantity.toLocaleString()} {item.unit}
                            </p>
                            <p className="text-xs text-muted-foreground">Reorder at {item.reorderLevel}</p>
                          </div>
                        </TableCell>
                        <TableCell>{item.warehouse}</TableCell>
                        <TableCell>
                          <Badge
                            variant={item.status === "in_stock" ? "default" : "destructive"}
                            className={
                              item.status === "in_stock" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                            }
                          >
                            {item.status === "in_stock" ? "In Stock" : "Low Stock"}
                          </Badge>
                        </TableCell>
                        <TableCell>₦{(item.quantity * item.unitCost).toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleViewItem(item)}>
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="movements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Stock Movements</CardTitle>
                <CardDescription>Track incoming and outgoing inventory</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Source/Destination</TableHead>
                      <TableHead>Handler</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockMovements.map((mov) => (
                      <TableRow key={mov.id}>
                        <TableCell className="font-mono text-xs">{mov.id}</TableCell>
                        <TableCell className="font-medium">{mov.item}</TableCell>
                        <TableCell>
                          <Badge
                            variant={mov.type === "in" ? "default" : "secondary"}
                            className={mov.type === "in" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}
                          >
                            <Truck className="mr-1 h-3 w-3" />
                            {mov.type === "in" ? "Stock In" : "Stock Out"}
                          </Badge>
                        </TableCell>
                        <TableCell>{mov.quantity}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{mov.destination}</TableCell>
                        <TableCell>{mov.handler}</TableCell>
                        <TableCell>{mov.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* View Details Dialog */}
        <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Inventory Item Details</DialogTitle>
              <DialogDescription>Complete information about this inventory item</DialogDescription>
            </DialogHeader>
            {selectedItem && (
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-muted-foreground">Item Name</Label>
                    <p className="text-lg font-semibold mt-1">{selectedItem.name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Item ID</Label>
                    <p className="text-lg font-semibold mt-1">{selectedItem.id}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Category</Label>
                    <p className="text-lg font-semibold mt-1">{selectedItem.category}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Warehouse</Label>
                    <p className="text-lg font-semibold mt-1">{selectedItem.warehouse}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Current Quantity</Label>
                    <p className="text-lg font-semibold mt-1">
                      {selectedItem.quantity.toLocaleString()} {selectedItem.unit}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Reorder Level</Label>
                    <p className="text-lg font-semibold mt-1">
                      {selectedItem.reorderLevel} {selectedItem.unit}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Unit Cost</Label>
                    <p className="text-lg font-semibold mt-1">₦{selectedItem.unitCost.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Total Value</Label>
                    <p className="text-lg font-semibold mt-1">
                      ₦{(selectedItem.quantity * selectedItem.unitCost).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Last Restocked</Label>
                    <p className="text-lg font-semibold mt-1">{selectedItem.lastRestocked}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="mt-1">
                      <Badge
                        variant={selectedItem.status === "in_stock" ? "default" : "destructive"}
                        className={
                          selectedItem.status === "in_stock"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }
                      >
                        {selectedItem.status === "in_stock" ? "In Stock" : "Low Stock"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)}>
                    Close
                  </Button>
                  <Button className="bg-[#1B5E3C] hover:bg-[#154a30]">Edit Item</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
