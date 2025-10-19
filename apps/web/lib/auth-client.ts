"use client"

import { cloudflareClient } from "better-auth-cloudflare"
import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"
import type { authBuilder } from "./auth"

// Use window.location for runtime URL detection in browser
const getBaseURL = () => {
  // In production, construct URL from window.location
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.host}`;
  }
  // Fallback for SSR (should not be used on client)
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
}

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  plugins: [
    cloudflareClient(),
    inferAdditionalFields<typeof authBuilder>()
  ]
})

