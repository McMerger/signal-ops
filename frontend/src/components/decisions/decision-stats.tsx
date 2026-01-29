"use client";

import { Card } from "@/components/ui/card";

export function DecisionStats() {
    return (
        <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 bg-zinc-900/50 border-white/10 backdrop-blur-md">
                <div className="text-zinc-500 text-xs font-mono mb-2">WIN_RATE (24H)</div>
                <div className="text-3xl font-bold text-emerald-500 font-mono">68.4%</div>
            </Card>
            <Card className="p-6 bg-zinc-900/50 border-white/10 backdrop-blur-md">
                <div className="text-zinc-500 text-xs font-mono mb-2">PROFIT_FACTOR</div>
                <div className="text-3xl font-bold text-sky-500 font-mono">2.1x</div>
            </Card>
            <Card className="p-6 bg-zinc-900/50 border-white/10 backdrop-blur-md col-span-2">
                <div className="flex justify-between items-center">
                    <div>
                        <div className="text-zinc-500 text-xs font-mono mb-1">TOTAL_DECISIONS</div>
                        <div className="text-2xl font-bold text-white font-mono">1,024</div>
                    </div>
                    <div className="text-right">
                        <div className="text-zinc-500 text-xs font-mono mb-1">AVG_LATENCY</div>
                        <div className="text-xl font-bold text-amber-500 font-mono">42ms</div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
