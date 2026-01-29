"use client";

import { Card } from "@/components/ui/card";

const assets = ["BTC", "ETH", "SOL", "AVAX", "MATIC"];
const matrix = [
    [1.00, 0.85, 0.62, 0.55, 0.70],
    [0.85, 1.00, 0.71, 0.60, 0.75],
    [0.62, 0.71, 1.00, 0.45, 0.50],
    [0.55, 0.60, 0.45, 1.00, 0.82],
    [0.70, 0.75, 0.50, 0.82, 1.00]
];

export function CorrelationMatrix() {
    return (
        <Card className="p-6 bg-zinc-900/50 border-white/10 backdrop-blur-md">
            <h3 className="text-sm font-medium text-zinc-400 font-mono mb-6">ASSET_CORRELATION_MATRIX (30D)</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-center text-sm font-mono">
                    <thead>
                        <tr>
                            <th className="p-2"></th>
                            {assets.map(asset => (
                                <th key={asset} className="p-2 text-zinc-500">{asset}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {assets.map((rowAsset, i) => (
                            <tr key={rowAsset}>
                                <td className="p-2 text-zinc-500 font-bold text-right">{rowAsset}</td>
                                {matrix[i].map((value, j) => {
                                    // Color logic
                                    let bgClass = "bg-zinc-800/50";
                                    let textClass = "text-zinc-500";

                                    if (i === j) {
                                        bgClass = "bg-zinc-800";
                                        textClass = "text-zinc-700";
                                    } else if (value > 0.8) {
                                        bgClass = "bg-emerald-500/20";
                                        textClass = "text-emerald-500";
                                    } else if (value > 0.6) {
                                        bgClass = "bg-emerald-500/10";
                                        textClass = "text-emerald-400";
                                    } else {
                                        bgClass = "bg-zinc-800/80";
                                        textClass = "text-zinc-400";
                                    }

                                    return (
                                        <td key={j} className="p-1">
                                            <div className={`py-3 rounded ${bgClass} ${textClass}`}>
                                                {value.toFixed(2)}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
