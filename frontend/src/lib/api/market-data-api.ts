import { apiCall } from '../api-client';

export interface MarketDataResponse {
    symbol: string;
    exchange: string;
    price: number;
    bid: number;
    ask: number;
    volume_24h: number;
    high_24h: number;
    low_24h: number;
    price_change_24h: number;
    timestamp: string;
}

export interface BalanceResponse {
    exchange: string;
    balances: Record<string, {
        free: number;
        locked: number;
        total: number;
    }>;
    total_value_usd: number;
    timestamp: string;
}

export const marketDataApi = {
    // Get market data for a symbol
    getMarketData: async (exchange: string, symbol: string): Promise<MarketDataResponse> => {
        return apiCall<MarketDataResponse>({
            method: 'GET',
            url: `/api/v1/market/${exchange}/${symbol}`,
        });
    },

    // Get balance for an exchange
    getBalance: async (exchange: string): Promise<BalanceResponse> => {
        return apiCall<BalanceResponse>({
            method: 'GET',
            url: `/api/v1/balance/${exchange}`,
        });
    },
};
