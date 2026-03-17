import type { Farmer } from "@/lib/data/types"
import type {
  FarmerRepository,
  FarmerListFilters,
  CreateFarmerInput,
  UpdateFarmerInput,
} from "../interfaces/farmer-repository"
import { FARMERS } from "@/lib/data/mock-data"
import { getDemoStore, isDemoUser } from "@/lib/demo/demo-seed"

export class MockFarmerRepository implements FarmerRepository {
  private data: Farmer[]
  private isDemo: boolean

  constructor(userEmail?: string) {
    this.isDemo = isDemoUser(userEmail)
    if (this.isDemo) {
      this.data = getDemoStore().getFarmers()
    } else {
      this.data = [...FARMERS]
    }
  }

  private persist(): void {
    if (this.isDemo) {
      getDemoStore().setFarmers(this.data)
    }
  }

  async list(filters?: FarmerListFilters): Promise<Farmer[]> {
    let results = this.data

    if (filters?.agentId) {
      results = results.filter((f) => (f as any).agentId === filters.agentId)
    }

    if (filters?.corridorId) {
      results = results.filter((f) => f.corridorId === filters.corridorId)
    }

    if (filters?.clusterId) {
      results = results.filter((f) => f.clusterId === filters.clusterId)
    }

    if (filters?.status) {
      results = results.filter((f) => f.status === filters.status)
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      results = results.filter(
        (f) =>
          f.firstName.toLowerCase().includes(searchLower) ||
          f.lastName.toLowerCase().includes(searchLower) ||
          f.phone.includes(searchLower),
      )
    }

    if (filters?.limit) {
      const offset = filters.offset || 0
      results = results.slice(offset, offset + filters.limit)
    }

    return Promise.resolve(results)
  }

  async getById(id: string): Promise<Farmer | null> {
    const farmer = this.data.find((f) => f.id === id)
    return Promise.resolve(farmer || null)
  }

  async create(input: CreateFarmerInput): Promise<Farmer> {
    const newFarmer: Farmer = {
      ...input,
      id: `farmer-${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Farmer

    this.data.push(newFarmer)
    this.persist() // Persist to demo store
    return Promise.resolve(newFarmer)
  }

  async update(id: string, data: UpdateFarmerInput): Promise<Farmer> {
    const index = this.data.findIndex((f) => f.id === id)
    if (index === -1) {
      throw new Error(`Farmer ${id} not found`)
    }

    this.data[index] = {
      ...this.data[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }

    this.persist() // Persist to demo store
    return Promise.resolve(this.data[index])
  }

  async delete(id: string): Promise<void> {
    const index = this.data.findIndex((f) => f.id === id)
    if (index !== -1) {
      this.data.splice(index, 1)
      this.persist() // Persist to demo store
    }
    return Promise.resolve()
  }

  async findByAgentId(agentId: string): Promise<Farmer[]> {
    return this.list({ agentId })
  }

  async findByCorridorId(corridorId: string): Promise<Farmer[]> {
    return this.list({ corridorId })
  }

  async findByPhone(phone: string): Promise<Farmer | null> {
    const farmer = this.data.find((f) => f.phone === phone)
    return Promise.resolve(farmer || null)
  }
}
