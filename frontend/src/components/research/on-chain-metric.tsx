import { GlassCard } from "@/components/ui/glass-card";
import { LinkSimple, LockKey } from "@phosphor-icons/react";

export function OnChainMetricCard({ protocol, tvl, flows24h, unlockDate }: { protocol: string, tvl: string, flows24h: string, unlockDate: string }) {
    return (
        <GlassCard className="p-4 border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-mono text-amber-500 tracking-wider flex items-center gap-2">
                    <LinkSimple className="w-4 h-4" />
                    ON_CHAIN_FLOWS
                </h3>
                <span className="text-xs font-bold text-white">{protocol}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-white/5 p-2 rounded">
                    <div className="text-zinc-500">TVL</div>
                    <div className="text-white font-bold">{tvl}</div>
                </div>
                <div className="bg-white/5 p-2 rounded">
                    <div className="text-zinc-500">Net Flow (24h)</div>
                    <div className={`font-bold ${flows24h.startsWith('-') ? 'text-rose-400' : 'text-emerald-400'}`}>{flows24h}</div>
                </div>
            </div>

            <div className="mt-2 text-[10px] text-zinc-500 font-mono flex items-center gap-1 justify-end">
                <LockKey size={12} />
                Next Unlock: <span className="text-zinc-300">{unlockDate}</span>
            </div>
        </GlassCard>
    )
}
