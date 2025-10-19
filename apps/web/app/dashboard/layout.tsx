"use client";

import type { ReactNode } from "react";
import { Suspense } from "react";

import { SidebarInset, SidebarProvider, SidebarRail } from "@/components/ui/sidebar";
import { DashboardSidebarProvider } from "./dashboard-context";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DashboardSidebarProvider>
      <SidebarProvider className="bg-white">
        <Suspense fallback={<div className="h-screen w-64 border-r border-black/10" />}>
          <DashboardSidebar />
        </Suspense>
        <SidebarInset>
          <Suspense fallback={<div className="flex h-screen w-full flex-col bg-white" />}>
            {children}
          </Suspense>
        </SidebarInset>
        <SidebarRail />
      </SidebarProvider>
    </DashboardSidebarProvider>
  );
}
