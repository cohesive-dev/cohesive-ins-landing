import type { MetadataRoute } from "next";
import { STATES, STATE_VERTICALS, VERTICALS } from "@/lib/seo/data";

const BASE = "https://www.cohesiveinsure.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const core = ["", "/restaurants", "/restaurant"].map((p) => ({
    url: `${BASE}${p}`,
    changeFrequency: "monthly" as const,
  }));

  const hub = [{ url: `${BASE}/insurance`, changeFrequency: "monthly" as const }];

  const verticals = VERTICALS.map((v) => ({
    url: `${BASE}/insurance/${v.slug}`,
    changeFrequency: "monthly" as const,
  }));

  const states = STATE_VERTICALS.flatMap((vs) =>
    STATES.map((s) => ({
      url: `${BASE}/insurance/${vs}/${s.slug}`,
      changeFrequency: "monthly" as const,
    })),
  );

  return [...core, ...hub, ...verticals, ...states];
}
