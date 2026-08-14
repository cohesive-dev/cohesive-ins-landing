import type { MetadataRoute } from "next";

// Served at /robots.txt. Allows all crawlers and points at the sitemap so
// search engines discover every /insurance page. Canonical host is www.

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://www.cohesiveinsure.com/sitemap.xml",
    host: "https://www.cohesiveinsure.com",
  };
}
