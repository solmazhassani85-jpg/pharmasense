import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pharmasense.net";

// /sitemap.xml — فهرستِ صفحاتِ عمومیِ سایت برای موتورهای جستجو.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/services", priority: 0.8 },
    { path: "/about", priority: 0.8 },
    { path: "/booking", priority: 0.6 },
  ];
  return pages.map(({ path, priority }) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority,
  }));
}
