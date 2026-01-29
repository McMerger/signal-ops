export interface Order {
    id: string;
    symbol: string;
    side: "BUY" | "SELL";
    type: "MARKET" | "LIMIT" | "STOP" | "STOP_LIMIT";
    price?: number;
    quantity: number;
    status: "OPEN" | "FILLED" | "CANCELLED" | "REJECTED";
    timestamp: string;
}

export interface CreateOrderDto {
    symbol: string;
    side: "BUY" | "SELL";
    type: "MARKET" | "LIMIT";
    price?: number;
    quantity: number;
}
