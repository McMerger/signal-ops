***

# SignalOps Terminal

Event-Aware Algorithmic Trading Engine

SignalOps is an open-source trading system that routes fundamentals, prediction markets, and on-chain flows through a single transparent decision engine. It is designed to handle a broad range of asset classes in depth, including equities, ETFs, futures, options, crypto, and protocol-level on-chain assets. At its core, it uses a Kimi K2.5–based research layer, Benjamin Graham–style value rules, and a high-signal, data-dense web interface with a beginner-friendly default experience that can be gradually tuned into a full-featured professional terminal.

SignalOps is **not** yet a production-grade, capital-proven trading platform. It is a serious experimental framework and reference implementation for multi-asset, AI-assisted trading research and execution. Using it with significant real capital requires additional engineering, validation, and operational work beyond what is included here.

***

## What SignalOps Is (and Is Not)

To be explicit:

SignalOps **is**:

- A modern, multi-asset, cloud-native architecture for event-aware trading.  
- A playground for integrating a Kimi K2.5 research layer with real fundamentals, prediction markets, and on-chain data.  
- A reference implementation of one fully specified strategy, with backtests and an example live integration path.  
- A starting point for engineers and quants who want to build their own production stack.

SignalOps is **not yet**:

- A regulator-ready, broker-certified trading platform.  
- A system with multiple years of audited live performance or third-party verification.  
- A turnkey tool you should trust with large, unsupervised, real-money portfolios.  
- A replacement for institutional OMS/EMS platforms or fully mature retail brokers.

You should treat this project as a **research and prototyping environment**, not as an off-the-shelf solution for serious, unattended live trading.

***

## Safety and Risk Disclaimer

SignalOps is experimental software. It comes with no performance guarantees and no uptime guarantees.

- You are responsible for:
  - Deciding whether to connect it to any broker or exchange.  
  - Setting and supervising all risk limits.  
  - Monitoring positions and system behaviour in real time.

- Known limitations:
  - Limited exchange/broker integrations out of the box.  
  - Limited set of reference strategies and datasets.  
  - No formal stress testing under extreme market conditions.  
  - No guarantees around data provider outages, API changes, or latency spikes.

If you use SignalOps with real funds, start with very small size, treat it as a supervised experiment, and expect to build additional tooling, monitoring, and safeguards.

***

## Overview

SignalOps is a cloud-native, polyglot trading engine. Every trade decision is represented as an explicit logic tree:

- Kimi K2.5 performs long-context research and orchestration across multiple asset classes.  
- Graham-style intrinsic value rules determine what is investable on the fundamental side.  
- Real-time prediction markets and on-chain flows shape conviction, sizing, and timing.  
- Cloudflare Workers handle deterministic execution at the edge.  
- A reference strategy ships with backtesting and an example live integration path.  
- The UI is designed so that complete beginners can use a simple, guided interface, while advanced users can unlock and customize full terminal-style views and tools.  
- All environments (local, staging, production) are wired to real data sources; mock price feeds or synthetic ticks are intentionally excluded.

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

- Real data only  
  All strategy logic, backtests, and local runs are built around real historical and live market data. Mock data feeds are intentionally excluded to keep behaviour and edge evaluation grounded in actual market conditions.

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

The reference implementation is kept small enough to run and understand easily, but the code structure is meant to be extended to additional asset classes and additional strategies.

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

Kimi generates research and proposals; all actual orders are generated by deterministic, testable rules that you can inspect and modify.

***

## Prediction-Market Behaviour

Prediction markets are treated as a first-class, testable signal across multiple domains:

- Explicit signal design  
  - Raw prices are mapped to probabilities and normalized per contract type and asset class linkage.  
  - Liquidity, spread, and recent order flow are tracked as features.

- Bias-aware logic  
  - Strategies can apply category-specific adjustments and different treatments depending on the asset class or event type a market references.

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

***

## Backtesting and Evaluation

SignalOps includes a backtesting stack for the reference strategy, with an eye to multi-asset extension and strict adherence to real data:

