'use server';

import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { getDB, createChat } from "@intellibus/db";

export async function POST(request: Request) {
  const auth = await getAuth();
  const session = await auth.api.getSession({
    headers: Object.fromEntries(request.headers.entries()),
  });

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDB();
  const chat = await createChat(db, { userId: session.user.id });

  return NextResponse.json({ chatId: chat.id });
}
