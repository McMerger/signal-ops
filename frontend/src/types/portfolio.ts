export interface Position {
    symbol: string;
    side: "LONG" | "SHORT";
    size: number;
    entryPrice: number;
    markPrice: number;
    pnl: number;
    pnlPercent: number;
    leverage: number;
    margin: number;
}

export interface PortfolioSummary {
    totalBalance: number;
    unrealizedPnl: number;
    marginUsed: number;
    freeMargin: number;
    dailyPnl: number;
}
