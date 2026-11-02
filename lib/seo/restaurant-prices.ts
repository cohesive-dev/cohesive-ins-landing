// Real restaurant premiums from our own book - BOUND policies only (Kevin 2026-09-26: "Always choose
// the lowest bind prices when posting and indexing, helps get clicks").
//
// Two rules keep this honest (goals / seo price-evidence):
//   1. It is a BIND, and every page says so.
//   2. The line of business matches: a general-liability floor is never shown as a package price,
//      and a workers' comp premium is never shown as liability.
//
// Business descriptions only - never a client's name and never a state (2026-10-12: these lines render
// on every state and city page, so "a caterer in New York" appeared on Charlotte NC pages). State-specific
// prices live in restaurant-states.ts and only render on that state's pages. Refresh from the CRM before re-dating.
export const RESTAURANT_PRICES_AS_OF = "2026-09-26";

export type BoundPrice = { usd: number; line: string; business: string };

// Lowest bound restaurant premium per line of business, across every restaurant we have placed.
// Kevin 2026-09-26 confirmed the July "Recently bound in NY" binds (caterer GL $597, restaurant BOP
// $1,153, bakery GL $849) as real, although they predate the CRM's policy rows.
export const RESTAURANT_FLOOR = {
  gl: { usd: 597, line: "General liability", business: "a caterer" } as BoundPrice,
  wc: { usd: 509, line: "Workers' compensation", business: "a sandwich shop" } as BoundPrice,
  // Kevin 2026-09-26: the first cut used a $5,052 buffet package, then a $1,897 full-service BOP in
  // Missouri; the lowest confirmed bind is the July New York full-service restaurant BOP.
  pkg: { usd: 1153, line: "Businessowners policy (liability + property)", business: "a full-service restaurant" } as BoundPrice,
};

// The lowest bind we hold for a specific concept, where one exists. Shown BESIDE the restaurant
// floor, never instead of it: the headline stays the lowest real bind.
const CONCEPT_BINDS: Record<string, BoundPrice> = {
  deli: { usd: 749, line: "General liability", business: "a sandwich shop" },
  bakery: { usd: 849, line: "General liability", business: "a bakery" },
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
  business: "a quick-service restaurant (renting, no alcohol)",
};

const CONCEPT_BINDABLE: Record<string, BoundPrice> = {
  "coffee-shop": { usd: 1485, line: "Businessowners policy", business: "a café-bakery open less than a year" },
  bakery: { usd: 1485, line: "Businessowners policy", business: "a café-bakery open less than a year" },
  "vietnamese-restaurant": { usd: 1534, line: "Businessowners policy", business: "a full-service pho restaurant" },
  "indian-restaurant": { usd: 1549, line: "Businessowners policy", business: "a full-service Indian restaurant (with $1M liquor liability)" },
  pizzeria: { usd: 1642, line: "Businessowners policy", business: "a pizzeria" },
  "fast-food-restaurant": { usd: 1167, line: "Businessowners policy", business: BINDABLE_PKG_FLOOR.business },
  "barbecue-restaurant": { usd: 1889, line: "Businessowners policy", business: "a BBQ restaurant" },
  "burger-restaurant": { usd: 2098, line: "Businessowners policy", business: "a full-service burger restaurant" },
  "thai-restaurant": { usd: 2370, line: "Businessowners policy", business: "a Thai noodle and sushi restaurant" },
};

// Ordinary carrier quotes for a concept, shown only where they say something the binds do not
// (2026-10-02: coffee shop GL $686/yr, a real Next quote for a coffee house in North Carolina).
// Always labelled "quote": nobody has bought these yet.
const CONCEPT_QUOTES: Record<string, BoundPrice> = {
  "coffee-shop": { usd: 686, line: "General liability", business: "a coffee house" },
};

export function conceptQuote(slug: string): BoundPrice | undefined {
  return CONCEPT_QUOTES[slug];
}

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

