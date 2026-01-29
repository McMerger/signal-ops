import { StrategyConfig, StrategyRule, StrategyCondition } from '@/lib/api/strategy-configs-api';
import { Plus, Trash, WarningCircle, CheckCircle } from '@phosphor-icons/react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface RuleBuilderProps {
    strategy: StrategyConfig;
    onChange: (strategy: StrategyConfig) => void;
}

const COMMON_METRICS = [
    { value: 'rsi_14', label: 'RSI (14)' },
    { value: 'macd_signal', label: 'MACD Signal' },
    { value: 'sma_50', label: 'SMA (50)' },
    { value: 'ema_20', label: 'EMA (20)' },
    { value: 'price', label: 'Price' },
    { value: 'volume_24h', label: 'Volume (24h)' },
    { value: 'bollinger_upper', label: 'Bollinger Upper' },
    { value: 'bollinger_lower', label: 'Bollinger Lower' },
];

export function RuleBuilder({ strategy, onChange }: RuleBuilderProps) {
    const addRule = () => {
        const newRule: StrategyRule = {
            id: `rule_${Date.now()}`,
            source: 'technical',
            conditions: [],
        };

        onChange({
            ...strategy,
            strategy: {
                ...strategy.strategy,
                rules: [...strategy.strategy.rules, newRule],
            },
        });
    };

    const removeRule = (index: number) => {
        const rules = strategy.strategy.rules.filter((_, i) => i !== index);
        onChange({
            ...strategy,
            strategy: {
                ...strategy.strategy,
                rules,
            },
        });
    };

    const updateRule = (index: number, rule: StrategyRule) => {
        const rules = [...strategy.strategy.rules];
        rules[index] = rule;
        onChange({
            ...strategy,
            strategy: {
                ...strategy.strategy,
                rules,
            },
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-white font-mono">EXECUTION_RULES</h2>
                    <p className="text-sm text-zinc-400">Define the logic for trade execution.</p>
                </div>
                <Button
                    onClick={addRule}
                    className="gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:border-emerald-400 font-mono"
                >
                    <Plus className="h-4 w-4" />
                    ADD_RULE
                </Button>
            </div>

            {strategy.strategy.rules.length === 0 ? (
                <GlassCard className="flex flex-col items-center justify-center py-12 border-dashed border-zinc-700 bg-zinc-900/20">
                    <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                        <WarningCircle className="h-6 w-6 text-zinc-500" />
                    </div>
                    <p className="text-zinc-400 font-mono">NO_RULES_DEFINED</p>
                    <p className="text-sm text-zinc-500 mt-1">Click "ADD_RULE" to start building your strategy.</p>
                </GlassCard>
            ) : (
                <div className="space-y-4">
                    {strategy.strategy.rules.map((rule, index) => (
                        <RuleCard
                            key={rule.id}
                            rule={rule}
                            onUpdate={(updatedRule) => updateRule(index, updatedRule)}
                            onRemove={() => removeRule(index)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

interface RuleCardProps {
    rule: StrategyRule;
    onUpdate: (rule: StrategyRule) => void;
    onRemove: () => void;
}

function RuleCard({ rule, onUpdate, onRemove }: RuleCardProps) {
    const addCondition = () => {
        const newCondition: StrategyCondition = {
            metric: 'rsi_14',
            operator: '<',
            threshold: 30,
        };
        onUpdate({
            ...rule,
            conditions: [...rule.conditions, newCondition],
        });
    };

    const removeCondition = (index: number) => {
        const conditions = rule.conditions.filter((_, i) => i !== index);
        onUpdate({ ...rule, conditions });
    };

    const updateCondition = (index: number, condition: StrategyCondition) => {
        const conditions = [...rule.conditions];
        conditions[index] = condition;
        onUpdate({ ...rule, conditions });
    };

    return (
        <GlassCard className="p-6 border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition-colors group">
            <div className="flex justify-between items-start mb-6">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Rule ID</label>
                        <Input
                            value={rule.id}
                            onChange={(e) => onUpdate({ ...rule, id: e.target.value })}
                            className="font-mono bg-black/20 border-zinc-800 focus:border-sky-500/50"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Data Source</label>
                        <select
                            value={rule.source}
                            onChange={(e) =>
                                onUpdate({
                                    ...rule,
                                    source: e.target.value as any,
                                })
                            }
                            className="w-full h-10 px-3 py-2 bg-black/20 border border-zinc-800 rounded-md text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 appearance-none"
                        >
                            <option value="technical">Technical Analysis</option>
                            <option value="fundamental">Fundamental Data</option>
                            <option value="polymarket">Polymarket Sentiment</option>
                            <option value="onchain">On-Chain Metrics</option>
                            <option value="news">News Sentiment</option>
                        </select>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onRemove}
                    className="ml-4 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10"
                >
                    <Trash className="h-5 w-5" />
                </Button>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <label className="text-xs font-mono text-sky-400 uppercase tracking-wider flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Conditions
                    </label>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={addCondition}
                        className="text-xs font-mono text-sky-400 hover:text-sky-300 hover:bg-sky-400/10 h-8"
                    >
                        <Plus className="h-3 w-3 mr-1" />
                        ADD_CONDITION
                    </Button>
                </div>

                <div className="space-y-3">
                    {rule.conditions.map((condition, index) => (
                        <div key={index} className="grid grid-cols-12 gap-3 items-center bg-white/5 p-3 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                            <div className="col-span-5">
                                <select
                                    value={condition.metric}
                                    onChange={(e) =>
                                        updateCondition(index, { ...condition, metric: e.target.value })
                                    }
                                    className="w-full h-9 px-3 bg-black/20 border border-zinc-800 rounded text-sm text-white font-mono focus:border-sky-500/50 focus:outline-none"
                                >
                                    {COMMON_METRICS.map(m => (
                                        <option key={m.value} value={m.value}>{m.label}</option>
                                    ))}
                                    <option value="custom">Custom...</option>
                                </select>
                            </div>
                            <div className="col-span-2">
                                <select
                                    value={condition.operator}
                                    onChange={(e) =>
                                        updateCondition(index, {
                                            ...condition,
                                            operator: e.target.value as any,
                                        })
                                    }
                                    className="w-full h-9 px-2 bg-black/20 border border-zinc-800 rounded text-sm text-sky-400 font-mono font-bold text-center focus:border-sky-500/50 focus:outline-none"
                                >
                                    <option value="<">&lt;</option>
                                    <option value=">">&gt;</option>
                                    <option value="<=">&le;</option>
                                    <option value=">=">&ge;</option>
                                    <option value="==">=</option>
                                    <option value="!=">&ne;</option>
                                </select>
                            </div>
                            <div className="col-span-4">
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={condition.threshold}
                                    onChange={(e) =>
                                        updateCondition(index, {
                                            ...condition,
                                            threshold: parseFloat(e.target.value),
                                        })
                                    }
                                    className="h-9 font-mono bg-black/20 border-zinc-800 focus:border-sky-500/50 text-right"
                                />
                            </div>
                            <div className="col-span-1 flex justify-end">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeCondition(index)}
                                    className="h-8 w-8 text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10"
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    {rule.conditions.length === 0 && (
                        <div className="text-center py-4 text-xs text-zinc-600 font-mono italic">
                            NO_CONDITIONS_SET
                        </div>
                    )}
                </div>
            </div>
        </GlassCard>
    );
}
