import type { NextConfig } from "next";
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

// Enable Cloudflare bindings for local development
if (process.env.NODE_ENV === "development") {
  setupDevPlatform();
}

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    const isProduction = process.env.NODE_ENV === 'production';
    const PRODUCTION_API_URL = 'https://execution-core.cortesmailles01.workers.dev';
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || (isProduction ? PRODUCTION_API_URL : "http://localhost:8080");
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`, // Proxy to backend (Cloudflare Workers Execution Core)
      },
    ];
  },
};

export default nextConfig;
