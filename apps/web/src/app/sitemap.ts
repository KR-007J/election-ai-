import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: "https://election-assistant.ai/",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://election-assistant.ai/login",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
