# Vision API Deployment Guide (Fly.io)

## Prerequisites

1. Install Fly.io CLI:
```bash
brew install flyctl
```

2. Sign up and authenticate:
```bash
fly auth signup
# or if you have an account:
fly auth login
```

## Deployment Steps

### 1. Launch the App (First Time)

From the `vision` directory:

```bash
cd ~/nodejs/intellibus/vision
fly launch --no-deploy
```

This will:
- Create a `fly.toml` configuration (already exists)
- Ask you to choose an app name (or use the default `intellibus-vision-api`)
- Ask you to select a region (recommend `sjc` for San Jose)

### 2. Deploy the App

```bash
fly deploy
```

This will:
- Build the Docker image
- Push it to Fly.io
- Deploy your FastAPI app
- Provide you with a URL like `https://intellibus-vision-api.fly.dev`

### 3. Check Status

```bash
# View app status
fly status

# View logs
fly logs

# Open app in browser (will show API docs)
fly open
```

## Configuration

### Scaling

If you need more resources for your ML model:

```bash
# Increase memory to 2GB
fly scale memory 2048

# Add more CPUs
fly scale vm shared-cpu-2x
```

### Environment Variables

Add any secrets/environment variables:

```bash
fly secrets set MY_SECRET=value
```

### Auto-scaling

The current config scales to zero when idle (free tier friendly):
- `auto_stop_machines = true` - Stops when no requests
- `auto_start_machines = true` - Starts on first request
- `min_machines_running = 0` - No minimum instances

For production, keep at least 1 running:
```toml
min_machines_running = 1
```

## Update Your Next.js App

Once deployed, update the production `VISION_API_URL`:

1. In `apps/web/wrangler.jsonc`:
```json
"production": {
  "vars": {
    "VISION_API_URL": "https://intellibus-vision-api.fly.dev"
  }
}
```

2. Set as a Cloudflare Workers secret:
```bash
cd ~/nodejs/intellibus/apps/web
npx wrangler secret put VISION_API_URL --env production
# Enter: https://intellibus-vision-api.fly.dev
```

## Testing

Test your deployed API:

```bash
# Health check
curl https://intellibus-vision-api.fly.dev/docs

# Test prediction endpoint
curl -X POST https://intellibus-vision-api.fly.dev/predict/cxr \
  -H "Content-Type: application/json" \
  -d "{\"image_base64\": \"$(cat ~/image_base64.txt)\"}"
```

## Monitoring

```bash
# View metrics
fly dashboard

# SSH into the machine
fly ssh console

# View resource usage
fly status
```

## Costs

Fly.io Free Tier includes:
- Up to 3 shared-cpu-1x VMs with 256MB RAM
- 160GB outbound data transfer
- Your ML model might need paid tier for more RAM (1-2GB)

Estimated cost with 1GB RAM: **~$5-10/month**

## Troubleshooting

### Build fails due to memory
Increase build resources:
```toml
[build]
  [build.args]
    BUILDKIT_STEP_LOG_MAX_SIZE = 10485760
```

### App crashes on start
Check logs:
```bash
fly logs
```

Common issues:
- Not enough RAM for the model
- Missing system dependencies

### Slow first request
This is normal when scaling from zero. The machine starts on first request (cold start).

To avoid: Set `min_machines_running = 1` in `fly.toml`
