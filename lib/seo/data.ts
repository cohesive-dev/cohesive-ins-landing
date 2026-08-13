// Programmatic SEO data layer for /insurance pages.
//
// Structure: 24 licensed-state profiles (real per-state facts: dram shop law,
// WC threshold, wind, market notes) + per-vertical builders that compose full
// page content from them. Pages exist for:
//   /insurance/restaurant/[state] and /insurance/bar/[state]  (24 each)
//   /insurance/[vertical]                                     (5 national pages)
// Verticals with thin standalone search demand (pizzeria, deli, coffee shop,
// brewery, fine dining) are consolidated into restaurant/bar pages, not built.
//
// Copy rules: plain short sentences, no em dashes (use "-" or a period), no
// marketing filler. Cost figures are stated plainly as ranges. "From our own
// book" phrasing is ONLY used where we have a real quote or bind to cite
// (NY, NC restaurant quotes; the recent binds on the splash pages). Never
// attribute published-median numbers to our own quote log.

export type Vertical = {
  slug: string;
  name: string;
  noun: string;
};

export const VERTICALS: Vertical[] = [
  { slug: "restaurant", name: "Restaurant", noun: "restaurant" },
  { slug: "bar", name: "Bar & Tavern", noun: "bar" },
  { slug: "food-truck", name: "Food Truck", noun: "food truck" },
  { slug: "catering", name: "Catering", noun: "catering business" },
  { slug: "bakery", name: "Bakery", noun: "bakery" },
];

// Only these verticals fan out to per-state pages.
export const STATE_VERTICALS = ["restaurant", "bar"];

type Fact = { title: string; body: string };

export type StateProfile = {
  slug: string;
  name: string;
  abbr: string;
  // Rough commercial-liability cost tier used to pick the price ranges shown.
  costBand: "low" | "mid" | "high";
  // Sentence fragment: when WC becomes mandatory.
  wcWhen: string;
  dramShopType: "full" | "limited" | "none";
  liquorFact: Fact;
  windFact?: Fact;
  marketFact?: Fact;
};

// Real per-state quote-log stats pulled from the CRM quotes table (read-only,
// 2026-08-13; 1,276 rows joined to account addresses). `n` = all-class quote
// count; `food` = the range of restaurant-carrier (Rainbow/Next/Foxquilt)
// quotes where we have them. Own-book claims on pages are generated ONLY from
// this data - a state with no entry gets no own-book sentence.
const QUOTE_LOG: Record<string, { n: number; food?: { lo: number; hi: number } }> = {
  texas: { n: 112 },
  ohio: { n: 60, food: { lo: 1800, hi: 1800 } },
  arkansas: { n: 35, food: { lo: 1900, hi: 4400 } },
  alabama: { n: 33 },
  illinois: { n: 33 },
  louisiana: { n: 33 },
  pennsylvania: { n: 31, food: { lo: 4800, hi: 7800 } },
  "north-carolina": { n: 29, food: { lo: 2300, hi: 2300 } },
  georgia: { n: 29 },
  "south-carolina": { n: 23 },
  florida: { n: 20 },
  kentucky: { n: 18 },
  missouri: { n: 17 },
  "new-york": { n: 12, food: { lo: 2400, hi: 4500 } },
  minnesota: { n: 10 },
  tennessee: { n: 10 },
  virginia: { n: 9 },
  indiana: { n: 8 },
  maryland: { n: 7 },
  wisconsin: { n: 7 },
  arizona: { n: 6 },
  "new-jersey": { n: 3 },
};

const fmt = (v: number) => `$${v.toLocaleString("en-US")}`;

// The strongest own-book sentence the quote log actually supports.
function ownBookLine(
  s: StateProfile,
  noun: string,
  includeFood = true,
): string | undefined {
  const log = QUOTE_LOG[s.slug];
  if (!log) return undefined;
  if (log.food && includeFood) {
    return log.food.lo === log.food.hi
      ? `From our own book: a recent ${s.name} ${noun} quote came in around ${fmt(log.food.lo)}/yr.`
      : `From our own book: recent ${s.name} ${noun} quotes have come in between ${fmt(log.food.lo)} and ${fmt(log.food.hi)} per year.`;
  }
  if (log.n >= 15) {
    return `From our own book: we've run ${log.n} ${s.name} quotes recently across business classes, so the ranges below reflect what this market actually charges.`;
  }
  if (log.n >= 5) {
    return `We quote ${s.name} businesses regularly.`;
  }
  return undefined;
}

