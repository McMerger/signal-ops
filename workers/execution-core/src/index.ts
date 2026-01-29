import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { PortfolioController } from './controllers/PortfolioController'

type Bindings = {
    SIGNAL_DB: D1Database;
    SIGNAL_KV: KVNamespace;
}

const app = new Hono<{ Bindings: Bindings }>()

// Middleware
app.use('*', cors())

// Controllers
const portfolioController = new PortfolioController()

app.get('/', (c) => {
    return c.json({
        service: 'SignalOps Execution Core',
        status: 'operational',
        runtime: 'Cloudflare Workers (TypeScript)',
        ported_from: ['Go', 'Java']
    })
})

// === API V1 Routes ===

// Portfolio Group
const portfolio = new Hono<{ Bindings: Bindings }>()
portfolio.get('/positions', (c) => portfolioController.getPositions(c))
portfolio.get('/performance', (c) => portfolioController.getPerformance(c))
portfolio.get('/risk', (c) => portfolioController.getRiskMetrics(c))
// portfolio.get('/pnl', ...) - To implement if needed
// portfolio.get('/balances', ...) - To implement if needed

// Mount groups
app.route('/api/v1/portfolio', portfolio)

// Market Data Group (Stub for future migration)
const market = new Hono<{ Bindings: Bindings }>()
market.get('/quotes', (c) => c.json({ message: 'Market quotes (Not implemented)' }))
app.route('/api/v1/market', market)

// Strategy Group (Stub)
const strategies = new Hono<{ Bindings: Bindings }>()
strategies.get('/', (c) => c.json({ message: 'Active strategies (Not implemented)' }))
app.route('/api/v1/strategies', strategies)

export default app
