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
    const [activeList, setActiveList] = useState<'crypto' | 'macro' | 'prediction'>('crypto');

    const watchlists = {
        crypto: {
            "BTC/USDT": { price: 94230.50, change: 2.5 },
            "ETH/USDT": { price: 4820.10, change: -1.2 },
            "SOL/USDT": { price: 145.20, change: 5.8 },
        },
        macro: {
            "SPX": { price: 5200.50, change: 0.8 },
            "NDX": { price: 18200.10, change: 1.2 },
            "GOLD": { price: 2450.20, change: -0.5 },
            "DXY": { price: 104.20, change: 0.1 },
        },
        prediction: {
            "TRUMP_WIN": { price: 0.52, change: 5.0 },
            "FED_CUT": { price: 0.75, change: -2.0 },
            "RECESSION_25": { price: 0.22, change: 1.0 },
        }
    };

    const [prices, setPrices] = useState(watchlists.crypto);

    useEffect(() => {
        setPrices(watchlists[activeList]);
    }, [activeList]);

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
        <div className="mb-6 space-y-2">
            <div className="flex gap-2">
                {(['crypto', 'macro', 'prediction'] as const).map((list) => (
                    <button
                        key={list}
                        onClick={() => setActiveList(list)}
                        className={`text-[10px] font-mono uppercase px-2 py-1 rounded border transition-colors ${activeList === list ? 'bg-white text-black border-white' : 'bg-transparent text-zinc-500 border-transparent hover:text-white'}`}
                    >
                        {list}
                    </button>
                ))}
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-white/5">
                {Object.entries(prices).map(([symbol, data]) => (
                    <TickerItem
                        key={symbol}
                        symbol={symbol}
                        price={data.price}
                        change={data.change}
                    />
                ))}
            </div>
        </div>
    );
}
