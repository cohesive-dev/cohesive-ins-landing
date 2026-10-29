// Real contractor premiums from our own book (Kevin 2026-10-02: "Do all the SEO recommendations.
// general contractor, restaurant are great"). The lowest real price per trade, refreshed from the
// CRM on 2026-10-02. Same two rules as restaurant-prices.ts:
//   1. Say whether it is BOUND (a policy we wrote) or a QUOTE (a real quote, not proof anyone bought it).
//   2. Match the line of business: every figure here is general liability, never workers' comp.
//
// Business descriptions only, never a client's name. Trades not listed here have no verified price
// and publish no number at all (contractors.ts finalizeTradePricing removes the legacy $/mo floors).
// Roofing was excluded on 2026-09-22 (Kevin: "depends on subs"). Kevin lifted that on 2026-10-22 ("Yeah why not?") for
// the states our roofing market writes: the roofer entry below carries the revenue beside every number
// (TRADE_PRICE_EXTRAS) and is withheld on the closed states (TRADE_PRICE_CLOSED_STATES), which stay price-free.
//
// Second release (Kevin 2026-10-02 "OK"): the other trade families. Each figure was read from the CRM
// on 2026-10-02 and matched to the business's own work and the class the carrier rated, not a name
// keyword. Quotes exclude superseded, do-not-present, declined, indication, stale, unverified and
// rehearsal rows. A trade whose only evidence was a rehearsal, a preview, a class mismatch, a
// withdrawn price or an unknown carrier stays price-free.
import type { PageContent } from "./data";

export const TRADE_PRICES_AS_OF = "2026-10-02";

export type TradePrice = { usd: number; kind: "bound" | "quote"; line: string; business: string; asOf?: string };

const GL = "General liability";

// Two separate tree-service claims-made GL binds at this premium, recorded in CRM policies
// cfb5d455c756249b8a07a1124 (2026-10-23) and cmvlesx6z00k30tnt3bm2fw6k (2026-10-25).
// This is bound evidence for comparison, not the lower starting QUOTE in TRADE_PRICES.
export const TREE_BOUND_GL_COMPARABLE = "$1,457.48";

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
  // QC-verified Encore quote, $1,271.18 exact, repeated across tree submissions on 2026-10-20..26.
  // Claims-made is material: never describe this starting quote as a bound or occurrence policy.
  "tree-service": { usd: 1271, kind: "quote", line: "Claims-made general liability", business: "a tree service at about $300K revenue with one W-2 employee", asOf: "2026-10-27" },
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
  // Kevin 2026-10-29 asked for the lowest roofing quote to lead. This claims-made indication
  // has the same application and client-reported basis as the $1,795 occurrence option below.
  roofer: { usd: 1359, kind: "quote", line: "Claims-made general liability", business: "a roofer at about $377K revenue with $133K subcontracted", asOf: "2026-10-29" },
};

// States where a trade's price does not apply because the market behind it does not write there (state abbreviations).
// Those pages keep the price-free title, cost block and FAQ.
const ENCORE_CLOSED_STATES = new Set(["AK", "DC", "IA", "LA", "ME", "ND", "NH", "OK", "RI", "SD", "VT", "WA", "WV", "WY"]);
export const TRADE_PRICE_CLOSED_STATES: Record<string, ReadonlySet<string>> = {
  roofer: ENCORE_CLOSED_STATES,
  "tree-service": ENCORE_CLOSED_STATES,
};

export function tradePrice(slug: string, stateAbbr?: string): TradePrice | undefined {
  if (stateAbbr && TRADE_PRICE_CLOSED_STATES[slug]?.has(stateAbbr)) return undefined;
  return TRADE_PRICES[slug];
}

// The sitemap date for a page whose price came from a dated release (asOf); undefined where no price applies.
export function tradePriceUpdated(slug: string, stateAbbr?: string): string | undefined {
  // The closed-state wording was corrected on this date even though no price is shown there.
  if (stateAbbr && TRADE_PRICE_CLOSED_STATES[slug]?.has(stateAbbr)) return "2026-10-27";
  return tradePrice(slug, stateAbbr)?.asOf;
}

