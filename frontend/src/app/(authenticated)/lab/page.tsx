"use client";

import { ParameterSurface3D } from "@/components/canvas/parameter-surface-3d";
import { BacktestComparison } from "@/components/lab/backtest-comparison";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";

export default function LabPage() {
    return (
        <div className="container mx-auto p-8 space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white font-mono">
                        SIMULATION<span className="text-sky-500">.LAB</span>
                    </h1>
                    <p className="text-zinc-400 font-mono mt-1">Strategy Optimization & Backtesting Environment</p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 space-y-4"
                >
                    <ParameterSurface3D />

                    {/* Controls Mockup */}
                    <div className="p-6 bg-zinc-900/50 border border-white/10 rounded-lg backdrop-blur-md space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-mono text-zinc-400">PARAMETER_RANGES</h3>
                            <span className="px-2 py-0.5 bg-sky-500/10 text-sky-400 text-xs rounded font-mono border border-sky-500/20">Active Run</span>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs text-zinc-500 font-mono">STOP_LOSS_THRESHOLD (0.5% - 5.0%)</label>
                                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full w-1/2 bg-zinc-600"></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-zinc-500 font-mono">TAKE_PROFIT_MULTIPLIER (1x - 10x)</label>
                                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full w-3/4 bg-zinc-600"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <BacktestComparison />
                </motion.div>
            </div>
        </div>
    );
}
