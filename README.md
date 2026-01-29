***

# SignalOps Terminal

Event-Aware Algorithmic Trading Engine

SignalOps is an open-source trading system that routes fundamentals, prediction markets, and on-chain flows through a single transparent decision engine. It is designed to handle a broad range of asset classes in depth, including equities, ETFs, futures, options, crypto, and protocol-level on-chain assets. At its core, it uses a Kimi K2.5–based research layer, Benjamin Graham–style value rules, and a high-signal, data-dense web interface with a beginner-friendly default experience that can be gradually tuned into a full-featured professional terminal. The system includes a fully specified reference strategy with backtests and a live execution path.

***

## Overview

SignalOps is a cloud-native, polyglot trading engine. Every trade decision is represented as an explicit logic tree:

- Kimi K2.5 performs long-context research and orchestration across multiple asset classes.  
- Graham-style intrinsic value rules determine what is investable on the fundamental side.  
- Real-time prediction markets and on-chain flows shape conviction, sizing, and timing.  
- Cloudflare Workers handle deterministic execution at the edge.  
- A reference strategy ships with full backtesting and a live integration example.  
- The UI is designed so that complete beginners can use a simple, guided interface, while advanced users can unlock and customize full terminal-style views and tools.

***

## Investment Principles

SignalOps encodes an opinionated philosophy around value, events, and multi-asset coverage:

- Intrinsic value first  
  Assets are evaluated on fundamentals appropriate to their class (equity/ETF, futures, options, crypto, protocol tokens) to estimate intrinsic or fair value.

- Margin of safety  
  The engine only considers entries where market price or implied value is sufficiently favorable relative to intrinsic or modeled value. Thresholds are explicit and configurable, per asset class if needed.

- Mechanical, basket-based positioning  
  Portfolios are built as baskets of opportunities across asset classes, with rules-based weights and scheduled rebalancing. Discretion is minimized; rules are visible in code and in the UI.

- Investing vs speculation  
  Prediction markets, technicals, and microstructure are overlays. They modulate conviction and position size but do not override the requirement for a defensible value or edge per asset.

- Asset-class awareness  
  Each asset class can attach its own valuation models, risk constraints, and liquidity rules. The system is designed so that an equity, an ETF, a futures contract, or a protocol token is handled through a consistent abstraction, but with class-specific logic.

***

## Reference Strategy: Value + Events (Multi-Asset Ready)

The repository ships with a reference strategy as a concrete example. It focuses initially on a narrower universe, but the design assumes broader multi-asset coverage.

- Universe  
  - A defined list of liquid equities and on-chain assets, with configuration and filters in the repo.  
  - The framework supports introducing ETFs, futures, options, and new on-chain protocols by extending data adapters and valuation modules.

- Entry rules  
  - Asset passes Graham-style or class-appropriate filters (profitability, leverage, stability, or protocol health).  
  - Price or implied value trades at a favorable level relative to estimated intrinsic value or fair value.  
  - No blocked events (large unlocks, negative governance, corporate actions outside constraints) in a configurable window.

- Prediction-market overlay  
  - Sizing is increased when prediction markets imply a high probability of favorable events (earnings, macro outcomes, protocol upgrades).  
  - Sizing is reduced or entries are skipped when markets materially disagree with the underlying thesis.

- Exit and rebalance rules  
  - Positions are trimmed or closed when the margin of safety closes, risk constraints are hit, or asset-class-specific constraints trigger.  
  - Periodic rebalance reconciles actual weights to target weights across the full set of supported assets, with turnover and cost controls.

The reference implementation is kept small enough to run and understand easily, but the code structure is meant to be extended to additional asset classes.

***

## Kimi K2.5 Research Core

The research and orchestration layer, built around Kimi K2.5, sits above the Workers stack and is explicitly multi-asset:

- Long-context research  
  Kimi ingests filings, fund/ETF documentation, futures and options specs, protocol documentation, macro material, and on-chain analytics to maintain structured dossiers per asset and asset class.

- Tool-based data fusion  
  - Fundamentals: financial statements, fund holdings, protocol metrics, and class-specific valuation models.  
  - Prediction markets: contract data, implied probabilities, and liquidity metrics across event types and underlying assets.  
  - On-chain flows: contract activity, large transfers, governance votes, unlock schedules, and cross-asset flow patterns.

- Agent swarm  
  Different agents specialize in fundamentals, prediction markets, on-chain/flows, and technical/microstructure, with awareness of asset class. Their outputs are merged into a ranked decision list and an explicit decision tree.

