import type { Metadata } from "next";
import { Outfit, Teko, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { StoreProvider } from "@/components/providers/store-provider";
import AuthProvider from "@/components/providers/auth-provider";
import { getSession } from "@/lib/auth";
import { SpeedInsights } from "@vercel/speed-insights/next";
import AnalyticsProvider from "@/components/providers/analytics-provider";

const outfitSans = Outfit({
    variable: "--font-outfit-sans",
    subsets: ["latin"],
});

const permanentMarker = Teko({
    variable: "--font-teko-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "GREV",
    description:
        "Github Release Viewer - View and track releases of your favorite GitHub repositories with ease.",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getSession();

    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${outfitSans.variable} ${permanentMarker.variable} ${geistMono.variable} antialiased`}
            >
                <AuthProvider session={session}>
                    <StoreProvider>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="system"
                            enableSystem
                            disableTransitionOnChange
                        >
                            {children}
                            <Toaster />
                        </ThemeProvider>
                    </StoreProvider>
                </AuthProvider>
                <SpeedInsights />
                <AnalyticsProvider />
            </body>
        </html>
    );
}
