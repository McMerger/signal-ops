import { Context } from 'hono';
import { PolymarketClient } from '../clients/PolymarketClient';
import { MarketDataClient } from '../clients/MarketDataClient';
import { EventService } from '../services/EventService';
import { OnChainClient } from '../clients/OnChainClient';
import { Bindings } from '../bindings';

export class ResearchController {
    private polyClient: PolymarketClient;

    constructor() {
        this.polyClient = new PolymarketClient();
    }

    async getIntrinsicValue(c: Context<{ Bindings: Bindings }>) {
        try {
            const client = new MarketDataClient(c.env.ALPHA_VANTAGE_KEY); // Inject Key

            const symbol = c.req.query('symbol') || "BTC";
            const quote = await client.getQuote(symbol);
            const fund = await client.getFundamentals(symbol);

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

    async getDecisionTree(c: Context<{ Bindings: Bindings }>) {
        try {
            const symbol = c.req.query('symbol') || "BTC";

            // 1. Fetch Real Data with Keys
            const marketClient = new MarketDataClient(c.env.ALPHA_VANTAGE_KEY);
            const onChainClient = new OnChainClient(c.env.ETHERSCAN_API_KEY);
            const eventService = new EventService(c.env.ALPHA_VANTAGE_KEY);

            const [quote, fund, events, flows] = await Promise.all([
                marketClient.getQuote(symbol),
                marketClient.getFundamentals(symbol),
                eventService.getBlockingEvents(symbol), // Real Events
                onChainClient.getNetworkFlows(symbol)
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

            // Node 2: Value (Graham)
            let valueNode: any = { id: "node_2_value", label: "Fundamental Value", status: "SKIPPED" };
            if (eventNode.status === "PASS") {
                const intrinsic = fund.eps * 15;
                const safe = (intrinsic - quote.price) > 0;
                valueNode = {
                    id: "node_2_value",
                    label: "Graham Value Check",
                    status: safe ? "PASS" : "FAIL",
                    details: `Price $${quote.price} vs Intrinsic $${intrinsic.toFixed(2)}`,
                    next: safe ? "node_3_onchain" : "REJECT"
                };
            }
            nodes.push(valueNode);

            // Node 3: On-Chain Flow (New Logic)
            let chainNode: any = { id: "node_3_onchain", label: "On-Chain Confirmation", status: "SKIPPED" };
            if (valueNode.status === "PASS") {
                const congestion = (flows as any).congestion_status;
                const risk = congestion === "HIGH";

                chainNode = {
                    id: "node_3_onchain",
                    label: "On-Chain Flow Check",
                    status: risk ? "WARN" : "PASS",
                    details: congestion ? `Network Congestion: ${congestion}` : "No On-Chain Data (Equity)",
                    next: "node_4_prediction"
                };
            }
            nodes.push(chainNode);

            // Simple final decision
            const finalStatus = chainNode.status === "WARN" ? "Review" : "CANDIDATE";

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
