'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    usePolymarketMarkets,
    usePolymarketSearch,
    useAllIndicators,
    useEvaluateStrategy,
    useDecisionLogs
} from '../../hooks/use-backend-api';
import { type PolymarketMarket } from '@/lib/api/polymarket-api';
import { type TriggerResult, type DecisionLog } from '@/lib/api/strategy-evaluation-api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Spinner, MagnifyingGlass, TrendUp, Pulse, ShieldWarning, FileText, CaretUp, CaretDown, Minus } from '@phosphor-icons/react';
import { ThemeSwitcher } from '@/components/theme-switcher';

export function BackendFeaturesView() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Backend Features</h2>
                    <p className="text-muted-foreground">
                        Interact with the new Go execution core capabilities
                    </p>
                </div>
                <ThemeSwitcher />
            </div>

            <Tabs defaultValue="polymarket" className="space-y-4">
                <TabsList className="bg-muted/50 p-1">
                    <TabsTrigger value="polymarket" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        <TrendUp className="h-4 w-4" /> Polymarket
                    </TabsTrigger>
                    <TabsTrigger value="indicators" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        <Pulse className="h-4 w-4" /> Indicators
                    </TabsTrigger>
                    <TabsTrigger value="strategy" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        <ShieldWarning className="h-4 w-4" /> Strategy Engine
                    </TabsTrigger>
                    <TabsTrigger value="audit" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        <FileText className="h-4 w-4" /> Audit Trail
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="polymarket" className="space-y-4">
                    <PolymarketSection />
                </TabsContent>

                <TabsContent value="indicators" className="space-y-4">
                    <IndicatorsSection />
                </TabsContent>

                <TabsContent value="strategy" className="space-y-4">
                    <StrategySection />
                </TabsContent>

                <TabsContent value="audit" className="space-y-4">
                    <AuditSection />
                </TabsContent>
            </Tabs>
        </div>
    );
}

