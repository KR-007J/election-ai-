import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Election AI Assistant",
    short_name: "Election AI",
    description: "Accessible non-partisan election guidance and voter assistance.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#051424",
    theme_color: "#00e5ff",
    categories: ["education", "government", "productivity"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
    shortcuts: [
      {
        name: "Voter Guide",
        url: "/guide",
        description: "Step-by-step voter preparation"
      },
      {
        name: "AI Assistant",
        url: "/chat",
        description: "Ask questions to Gemini"
      }
    ]
  };
}
