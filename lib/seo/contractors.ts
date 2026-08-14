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

import type { PageContent } from "./data";

export type Trade = {
  slug: string;
  name: string; // Title Case display name
  noun: string; // lowercase noun for sentences ("an electrician's business")
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
    noun: "snow-removal business",
    glFrom: 59,
    bopFrom: 79,
    alsoCovers: "Also for plowing, salting/de-icing, and ice management.",
    driversExtra: ["Slip-and-fall / ice-management exposure and hold-harmless terms", "Commercial lots vs. residential driveways"],
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
    name: "Pool & Spa",
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
    : t.esRoute
      ? "Higher-risk trades like this go through a specialty market, so give it a business day or two. We can usually still get a COI out fast once the terms are set."
      : "Most trades bind same-day, and we send the COI the minute you bind. Often the same day the GC or property manager asks for it.";
  return [
    {
      q: `How much does ${t.noun} insurance cost?`,
      a: `General liability for ${an(t.noun)} ${t.noun} starts as low as ${money(t.glFrom)}/mo if you're a small owner-operator${
        t.bopFrom ? `, or about ${money(t.bopFrom)}/mo with your tools added` : ""
      }. What you actually pay comes down to payroll, sales, the work you do, and your claims. If you're paying way more than that right now, it's usually how you got classified, not the risk itself.`,
    },
    {
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

export function buildContractorNational(t: Trade): PageContent {
  const floor = money(t.glFrom);
  const bundle = t.bopFrom ? money(t.bopFrom) : null;
  const marketNote = t.hedgeOnly
    ? "This one doesn't quote through the online carriers, so we run it through our specialty desk, the market that writes it every day, and shop it to keep the number down."
    : t.esRoute
      ? "It's a higher-risk trade, so the best rates come from specialty markets that write it every day, not a standard small-business carrier."
      : "It quotes fast, and a solo operator with no crew lands near the low end.";
  // Substantiated own-book anchor (§349-safe): only cited where we have a real
  // recent quote/bind and it reinforces the low framing.
  const ownBook =
    t.realAnnual != null
      ? ` We've bound ${an(t.noun)} ${t.noun} for around ${money(t.realAnnual)}/yr.`
      : "";

  return {
    title: `${t.name} Insurance - Costs from ${floor}/mo & Instant Quotes`,
    metaDescription: `What ${t.noun} insurance really costs (from ${floor}/mo), what GCs make you carry, and how to get a quote in minutes. Licensed contractor insurance agency.`,
    heroH1: `${t.name} Insurance`,
    heroSub: t.hedgeOnly
      ? `See what ${plural(t.noun)} pay, starting around ${floor}/mo, and tell us about your work to get a quote back fast.`
      : `See what ${plural(t.noun)} actually pay, starting as low as ${floor}/mo, and get your own quote in a few minutes.`,
    alsoCovers: t.alsoCovers,
    costNarrative: [
      `${t.name} general liability starts as low as ${floor}/mo if you're a small owner-operator${
        bundle ? `, or about ${bundle}/mo once you add your tools` : ""
      }.${ownBook} ${marketNote}`,
      `Most ${plural(t.noun)} who get a high quote aren't paying for the risk. They're paying for how they got classified. Your payroll, the work you actually do, and your claims move the price a lot more than your zip code does.`,
    ],
    costRows: [
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
    faqs: sharedFaqs(t),
  };
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
