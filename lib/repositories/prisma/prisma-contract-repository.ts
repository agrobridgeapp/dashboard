import type { PrismaClient } from "@prisma/client"
import type { Contract } from "@/lib/data/types"
import type {
  ContractRepository,
  ContractListFilters,
  CreateContractInput,
  UpdateContractInput,
} from "../interfaces/contract-repository"

export class PrismaContractRepository implements ContractRepository {
  constructor(private prisma: PrismaClient) {}

  async list(filters?: ContractListFilters): Promise<Contract[]> {
    const contracts = await this.prisma.contract.findMany({
      where: {
        ...(filters?.offtakerId && { offtakerId: filters.offtakerId }),
        ...(filters?.corridorId && { corridorId: filters.corridorId }),
        ...(filters?.season && { season: filters.season }),
        ...(filters?.cropType && { cropType: filters.cropType }),
        ...(filters?.status && { status: filters.status }),
      },
      orderBy: { createdAt: "desc" },
      skip: filters?.offset || 0,
      take: filters?.limit,
    })

    return contracts.map(this.toDomain)
  }

  async getById(id: string): Promise<Contract | null> {
    const contract = await this.prisma.contract.findUnique({ where: { id } })
    return contract ? this.toDomain(contract) : null
  }

  async getByContractNumber(contractNumber: string): Promise<Contract | null> {
    const contract = await this.prisma.contract.findUnique({ where: { contractNumber } })
    return contract ? this.toDomain(contract) : null
  }

  async create(input: CreateContractInput): Promise<Contract> {
    const contract = await this.prisma.contract.create({
      data: {
        ...input,
        totalValue: input.contractedVolumeTons * input.pricePerTon,
        deliveredVolumeTons: 0,
      } as any,
    })
    return this.toDomain(contract)
  }

  async update(id: string, data: UpdateContractInput): Promise<Contract> {
    const contract = await this.prisma.contract.update({
      where: { id },
      data: data as any,
    })
    return this.toDomain(contract)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.contract.delete({ where: { id } })
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

  private toDomain(prismaContract: any): Contract {
    return {
      ...prismaContract,
      startDate: prismaContract.startDate.toISOString(),
      endDate: prismaContract.endDate.toISOString(),
      deliveryStartDate: prismaContract.deliveryStartDate.toISOString(),
      deliveryEndDate: prismaContract.deliveryEndDate.toISOString(),
      createdAt: prismaContract.createdAt.toISOString(),
      updatedAt: prismaContract.updatedAt.toISOString(),
    } as Contract
  }
}
