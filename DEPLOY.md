# Cloudflare Deployment Guide

This guide will walk you through deploying Intellibus to Cloudflare Pages.

## Prerequisites

1. Install Wrangler and login:
```bash
pnpm cf:login
pnpm cf:whoami  # Verify authentication
```

## One-Time Setup

### Step 1: Create Production Resources

Run these commands from the project root:

```bash
# Create D1 Database
cd apps/web
wrangler d1 create intellibus-prod
```

**Important:** Copy the database ID from the output. It will look like:
```
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

```bash
# Create KV Namespace
wrangler kv namespace create KV
```

**Important:** Copy the namespace ID from the output. It will look like:
```
id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

```bash
# Create R2 Bucket
wrangler r2 bucket create intellibus-cache-prod
```

### Step 2: Update Production Config

Edit `apps/web/wrangler.jsonc` under the `env.production` section and replace the placeholder values:

1. Replace `REPLACE_WITH_YOUR_KV_NAMESPACE_ID` with your KV namespace ID
2. Replace `REPLACE_WITH_YOUR_D1_DATABASE_ID` with your D1 database ID
3. Update `NEXT_PUBLIC_BASE_URL` with your actual domain (after first deploy, or keep as `.pages.dev`)

### Step 3: Set Environment Secrets

Set your API keys and secrets (these are encrypted and not visible in config):

```bash
cd apps/web

# Anthropic API Key
wrangler secret put ANTHROPIC_API_KEY --env production
# Paste your API key when prompted

# Better Auth Secret
wrangler secret put BETTER_AUTH_SECRET --env production
# Paste your secret when prompted

# Google Generative AI API Key
wrangler secret put GOOGLE_GENERATIVE_AI_API_KEY --env production
# Paste your API key when prompted
```

### Step 4: Run Database Migrations

Apply your database migrations to production:

```bash
cd apps/web
wrangler d1 migrations apply intellibus-prod --remote --env production
```

Or from the root:
```bash
pnpm db:migrate:prod
```

Review the migrations and confirm when prompted.

## Deploying

### First Deployment

```bash
# From project root
pnpm deploy:prod
```

This will:
1. Build all packages and apps
2. Deploy to Cloudflare Pages
3. Give you a URL like `https://intellibus-web-prod.pages.dev`

### Subsequent Deployments

```bash
pnpm deploy:prod
```

## Post-Deployment

### Set Up Custom Domain (Optional)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to Pages → intellibus-web-prod → Custom domains
3. Add your domain and follow DNS configuration steps
4. Update `NEXT_PUBLIC_BASE_URL` in `wrangler.jsonc` under `env.production` to your custom domain
5. Redeploy: `pnpm deploy:prod`

### Verify Deployment

```bash
# View live logs (production)
cd apps/web
wrangler tail --env production

# Check deployment status
wrangler pages deployments list --project-name=intellibus-web-prod
```

## Staging Environment (Optional)

You can create a staging environment by adding an `env.staging` section to `wrangler.jsonc`:

1. Add a new environment in `apps/web/wrangler.jsonc`:
```jsonc
"env": {
  "staging": {
    "name": "intellibus-web-staging",
    "vars": {
      "NEXT_PUBLIC_BASE_URL": "https://intellibus-web-staging.pages.dev",
      "ENVIRONMENT": "staging"
    },
    // ... other staging resources
  },
  "production": {
    // ... existing production config
  }
}
```

2. Create separate resources (D1, KV, R2) with `-staging` suffix
3. Add a `deploy:staging` script to `package.json`:
```json
"deploy:staging": "cd apps/web && opennextjs-cloudflare build && wrangler deploy --env staging"
```

## Troubleshooting

### Build Failures
- Ensure all dependencies are installed: `pnpm install`
- Check TypeScript errors: `pnpm build`

### Runtime Errors
- Check logs: `cd apps/web && wrangler tail --env production`
- Verify all secrets are set: `cd apps/web && wrangler secret list --env production`
- Verify database migrations: `wrangler d1 migrations list intellibus-prod --remote --env production`

### Database Issues
- Check migration status: `wrangler d1 migrations list intellibus-prod --remote`
- If migrations are out of sync, you may need to apply them manually

## Environment Variables Reference

| Variable | Type | Description |
|----------|------|-------------|
| `NEXT_PUBLIC_BASE_URL` | Public Var | Your app's public URL |
| `ENVIRONMENT` | Public Var | `production` |
| `ANTHROPIC_API_KEY` | Secret | Anthropic Claude API key |
| `BETTER_AUTH_SECRET` | Secret | Better Auth encryption secret |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Secret | Google Gemini API key |

## Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler)
- [D1 Database Docs](https://developers.cloudflare.com/d1)
