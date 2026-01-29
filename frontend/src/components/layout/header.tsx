"use client";

import { Bell, MagnifyingGlass } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export function Header() {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-md px-6">
            <div className="flex items-center gap-4 text-sm text-zinc-300">
                <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    System Operational
                </span>
                <span className="text-zinc-700">|</span>
                <span className="font-mono text-zinc-300">BTC: $94,230.50</span>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative">
                    <MagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-300" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="h-9 w-64 rounded-lg border border-white/10 bg-white/5 pl-9 pr-4 text-sm text-white placeholder-zinc-500 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/50"
                    />
                </div>

                <Button variant="ghost" size="icon" className="text-zinc-300 hover:text-white">
                    <Bell className="h-5 w-5" />
                </Button>
            </div>
        </header>
    );
}
