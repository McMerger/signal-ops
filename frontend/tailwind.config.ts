import type { Config } from "tailwindcss"

const config = {
    darkMode: "class",
    content: [
        "./src/**/*.{ts,tsx}",
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            fontFamily: {
                sans: ["var(--font-plex)", "sans-serif"],
                mono: ["var(--font-mono)", "monospace"],
                // Phase 10: Aesthetic Diversity (Refined)
                cosmic: ["var(--font-syne)", "sans-serif"],         // Home (Syne is artful/weird)
                security: ["var(--font-chakra)", "sans-serif"],     // Login (Chakra is cyber/glitch)
                portal: ["var(--font-syne)", "sans-serif"],         // Signup
                machine: ["var(--font-space)", "sans-serif"],       // Features
                luxury: ["var(--font-fraunces)", "serif"],          // Pricing (Fraunces is warm/soft)
                hud: ["var(--font-chakra)", "sans-serif"],          // Status
                terminal: ["var(--font-vt323)", "monospace"],       // Docs
                human: ["var(--font-fraunces)", "serif"],           // About
            },
            colors: {
                // Semantic Colors (Solarized Mapped)
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                // Solarized Palette Overrides
                // Mapping standard hues to Solarized equivalents for instant theming
                slate: {
                    50: "#fdf6e3", // Base3
                    100: "#eee8d5", // Base2
                    200: "#93a1a1", // Base1
                    300: "#839496", // Base0
                    400: "#657b83", // Base00
                    500: "#586e75", // Base01
                    600: "#073642", // Base02
                    700: "#073642", // Base02 (Duplicate for safety)
                    800: "#002b36", // Base03
                    900: "#002b36", // Base03
                    950: "#001e26", // Deepest
                },
                zinc: {
                    // Mapping zinc to Solarized bases as well for consistency
                    50: "#fdf6e3", 100: "#eee8d5", 200: "#93a1a1", 300: "#839496",
                    400: "#657b83", 500: "#586e75", 600: "#073642", 700: "#002b36",
                    800: "#002b36", 900: "#001e26", 950: "#001e26"
                },
                blue: {
                    50: "#e6f3ff", 100: "#cce7ff", 200: "#99ceff", 300: "#66b5ff",
                    400: "#339cff", 500: "#268bd2", // Solarized Blue
                    600: "#1e6ea8", 700: "#16527e", 800: "#0e3754", 900: "#061b2a",
                },
                cyan: {
                    500: "#2aa198", // Solarized Cyan
                    600: "#218079",
                },
                green: {
                    500: "#859900", // Solarized Green
                    600: "#6a7a00",
                },
                amber: {
                    500: "#b58900", // Solarized Yellow
                    600: "#916d00",
                },
                orange: {
                    500: "#cb4b16", // Solarized Orange
                    600: "#a23c11",
                },
                red: {
                    500: "#dc322f", // Solarized Red
                    600: "#b02825",
                },
                purple: {
                    500: "#d33682", // Solarized Magenta (used for purple)
                    600: "#a82b68",
                },
                rose: {
                    500: "#dc322f", // Solarized Red
                    600: "#b02825",
                }
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
