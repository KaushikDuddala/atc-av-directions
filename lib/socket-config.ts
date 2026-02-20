/**
 * Socket.io Configuration
 * Handles environment-specific Socket.io server URLs
 */

export function getSocketUrl(): string {
  // In browser environment
  if (typeof window !== "undefined") {
    // NEXT_PUBLIC_ variables are injected by Next.js at build time
    // They're available as undefined if not set, so we check for them
    // Using any to avoid TypeScript issues with injected globals
    const socketUrlFromEnv = (globalThis as any).__NEXT_PUBLIC_SOCKET_URL || 
                              (process.env as any).NEXT_PUBLIC_SOCKET_URL
    
    if (socketUrlFromEnv && socketUrlFromEnv.trim()) {
      console.log("[Socket.io Config] Using configured URL:", socketUrlFromEnv)
      return socketUrlFromEnv
    }
    
    // Default to current origin for development
    console.log("[Socket.io Config] Using current origin:", window.location.origin)
    return window.location.origin
  }
  
  // Server-side fallback (shouldn't be used in normal flow)
  return "http://100.123.206.111:3000"
}
