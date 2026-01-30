"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { useEffect, useState } from "react";

export default function RiskPage() {
    const [risk, setRisk] = useState<any>(null);

    useEffect(() => {
        const fetchRisk = async () => {
            try {
                const res = await fetch('/api/v1/portfolio/risk');
                if (res.ok) {
                    const data = await res.json();
                    setRisk(data);
                }
            } catch (e) {
                console.error("Risk fetch failed", e);
            }
        };
        fetchRisk();
        const timer = setInterval(fetchRisk, 10000);
        return () => clearInterval(timer);
    }, []);

    const renderValue = (val: any, prefix = '', suffix = '') => {
        if (risk === null) return <span className="text-zinc-600 animate-pulse">--</span>;
        return <span className="text-white">{prefix}{val?.toLocaleString()}{suffix}</span>;
    };

    return (
        <div className="container mx-auto p-8 space-y-6">
            <h1 className="text-2xl font-bold text-white font-mono">RISK_MANAGEMENT</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <GlassCard className="p-6 border-rose-500/20">
                    <h3 className="text-xs text-rose-400 font-mono mb-2">VAR (95% 30D)</h3>
                    <div className="text-2xl font-bold">{renderValue(risk?.var_95_30d, '$')}</div>
                </GlassCard>
                <GlassCard className="p-6">
                    <h3 className="text-xs text-zinc-400 font-mono mb-2">OPEN POSITIONS</h3>
                    <div className="text-2xl font-bold">{renderValue(risk?.open_positions)}</div>
                </GlassCard>
                <GlassCard className="p-6">
                    <h3 className="text-xs text-zinc-400 font-mono mb-2">RISK LEVEL</h3>
                    <div className={`text-2xl font-bold ${risk?.risk_level === 'CRITICAL' ? 'text-rose-500' : 'text-white'}`}>
                        {renderValue(risk?.risk_level)}
                    </div>
                </GlassCard>
                <GlassCard className="p-6">
                    <h3 className="text-xs text-zinc-400 font-mono mb-2">EXPOSURE LIMIT</h3>
                    <div className="text-2xl font-bold text-zinc-400">
                        {renderValue(risk?.risk_limits?.max_exposure, '$')}
                    </div>
                </GlassCard>
            </div>
            <div className="text-center text-xs text-zinc-600 font-mono mt-8">
                RISK ENGINE CONNECTED via Execution Core API
            </div>
        </div>
    );
}
