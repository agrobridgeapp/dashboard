import type { Contract } from "@/lib/data/types"
import type {
  ContractRepository,
  ContractListFilters,
  CreateContractInput,
  UpdateContractInput,
} from "../interfaces/contract-repository"
import { CONTRACTS } from "@/lib/data/mock-data"
import { getDemoStore, isDemoUser } from "@/lib/demo/demo-seed"

export class MockContractRepository implements ContractRepository {
  private data: Contract[]
  private isDemo: boolean

  constructor(userEmail?: string) {
    this.isDemo = isDemoUser(userEmail)
    if (this.isDemo) {
      this.data = getDemoStore().getContracts()
    } else {
      this.data = [...CONTRACTS]
    }
  }

  private persist(): void {
    if (this.isDemo) {
      getDemoStore().setContracts(this.data)
    }
  }

  async list(filters?: ContractListFilters): Promise<Contract[]> {
    let results = this.data

    if (filters?.offtakerId) {
      results = results.filter((c) => (c as any).offtakerId === filters.offtakerId)
    }

    if (filters?.corridorId) {
      results = results.filter((c) => c.corridorId === filters.corridorId)
    }

    if (filters?.season) {
      results = results.filter((c) => c.season === filters.season)
    }

    if (filters?.cropType) {
      results = results.filter((c) => c.cropType === filters.cropType)
    }

    if (filters?.status) {
      results = results.filter((c) => c.status === filters.status)
    }

    if (filters?.limit) {
      const offset = filters.offset || 0
      results = results.slice(offset, offset + filters.limit)
    }

    return Promise.resolve(results)
  }

  async getById(id: string): Promise<Contract | null> {
    const contract = this.data.find((c) => c.id === id)
    return Promise.resolve(contract || null)
  }

  async getByContractNumber(contractNumber: string): Promise<Contract | null> {
    const contract = this.data.find((c) => c.contractNumber === contractNumber)
    return Promise.resolve(contract || null)
  }

  async create(input: CreateContractInput): Promise<Contract> {
    const newContract: Contract = {
      ...input,
      id: `contract-${Date.now()}`,
      deliveredVolumeTons: 0,
      totalValue: input.contractedVolumeTons * input.pricePerTon,
      startDate: input.startDate.toISOString(),
      endDate: input.endDate.toISOString(),
      deliveryStartDate: input.deliveryStartDate.toISOString(),
      deliveryEndDate: input.deliveryEndDate.toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Contract

    this.data.push(newContract)
    this.persist() // Persist to demo store
    return Promise.resolve(newContract)
  }

  async update(id: string, data: UpdateContractInput): Promise<Contract> {
    const index = this.data.findIndex((c) => c.id === id)
    if (index === -1) {
      throw new Error(`Contract ${id} not found`)
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
    const index = this.data.findIndex((c) => c.id === id)
    if (index !== -1) {
      this.data.splice(index, 1)
      this.persist() // Persist to demo store
    }
    return Promise.resolve()
  }

  async findByOfftakerId(offtakerId: string): Promise<Contract[]> {
    return this.list({ offtakerId })
  }

  async findByCorridorId(corridorId: string): Promise<Contract[]> {
    return this.list({ corridorId })
  }

  async findBySeason(season: string): Promise<Contract[]> {
    return this.list({ season })
  }
}
