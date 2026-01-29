// Technical Indicators API Client
import { apiCall } from '@/lib/api-client';

export interface MACDResult {
    macd: number;
    signal: number;
    histogram: number;
}

export interface BollingerBands {
    upper: number;
    middle: number;
    lower: number;
}

export interface IndicatorSnapshot {
    symbol: string;
    rsi_14: number;
    sma_20: number;
    sma_50: number;
    ema_12: number;
    ema_26: number;
    macd: MACDResult;
    bollinger_bands: BollingerBands;
    last_price: number;
}

export interface RSIResponse {
    symbol: string;
    rsi: number;
    period: number;
    interpretation: 'OVERBOUGHT' | 'OVERSOLD' | 'NEUTRAL';
}

export interface MACDResponse {
    symbol: string;
    macd: MACDResult;
    signal: 'BULLISH' | 'BEARISH';
}

export const indicatorsApi = {
    // Get all indicators for a symbol
    getAllIndicators: (symbol: string) =>
        apiCall<IndicatorSnapshot>({
            url: `/api/v1/indicators/${symbol}`,
            method: 'GET',
        }),

    // Get RSI for a symbol
    getRSI: (symbol: string, period: number = 14) =>
        apiCall<RSIResponse>({
            url: `/api/v1/indicators/rsi/${symbol}?period=${period}`,
            method: 'GET',
        }),

    // Get MACD for a symbol
    getMACD: (symbol: string) =>
        apiCall<MACDResponse>({
            url: `/api/v1/indicators/macd/${symbol}`,
            method: 'GET',
        }),

    // Get SMA for a symbol
    getSMA: (symbol: string, period: number = 20) =>
        apiCall<{ symbol: string; sma: number; period: number; last_price: number; price_vs_sma: number }>({
            url: `/api/v1/indicators/sma/${symbol}?period=${period}`,
            method: 'GET',
        }),

    // Get EMA for a symbol
    getEMA: (symbol: string, period: number = 12) =>
        apiCall<{ symbol: string; ema: number; period: number; last_price: number }>({
            url: `/api/v1/indicators/ema/${symbol}?period=${period}`,
            method: 'GET',
        }),

    // Get Bollinger Bands for a symbol
    getBollingerBands: (symbol: string, period: number = 20) =>
        apiCall<{ symbol: string; bollinger_bands: BollingerBands; last_price: number; position: string }>({
            url: `/api/v1/indicators/bollinger/${symbol}?period=${period}`,
            method: 'GET',
        }),
};
