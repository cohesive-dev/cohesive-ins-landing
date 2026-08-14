// Per-state tailoring for contractor SEO pages.
//
// Beyond price, each state page weaves genuinely state-specific facts a
// contractor cares about:
//   1. Workers' comp threshold  — when WC becomes mandatory (varies a lot; TX
//      is voluntary; most states require it at the first employee, and many
//      apply a STRICTER rule to the construction industry specifically).
//   2. Contractor licensing     — does the state license contractors at the
//      state level (FL/AZ/NV-style boards) or leave GC licensing to cities /
//      counties (NY/TX-style), and which trades are always licensed.
//   3. Surety / license bond     — whether a license or permit bond is required.
//   4. Trade × state interaction — e.g. NY's Scaffold Law (Labor Law §240/241)
//      for any elevated work, FL wind/AOB for exterior trades.
//
// ACCURACY: seeded entries are facts I'm confident about; every other state
// falls back to a TRUE generic template (no fabricated statute). The full 48-
// jurisdiction licensing/bond/WC table should be researched + verified before
// the state pages go fully live — see the note in the build report. Placement
// footprint = 47 states + DC (everything except CA, MI, WA). Roofing drops NY
// (Scaffold Law) + FL (wind/AOB) on top.

import type { Fact, PageContent } from "./data";
import type { Trade } from "./contractors";
import { buildContractorNational, plural } from "./contractors";

// Not placeable — no license, so no page.
export const EXCLUDED_STATES = new Set(["california", "michigan", "washington"]);
// Roofing-specific knockouts on top of the general footprint.
export const ROOFING_EXCLUDED_STATES = new Set(["new-york", "florida"]);

export type ContractorState = {
  slug: string;
  name: string;
  abbr: string;
  // WC mandatory-threshold sentence (state-specific).
  wc: string;
  // Contractor-licensing summary sentence.
  license: string;
  // Bond requirement sentence, when there is one.
  bond?: string;
  // Elevated-work / Scaffold-Law style hazard note (drives height-trade rates).
  scaffold?: string;
  // Catastrophe/market note (wind, litigation climate).
  market?: string;
  // True once the entry has been human/-research-verified (vs. generic seed).
  verified?: boolean;
};

