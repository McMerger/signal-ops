"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Lightning, CircleNotch, GithubLogo } from "@phosphor-icons/react";
import { signIn } from "next-auth/react";
import { ReticleFrame } from "@/components/ui/context-frames";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const [typing, setTyping] = useState(false);

    // Typing activity timer
    useEffect(() => {
        if (!typing) return;
        const timer = setTimeout(() => setTyping(false), 500);
        return () => clearTimeout(timer);
    }, [email, password, typing]); // Reset timer on change

    const handleInput = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
        setTyping(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(email, password);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message || "Failed to login");
            } else {
                setError("Failed to login");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden font-security">
            {/* Background Effects */}
            {/* WebGL Scanner removed */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-50" />

            <div
                className="w-full max-w-md p-8 relative z-10 animate-[fadeInUp_0.5s_ease-out] backdrop-blur-md bg-white/70 border border-zinc-200 shadow-2xl rounded-2xl"
            >
                <div className="flex flex-col items-center mb-8">
                    <ReticleFrame className="mb-4 !text-blue-600 !border-blue-600">
                        <Lightning weight="fill" className="h-6 w-6 text-blue-600" />
                    </ReticleFrame>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight uppercase">Authentication Required</h1>
                    <p className="text-zinc-500 mt-2 font-mono text-xs tracking-widest uppercase">Sign in to terminal</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-600 uppercase tracking-widest text-xs">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={handleInput(setEmail)}
                            className="w-full bg-white border border-zinc-300 rounded-sm px-4 py-3 text-foreground placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-mono"
                            placeholder="ADMIN@SIGNALOPS.COM"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-600 uppercase tracking-widest text-xs">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={handleInput(setPassword)}
                            className="w-full bg-white border border-zinc-300 rounded-sm px-4 py-3 text-foreground placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-mono"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-3 rounded-none bg-red-100 border border-red-500/20 text-red-600 text-sm text-center font-mono uppercase">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#002b36] hover:bg-[#073642] text-white font-bold rounded-sm py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center uppercase tracking-widest shadow-lg"
                    >
                        {loading ? <CircleNotch className="animate-spin h-5 w-5" /> : "Access Terminal"}
                    </button>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-zinc-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-zinc-500 font-mono tracking-widest">Or continue with</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                        className="w-full bg-[#24292F] hover:bg-[#24292F]/90 text-white font-bold rounded-sm py-3 transition-colors flex items-center justify-center uppercase tracking-widest shadow-lg gap-2 font-mono text-sm"
                    >
                        <GithubLogo className="h-5 w-5" weight="fill" />
                        GitHub
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-zinc-500 uppercase tracking-widest text-xs">
                    No clearance?{" "}
                    <Link href="/signup" className="text-blue-600 hover:text-blue-500 transition-colors font-bold">
                        Request Access
                    </Link>
                </div>
            </div>
        </div>
    );
}
