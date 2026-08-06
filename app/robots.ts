import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://bravero.ai/sitemap.xml",
    host: "https://bravero.ai",
  };
}
