"use client";

import { GlassCard } from "@/components/ui/glass-card";

export default function DataPage() {
    return (
        <div className="container mx-auto p-8 space-y-6">
            <h1 className="text-2xl font-bold text-white font-mono">DATA_SOURCES</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="p-6">
                    <h3 className="text-sm text-zinc-400 font-mono mb-4">ACTIVE_FEEDS</h3>
                    <div className="space-y-4 font-mono text-sm">
                        <div className="p-3 bg-white/5 rounded flex justify-between items-center">
                            <div>
                                <div className="text-white">COINBASE_PRO</div>
                                <div className="text-xs text-zinc-500">WebSocket • 50ms Latency</div>
                            </div>
                            <div className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded">CONNECTED</div>
                        </div>
                        <div className="p-3 bg-white/5 rounded flex justify-between items-center">
                            <div>
                                <div className="text-white">YAHOO_FINANCE</div>
                                <div className="text-xs text-zinc-500">REST API • 15m Delayed</div>
                            </div>
                            <div className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded">POLLING</div>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
