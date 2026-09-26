import type { Fact } from "./data";
import { STATE_CODES } from "@/lib/licenses";

// State-specific restaurant facts (Kevin 2026-09-26: 'the state and city version is very important').
//
// 1. Our own lowest restaurant QUOTE per state, from the CRM, labelled as a quote and by line of
//    business (the headline price stays the lowest national BIND - see restaurant-prices.ts).
//    Property-only and umbrella quotes are excluded: they are not comparable to a restaurant policy.
// 2. Workers' comp rule and liquor-licensing agency for the 23 licensed states that data.ts does not
//    profile. Each is sourced to the state's official agency. Liquor is stated as WHO licenses, not
//    as a characterisation of dram shop law, which was not verified for these states.
export const STATE_QUOTES_AS_OF = "2026-09-26";

export const STATE_RESTAURANT_QUOTES: Record<string, { usd: number; line: string; n: number }> = {
  "GA": {
    "usd": 1815,
    "line": "liability + property",
    "n": 7
  },
  "MN": {
    "usd": 927,
    "line": "general liability",
    "n": 12
  },
  "LA": {
    "usd": 932,
    "line": "general liability",
    "n": 6
  },
  "TX": {
    "usd": 1062,
    "line": "general liability",
    "n": 16
  },
  "AR": {
    "usd": 1937,
    "line": "general liability",
    "n": 7
  },
  "OH": {
    "usd": 1343,
    "line": "general liability",
    "n": 10
  },
  "KY": {
    "usd": 965,
    "line": "general liability",
    "n": 5
  },
  "MI": {
    "usd": 2960,
    "line": "businessowners policy (liability + property)",
    "n": 6
  },
  "PA": {
    "usd": 4847,
    "line": "liability + property",
    "n": 4
  },
  "NY": {
    "usd": 1814,
    "line": "general liability",
    "n": 13
  },
  "AZ": {
    "usd": 3755,
    "line": "liability + property",
    "n": 3
  },
  "FL": {
    "usd": 2078,
    "line": "general liability",
    "n": 5
  },
  "IL": {
    "usd": 2577,
    "line": "liability + property",
    "n": 4
  },
  "OR": {
    "usd": 550,
    "line": "general liability",
    "n": 12
  },
  "SC": {
    "usd": 1639,
    "line": "liability + property",
    "n": 3
  },
  "OK": {
    "usd": 2700,
    "line": "liability + property",
    "n": 1
  },
  "NH": {
    "usd": 3636,
    "line": "liability + property",
    "n": 1
  },
  "IN": {
    "usd": 2296,
    "line": "liability + property",
    "n": 2
  },
  "NC": {
    "usd": 934,
    "line": "general liability",
    "n": 9
  },
  "UT": {
    "usd": 1549,
    "line": "liability + property",
    "n": 1
  },
  "MO": {
    "usd": 1897,
    "line": "general liability",
    "n": 2
  },
  "WI": {
    "usd": 2260,
    "line": "liability + property",
    "n": 4
  },
  "IA": {
    "usd": 1812,
    "line": "liability + property",
    "n": 4
  },
  "TN": {
    "usd": 2747,
    "line": "liability + property",
    "n": 6
  },
  "NJ": {
    "usd": 1630,
    "line": "general liability",
    "n": 8
  },
  "AL": {
    "usd": 1533,
    "line": "general liability",
    "n": 11
  },
  "MA": {
    "usd": 2249,
    "line": "liability + property",
    "n": 3
  },
  "ID": {
    "usd": 700,
    "line": "general liability",
    "n": 5
  }
};

