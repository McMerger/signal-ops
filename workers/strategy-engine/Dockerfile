FROM node:20-alpine

WORKDIR /app

# Install dependencies if package.json exists, otherwise just setup for npx
COPY requirements.txt .
# Python/Pip setup? Cloudflare Workers don't run local Python unless using miniflare's storage?
# Actually, standard wrangler dev for Python workers uses a local runtime.
# But we need python3 installed in the container?
RUN apk add --no-cache python3 py3-pip

# Copy source
COPY . .

# Expose port
EXPOSE 8788

# Run Wrangler
CMD ["npx", "wrangler", "dev", "--host", "0.0.0.0", "--port", "8788"]
