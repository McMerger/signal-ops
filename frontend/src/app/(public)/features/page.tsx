"use client";

import { PolyglotEngine } from "@/components/canvas/public/polyglot-engine";
import { motion } from "framer-motion";
import { HexFrame } from "@/components/ui/context-frames";
import { Cpu, Database, ShieldCheck, Lightning } from "@phosphor-icons/react";
import { staggerContainer, staggerItem } from "@/lib/motion-variants";

const features = [
    {
        title: "Go Execution Core",
        desc: "Low-latency order routing and WebSocket management. Handles 10k+ ops/sec.",
        icon: Lightning,
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-100"
    },
    {
        title: "Python Strategy Engine",
        desc: "Advanced quantitative analysis utilizing Pandas, NumPy, and PyTorch for AI inference.",
        icon: Database,
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-100"
    },
    {
        title: "Java Risk Manager",
        desc: "Enterprise-grade risk controls. Calculations for VaR and exposure limits per tick.",
        icon: ShieldCheck,
        color: "text-rose-600",
        bg: "bg-rose-50",
        border: "border-rose-100"
    },
    {
        title: "C++ Signal Core",
        desc: "High-frequency signal processing and arbitrage detection at the microsecond level.",
        icon: Cpu,
        color: "text-purple-600",
        bg: "bg-purple-50",
        border: "border-purple-100"
    }
];

export default function FeaturesPage() {
    return (
        <div className="container mx-auto px-6 py-12 font-machine">
            <div className="flex flex-col lg:flex-row gap-12 items-center mb-20">
                <div className="flex-1">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h1 className="text-5xl font-bold text-foreground mb-6 tracking-tight uppercase">
                            The <span className="text-blue-600">Polyglot Edge</span>
                        </h1>
                        <p className="text-xl text-zinc-600 leading-relaxed font-sans">
                            Signal-Ops leverages the best tool for every job. Four languages, one unified high-performance machine.
                            <br /><br />
                            Explore the architecture by interacting with the engine block.
                        </p>
                    </motion.div>
                </div>
                <div className="flex-1 w-full">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <PolyglotEngine />
                    </motion.div>
                </div>
            </div>

            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
                {features.map((feat, i) => (
                    <motion.div
                        key={feat.title}
                        variants={staggerItem}
                        whileHover={{ scale: 1.02 }}
                        className={`p-8 rounded-2xl border ${feat.border} bg-white shadow-lg backdrop-blur-sm hover:shadow-xl transition-all`}
                    >
                        <HexFrame className="mb-6">
                            <feat.icon weight="duotone" className={`w-8 h-8 ${feat.color}`} />
                        </HexFrame>
                        <h3 className="text-2xl font-bold text-foreground mb-3 tracking-wide uppercase">{feat.title}</h3>
                        <p className="text-zinc-600 leading-relaxed font-sans">
                            {feat.desc}
                        </p>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
