import axios, { AxiosRequestConfig } from 'axios';

const getApiUrl = () => {
    // 1. Explicit Localhost Detection
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        return 'http://localhost:8080';
    }
    // 2. Env Var Override
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;

    // 3. Default to Production
    return 'https://execution-core.cortesmailles01.workers.dev';
};
const API_BASE_URL = getApiUrl();

// Python Strategy Evaluation Types
export interface PythonStrategyEvaluationRequest {
    symbol: string;
    exchange?: string;
}

export interface PythonStrategyEvaluationResponse {
    symbol: string;
    exchange: string;
    price: number;
    bid: number;
    ask: number;
    volume_24h: number;
    high_24h: number;
    low_24h: number;
    price_change_24h: number;
    timestamp: number;
}

// Backtest Types
export interface BacktestRequest {
    strategy: string;
    symbol: string;
    start_date: string;
    end_date: string;
}

export interface BacktestResponse {
    strategy: string;
    symbol: string;
    total_return: number;
    max_drawdown: number;
    sharpe_ratio: number;
    win_rate: number;
    total_trades: number;
    status: string;
}

// Agent Recommendation Types
export interface AgentRecommendation {
    agent_name: string;
    action: string;
    confidence: number;
    reasoning: string;
}

export interface AgentRecommendationsResponse {
    symbol: string;
    recommendations: AgentRecommendation[];
    consensus: string;
}

// API Client Functions
const apiCall = async <T>(config: AxiosRequestConfig): Promise<T> => {
    try {
        const response = await axios({
            ...config,
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
                ...config.headers,
            },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.error || error.message);
        }
        throw error;
    }
};

export const pythonStrategyApi = {
    // Evaluate strategy using Python engine
    evaluateStrategy: async (
        request: PythonStrategyEvaluationRequest
    ): Promise<PythonStrategyEvaluationResponse> => {
        return apiCall<PythonStrategyEvaluationResponse>({
            method: 'POST',
            url: '/api/v1/python/strategy/evaluate',
            data: request,
        });
    },

    // Run backtest
    runBacktest: async (request: BacktestRequest): Promise<BacktestResponse> => {
        return apiCall<BacktestResponse>({
            method: 'POST',
            url: '/api/v1/python/backtest/run',
            data: request,
        });
    },

    // Get agent recommendations
    getAgentRecommendations: async (
        symbol: string
    ): Promise<AgentRecommendationsResponse> => {
        return apiCall<AgentRecommendationsResponse>({
            method: 'GET',
            url: `/api/v1/python/agents/recommendations?symbol=${symbol}`,
        });
    },
};
