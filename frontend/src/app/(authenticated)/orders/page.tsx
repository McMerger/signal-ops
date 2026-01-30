"use client";

import { GlassCard } from "@/components/ui/glass-card";

export default function OrdersPage() {
    return (
        <div className="container mx-auto p-8 space-y-6">
            <h1 className="text-2xl font-bold text-white font-mono">ORDER_MANAGEMENT</h1>
            <GlassCard className="p-0 overflow-hidden">
                <div className="p-4 border-b border-white/5 bg-white/5">
                    <div className="flex gap-4 font-mono text-sm text-zinc-400">
                        <span className="text-white">OPEN_ORDERS</span>
                        <span>FILL_HISTORY</span>
                        <span>AUDIT_LOGS</span>
                    </div>
                </div>
                <div className="p-12 text-center text-zinc-500 font-mono text-sm">
                    NO_OPEN_ORDERS
                </div>
            </GlassCard>
        </div>
    );
}
