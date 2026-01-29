"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { pageVariants } from "@/lib/motion-variants";

export default function Template({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Determine the kinetic personality based on route
    const getVariant = () => {
        if (pathname === "/") return pageVariants.solar;
        if (pathname === "/login") return pageVariants.cyber;
        if (pathname.startsWith("/signup")) return pageVariants.technical;
        if (pathname.startsWith("/features")) return pageVariants.technical;
        if (pathname.startsWith("/pricing")) return pageVariants.luxury;
        if (pathname.startsWith("/status")) return pageVariants.terminal; // Status uses HUD (CRT feel)
        if (pathname.startsWith("/docs")) return pageVariants.terminal;   // Docs scans in
        if (pathname.startsWith("/about")) return pageVariants.luxury;

        // Default for dashboard/other
        return pageVariants.technical;
    };

    const variant = getVariant();

    return (
        <motion.div
            variants={variant}
            initial="initial"
            animate="animate"
            // Exit animations require AnimatePresence in layout, skipping for now to prioritize entrance feel
            className="w-full h-full"
        >
            {children}
        </motion.div>
    );
}
