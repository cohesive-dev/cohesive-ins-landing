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
  getContractorState,
} from "@/lib/seo/contractor-states";
import { tradePriceUpdated } from "@/lib/seo/trade-prices";
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
import { ES_PAGES, spanishFor } from "@/lib/es/pages";

// Restaurant type x state pages left OUT of the sitemap (Kevin 2026-10-15): every /insurance/<type>/<state> URL with
// 0 Search Console impressions in the 60 days 2026-08-16..2026-10-14 (1,122 of 1,900). The pages stay live,
// indexable and linked from their state hub (/insurance/restaurant/<state>); only the sitemap drops them, so
// crawl attention goes to the state hubs and the type pages that do get impressions. Type -> space-separated
// state slugs. A type or state not listed here stays in the sitemap.
export const RESTAURANT_TYPE_STATES_NOT_IN_SITEMAP: Record<string, string> = {
  "bagel-shop": "alabama alaska arizona arkansas colorado connecticut florida georgia hawaii idaho illinois indiana iowa kansas kentucky louisiana maine michigan minnesota mississippi missouri montana nevada new-hampshire new-jersey new-mexico north-carolina north-dakota ohio oklahoma oregon pennsylvania south-carolina south-dakota tennessee utah vermont virginia washington west-virginia wisconsin wyoming",
  "bakery": "alabama alaska arkansas district-of-columbia florida georgia idaho indiana iowa kansas louisiana maine maryland massachusetts michigan minnesota mississippi missouri nebraska nevada new-hampshire new-jersey north-carolina north-dakota ohio oregon pennsylvania south-carolina south-dakota texas vermont virginia west-virginia wisconsin wyoming",
  "barbecue-restaurant": "iowa kansas minnesota new-hampshire ohio oregon rhode-island south-dakota utah virginia wyoming",
  "breakfast-restaurant": "alaska idaho illinois indiana iowa maryland new-york rhode-island",
  "bubble-tea-shop": "alaska arizona colorado connecticut delaware district-of-columbia florida georgia hawaii idaho illinois indiana iowa kansas kentucky louisiana maine maryland massachusetts minnesota mississippi missouri montana nebraska nevada new-hampshire new-jersey new-york north-carolina north-dakota ohio oklahoma oregon rhode-island south-carolina south-dakota tennessee texas utah vermont virginia washington west-virginia wisconsin wyoming",
  "burger-restaurant": "alabama arizona arkansas delaware idaho iowa maine minnesota missouri nevada new-hampshire new-jersey new-mexico north-carolina north-dakota pennsylvania south-carolina west-virginia",
  "buying-a-restaurant": "alaska arizona colorado connecticut delaware district-of-columbia florida georgia hawaii idaho illinois indiana iowa kentucky louisiana mississippi missouri montana nebraska nevada new-hampshire new-jersey new-mexico new-york north-carolina ohio oklahoma oregon pennsylvania rhode-island south-carolina south-dakota tennessee texas utah vermont virginia washington west-virginia",
  "caribbean-restaurant": "alaska arizona colorado connecticut district-of-columbia florida idaho illinois indiana iowa kansas kentucky louisiana maine massachusetts michigan mississippi missouri nebraska nevada new-jersey new-mexico new-york north-carolina north-dakota ohio oklahoma oregon rhode-island south-carolina south-dakota tennessee texas utah vermont virginia west-virginia wisconsin wyoming",
  "chinese-restaurant": "alabama alaska arizona arkansas florida georgia indiana iowa minnesota missouri montana nevada new-jersey new-mexico ohio oregon tennessee utah washington west-virginia",
  "coffee-shop": "delaware district-of-columbia kansas louisiana maryland montana nevada new-mexico ohio oklahoma south-carolina wyoming",
  "deli": "alaska arkansas colorado delaware idaho iowa maine massachusetts michigan mississippi missouri nebraska nevada north-carolina tennessee utah virginia",
  "donut-shop": "alabama alaska arkansas colorado connecticut district-of-columbia georgia hawaii illinois indiana kentucky louisiana maine minnesota mississippi missouri montana nebraska nevada new-hampshire new-jersey oklahoma oregon pennsylvania south-carolina south-dakota utah vermont west-virginia wyoming",
  "fast-food-restaurant": "district-of-columbia idaho nevada",
  "fine-dining-restaurant": "alaska arizona arkansas colorado delaware georgia idaho kansas michigan missouri nebraska nevada new-jersey north-dakota ohio tennessee virginia washington wyoming",
  "fried-chicken-restaurant": "alaska arkansas connecticut district-of-columbia iowa kentucky louisiana maine maryland michigan minnesota missouri montana nebraska nevada new-hampshire new-jersey new-mexico north-dakota oregon texas utah washington west-virginia wisconsin",
  "ghost-kitchen": "arizona arkansas colorado connecticut delaware georgia hawaii idaho illinois indiana iowa kansas kentucky louisiana maine maryland massachusetts minnesota mississippi missouri montana new-hampshire new-jersey new-mexico new-york north-carolina north-dakota ohio oklahoma oregon pennsylvania rhode-island south-carolina south-dakota tennessee vermont virginia west-virginia wisconsin wyoming",
  "growing-restaurant": "alaska arkansas connecticut delaware district-of-columbia florida georgia maine massachusetts north-carolina north-dakota oregon south-carolina south-dakota utah washington wyoming",
  "halal-restaurant": "alabama alaska arizona arkansas colorado connecticut delaware district-of-columbia florida georgia hawaii idaho illinois indiana iowa kansas kentucky louisiana maine maryland michigan minnesota mississippi missouri montana nebraska nevada new-jersey new-mexico north-carolina north-dakota ohio oklahoma oregon pennsylvania rhode-island south-carolina south-dakota tennessee texas utah vermont virginia washington west-virginia wisconsin wyoming",
  "hibachi-restaurant": "alabama alaska arizona arkansas colorado connecticut delaware district-of-columbia florida georgia hawaii idaho illinois indiana iowa kansas kentucky louisiana maine maryland massachusetts michigan missouri montana nebraska nevada new-mexico new-york north-carolina north-dakota ohio oklahoma oregon rhode-island south-carolina south-dakota texas utah vermont virginia west-virginia wisconsin wyoming",
  "ice-cream-shop": "alaska arizona arkansas connecticut delaware district-of-columbia kentucky louisiana michigan minnesota mississippi montana ohio oklahoma oregon rhode-island south-dakota utah washington",
  "indian-restaurant": "alabama alaska arizona arkansas connecticut district-of-columbia florida georgia idaho illinois indiana iowa kansas kentucky louisiana maine maryland massachusetts minnesota mississippi montana nebraska nevada new-hampshire new-jersey new-mexico new-york north-dakota oregon pennsylvania rhode-island south-carolina tennessee texas vermont virginia washington west-virginia wisconsin wyoming",
  "italian-restaurant": "alabama arkansas connecticut georgia indiana iowa maine maryland new-jersey new-mexico oklahoma oregon pennsylvania wyoming",
  "juice-bar": "alabama arizona arkansas colorado connecticut delaware district-of-columbia hawaii illinois indiana iowa kansas kentucky louisiana maine maryland massachusetts michigan minnesota mississippi missouri montana nebraska nevada new-hampshire new-jersey new-mexico new-york north-dakota oklahoma oregon pennsylvania rhode-island south-carolina south-dakota tennessee texas utah vermont virginia washington wisconsin wyoming",
  "korean-restaurant": "alabama arizona colorado connecticut delaware district-of-columbia florida georgia hawaii idaho illinois indiana iowa kansas kentucky louisiana maine maryland massachusetts michigan minnesota mississippi missouri montana nebraska new-hampshire new-jersey new-mexico new-york north-carolina north-dakota ohio oklahoma oregon pennsylvania rhode-island south-carolina south-dakota tennessee texas utah vermont virginia washington west-virginia wisconsin wyoming",
  "mediterranean-restaurant": "alabama connecticut delaware district-of-columbia georgia idaho illinois indiana iowa louisiana maryland michigan mississippi nevada new-hampshire north-carolina north-dakota ohio oklahoma south-carolina south-dakota tennessee virginia wyoming",
  "mexican-restaurant": "alabama alaska delaware georgia hawaii idaho iowa minnesota mississippi montana nebraska nevada new-hampshire north-carolina north-dakota oklahoma oregon rhode-island south-carolina south-dakota utah virginia west-virginia wisconsin wyoming",
  "new-restaurant": "alabama alaska arkansas colorado connecticut delaware district-of-columbia florida georgia idaho illinois indiana kansas kentucky louisiana maine massachusetts michigan minnesota missouri montana nebraska nevada new-hampshire new-jersey new-york north-carolina north-dakota oregon pennsylvania rhode-island south-dakota tennessee texas utah vermont virginia west-virginia wisconsin wyoming",
  "pizzeria": "arkansas delaware kansas louisiana massachusetts mississippi nebraska new-mexico oregon tennessee west-virginia wyoming",
  "ramen-restaurant": "alabama alaska arizona arkansas colorado connecticut delaware district-of-columbia florida georgia hawaii illinois indiana iowa kansas kentucky louisiana maine maryland michigan mississippi missouri montana nevada new-mexico north-carolina north-dakota ohio oklahoma oregon pennsylvania rhode-island south-carolina tennessee vermont virginia wisconsin",
  "restaurant-delivery": "alabama alaska arkansas colorado connecticut district-of-columbia florida georgia hawaii idaho illinois indiana iowa kansas kentucky louisiana maine michigan minnesota mississippi missouri montana nebraska nevada new-mexico new-york north-carolina north-dakota ohio oklahoma oregon pennsylvania rhode-island south-carolina south-dakota tennessee texas vermont virginia washington wisconsin wyoming",
  "seafood-restaurant": "alabama arkansas colorado hawaii indiana kentucky mississippi montana nebraska south-dakota utah virginia west-virginia wisconsin",
  "soul-food-restaurant": "alabama alaska arizona arkansas colorado connecticut delaware district-of-columbia florida georgia hawaii idaho illinois indiana iowa kansas louisiana maine maryland massachusetts michigan minnesota mississippi missouri montana nebraska nevada new-hampshire new-jersey new-york north-carolina north-dakota ohio oklahoma oregon pennsylvania rhode-island south-carolina south-dakota tennessee texas utah vermont virginia washington west-virginia wisconsin wyoming",
  "steakhouse": "alabama alaska arizona arkansas colorado connecticut district-of-columbia florida georgia idaho illinois indiana kentucky louisiana maryland massachusetts michigan minnesota mississippi missouri montana nebraska nevada new-hampshire new-jersey new-mexico north-dakota ohio oklahoma oregon pennsylvania rhode-island south-carolina south-dakota tennessee texas vermont virginia washington west-virginia wisconsin wyoming",
  "sushi-restaurant": "alaska arizona arkansas georgia hawaii illinois iowa louisiana maine maryland minnesota mississippi montana nevada new-hampshire new-mexico north-dakota ohio oklahoma oregon south-carolina south-dakota utah west-virginia wyoming",
  "thai-restaurant": "alabama alaska arizona colorado delaware district-of-columbia florida georgia hawaii illinois indiana iowa kentucky louisiana maine maryland massachusetts michigan minnesota mississippi missouri montana nebraska nevada new-hampshire new-mexico new-york ohio oklahoma oregon pennsylvania rhode-island south-carolina texas vermont virginia west-virginia wyoming",
  "vegan-restaurant": "alabama arizona arkansas colorado idaho illinois indiana kentucky louisiana massachusetts michigan montana nebraska nevada new-hampshire new-jersey oregon pennsylvania rhode-island south-carolina south-dakota tennessee virginia",
  "vietnamese-restaurant": "alabama alaska arizona connecticut delaware district-of-columbia florida georgia hawaii illinois indiana iowa kentucky louisiana maine maryland massachusetts michigan minnesota missouri montana nebraska nevada new-hampshire new-jersey new-mexico new-york north-carolina north-dakota ohio oklahoma oregon pennsylvania rhode-island south-carolina south-dakota tennessee texas vermont virginia washington west-virginia wisconsin wyoming",
  "wing-restaurant": "alabama arizona arkansas colorado connecticut delaware district-of-columbia florida idaho illinois indiana kentucky louisiana maine maryland michigan mississippi missouri montana nebraska new-jersey new-mexico north-carolina oregon pennsylvania south-carolina south-dakota tennessee texas utah vermont virginia west-virginia wisconsin wyoming",
};
export function restaurantTypeStateInSitemap(typeSlug: string, stateSlug: string): boolean {
  return !(RESTAURANT_TYPE_STATES_NOT_IN_SITEMAP[typeSlug] ?? "").split(" ").includes(stateSlug);
}

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
      ...(tradePriceUpdated(slug) ? { lastModified: tradePriceUpdated(slug) } : {}),
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
    ...RESTAURANT_TYPE_STATES.filter((state) => restaurantTypeStateInSitemap(type.slug, state.slug)).map((state) => ({
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
        // A dated price release (roofer 2026-10-22) is the page's latest change, only where the price applies.
        ...(tradePriceUpdated(t.slug, getContractorState(s)?.abbr) ? { lastModified: tradePriceUpdated(t.slug, getContractorState(s)?.abbr) } : {}),
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
  // Spanish pages (Kevin 2026-10-22). Their hreflang pairs are added below by withLanguages.
  const spanish = ES_PAGES.map((p) => ({ url: `${BASE}${p.path}`, lastModified: p.updated, changeFrequency: "monthly" as const }));

  const sections: Record<SitemapSection, Entry[]> = {
    core: [...core, ...hub, ...about, ...verticals, ...servicePages.filter((e) => depth(e.url) <= 2), ...spanish],
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
  // hreflang es-US <-> en-US (+ x-default English, matching the page <head>) on BOTH URLs of every Spanish page that has an English equivalent (lib/es/pages.ts),
  // so the English page carries the reciprocal alternate without touching its route.
  const withLanguages = (entry: Entry): Entry => {
    const path = entry.url.slice(BASE.length);
    const es = ES_PAGES.find((p) => p.path === path && p.english);
    const en = es?.english ?? (spanishFor(path) ? path : undefined);
    const esPath = es?.path ?? spanishFor(path);
    return en && esPath ? { ...entry, alternates: { languages: { "en-US": `${BASE}${en}`, "es-US": `${BASE}${esPath}`, "x-default": `${BASE}${en}` } } } : entry;
  };
  return Object.fromEntries(
    SITEMAP_SECTIONS.map((id) => [id, sections[id].map(withUpdated).map(withLanguages)]),
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
