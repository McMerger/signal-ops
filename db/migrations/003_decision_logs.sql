-- Decision logs table
CREATE TABLE IF NOT EXISTS decision_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    strategy_name VARCHAR(255) NOT NULL,
    asset VARCHAR(50) NOT NULL,
    decision VARCHAR(20) NOT NULL CHECK (decision IN ('BUY', 'SELL', 'HOLD')),
    confidence DECIMAL(5,4) CHECK (confidence >= 0 AND confidence <= 1),
    position_size DECIMAL(10,8),
    execution_status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_strategy_timestamp ON decision_logs(strategy_name, timestamp);
CREATE INDEX IF NOT EXISTS idx_asset_timestamp ON decision_logs(asset, timestamp);

-- Trigger conditions that led to the decision
CREATE TABLE IF NOT EXISTS decision_triggers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    decision_log_id UUID NOT NULL REFERENCES decision_logs(id) ON DELETE CASCADE,
    source VARCHAR(50) NOT NULL CHECK (source IN ('fundamental', 'polymarket', 'onchain', 'technical', 'news')),
    metric VARCHAR(100) NOT NULL,
    value DECIMAL(20,8),
    threshold_operator VARCHAR(10),
    threshold_value DECIMAL(20,8),
    status VARCHAR(20) NOT NULL CHECK (status IN ('PASS', 'FAIL', 'N/A')),
    reasoning TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_decision_log ON decision_triggers(decision_log_id);

-- Metadata for each decision (market conditions, etc.)
CREATE TABLE IF NOT EXISTS decision_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    decision_log_id UUID NOT NULL REFERENCES decision_logs(id) ON DELETE CASCADE,
    key VARCHAR(100) NOT NULL,
    value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_decision_metadata_log ON decision_metadata(decision_log_id);

-- Strategy configs table
CREATE TABLE IF NOT EXISTS strategy_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    config_yaml TEXT NOT NULL,
    config_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_strategy_name ON strategy_configs(name);