export const STATES: StateProfile[] = [
  {
    slug: "alabama",
    name: "Alabama",
    abbr: "AL",
    costBand: "low",
    wcWhen: "once you have 5 or more employees",
    dramShopType: "full",
    liquorFact: {
      title: "Alabama has a dram shop law",
      body: "Alabama's Dram Shop Act (Ala. Code 6-5-71) lets someone injured by an intoxicated person sue the business that served them alcohol unlawfully. General liability doesn't cover this. If you serve alcohol you need liquor liability, priced off your % of alcohol sales.",
    },
    windFact: {
      title: "Gulf Coast wind changes property pricing",
      body: "Baldwin and Mobile county locations carry named-storm and wind/hail deductibles, and some carriers write coastal property with wind excluded. Inland Alabama prices normally.",
    },
  },
  {
    slug: "arkansas",
    name: "Arkansas",
    abbr: "AR",
    costBand: "low",
    wcWhen: "once you have 3 or more employees",
    dramShopType: "full",
    liquorFact: {
      title: "Arkansas has dram shop liability",
      body: "Arkansas law (Ark. Code 16-126-103 and 104) allows claims against a business that serves a minor or a clearly intoxicated person who then injures someone. General liability doesn't cover it. If you serve alcohol, carry liquor liability.",
    },
  },
  {
    slug: "arizona",
    name: "Arizona",
    abbr: "AZ",
    costBand: "mid",
    wcWhen: "for any employee, even part-time",
    dramShopType: "full",
    liquorFact: {
      title: "Arizona has a dram shop statute",
      body: "ARS 4-311 makes a licensee liable for serving an obviously intoxicated person or a minor who then causes injury. General liability doesn't cover this. If you serve alcohol you need liquor liability, priced off your % of alcohol sales.",
    },
  },
  {
    slug: "colorado",
    name: "Colorado",
    abbr: "CO",
    costBand: "mid",
    wcWhen: "for any employee, even part-time",
    dramShopType: "full",
    liquorFact: {
      title: "Colorado has a dram shop law with a damage cap",
      body: "Colorado (CRS 44-3-801) allows claims against a licensee that served a visibly intoxicated person or a minor, with damages capped by statute. The cap doesn't make claims cheap. If you serve alcohol, carry liquor liability.",
    },
  },
  {
    slug: "florida",
    name: "Florida",
    abbr: "FL",
    costBand: "high",
    wcWhen: "once you have 4 or more employees",
    dramShopType: "limited",
    liquorFact: {
      title: "Florida's dram shop law is narrow, but liquor liability still matters",
      body: "Florida (Fla. Stat. 768.125) only imposes liability for serving minors or someone habitually addicted to alcohol. That's narrower than most states, but serving a minor is exactly the claim that ruins a business, and nearly every lease and event contract still requires liquor liability. Most Florida restaurants that serve carry it.",
    },
    windFact: {
      title: "Hurricane deductibles apply almost everywhere",
      body: "Florida property policies carry hurricane or named-storm deductibles, usually 2-5% of the building or contents limit. Carriers also care about roof age and wind mitigation features, and coastal locations may see wind written separately. Budget for the deductible, not just the premium.",
    },
    marketFact: {
      title: "The Florida market is tighter than most",
      body: "Fewer standard carriers write Florida restaurants than in other states, so more risks land with surplus lines carriers. A surplus lines quote isn't a red flag in Florida. It's often just how the state works.",
    },
  },
  {
    slug: "georgia",
    name: "Georgia",
    abbr: "GA",
    costBand: "mid",
    wcWhen: "once you have 3 or more employees",
    dramShopType: "full",
    liquorFact: {
      title: "Georgia has a dram shop law",
      body: "Georgia (OCGA 51-1-40) imposes liability for willfully serving a minor or a noticeably intoxicated person knowing they'll soon be driving. General liability doesn't cover it. If you serve alcohol, carry liquor liability.",
    },
    windFact: {
      title: "Coastal Georgia carries wind deductibles",
      body: "Savannah and the coastal counties see named-storm deductibles and tighter property terms. Metro Atlanta and inland Georgia price normally.",
    },
  },
  {
    slug: "illinois",
    name: "Illinois",
    abbr: "IL",
    costBand: "high",
    wcWhen: "for any employee, even part-time",
    dramShopType: "full",
    liquorFact: {
      title: "Illinois requires dram shop insurance to hold a liquor license",
      body: "Illinois is one of the strictest dram shop states. The Liquor Control Act (235 ILCS 5/6-21) imposes liability on licensees without the injured party having to prove the server was negligent, and licensees must file proof of dram shop coverage to keep their license. If you serve alcohol in Illinois, liquor liability isn't optional in any sense.",
    },
    marketFact: {
      title: "Cook County claims run expensive",
      body: "Chicago-area liability verdicts and settlements run above national norms, and carriers price Cook County accordingly. The same restaurant often quotes noticeably cheaper downstate.",
    },
  },
  {
    slug: "indiana",
    name: "Indiana",
    abbr: "IN",
    costBand: "low",
    wcWhen: "for any employee, even part-time",
    dramShopType: "full",
    liquorFact: {
      title: "Indiana has dram shop liability",
      body: "Indiana (IC 7.1-5-10-15.5) imposes liability when a server had actual knowledge the person was visibly intoxicated and the intoxication caused the injury. General liability doesn't cover it. If you serve alcohol, carry liquor liability.",
    },
  },
  {
    slug: "kentucky",
    name: "Kentucky",
    abbr: "KY",
    costBand: "low",
    wcWhen: "for any employee, even part-time",
    dramShopType: "limited",
    liquorFact: {
      title: "Kentucky limits dram shop claims, but doesn't eliminate them",
      body: "Kentucky (KRS 413.241) puts primary responsibility on the drinker, but a licensee can still be liable when a reasonable person should have known the patron was intoxicated. Leases and event contracts also routinely require liquor liability. If you serve, carry it.",
    },
  },
  {
    slug: "louisiana",
    name: "Louisiana",
    abbr: "LA",
    costBand: "high",
    wcWhen: "for any employee, even part-time",
    dramShopType: "none",
    liquorFact: {
      title: "Louisiana has no dram shop liability for serving adults",
      body: "Louisiana (RS 9:2800.1) makes the drinker, not the server, responsible for injuries caused by intoxication, as long as the patron was of legal age. Serving minors is still a liability. Many leases and event contracts require liquor liability anyway, and it's cheap relative to the alcohol revenue it protects.",
    },
    windFact: {
      title: "Named-storm deductibles are standard",
      body: "Louisiana property policies carry named-storm or hurricane deductibles, typically 2-5%, and southern-parish locations may see wind written separately or excluded. Roof age matters a lot to carriers here.",
    },
    marketFact: {
      title: "Louisiana liability costs run high",
      body: "Louisiana is one of the most litigious states in the country and liability premiums reflect it. Expect quotes above national medians even for a clean operation, and shop more than one market.",
    },
  },
  {
    slug: "maryland",
    name: "Maryland",
    abbr: "MD",
    costBand: "mid",
    wcWhen: "for any employee, even part-time",
    dramShopType: "none",
    liquorFact: {
      title: "Maryland has no dram shop law",
      body: "Maryland courts have declined to impose dram shop liability on businesses for serving adults. Serving minors still creates exposure, and leases and event contracts routinely require liquor liability regardless. Most Maryland restaurants that serve carry it.",
    },
    windFact: {
      title: "Shore locations see wind deductibles",
      body: "Ocean City and Eastern Shore locations carry wind/hail or named-storm deductibles. The rest of the state prices normally.",
    },
  },
  {
    slug: "minnesota",
    name: "Minnesota",
    abbr: "MN",
    costBand: "mid",
    wcWhen: "for any employee, even part-time",
    dramShopType: "full",
    liquorFact: {
      title: "Minnesota requires liquor liability insurance by law",
      body: "Minnesota's Civil Damage Act (Minn. Stat. 340A.801) is a strong dram shop law, and the state requires licensees to carry liquor liability insurance at statutory minimum limits to hold a license (340A.409). If you serve alcohol in Minnesota, the coverage is mandatory, not optional.",
    },
  },
  {
    slug: "missouri",
    name: "Missouri",
    abbr: "MO",
    costBand: "mid",
    wcWhen: "once you have 5 or more employees",
    dramShopType: "limited",
    liquorFact: {
      title: "Missouri's dram shop law sets a high bar, but claims still happen",
      body: "Missouri (RSMo 537.053) requires clear and convincing evidence that a licensee knowingly served a visibly intoxicated person. That's a higher bar than most states, but defending even a losing claim is expensive, and leases still require liquor liability. If you serve, carry it.",
    },
  },
  {
    slug: "north-carolina",
    name: "North Carolina",
    abbr: "NC",
    costBand: "low",
    wcWhen: "once you have 3 or more employees",
    dramShopType: "full",
    liquorFact: {
      title: "North Carolina has dram shop liability",
      body: "North Carolina imposes liability by statute for sales to underage persons (NCGS 18B-121) and through negligence claims for serving intoxicated patrons. General liability doesn't cover it. If you serve alcohol, carry liquor liability.",
    },
    windFact: {
      title: "Coastal counties carry wind deductibles",
      body: "Locations east of I-95, and especially the Outer Banks and Wilmington area, see named-storm deductibles and in some cases wind placed through the state's coastal pool. Charlotte and the Triangle price normally.",
    },
  },
  {
    slug: "new-jersey",
    name: "New Jersey",
    abbr: "NJ",
    costBand: "high",
    wcWhen: "for any employee, even part-time",
    dramShopType: "full",
    liquorFact: {
      title: "New Jersey has a dram shop law",
      body: "New Jersey's Licensed Alcoholic Beverage Server Fair Liability Act allows claims against a licensee that served a visibly intoxicated person or a minor. General liability doesn't cover it. If you serve alcohol, carry liquor liability, and expect NJ pricing to run above national norms.",
    },
    windFact: {
      title: "Shore towns carry wind deductibles",
      body: "Jersey Shore locations see wind/hail and named-storm deductibles. North Jersey and inland locations price normally.",
    },
  },
  {
    slug: "nevada",
    name: "Nevada",
    abbr: "NV",
    costBand: "mid",
    wcWhen: "for any employee, even part-time",
    dramShopType: "none",
    liquorFact: {
      title: "Nevada has no dram shop liability for serving adults",
      body: "Nevada (NRS 41.1305) shields businesses from liability for serving patrons 21 and over. Knowingly serving minors is different, and licensed businesses still face claims from fights, falls, and everything else alcohol amplifies. Leases and event contracts routinely require liquor liability anyway.",
    },
  },
  {
    slug: "new-york",
    name: "New York",
    abbr: "NY",
    costBand: "high",
    wcWhen: "for any employee, even part-time",
    dramShopType: "full",
    liquorFact: {
      title: "NY's Dram Shop law makes liquor liability a must",
      body: "New York's Dram Shop Act (General Obligations Law 11-101) lets someone injured by an intoxicated customer sue the business that served them. General liability doesn't cover this. New York is also the most expensive state in the country for liquor liability. Carriers price it off your % of alcohol sales, so an accurate number (say 15%) instead of a default can change your premium a lot.",
    },
    windFact: {
      title: "Coastal ZIPs have mandatory wind/hail deductibles",
      body: "Locations near the water (much of NYC, Long Island, and the Hudson waterfront) get carrier-mandated minimum wind/hail deductibles, and some carriers exclude wind within 2 miles of the coast. Coastal NY locations still quote with standard carriers. It just changes the deductible.",
    },
    marketFact: {
      title: "NYC's Food Protection Certificate earns a credit",
      body: "NYC requires a supervisor with a DOHMH Food Protection Certificate on site. Carriers treat a certified food safety manager as a pricing credit. If you're in the five boroughs you probably qualify already, so make sure it's on your application.",
    },
  },
  {
    slug: "ohio",
    name: "Ohio",
    abbr: "OH",
    costBand: "low",
    wcWhen: "for any employee, even part-time",
    dramShopType: "limited",
    liquorFact: {
      title: "Ohio's dram shop law is limited but real",
      body: "Ohio (ORC 4399.18) imposes liability for injuries on your premises, and off-premises only when you knowingly served a noticeably intoxicated person or a minor. Leases and event contracts still require liquor liability. If you serve, carry it.",
    },
  },
  {
    slug: "pennsylvania",
    name: "Pennsylvania",
    abbr: "PA",
    costBand: "mid",
    wcWhen: "for any employee, even part-time",
    dramShopType: "full",
    liquorFact: {
      title: "Pennsylvania has a dram shop law",
      body: "Pennsylvania (47 P.S. 4-497) imposes liability on a licensee that serves a visibly intoxicated person who then injures someone. General liability doesn't cover it. If you serve alcohol, carry liquor liability, priced off your % of alcohol sales.",
    },
  },
  {
    slug: "south-carolina",
    name: "South Carolina",
    abbr: "SC",
    costBand: "mid",
    wcWhen: "once you have 4 or more employees",
    dramShopType: "full",
    liquorFact: {
      title: "SC requires $1M liquor liability for late-night service",
      body: "South Carolina requires businesses licensed to sell alcohol for on-premises consumption after 5 p.m. to carry at least $1 million in liquor liability (SC Code 61-2-145). Courts also recognize dram-shop-style claims. If you serve alcohol in SC, the coverage is a license requirement, not a choice, and SC liquor pricing has risen sharply because of it.",
    },
    windFact: {
      title: "Coastal SC carries wind deductibles or separate wind",
      body: "Charleston, Myrtle Beach, and the coastal counties see named-storm deductibles, and wind is often written separately through the state wind pool. Upstate locations price normally.",
    },
  },
  {
    slug: "tennessee",
    name: "Tennessee",
    abbr: "TN",
    costBand: "low",
    wcWhen: "once you have 5 or more employees",
    dramShopType: "limited",
    liquorFact: {
      title: "Tennessee's dram shop standard is high, but coverage still matters",
      body: "Tennessee (Tenn. Code 57-10-102) requires proof beyond a reasonable doubt that the sale was to a visibly intoxicated person or a minor. That's the toughest standard in the country, but defense costs are real either way, and leases and event contracts still require liquor liability. If you serve, carry it.",
    },
  },
  {
    slug: "texas",
    name: "Texas",
    abbr: "TX",
    costBand: "mid",
    wcWhen: "is voluntary for private employers - Texas is the only state that doesn't mandate it, but going without leaves you open to injury lawsuits with no damage caps",
    dramShopType: "full",
    liquorFact: {
      title: "Texas has a dram shop act with a safe harbor",
      body: "The Texas Dram Shop Act (Alco. Bev. Code ch. 2) imposes liability for serving someone obviously intoxicated to the point of danger. Texas also gives a safe-harbor defense when your staff is TABC-certified, which is both a legal shield and a pricing credit. If you serve alcohol, carry liquor liability and get your staff certified.",
    },
    windFact: {
      title: "Coastal Texas wind is its own market",
      body: "Gulf Coast counties (Houston to Brownsville, Corpus Christi, Galveston) usually need wind through TWIA or a surplus lines market, on top of the standard property policy. Inland Texas prices normally.",
    },
  },
  {
    slug: "virginia",
    name: "Virginia",
    abbr: "VA",
    costBand: "low",
    wcWhen: "once you have 3 or more employees",
    dramShopType: "none",
    liquorFact: {
      title: "Virginia has no dram shop law",
      body: "Virginia courts hold the drinker responsible for their own actions, so there's no dram shop liability for serving adults. Serving minors still creates exposure, and leases and event contracts routinely require liquor liability regardless. It's inexpensive in Virginia precisely because the law is favorable.",
    },
    windFact: {
      title: "Tidewater locations see wind deductibles",
      body: "Virginia Beach, Norfolk, and the coastal Tidewater area carry wind/hail or named-storm deductibles. The rest of the state prices normally.",
    },
  },
  {
    slug: "wisconsin",
    name: "Wisconsin",
    abbr: "WI",
    costBand: "low",
    wcWhen: "once you have 3 or more employees",
    dramShopType: "none",
    liquorFact: {
      title: "Wisconsin servers are largely immune, but coverage still matters",
      body: "Wisconsin (Wis. Stat. 125.035) gives alcohol providers broad immunity except for serving minors. That makes liquor liability cheap here, not unnecessary. Serving a minor is still the claim that ends a business, and leases and event contracts require the coverage anyway.",
    },
  },
];

