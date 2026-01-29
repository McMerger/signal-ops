"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Warning, Skull, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface PanicButtonProps {
    onLiquidate: () => void;
}

export function PanicButton({ onLiquidate }: PanicButtonProps) {
    const [isArmed, setIsArmed] = useState(false);
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isArmed && countdown > 0) {
            timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        } else if (countdown === 0) {
            setIsArmed(false);
            setCountdown(5);
        }
        return () => clearTimeout(timer);
    }, [isArmed, countdown]);

    const handleArm = () => {
        setIsArmed(true);
        setCountdown(5);
    };

    const handleDisarm = () => {
        setIsArmed(false);
        setCountdown(5);
    };

    const handleExecute = () => {
        onLiquidate();
        setIsArmed(false);
        setCountdown(5);
    };

    return (
        <div className="relative">
            <AnimatePresence mode="wait">
                {!isArmed ? (
                    <motion.button
                        key="arm-button"
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleArm}
                        className="w-full h-24 bg-zinc-900 border-2 border-rose-900/50 rounded-xl flex items-center justify-center gap-4 group overflow-hidden relative"
                    >
                        {/* Striped Background */}
                        <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#ef4444_10px,#ef4444_20px)]" />

                        <div className="relative z-10 flex flex-col items-center">
                            <Warning className="h-8 w-8 text-rose-500 mb-1 group-hover:animate-pulse" />
                            <span className="text-rose-500 font-mono font-bold tracking-widest uppercase">Emergency Liquidate</span>
                            <span className="text-[10px] text-rose-500/50 font-mono mt-1">CLICK TO ARM</span>
                        </div>
                    </motion.button>
                ) : (
                    <motion.div
                        key="execute-panel"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="w-full h-24 bg-rose-950/90 border-2 border-rose-500 rounded-xl flex items-center justify-between px-6 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-rose-500/10 animate-pulse" />

                        <div className="relative z-10">
                            <div className="text-rose-200 font-mono font-bold text-sm">CONFIRM LIQUIDATION</div>
                            <div className="text-rose-400/70 text-xs font-mono">ALL POSITIONS WILL BE CLOSED</div>
                        </div>

                        <div className="relative z-10 flex items-center gap-3">
                            <Button
                                onClick={handleExecute}
                                className="bg-rose-600 hover:bg-rose-500 text-white border-none font-mono font-bold animate-pulse shadow-[0_0_20px_rgba(225,29,72,0.5)]"
                            >
                                <Skull className="h-5 w-5 mr-2" />
                                EXECUTE ({countdown})
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleDisarm}
                                className="text-rose-300 hover:bg-rose-900/50"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
