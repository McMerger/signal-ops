SignalOps Terminal
Event-Aware Algorithmic Trading Engine

SignalOps is an open-source trading system that routes fundamentals, prediction markets, and on-chain flows through a single transparent decision engine. At its core, it uses a Kimi K2.5–based research layer, Benjamin Graham–style value rules, and a high-signal, data-dense web interface. The system includes a fully specified reference strategy with backtests and a live execution path.

Overview
SignalOps is a cloud-native, polyglot trading engine. Every trade decision is represented as an explicit logic tree:

Kimi K2.5 performs long-context research and orchestration.

Graham-style intrinsic value rules determine what is investable.

Real-time prediction markets and on-chain flows shape conviction, sizing, and timing.

Cloudflare Workers handle deterministic execution at the edge.

A reference strategy ships with full backtesting and a live integration example.

Investment Principles
SignalOps encodes an opinionated philosophy around value and events:

Intrinsic value first
Assets are evaluated on fundamentals (earnings power, balance sheet strength, growth quality) to estimate intrinsic value per instrument.

Margin of safety
The engine only considers entries where market price is sufficiently below intrinsic value. Discount thresholds are explicit and configurable.

Mechanical, basket-based positioning
Portfolios are built as baskets of undervalued assets with rules-based weights and scheduled rebalancing. Discretion is minimized; rules are visible in code and in the UI.

Investing vs speculation
Prediction markets, technicals, and microstructure are overlays. They modulate conviction and position size but do not override the requirement for fundamental value.

Reference Strategy: Value + Events
The repository ships with a reference strategy that makes the system concrete:

Universe

A defined list of liquid equities and on-chain assets.

Universe files and filters are part of the repo.

Entry rules

Asset passes Graham-style filters (profitability, leverage, and earnings stability).

Price trades below a configurable fraction of estimated intrinsic value.

No blocked on-chain events (large unlocks, negative governance) in a configurable window.

Prediction-market overlay

Sizing is increased when prediction markets imply a sufficiently high probability of a positive catalyst.

Sizing is reduced or entries are skipped when markets materially disagree with the fundamental thesis.

Exit and rebalance rules

Positions are trimmed or closed when margin of safety closes or risk constraints are hit.

Periodic rebalance reconciles actual weights to target weights, with turnover and cost controls.

All of these rules are implemented in the Python Strategy Engine and are testable via backtests and simulations.

Kimi K2.5 Research Core
The research and orchestration layer, built around Kimi K2.5, sits above the Workers stack.

Roles:

Long-context research
Kimi ingests filings, transcripts, protocol documentation, macro material, and on-chain analytics to maintain structured “dossiers” per asset.

Tool-based data fusion

Fundamentals: financial statements, valuation metrics, and Graham-style criteria.

Prediction markets: contract data, implied probabilities, and liquidity metrics.

On-chain flows: contract activity, large transfers, governance votes, and unlock schedules.

Agent swarm
Separate agents handle fundamentals, prediction markets, on-chain/flows, and technical/microstructure. Their outputs are merged into a ranked decision list and an explicit decision tree.

Policy and risk
A dedicated agent enforces margin-of-safety thresholds, exposure limits, diversification rules, and other portfolio policies. Its outputs are “intents” that are passed to the deterministic Strategy Engine and Execution Core.

Kimi generates research and proposals; execution is performed only via deterministic, testable rules.

Prediction-Market Behaviour
SignalOps treats prediction markets as a first-class, testable signal:

Explicit signal design

Raw prices are mapped to probabilities and normalized per contract type.

Liquidity, spread, and recent order flow are tracked as features.

Bias-aware logic

The strategy can apply category-specific adjustments where markets tend to be structurally optimistic or pessimistic.

This is parameterized and visible in configuration files.

Role in the strategy

Prediction markets primarily influence conviction and position sizing.

They can veto or downsize trades that sharply contradict the fundamental thesis.

Architecture
SignalOps uses a Cloudflare-native architecture that assigns each component a focused role.

text
┌─────────────────────────────────────────────────────────────────────────┐
│                       RESEARCH CORE (Kimi K2.5)                        │
│  • Fundamental Valuation Agent                                         │
│  • Prediction Market Agent                                             │
│  • On-chain / Flows Agent                                              │
│  • Risk & Policy Agent                                                 │
│  Outputs: research artifacts and trade "intents"                       │
└─────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼ intents / research APIs
┌─────────────────────────────────────────────────────────────────────────┐
│             EXECUTION CORE (Cloudflare Workers, TypeScript)            │
│  • API Gateway & Routing                                               │
│  • Portfolio & Order State (D1 Database)                               │
│  • Risk Enforcement (limits, exposure, sanity checks)                  │
└─────────────────────────────────────────────────────────────────────────┘
           │                                   │
           ▼ Async Binding                     ▼ Wasm Binding
