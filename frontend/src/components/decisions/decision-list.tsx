"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const logs = [
    { id: "DEC-8821", time: "10:42:15", action: "BUY", asset: "BTC-USDT", confidence: 0.92, reason: "Momentum Breakout + Volatility Squeeze" },
    { id: "DEC-8820", time: "10:38:00", action: "HOLD", asset: "ETH-USDT", confidence: 0.65, reason: "Waiting for support confirmation" },
    { id: "DEC-8819", time: "10:15:33", action: "SELL", asset: "SOL-USDT", confidence: 0.88, reason: "RSI Divergence > 75" },
    { id: "DEC-8818", time: "09:55:12", action: "BUY", asset: "AVAX-USDT", confidence: 0.78, reason: "Volume Spike > 200%" },
];

export function DecisionList() {
    return (
        <Card className="p-6 bg-zinc-900/50 border-white/10 backdrop-blur-md">
            <h3 className="text-sm font-medium text-zinc-400 font-mono mb-4">DECISION_LOG_STREAM</h3>
            <div className="space-y-4">
                {logs.map((log) => (
                    <div key={log.id} className="p-3 bg-black/40 border border-white/5 rounded-lg flex justify-between items-center group hover:border-white/10 transition-colors">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-zinc-500">{log.time}</span>
                                <Badge variant="outline" className={`font-mono text-xs border-zinc-700 ${log.action === "BUY" ? "text-emerald-400 bg-emerald-500/10" :
                                        log.action === "SELL" ? "text-rose-400 bg-rose-500/10" : "text-sky-400 bg-sky-500/10"
                                    }`}>
                                    {log.action}
                                </Badge>
                                <span className="text-sm font-bold text-white font-mono">{log.asset}</span>
                            </div>
                            <p className="text-xs text-zinc-400">{log.reason}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] text-zinc-600 font-mono uppercase">Confidence</div>
                            <div className="text-lg font-bold text-white font-mono">{Math.round(log.confidence * 100)}%</div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
