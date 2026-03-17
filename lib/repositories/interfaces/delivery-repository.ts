// Repository interface for Delivery entity

import type { Delivery } from "@/lib/data/types"

export interface DeliveryRepository {
  list(filters?: DeliveryListFilters): Promise<Delivery[]>
  getById(id: string): Promise<Delivery | null>
  create(data: CreateDeliveryInput): Promise<Delivery>
  update(id: string, data: UpdateDeliveryInput): Promise<Delivery>
  delete(id: string): Promise<void>

  // Specific queries
  findByContractId(contractId: string): Promise<Delivery[]>
  findByFarmerId(farmerId: string): Promise<Delivery[]>
  findByStatus(status: string): Promise<Delivery[]>
}

export interface DeliveryListFilters {
  contractId?: string
  farmerId?: string
  status?: string
  dateFrom?: Date
  dateTo?: Date
  limit?: number
  offset?: number
}

export interface CreateDeliveryInput {
  contractId: string
  farmerId: string
  quantityTons: number
  qualityGrade: string
  deliveryDate: Date
  status: string
  tenantId: string
  moistureContent?: number
  vehicleNumber?: string
  driverName?: string
  driverPhone?: string
  warehouseLocation?: string
}

export interface UpdateDeliveryInput {
  status?: string
  verifiedBy?: string
  verifiedAt?: Date
  qualityGrade?: string
  moistureContent?: number
}
