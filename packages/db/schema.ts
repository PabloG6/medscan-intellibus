import {
  sqliteTable,
  text,
  integer,
} from "drizzle-orm/sqlite-core";
import * as authSchema from "./auth.schema";

// Define column schema type locally to avoid circular dependencies
export type ColumnSchema = {
  name: string;
  prompt: string;
  primaryKey?: boolean;
  unique?: boolean;
  autoIncrement?: boolean;
  nullable?: boolean;
  reanalyzeExisting?: boolean;
};

export const jobStatusEnum = ["queued", "in_progress", "completed", "failed", "waiting"] as const;
export const documentStatusEnum = ["queued", "processing", "completed", "failed", "error"] as const;
export const subscriptionStatusEnum = ["active", "inactive", "cancelled", "past_due"] as const;
export const subscriptionPlanEnum = ["basic", "pro", "enterprise"] as const;
export const extractionStatusEnum = ["success", "failed"] as const;
export const workflowTypeEnum = ["ocr", "reanalyze"] as const;

export const projects = sqliteTable("projects", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  cloudflareId: text("cloudflare_id").notNull(),
  user_id: text("user_id").references(() => authSchema.users.id).notNull(),
  database: text("database").notNull(),
  fileSize: integer("file_size"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdateFn(() => new Date()),
});

export const tables = sqliteTable("tables", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  columns: text("columns", { mode: "json" }).$type<ColumnSchema[]>(),
  batchId: text("batch_id"),
  user_id: text("user_id").references(() => authSchema.users.id).notNull(),

  lastExractedAt: integer("last_extracted_at", { mode: "timestamp" }),
  createdAt: integer("inserted_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdateFn(() => new Date()),
  projects_id: integer("projects_id", { mode: "number" })
    .references(() => projects.id)
    .notNull(),
});

export const batch_processes = sqliteTable("batch_processes", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  outputFile: text("output_file"),
  batchId: text("batch_id").notNull().unique(),
  completedRequests: integer("completed_requests"),
  failedRequests: integer("failed_requests"),
  errorId: text("error_id"),
  user_id: text("user_id").references(() => authSchema.users.id).notNull(),

  status: text("status").notNull().default("init"),
  table_id: integer("table_id", { mode: "number" })
    .references(() => tables.id)
    .notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdateFn(() => new Date()),
});
export const jobs = sqliteTable("jobs", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    user_id: text("user_id").references(() => authSchema.users.id).notNull(),
  projects_id: integer("projects_id", { mode: "number" }).references(() => projects.id).notNull(),
  workflow_type: text("workflowType").default("insert-workflow"),
  table_id: integer("table_id", { mode: "number" })
    .references(() => tables.id)
    .notNull(),
    workflowInstanceId: text("workflow_instance_id").notNull(),
  createdAt: integer("inserted_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$onUpdateFn(() => new Date())
    .$defaultFn(() => new Date()),
  jobStatus: text("job_status").default("queued").notNull(),
});
export const documents = sqliteTable("documents", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  file_id: text(),
  mistral_id: text(),
  name: text(),
  user_id: text("user_id").references(() => authSchema.users.id).notNull(),
  processedAt: integer("last_completed_job_date", { mode: "timestamp" }),
  status: text("document_status")
    .default("queued")
    .notNull(),
  file_size: integer("file_size"), // File size in bytes
  page_count: integer("page_count"), // Number of pages in the PDF
  createdAt: integer("inserted_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdateFn(() => new Date()),
  project_id: integer("project_id", { mode: "number" })
    .references(() => projects.id)
    .notNull(),
  table_id: integer("table_id", { mode: "number" })
    .notNull()
    .references(() => tables.id),
});

