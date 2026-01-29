import { useQuery, useMutation } from '@tanstack/react-query';
import { apiCall } from '@/lib/api-client';

// Types
export interface DeFiProtocol {
    id: string;
    name: string;
    symbol: string;
    tvl: number;
    chain: string;
    change_1h: number;
    change_1d: number;
    change_7d: number;
}

export interface StockFundamentals {
    symbol: string;
    pe_ratio: number;
    market_cap: number;
    dividend_yield: number;
    high_52_week: number;
    low_52_week: number;
}

export interface NewsArticle {
    source: { id: string; name: string };
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
}

export interface DuneResult {
    execution_id: string;
    query_id: number;
    state: string;
    data: any[];
}

// Hooks

export function useDeFiProtocols() {
    return useQuery({
        queryKey: ['defi-protocols'],
        queryFn: () => apiCall<{ protocols: DeFiProtocol[] }>({
            url: '/api/v1/data/defi/protocols',
            method: 'GET',
        }),
    });
}

export function useDeFiChains() {
    return useQuery({
        queryKey: ['defi-chains'],
        queryFn: () => apiCall<{ chains: any[] }>({
            url: '/api/v1/data/defi/chains',
            method: 'GET',
        }),
    });
}

export function useDeFiChain(name: string) {
    return useQuery({
        queryKey: ['defi-chain', name],
        queryFn: () => apiCall<any>({
            url: `/api/v1/data/defi/chain/${name}`,
            method: 'GET',
        }),
        enabled: !!name,
    });
}

export function useDeFiProtocol(name: string) {
    return useQuery({
        queryKey: ['defi-protocol', name],
        queryFn: () => apiCall<DeFiProtocol>({
            url: `/api/v1/data/defi/protocol/${name}`,
            method: 'GET',
        }),
        enabled: !!name,
    });
}

export function useStockFundamentals(symbol: string) {
    return useQuery({
        queryKey: ['stock-fundamentals', symbol],
        queryFn: () => apiCall<StockFundamentals>({
            url: `/api/v1/data/fundamentals/${symbol}`,
            method: 'GET',
        }),
        enabled: !!symbol,
    });
}

export function useStockQuote(symbol: string) {
    return useQuery({
        queryKey: ['stock-quote', symbol],
        queryFn: () => apiCall<any>({
            url: `/api/v1/data/quote/${symbol}`,
            method: 'GET',
        }),
        enabled: !!symbol,
        refetchInterval: 60000, // Refresh every minute
    });
}

export function useNewsHeadlines(category: string = 'business') {
    return useQuery({
        queryKey: ['news-headlines', category],
        queryFn: () => apiCall<{ articles: NewsArticle[] }>({
            url: `/api/v1/data/news/headlines?category=${category}`,
            method: 'GET',
        }),
    });
}

export function useNewsSearch(query: string) {
    return useQuery({
        queryKey: ['news-search', query],
        queryFn: () => apiCall<{ articles: NewsArticle[] }>({
            url: `/api/v1/data/news/search/${encodeURIComponent(query)}`,
            method: 'GET',
        }),
        enabled: !!query && query.length > 2,
    });
}

export function useStockNews(symbol: string) {
    return useQuery({
        queryKey: ['stock-news', symbol],
        queryFn: () => apiCall<{ articles: NewsArticle[] }>({
            url: `/api/v1/data/news/stock/${symbol}`,
            method: 'GET',
        }),
        enabled: !!symbol,
    });
}

export function useSECFilings(cik: string, formType?: string) {
    return useQuery({
        queryKey: ['sec-filings', cik, formType],
        queryFn: () => apiCall<{ filings: any[] }>({
            url: `/api/v1/data/sec/filings/${cik}${formType ? `?form_type=${formType}` : ''}`,
            method: 'GET',
        }),
        enabled: !!cik,
    });
}

export function useDuneQuery(queryId: number) {
    return useMutation({
        mutationFn: () => apiCall<{ execution_id: string }>({
            url: `/api/v1/data/dune/execute/${queryId}`,
            method: 'POST',
        }),
    });
}

export function useDuneResults(executionId: string) {
    return useQuery({
        queryKey: ['dune-results', executionId],
        queryFn: () => apiCall<DuneResult>({
            url: `/api/v1/data/dune/results/${executionId}`,
            method: 'GET',
        }),
        enabled: !!executionId,
    });
}
