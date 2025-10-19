import { z } from "zod"

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc"

export const appRouter = createTRPCRouter({
  createPatient: publicProcedure.input(z.object({name: z.string()})).mutation(({input}) => {}),
  health: publicProcedure.query(() => ({
    status: "ok",
    timestamp: new Date().toISOString(),
  })),
  me: protectedProcedure.query(({ ctx }) => {
    return {
      user: ctx.session?.user ?? null,
    }
  }),
  echo: publicProcedure.input(z.object({ message: z.string().min(1) })).mutation(({ input }) => {
    return {
      message: input.message,
    }
  }),
})

export type AppRouter = typeof appRouter
