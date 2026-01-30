"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
    House,
    ChartLineUp,
    Strategy,
    Wallet,
    ListDashes,
    Gear,
    Lightning,
    Database,
    ShieldCheck,
    TerminalWindow,
    Flask,
    BookBookmark,
    Pulse,
    Binoculars,
    SignOut
} from "@phosphor-icons/react";

const MotionLink = motion(Link);

import { useAuth } from "@/context/auth-context";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: House },
    { name: "Market", href: "/market", icon: ChartLineUp },
    { name: "Data", href: "/data", icon: Database },
    { name: "Strategies", href: "/strategies", icon: Strategy },
    { name: "Risk", href: "/risk", icon: ShieldCheck },
    { name: "Portfolio", href: "/portfolio", icon: Wallet },
    { name: "Orders", href: "/orders", icon: ListDashes },
    { name: "System Ops", href: "/system", icon: TerminalWindow },
    { name: "Sim Lab", href: "/lab", icon: Flask },
    { name: "Research", href: "/research", icon: BookBookmark },
    { name: "Settings", href: "/settings", icon: Gear },
];

export function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const { mode } = useAppStore(); // Hook into global mode state

    return (
        <div className="flex h-full w-64 shrink-0 flex-col border-r border-white/10 bg-black/60 backdrop-blur-xl">
            <div className="flex h-16 items-center gap-2 px-6 border-b border-white/5">
                <Lightning weight="duotone" className="h-6 w-6 text-sky-400" />
                <span className="text-lg font-bold tracking-tight text-white">SignalOps</span>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    // Filter for Beginner Mode: Only show Dashboard, Strategies, Portfolio, Settings
                    // "Reduced surface area: limited controls" - README
                    const isBeginnerFriendly = ['Dashboard', 'Strategies', 'Portfolio', 'Settings'].includes(item.name);
                    const { mode } = useAppStore(); // Need to hook this up inside the component

                    if (mode === 'beginner' && !isBeginnerFriendly) return null;

                    return (
                        <MotionLink
                            key={item.name}
                            href={item.href}
                            whileHover={{ x: 5 }}
                            transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
                            className={cn(
                                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200",
                                isActive
                                    ? "bg-sky-500/10 text-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.1)]"
                                    : "text-zinc-300 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon
                                weight={isActive ? "fill" : "regular"}
                                className={cn("h-5 w-5", isActive ? "text-sky-400" : "text-zinc-300 group-hover:text-white")}
                            />
                            {item.name}
                        </MotionLink>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5">
                <div className="flex items-center gap-3 rounded-lg bg-white/5 p-3 mb-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white">
                        {user?.name?.charAt(0) || "U"}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-medium text-white truncate">{user?.name || "User"}</span>
                        <span className="text-xs text-zinc-400 truncate">{user?.email || "user@signalops.com"}</span>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
                >
                    <SignOut className="h-4 w-4" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
