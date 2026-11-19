import { withConstructionHazardReview } from "./construction-hazard-review";
import { swimmingPoolContent } from "./swimming-pool-content";
// Contractor / trades programmatic-SEO content engine.
//
// Parallel to the restaurant/bar builders in ./data.ts, but data-driven: every
// trade is one row in TRADES, and buildContractorNational() composes a full
// PageContent from it. National pages need no per-state facts and ship first;
// state pages (48 licensed jurisdictions) get layered on once the per-state
// contractor licensing/bond/WC facts are researched.
//
// PRICING DOCTRINE (operator, 2026-08-14): lead with the real LOW END of our own
// book, framed "from / as low as $X/mo" — the starting premium a small owner-op
// with little/no payroll actually gets at $1M/$2M. It must be a number a prospect
// will really see at quote time; a floor lower than we can deliver bait-and-
// switches at quote and is the GBL §349 exposure. Floors marked `realAnnual` are
// anchored to genuine Foxquilt/Blitz binds (painter $725, GC $1,283, handyman
// $1,309, siding $1,523, tree $1,779, janitorial $500, flooring $886, carpentry
// $1,263); the rest are realistic small-op minimums to be firmed up as we bind
// more. Still the lowest honest number, so a prospect paying more feels overpriced
// without us publishing a fake "typical."
//
// SUPERSEDED 2026-10-02: glFrom/bopFrom/realAnnual are no longer published. A page shows
// only the labelled real price in trade-prices.ts, or no number (finalizeTradePricing).

import type { PageContent } from "./data";
import { TRADE_PRICE_CLOSED_STATES, TREE_BOUND_GL_COMPARABLE, tradePrice, withTradePrice, withoutPrice } from "./trade-prices";

export type Trade = {
  slug: string;
  name: string; // Title Case display name
  // The name used in <title> when searchers use different words than the display name
  // (2026-10-16: "snow plowing insurance <state>" was the top snow query, 82 impressions at ~27).
  titleName?: string;
  intakeLabel?: string; // Preserve an established intake value when display wording changes.
  noun: string; // lowercase noun for sentences ("an electrician's business")
  // New or narrow demand can prove itself on a national page before the site
  // creates dozens of state variants with too little distinct evidence.
  nationalOnly?: boolean;
  // The intake is accepted, but the exact carrier class/market needs a human
  // review before the page can promise an instant path.
  requiresReview?: boolean;
  // Monthly starting FLOORS shown as "from $X/mo".
  glFrom: number; // general liability only, cheapest owner-op
  bopFrom?: number; // GL + tools/property bundle (omit for pure-service trades)
  // True = high-hazard class that usually routes to a specialty/E&S market
  // (roofing, tree, excavation, demo). Changes the market note + COI-speed copy.
  esRoute?: boolean;
  // True = NO instant-quote class in our contractor programs; placed by hand
  // through our E&S wholesale desk (Hedge). No quote button; "our team quotes
  // it" CTA. Restoration, mold, and a few others sit here (verified 2026-08-14).
  hedgeOnly?: boolean;
  // Real own-book annual premium (from a genuine Foxquilt/Blitz quote or bind),
  // if we have one — used to anchor the lowball floor to a substantiated number
  // instead of generic market data. Monthly floor = round(realAnnual/12).
  realAnnual?: number;
  // Needs professional liability / E&O rather than (or on top of) GL.
  needsEO?: boolean;
  alsoCovers?: string;
  // Extra, trade-specific price drivers appended to the shared spine.
  driversExtra?: string[];
  // Trade-specific questions searchers ask, shown in the visible FAQ (and its FAQPage markup) after the
  // shared ones. Plain facts about coverage structure only; no prices unless they come from trade-prices.ts.
  faqExtra?: { q: string; a: string }[];
  // The class-of-business chip(s) for the embedded QuoteSplash handoff. Foxquilt
  // provider uses the profession label AS the id. Numeric ids are Next COB
  // codes. Left as the label where the exact code still needs confirmation
  // against the carrier class list before the instant-quote button is trusted.
  cobs: { label: string; id: string }[];
};

const money = (v: number) => `$${v.toLocaleString("en-US")}`;
// "a" / "an" by the noun's first sound, and simple pluralization so template
// strings read like English ("an electrician", "cleaning businesses").
const an = (w: string) => (/^[aeiou]/i.test(w) ? "an" : "a");
export const plural = (w: string) =>
  /man$/i.test(w)
    ? `${w.slice(0, -3)}men`
    : /(s|sh|ch|x)$/i.test(w)
      ? `${w}es`
      : /[^aeiou]y$/i.test(w)
        ? `${w.slice(0, -1)}ies`
        : `${w}s`;