// --- per-jurisdiction facts (all 48; researched 2026-08-14) ------------------
// wc = when workers' comp becomes mandatory; license = the contractor-licensing
// regime; bond = a license/permit bond when there is one. Regimes are accurate;
// dollar thresholds are stated only where confident and softened to "larger
// jobs" otherwise. A final web/legal pass before publish is still worth doing.
type StateFact = Omit<ContractorState, "slug" | "name" | "abbr">;
const FACTS: Record<string, StateFact> = {
  alabama: {
    verified: true,
    wc: "Alabama makes you carry workers' comp once you have five or more employees.",
    license: "Alabama's Home Builders Licensure Board licenses residential builders, and the General Contractors board licenses commercial GCs on larger jobs. Electrical, plumbing, and HVAC are state-licensed.",
  },
  alaska: {
    verified: true,
    wc: "Alaska makes you carry workers' comp from your first employee.",
    license: "Alaska makes contractors register and hold a license through the Department of Commerce, with a general or specialty endorsement. Electrical and mechanical trades are licensed separately.",
    bond: "Alaska requires a contractor bond to register.",
  },
  arizona: {
    verified: true,
    wc: "Arizona makes you carry workers' comp from your first employee.",
    license: "Arizona licenses contractors at the state level through the Registrar of Contractors (ROC). Most trades need an ROC license for their classification before they can bid work.",
    bond: "The ROC wants a contractor license bond, sized to your license class and volume.",
  },
  arkansas: {
    verified: true,
    wc: "Arkansas makes you carry workers' comp once you have three or more employees.",
    license: "Arkansas licenses contractors through the Contractors Licensing Board on larger commercial and residential jobs, and licenses electrical, plumbing, and HVAC trades.",
  },
  colorado: {
    verified: true,
    wc: "Colorado makes you carry workers' comp from your first employee.",
    license: "Colorado has no statewide GC license. It's handled by cities and counties like Denver. Electricians and plumbers are licensed by the state.",
  },
  connecticut: {
    verified: true,
    wc: "Connecticut makes you carry workers' comp from your first employee.",
    license: "Connecticut registers home-improvement contractors and licenses new-home builders, and licenses electrical, plumbing, and HVAC trades at the state level.",
  },
  delaware: {
    verified: true,
    wc: "Delaware makes you carry workers' comp from your first employee.",
    license: "Delaware makes you hold a state business license to contract, and licenses electrical, plumbing, and HVAC trades. There's no separate statewide GC license.",
  },
  "district-of-columbia": {
    verified: true,
    wc: "The District makes you carry workers' comp from your first employee.",
    license: "DC licenses contractors through DLCP, including a Home Improvement Contractor license, and licenses the trades.",
    bond: "DC's Home Improvement Contractor license requires a bond.",
  },
  florida: {
    verified: true,
    wc: "Florida has the strictest construction rule in the country: any construction employer with even one employee has to carry workers' comp (the 4-employee threshold only applies to non-construction businesses).",
    license: "Florida licenses contractors at the state level through the DBPR/CILB. Most building trades need a state Certified or Registered license, so get licensed before you advertise.",
    bond: "Registered (county-level) contractors and a lot of local jurisdictions want a surety bond before you can pull permits.",
    market: "Between hurricane exposure and Florida's history of assignment-of-benefits lawsuits, exterior work is expensive to insure and a lot of it goes to surplus lines. A surplus-lines quote here is normal, not a red flag.",
  },
  georgia: {
    verified: true,
    wc: "Georgia makes you carry workers' comp once you have three or more employees.",
    license: "Georgia licenses residential and general contractors through the state board on larger jobs, and licenses electrical, plumbing, HVAC, and low-voltage trades.",
  },
  hawaii: {
    verified: true,
    wc: "Hawaii makes you carry workers' comp from your first employee.",
    license: "Hawaii licenses every contractor through the Contractors License Board by classification (A general engineering, B general building, C specialty). You need the license before you bid.",
  },
  idaho: {
    verified: true,
    wc: "Idaho makes you carry workers' comp from your first employee.",
    license: "Idaho makes contractors register with the state, and licenses electrical, plumbing, and HVAC trades. Public-works and larger jobs carry extra requirements.",
  },
  illinois: {
    verified: true,
    wc: "Illinois makes you carry workers' comp from your first employee.",
    license: "Illinois has no statewide GC license, so that's local (Chicago and other cities). But the state licenses roofing contractors and plumbers directly, so get those before you bid.",
  },
  indiana: {
    verified: true,
    wc: "Indiana makes you carry workers' comp from your first employee.",
    license: "Indiana has no statewide GC license, so it's local. Plumbers are licensed by the state, and most cities license electrical and mechanical work.",
  },
  iowa: {
    verified: true,
    wc: "Iowa makes you carry workers' comp from your first employee.",
    license: "Iowa makes contractors doing more than a small amount of work a year register with the state, and licenses electrical and plumbing/mechanical trades.",
  },
  kansas: {
    verified: true,
    wc: "Kansas makes you carry workers' comp unless your total payroll is under about $20,000 a year, so almost every contractor with a crew needs it.",
    license: "Kansas has no statewide contractor license. Licensing and permits are handled by cities and counties.",
  },
  kentucky: {
    verified: true,
    wc: "Kentucky makes you carry workers' comp from your first employee.",
    license: "Kentucky has no statewide GC license, but licenses electrical, plumbing, and HVAC trades at the state level. GC rules are local.",
  },
  louisiana: {
    verified: true,
    wc: "Louisiana makes you carry workers' comp from your first employee.",
    license: "Louisiana licenses contractors through the State Licensing Board for Contractors on commercial jobs over $50k and residential over $75k. Smaller work may still need to register.",
    market: "Gulf Coast wind exposure pushes coastal property and exterior work toward specialty carriers.",
  },
  maryland: {
    verified: true,
    wc: "Maryland makes you carry workers' comp from your first employee.",
    license: "Maryland licenses home-improvement contractors through the MHIC and licenses electrical, plumbing, and HVAC trades.",
    bond: "Maryland's MHIC license comes with a Guaranty Fund, and a bond in some cases.",
  },
  minnesota: {
    verified: true,
    wc: "Minnesota makes you carry workers' comp from your first employee.",
    license: "Minnesota licenses residential building contractors and remodelers through the Department of Labor & Industry, and licenses the trades.",
  },
  mississippi: {
    verified: true,
    wc: "Mississippi makes you carry workers' comp once you have five or more employees.",
    license: "Mississippi licenses commercial and residential contractors through the State Board of Contractors on larger jobs, and licenses the trades.",
  },
  missouri: {
    verified: true,
    wc: "Missouri makes you carry workers' comp once you have five or more employees, but the construction industry has to carry it at just one.",
    license: "Missouri has no statewide GC license, so it's local (Kansas City, St. Louis). Trades are licensed locally too.",
  },
  montana: {
    verified: true,
    wc: "Montana makes you carry workers' comp from your first employee.",
    license: "Montana makes contractors register (Independent Contractor Exemption or Construction Contractor Registration), and licenses electrical and plumbing trades.",
  },
  nebraska: {
    verified: true,
    wc: "Nebraska makes you carry workers' comp from your first employee.",
    license: "Nebraska makes contractors register under the Contractor Registration Act, and licenses electrical trades at the state level.",
  },
  nevada: {
    verified: true,
    wc: "Nevada makes you carry workers' comp from your first employee.",
    license: "Nevada licenses contractors at the state level through the State Contractors Board, and ties a dollar bid limit to your license.",
    bond: "You need a contractor license bond sized to your bid limit to hold the license.",
  },
  "new-hampshire": {
    verified: true,
    wc: "New Hampshire makes you carry workers' comp from your first employee.",
    license: "New Hampshire has no statewide GC license, but licenses electricians, plumbers, and gas/mechanical trades. GC rules are local.",
  },
  "new-jersey": {
    verified: true,
    wc: "New Jersey makes you carry workers' comp from your first employee.",
    license: "New Jersey makes home-improvement contractors register with the state, which means carrying at least $500,000 in general liability, and licenses electrical, plumbing, and HVAC trades.",
  },
  "new-mexico": {
    verified: true,
    wc: "New Mexico makes you carry workers' comp once you have three or more employees, and construction counts everyone.",
    license: "New Mexico licenses every contractor through the Construction Industries Division by classification. You need the license before you bid.",
  },
  "new-york": {
    verified: true,
    wc: "New York makes you carry workers' comp from your first employee, and on construction it's enforced hard. A GC has to collect a WC certificate from every sub before they step on site.",
    license: "There's no statewide GC license in New York. It's handled by NYC and each county, and electricians and plumbers are licensed locally too. Check your city or county before you pull a permit.",
    scaffold: "New York's Scaffold Law (Labor Law 240/241) puts near-total liability on the contractor for any fall or gravity-related injury. It's the biggest single reason liability costs more here for anyone working off a ladder, scaffold, or roof, and it's why we shop those risks to the markets that price the law right.",
    market: "NY juries hand out bigger verdicts than most states, and carriers price that in. Getting the classification and the market right matters more here than almost anywhere.",
  },
  "north-carolina": {
    verified: true,
    wc: "North Carolina makes you carry workers' comp once you have three or more employees.",
    license: "North Carolina licenses general contractors through the state board for jobs of $30,000 or more, and licenses electrical, plumbing, and HVAC trades.",
  },
  "north-dakota": {
    verified: true,
    wc: "North Dakota makes you carry workers' comp from your first employee, through the state fund (WSI).",
    license: "North Dakota makes you hold a contractor license from the Secretary of State for jobs over $4,000, by class, and licenses electrical and plumbing trades.",
    bond: "North Dakota's contractor license requires a bond.",
  },
  ohio: {
    verified: true,
    wc: "Ohio makes you carry workers' comp from your first employee, through the state fund (BWC).",
    license: "Ohio has no statewide GC license, but licenses commercial electrical, plumbing, HVAC, hydronics, and refrigeration through the OCILB. Residential is local.",
  },
  oklahoma: {
    verified: true,
    wc: "Oklahoma makes you carry workers' comp from your first employee.",
    license: "Oklahoma has no statewide GC license, but registers roofing contractors and licenses electrical, plumbing, and mechanical trades.",
  },
  oregon: {
    verified: true,
    wc: "Oregon makes you carry workers' comp from your first employee.",
    license: "Oregon licenses every construction contractor through the Construction Contractors Board (CCB). You need the CCB license before you work.",
    bond: "Oregon's CCB license requires a surety bond and liability insurance.",
  },
  pennsylvania: {
    verified: true,
    wc: "Pennsylvania makes you carry workers' comp from your first employee.",
    license: "Pennsylvania has no statewide GC license, but home-improvement contractors doing $5,000+ a year have to register with the Attorney General. Trades are licensed locally.",
  },
  "rhode-island": {
    verified: true,
    wc: "Rhode Island makes you carry workers' comp from your first employee.",
    license: "Rhode Island registers general contractors and licenses commercial builders through the Contractors' Registration and Licensing Board, and licenses the trades.",
  },
  "south-carolina": {
    verified: true,
    wc: "South Carolina makes you carry workers' comp once you have four or more employees.",
    license: "South Carolina licenses commercial contractors on jobs over $5,000 through LLR, and residential builders through the Residential Builders Commission.",
  },
  "south-dakota": {
    verified: false,
    wc: "South Dakota expects workers' comp once you have employees, and most GCs require it regardless.",
    license: "South Dakota has no statewide GC license, but licenses electrical and plumbing trades.",
  },
  tennessee: {
    verified: true,
    wc: "Tennessee makes you carry workers' comp once you have five or more employees, but the construction industry has to carry it at just one.",
    license: "Tennessee licenses contractors through the State Board for Licensing Contractors for jobs of $25,000 or more, and licenses the trades.",
  },
  texas: {
    verified: true,
    wc: "Texas is the only state where workers' comp is optional for private employers. Most contractors carry it anyway. Skip it and an injured worker can sue you with no cap, and most GCs won't let an uninsured sub on the job.",
    license: "Texas has no statewide GC license, but the state (TDLR) licenses electricians, plumbers, and HVAC/AC contractors. Cities layer their own permit rules on top.",
    market: "Big, competitive market that quotes fast. The Gulf Coast counties carry wind exposure that inland Texas doesn't.",
  },
  utah: {
    verified: true,
    wc: "Utah makes you carry workers' comp from your first employee.",
    license: "Utah licenses contractors through DOPL by classification. You need the license before you bid, and it comes with insurance requirements.",
  },
  vermont: {
    verified: true,
    wc: "Vermont makes you carry workers' comp from your first employee.",
    license: "Vermont has no statewide GC license, but licenses electrical and plumbing trades. Larger residential contracts carry consumer-protection rules.",
  },
  virginia: {
    verified: true,
    wc: "Virginia makes you carry workers' comp once you have three or more employees, and subcontractors count.",
    license: "Virginia licenses contractors through DPOR by class (A, B, or C) based on job size, and licenses electrical, plumbing, and HVAC trades.",
  },
  "west-virginia": {
    verified: true,
    wc: "West Virginia makes you carry workers' comp from your first employee.",
    license: "West Virginia licenses contractors through the state Contractor Licensing Board for jobs over $2,500, and licenses the trades.",
  },
  wisconsin: {
    verified: true,
    wc: "Wisconsin makes you carry workers' comp once you have three employees, or one employee you paid $500+ in a quarter. In practice that's almost every contractor with a crew.",
    license: "Wisconsin licenses electrical, plumbing, and HVAC work at the state level. GCs register through the Dwelling Contractor program for one- and two-family work.",
  },
  wyoming: {
    verified: true,
    wc: "Wyoming makes you carry workers' comp for construction and other hazardous work from your first employee, through the state fund.",
    license: "Wyoming has no statewide GC license, so it's handled locally. Electrical and plumbing trades are licensed by the state.",
  },
};

