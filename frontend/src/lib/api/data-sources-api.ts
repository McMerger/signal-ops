import { apiCall } from '../api-client';

// DeFi Data Types
export interface DeFiProtocol {
    id: string;
    name: string;
    symbol: string;
    chain: string;
    tvl: number;
    tvl_change_24h: number;
    category: string;
}

export interface DeFiChain {
    name: string;
    tvl: number;
    protocols: number;
}

// Stock Data Types
export interface StockFundamentals {
    symbol: string;
    market_cap: number;
    pe_ratio: number;
    dividend_yield: number;
    earnings_per_share: number;
    revenue: number;
    net_income: number;
}

export interface StockQuote {
    symbol: string;
    price: number;
    change: number;
    change_percent: number;
    volume: number;
    market_cap: number;
    timestamp: string;
}

// Dune Analytics Types
export interface DuneExecutionResponse {
    execution_id: string;
    state: string;
}

export interface DuneResultsResponse {
    execution_id: string;
    state: string;
    result?: {
        rows: any[];
        metadata: {
            column_names: string[];
            result_set_bytes: number;
            total_row_count: number;
        };
    };
}

// SEC Filing Types
export interface SECFiling {
    accession_number: string;
    filing_date: string;
    report_date: string;
    form_type: string;
    company_name: string;
    cik: string;
    file_url: string;
}

// News Types
export interface NewsArticle {
    title: string;
    description: string;
    url: string;
    source: string;
    published_at: string;
    author?: string;
}

export const dataSourcesApi = {
    // DeFi - DeFiLlama
    defi: {
        getProtocols: async (): Promise<{ protocols: DeFiProtocol[]; count: number }> => {
            return apiCall<{ protocols: DeFiProtocol[]; count: number }>({
                method: 'GET',
                url: '/api/v1/data/defi/protocols',
            });
        },

        getProtocol: async (name: string): Promise<DeFiProtocol> => {
            return apiCall<DeFiProtocol>({
                method: 'GET',
                url: `/api/v1/data/defi/protocol/${name}`,
            });
        },

        getChains: async (): Promise<{ chains: DeFiChain[]; count: number }> => {
            return apiCall<{ chains: DeFiChain[]; count: number }>({
                method: 'GET',
                url: '/api/v1/data/defi/chains',
            });
        },

        getChain: async (name: string): Promise<DeFiChain> => {
            return apiCall<DeFiChain>({
                method: 'GET',
                url: `/api/v1/data/defi/chain/${name}`,
            });
        },
    },

    // Stock Data - Yahoo Finance
    stocks: {
        getFundamentals: async (symbol: string): Promise<StockFundamentals> => {
            return apiCall<StockFundamentals>({
                method: 'GET',
                url: `/api/v1/data/fundamentals/${symbol}`,
            });
        },

        getQuote: async (symbol: string): Promise<StockQuote> => {
            return apiCall<StockQuote>({
                method: 'GET',
                url: `/api/v1/data/quote/${symbol}`,
            });
        },
    },

    // Dune Analytics
    dune: {
        executeQuery: async (queryId: string): Promise<DuneExecutionResponse> => {
            return apiCall<DuneExecutionResponse>({
                method: 'POST',
                url: `/api/v1/data/dune/execute/${queryId}`,
            });
        },

        getResults: async (executionId: string): Promise<DuneResultsResponse> => {
            return apiCall<DuneResultsResponse>({
                method: 'GET',
                url: `/api/v1/data/dune/results/${executionId}`,
            });
        },
    },

    // SEC EDGAR
    sec: {
        getFilings: async (cik: string, params?: { form_type?: string; limit?: number }): Promise<SECFiling[]> => {
            return apiCall<SECFiling[]>({
                method: 'GET',
                url: `/api/v1/data/sec/filings/${cik}`,
                params,
            });
        },
    },

    // News API
    news: {
        getHeadlines: async (params?: { category?: string }): Promise<NewsArticle[]> => {
            return apiCall<NewsArticle[]>({
                method: 'GET',
                url: '/api/v1/data/news/headlines',
                params,
            });
        },

        search: async (query: string): Promise<NewsArticle[]> => {
            return apiCall<NewsArticle[]>({
                method: 'GET',
                url: `/api/v1/data/news/search/${encodeURIComponent(query)}`,
            });
        },

        getStockNews: async (symbol: string): Promise<NewsArticle[]> => {
            return apiCall<NewsArticle[]>({
                method: 'GET',
                url: `/api/v1/data/news/stock/${symbol}`,
            });
        },
    },
};
