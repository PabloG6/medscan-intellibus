"use client";

import type { ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Activity, LogOut, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import { DashboardSidebarProvider, useDashboardSidebar } from "./dashboard-context";
import { useTRPC } from "@/lib/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { DashboardSidebar } from "@/components/dashboard-sidebar";



export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DashboardSidebarProvider>
      <SidebarProvider className="bg-white">
        <DashboardSidebar />
        <SidebarInset>{children}</SidebarInset>
        <SidebarRail />
      </SidebarProvider>
    </DashboardSidebarProvider>
  );
}
