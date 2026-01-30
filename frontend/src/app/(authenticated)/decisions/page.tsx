"use client";


import { motion } from "framer-motion";
import { DecisionList } from "@/components/decisions/decision-list";
import { DecisionStats } from "@/components/decisions/decision-stats";

export default function DecisionsPage() {
    return (
        <div className="container mx-auto p-8 space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold tracking-tight text-white font-mono">
                    AI<span className="text-purple-500">_REASONING</span>
                </h1>
                <p className="text-zinc-400 font-mono mt-1">Neural Decision Pathways & Logic Logs</p>
            </motion.div>



            <div className="grid gap-8">
                <div className="grid gap-8 md:grid-cols-2">
                    <DecisionStats />
                    <DecisionList />
                </div>
            </div>
        </div>
    );
}