// ---- price ranges by cost band ---------------------------------------------

const RESTAURANT_RANGES = {
  low: { bop: "$140-$300/mo", gl: "$70-$130/mo", liquor: "from ~$40/mo" },
  mid: { bop: "$180-$380/mo", gl: "$90-$160/mo", liquor: "from ~$55/mo" },
  high: { bop: "$220-$480/mo", gl: "$130-$230/mo", liquor: "~$75/mo and up" },
};

const BAR_RANGES = {
  low: { bop: "$180-$350/mo", liquor: "$80-$130/mo" },
  mid: { bop: "$220-$430/mo", liquor: "$100-$160/mo" },
  high: { bop: "$280-$550/mo", liquor: "$130-$220/mo" },
};

// ---- shared content types --------------------------------------------------

export type PageContent = {
  title: string;
  metaDescription: string;
  heroH1: string;
  heroSub: string;
  costNarrative: string[];
  costRows: { coverage: string; range: string; note: string }[];
  priceDrivers: string[];
  coverages: { name: string; desc: string }[];
  stateFacts: Fact[];
  faqs: { q: string; a: string }[];
  // One-line "also covered" note rendered under the hero (consolidated classes).
  alsoCovers?: string;
};

// ---- restaurant builder ----------------------------------------------------

function liquorFaq(s: StateProfile, noun: string): { q: string; a: string } {
  const q = `Do I need liquor liability if I only serve beer and wine?`;
  if (s.dramShopType === "none") {
    return {
      q,
      a: `${s.name} doesn't impose dram shop liability for serving adults, so the legal exposure is lower than in most states. But serving a minor still creates liability, and most leases and event contracts require liquor liability no matter what state law says. It's inexpensive for a low-alcohol ${noun}, so most that serve carry it.`,
    };
  }
  if (s.dramShopType === "limited") {
    return {
      q,
      a: `Yes. ${s.name}'s dram shop law is narrower than most states, but it's not zero, and defense costs are real even for claims that fail. Carriers price liquor liability off your % of alcohol sales, so a ${noun} at 10-15% pays far less than a bar. Most leases require it anyway.`,
    };
  }
  return {
    q,
    a: `Yes. ${s.name}'s dram shop law applies to any place that serves alcohol. Carriers price liquor liability off your % of alcohol sales, so a ${noun} at 10-15% pays far less than a bar. Going without it leaves dram shop claims completely uncovered.`,
  };
}

