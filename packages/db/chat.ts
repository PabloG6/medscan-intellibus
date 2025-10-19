import { asc, desc, eq, and } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { Chat, ChatMessage, ChatMessageRole } from "./schema";
import { chats, chatMessages } from "./schema";

export type ChatAttachment = {
  id: string;
  mediaType: string;
  dataUrl: string;
  filename?: string;
  alt?: string;
  labels?: unknown;
};

export type ChatMessageMetadata = Record<string, unknown> | null;

export interface CreateChatParams {
  userId: string;
  title?: string;
}

export interface InsertChatMessageParams {
  chatId: string;
  role: ChatMessageRole;
  parts: unknown;
  attachments?: ChatAttachment[];
  metadata?: ChatMessageMetadata;
  id?: string;
  createdAt?: Date;
}

export interface UpdateChatMessageParams {
  chatId: string;
  messageId: string;
  metadata?: ChatMessageMetadata;
  attachments?: ChatAttachment[];
}

type Database = DrizzleD1Database<typeof import("./schema").schema>;

function resolveDb(db?: Database) {
  if (!db) {
    throw new Error("Database instance is required");
  }
  return db;
}

export async function createChat(db: Database, params: CreateChatParams): Promise<Chat> {
  const database = resolveDb(db);
  const now = new Date();
  const chatId = crypto.randomUUID();

  await database.insert(chats).values({
    id: chatId,
    userId: params.userId,
    title: params.title ?? "New Chat",
    createdAt: now,
    updatedAt: now,
  });

  const createdChat = await database.query.chats.findFirst({
    where: and(eq(chats.id, chatId), eq(chats.userId, params.userId)),
  });

  if (!createdChat) {
    throw new Error("Failed to create chat");
  }

  return createdChat;
}

export async function listChats(db: Database, userId: string): Promise<Chat[]> {
  const database = resolveDb(db);
  return database
    .select()
    .from(chats)
    .where(eq(chats.userId, userId))
    .orderBy(desc(chats.updatedAt));
}

export async function getChat(db: Database, chatId: string, userId: string): Promise<Chat | null> {
  const database = resolveDb(db);

  const record = await database.query.chats.findFirst({
    where: and(eq(chats.id, chatId), eq(chats.userId, userId)),
  });

  return record ?? null;
}

export async function getChatMessages(
  db: Database,
  chatId: string,
  userId: string,
): Promise<ChatMessage[]> {
  const database = resolveDb(db);

  const chat = await getChat(database, chatId, userId);
  if (!chat) {
    return [];
  }

  return database.query.chatMessages.findMany({
    where: eq(chatMessages.chatId, chatId),
    orderBy: asc(chatMessages.createdAt),
  });
}

export async function insertChatMessage(
  db: Database,
  params: InsertChatMessageParams,
  userId: string,
): Promise<ChatMessage> {
  const database = resolveDb(db);

  const chat = await getChat(database, params.chatId, userId);
  if (!chat) {
    throw new Error("Chat not found");
  }

  const id = params.id ?? crypto.randomUUID();
  const createdAt = params.createdAt ?? new Date();

  await database.insert(chatMessages).values({
    id,
    chatId: params.chatId,
    role: params.role,
    parts: params.parts,
    attachments: params.attachments ?? [],
    metadata: params.metadata ?? null,
    createdAt,
  });

  await database
    .update(chats)
    .set({ updatedAt: new Date() })
    .where(eq(chats.id, params.chatId));

  const message = await database.query.chatMessages.findFirst({
    where: eq(chatMessages.id, id),
  });

  if (!message) {
    throw new Error("Failed to insert message");
  }

  return message;
}

export async function updateChatMessage(
  db: Database,
  params: UpdateChatMessageParams,
  userId: string,
): Promise<ChatMessage> {
  const database = resolveDb(db);

  const chat = await getChat(database, params.chatId, userId);
  if (!chat) {
    throw new Error("Chat not found");
  }

  await database
    .update(chatMessages)
    .set({
      metadata: params.metadata ?? null,
      attachments: params.attachments ?? [],
    })
    .where(and(eq(chatMessages.id, params.messageId), eq(chatMessages.chatId, params.chatId)));

  await database
    .update(chats)
    .set({ updatedAt: new Date() })
    .where(eq(chats.id, params.chatId));

  const updated = await database.query.chatMessages.findFirst({
    where: eq(chatMessages.id, params.messageId),
  });

  if (!updated) {
    throw new Error("Failed to update message");
  }

  return updated;
}