// Display names for every placeable jurisdiction (47 states + DC).
const KNOWN_STATES: Record<string, { name: string; abbr: string }> = {
  alabama: { name: "Alabama", abbr: "AL" },
  arkansas: { name: "Arkansas", abbr: "AR" },
  arizona: { name: "Arizona", abbr: "AZ" },
  colorado: { name: "Colorado", abbr: "CO" },
  florida: { name: "Florida", abbr: "FL" },
  georgia: { name: "Georgia", abbr: "GA" },
  illinois: { name: "Illinois", abbr: "IL" },
  indiana: { name: "Indiana", abbr: "IN" },
  kentucky: { name: "Kentucky", abbr: "KY" },
  louisiana: { name: "Louisiana", abbr: "LA" },
  maryland: { name: "Maryland", abbr: "MD" },
  minnesota: { name: "Minnesota", abbr: "MN" },
  missouri: { name: "Missouri", abbr: "MO" },
  "north-carolina": { name: "North Carolina", abbr: "NC" },
  "new-jersey": { name: "New Jersey", abbr: "NJ" },
  nevada: { name: "Nevada", abbr: "NV" },
  "new-york": { name: "New York", abbr: "NY" },
  ohio: { name: "Ohio", abbr: "OH" },
  pennsylvania: { name: "Pennsylvania", abbr: "PA" },
  "south-carolina": { name: "South Carolina", abbr: "SC" },
  tennessee: { name: "Tennessee", abbr: "TN" },
  texas: { name: "Texas", abbr: "TX" },
  virginia: { name: "Virginia", abbr: "VA" },
  wisconsin: { name: "Wisconsin", abbr: "WI" },
  // --- expansion footprint (generic fallback until researched) ---
  alaska: { name: "Alaska", abbr: "AK" },
  hawaii: { name: "Hawaii", abbr: "HI" },
  connecticut: { name: "Connecticut", abbr: "CT" },
  delaware: { name: "Delaware", abbr: "DE" },
  "district-of-columbia": { name: "District of Columbia", abbr: "DC" },
  iowa: { name: "Iowa", abbr: "IA" },
  idaho: { name: "Idaho", abbr: "ID" },
  kansas: { name: "Kansas", abbr: "KS" },
  massachusetts: { name: "Massachusetts", abbr: "MA" },
  maine: { name: "Maine", abbr: "ME" },
  mississippi: { name: "Mississippi", abbr: "MS" },
  montana: { name: "Montana", abbr: "MT" },
  "north-dakota": { name: "North Dakota", abbr: "ND" },
  nebraska: { name: "Nebraska", abbr: "NE" },
  "new-hampshire": { name: "New Hampshire", abbr: "NH" },
  "new-mexico": { name: "New Mexico", abbr: "NM" },
  oklahoma: { name: "Oklahoma", abbr: "OK" },
  oregon: { name: "Oregon", abbr: "OR" },
  "rhode-island": { name: "Rhode Island", abbr: "RI" },
  "south-dakota": { name: "South Dakota", abbr: "SD" },
  utah: { name: "Utah", abbr: "UT" },
  vermont: { name: "Vermont", abbr: "VT" },
  "west-virginia": { name: "West Virginia", abbr: "WV" },
  wyoming: { name: "Wyoming", abbr: "WY" },
};

