"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, createContext, useContext, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface TransitionContextType {
    startTransition: (href: string) => void;
    isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function useWarpTransition() {
    const context = useContext(TransitionContext);
    if (!context) {
        throw new Error("useWarpTransition must be used within a WarpTransitionProvider");
    }
    return context;
}

export function WarpTransitionProvider({ children }: { children: ReactNode }) {
    const [isTransitioning, setIsTransitioning] = useState(false);
    const router = useRouter();

    const startTransition = (href: string) => {
        setIsTransitioning(true);
        // Delay navigation to allow animation to play
        setTimeout(() => {
            router.push(href);
        }, 1500); // 1.5s transition
    };

    return (
        <TransitionContext.Provider value={{ startTransition, isTransitioning }}>
            {children}
            <AnimatePresence>
                {isTransitioning && (
                    <motion.div
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Warp Lines */}
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vh] bg-[radial-gradient(circle,rgba(255,255,255,0)_0%,rgba(14,165,233,0.2)_100%)] animate-pulse" />
                            {/* We can simulate warp lines with a radial gradient scaling up massively */}
                            <motion.div
                                className="absolute top-1/2 left-1/2 w-full h-full bg-black"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 20, opacity: 1 }}
                                transition={{ duration: 1.5, ease: "circIn" }}
                                style={{
                                    background: "radial-gradient(circle, transparent 0%, #000 100%)",
                                    boxShadow: "inset 0 0 100px #0ea5e9"
                                }}
                            />
                        </div>

                        {/* Text Flash */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1.5 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative z-10 text-4xl font-bold text-white tracking-[1em] uppercase"
                        >
                            Initializing
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </TransitionContext.Provider>
    );
}
