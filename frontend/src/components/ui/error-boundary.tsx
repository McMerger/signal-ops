"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Warning, ArrowCounterClockwise } from "@phosphor-icons/react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    private handleReboot = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 font-mono relative overflow-hidden">
                    {/* CRT Scanline Effect */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none" />

                    <div className="relative z-20 max-w-md w-full border border-rose-900/50 bg-rose-950/10 p-8 rounded-lg text-center backdrop-blur-sm">
                        <Warning className="h-16 w-16 text-rose-500 mx-auto mb-6 animate-pulse" />

                        <h1 className="text-3xl font-bold text-rose-500 mb-2 tracking-widest">SYSTEM FAILURE</h1>
                        <p className="text-rose-400/80 mb-8 text-sm">
                            CRITICAL_ERROR_DETECTED: {this.state.error?.message || "Unknown Error"}
                        </p>

                        <div className="bg-black/50 p-4 rounded border border-rose-900/30 mb-8 text-left overflow-auto max-h-40">
                            <code className="text-xs text-rose-300/70">
                                {this.state.error?.stack}
                            </code>
                        </div>

                        <Button
                            onClick={this.handleReboot}
                            className="w-full bg-rose-600 hover:bg-rose-500 text-white border-none shadow-[0_0_20px_rgba(225,29,72,0.4)]"
                        >
                            <ArrowCounterClockwise className="h-5 w-5 mr-2" />
                            INITIATE_SYSTEM_REBOOT
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
