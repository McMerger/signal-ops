# SignalOps Terminal

**Event-Aware Algorithmic Trading Engine**

SignalOps is an open-source trading system that routes fundamentals, prediction markets, and on-chain flows through a single transparent decision engine. At its core, it uses a **Kimi K2.5–based research layer**, combined with **Benjamin Graham–style value rules** and a **high-signal, data-dense web interface**. The system includes a fully specified reference strategy with backtests and a live execution path.

---

## ✨ Overview

SignalOps is a cloud-native, polyglot trading engine. Every trade decision is represented as an explicit logic tree:

1. **Kimi K2.5** performs long-context research and orchestration.
2. **Graham-style intrinsic value rules** determine what is investable.
3. **Real-time prediction markets and on-chain flows** shape conviction, sizing, and timing.
4. **Cloudflare Workers** handle deterministic execution at the edge via TypeScript and WebAssembly.

---

## 🏗️ Architecture

SignalOps uses a **Cloudflare-native architecture** that segregates duties between research, execution, and strategy logic.

```mermaid
graph TD
    subgraph Research["RESEARCH CORE (Kimi K2.5)"]
        F1[Fundamental Valuation Agent]
        P1[Prediction Market Agent]
        O1[On-chain / Flows Agent]
        R1[Risk & Policy Agent]
    end

    subgraph Execution["EXECUTION CORE (Cloudflare Workers)"]
        E1[API Gateway & Routing]
        E2[Portfolio Mgmt (D1 DB)]
        E3[Risk Enforcement]
    end

    subgraph Workers["WORKER POOL"]
        S1[STRATEGY ENGINE (Python)]
        S2[SIGNAL CORE (C++ Wasm)]
    end

    Frontend[FRONTEND (Pages)]

    Research -->|Intents| Execution
    Execution -->|Async Binding| S1
    Execution -->|Wasm Binding| S2
    Execution -->|API Data| Frontend
```

### Service Topology

| Service | Language | Hosted On | Role | Status |
|---------|----------|-----------|------|--------|
| **Frontend** | TypeScript | Cloudflare Pages | Dashboard, Visualization, Auth | ✅ Live |
| **Execution Core** | TypeScript | Cloudflare Workers | API, Risk, Portfolio, User Mgmt | ✅ Live |
| **Strategy Engine**| Python | Cloudflare Workers | Deterministic Strategy, Data Aggregation | 🚧 Porting |
| **Signal Engine** | C++ (Wasm) | Cloudflare Workers | Compute-intensive Signal Processing | 🚧 Wasm Build |
| **Research Core** | Kimi K2.5 | External | Long-context research, Orchestration, Policy | ✅ Initial |

---

## 🧠 Investment Principles

SignalOps encodes a clear, opinionated philosophy:

* **Intrinsic Value First**: Assets are evaluated on fundamentals (earnings power, balance sheet strength) to estimate intrinsic value.
* **Margin of Safety**: The engine only considers trades where market price is sufficiently below intrinsic value.
* **Mechanical, Basket-Based**: Portfolios are built as baskets of undervalued assets with rules-based weights to minimize discretion.
* **Investing vs Speculation**: Prediction markets and technicals are strictly overlays—they affect sizing/timing but cannot override the fundamental thesis.

---

## 🎨 Frontend: High-Signal Terminals

The frontend is built for **speed and clarity**, not visual tricks.

* Startlingly fast **Next.js 16** implementation on the edge.
* **Intrinsic Value vs Price** plots with margin-of-safety visualization.
* **Prediction Market** probability curves and category tags.
* **Inspectable Decision Trees** showing exactly *why* a trade was proposed.

---

## 🚀 Quick Start

### Prerequisites

* Node.js 20+
* Docker (for local DB/Redis)
* Cloudflare Wrangler (`npm install -g wrangler`)

### Development (Local)

We use a unified `docker-compose` setup that spins up the database and a local Wrangler development proxy.

```bash
# Clone the repository
git clone https://github.com/McMerger/signal-ops.git
cd signal-ops

# Start everything (Frontend + Workers + DB)
docker-compose up -d

# View Logs
docker-compose logs -f execution-core
```

### Manual Service Start

```bash
# Frontend
cd frontend
npm install && npm run dev

# Execution Core (Worker)
cd workers/execution-core
npm install && npx wrangler dev

# Python Strategy
cd python-strategy-engine
# (See python-strategy-engine/README.md for setup)
```

---

## 📡 API Reference

### Execution Core (Port 8787)

The new TypeScript core replaces the legacy Go API and exposes specialized research endpoints.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/portfolio/positions` | GET | Current positions & PnL |
| `/api/v1/portfolio/risk` | GET | Risk metrics & exposure |
| `/api/v1/portfolio/performance` | GET | Strategy win rates |
| `/api/v1/research/intrinsic-value` | GET | Intrinsic value, margin of safety, Graham flags |
| `/api/v1/research/prediction` | GET | Prediction market summary probabilities |
| `/api/v1/research/decision-tree` | GET | Latest decision tree for an asset or portfolio |

---

## 📈 Roadmap

### ✅ Completed

- [x] **Stack Migration**: Consolidated Go/Java services into TypeScript Cloudflare Workers.
* [x] **Frontend**: Next.js 16 + Tailwind CSS (High Performance).
* [x] **Cleanup**: Removed legacy Go/Java services and WebGL dependencies.
* [x] **Research Core**: Initial Kimi K2.5 integration (fundamental + prediction agents).
* [x] **Infrastructure**: Docker Compose + Wrangler integration.

### 🚧 In Progress

- [ ] **Strategy Engine**: Full port of Python strategy logic to Cloudflare Python Workers.
* [ ] **Signal Core**: Compiling C++ order book logic to Wasm.
* [ ] **Database**: Migration from local Postgres to Cloudflare D1 (in production).

### 📋 Planned

- [ ] **Mobile Optimization**: Responsive high-density data views (no 3D).
* [ ] **SaaS Mode**: Multi-tenant database schema.
* [ ] **AI Integration**: Deeper LLM support for human-in-the-loop review.
