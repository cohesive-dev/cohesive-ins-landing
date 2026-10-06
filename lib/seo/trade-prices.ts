// Real contractor premiums from our own book (Kevin 2026-10-02: "Do all the SEO recommendations.
// general contractor, restaurant are great"). The lowest real price per trade, refreshed from the
// CRM on 2026-10-02. Same two rules as restaurant-prices.ts:
//   1. Say whether it is BOUND (a policy we wrote) or a QUOTE (a real quote, not proof anyone bought it).
//   2. Match the line of business: every figure here is general liability, never workers' comp.
//
// Business descriptions only, never a client's name. Trades not listed here have no verified price
// and publish no number at all (contractors.ts finalizeTradePricing removes the legacy $/mo floors).
// Roofing is excluded on purpose (Kevin 2026-09-22: "depends on subs").
//
// Second release (Kevin 2026-10-02 "OK"): the other trade families. Each figure was read from the CRM
// on 2026-10-02 and matched to the business's own work and the class the carrier rated, not a name
// keyword. Quotes exclude superseded, do-not-present, declined, indication, stale, unverified and
// rehearsal rows. A trade whose only evidence was a rehearsal, a preview, a class mismatch, a
// withdrawn price or an unknown carrier stays price-free.
import type { PageContent } from "./data";

export const TRADE_PRICES_AS_OF = "2026-10-02";

export type TradePrice = { usd: number; kind: "bound" | "quote"; line: string; business: string };

const GL = "General liability";

export const TRADE_PRICES: Record<string, TradePrice> = {
  "general-contractor": { usd: 1177, kind: "bound", line: GL, business: "a general contractor in New York" },
  remodeler: { usd: 630, kind: "bound", line: GL, business: "a small remodeling contractor in Pennsylvania" },
  cleaning: { usd: 200, kind: "bound", line: GL, business: "a janitorial company" },
  "commercial-cleaning": { usd: 200, kind: "bound", line: GL, business: "a janitorial company" },
  "house-cleaning": { usd: 200, kind: "bound", line: GL, business: "a house cleaning business in North Carolina" },
  masonry: { usd: 718, kind: "bound", line: GL, business: "a masonry contractor in Colorado" },
  electrician: { usd: 500, kind: "quote", line: GL, business: "an electrical contractor in New Jersey" },
  plumber: { usd: 1117, kind: "bound", line: GL, business: "a plumbing contractor in Colorado" },
  painter: { usd: 378, kind: "quote", line: GL, business: "a solo painting contractor in Maryland" },
  "tree-service": { usd: 1500, kind: "bound", line: GL, business: "a tree service in Colorado" },
  pool: { usd: 916, kind: "bound", line: GL, business: "a pool contractor in Texas" },
  hvac: { usd: 885, kind: "bound", line: GL, business: "an HVAC contractor in Florida" },
  // Second release, 2026-10-02.
  flooring: { usd: 500, kind: "bound", line: GL, business: "a flooring contractor in Nebraska" },
  "pest-control": { usd: 650, kind: "bound", line: GL, business: "a pest control company in Pennsylvania" },
  carpenter: { usd: 500, kind: "quote", line: GL, business: "a carpentry contractor in Pennsylvania" },
  landscaper: { usd: 560, kind: "quote", line: GL, business: "a lawn care and landscaping business in Maryland" },
  framing: { usd: 674, kind: "quote", line: GL, business: "a framing contractor in Texas" },
  "pressure-washing": { usd: 779, kind: "quote", line: GL, business: "a pressure washing company in Texas" },
  tile: { usd: 1011, kind: "quote", line: GL, business: "a tile installer in New York" },
  siding: { usd: 1301, kind: "quote", line: GL, business: "a residential siding contractor" },
  welding: { usd: 1330, kind: "quote", line: GL, business: "a metal fabrication and welding shop" },
};

export function tradePrice(slug: string): TradePrice | undefined {
  return TRADE_PRICES[slug];
}

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;
// Same rule as contractors.ts plural(), kept local to avoid an import cycle.
const pluralOf = (w: string) =>
  /man$/i.test(w) ? `${w.slice(0, -3)}men`
    : /(s|sh|ch|x)$/i.test(w) ? `${w}es`
      : /[^aeiou]y$/i.test(w) ? `${w.slice(0, -1)}ies`
        : `${w}s`;