// ---- the trade catalog ------------------------------------------------------
// ~34 common trades. Floors are monthly, GL-only unless noted. E&S/high-hazard
// classes carry a higher floor because a specialty market prices them.
export const TRADES: Trade[] = [
  {
    slug: "general-contractor",
    name: "General Contractor",
    noun: "general contractor",
    glFrom: 107,
    realAnnual: 1283,
    bopFrom: 130,
    alsoCovers: "Also for construction managers, builders, and design-build firms.",
    driversExtra: [
      "How much work you subcontract, and whether your subs carry their own insurance",
      "Whether you pull permits and act as GC of record",
    ],
    cobs: [{ label: "General contractor", id: "General contractor" }],
  },
  {
    slug: "handyman",
    name: "Handyman",
    noun: "handyman",
    glFrom: 109,
    realAnnual: 1309,
    bopFrom: 130,
    alsoCovers: "Also for property maintenance, home repair, and odd-job services.",
    driversExtra: ["Whether you touch roofing, electrical, or structural work"],
    cobs: [{ label: "Handyman", id: "Handyman" }],
  },
  {
    slug: "electrician",
    name: "Electrician",
    noun: "electrician",
    glFrom: 59,
    bopFrom: 79,
    alsoCovers: "Also for electrical contractors and low-voltage installers.",
    driversExtra: ["Residential vs. commercial vs. industrial work", "Any high-voltage or panel work"],
    cobs: [{ label: "Electrician", id: "Electrician" }],
  },
  {
    slug: "plumber",
    name: "Plumber",
    noun: "plumber",
    glFrom: 65,
    bopFrom: 85,
    alsoCovers: "Also for pipefitters, drain/sewer services, and repipe specialists.",
    driversExtra: ["Water-damage and freeze-claim history", "New construction vs. service & repair"],
    cobs: [{ label: "Plumber", id: "Plumber" }],
  },
  {
    slug: "hvac",
    name: "HVAC",
    noun: "HVAC contractor",
    glFrom: 59,
    bopFrom: 79,
    alsoCovers: "Also for heating & cooling, refrigeration, and duct-cleaning contractors.",
    driversExtra: ["Hot-work / brazing exposure", "Whether you handle refrigerant and gas lines"],
    cobs: [{ label: "HVAC contractor", id: "HVAC contractor" }],
  },
  {
    slug: "roofer",
    name: "Roofer",
    noun: "roofing contractor",
    glFrom: 149,
    esRoute: true,
    alsoCovers: "Also for re-roofing, roof repair, and gutter/roofing combo crews.",
    driversExtra: [
      "Roof height and steepness, and how much is torch-down/hot work",
      "Residential vs. commercial, and your fall-protection program",
    ],
    cobs: [{ label: "Roofing contractor", id: "Roofing contractor" }],
  },
  {
    slug: "carpenter",
    name: "Carpenter",
    noun: "carpenter",
    glFrom: 105,
    realAnnual: 1263,
    bopFrom: 125,
    alsoCovers: "Also for finish carpentry, framing, and trim work.",
    cobs: [{ label: "Carpenter", id: "Carpenter" }],
  },
  {
    slug: "painter",
    name: "Painter",
    noun: "painting contractor",
    glFrom: 60,
    realAnnual: 725,
    bopFrom: 75,
    alsoCovers: "Also for interior/exterior painting, staining, and wallpaper.",
    driversExtra: ["Interior vs. exterior, and any work above two stories", "Spray vs. brush/roller"],
    cobs: [{ label: "House painting", id: "House painting" }],
  },
  {
    slug: "landscaper",
    name: "Landscaper",
    noun: "landscaping business",
    glFrom: 45,
    bopFrom: 59,
    alsoCovers: "Also for lawn care, grounds maintenance, and snow removal.",
    driversExtra: ["Whether you do hardscaping, tree work, or chemical application", "Snow-plow operations in winter"],
    cobs: [
      { label: "Landscaping & lawn care", id: "5003" },
      { label: "Grounds / snow removal", id: "111739" },
    ],
  },
  {
    slug: "cleaning",
    name: "Cleaning & Janitorial",
    noun: "cleaning business",
    glFrom: 42,
    bopFrom: 55,
    realAnnual: 500,
    alsoCovers: "Also for house cleaning, commercial janitorial, and maid services.",
    driversExtra: ["Residential vs. commercial accounts", "Whether you hold keys / have unsupervised access (janitorial bond)"],
    cobs: [{ label: "House cleaning", id: "House cleaning" }],
  },
  {
    slug: "flooring",
    name: "Flooring",
    noun: "flooring contractor",
    glFrom: 74,
    realAnnual: 886,
    bopFrom: 92,
    alsoCovers: "Also for hardwood, laminate, vinyl, and carpet installers.",
    cobs: [{ label: "Flooring contractor", id: "Flooring contractor" }],
  },
  {
    slug: "drywall",
    name: "Drywall",
    noun: "drywall contractor",
    glFrom: 55,
    bopFrom: 72,
    alsoCovers: "Also for taping, texturing, and plastering.",
    cobs: [{ label: "Drywall contractor", id: "Drywall contractor" }],
  },
  {
    slug: "concrete",
    name: "Concrete",
    noun: "concrete contractor",
    glFrom: 72,
    bopFrom: 92,
    alsoCovers: "Also for flatwork, foundations, driveways, and decorative concrete.",
    driversExtra: ["Structural/foundation work vs. flatwork only"],
    cobs: [{ label: "Concrete contractor", id: "Concrete contractor" }],
  },
  {
    slug: "masonry",
    name: "Masonry",
    noun: "masonry contractor",
    glFrom: 72,
    bopFrom: 92,
    alsoCovers: "Also for bricklaying, block, stone, and stucco.",
    cobs: [{ label: "Masonry contractor", id: "Masonry contractor" }],
  },
  {
    slug: "remodeler",
    name: "Remodeling",
    noun: "remodeling contractor",
    glFrom: 109,
    realAnnual: 1309,
    bopFrom: 135,
    alsoCovers: "Also for kitchen & bath remodels, renovations, and build-outs.",
    driversExtra: ["Whether jobs involve structural changes or additions", "Subcontractor use"],
    cobs: [{ label: "Remodeling contractor", id: "Remodeling contractor" }],
  },
  {
    slug: "fencing",
    name: "Fencing",
    noun: "fencing contractor",
    glFrom: 55,
    bopFrom: 72,
    alsoCovers: "Also for wood, vinyl, chain-link, and gate installation.",
    cobs: [{ label: "Fencing contractor", id: "Fencing contractor" }],
  },
  {
    slug: "pressure-washing",
    name: "Pressure Washing",
    noun: "pressure-washing business",
    glFrom: 42,
    bopFrom: 55,
    alsoCovers: "Also for soft-washing, exterior cleaning, and fleet washing.",
    driversExtra: ["Any work above ground level (roofs, multi-story)"],
    cobs: [{ label: "Pressure washing", id: "Pressure washing" }],
  },
  {
    slug: "tile",
    name: "Tile & Stone",
    noun: "tile contractor",
    glFrom: 55,
    bopFrom: 72,
    alsoCovers: "Also for ceramic, porcelain, natural stone, and backsplash work.",
    cobs: [{ label: "Tile contractor", id: "Tile contractor" }],
  },
  {
    slug: "tree-service",
    name: "Tree Service",
    noun: "tree service",
    glFrom: 148,
    realAnnual: 1779,
    esRoute: true,
    alsoCovers: "Also for arborists, tree removal, trimming, and stump grinding.",
    driversExtra: ["Climbing and crane/bucket removals vs. trimming only", "Whether you take down large or hazardous trees"],
    cobs: [{ label: "Tree service", id: "Tree service" }],
  },
  {
    slug: "excavation",
    name: "Excavation",
    noun: "excavation contractor",
    glFrom: 109,
    esRoute: true,
    alsoCovers: "Also for grading, site prep, trenching, and land clearing.",
    driversExtra: ["Depth of digs and utility-strike exposure", "Underground / shoring work"],
    cobs: [{ label: "Excavation contractor", id: "Excavation contractor" }],
  },
  {
    slug: "demolition",
    name: "Demolition",
    noun: "demolition contractor",
    glFrom: 125,
    esRoute: true,
    alsoCovers: "Also for interior demo, teardown, and debris removal.",
    driversExtra: ["Structural vs. interior demo", "Any use of heavy equipment or explosives"],
    cobs: [{ label: "Demolition contractor", id: "Demolition contractor" }],
  },
  {
    slug: "appliance-repair",
    name: "Appliance Repair",
    noun: "appliance-repair business",
    glFrom: 42,
    bopFrom: 55,
    alsoCovers: "Also for HVAC-adjacent, refrigeration, and small-appliance techs.",
    cobs: [{ label: "Appliance repair", id: "Appliance repair" }],
  },
  {
    slug: "locksmith",
    name: "Locksmith",
    noun: "locksmith",
    glFrom: 42,
    bopFrom: 55,
    alsoCovers: "Also for lock rekeying, safe work, and access-control installs.",
    driversExtra: ["Care-custody-control exposure for keys and access"],
    cobs: [{ label: "Locksmith", id: "Locksmith" }],
  },
  {
    slug: "welding",
    name: "Welding",
    noun: "welding contractor",
    glFrom: 69,
    bopFrom: 89,
    alsoCovers: "Also for mobile welding, fabrication, and structural steel.",
    driversExtra: ["Hot-work exposure and where you weld (client sites, heights)"],
    cobs: [{ label: "Welding contractor", id: "Welding contractor" }],
  },
  {
    slug: "window-cleaning",
    name: "Window Cleaning",
    noun: "window-cleaning business",
    glFrom: 45,
    bopFrom: 59,
    alsoCovers: "Also for storefront, high-rise, and post-construction cleaning.",
    driversExtra: ["Height: ground-floor only vs. ladder/high-rise work"],
    cobs: [{ label: "Window cleaning", id: "Window cleaning" }],
  },
  {
    slug: "snow-removal",
    name: "Snow Removal",
    titleName: "Snow Removal & Plowing",
    noun: "snow-removal business",
    glFrom: 59,
    bopFrom: 79,
    alsoCovers: "Also for plowing, salting/de-icing, and ice management.",
    driversExtra: ["Slip-and-fall / ice-management exposure and hold-harmless terms", "Commercial lots vs. residential driveways"],
    // 2026-10-16: "snow plowing insurance <state>" is the top snow query (82 impressions, average position 27).
    faqExtra: [
      {
        q: "Does snow plowing insurance cover the plow truck?",
        a: "No. General liability covers injuries and damage your work causes, such as a slip on a lot you cleared. The truck, the plow on it and any crash on the way to a job need commercial auto. Many personal auto policies exclude plowing for pay, so tell the auto insurer the truck plows before the season starts.",
      },
      {
        q: "What makes snow plowing insurance cost more?",
        a: "Commercial parking lots and retail sites cost more than residential driveways, because slip-and-fall claims there are larger and more frequent. Contracts that make you responsible for ice all day (not just when you plow), hold-harmless clauses in the property's favor, salting and de-icing, and prior slip-and-fall claims all move the price. Keep a log of every visit, with time, weather and what you applied: it is your main evidence when a claim comes in.",
      },
    ],
    cobs: [{ label: "Snow removal", id: "111739" }],
  },
  {
    slug: "garage-door",
    name: "Garage Door",
    noun: "garage-door contractor",
    glFrom: 52,
    bopFrom: 69,
    alsoCovers: "Also for opener installs, spring replacement, and repair.",
    cobs: [{ label: "Garage door installation", id: "Garage door installation" }],
  },
  {
    slug: "insulation",
    name: "Insulation",
    noun: "insulation contractor",
    glFrom: 62,
    bopFrom: 82,
    alsoCovers: "Also for spray-foam, batt, and blown-in installers.",
    driversExtra: ["Spray-foam / chemical exposure vs. batt only"],
    cobs: [{ label: "Insulation contractor", id: "Insulation contractor" }],
  },
  {
    slug: "gutter",
    name: "Gutter Installation",
    noun: "gutter contractor",
    glFrom: 55,
    bopFrom: 72,
    alsoCovers: "Also for seamless gutters, guards, and cleaning.",
    driversExtra: ["Height of work and ladder/roof exposure"],
    cobs: [{ label: "Gutter contractor", id: "Gutter contractor" }],
  },
  {
    slug: "deck-builder",
    name: "Deck & Patio",
    noun: "deck builder",
    glFrom: 69,
    bopFrom: 89,
    alsoCovers: "Also for patios, pergolas, and outdoor structures.",
    cobs: [{ label: "Deck builder", id: "Deck builder" }],
  },
  {
    slug: "siding",
    name: "Siding",
    noun: "siding contractor",
    glFrom: 127,
    realAnnual: 1523,
    bopFrom: 150,
    alsoCovers: "Also for vinyl, fiber-cement, and exterior cladding.",
    driversExtra: ["Height of work and any roofing crossover"],
    cobs: [{ label: "Siding contractor", id: "Siding contractor" }],
  },
  {
    slug: "pest-control",
    name: "Pest Control",
    noun: "pest-control business",
    glFrom: 55,
    bopFrom: 72,
    alsoCovers: "Also for exterminators, wildlife removal, and termite treatment.",
    driversExtra: ["Chemical/pesticide application exposure and applicator licensing"],
    cobs: [{ label: "Pest control", id: "Pest control" }],
  },
  {
    slug: "septic",
    name: "Septic",
    noun: "septic contractor",
    glFrom: 95,
    bopFrom: 120,
    esRoute: true,
    alsoCovers: "Also for septic install, pumping, and drain-field work.",
    driversExtra: ["Excavation depth and utility-strike exposure"],
    cobs: [{ label: "Septic contractor", id: "Septic contractor" }],
  },
  {
    slug: "solar-installer",
    name: "Solar Installation",
    noun: "solar contractor",
    glFrom: 85,
    bopFrom: 110,
    alsoCovers: "Also for residential and commercial PV and battery installers.",
    driversExtra: ["Roof-mount work at height", "Electrical / interconnection scope"],
    cobs: [{ label: "Solar contractor", id: "Solar contractor" }],
  },
  {
    slug: "paving",
    name: "Paving & Asphalt",
    noun: "paving contractor",
    glFrom: 99,
    bopFrom: 125,
    esRoute: true,
    alsoCovers: "Also for asphalt, sealcoating, and driveway paving.",
    driversExtra: ["Hot-material handling and roadway/traffic exposure"],
    cobs: [{ label: "Paving contractor", id: "Paving contractor" }],
  },
  {
    slug: "home-inspector",
    name: "Home Inspection",
    noun: "home inspection business",
    glFrom: 55,
    needsEO: true,
    alsoCovers: "Also for commercial inspectors and radon/mold testers.",
    driversExtra: ["Number of inspections per year", "Whether you inspect commercial or just residential"],
    cobs: [{ label: "Home inspector", id: "Home inspector" }],
  },
  // ---- trades we already write that have no standard instant-quote class ----
  {
    slug: "restoration",
    name: "Restoration",
    noun: "restoration contractor",
    glFrom: 119,
    esRoute: true,
    hedgeOnly: true,
    alsoCovers: "Also for water, fire, smoke, and storm-damage restoration.",
    driversExtra: ["Water vs. fire vs. mold scope", "Emergency / 24-hour dry-out operations"],
    cobs: [],
  },
  {
    slug: "mold-remediation",
    name: "Mold Remediation",
    noun: "mold remediation contractor",
    glFrom: 129,
    esRoute: true,
    hedgeOnly: true,
    alsoCovers: "Also for abatement, air-quality, and microbial remediation.",
    driversExtra: ["Mold/abatement exposure and containment protocols", "Any asbestos or lead crossover"],
    cobs: [],
  },
  {
    slug: "waterproofing",
    name: "Waterproofing",
    noun: "waterproofing contractor",
    glFrom: 92,
    bopFrom: 115,
    esRoute: true,
    alsoCovers: "Also for foundation sealing, basement, and below-grade work.",
    driversExtra: ["Foundation repair or underpinning is a knockout at a lot of carriers, so tell us if you do it"],
    cobs: [{ label: "Waterproofing", id: "Waterproofing" }],
  },
  {
    slug: "pool",
    name: "Swimming Pool Contractor",
    intakeLabel: "Pool & Spa",
    noun: "pool contractor",
    glFrom: 69,
    bopFrom: 89,
    alsoCovers: "Also for pool construction, service, and maintenance.",
    driversExtra: ["Construction/install vs. service & cleaning only", "In-ground vs. above-ground"],
    cobs: [{ label: "Pool contractor", id: "Pool contractor" }],
  },
  {
    slug: "stucco",
    name: "Stucco & Plastering",
    noun: "stucco contractor",
    glFrom: 72,
    bopFrom: 92,
    alsoCovers: "Also for plastering, EIFS, and exterior finish systems.",
    driversExtra: ["Some programs exclude EIFS work, so tell us if you do it"],
    cobs: [{ label: "Plastering / stucco", id: "Plastering / stucco" }],
  },
  {
    slug: "sandblasting",
    name: "Sandblasting",
    noun: "sandblasting contractor",
    glFrom: 82,
    bopFrom: 105,
    esRoute: true,
    alsoCovers: "Also for abrasive blasting, media blasting, and surface prep.",
    driversExtra: ["Silica/dust exposure and containment"],
    cobs: [{ label: "Sandblasting", id: "Sandblasting" }],
  },
  {
    slug: "sign-installation",
    name: "Sign Installation",
    noun: "sign contractor",
    glFrom: 65,
    bopFrom: 85,
    alsoCovers: "Also for signage manufacture, install, and service.",
    driversExtra: ["Height of installs and any electrical/crane work"],
    cobs: [{ label: "Sign contractor", id: "Sign contractor" }],
  },
  // ---- second batch: finish trades + home-service classes -------------------
  {
    slug: "cabinetry",
    name: "Cabinet Installation",
    noun: "cabinet contractor",
    glFrom: 52,
    bopFrom: 69,
    alsoCovers: "Also for cabinet makers, built-ins, and closet systems.",
    cobs: [{ label: "Cabinet installation", id: "Cabinet installation" }],
  },
  {
    slug: "countertop",
    name: "Countertop & Granite",
    noun: "countertop contractor",
    glFrom: 59,
    bopFrom: 79,
    alsoCovers: "Also for granite, quartz, and stone fabrication and install.",
    driversExtra: ["Heavy-slab handling and install damage claims"],
    cobs: [{ label: "Countertop contractor", id: "Countertop contractor" }],
  },
  {
    slug: "glass-glazing",
    name: "Glass & Window Installation",
    noun: "glass and glazing contractor",
    glFrom: 65,
    bopFrom: 85,
    alsoCovers: "Also for window and door installation, storefront, and glazing.",
    driversExtra: ["Height of installs and glass-breakage claims"],
    cobs: [{ label: "Glass / glazing contractor", id: "Glass / glazing contractor" }],
  },
  {
    slug: "chimney",
    name: "Chimney Sweep & Repair",
    noun: "chimney contractor",
    glFrom: 69,
    bopFrom: 89,
    esRoute: true,
    alsoCovers: "Also for chimney cleaning, relining, and masonry repair.",
    driversExtra: ["Roof/height work and any fireplace or fire exposure"],
    cobs: [{ label: "Chimney contractor", id: "Chimney contractor" }],
  },
  {
    slug: "irrigation",
    name: "Irrigation & Sprinkler",
    noun: "irrigation contractor",
    glFrom: 52,
    bopFrom: 69,
    alsoCovers: "Also for sprinkler install, repair, and backflow.",
    driversExtra: ["Trenching and any utility-strike exposure"],
    cobs: [{ label: "Irrigation contractor", id: "Irrigation contractor" }],
  },
  {
    slug: "low-voltage",
    name: "Alarm & Low-Voltage",
    noun: "low-voltage contractor",
    glFrom: 49,
    bopFrom: 65,
    alsoCovers: "Also for security systems, home automation, AV, and cabling.",
    driversExtra: ["Whether you monitor alarms or just install (monitoring adds E&O exposure)"],
    cobs: [{ label: "Low-voltage / alarm contractor", id: "Low-voltage / alarm contractor" }],
  },
  {
    slug: "ev-charger",
    name: "EV Charger Installation",
    noun: "EV charger installer",
    glFrom: 59,
    bopFrom: 79,
    alsoCovers: "Also for residential and commercial EV charging install.",
    driversExtra: ["Electrical/panel work and any charger-fault exposure"],
    cobs: [{ label: "Electrician", id: "Electrician" }],
  },
  {
    slug: "framing",
    name: "Framing",
    noun: "framing contractor",
    glFrom: 95,
    bopFrom: 115,
    alsoCovers: "Also for rough carpentry and structural framing.",
    driversExtra: ["Height of work and new-construction vs. repair"],
    cobs: [{ label: "Framing contractor", id: "Framing contractor" }],
  },
  {
    slug: "junk-removal",
    name: "Junk Removal & Hauling",
    noun: "junk removal business",
    glFrom: 55,
    bopFrom: 72,
    alsoCovers: "Also for hauling, debris removal, and cleanouts.",
    driversExtra: ["Truck/auto exposure and what you haul"],
    cobs: [{ label: "Junk removal / hauling", id: "Junk removal / hauling" }],
  },
  {
    slug: "movers",
    name: "Moving Company",
    noun: "moving company",
    glFrom: 69,
    bopFrom: 95,
    alsoCovers: "Also for local movers, packing, and labor-only crews.",
    driversExtra: ["Cargo/customer-goods damage claims", "Truck fleet and driver records"],
    cobs: [{ label: "Moving company", id: "Moving company" }],
  },
  {
    slug: "awning",
    name: "Awning & Canopy",
    noun: "awning contractor",
    glFrom: 59,
    bopFrom: 79,
    alsoCovers: "Also for canopy, shade structure, and patio-cover install.",
    driversExtra: ["Height of installs and wind-load exposure"],
    cobs: [{ label: "Awning contractor", id: "Awning contractor" }],
  },
  {
    slug: "epoxy-coating",
    name: "Epoxy & Floor Coating",
    noun: "epoxy coating contractor",
    glFrom: 52,
    bopFrom: 69,
    alsoCovers: "Also for garage floors, concrete sealing, and industrial coatings.",
    driversExtra: ["Solvent/fume exposure and surface-prep grinding"],
    cobs: [{ label: "Epoxy / coating contractor", id: "Epoxy / coating contractor" }],
  },
  {
    slug: "foundation-repair",
    name: "Foundation Repair",
    noun: "foundation repair contractor",
    glFrom: 95,
    bopFrom: 120,
    esRoute: true,
    alsoCovers: "Also for piering, underpinning, and slab leveling.",
    driversExtra: ["Underpinning is a knockout at a lot of carriers, so tell us if you do it"],
    cobs: [{ label: "Foundation repair", id: "Foundation repair" }],
  },
  {
    slug: "fire-sprinkler",
    name: "Fire Sprinkler",
    noun: "fire sprinkler contractor",
    glFrom: 89,
    bopFrom: 115,
    esRoute: true,
    alsoCovers: "Also for fire suppression install, inspection, and service.",
    driversExtra: ["Design vs. install-only, and water-damage/failure exposure"],
    cobs: [{ label: "Fire sprinkler contractor", id: "Fire sprinkler contractor" }],
  },
  {
    slug: "asbestos-abatement",
    name: "Asbestos & Lead Abatement",
    noun: "abatement contractor",
    glFrom: 129,
    esRoute: true,
    hedgeOnly: true,
    alsoCovers: "Also for asbestos, lead, and hazardous-material removal.",
    driversExtra: ["Abatement/pollution exposure and licensing"],
    cobs: [],
  },
  // Search Console exposed these distinct operations through broader pages.
  // Keep them national-only until each earns enough demand for researched
  // state pages; this avoids multiplying near-duplicate state content.
  {
    slug: "arborist",
    name: "Arborist",
    noun: "arborist",
    nationalOnly: true,
    requiresReview: true,
    glFrom: 148,
    bopFrom: 175,
    esRoute: true,
    alsoCovers: "For pruning, tree-health work, cabling, consulting, and removal. Describe climbing, crane, pesticide, and utility-line work separately.",
    driversExtra: ["Tree height, climbing, rigging, crane use, and work near utilities", "Whether you provide tree-health opinions or pesticide applications"],
    cobs: [{ label: "Arborist / tree service", id: "Tree service" }],
  },
  // Roof/tree release 2026-11-19 (Kevin): tree-service variants searchers name directly. Search Console
  // showed tree trimming (434 impressions) and tree removal (226) queries landing on a Georgia state page;
  // stump grinding was requested by Kevin. National-only: the tree-service state pages already cover states.
  {
    slug: "tree-removal",
    name: "Tree Removal",
    intakeLabel: "Tree service",
    noun: "tree removal business",
    nationalOnly: true,
    glFrom: 148,
    esRoute: true,
    alsoCovers: "For take-downs, hazardous and storm-damaged trees, crane-assisted removals and the cleanup that follows.",
    driversExtra: ["Tree height, climbing, rigging and crane-assisted removals", "Storm work and removals near buildings or power lines"],
    cobs: [{ label: "Tree service", id: "Tree service" }],
  },
  {
    slug: "tree-trimming",
    name: "Tree Trimming",
    intakeLabel: "Tree service",
    noun: "tree trimming business",
    nationalOnly: true,
    glFrom: 148,
    esRoute: true,
    alsoCovers: "For pruning, trimming, limb removal and hedge or shrub work, including crews that occasionally take a tree down.",
    driversExtra: ["The share of trimming versus removals", "Working heights, climbing and bucket-truck work"],
    cobs: [{ label: "Tree service", id: "Tree service" }],
  },
  {
    slug: "stump-grinding",
    name: "Stump Grinding",
    intakeLabel: "Tree service",
    noun: "stump grinding business",
    nationalOnly: true,
    glFrom: 148,
    esRoute: true,
    alsoCovers: "For stump grinding and stump removal, alone or alongside tree work.",
    driversExtra: ["Whether you only grind stumps or also trim and remove trees", "Underground utility and flying-debris exposure"],
    cobs: [{ label: "Tree service", id: "Tree service" }],
  },
  {
    slug: "cabinet-maker",
    name: "Cabinet Maker",
    noun: "cabinet maker",
    nationalOnly: true,
    requiresReview: true,
    glFrom: 52,
    bopFrom: 69,
    alsoCovers: "For cabinet shops that fabricate, finish, deliver, or install their own work. Installation-only contractors can use the cabinet-installation guide.",
    driversExtra: ["Shop fabrication and finishing versus installation only", "Products/completed-work exposure and any subcontracted installation"],
    cobs: [{ label: "Cabinet maker / installation", id: "Cabinet installation" }],
  },
  {
    slug: "pool-inspector",
    name: "Pool Inspector",
    noun: "pool inspector",
    nationalOnly: true,
    requiresReview: true,
    glFrom: 55,
    needsEO: true,
    alsoCovers: "For visual pool and spa inspections, written reports, and pre-purchase reviews. Repair, leak detection, diving, or engineering work needs separate review.",
    driversExtra: ["Whether you provide written condition or safety reports", "Any repair, leak detection, diving, engineering, or code-certification work"],
    cobs: [{ label: "Pool inspector", id: "Pool inspector" }],
  },
];