// Real prices by business size, for a trade where one starting price would mislead (roofing moves with revenue and
// subcontracted work). `revenue` is shown beside the price; an example without one is listed under the table.
export type PriceExample = { business: string; revenue?: string; price: string; sentence: string };
export type TradePriceExtras = {
  answer: string;
  heroSub: string;
  disclaimer: string;
  examples: { heading: string; items: PriceExample[]; note: string };
  nationalH1: string;
  nationalFaqs: { q: string; a: string }[];
};

// Roofer figures updated 2026-10-29. Quotes say "came in at"; only the bound policy says "bound". No carrier names,
// no client names, and no state attached to a quote.
export const TRADE_PRICE_EXTRAS: Record<string, TradePriceExtras> = {
  roofer: {
    answer: "A roofer at about $377K revenue, $133K subcontracted and no W-2 employees received a $1,359/yr claims-made general liability quote. The same application also produced a $1,795/yr occurrence quote. " +
      "These are real quotes, not bound policies, averages or state-specific rates. Claims-made and occurrence terms differ, so compare the policy forms and your contract requirements before choosing.",
    heroSub: "A roofer at about $377K revenue received a $1,359/yr claims-made general liability quote. Compare the occurrence option and other real quotes, then tell us about your work.",
    disclaimer: "Prices shown are real general liability quotes and one bound policy from our own book, each labelled. The $1,359 quote is claims-made; the paired $1,795 quote is occurrence. " +
      "They are not interchangeable or averages. Your premium depends on your work, revenue, subcontracting, payroll, location, limits and claims. These examples are not a quote or an offer of insurance.",
    examples: {
      heading: "Real roofing insurance quotes by business size",
      items: [
        { business: "A roofer, $133K subcontracted, no W-2 employees", revenue: "About $377K", price: "$1,359/yr, claims-made quote", sentence: "A roofer at about $377K revenue, $133K subcontracted and no W-2 employees received a $1,359/yr claims-made general liability quote." },
        { business: "The same roofer and filed work", revenue: "About $377K", price: "$1,795/yr, occurrence quote", sentence: "The same roofer also received a $1,795/yr occurrence general liability quote on the same filed business figures." },
        { business: "A Colorado residential contractor whose work includes roofing", price: "$1,795/yr, bound", sentence: "A Colorado residential contractor whose work includes roofing bound general liability with us at $1,795/yr, $1M/$2M occurrence." },
        { business: "A roofer, $150K subcontracted, one W-2 employee", revenue: "About $475K", price: "$1,795/yr, occurrence quote", sentence: "A roofer at about $475K revenue, $150K subcontracted and one W-2 employee came in at $1,795/yr for occurrence general liability." },
        { business: "A roofing company, $800K subcontracted", revenue: "About $1.3M", price: "$7,497/yr, quoted", sentence: "A roofing company at about $1.3M revenue, $800K subcontracted, came in at $7,497/yr." },
        { business: "A roofing and remodeling company", revenue: "About $2.5M", price: "$14,904/yr, quoted", sentence: "A roofing and remodeling company at about $2.5M revenue came in at $14,904/yr." },
        { business: "A roofing company", revenue: "About $4.5M", price: "$20,830/yr, quoted", sentence: "A roofing company at about $4.5M revenue came in at $20,830/yr." },
      ],
      note: "Real prices from our own book, not averages. The $1,359 claims-made and $1,795 occurrence quotes for the $377K roofer came from the same application, but the policy forms differ. Your price moves with revenue, subcontracted work, payroll and the share of commercial work.",
    },
    nationalH1: "Roofer Insurance: What Roofers Actually Pay",
    nationalFaqs: [
      {
        q: "What drives the price of roofing insurance?",
        a: "Mostly your annual revenue and how much of the work you subcontract. Payroll, residential versus commercial work, roof heights, torch or hot work and your claims history move it too. " +
          "Give us what you pay subcontractors as its own figure and keep their certificates on file, because carriers price subcontracted work differently from your own crew's.",
      },
      {
        q: "Occurrence or claims-made: what is the difference?",
        a: "An occurrence policy covers injury or damage that happens while the policy is active, even if the claim arrives years later. " +
          "A claims-made policy generally requires a claim to be made and reported under its timing terms, so continuity and any extended reporting period matter. " +
          "Roof leaks can show up long after the job. Compare the full terms and check your contracts: some GCs require occurrence coverage.",
      },
      {
        q: "What do you need from me to quote roofing insurance?",
        a: "Your business name and address, annual revenue, what you pay subcontractors, payroll and number of employees, your split of residential and commercial work, " +
          "the roof types and heights you work on, whether you do torch or hot work, and any claims in the last few years. Your current declarations page helps if you have one.",
      },
    ],
  },
};

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