// ---- Per-type headline price (Kevin 2026-10-12) ----------------------------------------------------
// Every restaurant-family title and meta description used to say "liability from $597/yr, a policy we
// wrote for a caterer in New York", including Charlotte NC pages and coffee-shop pages. Search Console
// (28 days to 2026-10-12): 5,382 restaurant-query impressions, 0 clicks. Each page now leads with the
// approved real price for ITS type of business. Approved wording only: the business type, never a
// client name, never a state. A quote is always worded as a quote ("was quoted"), never "from $X".
export type HeadlinePrice = {
  key: "coffeeShop" | "caterer" | "fullService" | "quickService";
  usd: number;
  bound: boolean;
  // The approved sentence, lower-case first letter so it can follow "Coffee shop insurance:".
  sentence: string;
  // Title tags. `same` is used on the page for that exact type; `typed` names the type the price is
  // for, so a deli title never implies a deli was quoted the quick-service price.
  same: string;
  typed: string;
  // Shorter `typed` for long page names. Only bound prices get one: a quote always keeps "Quoted".
  typedShort?: string;
};

const COFFEE_QUOTE = CONCEPT_QUOTES["coffee-shop"];
export const HEADLINE_PRICES: Record<HeadlinePrice["key"], HeadlinePrice> = {
  // A quote, not a bind.
  coffeeShop: {
    key: "coffeeShop", usd: COFFEE_QUOTE.usd, bound: false,
    sentence: `a coffee shop was quoted ${usd(COFFEE_QUOTE.usd)} a year for general liability`,
    same: `Quoted ${usd(COFFEE_QUOTE.usd)}/yr`, typed: `Coffee Shop Quoted ${usd(COFFEE_QUOTE.usd)}/yr`,
  },
  caterer: {
    key: "caterer", usd: RESTAURANT_FLOOR.gl.usd, bound: true,
    sentence: `a caterer we insure pays ${usd(RESTAURANT_FLOOR.gl.usd)} a year for general liability`,
    same: `${usd(RESTAURANT_FLOOR.gl.usd)}/yr Real Policy`, typed: `Caterer Pays ${usd(RESTAURANT_FLOOR.gl.usd)}/yr`,
    typedShort: `Caterer ${usd(RESTAURANT_FLOOR.gl.usd)}/yr`,
  },
  fullService: {
    key: "fullService", usd: RESTAURANT_FLOOR.pkg.usd, bound: true,
    sentence: `a full-service restaurant we insure pays ${usd(RESTAURANT_FLOOR.pkg.usd)} a year for liability and property`,
    same: `${usd(RESTAURANT_FLOOR.pkg.usd)}/yr Real Policy`, typed: `Full-Service Pays ${usd(RESTAURANT_FLOOR.pkg.usd)}/yr`,
    typedShort: `Full-Service ${usd(RESTAURANT_FLOOR.pkg.usd)}/yr`,
  },
  // A quote (instant, bindable), not a bind. Its property part is equipment and contents: "personal property".
  quickService: {
    key: "quickService", usd: BINDABLE_PKG_FLOOR.usd, bound: false,
    sentence: `a quick-service restaurant was quoted ${usd(BINDABLE_PKG_FLOOR.usd)} a year for liability and personal property`,
    same: `Quoted ${usd(BINDABLE_PKG_FLOOR.usd)}/yr`, typed: `Quick-Service Quoted ${usd(BINDABLE_PKG_FLOOR.usd)}/yr`,
  },
};

