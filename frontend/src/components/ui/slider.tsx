"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onValueChange?: (value: number[]) => void;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
    ({ className, onValueChange, ...props }, ref) => (
        <input
            type="range"
            className={cn(
                "w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-sky-500",
                className
            )}
            ref={ref}
            onChange={(e) => onValueChange?.([Number(e.target.value)])}
            {...props}
        />
    )
);
Slider.displayName = "Slider";

export { Slider };
