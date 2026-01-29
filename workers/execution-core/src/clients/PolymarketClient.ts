export class PolymarketClient {
    private baseUrl = "https://gamma-api.polymarket.com";

    async getMarket(slug: string = "will-bitcoin-hit-100k-in-2025") {
        try {
            // Using the Gamma API for simplified market data
            const response = await fetch(`${this.baseUrl}/events?slug=${slug}`);
            if (!response.ok) throw new Error(`Polymarket API error: ${response.status}`);

            const data: any = await response.json();
            if (!data || data.length === 0) return null;

            const event = data[0];
            const market = event.markets[0]; // Primary market

            // Fetch history for probability curve (mocking history curve from current price for now as Gamma doesn't always give full history freely without CLOB)
            // In a real production environment with an API Key, we would query the CLOB timeseries.
            // For now, we will construct a valid curve based on the current probability.
            const currentProb = Number(market.outcomePrices ? JSON.parse(market.outcomePrices)[0] : 0.5);

            return {
                question: event.title,
                probability: currentProb,
                volume: Number(market.volume),
                sentiment: currentProb > 0.5 ? "Optimistic" : "Pessimistic",
                // Constructing a "live" curve point
                curve_point: {
                    timestamp: new Date().toISOString(),
                    prob: currentProb
                }
            };
        } catch (e) {
            console.error("Failed to fetch Polymarket data:", e);
            throw e;
        }
    }
}
