# SignalOps Project Structure

## Overview

This document describes the complete directory structure of the SignalOps polyglot trading platform.

---

## 📁 Root Directory Structure

```
signal-ops/
├── 📄 Core Documentation
│   ├── README.md                    # Main project documentation
│   ├── LICENSE                      # MIT License
│   ├── docker-compose.yml           # Multi-service orchestration
│   ├── Makefile                     # Build automation
│   ├── .env.example                 # Environment variables template
│   └── .gitignore                   # Git ignore patterns
│
├── 🐍 Python Strategy Engine
│   └── python-strategy-engine/      # Strategy evaluation & backtesting
│       ├── agents/                  # Trading agents (Graham, Event-Driven, Trend)
│       ├── market_data/             # Data integrations (Polymarket, Yahoo, DeFiLlama)
│       ├── grpc_server.py           # gRPC service
│       ├── strategy_evaluator.py    # Multi-agent consensus
│       ├── backtest_engine.py       # Historical validation
│       └── requirements.txt         # Python dependencies
│
├── 🔷 Go Execution Core
│   └── go-execution-core/           # Order routing & execution
│       ├── exchanges/               # Exchange integrations
│       │   ├── binance.go          # Binance REST + WebSocket
│       │   ├── binance_extended.go # Advanced Binance features
│       │   ├── coinbase.go         # Coinbase Pro integration
│       │   ├── kraken.go           # Kraken integration
│       │   └── exchange_factory.go # Exchange factory pattern
│       ├── handlers/                # HTTP/REST handlers
│       │   ├── rest_handlers.go    # Core REST endpoints
│       │   ├── strategy_handlers.go # Strategy management
│       │   ├── portfolio_handlers.go # Portfolio operations
│       │   ├── polymarket_handlers.go # Prediction markets
│       │   ├── data_source_handlers.go # External data sources
│       │   ├── indicator_handlers.go # Technical indicators
│       │   ├── performance_handlers.go # Performance metrics
│       │   ├── python_strategy_handlers.go # Python integration
│       │   └── strategy_engine_handlers.go # Strategy engine ops
│       ├── grpc_clients/            # gRPC client connections
│       │   ├── python_client.go    # Python gRPC client
│       │   ├── java_client.go      # Java gRPC client
│       │   └── cpp_signal_subscriber.go # C++ Redis subscriber
│       ├── data_sources/            # External data integrations
│       │   ├── polymarket.go       # Polymarket API
│       │   ├── yahoo_finance.go    # Yahoo Finance API
│       │   ├── defillama.go        # DeFiLlama API
│       │   ├── dune.go             # Dune Analytics API
│       │   ├── sec_edgar.go        # SEC EDGAR API
│       │   ├── news_api.go         # News API integration
│       │   └── manager.go          # Data source manager
│       ├── pb/                      # Generated protobuf code
│       ├── main.go                  # Application entry point
│       ├── types.go                 # Core type definitions
│       ├── websocket_server.go      # WebSocket server
│       ├── strategy_engine.go       # Strategy execution engine
│       ├── audit_logger.go          # Audit logging
│       ├── indicators.go            # Technical indicators
│       ├── signal_fusion.go         # Multi-source signal fusion
│       ├── migrations.go            # Database migrations
│       ├── go.mod                   # Go dependencies
│       └── Dockerfile               # Container build
│
├── ☕ Java Risk Manager
│   └── java-risk-manager/           # Risk management & compliance
│       ├── src/main/java/           # Java source code
│       │   └── io/signalops/risk/
│       │       ├── RiskManagerServer.java
│       │       ├── PositionTracker.java
│       │       ├── PnLCalculator.java
│       │       └── RiskLimits.java
│       ├── pom.xml                  # Maven configuration
│       └── Dockerfile               # Container build
│
├── ⚡ C++ Signal Core
│   └── cpp-signal-core/             # High-performance signal processing
│       ├── include/signalops/       # Header files
│       │   ├── order_book.h
│       │   ├── indicators.h
│       │   └── redis_interface.h
│       ├── src/                     # Implementation files
│       │   ├── order_book.cpp
│       │   ├── indicators.cpp       # SIMD-optimized (AVX2)
│       │   ├── redis_interface.cpp
│       │   └── main.cpp
│       ├── CMakeLists.txt           # Build configuration
│       └── Dockerfile               # Container build
│
├── 🎨 TypeScript Frontend
│   └── frontend/                    # Next.js 14 dashboard
│       ├── src/
│       │   ├── app/                 # Next.js app router
│       │   ├── components/          # React components
│       │   ├── hooks/               # React Query hooks
│       │   ├── lib/                 # Utilities & API clients
│       │   └── styles/              # Global styles
│       ├── package.json             # Node dependencies
│       ├── tsconfig.json            # TypeScript config
│       └── next.config.js           # Next.js config
│
├── 📡 Protocol Definitions
│   └── proto/                       # gRPC protobuf definitions
│       ├── execution.proto          # Execution service (Python)
│       ├── risk.proto               # Risk service (Java)
│       ├── generate.sh              # Proto generation script (Linux)
│       └── generate.ps1             # Proto generation script (Windows)
│
├── 🗄️ Database
│   └── db/                          # Database migrations & schemas
│       └── migrations/              # SQL migration files
│
├── ☸️ Kubernetes Deployment
│   └── k8s-deploy/                  # Kubernetes manifests
│       ├── deployment.yaml
│       ├── service.yaml
│       └── README.md
│
├── 📚 Documentation
│   └── docs/                        # Additional documentation
│       ├── QUICKSTART.md            # Quick start guide
│       └── README.md                # Docs index
│
├── 🔧 Scripts & Tools
│   ├── scripts/                     # Automation scripts
│   │   ├── quick-start.sh           # Quick start (Linux)
│   │   ├── quick-start.ps1          # Quick start (Windows)
│   │   ├── test-e2e.sh              # End-to-end tests
│   │   ├── test-integration.sh      # Integration tests
│   │   ├── test-integration.ps1     # Integration tests (Windows)
│   │   ├── verify-database.sh       # Database verification
│   │   ├── verify-database.ps1      # Database verification (Windows)
│   │   ├── test_e2e.py              # Python E2E tests
│   │   └── requirements.txt         # Test dependencies
│   │
│   └── tools/                       # Development tools
│       └── (future tooling)
│
├── 📦 Legacy Code
│   ├── legacy_dashboard/            # Deprecated Streamlit dashboard
│   │   └── (to be removed after Phase 4)
│   │
│   └── .archive/                    # Archived documentation
│       └── CLEANUP_REPORT.md
│
└── 🔐 Configuration
    ├── .github/                     # GitHub Actions CI/CD
    ├── .pre-commit-config.yaml      # Pre-commit hooks
    └── .dockerignore                # Docker ignore patterns
```

