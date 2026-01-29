import { useQuery, useMutation } from '@tanstack/react-query';
import {
    pythonStrategyApi,
    type PythonStrategyEvaluationRequest,
    type BacktestRequest,
} from '@/lib/api/python-strategy-api';

// Hook for Python strategy evaluation
export function usePythonStrategyEvaluation(
    symbol: string,
    exchange?: string,
    enabled: boolean = true
) {
    return useQuery({
        queryKey: ['python-strategy', symbol, exchange],
        queryFn: () =>
            pythonStrategyApi.evaluateStrategy({ symbol, exchange }),
        enabled,
        staleTime: 30000, // 30 seconds
    });
}

// Hook for running backtests
export function useRunBacktest() {
    return useMutation({
        mutationFn: (request: BacktestRequest) =>
            pythonStrategyApi.runBacktest(request),
    });
}

// Hook for agent recommendations
export function useAgentRecommendations(symbol: string, enabled: boolean = true) {
    return useQuery({
        queryKey: ['agent-recommendations', symbol],
        queryFn: () => pythonStrategyApi.getAgentRecommendations(symbol),
        enabled,
        staleTime: 60000, // 1 minute
    });
}