// ---- shared copy spine ------------------------------------------------------

function coverageSpine(t: Trade): { name: string; desc: string }[] {
  const rows: { name: string; desc: string }[] = [
    {
      name: "General liability",
      desc: `Covers you if you damage a client's property or someone gets hurt on the job. Every GC, property manager, and permit office wants to see it, usually $1M/$2M with them added as additional insured.`,
    },
    {
      name: "Tools & equipment",
      desc: "Covers your tools and gear if they get stolen or wrecked, on site or in the truck. Cheap to add, and it's the loss most trades actually have.",
    },
  ];
  if (t.needsEO) {
    rows.push({
      name: "Professional liability (E&O)",
      desc: `Covers you if a client says you missed something or gave bad advice. General liability won't touch that, and it's what ${an(t.noun)} ${t.noun} usually gets sued over.`,
    });
  }
  rows.push(
    {
      name: "Workers' comp",
      desc: "Required in almost every state once you have employees, and most GCs want it even from subs. Priced on payroll, and usually your biggest line once you've got a crew.",
    },
    {
      name: "Commercial auto",
      desc: "Covers your work truck or van. Your personal auto policy won't pay a claim if you were working, and more job sites are asking for proof of it.",
    },
    {
      name: "Additional insured & waivers",
      desc: "The endorsements GCs and property managers ask for before you start. We put them on the COI the day you bind.",
    },
  );
  return rows;
}

