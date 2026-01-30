"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CreateStrategyPage() {
    const [step, setStep] = useState(1);
    const [selection, setSelection] = useState<any>({});

    const handleSelect = (key: string, value: string) => {
        setSelection({ ...selection, [key]: value });
    };

    return (
        <div className="container mx-auto p-8 max-w-4xl min-h-screen flex flex-col justify-center">
            <div className="mb-8">
                <Link href="/dashboard" className="text-zinc-500 hover:text-white text-sm font-mono mb-4 block">
                    &lt; RETURN_TO_TERMINAL
                </Link>
                <h1 className="text-3xl font-bold text-white mb-2">New Strategy</h1>
                <p className="text-zinc-400">Guided setup for automated trading.</p>
            </div>

            <GlassCard className="p-8 min-h-[400px] relative overflow-hidden">
                {step === 1 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <h2 className="text-xl font-medium text-white">What is your goal?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button onClick={() => handleSelect('goal', 'accumulate')} className={`p-4 rounded-lg border text-left transition-all ${selection.goal === 'accumulate' ? 'bg-sky-500/20 border-sky-500 text-white' : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10'}`}>
                                <div className="font-bold mb-1">Accumulate Asset</div>
                                <div className="text-sm opacity-70">Buy slowly over time or on dips. Good for long-term holding.</div>
                            </button>
                            <button onClick={() => handleSelect('goal', 'grow')} className={`p-4 rounded-lg border text-left transition-all ${selection.goal === 'grow' ? 'bg-emerald-500/20 border-emerald-500 text-white' : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10'}`}>
                                <div className="font-bold mb-1">Grow Capital</div>
                                <div className="text-sm opacity-70">Trade volatility to increase USD balance. Higher risk.</div>
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <h2 className="text-xl font-medium text-white">When should we trade?</h2>
                        <div className="space-y-3">
                            {['Price Drops 5%', 'RSI is Low (Oversold)', 'News Sentiment is Positive', 'Regular Interval (DCA)'].map((trigger) => (
                                <button key={trigger} onClick={() => handleSelect('trigger', trigger)} className={`w-full p-4 rounded-lg border text-left transition-all flex justify-between items-center ${selection.trigger === trigger ? 'bg-indigo-500/20 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10'}`}>
                                    <span>{trigger}</span>
                                    {selection.trigger === trigger && <Check weight="bold" className="text-indigo-400" />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 text-center">
                        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check size={32} weight="bold" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Ready to Deploy</h2>
                        <div className="text-zinc-400 max-w-md mx-auto bg-white/5 p-4 rounded text-sm mb-6">
                            Strategy: <strong>{selection.goal === 'accumulate' ? 'Accumulator' : 'GrowthBot'}</strong><br />
                            Trigger: <strong>{selection.trigger || 'Standard'}</strong><br />
                            Risk: <strong>Low (Defensive)</strong>
                        </div>
                        <Button
                            className="w-full max-w-xs bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12"
                            onClick={() => {
                                // Real implementation: createStrategy.mutate({...})
                                alert("Strategy Authorized. Sending to Strategy Engine...");
                                window.location.href = "/dashboard";
                            }}
                        >
                            DEPLOY_STRATEGY
                        </Button>
                    </motion.div>
                )}

                <div className="absolute bottom-8 right-8 left-8 flex justify-between">
                    {step > 1 ? (
                        <Button variant="ghost" onClick={() => setStep(step - 1)} className="text-zinc-500 hover:text-white">BACK</Button>
                    ) : <div />}

                    {step < 3 && (
                        <Button
                            disabled={!selection[step === 1 ? 'goal' : 'trigger']}
                            onClick={() => setStep(step + 1)}
                            className="bg-white text-black hover:bg-zinc-200">
                            NEXT STEP <ArrowRight className="ml-2" />
                        </Button>
                    )}
                </div>
            </GlassCard>
        </div>
    )
}
