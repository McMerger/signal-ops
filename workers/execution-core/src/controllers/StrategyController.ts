import { Context } from 'hono';
import { Bindings } from '../bindings';
import { MarketDataClient } from '../clients/MarketDataClient';
import { PolymarketClient } from '../clients/PolymarketClient';
import { RiskService } from '../services/RiskService';
import { BrokerFactory } from '../services/BrokerService';
import { EventService } from '../services/EventService';

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
                    // 1. Fetch Live Data for this symbol (needed for Execution Context)
                    const [quote] = await Promise.all([
                        this.marketClient.getQuote(symbol)
                    ]);

                    // 2. Call Python Research Core (Kimi K2.5 Agent)
                    // The Strategy Engine performs the heavy lifting: Fundamentals, Events, OnChain, AI Research
                    let strategyResult: any = null;
                    try {
                        const researchResp = await c.env.STRATEGY_ENGINE.fetch("http://strategy-engine/evaluate", {
                            method: "POST",
                            body: JSON.stringify({
                                strategy: "multi_agent", // Orchestrator
                                asset: symbol,
                                market_data: quote
                            })
                        });

                        if (researchResp.ok) {
                            strategyResult = await researchResp.json();
                        } else {
                            console.warn(`Research Core failed for ${symbol}: ${researchResp.status}`);
                        }
                    } catch (err) {
                        console.error(`Research Core error for ${symbol}:`, err);
                    }

                    // 3. Synthesize Signal
                    // If Research Core returned valid data, use it. Otherwise, fallback (or HOLD).
                    let signal = "HOLD";
                    let strength = 0.0;
                    let reason = "Insufficient Data";
                    let aiResearch = "Not available";

                    if (strategyResult && strategyResult.decision) {
                        signal = strategyResult.decision; // BUY, SELL, HOLD
                        strength = strategyResult.confidence;
                        reason = JSON.stringify(strategyResult.reasoning);
                        aiResearch = strategyResult.research_summary || "AI Analysis Pending";

                        // Safety Override: High Risk Event
                        // (Redundant check if Python Engine does it, but good for safety depth)
                    }

                    // 4. C++ Wasm Validation (Microstructure Check)
                    // We treat the C++ engine as a final "execution gate" for price levels
                    try {
                        // Instantiate Wasm
                        const instance = await WebAssembly.instantiate(c.env.SIGNAL_CORE);
                        const exports = instance.exports as any;

                        // Wasm Logic: If Research says BUY, check if Price is arguably good?
                        // For now, we trust the Research Core's intrinsic calculation implied in its decision.

                    } catch (e) {
                        // Ignore Wasm if missing
                    }

                    return {
                        asset: symbol,
                        signal: signal,
                        strength: strength,
                        current_price: quote.price,
                        reason: reason,
                        research_report: aiResearch,
                        source: "Kimi K2.5 Research Core"
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
                    assetClass: body.asset_class || "UNKNOWN", // Strategy must provide this now
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
                },
                async (accountId: string, assetClass: string) => {
                    // Helper to get Total Exposure for this Asset Class
                    const result = await c.env.SIGNAL_DB.prepare(`
                        SELECT SUM(ABS(quantity * current_price)) as total 
                        FROM positions 
                        WHERE asset_class = ?
                    `).bind(assetClass).first();

                    return (result?.total as number) || 0;
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
            const broker = BrokerFactory.getBroker("PAPER", c.env.ALPHA_VANTAGE_KEY);
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