// Page slug -> headline. EVERY restaurant-family slug is listed on purpose: a new type gets no price until
// someone maps it (headlinePrice returns undefined, the title drops the price), and
// scripts/test-seo-restaurant-snippets.cjs fails if a generated restaurant page is unmapped.
// Kevin's mapping (2026-10-12): coffee-shop, bakery, juice-bar -> coffee shop; catering -> caterer;
// fast-food, deli, food-truck -> quick-service; restaurant, fine-dining -> full-service. The rest follow the
// closest of those four: little or no cooking at a counter -> coffee shop; counter service with a fryer
// or grill -> quick-service; table service -> full-service.
// Bar has NO headline: $1,153 is a restaurant's price, and bar pages are noindexed.
const HEADLINE_BY_SLUG: Record<string, HeadlinePrice["key"] | null> = {
  // Coffee shop (quote): counters with little or no cooking.
  "coffee-shop": "coffeeShop", bakery: "coffeeShop", "juice-bar": "coffeeShop",
  "bagel-shop": "coffeeShop", "bubble-tea-shop": "coffeeShop", "ice-cream-shop": "coffeeShop",
  // Caterer (bound).
  catering: "caterer",
  // Quick-service (quote): counter service with fryers or grills.
  "fast-food-restaurant": "quickService", deli: "quickService", "food-truck": "quickService",
  "burger-restaurant": "quickService", "fried-chicken-restaurant": "quickService", "wing-restaurant": "quickService",
  "donut-shop": "quickService", "ghost-kitchen": "quickService",
  // Full-service (bound): table-service restaurants and the general restaurant / stage pages.
  restaurant: "fullService", "fine-dining-restaurant": "fullService",
  "chinese-restaurant": "fullService", pizzeria: "fullService", "mexican-restaurant": "fullService",
  "indian-restaurant": "fullService", "sushi-restaurant": "fullService", "thai-restaurant": "fullService",
  "italian-restaurant": "fullService", "mediterranean-restaurant": "fullService", "barbecue-restaurant": "fullService",
  "seafood-restaurant": "fullService", "breakfast-restaurant": "fullService", "vegan-restaurant": "fullService",
  "korean-restaurant": "fullService", "hibachi-restaurant": "fullService", "vietnamese-restaurant": "fullService",
  "ramen-restaurant": "fullService", steakhouse: "fullService", "caribbean-restaurant": "fullService",
  "halal-restaurant": "fullService", "soul-food-restaurant": "fullService",
  "new-restaurant": "fullService", "growing-restaurant": "fullService", "buying-a-restaurant": "fullService",
  "restaurant-delivery": "fullService",
  bar: null,
};
export const HEADLINE_MAPPED_SLUGS = Object.keys(HEADLINE_BY_SLUG);
// The page whose own type IS the headline's type, so its title can use the short tag.
const HEADLINE_HOME: Record<HeadlinePrice["key"], string> = {
  coffeeShop: "coffee-shop", caterer: "catering", fullService: "restaurant", quickService: "fast-food-restaurant",
};

export function headlinePrice(slug: string): HeadlinePrice | undefined {
  const key = HEADLINE_BY_SLUG[slug];
  return key ? HEADLINE_PRICES[key] : undefined;
}

// Title within ~60 characters with the page's price. `subjects` are the page's name variants, longest
// first ("Coffee Shop Insurance in North Carolina", "... in NC"). If no priced variant fits, the title
// drops the price rather than cutting it or switching to a tag that would misdescribe the page type.
export function restaurantTitle(slug: string, subjects: string[]): string {
  const h = headlinePrice(slug);
  if (!h) return fitTitle(subjects);
  const tags = HEADLINE_HOME[h.key] === slug ? [h.same] : [h.typed, ...(h.typedShort ? [h.typedShort] : [])];
  return fitTitle([...tags.flatMap((tag) => subjects.map((s) => `${s}: ${tag}`)), ...subjects]);
}

// Price-first meta description within ~155 characters: the page's own approved price sentence.
export function restaurantMeta(slug: string, lead: string, tails: string[] = []): string {
  const h = headlinePrice(slug);
  if (!h) return fitDescription(tails.map((t) => `${lead}. ${t}`), `${lead}.`);
  const priced = `${lead}: ${h.sentence}.`;
  return fitDescription([...tails.map((t) => `${priced} ${t}`), priced], `${h.sentence[0].toUpperCase()}${h.sentence.slice(1)}.`);
}
function fitDescription(candidates: string[], fallback: string): string {
  return candidates.find((c) => c.length <= 155) ?? fallback;
}

