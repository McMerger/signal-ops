"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { useEffect, useState } from "react";

export default function PortfolioPage() {
    const [stats, setStats] = useState<{ total_pnl: number, daily_change: number, allocation: any[] } | null>(null);

    useEffect(() => {
        // Fetch Real Data from Execution Core
        // In a real app, use SWR/TanStack Query for polling
        const fetchData = async () => {
            try {
                const res = await fetch('/api/v1/portfolio/positions');
                if (res.ok) {
                    const data = await res.json();
                    setStats({
                        total_pnl: data.total_pnl,
                        daily_change: 0, // Backend needs to provide 24h change, for now 0 or calc from history
                        allocation: [] // TODO: Aggregate from positions
                    });
                }
            } catch (e) {
                console.error("Failed to fetch portfolio data", e);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="container mx-auto p-8 space-y-6">
            <h1 className="text-2xl font-bold text-white font-mono">PORTFOLIO_OVERVIEW</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="p-6">
                    <h3 className="text-sm text-zinc-400 font-mono mb-4">ASSET_ALLOCATION</h3>
                    <div className="flex items-center justify-center h-48 text-zinc-500 font-mono">
                        {stats ? "LIVE_ALLOCATION_RENDER" : "LOADING_REAL_DATA..."}
                    </div>
                </GlassCard>
                <GlassCard className="p-6">
                    <h3 className="text-sm text-zinc-400 font-mono mb-4">UNREALIZED_PNL</h3>
                    {stats ? (
                        <>
                            <div className={`text-4xl font-bold font-mono ${stats.total_pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {stats.total_pnl >= 0 ? '+' : ''}${stats.total_pnl.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </div>
                            <div className="text-xs text-zinc-500 mt-2">Data Source: Execution Core (Live)</div>
                        </>
                    ) : (
                        <div className="text-4xl font-bold text-zinc-600 font-mono animate-pulse">---</div>
                    )}
                </GlassCard>
            </div>
        </div>
    );
}
