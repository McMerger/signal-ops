# Backend Architecture & API Connectivity Analysis

## Executive Summary

✅ **Confirmed**: The SignalOps backend is a **polyglot microservices architecture** using **C++, Java, Python, and Go** services, all connected to the Next.js frontend via REST APIs.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js/TypeScript)             │
│                     Port: 3000                               │
└────────────────────────┬────────────────────────────────────┘
                         │ REST APIs (HTTP)
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Go Core    │  │   Python     │  │   Java Risk  │
│   (Primary)  │  │   Strategy   │  │   Manager    │
│   Port 8080  │  │   Port 5000  │  │   Port 50052 │
└──────┬───────┘  └──────────────┘  └──────────────┘
       │
       │ Subscribes to
       ▼
┌──────────────┐
│  C++ Signal  │
│    Core      │
│  (via Redis) │
└──────────────┘
```

## Service Breakdown

### 1. **Go Execution Core** (Primary API Gateway)
**Language**: Go  
**Port**: 8080 (HTTP/REST), 50050 (gRPC), 8081 (WebSocket)  
**Role**: Main API gateway, order routing, exchange integration

#### Key Files:
- [`main.go`](file:///d:/signal-ops/go-execution-core/main.go) - Server initialization
- [`rest_handlers.go`](file:///d:/signal-ops/go-execution-core/rest_handlers.go) - REST API endpoints
- [`portfolio_handlers.go`](file:///d:/signal-ops/go-execution-core/portfolio_handlers.go) - Portfolio APIs
- [`strategy_handlers.go`](file:///d:/signal-ops/go-execution-core/strategy_handlers.go) - Strategy APIs
- [`binance.go`](file:///d:/signal-ops/go-execution-core/binance.go) - Exchange integration

#### API Endpoints Exposed:
```go
// Order Management
POST   /api/v1/orders              // Submit order
GET    /api/v1/orders              // List orders
DELETE /api/v1/orders/{id}         // Cancel order
PUT    /api/v1/orders/{id}         // Modify order
POST   /api/v1/orders/batch        // Batch submit
POST   /api/v1/orders/stop_loss    // Stop loss
POST   /api/v1/orders/take_profit  // Take profit
GET    /api/v1/order_status        // Order status

// Portfolio
GET    /api/v1/portfolio/positions     // Get positions
GET    /api/v1/portfolio/performance   // Performance metrics
GET    /api/v1/portfolio/risk          // Risk metrics
GET    /api/v1/portfolio/pnl           // PnL data
GET    /api/v1/portfolio/balances      // All balances

// Market Data
GET    /api/v1/market/{exchange}/{symbol}  // Market data
GET    /api/v1/balance/{exchange}          // Exchange balance

// Python Strategy Proxy
POST   /api/v1/python/strategy/evaluate    // Evaluate strategy
POST   /api/v1/python/backtest/run         // Run backtest
GET    /api/v1/python/agents/recommendations  // Agent recommendations

// Data Sources
GET    /api/v1/data-sources/yahoo/{symbol}     // Yahoo Finance
GET    /api/v1/data-sources/dune/query/{id}    // Dune Analytics
GET    /api/v1/data-sources/sec/filings/{cik}  // SEC Filings
GET    /api/v1/data-sources/news/{query}       // News API

// Indicators
POST   /api/v1/indicators/sma          // Simple Moving Average
POST   /api/v1/indicators/ema          // Exponential Moving Average
POST   /api/v1/indicators/rsi          // Relative Strength Index
POST   /api/v1/indicators/macd         // MACD
POST   /api/v1/indicators/bollinger    // Bollinger Bands

