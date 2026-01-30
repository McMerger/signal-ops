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
    // SCORCHED EARTH: Hardcoded Production URL
    // We explicitly ignore process.env.NEXT_PUBLIC_API_URL to prevents defaults to localhost
    const apiUrl = "https://execution-core.cortesmailles01.workers.dev";
    return [
      // Explicitly rewrite specific backend modules to avoid intercepting /api/auth (NextAuth)
      {
        source: "/api/portfolio/:path*",
        destination: `${apiUrl}/api/portfolio/:path*`,
      },
      {
        source: "/api/market/:path*",
        destination: `${apiUrl}/api/market/:path*`,
      },
      {
        source: "/api/strategy/:path*",
        destination: `${apiUrl}/api/strategy/:path*`,
      },
      {
        source: "/api/research/:path*",
        destination: `${apiUrl}/api/research/:path*`,
      },
      {
        source: "/api/user/:path*",
        destination: `${apiUrl}/api/user/:path*`,
      },
    ];
    // Do NOT rewrite /api/auth/* - let Next.js handle it
  },
};

export default nextConfig;
