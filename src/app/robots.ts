// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/stats/",
        disallow: ["/stats/api/", "/stats/_next/"],
      },
    ],
    sitemap: [
      "https://tooxclusive.com/stats/sitemap.xml",
      "https://tooxclusive.com/stats/sitemap-index.xml",
    ],
    host: "https://tooxclusive.com",
  };
}