type Src = { label: string; href: string };
export const EXTRA_STATE_FACTS: Record<string, { wc: string; wcSrc: Src; liquor: Src }> = {
  "alaska": { wc: "Alaska requires workers' comp for any employee, including part-time.", wcSrc: { label: "Alaska Division of Workers' Compensation", href: "https://labor.alaska.gov/wc/" }, liquor: { label: "Alcohol & Marijuana Control Office", href: "https://www.commerce.alaska.gov/web/amco/" } },
  "connecticut": { wc: "Connecticut requires workers' comp for any employee, including part-time.", wcSrc: { label: "Connecticut Workers' Compensation Commission", href: "https://portal.ct.gov/wcc" }, liquor: { label: "Department of Consumer Protection, Liquor Control Division", href: "https://portal.ct.gov/dcp/liquor-control-division/liquor-control" } },
  "delaware": { wc: "Delaware requires workers' comp for any employee, including part-time.", wcSrc: { label: "Delaware Office of Workers' Compensation", href: "https://labor.delaware.gov/divisions/industrial-affairs/workers-compensation/" }, liquor: { label: "Office of the Alcoholic Beverage Control Commissioner", href: "https://oabcc.delaware.gov/" } },
  "hawaii": { wc: "Hawaii requires workers' comp for any employee, including part-time.", wcSrc: { label: "Hawaii Disability Compensation Division", href: "https://labor.hawaii.gov/dcd/" }, liquor: { label: "Honolulu Liquor Commission (licenses are issued by county liquor commissions)", href: "https://www.honolulu.gov/liq/" } },
  "idaho": { wc: "Idaho requires workers' comp for any employee, including part-time.", wcSrc: { label: "Idaho Industrial Commission", href: "https://iic.idaho.gov/" }, liquor: { label: "Idaho State Police, Alcohol Beverage Control", href: "https://isp.idaho.gov/abc/" } },
  "iowa": { wc: "Iowa requires workers' comp for any employee, including part-time.", wcSrc: { label: "Iowa Division of Workers' Compensation", href: "https://dial.iowa.gov/hearings/workers-comp" }, liquor: { label: "Iowa Department of Revenue, Alcohol", href: "https://revenue.iowa.gov/permits-licensing/alcohol" } },
  "kansas": { wc: "Kansas requires workers' comp once your total annual payroll exceeds $20,000, counting wages paid inside and outside Kansas.", wcSrc: { label: "Kansas Department of Labor, Workers Compensation", href: "https://www.dol.ks.gov/workers-compensation/overview" }, liquor: { label: "Kansas Alcoholic Beverage Control", href: "https://www.ksrevenue.gov/abcmain.html" } },
  "maine": { wc: "Maine generally requires workers' comp for any employee, with limited exemptions.", wcSrc: { label: "Maine Workers' Compensation Board", href: "https://www.maine.gov/wcb/" }, liquor: { label: "Bureau of Alcoholic Beverages and Lottery Operations", href: "https://www.maine.gov/dafs/bablo/" } },
  "massachusetts": { wc: "Massachusetts requires workers' comp for any employee, including part-time.", wcSrc: { label: "Massachusetts Department of Industrial Accidents", href: "https://www.mass.gov/orgs/department-of-industrial-accidents" }, liquor: { label: "Alcoholic Beverages Control Commission (local licensing boards issue on-premises licenses)", href: "https://www.mass.gov/orgs/alcoholic-beverages-control-commission" } },
  "mississippi": { wc: "Mississippi requires workers' comp once you regularly employ 5 or more people. Below that it's optional.", wcSrc: { label: "Mississippi Workers' Compensation Commission", href: "https://www.mwcc.ms.gov/" }, liquor: { label: "Mississippi Department of Revenue, Alcoholic Beverage Control", href: "https://www.dor.ms.gov/abc" } },
  "montana": { wc: "Montana requires workers' comp for any employee, including part-time.", wcSrc: { label: "Montana Employment Relations Division", href: "https://erd.dli.mt.gov/" }, liquor: { label: "Montana Department of Revenue, Alcoholic Beverage Control", href: "https://revenue.mt.gov/alcoholic-beverage-control/" } },
  "nebraska": { wc: "Nebraska requires workers' comp for any employee, including part-time.", wcSrc: { label: "Nebraska Workers' Compensation Court", href: "https://www.newcc.gov/" }, liquor: { label: "Nebraska Liquor Control Commission", href: "https://lcc.nebraska.gov/" } },
  "new-hampshire": { wc: "New Hampshire requires workers' comp for any employee, including part-time.", wcSrc: { label: "New Hampshire Department of Labor, Workers' Compensation", href: "https://www.dol.nh.gov/workers-compensation/employer-information" }, liquor: { label: "New Hampshire Liquor Commission, Enforcement & Licensing", href: "https://www.enforcement.liquor.nh.gov/licensing" } },
  "new-mexico": { wc: "New Mexico requires workers' comp once you have 3 or more workers, and owners and part-timers count toward the three.", wcSrc: { label: "New Mexico Workers' Compensation Administration", href: "https://www.workerscomp.nm.gov/faqs/" }, liquor: { label: "New Mexico Alcoholic Beverage Control Division", href: "https://www.rld.nm.gov/alcoholic-beverage-control/" } },
  "north-dakota": { wc: "North Dakota requires workers' comp for every employee, and it can only be bought from the state fund, Workforce Safety & Insurance. Private insurers can't sell it, so it sits outside your restaurant package.", wcSrc: { label: "North Dakota Workforce Safety & Insurance", href: "https://www.workforcesafety.com/employers/insurance-coverage-information/coverage-requirements" }, liquor: { label: "North Dakota Attorney General, Retail Alcoholic Beverage License", href: "https://attorneygeneral.nd.gov/licensing-and-gaming/licensing/retail-alcoholic-beverage-license" } },
  "oklahoma": { wc: "Oklahoma generally requires workers' comp once you have employees; some small family and agricultural employers are exempt.", wcSrc: { label: "Oklahoma Workers' Compensation Commission", href: "https://oklahoma.gov/workers--compensation-commission--0865-.html" }, liquor: { label: "Oklahoma ABLE Commission", href: "https://oklahoma.gov/able-commission.html" } },
  "oregon": { wc: "Oregon requires workers' comp for any employee, including part-time.", wcSrc: { label: "Oregon Workers' Compensation Division", href: "https://wcd.oregon.gov/" }, liquor: { label: "Oregon Liquor and Cannabis Commission", href: "https://www.oregon.gov/olcc/" } },
  "rhode-island": { wc: "Rhode Island requires workers' comp for any employee, including part-time.", wcSrc: { label: "Rhode Island Department of Labor and Training", href: "https://dlt.ri.gov/workers-compensation/employers" }, liquor: { label: "Rhode Island Department of Business Regulation (restaurant liquor licenses are issued by the city or town)", href: "https://dbr.ri.gov/real-estate-and-commercial-licensing/liquor" } },
  "south-dakota": { wc: "South Dakota requires workers' comp for any employee, including part-time.", wcSrc: { label: "South Dakota Department of Labor and Regulation, Workers' Compensation", href: "https://dlr.sd.gov/workers_compensation/" }, liquor: { label: "South Dakota Department of Revenue, Alcohol", href: "https://dor.sd.gov/businesses/taxes/alcohol/" } },
  "utah": { wc: "Utah requires workers' comp for any employee, including part-time.", wcSrc: { label: "Utah Labor Commission", href: "https://laborcommission.utah.gov/" }, liquor: { label: "Utah Department of Alcoholic Beverage Services", href: "https://abs.utah.gov/" } },
  "vermont": { wc: "Vermont requires workers' comp for any employee, including part-time.", wcSrc: { label: "Vermont Department of Labor, Workers' Compensation", href: "https://labor.vermont.gov/workers-compensation" }, liquor: { label: "Vermont Division of Liquor Control", href: "https://liquorcontrol.vermont.gov/" } },
  "west-virginia": { wc: "West Virginia requires workers' comp for any employee, including part-time.", wcSrc: { label: "West Virginia Offices of the Insurance Commissioner", href: "https://www.wvinsurance.gov/" }, liquor: { label: "West Virginia Alcohol Beverage Control Administration", href: "https://abca.wv.gov/" } },
  "wyoming": { wc: "Wyoming requires workers' comp for employments its statute lists as extrahazardous, and it can only be bought from the state fund run by the Department of Workforce Services. Check how your restaurant is classified before assuming it's optional.", wcSrc: { label: "Wyoming Department of Workforce Services, Workers' Compensation", href: "https://dws.wyo.gov/dws-division/workers-compensation/employers/" }, liquor: { label: "Wyoming Liquor Division (local governments issue retail licenses)", href: "https://www.wyoliquor.com/" } },
};

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