function priceDrivers(t: Trade): string[] {
  return [
    "Whether you just want general liability or add your tools and a truck",
    "Payroll and how many people you have (workers' comp is usually the biggest line)",
    "Your annual sales",
    "Your claims over the last 3-5 years",
    ...(t.driversExtra ?? []),
    "Your state, its licensing and bond rules, and how litigious it is",
  ];
}

function sharedFaqs(t: Trade): { q: string; a: string }[] {
  const bind = t.hedgeOnly
    ? "This one doesn't quote through the instant online carriers, so we run it through our specialty desk. Usually a day or two for a quote, but we can still get a COI out fast once terms are set."
    : t.requiresReview
      ? "Send the work description and requested coverage first. A licensed agent reviews the class and available markets before giving a timing estimate; do not rely on an instant-quote promise for this operation."
    : t.esRoute
      ? "Higher-risk trades like this go through a specialty market, so give it a business day or two. We can usually still get a COI out fast once the terms are set."
      : "Most trades bind same-day, and we send the COI the minute you bind. Often the same day the GC or property manager asks for it.";
  return [
    {
      q: `How much does ${t.noun} insurance cost?`,
      a: t.requiresReview
        ? `There is no responsible price to give without the work description, payroll, sales, equipment, contracts, requested limits, and loss history. Keep those facts consistent and compare the complete proposals, not a generic starting price.`
        : `General liability for ${an(t.noun)} ${t.noun} starts as low as ${money(t.glFrom)}/mo if you're a small owner-operator${
            t.bopFrom ? `, or about ${money(t.bopFrom)}/mo with your tools added` : ""
          }. What you actually pay comes down to payroll, sales, the work you do, and your claims. If you're paying way more than that right now, it's usually how you got classified, not the risk itself.`,
    },
    // Inspectors and other professional-service trades don't work under a GC; their question is E&O vs GL.
    t.needsEO
      ? {
          q: `Do I need errors and omissions as well as general liability?`,
          a: `They cover different claims. General liability covers injury or property damage at a job site. Errors and omissions (professional liability) covers a claim that your inspection or report missed something. Most inspection businesses carry both, and some states and clients ask for proof before you work. We quote them together so you can compare.`,
        }
      : {
          q: `What does a GC need me to carry?`,
          a: `Almost always a $1M/$2M general liability policy with them added as additional insured, workers' comp if you've got a crew, and often a waiver of subrogation. Set the policy up with a blanket additional insured and we can turn those COIs around same-day.`,
        },
    {
      q: `Do I legally need insurance as ${an(t.noun)} ${t.noun}?`,
      a: `Once you have employees, workers' comp is required in almost every state. A lot of states and cities also won't issue or renew your contractor license or permit without proof of general liability, and sometimes a bond. And even where the law doesn't require it, no GC or property manager will let you on the job without it.`,
    },
    {
      q: `How fast can I get covered and get a COI?`,
      a: bind,
    },
  ];
}