- Historical data  
  - Price series and corporate events for the defined equity universe.  
  - Historical prediction-market time series for selected contracts.  
  - On-chain event logs for supported protocol assets.  
  - No synthetic price series or mock tick data; all backtests are run on real historical datasets.

- Backtest engine  
  - Simulates the same event stream the live system would see.  
  - Applies the same deterministic, multi-asset-aware strategy logic used in production.  
  - Models transaction costs, slippage, and basic execution assumptions.

- Metrics  
  - Cumulative and annualized returns.  
  - Volatility, Sharpe, max drawdown.  
  - Turnover, hit rate, average win/loss.  
  - Exposure by asset, sector, and asset class.

Backtest reports for the reference strategy are generated as artifacts and exposed in the UI and docs. They are not audited and should be treated as research results, not as promises of future performance.

***

## Live Trading Path (Experimental)

SignalOps is designed to move strategies from backtest to live in a controlled way, but this path is experimental and not a finished product.

- Paper trading / sandbox mode  
  - Uses the Execution Core to route orders to a paper or sandbox environment backed by real-time or delayed real market data.  
  - Logs all decisions and fills for comparison against backtested expectations.  
  - Intended for evaluation and debugging, not for production-scale capital.

- Example live integration  
  - Includes a minimal broker/exchange adapter and configuration for a single venue.  
  - Shows how to connect to a live feed and send orders for at least one asset class.  
  - This adapter is a reference implementation, not a certified production connector.

- Monitoring (baseline)  
  - Basic dashboards compare backtested vs realized performance and slippage.  
  - Decisions are logged, along with decision trees and research context, across asset types.

If you decide to run SignalOps live, keep allocations small, monitor it closely, and plan to build your own production-grade adapters, monitoring, and failover logic.

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
  - The same underlying system powers both views; there is no separate “beginner app” and “pro app”.

***

## Quick Start

### Prerequisites

- Node.js 20+  
- Docker (for local DB/Redis)  
- Cloudflare Wrangler (`npm install -g wrangler`)  
- Credentials or access tokens for at least one supported real data source  
- Optional: credentials for a supported broker/exchange sandbox

### Development (Local)

Local development uses real historical and/or live data sources configured via environment variables. No mock quote generators are included.

```bash
# Clone the repository
git clone https://github.com/McMerger/signal-ops.git
cd signal-ops

# Configure real data connections (see docs/config examples)
cp .env.example .env
# Edit .env with your data provider keys and endpoints

# Start everything (Frontend + Workers + DB)
docker-compose up -d

# View logs
docker-compose logs -f execution-core
```

***

## Roadmap (Honest Version)

### Completed

- Cloud-native, multi-asset architecture (Workers + Python + Wasm)  
- Next.js + Tailwind frontend with beginner and advanced views  
- Removal of legacy Go/Java services  
- Docker Compose + Wrangler integration  
- Initial Kimi K2.5 research core (fundamental and prediction-market agents)  
- Definition and implementation of one reference strategy  
- Backtest engine and reporting for the reference strategy using real historical data  

### In Progress

- Full port of Python strategy logic to Cloudflare Python Workers  
- C++ order-book and signal logic compiled to Wasm  
- Production-grade migration from local Postgres to Cloudflare D1  
- Expanded Kimi agents for on-chain and microstructure features  
- Hardened broker/exchange adapters and better live monitoring  
- More polished pro-level UI features (saved layouts, multi-monitor workflows)  

### Not Done Yet (But Needed for Serious Money)

- Multiple independent broker and exchange integrations  
- A small catalog of robust, fully tested strategies  
- Long, transparent live and paper-live track records  
- Formal stress testing across extreme market events  
- Compliance, audit trails, and operational runbooks  
- Third-party or institutional validation of strategies and infrastructure

Until those “not done yet” items are addressed, SignalOps should be treated as an advanced, open-source research and prototyping platform—not as a finished, production trading system for large, unsupervised capital.