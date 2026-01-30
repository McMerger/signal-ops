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
    // Default to Production URL if env var is missing (Safest for Cloudflare)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://execution-core.cortesmailles01.workers.dev";
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`, // Proxy to backend (Cloudflare Workers Execution Core)
      },
    ];
  },
};

export default nextConfig;
