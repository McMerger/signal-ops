// Strategy Evaluation & Audit API Client
import { apiCall } from '@/lib/api-client';

export interface TriggerResult {
    rule_id: string;
    source: string;
    metric: string;
    value: number;
    threshold: number;
    operator: string;
    status: 'PASS' | 'FAIL';
    weight: number;
}

export interface StrategyDecision {
    timestamp: string;
    strategy_id: string;
    asset: string;
    decision: 'BUY' | 'SELL' | 'HOLD' | 'BLOCK';
    triggers_evaluated: TriggerResult[];
    triggers_pass: number;
    triggers_fail: number;
    confidence: number;
    reasoning: Record<string, string>;
    final_action: 'APPROVED' | 'BLOCKED' | 'MANUAL_REVIEW';
}

export interface DecisionLog {
    id: string;
    timestamp: string;
    strategy_id: string;
    strategy_name: string;
    asset: string;
    decision: string;
    triggers_evaluated: TriggerResult[];
    triggers_pass: number;
    triggers_fail: number;
    confidence: number;
    reasoning: Record<string, string>;
    final_action: string;
    execution_id?: string;
}

export interface PerformanceMetrics {
    strategy_id: string;
    strategy_name: string;
    total_trades: number;
    winning_trades: number;
    losing_trades: number;
    win_rate: number;
    total_pnl: number;
    average_pnl: number;
    max_drawdown: number;
    sharpe_ratio: number;
    profit_factor: number;
    last_executed: string;
    avg_confidence: number;
    blocked_trades: number;
}

export interface BacktestRequest {
    strategy_id: string;
    assets: string[];
    start_date: string;
    end_date: string;
    initial_capital: number;
}

export interface BacktestResult {
    strategy_id: string;
    start_date: string;
    end_date: string;
    initial_capital: number;
    final_capital: number;
    total_return: number;
    total_trades: number;
    win_rate: number;
    max_drawdown: number;
    sharpe_ratio: number;
    trades: any[];
}

export const strategyApi = {
    // Evaluate strategy on current market data
    evaluateStrategy: (strategyId: string, asset: string) =>
        apiCall<StrategyDecision>({
            url: `/api/v1/strategy/evaluate/${strategyId}?asset=${asset}`,
            method: 'POST',
        }),

    // Run backtest
    runBacktest: (request: BacktestRequest) =>
        apiCall<BacktestResult>({
            url: '/api/v1/backtest/run',
            method: 'POST',
            data: request,
        }),
};

export const auditApi = {
    // Get decision logs with optional filters
    getDecisions: (strategyId?: string, limit: number = 50) =>
        apiCall<{ decisions: DecisionLog[]; count: number }>({
            url: `/api/v1/audit/decisions?${strategyId ? `strategy=${strategyId}&` : ''}limit=${limit}`,
            method: 'GET',
        }),

    // Get specific decision by ID
    getDecision: (logId: string) =>
        apiCall<DecisionLog>({
            url: `/api/v1/audit/decision/${logId}`,
            method: 'GET',
        }),

    // Get all blocked decisions
    getBlockedDecisions: (limit: number = 50) =>
        apiCall<{ blocked_decisions: DecisionLog[]; count: number }>({
            url: `/api/v1/audit/blocked?limit=${limit}`,
            method: 'GET',
        }),

    // Get human-readable explanation of a decision
    explainDecision: (logId: string) =>
        apiCall<string>({
            url: `/api/v1/audit/explain/${logId}`,
            method: 'GET',
        }),
};

export const performanceApi = {
    // Get performance metrics for a strategy
    getStrategyPerformance: (strategyId: string) =>
        apiCall<PerformanceMetrics>({
            url: `/api/v1/performance/strategy/${strategyId}`,
            method: 'GET',
        }),

    // Get performance overview for all strategies
    getPerformanceOverview: () =>
        apiCall<any>({
            url: '/api/v1/performance/overview',
            method: 'GET',
        }),
};