// ---- national builder -------------------------------------------------------

// Real-price layer (Kevin 2026-10-02): trades with a verified price in trade-prices.ts lead with it,
// labelled bound or quote. Every other trade publishes no number: the legacy $/mo floors below were
// not from our own book, so withoutPrice removes them from the title, meta, hero, cost block and FAQ.
export function finalizeTradePricing(
  c: PageContent,
  t: Trade,
  place?: { name: string; abbr: string; city?: string },
  metaTails?: string[],
): PageContent {
  const name = t.titleName ?? t.name;
  if (tradePrice(t.slug, place?.abbr)) return withTradePrice(c, t.slug, { name, noun: t.noun, place, metaTails });
  const closedToLowestQuote = place && TRADE_PRICE_CLOSED_STATES[t.slug]?.has(place.abbr);
  return withoutPrice(c, {
    name, noun: t.noun, plural: plural(t.noun), place,
    noPriceReason: closedToLowestQuote
      ? `Our lowest published quote for ${t.noun} insurance comes from a product that is unavailable for new business in ${place.name}. We will compare other available options using your work, sales, payroll, subcontractors and claims.`
      : undefined,
  });
}

export function buildContractorNational(t: Trade): PageContent {
  const content = finalizeTradePricing(buildContractorNationalBase(t), t);
  if (t.slug === "roofer") {
    const examples = content.priceExamples;
    return {
      ...content,
      title: "Roofing Insurance Cost: Real Quotes from $1,359/yr",
      heroH1: "Roofing Insurance Cost: Real Quotes by Business Size",
      heroSub: "A roofer at about $377K revenue received a real $1,359.42/yr claims-made general liability quote. Compare its $1,795.09/yr occurrence option and other quotes by business size.",
      costNarrative: [
        "A roofer at about $377K revenue, $133K subcontracted and no W-2 employees received a $1,359.42/yr claims-made general liability quote and a $1,795.09/yr occurrence quote on the same application. A roofer at about $800K revenue received a $4,280/yr occurrence quote, and one at about $1.8M revenue received a $12,220/yr occurrence quote. These are real quotes, not averages or state-specific rates. The policy forms have different terms, so compare the work and coverage as well as the price.",
        ...content.costNarrative.slice(1),
      ],
      priceExamples: examples ? {
        ...examples,
        heading: "Real roofing insurance quotes by business size",
        items: [
          ...examples.items.slice(0, 3),
          // Separate QC-verified NY indication q_ext_d543b5d3cada976844c3. These are
          // agency-assumed exposure figures, not the applicant's reported financials.
          { business: "A New York roofer, $150K subcontracted, $100K W-2 payroll, one employee (agency-assumed figures)", revenue: "About $475K", price: "$1,795/yr, occurrence quote", sentence: "A separate New York roofing application returned a $1,795/yr occurrence general liability quote on our stated assumptions of $475K revenue, $150K subcontracted, $100K W-2 payroll and one employee, with $1M/$2M limits and a $2,500 self-insured retention." },
          { business: "A roofer, $200K subcontracted, $50K W-2 payroll", revenue: "About $800K", price: "$4,280/yr, quoted", sentence: "A roofer at about $800K revenue, $200K subcontracted and $50K W-2 payroll received a $4,280/yr occurrence general liability quote." },
          ...examples.items.slice(3, 4),
          { business: "A roofer, $420K subcontracted, no W-2 employees", revenue: "About $1.8M", price: "$12,220/yr, quoted", sentence: "A roofer at about $1.8M revenue, $420K subcontracted and no W-2 employees received a $12,220/yr occurrence general liability quote." },
          ...examples.items.slice(4),
        ],
        note: "Whole-dollar table prices are rounded from real quotes or bound policies in our book. The exact $1,359.42 claims-made and $1,795.09 occurrence quotes for the $377K roofer came from the same application, but the forms differ. A lower price alone does not mean suitable coverage. Revenue, subcontracted work, payroll and the share of commercial work can change the quote.",
      } : undefined,
      stateFacts: [
        {
          title: "Describe the roof work before comparing prices",
          body: "Separate repairs, replacements and new construction; residential and commercial work; and flat, steep and low-slope roofs. Include your maximum working height, tear-off work, and any torch, hot asphalt or other heat application. Ask us to check the proposed policy for restrictions on the work you actually accept.",
        },
        {
          title: "Show subcontracted work apart from payroll",
          body: "The $1,359.42 claims-made and $1,795.09 occurrence general liability quotes shown here were for the same roofer with about $377K in revenue, $133K subcontracted and no W-2 employees. Send those figures separately, plus the work your subcontractors perform and any insurance requirements in their agreements. These are one real case, not a rate for every business at that revenue.",
        },
        {
          title: "Check the roof-leak and contract terms",
          body: "Ask how the proposal treats open-roof water damage, completed work, height limits, subcontractor conditions and any roof-system restrictions. If a general contractor requires occurrence coverage, additional insured status or a waiver, send the contract before choosing a policy. A certificate alone cannot remove an exclusion.",
        },
      ],
      faqs: [...content.faqs, ...ROOFER_COVERAGE_FAQS],
    };
  }
  if (t.slug === "fire-sprinkler") {
    return {
      ...content,
      heroSub: "Install, inspect or service fire sprinkler systems? Tell us which work you perform, then compare coverage for the jobs you actually take.",
      costNarrative: [
        "A fire sprinkler installation contractor received two general liability quotes on the same application in October 2026: $5,695.36/yr claims-made and $8,880.48/yr occurrence. Both used $300K projected annual revenue, which we assumed; the contractor supplied $100K installer payroll and $10K subcontractor costs. The $1M/$2M quotes carried a $2,500 self-retention. These are sent quotes, not bound prices or a rate for every installer. The policy forms and terms differ.",
        ...content.costNarrative,
      ],
      stateFacts: [
        {
          title: "Separate installation from inspection and service",
          body: "Tell us the share of revenue from new installation, system alterations, inspections, testing and repairs. Identify who designs the system and who signs off on plans. NFPA 13 addresses design and installation; NFPA 25 addresses inspection, testing and maintenance. A policy for service work should not be assumed to accept installation or design.",
          source: { label: "NFPA 13: sprinkler system design and installation", href: "https://www.nfpa.org/codes-and-standards/nfpa-standard-development-process/13" },
        },
        {
          title: "Describe the buildings and systems you work on",
          body: "List commercial, residential and industrial jobs separately. Include wet, dry and preaction systems where applicable, your maximum job size, work on occupied buildings, and any subcontracted work. Give the carrier the actual installation scope before comparing terms.",
        },
        {
          title: "Review water-damage and completed-work terms",
          body: "Ask how each proposed policy treats accidental discharge, leaks after installation, testing damage, professional design work and completed operations. Send the customer contract and requested limits or endorsements. A certificate does not expand coverage or remove an exclusion.",
        },
      ],
      faqs: [
        ...content.faqs,
        {
          q: "What did a real fire sprinkler installation GL quote cost?",
          a: "One contractor received $5,695.36/yr claims-made and $8,880.48/yr occurrence quotes on the same October 2026 application. The projected $300K revenue was our assumption; the contractor confirmed $100K installer payroll and $10K subcontractor costs. Both quotes had $1M/$2M limits and a $2,500 self-retention. They were sent quotes, not bound policies. Tell us your actual installation, inspection and service work, sales, crew and subcontractors so we can compare terms for your business.",
        },
        {
          q: "What do I need for a fire sprinkler installation insurance quote?",
          a: "Send annual sales, payroll, employee roles, subcontractor costs, claims history and the split between installation, design, inspection, testing and repair. Describe the buildings and system types you work on, and share the customer contract and insurance requirements. We can then compare the operations each proposed policy actually accepts.",
        },
        {
          q: "Does a fire sprinkler service policy cover new installations?",
          a: "Do not assume it does. Installation, system design and inspection or service can be treated differently by a carrier. Tell us about every operation and ask for the proposed policy's accepted class, exclusions and completed-operations terms before taking installation work.",
        },
      ],
    };
  }
  if (t.slug === "tree-service") {
    return {
      ...content,
      title: "Tree Service Insurance Cost: $1,271 Claims-Made Quote",
      priceExamples: {
        ...treePriceExamples("trimming"),
        note: "The lower figure is a quote on a different application. These three cases are not an average or a rate for trimming, removal, or a particular state. Compare accepted work, limits and policy form alongside premium.",
      },
      stateFacts: [
        {
          title: "Split trimming, removal and stump work",
          body: "Give the share of receipts from pruning, removals, stump grinding and other services. Describe climbing, bucket lifts, rigging and crane-assisted jobs separately. A policy priced for routine trimming should not be assumed to accept hazardous removals or storm work.",
        },
        {
          title: "Check height and utility restrictions in the proposal",
          body: "Share the highest trees and working heights you accept, including occasional jobs. Tell us about work near power lines and whether a separate utility crew is involved. Ask how each proposed policy defines a height restriction and which operations it excludes; the business label alone does not answer those questions.",
        },
        {
          title: "Prepare the crew and equipment details",
          body: "Send annual receipts, payroll, employee roles, subcontractor costs, claims history and a list of owned or rented equipment. Identify any crane rented with an operator and provide the customer insurance requirements. We can compare the accepted work and policy terms alongside the premium.",
        },
      ],
      faqs: [
        ...content.faqs,
        {
          q: "How much does tree trimming insurance cost?",
          a: `A tree service at about $300K revenue with one W-2 employee received a $1,271.18 per year claims-made general liability quote. That is a verified quote, not a bound policy, an average or a trimming-only rate. Two other tree services bound claims-made general liability at ${TREE_BOUND_GL_COMPARABLE} per year. Your quote depends on the share of trimming versus removal, working heights, crew, equipment, location and claims.`,
        },
        {
          q: "Does tree-service insurance cover tree removal?",
          a: "Do not assume every tree-service policy accepts every removal. Describe climbing, rigging, crane use, storm-damaged trees and work near utilities. Compare the accepted operations, height terms and exclusions in the proposed policy before taking a job.",
        },
        {
          q: "Does tree removal insurance cost more than tree trimming insurance?",
          a: `The work mix can change a quote, but our $1,271.18 claims-made general liability example was for a tree-service application, not a trimming-only price. Two separate tree services bound claims-made general liability at ${TREE_BOUND_GL_COMPARABLE} per year. To compare your cost, split annual receipts among trimming, removals, stump grinding and other work, then describe the heights, crew and equipment used for each.`,
        },
        {
          q: "Are storm cleanup, crane work and tall trees covered?",
          a: "A tree-service label does not establish coverage for those jobs. Before taking them, tell us your maximum working height, whether the tree is storm damaged, how the crane is hired, who operates it and whether you work near utilities. We will check the proposed policy's accepted operations and exclusions. Send any customer or general contractor insurance requirements too; a certificate cannot override an exclusion.",
        },
        {
          q: "Do tree services need workers' comp?",
          a: "Most states require workers' comp once you have employees, and tree work is a high-hazard class, so it is often the largest line for a crew. Rules for owners, family members and subcontractors vary by state. Send payroll by role, such as climbers, ground crew and office staff, so the quote uses the right class.",
        },
        {
          q: "Is stump grinding or land clearing included in a tree-service policy?",
          a: "Stump grinding is often written with tree work, but list it with its share of receipts and ask whether the proposed policy accepts it. Land clearing with excavators or forestry mulchers is closer to site work and may need a different class. Describe it separately instead of assuming the tree-service label covers it.",
        },
      ],
    };
  }
  if (t.slug === "arborist") return arboristPage(content);
  const variant = TREE_VARIANTS[t.slug];
  if (variant) return treeVariantPage(content, variant);
  return content;
}

