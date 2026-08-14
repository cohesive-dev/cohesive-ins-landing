import type { MetadataRoute } from "next";
import { STATES, STATE_VERTICALS, VERTICALS } from "@/lib/seo/data";
import { TRADES } from "@/lib/seo/contractors";
import {
  CONTRACTOR_STATE_SLUGS,
  contractorStateBuildable,
} from "@/lib/seo/contractor-states";

const BASE = "https://www.cohesiveinsure.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const core = ["", "/restaurants", "/restaurant", "/about"].map((p) => ({
    url: `${BASE}${p}`,
    changeFrequency: "monthly" as const,
  }));

  const hub = [{ url: `${BASE}/insurance`, changeFrequency: "monthly" as const }];

  const verticals = [...VERTICALS.map((v) => v.slug), ...TRADES.map((t) => t.slug)].map(
    (slug) => ({
      url: `${BASE}/insurance/${slug}`,
      changeFrequency: "monthly" as const,
    }),
  );

  const foodStates = STATE_VERTICALS.flatMap((vs) =>
    STATES.map((s) => ({
      url: `${BASE}/insurance/${vs}/${s.slug}`,
      changeFrequency: "monthly" as const,
    })),
  );

  const tradeStates = TRADES.flatMap((t) =>
    CONTRACTOR_STATE_SLUGS.filter((s) => contractorStateBuildable(t.slug, s)).map(
      (s) => ({
        url: `${BASE}/insurance/${t.slug}/${s}`,
        changeFrequency: "monthly" as const,
      }),
    ),
  );

  return [...core, ...hub, ...verticals, ...foodStates, ...tradeStates];
}
