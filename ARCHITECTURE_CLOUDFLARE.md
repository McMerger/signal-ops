# SignalOps Cloudflare Architecture (V2)

## Overview

This architecture is optimized for **Cloudflare's Edge Network**, utilizing a serverless, multi-language stack (Polyglot Workers) to minimize latency and cold starts.

## The Trinity Stack

| Component | Language | Hosted On | Role |
|-----------|----------|-----------|------|
| **Frontend** | TypeScript (Next.js) | Cloudflare Pages | Base UI, React Three Fiber visualization. |
| **Execution Core** | TypeScript | Cloudflare Workers | API Gateway, Routing, User Mgmt, Risk Logic. |
| **Strategy Logic** | Python | Cloudflare Workers (Py) | Data Science, Probabilistic logic, Backtesting. |
| **Signal Engine** | C++ (Wasm) | Cloudflare Workers | High-frequency order book filtering, Compute-heavy tasks. |

## Why this stack?

1. **TypeScript**: Native to Cloudflare Workers. 0ms cold starts. Best for IO-heavy tasks (Auth, APIs).
2. **Python**: Now supported natively in Workers. Essential for the data science ecosystem (Pandas, NumPy compatibility where supported).
3. **C++**: Compiles to WebAssembly (Wasm) for near-native performance on the edge.

## Directory Structure

```
e:/signal-ops/
├── frontend/                 # Next.js Pages
├── workers/
│   ├── execution-core/       # TypeScript Worker (Replacement for Go Core)
│   └── signal-core-wasm/     # Wasm Worker Config (Wraps C++ Core)
├── python-strategy-engine/   # Python Worker (Renamed/Configured)
├── cpp-signal-core/          # C++ Source Code
└── ...
```

## deprecated Services

- **Go Execution Core**: Replaced by `workers/execution-core`.
- **Java Risk Manager**: Logic to be ported to `workers/execution-core` (Risk module).

## Deployment

### Execution Core

```bash
cd workers/execution-core
npx wrangler deploy
```

### Strategy Engine

```bash
cd python-strategy-engine
npx wrangler deploy
```

### Signal Engine (Wasm)

```bash
# Build Wasm first
cd workers/signal-core-wasm
# (Run build script)
npx wrangler deploy
```