// Polymarket
GET    /api/v1/polymarket/markets      // List markets
GET    /api/v1/polymarket/market/{id}  // Market details
POST   /api/v1/polymarket/order        // Place order
```

---

### 2. **Python Strategy Engine**
**Language**: Python  
**Port**: 5000 (HTTP/REST), 50051 (gRPC stub)  
**Role**: Strategy evaluation, backtesting, AI agent recommendations

#### Key Files:
- [`grpc_server.py`](file:///d:/signal-ops/python-strategy-engine/grpc_server.py) - gRPC/HTTP server
- [`strategy_evaluator.py`](file:///d:/signal-ops/python-strategy-engine/strategy_evaluator.py) - Strategy logic
- [`backtest_engine.py`](file:///d:/signal-ops/python-strategy-engine/backtest_engine.py) - Backtesting
- [`agent_upload_runtime.py`](file:///d:/signal-ops/python-strategy-engine/agent_upload_runtime.py) - AI agents

#### API Endpoints (Proxied via Go):
```python
POST   /api/v1/python/strategy/evaluate        # Strategy evaluation
POST   /api/v1/python/backtest/run             # Backtest execution
GET    /api/v1/python/agents/recommendations   # AI agent signals
```

#### Dependencies:
- Flask (HTTP server)
- gRPC (service communication)
- pandas, numpy (data processing)
- AI/ML libraries for agent-based trading

---

### 3. **Java Risk Manager**
**Language**: Java  
**Port**: 50052 (gRPC)  
**Role**: Position tracking, PnL calculation, risk limit enforcement

#### Key Files:
- [`RiskManagerServer.java`](file:///d:/signal-ops/java-risk-manager/src/main/java/io/signalops/risk/RiskManagerServer.java) - gRPC server
- [`PositionTracker.java`](file:///d:/signal-ops/java-risk-manager/src/main/java/io/signalops/risk/PositionTracker.java) - Position management
- [`PnLCalculator.java`](file:///d:/signal-ops/java-risk-manager/src/main/java/io/signalops/risk/PnLCalculator.java) - PnL calculations
- [`RiskLimits.java`](file:///d:/signal-ops/java-risk-manager/src/main/java/io/signalops/risk/RiskLimits.java) - Risk enforcement

#### Communication:
- **Protocol**: gRPC (called by Go service)
- **Purpose**: Real-time risk checks before order execution
- **Data**: Position tracking, PnL, drawdown limits

---

### 4. **C++ Signal Core**
**Language**: C++  
**Port**: N/A (Redis pub/sub)  
**Role**: SIMD-optimized technical indicators, order book processing

#### Key Files:
- [`main.cpp`](file:///d:/signal-ops/cpp-signal-core/src/main.cpp) - Main entry point
- [`indicators.cpp`](file:///d:/signal-ops/cpp-signal-core/src/indicators.cpp) - Technical indicators (SMA, EMA, RSI, etc.)
- [`order_book.cpp`](file:///d:/signal-ops/cpp-signal-core/src/order_book.cpp) - Order book processing
- [`redis_interface.cpp`](file:///d:/signal-ops/cpp-signal-core/src/redis_interface.cpp) - Redis pub/sub
- [`signal_processor.cpp`](file:///d:/signal-ops/cpp-signal-core/src/signal_processor.cpp) - Signal processing

#### Communication:
- **Protocol**: Redis pub/sub (Go subscribes via `cpp_signal_subscriber.go`)
- **Purpose**: High-performance indicator calculations
- **Optimization**: SIMD instructions for parallel processing

---

## Frontend API Integration

### Frontend API Clients

The Next.js frontend connects to the backend via TypeScript API clients:

#### 1. **Orders API** ([`orders-api.ts`](file:///d:/signal-ops/frontend/src/lib/api/orders-api.ts))
```typescript
ordersApi.list()           → GET  /api/v1/orders
ordersApi.submit()         → POST /api/v1/orders
ordersApi.cancel()         → DELETE /api/v1/orders/{id}
ordersApi.modify()         → PUT /api/v1/orders/{id}
ordersApi.batchSubmit()    → POST /api/v1/orders/batch
ordersApi.stopLoss()       → POST /api/v1/orders/stop_loss
ordersApi.takeProfit()     → POST /api/v1/orders/take_profit
```

#### 2. **Portfolio API** ([`portfolio-api.ts`](file:///d:/signal-ops/frontend/src/lib/api/portfolio-api.ts))
```typescript
portfolioApi.getPositions()    → GET /api/v1/portfolio/positions
portfolioApi.getPerformance()  → GET /api/v1/portfolio/performance
portfolioApi.getRiskMetrics()  → GET /api/v1/portfolio/risk
portfolioApi.getPnL()          → GET /api/v1/portfolio/pnl
portfolioApi.getBalances()     → GET /api/v1/portfolio/balances
```

#### 3. **Python Strategy API** ([`python-strategy-api.ts`](file:///d:/signal-ops/frontend/src/lib/api/python-strategy-api.ts))
```typescript
pythonStrategyApi.evaluateStrategy()      → POST /api/v1/python/strategy/evaluate
pythonStrategyApi.runBacktest()           → POST /api/v1/python/backtest/run
pythonStrategyApi.getAgentRecommendations() → GET /api/v1/python/agents/recommendations
```

#### 4. **Market Data API** ([`market-data-api.ts`](file:///d:/signal-ops/frontend/src/lib/api/market-data-api.ts))
```typescript
marketDataApi.getMarketData()  → GET /api/v1/market/{exchange}/{symbol}
```

#### 5. **Data Sources API** ([`data-sources-api.ts`](file:///d:/signal-ops/frontend/src/lib/api/data-sources-api.ts))
```typescript
dataSourcesApi.getYahooFinance()  → GET /api/v1/data-sources/yahoo/{symbol}
dataSourcesApi.getDuneQuery()     → GET /api/v1/data-sources/dune/query/{id}
dataSourcesApi.getSECFilings()    → GET /api/v1/data-sources/sec/filings/{cik}
dataSourcesApi.getNews()          → GET /api/v1/data-sources/news/{query}
```

#### 6. **Indicators API** ([`indicators-api.ts`](file:///d:/signal-ops/frontend/src/lib/api/indicators-api.ts))
```typescript
indicatorsApi.calculateSMA()        → POST /api/v1/indicators/sma
indicatorsApi.calculateEMA()        → POST /api/v1/indicators/ema
indicatorsApi.calculateRSI()        → POST /api/v1/indicators/rsi
indicatorsApi.calculateMACD()       → POST /api/v1/indicators/macd
indicatorsApi.calculateBollinger()  → POST /api/v1/indicators/bollinger
```

#### 7. **Polymarket API** ([`polymarket-api.ts`](file:///d:/signal-ops/frontend/src/lib/api/polymarket-api.ts))
```typescript
polymarketApi.getMarkets()      → GET  /api/v1/polymarket/markets
polymarketApi.getMarket()       → GET  /api/v1/polymarket/market/{id}
polymarketApi.placeOrder()      → POST /api/v1/polymarket/order
```

#### 8. **Strategies API** ([`strategies-api.ts`](file:///d:/signal-ops/frontend/src/lib/api/strategies-api.ts))
```typescript
strategiesApi.list()    → GET strategies
strategiesApi.create()  → POST strategies
strategiesApi.update()  → PUT strategies
strategiesApi.delete()  → DELETE strategies
```

---

## Data Flow Example

### Order Submission Flow

```
1. User clicks "Buy" in Frontend (Next.js/TypeScript)
   ↓
