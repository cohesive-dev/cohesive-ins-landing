import type { MetadataRoute } from "next";
import { SITEMAP_SECTIONS, sitemapSection } from "@/lib/seo/sitemap-sections";

// Served as /sitemap/<section>.xml, one file per section; /sitemap.xml is the index that lists them.
export async function generateSitemaps() {
  return SITEMAP_SECTIONS.map((id) => ({ id }));
}

export default async function sitemap({ id }: { id: Promise<string> }): Promise<MetadataRoute.Sitemap> {
  return sitemapSection(await id);
}
