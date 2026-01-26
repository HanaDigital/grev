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
    keywords: [
        "grev",
        "github",
        "release",
        "tracker",
        "statistic",
        "viewer",
        "download",
        "count",
    ],
    openGraph: {
        siteName: "GREV",
        locale: "en_US",
        url: "https://grev.shehryar.ae",
        type: "website",
        title: "GREV",
        description:
            "Github Release Viewer - View and track releases of your favorite GitHub repositories with ease.",
        images: [
            {
                url: "https://user-images.githubusercontent.com/41040912/116804280-ad57f480-ab2e-11eb-9bb9-46e714c05ac3.png",
                width: 800,
                height: 300,
                alt: "grev",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "GREV",
        description:
            "Github Release Viewer - View and track releases of your favorite GitHub repositories with ease.",
        creator: "@devshehryar",
        site: "@devshehryar",
        images: [
            {
                url: "https://user-images.githubusercontent.com/41040912/116804280-ad57f480-ab2e-11eb-9bb9-46e714c05ac3.png",
                width: 800,
                height: 300,
                alt: "grev",
            },
        ],
    },
    alternates: {
        canonical: "https://grev.shehryar.ae",
    },
    metadataBase: new URL("https://grev.shehryar.ae"),
    robots: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
        googleBot: "index, follow",
    },
    applicationName: "GREV",
    appleWebApp: {
        title: "GREV",
        statusBarStyle: "default",
        capable: true,
    },
    icons: {
        icon: [
            {
                url: "/favicon.ico",
                type: "image/x-icon",
            },
            // {
            //     url: "/favicon-16x16.png",
            //     sizes: "16x16",
            //     type: "image/png",
            // },
            // add favicon-32x32.png, favicon-96x96.png, android-chrome-192x192.png
        ],
        shortcut: [
            {
                url: "/favicon.ico",
                type: "image/x-icon",
            },
        ],
        // apple: [
        //     {
        //         url: "/apple-icon-57x57.png",
        //         sizes: "57x57",
        //         type: "image/png",
        //     },
        //     {
        //         url: "/apple-icon-60x60.png",
        //         sizes: "60x60",
        //         type: "image/png",
        //     },
        //     // add apple-icon-72x72.png, apple-icon-76x76.png, apple-icon-114x114.png, apple-icon-120x120.png, apple-icon-144x144.png, apple-icon-152x152.png, apple-icon-180x180.png
        // ],
    },
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