2. ordersApi.submit() → POST /api/v1/orders
   ↓
3. Go Execution Core receives request (rest_handlers.go)
   ↓
4. Go calls Java Risk Manager via gRPC (java_client.go)
   ↓
5. Java validates risk limits (RiskManagerServer.java)
   ↓
6. Go submits order to Binance (binance.go)
   ↓
7. Go logs trade to PostgreSQL
   ↓
8. Go publishes update to Redis
   ↓
9. Response returned to Frontend
   ↓
10. Frontend updates UI with order status
```

### Strategy Evaluation Flow

```
1. User requests strategy evaluation in Frontend
   ↓
2. pythonStrategyApi.evaluateStrategy() → POST /api/v1/python/strategy/evaluate
   ↓
3. Go proxies request to Python (python_strategy_handlers.go)
   ↓
4. Python evaluates strategy (strategy_evaluator.py)
   ↓
5. Python may request indicators from C++ via Redis
   ↓
6. C++ calculates indicators (indicators.cpp)
   ↓
7. Python returns signal to Go
   ↓
8. Go returns to Frontend
   ↓
9. Frontend displays recommendation
```

---

## Language Distribution

### Backend Services

| Language | Service | Lines of Code (est.) | Purpose |
|----------|---------|---------------------|---------|
| **Go** | Execution Core | ~5,000+ | API gateway, order routing, exchange APIs |
| **Python** | Strategy Engine | ~3,000+ | Strategy evaluation, backtesting, AI agents |
| **Java** | Risk Manager | ~1,500+ | Position tracking, PnL, risk limits |
| **C++** | Signal Core | ~1,000+ | High-performance indicators, order book |
| **TypeScript** | Frontend | ~10,000+ | UI, API clients, state management |

### Why Polyglot?

1. **Go**: Excellent for concurrent API handling, WebSocket streaming
2. **Python**: Best for ML/AI, data science, strategy development
3. **Java**: Enterprise-grade risk management, strong typing
4. **C++**: Maximum performance for computational-heavy tasks
5. **TypeScript**: Modern frontend development

---

## Communication Protocols

| Service A → Service B | Protocol | Port |
|----------------------|----------|------|
| Frontend → Go | REST/HTTP | 8080 |
| Frontend → Go | WebSocket | 8081 |
| Go → Python | REST/HTTP | 5000 |
| Go → Java | gRPC | 50052 |
| Go → C++ | Redis Pub/Sub | 6379 |
| Go → PostgreSQL | SQL | 5432 |
| All → Redis | Redis Protocol | 6379 |

---

## Confirmation Summary

✅ **C++ Backend**: Confirmed - [`cpp-signal-core/src/`](file:///d:/signal-ops/cpp-signal-core/src/)
- `indicators.cpp`, `order_book.cpp`, `signal_processor.cpp`

✅ **Java Backend**: Confirmed - [`java-risk-manager/src/main/java/`](file:///d:/signal-ops/java-risk-manager/src/main/java/io/signalops/risk/)
- `RiskManagerServer.java`, `PositionTracker.java`, `PnLCalculator.java`

✅ **Python Backend**: Confirmed - [`python-strategy-engine/`](file:///d:/signal-ops/python-strategy-engine/)
- `grpc_server.py`, `strategy_evaluator.py`, `backtest_engine.py`

✅ **Go Backend**: Confirmed - [`go-execution-core/`](file:///d:/signal-ops/go-execution-core/)
- `main.go`, `rest_handlers.go`, `portfolio_handlers.go`, `binance.go`

✅ **Frontend API Integration**: Confirmed - [`frontend/src/lib/api/`](file:///d:/signal-ops/frontend/src/lib/api/)
- 9 TypeScript API client files connecting to all backend services

---

## Conclusion

The SignalOps platform is a **true polyglot microservices architecture** with:
- **Go** as the primary API gateway (port 8080)
- **Python** for strategy/AI (port 5000)
- **Java** for risk management (gRPC port 50052)
- **C++** for high-performance computing (Redis pub/sub)
- **Next.js/TypeScript** frontend consuming all services via REST APIs

All services are properly containerized with optimized Dockerfiles and connected via a combination of REST, gRPC, WebSocket, and Redis pub/sub protocols.
