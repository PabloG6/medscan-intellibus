# Agents Implementation Guide

This document outlines how to implement the **Agents** feature in the monorepository, focusing on building **UI components** using `shadcn/ui`, styling with **Tailwind CSS**, and managing persistence via **Drizzle ORM** and **Cloudflare D1 (SQLite)**.

---

## 🧩 Project Overview

Each agent represents an autonomous AI or workflow instance that interacts with users through chat-like UIs.  
The goal is to provide a **modular**, **responsive**, and **developer-friendly** architecture consistent across the monorepo.

---

## 📁 Monorepo Structure (Example)

```
apps/
  web/
    app/            # Next.js routes, including trpc + auth handlers
    components/     # shadcn/ui-based building blocks
    lib/            # shared client utilities (auth client, trpc client, hooks)
packages/
  db/               # Drizzle schemas, migrations, data helpers
  shared/           # Cross-project helpers (e.g. agent business logic)
```

## Frontend Approach

- Default to Tailwind utility classes for layout, spacing, and typography. Reach for custom CSS only when Tailwind cannot express the needed style succinctly.
- Use shadcn/ui primitives for reusable components (buttons, cards, inputs, dialogs, etc.). Extend via Tailwind className props instead of bespoke component forks when possible.
- Keep new UI organized under `apps/web/components` or feature-specific folders. Favor composition of existing shadcn components rather than building from scratch.

## Styling Guidelines

- Maintain a Tailwind-first mindset: leverage design tokens and utility classes provided in `globals.css`.
- When adding bespoke styles, co-locate them in component files (via `className`) instead of creating new global stylesheets.
- Ensure responsive behavior using Tailwind breakpoints; confirm new layouts degrade gracefully on mobile and tablet widths.

## Data & Persistence

- Use Drizzle ORM for schema definitions, migrations, and queries. Define schema updates in `packages/db/schema.ts` and generate migrations through Drizzle workflows.
- Target Cloudflare D1 (SQLite) as the primary database. Verify new migrations run successfully against D1 before committing.
- Keep shared database logic inside `packages/db`; consume it from application packages via the workspace imports.

## API Layer (tRPC)

- Expose all agent reads/writes through the existing `apps/web/server/trpc` router to keep type-safety end-to-end.
- Authorize procedures via the Better Auth session in the TRPC context; unauthenticated callers should get a standard `UNAUTHORIZED` error.
- Shape procedure inputs/outputs with Zod schemas that mirror the Drizzle models. Derive response types from Drizzle queries when possible to avoid drift.
- Keep side-effects (e.g., queueing background jobs) inside dedicated service functions in `packages/shared` and invoke them from TRPC mutations.

## Repository Structure

- Treat the repo as a monorepo: cross-project utilities belong in `packages/`, while application-specific code lives under `apps/`.
- Reuse shared components and utilities instead of duplicating logic across applications.
- Update relevant workspace configs (e.g., `tsconfig`, `package.json`) when introducing new top-level modules or tooling.

## Implementation Checklist

1. Prototype UI with Tailwind + shadcn components.
2. Wire data flows using Drizzle models and Cloudflare D1 migrations.
3. Keep changes scoped within the monorepo structure and run lint/tests per package before submission.

## MVP TODOs (tRPC + Agents)

1. **Schema & Migrations**
   - Add `agents`, `agent_sessions`, and `agent_messages` tables in `packages/db/schema.ts` with corresponding migrations (owners, metadata JSON, status flags, timestamps).
   - Include foreign keys back to `users.id` for ownership/auditing and ensure cascade deletes for session/message rows.

2. **Service Layer**
   - Create `packages/shared/agents` (or similar) with pure functions to create agents, enqueue runs, and persist chat transcripts; these should accept a Drizzle DB instance for easy reuse.
   - Centralize any third-party API calls (OpenAI, internal LLMs) behind this layer so TRPC procedures stay thin.

3. **tRPC Procedures**
   - Define `agentRouter` under `apps/web/server/trpc/routers` with queries for list/detail/history and mutations for create/update/delete/sendMessage.
   - Add input validation via Zod, enforce auth in `trpc.procedure.use(isAuthed)` guard, and return typed responses (`inferRouterOutputs`).
   - Register the router in the root `appRouter` and export client helpers through the existing `@/lib/trpc` hooks.

4. **Client-side Hooks**
   - Generate strongly typed React hooks (`useCreateAgent`, `useAgentChat`) using the TRPC React Query adapter.
   - Wrap agent pages in a provider that prefetches critical queries on the server with `hydratableDehydratedState`.

5. **UI Integration**
   - Build agent list and detail screens under `apps/web/app/dashboard/(agents)` using shadcn cards, tables, and chat primitives.
   - Connect forms to TRPC mutations via `react-hook-form` + `zodResolver`; display optimistic updates and toast feedback.

6. **Auth + Permissions**
   - Gate all agent routes with middleware that checks `session?.user?.id`; redirect unauthenticated users to `/login`.
   - Scope TRPC queries to `ctx.session.user.id` and ensure multi-tenant safety (no cross-user reads).

7. **Background Workflows (Optional MVP+)**
   - If agents require long-running tasks, define a queue trigger (e.g., Durable Objects / Workers or external job runners) and store job state in `agent_sessions`.
   - Provide a TRPC subscription or polling endpoint for clients to observe job progress.

8. **Testing & QA**
   - Add unit tests for the service layer using a Drizzle in-memory SQLite instance (or vitest with D1 stub).
   - Create smoke tests for core TRPC mutations using the router caller.
   - Validate UI workflows manually across mobile/desktop breakpoints before shipping.
