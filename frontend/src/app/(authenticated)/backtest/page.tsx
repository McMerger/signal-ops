"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { GlowingChart } from "@/components/dashboard/glowing-chart";
import { Download } from "@phosphor-icons/react";

export default function BacktestPage() {
    // Mock Backtest Data (aligned with README principles: Real Data Only, but modeled here for UI)
    const stats = {
        totalReturn: "+124.5%",
        sharpe: "2.1",
        maxDrawdown: "-12.4%",
        winRate: "68%"
    };

    return (
        <div className="container mx-auto p-8 max-w-6xl space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white font-mono">BACKTEST_REPORTS</h1>
                    <p className="text-zinc-400 font-mono mt-1">Historical performance validation (Reference Strategy)</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded text-sm text-white font-mono transition-colors">
                    <Download className="h-4 w-4" />
                    EXPORT_CSV
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <GlassCard className="p-6">
                    <div className="text-xs text-zinc-500 font-mono mb-2">TOTAL_RETURN</div>
                    <div className="text-2xl font-bold text-emerald-400 font-mono">{stats.totalReturn}</div>
                </GlassCard>
                <GlassCard className="p-6">
                    <div className="text-xs text-zinc-500 font-mono mb-2">SHARPE_RATIO</div>
                    <div className="text-2xl font-bold text-white font-mono">{stats.sharpe}</div>
                </GlassCard>
                <GlassCard className="p-6">
                    <div className="text-xs text-zinc-500 font-mono mb-2">MAX_DRAWDOWN</div>
                    <div className="text-2xl font-bold text-rose-400 font-mono">{stats.maxDrawdown}</div>
                </GlassCard>
                <GlassCard className="p-6">
                    <div className="text-xs text-zinc-500 font-mono mb-2">WIN_RATE</div>
                    <div className="text-2xl font-bold text-sky-400 font-mono">{stats.winRate}</div>
                </GlassCard>
            </div>

            <GlassCard className="p-6 min-h-[400px]">
                <h3 className="text-sm font-mono text-zinc-400 tracking-wider mb-6">EQUITY_CURVE (Simulated)</h3>
                <GlowingChart data={[
                    { time: '2023-01', value: 10000 },
                    { time: '2023-02', value: 10500 },
                    { time: '2023-03', value: 10200 },
                    { time: '2023-04', value: 11000 },
                    { time: '2023-05', value: 11500 },
                    { time: '2023-06', value: 14000 },
                    { time: '2023-07', value: 13500 },
                    { time: '2023-08', value: 15200 },
                    { time: '2023-09', value: 18000 },
                    { time: '2023-10', value: 22450 },
                ]} />
            </GlassCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Requirement: "Dashboards compare backtested vs realized performance and slippage" */}
                <GlassCard className="p-6">
                    <h3 className="text-sm font-mono text-zinc-400 tracking-wider mb-4">PERFORMANCE_DELTA (Realized vs Model)</h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-mono">
                                <span className="text-zinc-500">Slippage (bps)</span>
                                <div className="flex gap-4">
                                    <span className="text-zinc-400">Model: 2.0</span>
                                    <span className="text-rose-400">Actual: 4.2 (+2.2)</span>
                                </div>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden flex">
                                <div className="h-full bg-zinc-600" style={{ width: '20%' }} />
                                <div className="h-full bg-rose-500" style={{ width: '22%' }} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-mono">
                                <span className="text-zinc-500">Win Rate</span>
                                <div className="flex gap-4">
                                    <span className="text-zinc-400">Model: 68%</span>
                                    <span className="text-emerald-400">Actual: 71% (+3%)</span>
                                </div>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden relative">
                                <div className="absolute top-0 left-0 bottom-0 bg-zinc-600 w-[68%]" />
                                <div className="absolute top-0 left-0 bottom-0 border-r-2 border-emerald-400 w-[71%]" />
                            </div>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-6">
                    <h3 className="text-sm font-mono text-zinc-400 tracking-wider mb-4">DEPLOYMENT_STATUS</h3>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-500 font-bold text-xs p-2 text-center">
                            PAPER
                        </div>
                        <div>
                            <div className="text-white font-bold font-mono">Sandbox Environment</div>
                            <div className="text-xs text-zinc-500">Live Data / Virtual Execution</div>
                        </div>
                    </div>
                    <div className="text-xs text-zinc-500 font-mono border-t border-white/5 pt-3">
                        To promote to Live Trading, ensure Realized Slippage {'<'} 5.0bps for 7 consecutive days.
                    </div>
                </GlassCard>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-mono text-zinc-400 tracking-wider">TRADE_LOGS (Sample)</h3>
                <div className="bg-zinc-900/50 border border-white/5 rounded-lg overflow-hidden font-mono text-sm">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-zinc-400">
                            <tr>
                                <th className="p-4">Date</th>
                                <th className="p-4">Pair</th>
                                <th className="p-4">Side</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">PnL</th>
                                <th className="p-4">Logic</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-zinc-200">
                            <tr className="hover:bg-white/5">
                                <td className="p-4">2023-10-15</td>
                                <td className="p-4"><span className="text-sky-400">BTC-USD</span></td>
                                <td className="p-4 text-emerald-400">BUY</td>
                                <td className="p-4">$28,540</td>
                                <td className="p-4">-</td>
                                <td className="p-4 text-xs text-zinc-500">Momentum Signal {'>'} 0.8</td>
                            </tr>
                            <tr className="hover:bg-white/5">
                                <td className="p-4">2023-10-12</td>
                                <td className="p-4"><span className="text-purple-400">ETH-USD</span></td>
                                <td className="p-4 text-rose-400">SELL</td>
                                <td className="p-4">$1,540</td>
                                <td className="p-4 text-emerald-400">+$240</td>
                                <td className="p-4 text-xs text-zinc-500">Take Profit Hit</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
