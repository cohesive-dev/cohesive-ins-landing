// The Spanish (/es) pages (Kevin 2026-10-22: "Try Mexican restaurants and contractors sure ... Let's try SEO").
// One registry for the hub links, the sitemap and the hreflang pairs. `english` is set only where an English page
// covers the same intent; those pairs get es-US <-> en-US alternates (page metadata + sitemap).
export type SpanishPage = { path: string; english?: string; name: string; updated: string };

export const ES_UPDATED = "2026-10-22";

export const ES_CONTRACTOR_HUB: SpanishPage = { path: "/es/seguro/contratistas", name: "Seguro para contratistas", updated: ES_UPDATED };

export const ES_CONTRACTOR_PAGES: SpanishPage[] = [
  { path: "/es/seguro/techadores", english: "/insurance/roofer", name: "Seguro para techadores", updated: ES_UPDATED },
  { path: "/es/seguro/contratistas-generales", english: "/insurance/general-contractor", name: "Seguro para contratistas generales", updated: ES_UPDATED },
  { path: "/es/seguro/remodelacion", english: "/insurance/remodeler", name: "Seguro para contratistas de remodelación", updated: ES_UPDATED },
];

export const ES_RESTAURANT_PAGES: SpanishPage[] = [
  { path: "/es/seguro/restaurantes-mexicanos", english: "/insurance/mexican-restaurant", name: "Seguro para restaurantes mexicanos", updated: ES_UPDATED },
];

export const ES_PAGES: SpanishPage[] = [ES_CONTRACTOR_HUB, ...ES_CONTRACTOR_PAGES, ...ES_RESTAURANT_PAGES];

/** Next metadata `alternates` for a Spanish page: canonical self, plus es-US / en-US / x-default when paired. */
export function esAlternates(path: string) {
  const page = ES_PAGES.find((p) => p.path === path);
  return {
    canonical: path,
    ...(page?.english ? { languages: { "es-US": path, "en-US": page.english, "x-default": page.english } } : {}),
  };
}

/** English path -> its Spanish equivalent (for the sitemap's reciprocal hreflang). */
export function spanishFor(englishPath: string): string | undefined {
  return ES_PAGES.find((p) => p.english === englishPath)?.path;
}

/** English page -> Next metadata `languages` for its reciprocal hreflang (en-US self, es-US pair, x-default English). */
export function englishLanguages(englishPath: string): Record<string, string> | undefined {
  const es = spanishFor(englishPath);
  return es ? { "en-US": englishPath, "es-US": es, "x-default": englishPath } : undefined;
}

// The visible "En español" link on English pages (2026-10-24: the Spanish pages had no internal links from the
// English site, and Google reported all five as "URL is unknown"). Keyed by the SeoPage trade / restaurant type, so
// a trade's hub, state and city pages all link the matching Spanish page. Only the English pairs above carry
// hreflang; the state and city pages get the link alone (hreflang must point at an equivalent page).
const SPANISH_FOR_TRADE: Record<string, string> = {
  roofer: "/es/seguro/techadores",
  "general-contractor": "/es/seguro/contratistas-generales",
  remodeler: "/es/seguro/remodelacion",
};
const SPANISH_FOR_RESTAURANT_TYPE: Record<string, string> = {
  "mexican-restaurant": "/es/seguro/restaurantes-mexicanos",
};

export type SpanishLink = { href: string; label: string };

export function spanishLinkFor({ tradeSlug, restaurantSlug, national }: { tradeSlug?: string; restaurantSlug?: string; national?: boolean }): SpanishLink | undefined {
  const tradeEs = tradeSlug ? SPANISH_FOR_TRADE[tradeSlug] : undefined;
  if (tradeEs) return { href: tradeEs, label: "En español" };
  const restEs = restaurantSlug ? SPANISH_FOR_RESTAURANT_TYPE[restaurantSlug] : undefined;
  if (restEs) return { href: restEs, label: "En español" };
  // The restaurant hub is the only general restaurant page that links the Mexican-restaurant page in Spanish.
  if (restaurantSlug === "restaurant" && national) return { href: "/es/seguro/restaurantes-mexicanos", label: "Restaurantes mexicanos: en español" };
  return undefined;
}
