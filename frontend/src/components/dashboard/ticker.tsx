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
    const getWsUrl = () => {
        // SCORCHED EARTH: Hardcoded Production URL
        return 'wss://execution-core.cortesmailles01.workers.dev/ws';
    };
    const { lastMessage, subscribe } = useWebSocket({ url: getWsUrl() });

    const [activeList, setActiveList] = useState<'crypto' | 'macro' | 'prediction'>('crypto');
    const [prices, setPrices] = useState<Record<string, { price: number; change: number }>>({});

    // Watchlist configuration (Symbols only)
    const watchlists = {
        crypto: ["BTC/USDT", "ETH/USDT", "SOL/USDT"],
        macro: ["SPX", "NDX", "GOLD", "DXY"],
        prediction: ["TRUMP_WIN", "FED_CUT", "RECESSION_25"]
    };

    // Filter prices based on active list
    const visiblePrices = Object.entries(prices).filter(([symbol]) =>
        watchlists[activeList].includes(symbol)
    );

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
                {visiblePrices.length === 0 ? (
                    <div className="text-xs text-zinc-500 font-mono py-2 px-1">WAITING_FOR_DATA...</div>
                ) : (
                    visiblePrices.map(([symbol, data]) => (
                        <TickerItem
                            key={symbol}
                            symbol={symbol}
                            price={data.price}
                            change={data.change}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
