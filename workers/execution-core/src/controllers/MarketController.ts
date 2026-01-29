import { Context } from 'hono';
import { Bindings } from '../bindings';
import { MarketDataClient } from '../clients/MarketDataClient';

export class MarketController {
    private marketClient: MarketDataClient;

    constructor() {
        this.marketClient = new MarketDataClient();
    }

    /**
     * GET /api/v1/market/quotes
     * Query Params: ?symbol=BTC
     */
    async getQuote(c: Context<{ Bindings: Bindings }>) {
        try {
            const symbol = c.req.query('symbol');
            if (!symbol) {
                return c.json({ error: 'Symbol query parameter required' }, 400);
            }

            const quote = await this.marketClient.getQuote(symbol);
            const fundamentals = await this.marketClient.getFundamentals(symbol);

            return c.json({
                ...quote,
                asset_class: fundamentals.asset_class,
                // Add extra "terminal-like" metadata if needed
                market_status: (quote as any).market_status || "OPEN"
            });
        } catch (e: any) {
            return c.json({ error: e.message }, 404);
        }
    }
}
