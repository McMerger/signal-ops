"use client";

import { LiquidShield } from "@/components/canvas/liquid-shield";
import { motion } from "framer-motion";

export default function RiskPage() {
    return (
        <div className="container mx-auto p-8 space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold tracking-tight text-white font-mono">
                    RISK<span className="text-rose-500">_GUARD</span>
                </h1>
                <p className="text-zinc-400 font-mono mt-1">Value-at-Risk Visualization & Limits</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
            >
                <LiquidShield />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-zinc-900/50 border border-white/10 rounded-lg">
                    <h3 className="text-sm font-medium text-zinc-400 font-mono mb-4">EXPOSURE_LIMITS</h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-mono text-zinc-500">
                                <span>GROSS LEVERAGE</span>
                                <span className="text-white">1.2x / 3.0x</span>
                            </div>
                            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full w-1/3 bg-sky-500"></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-mono text-zinc-500">
                                <span>DAILY DRAWDOWN</span>
                                <span className="text-white">0.4% / 5.0%</span>
                            </div>
                            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full w-[8%] bg-emerald-500"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-zinc-900/50 border border-white/10 rounded-lg">
                    <h3 className="text-sm font-medium text-zinc-400 font-mono mb-2">SHIELD_STATUS</h3>
                    <p className="text-sm text-zinc-300">
                        The liquid barrier represents real-time market volatility absorption.
                        Impact ripples indicate high-frequency slippage events.
                    </p>
                </div>
            </div>
        </div>
    );
}
