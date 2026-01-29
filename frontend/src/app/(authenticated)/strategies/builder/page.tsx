'use client';

import { useState } from 'react';
import { StrategyConfig } from '@/lib/api/strategy-configs-api';
import { StrategyInfoForm } from '@/components/strategies/strategy-info-form';
import { RuleBuilder } from '@/components/strategies/rule-builder';
import { ExecutionConfigForm } from '@/components/strategies/execution-config-form';
import { YAMLPreview } from '@/components/strategies/yaml-preview';
import { strategyConfigsApi } from '@/lib/api/strategy-configs-api';
import { Button } from '@/components/ui/button';
import { FloppyDisk, Code, PencilSimple } from '@phosphor-icons/react';
import yaml from 'js-yaml';

export default function StrategyBuilderPage() {
    const [strategy, setStrategy] = useState<StrategyConfig>({
        strategy: {
            name: '',
            assets: [],
            rules: [],
            execution: {
                require_confirmations: 1,
                position_size: 0.02,
                action_mode: 'notify',
            },
        },
    });

    const [activeTab, setActiveTab] = useState<'builder' | 'yaml'>('builder');

    const handleSave = async () => {
        try {
            const yamlStr = yaml.dump(strategy);
            const result = await strategyConfigsApi.upload(yamlStr);
            alert(`Strategy "${result.strategy_name}" saved successfully!`);
        } catch (error) {
            alert('Failed to save strategy: ' + (error as Error).message);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white font-mono">STRATEGY_BUILDER</h1>
                    <p className="text-zinc-400">Design and backtest algorithmic trading strategies.</p>
                </div>
                <div className="flex space-x-2 bg-white/5 p-1 rounded-lg border border-white/5">
                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab('builder')}
                        className={`gap-2 ${activeTab === 'builder' ? 'bg-sky-500/20 text-sky-400' : 'text-zinc-400 hover:text-white'}`}
                    >
                        <PencilSimple className="h-4 w-4" />
                        VISUAL_BUILDER
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab('yaml')}
                        className={`gap-2 ${activeTab === 'yaml' ? 'bg-sky-500/20 text-sky-400' : 'text-zinc-400 hover:text-white'}`}
                    >
                        <Code className="h-4 w-4" />
                        YAML_SOURCE
                    </Button>
                </div>
            </div>

            {activeTab === 'builder' ? (
                <div className="space-y-8">
                    <StrategyInfoForm strategy={strategy} onChange={setStrategy} />
                    <RuleBuilder strategy={strategy} onChange={setStrategy} />
                    <ExecutionConfigForm strategy={strategy} onChange={setStrategy} />

                    <div className="flex justify-end pt-4 border-t border-white/5">
                        <Button
                            onClick={handleSave}
                            className="gap-2 bg-sky-500 hover:bg-sky-600 text-white shadow-[0_0_15px_rgba(14,165,233,0.3)]"
                        >
                            <FloppyDisk className="h-4 w-4" />
                            SAVE_STRATEGY
                        </Button>
                    </div>
                </div>
            ) : (
                <YAMLPreview strategy={strategy} onChange={setStrategy} />
            )}
        </div>
    );
}
