'use client';

import { useMemo, type ReactNode } from "react";
import { Activity, LogOut, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
}

function DashboardSidebar() {
  const { triggerNewChat } = useDashboardSidebar();

  const chatSessions = useMemo<ChatSession[]>(
    () => [
      {
        id: "1",
        title: "New Chat",
        lastMessage: new Date().toISOString(),
      },
    ],
    [],
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-black/10">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-[1px] bg-black">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg">DiagnosisAI</span>
        </div>
        <Button onClick={triggerNewChat} className="mx-2" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs opacity-60">Recent Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chatSessions.map((session) => (
                <SidebarMenuItem key={session.id}>
                  <SidebarMenuButton asChild>
                    <button
                      type="button"
                      className="flex flex-col items-start gap-1 rounded-[1px] border border-black/10 p-3 text-left hover:bg-black/5"
                    >
                      <span className="text-sm">{session.title}</span>
                      <span className="text-xs opacity-60" suppressHydrationWarning>
                        {new Date(session.lastMessage).toLocaleDateString()}
                      </span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-black/10">
        <Button variant="ghost" className="justify-start" size="sm">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
        <Button variant="ghost" className="justify-start" size="sm">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

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
