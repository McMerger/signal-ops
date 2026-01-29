"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useOrders, useCreateOrder } from "@/hooks/use-orders";
import { cn } from "@/lib/utils";
import { Plus, Trash } from "@phosphor-icons/react";
import { useState } from "react";

export default function OrdersPage() {
    const { data: orders, isLoading } = useOrders();
    const createOrder = useCreateOrder();

    const [side, setSide] = useState<"BUY" | "SELL">("BUY");
    const [type, setType] = useState<"MARKET" | "LIMIT">("LIMIT");
    const [exchange, setExchange] = useState<string>("binance");

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">Orders</h1>
                <p className="text-zinc-300">Manage open orders and view execution history.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <GlassCard className="p-6 h-fit">
                    <h3 className="text-lg font-medium text-white mb-4">Place Order</h3>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-lg">
                            <button
                                onClick={() => setSide("BUY")}
                                className={cn(
                                    "py-2 text-sm font-medium rounded-md transition-all",
                                    side === "BUY" ? "bg-emerald-500 text-white shadow-lg" : "text-zinc-300 hover:text-white"
                                )}
                            >
                                Buy
                            </button>
                            <button
                                onClick={() => setSide("SELL")}
                                className={cn(
                                    "py-2 text-sm font-medium rounded-md transition-all",
                                    side === "SELL" ? "bg-rose-500 text-white shadow-lg" : "text-zinc-300 hover:text-white"
                                )}
                            >
                                Sell
                            </button>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Exchange</label>
                            <div className="flex gap-2">
                                {["binance", "coinbase", "kraken"].map((ex) => (
                                    <button
                                        key={ex}
                                        onClick={() => setExchange(ex)}
                                        className={cn(
                                            "flex-1 py-1.5 text-sm font-medium rounded-md border transition-all capitalize",
                                            exchange === ex
                                                ? "bg-sky-500/10 border-sky-500/50 text-sky-400"
                                                : "bg-white/5 border-white/10 text-zinc-300 hover:text-zinc-300"
                                        )}
                                    >
                                        {ex}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Order Type</label>
                            <div className="flex gap-2">
                                <Button
                                    variant={type === "LIMIT" ? "secondary" : "ghost"}
                                    size="sm"
                                    onClick={() => setType("LIMIT")}
                                    className="flex-1"
                                >
                                    Limit
                                </Button>
                                <Button
                                    variant={type === "MARKET" ? "secondary" : "ghost"}
                                    size="sm"
                                    onClick={() => setType("MARKET")}
                                    className="flex-1"
                                >
                                    Market
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Symbol</label>
                            <input
                                type="text"
                                defaultValue="BTCUSDT"
                                className="w-full h-9 rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white placeholder-zinc-500 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/50"
                            />
                        </div>

                        {type === "LIMIT" && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Price (USDT)</label>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    className="w-full h-9 rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white placeholder-zinc-500 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/50"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Quantity</label>
                            <input
                                type="number"
                                placeholder="0.00"
                                className="w-full h-9 rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white placeholder-zinc-500 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/50"
                            />
                        </div>

                        <Button
                            className={cn(
                                "w-full mt-4",
                                side === "BUY" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-rose-500 hover:bg-rose-600"
                            )}
                            onClick={() => createOrder.mutate({
                                symbol: "BTCUSDT", // TODO: Get from input
                                side,
                                type,
                                quantity: 0.1, // TODO: Get from input
                                price: type === "LIMIT" ? 91000 : undefined, // TODO: Get from input
                                exchange
                            })}
                            disabled={createOrder.isPending}
                        >
                            {createOrder.isPending ? "Placing Order..." : (side === "BUY" ? "Buy / Long" : "Sell / Short")}
                        </Button>
                    </div>
                </GlassCard>

                <div className="lg:col-span-2 space-y-6">
                    <GlassCard className="overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-lg font-medium text-white">Active Orders</h3>
                            <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white">
                                Cancel All
                            </Button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white/5 text-zinc-300">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">Time</th>
                                        <th className="px-6 py-3 font-medium">Symbol</th>
                                        <th className="px-6 py-3 font-medium">Type</th>
                                        <th className="px-6 py-3 font-medium">Side</th>
                                        <th className="px-6 py-3 font-medium text-right">Price</th>
                                        <th className="px-6 py-3 font-medium text-right">Amount</th>
                                        <th className="px-6 py-3 font-medium text-right">Filled</th>
                                        <th className="px-6 py-3 font-medium text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-zinc-300">
                                    {orders?.filter(o => o.status === "OPEN").map((order) => (
                                        <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 text-zinc-300">{new Date(order.timestamp).toLocaleTimeString()}</td>
                                            <td className="px-6 py-4 font-medium text-white">{order.symbol}</td>
                                            <td className="px-6 py-4 text-zinc-300">{order.type}</td>
                                            <td className="px-6 py-4">
                                                <span className={cn(
                                                    "font-medium",
                                                    order.side === "BUY" ? "text-emerald-400" : "text-rose-400"
                                                )}>
                                                    {order.side}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">{order.price ? `$${order.price.toLocaleString()}` : "Market"}</td>
                                            <td className="px-6 py-4 text-right">{order.quantity}</td>
                                            <td className="px-6 py-4 text-right">0.00</td>
                                            <td className="px-6 py-4 text-right">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-300 hover:text-rose-400 hover:bg-rose-500/10">
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {!orders?.some(o => o.status === "OPEN") && (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-8 text-center text-zinc-300">
                                                No open orders
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>

                    <GlassCard className="overflow-hidden">
                        <div className="p-6 border-b border-white/5">
                            <h3 className="text-lg font-medium text-white">Order History</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white/5 text-zinc-300">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">Time</th>
                                        <th className="px-6 py-3 font-medium">Symbol</th>
                                        <th className="px-6 py-3 font-medium">Side</th>
                                        <th className="px-6 py-3 font-medium text-right">Price</th>
                                        <th className="px-6 py-3 font-medium text-right">Amount</th>
                                        <th className="px-6 py-3 font-medium text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-zinc-300">
                                    {orders?.filter(o => o.status !== "OPEN").map((order) => (
                                        <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 text-zinc-300">{new Date(order.timestamp).toLocaleTimeString()}</td>
                                            <td className="px-6 py-4 font-medium text-white">{order.symbol}</td>
                                            <td className="px-6 py-4">
                                                <span className={cn(
                                                    "font-medium",
                                                    order.side === "BUY" ? "text-emerald-400" : "text-rose-400"
                                                )}>
                                                    {order.side}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">{order.price ? `$${order.price.toLocaleString()}` : "Market"}</td>
                                            <td className="px-6 py-4 text-right">{order.quantity}</td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={cn(
                                                    "rounded px-2 py-1 text-sm font-medium",
                                                    order.status === "FILLED" ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-500/10 text-zinc-300"
                                                )}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
