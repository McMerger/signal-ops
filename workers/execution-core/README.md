# Execution Core

**Cloudflare Worker (TypeScript)**

The Execution Core is the central nervous system of the SignalOps Terminal. It handles API routing, portfolio state management, and strict risk enforcement.

## Architecture

* **Runtime**: Cloudflare Workers (TypeScript)
* **Database**: Cloudflare D1 (`SIGNAL_DB`) for portfolio state and orders.
* **Storage**: Cloudflare KV (`SIGNAL_KV`) for session caching.
* **Role**: Explicitly deterministic execution and policy enforcement.

## API Reference

### Portfolio

* `GET /api/v1/portfolio/positions`: Current positions & PnL
* `GET /api/v1/portfolio/risk`: Risk metrics & exposure

### Research (Kimi K2.5)

* `GET /api/v1/research/intrinsic-value`: Graham-style fundamental analysis
* `GET /api/v1/research/prediction`: Prediction market probabilities
* `GET /api/v1/research/decision-tree`: Logic tree for latest decisions

### Strategy

* `GET /api/v1/strategy/signals`: Reference strategy outputs
* `POST /api/v1/strategy/orders`: Order submission

## Development

```bash
npm install
npx wrangler dev
```