┌───────────────────────────────┐      ┌──────────────────────────────────┐
│   STRATEGY ENGINE (Workers)   │      │      SIGNAL CORE (Workers)       │
│      Language: Python         │      │      Language: C++ (Wasm)        │
│  • Deterministic Strategy     │      │  • Order Book Filtering           │
│    Logic (reference strategy, │      │  • High-Frequency Indicators      │
│    backtest-compatible)       │      │  • SIMD Accelerated Metrics       │
└───────────────────────────────┘      └──────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│        FRONTEND (Cloudflare Pages, Next.js + TypeScript + Tailwind)    │
│  • High-signal, data-dense dashboards                                  │
│  • Intrinsic value vs price, margin of safety                          │
│  • Prediction-market curves and flows                                  │
│  • On-chain activity and risk metrics                                  │
│  • Decision-tree views for each trade                                  │
│  • Strategy overview and performance reports                           │
└─────────────────────────────────────────────────────────────────────────┘
Service Topology
Service	Language	Hosted On	Role	Status
Frontend	TypeScript	Cloudflare Pages	Dashboard, visualization, auth	Live
Execution Core	TypeScript	Cloudflare Workers	API, risk, portfolio, user management	Live
Strategy Engine	Python	Cloudflare Workers	Deterministic strategy logic, backtest parity	In progress
Signal Engine	C++ (Wasm)	Cloudflare Workers	Compute-intensive signal processing	In progress
Research Core	Kimi K2.5	External / managed	Long-context research, orchestration, policy	Initial
Backtesting and Evaluation
SignalOps includes a minimal but realistic backtesting stack for the reference strategy:

Historical data

Price series and corporate events for the defined universe.

Historical prediction-market time series for a subset of contracts.

On-chain event logs for supported assets.

Backtest engine

Simulates the same event stream the live system would see.

Applies the same deterministic strategy logic used in production.

Models transaction costs, slippage, and basic execution assumptions.

Metrics

Cumulative and annualized returns.

Volatility, Sharpe, max drawdown.

Turnover, hit rate, average win/loss, exposure by asset and sector.

Backtest reports for the reference strategy are generated as artifacts (e.g., CSV/HTML reports) and exposed in the UI and docs.

Live Trading Path
SignalOps is designed to move a strategy from backtest to live in a controlled way:

Paper trading / sandbox mode

Uses the Execution Core to route orders to a paper or sandbox environment.

Logs all decisions and fills for comparison against backtested expectations.

Live integration example

The repo includes a minimal broker/exchange adapter and configuration for a single venue.

The adapter demonstrates authentication, order submission, status polling, and error handling.

Monitoring

Dashboards compare backtested vs realized performance and slippage.

All decisions are logged alongside their decision trees and research context.

Frontend
The frontend is built for speed, clarity, and inspection:

Strategy cards

Summary per strategy: rules, universe, risk controls, backtest metrics, live status.

Research and decision views

For any asset or trade, show fundamentals, prediction-market signals, on-chain events, and risk constraints that led to the decision.

Portfolio and risk

Current positions, exposures, and key risk metrics.

Historical performance and drawdown charts.

No 3D or visual noise, just data and explanations.

Quick Start
Prerequisites
Node.js 20+

Docker (for local DB/Redis)

Cloudflare Wrangler (npm install -g wrangler)

Optional: credentials for a supported broker/exchange sandbox

Development (Local)
A unified docker-compose setup spins up the database and a local Wrangler development proxy.

bash
# Clone the repository
git clone https://github.com/McMerger/signal-ops.git
cd signal-ops

# Start everything (Frontend + Workers + DB)
docker-compose up -d

# View logs
docker-compose logs -f execution-core
Manual Service Start
bash
# Frontend
cd frontend
npm install
npm run dev

# Execution Core (Worker)
cd workers/execution-core
npm install
npx wrangler dev

# Python Strategy Engine
cd python-strategy-engine
# (Follow specific Python setup and backtest instructions)
API Reference
Execution Core (Port 8787)
Endpoint	Method	Description
/api/v1/portfolio/positions	GET	Current positions and PnL
/api/v1/portfolio/risk	GET	Risk metrics and exposure
/api/v1/portfolio/performance	GET	Strategy performance metrics
/api/v1/market/quotes	GET	Real-time quotes (mock for local development)
/api/v1/research/intrinsic-value	GET	Intrinsic value, margin of safety, Graham flags
/api/v1/research/prediction	GET	Prediction-market summary and adjusted probabilities
/api/v1/research/decision-tree	GET	Latest decision tree for an asset or portfolio
/api/v1/strategy/signals	GET	Reference strategy signals and target weights
/api/v1/strategy/orders	POST	Submit strategy-generated orders for execution
Roadmap
Completed
Migration to TypeScript Cloudflare Workers

Next.js + Tailwind frontend with data-dense layout

Removal of legacy Go/Java services

Docker Compose + Wrangler integration

Initial Kimi K2.5 research core (fundamental and prediction-market agents)

Definition and implementation of one reference strategy

Basic backtest engine and reporting for the reference strategy

In Progress
Full port of Python strategy logic to Cloudflare Python Workers

C++ order-book and signal logic compiled to Wasm

Production-grade migration from local Postgres to Cloudflare D1

Expanded Kimi agents for on-chain and microstructure features

Hardened broker/exchange adapters and live monitoring

Planned
Mobile-friendly high-density data views

Multi-tenant SaaS mode (segmented schemas)

Additional reference strategies and datasets

Deeper AI support for explanations, scenario analysis, and human-in-the-loop review