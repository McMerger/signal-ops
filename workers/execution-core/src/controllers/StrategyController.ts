import { Context } from 'hono';
import { Bindings } from '../bindings';
import { MarketDataClient } from '../clients/MarketDataClient';
import { PolymarketClient } from '../clients/PolymarketClient';
import { RiskService } from '../services/RiskService';
import { BrokerFactory } from '../services/BrokerService';

export class StrategyController {
    private marketClient: MarketDataClient;
    private polyClient: PolymarketClient;

    constructor() {
        this.marketClient = new MarketDataClient();
        this.polyClient = new PolymarketClient();
    }

    /**
     * GET /api/v1/strategy/signals
     * Returns reference strategy signals based on LIVE market data for a BASKET of assets.
     */
    async getSignals(c: Context<{ Bindings: Bindings }>) {
        try {
            // Mixed Basket: Crypto + Tech + Macro
            const basket = ["BTC", "ETH", "SOL", "NVDA", "TSLA", "AAPL"];

            // Evaluate all assets in parallel
            const signals = await Promise.all(basket.map(async (symbol) => {
                try {
                    // 1. Fetch Live Data for this symbol
                    const [quote, fundamentals, prediction] = await Promise.all([
                        this.marketClient.getQuote(symbol),
                        this.marketClient.getFundamentals(symbol),
                        this.polyClient.getMarketForAsset(symbol).catch(() => null)
                    ]);

                    // 2. Calculate Intrinsic Value (Graham)
                    const growthMultiplier = 8.5 + (2 * (fundamentals.growth_rate * 100));
                    const intrinsicValueRaw = (fundamentals.eps * growthMultiplier * 4.4) / fundamentals.aaa_corporate_bond_yield;

                    // Asset Class Awareness
                    let adjustedIntrinsic = intrinsicValueRaw;
                    if (fundamentals.asset_class === 'CRYPTO') {
                        // Dynamic Crypto Scaling based on relative price/book proxy
                        const scaling = (fundamentals.book_value / 10);
                        adjustedIntrinsic = intrinsicValueRaw * scaling;
                    }

                    const marginOfSafety = (adjustedIntrinsic - quote.price) / adjustedIntrinsic;

                    // 3. Determine Signal
                    let signal = "HOLD";
                    let strength = 0.5;
                    let reason = "Neutral Valuation";

                    const prob = prediction?.probability || 0;

                    if (marginOfSafety > 0.20 && prob > 0.60) {
                        signal = "STRONG BUY";
                        strength = 0.90;
                        reason = `Undervalued (${(marginOfSafety * 100).toFixed(1)}%) + High Conviction (${(prob * 100).toFixed(0)}%)`;
                    } else if (marginOfSafety > 0.10) {
                        signal = "ACCUMULATE";
                        strength = 0.75;
                        reason = `Undervalued (${(marginOfSafety * 100).toFixed(1)}%)`;
                    } else if (marginOfSafety < -0.20) {
                        signal = "SELL";
                        strength = 0.80;
                        reason = `Overvalued (${(marginOfSafety * 100).toFixed(1)}%)`;
                    }

                    return {
                        asset: symbol,
                        asset_class: fundamentals.asset_class,
                        signal: signal,
                        strength: strength,
                        current_price: quote.price,
                        intrinsic_value: Number(adjustedIntrinsic.toFixed(2)),
                        prediction_probability: prob,
                        reason: reason
                    };
                } catch (err: any) {
                    return {
                        asset: symbol,
                        signal: "ERROR",
                        reason: err.message
                    };
                }
            }));

            // Calculate Target Weights based on signals
            const targets: Record<string, number> = { "CASH": 0.10 };
            const buySignals = signals.filter(s => s.signal && (s.signal.includes("BUY") || s.signal === "ACCUMULATE"));

            if (buySignals.length > 0) {
                const weightPerAsset = 0.90 / buySignals.length;
                buySignals.forEach(s => {
                    if (s.asset) targets[s.asset] = weightPerAsset;
                });
            } else {
                targets["CASH"] = 1.0;
            }

            return c.json({
                strategy: "Reference: Value + Events (Multi-Asset Basket) [LIVE]",
                target_weights: targets,
                latest_signals: signals,
                timestamp: new Date().toISOString()
            });
        } catch (e: any) {
            return c.json({ error: e.message }, 500);
        }
    }

    /**
     * POST /api/v1/strategy/orders
     * Submit strategy-generated orders for execution with Risk Check and Persistence.
     */
    async submitOrder(c: Context<{ Bindings: Bindings }>) {
        try {
            const body = await c.req.json();
            const { asset, side, quantity, price, strategy_name } = body;

            if (!asset || !side || !quantity || !price) {
                return c.json({ error: "Missing required order fields: asset, side, quantity, price" }, 400);
            }

            // 1. Risk Check (Live)
            const riskService = new RiskService(); // In real app, inject this
            const riskCheck = await riskService.checkPositionLimit(
                {
                    accountId: "DEFAULT_ACCOUNT", // Single user logic for now
                    asset,
                    side,
                    quantity,
                    price
                },
                async (accountId: string, assetSymbol: string) => {
                    // Helper to get current exposure from DB
                    const pos = await c.env.SIGNAL_DB.prepare(
                        "SELECT quantity, current_price FROM positions WHERE symbol = ?"
                    ).bind(assetSymbol).first();

                    if (!pos) return 0;
                    return Math.abs((pos.quantity as number) * (pos.current_price as number));
                }
            );

            if (!riskCheck.approved) {
                return c.json({
                    status: "REJECTED_RISK",
                    reason: riskCheck.reason,
                    risk_data: riskCheck
                }, 400);
            }

            // 2. Broker Execution (New: Live Trading Path)
            const broker = BrokerFactory.getBroker("PAPER");
            const execution = await broker.placeOrder({
                symbol: asset,
                side,
                quantity,
                type: 'LIMIT',
                price
            });

            // 3. Persist Order & Execution to D1
            const orderId = execution.orderId;
            const now = new Date().toISOString();

            await c.env.SIGNAL_DB.prepare(`
                INSERT INTO orders (id, strategy_name, symbol, side, quantity, price, status, execution_data, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(
                orderId,
                strategy_name || "MANUAL",
                asset,
                side,
                quantity,
                price,
                execution.status,
                JSON.stringify(execution),
                now,
                now
            ).run();

            // 4. Return Success
            return c.json({
                status: "ACCEPTED",
                order_id: orderId,
                received_at: now,
                payload: body,
                risk_check: "PASSED",
                execution: execution
            }, 201);

        } catch (e: any) {
            console.error("Order submission failed:", e); // Log internal error
            return c.json({ error: "Order processing failed: " + e.message }, 500);
        }
    }
}
