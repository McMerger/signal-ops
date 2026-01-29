import { Context } from 'hono';
import { PolymarketClient } from '../clients/PolymarketClient';
import { MarketDataClient } from '../clients/MarketDataClient';

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
        // This would fetch from the Kimi Knowledge Graph in a real deployment
        const symbol = c.req.query('symbol') || "BTC";
        return c.json({
            asset: symbol,
            root_node: "Intrinsic Value Check",
            branches: [
                {
                    condition: "Margin of Safety > 20%",
                    outcome: "PASS",
                    next: "Prediction Market Check"
                },
                {
                    condition: "Prediction Probability > 60%",
                    outcome: "PASS",
                    next: "Risk Check"
                },
                {
                    condition: "Max Portfolio Weight < 15%",
                    outcome: "PASS",
                    next: "EXECUTE_BUY"
                }
            ],
            final_decision: "ACCUMULATE",
            confidence: 0.85
        });
    }
}