function wcFaqSentence(s: StateProfile): string {
  if (s.slug === "texas") {
    return `Texas is the only state where workers' comp is voluntary for private employers. Most restaurants carry it anyway, because going without means unlimited injury-lawsuit exposure.`;
  }
  return `${s.name} requires workers' comp ${s.wcWhen}.`;
}

export function buildRestaurantContent(s: StateProfile): PageContent {
  const r = RESTAURANT_RANGES[s.costBand];
  const bandSentence =
    s.costBand === "high"
      ? `${s.name} runs above the national median for restaurant coverage.`
      : s.costBand === "low"
        ? `${s.name} is one of the cheaper states to insure a restaurant.`
        : `${s.name} prices close to the national median for restaurant coverage.`;

  const ownBook = ownBookLine(s, "restaurant");
  const narrative = [
    `${bandSentence} The national median for a restaurant businessowners policy (general liability + property) is about $224-251/mo. Most owners who get quoted high aren't overpaying because of the state. They're overpaying because of how their restaurant was classified.`,
  ];
  if (ownBook) narrative.push(ownBook);
  narrative.push(
    `Counter-service spots come in under the ranges below. Heavy cooking, high alcohol sales, or insuring your building push costs up.`,
  );

  return {
    title: `Restaurant Insurance in ${s.name} - Costs & Quotes`,
    metaDescription: `What restaurant insurance costs in ${s.name}, what the state requires, and how to get a quote today. Licensed ${s.abbr} agency.`,
    heroH1: `Restaurant Insurance in ${s.name}`,
    heroSub: `See what ${s.abbr} restaurants pay, what the state requires, and get your own quote in a few minutes. No spam, no obligation.`,
    alsoCovers: `Also for pizzerias, delis, cafes, coffee shops, food counters, and quick service.`,
    costNarrative: narrative,
    costRows: [
      {
        coverage: "Businessowners policy (BOP) - GL + property",
        range: r.bop,
        note: "National restaurant median is about $224-251/mo. Size, cooking, and alcohol set where you land.",
      },
      {
        coverage: "General liability only",
        range: r.gl,
        note: "GL alone works for some counter-service spots. Most restaurants need the property side too.",
      },
      {
        coverage: "Liquor liability",
        range: r.liquor,
        note: "Priced off your % of alcohol sales.",
      },
      {
        coverage: "Workers' compensation",
        range: "Priced on payroll",
        note:
          s.slug === "texas"
            ? "Voluntary in Texas, but most restaurants carry it."
            : `Required ${s.wcWhen}. Quoted separately from the BOP.`,
      },
    ],
    priceDrivers: [
      "Alcohol as a share of sales. Under ~35% quotes instantly with most carriers; above that it goes to an underwriter",
      "Deep frying and charbroiling rate higher than limited cooking",
      "Square footage, seating, and annual sales",
      "Insuring the building vs just your contents and improvements",
      "Construction and sprinklers. A masonry building with sprinklers rates lower than what carriers assume by default",
      "Years in business and claims history",
    ],
    coverages: [
      {
        name: "General liability",
        desc: "Slip-and-falls, foodborne illness claims, damage to your rented space. Your lease almost certainly requires $1M/$2M with your landlord as additional insured.",
      },
      {
        name: "Commercial property / BPP",
        desc: "Kitchen equipment, furniture, build-out, food spoilage. Bundled with GL in a businessowners policy (BOP), which is how nearly every restaurant buys it.",
      },
      {
        name: "Liquor liability",
        desc: `Covers claims from serving alcohol. See the ${s.abbr} liquor law note below.`,
      },
      {
        name: "Business income",
        desc: "Replaces lost revenue if a fire or other covered loss shuts you down. Ask for business income coverage up to 18 months.",
      },
      {
        name: "Workers' compensation",
        desc: wcFaqSentence(s) + " Priced on payroll, quoted alongside the BOP.",
      },
    ],
    stateFacts: [
      s.liquorFact,
      {
        title:
          s.slug === "texas"
            ? "Workers' comp is voluntary in Texas"
            : "When workers' comp kicks in",
        body:
          wcFaqSentence(s) +
          (s.slug === "texas"
            ? ""
            : " Penalties for going without it once you're over the threshold are steep, and it's quoted separately from your BOP."),
      },
      ...(s.windFact ? [s.windFact] : []),
      ...(s.marketFact ? [s.marketFact] : []),
      {
        title: "Your lease drives your limits",
        body: "Nearly every commercial lease requires $1M/$2M general liability, landlord as additional insured, and a COI before you get keys. Some leases also require $100K+ damage-to-premises limits that only certain policy packages reach. Worth checking before you buy the cheapest quote.",
      },
    ],
    faqs: [
      {
        q: `How much does restaurant insurance cost in ${s.name}?`,
        a: `A restaurant businessowners policy in ${s.name} typically runs ${r.bop}, against a national median of about $224-251/mo. ${ownBook ?? ""} Counter-service spots come in below the range. Heavy cooking, high alcohol sales, or building coverage push it above.`.replace("  ", " "),
      },
      {
        q: `What insurance is legally required for a restaurant in ${s.name}?`,
        a: `${wcFaqSentence(s)} Commercial auto is required if you own vehicles. General liability and property aren't required by law, but your lease will require GL with your landlord as additional insured, so in practice every leased restaurant carries it.`,
      },
      liquorFaq(s, "restaurant"),
      {
        q: "Doesn't my landlord's insurance cover me?",
        a: "No. Your landlord's policy covers the building, not your business. You're responsible for your own liability, your equipment and improvements, and for adding the landlord to your policy as additional insured with a COI.",
      },
      {
        q: "What does a businessowners policy (BOP) cover?",
        a: "A BOP bundles general liability with commercial property (your equipment, furniture, build-out, food spoilage) plus business income coverage that replaces revenue if a covered loss shuts you down. It's how nearly every small restaurant buys insurance, and it's cheaper than buying the pieces separately.",
      },
      {
        q: "How fast can I get covered and get a COI?",
        a: `For most ${s.abbr} restaurants under about 35% alcohol sales we can quote same-day, and issue a COI as soon as the policy binds. Often the same day your landlord asks for it.`,
      },
    ],
  };
}

