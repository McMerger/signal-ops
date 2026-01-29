# Cloudflare Pages Deployment

Deploy the SignalOps frontend to Cloudflare's global edge network.

## Quick Start

The frontend automatically deploys to Cloudflare Pages when you push to the `main` branch.

## Setup (One-Time)

### 1. Get Cloudflare Credentials

1. Log into [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Workers & Pages** → **Overview**
3. Copy your **Account ID** from the right sidebar
4. Create an API Token:
   - Go to **My Profile** → **API Tokens**
   - Click **Create Token**
   - Use the **Edit Cloudflare Workers** template
   - Copy the token

### 2. Add GitHub Secrets

In your GitHub repository:
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add these **Repository secrets**:
   - `CLOUDFLARE_API_TOKEN` - Your API token
   - `CLOUDFLARE_ACCOUNT_ID` - Your account ID
3. Add this **Repository variable**:
   - `NEXT_PUBLIC_API_URL` - Your backend API URL (e.g., `https://api.signalops.io`)

### 3. Deploy

Push to `main` branch or manually trigger the workflow:

```bash
git push origin main
```

## Local Development

Test the Cloudflare build locally:

```bash
cd frontend
npm run build:cf    # Build for Cloudflare
npm run preview     # Preview locally with Wrangler
```

## Configuration Files

| File | Purpose |
|------|---------|
| `frontend/wrangler.toml` | Cloudflare Workers/Pages config |
| `.github/workflows/cloudflare-deploy.yml` | Automated deployment workflow |
| `frontend/next.config.ts` | Next.js config with Cloudflare bindings |

## Environment Variables

Set these in Cloudflare Dashboard (**Workers & Pages** → **signalops-frontend** → **Settings** → **Environment variables**):

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL for production |

## Troubleshooting

### Build fails with dependency errors
```bash
npm ci --legacy-peer-deps
```

### Pages project not found
Run deployment manually first to create the project:
```bash
cd frontend
npx wrangler pages deploy .vercel/output/static --project-name=signalops-frontend
```
