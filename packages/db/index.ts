import { drizzle } from "drizzle-orm/d1";
import { schema } from "./schema";
import { eq, and, desc } from "drizzle-orm";

// Note: These imports will be available when used in the website context
let getCloudflareContext: any;
let env: any;

try {
  const cloudflareModule = require("@opennextjs/cloudflare");
  getCloudflareContext = cloudflareModule.getCloudflareContext;
} catch (e) {
  // Module not available in this context
}

try {
  const envModule = require("@intellibus/web/env");
  env = envModule.env;
} catch (e) {
  // Module not available in this context
}

// Export r2Client for compatibility

export async function getDB() {
  if (!getCloudflareContext) {
    throw new Error("Cloudflare context not available");
  }

  const { env: cfEnv } = await getCloudflareContext({ async: true });
  const d1Binding = (cfEnv as Cloudflare.Env).DB;

  return drizzle(d1Binding, { schema: schema });
}

export async function createDB(d1: D1Database) {
  return drizzle(d1, {schema: schema});
}