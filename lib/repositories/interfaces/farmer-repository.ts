// Repository interface for Farmer entity
// Framework-agnostic data access layer

import type { Farmer } from "@/lib/data/types"

export interface FarmerRepository {
  list(filters?: FarmerListFilters): Promise<Farmer[]>
  getById(id: string): Promise<Farmer | null>
  create(data: CreateFarmerInput): Promise<Farmer>
  update(id: string, data: UpdateFarmerInput): Promise<Farmer>
  delete(id: string): Promise<void>

  // Specific queries
  findByAgentId(agentId: string): Promise<Farmer[]>
  findByCorridorId(corridorId: string): Promise<Farmer[]>
  findByPhone(phone: string): Promise<Farmer | null>
}

export interface FarmerListFilters {
  agentId?: string
  corridorId?: string
  clusterId?: string
  seasonId?: string
  status?: string
  search?: string
  limit?: number
  offset?: number
}

export interface CreateFarmerInput {
  firstName: string
  lastName: string
  phone: string
  village: string
  lga: string
  state: string
  farmingExperience: string
  agentId: string
  tenantId: string
  gender?: "male" | "female"
  email?: string
  corridorId?: string
  clusterId?: string
  seasonId?: string
}

export interface UpdateFarmerInput {
  firstName?: string
  lastName?: string
  phone?: string
  village?: string
  lga?: string
  state?: string
  farmingExperience?: string
  status?: string
  bankName?: string
  accountNumber?: string
  totalLandHectares?: number
  crops?: string[]
}