export function stateQuote(stateName: string) {
  const code = STATE_CODES[stateName];
  return code ? STATE_RESTAURANT_QUOTES[code] : undefined;
}

// A cost-table row for the state's own lowest restaurant quote, labelled as a quote.
export function stateQuoteRow(stateName: string) {
  const q = stateQuote(stateName);
  if (!q) return [];
  return [{
    coverage: `${stateName} restaurant quote (quote, not bound)`,
    range: `from ${usd(q.usd)}/yr`,
    note: `Our lowest ${stateName} restaurant quote, for ${q.line}, out of ${q.n} we have written there as of ${STATE_QUOTES_AS_OF}.`,
  }];
}

export function stateQuoteFact(stateName: string): Fact[] {
  const q = stateQuote(stateName);
  if (!q) return [];
  return [{
    title: `What we've quoted restaurants in ${stateName}`,
    body: `Our lowest ${stateName} restaurant quote is ${usd(q.usd)} a year for ${q.line}, out of ${q.n} ${stateName} restaurant quotes we have written. It's a quote, not a bound policy, and your number depends on your own menu, sales, payroll and property.`,
  }];
}

export function extraWcFact(stateSlug: string, stateName: string): Fact[] {
  const f = EXTRA_STATE_FACTS[stateSlug];
  return f ? [{ title: `Workers' comp in ${stateName}`, body: f.wc, source: f.wcSrc }] : [];
}

export function extraLiquorFact(stateSlug: string, stateName: string): Fact[] {
  const f = EXTRA_STATE_FACTS[stateSlug];
  return f ? [{
    title: `Who licenses alcohol in ${stateName}`,
    body: `${f.liquor.label} handles liquor licensing. If you serve alcohol, liquor liability is priced off your share of alcohol sales, and most leases require it.`,
    source: f.liquor,
  }] : [];
}
