import type {
  User,
  UserRepository,
  UserListFilters,
  CreateUserInput,
  UpdateUserInput,
} from "../interfaces/user-repository"
import { sql } from "@/lib/db"

/**
 * Neon-backed user repository.
 * Uses @neondatabase/serverless to query the real users table.
 */
export class NeonUserRepository implements UserRepository {
  private toDomain(row: Record<string, unknown>): User {
    return {
      id: row.id as string,
      email: row.email as string,
      passwordHash: row.password_hash as string,
      firstName: row.first_name as string,
      lastName: row.last_name as string,
      role: row.role as string,
      phone: (row.phone as string) || undefined,
      tenantId: "production",
      isDemo: false,
      onboardingStatus: (row.onboarding_status as "pending" | "complete") || "pending",
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    }
  }

  async list(filters?: UserListFilters): Promise<User[]> {
    const limit = filters?.limit || 50
    const offset = filters?.offset || 0

    let rows
    if (filters?.role) {
      rows = await sql`
        SELECT * FROM users WHERE role = ${filters.role}
        ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
      `
    } else {
      rows = await sql`
        SELECT * FROM users
        ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
      `
    }

    return rows.map((r) => this.toDomain(r))
  }

  async getById(id: string): Promise<User | null> {
    const rows = await sql`SELECT * FROM users WHERE id = ${id}`
    return rows.length > 0 ? this.toDomain(rows[0]) : null
  }

  async getByEmail(email: string): Promise<User | null> {
    const rows = await sql`SELECT * FROM users WHERE email = ${email.toLowerCase().trim()}`
    return rows.length > 0 ? this.toDomain(rows[0]) : null
  }

  // Alias for ProdAuthProvider compatibility
  async findByEmail(email: string): Promise<User | null> {
    return this.getByEmail(email)
  }

  async create(input: CreateUserInput): Promise<User> {
    const [row] = await sql`
      INSERT INTO users (email, password_hash, first_name, last_name, phone, role)
      VALUES (
        ${input.email.toLowerCase().trim()},
        ${input.passwordHash},
        ${input.firstName},
        ${input.lastName},
        ${input.phone || null},
        ${input.role}
      )
      RETURNING *
    `
    return this.toDomain(row)
  }

  async update(id: string, data: UpdateUserInput): Promise<User> {
    const [row] = await sql`
      UPDATE users
      SET first_name = COALESCE(${data.firstName || null}, first_name),
          last_name = COALESCE(${data.lastName || null}, last_name),
          phone = COALESCE(${data.phone || null}, phone),
          role = COALESCE(${data.role || null}, role)
      WHERE id = ${id}
      RETURNING *
    `
    return this.toDomain(row)
  }

  async delete(id: string): Promise<void> {
    await sql`DELETE FROM users WHERE id = ${id}`
  }

  async validateCredentials(email: string, _password: string): Promise<User | null> {
    // Password comparison is handled by ProdAuthProvider, not here
    return this.getByEmail(email)
  }
}
