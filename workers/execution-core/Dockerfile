FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# Expose the default Wrangler port
EXPOSE 8787

# Parse args/env
ENV WRANGLER_SEND_METRICS=false

# Run Wrangler in dev mode, accessible from outside container
CMD ["npx", "wrangler", "dev", "--host", "0.0.0.0", "--port", "8787"]
