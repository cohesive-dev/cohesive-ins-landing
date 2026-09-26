// Real restaurant premiums from our own book - BOUND policies only (Kevin 2026-09-26: "Always choose
// the lowest bind prices when posting and indexing, helps get clicks").
//
// Two rules keep this honest (goals / seo price-evidence):
//   1. It is a BIND, and every page says so.
//   2. The line of business matches: a general-liability floor is never shown as a package price,
//      and a workers' comp premium is never shown as liability.
//
// Business descriptions only - never a client's name. Refresh from the CRM before re-dating.
export const RESTAURANT_PRICES_AS_OF = "2026-09-26";

export type BoundPrice = { usd: number; line: string; business: string };

// Lowest bound restaurant premium per line of business, across every restaurant we have placed.
export const RESTAURANT_FLOOR = {
  gl: { usd: 749, line: "General liability", business: "a sandwich shop" } as BoundPrice,
  wc: { usd: 509, line: "Workers' compensation", business: "a sandwich shop" } as BoundPrice,
  pkg: { usd: 5052, line: "Liability + property package", business: "a buffet restaurant" } as BoundPrice,
};

// The lowest bind we hold for a specific concept, where one exists. Shown BESIDE the restaurant
// floor, never instead of it: the headline stays the lowest real bind.
const CONCEPT_BINDS: Record<string, BoundPrice> = {
  deli: { usd: 749, line: "General liability", business: "a sandwich shop" },
  "mexican-restaurant": { usd: 1027, line: "General liability", business: "a full-service Mexican restaurant" },
  "barbecue-restaurant": { usd: 2932, line: "General liability", business: "a BBQ smokehouse" },
  "seafood-restaurant": { usd: 3278, line: "General liability", business: "a Mexican seafood restaurant" },
};

export const usd = (n: number) => `$${n.toLocaleString("en-US")}`;
export const floorPhrase = () => `${usd(RESTAURANT_FLOOR.gl.usd)}/yr`;

export function conceptBind(slug: string): BoundPrice | undefined {
  return CONCEPT_BINDS[slug];
}

// Rows for a cost table, lowest-first, each labelled as a real bind with its line of business.
export function boundPriceRows(slug?: string): { coverage: string; range: string; note: string }[] {
  const rows = [
    {
      coverage: "General liability (bound)",
      range: `from ${usd(RESTAURANT_FLOOR.gl.usd)}/yr`,
      note: `Our lowest bound restaurant liability policy, for ${RESTAURANT_FLOOR.gl.business}. Cooking, alcohol, sales, and claims move it up from there.`,
    },
    {
      coverage: "Workers' compensation (bound)",
      range: `from ${usd(RESTAURANT_FLOOR.wc.usd)}/yr`,
      note: `Our lowest bound restaurant workers' comp policy, for ${RESTAURANT_FLOOR.wc.business}. Priced on payroll, so staff size drives it.`,
    },
  ];
  const concept = slug ? conceptBind(slug) : undefined;
  if (concept && concept.usd !== RESTAURANT_FLOOR.gl.usd) {
    rows.push({
      coverage: `${concept.line} for this concept (bound)`,
      range: `from ${usd(concept.usd)}/yr`,
      note: `Our lowest bind for ${concept.business}.`,
    });
  }
  rows.push({
    coverage: "Liability + property package (bound)",
    range: `from ${usd(RESTAURANT_FLOOR.pkg.usd)}/yr`,
    note: `Our lowest bound package, for ${RESTAURANT_FLOOR.pkg.business}. Building, equipment and contents values set this one.`,
  });
  return rows;
}

export const BOUND_PRICE_DISCLAIMER =
  `These are the lowest premiums we have actually bound for restaurants, as of ${RESTAURANT_PRICES_AS_OF}. ` +
  "Each is a real policy, labelled by line of business. Your price depends on your menu, cooking, alcohol, " +
  "sales, payroll, property, location, and claims. They are not an offer of insurance.";

// Answer-first cost reply: the number leads, because that is what the searcher asked.
export function costAnswer(noun: string, slug?: string): string {
  const c = slug ? conceptBind(slug) : undefined;
  const concept = c && c.usd !== RESTAURANT_FLOOR.gl.usd ? ` Our lowest bind for ${c.business} was ${usd(c.usd)}/yr (${c.line.toLowerCase()}).` : "";
  return `The lowest restaurant general liability policy we have bound is ${usd(RESTAURANT_FLOOR.gl.usd)}/yr, and our lowest restaurant workers' comp policy is ${usd(RESTAURANT_FLOOR.wc.usd)}/yr.${concept} A ${noun} lands above or near those depending on cooking, alcohol, sales, payroll, property, and claims.`;
}

// Apply the bound-price treatment to an existing food page (national or profiled state) without
// rewriting its content: price in the title and meta, answer-first narrative, bound rows first,
// one cost FAQ that leads with the real number (no duplicate question for FAQ markup).
import type { PageContent } from "./data";

export function withBoundPrices(c: PageContent, name: string, noun: string, stateName?: string): PageContent {
  const costQ = `How much does ${noun} insurance cost${stateName ? ` in ${stateName}` : ""}?`;
  const isCostQ = (q: string) => /how much|cost/i.test(q);
  return {
    ...c,
    title: `${name} Insurance${stateName ? ` in ${stateName}` : ""}: From ${floorPhrase()}`,
    metaDescription: `Real bound prices: restaurant liability from ${floorPhrase()}, workers' comp from ${usd(RESTAURANT_FLOOR.wc.usd)}/yr. ${c.metaDescription}`,
    costNarrative: [costAnswer(noun), ...c.costNarrative],
    costDisclaimer: c.costDisclaimer ? `${BOUND_PRICE_DISCLAIMER} ${c.costDisclaimer}` : BOUND_PRICE_DISCLAIMER,
    costRows: [...boundPriceRows(), ...c.costRows],
    faqs: [{ q: costQ, a: costAnswer(noun) }, ...c.faqs.filter((f) => !isCostQ(f.q))],
  };
}