export const priceText = (p: TradePrice) => `${usd(p.usd)}/yr`;

// "a policy we wrote" / "a real quote" travels with every number.
export function kindPhrase(p: TradePrice): string {
  return p.kind === "bound" ? "a policy we wrote" : "a real quote";
}

export function kindLabel(p: TradePrice): string {
  return p.kind === "bound" ? "bound" : "quote";
}

// First candidate within the limit, else the shortest one.
export function fit(candidates: string[], max: number): string {
  return candidates.find((c) => c.length <= max) ?? [...candidates].sort((a, b) => a.length - b.length)[0];
}

export function pricedTitle(name: string, p: TradePrice, place?: { name: string; abbr: string; city?: string }): string {
  const price = priceText(p);
  if (place?.city) {
    return fit([
      `${name} Insurance in ${place.city}, ${place.abbr}: From ${price}`,
      `${place.city} ${name} Insurance: From ${price}`,
    ], 60);
  }
  if (place) {
    return fit([
      `${place.name} ${name} Insurance: From ${price}`,
      `${name} Insurance in ${place.abbr}: From ${price}`,
      `${place.name} ${name} Insurance: ${price}`,
    ], 60);
  }
  return fit([`${name} Insurance from ${price} | Cohesive Insurance`, `${name} Insurance from ${price}`], 60);
}

export function priceFreeTitle(name: string, place?: { name: string; abbr: string }): string {
  if (!place) return `${name} Insurance: Quotes from Several Carriers`;
  return fit([
    `${place.name} ${name} Insurance: Quotes from Several Carriers`,
    `${name} Insurance in ${place.abbr}: Quotes from Several Carriers`,
    `${place.name} ${name} Insurance: Compare Carrier Quotes`,
  ], 60);
}

// Price-first meta description; the tail is the longest option that keeps it within ~155 characters.
export function pricedMeta(lead: string, p: TradePrice, tails: string[]): string {
  const head = `${lead} from ${priceText(p)}, ${kindPhrase(p)} for ${p.business}.`;
  const tail = tails.find((t) => `${head} ${t}`.length <= 155);
  return tail ? `${head} ${tail}` : head;
}

// The one-paragraph answer an assistant or a searcher can quote.
export function tradeCostAnswer(noun: string, p: TradePrice, where?: string): string {
  const fact = p.kind === "bound"
    ? `Our lowest bound ${p.line.toLowerCase()} policy for ${pluralOf(noun)} is ${priceText(p)}, a policy we wrote for ${p.business}.`
    : `Our lowest ${p.line.toLowerCase()} price for ${pluralOf(noun)} is ${priceText(p)}, a real quote for ${p.business}. It is a quote, not a policy we have bound.`;
  return `${fact} That is our lowest real price, not an average${where ? ` or a ${where} rate` : ""}. Your price usually goes up with sales, payroll, the type of work you do and claims.`;
}

export function tradePriceRow(p: TradePrice): { coverage: string; range: string; note: string } {
  return {
    coverage: `${p.line} (${kindLabel(p)})`,
    range: `from ${priceText(p)}`,
    note: p.kind === "bound"
      ? `Our lowest bound policy for this trade: ${p.business}. A real policy, not an estimate.`
      : `Our lowest real quote for this trade: ${p.business}. A quote, not a bound policy.`,
  };
}

export function tradePriceDisclaimer(p: TradePrice): string {
  return `The price shown is the lowest ${p.line.toLowerCase()} premium in our own book for this trade as of ${TRADE_PRICES_AS_OF}, ` +
    `labelled ${p.kind === "bound" ? "bound (a policy we wrote)" : "quote (a real quote, not a bound policy)"}. ` +
    "Your premium depends on your work, sales, payroll, location, limits and claims. It is not a quote or an offer of insurance.";
}

const isCostQ = (q: string) => /how much|\bcosts?\b/i.test(q) && !/subcontract/i.test(q);
const hasLegacyFloor = (text: string) => /\$\d+\/mo\b/.test(text);
const legacyFloorRow = (row: { range: string }) => /\/mo\b/.test(row.range);
const placeLabel = (place?: { name: string; abbr: string; city?: string }) =>
  place ? (place.city ? `${place.city}, ${place.abbr}` : place.name) : undefined;

