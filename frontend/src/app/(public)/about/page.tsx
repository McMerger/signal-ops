"use client";

import { ParticleDNA } from "@/components/canvas/public/particle-dna";
import { ScrollFrame } from "@/components/ui/context-frames";
import { Feather, Clock, ChartBar, Pulse } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion-variants";

const stats = [
    { label: "Avg Execution Time", value: "10ms", icon: Clock },
    { label: "Volume Processed", value: "$500M+", icon: ChartBar },
    { label: "System Uptime", value: "99.99%", icon: Pulse }
];

export default function AboutPage() {
    return (
        <div className="container mx-auto px-6 py-12 font-human">
            <div className="flex flex-col lg:flex-row gap-12 items-center mb-16">
                <div className="lg:w-1/2">
                    <div className="flex items-center gap-4 mb-6">
                        <ScrollFrame>
                            <Feather weight="duotone" className="w-8 h-8" />
                        </ScrollFrame>
                        <h1 className="text-6xl font-black text-orange-50 italic tracking-tighter">Built By Quants</h1>
                    </div>
                    <div className="prose prose-invert prose-lg mb-8">
                        <p className="text-2xl text-zinc-300 leading-relaxed font-human italic">
                            Signal-Ops wasn't built for the average trader. It was built for those who understand that in the financial markets,
                            <span className="text-orange-600 font-bold not-italic"> latency is the enemy</span> and <span className="text-orange-600 font-bold not-italic">precision is the currency.</span>
                        </p>
                        <p className="text-zinc-400">
                            Founded in 2024, our mission is to democratize institutional-grade infrastructure. We stripped away the bloat of traditional retail platforms
                            and replaced it with raw power.
                        </p>
                    </div>
                </div>
                <div className="lg:w-1/2 w-full">
                    <ParticleDNA />
                </div>
            </div>

            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-orange-500/20 pt-16"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            variants={staggerItem}
                            whileHover={{ scale: 1.05 }}
                            className="text-center p-8 border border-zinc-200 bg-white shadow-lg backdrop-blur-sm"
                        >
                            <ScrollFrame className="mx-auto mb-4 !text-orange-600 !border-orange-600">
                                <stat.icon weight="duotone" className="w-6 h-6 text-orange-600" />
                            </ScrollFrame>
                            <h3 className="text-6xl font-black text-orange-600 mb-2 italic">{stat.value}</h3>
                            <p className="text-zinc-600 font-human uppercase tracking-widest text-sm">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
