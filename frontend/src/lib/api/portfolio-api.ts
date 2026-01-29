import { apiCall } from '../api-client';

export interface PositionResponse {
    symbol: string;
    strategy_name: string;
    quantity: number;
    average_entry_price: number;
    current_price?: number;
    market_value?: number;
    unrealized_pnl?: number;
    realized_pnl?: number;
    opened_at: string;
    last_updated: string;
}

export interface PositionsResponse {
    positions: PositionResponse[];
    count: number;
    total_unrealized_pnl: number;
    total_realized_pnl: number;
    total_pnl: number;
}

export interface PortfolioPerformanceResponse {
    total_trades: number;
    winning_trades: number;
    losing_trades: number;
    win_rate: number;
    total_pnl: number;
    average_pnl_per_trade: number;
    max_win: number;
    max_loss: number;
    strategy_performance: Array<{
        strategy_name: string;
        trades: number;
        pnl: number;
    }>;
}

export interface RiskMetricsResponse {
    total_exposure: number;
    open_positions: number;
    var_95_30d: number;
    risk_events: Array<{
        event_type: string;
        severity: string;
        description: string;
        timestamp: string;
    }>;
    risk_level: string;
}

export interface PnLResponse {
    period: string;
    daily_pnl: Array<{
        date: string;
        daily_pnl: number;
        cumulative_pnl: number;
        trades: number;
    }>;
    cumulative_pnl: number;
}

export interface BalancesResponse {
    exchanges: Record<string, {
        balances: Record<string, {
            free: number;
            locked: number;
            total: number;
        }>;
        total_value_usd: number;
        timestamp: string;
        error?: string;
    }>;
    total_value_usd: number;
    timestamp: string;
}

export const portfolioApi = {
    // Get open positions
    getPositions: async (): Promise<PositionsResponse> => {
        return apiCall<PositionsResponse>({
            method: 'GET',
            url: '/api/v1/portfolio/positions',
        });
    },

    // Get portfolio performance
    getPerformance: async (): Promise<PortfolioPerformanceResponse> => {
        return apiCall<PortfolioPerformanceResponse>({
            method: 'GET',
            url: '/api/v1/portfolio/performance',
        });
    },

    // Get risk metrics
    getRiskMetrics: async (): Promise<RiskMetricsResponse> => {
        return apiCall<RiskMetricsResponse>({
            method: 'GET',
            url: '/api/v1/portfolio/risk',
        });
    },

    // Get PnL data
    getPnL: async (period?: string): Promise<PnLResponse> => {
        const params = period ? { period } : {};
        return apiCall<PnLResponse>({
            method: 'GET',
            url: '/api/v1/portfolio/pnl',
            params,
        });
    },

    // Get all exchange balances
    getBalances: async (): Promise<BalancesResponse> => {
        return apiCall<BalancesResponse>({
            method: 'GET',
            url: '/api/v1/portfolio/balances',
        });
    },

    // Get specific exchange balance
    getExchangeBalance: async (exchange: string): Promise<any> => {
        return apiCall({
            method: 'GET',
            url: `/api/v1/balance/${exchange}`,
        });
    },
};
