import { MagnifyingGlass } from '@phosphor-icons/react';

interface DecisionFiltersProps {
    filters: {
        strategy: string;
        asset: string;
        decision: string;
    };
    onFiltersChange: (filters: any) => void;
}

export function DecisionFilters({ filters, onFiltersChange }: DecisionFiltersProps) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Strategy</label>
                    <input
                        type="text"
                        value={filters.strategy}
                        onChange={(e) => onFiltersChange({ ...filters, strategy: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Filter by strategy..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Asset</label>
                    <input
                        type="text"
                        value={filters.asset}
                        onChange={(e) => onFiltersChange({ ...filters, asset: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Filter by asset..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Decision</label>
                    <select
                        value={filters.decision}
                        onChange={(e) => onFiltersChange({ ...filters, decision: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Decisions</option>
                        <option value="BUY">BUY</option>
                        <option value="SELL">SELL</option>
                        <option value="HOLD">HOLD</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
