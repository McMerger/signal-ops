"use client";

import { GlassCard } from "@/components/ui/glass-card";

export default function PortfolioPage() {
    return (
        <div className="container mx-auto p-8 space-y-6">
            <h1 className="text-2xl font-bold text-white font-mono">PORTFOLIO_OVERVIEW</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="p-6">
                    <h3 className="text-sm text-zinc-400 font-mono mb-4">ASSET_ALLOCATION</h3>
                    <div className="flex items-center justify-center h-48 text-zinc-500 font-mono">
                        {/* Placeholder for pie chart */}
                        [ALLOCATION_CHART]
                    </div>
                </GlassCard>
                <GlassCard className="p-6">
                    <h3 className="text-sm text-zinc-400 font-mono mb-4">UNREALIZED_PNL</h3>
                    <div className="text-4xl font-bold text-emerald-400 font-mono">+$2,450.00</div>
                    <div className="text-xs text-zinc-500 mt-2">Daily Change: +1.2%</div>
                </GlassCard>
            </div>
        </div>
    );
}
