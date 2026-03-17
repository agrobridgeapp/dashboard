import type { Delivery } from "@/lib/data/types"
import type {
  DeliveryRepository,
  DeliveryListFilters,
  CreateDeliveryInput,
  UpdateDeliveryInput,
} from "../interfaces/delivery-repository"
import { DELIVERIES } from "@/lib/data/mock-data"
import { getDemoStore, isDemoUser } from "@/lib/demo/demo-seed"

export class MockDeliveryRepository implements DeliveryRepository {
  private data: Delivery[]
  private isDemo: boolean

  constructor(userEmail?: string) {
    this.isDemo = isDemoUser(userEmail)
    if (this.isDemo) {
      this.data = getDemoStore().getDeliveries()
    } else {
      this.data = [...DELIVERIES]
    }
  }

  private persist(): void {
    if (this.isDemo) {
      getDemoStore().setDeliveries(this.data)
    }
  }

  async list(filters?: DeliveryListFilters): Promise<Delivery[]> {
    let results = this.data

    if (filters?.contractId) {
      results = results.filter((d) => d.contractId === filters.contractId)
    }

    if (filters?.farmerId) {
      results = results.filter((d) => d.farmerId === filters.farmerId)
    }

    if (filters?.status) {
      results = results.filter((d) => d.status === filters.status)
    }

    if (filters?.dateFrom) {
      results = results.filter((d) => new Date(d.deliveryDate) >= filters.dateFrom!)
    }

    if (filters?.dateTo) {
      results = results.filter((d) => new Date(d.deliveryDate) <= filters.dateTo!)
    }

    if (filters?.limit) {
      const offset = filters.offset || 0
      results = results.slice(offset, offset + filters.limit)
    }

    return Promise.resolve(results)
  }

  async getById(id: string): Promise<Delivery | null> {
    const delivery = this.data.find((d) => d.id === id)
    return Promise.resolve(delivery || null)
  }

  async create(input: CreateDeliveryInput): Promise<Delivery> {
    const newDelivery: Delivery = {
      ...input,
      id: `delivery-${Date.now()}`,
      deliveryDate: input.deliveryDate.toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Delivery

    this.data.push(newDelivery)
    this.persist() // Persist to demo store
    return Promise.resolve(newDelivery)
  }

  async update(id: string, data: UpdateDeliveryInput): Promise<Delivery> {
    const index = this.data.findIndex((d) => d.id === id)
    if (index === -1) {
      throw new Error(`Delivery ${id} not found`)
    }

    this.data[index] = {
      ...this.data[index],
      ...data,
      updatedAt: new Date().toISOString(),
      ...(data.verifiedAt && { verifiedAt: data.verifiedAt.toISOString() }),
    }

    this.persist() // Persist to demo store
    return Promise.resolve(this.data[index])
  }

  async delete(id: string): Promise<void> {
    const index = this.data.findIndex((d) => d.id === id)
    if (index !== -1) {
      this.data.splice(index, 1)
      this.persist() // Persist to demo store
    }
    return Promise.resolve()
  }

  async findByContractId(contractId: string): Promise<Delivery[]> {
    return this.list({ contractId })
  }

  async findByFarmerId(farmerId: string): Promise<Delivery[]> {
    return this.list({ farmerId })
  }

  async findByStatus(status: string): Promise<Delivery[]> {
    return this.list({ status })
  }
}
