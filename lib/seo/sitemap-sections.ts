// Sitemap sections (SEO 2026-10-03). One flat 7,000-URL file became six files, so Search Console
// reports indexing per section (core/hubs, contractor states, cities, restaurants, church/property,
// guides) instead of one number for the whole site. Every URL that was in the old flat sitemap is in
// exactly one section. /sitemap.xml stays live as the sitemap index (app/sitemap-index.xml/route.ts
// via a rewrite in next.config.ts), so the URL already in Search Console and Bing keeps working.
import { METRO_PAGES, METRO_UPDATED, metroUpdatedForPath } from "@/lib/seo/metro-pages";
import { SERVICE_PATHS, SERVICE_UPDATED } from "@/lib/seo/service-industries";
import type { MetadataRoute } from "next";
import { PRODUCER_PATH } from "@/lib/entity";
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
import { CHURCH_STATES, CHURCH_UPDATED } from "@/lib/seo/church-content";
import {
  RESTAURANT_TYPES,
  RESTAURANT_TYPE_STATES,
  RESTAURANT_TYPES_UPDATED,
  RESTAURANT_EXTRA_STATES,
  RESTAURANT_CITY_TYPES,
  RESTAURANT_CITIES,
} from "@/lib/seo/restaurant-types";

export const SITEMAP_BASE = "https://www.cohesiveinsure.com";
const BASE = SITEMAP_BASE;

export const SITEMAP_SECTIONS = ["core", "contractor-state", "city", "restaurant", "church-property", "guides"] as const;
export type SitemapSection = (typeof SITEMAP_SECTIONS)[number];

type Entry = MetadataRoute.Sitemap[number];

const depth = (url: string) => url.slice(BASE.length).split("/").filter(Boolean).length;

function buildSections(): Record<SitemapSection, Entry[]> {
  const core = [""].map((p) => ({
    url: `${BASE}${p}`,
    changeFrequency: "monthly" as const,
  }));

  const commercialProperty = [{
    url: `${BASE}/insurance/commercial-property`,
    lastModified: COMMERCIAL_PROPERTY_UPDATED,
    changeFrequency: "monthly" as const,
  }];

  const church = [
    {
      url: `${BASE}/insurance/church`,
      lastModified: CHURCH_UPDATED,
      changeFrequency: "monthly" as const,
    },
    ...CHURCH_STATES.map((state) => ({
      url: `${BASE}/insurance/church/${state.slug}`,
      lastModified: CHURCH_UPDATED,
      changeFrequency: "monthly" as const,
    })),
  ];

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

  const extraRestaurantStates = RESTAURANT_EXTRA_STATES.map((st) => ({
    url: `${BASE}/insurance/restaurant/${st.slug}`,
    lastModified: RESTAURANT_TYPES_UPDATED,
    changeFrequency: "monthly" as const,
  }));

  const restaurantCities = RESTAURANT_CITY_TYPES.flatMap((type) =>
    RESTAURANT_CITIES.map((c) => ({
      url: `${BASE}/insurance/${type.slug}/${c.stateSlug}/${c.slug}`,
      lastModified: RESTAURANT_TYPES_UPDATED,
      changeFrequency: "monthly" as const,
    })),
  );

  const restaurantTypes = RESTAURANT_TYPES.flatMap((type) => [
    // A state-only type (bakery) keeps its older national URL in the verticals list above.
    ...(type.stateOnly ? [] : [{
      url: `${BASE}/insurance/${type.slug}`,
      lastModified: RESTAURANT_TYPES_UPDATED,
      changeFrequency: "monthly" as const,
    }]),
    ...RESTAURANT_TYPE_STATES.map((state) => ({
      url: `${BASE}/insurance/${type.slug}/${state.slug}`,
      lastModified: RESTAURANT_TYPES_UPDATED,
      changeFrequency: "monthly" as const,
    })),
  ]);

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

  const servicePages = SERVICE_PATHS.map(path => ({ url: `${BASE}${path}`, lastModified: SERVICE_UPDATED, changeFrequency: "monthly" as const }));
  const metroPages = METRO_PAGES.map(p => ({ url: `${BASE}${p.path}`, lastModified: METRO_UPDATED, changeFrequency: "monthly" as const }));
  const about = [{ url: `${BASE}${PRODUCER_PATH}`, lastModified: "2026-10-03", changeFrequency: "yearly" as const }];

  const sections: Record<SitemapSection, Entry[]> = {
    core: [...core, ...hub, ...about, ...verticals, ...servicePages.filter((e) => depth(e.url) <= 2)],
    "contractor-state": [...tradeStates, ...servicePages.filter((e) => depth(e.url) === 3)],
    city: [...metroPages, ...restaurantCities, ...servicePages.filter((e) => depth(e.url) >= 4)],
    restaurant: [...foodStates, ...extraRestaurantStates, ...restaurantTypes],
    "church-property": [...commercialProperty, ...church],
    guides,
  };
  const withUpdated = (entry: Entry): Entry => {
    const updated = entry.url === `${BASE}/insurance/cleaning/new-york` ? "2026-09-16" : metroUpdatedForPath(entry.url.slice(BASE.length));
    return updated ? { ...entry, lastModified: updated } : entry;
  };
  return Object.fromEntries(
    SITEMAP_SECTIONS.map((id) => [id, sections[id].map(withUpdated)]),
  ) as Record<SitemapSection, Entry[]>;
}

let cached: Record<SitemapSection, Entry[]> | undefined;

export function sitemapSection(id: string): Entry[] {
  cached ??= buildSections();
  return (SITEMAP_SECTIONS as readonly string[]).includes(id) ? cached[id as SitemapSection] : [];
}

export function allSitemapEntries(): Entry[] {
  return SITEMAP_SECTIONS.flatMap((id) => sitemapSection(id));
}

export const sitemapSectionUrl = (id: SitemapSection) => `${BASE}/sitemap/${id}.xml`;
