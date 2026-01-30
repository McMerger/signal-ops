"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CurrencyBtc, Wallet, Pulse, Lightning } from "@phosphor-icons/react";
import { GlowingChart } from "@/components/dashboard/glowing-chart";
import { Ticker } from "@/components/dashboard/ticker";
import { useWebSocket } from "@/hooks/use-websocket";
import { AmbientBackground } from "@/components/dashboard/ambient-background";
import { AnimatedNumber } from "@/components/ui/animated-number";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { IntrinsicValueCard } from "@/components/research/intrinsic-value";
import { PredictionMarketCard } from "@/components/research/prediction-market";
import { DecisionTreeCard } from "@/components/research/decision-tree";
import { OnChainMetricCard } from "@/components/research/on-chain-metric";
import { AnalyticsPanel } from "@/components/dashboard/analytics-panel";
import { OrderBookWidget } from "@/components/dashboard/order-book";
// StatusOrb removed

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "tween", ease: "easeOut", duration: 0.3 } }
};

export function DashboardView() {
    const { mode } = useAppStore();
    const { isConnected, lastMessage } = useWebSocket({ url: 'ws://localhost:8080/ws' });
    const [dashboardData, setDashboardData] = useState({
        totalBalance: 124592.00,
        balanceChange: 2.5,
        activePositions: 3,
        volume24h: 1200000,
        chartData: [
            { time: '00:00', value: 4000 },
            { time: '04:00', value: 3000 },
            { time: '08:00', value: 2000 },
            { time: '12:00', value: 2780 },
            { time: '16:00', value: 1890 },
            { time: '20:00', value: 2390 },
            { time: '24:00', value: 3490 },
        ]
    });

    useEffect(() => {
        if (lastMessage?.type === 'portfolio_update') {
            setDashboardData(prev => ({
                ...prev,
                totalBalance: lastMessage.data.total_balance,
                balanceChange: lastMessage.data.balance_change_24h,
                activePositions: lastMessage.data.active_positions,
                volume24h: lastMessage.data.volume_24h
            }));
        }
        // Handle chart data updates if available
        if (lastMessage?.type === 'chart_update') {
            setDashboardData(prev => ({
                ...prev,
                chartData: lastMessage.data
            }));
        }
    }, [lastMessage]);

    return (
        <div className="relative min-h-screen">
            <AmbientBackground />

            <motion.div
                className="space-y-6 relative z-10"
                variants={container}
                initial="hidden"
                animate="show"
            >
                <motion.div variants={item} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Orb removed */}
                        <div>
                            <h1 className={`text-3xl font-bold tracking-tight text-white ${mode === 'pro' ? 'font-mono' : 'font-sans'}`}>
                                {mode === 'pro' ? <span>TERMINAL<span className="text-sky-500">.01</span></span> : 'SignalOps'}
                            </h1>
                            <p className="text-zinc-400 text-sm mt-1 flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
                                {isConnected ? "SYSTEM ONLINE" : "DISCONNECTED"}
                                <span className="mx-2 text-zinc-700">|</span>
                                <span className="bg-amber-500/10 text-amber-500 text-[10px] px-1.5 py-0.5 rounded border border-amber-500/20">PAPER_TRADING</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <ModeToggle />
                        {mode === 'pro' && (
                            <div className="flex gap-3">
                                <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/5 rounded text-xs text-zinc-400 font-mono hover:bg-white/10 cursor-pointer transition-colors">
                                    <span className="text-zinc-500">WORKSPACE:</span>
                                    <span className="text-white">DEFAULT_ALPHA</span>
                                    <ArrowUpRight className="h-3 w-3 rotate-90" />
                                </div>
                                <Link href="/strategies/create">
                                    <Button className="gap-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/50 hover:border-sky-400 font-mono shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                                        <Pulse className="h-4 w-4" />
                                        NEW_STRATEGY
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </motion.div>

                {mode === 'pro' && (
                    <motion.div variants={item}>
                        <Ticker />
                    </motion.div>
                )}

                <motion.div variants={item} className={`grid gap-6 ${mode === 'pro' ? 'md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2'}`}>
                    <GlassCard className="p-6 border-sky-500/20 bg-sky-950/10">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs text-sky-400 tracking-wider font-medium">TOTAL BALANCE</span>
                            <Wallet className="h-5 w-5 text-sky-400" />
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white tracking-tight flex items-baseline">
                                $<AnimatedNumber value={dashboardData.totalBalance} format={(v) => v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} />
                            </div>
                            <span className={`mt-1 text-xs flex items-center inline-flex px-2 py-0.5 rounded ${dashboardData.balanceChange >= 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                                <ArrowUpRight className={`mr-1 h-3 w-3 ${dashboardData.balanceChange < 0 ? 'rotate-180' : ''}`} />
                                {dashboardData.balanceChange > 0 ? '+' : ''}{dashboardData.balanceChange}%
                            </span>
                        </div>
                    </GlassCard>

                    {mode === 'beginner' && (
                        <div className="space-y-4">
                            {/* Research Spotlights for Beginner */}
                            <IntrinsicValueCard symbol="AAPL" price={175.50} intrinsic={210.00} confidence={0.85} />
                        </div>
                    )}

                    {mode === 'pro' && (
                        <>
                            <GlassCard className="p-6 border-amber-500/20 bg-amber-950/10">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-mono text-amber-400 tracking-wider">ACTIVE_POSITIONS</span>
                                    <CurrencyBtc className="h-5 w-5 text-amber-400" />
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-white font-mono tracking-tight">
                                        <AnimatedNumber value={dashboardData.activePositions} />
                                    </div>
                                    <span className="mt-1 text-xs text-zinc-400 font-mono">OPEN TRADES</span>
                                </div>
                            </GlassCard>

                            <GlassCard className="p-6 border-purple-500/20 bg-purple-950/10">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-mono text-purple-400 tracking-wider">24H_VOLUME</span>
                                    <Pulse className="h-5 w-5 text-purple-400" />
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-white font-mono tracking-tight">
                                        $<AnimatedNumber value={dashboardData.volume24h} format={(v) => (v / 1000000).toFixed(1) + 'M'} />
                                    </div>
                                    <span className="mt-1 text-xs text-zinc-400 font-mono">ACROSS 3 EXCHANGES</span>
                                </div>
                            </GlassCard>

                            <GlassCard className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-mono text-zinc-400 tracking-wider">SYSTEM_STATUS</span>
                                    <Lightning className={`h-5 w-5 ${isConnected ? 'text-emerald-400' : 'text-zinc-500'}`} />
                                </div>
                                <div>
                                    <div className={`text-xl font-bold font-mono tracking-tight ${isConnected ? 'text-emerald-400' : 'text-zinc-500'}`}>
                                        {isConnected ? 'OPERATIONAL' : 'DISCONNECTED'}
                                    </div>
                                    <span className="mt-1 text-xs text-zinc-500 font-mono">REAL-TIME CONNECTION</span>
                                </div>
                            </GlassCard>
                        </>
                    )}
                </motion.div>

                {mode === 'beginner' && (
                    <motion.div variants={item} className="mt-6">
                        <h2 className="text-lg font-bold text-white mb-4">Market Insights</h2>
                        <div className="grid gap-6 md:grid-cols-2">
                            <PredictionMarketCard title="Will the US enter a recession in 2025?" yesProb={0.22} volume={4500000} />
                            <PredictionMarketCard title="Bitcoin > $100k by Jan 1?" yesProb={0.65} volume={12000000} />
                        </div>
                    </motion.div>
                )}

                {mode === 'pro' && (
                    <>
                        <motion.div variants={item} className="grid gap-6 lg:grid-cols-3">
                            <div className="col-span-2">
                                <GlassCard className="p-6 h-full min-h-[400px]">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-sm font-mono text-zinc-400 tracking-wider">PORTFOLIO_PERFORMANCE</h3>
                                        <div className="flex gap-2">
                                            {['1H', '4H', '1D', '1W'].map((tf) => (
                                                <button key={tf} className="px-3 py-1 text-xs font-mono rounded hover:bg-white/10 text-zinc-500 hover:text-white transition-colors">
                                                    {tf}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <GlowingChart data={dashboardData.chartData} />
                                </GlassCard>
                            </div>

                            <GlassCard className="p-6 h-full">
                                <h3 className="text-sm font-mono text-zinc-400 tracking-wider mb-6">RECENT_ACTIVITY</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                                                <ArrowUpRight className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white font-mono">BUY BTC</div>
                                                <div className="text-[10px] text-zinc-500 font-mono uppercase">Strategy: Momentum</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-white font-mono">0.05 BTC</div>
                                            <div className="text-[10px] text-zinc-500 font-mono">2m ago</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                                                <ArrowUpRight className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white font-mono">BUY ETH</div>
                                                <div className="text-[10px] text-zinc-500 font-mono uppercase">Strategy: Arbitrage</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-white font-mono">1.2 ETH</div>
                                            <div className="text-[10px] text-zinc-500 font-mono">15m ago</div>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>

                            <OrderBookWidget />
                        </motion.div>

                        {/* Deep Dive Section: Decision Tree & On-Chain (Pro Only) */}
                        <motion.div variants={item} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
                            <DecisionTreeCard
                                asset="BTC-USD"
                                decision="BUY"
                                rules={[
                                    { name: "Intrinsic Val > Price", passed: true, value: "$65k", threshold: "$62k" },
                                    { name: "Prediction Mkt > 60%", passed: true, value: "0.65", threshold: "0.60" },
                                    { name: "On-Chain Outflows", passed: false, value: "-$10M", threshold: "-$50M" }
                                ]}
                            />
                            <OnChainMetricCard
                                protocol="AAVE"
                                tvl="$12.4B"
                                flows24h="+$45M"
                                unlockDate="2026-03-12"
                            />
                            <OnChainMetricCard
                                protocol="UNISWAP"
                                tvl="$6.2B"
                                flows24h="-$12M"
                                unlockDate="No lock"
                            />
                        </motion.div>

                        <motion.div variants={item}>
                            <AnalyticsPanel />
                        </motion.div>
                    </>
                )}
            </motion.div>
        </div >
    );
}
