"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTRPC } from "@/lib/trpc/client";
import { DashboardClient } from "./dashboard-client";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedChatId = searchParams?.get("chatId") || undefined;
  const trpc = useTRPC();
  const { mutate: initialize, data, isPending } = useMutation(trpc.dashboardInitialize.mutationOptions({
    onSuccess: (result) => {
      if ("redirect" in result && result.redirect) {
        router.push(result.redirect);
      }
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        router.push("/login");
      } else {
        console.error("Error initializing dashboard:", error);
      }
    },
  }));

  useEffect(() => {
    initialize({ chatId: requestedChatId });
  }, [requestedChatId]);

  if (isPending || !data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if ("redirect" in data) {
    return null;
  }

  return <DashboardClient chatId={data.chatId} initialMessages={data.messages} />;
}
