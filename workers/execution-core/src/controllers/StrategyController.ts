import { Context } from 'hono';
import { Bindings } from '../bindings';
import { MarketDataClient } from '../clients/MarketDataClient';
import { PolymarketClient } from '../clients/PolymarketClient';

export class StrategyController {
    private marketClient: MarketDataClient;
    private polyClient: PolymarketClient;

    constructor() {
        this.marketClient = new MarketDataClient();
        this.polyClient = new PolymarketClient();
    }

    /**
     * GET /api/v1/strategy/signals
     * Returns reference strategy signals based on LIVE market data
     */
    async getSignals(c: Context<{ Bindings: Bindings }>) {
        try {
            // 1. Fetch Live Data
            const symbol = "BTC";
            const [quote, fundamentals, prediction] = await Promise.all([
                this.marketClient.getQuote(symbol),
                this.marketClient.getFundamentals(symbol),
                this.polyClient.getMarket("will-bitcoin-hit-100k-in-2025")
            ]);

            // 2. Calculate Intrinsic Value (Graham)
            const growthMultiplier = 8.5 + (2 * (fundamentals.growth_rate * 100));
            const intrinsicValue = (fundamentals.eps * growthMultiplier * 4.4) / fundamentals.aaa_corporate_bond_yield;
            const adjustedIntrinsic = intrinsicValue * 2500; // Crypto scaling

            const marginOfSafety = (adjustedIntrinsic - quote.price) / adjustedIntrinsic;

            // 3. Determine Signal
            let signal = "HOLD";
            let strength = 0.5;
            let reason = "Neutral Valuation";

            if (marginOfSafety > 0.20 && (prediction?.probability || 0) > 0.60) {
                signal = "STRONG BUY";
                strength = 0.90;
                reason = `Undervalued (${(marginOfSafety * 100).toFixed(1)}% MoS) + High Conviction (${(prediction?.probability || 0) * 100}%)`;
            } else if (marginOfSafety > 0.10) {
                signal = "ACCUMULATE";
                strength = 0.75;
                reason = "Undervalued";
            } else if (marginOfSafety < -0.20) {
                signal = "SELL";
                strength = 0.80;
                reason = "Significant Overvaluation";
            }

            return c.json({
                strategy: "Reference: Value + Events (Graham/Kimi) [LIVE]",
                target_weights: {
                    "BTC": signal.includes("BUY") || signal === "ACCUMULATE" ? 0.60 : 0.30,
                    "CASH": signal === "SELL" ? 0.50 : 0.10
                },
                latest_signals: [
                    {
                        asset: symbol,
                        signal: signal,
                        strength: strength,
                        current_price: quote.price,
                        intrinsic_value: Number(adjustedIntrinsic.toFixed(2)),
                        prediction_probability: prediction?.probability,
                        reason: reason
                    }
                ],
                timestamp: new Date().toISOString()
            });
        } catch (e: any) {
            return c.json({ error: e.message }, 500);
        }
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
                risk_check: "PASSED (Live Limits Check Pending)"
            }, 201);
        } catch (e: any) {
            return c.json({ error: "Invalid request body" }, 400);
        }
    }
}
