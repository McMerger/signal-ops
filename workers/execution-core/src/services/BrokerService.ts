export interface OrderRequest {
    symbol: string;
    side: 'BUY' | 'SELL';
    quantity: number;
    price?: number; // Optional for market orders
    type: 'MARKET' | 'LIMIT';
}

export interface ExecutionResult {
    orderId: string;
    status: 'FILLED' | 'REJECTED' | 'PENDING';
    filledPrice: number;
    filledQuantity: number;
    timestamp: string;
    brokerOrderId?: string;
    reason?: string;
}

export interface IBroker {
    placeOrder(order: OrderRequest): Promise<ExecutionResult>;
    getBuyingPower(): Promise<number>;
}

export class PaperBroker implements IBroker {
    async placeOrder(order: OrderRequest): Promise<ExecutionResult> {
        // Simulate network latency
        await new Promise(resolve => setTimeout(resolve, 50));

        // Simulate execution logic
        const executedPrice = order.price || 100.00; // Mock price if market

        return {
            orderId: crypto.randomUUID(),
            status: 'FILLED',
            filledPrice: executedPrice,
            filledQuantity: order.quantity,
            timestamp: new Date().toISOString(),
            brokerOrderId: `PAPER-${crypto.randomUUID().split('-')[0]}`,
            reason: "Simulated Fill"
        };
    }

    async getBuyingPower(): Promise<number> {
        return 100000; // Mock $100k buying power
    }
}

export class BrokerFactory {
    static getBroker(env: string): IBroker {
        if (env === 'LIVE') {
            throw new Error("Live broker not yet configured. Use PAPER mode.");
        }
        return new PaperBroker();
    }
}
