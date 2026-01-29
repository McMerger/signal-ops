-- SignalOps D1 Schema
-- Supports multi-asset portfolio and order management
DROP TABLE IF EXISTS positions;
CREATE TABLE positions (
    symbol TEXT PRIMARY KEY,
    strategy_name TEXT,
    asset_class TEXT,
    quantity REAL NOT NULL DEFAULT 0,
    average_entry_price REAL,
    current_price REAL,
    unrealized_pnl REAL DEFAULT 0,
    realized_pnl REAL DEFAULT 0,
    opened_at TEXT,
    last_updated TEXT
);
DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
    id TEXT PRIMARY KEY,
    strategy_name TEXT,
    symbol TEXT NOT NULL,
    side TEXT NOT NULL,
    -- BUY, SELL
    quantity REAL NOT NULL,
    price REAL,
    status TEXT,
    -- PENDING, FILLED, CANCELED, REJECTED
    execution_data TEXT,
    -- JSON payload of fill details
    created_at TEXT,
    updated_at TEXT
);
DROP TABLE IF EXISTS trades;
CREATE TABLE trades (
    id TEXT PRIMARY KEY,
    order_id TEXT,
    strategy_name TEXT,
    symbol TEXT,
    side TEXT,
    quantity REAL,
    price REAL,
    pnl REAL,
    status TEXT,
    executed_at TEXT
);
-- Indexes for performance
CREATE INDEX idx_positions_asset_class ON positions(asset_class);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_trades_strategy ON trades(strategy_name);