export interface Strategy {
    id: string;
    name: string;
    type: string;
    status: "active" | "paused" | "stopped";
    config: Record<string, any>;
    performance: {
        totalPnl: number;
        winRate: number;
        trades: number;
        sharpeRatio: number;
    };
    lastExecution?: string;
}

export interface CreateStrategyDto {
    name: string;
    type: string;
    config: Record<string, any>;
}
