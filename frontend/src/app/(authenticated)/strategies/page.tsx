"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Plus, Play, Pause, ChartLineUp, DotsThree } from "@phosphor-icons/react";
import { useStrategies } from "@/hooks/use-strategies";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function StrategiesPage() {
    const { data: strategies, isLoading } = useStrategies();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Strategies</h1>
                    <p className="text-zinc-300">Manage and monitor your algorithmic trading strategies.</p>
                </div>
                <Link href="/strategies/create">
                    <Button className="gap-2 bg-sky-500 hover:bg-sky-600 text-white border-none">
                        <Plus className="h-4 w-4" />
                        Create Strategy
                    </Button>
                </Link>
            </div>

            {isLoading ? (
                <div className="text-zinc-300">Loading strategies...</div>
            ) : (
                <div className="grid gap-4">
                    {strategies?.map((strategy) => (
                        <GlassCard key={strategy.id} className="p-4 transition-all hover:bg-white/5 relative group">
                            <Link href={`/strategies/${strategy.id}`} className="absolute inset-0 z-10" />
                            <div className="flex items-center justify-between relative z-20 pointer-events-none">
                                <div className="flex items-center gap-4 pointer-events-auto">
                                    <div className={cn(
                                        "flex h-10 w-10 items-center justify-center rounded-lg",
                                        strategy.status === "active" ? "bg-emerald-500/20 text-emerald-400" :
                                            strategy.status === "paused" ? "bg-amber-500/20 text-amber-400" :
                                                "bg-zinc-500/20 text-zinc-300"
                                    )}>
                                        <ChartLineUp className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-white">{strategy.name}</h3>
                                        <div className="flex items-center gap-2 text-sm text-zinc-300">
                                            <span>{strategy.type}</span>
                                            <span>•</span>
                                            <span className={cn(
                                                "capitalize",
                                                strategy.status === "active" ? "text-emerald-400" :
                                                    strategy.status === "paused" ? "text-amber-400" : "text-zinc-300"
                                            )}>{strategy.status}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 pointer-events-auto">
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-white">
                                            ${strategy.performance.totalPnl.toLocaleString()}
                                        </div>
                                        <div className="text-sm text-zinc-300">Total PnL</div>
                                    </div>
                                    <div className="text-right hidden md:block">
                                        <div className="text-sm font-medium text-white">
                                            {strategy.performance.winRate}%
                                        </div>
                                        <div className="text-sm text-zinc-300">Win Rate</div>
                                    </div>
                                    <div className="text-right hidden md:block">
                                        <div className="text-sm font-medium text-white">
                                            {strategy.performance.sharpeRatio}
                                        </div>
                                        <div className="text-sm text-zinc-300">Sharpe</div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {strategy.status === "active" ? (
                                            <Button variant="ghost" size="icon" className="text-amber-400 hover:text-amber-300 hover:bg-amber-400/10">
                                                <Pause className="h-4 w-4" />
                                            </Button>
                                        ) : (
                                            <Button variant="ghost" size="icon" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10">
                                                <Play className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <Button variant="ghost" size="icon" className="text-zinc-300 hover:text-white">
                                            <DotsThree className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            )}
        </div>
    );
}
