# IntelliBus

This is the monorepo for the IntelliBus project.

## Packages

This monorepo contains the following packages:

- `apps/web`: The main web application.
- `packages/db`: The database schema and migrations.
- `vision`: The computer vision component.

## Getting Started

To get started, install the dependencies:

```bash
pnpm install
```

## Development

To start the development servers for all apps:

```bash
pnpm dev
```

## Scripts

The following scripts are available:

- `dev`: Start the development servers.
- `build`: Build all apps and packages.
- `start`: Start the production servers.
- `lint`: Lint all apps and packages.
- `clean`: Remove all `node_modules`, `.next`, and `dist` folders.
- `test`: Run all tests.
- `cf:deploy`: Deploy to Cloudflare.
- `cf:dev`: Start a local Cloudflare worker.
- `cf:tail`: Tail the Cloudflare worker logs.
- `cf:login`: Login to Cloudflare.
- `cf:whoami`: Check the current Cloudflare user.
- `cf:types`: Generate Cloudflare worker types.
- `deploy:prod`: Deploy the web app to production.
- `db:generate`: Generate the database schema.
- `db:migrate`: Run database migrations.
- `db:studio`: Start the database studio.
