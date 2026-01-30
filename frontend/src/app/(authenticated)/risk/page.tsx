"use client";

import { GlassCard } from "@/components/ui/glass-card";

export default function RiskPage() {
    return (
        <div className="container mx-auto p-8 space-y-6">
            <h1 className="text-2xl font-bold text-white font-mono">RISK_MANAGEMENT</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <GlassCard className="p-6 border-rose-500/20">
                    <h3 className="text-xs text-rose-400 font-mono mb-2">VAR (95%)</h3>
                    <div className="text-2xl font-bold text-white">$1,240.50</div>
                </GlassCard>
                <GlassCard className="p-6">
                    <h3 className="text-xs text-zinc-400 font-mono mb-2">SHARPE (ROLLING)</h3>
                    <div className="text-2xl font-bold text-white">1.85</div>
                </GlassCard>
                <GlassCard className="p-6">
                    <h3 className="text-xs text-zinc-400 font-mono mb-2">BETA_SPY</h3>
                    <div className="text-2xl font-bold text-white">0.45</div>
                </GlassCard>
                <GlassCard className="p-6">
                    <h3 className="text-xs text-zinc-400 font-mono mb-2">LIQUIDITY_SCORE</h3>
                    <div className="text-2xl font-bold text-emerald-400">HIGH</div>
                </GlassCard>
            </div>
        </div>
    );
}
