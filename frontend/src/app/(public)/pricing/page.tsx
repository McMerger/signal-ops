"use client";

import { ValueCrystals } from "@/components/canvas/public/value-crystals";
import { motion } from "framer-motion";
import { CheckCircle, Crown } from "@phosphor-icons/react";
import { DiamondFrame } from "@/components/ui/context-frames";
import { Button } from "@/components/ui/button";
import { staggerContainer, staggerItem } from "@/lib/motion-variants";

const pricingTiers = [
    {
        name: "Starter",
        price: "$0",
        period: "/mo",
        features: ["5 Active Strategies", "Standard Polling (1s)", "Community Support", "Basic Risk Limits"],
        cta: "Deploy Now",
        highlight: false,
        popular: false
    },
    {
        name: "Pro",
        price: "$299",
        period: "/mo",
        features: ["Unlimited Strategies", "WebSocket Streaming", "Priority Support", "3D Visualization Suite"],
        cta: "Start Trial",
        highlight: true,
        popular: true
    },
    {
        name: "Institutional",
        price: "Custom",
        features: ["Dedicated C++ Core", "Co-location Access", "24/7 Engineers", "Custom Algos"],
        cta: "Contact Sales",
        highlight: false,
        popular: false
    }
];

export default function PricingPage() {
    return (
        <div className="container mx-auto px-6 py-12 font-luxury">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <DiamondFrame className="mx-auto mb-6 !text-amber-600 !border-amber-600">
                    <Crown weight="duotone" className="w-8 h-8 text-amber-600" />
                </DiamondFrame>
                <h1 className="text-5xl font-bold text-foreground mb-4 tracking-tighter">INSTITUTIONAL ACCESS</h1>
                <p className="text-xl text-zinc-600 max-w-2xl mx-auto font-luxury italic">
                    Precision tools for the elite. Choose your tier of execution dominance.
                </p>
            </motion.div>

            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            >
                {pricingTiers.map((tier, i) => (
                    <motion.div
                        key={tier.name}
                        variants={staggerItem}
                        whileHover={{ y: -10 }}
                        className={`relative p-8 border-2 ${tier.popular ? "border-amber-500 bg-[#eee8d5] shadow-xl" : "border-zinc-300 bg-[#fdf6e3] shadow-lg"} backdrop-blur-md flex flex-col`}
                    >
                        {tier.popular && (
                            <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-3 py-1 uppercase tracking-widest">
                                Most Popular
                            </div>
                        )}
                        <h3 className={`text-2xl font-bold mb-2 uppercase tracking-widest ${tier.popular ? "text-amber-600" : "text-zinc-500"}`}>{tier.name}</h3>
                        <div className="flex items-baseline gap-1 mb-8">
                            <span className="text-5xl font-bold text-foreground">{tier.price}</span>
                            <span className="text-zinc-500 text-sm">/month</span>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            {tier.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-3 text-zinc-600 text-sm">
                                    <CheckCircle weight="duotone" className={`w-5 h-5 ${tier.popular ? "text-amber-600" : "text-zinc-400"}`} />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button className={`w-full py-4 text-sm font-bold uppercase tracking-widest transition-all ${tier.popular
                            ? "bg-amber-600 hover:bg-amber-700 text-white shadow-lg"
                            : "bg-zinc-100 hover:bg-zinc-200 text-foreground"
                            }`}>
                            Request Access
                        </button>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
