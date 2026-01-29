"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    useDeFiProtocols,
    useStockFundamentals,
    useNewsHeadlines,
    useDuneResults
} from "@/hooks/use-data-sources";
import {
    Globe,
    TrendUp,
    Newspaper,
    Database,
    FileText,
    MagnifyingGlass,
    ArrowRight
} from "@phosphor-icons/react";

export function DataSourcesView() {
    const [activeTab, setActiveTab] = useState("defi");

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Data Sources</h1>
                    <p className="text-zinc-300">Explore market data from various external providers.</p>
                </div>
            </div>

            <div className="flex gap-2 border-b border-white/10 pb-4 overflow-x-auto">
                <TabButton
                    active={activeTab === "defi"}
                    onClick={() => setActiveTab("defi")}
                    icon={Globe}
                    label="DeFiLlama"
                />
                <TabButton
                    active={activeTab === "stocks"}
                    onClick={() => setActiveTab("stocks")}
                    icon={TrendUp}
                    label="Yahoo Finance"
                />
                <TabButton
                    active={activeTab === "news"}
                    onClick={() => setActiveTab("news")}
                    icon={Newspaper}
                    label="News API"
                />
                <TabButton
                    active={activeTab === "dune"}
                    onClick={() => setActiveTab("dune")}
                    icon={Database}
                    label="Dune Analytics"
                />
                <TabButton
                    active={activeTab === "sec"}
                    onClick={() => setActiveTab("sec")}
                    icon={FileText}
                    label="SEC EDGAR"
                />
            </div>

            <div className="min-h-[400px]">
                {activeTab === "defi" && <DeFiSection />}
                {activeTab === "stocks" && <StocksSection />}
                {activeTab === "news" && <NewsSection />}
                {activeTab === "dune" && <DuneSection />}
                {activeTab === "sec" && <SECSection />}
            </div>
        </div>
    );
}

function TabButton({ active, onClick, icon: Icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${active
                    ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                    : "text-zinc-300 hover:text-white hover:bg-white/5"
                }`}
        >
            <Icon className="h-4 w-4" />
            {label}
        </button>
    );
}

function DeFiSection() {
    const { data, isLoading } = useDeFiProtocols();

    if (isLoading) return <div className="text-zinc-300">Loading DeFi protocols...</div>;

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
                {data?.protocols?.slice(0, 9).map((protocol: any) => (
                    <GlassCard key={protocol.id} className="p-4">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-white">{protocol.name}</h3>
                            <span className="text-sm text-zinc-300 bg-white/5 px-2 py-1 rounded">{protocol.chain}</span>
                        </div>
                        <div className="space-y-1">
                            <div className="text-sm text-zinc-300">TVL</div>
                            <div className="text-lg font-bold text-white">
                                ${new Intl.NumberFormat('en-US', { notation: "compact" }).format(protocol.tvl)}
                            </div>
                            <div className={`text-sm ${protocol.change_1d >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {protocol.change_1d?.toFixed(2)}% (24h)
                            </div>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
}

function StocksSection() {
    const [symbol, setSymbol] = useState("AAPL");
    const { data, isLoading } = useStockFundamentals(symbol);

    return (
        <div className="space-y-6">
            <div className="flex gap-2 max-w-md">
                <Input
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                    placeholder="Enter stock symbol (e.g. AAPL)"
                    className="bg-white/5 border-white/10 text-white"
                />
                <Button variant="outline">Search</Button>
            </div>

            {isLoading ? (
                <div className="text-zinc-300">Loading fundamentals...</div>
            ) : data ? (
                <GlassCard className="p-6 max-w-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white">{data.symbol}</h2>
                            <p className="text-zinc-300">Fundamentals</p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-zinc-300">Market Cap</div>
                            <div className="text-xl font-bold text-white">
                                ${new Intl.NumberFormat('en-US', { notation: "compact" }).format(data.market_cap)}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <div className="text-sm text-zinc-300 mb-1">P/E Ratio</div>
                            <div className="text-lg text-white">{data.pe_ratio?.toFixed(2)}</div>
                        </div>
                        <div>
                            <div className="text-sm text-zinc-300 mb-1">Dividend Yield</div>
                            <div className="text-lg text-white">{(data.dividend_yield * 100)?.toFixed(2)}%</div>
                        </div>
                        <div>
                            <div className="text-sm text-zinc-300 mb-1">52 Week High</div>
                            <div className="text-lg text-white">${data.high_52_week}</div>
                        </div>
                        <div>
                            <div className="text-sm text-zinc-300 mb-1">52 Week Low</div>
                            <div className="text-lg text-white">${data.low_52_week}</div>
                        </div>
                    </div>
                </GlassCard>
            ) : null}
        </div>
    );
}

function NewsSection() {
    const { data, isLoading } = useNewsHeadlines();

    if (isLoading) return <div className="text-zinc-300">Loading news...</div>;

    return (
        <div className="space-y-4">
            {data?.articles?.slice(0, 5).map((article: any, i: number) => (
                <GlassCard key={i} className="p-4 hover:bg-white/5 transition-colors">
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="flex gap-4">
                        {article.urlToImage && (
                            <img
                                src={article.urlToImage}
                                alt=""
                                className="w-24 h-24 object-cover rounded-lg bg-zinc-800"
                            />
                        )}
                        <div className="flex-1">
                            <h3 className="font-medium text-white mb-2 line-clamp-2">{article.title}</h3>
                            <p className="text-sm text-zinc-300 line-clamp-2 mb-2">{article.description}</p>
                            <div className="flex justify-between items-center text-sm text-zinc-300">
                                <span>{article.source.name}</span>
                                <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </a>
                </GlassCard>
            ))}
        </div>
    );
}

function DuneSection() {
    return (
        <div className="text-center py-12">
            <Database className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white">Dune Analytics Integration</h3>
            <p className="text-zinc-300 max-w-md mx-auto mt-2">
                Execute and visualize SQL queries on blockchain data.
                Enter a query ID to fetch results.
            </p>
            <div className="flex gap-2 max-w-sm mx-auto mt-6">
                <Input placeholder="Query ID" className="bg-white/5 border-white/10" />
                <Button>Execute</Button>
            </div>
        </div>
    );
}

function SECSection() {
    return (
        <div className="text-center py-12">
            <FileText className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white">SEC EDGAR Filings</h3>
            <p className="text-zinc-300 max-w-md mx-auto mt-2">
                Access real-time company filings (10-K, 10-Q, 8-K).
                Search by CIK or company name.
            </p>
            <div className="flex gap-2 max-w-sm mx-auto mt-6">
                <Input placeholder="CIK (e.g. 0000320193)" className="bg-white/5 border-white/10" />
                <Button>Search</Button>
            </div>
        </div>
    );
}
