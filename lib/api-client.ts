type FetchOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE"
  body?: any
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean>
}

const camelToSnake = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(camelToSnake)
  }
  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
      acc[snakeKey] = camelToSnake(obj[key])
      return acc
    }, {} as any)
  }
  return obj
}

class APIClient {
  private baseURL = process.env.NEXT_PUBLIC_API_URL || "/api"

  private async request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { method = "GET", body, headers = {}, params } = options

    const snakeBody = body ? camelToSnake(body) : body

    // Build URL with query params
    let url = `${this.baseURL}${endpoint}`
    if (params) {
      const queryString = new URLSearchParams(
        Object.entries(params).map(([key, value]) => [key, String(value)]),
      ).toString()
      url += `?${queryString}`
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("agrobridge_token") : null

    const config: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
      },
    }

    if (snakeBody && method !== "GET") {
      config.body = JSON.stringify(snakeBody)
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Request failed" }))
        throw new Error(error.message || error.error || `HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("[v0] API request failed:", error)
      throw error
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string | number | boolean>) {
    return this.request<T>(endpoint, { method: "GET", params })
  }

  async post<T>(endpoint: string, body: any) {
    return this.request<T>(endpoint, { method: "POST", body })
  }

  async patch<T>(endpoint: string, body: any) {
    return this.request<T>(endpoint, { method: "PATCH", body })
  }

  async delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "DELETE" })
  }

  auth = {
    login: (email: string, password: string) =>
      this.post<{ success: boolean; data?: { user: any; token: string }; error?: string }>("/auth/login", {
        email,
        password,
      }),

    signup: (data: any) =>
      this.post<{ success: boolean; data?: any; message?: string; error?: string }>("/auth/signup", data),

    verify: (token: string) =>
      this.post<{ success: boolean; valid: boolean; user?: any }>("/auth/verify", { token }),

    getSession: () => this.get<{ success: boolean; user: any | null }>("/auth/session"),

    changePassword: (currentPassword: string, newPassword: string) =>
      this.post<{ success: boolean; data?: any; error?: string }>("/auth/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
      }),

    forgotPassword: (email: string) =>
      this.post<{ success: boolean; message?: string; error?: string }>("/auth/forgot-password", { email }),

    resetPassword: (password: string, token: string) =>
      this.post<{ success: boolean; message?: string; error?: string }>("/auth/reset-password", { password, token }),
  }

  // Farmers API
  farmers = {
    list: (params?: { corridorId?: string; agentId?: string; clusterId?: string; status?: string }) =>
      this.request<{ success: boolean; data: any[]; count: number }>("/farmers", { params }),

    getById: (id: string) => this.request<{ success: boolean; data: any }>(`/farmers/${id}`),

    create: (data: any) => this.request<{ success: boolean; data: any }>("/farmers", { method: "POST", body: data }),

    update: (id: string, data: any) =>
      this.request<{ success: boolean; data: any }>(`/farmers/${id}`, { method: "PATCH", body: data }),
  }

  // Agents API
  agents = {
    list: (params?: { corridor?: string; tier?: string; status?: string }) =>
      this.request<{ success: boolean; data: any[]; count: number }>("/agents", { params }),

    getById: (id: string) => this.request<{ success: boolean; data: any }>(`/agents/${id}`),

    create: (data: any) => this.request<{ success: boolean; data: any }>("/agents", { method: "POST", body: data }),

    update: (id: string, data: any) =>
      this.request<{ success: boolean; data: any }>(`/agents/${id}`, { method: "PATCH", body: data }),
  }

  // Contracts API
  contracts = {
    list: (params?: { crop?: string; corridor?: string; season?: string; status?: string }) =>
      this.request<{ success: boolean; data: { contracts: any[]; count: number } }>("/contracts", { params }),

    getById: (id: string) => this.request<{ success: boolean; data: any }>(`/contracts/${id}`),

    create: (data: any) => this.request<{ success: boolean; data: any }>("/contracts", { method: "POST", body: data }),
  }

  // Crop Cycles API
  cropCycles = {
    list: (params?: { farmer?: string; agent?: string; crop?: string; season?: string; status?: string }) =>
      this.request<{ success: boolean; data: any[]; count: number }>("/crop-cycles", { params }),

    getById: (id: string) => this.request<{ success: boolean; data: any }>(`/crop-cycles/${id}`),

    create: (data: any) =>
      this.request<{ success: boolean; data: any }>("/crop-cycles", { method: "POST", body: data }),

    update: (id: string, data: any) =>
      this.request<{ success: boolean; data: any }>(`/crop-cycles/${id}`, { method: "PATCH", body: data }),
  }

  // Deliveries API
  deliveries = {
    list: (params?: { contract?: string; corridor?: string; status?: string }) =>
      this.request<{ success: boolean; data: any[]; count: number }>("/deliveries", { params }),

    getById: (id: string) => this.request<{ success: boolean; data: any }>(`/deliveries/${id}`),

    create: (data: any) => this.request<{ success: boolean; data: any }>("/deliveries", { method: "POST", body: data }),
  }

  // Partners API
  partners = {
    list: (params?: { type?: string; state?: string; status?: string }) =>
      this.request<{ success: boolean; data: any[]; count: number }>("/partners", { params }),

    getById: (id: string) => this.request<{ success: boolean; data: any }>(`/partners/${id}`),

    create: (data: any) => this.request<{ success: boolean; data: any }>("/partners", { method: "POST", body: data }),

    update: (id: string, data: any) =>
      this.request<{ success: boolean; data: any }>(`/partners/${id}`, { method: "PATCH", body: data }),
  }

  // Corridors API
  corridors = {
    list: () => this.request<{ success: boolean; data: any[]; count: number }>("/corridors"),

    getById: (id: string) => this.request<{ success: boolean; data: any }>(`/corridors/${id}`),

    create: (data: any) => this.request<{ success: boolean; data: any }>("/corridors", { method: "POST", body: data }),

    update: (id: string, data: any) =>
      this.request<{ success: boolean; data: any }>(`/corridors/${id}`, { method: "PATCH", body: data }),
  }

  // Payments API
  payments = {
    list: (params?: { farmerId?: string; status?: string }) =>
      this.request<{ success: boolean; data: any[]; count: number }>("/payments", { params }),

    getById: (id: string) => this.request<{ success: boolean; data: any }>(`/payments/${id}`),

    create: (data: any) => this.request<{ success: boolean; data: any }>("/payments", { method: "POST", body: data }),
  }

  // Seasons API
  seasons = {
    list: () => this.request<{ success: boolean; data: any[]; count: number }>("/seasons"),

    getById: (id: string) => this.request<{ success: boolean; data: any }>(`/seasons/${id}`),

    create: (data: any) => this.request<{ success: boolean; data: any }>("/seasons", { method: "POST", body: data }),
  }

  // Land Plots API
  landPlots = {
    list: (params?: { farmerId?: string; status?: string }) =>
      this.request<{ success: boolean; data: any[]; count: number }>("/land-plots", { params }),

    getById: (id: string) => this.request<{ success: boolean; data: any }>(`/land-plots/${id}`),

    create: (data: any) => this.request<{ success: boolean; data: any }>("/land-plots", { method: "POST", body: data }),

    update: (id: string, data: any) =>
      this.request<{ success: boolean; data: any }>(`/land-plots/${id}`, { method: "PATCH", body: data }),
  }

  // Service Events API
  serviceEvents = {
    list: (params?: { cropCycleId?: string; farmerId?: string; status?: string; sla?: string }) =>
      this.request<{ success: boolean; data: any[]; count: number }>("/service-events", { params }),

    getById: (id: string) => this.request<{ success: boolean; data: any }>(`/service-events/${id}`),

    create: (data: any) =>
      this.request<{ success: boolean; data: any }>("/service-events", { method: "POST", body: data }),

    update: (id: string, data: any) =>
      this.request<{ success: boolean; data: any }>(`/service-events/${id}`, { method: "PATCH", body: data }),

    assignPartner: (id: string, partnerId: string) =>
      this.request<{ success: boolean; data: any }>(`/service-events/${id}/assign`, { method: "POST", body: { partner_id: partnerId } }),

    start: (id: string) =>
      this.request<{ success: boolean; data: any }>(`/service-events/${id}/start`, { method: "POST", body: {} }),

    complete: (id: string, data?: { notes?: string; proof_image_url?: string; actual_cost?: number }) =>
      this.request<{ success: boolean; data: any }>(`/service-events/${id}/complete`, { method: "POST", body: data || {} }),

    verify: (id: string, notes?: string) =>
      this.request<{ success: boolean; data: any }>(`/service-events/${id}/verify`, { method: "POST", body: { notes } }),

    cancel: (id: string, reason?: string) =>
      this.request<{ success: boolean; data: any }>(`/service-events/${id}/cancel`, { method: "POST", body: { reason } }),
  }

  // Task Requests API (Agent → Ops workflow)
  taskRequests = {
    list: (params?: { status?: string; urgency?: string; agent_id?: string; corridor_id?: string; search?: string; page?: number; limit?: number }) =>
      this.request<{ success: boolean; data: any[]; count: number }>("/task-requests", { params }),

    getById: (id: string) => this.request<{ success: boolean; data: any }>(`/task-requests/${id}`),

    create: (data: { title: string; description: string; issue_type: string; urgency?: string; farmer_id?: string; corridor_id?: string }) =>
      this.request<{ success: boolean; data: any }>("/task-requests", { method: "POST", body: data }),

    review: (id: string, data: { action: "approve" | "reject"; review_notes?: string; rejection_reason?: string; create_service_event?: any }) =>
      this.request<{ success: boolean; data: any }>(`/task-requests/${id}/review`, { method: "POST", body: data }),

    stats: () =>
      this.request<{ success: boolean; data: { statusCounts: Record<string, number>; urgencyCounts: Record<string, number>; total: number } }>("/task-requests/stats"),
  }

  // Planning Interests API
  planningInterests = {
    list: (params?: { crop?: string; season?: string; status?: string }) =>
      this.request<{ success: boolean; data: any[]; count: number }>("/planning-interests", { params }),

    getById: (id: string) => this.request<{ success: boolean; data: any }>(`/planning-interests/${id}`),

    create: (data: any) =>
      this.request<{ success: boolean; data: any }>("/planning-interests", { method: "POST", body: data }),

    update: (id: string, data: any) =>
      this.request<{ success: boolean; data: any }>(`/planning-interests/${id}`, { method: "PATCH", body: data }),
  }

  // Supply assurance (offtaker)
  supplyAssurance = {
    get: () => this.request<{ success: boolean; data: any }>('/me/supply-assurance'),
  }

  // Offtaker-scoped deliveries
  offtakerDeliveries = {
    list: () => this.request<{ success: boolean; data: { deliveries: any[]; count: number } }>('/me/deliveries'),

    confirm: (id: string, data: { notes?: string }) =>
      this.request<{ success: boolean; data: any }>(`/me/deliveries/${id}/confirm`, { method: 'PATCH', body: data }),
  }

  // Offtaker-scoped corridors
  offtakerCorridors = {
    list: () => this.request<{ success: boolean; data: { corridors: any[]; count: number } }>('/me/corridors'),
  }

  // Partner-scoped endpoints
  partnerMe = {
    getProfile: () => this.request<{ success: boolean; data: any }>('/me/partner'),

    updateCapacity: (data: {
      weekly_capacity_hectares?: number;
      capacity_description?: string;
      storage_capacity?: string;
      services_offered?: string[];
    }) => this.request<{ success: boolean; data: any }>('/me/partner', { method: 'PATCH', body: data }),

    getServiceEvents: () =>
      this.request<{ success: boolean; data: { events: any[]; count: number } }>('/me/partner-events'),
  }

  // Farmer-scoped endpoints (#1 fix — each farmer only sees their own data)
  farmerMe = {
    getProfile: () =>
      this.request<{ success: boolean; data: any }>('/me/farmer'),

    getServiceEvents: (p?: { page?: number; limit?: number }) =>
      this.request<{ success: boolean; data: any[]; count: number; pages: number }>(
        '/me/farmer-events', { params: p as any }
      ),

    getCropCycles: (p?: { page?: number; limit?: number }) =>
      this.request<{ success: boolean; data: any[]; count: number; pages: number }>(
        '/me/farmer-cycles', { params: p as any }
      ),

    getLandPlots: (p?: { page?: number; limit?: number }) =>
      this.request<{ success: boolean; data: any[]; count: number; pages: number }>(
        '/me/farmer-plots', { params: p as any }
      ),

    getContracts: (p?: { page?: number; limit?: number }) =>
      this.request<{ success: boolean; data: any[]; count: number; pages: number }>(
        '/me/farmer-contracts', { params: p as any }
      ),

    getDeliveries: (p?: { page?: number; limit?: number }) =>
      this.request<{ success: boolean; data: any[]; count: number; pages: number }>(
        '/me/farmer-deliveries', { params: p as any }
      ),

    getPayments: (p?: { page?: number; limit?: number }) =>
      this.request<{ success: boolean; data: any[]; count: number; pages: number }>(
        '/me/farmer-payments', { params: p as any }
      ),
  }

  // Agent-scoped endpoints
  agentMe = {
    getProfile: () => this.request<{ success: boolean; data: any }>('/me/agent'),

    getFarmers: () =>
      this.request<{ success: boolean; data: any[] }>('/me/agent-farmers'),

    getCropCycles: () =>
      this.request<{ success: boolean; data: any[] }>('/me/agent-crop-cycles'),

    getServiceEvents: () =>
      this.request<{ success: boolean; data: { events: any[]; count: number } }>('/me/agent-events'),
  }

  // Offtaker company profile
  profile = {
    get: () =>
      this.request<{ success: boolean; data: any }>('/me/profile'),

    update: (data: {
      company_name?: string
      rc_number?: string
      business_type?: string
      annual_volume_mt?: number | null
      address?: string
      payment_terms?: string
      quality_grade?: string
      standard_terms?: string
    }) =>
      this.request<{ success: boolean; data: any }>('/me/profile', { method: 'PATCH', body: data }),
  }

  // Collection Centers API (offtaker)
  collectionCenters = {
    list: () =>
      this.request<{ success: boolean; data: any[] }>('/collection-centers'),

    create: (data: { name: string; address: string }) =>
      this.request<{ success: boolean; data: any }>('/collection-centers', { method: 'POST', body: data }),

    update: (id: string, data: { name?: string; address?: string }) =>
      this.request<{ success: boolean; data: any }>(`/collection-centers/${id}`, { method: 'PATCH', body: data }),

    delete: (id: string) =>
      this.request<{ success: boolean; data: any }>(`/collection-centers/${id}`, { method: 'DELETE' }),
  }

  // Admin API (stats + user management)
  admin = {
    getStats: () =>
      this.request<{ success: boolean; data: any }>("/admin/stats"),

    listUsers: (params?: { role?: string; search?: string }) =>
      this.request<{ success: boolean; data: { users: any[]; count: number } }>("/admin/users", { params }),

    createUser: (data: any) =>
      this.request<{ success: boolean; data: any }>("/admin/users", { method: "POST", body: data }),

    updateUser: (id: string, data: any) =>
      this.request<{ success: boolean; data: any }>(`/admin/users/${id}`, { method: "PATCH", body: data }),

    deleteUser: (id: string) =>
      this.request<{ success: boolean; data: any }>(`/admin/users/${id}`, { method: "DELETE" }),
  }
}

export const apiClient = new APIClient()
export const api = apiClient
