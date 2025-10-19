"use client"

import { cloudflareClient } from "better-auth-cloudflare"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  plugins: [cloudflareClient()]
})

