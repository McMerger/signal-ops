import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { PortfolioController } from './controllers/PortfolioController'
import { ResearchController } from './controllers/ResearchController'
import { StrategyController } from './controllers/StrategyController'
import { Bindings } from './bindings'

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
