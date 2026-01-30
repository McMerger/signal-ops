import { GlassCard } from "@/components/ui/glass-card";

export function AnalyticsPanel() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
            <GlassCard className="p-6">
                <h3 className="text-xs font-mono text-zinc-400 tracking-wider mb-4">FACTOR_EXPOSURES</h3>
                <div className="space-y-3">
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono text-zinc-300">
                            <span>Momentum</span>
                            <span>High (0.8)</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-sky-500" style={{ width: '80%' }} />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono text-zinc-300">
                            <span>Value</span>
                            <span>Med (0.4)</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: '40%' }} />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono text-zinc-300">
                            <span>Volatility</span>
                            <span>Low (0.2)</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-rose-500" style={{ width: '20%' }} />
                        </div>
                    </div>
                </div>
            </GlassCard>

            <GlassCard className="p-6">
                <h3 className="text-xs font-mono text-zinc-400 tracking-wider mb-4">ASSET_CLASS_PERF (MTD)</h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center bg-white/5 p-2 rounded">
                        <span className="text-xs text-zinc-300 font-mono">Crypto</span>
                        <span className="text-xs font-bold text-emerald-400 font-mono">+12.5%</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 p-2 rounded">
                        <span className="text-xs text-zinc-300 font-mono">Equities</span>
                        <span className="text-xs font-bold text-emerald-400 font-mono">+1.2%</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 p-2 rounded">
                        <span className="text-xs text-zinc-300 font-mono">Prediction mkts</span>
                        <span className="text-xs font-bold text-rose-400 font-mono">-3.4%</span>
                    </div>
                </div>
            </GlassCard>

            <GlassCard className="p-6">
                <h3 className="text-xs font-mono text-zinc-400 tracking-wider mb-4">DRAWDOWN_ANALYSIS</h3>
                <div className="text-center py-4">
                    <div className="text-3xl font-bold text-white font-mono">-2.1%</div>
                    <div className="text-[10px] text-zinc-500 font-mono mt-1">Current Drawdown</div>
                </div>
                <div className="text-center border-t border-white/5 pt-4">
                    <div className="text-xl font-bold text-zinc-300 font-mono">-8.5%</div>
                    <div className="text-[10px] text-zinc-500 font-mono mt-1">Max Drawdown (YTD)</div>
                </div>
            </GlassCard>
        </div>
    )
}
