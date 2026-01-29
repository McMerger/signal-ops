import { Context } from 'hono';

export interface MarketEvent {
    id: string;
    asset: string;
    type: 'EARNINGS' | 'TOKEN_UNLOCK' | 'GOVERNANCE' | 'MACRO';
    date: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
}

export class EventService {
    /**
     * Checks if there are any blocking critical events for the asset within a time window.
     * @param asset Symbol to check
     * @param daysLookahead Number of days to look ahead (default 3)
     */
    async getBlockingEvents(asset: string, daysLookahead: number = 3): Promise<MarketEvent[]> {
        // Mock data source - in a real app this would query a calendar API or DB
        const now = new Date();
        const future = new Date();
        future.setDate(now.getDate() + daysLookahead);

        // Simulated event database
        const events: MarketEvent[] = [
            {
                id: "evt_1",
                asset: "NVDA",
                type: "EARNINGS",
                date: new Date(now.getTime() + 86400000 * 2).toISOString(), // 2 days out
                severity: "CRITICAL",
                description: "Q4 Earnings Call"
            },
            {
                id: "evt_2",
                asset: "SOL",
                type: "TOKEN_UNLOCK",
                date: new Date(now.getTime() + 86400000 * 1).toISOString(), // 1 day out
                severity: "HIGH",
                description: "Cliff Unlock (5% supply)"
            }
        ];

        return events.filter(e =>
            e.asset === asset &&
            e.severity === 'CRITICAL' &&
            new Date(e.date) <= future &&
            new Date(e.date) >= now
        );
    }

    /**
     * Returns a list of all upcoming events for context.
     */
    async getUpcomingEvents(asset: string): Promise<MarketEvent[]> {
        return this.getBlockingEvents(asset, 7); // 7 day view
    }
}
