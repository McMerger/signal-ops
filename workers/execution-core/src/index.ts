import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { PortfolioController } from './controllers/PortfolioController'
import { ResearchController } from './controllers/ResearchController'
import { StrategyController } from './controllers/StrategyController'
import { MarketController } from './controllers/MarketController'
import { Bindings } from './bindings'

const app = new Hono<{ Bindings: Bindings }>()

// Middleware
app.use('*', cors())

// Controllers
const portfolioController = new PortfolioController()

app.get('/', (c) => {
    return c.json({
        service: 'SignalOps Terminal',
        tagline: 'Event-Aware Algorithmic Trading Engine',
        version: '1.0.0',
        architecture: {
            research: 'Kimi K2.5 Core (External)',
            execution: 'Cloudflare Workers (TypeScript)',
            strategy: 'Python Workers (Deterministic)',
            signals: 'C++ Wasm (High-Frequency)'
        },
        status: 'operational'
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

// Market Data Group

// ... (imports)

// Market Data Group
const marketController = new MarketController()
const market = new Hono<{ Bindings: Bindings }>()
market.get('/quotes', (c) => marketController.getQuote(c))
app.route('/api/v1/market', market)

// Strategy Group (Stub)
// Strategy Group
const strategyController = new StrategyController()
const strategy = new Hono<{ Bindings: Bindings }>()
strategy.get('/signals', (c) => strategyController.getSignals(c))
strategy.post('/orders', (c) => strategyController.submitOrder(c))
app.route('/api/v1/strategy', strategy)

// Research Group (New)
const researchController = new ResearchController()
const research = new Hono<{ Bindings: Bindings }>()
research.get('/intrinsic-value', (c) => researchController.getIntrinsicValue(c))
research.get('/prediction', (c) => researchController.getPredictionMarket(c))
research.get('/decision-tree', (c) => researchController.getDecisionTree(c))
app.route('/api/v1/research', research)

export default app
