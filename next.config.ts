import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Approved collector rollout; an explicit environment override can disable it.
  env: { NEXT_PUBLIC_FB_FUNNEL_ENABLED: process.env.NEXT_PUBLIC_FB_FUNNEL_ENABLED ?? 'true' },
  // Dev-only: lets phones on the office LAN load the dev server (Next blocks
  // cross-origin dev requests otherwise — pages render but never hydrate).
  allowedDevOrigins: ["192.168.1.161"],
};

export default nextConfig;
