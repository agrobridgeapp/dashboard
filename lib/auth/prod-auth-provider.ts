/**
 * REPLACED: Deployment-time auth provider is no longer used for login/verification.
 * All auth operations are now proxied to the backend.
 */

export const prodAuthProvider = {
  login: async () => ({ success: false, error: "Use backend for login" }),
  verifyToken: async (_token: string) => ({ valid: false }),
  hashPassword: async () => "",
  isConfigured: () => false,
}