- Policy and risk  
  A dedicated risk and policy layer enforces margin-of-safety and exposure limits, with room for per-asset-class constraints (e.g., leverage limits for derivatives, position caps for illiquid tokens).

Kimi generates research and proposals that reflect the breadth and depth of supported asset types; execution is performed only via deterministic, testable rules.

***

## Prediction-Market Behaviour

Prediction markets are treated as a first-class, testable signal across multiple domains:

- Explicit signal design  
  - Raw prices are mapped to probabilities and normalized per contract type and asset class linkage.  
  - Liquidity, spread, and recent order flow are tracked as features.

- Bias-aware logic  
  - The strategy can apply category-specific adjustments and different treatments depending on the asset class or event type a market references.

- Role in the strategy  
  - Prediction markets primarily influence conviction and position sizing across the portfolio.  
  - They can veto or downsize trades that sharply contradict the fundamental or structural thesis, whether for an equity, ETF, futures contract, or protocol asset.

***

## Architecture

SignalOps uses a Cloudflare-native architecture, designed to be multi-asset from the start.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                       RESEARCH CORE (Kimi K2.5)                        │
│  • Fundamental Valuation Agent (per asset class)                        │
│  • Prediction Market Agent                                              │
│  • On-chain / Flows Agent                                               │
│  • Risk & Policy Agent                                                  │
│  Outputs: research artifacts and trade "intents" across asset classes   │
└─────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼ intents / research APIs
┌─────────────────────────────────────────────────────────────────────────┐
│             EXECUTION CORE (Cloudflare Workers, TypeScript)            │
│  • API Gateway & Routing                                               │
│  • Portfolio & Order State (D1 Database, multi-asset schema)           │
│  • Risk Enforcement (limits, exposure, per-asset-class rules)          │
└─────────────────────────────────────────────────────────────────────────┘
           │                                   │
           ▼ Async Binding                     ▼ Wasm Binding
┌───────────────────────────────┐      ┌──────────────────────────────────┐
│   STRATEGY ENGINE (Workers)   │      │      SIGNAL CORE (Workers)       │
│      Language: Python         │      │      Language: C++ (Wasm)        │
│  • Deterministic Strategy     │      │  • Order Book Filtering           │
│    Logic (reference strategy, │      │  • High-Frequency Indicators      │
│    multi-asset aware)         │      │  • SIMD Accelerated Metrics       │
└───────────────────────────────┘      └──────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│        FRONTEND (Cloudflare Pages, Next.js + TypeScript + Tailwind)    │
│  • Beginner-friendly default dashboards                                │
│  • Advanced, configurable terminal-style layouts for power users       │
│  • Intrinsic value vs price / fair value per asset class               │
│  • Prediction-market curves and flows                                  │
│  • On-chain activity and cross-asset risk metrics                      │
│  • Decision-tree views for each trade                                  │
│  • Strategy overview and performance reports                           │
└─────────────────────────────────────────────────────────────────────────┘
```

### Service Topology

| Service         | Language        | Hosted On           | Role                                                   | Status       |
|----------------|-----------------|---------------------|--------------------------------------------------------|-------------|
| Frontend       | TypeScript      | Cloudflare Pages    | Beginner-to-pro UI, dashboard, visualization, auth     | Live        |
| Execution Core | TypeScript      | Cloudflare Workers  | API, risk, multi-asset portfolio and order management  | Live        |
| Strategy Engine| Python          | Cloudflare Workers  | Deterministic strategy logic, backtest parity          | In progress |
| Signal Engine  | C++ (Wasm)      | Cloudflare Workers  | Compute-intensive signal processing                    | In progress |
| Research Core  | Kimi K2.5       | External / managed  | Long-context research, orchestration, policy           | Initial     |

***

## Backtesting and Evaluation

SignalOps includes a minimal but realistic backtesting stack for the reference strategy, with an eye to multi-asset extension:

- Historical data  
  - Price series and corporate events for the defined equity universe.  
  - Historical prediction-market time series for selected contracts.  
  - On-chain event logs for supported protocol assets.  
  - Structure supports adding data for other asset classes as adapters are implemented.

- Backtest engine  
  - Simulates the same event stream the live system would see.  
  - Applies the same deterministic, multi-asset-aware strategy logic used in production.  
  - Models transaction costs, slippage, and basic execution assumptions.

- Metrics  
  - Cumulative and annualized returns.  
  - Volatility, Sharpe, max drawdown.  
  - Turnover, hit rate, average win/loss.  
  - Exposure by asset, sector, and asset class.

Backtest reports for the reference strategy are generated as artifacts and exposed in the UI and docs.

***

## Live Trading Path

SignalOps is designed to move strategies from backtest to live in a controlled way:

- Paper trading / sandbox mode  
  - Uses the Execution Core to route orders to a paper or sandbox environment.  
  - Logs all decisions and fills for comparison against backtested expectations.

- Live integration example  
  - Includes a minimal broker/exchange adapter and configuration for a single venue.  
  - Shows how to connect to a live feed and send orders for at least one asset class, with a path to extend to others.

- Monitoring  
  - Dashboards compare backtested vs realized performance and slippage.  
  - All decisions are logged, along with decision trees and research context, across asset types.

***

## Frontend and UX: From Beginner to Power User

The UI is designed to be approachable for new users while still providing the depth expected by advanced traders:

- Beginner-friendly mode  
  - Simple default dashboard showing portfolio, PnL, and a small set of clearly explained metrics.  
  - Guided flows for creating and enabling strategies, with plain-language explanations of risk and behaviour.  
  - Reduced surface area: limited controls, safe defaults, and clear confirmations for any action.

- Advanced / pro mode  
  - Configurable, widget-based layouts for multiple watchlists, charts, order books, and strategy panels.  
  - Multi-asset views, custom filters, and saved workspaces.  
  - Deeper analytics panels (drawdowns, factor exposures, per-asset-class performance) and more direct controls.

- Progressive disclosure  
  - Users can start with the simplified interface and opt in to more advanced tools as they become comfortable.  
  - The same underlying system powers both views, so there is no separate “beginner app” and “pro app”; the interface grows with the user.

***

## Quick Start

### Prerequisites

- Node.js 20+  
- Docker (for local DB/Redis)  
- Cloudflare Wrangler (`npm install -g wrangler`)  
- Optional: credentials for a supported broker/exchange sandbox

### Development (Local)

```bash
# Clone the repository
git clone https://github.com/McMerger/signal-ops.git
cd signal-ops

