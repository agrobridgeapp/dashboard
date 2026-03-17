// Repository interface for CropCycle entity

import type { CropCycle } from "@/lib/data/types"

export interface CropCycleRepository {
  list(filters?: CropCycleListFilters): Promise<CropCycle[]>
  getById(id: string): Promise<CropCycle | null>
  create(data: CreateCropCycleInput): Promise<CropCycle>
  update(id: string, data: UpdateCropCycleInput): Promise<CropCycle>
  delete(id: string): Promise<void>

  // Specific queries
  findByFarmerId(farmerId: string): Promise<CropCycle[]>
  findByLandPlotId(landPlotId: string): Promise<CropCycle[]>
  findBySeason(season: string): Promise<CropCycle[]>
}

export interface CropCycleListFilters {
  farmerId?: string
  landPlotId?: string
  season?: string
  cropType?: string
  status?: string
  limit?: number
  offset?: number
}

export interface CreateCropCycleInput {
  farmerId: string
  landPlotId: string
  cropType: string
  season: string
  plantingDate: Date
  expectedHarvestDate: Date
  status: string
  tenantId: string
  yieldTons?: number
}

export interface UpdateCropCycleInput {
  status?: string
  actualHarvestDate?: Date
  yieldTons?: number
}
