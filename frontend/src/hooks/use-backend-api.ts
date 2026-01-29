import { useQuery, useMutation } from '@tanstack/react-query';
import { polymarketApi } from '@/lib/api/polymarket-api';
import { indicatorsApi } from '@/lib/api/indicators-api';
import { strategyApi, auditApi } from '@/lib/api/strategy-evaluation-api';

export function usePolymarketMarkets() {
    return useQuery({
        queryKey: ['polymarket-markets'],
        queryFn: () => polymarketApi.getMarkets().then(res => res.markets),
        staleTime: 60000, // 1 minute
    });
}

export function usePolymarketSearch(query: string) {
    return useQuery({
        queryKey: ['polymarket-search', query],
        queryFn: () => polymarketApi.searchMarkets(query).then(res => res.markets),
        enabled: !!query,
        staleTime: 60000,
    });
}

export function useAllIndicators(symbol: string) {
    return useQuery({
        queryKey: ['indicators', symbol],
        queryFn: async () => {
            const data = await indicatorsApi.getAllIndicators(symbol);

            // Transform raw API data to the shape expected by the UI
            return {
                rsi: {
                    value: data.rsi_14,
                    signal: data.rsi_14 > 70 ? 'OVERBOUGHT' : data.rsi_14 < 30 ? 'OVERSOLD' : 'NEUTRAL'
                },
                macd: {
                    macd: data.macd.macd,
                    signal_line: data.macd.signal, // API calls it 'signal', UI expects 'signal_line'
                    histogram: data.macd.histogram,
                    signal: data.macd.histogram > 0 ? 'BUY' : 'SELL' // Simple derived signal
                },
                sma: {
                    value: data.sma_50,
                    trend: data.last_price > data.sma_50 ? 'UP' : 'DOWN'
                },
                ema: {
                    value: data.sma_20, // Using SMA_20 as proxy for EMA if EMA_20 isn't available, or map correctly
                    trend: data.last_price > data.sma_20 ? 'UP' : 'DOWN'
                },
                bollinger: {
                    upper: data.bollinger_bands.upper,
                    middle: data.bollinger_bands.middle,
                    lower: data.bollinger_bands.lower
                }
            };
        },
        enabled: !!symbol,
        staleTime: 30000, // 30 seconds
    });
}

export function useEvaluateStrategy(strategyId: string, asset: string) {
    return useMutation({
        mutationFn: () => strategyApi.evaluateStrategy(strategyId, asset),
    });
}

export function useDecisionLogs(strategyId?: string, limit: number = 50) {
    return useQuery({
        queryKey: ['decision-logs', strategyId, limit],
        queryFn: () => auditApi.getDecisions(strategyId, limit),
        staleTime: 10000, // 10 seconds
    });
}
