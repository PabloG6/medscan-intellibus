import { TRPCError } from "@trpc/server";
import { listChats } from "@intellibus/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const appRouter = createTRPCRouter({
  chatHistory: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session?.user?.id;

      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const chats = await listChats(ctx.db, userId);
      console.log(chats);
      return chats;
    }),
});

export type AppRouter = typeof appRouter;
