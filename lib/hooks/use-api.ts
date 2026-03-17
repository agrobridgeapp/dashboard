/**
 * SWR-based hooks for API data fetching.
 * Eliminates the manual loading/error/refetch boilerplate from every page.
 * SWR deduplicates requests, so the same key across components = one network call.
 */
import useSWR, { SWRConfiguration } from "swr"
import { apiClient } from "@/lib/api-client"

type PaginatedMeta = { count: number; page: number; limit: number; pages: number }

// ─── Generic fetcher wrapper ────────────────────────────────────────────────

function useQuery<T>(
  key: string | null,
  fetcher: () => Promise<T>,
  config?: SWRConfiguration
) {
  return useSWR<T>(key, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10_000,
    ...config,
  })
}

// ─── Farmer-scoped hooks (#1 fix) ────────────────────────────────────────────

export function useFarmerProfile() {
  return useQuery("farmer/profile", () =>
    apiClient.farmerMe.getProfile().then((r) => r.data)
  )
}

export function useFarmerEvents(page = 1, limit = 20) {
  return useQuery(`farmer/events?page=${page}&limit=${limit}`, () =>
    apiClient.farmerMe.getServiceEvents({ page, limit }).then((r) => ({
      events: r.data as any[],
      meta: (r as any).meta as PaginatedMeta,
    }))
  )
}

export function useFarmerCropCycles(page = 1, limit = 20) {
  return useQuery(`farmer/cycles?page=${page}&limit=${limit}`, () =>
    apiClient.farmerMe.getCropCycles({ page, limit }).then((r) => ({
      cycles: r.data as any[],
      meta: (r as any).meta as PaginatedMeta,
    }))
  )
}

export function useFarmerLandPlots(page = 1, limit = 20) {
  return useQuery(`farmer/plots?page=${page}&limit=${limit}`, () =>
    apiClient.farmerMe.getLandPlots({ page, limit }).then((r) => ({
      plots: r.data as any[],
      meta: (r as any).meta as PaginatedMeta,
    }))
  )
}

export function useFarmerContracts(page = 1, limit = 20) {
  return useQuery(`farmer/contracts?page=${page}&limit=${limit}`, () =>
    apiClient.farmerMe.getContracts({ page, limit }).then((r) => ({
      contracts: r.data as any[],
      meta: (r as any).meta as PaginatedMeta,
    }))
  )
}

export function useFarmerDeliveries(page = 1, limit = 20) {
  return useQuery(`farmer/deliveries?page=${page}&limit=${limit}`, () =>
    apiClient.farmerMe.getDeliveries({ page, limit }).then((r) => ({
      deliveries: r.data as any[],
      meta: (r as any).meta as PaginatedMeta,
    }))
  )
}

export function useFarmerPayments(page = 1, limit = 20) {
  return useQuery(`farmer/payments?page=${page}&limit=${limit}`, () =>
    apiClient.farmerMe.getPayments({ page, limit }).then((r) => ({
      payments: r.data as any[],
      meta: (r as any).meta as PaginatedMeta,
    }))
  )
}

// ─── Agent-scoped hooks ───────────────────────────────────────────────────────

export function useAgentFarmers() {
  return useQuery("agent/farmers", () =>
    apiClient.agentMe.getFarmers().then((r) => r.data ?? [])
  )
}

export function useAgentServiceEvents() {
  return useQuery("agent/events", () =>
    apiClient.agentMe.getServiceEvents().then((r) => r.data?.events ?? [])
  )
}

export function useAgentCropCycles() {
  return useQuery("agent/cycles", () =>
    apiClient.agentMe.getCropCycles().then((r) => r.data ?? [])
  )
}

export function useAgentProfile() {
  return useQuery("agent/profile", () =>
    apiClient.agentMe.getProfile().then((r) => r.data)
  )
}

// ─── Partner-scoped hooks ─────────────────────────────────────────────────────

export function usePartnerProfile() {
  return useQuery("partner/profile", () =>
    apiClient.partnerMe.getProfile().then((r) => r.data)
  )
}

export function usePartnerServiceEvents() {
  return useQuery("partner/events", () =>
    apiClient.partnerMe.getServiceEvents().then((r) => r.data?.events ?? [])
  )
}
