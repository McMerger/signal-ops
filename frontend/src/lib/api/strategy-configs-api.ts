import { apiCall, apiClient } from '../api-client';

export interface StrategyCondition {
    metric: string;
    operator: '<' | '>' | '<=' | '>=' | '==' | '!=';
    threshold: number;
}

export interface StrategyRule {
    id: string;
    source: 'fundamental' | 'polymarket' | 'onchain' | 'technical' | 'news';
    conditions: StrategyCondition[];
}

export interface StrategyConfig {
    strategy: {
        name: string;
        assets: string[];
        rules: StrategyRule[];
        execution: {
            require_confirmations: number;
            position_size: number;
            action_mode: 'notify' | 'auto' | 'paper';
        };
    };
}

export const strategyConfigsApi = {
    // Upload new strategy YAML
    upload: async (yaml: string): Promise<{ success: boolean; strategy_name: string }> => {
        return apiClient.post('/api/v1/strategies/configs', yaml, {
            headers: { 'Content-Type': 'application/x-yaml' },
        });
    },

    // List all strategies
    list: async (): Promise<{ strategies: StrategyConfig[] }> => {
        return apiCall({
            method: 'GET',
            url: '/api/v1/strategies/configs',
        });
    },

    // Get specific strategy
    get: async (name: string): Promise<StrategyConfig> => {
        return apiCall({
            method: 'GET',
            url: `/api/v1/strategies/configs/${name}`,
        });
    },

    // Execute strategy
    execute: async (strategyName: string, asset: string): Promise<{
        decision: string;
        decision_log_id: string;
        confidence: number;
        triggers: any[];
    }> => {
        return apiCall({
            method: 'POST',
            url: '/api/v1/strategies/execute',
            data: { strategy_name: strategyName, asset },
        });
    },

    // Delete strategy
    delete: async (name: string): Promise<{ success: boolean }> => {
        return apiCall({
            method: 'DELETE',
            url: `/api/v1/strategies/configs/${name}`,
        });
    },
};
