"use client";

import { ApiKeyManager } from "@/components/settings/api-key-manager";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
    return (
        <div className="container mx-auto p-8 max-w-4xl space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold tracking-tight text-white font-mono">
                    SYSTEM<span className="text-zinc-500">_CONFIG</span>
                </h1>
                <p className="text-zinc-400 font-mono mt-1">Access Control & Environment Variables</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
            >
                <ApiKeyManager />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
                <Card className="p-6 bg-zinc-900/50 border-white/10 backdrop-blur-md">
                    <h3 className="text-sm font-medium text-zinc-400 font-mono mb-4">NOTIFICATION_CHANNELS</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-200 text-sm">Telegram Alerts</span>
                            <Switch checked={true} />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-200 text-sm">Email Digest</span>
                            <Switch checked={false} />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-200 text-sm">Slack Webhook</span>
                            <Switch checked={true} />
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-zinc-900/50 border-white/10 backdrop-blur-md">
                    <h3 className="text-sm font-medium text-zinc-400 font-mono mb-4">RISK_LIMITS</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-zinc-500">Max Drawdown (Daily)</span>
                            <span className="font-mono text-white">5.00%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-zinc-500">Max Leverage</span>
                            <span className="font-mono text-white">3.0x</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-zinc-500">Daily Loss Limit</span>
                            <span className="font-mono text-white">$5,000.00</span>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
