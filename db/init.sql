-- SignalOps Database Initialization
-- PostgreSQL schema for trading system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Strategies table
CREATE TABLE IF NOT EXISTS strategies (
    name VARCHAR(255) PRIMARY KEY,
    description TEXT NOT NULL DEFAULT '',
    config JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_executed_at TIMESTAMP,
    total_pnl DECIMAL(20, 8),
    win_rate DECIMAL(5, 2),
    total_trades INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'
);

-- Trades table (order execution history)
CREATE TABLE IF NOT EXISTS trades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id VARCHAR(255) NOT NULL,
    strategy_name VARCHAR(255) REFERENCES strategies(name) ON DELETE SET NULL,
    symbol VARCHAR(50) NOT NULL,
    side VARCHAR(10) NOT NULL CHECK (side IN ('BUY', 'SELL')),
    quantity DECIMAL(20, 8) NOT NULL,
    price DECIMAL(20, 8),
    executed_price DECIMAL(20, 8),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    exchange VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    executed_at TIMESTAMP,
    fees DECIMAL(20, 8) DEFAULT 0,
    pnl DECIMAL(20, 8),
    CONSTRAINT positive_quantity CHECK (quantity > 0)
);

-- Positions table (current open positions)
CREATE TABLE IF NOT EXISTS positions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    symbol VARCHAR(50) NOT NULL,
    strategy_name VARCHAR(255) REFERENCES strategies(name) ON DELETE SET NULL,
    quantity DECIMAL(20, 8) NOT NULL,
    average_entry_price DECIMAL(20, 8) NOT NULL,
    current_price DECIMAL(20, 8),
    unrealized_pnl DECIMAL(20, 8),
    realized_pnl DECIMAL(20, 8) DEFAULT 0,
    opened_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_updated TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(symbol, strategy_name)
);

-- Risk events table
CREATE TABLE IF NOT EXISTS risk_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    description TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    resolved BOOLEAN NOT NULL DEFAULT false,
    resolved_at TIMESTAMP,
    metadata JSONB DEFAULT '{}'
);

-- Market data cache table (optional, for caching market data)
CREATE TABLE IF NOT EXISTS market_data_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exchange VARCHAR(50) NOT NULL,
    symbol VARCHAR(50) NOT NULL,
    price DECIMAL(20, 8) NOT NULL,
    bid DECIMAL(20, 8),
    ask DECIMAL(20, 8),
    volume_24h DECIMAL(20, 8),
    high_24h DECIMAL(20, 8),
    low_24h DECIMAL(20, 8),
    price_change_24h DECIMAL(10, 4),
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(exchange, symbol)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_trades_strategy ON trades(strategy_name);
CREATE INDEX IF NOT EXISTS idx_trades_symbol ON trades(symbol);
CREATE INDEX IF NOT EXISTS idx_trades_timestamp ON trades(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_trades_status ON trades(status);
CREATE INDEX IF NOT EXISTS idx_positions_symbol ON positions(symbol);
CREATE INDEX IF NOT EXISTS idx_positions_strategy ON positions(strategy_name);
CREATE INDEX IF NOT EXISTS idx_risk_events_timestamp ON risk_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_risk_events_resolved ON risk_events(resolved);
CREATE INDEX IF NOT EXISTS idx_market_data_cache_exchange_symbol ON market_data_cache(exchange, symbol);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for auto-updating timestamps
CREATE TRIGGER update_strategies_updated_at BEFORE UPDATE ON strategies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_positions_updated_at BEFORE UPDATE ON positions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample strategy for testing
INSERT INTO strategies (name, description, config, is_active)
VALUES (
    'BTC_Momentum_Alpha',
    'Bitcoin momentum trading strategy using RSI and MACD indicators',
    '{"timeframe": "1h", "rsi_threshold": 30, "macd_fast": 12, "macd_slow": 26, "type": "Momentum"}',
    true
) ON CONFLICT (name) DO NOTHING;

INSERT INTO strategies (name, description, config, is_active)
VALUES (
    'ETH_Mean_Reversion',
    'Ethereum mean reversion strategy with Bollinger Bands',
    '{"timeframe": "4h", "bb_period": 20, "bb_std": 2, "type": "Mean Reversion"}',
    true
) ON CONFLICT (name) DO NOTHING;

-- Grant permissions (adjust username as needed)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO signalops;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO signalops;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO signalops;
