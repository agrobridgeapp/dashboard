import type { PrismaClient } from "@prisma/client"
import type { Delivery } from "@/lib/data/types"
import type {
  DeliveryRepository,
  DeliveryListFilters,
  CreateDeliveryInput,
  UpdateDeliveryInput,
} from "../interfaces/delivery-repository"

export class PrismaDeliveryRepository implements DeliveryRepository {
  constructor(private prisma: PrismaClient) {}

  async list(filters?: DeliveryListFilters): Promise<Delivery[]> {
    const deliveries = await this.prisma.delivery.findMany({
      where: {
        ...(filters?.contractId && { contractId: filters.contractId }),
        ...(filters?.farmerId && { farmerId: filters.farmerId }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.dateFrom && { deliveryDate: { gte: filters.dateFrom } }),
        ...(filters?.dateTo && { deliveryDate: { lte: filters.dateTo } }),
      },
      orderBy: { createdAt: "desc" },
      skip: filters?.offset || 0,
      take: filters?.limit,
    })

    return deliveries.map(this.toDomain)
  }

  async getById(id: string): Promise<Delivery | null> {
    const delivery = await this.prisma.delivery.findUnique({ where: { id } })
    return delivery ? this.toDomain(delivery) : null
  }

  async create(input: CreateDeliveryInput): Promise<Delivery> {
    const delivery = await this.prisma.delivery.create({
      data: input as any,
    })
    return this.toDomain(delivery)
  }

  async update(id: string, data: UpdateDeliveryInput): Promise<Delivery> {
    const delivery = await this.prisma.delivery.update({
      where: { id },
      data: data as any,
    })
    return this.toDomain(delivery)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.delivery.delete({ where: { id } })
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

  private toDomain(prismaDelivery: any): Delivery {
    return {
      ...prismaDelivery,
      deliveryDate: prismaDelivery.deliveryDate.toISOString(),
      verifiedAt: prismaDelivery.verifiedAt?.toISOString(),
      createdAt: prismaDelivery.createdAt.toISOString(),
      updatedAt: prismaDelivery.updatedAt.toISOString(),
    } as Delivery
  }
}