// ---- bar builder -----------------------------------------------------------

export function buildBarContent(s: StateProfile): PageContent {
  const b = BAR_RANGES[s.costBand];
  // Bars only get the all-class count line - our food-carrier dollar figures
  // are restaurant quotes and must not be presented as bar quotes.
  const ownBook = ownBookLine(s, "bar", false);
  const liquorLine =
    s.dramShopType === "none"
      ? `${s.name} is one of the few states without dram shop liability for serving adults, which keeps liquor pricing lower here than in most of the country.`
      : s.dramShopType === "limited"
        ? `${s.name}'s dram shop law is narrower than most states, which helps pricing, but liquor liability is still the core coverage for a bar.`
        : `${s.name} has dram shop liability, so liquor liability is the coverage your bar actually lives on.`;

  return {
    title: `Bar Insurance in ${s.name} - Costs & Quotes`,
    metaDescription: `What bar and tavern insurance costs in ${s.name}, including liquor liability, and how to get a quote. Licensed ${s.abbr} agency.`,
    heroH1: `Bar & Tavern Insurance in ${s.name}`,
    heroSub: `See what ${s.abbr} bars pay for coverage including liquor liability, and get your own quote in a few minutes. No spam, no obligation.`,
    alsoCovers: `Also for taverns, pubs, breweries and brewpubs, wine bars, and lounges.`,
    costNarrative: [
      `Bars are among the most expensive food-and-beverage businesses to insure, and liquor liability is the reason. Nationally a bar businessowners policy averages about $276/mo, with liquor liability adding roughly $115/mo on top. ${liquorLine}`,
      `The single biggest premium driver is your % of alcohol sales, followed by hours, entertainment, and security. A neighborhood tavern that closes at midnight and a late-night venue with live music are different risks to a carrier, even at the same revenue.${ownBook ? " " + ownBook : ""}`,
    ],
    costRows: [
      {
        coverage: "Businessowners policy (BOP) - GL + property",
        range: b.bop,
        note: "National bar median is about $276/mo. Hours, entertainment, and cooking set where you land.",
      },
      {
        coverage: "Liquor liability",
        range: b.liquor,
        note: "National average is about $115/mo. Scales with alcohol sales and closing time.",
      },
      {
        coverage: "Assault & battery coverage",
        range: "Varies",
        note: "Many carriers sublimit or exclude A&B for bars. Getting it included is worth more than a cheap premium.",
      },
      {
        coverage: "Workers' compensation",
        range: "Priced on payroll",
        note:
          s.slug === "texas"
            ? "Voluntary in Texas, but most bars carry it."
            : `Required ${s.wcWhen}. Quoted separately.`,
      },
    ],
    priceDrivers: [
      "Alcohol as a share of sales. Most standard carriers refer or decline above ~50-65%, which is why bars often need specialty markets",
      "Closing time. Past midnight and past 2 a.m. are real pricing breakpoints",
      "Live music, DJs, dancing, and security staff",
      "Food service. A real kitchen usually helps your rate, because food revenue dilutes alcohol share",
      "Assault & battery claims history",
      "Square footage, occupancy, and building coverage",
    ],
    coverages: [
      {
        name: "Liquor liability",
        desc: `The core bar coverage. ${liquorLine}`,
      },
      {
        name: "General liability",
        desc: "Slip-and-falls, patron injuries, damage to your rented space. Your lease requires $1M/$2M with your landlord as additional insured.",
      },
      {
        name: "Assault & battery",
        desc: "Fights are the most common serious bar claim, and many policies sublimit or exclude them. Ask specifically what your A&B limit is.",
      },
      {
        name: "Commercial property / BPP",
        desc: "Bar build-out, equipment, inventory, TVs and sound. Bundled with GL in a BOP.",
      },
      {
        name: "Workers' compensation",
        desc: wcFaqSentence(s) + " Priced on payroll.",
      },
    ],
    stateFacts: [
      s.liquorFact,
      {
        title:
          s.slug === "texas"
            ? "Workers' comp is voluntary in Texas"
            : "When workers' comp kicks in",
        body: wcFaqSentence(s),
      },
      ...(s.windFact ? [s.windFact] : []),
      ...(s.marketFact ? [s.marketFact] : []),
      {
        title: "High alcohol share changes which carriers will quote",
        body: "Standard carriers write restaurants and food-forward taverns. Once alcohol passes roughly half of sales, most standard markets step back and the quote comes from specialty or surplus lines carriers instead. That's normal for bars. It changes which market we use, not whether you can get covered.",
      },
    ],
    faqs: [
      {
        q: `How much does bar insurance cost in ${s.name}?`,
        a: `A bar businessowners policy in ${s.name} typically runs ${b.bop}, with liquor liability adding ${b.liquor}. Nationally bars average about $276/mo for the BOP plus $115/mo for liquor. Hours, entertainment, alcohol share, and claims history set where you land in the range.`,
      },
      {
        q: `Is liquor liability required in ${s.name}?`,
        a:
          s.slug === "south-carolina"
            ? "Yes, by law. South Carolina requires at least $1 million in liquor liability for businesses serving on-premises after 5 p.m. (SC Code 61-2-145)."
            : s.slug === "illinois"
              ? "Effectively yes. Illinois requires licensees to file proof of dram shop coverage to hold a liquor license."
              : s.slug === "minnesota"
                ? "Yes. Minnesota requires liquor liability insurance at statutory minimums as a condition of the license (Minn. Stat. 340A.409)."
                : s.dramShopType === "none"
                  ? `${s.name} doesn't require it by statute and doesn't impose dram shop liability for serving adults. Your lease or landlord usually requires it anyway, and serving minors is still uncovered exposure without it.`
                  : `Not by statute in most cases, but your lease, your landlord, and any event contract will require it, and ${s.name}'s dram shop law means a bar without it is uninsured for its biggest risk.`,
      },
      {
        q: "My alcohol sales are over 50%. Can I still get covered?",
        a: "Yes. Above roughly half alcohol sales most standard carriers step back, so the quote comes from specialty or surplus lines markets that write bars every day. Expect a higher rate than a restaurant pays, and expect the application to ask about hours, security, and entertainment in more detail.",
      },
      {
        q: "What is assault & battery coverage and do I need it?",
        a: "It covers injury claims arising from fights, including claims that your staff over-served or under-secured the situation. It's the most common serious bar claim, and many policies quietly sublimit it to $25K-$100K or exclude it. Ask what your limit is before you bind, not after.",
      },
      {
        q: "Does hiring security or TABC/server training help my rate?",
        a: "Yes. Documented server training (and in Texas, TABC certification specifically) is both a legal defense and a pricing credit with many carriers. Trained staff, cameras, and a written incident log all read as a well-run bar to an underwriter.",
      },
      {
        q: "How fast can I get covered and get a COI?",
        a: `Food-forward ${s.abbr} taverns under about 35% alcohol can often quote same-day. True bars usually take a few business days because a specialty market reviews the application. Either way we issue the COI the day the policy binds.`,
      },
    ],
  };
}

