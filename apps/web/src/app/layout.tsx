import type { Metadata, Viewport } from "next";
import "./globals.css";
import { RootLayoutClient } from "@/components/layout/RootLayoutClient";

export const metadata: Metadata = {
  title: "Election AI Assistant | Intelligence Command for Voters",
  description: "Enterprise-grade election intelligence platform tailored for elderly users. Non-partisan candidate research, step-by-step voter guides, and AI-powered assistance.",
  keywords: ["election 2024", "voter assistant", "senior voting help", "candidate comparison", "election timeline", "non-partisan voter guide"],
  authors: [{ name: "Krish Joshi" }, { name: "Antigravity AI" }],
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
  icons: {
    icon: "/favicon.ico",
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
    <RootLayoutClient>
      {children}
    </RootLayoutClient>
  );
}
