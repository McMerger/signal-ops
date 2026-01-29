# SignalOps Execution Core

**Part of the SignalOps Terminal "Trinity" Stack**

This is the **Execution Core** service, running on Cloudflare Workers (TypeScript). It implements the deterministic execution logic, API routing, and risk enforcement described in the main repository documentation.

For full architectural context, investment principles, and setup instructions, please refer to the [Root Documentation](../../README.md).

---

## 🏗️ Role in Architecture

As defined in the main README:

```mermaid
graph TD
    Execution["EXECUTION CORE (Cloudflare Workers)"]
    Frontend[FRONTEND (Pages)]
    Research[RESEARCH CORE]

    Research -->|Intents| Execution
    Execution -->|API Data| Frontend
```

* **Runtime**: Cloudflare Workers (TypeScript)
* **Database**: Cloudflare D1 (`SIGNAL_DB`) for portfolio state.
* **Risk**: Enforces "Margin of Safety" checks.
* **Research**: Exposes Kimi K2.5 endpoints.

## 📡 API Reference

This worker implements the `Execution Core` endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/portfolio/positions` | GET | Current positions & PnL |
| `/api/v1/portfolio/risk` | GET | Risk metrics & exposure |
| `/api/v1/portfolio/performance` | GET | Strategy win rates |
| `/api/v1/research/intrinsic-value` | GET | Intrinsic value, margin of safety |
| `/api/v1/research/prediction` | GET | Prediction market summary |
| `/api/v1/research/decision-tree` | GET | Latest decision tree |
| `/api/v1/strategy/signals` | GET | Reference strategy signals |
| `/api/v1/strategy/orders` | POST | Order submission |

## 🚀 Development

```bash
# Install dependencies
npm install

# Run local development server
npx wrangler dev
```
