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
// Kevin 2026-09-26 confirmed the July "Recently bound in NY" binds (caterer GL $597, restaurant BOP
// $1,153, bakery GL $849) as real, although they predate the CRM's policy rows.
export const RESTAURANT_FLOOR = {
  gl: { usd: 597, line: "General liability", business: "a caterer in New York" } as BoundPrice,
  wc: { usd: 509, line: "Workers' compensation", business: "a sandwich shop" } as BoundPrice,
  // Kevin 2026-09-26: the first cut used a $5,052 buffet package, then a $1,897 full-service BOP in
  // Missouri; the lowest confirmed bind is the July New York full-service restaurant BOP.
  pkg: { usd: 1153, line: "Businessowners policy (liability + property)", business: "a full-service restaurant in New York" } as BoundPrice,
};

// The lowest bind we hold for a specific concept, where one exists. Shown BESIDE the restaurant
// floor, never instead of it: the headline stays the lowest real bind.
const CONCEPT_BINDS: Record<string, BoundPrice> = {
  deli: { usd: 749, line: "General liability", business: "a sandwich shop" },
  bakery: { usd: 849, line: "General liability", business: "a bakery in New York" },
  "mexican-restaurant": { usd: 1027, line: "General liability", business: "a full-service Mexican restaurant" },
  "barbecue-restaurant": { usd: 2932, line: "General liability", business: "a BBQ smokehouse" },
  "seafood-restaurant": { usd: 3278, line: "General liability", business: "a Mexican seafood restaurant" },
};

// Kevin 2026-09-26: "We can include not just binded prices but rainbow's auto bindable prices for
// SEO purposes." An auto-bindable quote is one the carrier (Rainbow) rated instantly and marked
// bindable, with no underwriter referral: a real price the restaurant could have bought that day.
// Always labelled "instant quote, bindable", never "bound". Each is a $1M/$2M liability + $50,000
// equipment-and-contents businessowners policy for a tenant, verified bindable in the CRM quote row.
export const BINDABLE_PKG_FLOOR: BoundPrice = {
  usd: 1167, line: "Businessowners policy (liability + property)",
  business: "a quick-service restaurant in Massachusetts (renting, no alcohol)",
};

const CONCEPT_BINDABLE: Record<string, BoundPrice> = {
  "coffee-shop": { usd: 1485, line: "Businessowners policy", business: "a café-bakery in Chicago open less than a year" },
  bakery: { usd: 1485, line: "Businessowners policy", business: "a café-bakery in Chicago open less than a year" },
  "vietnamese-restaurant": { usd: 1534, line: "Businessowners policy", business: "a full-service pho restaurant in Wisconsin" },
  "indian-restaurant": { usd: 1549, line: "Businessowners policy", business: "a full-service Indian restaurant in Utah (with $1M liquor liability)" },
  pizzeria: { usd: 1642, line: "Businessowners policy", business: "a pizzeria in upstate New York" },
  "fast-food-restaurant": { usd: 1167, line: "Businessowners policy", business: BINDABLE_PKG_FLOOR.business },
  "barbecue-restaurant": { usd: 1889, line: "Businessowners policy", business: "a BBQ restaurant in New Mexico" },
  "burger-restaurant": { usd: 2098, line: "Businessowners policy", business: "a full-service burger restaurant in Arkansas" },
  "thai-restaurant": { usd: 2370, line: "Businessowners policy", business: "a Thai noodle and sushi restaurant in Illinois" },
};

export function conceptBindable(slug: string): BoundPrice | undefined {
  return CONCEPT_BINDABLE[slug];
}

