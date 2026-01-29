"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";

interface AssetExposure {
    symbol: string;
    size: number; // Position size in USD
    pnlPercent: number; // Current PnL %
}

interface ExposureHeatmapProps {
    assets: AssetExposure[];
}

export function ExposureHeatmap({ assets }: ExposureHeatmapProps) {
    const totalSize = assets.reduce((sum, asset) => sum + asset.size, 0);

    // Sort by size descending for better layout
    const sortedAssets = [...assets].sort((a, b) => b.size - a.size);

    return (
        <GlassCard className="p-6 h-full min-h-[300px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-mono text-zinc-400 uppercase tracking-wider">Exposure Heatmap</h3>
                <span className="text-xs font-mono text-zinc-500">SIZE = ALLOCATION • COLOR = PNL</span>
            </div>

            <div className="flex-1 flex flex-wrap gap-1 content-start">
                {sortedAssets.map((asset) => {
                    // Calculate relative width based on portfolio share
                    // Min width 10% to ensure visibility
                    const share = (asset.size / totalSize) * 100;
                    const width = Math.max(share, 10);

                    // Determine color based on PnL
                    let bgColor = "bg-zinc-700";
                    if (asset.pnlPercent > 0) {
                        // Green intensity
                        const intensity = Math.min(Math.abs(asset.pnlPercent) * 10 + 20, 90);
                        bgColor = `bg-emerald-500/${Math.round(intensity)}`;
                    } else if (asset.pnlPercent < 0) {
                        // Red intensity
                        const intensity = Math.min(Math.abs(asset.pnlPercent) * 10 + 20, 90);
                        bgColor = `bg-rose-500/${Math.round(intensity)}`;
                    }

                    return (
                        <motion.div
                            key={asset.symbol}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`relative h-24 rounded-md border border-white/5 overflow-hidden group cursor-pointer transition-all hover:brightness-125 ${bgColor}`}
                            style={{ flexGrow: share, flexBasis: `${width}%` }}
                        >
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                                <span className="font-bold text-white font-mono text-shadow-sm">{asset.symbol}</span>
                                <span className="text-xs text-white/90 font-mono">
                                    {asset.pnlPercent > 0 ? "+" : ""}{asset.pnlPercent.toFixed(2)}%
                                </span>
                                <span className="text-[10px] text-white/70 font-mono mt-1">
                                    ${(asset.size / 1000).toFixed(1)}k
                                </span>
                            </div>
                        </motion.div>
                    );
                })}

                {assets.length === 0 && (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600 font-mono">
                        NO_ACTIVE_POSITIONS
                    </div>
                )}
            </div>
        </GlassCard>
    );
}
