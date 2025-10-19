"use client"

import { httpBatchLink } from "@trpc/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode, useMemo } from "react"
import SuperJSON from "superjson"

import { trpc } from "@/lib/trpc/client"

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return ""
  }

  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL
  }

  return "http://localhost:3000"
}

export function TRPCProvider({ children }: { children: ReactNode }) {
  const queryClient = useMemo(() => new QueryClient(), [])

  const trpcClient = useMemo(
    () =>
      trpc.createClient({
        transformer: SuperJSON,
        links: [
          httpBatchLink({
            url: `${getBaseUrl()}/api/trpc`,
          }),
        ],
      }),
    [],
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
