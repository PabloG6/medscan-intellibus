# Agents Implementation Guide

This document outlines how to implement the **Agents** feature in the monorepository, focusing on building **UI components** using `shadcn/ui`, styling with **Tailwind CSS**, and managing persistence via **Drizzle ORM** and **Cloudflare D1 (SQLite)**.

---

## 🧩 Project Overview

Each agent represents an autonomous AI or workflow instance that interacts with users through chat-like UIs.  
The goal is to provide a **modular**, **responsive**, and **developer-friendly** architecture consistent across the monorepo.

---

## 📁 Monorepo Structure (Example)
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

## Repository Structure

- Treat the repo as a monorepo: cross-project utilities belong in `packages/`, while application-specific code lives under `apps/`.
- Reuse shared components and utilities instead of duplicating logic across applications.
- Update relevant workspace configs (e.g., `tsconfig`, `package.json`) when introducing new top-level modules or tooling.

## Implementation Checklist

1. Prototype UI with Tailwind + shadcn components.
2. Wire data flows using Drizzle models and Cloudflare D1 migrations.
3. Keep changes scoped within the monorepo structure and run lint/tests per package before submission.
