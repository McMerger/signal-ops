"use client";

import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Coffee, Terminal } from "@phosphor-icons/react";
import { motion } from "framer-motion";

export function ModeToggle() {
    const { mode, toggleMode } = useAppStore();

    return (
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/10">
            <Button
                variant={mode === 'beginner' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => mode !== 'beginner' && toggleMode()}
                className={`rounded-full px-4 gap-2 transition-all ${mode === 'beginner' ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-zinc-400'}`}
            >
                <Coffee className="w-4 h-4" />
                <span className="font-sans font-medium">Simple</span>
            </Button>
            <Button
                variant={mode === 'pro' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => mode !== 'pro' && toggleMode()}
                className={`rounded-full px-4 gap-2 transition-all ${mode === 'pro' ? 'bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/20' : 'text-zinc-400'}`}
            >
                <Terminal className="w-4 h-4" />
                <span className="font-mono">PRO_TERM</span>
            </Button>
        </div>
    );
}
