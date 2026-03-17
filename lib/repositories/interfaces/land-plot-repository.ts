// Repository interface for LandPlot entity

import type { LandPlot } from "@/lib/data/types"

export interface LandPlotRepository {
  list(filters?: LandPlotListFilters): Promise<LandPlot[]>
  getById(id: string): Promise<LandPlot | null>
  create(data: CreateLandPlotInput): Promise<LandPlot>
  update(id: string, data: UpdateLandPlotInput): Promise<LandPlot>
  delete(id: string): Promise<void>

  // Specific queries
  findByFarmerId(farmerId: string): Promise<LandPlot[]>
  getTotalHectaresByFarmer(farmerId: string): Promise<number>
}

export interface LandPlotListFilters {
  farmerId?: string
  tenantId?: string
  status?: string
  limit?: number
  offset?: number
}

export interface CreateLandPlotInput {
  farmerId: string
  plotNumber: string
  sizeHectares: number
  tenantId: string
  soilType?: string
  irrigationType?: string
  latitude?: number
  longitude?: number
}

export interface UpdateLandPlotInput {
  sizeHectares?: number
  soilType?: string
  irrigationType?: string
  latitude?: number
  longitude?: number
}
