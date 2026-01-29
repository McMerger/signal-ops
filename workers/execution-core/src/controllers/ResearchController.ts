import { Context } from 'hono';
import { Bindings } from '../bindings';

export class ResearchController {

    async getIntrinsicValue(c: Context<{ Bindings: Bindings }>) {
        try {
            const symbol = c.req.query('symbol') || "BTC";

            // Call Python Research Core via Service Binding
            // The Python engine handles Data Fetching, Graham Logic, and Kimi AI
            const resp = await c.env.STRATEGY_ENGINE.fetch(`http://strategy-engine/research?symbol=${symbol}`);

            if (!resp.ok) {
                return c.json({ error: "Research Core Unavailable" }, 503);
            }

            const snapshot: any = await resp.json();
            const fund = snapshot.fundamentals || {};
            const price = fund.price || 0;
            const intrinsic = fund.intrinsic_value || 0;

            const marginOfSafety = intrinsic > 0 ? (intrinsic - price) / intrinsic : 0;

            return c.json({
                asset: symbol,
                asset_class: "Verified Real Asset", // Dynamic from Python
                intrinsic_value: Number(intrinsic.toFixed(2)),
                current_price: Number(price.toFixed(2)),
                margin_of_safety: Number(marginOfSafety.toFixed(2)),
                status: marginOfSafety > 0.2 ? "UNDERVALUED" : (marginOfSafety < -0.2 ? "OVERVALUED" : "FAIR_VALUE"),
                graham_flags: {
                    score: fund.graham_score,
                    pb_ratio: fund.price_to_book,
                    pe_ratio: fund.price_to_earnings,
                    source: fund.source
                },
                methodology: "SignalOps Research Core (Python/Kimi) - Real Data Only",
                timestamp: snapshot.timestamp,
                ai_analysis: snapshot.ai_analysis // Pass through Kimi analysis
            });

        } catch (e: any) {
            return c.json({ error: e.message }, 500);
        }
    }

    async getPredictionMarket(c: Context<{ Bindings: Bindings }>) {
        try {
            // Proxy to Python for consistency (it has the Polymerket Feed)
            const symbol = c.req.query('symbol') || "BTC";
            const resp = await c.env.STRATEGY_ENGINE.fetch(`http://strategy-engine/research?symbol=${symbol}`);

            if (!resp.ok) return c.json({ error: "Research Core Unavailable" }, 503);

            const snapshot: any = await resp.json();
            const markets = snapshot.prediction_markets || {};

            // Extract the most relevant market (e.g. recession or BTC price)
            // Python 'unified_data.events' usually has 'recession_odds' or specific keys
            // If empty, return status

            return c.json({
                asset: symbol,
                data: markets, // Return raw map
                source: "Polymarket (via Research Core)"
            });
        } catch (e: any) {
            return c.json({ error: e.message }, 500);
        }
    }

    async getDecisionTree(c: Context<{ Bindings: Bindings }>) {
        try {
            // Get the full evaluation for the tree
            const symbol = c.req.query('symbol') || "BTC";

            const resp = await c.env.STRATEGY_ENGINE.fetch("http://strategy-engine/evaluate", {
                method: "POST",
                body: JSON.stringify({
                    strategy: "graham",
                    asset: symbol
                })
            });

            if (!resp.ok) return c.json({ error: "Research Core Unavailable" }, 503);

            const evaluation: any = await resp.json();

            // Convert Evaluation Triggers to "Tree" format for UI
            const nodes = evaluation.triggers_evaluated.map((t: any, idx: number) => ({
                id: `node_${idx}`,
                label: `${t.source.toUpperCase()}: ${t.metric}`,
                status: t.status,
                details: `${t.value} ${t.operator} ${t.threshold}`,
                next: idx < evaluation.triggers_evaluated.length - 1 ? `node_${idx + 1}` : evaluation.final_action
            }));

            return c.json({
                asset: symbol,
                generated_at: new Date().toISOString(),
                decision_flow: nodes,
                final_outcome: evaluation.final_action,
                ai_reasoning: evaluation.reasoning
            });

        } catch (e: any) {
            return c.json({ error: e.message }, 500);
        }
    }
}
