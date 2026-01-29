"use client";

import * as React from "react";
import { useTheme } from "@/components/theme-provider";
import { themes } from "@/lib/themes";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Palette } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Palette className="h-4 w-4" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-[300px] overflow-y-auto">
                {Object.entries(themes).map(([key, value]) => (
                    <DropdownMenuItem
                        key={key}
                        onClick={() => setTheme(key)}
                        className="flex items-center gap-2"
                    >
                        <div
                            className={cn(
                                "h-4 w-4 rounded-full border",
                                theme === key ? "ring-2 ring-primary" : ""
                            )}
                            style={{
                                backgroundColor: `hsl(${value.colors.primary})`,
                            }}
                        />
                        <span>{value.name}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
