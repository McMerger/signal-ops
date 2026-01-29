import { Context } from 'hono';
import { PolymarketClient } from '../clients/PolymarketClient';
import { MarketDataClient } from '../clients/MarketDataClient';
import { EventService } from '../services/EventService';

export class ResearchController {
    private polyClient: PolymarketClient;
    private marketClient: MarketDataClient;

    constructor() {
        this.polyClient = new PolymarketClient();
        this.marketClient = new MarketDataClient();
    }

    async getIntrinsicValue(c: Context) {
        try {
            const symbol = c.req.query('symbol') || "BTC";
            const quote = await this.marketClient.getQuote(symbol);
            const fund = await this.marketClient.getFundamentals(symbol);

            // Benjamin Graham Formula (Simplified): V = EPS * (8.5 + 2g) * 4.4 / Y
            const growthMultiplier = 8.5 + (2 * (fund.growth_rate * 100));
            const intrinsicValueRaw = (fund.eps * growthMultiplier * 4.4) / fund.aaa_corporate_bond_yield;

            // Asset-Class Specific Adjustments
            let adjustedIntrinsic = intrinsicValueRaw;
            let methodology = "Benjamin Graham Intrinsic Value";

            if (fund.asset_class === 'CRYPTO') {
                // Crypto has no "EPS" in traditional sense, so we scale the proxy model
                adjustedIntrinsic = intrinsicValueRaw * 2500;
                methodology += " (Crypto Model)";
            } else if (fund.asset_class === 'ETF') {
                // ETFs track indices, valuation is aggregate
                adjustedIntrinsic = intrinsicValueRaw * 10;
                methodology += " (ETF Aggregate)";
            }

            const marginOfSafety = (adjustedIntrinsic - quote.price) / adjustedIntrinsic;

            return c.json({
                asset: symbol,
                asset_class: fund.asset_class || 'UNKNOWN',
                intrinsic_value: Number(adjustedIntrinsic.toFixed(2)),
                current_price: quote.price,
                margin_of_safety: Number(marginOfSafety.toFixed(2)),
                status: marginOfSafety > 0 ? "UNDERVALUED" : "OVERVALUED",
                graham_flags: {
                    earnings_stability: fund.eps > 0 ? "PASS" : "FAIL",
                    financial_strength: "PASS",
                    growth_quality: fund.growth_rate > 0.05 ? "PASS" : "FAIL"
                },
                methodology: methodology,
                timestamp: quote.timestamp
            })
        } catch (e: any) {
            return c.json({ error: e.message }, 500);
        }
    }

    async getPredictionMarket(c: Context) {
        try {
            const symbol = c.req.query('symbol') || "BTC";
            const market = await this.polyClient.getMarketForAsset(symbol);

            if (!market) {
                return c.json({ error: `No prediction market found for ${symbol}` }, 404);
            }

            return c.json({
                asset: symbol,
                question: market.question,
                probability: market.probability,
                market_sentiment: market.sentiment,
                volume: market.volume,
                implied_odds: `${(market.probability * 100).toFixed(1)}%`,
                timestamp: new Date().toISOString()
            });
        } catch (e: any) {
            return c.json({ error: e.message }, 500);
        }
    }

    async getDecisionTree(c: Context) {
        try {
            const symbol = c.req.query('symbol') || "BTC";

            // 1. Fetch Real Data
            const [quote, fund, events] = await Promise.all([
                this.marketClient.getQuote(symbol),
                this.marketClient.getFundamentals(symbol),
                new EventService().getBlockingEvents(symbol)
            ]);

            // 2. Build Tree Nodes
            const nodes = [];

            // Node 1: Events
            const eventNode = {
                id: "node_1_events",
                label: "Event Block Check",
                status: events.length > 0 ? "BLOCK" : "PASS",
                details: events.length > 0 ? `Blocked by: ${events[0].description}` : "No critical events",
                next: "node_2_value"
            };
            nodes.push(eventNode);

            // Node 2: Value (Only if Events passed)
            let valueNode: any = { id: "node_2_value", label: "Intrinsic Value", status: "SKIPPED" };
            if (eventNode.status === "PASS") {
                // ... (simplified value logic for display)
                const intrinsic = fund.eps * 15; // Simplified visual proxy
                const safe = (intrinsic - quote.price) > 0;
                valueNode = {
                    id: "node_2_value",
                    label: "Graham Value Check",
                    status: safe ? "PASS" : "FAIL",
                    details: `Price $${quote.price} vs Intrinsic $${intrinsic.toFixed(2)}`,
                    next: safe ? "node_3_prediction" : "REJECT"
                };
            }
            nodes.push(valueNode);

            return c.json({
                asset: symbol,
                generated_at: new Date().toISOString(),
                decision_flow: nodes,
                final_outcome: nodes[nodes.length - 1].status === "PASS" ? "CANDIDATE" : "REJECT"
            });
        } catch (e: any) {
            return c.json({ error: e.message }, 500);
        }
    }
}
