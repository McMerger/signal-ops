"use client";

import { GlassCard } from "@/components/ui/glass-card";

export default function MarketPage() {
    return (
        <div className="container mx-auto p-8 space-y-6">
            <h1 className="text-2xl font-bold text-white font-mono">MARKET_INTELLIGENCE</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="p-6 col-span-2">
                    <h3 className="text-sm text-zinc-400 font-mono mb-4">GLOBAL_LIQUIDITY_MAP</h3>
                    <div className="h-64 border border-white/5 rounded flex items-center justify-center text-zinc-600 font-mono">
                        [HEATMAP_VISUALIZATION]
                    </div>
                </GlassCard>
                <GlassCard className="p-6">
                    <h3 className="text-sm text-zinc-400 font-mono mb-4">SECTOR_FLOWS</h3>
                    <div className="space-y-2 font-mono text-sm">
                        <div className="flex justify-between"><span className="text-zinc-300">L1_CHAINS</span> <span className="text-emerald-400">+4.2%</span></div>
                        <div className="flex justify-between"><span className="text-zinc-300">DEFI</span> <span className="text-emerald-400">+1.8%</span></div>
                        <div className="flex justify-between"><span className="text-zinc-300">GAMING</span> <span className="text-rose-400">-0.5%</span></div>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
