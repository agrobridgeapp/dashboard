// Repository interface for Contract entity

import type { Contract } from "@/lib/data/types"

export interface ContractRepository {
  list(filters?: ContractListFilters): Promise<Contract[]>
  getById(id: string): Promise<Contract | null>
  getByContractNumber(contractNumber: string): Promise<Contract | null>
  create(data: CreateContractInput): Promise<Contract>
  update(id: string, data: UpdateContractInput): Promise<Contract>
  delete(id: string): Promise<void>

  // Specific queries
  findByOfftakerId(offtakerId: string): Promise<Contract[]>
  findByCorridorId(corridorId: string): Promise<Contract[]>
  findBySeason(season: string): Promise<Contract[]>
}

export interface ContractListFilters {
  offtakerId?: string
  corridorId?: string
  season?: string
  cropType?: string
  status?: string
  search?: string
  limit?: number
  offset?: number
}

export interface CreateContractInput {
  contractNumber: string
  offtakerId: string
  cropType: string
  season: string
  contractedVolumeTons: number
  pricePerTon: number
  startDate: Date
  endDate: Date
  deliveryStartDate: Date
  deliveryEndDate: Date
  status: string
  corridorId: string
  tenantId: string
  qualityGrade?: string
  moistureContent?: number
  farmerClusterCount?: number
}

export interface UpdateContractInput {
  deliveredVolumeTons?: number
  status?: string
  qualityGrade?: string
  moistureContent?: number
}
