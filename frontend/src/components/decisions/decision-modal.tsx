import { DecisionLog, TriggerCondition } from '@/lib/api/decisions-api';
import { X, CheckCircle, XCircle, MinusCircle } from '@phosphor-icons/react';
import { format } from 'date-fns';

interface DecisionModalProps {
    decision: DecisionLog;
    onClose: () => void;
}

export function DecisionModal({ decision, onClose }: DecisionModalProps) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold">{decision.asset}</h2>
                        <p className="text-sm text-gray-500 mt-1">{decision.strategy_name}</p>
                        <p className="text-xs text-gray-400 mt-1">
                            {format(new Date(decision.timestamp), 'MMMM d, yyyy \'at\' h:mm:ss a')}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Decision Summary */}
                <div className="p-6 border-b border-gray-200">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Decision</p>
                            <p className="text-2xl font-bold mt-1">{decision.decision}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Confidence</p>
                            <p className="text-2xl font-bold mt-1">
                                {(decision.confidence * 100).toFixed(1)}%
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Status</p>
                            <p className="text-2xl font-bold mt-1">{decision.execution_status}</p>
                        </div>
                    </div>
                </div>

                {/* Triggers */}
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Trigger Conditions</h3>
                    <div className="space-y-3">
                        {decision.triggers && decision.triggers.map((trigger, index) => (
                            <TriggerRow key={index} trigger={trigger} />
                        ))}
                    </div>
                </div>

                {/* Metadata */}
                {decision.metadata && Object.keys(decision.metadata).length > 0 && (
                    <div className="p-6 border-t border-gray-200 bg-gray-50">
                        <h3 className="text-lg font-semibold mb-4">Additional Metadata</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(decision.metadata).map(([key, value]) => (
                                <div key={key}>
                                    <p className="text-sm text-gray-600">{key}</p>
                                    <p className="text-sm font-medium mt-1">{String(value)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* JSON Export */}
                <div className="p-6 border-t border-gray-200">
                    <button
                        onClick={() => {
                            const json = JSON.stringify(decision, null, 2);
                            navigator.clipboard.writeText(json);
                            alert('Decision log copied to clipboard!');
                        }}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Copy as JSON
                    </button>
                </div>
            </div>
        </div>
    );
}

function TriggerRow({ trigger }: { trigger: TriggerCondition }) {
    const StatusIcon = {
        PASS: CheckCircle,
        FAIL: XCircle,
        'N/A': MinusCircle,
    }[trigger.status] || MinusCircle;

    const statusColor = {
        PASS: 'text-green-600',
        FAIL: 'text-red-600',
        'N/A': 'text-gray-400',
    }[trigger.status] || 'text-gray-400';

    return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
                <StatusIcon size={24} className={statusColor} weight="fill" />
                <div>
                    <p className="font-medium">{trigger.source}</p>
                    <p className="text-sm text-gray-600">{trigger.metric}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-sm font-mono">
                    {trigger.value.toFixed(4)} {trigger.threshold_operator} {trigger.threshold_value}
                </p>
                {trigger.reasoning && (
                    <p className="text-xs text-gray-500 mt-1">{trigger.reasoning}</p>
                )}
            </div>
        </div>
    );
}
