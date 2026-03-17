/**
 * REPLACED: This local DB client is no longer used.
 * All operations are now proxied to the backend.
 * Dummying this out to avoid Neon dependency errors.
 */

export function sql(strings: TemplateStringsArray, ...values: unknown[]) {
  console.warn("SQL called on frontend — this is legacy code and should be removed.")
  return Promise.resolve([]) as any
}
