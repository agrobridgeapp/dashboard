import type {
  User,
  UserRepository,
  UserListFilters,
  CreateUserInput,
  UpdateUserInput,
} from "../interfaces/user-repository"
import { DEMO_USERS } from "@/lib/demo/demo-users"

export class MockUserRepository implements UserRepository {
  private data: User[] = DEMO_USERS.map((u) => ({
    ...u,
    passwordHash: "mock-hash",
    createdAt: new Date(),
    updatedAt: new Date(),
    isDemo: u.email?.includes("demo-") || false,
  })) as User[]

  async list(filters?: UserListFilters): Promise<User[]> {
    let results = this.data

    if (filters?.tenantId) {
      results = results.filter((u) => u.tenantId === filters.tenantId)
    }

    if (filters?.role) {
      results = results.filter((u) => u.role === filters.role)
    }

    if (filters?.isDemo !== undefined) {
      results = results.filter((u) => u.isDemo === filters.isDemo)
    }

    if (filters?.limit) {
      const offset = filters.offset || 0
      results = results.slice(offset, offset + filters.limit)
    }

    return Promise.resolve(results)
  }

  async getById(id: string): Promise<User | null> {
    const user = this.data.find((u) => u.id === id)
    return Promise.resolve(user || null)
  }

  async getByEmail(email: string): Promise<User | null> {
    const user = this.data.find((u) => u.email === email)
    return Promise.resolve(user || null)
  }

  async create(input: CreateUserInput): Promise<User> {
    const newUser: User = {
      ...input,
      id: `user-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDemo: input.isDemo || false,
    }

    this.data.push(newUser)
    return Promise.resolve(newUser)
  }

  async update(id: string, data: UpdateUserInput): Promise<User> {
    const index = this.data.findIndex((u) => u.id === id)
    if (index === -1) {
      throw new Error(`User ${id} not found`)
    }

    this.data[index] = {
      ...this.data[index],
      ...data,
      updatedAt: new Date(),
    }

    return Promise.resolve(this.data[index])
  }

  async delete(id: string): Promise<void> {
    const index = this.data.findIndex((u) => u.id === id)
    if (index !== -1) {
      this.data.splice(index, 1)
    }
    return Promise.resolve()
  }

  async validateCredentials(email: string, password: string): Promise<User | null> {
    // Mock validation - always succeeds for demo users
    const user = await this.getByEmail(email)
    return user
  }
}
