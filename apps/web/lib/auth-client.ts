"use client"

import { cloudflareClient } from "better-auth-cloudflare"
import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"
import type { authBuilder } from "./auth"

export const authClient = createAuthClient({
  plugins: [
    cloudflareClient(),
    inferAdditionalFields<typeof authBuilder>()
  ]
})

