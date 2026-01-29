export interface RiskLimits {
    maxExposure: number;
    maxPositionSize: number;
    maxDrawdownPct: number;
}

export interface PositionCheckRequest {
    accountId: string;
    asset: string;
    side: 'BUY' | 'SELL';
    quantity: number;
    price: number;
}

export interface RiskCheckResponse {
    approved: boolean;
    reason: string;
    maxAllowedQuantity: number;
    currentExposure: number;
    exposureLimit: number;
}

export class RiskService {
    // Default limits (Ported from RiskLimits.java)
    private static readonly DEFAULT_LIMITS: RiskLimits = {
        maxExposure: 100000.0,      // $100k
        maxPositionSize: 50000.0,   // $50k
        maxDrawdownPct: 0.20        // 20%
    };

    // Beginner limits (Safe Defaults per README)
    private static readonly BEGINNER_LIMITS: RiskLimits = {
        maxExposure: 10000.0,       // $10k Cap
        maxPositionSize: 2000.0,    // $2k per trade
        maxDrawdownPct: 0.10        // 10% Hard Stop
    };

    private accountLimits: Map<string, RiskLimits> = new Map();

    constructor() {
        // Initialize with mocks or load from config/KV if needed
    }

    private getLimits(accountId: string): RiskLimits {
        // In real app, check user tier/mode from DB or Auth token
        // For now, if accountId ends with "_BEGINNER", use safe defaults
        if (accountId.endsWith("_BEGINNER")) {
            return RiskService.BEGINNER_LIMITS;
        }
        return this.accountLimits.get(accountId) || RiskService.DEFAULT_LIMITS;
    }

    /**
     * Checks if a new order would breach risk limits.
     * Ported from RiskManagerServer.checkPositionLimit
     */
    async checkPositionLimit(
        req: PositionCheckRequest,
        getCurrentExposure: (accountId: string, asset: string) => Promise<number>
    ): Promise<RiskCheckResponse> {
        const limits = this.getLimits(req.accountId);

        // 1. Get current exposure
        const currentExposure = await getCurrentExposure(req.accountId, req.asset);

        // 2. Calculate new exposure
        // Note: For simplicity, treating exposure as absolute value of total position value
        // Refinement: If side reduces position, exposure decreases.
        // Assuming currentExposure is signed position value for now:
        const signedQuantity = req.side === 'BUY' ? req.quantity : -req.quantity;
        const incrementalExposure = signedQuantity * req.price;
        const newTotalExposure = Math.abs(currentExposure + incrementalExposure);

        // 3. Check against limits
        const approved = newTotalExposure <= limits.maxExposure;

        // 4. Calculate max allowed
        // Logic: if current is 10k, limit is 100k, we can add 90k worth.
        const remainingSpace = limits.maxExposure - Math.abs(currentExposure);
        const maxAllowedQty = Math.max(0, remainingSpace / req.price);

        return {
            approved,
            reason: approved ? "Within risk limits" : "Exceeds exposure limit",
            maxAllowedQuantity: approved ? req.quantity : maxAllowedQty,
            currentExposure: currentExposure,
            exposureLimit: limits.maxExposure
        };
    }

    /**
     * Checks if account has hit drawdown limit.
     * Ported from RiskLimits.checkDrawdownLimit
     */
    checkDrawdownLimit(accountId: string, currentEquity: number, peakEquity: number): boolean {
        const limits = this.getLimits(accountId);

        if (peakEquity <= 0) return false;

        const drawdown = (peakEquity - currentEquity) / peakEquity;
        return drawdown <= limits.maxDrawdownPct;
    }
}
