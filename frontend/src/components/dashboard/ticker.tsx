"use client";

import { ArrowUpRight, ArrowDownRight } from "@phosphor-icons/react";
import { useWebSocket } from "@/hooks/use-websocket";
import { useEffect, useState } from "react";

interface TickerItemProps {
    symbol: string;
    price: number;
    change: number;
}

function TickerItem({ symbol, price, change }: TickerItemProps) {
    const isPositive = change >= 0;
    return (
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5">
            <div className="flex flex-col">
                <span className="text-sm font-bold text-white">{symbol}</span>
                <span className="text-sm text-zinc-300">PERP</span>
            </div>
            <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-white">${price.toLocaleString()}</span>
                <span className={`text-sm flex items-center ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                    {isPositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                    {Math.abs(change)}%
                </span>
            </div>
        </div>
    );
}

export function Ticker() {
    const { lastMessage, subscribe } = useWebSocket({ url: 'ws://localhost:8080/ws' });
    const [prices, setPrices] = useState<Record<string, { price: number; change: number }>>({
        "BTC/USDT": { price: 94230.50, change: 2.5 },
        "ETH/USDT": { price: 4820.10, change: -1.2 },
        "SOL/USDT": { price: 145.20, change: 5.8 },
        "DOGE/USDT": { price: 0.12, change: 0.5 },
        "AVAX/USDT": { price: 35.40, change: 1.2 },
    });

    useEffect(() => {
        // Subscribe to market data for all symbols
        Object.keys(prices).forEach(symbol => {
            subscribe('market_data', symbol);
        });
    }, [subscribe]);

    useEffect(() => {
        if (lastMessage?.type === 'market_data' && lastMessage.data) {
            const { symbol, price, price_change_percent } = lastMessage.data;
            setPrices(prev => ({
                ...prev,
                [symbol]: {
                    price: price,
                    change: price_change_percent
                }
            }));
        }
    }, [lastMessage]);

    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-white/5 mb-6">
            {Object.entries(prices).map(([symbol, data]) => (
                <TickerItem
                    key={symbol}
                    symbol={symbol}
                    price={data.price}
                    change={data.change}
                />
            ))}
        </div>
    );
}
