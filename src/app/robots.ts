import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pharmasense.net";

// /robots.txt — به موتورهای جستجو می‌گوید چه چیزی را ببینند و کجا را نبینند.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/dashboard", "/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
