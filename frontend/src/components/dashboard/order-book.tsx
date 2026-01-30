import { GlassCard } from "@/components/ui/glass-card";

export function OrderBookWidget() {
    const asks = [
        { price: 65420.5, amount: 0.5, total: 0.5 },
        { price: 65420.0, amount: 1.2, total: 1.7 },
        { price: 65419.5, amount: 0.8, total: 2.5 },
        { price: 65419.0, amount: 2.5, total: 5.0 },
    ];
    const bids = [
        { price: 65418.0, amount: 1.5, total: 1.5 },
        { price: 65417.5, amount: 0.5, total: 2.0 },
        { price: 65417.0, amount: 3.0, total: 5.0 },
        { price: 65416.5, amount: 2.2, total: 7.2 },
    ];

    return (
        <GlassCard className="p-4 h-full min-h-[300px] flex flex-col">
            <h3 className="text-xs font-mono text-zinc-400 tracking-wider mb-2 flex justify-between">
                <span>ORDER_BOOK</span>
                <span className="text-zinc-600">BTC-USD</span>
            </h3>

            <div className="flex-1 font-mono text-[10px] space-y-0.5">
                <div className="flex text-zinc-600 border-b border-white/5 pb-1 mb-1">
                    <span className="w-1/3">Price</span>
                    <span className="w-1/3 text-right">Amt</span>
                    <span className="w-1/3 text-right">Total</span>
                </div>

                {asks.reverse().map((ask, i) => (
                    <div key={`ask-${i}`} className="flex relative group cursor-pointer hover:bg-white/5">
                        <span className="w-1/3 text-rose-400">{ask.price.toFixed(1)}</span>
                        <span className="w-1/3 text-right text-zinc-300">{ask.amount.toFixed(4)}</span>
                        <span className="w-1/3 text-right text-zinc-500">{ask.total.toFixed(4)}</span>
                        <div className="absolute right-0 top-0 bottom-0 bg-rose-500/10" style={{ width: `${Math.min(ask.total * 10, 100)}%` }} />
                    </div>
                ))}

                <div className="py-2 text-center text-lg font-bold text-white border-y border-white/5 my-1">
                    65,418.50
                </div>

                {bids.map((bid, i) => (
                    <div key={`bid-${i}`} className="flex relative group cursor-pointer hover:bg-white/5">
                        <span className="w-1/3 text-emerald-400">{bid.price.toFixed(1)}</span>
                        <span className="w-1/3 text-right text-zinc-300">{bid.amount.toFixed(4)}</span>
                        <span className="w-1/3 text-right text-zinc-500">{bid.total.toFixed(4)}</span>
                        <div className="absolute right-0 top-0 bottom-0 bg-emerald-500/10" style={{ width: `${Math.min(bid.total * 10, 100)}%` }} />
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}
