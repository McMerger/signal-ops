import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

// Enable Cloudflare bindings for local development
if (process.env.NODE_ENV === "development") {
    setupDevPlatform();
}

/** @type {import('next').NextConfig} */
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
                source: "/api/v1/:path*",
                destination: `${apiUrl}/api/v1/:path*`,
            },
        ];
        // Do NOT rewrite /api/auth/* - let Next.js handle it
    },
};

export default nextConfig;
