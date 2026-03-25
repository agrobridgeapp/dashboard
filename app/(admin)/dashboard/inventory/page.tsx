"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Search, Plus, Warehouse, AlertTriangle, TrendingUp, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { toast } from "sonner"

const inventoryItems = [
  {
    id: "INV001",
    name: "NPK Fertilizer 15-15-15",
    category: "Fertilizer",
    quantity: 2500,
    unit: "kg",
    warehouse: "Kaduna Central",
    reorderLevel: 500,
    unitCost: 850,
    status: "in_stock",
  },
  {
    id: "INV002",
    name: "Maize Seeds (Hybrid)",
    category: "Seeds",
    quantity: 180,
    unit: "bags",
    warehouse: "Kano North",
    reorderLevel: 200,
    unitCost: 15000,
    status: "low_stock",
  },
  {
    id: "INV003",
    name: "Herbicide - Glyphosate",
    category: "Agrochemicals",
    quantity: 450,
    unit: "liters",
    warehouse: "Kaduna Central",
    reorderLevel: 100,
    unitCost: 3500,
    status: "in_stock",
  },
  {
    id: "INV004",
    name: "Urea Fertilizer",
    category: "Fertilizer",
    quantity: 75,
    unit: "bags",
    warehouse: "Plateau Hub",
    reorderLevel: 150,
    unitCost: 22000,
    status: "low_stock",
  },
  {
    id: "INV005",
    name: "Knapsack Sprayer",
    category: "Equipment",
    quantity: 45,
    unit: "units",
    warehouse: "Kano North",
    reorderLevel: 20,
    unitCost: 18000,
    status: "in_stock",
  },
  {
    id: "INV006",
    name: "Rice Seeds (FARO 44)",
    category: "Seeds",
    quantity: 0,
    unit: "bags",
    warehouse: "Kaduna Central",
    reorderLevel: 100,
    unitCost: 25000,
    status: "out_of_stock",
  },
]

