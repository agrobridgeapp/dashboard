import type { PrismaClient } from "@prisma/client"
import type {
  User,
  UserRepository,
  UserListFilters,
  CreateUserInput,
  UpdateUserInput,
} from "../interfaces/user-repository"

export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaClient) {}

  async list(filters?: UserListFilters): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        ...(filters?.tenantId && { tenantId: filters.tenantId }),
        ...(filters?.role && { role: filters.role }),
        ...(filters?.isDemo !== undefined && { isDemo: filters.isDemo }),
      },
      orderBy: { createdAt: "desc" },
      skip: filters?.offset || 0,
      take: filters?.limit,
    })

    return users.map(this.toDomain)
  }

  async getById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } })
    return user ? this.toDomain(user) : null
  }

  async getByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } })
    return user ? this.toDomain(user) : null
  }

  async create(input: CreateUserInput): Promise<User> {
    const user = await this.prisma.user.create({
      data: input as any,
    })
    return this.toDomain(user)
  }

  async update(id: string, data: UpdateUserInput): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: data as any,
    })
    return this.toDomain(user)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } })
  }

  async validateCredentials(email: string, password: string): Promise<User | null> {
    const user = await this.getByEmail(email)
    if (!user) return null

    // In production, use bcrypt.compare(password, user.passwordHash)
    // For now, this is a placeholder
    return user
  }

  private toDomain(prismaUser: any): User {
    return {
      ...prismaUser,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    }
  }
}
