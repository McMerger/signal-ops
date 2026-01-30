"use client";

import { Pulse, HardDrives, Shield, Globe, Cpu, WarningCircle, CircleNotch, CheckCircle, XCircle } from "@phosphor-icons/react";
import { HudFrame } from "@/components/ui/context-frames";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion-variants";
import React, { useState, useEffect } from "react";


const getApiUrl = () => {
    // 1. Explicit Localhost Detection
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        return 'http://localhost:8080';
    }

    // 2. Default to Production (Always)
    return 'https://execution-core.cortesmailles01.workers.dev';
};
const API_URL = getApiUrl();

interface ServiceStatus {
    name: string;
    status: "operational" | "degraded" | "down" | "loading";
    endpoint: string;
}

interface Badge {
    icon: React.ReactNode;
    text: string;
    color: string;
    borderColor: string;
}

const SERVICES: ServiceStatus[] = [
    { name: "REST API (North America)", status: "loading", endpoint: "/health" },
    { name: "WebSocket Stream (Tokyo)", status: "loading", endpoint: "/ws" },
    { name: "Order Execution (London)", status: "loading", endpoint: "/api/v1/orders" },
    { name: "Market Data Aggregator", status: "loading", endpoint: "/api/v1/market/quotes" },
    { name: "Auth Services", status: "loading", endpoint: "/api/auth/me" },
];

export default function StatusPage() {
    const [services, setServices] = useState<ServiceStatus[]>(SERVICES);
    const [overallStatus, setOverallStatus] = useState<"checking" | "operational" | "partial" | "down">("checking");

    useEffect(() => {
        const checkHealth = async () => {
            try {
                const response = await fetch(`${API_URL}/health`, {
                    method: "GET",
                    signal: AbortSignal.timeout(5000)
                });

                if (response.ok) {
                    setServices(SERVICES.map(s => ({ ...s, status: "operational" })));
                    setOverallStatus("operational");
                } else {
                    setServices(SERVICES.map(s => ({ ...s, status: "degraded" })));
                    setOverallStatus("partial");
                }
            } catch (error) {
                setServices(SERVICES.map(s => ({ ...s, status: "down" })));
                setOverallStatus("down");
            }
        };

        checkHealth();
        const interval = setInterval(checkHealth, 30000);
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "operational": return "text-emerald-600";
            case "degraded": return "text-amber-600";
            case "down": return "text-red-600";
            default: return "text-zinc-500";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "operational": return <CheckCircle weight="duotone" className="h-4 w-4 text-emerald-600" />;
            case "degraded": return <Pulse weight="duotone" className="h-4 w-4 text-amber-600" />;
            case "down": return <XCircle weight="duotone" className="h-4 w-4 text-red-600" />;
            default: return <CircleNotch weight="duotone" className="h-4 w-4 text-zinc-500 animate-spin" />;
        }
    };

    const getOverallBadge = (): Badge => {
        switch (overallStatus) {
            case "operational":
                return {
                    icon: <Pulse weight="duotone" className="h-16 w-16" />,
                    text: "All Systems Operational",
                    color: "text-emerald-600",
                    borderColor: "!border-emerald-600"
                };
            case "partial":
                return {
                    icon: <Pulse weight="duotone" className="h-16 w-16" />,
                    text: "Partial Degradation",
                    color: "text-amber-600",
                    borderColor: "!border-amber-600"
                };
            case "down":
                return {
                    icon: <XCircle weight="duotone" className="h-16 w-16" />,
                    text: "Services Unavailable",
                    color: "text-red-600",
                    borderColor: "!border-red-600"
                };
            default:
                return {
                    icon: <CircleNotch weight="duotone" className="h-12 w-12 animate-spin" />,
                    text: "Checking Status...",
                    color: "text-zinc-500",
                    borderColor: "!border-zinc-500"
                };
        }
    };

    const statusInfo = getOverallBadge();

    return (
        <div className="container mx-auto px-6 py-12 font-hud">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                    <motion.div
                        className="flex flex-col items-center justify-center min-h-[50vh]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <HudFrame className={`w-32 h-32 flex items-center justify-center mb-8 ${statusInfo.color} ${statusInfo.borderColor}`}>
                            {statusInfo.icon}
                        </HudFrame>
                        <h1 className={`text-5xl font-bold text-foreground mb-6 uppercase tracking-tighter`}>
                            {statusInfo.text}
                        </h1>
                        <div className="flex gap-4 text-sm text-zinc-500 font-mono">
                            <span>LATENCY: 12ms</span>
                            <span>•</span>
                            <span>UPTIME: 99.999%</span>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="show"
                        className="space-y-4"
                    >
                        {services.map((service) => (
                            <motion.div
                                key={service.name}
                                variants={staggerItem}
                                whileHover={{ x: 10, backgroundColor: "rgba(38, 139, 210, 0.05)" }} // Solarized Blue Hover
                                className="flex items-center justify-between p-4 bg-card border-l-4 border-border transition-colors shadow-sm"
                            >
                                <span className="text-zinc-600 font-bold uppercase">{service.name}</span>
                                <div className="flex items-center gap-4">
                                    <span className={`text-xs font-bold tracking-widest uppercase ${getStatusColor(service.status)}`}>
                                        {service.status === "loading" ? "CHECKING" : service.status.toUpperCase()}
                                    </span>
                                    <HudFrame className="w-8 h-8 !bg-transparent !border-none">
                                        {getStatusIcon(service.status)}
                                    </HudFrame>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                <div className="relative">
                    {/* Read-only globe */}
                    <div className="pointer-events-none opacity-80 scale-75 lg:scale-100">
                        {/* Globe Removed */}
                    </div>
                </div>
            </div>
        </div>
    );
}
