export class MarketDataClient {
    private baseUrl = "https://api.coingecko.com/api/v3";

    // Mapping internal symbols to CoinGecko IDs
    private symbolMap: Record<string, string> = {
        'BTC': 'bitcoin',
        'ETH': 'ethereum',
        'SOL': 'solana',
        'MSTR': 'microstrategy', // Note: CoinGecko tracks some stocks too, or we might need fallback
        'COIN': 'coinbase-global-inc' // Note: This might be tokenized stock
    };

    async getQuote(symbol: string) {
        const id = this.symbolMap[symbol];
        if (!id) throw new Error(`Symbol ${symbol} not supported`);

        try {
            // Using simple price endpoint (no auth needed for low volume)
            const response = await fetch(`${this.baseUrl}/simple/price?ids=${id}&vs_currencies=usd&include_24hr_vol=true`);
            if (!response.ok) throw new Error(`CoinGecko API error: ${response.status}`);

            const data: any = await response.json();
            const quote = data[id];

            if (!quote) throw new Error("No data returned");

            return {
                symbol,
                price: quote.usd,
                timestamp: new Date().toISOString(),
                volume_24h: quote.usd_24h_vol || 0
            };
        } catch (e) {
            console.error("Failed to fetch CoinGecko data:", e);
            // Fallback to simulated if API rate limited (common with public CG)
            return this.getSimulatedQuote(symbol);
        }
    }

    async getFundamentals(symbol: string) {
        // CoinGecko doesn't provide deep stock fundamentals (EPS, Book Value).
        // For a hackathon/demo context without paying $299/mo for Financial Modeling Prep,
        // we will use realistic static approximates for the Graham calculation but driven by live price.
        // If we had an API key for FMP/AlphaVantage, we would call it here.

        return {
            symbol,
            eps: 4.50, // Normalized Earnings Per Share (Proxy)
            book_value: 22000, // Book Value per share (BTC proxy)
            growth_rate: 0.15, // 15% growth
            aaa_corporate_bond_yield: 4.4 // Current yield benchmark
        };
    }

    private async getSimulatedQuote(symbol: string) {
        console.warn(`[MarketDataClient] Using fallback simulation for ${symbol} due to API limit/error`);
        const basePrices: Record<string, number> = {
            'BTC': 68000, 'ETH': 3500, 'SOL': 180, 'MSTR': 1400, 'COIN': 250
        };
        const base = basePrices[symbol] || 100;
        const currentPrice = base + (Math.random() - 0.5) * (base * 0.05);
        return {
            symbol,
            price: Number(currentPrice.toFixed(2)),
            timestamp: new Date().toISOString(),
            volume_24h: 1000000
        };
    }
}
