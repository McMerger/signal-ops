"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GlowingChartProps {
    data?: { time: string; value: number }[];
}

export function GlowingChart({ data }: GlowingChartProps) {
    const defaultData = [
        { time: '00:00', value: 4000 },
        { time: '04:00', value: 3000 },
        { time: '08:00', value: 2000 },
        { time: '12:00', value: 2780 },
        { time: '16:00', value: 1890 },
        { time: '20:00', value: 2390 },
        { time: '24:00', value: 3490 },
    ];

    const chartData = data || defaultData;

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="5" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis
                        dataKey="time"
                        stroke="#666"
                        tick={{ fill: '#666', fontSize: 12, fontFamily: 'monospace' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        stroke="#666"
                        tick={{ fill: '#666', fontSize: 12, fontFamily: 'monospace' }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid #333', borderRadius: '8px', backdropFilter: 'blur(4px)' }}
                        itemStyle={{ color: '#0ea5e9', fontFamily: 'monospace' }}
                        labelStyle={{ color: '#999', fontFamily: 'monospace', marginBottom: '4px' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#0ea5e9"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorValue)"
                        filter="url(#glow)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
