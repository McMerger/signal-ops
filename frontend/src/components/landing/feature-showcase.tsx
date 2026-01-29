"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import {
    GitMerge,
    ShieldWarning,
    Code,
    ArrowRight,
    Cpu
} from "@phosphor-icons/react";

const features = [
    {
        id: "signal-fusion",
        title: "Signal Fusion",
        description: "Ingests data from 5+ sources including NewsAPI, CryptoCompare, and Polygon.io. Merges sentiment, price action, and macro indicators into a single, actionable signal.",
        icon: GitMerge,
        color: "text-sky-400",
        gradient: "from-sky-500/20 to-blue-600/20",
    },
    {
        id: "event-filter",
        title: "Event Filter",
        description: "Smart macro-protection. Automatically blocks trades during high-impact events like FOMC meetings or CPI releases using Polymarket prediction data.",
        icon: ShieldWarning,
        color: "text-amber-400",
        gradient: "from-amber-500/20 to-orange-600/20",
    },
    {
        id: "transparent-logic",
        title: "Transparent Logic",
        description: "No black boxes. Every decision is logged with a complete JSON trail. See exactly why a trade was taken or rejected in real-time.",
        icon: Code,
        color: "text-emerald-400",
        gradient: "from-emerald-500/20 to-green-600/20",
    },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
        >
            <GlassCard className="group relative h-full overflow-hidden p-8 transition-all duration-500 hover:-translate-y-2 hover:bg-white/10 border-white/5 hover:border-white/20">
                {/* Gradient Blob Background */}
                <div
                    className={`absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br ${feature.gradient} blur-3xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-70 opacity-20`}
                />

                <div className="relative z-10">
                    <div className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 ${feature.color} ring-1 ring-white/10`}>
                        <feature.icon className="h-6 w-6" weight="duotone" />
                    </div>

                    <h3 className="mb-3 text-2xl font-bold text-white tracking-tight">{feature.title}</h3>
                    <p className="mb-6 text-zinc-400 leading-relaxed font-light">
                        {feature.description}
                    </p>

                    <div className="flex items-center text-sm font-medium text-white opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-2">
                        <span className="mr-2">Explore Logic</span>
                        <ArrowRight className="h-4 w-4" />
                    </div>
                </div>
            </GlassCard>
        </motion.div>
    );
}

export function FeatureShowcase() {
    return (
        <section className="relative py-32 bg-black overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="mb-20 text-center max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-sky-400 ring-1 ring-inset ring-sky-400/20 mb-6"
                    >
                        <Cpu className="h-4 w-4" />
                        <span>SYSTEM ARCHITECTURE</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl font-bold tracking-tighter text-white md:text-6xl mb-6"
                    >
                        Institutional-Grade <span className="text-zinc-600">Precision</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mx-auto max-w-2xl text-lg text-zinc-400 font-light"
                    >
                        Built for speed, reliability, and absolute transparency. The engine processes thousands of data points per second to generate high-conviction signals.
                    </motion.p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {features.map((feature, index) => (
                        <FeatureCard key={feature.id} feature={feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
