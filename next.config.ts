import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      // Kevin 2026-10-21: the roofing-leads offer moved to the Cohesive AI site (a copy of /catering-leads there).
      { source: "/roofing-leads", destination: "https://getcohesiveai.com/roofing-leads", permanent: false },
      {
        source: "/insurance/indiana/pressure-washing-insurance",
        destination: "/insurance/pressure-washing/indiana",
        statusCode: 301,
      },
      // URLs that 404 but still get Search Console impressions (Kevin 2026-10-15): send each to
      // the closest live page with a permanent redirect.
      { source: "/insurance/cost/snow-removal-insurance", destination: "/insurance/snow-removal", statusCode: 301 },
      {
        source: "/guides/how-to-start-a-tree-service-business-connecticut",
        destination: "/guides/how-to-start-a-tree-service-business-in-connecticut",
        statusCode: 301,
      },
      {
        source: "/guides/how-to-get-hvac-contractor-leads-in-oklahoma-city-ok-klahoma",
        destination: "/guides/how-to-get-hvac-contractor-leads-in-oklahoma-city-oklahoma",
        statusCode: 301,
      },
    ];
  },
  // Spanish pages (2026-10-24): Content-Language beside the server-rendered <html lang="es"> (Bing reads both).
  async headers() {
    return [{ source: "/es/:path*", headers: [{ key: "Content-Language", value: "es-US" }] }];
  },
  // /sitemap.xml (the URL already submitted to Search Console and Bing) serves the sitemap index.
  // A route at app/sitemap.xml would collide with app/sitemap.ts (generateSitemaps), so the index
  // lives at /sitemap-index.xml and this rewrite keeps the old URL answering with it.
  async rewrites() {
    return [{ source: "/sitemap.xml", destination: "/sitemap-index.xml" }];
  },
  // Approved collector rollout; an explicit environment override can disable it.
  env: { NEXT_PUBLIC_FB_FUNNEL_ENABLED: process.env.NEXT_PUBLIC_FB_FUNNEL_ENABLED ?? 'true' },
  // Dev-only: lets phones on the office LAN load the dev server (Next blocks
  // cross-origin dev requests otherwise — pages render but never hydrate).
  allowedDevOrigins: ["192.168.1.161"],
};

export default nextConfig;
