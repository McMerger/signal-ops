"use client";

import { FloatingLogTerminal } from "@/components/canvas/floating-log-terminal";
import { ServiceHealthGrid } from "@/components/system/service-health-grid";
import { motion } from "framer-motion";

export default function SystemOperationsPage() {
    return (
        <div className="container mx-auto p-8 space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground font-mono">
                            SYSTEM_OPS<span className="text-emerald-500">.LOG</span>
                        </h1>
                        <p className="text-zinc-400 font-mono mt-1">Infrastructure Telemetry & Health</p>
                    </div>
                    <div className="text-right font-mono text-sm">
                        <div className="text-zinc-500">Active Alerts</div>
                        <div className="text-rose-500">1 CRITICAL</div>
                    </div>
                </div>

                <ServiceHealthGrid />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="relative"
            >
                <div className="absolute -top-3 left-4 px-2 bg-background text-xs font-mono text-zinc-500 border border-zinc-300 z-10">
                    LIVE_KERNEL_LOGS
                </div>
                <FloatingLogTerminal />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 border border-border rounded-lg bg-card backdrop-blur-sm">
                    <h3 className="text-sm font-medium text-zinc-400 font-mono mb-4">THROUGHPUT</h3>
                    <div className="text-4xl font-bold text-foreground font-mono">4.2 TB<span className="text-sm text-zinc-600 ml-2">/day</span></div>
                </div>
                <div className="p-6 border border-border rounded-lg bg-card backdrop-blur-sm">
                    <h3 className="text-sm font-medium text-zinc-400 font-mono mb-4">ERROR RATE</h3>
                    <div className="text-4xl font-bold text-emerald-500 font-mono">0.001%</div>
                </div>
                <div className="p-6 border border-border rounded-lg bg-card backdrop-blur-sm">
                    <h3 className="text-sm font-medium text-zinc-400 font-mono mb-4">ACTIVE THREADS</h3>
                    <div className="text-4xl font-bold text-sky-500 font-mono">2,048</div>
                </div>
            </div>
        </div>
    );
}