---

## 🎯 Service Ports

| Service | Port(s) | Protocol |
|---------|---------|----------|
| Frontend | 3000 | HTTP |
| Go Execution | 8080, 8081, 50050 | REST, WebSocket, gRPC |
| Python Strategy | 50051 | gRPC |
| Java Risk | 50052 | gRPC |
| C++ Signal | - | Redis Pub/Sub |
| PostgreSQL | 5432 | PostgreSQL |
| Redis | 6379 | Redis |

---

## 🚀 Quick Navigation

### Development
- **Start All Services**: `docker-compose up --build`
- **Quick Start**: `./scripts/quick-start.sh` (or `.ps1` on Windows)
- **Run Tests**: `./scripts/test-integration.sh`
- **Verify Database**: `./scripts/verify-database.sh`

### Documentation
- **Main README**: [README.md](../README.md)
- **Quick Start Guide**: [docs/QUICKSTART.md](../docs/QUICKSTART.md)
- **Kubernetes Deployment**: [k8s-deploy/README.md](../k8s-deploy/README.md)

### Service READMEs
- **Python**: [python-strategy-engine/README.md](../python-strategy-engine/README.md)
- **Go**: [go-execution-core/README.md](../go-execution-core/README.md)
- **Kubernetes**: [k8s-deploy/README.md](../k8s-deploy/README.md)

---

## 📊 Technology Stack by Service

### Python Strategy Engine
- **Language**: Python 3.11
- **Framework**: gRPC, NumPy, Pandas
- **Purpose**: Strategy evaluation, backtesting, multi-agent consensus

### Go Execution Core
- **Language**: Go 1.21
- **Framework**: Fiber, gRPC, WebSocket
- **Purpose**: Order routing, market data streaming, API gateway

### Java Risk Manager
- **Language**: Java 17
- **Framework**: Maven, gRPC, JDBC
- **Purpose**: Risk management, position tracking, PnL calculation

### C++ Signal Core
- **Language**: C++ 20
- **Framework**: CMake, AVX2 SIMD
- **Purpose**: High-performance indicators, order book processing

### TypeScript Frontend
- **Language**: TypeScript 5
- **Framework**: Next.js 14, React 18, TailwindCSS
- **Purpose**: Real-time dashboard, strategy builder, trade monitoring

---

## 🔄 Data Flow

```
Frontend (TS)
    ↓ REST/WebSocket
Go Execution Core
    ├→ Python Strategy (gRPC)    # Strategy evaluation
    ├→ Java Risk (gRPC)          # Risk checks
    └→ C++ Signal (Redis)        # Technical indicators
         ↓
    PostgreSQL + Redis
```

---

## 📝 File Naming Conventions

- **Go**: `snake_case.go` (e.g., `python_client.go`)
- **Python**: `snake_case.py` (e.g., `strategy_evaluator.py`)
- **Java**: `PascalCase.java` (e.g., `RiskManagerServer.java`)
- **C++**: `snake_case.cpp/.h` (e.g., `order_book.cpp`)
- **TypeScript**: `kebab-case.ts/.tsx` (e.g., `backend-features-view.tsx`)
- **Scripts**: `kebab-case.sh/.ps1` (e.g., `quick-start.sh`)
- **Docs**: `UPPERCASE.md` or `kebab-case.md`

---

## 🏗️ Build Artifacts (Ignored)

The following directories contain build artifacts and are gitignored:

- `java-risk-manager/target/` - Maven build output
- `cpp-signal-core/build/` - CMake build output
- `frontend/.next/` - Next.js build cache
- `**/__pycache__/` - Python bytecode
- `**/node_modules/` - Node.js dependencies

---

## 📖 Additional Resources

- **Architecture Diagram**: See [README.md](../README.md#architecture)
- **API Documentation**: See service-specific READMEs
- **Deployment Guide**: See [k8s-deploy/README.md](../k8s-deploy/README.md)
- **Contributing**: See [.github/CONTRIBUTING.md](../.github/CONTRIBUTING.md) (if exists)

---

**Last Updated**: 2025-11-28
**Version**: 1.0.0 (Full Polyglot Implementation Complete)