export const document_extraction_attempts = sqliteTable("document_extraction_attempts", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  document_id: integer("document_id", { mode: "number" })
    .references(() => documents.id)
    .notNull(),
  job_id: integer("job_id", { mode: "number" })
    .references(() => jobs.id),
  workflow_instance_id: text("workflow_instance_id").notNull(),
  workflow_type: text("workflow_type").notNull(), // "ocr" or "reanalyze"
  status: text("status").notNull(), // "success" or "failed"
  extracted_data: text("extracted_data", { mode: "json" }), // JSON of extracted data on success
  error_message: text("error_message"), // Short error message on failure
  error_details: text("error_details"), // Full error details (JSON stringified)
  attempt_number: integer("attempt_number").notNull(), // Sequential attempt number (1, 2, 3...)
  started_at: integer("started_at", { mode: "timestamp" }).notNull(),
  completed_at: integer("completed_at", { mode: "timestamp" }).notNull(),
  processing_duration_ms: integer("processing_duration_ms"), // Duration in milliseconds
  user_id: text("user_id").references(() => authSchema.users.id).notNull(),
  project_id: integer("project_id", { mode: "number" })
    .references(() => projects.id)
    .notNull(),
  table_id: integer("table_id", { mode: "number" })
    .references(() => tables.id)
    .notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdateFn(() => new Date()),
});

export const subscriptions = sqliteTable("subscriptions", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  user_id: text("user_id").references(() => authSchema.users.id).notNull(),
  plan: text("plan").notNull().default("basic"),
  status: text("status").notNull().default("active"),
  tokens_included: integer("tokens_included").notNull().default(100),
  tokens_used: integer("tokens_used").notNull().default(0),
  tokens_remaining: integer("tokens_remaining").notNull().default(100),
  billing_cycle_start: integer("billing_cycle_start", { mode: "timestamp" }).notNull(),
  billing_cycle_end: integer("billing_cycle_end", { mode: "timestamp" }).notNull(),
  paddle_subscription_id: text("paddle_subscription_id"),
  paddle_customer_id: text("paddle_customer_id"),
  paddle_product_id: text("paddle_product_id"),
  paddle_price_id: text("paddle_price_id"),
  paddle_transaction_id: text("paddle_transaction_id"),
  next_billing_date: integer("next_billing_date", { mode: "timestamp" }),
  cancel_at_period_end: integer("cancel_at_period_end", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdateFn(() => new Date()),
});

export const subscription_usage = sqliteTable("subscription_usage", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  subscription_id: integer("subscription_id", { mode: "number" }).references(() => subscriptions.id).notNull(),
  user_id: text("user_id").references(() => authSchema.users.id).notNull(),
  document_id: integer("document_id", { mode: "number" }).references(() => documents.id),
  job_id: integer("job_id", { mode: "number" }).references(() => jobs.id),
  tokens_consumed: integer("tokens_consumed").notNull().default(1),
  usage_type: text("usage_type").notNull().default("ocr_analysis"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const downloads = sqliteTable("downloads", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  user_id: text("user_id").references(() => authSchema.users.id).notNull(),
  project_id: integer("project_id", { mode: "number" }).references(() => projects.id).notNull(),
  table_id: integer("table_id", { mode: "number" }).references(() => tables.id), // nullable for SQLite exports
  export_key: text("export_key").notNull(), // R2 bucket key location
  filename: text("filename").notNull(),
  format: text("format").notNull().default("csv"), // csv, json, sqlite
  status: text("status").notNull().default("pending"), // pending, completed, queued, failed
  file_size: integer("file_size"), // in bytes
  record_count: integer("record_count"), // number of records exported (null for sqlite)
  workflow_instance_id: text("workflow_instance_id"),
  
  // New fields for SQLite exports
  export_type: text("export_type").notNull().default("table"), // table, sqlite
  cloudflare_export_id: text("cloudflare_export_id"), // Cloudflare D1 export ID
  download_url: text("download_url"), // Presigned URL for download
  expires_at: integer("expires_at", { mode: "timestamp" }), // When download expires
  email_sent: integer("email_sent", { mode: "boolean" }).default(false),
  
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  completedAt: integer("completed_at", { mode: "timestamp" }),
});

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
  projects,
  tables,
  documents,
  document_extraction_attempts,
  jobs,
  batch_processes,
  subscriptions,
  subscription_usage,
  downloads,
};
