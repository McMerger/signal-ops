import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Strategy, CreateStrategyDto } from "@/types/strategy";
import { strategiesApi, StrategyResponse } from "@/lib/api/strategies-api";

// Helper function to map backend response to frontend Strategy type
function mapStrategyResponse(response: StrategyResponse): Strategy {
    return {
        id: response.name, // Backend uses name as primary key
        name: response.name,
        type: response.config.type || "Unknown",
        status: response.is_active ? "active" : "paused",
        config: response.config,
        performance: {
            totalPnl: response.total_pnl || 0,
            winRate: response.win_rate || 0,
            trades: response.total_trades || 0,
            sharpeRatio: response.config.sharpe_ratio || 0,
        },
        lastExecution: response.last_executed_at,
    };
}

export function useStrategies(activeOnly?: boolean) {
    return useQuery({
        queryKey: ["strategies", activeOnly],
        queryFn: async () => {
            const response = await strategiesApi.list(activeOnly);
            return response.strategies.map(mapStrategyResponse);
        },
    });
}

export function useStrategy(id: string) {
    return useQuery({
        queryKey: ["strategies", id],
        queryFn: async () => {
            const response = await strategiesApi.get(id);
            return mapStrategyResponse(response);
        },
        enabled: !!id,
    });
}

export function useCreateStrategy() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (strategy: CreateStrategyDto & { description?: string; is_active?: boolean }) => {
            return strategiesApi.create({
                name: strategy.name,
                description: strategy.description || "",
                config: strategy.config,
                is_active: strategy.is_active ?? true,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["strategies"] });
        },
    });
}

export function useDeleteStrategy() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (name: string) => {
            return strategiesApi.delete(name);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["strategies"] });
        },
    });
}

export function useStrategyPerformance(name: string) {
    return useQuery({
        queryKey: ["strategies", name, "performance"],
        queryFn: async () => {
            return strategiesApi.getPerformance(name);
        },
        enabled: !!name,
    });
}

