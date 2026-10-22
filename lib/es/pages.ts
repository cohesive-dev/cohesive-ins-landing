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
