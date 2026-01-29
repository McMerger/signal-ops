# SignalOps Terminal

**Event-Aware Algorithmic Trading Engine**

The only open-source trading system that filters fundamentals, prediction markets, and on-chain flows through a single transparent decision engine—wrapped in an immersive, high-fidelity WebGL interface.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![WebAssembly](https://img.shields.io/badge/Wasm-Enabled-654FF0.svg)](https://webassembly.org/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020.svg)](https://workers.cloudflare.com/)

---

## ✨ Overview

SignalOps is a **cloud-native implementation of a polyglot trading engine**. It treats every decision as an explicit logic tree, optimized for the edge.

### Key Differentiators

| Feature | SignalOps | Traditional Bots |
|---------|-----------|------------------|
| **Data Sources** | 5 (Fundamentals, Prediction Markets, On-Chain, Technical, News) | 1-2 |
| **Architecture** | **Serverless Polyglot** (TypeScript, Python, C++) | Monolithic Containers |
| **Speed** | **0ms Cold Starts** (Workers) + Wasm Signals | Heavy JVM/Docker Startup |
| **UI/UX** | High-Signal, Data-Dense Dashboards | Static dashboards |

---

## 🏗️ Architecture (The "Trinity" Stack)

We utilize a **Cloudflare-native architecture** that leverages the best language for each task:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     FRONTEND (Cloudflare Pages)                          │
│  Next.js 16 + React 19 + TypeScript + Tailwind CSS                      │
│  ├── Recharts (Data Viz) | Zustand State                                │
└─────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼ RPC / HTTP
┌─────────────────────────────────────────────────────────────────────────┐
│                  EXECUTION CORE (Cloudflare Workers)                     │
│                           Language: TypeScript                          │
│  • API Gateway & Routing                                                │
│  • Portfolio Management (D1 Database)                                   │
│  • Risk Manager Logic (Ported from Java)                                │
└─────────────────────────────────────────────────────────────────────────┘
           │                                          │
           ▼ Async Binding                            ▼ Wasm Binding
┌───────────────────────────────┐      ┌──────────────────────────────────┐
│   STRATEGY ENGINE (Workers)   │      │     SIGNAL CORE (Workers)        │
│      Language: Python         │      │     Language: C++ (Wasm)         │
│  • Data Science / ML Logic    │      │  • Order Book Filtering          │
│  • Prediction Market Agents   │      │  • High-Frequency Indicators     │
│  • Probabilistic Modeling     │      │  • SIMD Optimizations            │
└───────────────────────────────┘      └──────────────────────────────────┘
```

### Service Topology

| Service | Language | Hosted On | Role | Status |
|---------|----------|-----------|------|--------|
| **Frontend** | TypeScript | Cloudflare Pages | Dashboard, Visualization, Auth | ✅ Live |
| **Execution Core** | TypeScript | Cloudflare Workers | API, Risk, Portfolio, User Mgmt | ✅ Live |
| **Strategy Engine**| Python | Cloudflare Workers | Complex Strategy Logic, Data Aggregation | 🚧 Porting |
| **Signal Engine** | C++ (Wasm) | Cloudflare Workers | Compute-intensive Signal Processing | 🚧 Wasm Build |

---

## 🎨 Frontend: The Terminal Experience

The frontend is built for **sensory immersion**, featuring 8 unique public pages and 10+ authenticated pages.

*(See previous documentation for detailed aesthetic pillars)*

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Docker (for local development of DB/Redis)
- Cloudflare Wrangler (`npm install -g wrangler`)

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
npm run dev

# Execution Core (Worker)
cd workers/execution-core
npm install
npx wrangler dev

# Python Strategy
cd python-strategy-engine
# (Follow specific python setup)
```

---

## 📡 API Reference

### Execution Core (Port 8787)

The new TypeScript core replaces the legacy Go API.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/portfolio/positions` | GET | Current positions & PnL |
| `/api/v1/portfolio/risk` | GET | Risk metrics & exposure |
| `/api/v1/portfolio/performance` | GET | Strategy win rates |
| `/api/v1/market/quotes` | GET | Real-time quotes (Mock) |

---

## 📈 Roadmap

### ✅ Completed

- [x] **Stack Migration**: Consolidated Go/Java services into TypeScript Cloudflare Workers.
- [x] **Frontend**: Next.js 16 + WebGL.
- [x] **Risk Logic**: Ported Java Risk Manager logic to TypeScript.
- [x] **Infrastructure**: Docker Compose + Wrangler integration.

### 🚧 In Progress

- [ ] **Strategy Engine**: Full port of Python logic to Cloudflare Python Workers.
- [ ] **Signal Core**: Compiling C++ order book logic to Wasm.
- [ ] **Database**: Migration from local Postgres to Cloudflare D1 (in production).

### 📋 Planned

- [ ] **Mobile Optimization**: High-performance WebGL on mobile.
- [ ] **SaaS Mode**: Multi-tenant database schema.
- [ ] **AI Integration**: LLM-based trade analysis.
