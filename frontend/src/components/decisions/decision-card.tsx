import { DecisionLog } from '@/lib/api/decisions-api';
import { format } from 'date-fns';
import { ArrowUp, ArrowDown, Minus } from '@phosphor-icons/react';

interface DecisionCardProps {
    decision: DecisionLog;
    onClick: () => void;
}

export function DecisionCard({ decision, onClick }: DecisionCardProps) {
    const DecisionIcon = {
        BUY: ArrowUp,
        SELL: ArrowDown,
        HOLD: Minus,
    }[decision.decision] || Minus;

    const decisionColor = {
        BUY: 'text-green-600 bg-green-50',
        SELL: 'text-red-600 bg-red-50',
        HOLD: 'text-gray-600 bg-gray-50',
    }[decision.decision] || 'text-gray-600 bg-gray-50';

    const passedTriggers = decision.triggers ? decision.triggers.filter(t => t.status === 'PASS').length : 0;
    const totalTriggers = decision.triggers ? decision.triggers.length : 0;

    return (
        <div
            onClick={onClick}
            className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold">{decision.asset}</h3>
                    <p className="text-sm text-gray-500">{decision.strategy_name}</p>
                </div>
                <div className={`p-2 rounded-full ${decisionColor}`}>
                    <DecisionIcon size={24} weight="bold" />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Decision</span>
                    <span className={`text-sm font-semibold ${decisionColor}`}>
                        {decision.decision}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Confidence</span>
                    <span className="text-sm font-semibold">
                        {(decision.confidence * 100).toFixed(1)}%
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Triggers</span>
                    <span className="text-sm font-semibold">
                        {passedTriggers}/{totalTriggers} passed
                    </span>
                </div>

                {decision.position_size && (
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Size</span>
                        <span className="text-sm font-semibold">
                            {(decision.position_size * 100).toFixed(1)}%
                        </span>
                    </div>
                )}

                <div className="pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                        {format(new Date(decision.timestamp), 'MMM d, yyyy HH:mm:ss')}
                    </span>
                </div>
            </div>
        </div>
    );
}
