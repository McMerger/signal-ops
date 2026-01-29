"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

interface RiskGaugeProps {
    riskScore: number; // 0-100
}

export function RiskGauge({ riskScore }: RiskGaugeProps) {
    // Gauge data: 3 segments (Low, Medium, High Risk)
    const data = [
        { name: "Low", value: 33, color: "#10b981" },    // Emerald-500
        { name: "Medium", value: 33, color: "#f59e0b" }, // Amber-500
        { name: "High", value: 34, color: "#ef4444" },   // Red-500
    ];

    // Calculate needle rotation (-90deg to 90deg)
    // 0 score = -90deg, 100 score = 90deg
    const rotation = -90 + (riskScore / 100) * 180;

    const getRiskLabel = (score: number) => {
        if (score < 33) return { text: "LOW_RISK", color: "text-emerald-400" };
        if (score < 66) return { text: "MODERATE", color: "text-amber-400" };
        return { text: "CRITICAL", color: "text-rose-500" };
    };

    const label = getRiskLabel(riskScore);

    return (
        <GlassCard className="p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[300px]">
            <h3 className="text-lg font-mono text-zinc-400 mb-4 uppercase tracking-wider">Portfolio Risk</h3>

            <div className="relative w-full h-[180px] flex justify-center items-end overflow-hidden">
                <ResponsiveContainer width="100%" height="200%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius={80}
                            outerRadius={110}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                {/* Needle */}
                <motion.div
                    className="absolute bottom-0 left-1/2 w-1 h-[90px] bg-white origin-bottom rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] z-10"
                    initial={{ rotate: -90 }}
                    animate={{ rotate: rotation }}
                    transition={{ type: "spring", stiffness: 50, damping: 15 }}
                    style={{ x: "-50%" }}
                />

                {/* Center Pivot */}
                <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-zinc-900 rounded-full border-2 border-white z-20 -translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="mt-6 text-center">
                <div className="text-4xl font-bold font-mono text-white mb-1">
                    {riskScore.toFixed(1)}
                </div>
                <div className={`text-sm font-mono font-bold tracking-widest ${label.color}`}>
                    {label.text}
                </div>
            </div>

            {/* Background Glow */}
            <div
                className={`absolute inset-0 opacity-10 blur-3xl pointer-events-none transition-colors duration-500 ${riskScore < 33 ? "bg-emerald-500" : riskScore < 66 ? "bg-amber-500" : "bg-rose-500"
                    }`}
            />
        </GlassCard>
    );
}
