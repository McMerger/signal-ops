import { useQuery } from "@tanstack/react-query";
import { Position, PortfolioSummary } from "@/types/portfolio";
import { portfolioApi, PositionResponse } from "@/lib/api/portfolio-api";

// Helper function to map backend response to frontend Position type
function mapPositionResponse(response: PositionResponse): Position {
    return {
        symbol: response.symbol,
        side: response.quantity > 0 ? "LONG" : "SHORT",
        size: Math.abs(response.quantity),
        entryPrice: response.average_entry_price,
        markPrice: response.current_price || response.average_entry_price,
        pnl: response.unrealized_pnl || 0,
        pnlPercent: response.current_price && response.average_entry_price
            ? ((response.current_price - response.average_entry_price) / response.average_entry_price) * 100
            : 0,
        leverage: 1, // Default, can be enhanced when backend provides this
        margin: response.average_entry_price * Math.abs(response.quantity),
    };
}

export function usePortfolio() {
    return useQuery({
        queryKey: ["portfolio"],
        queryFn: async () => {
            try {
                const response = await portfolioApi.getPositions();
                const positions = response.positions.map(mapPositionResponse);

                const summary: PortfolioSummary = {
                    totalBalance: response.total_pnl + 100000, // Base capital + PnL
                    unrealizedPnl: response.total_unrealized_pnl,
                    marginUsed: positions.reduce((sum, p) => sum + p.margin, 0),
                    freeMargin: 100000 - positions.reduce((sum, p) => sum + p.margin, 0),
                    dailyPnl: 0, // Will be fetched from performance endpoint
                };

                return { positions, summary };
            } catch (error) {
                console.warn("Failed to fetch positions, falling back to balances:", error);

                // Fallback: Fetch balances from known exchanges
                const exchanges = ["binance", "coinbase", "kraken"];
                let totalBalance = 0;

                for (const exchange of exchanges) {
                    try {
                        const balance = await portfolioApi.getExchangeBalance(exchange);
                        if (balance && balance.total_value_usd) {
                            totalBalance += balance.total_value_usd;
                        }
                    } catch (e) {
                        console.warn(`Failed to fetch balance for ${exchange}`, e);
                    }
                }

                // Return empty positions but valid balance
                return {
                    positions: [],
                    summary: {
                        totalBalance: totalBalance > 0 ? totalBalance : 100000, // Default if all fail
                        unrealizedPnl: 0,
                        marginUsed: 0,
                        freeMargin: totalBalance > 0 ? totalBalance : 100000,
                        dailyPnl: 0,
                    }
                };
            }
        },
    });
}

export function useRiskMetrics() {
    return useQuery({
        queryKey: ["portfolio", "risk"],
        queryFn: async () => {
            return portfolioApi.getRiskMetrics();
        },
    });
}

export function usePnL(period?: string) {
    return useQuery({
        queryKey: ["portfolio", "pnl", period],
        queryFn: async () => {
            return portfolioApi.getPnL(period);
        },
    });
}

