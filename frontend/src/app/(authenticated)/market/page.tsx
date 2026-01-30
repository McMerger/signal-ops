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
                    <h3 className="text-sm text-zinc-400 font-mono mb-4">SECTOR_FLOWS (LIVE)</h3>
                    <div className="space-y-2 font-mono text-sm text-zinc-500">
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span>SECTOR</span> <span>FLOW (24H)</span>
                        </div>
                        <div className="py-8 text-center text-xs opacity-50">
                            CONNECTING_TO_CHAIN...
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
