import type { Metadata } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

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
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} ${manrope.variable} bg-background text-on-background font-body-md antialiased`}>
        {children}
      </body>
    </html>
  );
}
