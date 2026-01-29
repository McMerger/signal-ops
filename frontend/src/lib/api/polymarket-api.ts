// Polymarket API Client
import { apiCall } from '@/lib/api-client';

export interface PolymarketMarket {
    id: string;
    question: string;
    description: string;
    active: boolean;
    closed: boolean;
    outcomes: string[];
    outcome_prices: number[];
    volume: number;
    liquidity: number;
    category: string;
    tags: string[];
}

export interface MarketOdds {
    market_id: string;
    question: string;
    outcomes: Record<string, number>;
    yes_probability: number;
    no_probability: number;
    last_updated: string;
    volume_24h: number;
}

export interface RiskCheckResult {
    market_id: string;
    high_risk: boolean;
    probability: number;
    threshold: number;
    recommendation: 'BLOCK_TRADE' | 'PROCEED';
}

export const polymarketApi = {
    // Get all active markets
    getMarkets: () =>
        apiCall<{ markets: PolymarketMarket[]; count: number }>({
            url: '/api/v1/data/polymarket/markets',
            method: 'GET',
        }),

    // Get specific market by ID
    getMarket: (marketId: string) =>
        apiCall<PolymarketMarket>({
            url: `/api/v1/data/polymarket/market/${marketId}`,
            method: 'GET',
        }),

    // Search markets by keyword
    searchMarkets: (query: string) =>
        apiCall<{ markets: PolymarketMarket[]; count: number; query: string }>({
            url: `/api/v1/data/polymarket/search?q=${encodeURIComponent(query)}`,
            method: 'GET',
        }),

    // Get markets by category
    getMarketsByCategory: (category: string) =>
        apiCall<{ markets: PolymarketMarket[]; count: number; category: string }>({
            url: `/api/v1/data/polymarket/category/${category}`,
            method: 'GET',
        }),

    // Get current odds for a market
    getMarketOdds: (marketId: string) =>
        apiCall<MarketOdds>({
            url: `/api/v1/data/polymarket/odds/${marketId}`,
            method: 'GET',
        }),

    // Check if market indicates high risk
    checkRisk: (marketId: string, threshold: number = 0.70) =>
        apiCall<RiskCheckResult>({
            url: `/api/v1/data/polymarket/risk-check/${marketId}?threshold=${threshold}`,
            method: 'GET',
        }),
};
