"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { motion } from "framer-motion";
import { Lightning, CircleNotch, GithubLogo } from "@phosphor-icons/react";
import { signIn } from "next-auth/react";

import { BlueprintFrame } from "@/components/ui/context-frames";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await signup(email, password, name);
        } catch (err: any) {
            setError(err.message || "Failed to create account");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 relative overflow-hidden font-portal">
            {/* Background Effects */}
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-50" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md p-8 relative z-10 backdrop-blur-md bg-white/70 border border-violet-200 shadow-xl rounded-none clip-corners"
            >
                <div className="flex flex-col items-center mb-8">
                    <BlueprintFrame className="mb-4">
                        <Lightning weight="fill" className="h-6 w-6" />
                    </BlueprintFrame>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-widest uppercase">Initiate Protocol</h1>
                    <p className="text-zinc-500 mt-2 text-xs font-semibold">Establish new operator uplinks</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-violet-700 uppercase tracking-widest">Operator Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white border border-zinc-300 rounded-sm px-4 py-3 text-slate-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all font-sans"
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-violet-700 uppercase tracking-widest">Comms ID</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white border border-zinc-300 rounded-sm px-4 py-3 text-slate-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all font-sans"
                            placeholder="john@example.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-violet-700 uppercase tracking-widest">Access Key</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white border border-zinc-300 rounded-sm px-4 py-3 text-slate-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all font-sans"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-3 rounded-none bg-red-100 border border-red-500/20 text-red-600 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-none py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center uppercase tracking-widest shadow-md"
                    >
                        {loading ? <CircleNotch className="animate-spin h-5 w-5" /> : "Forge Uplink"}
                    </button>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-zinc-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-zinc-500 font-sans font-bold tracking-widest">Or</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                        className="w-full bg-[#24292F] hover:bg-[#24292F]/90 text-white font-bold rounded-none py-3 transition-colors flex items-center justify-center uppercase tracking-widest shadow-md gap-2 font-sans text-xs"
                    >
                        <GithubLogo className="h-5 w-5" weight="fill" />
                        GitHub
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-zinc-500">
                    Existing ID?{" "}
                    <Link href="/login" className="text-violet-600 hover:text-violet-500 transition-colors uppercase font-bold text-xs tracking-widest">
                        Verify
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
