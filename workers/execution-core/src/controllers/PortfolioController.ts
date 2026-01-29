import { Context } from 'hono';
import { RiskService } from '../services/RiskService';
import { Bindings } from '../bindings';

export class PortfolioController {
    private riskService: RiskService;

    constructor() {
        this.riskService = new RiskService();
    }

    /**
     * GET /api/v1/portfolio/positions
     * Ported from portfolio_handlers.go: handlePositions
     */
    async getPositions(c: Context<{ Bindings: Bindings }>) {
        try {
            const { results } = await c.env.SIGNAL_DB.prepare(`
                SELECT symbol, strategy_name, quantity, average_entry_price, current_price,
                       unrealized_pnl, realized_pnl, opened_at, last_updated
                FROM positions
                WHERE quantity != 0
                ORDER BY last_updated DESC
            `).all();

            // Calculate totals (logic ported from Go)
            let totalUnrealizedPnL = 0;
            let totalRealizedPnL = 0;

            const positions = results.map((row: any) => {
                const uPnL = row.unrealized_pnl || 0;
                const rPnL = row.realized_pnl || 0;
                totalUnrealizedPnL += uPnL;
                totalRealizedPnL += rPnL;

                return {
                    ...row,
                    market_value: (row.current_price || 0) * row.quantity
                };
            });

            return c.json({
                positions,
                count: positions.length,
                total_unrealized_pnl: totalUnrealizedPnL,
                total_realized_pnl: totalRealizedPnL,
                total_pnl: totalUnrealizedPnL + totalRealizedPnL
            });
        } catch (e: any) {
            return c.json({ error: e.message }, 500);
        }
    }

    /**
     * GET /api/v1/portfolio/performance
     * Ported from portfolio_handlers.go: handlePortfolioPerformance
     */
    async getPerformance(c: Context<{ Bindings: Bindings }>) {
        try {
            // Aggregate query
            const stats = await c.env.SIGNAL_DB.prepare(`
                SELECT 
                    COUNT(*) as total_trades,
                    SUM(CASE WHEN pnl > 0 THEN 1 ELSE 0 END) as winning_trades,
                    SUM(CASE WHEN pnl < 0 THEN 1 ELSE 0 END) as losing_trades,
                    COALESCE(SUM(pnl), 0) as total_pnl,
                    COALESCE(AVG(pnl), 0) as avg_pnl,
                    COALESCE(MAX(pnl), 0) as max_win,
                    COALESCE(MIN(pnl), 0) as max_loss
                FROM trades
                WHERE pnl IS NOT NULL AND status = 'FILLED'
            `).first();

            // Strategy performance query
            const { results: strategyPerf } = await c.env.SIGNAL_DB.prepare(`
                SELECT strategy_name, COUNT(*) as trades, COALESCE(SUM(pnl), 0) as pnl
                FROM trades
                WHERE pnl IS NOT NULL AND status = 'FILLED'
                GROUP BY strategy_name
                ORDER BY pnl DESC
            `).all();

            if (!stats) return c.json({ error: 'No data' }, 404);

            const totalTrades = stats.total_trades as number;
            const winningTrades = stats.winning_trades as number;

            return c.json({
                ...stats,
                win_rate: totalTrades > 0 ? winningTrades / totalTrades : 0,
                strategy_performance: strategyPerf
            });
        } catch (e: any) {
            return c.json({ error: e.message }, 500);
        }
    }

    /**
     * GET /api/v1/portfolio/risk
     * Merges logic from Go handleRiskMetrics and Java Risk Limits
     */
    async getRiskMetrics(c: Context<{ Bindings: Bindings }>) {
        try {
            // Exposure query
            const exposure = await c.env.SIGNAL_DB.prepare(`
                SELECT 
                    COALESCE(SUM(ABS(quantity * average_entry_price)), 0) as total_exposure,
                    COUNT(*) as open_positions
                FROM positions
                WHERE quantity != 0
            `).first();

            // VaR (Value at Risk) query - simplified
            // SQLite doesn't have PERCENTILE_CONT usually, so we might need to fetch pnl and calculate in JS
            // For now, doing simple average of worst 5% trades if possible, or just fetching all PnLs
            const { results: pnls } = await c.env.SIGNAL_DB.prepare(`
                SELECT pnl FROM trades 
                WHERE pnl IS NOT NULL 
                AND executed_at > datetime('now', '-30 days')
                ORDER BY pnl ASC
            `).all();

            // Calculate VaR 95 (5th percentile) in JS
            let var95 = 0;
            if (pnls && pnls.length > 0) {
                const idx = Math.floor(pnls.length * 0.05);
                var95 = (pnls[idx] as any).pnl;
            }

            const totalExposure = exposure?.total_exposure as number || 0;
            const openPositions = exposure?.open_positions as number || 0;

            const riskLevel = this.calculateRiskLevel(openPositions, totalExposure);

            return c.json({
                total_exposure: totalExposure,
                open_positions: openPositions,
                var_95_30d: var95,
                risk_level: riskLevel,
                risk_limits: {
                    max_exposure: 100000, // From RiskService default
                    max_position: 50000
                }
            });
        } catch (e: any) {
            return c.json({ error: e.message }, 500);
        }
    }

    private calculateRiskLevel(openPositions: number, totalExposure: number): string {
        if (openPositions === 0) return "NONE";
        if (totalExposure < 10000) return "LOW";
        if (totalExposure < 50000) return "MEDIUM";
        if (totalExposure < 100000) return "HIGH";
        return "CRITICAL";
    }
}
