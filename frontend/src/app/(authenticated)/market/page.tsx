"use client";

// HolographicGlobe removed

import { motion } from "framer-motion";

export default function MarketPage() {
    return (
        <div className="container mx-auto p-8 space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold tracking-tight text-white font-mono">
                    MARKET<span className="text-sky-500">_INTEL</span>
                </h1>
                <p className="text-zinc-400 font-mono mt-1">Global Liquidity Flows & Geolocation</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
            >
                {/* WebGL component removed */}

            </motion.div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-900/50 border border-white/10 rounded-lg flex justify-between items-center">
                    <span className="text-zinc-400 text-sm font-mono">LONDON_SESSION</span>
                    <span className="text-emerald-500 text-xs font-mono bg-emerald-500/10 px-2 py-1 rounded">ACTIVE</span>
                </div>
                <div className="p-4 bg-zinc-900/50 border border-white/10 rounded-lg flex justify-between items-center">
                    <span className="text-zinc-400 text-sm font-mono">NEW_YORK_SESSION</span>
                    <span className="text-rose-500 text-xs font-mono bg-rose-500/10 px-2 py-1 rounded">CLOSED</span>
                </div>
            </div>
        </div>
    );
}
