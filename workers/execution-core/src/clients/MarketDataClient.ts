export class MarketDataClient {
    private geckoUrl = "https://api.coingecko.com/api/v3";

    // Crypto Mapping
    private cryptoMap: Record<string, string> = {
        'BTC': 'bitcoin',
        'ETH': 'ethereum',
        'SOL': 'solana',
    };

    // Equity "Live" Base Prices (Seeds for random walk simulation)
    private equitySeeds: Record<string, number> = {
        'AAPL': 175.00,
        'NVDA': 900.00,
        'SPY': 510.00,
        'TSLA': 180.00,
        'MSTR': 1500.00,
        'COIN': 260.00
    };

    isCrypto(symbol: string): boolean {
        return !!this.cryptoMap[symbol];
    }

    async getQuote(symbol: string) {
        // 1. Try Crypto (Real Live Data via CoinGecko)
        if (this.isCrypto(symbol)) {
            return this.getCryptoQuote(symbol);
        }

        // 2. Try Equity (Simulated Live Feed)
        if (this.equitySeeds[symbol]) {
            return this.getEquityQuote(symbol);
        }

        throw new Error(`Symbol ${symbol} not supported`);
    }

    async getFundamentals(symbol: string) {
        // Asset-Class Specific Fundamentals
        if (this.isCrypto(symbol)) {
            return {
                symbol,
                asset_class: 'CRYPTO',
                eps: 4.50, // Proxy
                book_value: 22000,
                growth_rate: 0.15,
                aaa_corporate_bond_yield: 4.4
            };
        }

        // Equities Fundamentals (Mocked real-ish data for demo)
        const equityFund: Record<string, any> = {
            'AAPL': { eps: 6.50, bv: 5.00, gr: 0.08, type: 'EQUITY' },
            'NVDA': { eps: 25.0, bv: 18.0, gr: 0.40, type: 'EQUITY' },
            'SPY': { eps: 220, bv: 150, gr: 0.07, type: 'ETF' }, // SPY EPS is index level
            'TSLA': { eps: 3.00, bv: 15.0, gr: 0.20, type: 'EQUITY' },
            'MSTR': { eps: -5.0, bv: 40.0, gr: 0.30, type: 'EQUITY' },
            'COIN': { eps: 4.00, bv: 35.0, gr: 0.25, type: 'EQUITY' }
        };

        const data = equityFund[symbol] || equityFund['AAPL'];

        return {
            symbol,
            asset_class: data.type,
            eps: data.eps,
            book_value: data.bv,
            growth_rate: data.gr,
            aaa_corporate_bond_yield: 4.4
        };
    }

    private async getCryptoQuote(symbol: string) {
        const id = this.cryptoMap[symbol];
        try {
            const response = await fetch(`${this.geckoUrl}/simple/price?ids=${id}&vs_currencies=usd&include_24hr_vol=true`);
            if (!response.ok) throw new Error("CoinGecko API Error");
            const data: any = await response.json();
            const quote = data[id];

            return {
                symbol,
                price: quote.usd,
                timestamp: new Date().toISOString(),
                volume_24h: quote.usd_24h_vol || 0,
                source: "CoinGecko (Live)"
            };
        } catch (e) {
            console.warn(`Fallback (Simulated) for ${symbol}`);
            return this.getSimulatedQuote(symbol, 60000);
        }
    }

    private async getEquityQuote(symbol: string) {
        // Simulate Market Hours & Volatility
        const base = this.equitySeeds[symbol];
        const volatility = 0.015; // 1.5% daily swing

        // Time-based fluctuation (Market Open 9:30-16:00 ET roughly mocked)
        const now = new Date();
        const hour = now.getUTCHours();
        const isOpen = hour >= 13 && hour <= 20; // UTC approx for US Market

        const randomMove = (Math.random() - 0.5) * (base * volatility);
        const price = base + randomMove;

        return {
            symbol,
            price: Number(price.toFixed(2)),
            timestamp: now.toISOString(),
            volume_24h: Math.floor(base * 10000),
            market_status: isOpen ? "OPEN" : "CLOSED (Extended Hours)",
            source: "SignalOps Equity Feed (Simulated)"
        };
    }

    private async getSimulatedQuote(symbol: string, base: number) {
        return {
            symbol,
            price: base,
            timestamp: new Date().toISOString(),
            volume_24h: 0,
            source: "Fallback"
        };
    }
}
