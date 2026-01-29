"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const comparisons = [
    { id: "S-102", name: "Momentum Alpha", profit: "+124%", sharpe: 2.1, drawdown: "-12%", color: "bg-emerald-500" },
    { id: "S-103", name: "Mean Reversion", profit: "+45%", sharpe: 1.4, drawdown: "-5%", color: "bg-sky-500" },
    { id: "S-104", name: "HFT Scalper", profit: "-12%", sharpe: 0.8, drawdown: "-15%", color: "bg-rose-500" },
    { id: "S-105", name: "Grid Bot V2", profit: "+89%", sharpe: 1.8, drawdown: "-22%", color: "bg-amber-500" },
];

export function BacktestComparison() {
    return (
        <Card className="p-6 bg-zinc-900/50 border-white/10 backdrop-blur-md">
            <h3 className="text-sm font-medium text-zinc-400 font-mono mb-6">STRATEGY_LEADERBOARD</h3>
            <div className="space-y-6">
                {comparisons.map((strat) => (
                    <div key={strat.id} className="group">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-3">
                                <Badge variant="outline" className="font-mono text-zinc-400 border-zinc-700">{strat.id}</Badge>
                                <span className="text-zinc-200 font-medium">{strat.name}</span>
                            </div>
                            <div className="flex gap-4 text-sm font-mono">
                                <span className="text-zinc-500">SR: <span className="text-white">{strat.sharpe}</span></span>
                                <span className="text-zinc-500">DD: <span className="text-rose-400">{strat.drawdown}</span></span>
                                <span className={strat.profit.startsWith('+') ? "text-emerald-400" : "text-rose-400"}>{strat.profit}</span>
                            </div>
                        </div>
                        {/* Progress Bar */}
                        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${strat.color} transition-all duration-500 group-hover:brightness-125`}
                                style={{ width: strat.profit.startsWith('+') ? strat.profit : '0%' }}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 text-center">
                <button className="text-xs text-zinc-500 hover:text-white font-mono uppercase tracking-widest transition-colors">
                    View Full Report
                </button>
            </div>
        </Card>
    );
}