// Roof/tree release 2026-11-19 (Kevin asked for open roofs and additional insured). Coverage structure only;
// forms vary by carrier, so every answer points to the proposed wording rather than promising coverage.
const ROOFER_COVERAGE_FAQS: { q: string; a: string }[] = [
  {
    q: "Does roofing insurance cover rain damage from an open roof?",
    a: "It depends on the policy. Example: your crew tears off a roof, a storm arrives overnight and water ruins the ceilings and furniture below. The homeowner's claim against you would go to your general liability, but some roofing policies exclude or limit open-roof water damage or require tarping and other steps. Ask for the open-roof or water-intrusion wording in each proposal before you choose.",
  },
  {
    q: "Can a general contractor be added as additional insured on a roofing policy?",
    a: "Usually, by endorsement. Many GC contracts ask for additional insured status for ongoing work and for completed work, often with primary and non-contributory wording and a waiver of subrogation. Send the contract's insurance section with your quote request so we can check which endorsements each proposal includes; a certificate alone does not add them.",
  },
  {
    q: "What is the difference between ongoing and completed operations additional insured?",
    a: "Ongoing operations covers the GC for claims arising while you are working on the job. Completed operations covers claims that arise after you finish, such as a leak that damages the building months later. Roofing contracts often require both, so check that the proposed endorsements match the contract.",
  },
  {
    q: "Do roofers need workers' comp if they only use subcontractors?",
    a: "Rules vary by state, but a GC or insurer may charge you for uninsured subcontractors at audit or treat them as your employees. Collect each subcontractor's certificates for general liability and workers' comp before they start, and tell us your subcontractor costs separately from payroll.",
  },
];

// ---- tree-service family (roof/tree release 2026-11-19) ----------------------
// The only sourced tree prices are tree-service general liability cases (trade-prices.ts). Variant and
// arborist pages repeat them as tree-service examples, never as a removal-, trimming-, stump- or
// arborist-specific rate.

export const TREE_FAMILY_LINKS: { slug: string; label: string }[] = [
  { slug: "tree-service", label: "Tree service insurance cost" },
  { slug: "tree-removal", label: "Tree removal insurance" },
  { slug: "tree-trimming", label: "Tree trimming insurance" },
  { slug: "stump-grinding", label: "Stump grinding insurance" },
  { slug: "arborist", label: "Arborist insurance cost" },
];
export const TREE_FAMILY_SLUGS = TREE_FAMILY_LINKS.map((l) => l.slug);

const TREE_PRICE_SENTENCE = `A tree service at about $300K revenue with one W-2 employee received a $1,271.18/yr claims-made general liability quote; it was not bound. Two other tree services each bound claims-made general liability at ${TREE_BOUND_GL_COMPARABLE}/yr.`;

