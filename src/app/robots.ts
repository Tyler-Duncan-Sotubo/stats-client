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
    sitemap: "https://tooxclusive.com/sitemap.xml", // ← root domain
    host: "https://tooxclusive.com",
  };
}
