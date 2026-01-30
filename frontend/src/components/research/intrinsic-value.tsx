import { GlassCard } from "@/components/ui/glass-card";

export function IntrinsicValueCard({ symbol, price, intrinsic, confidence }: { symbol: string, price: number, intrinsic: number, confidence: number }) {
    const safetyMargin = ((intrinsic - price) / price) * 100;

    return (
        <GlassCard className="p-4 border-l-4 border-l-emerald-500">
            <h3 className="text-sm font-mono text-zinc-400">INTRINSIC_VALUE_MODEL</h3>
            <div className="mt-2 flex justify-between items-end">
                <div>
                    <div className="text-2xl font-bold text-white">{symbol}</div>
                    <div className="text-xs text-zinc-500">Graham Defensive</div>
                </div>
                <div className="text-right">
                    <div className="text-sm text-zinc-400">Fair Value</div>
                    <div className="text-xl font-mono text-emerald-400">${intrinsic.toFixed(2)}</div>
                </div>
            </div>
            <div className="mt-4 bg-white/5 rounded p-2 flex justify-between items-center">
                <span className="text-xs text-zinc-500">Margin of Safety</span>
                <span className={`text-sm font-bold ${safetyMargin > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {safetyMargin > 0 ? '+' : ''}{safetyMargin.toFixed(1)}%
                </span>
            </div>
        </GlassCard>
    )
}