# Start everything (Frontend + Workers + DB)
docker-compose up -d

# View logs
docker-compose logs -f execution-core
```

### Manual Service Start

```bash
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
```

***

## API Reference

### Execution Core (Port 8787)

| Endpoint                           | Method | Description                                                  |
|------------------------------------|--------|--------------------------------------------------------------|
| `/api/v1/portfolio/positions`      | GET    | Current positions and PnL (multi-asset)                     |
| `/api/v1/portfolio/risk`           | GET    | Risk metrics and exposure by asset and asset class          |
| `/api/v1/portfolio/performance`    | GET    | Strategy performance metrics                                 |
| `/api/v1/market/quotes`            | GET    | Real-time quotes (mock for local development)               |
| `/api/v1/research/intrinsic-value` | GET    | Intrinsic/fair value, margin of safety, class-aware flags   |
| `/api/v1/research/prediction`      | GET    | Prediction-market summary and adjusted probabilities        |
| `/api/v1/research/decision-tree`   | GET    | Latest decision tree for an asset or portfolio              |
| `/api/v1/strategy/signals`         | GET    | Reference strategy signals and target weights               |
| `/api/v1/strategy/orders`          | POST   | Submit strategy-generated orders for execution              |

***

## Roadmap

### Completed

- Migration to TypeScript Cloudflare Workers  
- Next.js + Tailwind frontend with data-dense layout  
- Beginner-friendly default UI layer  
- Removal of legacy Go/Java services  
- Docker Compose + Wrangler integration  
- Initial Kimi K2.5 research core (fundamental and prediction-market agents)  
- Definition and implementation of one reference strategy  
- Basic backtest engine and reporting for the reference strategy  

### In Progress

- Full port of Python strategy logic to Cloudflare Python Workers  
- C++ order-book and signal logic compiled to Wasm  
- Production-grade migration from local Postgres to Cloudflare D1  
- Expanded Kimi agents for on-chain and microstructure features  
- Hardened broker/exchange adapters and live monitoring  
- Advanced terminal-style UI customisation (saved layouts, multi-monitor support)  

### Planned

- Mobile-friendly high-density data views  
- Multi-tenant SaaS mode (segmented schemas)  
- Additional reference strategies and datasets across asset classes  
- Deeper AI support for explanations, scenario analysis, and human-in-the-loop review