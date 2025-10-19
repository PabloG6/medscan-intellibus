'use server';

import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { getDB, updateChatMessage } from "@intellibus/db";
import { dbMessageToDiagnosisMessage } from "@/lib/chat/transformers";

export async function PATCH(request: Request) {
  const auth = await getAuth();
  const session = await auth.api.getSession({
    headers: Object.fromEntries(request.headers.entries()),
  });

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { chatId, messageId, metadata, attachments } = body ?? {};

  if (!chatId || !messageId) {
    return NextResponse.json({ error: "chatId and messageId are required" }, { status: 400 });
  }

  const db = await getDB();

  try {
    const updated = await updateChatMessage(
      db,
      {
        chatId,
        messageId,
        metadata: metadata ?? null,
        attachments: attachments ?? [],
      },
      session.user.id,
    );

    return NextResponse.json({
      message: dbMessageToDiagnosisMessage(updated),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to update message",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