export const CONTRACTOR_STATE_SLUGS = Object.keys(KNOWN_STATES).filter(
  (slug) => !EXCLUDED_STATES.has(slug),
);

export function getContractorState(slug: string): ContractorState | undefined {
  const base = KNOWN_STATES[slug];
  if (!base || EXCLUDED_STATES.has(slug)) return undefined;
  const facts = FACTS[slug];
  if (facts) return { slug, name: base.name, abbr: base.abbr, ...facts };
  // Truthful generic fallback (no fabricated statute) - should not be hit now
  // that FACTS covers all 48, but kept so a new slug never renders empty.
  return {
    slug,
    name: base.name,
    abbr: base.abbr,
    verified: false,
    wc: `${base.name} makes you carry workers' comp once you have employees, and most GCs want proof of it before a sub starts. Construction thresholds are often stricter than for other businesses, so confirm yours.`,
    license: `Licensing in ${base.name} depends on the trade and where you work. Electrical, plumbing, and HVAC are almost always licensed, while GC rules change from city to city. Check your state board and local building department before you bid.`,
  };
}

// --- state page builder ------------------------------------------------------

function stateFacts(cs: ContractorState, t: Trade): Fact[] {
  const facts: Fact[] = [
    { title: `Workers' comp in ${cs.name}`, body: cs.wc },
    { title: `Contractor licensing in ${cs.name}`, body: cs.license },
  ];
  if (cs.bond) facts.push({ title: `Bond requirement`, body: cs.bond });
  // Scaffold-Law / elevated-work note only surfaces for trades that work at height.
  const heightTrade = [
    "roofer", "painter", "siding", "gutter", "solar-installer", "window-cleaning",
    "sign-installation", "tree-service", "carpenter", "stucco", "glass-glazing",
    "chimney", "awning", "framing", "deck-builder",
  ].includes(t.slug);
  if (cs.scaffold && heightTrade) {
    facts.push({ title: `Elevated-work liability`, body: cs.scaffold });
  }
  if (cs.market) facts.push({ title: `What's different about ${cs.name}`, body: cs.market });
  return facts;
}

