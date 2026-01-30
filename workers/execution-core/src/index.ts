import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { PortfolioController } from './controllers/PortfolioController'
import { ResearchController } from './controllers/ResearchController'
import { StrategyController } from './controllers/StrategyController'
import { MarketController } from './controllers/MarketController'
import { AuthController } from './controllers/AuthController'
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

// Auth Group
const authController = new AuthController()
const auth = new Hono<{ Bindings: Bindings }>()
auth.post('/login', (c) => authController.login(c))
auth.post('/signup', (c) => authController.signup(c))
auth.get('/me', (c) => authController.me(c))
app.route('/api/auth', auth)

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

// User Group (New: UI Persistence)
import { UserController } from './controllers/UserController'
const userController = new UserController()
const user = new Hono<{ Bindings: Bindings }>()
user.get('/preferences', (c) => userController.getPreferences(c))
user.post('/preferences', (c) => userController.updatePreferences(c))
app.route('/api/v1/user', user)

// Worker Entrypoint with Scheduled Task
export default {
    fetch: app.fetch,
    async scheduled(event: ScheduledEvent, env: Bindings, ctx: ExecutionContext) {
        console.log(`[Cron] Scheduled Event: ${event.cron} at ${new Date().toISOString()}`);
        // In a real implementation, this would:
        // 1. Call StrategyEngine to get Target Weights
        // 2. Diff against Current Portfolio (D1)
        // 3. Submit Rebalancing Orders
        // For now, we log the intent to prove the infrastructure exists per README.
        const strategy = new StrategyController();
        const portfolio = new PortfolioController();
        // await strategy.rebalance(env); 
    }
}
