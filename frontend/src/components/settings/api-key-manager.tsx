"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Eye, Trash2, ShieldAlert, Key } from "lucide-react";
import { useState } from "react";

const mockKeys = [
    { id: "key_1", name: "Binance Spot (Main)", prefix: "bn_spot_", lastUsed: "2 mins ago", status: "active" },
    { id: "key_2", name: "Coinbase Pro", prefix: "cb_pro_", lastUsed: "1 hour ago", status: "active" },
    { id: "key_3", name: "Internal Market Data", prefix: "sig_md_", lastUsed: "Live", status: "active" },
];

export function ApiKeyManager() {
    const [killSwitch, setKillSwitch] = useState(false);

    return (
        <div className="space-y-6">
            <Card className="p-6 bg-zinc-900/50 border-rose-500/20 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-rose-500/10 rounded-full border border-rose-500/50">
                        <ShieldAlert className="h-6 w-6 text-rose-500" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-white font-mono">EMERGENCY_KILL_SWITCH</h3>
                        <p className="text-zinc-400 text-sm">Immediately halts all Execution Core processes and cancels open orders.</p>
                    </div>
                    <button
                        onClick={() => setKillSwitch(!killSwitch)}
                        className={`px-6 py-2 rounded font-mono font-bold tracking-wider transition-all ${killSwitch
                                ? "bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.5)]"
                                : "bg-zinc-800 text-zinc-500 border border-zinc-700 hover:border-rose-500 hover:text-rose-500"
                            }`}
                    >
                        {killSwitch ? "ENGAGED" : "DISARMED"}
                    </button>
                </div>
            </Card>

            <Card className="p-6 bg-zinc-900/50 border-white/10 backdrop-blur-md">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-white font-mono flex items-center gap-2">
                        <Key className="h-5 w-5 text-zinc-400" />
                        API_KEY_VAULT
                    </h3>
                    <Button variant="outline" className="font-mono text-xs border-dashed border-zinc-600 hover:border-zinc-400">
                        + PROVISION_NEW_KEY
                    </Button>
                </div>

                <div className="space-y-4">
                    {mockKeys.map((key) => (
                        <div key={key.id} className="group p-4 bg-black/20 border border-white/5 rounded-lg hover:border-white/10 transition-colors flex justify-between items-center">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <span className="text-zinc-200 font-medium">{key.name}</span>
                                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-mono uppercase">
                                        {key.status}
                                    </span>
                                </div>
                                <div className="text-xs text-zinc-500 font-mono flex items-center gap-2">
                                    <span>{key.prefix}****************</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-xs text-zinc-600 font-mono mr-4">Last used: {key.lastUsed}</span>
                                <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-white/5 text-zinc-400">
                                    <Copy className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-white/5 text-zinc-400">
                                    <Trash2 className="h-4 w-4 hover:text-rose-500" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
