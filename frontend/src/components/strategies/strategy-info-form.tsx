import { StrategyConfig } from '@/lib/api/strategy-configs-api';
import { GlassCard } from '@/components/ui/glass-card';
import { Input } from '@/components/ui/input';
import { Info } from '@phosphor-icons/react';

interface StrategyInfoFormProps {
    strategy: StrategyConfig;
    onChange: (strategy: StrategyConfig) => void;
}

export function StrategyInfoForm({ strategy, onChange }: StrategyInfoFormProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-white font-mono">STRATEGY_META</h2>
                <p className="text-sm text-zinc-400">Basic configuration and target assets.</p>
            </div>

            <GlassCard className="p-6 border-zinc-800 bg-zinc-900/40">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                            Strategy Name
                            <Info className="h-3 w-3 text-zinc-600" />
                        </label>
                        <Input
                            value={strategy.strategy.name}
                            onChange={(e) => onChange({
                                ...strategy,
                                strategy: { ...strategy.strategy, name: e.target.value }
                            })}
                            className="font-mono bg-black/20 border-zinc-800 focus:border-sky-500/50"
                            placeholder="e.g., MULTI_SOURCE_MOMENTUM"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                            Target Assets
                            <span className="text-[10px] text-zinc-600 normal-case">(Comma Separated)</span>
                        </label>
                        <Input
                            value={strategy.strategy.assets.join(', ')}
                            onChange={(e) => onChange({
                                ...strategy,
                                strategy: { ...strategy.strategy, assets: e.target.value.split(',').map(s => s.trim()) }
                            })}
                            className="font-mono bg-black/20 border-zinc-800 focus:border-sky-500/50"
                            placeholder="e.g., BTC, ETH, SOL"
                        />
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}
