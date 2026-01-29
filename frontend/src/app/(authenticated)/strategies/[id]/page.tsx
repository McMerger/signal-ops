"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause, Gear, ChartLineUp } from "@phosphor-icons/react";
import { useStrategy } from "@/hooks/use-strategies";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { PriceChart } from "@/components/dashboard/price-chart";

export default function StrategyDetailsPage() {
    const params = useParams();
    const id = params.id as string;
    const { data: strategy, isLoading } = useStrategy(id);

    if (isLoading) return <div className="text-zinc-500">Loading strategy...</div>;
    if (!strategy) return <div className="text-zinc-500">Strategy not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/strategies">
                    <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight text-white">{strategy.name}</h1>
                        <span className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-medium border",
                            strategy.status === "active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                strategy.status === "paused" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                    "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                        )}>
                            {strategy.status.toUpperCase()}
                        </span>
                    </div>
                    <p className="text-zinc-400 text-sm">{strategy.type} Strategy • ID: {strategy.id}</p>
                </div>
                <div className="flex gap-2">
                    {strategy.status === "active" ? (
                        <Button variant="outline" className="gap-2 text-amber-400 border-amber-500/20 hover:bg-amber-500/10">
                            <Pause className="h-4 w-4" />
                            Pause Strategy
                        </Button>
                    ) : (
                        <Button variant="outline" className="gap-2 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10">
                            <Play className="h-4 w-4" />
                            Start Strategy
                        </Button>
                    )}
                    <Button variant="outline" size="icon">
                        <Gear className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
                <GlassCard className="p-4">
                    <div className="text-sm font-medium text-zinc-400">Total PnL</div>
                    <div className="mt-1 text-2xl font-bold text-white">${strategy.performance.totalPnl.toLocaleString()}</div>
                </GlassCard>
                <GlassCard className="p-4">
                    <div className="text-sm font-medium text-zinc-400">Win Rate</div>
                    <div className="mt-1 text-2xl font-bold text-white">{strategy.performance.winRate}%</div>
                </GlassCard>
                <GlassCard className="p-4">
                    <div className="text-sm font-medium text-zinc-400">Total Trades</div>
                    <div className="mt-1 text-2xl font-bold text-white">{strategy.performance.trades}</div>
                </GlassCard>
                <GlassCard className="p-4">
                    <div className="text-sm font-medium text-zinc-400">Sharpe Ratio</div>
                    <div className="mt-1 text-2xl font-bold text-white">{strategy.performance.sharpeRatio}</div>
                </GlassCard>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="col-span-2 space-y-6">
                    <PriceChart />

                    <GlassCard className="p-6">
                        <h3 className="text-lg font-medium text-white mb-4">Configuration</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(strategy.config).map(([key, value]) => (
                                <div key={key} className="p-3 rounded-lg bg-white/5 border border-white/5">
                                    <div className="text-xs text-zinc-500 uppercase tracking-wider">{key}</div>
                                    <div className="mt-1 text-sm font-mono text-white">
                                        {Array.isArray(value) ? value.join(", ") : value.toString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>

                <div className="space-y-6">
                    <GlassCard className="p-6 h-full">
                        <h3 className="text-lg font-medium text-white mb-4">Execution Log</h3>
                        <div className="space-y-4">
                            <div className="text-sm text-zinc-500 italic">No recent executions</div>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
