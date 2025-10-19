'use client';
import { Activity, LogOut, Plus, Settings, SquarePen } from "lucide-react";
import { Button } from "./ui/button";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/lib/trpc/client";
import { useDashboardSidebar } from "@/app/dashboard/dashboard-context";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "./ui/skeleton";
import { Item, ItemContent, ItemDescription, ItemTitle } from "./ui/item";
function formatUpdatedAt(date: Date | string | null | undefined): string {
    if (!date) return "Unknown";
    const value = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(value.getTime())) return "Unknown";
    return value.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function DashboardSidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeChatId = searchParams?.get("chatId") ?? undefined;
    const { triggerNewChat } = useDashboardSidebar();
    const trpc = useTRPC();
    const { data: chats, isLoading, isError } = useQuery(trpc.chatHistory.queryOptions());

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="border-b border-black/10">
                <div className="flex items-center justify-between gap-2 px-2 py-3">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-[1px] bg-black">
                            <Activity className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-lg">DiagnosisAI</span>
                    </div>
                    <Button onClick={triggerNewChat} size="icon" variant='ghost' >
                        <SquarePen className="h-4 w-4" />
                    </Button>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs opacity-60">Your Chats</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {isLoading && (
                                <SidebarMenuItem>
                                    <div className="space-y-2 p-3">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-3 w-2/3" />
                                    </div>
                                </SidebarMenuItem>
                            )}

                            {isError && (
                                <SidebarMenuItem>
                                    <div className="space-y-2 p-3 text-left text-xs text-red-600">
                                        Unable to load chats right now. Please try again later.
                                    </div>
                                </SidebarMenuItem>
                            )}

                            {!isLoading && !isError && (chats?.length ?? 0) === 0 && (
                                <SidebarMenuItem>
                                    <div className="space-y-2 p-3 text-left text-xs opacity-60">
                                        No chats found. Start a new conversation to begin.
                                    </div>
                                </SidebarMenuItem>
                            )}

                            {(chats ?? []).map((chat) => {
                                const isActive = chat.id === activeChatId;
                                const updatedLabel = formatUpdatedAt((chat as { updatedAt?: Date | string | null } | undefined)?.updatedAt);

                                return (
                                    <SidebarMenuItem key={chat.id} data-active={isActive}>

                                        <Item>
                                            <ItemContent>
                                                <ItemTitle>{chat.title}</ItemTitle>
                                                <ItemDescription>
                                                    Standard styling with subtle background and borders.
                                                </ItemDescription>
                                            </ItemContent>

                                        </Item>

                                    </SidebarMenuItem>
                                );
                            })}
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
