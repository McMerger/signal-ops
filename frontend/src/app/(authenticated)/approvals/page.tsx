'use client';

import { useState, useEffect } from 'react';
import { decisionsApi, DecisionLog } from '@/lib/api/decisions-api';
import { ordersApi } from '@/lib/api/orders-api';
import { Check, X } from '@phosphor-icons/react';

export default function ApprovalsPage() {
    const [pendingDecisions, setPendingDecisions] = useState<DecisionLog[]>([]);

    useEffect(() => {
        loadPendingDecisions();
    }, []);

    const loadPendingDecisions = async () => {
        try {
            const result = await decisionsApi.search({
                // Filter for decisions awaiting approval
                // This assumes backend supports filtering by execution_status
            });
            // Mock filtering on client side if backend doesn't support it yet
            const pending = result.decisions ? result.decisions.filter(d => d.execution_status === 'PENDING_APPROVAL') : [];
            setPendingDecisions(pending);
        } catch (error) {
            console.error('Failed to load pending decisions:', error);
        }
    };

    const handleApprove = async (decision: DecisionLog) => {
        try {
            if (decision.decision === 'BUY' || decision.decision === 'SELL') {
                await ordersApi.submit({
                    strategy_name: decision.strategy_name,
                    symbol: decision.asset,
                    side: decision.decision,
                    quantity: decision.position_size || 0,
                    order_type: 'MARKET',
                });
            }
            await loadPendingDecisions();
            alert(`Decision for ${decision.asset} approved and executed!`);
        } catch (error) {
            alert('Failed to execute order: ' + (error as Error).message);
        }
    };

    const handleReject = async (decision: DecisionLog) => {
        // Update decision status to rejected
        // This would need a backend endpoint
        // For now just refresh
        await loadPendingDecisions();
        alert('Decision rejected (mock)');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Trade Approvals</h1>

            {pendingDecisions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    No pending approvals
                </div>
            ) : (
                <div className="space-y-4">
                    {pendingDecisions.map((decision) => (
                        <div
                            key={decision.id}
                            className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold">{decision.asset}</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {decision.strategy_name}
                                    </p>
                                    <div className="mt-4 grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Decision</p>
                                            <p className="font-semibold">{decision.decision}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Confidence</p>
                                            <p className="font-semibold">
                                                {(decision.confidence * 100).toFixed(1)}%
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Position Size</p>
                                            <p className="font-semibold">
                                                {((decision.position_size || 0) * 100).toFixed(1)}%
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex space-x-2 ml-4">
                                    <button
                                        onClick={() => handleApprove(decision)}
                                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                    >
                                        <Check size={20} />
                                        <span>Approve</span>
                                    </button>
                                    <button
                                        onClick={() => handleReject(decision)}
                                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                    >
                                        <X size={20} />
                                        <span>Reject</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