function PolymarketSection() {
    const { data: markets, isLoading } = usePolymarketMarkets();
    const [searchQuery, setSearchQuery] = useState('');

    // Simple client-side search for demo purposes if API search isn't fully hooked up to this view yet
    // or we can use the usePolymarketSearch hook if we want server-side search.
    // For now, let's filter the fetched markets.
    const filteredMarkets = markets?.filter((m: PolymarketMarket) =>
        m.question.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const featuredMarket = filteredMarkets[0];
    const otherMarkets = filteredMarkets.slice(1);

    if (isLoading) {
        return <div className="flex justify-center p-12"><Spinner className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search prediction markets..."
                        className="pl-9 bg-background/50 backdrop-blur-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {featuredMarket && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-card to-primary/5">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <Badge variant="outline" className="mb-2 border-primary/50 text-primary">{featuredMarket.category}</Badge>
                                    <CardTitle className="text-2xl">{featuredMarket.question}</CardTitle>
                                </div>
                                <Badge variant={featuredMarket.active ? "default" : "secondary"}>
                                    {featuredMarket.active ? "Active" : "Closed"}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {featuredMarket.outcomes.map((outcome: string, idx: number) => {
                                        const prob = featuredMarket.outcome_prices[idx] || 0;
                                        return (
                                            <div key={idx} className="space-y-2">
                                                <div className="flex justify-between text-sm font-medium">
                                                    <span>{outcome}</span>
                                                    <span>{(prob * 100).toFixed(1)}%</span>
                                                </div>
                                                <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary transition-all duration-500"
                                                        style={{ width: `${prob * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="text-xs text-muted-foreground pt-2 border-t">
                                    Volume: ${featuredMarket.volume.toLocaleString()}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherMarkets.map((market: PolymarketMarket) => (
                    <Card key={market.id} className="hover:border-primary/50 transition-colors">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start gap-2">
                                <Badge variant="outline" className="text-xs">{market.category}</Badge>
                                {market.volume > 10000 && <Badge variant="secondary" className="text-xs">High Vol</Badge>}
                            </div>
                            <CardTitle className="text-base line-clamp-2 mt-2 h-12">
                                {market.question}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 mt-2">
                                {market.outcomes.slice(0, 2).map((outcome: string, idx: number) => (
                                    <div key={idx} className="space-y-1">
                                        <div className="flex justify-between text-xs">
                                            <span className="truncate max-w-[70%]">{outcome}</span>
                                            <span className="font-mono">{(market.outcome_prices[idx] * 100).toFixed(0)}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary/80"
                                                style={{ width: `${market.outcome_prices[idx] * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function IndicatorsSection() {
    const [symbol, setSymbol] = useState('BTC-USD');
    const { data, isLoading } = useAllIndicators(symbol);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Input
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                    className="max-w-[200px]"
                    placeholder="Symbol"
                />
                <Button variant="outline" onClick={() => setSymbol('BTC-USD')}>BTC</Button>
                <Button variant="outline" onClick={() => setSymbol('ETH-USD')}>ETH</Button>
                <Button variant="outline" onClick={() => setSymbol('SPY')}>SPY</Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-12"><Spinner className="h-8 w-8 animate-spin" /></div>
            ) : data ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* RSI Card */}
                    <Card className="relative overflow-hidden">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                RSI <span className="text-sm font-normal text-muted-foreground">(14)</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end gap-4">
                                <div className="text-5xl font-bold tracking-tighter">
                                    {data.rsi.value.toFixed(1)}
                                </div>
                                <div className="mb-2">
                                    <Badge variant={data.rsi.signal === 'OVERBOUGHT' ? 'destructive' : data.rsi.signal === 'OVERSOLD' ? 'default' : 'secondary'}>
                                        {data.rsi.signal}
                                    </Badge>
                                </div>
                            </div>
                            <div className="mt-4 h-4 w-full bg-muted rounded-full relative overflow-hidden">
                                <div className="absolute top-0 bottom-0 left-[30%] w-[1px] bg-foreground/20 z-10" title="Oversold (30)" />
                                <div className="absolute top-0 bottom-0 left-[70%] w-[1px] bg-foreground/20 z-10" title="Overbought (70)" />
                                <div
                                    className="h-full bg-primary transition-all duration-500"
                                    style={{ width: `${Math.min(Math.max(data.rsi.value, 0), 100)}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>0</span>
                                <span>50</span>
                                <span>100</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* MACD Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>MACD</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between mb-4">
                                <div className="space-y-1">
                                    <div className="text-sm text-muted-foreground">Histogram</div>
                                    <div className={`text-2xl font-bold ${data.macd.histogram >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {data.macd.histogram.toFixed(4)}
                                    </div>
                                </div>
                                <Badge variant={data.macd.signal === 'BUY' ? 'default' : data.macd.signal === 'SELL' ? 'destructive' : 'secondary'}>
                                    {data.macd.signal}
                                </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="p-3 bg-muted/30 rounded-lg">
                                    <div className="text-muted-foreground">MACD Line</div>
                                    <div className="font-mono font-medium">{data.macd.macd.toFixed(4)}</div>
                                </div>
                                <div className="p-3 bg-muted/30 rounded-lg">
                                    <div className="text-muted-foreground">Signal Line</div>
                                    <div className="font-mono font-medium">{data.macd.signal_line.toFixed(4)}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Moving Averages */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Moving Averages & Bands</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 border rounded-xl flex flex-col justify-between">
                                    <div className="text-sm text-muted-foreground mb-2">SMA (50)</div>
                                    <div className="text-2xl font-mono">{data.sma.value.toFixed(2)}</div>
                                    <div className="flex items-center gap-1 text-sm mt-2">
                                        {data.sma.trend === 'UP' ? <CaretUp className="text-green-500" /> : <CaretDown className="text-red-500" />}
                                        <span className={data.sma.trend === 'UP' ? 'text-green-500' : 'text-red-500'}>{data.sma.trend}</span>
                                    </div>
                                </div>
                                <div className="p-4 border rounded-xl flex flex-col justify-between">
                                    <div className="text-sm text-muted-foreground mb-2">EMA (20)</div>
                                    <div className="text-2xl font-mono">{data.ema.value.toFixed(2)}</div>
                                    <div className="flex items-center gap-1 text-sm mt-2">
                                        {data.ema.trend === 'UP' ? <CaretUp className="text-green-500" /> : <CaretDown className="text-red-500" />}
                                        <span className={data.ema.trend === 'UP' ? 'text-green-500' : 'text-red-500'}>{data.ema.trend}</span>
                                    </div>
                                </div>
                                <div className="p-4 border rounded-xl flex flex-col justify-between">
                                    <div className="text-sm text-muted-foreground mb-2">Bollinger Bands</div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs"><span>Upper</span> <span className="font-mono">{data.bollinger.upper.toFixed(2)}</span></div>
                                        <div className="flex justify-between text-xs font-medium"><span>Middle</span> <span className="font-mono">{data.bollinger.middle.toFixed(2)}</span></div>
                                        <div className="flex justify-between text-xs"><span>Lower</span> <span className="font-mono">{data.bollinger.lower.toFixed(2)}</span></div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : null}
        </div>
    );
}

function StrategySection() {
    const [asset, setAsset] = useState('AAPL');
    const { mutate: evaluate, data, isPending } = useEvaluateStrategy('graham', asset);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-card border rounded-lg shadow-sm">
                <div className="flex-1 max-w-xs">
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Target Asset</label>
                    <Input
                        value={asset}
                        onChange={(e) => setAsset(e.target.value.toUpperCase())}
                        placeholder="Asset (e.g. AAPL)"
                        className="font-mono"
                    />
                </div>
                <div className="flex-none self-end">
                    <Button onClick={() => evaluate()} disabled={isPending} size="lg" className="px-8">
                        {isPending ? <Spinner className="mr-2 h-4 w-4 animate-spin" /> : <ShieldWarning className="mr-2 h-4 w-4" />}
                        Evaluate Strategy
                    </Button>
                </div>
            </div>

            {data && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <Card className="overflow-hidden border-2 border-primary/10">
                        <div className={`h-2 w-full ${data.decision === 'BUY' ? 'bg-green-500' : data.decision === 'SELL' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                        <CardHeader className="text-center pb-2">
                            <CardDescription>Strategy Decision for {asset}</CardDescription>
                            <CardTitle className={`text-4xl font-black tracking-tighter ${data.decision === 'BUY' ? 'text-green-500' : data.decision === 'SELL' ? 'text-red-500' : 'text-yellow-500'}`}>
                                {data.decision}
                            </CardTitle>
                            <div className="flex justify-center items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-sm">Confidence: {(data.confidence * 100).toFixed(1)}%</Badge>
                                <Badge variant={data.final_action === 'APPROVED' ? 'default' : 'destructive'}>
                                    ACTION: {data.final_action}
                                </Badge>
                            </div>
                        </CardHeader>

                        <CardContent className="pt-6">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="font-semibold flex items-center gap-2">
                                        <Pulse className="h-4 w-4" /> Rule Analysis
                                    </h4>
                                    <div className="space-y-2">
                                        {data.triggers_evaluated.map((trigger: TriggerResult, idx: number) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border hover:border-primary/20 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className={`h-2 w-2 rounded-full ${trigger.status === 'PASS' ? 'bg-green-500' : 'bg-red-500'}`} />
                                                    <div>
                                                        <div className="font-medium text-sm">{trigger.metric}</div>
                                                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{trigger.source}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-mono text-sm font-medium">{trigger.value.toFixed(2)}</div>
                                                    <div className="text-[10px] text-muted-foreground">
                                                        {trigger.operator} {trigger.threshold}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-semibold flex items-center gap-2">
                                        <FileText className="h-4 w-4" /> AI Reasoning
                                    </h4>
                                    <div className="bg-muted/30 rounded-lg p-4 border h-full">
                                        {Object.keys(data.reasoning).length > 0 ? (
                                            <ul className="space-y-3">
                                                {Object.entries(data.reasoning).map(([key, value]) => (
                                                    <li key={key} className="text-sm text-muted-foreground flex gap-2">
                                                        <span className="text-primary mt-1">•</span>
                                                        <span>{String(value)}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-muted-foreground italic">No detailed reasoning provided.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </div>
    );
}

function AuditSection() {
    const { data, isLoading } = useDecisionLogs();

    if (isLoading) {
        return <div className="flex justify-center p-8"><Spinner className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
    }

    return (
        <div className="space-y-4">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
                <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b bg-muted/40 text-sm text-muted-foreground">
                    <div>Time</div>
                    <div>Strategy</div>
                    <div>Asset</div>
                    <div>Decision</div>
                    <div>Action</div>
                </div>
                <div className="divide-y">
                    {data?.decisions.map((log: DecisionLog) => (
                        <div key={log.id} className="grid grid-cols-5 gap-4 p-4 hover:bg-muted/20 transition-colors text-sm items-center">
                            <div className="text-muted-foreground">{new Date(log.timestamp).toLocaleTimeString()}</div>
                            <div className="font-medium">{log.strategy_name}</div>
                            <div className="font-mono bg-muted/50 px-2 py-1 rounded w-fit text-xs">{log.asset}</div>
                            <div>
                                <Badge variant={log.decision === 'BUY' ? 'default' : log.decision === 'SELL' ? 'destructive' : 'secondary'} className="w-16 justify-center">
                                    {log.decision}
                                </Badge>
                            </div>
                            <div>
                                <Badge variant={log.final_action === 'APPROVED' ? 'outline' : 'destructive'} className={log.final_action === 'APPROVED' ? 'border-green-500 text-green-500' : ''}>
                                    {log.final_action}
                                </Badge>
                            </div>
                        </div>
                    ))}
                    {data?.decisions.length === 0 && (
                        <div className="p-12 text-center text-muted-foreground">
                            <FileText className="h-8 w-8 mx-auto mb-2 opacity-20" />
                            <p>No decision logs found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
