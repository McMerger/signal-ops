"use client";

import { Warning } from "@phosphor-icons/react";

export function DisclaimerBanner() {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-rose-500/10 border-t border-rose-500/20 backdrop-blur-md z-50 py-2 px-4 flex items-center justify-center gap-2">
            <Warning className="w-4 h-4 text-rose-500" />
            <p className="text-[10px] md:text-xs text-rose-200 font-mono text-center">
                <span className="font-bold">EXPERIMENTAL SOFTWARE:</span> SignalOps is not production-grade.
                Trades are executed with <span className="font-bold text-rose-100">REAL DATA</span> but should only be used for research/paper trading without supervision.
            </p>
        </div>
    );
}
