import { z } from "zod"

// ==================== AUTHENTICATION SCHEMAS ====================
export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address").max(255, "Email too long"),
  password: z.string().min(1, "Password is required").max(255, "Password too long"),
})

export const signupSchema = z.object({
  email: z.string().trim().email("Invalid email address").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(255),
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  role: z.enum(["farmer", "field_agent", "partner", "offtaker", "ops_admin", "super_admin"]),
  phone: z.string().trim().optional(),
  region: z.string().trim().optional(),
})

// ==================== FARMER SCHEMAS ====================
export const createFarmerSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50),
  lastName: z.string().trim().min(1, "Last name is required").max(50),
  phone: z.string().trim().min(10, "Phone must be at least 10 digits").max(20),
  village: z.string().trim().min(1, "Village is required").max(100),
  lga: z.string().trim().min(1, "LGA is required").max(100),
  state: z.string().trim().min(1, "State is required").max(100),
  farmingExperience: z.string().optional(),
  assignedAgentId: z.string().optional(),
  corridorId: z.string().optional(),
  clusterId: z.string().optional(),
})

export const updateFarmerSchema = createFarmerSchema.partial()

// ==================== CONTRACT SCHEMAS ====================
export const createContractSchema = z.object({
  cropType: z.enum(["maize", "rice", "soybean", "sorghum", "wheat", "millet"]),
  corridorId: z.string().min(1, "Corridor is required"),
  seasonId: z.string().min(1, "Season is required"),
  offtakerId: z.string().min(1, "Offtaker is required"),
  contractedVolumeTons: z.number().positive("Volume must be positive").max(100000, "Volume too large"),
  pricePerTon: z.number().positive("Price must be positive").max(1000000, "Price too high"),
  deliveryWindowStart: z.string().datetime("Invalid start date"),
  deliveryWindowEnd: z.string().datetime("Invalid end date"),
  minimumGrade: z.enum(["A", "B", "C"]).optional(),
  paymentTermsDays: z.number().int().min(0).max(365).optional(),
})

export const updateContractSchema = createContractSchema.partial()

// ==================== DELIVERY SCHEMAS ====================
export const createDeliverySchema = z.object({
  contractId: z.string().min(1, "Contract ID is required"),
  farmerId: z.string().min(1, "Farmer ID is required"),
  volumeTons: z.number().positive("Volume must be positive").max(1000, "Volume too large per delivery"),
  qualityGrade: z.enum(["A", "B", "C"]),
  moistureContent: z.number().min(0, "Moisture cannot be negative").max(100, "Moisture cannot exceed 100%"),
  vehicleNumber: z.string().trim().min(1, "Vehicle number is required").max(20),
  driverName: z.string().trim().min(1, "Driver name is required").max(100),
  driverPhone: z.string().trim().min(10).max(20),
  receivingLocation: z.string().trim().min(1, "Location is required").max(200),
})

export const updateDeliverySchema = z.object({
  status: z.enum(["pending", "in_transit", "delivered", "verified", "rejected"]),
  qualityGrade: z.enum(["A", "B", "C"]).optional(),
  moistureContent: z.number().min(0).max(100).optional(),
  verificationNotes: z.string().trim().max(500).optional(),
})

// ==================== SERVICE & AGENT SCHEMAS ====================
export const createServiceEventSchema = z.object({
  farmerId: z.string().min(1, "Farmer ID is required"),
  agentId: z.string().min(1, "Agent ID is required"),
  serviceType: z.string().trim().min(1, "Service type is required"),
  status: z.enum(["scheduled", "completed", "cancelled"]).optional(),
  scheduledDate: z.string().datetime("Invalid date"),
  notes: z.string().trim().max(1000).optional(),
})

// ==================== TYPE EXPORTS ====================
export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type CreateFarmerInput = z.infer<typeof createFarmerSchema>
export type UpdateFarmerInput = z.infer<typeof updateFarmerSchema>
export type CreateContractInput = z.infer<typeof createContractSchema>
export type UpdateContractInput = z.infer<typeof updateContractSchema>
export type CreateDeliveryInput = z.infer<typeof createDeliverySchema>
export type UpdateDeliveryInput = z.infer<typeof updateDeliverySchema>
export type CreateServiceEventInput = z.infer<typeof createServiceEventSchema>
