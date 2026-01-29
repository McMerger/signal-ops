export interface RiskLimits {
    maxExposure: number;
    maxPositionSize: number;
    maxDrawdownPct: number;
    assetClassLimits?: Record<string, number>; // e.g. { "CRYPTO": 5000 }
}

export interface PositionCheckRequest {
    accountId: string;
    asset: string;
    assetClass?: string; // New field
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
    assetClassExposure?: number; // Reporting back
    assetClassLimit?: number;    // Reporting back
}

export class RiskService {
    // Default limits
    private static readonly DEFAULT_LIMITS: RiskLimits = {
        maxExposure: 100000.0,
        maxPositionSize: 50000.0,
        maxDrawdownPct: 0.20,
        assetClassLimits: {
            "CRYPTO": 25000.0, // Cap crypto at 25% of total
            "EQUITY": 100000.0
        }
    };

    // Beginner limits (Safe Defaults)
    private static readonly BEGINNER_LIMITS: RiskLimits = {
        maxExposure: 10000.0,
        maxPositionSize: 2000.0,
        maxDrawdownPct: 0.10,
        assetClassLimits: {
            "CRYPTO": 1000.0, // Very strict crypto cap for beginners
            "EQUITY": 10000.0
        }
    };

    private accountLimits: Map<string, RiskLimits> = new Map();

    constructor() { }

    public getLimitsForAccount(accountId: string): RiskLimits {
        return this.getLimits(accountId);
    }

    private getLimits(accountId: string): RiskLimits {
        if (accountId.endsWith("_BEGINNER")) {
            return RiskService.BEGINNER_LIMITS;
        }
        return this.accountLimits.get(accountId) || RiskService.DEFAULT_LIMITS;
    }

    async checkPositionLimit(
        req: PositionCheckRequest,
        getCurrentExposure: (accountId: string, asset: string) => Promise<number>,
        getAssetClassExposure?: (accountId: string, assetClass: string) => Promise<number>
    ): Promise<RiskCheckResponse> {
        const limits = this.getLimits(req.accountId);
        const assetClass = req.assetClass || "UNKNOWN";

        // 1. Global Exposure Check
        const currentExposure = await getCurrentExposure(req.accountId, req.asset);
        // Assuming exposure always additive for conservatism
        const incrementalExposure = req.quantity * req.price;
        const newTotalExposure = currentExposure + incrementalExposure;

        if (newTotalExposure > limits.maxExposure) {
            return {
                approved: false,
                reason: `Exceeds global exposure limit ($${limits.maxExposure})`,
                maxAllowedQuantity: Math.max(0, (limits.maxExposure - currentExposure) / req.price),
                currentExposure,
                exposureLimit: limits.maxExposure
            };
        }

        // 2. Asset Class Exposure Check (New)
        if (limits.assetClassLimits && limits.assetClassLimits[assetClass] && getAssetClassExposure) {
            const classLimit = limits.assetClassLimits[assetClass];
            const currentClassExposure = await getAssetClassExposure(req.accountId, assetClass);
            const newClassExposure = currentClassExposure + incrementalExposure;

            if (newClassExposure > classLimit) {
                return {
                    approved: false,
                    reason: `Exceeds ${assetClass} exposure limit ($${classLimit})`,
                    maxAllowedQuantity: Math.max(0, (classLimit - currentClassExposure) / req.price),
                    currentExposure: currentClassExposure,
                    exposureLimit: classLimit,
                    assetClassExposure: currentClassExposure,
                    assetClassLimit: classLimit
                };
            }
        }

        // 3. Position Size Check
        if (incrementalExposure > limits.maxPositionSize) {
            return {
                approved: false,
                reason: `Exceeds max position size ($${limits.maxPositionSize})`,
                maxAllowedQuantity: limits.maxPositionSize / req.price,
                currentExposure,
                exposureLimit: limits.maxExposure
            };
        }

        return {
            approved: true,
            reason: "Within risk limits",
            maxAllowedQuantity: req.quantity,
            currentExposure: newTotalExposure,
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
