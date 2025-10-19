import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { listChats, createChat, getChat, getChatMessages } from "@intellibus/db";
import { dbMessageToDiagnosisMessage } from "@/lib/chat/transformers";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const appRouter = createTRPCRouter({
  chatHistory: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session?.user?.id;

      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const chats = await listChats(ctx.db, userId);
      return chats;
    }),

  dashboardInitialize: protectedProcedure
    .input(z.object({
      chatId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;

      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      let chat = input.chatId
        ? await getChat(ctx.db, input.chatId, userId)
        : null;

      if (!chat) {
        chat = await createChat(ctx.db, {
          userId,
          title: "Untitled",
          description: "New diagnostic session",
        });

        return {
          redirect: `/dashboard?chatId=${chat.id}`,
        };
      }

      const dbMessages = await getChatMessages(ctx.db, chat.id, userId);
      const messages = dbMessages.map(dbMessageToDiagnosisMessage);

      return {
        chatId: chat.id,
        messages,
      };
    }),
});

export type AppRouter = typeof appRouter;
