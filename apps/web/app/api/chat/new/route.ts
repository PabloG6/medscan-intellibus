'use server';

import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { getDB, createChat } from "@intellibus/db";
import { generateChatMetadata } from "@/lib/chat/generate-chat-metadata";

export async function POST(request: Request) {
  const auth = await getAuth();
  const session = await auth.api.getSession({
    headers: Object.fromEntries(request.headers.entries()),
  });

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDB();
  const chat = await createChat(db, {
    userId: session.user.id,
    title: "Untitled",
    description: "New diagnostic session",
  });

  return NextResponse.json({
    chatId: chat.id,
    title: chat.title,
    description: chat.description,
  });
}
