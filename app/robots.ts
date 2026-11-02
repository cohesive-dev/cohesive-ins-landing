import type { MetadataRoute } from "next";
import { SITEMAP_BASE, SITEMAP_SECTIONS, sitemapSectionUrl } from "@/lib/seo/sitemap-sections";

// Served at /robots.txt. Allows all crawlers and lists the sitemap index plus each section sitemap
// so search engines discover every /insurance and /guides page. Canonical host is www.

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: [`${SITEMAP_BASE}/sitemap.xml`, ...SITEMAP_SECTIONS.map(sitemapSectionUrl)],
    host: SITEMAP_BASE,
  };
}
