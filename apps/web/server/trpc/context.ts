import { getDB } from "@intellibus/db"

import { getAuth, type Session } from "@/lib/auth"

export type CreateTRPCContextOptions = {
  req: Request
}

export type TRPCContext = {
  session: Session | null
  db: Awaited<ReturnType<typeof getDB>>
  req: Request
}

export async function createTRPCContext({ req }: CreateTRPCContextOptions): Promise<TRPCContext> {
  const db = await getDB()

  let session: Session | null = null

  try {
    const auth = await getAuth()
    session = await auth.api.getSession({
      headers: Object.fromEntries(req.headers.entries()),
    })
  } catch (error) {
    session = null
  }

  return {
    session,
    db,
    req,
  }
}