const stockMovements = [
  {
    id: "MOV001",
    item: "NPK Fertilizer 15-15-15",
    type: "in",
    quantity: 500,
    date: "2024-01-15",
    reference: "PO-2024-001",
    by: "John Adebayo",
  },
  {
    id: "MOV002",
    item: "Maize Seeds (Hybrid)",
    type: "out",
    quantity: 50,
    date: "2024-01-14",
    reference: "SR-2024-045",
    by: "Field Agent - Kano",
  },
  {
    id: "MOV003",
    item: "Herbicide - Glyphosate",
    type: "out",
    quantity: 100,
    date: "2024-01-14",
    reference: "SR-2024-044",
    by: "Field Agent - Kaduna",
  },
  {
    id: "MOV004",
    item: "Urea Fertilizer",
    type: "in",
    quantity: 200,
    date: "2024-01-13",
    reference: "PO-2024-002",
    by: "Mary Okonkwo",
  },
  {
    id: "MOV005",
    item: "Knapsack Sprayer",
    type: "out",
    quantity: 10,
    date: "2024-01-12",
    reference: "SR-2024-042",
    by: "Field Agent - Plateau",
  },
]

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddStockOpen, setIsAddStockOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<(typeof inventoryItems)[0] | null>(null)
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const totalValue = inventoryItems.reduce((sum, item) => sum + item.quantity * item.unitCost, 0)
  const lowStockCount = inventoryItems.filter((i) => i.status === "low_stock" || i.status === "out_of_stock").length

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_stock":
        return <Badge className="bg-green-100 text-green-800">In Stock</Badge>
      case "low_stock":
        return <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>
      case "out_of_stock":
        return <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleViewItem = (item: (typeof inventoryItems)[0]) => {
    setSelectedItem(item)
    setIsEditMode(false)
    setIsViewDetailsOpen(true)
  }

  const handleEditItem = () => {
    setIsEditMode(true)
  }

  const handleSaveEdit = () => {
    setIsEditMode(false)
    setIsViewDetailsOpen(false)
    toast.success("Item updated successfully")
  }

  return (
    <DashboardLayout allowedRoles={["ops_admin", "super_admin"]}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Inventory Management</h1>
            <p className="text-muted-foreground">Track and manage agricultural inputs across warehouses</p>
          </div>
          <Dialog open={isAddStockOpen} onOpenChange={setIsAddStockOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#1B5E3C] hover:bg-[#154a30]">
                <Plus className="mr-2 h-4 w-4" />
                Add Stock
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Stock</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
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
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label>Warehouse</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select warehouse" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kaduna">Kaduna Central</SelectItem>
                        <SelectItem value="kano">Kano North</SelectItem>
                        <SelectItem value="plateau">Plateau Hub</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Reference Number</Label>
                  <Input placeholder="PO-2024-XXX" />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddStockOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    className="bg-[#1B5E3C] hover:bg-[#154a30]"
                    onClick={() => {
                      setIsAddStockOpen(false)
                      toast.success("Stock added successfully")
                    }}
                  >
                    Add Stock
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventoryItems.length}</div>
              <p className="text-xs text-muted-foreground">Across all categories</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{(totalValue / 1000000).toFixed(1)}M</div>
              <p className="text-xs text-muted-foreground">Current inventory value</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Warehouses</CardTitle>
              <Warehouse className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Active locations</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{lowStockCount}</div>
              <p className="text-xs text-muted-foreground">Items need reorder</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="inventory" className="space-y-4">
          <TabsList>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="movements">Stock Movements</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Fertilizer">Fertilizer</SelectItem>
                  <SelectItem value="Seeds">Seeds</SelectItem>
                  <SelectItem value="Agrochemicals">Agrochemicals</SelectItem>
                  <SelectItem value="Equipment">Equipment</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
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

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Warehouse</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Unit Cost</TableHead>
                      <TableHead>Status</TableHead>
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
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.warehouse}</TableCell>
                        <TableCell className="text-right">
                          {item.quantity.toLocaleString()} {item.unit}
                        </TableCell>
                        <TableCell className="text-right">₦{item.unitCost.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
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
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockMovements.map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell>
                          {movement.type === "in" ? (
                            <div className="flex items-center gap-2 text-green-600">
                              <ArrowDownLeft className="h-4 w-4" />
                              <span>Stock In</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-orange-600">
                              <ArrowUpRight className="h-4 w-4" />
                              <span>Stock Out</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{movement.item}</TableCell>
                        <TableCell className="text-right">{movement.quantity}</TableCell>
                        <TableCell className="text-muted-foreground">{movement.reference}</TableCell>
                        <TableCell>{movement.date}</TableCell>
                        <TableCell>{movement.by}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{isEditMode ? "Edit Inventory Item" : "Inventory Item Details"}</DialogTitle>
            </DialogHeader>
            {selectedItem && (
              <div className="space-y-6 py-4">
                {isEditMode ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Item Name</Label>
                      <Input defaultValue={selectedItem.name} />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select defaultValue={selectedItem.category}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Fertilizer">Fertilizer</SelectItem>
                          <SelectItem value="Seeds">Seeds</SelectItem>
                          <SelectItem value="Agrochemicals">Agrochemicals</SelectItem>
                          <SelectItem value="Equipment">Equipment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Quantity</Label>
                      <Input type="number" defaultValue={selectedItem.quantity} />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit</Label>
                      <Input defaultValue={selectedItem.unit} />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit Cost (₦)</Label>
                      <Input type="number" defaultValue={selectedItem.unitCost} />
                    </div>
                    <div className="space-y-2">
                      <Label>Reorder Level</Label>
                      <Input type="number" defaultValue={selectedItem.reorderLevel} />
                    </div>
                  </div>
                ) : (
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
                    <div className="col-span-2">
                      <Label className="text-muted-foreground">Status</Label>
                      <div className="mt-1">{getStatusBadge(selectedItem.status)}</div>
                    </div>
                  </div>
                )}
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)}>
                    {isEditMode ? "Cancel" : "Close"}
                  </Button>
                  {isEditMode ? (
                    <Button className="bg-[#1B5E3C] hover:bg-[#154a30]" onClick={handleSaveEdit}>
                      Save Changes
                    </Button>
                  ) : (
                    <Button className="bg-[#1B5E3C] hover:bg-[#154a30]" onClick={handleEditItem}>
                      Edit Item
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
