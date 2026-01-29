export class OnChainClient {
    private baseUrl = "https://api.etherscan.io/api";
    private apiKey = "DEMO";

    constructor(apiKey?: string) {
        if (apiKey) this.apiKey = apiKey;
    }

    async getNetworkFlows(symbol: string) {
        // STRICT: Real Data Only.
        // For 'BTC' we might use Blockchain.info, for 'ETH' Etherscan.
        // Focusing on ETH flows as a primary generic example for "On-Chain".

        if (symbol === 'ETH' || symbol === 'USDC' || symbol === 'SOL') {
            return this.getEthGasOracle();
        }

        // For non-crypto assets, on-chain flows might not apply directly, 
        // OR we could return a "Market Risk" metric derived from crypto volatility if we wanted to be fancy.
        // But for strict compliance, we return null or "Not Applicable" status.
        return {
            symbol,
            status: "N/A",
            message: "Not an on-chain asset"
        };
    }

    private async getEthGasOracle() {
        // Fetch Real Gas Price as a proxy for Network congestion/Demand
        const url = `${this.baseUrl}?module=gastracker&action=gasoracle&apikey=${this.apiKey}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Real On-Chain Data Fetch Failed: Etherscan returned ${response.status}`);
        }

        const data: any = await response.json();

        if (data.status === "0" && data.message !== "OK") {
            // Failed (e.g. invalid key)
            throw new Error(`Real On-Chain Data Unavailable: ${data.result}`);
        }

        const gas = data.result;

        return {
            source: "Etherscan (Live)",
            metric: "Gas Price",
            safe_gwei: gas.SafeGasPrice,
            fast_gwei: gas.FastGasPrice,
            congestion_status: Number(gas.FastGasPrice) > 100 ? "HIGH" : "NORMAL",
            timestamp: new Date().toISOString()
        };
    }
}
