import { apiCall } from '../api-client';

export interface TriggerCondition {
    source: 'fundamental' | 'polymarket' | 'onchain' | 'technical' | 'news';
    metric: string;
    value: number;
    threshold_operator: string;
    threshold_value: number;
    status: 'PASS' | 'FAIL' | 'N/A';
    reasoning?: string;
}

export interface DecisionLog {
    id: string;
    timestamp: string;
    strategy_name: string;
    asset: string;
    decision: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    position_size?: number;
    execution_status: string;
    triggers: TriggerCondition[];
    metadata: Record<string, any>;
}

export interface DecisionListResponse {
    decisions: DecisionLog[];
    count: number;
}

export const decisionsApi = {
    // List decisions
    list: async (params?: {
        limit?: number;
        strategy?: string;
        asset?: string;
    }): Promise<DecisionListResponse> => {
        return apiCall<DecisionListResponse>({
            method: 'GET',
            url: '/api/v1/decisions',
            params,
        });
    },

    // Get specific decision
    getById: async (id: string): Promise<DecisionLog> => {
        return apiCall<DecisionLog>({
            method: 'GET',
            url: `/api/v1/decisions/${id}`,
        });
    },

    // Search decisions
    search: async (query: {
        strategy_name?: string;
        asset?: string;
        decision?: string;
        from_date?: string;
        to_date?: string;
    }): Promise<DecisionListResponse> => {
        return apiCall<DecisionListResponse>({
            method: 'GET',
            url: '/api/v1/decisions/search',
            params: query,
        });
    },
};