function treePriceExamples(work: string): NonNullable<PageContent["priceExamples"]> {
  return {
    heading: "Real tree-service GL prices: a quote and paid policies",
    table: false,
    items: [
      { business: "Tree service, about $300K revenue, one W-2 employee", price: "$1,271.18/yr, claims-made quote", sentence: "One tree service at about $300K revenue with one W-2 employee received a $1,271.18/year claims-made general liability quote. It was not bound." },
      { business: "Two separate tree-service businesses", price: `${TREE_BOUND_GL_COMPARABLE}/yr each, claims-made policies`, sentence: `Two other tree services each bound claims-made general liability with us at ${TREE_BOUND_GL_COMPARABLE}/year. These were customer-paid policies.` },
    ],
    note: `These are tree-service cases, not an average or a rate for ${work}. Your price depends on the work mix, heights, crew, equipment, state and claims. Compare accepted work, limits and policy form alongside premium.`,
  };
}

type TreeVariant = {
  work: string; // "tree removal", used in sentences
  title: string;
  metaDescription: string;
  heroH1: string;
  heroSub: string;
  lead: string; // what the work changes, after the sourced prices
  stateFacts: PageContent["stateFacts"];
  faqs: { q: string; a: string }[];
};

const TREE_VARIANTS: Record<string, TreeVariant> = {
  "tree-removal": {
    work: "tree removal",
    title: "Tree Removal Insurance Cost: Real Tree Service Quotes",
    metaDescription: "Tree removal insurance: a real $1,271 claims-made tree-service GL quote, what removals, cranes and storm work change, and what to send for a quote.",
    heroH1: "Tree Removal Insurance: Cost and What Removals Change",
    heroSub: "See real tree-service general liability prices, then tell us about your removals, heights and equipment so we can compare policies that accept the work.",
    lead: "Removals are where tree-service policies differ most. A carrier may price or restrict take-downs, climbing removals, crane-assisted jobs, storm-damaged trees and work near power lines differently from trimming, so describe them before comparing prices.",
    stateFacts: [
      {
        title: "Describe each kind of removal",
        body: "Separate routine take-downs from climbing removals, bucket-truck work, crane-assisted removals and storm-damaged or hazardous trees. Give the share of receipts from each and the tallest tree you remove, including occasional jobs. A policy priced for trimming should not be assumed to accept every removal.",
      },
      {
        title: "Explain who runs the crane",
        body: "Tell us whether you own the crane, rent it with an operator or hire a crane company, and who rigs the load. Send the rental or subcontract agreement. Ask how the proposed policy treats crane work and damage to the property under the lift; a certificate cannot add coverage the policy excludes.",
      },
      {
        title: "Plan the drop zone before the job",
        body: "Example: a 70-foot oak leans over a homeowner's garage. If a section is dropped onto the roof, the homeowner's claim against you is a general liability question. Tell us about removals near buildings, cars, fences, roads and utility lines so the quote reflects the jobs you actually take.",
      },
    ],
    faqs: [
      {
        q: "How much does tree removal insurance cost?",
        a: `We have no removal-only price to publish. ${TREE_PRICE_SENTENCE} Those are tree-service cases, not a removal rate. Your quote depends on the share of removals, heights, crane and climbing work, storm jobs, crew, state and claims.`,
      },
      {
        q: "Is tree removal covered by a tree service policy?",
        a: "Do not assume it is. Describe climbing, rigging, crane use, storm-damaged trees and work near utilities, then check the accepted operations, height terms and exclusions in the proposed policy before taking the job.",
      },
      {
        q: "Does tree removal insurance cover a tree falling on a house?",
        a: "If your crew drops a tree or limb onto a customer's or neighbor's property, that claim is the kind general liability is meant to answer, subject to the policy's terms, limits and exclusions. Damage to the tree itself, your own equipment and injuries to your workers are separate questions for property and workers' comp coverage.",
      },
      {
        q: "Do I need workers' comp for a tree removal crew?",
        a: "Most states require workers' comp once you have employees, and tree work is a high-hazard class, so it is often the largest line for a crew. Rules for owners, family members and subcontractors vary by state. Send payroll by role so the quote uses the right class.",
      },
    ],
  },
  "tree-trimming": {
    work: "tree trimming",
    title: "Tree Trimming Insurance Cost: Real Tree Service Quotes",
    metaDescription: "Tree trimming insurance: a real $1,271 claims-made tree-service GL quote, what trimming vs removals changes, and what to send for your own quote.",
    heroH1: "Tree Trimming Insurance: Cost and What Moves the Price",
    heroSub: "See real tree-service general liability prices, then tell us how much of your work is trimming versus removals to get quotes that match it.",
    lead: "If most of your receipts come from pruning and trimming, say so with numbers. The split between trimming, removals and stump grinding, your working heights and whether you climb or use a bucket truck are the facts a carrier needs to rate the work correctly.",
    stateFacts: [
      {
        title: "Give the trimming share in dollars",
        body: "Split last year's receipts among trimming and pruning, removals, stump grinding, hedge and shrub work and any other services. A crew that trims most of the year but takes down a few trees should list those removals too; leaving them out is how a quote ends up wrong.",
      },
      {
        title: "State heights and access",
        body: "Tell us the highest you work, including occasional jobs, and whether you climb, use a bucket truck or work from the ground with pole saws. Mention work near power lines. Ask how each proposed policy defines any height limit before you take a tall job.",
      },
      {
        title: "Plan for the falling-limb claim",
        body: "Example: a cut limb swings into a customer's window or lands on a parked car. That is the kind of third-party damage general liability is meant to answer, subject to the policy's terms. Your own equipment and injuries to your workers are covered under separate lines.",
      },
    ],
    faqs: [
      {
        q: "How much does tree trimming insurance cost?",
        a: `We have no trimming-only price to publish. ${TREE_PRICE_SENTENCE} Those are tree-service cases, not a trimming rate. Your quote depends on the trimming share of receipts, heights, crew, equipment, state and claims.`,
      },
      {
        q: "Is tree trimming insurance cheaper than tree removal insurance?",
        a: "The work mix can change a quote, but we have not published separate trimming and removal prices. Give the share of receipts from each so carriers rate the work you actually do, and do not understate removals to get a lower number.",
      },
      {
        q: "Do I need insurance to trim trees for customers?",
        a: "Some states and cities require proof of insurance, a license or a registration for tree work, and most property managers and contractors ask for a certificate before you start. Once you have employees, workers' comp is required in almost every state.",
      },
    ],
  },
  "stump-grinding": {
    work: "stump grinding",
    title: "Stump Grinding Insurance: Cost and Coverage Questions",
    metaDescription: "Stump grinding insurance: real tree-service GL prices, what stump-only work changes, and the underground-line and flying-debris questions to ask.",
    heroH1: "Stump Grinding Insurance",
    heroSub: "Grind stumps on their own or alongside tree work? Tell us the work mix and equipment so we can compare policies that accept it.",
    lead: "Stump grinding is usually written as part of a tree-service policy. Say whether you only grind stumps or also trim and remove trees, and give the receipts for each, so the carrier rates the work correctly.",
    stateFacts: [
      {
        title: "Call before you grind",
        body: "Grinding can reach buried lines. Federal pipeline-safety guidance tells anyone digging to contact 811 first so lines are marked; state rules on who must call and when vary. Keep your locate tickets; ask how the proposed policy treats underground utility damage.",
        source: { label: "PHMSA: contact 811 before you dig", href: "https://www.phmsa.dot.gov/safety-awareness/april-national-safe-digging-month" },
      },
      {
        title: "Plan for flying debris",
        body: "Example: a chip from the grinder cracks a neighbor's sliding door or a car windshield. That third-party damage is the kind of claim general liability is meant to answer, subject to the policy's terms. Tell us whether you work near roads, parked cars and occupied buildings.",
      },
      {
        title: "List the grinder and how you move it",
        body: "Tell us whether the grinder is owned, financed or rented, its value, and whether you tow it. Theft or damage to the grinder needs equipment coverage, and the truck towing it needs commercial auto. General liability does not cover your own equipment.",
      },
    ],
    faqs: [
      {
        q: "How much does stump grinding insurance cost?",
        a: `We have no stump-grinding price to publish. ${TREE_PRICE_SENTENCE} Those are tree-service cases, not a stump-grinding rate. Your quote depends on whether you only grind stumps, your receipts, crew, equipment, state and claims.`,
      },
      {
        q: "Does stump grinding insurance cover hitting an underground line?",
        a: "Do not assume it does. Ask how the proposed policy treats underground utility damage, and keep proof that you called 811 for locates before grinding. Requirements vary by state.",
      },
      {
        q: "Is my stump grinder covered by general liability?",
        a: "No. General liability answers claims from other people. To cover theft of or damage to the grinder itself, ask for inland marine or contractor's equipment coverage with a limit that matches its value.",
      },
    ],
  },
};

