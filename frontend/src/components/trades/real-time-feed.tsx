'use client';

import { useWebSocket } from '@/hooks/use-websocket';
import { useState } from 'react';
import { format } from 'date-fns';

interface Trade {
    id: string;
    asset: string;
    side: string;
    quantity: number;
    price: number;
    timestamp: string;
    status: string;
}

export function RealTimeTradeFeed() {
    const [trades, setTrades] = useState<Trade[]>([]);

    const getWsUrl = () => {
        // 1. Strict Production Override (Ignores Env Var)
        if (typeof window !== 'undefined' && (window.location.hostname === 'signal-ops.pages.dev' || window.location.hostname.endsWith('pages.dev'))) {
            return 'wss://execution-core.cortesmailles01.workers.dev/ws';
        }

        // 2. Explicit Localhost Detection
        if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
            return process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/ws';
        }
        // 3. Default to Production
        return 'wss://execution-core.cortesmailles01.workers.dev/ws';
    };

    const { isConnected } = useWebSocket({
        url: getWsUrl(),
        onMessage: (data) => {
            if (data.type === 'trade') {
                setTrades((prev) => [data.trade, ...prev].slice(0, 50));
            }
        },
        onError: (error) => {
            console.error('WebSocket error:', error);
        },
    });

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Live Trade Feed</h2>
                <div className="flex items-center space-x-2">
                    <div
                        className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'
                            }`}
                    />
                    <span className="text-sm text-gray-600">
                        {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
                {trades.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        Waiting for trades...
                    </div>
                ) : (
                    trades.map((trade) => (
                        <div
                            key={trade.id}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                        >
                            <div>
                                <p className="font-medium">{trade.asset}</p>
                                <p className="text-sm text-gray-600">
                                    {format(new Date(trade.timestamp), 'HH:mm:ss')}
                                </p>
                            </div>
                            <div className="text-right">
                                <p
                                    className={`font-semibold ${trade.side === 'BUY' ? 'text-green-600' : 'text-red-600'
                                        }`}
                                >
                                    {trade.side} {trade.quantity}
                                </p>
                                <p className="text-sm text-gray-600">${trade.price.toFixed(2)}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
