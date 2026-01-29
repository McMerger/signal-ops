"use client";

import { CorrelationMatrix } from "@/components/research/correlation-matrix";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Play, Save, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResearchPage() {
    return (
        <div className="container mx-auto p-8 space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground font-mono">
                            DATA<span className="text-amber-500">_WORKBENCH</span>
                        </h1>
                        <p className="text-zinc-400 font-mono mt-1">Alpha Research & Quantitative Analysis</p>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 space-y-6"
                >
                    {/* Notebook Cell 1 */}
                    <Card className="bg-card border-border overflow-hidden">
                        <div className="flex items-center justify-between p-2 bg-zinc-900/50 border-b border-white/5">
                            <span className="text-xs text-zinc-500 font-mono px-2">In [1]:</span>
                            <div className="flex gap-2">
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:text-emerald-500"><Play className="h-3 w-3" /></Button>
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:text-foreground"><Save className="h-3 w-3" /></Button>
                            </div>
                        </div>
                        <div className="p-4 font-mono text-sm">
                            <div className="text-pink-400">import</div> pandas <div className="text-pink-400">as</div> pd<br />
                            <div className="text-pink-400">import</div> numpy <div className="text-pink-400">as</div> np<br />
                            <br />
                            <div className="text-zinc-500"># Fetch OHLCV data for BTC-USDT</div><br />
                            df = api.get_market_data(<span className="text-emerald-400">"BTC-USDT"</span>, timeframe=<span className="text-emerald-400">"1h"</span>, limit=<span className="text-sky-400">1000</span>)<br />
                            df[<span className="text-emerald-400">"returns"</span>] = np.log(df.close / df.close.shift(<span className="text-sky-400">1</span>))<br />
                            df.head()
                        </div>
                        <div className="p-4 bg-zinc-900/30 border-t border-white/5 text-xs font-mono text-zinc-400">
                            <table className="w-full text-left opacity-70">
                                <thead>
                                    <tr className="border-b border-zinc-800">
                                        <th className="py-1">timestamp</th>
                                        <th>open</th>
                                        <th>high</th>
                                        <th>low</th>
                                        <th>close</th>
                                        <th>returns</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="py-1">2024-12-12 10:00</td>
                                        <td>98240.0</td>
                                        <td>98500.0</td>
                                        <td>98100.0</td>
                                        <td>98450.0</td>
                                        <td>NaN</td>
                                    </tr>
                                    <tr>
                                        <td className="py-1">2024-12-12 11:00</td>
                                        <td>98450.0</td>
                                        <td>99100.0</td>
                                        <td>98400.0</td>
                                        <td>99050.0</td>
                                        <td>0.0060</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    <Button variant="outline" className="w-full border-dashed border-zinc-300 text-zinc-500 hover:text-foreground hover:border-zinc-400">
                        <Plus className="h-4 w-4 mr-2" /> Add Code Cell
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-6"
                >
                    <CorrelationMatrix />

                    <Card className="p-6 bg-zinc-900/50 border-white/10 backdrop-blur-md">
                        <h3 className="text-sm font-medium text-zinc-400 font-mono mb-4">SAVED_NOTEBOOKS</h3>
                        <ul className="space-y-3 font-mono text-sm">
                            <li className="flex justify-between items-center group cursor-pointer">
                                <span className="text-zinc-300 group-hover:text-emerald-400 transition-colors">Vol_Clustering_Analysis.ipynb</span>
                                <span className="text-zinc-600 text-xs">2h ago</span>
                            </li>
                            <li className="flex justify-between items-center group cursor-pointer">
                                <span className="text-zinc-300 group-hover:text-emerald-400 transition-colors">Coinbase_Arb_Spread.ipynb</span>
                                <span className="text-zinc-600 text-xs">1d ago</span>
                            </li>
                            <li className="flex justify-between items-center group cursor-pointer">
                                <span className="text-zinc-300 group-hover:text-emerald-400 transition-colors">Sentiment_NLP_Test.ipynb</span>
                                <span className="text-zinc-600 text-xs">3d ago</span>
                            </li>
                        </ul>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
