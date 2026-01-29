"use client";

import { useEffect, useRef } from "react";
import { createChart, ColorType, IChartApi, Time, CandlestickSeries } from "lightweight-charts";
import { GlassCard } from "@/components/ui/glass-card";

export function PriceChart() {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: "transparent" },
                textColor: "#A1A1AA",
            },
            grid: {
                vertLines: { color: "rgba(255, 255, 255, 0.05)" },
                horzLines: { color: "rgba(255, 255, 255, 0.05)" },
            },
            width: chartContainerRef.current.clientWidth,
            height: 300,
            timeScale: {
                borderColor: "rgba(255, 255, 255, 0.1)",
            },
            rightPriceScale: {
                borderColor: "rgba(255, 255, 255, 0.1)",
            },
        });

        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: "#10B981",
            downColor: "#EF4444",
            borderVisible: false,
            wickUpColor: "#10B981",
            wickDownColor: "#EF4444",
        });

        // Mock data
        const data = [
            { time: '2018-12-22' as Time, open: 75.16, high: 82.84, low: 36.16, close: 45.72 },
            { time: '2018-12-23' as Time, open: 45.12, high: 53.90, low: 45.12, close: 48.09 },
            { time: '2018-12-24' as Time, open: 60.71, high: 60.71, low: 53.39, close: 59.29 },
            { time: '2018-12-25' as Time, open: 68.26, high: 68.26, low: 59.04, close: 60.50 },
            { time: '2018-12-26' as Time, open: 67.71, high: 105.85, low: 66.67, close: 91.04 },
            { time: '2018-12-27' as Time, open: 91.04, high: 121.40, low: 82.70, close: 111.40 },
            { time: '2018-12-28' as Time, open: 111.51, high: 142.83, low: 103.34, close: 131.25 },
            { time: '2018-12-29' as Time, open: 131.33, high: 151.17, low: 77.68, close: 96.43 },
            { time: '2018-12-30' as Time, open: 106.33, high: 110.20, low: 90.39, close: 98.10 },
            { time: '2018-12-31' as Time, open: 109.87, high: 114.69, low: 85.66, close: 111.26 },
        ];

        candlestickSeries.setData(data);
        chartRef.current = chart;

        const handleResize = () => {
            if (chartContainerRef.current && chartRef.current) {
                chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            chart.remove();
        };
    }, []);

    return (
        <GlassCard className="p-6 h-[400px]">
            <h3 className="text-lg font-medium text-white mb-4">Price Action (BTC/USDT)</h3>
            <div ref={chartContainerRef} className="w-full h-[300px]" />
        </GlassCard>
    );
}
