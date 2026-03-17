// Repository interface for User entity

export interface User {
  id: string
  email: string
  passwordHash: string
  firstName: string
  lastName: string
  role: string
  phone?: string
  tenantId: string
  isDemo: boolean
  onboardingStatus?: "pending" | "complete"
  createdAt: Date
  updatedAt: Date
}

export interface UserRepository {
  list(filters?: UserListFilters): Promise<User[]>
  getById(id: string): Promise<User | null>
  getByEmail(email: string): Promise<User | null>
  create(data: CreateUserInput): Promise<User>
  update(id: string, data: UpdateUserInput): Promise<User>
  delete(id: string): Promise<void>

  // Auth-specific queries
  validateCredentials(email: string, password: string): Promise<User | null>
}

export interface UserListFilters {
  tenantId?: string
  role?: string
  isDemo?: boolean
  limit?: number
  offset?: number
}

export interface CreateUserInput {
  email: string
  passwordHash: string
  firstName: string
  lastName: string
  role: string
  tenantId: string
  phone?: string
  isDemo?: boolean
}

export interface UpdateUserInput {
  firstName?: string
  lastName?: string
  phone?: string
  role?: string
}