// ---- national (no-geo) pages -----------------------------------------------

export const NATIONAL_CONTENT: Record<string, PageContent> = {
  restaurant: {
    title: "Restaurant Insurance - Costs & Instant Quotes",
    metaDescription:
      "What restaurant insurance costs, what's required, and how to get a quote in minutes. Licensed in 24 states.",
    heroH1: "Restaurant Insurance",
    heroSub:
      "See what restaurants pay, what's required, and get your own quote in a few minutes. No spam, no obligation.",
    alsoCovers:
      "Also for pizzerias, delis, cafes, coffee shops, food counters, and quick service.",
    costNarrative: [
      "The national median for a restaurant businessowners policy (general liability + property) is about $224-251/mo. Most owners who get quoted high aren't overpaying because of where they are. They're overpaying because of how their restaurant was classified.",
      "A benchmark from our own book: a recent full-service restaurant bind came in at $1,153/yr for the BOP, and full-service tenant quotes we've run recently range from about $2,300/yr to $4,500/yr depending on state and size. Counter-service comes in under that. Heavy cooking, high alcohol, or building coverage push it up.",
    ],
    costRows: [
      {
        coverage: "Businessowners policy (BOP) - GL + property",
        range: "$150-$450/mo",
        note: "National median is about $224-251/mo. State, size, cooking, and alcohol set where you land.",
      },
      {
        coverage: "General liability only",
        range: "$70-$220/mo",
        note: "GL alone works for some counter-service spots. Most restaurants need the property side too.",
      },
      {
        coverage: "Liquor liability",
        range: "from ~$40/mo",
        note: "Priced off your % of alcohol sales and your state's dram shop law.",
      },
      {
        coverage: "Workers' compensation",
        range: "Priced on payroll",
        note: "Required in most states once you have employees. Thresholds vary by state.",
      },
    ],
    priceDrivers: [
      "Alcohol as a share of sales. Under ~35% quotes instantly with most carriers; above that it goes to an underwriter",
      "Deep frying and charbroiling rate higher than limited cooking",
      "Square footage, seating, and annual sales",
      "Insuring the building vs just your contents and improvements",
      "Construction and sprinklers. A masonry building with sprinklers rates lower than what carriers assume by default",
      "Your state. Dram shop law, wind exposure, and litigation climate all move the number",
    ],
    coverages: [
      {
        name: "General liability",
        desc: "Slip-and-falls, foodborne illness claims, damage to your rented space. Your lease almost certainly requires $1M/$2M with your landlord as additional insured.",
      },
      {
        name: "Commercial property / BPP",
        desc: "Kitchen equipment, furniture, build-out, food spoilage. Bundled with GL in a businessowners policy (BOP).",
      },
      {
        name: "Liquor liability",
        desc: "Covers claims from serving alcohol. Whether it's legally required depends on your state; whether your lease requires it usually doesn't.",
      },
      {
        name: "Business income",
        desc: "Replaces lost revenue if a fire or other covered loss shuts you down. Ask for business income coverage up to 18 months.",
      },
      {
        name: "Workers' compensation",
        desc: "Required in most states once you have employees. Priced on payroll, quoted alongside the BOP.",
      },
    ],
    stateFacts: [],
    faqs: [
      {
        q: "How much does restaurant insurance cost?",
        a: "The national median for a restaurant BOP is about $224-251/mo. From our own book: a recent full-service restaurant bind came in at $1,153/yr, and recent full-service tenant quotes range from about $2,300/yr to $4,500/yr by state and size. Counter-service comes in below that; heavy cooking, high alcohol, or building coverage push it above.",
      },
      {
        q: "What insurance is legally required for a restaurant?",
        a: "Workers' comp in most states once you have employees (thresholds vary; Texas is the one state where it's voluntary), and commercial auto if you own vehicles. General liability isn't required by law, but every commercial lease requires it, so in practice every leased restaurant carries it.",
      },
      {
        q: "What does a businessowners policy (BOP) cover?",
        a: "A BOP bundles general liability with commercial property (your equipment, furniture, build-out, food spoilage) plus business income coverage that replaces revenue if a covered loss shuts you down. It's how nearly every small restaurant buys insurance, and it's cheaper than buying the pieces separately.",
      },
      {
        q: "How fast can I get covered and get a COI?",
        a: "For most restaurants under about 35% alcohol sales we can quote same-day, and issue a COI as soon as the policy binds. Often the same day your landlord asks for it.",
      },
    ],
  },
  bar: {
    title: "Bar & Tavern Insurance - Costs & Quotes",
    metaDescription:
      "What bar insurance costs, including liquor liability and assault & battery coverage, and how to get a quote. Licensed in 24 states.",
    heroH1: "Bar & Tavern Insurance",
    heroSub:
      "See what bars pay for coverage including liquor liability, and get your own quote in a few minutes. No spam, no obligation.",
    alsoCovers:
      "Also for taverns, pubs, breweries and brewpubs, wine bars, and lounges.",
    costNarrative: [
      "Bars are among the most expensive food-and-beverage businesses to insure, and liquor liability is the reason. Nationally a bar businessowners policy averages about $276/mo, with liquor liability adding roughly $115/mo on top.",
      "The single biggest premium driver is your % of alcohol sales, followed by hours, entertainment, and security. Your state matters too: a few states impose no dram shop liability at all, while Illinois, Minnesota, and South Carolina require liquor coverage just to hold a license.",
    ],
    costRows: [
      {
        coverage: "Businessowners policy (BOP) - GL + property",
        range: "$180-$550/mo",
        note: "National bar median is about $276/mo. Hours, entertainment, and cooking set where you land.",
      },
      {
        coverage: "Liquor liability",
        range: "$80-$220/mo",
        note: "National average is about $115/mo. Scales with alcohol share, closing time, and your state's dram shop law.",
      },
      {
        coverage: "Assault & battery coverage",
        range: "Varies",
        note: "Many carriers sublimit or exclude A&B for bars. Getting it included is worth more than a cheap premium.",
      },
      {
        coverage: "Workers' compensation",
        range: "Priced on payroll",
        note: "Required in most states once you have employees.",
      },
    ],
    priceDrivers: [
      "Alcohol as a share of sales. Most standard carriers refer or decline above ~50-65%, which is why bars often need specialty markets",
      "Closing time. Past midnight and past 2 a.m. are real pricing breakpoints",
      "Live music, DJs, dancing, and security staff",
      "Food service. A real kitchen usually helps your rate",
      "Assault & battery claims history",
      "Your state's dram shop law and any statutory liquor insurance requirement",
    ],
    coverages: [
      {
        name: "Liquor liability",
        desc: "The core bar coverage. Covers claims arising from serving alcohol, which general liability excludes.",
      },
      {
        name: "General liability",
        desc: "Slip-and-falls, patron injuries, damage to your rented space. Your lease requires $1M/$2M with your landlord as additional insured.",
      },
      {
        name: "Assault & battery",
        desc: "Fights are the most common serious bar claim, and many policies sublimit or exclude them. Ask specifically what your A&B limit is.",
      },
      {
        name: "Commercial property / BPP",
        desc: "Bar build-out, equipment, inventory, TVs and sound. Bundled with GL in a BOP.",
      },
      {
        name: "Workers' compensation",
        desc: "Required in most states once you have employees. Priced on payroll.",
      },
    ],
    stateFacts: [],
    faqs: [
      {
        q: "How much does bar insurance cost?",
        a: "Nationally a bar BOP averages about $276/mo with liquor liability adding roughly $115/mo. Hours, entertainment, alcohol share, state law, and claims history set where you land. A food-forward neighborhood tavern can come in well under those averages; a late-night venue with live music comes in above them.",
      },
      {
        q: "Is liquor liability legally required?",
        a: "In a few states, yes: Illinois requires proof of dram shop coverage to hold a license, Minnesota requires liquor liability at statutory minimums, and South Carolina requires $1M for on-premises service after 5 p.m. Everywhere else it's your lease and your dram shop exposure that make it non-optional in practice.",
      },
      {
        q: "My alcohol sales are over 50%. Can I still get covered?",
        a: "Yes. Above roughly half alcohol sales most standard carriers step back, so the quote comes from specialty or surplus lines markets that write bars every day. Expect a higher rate than a restaurant pays, and a more detailed application.",
      },
      {
        q: "What is assault & battery coverage and do I need it?",
        a: "It covers injury claims arising from fights. It's the most common serious bar claim, and many policies quietly sublimit it to $25K-$100K or exclude it. Ask what your limit is before you bind, not after.",
      },
    ],
  },
  "food-truck": {
    title: "Food Truck Insurance - Costs & Quotes",
    metaDescription:
      "What food truck insurance costs, why commercial auto is the big line, and how to get a quote. Licensed in 24 states.",
    heroH1: "Food Truck Insurance",
    heroSub:
      "See what food trucks pay, what commissaries and events require, and get your own quote in a few minutes. No spam, no obligation.",
    alsoCovers: "Also for food carts, trailers, and mobile catering rigs.",
    costNarrative: [
      "Food truck insurance is really two policies. The businessowners side (liability + your equipment) is cheap, about $84/mo nationally. The commercial auto policy on the truck itself is the big line, typically adding $150-$250/mo, because the truck is both your vehicle and your kitchen.",
      "Most full-time trucks land around $300-$700/mo all-in for general liability, commercial auto, and equipment coverage. Events, commissaries, and cities will each ask for a COI naming them as additional insured, so make sure your policy includes blanket additional insureds.",
    ],
    costRows: [
      {
        coverage: "General liability + equipment (BOP)",
        range: "$70-$150/mo",
        note: "National food truck BOP median is about $84/mo.",
      },
      {
        coverage: "Commercial auto (the truck)",
        range: "$150-$250/mo",
        note: "The biggest line. Priced off the truck's value, radius, and driver records.",
      },
      {
        coverage: "All-in typical program",
        range: "$300-$700/mo",
        note: "GL + auto + equipment for a full-time operating truck.",
      },
      {
        coverage: "Workers' compensation",
        range: "Priced on payroll",
        note: "Required in most states once you have employees.",
      },
    ],
    priceDrivers: [
      "The truck: value, age, and whether it's owned or converted",
      "Driver records of everyone who drives it",
      "Operating radius and where you park overnight",
      "Cooking method. Fryers and open flame rate higher",
      "Generator and propane setup",
      "Events schedule. High-volume festival trucks carry more exposure than a fixed lunch route",
    ],
    coverages: [
      {
        name: "Commercial auto",
        desc: "Covers the truck as a vehicle: collision, liability on the road, and the permanently installed equipment. A personal auto policy will deny a food truck claim.",
      },
      {
        name: "General liability",
        desc: "Customer illness and injury claims. Every event, market, and commissary will require it, usually at $1M/$2M with additional insured status.",
      },
      {
        name: "Equipment & contents",
        desc: "Cooking equipment, generators, POS, and inventory, including while in transit.",
      },
      {
        name: "Business income",
        desc: "If the truck is your only kitchen, a breakdown or fire stops all revenue. Business income coverage bridges the downtime.",
      },
      {
        name: "Workers' compensation",
        desc: "Required in most states once you have employees. Priced on payroll.",
      },
    ],
    stateFacts: [],
    faqs: [
      {
        q: "How much does food truck insurance cost?",
        a: "Most full-time trucks pay $300-$700/mo all-in. The BOP side (liability + equipment) is about $84/mo nationally; commercial auto on the truck is the big line at $150-$250/mo. Part-time and cart operations come in under that.",
      },
      {
        q: "Doesn't my personal auto policy cover my truck?",
        a: "No. Personal auto policies exclude business use, and a food truck is a commercial vehicle with permanently installed cooking equipment. You need a commercial auto policy that covers the truck and the build-out.",
      },
      {
        q: "What insurance do events and commissaries require?",
        a: "Almost all require general liability, usually $1M per occurrence, with the event or commissary named as additional insured on a COI. A policy with blanket additional insured status lets us issue those COIs same-day instead of endorsing each one.",
      },
      {
        q: "How fast can I get covered?",
        a: "Liability can usually bind same-day. The commercial auto side takes a little longer because the truck, drivers, and build-out get reviewed. If you have an event deadline, tell us the date and we work backwards from it.",
      },
    ],
  },
  catering: {
    title: "Catering Insurance - Costs & Quotes",
    metaDescription:
      "What catering insurance costs, what venues require, and how to get a quote, including single-event coverage. Licensed in 24 states.",
    heroH1: "Catering Insurance",
    heroSub:
      "See what caterers pay, what venues require, and get your own quote in a few minutes. No spam, no obligation.",
    alsoCovers: "Also for personal chefs, meal prep businesses, and event food vendors.",
    costNarrative: [
      "Catering general liability is one of the cheaper food coverages because you don't carry a dining room full of the public every night. From our own book: a recent caterer general liability bind came in at $597/yr.",
      "The wrinkle with catering is that your certificate requirements come from other people's venues. Nearly every venue requires $1M liability with additional insured status before you can serve, many require liquor liability if you pour, and some want to see auto coverage for the delivery vehicle.",
    ],
    costRows: [
      {
        coverage: "General liability",
        range: "$40-$120/mo",
        note: "From our own book: a recent caterer GL bind came in at $597/yr.",
      },
      {
        coverage: "Liquor liability",
        range: "from ~$45/mo",
        note: "Needed if you pour at events. Many venues require it even when the client supplies the alcohol.",
      },
      {
        coverage: "Commercial auto",
        range: "$100-$200/mo",
        note: "For the van or truck that hauls food and equipment. Personal auto excludes business use.",
      },
      {
        coverage: "Workers' compensation",
        range: "Priced on payroll",
        note: "Required in most states once you have employees, including event staff.",
      },
    ],
    priceDrivers: [
      "Annual revenue and number of events",
      "Whether you pour alcohol, and whether you hire the bartenders",
      "Off-premises cooking: open flame and fryers on site rate higher",
      "Delivery vehicles and driver records",
      "Event size. Weddings and corporate events carry bigger crowds than drop-off catering",
    ],
    coverages: [
      {
        name: "General liability",
        desc: "Guest illness and injury claims, property damage at the venue. Every venue requires it, usually $1M with additional insured status.",
      },
      {
        name: "Liquor liability",
        desc: "Covers claims from serving alcohol at events. If your staff pours, you need it, in most states regardless of who bought the bottles.",
      },
      {
        name: "Commercial auto",
        desc: "The van hauling food, staff, and equipment. Personal auto policies exclude business use.",
      },
      {
        name: "Equipment & inventory",
        desc: "Chafing dishes, serving equipment, and food in transit and on site.",
      },
      {
        name: "Workers' compensation",
        desc: "Required in most states once you have employees, including part-time event staff. Priced on payroll.",
      },
    ],
    stateFacts: [],
    faqs: [
      {
        q: "How much does catering insurance cost?",
        a: "General liability for a small caterer typically runs $40-$120/mo. From our own book: a recent caterer GL bind came in at $597/yr. Liquor liability, commercial auto, and workers' comp add on top depending on how you operate.",
      },
      {
        q: "Can I get coverage for a single event?",
        a: "Yes, single-event policies exist and venues accept them. But if you cater more than a few events a year, an annual policy usually costs less than three one-day policies and covers you for every gig, including the last-minute ones.",
      },
      {
        q: "The client is buying the alcohol. Do I still need liquor liability?",
        a: "If your staff pours or serves it, yes in most states. Liability follows the service, not the receipt. Many venues require caterers to carry liquor liability whenever alcohol is present at all.",
      },
      {
        q: "What will venues require from me?",
        a: "Almost always $1M general liability with the venue named as additional insured on a COI, often liquor liability if alcohol is served, and sometimes proof of workers' comp. A policy with blanket additional insured status lets us turn those COIs around same-day.",
      },
    ],
  },
  bakery: {
    title: "Bakery Insurance - Costs & Quotes",
    metaDescription:
      "What bakery insurance costs, what coverage a bakery needs, and how to get a quote in minutes. Licensed in 24 states.",
    heroH1: "Bakery Insurance",
    heroSub:
      "See what bakeries pay, what coverage you need, and get your own quote in a few minutes. No spam, no obligation.",
    alsoCovers: "Also for coffee shops, cafes, donut shops, and dessert counters.",
    costNarrative: [
      "Bakeries are one of the cheapest food businesses to insure. Limited cooking, no alcohol, daytime hours, and small seating areas all rate well. From our own book: a recent bakery general liability bind came in at $849/yr.",
      "A full businessowners policy typically runs $100-$250/mo depending on your equipment, whether you have seating, and whether you wholesale. Commercial ovens are the underwriting question that matters most, so expect it on every application.",
    ],
    costRows: [
      {
        coverage: "Businessowners policy (BOP) - GL + property",
        range: "$100-$250/mo",
        note: "Bakeries rate near the bottom of the food category.",
      },
      {
        coverage: "General liability only",
        range: "$40-$100/mo",
        note: "From our own book: a recent bakery GL bind came in at $849/yr.",
      },
      {
        coverage: "Equipment breakdown",
        range: "Add-on",
        note: "Ovens, mixers, proofers, refrigeration. Cheap to add to a BOP and usually worth it.",
      },
      {
        coverage: "Workers' compensation",
        range: "Priced on payroll",
        note: "Required in most states once you have employees.",
      },
    ],
    priceDrivers: [
      "Commercial ovens and fire suppression",
      "Seating vs counter-only. A cafe seating area adds slip-and-fall exposure",
      "Wholesale accounts. Selling into stores adds product liability exposure",
      "Square footage and equipment value",
      "Delivery, and who drives",
    ],
    coverages: [
      {
        name: "General liability",
        desc: "Customer illness and injury claims, allergen claims, damage to your rented space. Your lease requires it with the landlord as additional insured.",
      },
      {
        name: "Commercial property / BPP",
        desc: "Ovens, mixers, display cases, refrigeration, and inventory. Bundled with GL in a BOP.",
      },
      {
        name: "Equipment breakdown",
        desc: "A dead walk-in or oven the week before a holiday is the classic bakery loss. Cheap add-on to the BOP.",
      },
      {
        name: "Business income",
        desc: "Replaces lost revenue if a covered loss shuts you down while repairs happen.",
      },
      {
        name: "Workers' compensation",
        desc: "Required in most states once you have employees. Priced on payroll.",
      },
    ],
    stateFacts: [],
    faqs: [
      {
        q: "How much does bakery insurance cost?",
        a: "A bakery BOP typically runs $100-$250/mo, and general liability alone $40-$100/mo. From our own book: a recent bakery GL bind came in at $849/yr. Seating, wholesale accounts, and equipment value move the number.",
      },
      {
        q: "I sell at farmers markets and wholesale to cafes. Am I covered?",
        a: "Tell us, because it changes the policy. Markets require COIs with additional insured status, and wholesale adds product liability exposure once your goods sell under someone else's roof. Both are routine to cover, but only if they're on the application.",
      },
      {
        q: "Do home bakers need insurance?",
        a: "If you sell under a cottage food law, homeowners insurance won't cover a customer claim. A small GL policy is inexpensive and most markets and shops that stock you will require it.",
      },
      {
        q: "How fast can I get covered and get a COI?",
        a: "Bakeries are one of the easiest food classes to quote. Most bind same-day, and we issue COIs the day the policy binds.",
      },
    ],
  },
};

// ---- lookups ----------------------------------------------------------------

export function getVertical(slug: string) {
  return VERTICALS.find((v) => v.slug === slug);
}

export function getState(slug: string) {
  return STATES.find((s) => s.slug === slug);
}

export function getStateContent(
  vertical: string,
  stateSlug: string,
): PageContent | undefined {
  const s = getState(stateSlug);
  if (!s) return undefined;
  if (vertical === "restaurant") return buildRestaurantContent(s);
  if (vertical === "bar") return buildBarContent(s);
  return undefined;
}

export function getNationalContent(vertical: string): PageContent | undefined {
  return NATIONAL_CONTENT[vertical];
}
