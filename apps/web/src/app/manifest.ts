import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Election AI Assistant",
    short_name: "Election AI",
    description: "Accessible non-partisan election guidance and voter assistance.",
    start_url: "/",
    display: "standalone",
    background_color: "#051424",
    theme_color: "#00e5ff",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
