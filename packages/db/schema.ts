import {
  sqliteTable,
  text,
  integer,
  index,
} from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import * as authSchema from "./auth.schema";

const chatMessageRoleEnum = ["system", "user", "assistant"] as const;
export type ChatMessageRole = (typeof chatMessageRoleEnum)[number];

export const chats = sqliteTable("chats", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull().default("New Chat"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => authSchema.users.id, { onDelete: "cascade" }),
});

export const chatMessages = sqliteTable(
  "chat_messages",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    chatId: text("chat_id")
      .notNull()
      .references(() => chats.id, { onDelete: "cascade" }),
    role: text("role", { enum: chatMessageRoleEnum }).notNull(),
    parts: text("parts", { mode: "json" })
      .$type<unknown>()
      .notNull(),
    attachments: text("attachments", { mode: "json" })
      .$type<unknown[]>()
      .$defaultFn(() => []),
    metadata: text("metadata", { mode: "json" }).$type<Record<string, unknown> | null>(),
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  },
  (table) => ({
    chatIdIdx: index("chat_messages_chat_id_idx").on(table.chatId),
    createdAtIdx: index("chat_messages_created_at_idx").on(table.createdAt),
  }),
);

export const chatsRelations = relations(chats, ({ many, one }) => ({
  user: one(authSchema.users, {
    fields: [chats.userId],
    references: [authSchema.users.id],
  }),
  messages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  chat: one(chats, {
    fields: [chatMessages.chatId],
    references: [chats.id],
  }),
}));

export type Chat = typeof chats.$inferSelect;
export type NewChat = typeof chats.$inferInsert;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type NewChatMessage = typeof chatMessages.$inferInsert;

// Re-export all auth schema components
export * from "./auth.schema";

export const schema = {
  // Auth tables from auth.schema.ts
  users: authSchema.users,
  sessions: authSchema.sessions,
  accounts: authSchema.accounts,
  verifications: authSchema.verifications,
  userFiles: authSchema.userFiles,
  // Application tables
  chats,
  chatMessages,
};
