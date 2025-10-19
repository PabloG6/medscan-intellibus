import {
  sqliteTable,
  text,
  integer,
} from "drizzle-orm/sqlite-core";
import * as authSchema from "./auth.schema";


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

};