function treeVariantPage(content: PageContent, v: TreeVariant): PageContent {
  return {
    ...content,
    title: v.title,
    metaDescription: v.metaDescription,
    heroH1: v.heroH1,
    heroSub: v.heroSub,
    costNarrative: [`${TREE_PRICE_SENTENCE} These are tree-service cases, not a rate for ${v.work}.`, v.lead],
    costDisclaimer: "The prices shown are real tree-service quotes and policies from our book, not a rate for your business. This is not a quote or an offer of insurance.",
    priceExamples: treePriceExamples(v.work),
    stateFacts: v.stateFacts,
    faqs: [...v.faqs, ...content.faqs.filter((f) => !/cost|how much/i.test(f.q))],
  };
}

function arboristPage(content: PageContent): PageContent {
  return {
    ...content,
    title: "Arborist Insurance Cost: Real Tree Service Quotes",
    metaDescription: "Arborist insurance cost: a real $1,271 claims-made tree-service GL quote, plus what pruning, climbing, crane and tree-health work change in a quote.",
    heroH1: "Arborist Insurance Cost",
    heroSub: "See real tree-service general liability prices, then prepare the pruning, climbing, crane and tree-health details a licensed agent needs to quote you.",
    costNarrative: [
      `We have no arborist-only price to publish. ${TREE_PRICE_SENTENCE} These are tree-service cases, not an arborist rate.`,
      ...content.costNarrative,
    ],
    priceExamples: treePriceExamples("arborist work"),
    stateFacts: [
      {
        title: "Split advice from tree work",
        body: "Give the share of receipts from pruning, removals, cabling and bracing, plant-health care and written assessments or consulting. A policy priced for tree work may treat paid opinions differently, so list them even if they are a small part of the business.",
      },
      {
        title: "Name any pesticide or fertilizer applications",
        body: "Tell us whether you apply pesticides, fungicides or injections, and which licenses your applicators hold. Ask whether the proposed policy limits pollution or chemical-application claims before you add plant-health services.",
      },
      {
        title: "Describe climbing, crane and utility work",
        body: "State the tallest trees you work on, whether you climb or use bucket trucks, how cranes are hired and whether you work near power lines. Check the proposed policy for height, crane and utility conditions; the arborist label alone does not answer them.",
      },
    ],
    faqs: [
      {
        q: "How much does arborist insurance cost?",
        a: `We have no arborist-only price to publish. ${TREE_PRICE_SENTENCE} Those are tree-service cases. Your quote depends on pruning versus removals, climbing, crane and utility work, tree-health opinions or pesticide applications, crew, state and claims.`,
      },
      {
        q: "Do arborists need professional liability as well as general liability?",
        a: "General liability answers injury or property damage from the work. If you sell written tree-risk assessments, health opinions or consulting, ask whether the proposed policy excludes professional advice and whether you need a separate professional liability policy.",
      },
      ...content.faqs.filter((f) => !/cost|how much/i.test(f.q)),
    ],
  };
}

// The page before the real-price layer; state pages build on this so the price is applied once.
export function buildContractorNationalBase(t: Trade): PageContent {
  const floor = money(t.glFrom);
  const bundle = t.bopFrom ? money(t.bopFrom) : null;
  const marketNote = t.hedgeOnly
    ? "This one doesn't quote through the online carriers, so we run it through our specialty desk, the market that writes it every day, and shop it to keep the number down."
    : t.requiresReview
      ? "The exact operations need review before selecting a carrier class or promising quote timing."
    : t.esRoute
      ? "It's a higher-risk trade, so the best rates come from specialty markets that write it every day, not a standard small-business carrier."
      : "It quotes fast, and a solo operator with no crew lands near the low end.";
  // Substantiated own-book anchor (§349-safe): only cited where we have a real
  // recent quote/bind and it reinforces the low framing.
  const ownBook =
    t.realAnnual != null
      ? ` We've bound ${an(t.noun)} ${t.noun} for around ${money(t.realAnnual)}/yr.`
      : "";

  return withConstructionHazardReview({
    title: t.requiresReview
      ? `${t.name} Insurance - Coverage & Quote Checklist`
      : `${t.name} Insurance - Costs from ${floor}/mo & Instant Quotes`,
    metaDescription: t.requiresReview
      ? `What to prepare for a ${t.noun} insurance review, which operations change the market, and how to request an individual quote.`
      : `What ${t.noun} insurance really costs (from ${floor}/mo), what GCs make you carry, and how to get a quote in minutes. Licensed contractor insurance agency.`,
    heroH1: `${t.name} Insurance`,
    heroSub: t.requiresReview
      ? `Prepare the operations, payroll, sales, equipment, contracts, and loss details a licensed agent needs to request an individual quote.`
      : t.hedgeOnly
      ? `See what ${plural(t.noun)} pay, starting around ${floor}/mo, and tell us about your work to get a quote back fast.`
      : `See what ${plural(t.noun)} actually pay, starting as low as ${floor}/mo, and get your own quote in a few minutes.`,
    alsoCovers: t.alsoCovers,
    costNarrative: t.requiresReview
      ? [
          `${t.name} pricing depends on the exact work, customer types, contracts, payroll, sales, equipment and loss history. ${marketNote}`,
          `Keep those facts and requested limits consistent across proposals. Compare accepted operations, exclusions, deductibles, endorsements and total cost instead of treating a generic online starting price as your quote.`,
        ]
      : [
          `${t.name} general liability starts as low as ${floor}/mo if you're a small owner-operator${
            bundle ? `, or about ${bundle}/mo once you add your tools` : ""
          }.${ownBook} ${marketNote}`,
          `Most ${plural(t.noun)} who get a high quote aren't paying for the risk. They're paying for how they got classified. Your payroll, the work you actually do, and your claims move the price a lot more than your zip code does.`,
        ],
    costDisclaimer: t.requiresReview
      ? "Pricing is individual to the operation and proposed policy. This checklist is not a quote or an offer of insurance."
      : undefined,
    costRows: t.requiresReview ? [
      {
        coverage: "General liability",
        range: "Individual quote",
        note: "Match the work description, customer types, limits, and endorsements to the actual contracts you take.",
      },
      {
        coverage: "Tools & equipment",
        range: "Selected limit",
        note: "List owned, rented, borrowed, mobile, and shop equipment separately where applicable.",
      },
      {
        coverage: "Workers' comp",
        range: "Priced on payroll",
        note: "Report employees, owners, and hired businesses accurately and review the applicable state rules.",
      },
      {
        coverage: t.needsEO ? "Professional liability (E&O)" : "Commercial auto",
        range: "Policy-specific",
        note: t.needsEO
          ? "Review written reports, professional opinions, and any exclusions separately from general liability."
          : "Identify business vehicles, drivers, radius, and how vehicles are used for the work.",
      },
    ] : [
      {
        coverage: "General liability",
        range: `from ${floor}/mo`,
        note: `Where ${an(t.noun)} small ${t.noun} with little payroll starts. More sales and employees move it up.`,
      },
      ...(bundle
        ? [
            {
              coverage: "GL + tools & equipment",
              range: `from ${bundle}/mo`,
              note: "Your liability plus your tools, covered if they're stolen or wrecked on the job.",
            },
          ]
        : []),
      {
        coverage: "Workers' comp",
        range: "Priced on payroll",
        note: "Required in almost every state once you have employees. Usually your biggest line once you've got a crew.",
      },
      {
        coverage: "Commercial auto",
        range: "Add-on",
        note: "For the work truck or van. Personal auto won't pay a claim if you were working.",
      },
    ],
    priceDrivers: priceDrivers(t),
    coverages: coverageSpine(t),
    stateFacts: [],
    faqs: [...sharedFaqs(t), ...(t.faqExtra ?? [])],
    ...(t.slug === "pool" ? swimmingPoolContent() : {}),
  }, t.slug);
}

// ---- lookups ----------------------------------------------------------------

export const TRADE_VERTICALS = TRADES.map((t) => t.slug);

export function getTrade(slug: string): Trade | undefined {
  return TRADES.find((t) => t.slug === slug);
}

export function getContractorNationalContent(slug: string): PageContent | undefined {
  const t = getTrade(slug);
  return t ? buildContractorNational(t) : undefined;
}
