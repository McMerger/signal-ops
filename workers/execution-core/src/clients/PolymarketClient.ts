export class PolymarketClient {
    private baseUrl = "https://gamma-api.polymarket.com";

    private assetMap: Record<string, string> = {
        // Crypto
        'BTC': 'will-bitcoin-hit-100k-in-2025',
        'ETH': 'will-ethereum-reach-10000-in-2025',
        'SOL': 'solana-all-time-high-2025',

        // Equities / Corporate
        'NVDA': 'nvidia-market-cap-3-trillion-2024',
        'TSLA': 'tesla-deliveries-q4-2024',
        'COIN': 'coinbase-revenue-2025',
        'MSTR': 'will-mstr-stock-split-in-2025',
        'AAPL': 'will-apple-release-foldable-iphone-2025',

        // Macro
        'FED': 'fed-interest-rates-november-2024',
        'SPY': 'will-us-enter-recession-in-2024',
        'MACRO': 'will-us-enter-recession-in-2024'
    };

    async getMarketForAsset(symbol: string) {
        const slug = this.assetMap[symbol];
        if (!slug) return null; // Strict: No fallback
        return this.getMarket(slug);
    }

    async getMarket(slug: string = "will-bitcoin-hit-100k-in-2025") {
        try {
            // Using the Gamma API for simplified market data
            const response = await fetch(`${this.baseUrl}/events?slug=${slug}`);
            if (!response.ok) throw new Error(`Polymarket API error: ${response.status}`);

            const data: any = await response.json();
            if (!data || data.length === 0) return null;

            const event = data[0];
            const market = event.markets[0]; // Primary market

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
