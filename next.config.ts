import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [{
      source: "/insurance/indiana/pressure-washing-insurance",
      destination: "/insurance/pressure-washing/indiana",
      statusCode: 301,
    }];
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
