import { GlassCard } from "@/components/ui/glass-card";

export function FactorExposureCard() {
    const factors = [
        { name: "MKT_BETA", value: 0.85, type: "market", desc: "Correlation to Benchmark" },
        { name: "MOMENTUM", value: 1.2, type: "style", desc: "Trend Following Sens." },
        { name: "VOLATILITY", value: -0.4, type: "style", desc: "Low Vol Preference" },
        { name: "SIZE", value: 0.1, type: "style", desc: "Large Cap Bias" },
        { name: "VALUE", value: -0.2, type: "style", desc: "Undervalued Asset Bias" },
    ];

    return (
        <GlassCard className="p-6">
            <h3 className="text-sm font-mono text-zinc-400 tracking-wider mb-6">FACTOR_EXPOSURE (Risk Model)</h3>
            <div className="space-y-4">
                {factors.map((f) => (
                    <div key={f.name} className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                            <span className="text-zinc-300 group relative cursor-help">
                                {f.name}
                                <span className="absolute left-0 bottom-full mb-1 hidden group-hover:block bg-black border border-white/10 px-2 py-1 rounded text-zinc-400 whitespace-nowrap z-50">
                                    {f.desc}
                                </span>
                            </span>
                            <span className={f.value > 0 ? "text-emerald-400" : f.value < 0 ? "text-rose-400" : "text-zinc-500"}>
                                {f.value > 0 ? "+" : ""}{f.value.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="w-1/2 flex justify-end">
                                {f.value < 0 && (
                                    <div
                                        className="h-full bg-rose-500 rounded-l-full"
                                        style={{ width: `${Math.min(Math.abs(f.value) * 50, 100)}%` }}
                                    />
                                )}
                            </div>
                            <div className="w-px bg-zinc-700 mx-px" />
                            <div className="w-1/2 flex justify-start">
                                {f.value > 0 && (
                                    <div
                                        className="h-full bg-emerald-500 rounded-r-full"
                                        style={{ width: `${Math.min(Math.abs(f.value) * 50, 100)}%` }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 text-[10px] text-zinc-500 font-mono text-center">
                Baseline: BTC-USD (1h)
            </div>
        </GlassCard>
    );
}