// First title within ~60 characters, else the shortest, so the price is not cut off in results.
export function fitTitle(candidates: string[]): string {
  return candidates.find((c) => c.length <= 60) ?? [...candidates].sort((a, b) => a.length - b.length)[0];
}

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
  const quote = slug ? conceptQuote(slug) : undefined;
  if (quote) {
    rows.push({
      coverage: `${quote.line} for this concept (quote)`,
      range: `from ${usd(quote.usd)}/yr`,
      note: `A real quote for ${quote.business}. It is a quote, not a policy we have bound.`,
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
  "plus the lowest instant quotes a carrier issued ready to bind (marked \"instant quote, bindable\"; those are real quotes, not bound policies) " +
  "and, where marked \"quote\", an ordinary carrier quote. " +
  "Each is labelled by line of business. Your price depends on your menu, cooking, alcohol, " +
  "sales, payroll, property, location, and claims. They are not an offer of insurance.";

// Answer-first cost reply: the number leads, because that is what the searcher asked. The lead is the
// page type's own approved price (2026-10-12); it used to be the New York caterer's $597 on every page.
export function costAnswer(noun: string, slug?: string, headline: HeadlinePrice | undefined = slug ? headlinePrice(slug) : undefined): string {
  const h = headline;
  const lead = h
    ? `${h.sentence[0].toUpperCase()}${h.sentence.slice(1)}${h.bound ? "." : " (a quote, not a bound policy)."}`
    : `The lowest food-service general liability policy we have bound is ${usd(RESTAURANT_FLOOR.gl.usd)}/yr, a policy we wrote for ${RESTAURANT_FLOOR.gl.business}.`;
  const c = slug ? conceptBind(slug) : undefined;
  const concept = c && c.usd !== RESTAURANT_FLOOR.gl.usd && c.usd !== h?.usd ? ` Our lowest bind for ${c.business} was ${usd(c.usd)}/yr (${c.line.toLowerCase()}).` : "";
  const b = slug ? conceptBindable(slug) : undefined;
  const bindable = b && b.usd !== pkgFloor().usd && b.usd !== h?.usd ? b : undefined;
  const q = slug ? conceptQuote(slug) : undefined;
  const quoted = q && q.usd !== h?.usd ? ` For ${q.business}, a real ${q.line.toLowerCase()} quote was ${usd(q.usd)}/yr (a quote, not a bound policy).` : "";
  // A liability-and-property headline already answers the package question; repeat only a concept's own quote.
  const pkgInHeadline = h?.key === "fullService" || h?.key === "quickService";
  const pkg = pkgInHeadline
    ? (bindable ? ` For ${bindable.business}, an instant, bindable liability and property quote was ${usd(bindable.usd)}/yr.` : "")
    : ` ${pkgFloorPhrase(bindable ? `; for ${bindable.business} it was ${usd(bindable.usd)}/yr` : "")}`;
  const article = /^[aeiou]/i.test(noun) ? "An" : "A";
  return `${lead} Our lowest restaurant workers' comp policy is ${usd(RESTAURANT_FLOOR.wc.usd)}/yr.${concept}${quoted}${pkg} ${article} ${noun} lands above or near those depending on cooking, alcohol, sales, payroll, property, and claims.`;
}

// Apply the bound-price treatment to an existing food page (national or profiled state) without
// rewriting its content: price in the title and meta, answer-first narrative, bound rows first,
// one cost FAQ that leads with the real number (no duplicate question for FAQ markup).
import type { PageContent } from "./data";
import { stateQuoteFact, stateQuoteRow } from "./restaurant-states";

export function withBoundPrices(c: PageContent, slug: string, name: string, noun: string, stateName?: string): PageContent {
  const costQ = `How much does ${noun} insurance cost${stateName ? ` in ${stateName}` : ""}?`;
  const isCostQ = (q: string) => /how much|cost/i.test(q);
  const headline = headlinePrice(slug);
  return {
    ...c,
    // State first, matching how owners search ("wisconsin restaurant insurance"; 18 state/concept queries sat
    // at positions 8-30 with 0 clicks in the 28 days to 2026-09-28). The price is this page type's own.
    title: stateName
      ? restaurantTitle(slug, [`${stateName} ${name} Insurance`, `${name} Insurance in ${stateName}`])
      : restaurantTitle(slug, [`${name} Insurance`]),
    metaDescription: restaurantMeta(
      slug,
      stateName ? `${stateName} ${noun} insurance` : `${noun[0].toUpperCase()}${noun.slice(1)} insurance`,
      [stateName ? `What ${stateName} requires.` : "Quotes in minutes."],
    ),
    costNarrative: [costAnswer(noun, undefined, headline), ...c.costNarrative],
    costDisclaimer: c.costDisclaimer ? `${BOUND_PRICE_DISCLAIMER} ${c.costDisclaimer}` : BOUND_PRICE_DISCLAIMER,
    costRows: [...boundPriceRows(), ...(stateName ? stateQuoteRow(stateName) : []), ...c.costRows],
    stateFacts: stateName ? [...stateQuoteFact(stateName), ...c.stateFacts] : c.stateFacts,
    faqs: [{ q: costQ, a: costAnswer(noun, undefined, headline) }, ...c.faqs.filter((f) => !isCostQ(f.q))],
  };
}
