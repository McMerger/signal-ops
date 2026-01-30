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

import { useUser } from "@/hooks/use-user";

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
    const { data: userPrefs } = useUser(); // Fetch real prefs
    const { isConnected, lastMessage } = useWebSocket({ url: 'ws://localhost:8080/ws' });
    const [dashboardData, setDashboardData] = useState({
        totalBalance: 0,
        balanceChange: 0,
        activePositions: 0,
        volume24h: 0,
        chartData: []
    });

    const [researchData, setResearchData] = useState<{
        intrinsic: any[];
        predictions: any[];
    }>({ intrinsic: [], predictions: [] });

    useEffect(() => {
        // Poll for Research Data (Beginner Mode Feeds)
        const fetchResearch = async () => {
            try {
                // Fetch specific reference assets as "Featured"
                const [intRes, predRes] = await Promise.all([
                    fetch('/api/v1/research/intrinsic?symbol=AAPL'),
                    fetch('/api/v1/research/prediction?symbol=RECESSION')
                ]);

                const intrinsic = intRes.ok ? [await intRes.json()] : [];
                const prediction = predRes.ok ? [await predRes.json()] : [];

                setResearchData({
                    intrinsic,
                    predictions: prediction.map(p => ({
                        title: `Market: ${p.asset}`,
                        probability: p.data?.probability || 0.5,
                        volume: p.data?.volume || 0
                    }))
                });
            } catch (e) {
                console.error("Research fetch failed", e);
            }
        };

        if (mode === 'beginner') {
            fetchResearch();
            const interval = setInterval(fetchResearch, 15000);
            return () => clearInterval(interval);
        }
    }, [mode]);

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
                                    {/* Real Data: Display persisted workspace name */}
                                    <span className="text-white uppercase">{userPrefs?.layouts?.active_workspace || 'DEFAULT'}</span>
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
                            {researchData.intrinsic.length > 0 ? (
                                researchData.intrinsic.map((item, i) => (
                                    <IntrinsicValueCard
                                        key={i}
                                        symbol={item.symbol}
                                        price={item.price}
                                        intrinsic={item.intrinsic_value}
                                        confidence={item.confidence}
                                    />
                                ))
                            ) : (
                                <GlassCard className="p-6">
                                    <div className="text-center text-xs text-zinc-500 font-mono animate-pulse">
                                        ANALYZING MARKET FUNDAMENTALS (REAL-TIME)...
                                    </div>
                                </GlassCard>
                            )}
                        </div>
                    )}

                    {/* ... Pro Cards ... */}

                    <motion.div variants={item} className="mt-6">
                        {mode === 'beginner' && (
                            <>
                                <h2 className="text-lg font-bold text-white mb-4">Market Insights (Live)</h2>
                                {researchData.predictions.length > 0 ? (
                                    <div className="grid gap-6 md:grid-cols-2">
                                        {researchData.predictions.map((pred, i) => (
                                            <PredictionMarketCard
                                                key={i}
                                                title={pred.title}
                                                yesProb={pred.probability}
                                                volume={pred.volume}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 border border-white/5 rounded-lg text-center text-zinc-500 font-mono text-xs">
                                        CONNECTING TO PREDICTION MARKETS (POLYMARKET FEED)...
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>

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
                                        <div className="text-center py-8 text-xs text-zinc-600 font-mono">
                                            NO RECENT EXECUTION DETECTED
                                        </div>
                                    </div>
                                </GlassCard>

                                <OrderBookWidget />
                            </motion.div>

                            {/* Deep Dive Section: Decision Tree & On-Chain (Pro Only) */}
                            <motion.div variants={item} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
                                <DecisionTreeCard
                                    asset="WAITING_SIGNAL"
                                    decision="--"
                                    rules={[]}
                                />
                                <div className="col-span-2 text-center py-12 border border-white/5 rounded-lg bg-white/5 text-zinc-500 font-mono text-xs">
                                    WAITING FOR LIVE RESEARCH DATA (ON_CHAIN / PREDICTION)
                                </div>
                            </motion.div>

                            <motion.div variants={item}>
                                <AnalyticsPanel />
                            </motion.div>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
}
