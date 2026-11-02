import { SITEMAP_SECTIONS, sitemapSectionUrl } from "@/lib/seo/sitemap-sections";

// Sitemap index for the section files. /sitemap.xml (the single flat sitemap until 2026-10-03, and
// the URL already submitted to Search Console and Bing) is rewritten here in next.config.ts.
export const dynamic = "force-static";

export function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SITEMAP_SECTIONS.map((id) => `  <sitemap><loc>${sitemapSectionUrl(id)}</loc></sitemap>`).join("\n")}
</sitemapindex>
`;
  return new Response(body, { headers: { "Content-Type": "application/xml" } });
}
