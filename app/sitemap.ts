import { METRO_PAGES, METRO_UPDATED, metroUpdatedForPath } from "@/lib/seo/metro-pages";
import { SERVICE_PATHS, SERVICE_UPDATED } from "@/lib/seo/service-industries";
import type { MetadataRoute } from "next";
import { STATES, STATE_VERTICALS, VERTICALS } from "@/lib/seo/data";
import { priorityStateUpdated } from "@/lib/seo/priority-state-content";
import { TRADES } from "@/lib/seo/contractors";
import { GUIDE_UPDATED } from "@/lib/guides/restaurant";
import { STARTUP_GUIDES } from "@/lib/guides/catalog";
import {
  CONTRACTOR_STATE_SLUGS,
  contractorStateBuildable,
} from "@/lib/seo/contractor-states";
import { COMMERCIAL_PROPERTY_UPDATED } from "@/lib/seo/commercial-property-content";

const BASE = "https://www.cohesiveinsure.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const core = [""].map((p) => ({
    url: `${BASE}${p}`,
    changeFrequency: "monthly" as const,
  }));

  const commercialProperty = [{
    url: `${BASE}/insurance/commercial-property`,
    lastModified: COMMERCIAL_PROPERTY_UPDATED,
    changeFrequency: "monthly" as const,
  }];

  const hub = [{ url: `${BASE}/insurance`, changeFrequency: "monthly" as const }];

  const verticals = [
    ...VERTICALS.filter((v) => v.slug !== "bar").map((v) => v.slug),
    ...TRADES.map((t) => t.slug),
  ].map(
    (slug) => ({
      url: `${BASE}/insurance/${slug}`,
      ...(["pool", "remodeler"].includes(slug) ? { lastModified: "2026-09-15" } : {}),
      changeFrequency: "monthly" as const,
    }),
  );

  const foodStates = STATE_VERTICALS.filter((vs) => vs !== "bar").flatMap((vs) =>
    STATES.map((s) => ({
      url: `${BASE}/insurance/${vs}/${s.slug}`,
      changeFrequency: "monthly" as const,
    })),
  );

  const tradeStates = TRADES.flatMap((t) =>
    (t.nationalOnly ? [] : CONTRACTOR_STATE_SLUGS).filter((s) => contractorStateBuildable(t.slug, s)).map(
      (s) => ({
        url: `${BASE}/insurance/${t.slug}/${s}`,
        ...((["pool", "remodeler"].includes(t.slug) || priorityStateUpdated(`/insurance/${t.slug}/${s}`)) ? { lastModified: ["pool", "remodeler"].includes(t.slug) ? "2026-09-15" : priorityStateUpdated(`/insurance/${t.slug}/${s}`) } : {}),
        changeFrequency: "monthly" as const,
      }),
    ),
  );

  const guides = [{ slug: "", updatedAt: "2026-09-16" }, ...STARTUP_GUIDES].map((guide) => ({
    url: `${BASE}/guides${guide.slug ? `/${guide.slug}` : ""}`,
    lastModified: guide.updatedAt ?? GUIDE_UPDATED,
    changeFrequency: "monthly" as const,
  }));

  return [...core, ...hub, ...commercialProperty, ...verticals, ...foodStates, ...tradeStates, ...guides,
    ...SERVICE_PATHS.map(path => ({ url: `${BASE}${path}`, lastModified: SERVICE_UPDATED, changeFrequency: "monthly" as const })),
    ...METRO_PAGES.map(p => ({ url: `${BASE}${p.path}`, lastModified: METRO_UPDATED, changeFrequency: "monthly" as const })),
  ].map(entry => {
    const updated = entry.url === `${BASE}/insurance/cleaning/new-york` ? "2026-09-16" : metroUpdatedForPath(entry.url.slice(BASE.length));
    return updated ? { ...entry, lastModified: updated } : entry;
  });
}
