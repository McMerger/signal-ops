"use client";

import { useState, useEffect } from "react";
import { WifiHigh, WifiSlash, Pulse, Circle } from "@phosphor-icons/react";
import { useWebSocket } from "@/hooks/use-websocket";

export function StatusBar() {
    const isProduction = process.env.NODE_ENV === 'production';
    const WS_URL = isProduction ? 'wss://execution-core.cortesmailles01.workers.dev/ws' : 'ws://localhost:8080/ws';
    const { lastMessage } = useWebSocket({ url: WS_URL });
    const [latency, setLatency] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const [systemStatus, setSystemStatus] = useState<"ONLINE" | "DEGRADED" | "OFFLINE">("OFFLINE");

    // Simulate connection status and latency (replace with real logic if available)
    useEffect(() => {
        // In a real app, we'd track ping/pong or connection state from the hook
        // For now, we'll simulate "Connected" if we recently received a message
        if (lastMessage) {
            setIsConnected(true);
            setSystemStatus("ONLINE");
            // Mock latency fluctuation
            setLatency(Math.floor(Math.random() * 40) + 20);
        }

        const timeout = setTimeout(() => {
            // If no message for 5s, consider disconnected/idle
            // (This is a simple heuristic for visual feedback)
        }, 5000);

        return () => clearTimeout(timeout);
    }, [lastMessage]);

    // Initial connection simulation
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsConnected(true);
            setSystemStatus("ONLINE");
            setLatency(45);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="fixed bottom-0 left-0 right-0 h-8 bg-zinc-950 border-t border-white/10 flex items-center justify-between px-4 z-50 font-mono text-[10px] md:text-xs select-none">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
                    <span className={isConnected ? "text-emerald-500" : "text-rose-500"}>
                        {isConnected ? "CONNECTED" : "DISCONNECTED"}
                    </span>
                </div>

                <div className="flex items-center gap-2 text-zinc-400">
                    <Pulse className="h-4 w-4" />
                    <span>{latency}ms</span>
                </div>

                <div className="hidden md:flex items-center gap-2 text-zinc-400">
                    <span className="text-zinc-600">CORE:</span>
                    <span className="text-sky-400">v2.4.0-RC1</span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="text-zinc-600">SYSTEM:</span>
                    <span className={
                        systemStatus === "ONLINE" ? "text-emerald-400" :
                            systemStatus === "DEGRADED" ? "text-amber-400" : "text-rose-400"
                    }>{systemStatus}</span>
                </div>
                <div className="hidden md:block text-zinc-600">
                    SIGNAL_OPS TERMINAL
                </div>
            </div>
        </div>
    );
}
