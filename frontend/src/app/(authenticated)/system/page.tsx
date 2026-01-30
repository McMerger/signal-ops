"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Check, X } from "@phosphor-icons/react";

export default function SystemPage() {
    return (
        <div className="container mx-auto p-8 space-y-6">
            <h1 className="text-2xl font-bold text-white font-mono">SYSTEM_OPERATIONS</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <GlassCard className="p-6">
                    <h3 className="text-sm text-zinc-400 font-mono mb-4">CORE_SERVICES</h3>
                    <div className="space-y-3 font-mono text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-300">EXECUTION_ENGINE</span>
                            <div className="flex items-center gap-2 text-emerald-400"><Check /> ONLINE</div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-300">RISK_CONTROLLER</span>
                            <div className="flex items-center gap-2 text-emerald-400"><Check /> ONLINE</div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-300">DATA_INGEST</span>
                            <div className="flex items-center gap-2 text-amber-400"><Check /> DEGRADED</div>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-6">
                    <h3 className="text-sm text-zinc-400 font-mono mb-4">WORKER_METRICS</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-mono text-zinc-500"><span>CPU_USAGE</span> <span>12%</span></div>
                        <div className="h-1 bg-white/5 rounded overflow-hidden"><div className="h-full bg-sky-500 w-[12%]"></div></div>

                        <div className="flex justify-between text-xs font-mono text-zinc-500 pt-2"><span>MEMORY</span> <span>45%</span></div>
                        <div className="h-1 bg-white/5 rounded overflow-hidden"><div className="h-full bg-purple-500 w-[45%]"></div></div>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