// Layer the real price onto an existing page without rewriting its researched content: price in the
// title and meta, an answer-first paragraph, a labelled row at the top of the cost table, and one
// cost FAQ that leads with the number (other cost questions are dropped so FAQ markup has one answer).
export function withTradePrice(
  c: PageContent,
  slug: string,
  opts: { name: string; noun: string; place?: { name: string; abbr: string; city?: string }; metaTails?: string[] },
): PageContent {
  const p = tradePrice(slug);
  if (!p) return c;
  const where = placeLabel(opts.place);
  const lead = where ? `${where} ${opts.noun} insurance` : `${opts.noun[0].toUpperCase()}${opts.noun.slice(1)} insurance`;
  const answer = tradeCostAnswer(opts.noun, p, where);
  return {
    ...c,
    title: pricedTitle(opts.name, p, opts.place),
    heroSub: hasLegacyFloor(c.heroSub)
      ? `Our lowest real ${p.line.toLowerCase()} price for this trade is ${priceText(p)}, ${kindPhrase(p)}. Tell us about your work and get your own quote in a few minutes.`
      : c.heroSub,
    metaDescription: pricedMeta(lead, p, [
      ...(opts.metaTails ?? []),
      "Compare quotes from several carriers.",
      "Get a quote.",
    ]),
    costNarrative: [answer, ...c.costNarrative.filter((para) => !hasLegacyFloor(para))],
    // A profile's own "General liability: Individual quote" row stays, renamed so it reads as the reader's quote.
    costRows: [tradePriceRow(p), ...c.costRows.filter((row) => !legacyFloorRow(row))
      .map((row) => (row.coverage === "General liability" ? { ...row, coverage: "Your general liability quote" } : row))],
    costDisclaimer: c.costDisclaimer ? `${tradePriceDisclaimer(p)} ${c.costDisclaimer}` : tradePriceDisclaimer(p),
    faqs: [
      { q: `How much does ${opts.noun} insurance cost${where ? ` in ${where}` : ""}?`, a: answer },
      ...c.faqs.filter((f) => !isCostQ(f.q)),
    ],
  };
}

// Trades with no verified price: remove the legacy monthly floors from
// the title, hero, cost block and FAQ instead of publishing a number we cannot stand behind.
export function withoutPrice(
  c: PageContent,
  opts: { name: string; noun: string; plural: string; place?: { name: string; abbr: string } },
): PageContent {
  const where = placeLabel(opts.place);
  const answer = `We do not publish a starting price for ${opts.noun} insurance yet, because we have not bound enough of these policies in this class to give a real number. ` +
    `Your price depends on the work you actually do, sales, payroll, subcontractors and claims, so we quote it with several carriers and show you the real offers.`;
  const legacyTitle = /\$/.test(c.title);
  return {
    ...c,
    title: legacyTitle ? priceFreeTitle(opts.name, opts.place) : c.title,
    metaDescription: hasLegacyFloor(c.metaDescription)
      ? fit([
          `${opts.name} insurance${where ? ` in ${where}` : ""}: what ${opts.plural} need to carry, what moves the price, and quotes from several carriers.`,
          `${opts.name} insurance${where ? ` in ${where}` : ""}: what to carry, what moves the price, and quotes from several carriers.`,
        ], 155)
      : c.metaDescription,
    heroSub: hasLegacyFloor(c.heroSub)
      ? `See what moves the price for ${opts.plural}, then tell us about your work and we will compare quotes from several carriers.`
      : c.heroSub,
    costNarrative: c.costNarrative.some(hasLegacyFloor)
      ? [answer, ...c.costNarrative.filter((para) => !hasLegacyFloor(para))]
      : c.costNarrative,
    costRows: c.costRows.some(legacyFloorRow)
      ? [
          { coverage: "General liability", range: "Individual quote", note: "Priced on the work you do, sales, limits and claims. We compare several carriers." },
          ...c.costRows.filter((row) => !legacyFloorRow(row)),
        ]
      : c.costRows,
    costDisclaimer: c.costDisclaimer ?? "No starting price is published for this trade. Coverage and price depend on your operations and the policy offered. This is not a quote or an offer of insurance.",
    faqs: c.faqs.map((f) => (isCostQ(f.q) && hasLegacyFloor(f.a) ? { q: f.q, a: answer } : f)),
  };
}
