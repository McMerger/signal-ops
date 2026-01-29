import { Context } from 'hono';
import { Bindings } from '../bindings';

export class StrategyController {
    /**
     * GET /api/v1/strategy/signals
     * Returns reference strategy signals and target weights
     */
    async getSignals(c: Context<{ Bindings: Bindings }>) {
        // Mock data for reference strategy
        return c.json({
            strategy: "Reference: Value + Events (Graham/Kimi)",
            target_weights: {
                "BTC": 0.40,
                "ETH": 0.30,
                "SOL": 0.10,
                "MSTR": 0.05,
                "COIN": 0.05,
                "CASH": 0.10
            },
            latest_signals: [
                {
                    asset: "BTC",
                    signal: "ACCUMULATE",
                    strength: 0.85,
                    reason: "Price < Intrinsic Value (20% Discount) + Positive Flow"
                },
                {
                    asset: "ETH",
                    signal: "HOLD",
                    strength: 0.5,
                    reason: "Neutral Flow"
                }
            ],
            timestamp: new Date().toISOString()
        });
    }

    /**
     * POST /api/v1/strategy/orders
     * Submit strategy-generated orders for execution
     */
    async submitOrder(c: Context<{ Bindings: Bindings }>) {
        try {
            const body = await c.req.json();

            // In a real implementation:
            // 1. Validate body schema
            // 2. check against RiskService (limits)
            // 3. Write to D1 'orders' table

            return c.json({
                status: "ACCEPTED",
                order_id: crypto.randomUUID(),
                received_at: new Date().toISOString(),
                payload: body,
                risk_check: "PASSED (Mock)"
            }, 201);
        } catch (e: any) {
            return c.json({ error: "Invalid request body" }, 400);
        }
    }
}
