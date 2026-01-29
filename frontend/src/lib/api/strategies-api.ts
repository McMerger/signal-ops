import { apiCall } from '../api-client';
import { Strategy } from '@/types/strategy';

export interface StrategyResponse {
    name: string;
    description: string;
    config: Record<string, any>;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    created_by?: string;
    last_executed_at?: string;
    total_pnl?: number;
    win_rate?: number;
    total_trades?: number;
    metadata?: Record<string, any>;
}

export interface StrategyListResponse {
    strategies: StrategyResponse[];
    count: number;
}

export interface StrategyPerformanceResponse {
    strategy_name: string;
    total_pnl?: number;
    win_rate?: number;
    total_trades?: number;
    last_executed_at?: string;
    recent_trades: Array<{
        symbol: string;
        side: string;
        quantity: number;
        executed_price: number;
        pnl?: number;
        executed_at: string;
    }>;
}

export interface CreateStrategyRequest {
    name: string;
    description: string;
    config: Record<string, any>;
    is_active: boolean;
    created_by?: string;
}

export const strategiesApi = {
    // List all strategies
    list: async (activeOnly?: boolean): Promise<StrategyListResponse> => {
        const params = activeOnly ? { active: 'true' } : {};
        return apiCall<StrategyListResponse>({
            method: 'GET',
            url: '/api/v1/strategies',
            params,
        });
    },

    // Get strategy by name
    get: async (name: string): Promise<StrategyResponse> => {
        return apiCall<StrategyResponse>({
            method: 'GET',
            url: `/api/v1/strategies/${name}`,
        });
    },

    // Create or update strategy
    create: async (strategy: CreateStrategyRequest): Promise<{ success: boolean; name: string; message: string }> => {
        return apiCall({
            method: 'POST',
            url: '/api/v1/strategies',
            data: strategy,
        });
    },

    // Delete strategy
    delete: async (name: string): Promise<{ success: boolean; message: string }> => {
        return apiCall({
            method: 'DELETE',
            url: `/api/v1/strategies/${name}`,
        });
    },

    // Get strategy performance
    getPerformance: async (name: string): Promise<StrategyPerformanceResponse> => {
        return apiCall<StrategyPerformanceResponse>({
            method: 'GET',
            url: `/api/v1/strategies/${name}/performance`,
        });
    },
};
