'use client';

import { useState } from "react";
import { QueryClient, QueryClientProvider, defaultShouldDehydrateQuery } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink, httpLink, loggerLink } from "@trpc/client";
import SuperJSON from "superjson";
import { TooltipProvider } from "@radix-ui/react-tooltip";

import { env } from "@/env";
import type { AppRouter } from "@/server/trpc/router";
import { TRPCProvider } from "@/lib/trpc/client";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return window.location.origin;
  if (env.NEXT_PUBLIC_BASE_URL) return `https://${env.NEXT_PUBLIC_BASE_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === "pending",
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;
function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

export function TRPCClientProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        loggerLink({
          enabled(op) {
            return op.direction === "down" && op.result instanceof Error;
          },
        }),
        httpBatchLink({
          transformer: SuperJSON,
          url: `${getBaseUrl()}/api/trpc`
        }),
      ],
    }),
  );

  return (
    <TooltipProvider>
      <QueryClientProvider client={queryClient}>
        <TRPCProvider queryClient={queryClient} trpcClient={trpcClient}>
          {children}
        </TRPCProvider>
      </QueryClientProvider>
    </TooltipProvider>
  );
}
