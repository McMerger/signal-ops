"use client";

import { ScrollManager } from "@/components/landing/scroll-manager";
import { FeatureShowcase } from "@/components/landing/feature-showcase";
import { WarpTransitionProvider, useWarpTransition } from "@/components/landing/warp-transition";
import { VoidSingularity } from "@/components/canvas/public/void-singularity";
import { useState } from "react";
import { PolyglotEngine } from "@/components/canvas/public/polyglot-engine"; // Re-using engine for features if needed, or just standard showcase. Keeping showcase.

function WelcomeContent() {
    const { startTransition } = useWarpTransition();
    const [warping, setWarping] = useState(false);

    const handleLaunch = () => {
        setWarping(true);
        startTransition("/dashboard");
    };

    return (
        <ScrollManager>
            <main className="min-h-screen bg-background selection:bg-blue-500/30 relative overflow-hidden">
                {/* 3D Background */}
                <VoidSingularity warp={warping} />

                {/* Hero Content - Overlay */}
                <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 mb-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        <span className="text-xs font-mono text-rose-400 uppercase tracking-wide">Experimental / Research Only</span>
                    </div>

                    <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-6 tracking-tighter mix-blend-multiply font-mono uppercase">
                        SignalOps <span className="text-zinc-500">Terminal</span>
                    </h1>

                    <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mb-10 font-mono">
                        Event-aware algorithmic trading engine.<br />
                        <span className="text-zinc-400">Routes fundamentals, prediction markets, and on-chain flows through a single transparent decision engine.</span>
                    </p>

                    <button
                        onClick={handleLaunch}
                        className="group relative inline-flex items-center justify-center overflow-hidden rounded bg-zinc-900 px-8 py-4 font-mono text-sm text-white transition-all duration-300 hover:bg-zinc-800 border border-zinc-700"
                    >
                        <span className="mr-2">Initializing Research Environment</span>
                        <span className="transition-transform group-hover:translate-x-1">_</span>
                    </button>

                    <p className="mt-8 text-xs text-zinc-500 max-w-lg font-mono leading-relaxed">
                        * NO MOCKS. REAL DATA ONLY. <br />
                        Not for unattended production use. Use at your own risk.
                    </p>
                </div>

                <div className="relative z-10 bg-white/80 backdrop-blur-xl border-t border-zinc-200">
                    <FeatureShowcase />
                </div>

                {/* Footer / CTA Section */}
                <div className="h-[50vh] w-full bg-gradient-to-b from-white to-zinc-100 flex flex-col items-center justify-center text-center px-4 relative overflow-hidden z-10">
                    <div className="relative z-10">
                        <h2 className="text-4xl font-bold text-foreground mb-8 tracking-tight">Ready to deploy?</h2>
                        <button
                            onClick={handleLaunch}
                            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[#002b36] px-8 py-4 font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(38,139,210,0.5)] border border-[#586e75]"
                        >
                            <span className="mr-2">Launch Dashboard</span>
                            <span className="transition-transform group-hover:translate-x-1">→</span>
                        </button>
                    </div>
                </div>
            </main>
        </ScrollManager>
    );
}

export default function WelcomePage() {
    return (
        <WarpTransitionProvider>
            <WelcomeContent />
        </WarpTransitionProvider>
    );
}
