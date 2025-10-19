import { initTRPC, TRPCError } from "@trpc/server"
import superjson from "superjson"

import type { TRPCContext } from "./context"

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
})

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    })
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  })
})

export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)
