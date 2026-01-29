"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Lightning, SignIn } from "@phosphor-icons/react";

const navItems = [
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Status", href: "/status" },
    { name: "Docs", href: "/docs" },
    { name: "About", href: "/about" },
];

export function PublicNav() {
    const pathname = usePathname();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#586e75]/30 bg-[#002b36]/95 backdrop-blur-md">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <Lightning weight="duotone" className="h-6 w-6 text-[#2aa198] group-hover:text-[#fdf6e3] transition-colors" />
                    <span className="text-lg font-bold tracking-tight text-[#fdf6e3] font-mono">SIGNAL_OPS</span>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "text-xs font-bold uppercase tracking-widest transition-colors font-mono",
                                    isActive ? "text-[#2aa198]" : "text-[#839496] hover:text-[#fdf6e3]"
                                )}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-6">
                    <Link href="/login" className="text-xs font-bold uppercase tracking-widest text-[#839496] hover:text-[#fdf6e3] transition-colors font-mono">
                        Log In
                    </Link>
                    <Link
                        href="/signup"
                        className="flex items-center gap-2 bg-[#268bd2] hover:bg-[#2aa198] text-white text-xs font-bold uppercase tracking-widest px-6 py-2 rounded-sm transition-all border border-[#586e75]"
                    >
                        Get Access <SignIn className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </header>
    );
}
