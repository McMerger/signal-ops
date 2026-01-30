import type { Metadata } from "next";
import {
  IBM_Plex_Sans,
  JetBrains_Mono,
  Syne,
  Fraunces,
  Space_Grotesk,
  Chakra_Petch,
  VT323
} from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ThemeProvider } from "@/components/theme-provider";
import { ErrorBoundary } from "@/components/ui/error-boundary";

import { DisclaimerBanner } from "@/components/layout/disclaimer-banner";

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-plex"
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono"
});

// Phase 10: Aesthetic Diversity Fonts (Refined for Solarized)
const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne"
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space"
});

const chakraPetch = Chakra_Petch({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-chakra"
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323"
});

export const metadata: Metadata = {
  title: "SignalOps Terminal",
  description: "Event-Aware Algorithmic Trading Engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontVariables = [
    ibmPlexSans.variable,
    jetbrainsMono.variable,
    syne.variable,
    fraunces.variable,
    spaceGrotesk.variable,
    chakraPetch.variable,
    vt323.variable
  ].join(" ");

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontVariables} font-sans bg-background text-foreground antialiased text-base tracking-wide`}>
        <ThemeProvider>
          <ErrorBoundary>

            <Providers>
              {children}
            </Providers>
            <DisclaimerBanner />
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
