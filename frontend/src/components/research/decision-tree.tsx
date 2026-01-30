import { GlassCard } from "@/components/ui/glass-card";
import { CheckCircle, XCircle, TreeStructure } from "@phosphor-icons/react";

type Rule = {
    name: string;
    passed: boolean;
    value: string;
    threshold: string;
}

export function DecisionTreeCard({ asset, decision, rules }: { asset: string, decision: 'BUY' | 'SELL' | 'HOLD', rules: Rule[] }) {
    return (
        <GlassCard className="p-6 border-l-4 border-l-sky-500">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <TreeStructure className="h-5 w-5 text-sky-400" />
                    <h3 className="text-sm font-mono text-zinc-400 tracking-wider">LOGIC_TREE :: {asset}</h3>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-bold font-mono ${decision === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-500/20 text-zinc-400'}`}>
                    {decision}
                </div>
            </div>

            <div className="space-y-3 relative">
                {/* Visual Connector Line */}
                <div className="absolute left-[11px] top-2 bottom-4 w-px bg-white/10" />

                {rules.map((rule, i) => (
                    <div key={i} className="relative flex items-center gap-3 pl-0">
                        <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center border ${rule.passed ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-500' : 'bg-rose-950/50 border-rose-500/50 text-rose-500'}`}>
                            {rule.passed ? <CheckCircle size={14} weight="fill" /> : <XCircle size={14} weight="fill" />}
                        </div>
                        <div className="flex-1 bg-white/5 rounded p-2 text-xs font-mono border border-white/5 flex justify-between">
                            <span className="text-zinc-300">{rule.name}</span>
                            <span className="text-zinc-500">{rule.value} {rule.passed ? '<' : '>'} {rule.threshold}</span>
                        </div>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}
