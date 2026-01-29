"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FrameProps {
    children: ReactNode;
    className?: string;
}

// 1. Home: Cosmic (Syncopate)
export function CosmicFrame({ children, className = "" }: FrameProps) {
    return (
        <div className={`relative flex items-center justify-center w-16 h-16 ${className}`}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-sky-500/30 border-dashed"
            />
            <div className="absolute inset-0 rounded-full bg-sky-500/10 blur-xl" />
            <div className="relative z-10 text-sky-400">{children}</div>
        </div>
    );
}

// 2. Login: Security (Rajdhani)
export function ReticleFrame({ children, className = "" }: FrameProps) {
    return (
        <div className={`relative flex items-center justify-center w-14 h-14 ${className}`}>
            {/* Corners */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-red-500" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-red-500" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-red-500" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-red-500" />
            {/* Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <div className="w-full h-px bg-red-500" />
                <div className="h-full w-px bg-red-500 absolute" />
            </div>
            <div className="relative z-10 text-red-500">{children}</div>
        </div>
    );
}

// 3. Signup: Blueprint (Orbitron)
export function BlueprintFrame({ children, className = "" }: FrameProps) {
    return (
        <div className={`relative flex items-center justify-center w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 ${className}`}>
            <div className="absolute -top-1 -left-1 text-[8px] text-indigo-400 font-mono">01</div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-t border-l border-indigo-500/50" />
            {/* Dashed grid */}
            <div className="absolute inset-1 border border-dashed border-indigo-500/30" />
            <div className="relative z-10 text-indigo-400">{children}</div>
        </div>
    );
}

// 4. Features: Machine (Space Grotesk)
export function HexFrame({ children, className = "" }: FrameProps) {
    return (
        <div className={`relative flex items-center justify-center w-16 h-16 ${className}`}>
            <svg className="absolute inset-0 w-full h-full text-emerald-500/20" viewBox="0 0 100 100">
                <path d="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z" fill="currentColor" stroke="#10b981" strokeWidth="1" />
            </svg>
            <div className="relative z-10 text-emerald-400">{children}</div>
        </div>
    );
}

// 5. Pricing: Luxury (Italiana)
export function DiamondFrame({ children, className = "" }: FrameProps) {
    return (
        <div className={`relative flex items-center justify-center w-16 h-16 ${className}`}>
            <div className="absolute inset-0 bg-amber-500/5 rotate-45 border border-amber-500/30 transition-transform hover:rotate-90 duration-700" />
            <div className="absolute inset-2 border border-amber-500/20 rotate-45" />
            <div className="relative z-10 text-amber-500">{children}</div>
        </div>
    );
}

// 6. Status: HUD (Chakra Petch)
export function HudFrame({ children, className = "" }: FrameProps) {
    return (
        <div className={`relative flex items-center justify-center w-14 h-14 bg-zinc-900/80 skew-x-[-10deg] border-l-2 border-r-2 border-orange-500/50 ${className}`}>
            <div className="absolute top-0 w-full h-[1px] bg-orange-500/30" />
            <div className="absolute bottom-0 w-full h-[1px] bg-orange-500/30" />
            <div className="relative z-10 text-orange-500 skew-x-[10deg]">{children}</div>
        </div>
    );
}

// 7. Docs: Terminal (VT323)
export function TerminalFrame({ children, className = "" }: FrameProps) {
    return (
        <div className={`relative flex items-center justify-center w-14 h-14 bg-black border border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.3)] ${className}`}>
            <div className="absolute bottom-1 right-1 w-2 h-1 bg-green-500 animate-pulse" />
            <div className="relative z-10 text-green-500">{children}</div>
        </div>
    );
}

// 8. About: Scroll (Playfair Display)
export function ScrollFrame({ children, className = "" }: FrameProps) {
    return (
        <div className={`relative flex items-center justify-center w-16 h-16 rounded-full border border-pink-500/20 bg-pink-500/5 ${className}`}>
            <div className="absolute inset-1 rounded-full border border-dotted border-pink-500/30" />
            <div className="relative z-10 text-pink-400 font-serif italic">{children}</div>
        </div>
    );
}
