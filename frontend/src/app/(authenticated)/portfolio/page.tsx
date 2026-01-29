"use client";

import { PortfolioUniverse } from "@/components/canvas/portfolio-universe";
import { motion } from "framer-motion";

export default function PortfolioPage() {
    return (
        <div className="container mx-auto p-8 space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold tracking-tight text-white font-mono">
                    GLOBAL<span className="text-indigo-500">_ASSETS</span>
                </h1>
                <p className="text-zinc-400 font-mono mt-1">Real-time Allocation & Physics Simulation</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
            >
                <PortfolioUniverse />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Metrics Placeholders to complement the 3D view */}
                <div className="p-6 bg-zinc-900/50 border border-white/10 rounded-lg">
                    <div className="text-zinc-500 text-xs font-mono mb-2">TOTAL VALUE LOCKED</div>
                    <div className="text-2xl font-bold text-white font-mono">$117,042.50</div>
                </div>
                <div className="p-6 bg-zinc-900/50 border border-white/10 rounded-lg">
                    <div className="text-zinc-500 text-xs font-mono mb-2">24H CHANGE</div>
                    <div className="text-2xl font-bold text-emerald-500 font-mono">+$3,420.12</div>
                </div>
                <div className="p-6 bg-zinc-900/50 border border-white/10 rounded-lg">
                    <div className="text-zinc-500 text-xs font-mono mb-2">SHARPE RATIO</div>
                    <div className="text-2xl font-bold text-sky-500 font-mono">2.45</div>
                </div>
            </div>
        </div>
    );
}
