import type { PrismaClient } from "@prisma/client"
import type { Farmer } from "@/lib/data/types"
import type {
  FarmerRepository,
  FarmerListFilters,
  CreateFarmerInput,
  UpdateFarmerInput,
} from "../interfaces/farmer-repository"

export class PrismaFarmerRepository implements FarmerRepository {
  constructor(private prisma: PrismaClient) {}

  async list(filters?: FarmerListFilters): Promise<Farmer[]> {
    const farmers = await this.prisma.farmer.findMany({
      where: {
        ...(filters?.agentId && { agentId: filters.agentId }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.search && {
          OR: [
            { firstName: { contains: filters.search, mode: "insensitive" } },
            { lastName: { contains: filters.search, mode: "insensitive" } },
            { phone: { contains: filters.search } },
          ],
        }),
      },
      orderBy: { createdAt: "desc" },
      skip: filters?.offset || 0,
      take: filters?.limit,
    })

    return farmers.map(this.toDomain)
  }

  async getById(id: string): Promise<Farmer | null> {
    const farmer = await this.prisma.farmer.findUnique({ where: { id } })
    return farmer ? this.toDomain(farmer) : null
  }

  async create(input: CreateFarmerInput): Promise<Farmer> {
    const farmer = await this.prisma.farmer.create({
      data: input as any,
    })
    return this.toDomain(farmer)
  }

  async update(id: string, data: UpdateFarmerInput): Promise<Farmer> {
    const farmer = await this.prisma.farmer.update({
      where: { id },
      data: data as any,
    })
    return this.toDomain(farmer)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.farmer.delete({ where: { id } })
  }

  async findByAgentId(agentId: string): Promise<Farmer[]> {
    return this.list({ agentId })
  }

  async findByCorridorId(corridorId: string): Promise<Farmer[]> {
    return this.list({ corridorId: corridorId })
  }

  async findByPhone(phone: string): Promise<Farmer | null> {
    const farmer = await this.prisma.farmer.findFirst({ where: { phone } })
    return farmer ? this.toDomain(farmer) : null
  }

  private toDomain(prismaFarmer: any): Farmer {
    return {
      ...prismaFarmer,
      createdAt: prismaFarmer.createdAt.toISOString(),
      updatedAt: prismaFarmer.updatedAt.toISOString(),
    } as Farmer
  }
}
