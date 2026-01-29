# SignalOps Deployment Guide

Deploy SignalOps with frontend on Cloudflare Pages and backend on Fly.io.

## Architecture

```
┌─────────────────────────┐     ┌─────────────────────────┐
│  Cloudflare Pages       │     │  Fly.io                 │
│  signalops.pages.dev    │────▶│  signalops-api.fly.dev  │
│  (Frontend: Next.js)    │     │  (Go REST API)          │
└─────────────────────────┘     └───────────┬─────────────┘
                                            │ gRPC
                              ┌─────────────┴─────────────┐
                              │                           │
                    ┌─────────▼─────────┐   ┌─────────────▼───────┐
                    │ signalops-strategy │   │ signalops-risk      │
                    │ (Python gRPC)      │   │ (Java gRPC)         │
                    └────────────────────┘   └─────────────────────┘
```

---

## Quick Start

### 1. Fly.io Setup (One-Time)

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login (creates account if needed)
fly auth login

# Create apps (run from repo root)
fly apps create signalops-api
fly apps create signalops-strategy  
fly apps create signalops-risk
```

### 2. Get Fly.io API Token

```bash
fly tokens create deploy -x 999999h
```

Add to GitHub: **Settings → Secrets → Actions → `FLY_API_TOKEN`**

### 3. Deploy

Push to main, or manually trigger:

```bash
git push origin main
```

---

## Configuration Files

| Service | Config | Dockerfile |
|---------|--------|------------|
| Go API | `go-execution-core/fly.toml` | `go-execution-core/Dockerfile` |
| Python Strategy | `python-strategy-engine/fly.toml` | `python-strategy-engine/Dockerfile` |
| Java Risk | `java-risk-manager/fly.toml` | `java-risk-manager/Dockerfile` |

---

## Environment Variables

### Fly.io (set via Dashboard or CLI)

```bash
# Go API
fly secrets set DATABASE_URL="postgres://..." -a signalops-api
fly secrets set REDIS_URL="redis://..." -a signalops-api

# Set for all apps
fly secrets set GEMINI_API_KEY="..." -a signalops-api
```

### Cloudflare Pages

Set in Dashboard → signalops-frontend → Settings → Environment variables:
- `NEXT_PUBLIC_API_URL` = `https://signalops-api.fly.dev`

---

## Useful Commands

```bash
# Deploy specific service
fly deploy --config go-execution-core/fly.toml

# View logs
fly logs -a signalops-api

# SSH into container
fly ssh console -a signalops-api

# Scale down (save credits)
fly scale count 0 -a signalops-api
```

---

## Costs

| Resource | Free Tier |
|----------|-----------|
| Fly.io VMs | $5 credit/month |
| Cloudflare Pages | Unlimited |
| Upstash Redis | 10k commands/day |

For demo/portfolio usage, this setup costs **$0/month**.
