import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Dev-only: lets phones on the office LAN load the dev server (Next blocks
  // cross-origin dev requests otherwise — pages render but never hydrate).
  allowedDevOrigins: ["192.168.1.161"],
};

export default nextConfig;