// The cheaper of the bound package and the instant-bindable package, labelled as whichever it is.
export function pkgFloor(): { usd: number; label: string } {
  return BINDABLE_PKG_FLOOR.usd < RESTAURANT_FLOOR.pkg.usd
    ? { usd: BINDABLE_PKG_FLOOR.usd, label: "instant-bindable" }
    : { usd: RESTAURANT_FLOOR.pkg.usd, label: "bound" };
}
function pkgFloorPhrase(suffix = ""): string {
  const f = pkgFloor();
  return f.label === "bound"
    ? `Liability and property together start at ${usd(f.usd)}/yr on a bound businessowners policy${suffix}.`
    : `Liability and property together start at ${usd(f.usd)}/yr on an instant, bindable quote${suffix}.`;
}

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
      note: `Our lowest bound food-service liability policy, for ${RESTAURANT_FLOOR.gl.business}. Cooking, alcohol, sales, and claims move it up from there.`,
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
  const bindable = slug ? conceptBindable(slug) : undefined;
  if (bindable && bindable.usd !== pkgFloor().usd) {
    rows.push({
      coverage: "Liability + property for this concept (instant quote, bindable)",
      range: `from ${usd(bindable.usd)}/yr`,
      note: `Our lowest instant, bindable quote for ${bindable.business}: $1M/$2M liability plus equipment and contents.`,
    });
  }
  if (BINDABLE_PKG_FLOOR.usd < RESTAURANT_FLOOR.pkg.usd) rows.push({
    coverage: "Liability + property BOP (instant quote, bindable)",
    range: `from ${usd(BINDABLE_PKG_FLOOR.usd)}/yr`,
    note: `Our lowest instant restaurant quote a carrier issued ready to bind, with no underwriter referral, for ${BINDABLE_PKG_FLOOR.business}: $1M/$2M liability plus $50,000 of equipment and contents.`,
  });
  rows.push({
    coverage: "Liability + property BOP (bound)",
    range: `from ${usd(RESTAURANT_FLOOR.pkg.usd)}/yr`,
    note: `Our lowest bound businessowners policy, for ${RESTAURANT_FLOOR.pkg.business}. Building, equipment and contents values set this one.`,
  });
  return rows;
}

export const BOUND_PRICE_DISCLAIMER =
  `These are the lowest premiums we have actually bound for restaurants, as of ${RESTAURANT_PRICES_AS_OF}, ` +
  "plus the lowest instant quotes a carrier issued ready to bind (marked \"instant quote, bindable\"; those are real quotes, not bound policies). " +
  "Each is labelled by line of business. Your price depends on your menu, cooking, alcohol, " +
  "sales, payroll, property, location, and claims. They are not an offer of insurance.";

// Answer-first cost reply: the number leads, because that is what the searcher asked.
export function costAnswer(noun: string, slug?: string): string {
  const c = slug ? conceptBind(slug) : undefined;
  const concept = c && c.usd !== RESTAURANT_FLOOR.gl.usd ? ` Our lowest bind for ${c.business} was ${usd(c.usd)}/yr (${c.line.toLowerCase()}).` : "";
  const b = slug ? conceptBindable(slug) : undefined;
  const forConcept = b && b.usd !== pkgFloor().usd ? `; for ${b.business} it was ${usd(b.usd)}/yr` : "";
  const pkg = pkgFloorPhrase(forConcept);
  const article = /^[aeiou]/i.test(noun) ? "An" : "A";
  return `The lowest food-service general liability policy we have bound is ${usd(RESTAURANT_FLOOR.gl.usd)}/yr (${RESTAURANT_FLOOR.gl.business}), and our lowest restaurant workers' comp policy is ${usd(RESTAURANT_FLOOR.wc.usd)}/yr.${concept} ${pkg} ${article} ${noun} lands above or near those depending on cooking, alcohol, sales, payroll, property, and claims.`;
}

// Apply the bound-price treatment to an existing food page (national or profiled state) without
// rewriting its content: price in the title and meta, answer-first narrative, bound rows first,
// one cost FAQ that leads with the real number (no duplicate question for FAQ markup).
import type { PageContent } from "./data";
import { stateQuoteFact, stateQuoteRow } from "./restaurant-states";

export function withBoundPrices(c: PageContent, name: string, noun: string, stateName?: string): PageContent {
  const costQ = `How much does ${noun} insurance cost${stateName ? ` in ${stateName}` : ""}?`;
  const isCostQ = (q: string) => /how much|cost/i.test(q);
  return {
    ...c,
    title: `${name} Insurance${stateName ? ` in ${stateName}` : ""}: From ${floorPhrase()}`,
    metaDescription: `Real prices: restaurant liability from ${floorPhrase()} bound, liability + property from ${usd(pkgFloor().usd)}/yr ${pkgFloor().label}. ${c.metaDescription}`,
    costNarrative: [costAnswer(noun), ...c.costNarrative],
    costDisclaimer: c.costDisclaimer ? `${BOUND_PRICE_DISCLAIMER} ${c.costDisclaimer}` : BOUND_PRICE_DISCLAIMER,
    costRows: [...boundPriceRows(), ...(stateName ? stateQuoteRow(stateName) : []), ...c.costRows],
    stateFacts: stateName ? [...stateQuoteFact(stateName), ...c.stateFacts] : c.stateFacts,
    faqs: [{ q: costQ, a: costAnswer(noun) }, ...c.faqs.filter((f) => !isCostQ(f.q))],
  };
}
