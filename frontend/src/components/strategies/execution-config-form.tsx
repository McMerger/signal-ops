import { StrategyConfig } from '@/lib/api/strategy-configs-api';
import { GlassCard } from '@/components/ui/glass-card';
import { Input } from '@/components/ui/input';
import { Lightning, ShieldCheck } from '@phosphor-icons/react';

interface ExecutionConfigFormProps {
    strategy: StrategyConfig;
    onChange: (strategy: StrategyConfig) => void;
}

export function ExecutionConfigForm({ strategy, onChange }: ExecutionConfigFormProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-white font-mono">EXECUTION_PARAMETERS</h2>
                <p className="text-sm text-zinc-400">Configure risk management and execution behavior.</p>
            </div>

            <GlassCard className="p-6 border-zinc-800 bg-zinc-900/40">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                            <ShieldCheck className="h-3 w-3" />
                            Confirmations
                        </label>
                        <Input
                            type="number"
                            min="1"
                            value={strategy.strategy.execution.require_confirmations}
                            onChange={(e) => onChange({
                                ...strategy,
                                strategy: {
                                    ...strategy.strategy,
                                    execution: {
                                        ...strategy.strategy.execution,
                                        require_confirmations: parseInt(e.target.value)
                                    }
                                }
                            })}
                            className="font-mono bg-black/20 border-zinc-800 focus:border-sky-500/50"
                        />
                        <p className="text-[10px] text-zinc-600">Signals required to trigger trade.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                            Position Size
                        </label>
                        <Input
                            type="number"
                            step="0.01"
                            min="0.01"
                            max="1.0"
                            value={strategy.strategy.execution.position_size}
                            onChange={(e) => onChange({
                                ...strategy,
                                strategy: {
                                    ...strategy.strategy,
                                    execution: {
                                        ...strategy.strategy.execution,
                                        position_size: parseFloat(e.target.value)
                                    }
                                }
                            })}
                            className="font-mono bg-black/20 border-zinc-800 focus:border-sky-500/50"
                        />
                        <p className="text-[10px] text-zinc-600">% of portfolio per trade (0.01 - 1.0).</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                            <Lightning className="h-3 w-3" />
                            Action Mode
                        </label>
                        <select
                            value={strategy.strategy.execution.action_mode}
                            onChange={(e) => onChange({
                                ...strategy,
                                strategy: {
                                    ...strategy.strategy,
                                    execution: {
                                        ...strategy.strategy.execution,
                                        action_mode: e.target.value as any
                                    }
                                }
                            })}
                            className="w-full h-10 px-3 py-2 bg-black/20 border border-zinc-800 rounded-md text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 appearance-none"
                        >
                            <option value="notify">Notify Only</option>
                            <option value="trade">Auto-Trade</option>
                        </select>
                        <p className="text-[10px] text-zinc-600">Execute trades or just send alerts.</p>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}
