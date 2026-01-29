"use client";

import * as React from "react";
import { themes, Theme } from "@/lib/themes";

type ThemeContextType = {
    theme: string;
    setTheme: (theme: string) => void;
    currentTheme: Theme;
};

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = React.useState("dark");

    React.useEffect(() => {
        const savedTheme = localStorage.getItem("signal-ops-theme");
        if (savedTheme && themes[savedTheme]) {
            setTheme(savedTheme);
        }
    }, []);

    React.useEffect(() => {
        const root = window.document.documentElement;
        const currentTheme = themes[theme];

        // Remove previous theme classes if any (optional, but good for cleanup)
        // root.classList.remove(...Object.keys(themes));
        // root.classList.add(theme); // If using class-based theming

        // Inject CSS variables
        Object.entries(currentTheme.colors).forEach(([key, value]) => {
            root.style.setProperty(`--${key}`, value);
        });

        localStorage.setItem("signal-ops-theme", theme);
    }, [theme]);

    const value = {
        theme,
        setTheme,
        currentTheme: themes[theme],
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = React.useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
