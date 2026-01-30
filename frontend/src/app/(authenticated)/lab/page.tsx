"use client";

import { GlassCard } from "@/components/ui/glass-card";

export default function LabPage() {
    return (
        <div className="container mx-auto p-8 space-y-6">
            <h1 className="text-2xl font-bold text-white font-mono">SIMULATION_LAB</h1>
            <div className="grid grid-cols-1 gap-6">
                <GlassCard className="p-6">
                    <h3 className="text-sm text-zinc-400 font-mono mb-4">MONTE_CARLO_SIMULATION</h3>
                    <div className="h-64 border border-dashed border-zinc-700 rounded flex items-center justify-center text-zinc-500 font-mono">
                        [SIMULATION_CANVAS_PLACEHOLDER]
                    </div>
                    <div className="mt-4 flex gap-4">
                        <button className="px-4 py-2 bg-sky-500/20 text-sky-400 font-mono text-sm rounded hover:bg-sky-500/30">RUN_1000_ITERATIONS</button>
                        <button className="px-4 py-2 bg-white/5 text-zinc-300 font-mono text-sm rounded hover:bg-white/10">CONFIG_PARAMETERS</button>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
