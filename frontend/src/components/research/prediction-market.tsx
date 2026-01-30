import { GlassCard } from "@/components/ui/glass-card";

export function PredictionMarketCard({ title, yesProb, volume }: { title: string, yesProb: number, volume: number }) {
    return (
        <GlassCard className="p-4 border-l-4 border-l-purple-500">
            <h3 className="text-xs font-mono text-purple-400 uppercase tracking-wider mb-2">Prediction Market Signal</h3>
            <p className="text-sm text-white font-medium mb-3 line-clamp-2">{title}</p>

            <div className="space-y-2">
                <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Consensus (YES)</span>
                    <span className="text-white font-mono">{(yesProb * 100).toFixed(1)}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: `${yesProb * 100}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
                    <span>Vol: ${(volume / 1000).toFixed(1)}k</span>
                    <span>Polymarket</span>
                </div>
            </div>
        </GlassCard>
    );
}
