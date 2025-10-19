"use client";

import { createContext, useCallback, useContext, useMemo, useRef, type ReactNode } from "react";

type NewChatHandler = () => void | Promise<void>;

type DashboardSidebarContextValue = {
  triggerNewChat: () => void;
  registerNewChatHandler: (handler: NewChatHandler) => () => void;
};

const DashboardSidebarContext = createContext<DashboardSidebarContextValue | null>(null);

export function DashboardSidebarProvider({ children }: { children: ReactNode }) {
  const newChatHandlerRef = useRef<NewChatHandler | null>(null);

  const registerNewChatHandler = useCallback((handler: NewChatHandler) => {
    newChatHandlerRef.current = handler;
    return () => {
      if (newChatHandlerRef.current === handler) {
        newChatHandlerRef.current = null;
      }
    };
  }, []);

  const triggerNewChat = useCallback(() => {
    void newChatHandlerRef.current?.();
  }, []);

  const value = useMemo(
    () => ({
      triggerNewChat,
      registerNewChatHandler,
    }),
    [triggerNewChat, registerNewChatHandler],
  );

  return (
    <DashboardSidebarContext.Provider value={value}>{children}</DashboardSidebarContext.Provider>
  );
}

export function useDashboardSidebar() {
  const context = useContext(DashboardSidebarContext);
  if (!context) {
    throw new Error("useDashboardSidebar must be used within a DashboardSidebarProvider.");
  }

  return context;
}
