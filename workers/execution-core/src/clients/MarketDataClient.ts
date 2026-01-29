export class MarketDataClient {
    // In a real scenario, this would be an external API URL (e.g., AlphaVantage, FMP)
    // For this implementation, we will simulate a live feed with realistic volatility

    async getQuote(symbol: string) {
        // Simulating network latency
        await new Promise(resolve => setTimeout(resolve, 50));

        // Generate a "live" price based on a realistic base to ensure valid calculations
        const basePrices: Record<string, number> = {
            'BTC': 68000,
            'ETH': 3500,
            'SOL': 180,
            'MSTR': 1400,
            'COIN': 250
        };

        const base = basePrices[symbol] || 100;
        const randomFluctuation = (Math.random() - 0.5) * (base * 0.02); // +/- 1%
        const currentPrice = base + randomFluctuation;

        return {
            symbol,
            price: Number(currentPrice.toFixed(2)),
            timestamp: new Date().toISOString(),
            volume_24h: Math.floor(Math.random() * 1000000)
        };
    }

    async getFundamentals(symbol: string) {
        // Simulating fetching earnings/book value for Graham calculation
        // Returns data needed for Intrinsic Value = EPS * (8.5 + 2g) * 4.4 / Y

        return {
            symbol,
            eps: 4.50, // Normalized Earnings Per Share
            book_value: 22000, // Book Value per share (for BTC proxy)
            growth_rate: 0.15, // 15% growth
            aaa_corporate_bond_yield: 4.4 // Current yield benchmark
        };
    }
}
