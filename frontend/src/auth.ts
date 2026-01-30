import NextAuth, { User } from "next-auth"
import GitHub from "next-auth/providers/github"
// Node.js crypto removed in favor of Web Crypto API for Edge compatibility

// SCORCHED EARTH POLICY: Hardcoded Production URL (same as auth-service.ts)
const API_URL = 'https://execution-core.cortesmailles01.workers.dev';

async function backendLogin(email: string, pass: string) {
    const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
    });
    if (!res.ok) {
        throw new Error(`Login failed: ${res.status}`);
    }
    return res.json();
}

async function backendSignup(email: string, pass: string, name: string) {
    const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass, name })
    });
    if (!res.ok) {
        throw new Error(`Signup failed: ${res.status}`);
    }
    return res.json();
}

// Helper for Edge-compatible HMAC
async function hmacSha256(key: string, data: string): Promise<string> {
    const encoder = new TextEncoder();
    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        encoder.encode(key),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    const signature = await crypto.subtle.sign(
        "HMAC",
        cryptoKey,
        encoder.encode(data)
    );
    return Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    trustHost: true,
    debug: true,
    providers: [GitHub],
    callbacks: {
        async jwt({ token, user, account, profile }) {
            // Initial sign in
            if (user && profile && account?.provider === "github") {
                const bridgeSecret = process.env.AUTH_BRIDGE_SECRET || "default_insecure_secret_change_me_please";
                const email = user.email;
                if (!email) {
                    console.error("No email provided by GitHub profile");
                    return token;
                }

                try {
                    // Use Web Crypto API instead of Node.js crypto
                    const derivedPassword = await hmacSha256(bridgeSecret, user.id || email);

                    console.log(`[Auth Bridge] Attempting login for ${email}`);
                    const loginData = await backendLogin(email, derivedPassword);
                    token.backendToken = loginData.token;
                    token.backendUser = loginData.user;
                } catch (e) {
                    console.log(`[Auth Bridge] Login failed, attempting signup for ${email}`);
                    try {
                        const bridgeSecret = process.env.AUTH_BRIDGE_SECRET || "default_insecure_secret_change_me_please";
                        const derivedPassword = await hmacSha256(bridgeSecret, user.id || email);

                        const signupData = await backendSignup(email, derivedPassword, user.name || "GitHub User");
                        token.backendToken = signupData.token;
                        token.backendUser = signupData.user;
                    } catch (err) {
                        console.error("[Auth Bridge] Signup failed", err);
                        // We will allow the session to be created but without backend access
                        // Client side will handle the missing token
                    }
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (token.backendToken) {
                // Explicit casting to satisfy strict TS
                session.backendToken = token.backendToken as string;
                if (session.user) {
                    session.user.role = (token.backendUser as any)?.role;
                    // We merge other properties if needed
                }
            }
            return session;
        }
    }
})
