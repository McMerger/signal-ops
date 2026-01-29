export type Bindings = {
    // KV Namespaces
    SIGNAL_KV: KVNamespace;

    // D1 Database
    SIGNAL_DB: D1Database;

    // Wasm Modules
    SIGNAL_CORE: WebAssembly.Module;

    // Service Bindings
    STRATEGY_ENGINE: Fetcher;

    // Environment Variables for API Keys
    ALPHA_VANTAGE_KEY: string;
    COINGECKO_API_KEY: string;
    ETHERSCAN_API_KEY: string;
};
