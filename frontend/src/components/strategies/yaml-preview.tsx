import { StrategyConfig } from '@/lib/api/strategy-configs-api';
import { GlassCard } from '@/components/ui/glass-card';
import { Code } from '@phosphor-icons/react';
import yaml from 'js-yaml';

interface YAMLPreviewProps {
    strategy: StrategyConfig;
    onChange: (strategy: StrategyConfig) => void;
}

export function YAMLPreview({ strategy, onChange }: YAMLPreviewProps) {
    const yamlString = yaml.dump(strategy);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-white font-mono">SOURCE_PREVIEW</h2>
                <p className="text-sm text-zinc-400">View the generated YAML configuration.</p>
            </div>

            <GlassCard className="p-0 overflow-hidden border-zinc-800 bg-zinc-950">
                <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                        <Code className="h-4 w-4" />
                        strategy.yaml
                    </div>
                    <div className="text-[10px] font-mono text-zinc-600">READ_ONLY</div>
                </div>
                <pre className="p-6 overflow-auto font-mono text-sm text-emerald-400 h-[500px] scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                    {yamlString}
                </pre>
            </GlassCard>
        </div>
    );
}
