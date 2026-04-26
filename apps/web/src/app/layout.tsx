import type { Metadata, Viewport } from "next";
import "./globals.css";
import { RootLayoutClient } from "@/components/layout/RootLayoutClient";

export const metadata: Metadata = {
  metadataBase: new URL("https://election-assistant.ai"),
  applicationName: "Election AI Assistant",
  title: "Election AI Assistant | Intelligence Command for Voters",
  description: "Enterprise-grade election intelligence platform tailored for elderly users. Non-partisan candidate research, step-by-step voter guides, and AI-powered assistance.",
  keywords: ["election 2024", "voter assistant", "senior voting help", "candidate comparison", "election timeline", "non-partisan voter guide"],
  authors: [{ name: "Krish Joshi" }, { name: "Antigravity AI" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Election AI Assistant | Your Democratic Partner",
    description: "Advanced election intelligence and voter assistance platform for all citizens.",
    url: "https://election-assistant.ai",
    siteName: "Election AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Election AI Assistant",
    description: "Empowering voters with non-partisan intelligence and accessibility.",
  },
  robots: "index, follow",
  manifest: "/manifest.webmanifest",
  category: "government",
  icons: {
    icon: "/favicon.ico",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#00E5FF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-on-background font-body-md antialiased">
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-6 focus:py-3 focus:bg-primary focus:text-white focus:rounded-xl focus:font-bold focus:shadow-2xl"
        >
          Skip to main content
        </a>
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}