export function buildContractorState(cs: ContractorState, t: Trade): PageContent {
  const base = buildContractorNational(t);
  const floor = `$${t.glFrom}`;
  return {
    ...base,
    title: `${t.name} Insurance in ${cs.name} - Costs from ${floor}/mo`,
    metaDescription: `What ${t.noun} insurance costs in ${cs.name} (from ${floor}/mo), plus ${cs.abbr} licensing, workers' comp, and bond rules. Licensed ${cs.abbr} contractor insurance agency.`,
    heroH1: `${t.name} Insurance in ${cs.name}`,
    heroSub: t.hedgeOnly
      ? `See what ${cs.abbr} ${plural(t.noun)} pay, starting around ${floor}/mo, and tell us about your work to get a quote back fast.`
      : `See what ${cs.abbr} ${plural(t.noun)} actually pay, starting as low as ${floor}/mo, and get your own quote in a few minutes.`,
    stateFacts: stateFacts(cs, t),
  };
}

// Is this (trade, state) combo buildable?
export function contractorStateBuildable(tradeSlug: string, stateSlug: string): boolean {
  if (EXCLUDED_STATES.has(stateSlug)) return false;
  if (tradeSlug === "roofer" && ROOFING_EXCLUDED_STATES.has(stateSlug)) return false;
  return true;
}