// The full state name comes first (2026-10-16): searchers type "excavation insurance new hampshire", not "NH",
// and the old fallback "Excavation Insurance in NH: ..." matched none of those words. The abbreviation is last.
export function priceFreeTitle(name: string, place?: { name: string; abbr: string }): string {
  if (!place) return fit([`${name} Insurance: Quotes from Several Carriers`, `${name} Insurance: Compare Carrier Quotes`], 60);
  return fit([
    `${place.name} ${name} Insurance: Quotes from Several Carriers`,
    `${place.name} ${name} Insurance: Compare Carrier Quotes`,
    `${place.name} ${name} Insurance: Compare Quotes`,
    `${name} Insurance in ${place.name}`,
    `${name} Insurance in ${place.abbr}: Compare Quotes`,
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
  return `The price shown is the lowest ${p.line.toLowerCase()} premium in our own book for this trade as of ${p.asOf ?? TRADE_PRICES_AS_OF}, ` +
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
  const p = tradePrice(slug, opts.place?.abbr);
  if (!p) return c;
  const x = TRADE_PRICE_EXTRAS[slug];
  const where = placeLabel(opts.place);
  const lead = where ? `${where} ${opts.noun} insurance` : `${opts.noun[0].toUpperCase()}${opts.noun.slice(1)} insurance`;
  const answer = x?.answer ?? tradeCostAnswer(opts.noun, p, where);
  const disclaimer = x?.disclaimer ?? tradePriceDisclaimer(p);
  return {
    ...c,
    title: pricedTitle(opts.name, p, opts.place),
    heroH1: x && !opts.place ? x.nationalH1 : c.heroH1,
    heroSub: hasLegacyFloor(c.heroSub)
      ? x?.heroSub ?? `Our lowest real ${p.line.toLowerCase()} price for this trade is ${priceText(p)}, ${kindPhrase(p)}. Tell us about your work and get your own quote in a few minutes.`
      : c.heroSub,
    metaDescription: slug === "roofer"
      ? `${lead} from ${priceText(p)} in a real claims-made GL quote for a $377K-revenue roofer. Compare its occurrence option.`
      : pricedMeta(lead, p, [
        ...(opts.metaTails ?? []),
        "Compare quotes from several carriers.",
        "Get a quote.",
      ]),
    costNarrative: [answer, ...c.costNarrative.filter((para) => !hasLegacyFloor(para))],
    // A profile's own "General liability: Individual quote" row stays, renamed so it reads as the reader's quote.
    costRows: [tradePriceRow(p), ...c.costRows.filter((row) => !legacyFloorRow(row))
      .map((row) => (row.coverage === "General liability" ? { ...row, coverage: "Your general liability quote" } : row))],
    costDisclaimer: c.costDisclaimer ? `${disclaimer} ${c.costDisclaimer}` : disclaimer,
    ...(x ? { priceExamples: { ...x.examples, table: !opts.place } } : {}),
    faqs: [
      { q: `How much does ${opts.noun} insurance cost${where ? ` in ${where}` : ""}?`, a: answer },
      ...(x && !opts.place ? x.nationalFaqs : []),
      ...c.faqs.filter((f) => !isCostQ(f.q)),
    ],
  };
}

// Trades with no verified price: remove the legacy monthly floors from
// the title, hero, cost block and FAQ instead of publishing a number we cannot stand behind.
export function withoutPrice(
  c: PageContent,
  opts: { name: string; noun: string; plural: string; place?: { name: string; abbr: string }; noPriceReason?: string },
): PageContent {
  const where = placeLabel(opts.place);
  const answer = opts.noPriceReason ?? `We do not publish a starting price for ${opts.noun} insurance yet, because we have not bound enough of these policies in this class to give a real number. ` +
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
