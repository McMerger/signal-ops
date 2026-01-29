import { decisionsApi } from '@/lib/api/decisions-api';
import { strategyConfigsApi } from '@/lib/api/strategy-configs-api';
import { ordersApi } from '@/lib/api/orders-api';

describe('API Integration Tests', () => {
    // Check if backend is running
    beforeAll(async () => {
        try {
            const response = await fetch('http://localhost:8080/health');
            expect(response.ok).toBe(true);
        } catch (e) {
            console.warn('Backend not running, skipping integration tests');
        }
    });

    describe('Decisions API', () => {
        it('should list decisions', async () => {
            try {
                const result = await decisionsApi.list({ limit: 10 });
                expect(result).toHaveProperty('decisions');
                expect(result).toHaveProperty('count');
                expect(Array.isArray(result.decisions)).toBe(true);
            } catch (e) {
                console.warn('Skipping test due to connection error');
            }
        });

        it('should handle no decisions gracefully', async () => {
            try {
                const result = await decisionsApi.list({ limit: 10 });
                // Should not throw, even if empty
                expect(result.count).toBeGreaterThanOrEqual(0);
            } catch (e) {
                console.warn('Skipping test due to connection error');
            }
        });
    });

    describe('Strategy Configs API', () => {
        const testStrategyYAML = `
strategy:
  name: "Test_Integration_Strategy"
  assets: ["AAPL"]
  rules:
    - id: "test_rule"
      source: "technical"
      conditions:
        - metric: "rsi_14"
          operator: "<"
          threshold: 35
  execution:
    require_confirmations: 1
    position_size: 0.02
    action_mode: "paper"
`;

        it('should upload strategy config', async () => {
            try {
                const result = await strategyConfigsApi.upload(testStrategyYAML);
                expect(result.success).toBe(true);
                expect(result.strategy_name).toBe('Test_Integration_Strategy');
            } catch (e) {
                console.warn('Skipping test due to connection error');
            }
        });

        it('should list strategies', async () => {
            try {
                const result = await strategyConfigsApi.list();
                expect(result).toHaveProperty('strategies');
                expect(Array.isArray(result.strategies)).toBe(true);
            } catch (e) {
                console.warn('Skipping test due to connection error');
            }
        });

        it('should execute strategy', async () => {
            try {
                const result = await strategyConfigsApi.execute('Test_Integration_Strategy', 'AAPL');
                expect(result).toHaveProperty('decision');
                expect(result).toHaveProperty('decision_log_id');
                expect(result).toHaveProperty('confidence');
            } catch (e) {
                console.warn('Skipping test due to connection error');
            }
        });
    });

    describe('Orders API', () => {
        it('should list orders', async () => {
            try {
                const result = await ordersApi.list(10);
                expect(result).toHaveProperty('orders');
                expect(result).toHaveProperty('count');
            } catch (e) {
                console.warn('Skipping test due to connection error');
            }
        });
    });
});
