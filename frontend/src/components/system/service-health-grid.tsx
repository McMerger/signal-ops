"use client";

import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle, Activity, Server, Database, Cpu, ShieldCheck, Zap } from "lucide-react";

const services = [
    { name: "Exec Core (Go)", icon: Server, status: "healthy", latency: "12ms", uptime: "99.99%", port: 8080 },
    { name: "Strategy (Python)", icon: Zap, status: "healthy", latency: "45ms", uptime: "99.95%", port: 5001 },
    { name: "Risk Manager (Java)", icon: ShieldCheck, status: "healthy", latency: "23ms", uptime: "99.98%", port: 50052 },
    { name: "Signal Core (C++)", icon: Cpu, status: "healthy", latency: "2ms", uptime: "100.00%", port: "N/A" },
    { name: "PostgreSQL", icon: Database, status: "degraded", latency: "---", uptime: "Unknown", port: 5432 },
];

export function ServiceHealthGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {services.map((service) => (
                <Card key={service.name} className="p-4 bg-zinc-900/50 border-white/10 backdrop-blur-md">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-white/5 rounded-lg">
                            <service.icon className="h-5 w-5 text-zinc-400" />
                        </div>
                        {service.status === "healthy" ? (
                            <CheckCircle className="h-5 w-5 text-emerald-500" />
                        ) : (
                            <XCircle className="h-5 w-5 text-rose-500" />
                        )}
                    </div>

                    <h3 className="text-sm font-medium text-zinc-300">{service.name}</h3>
                    <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-zinc-500">Latency</span>
                            <span className="text-zinc-200 font-mono">{service.latency}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-zinc-500">Uptime</span>
                            <span className="text-zinc-200 font-mono">{service.uptime}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-zinc-500">Port</span>
                            <span className="text-zinc-200 font-mono">{service.port}</span>
                        </div>
                    </div>

                    <div className="mt-4 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${service.status === 'healthy' ? 'bg-emerald-500' : 'bg-rose-500'}`}
                            style={{ width: service.status === 'healthy' ? '98%' : '0%' }}
                        />
                    </div>
                </Card>
            ))}
        </div>
    );
}
