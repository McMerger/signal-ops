"use client";

import { TerminalFrame } from "@/components/ui/context-frames";
import { Hash } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion-variants";
import { Canvas } from "@react-three/fiber";


export default function DocsPage() {
    return (
        <div className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-12 font-terminal relative">
            {/* Background Syntax Flow */}


            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    className="sticky top-24"
                >
                    <h3 className="text-lg font-bold text-foreground uppercase mb-4 tracking-widest border-b border-green-600/30 pb-2">Getting Started</h3>
                    <nav className="flex flex-col space-y-2 mb-8">
                        {['Architecture', 'Installation', 'Quick Start'].map(item => (
                            <motion.a
                                key={item}
                                href="#"
                                variants={staggerItem}
                                whileHover={{ x: 10, color: '#2aa198' }} // Solarized Cyan
                                className="text-zinc-500 hover:text-cyan-600 transition-colors cursor-pointer font-mono"
                            >
                                {`> ${item}`}
                            </motion.a>
                        ))}
                    </nav>

                    <h3 className="text-lg font-bold text-foreground uppercase mb-4 tracking-widest border-b border-green-600/30 pb-2">Endpoints</h3>
                    <nav className="flex flex-col space-y-2">
                        {['/auth', '/market', '/orders', '/risk'].map(item => (
                            <motion.a
                                key={item}
                                href="#"
                                variants={staggerItem}
                                whileHover={{ x: 10, color: '#2aa198' }}
                                className="text-zinc-500 hover:text-cyan-600 transition-colors cursor-pointer font-mono"
                            >
                                {`GET ${item}`}
                            </motion.a>
                        ))}
                    </nav>
                </motion.div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3 space-y-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <section>
                        <div className="flex items-center gap-4 mb-6">
                            <TerminalFrame>
                                <Hash weight="duotone" className="h-6 w-6 text-green-600" />
                            </TerminalFrame>
                            <h2 className="text-3xl font-bold text-foreground font-mono">API Reference v1.0</h2>
                        </div>
                        <p className="text-lg text-zinc-600 leading-relaxed font-mono">
                            The Signal-Ops API provides programmatic access to all execution and strategy engines.
                            Responses are formatted as JSON. Timestamps are in ISO 8601.
                        </p>
                    </section>

                    <section className="space-y-6 mt-12">
                        <h2 className="text-2xl font-bold text-foreground mb-4 uppercase tracking-widest block border-l-4 border-green-500 pl-4">Authentication</h2>
                        <div className="bg-[#fdf6e3] border border-zinc-200 p-6 text-sm overflow-x-auto shadow-sm rounded-md font-mono text-zinc-600">
                            <code>
                                <div className="mb-2 text-[#93a1a1]"># Authenticate with Bearer Token</div>
                                <span className="text-[#859900]">curl</span> <span className="text-[#268bd2]">-X</span> GET https://api.signalops.com/v1/account \<br />
                                &nbsp;&nbsp;<span className="text-[#268bd2]">-H</span> <span className="text-[#b58900]">"Authorization: Bearer sk_live_882..."</span>
                            </code>
                        </div>
                    </section>
                </motion.div>
            </div>
        </div>
    );
}
