"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

interface AnimatedNumberProps {
    value: number;
    format?: (value: number) => string;
    className?: string;
}

export function AnimatedNumber({ value, format, className }: AnimatedNumberProps) {
    const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
    const display = useTransform(spring, (current) =>
        format ? format(current) : Math.round(current).toString()
    );

    useEffect(() => {
        spring.set(value);
    }, [value, spring]);

    return <motion.span className={className}>{display}</motion.span>;
}
