// A deliberately small set of state guides promoted from the insurance hub.
// These routes are backed by recent completed inquiries, search clicks, or both.
// Keep the public labels useful to a visitor; outcome counts belong in private
// analytics, not in page copy.
export const OUTCOME_PRIORITY_LINKS = [
  { href: "/insurance/restaurant/wisconsin", label: "Restaurant insurance in Wisconsin" },
  { href: "/insurance/restaurant/pennsylvania", label: "Restaurant insurance in Pennsylvania" },
  { href: "/insurance/commercial-property", label: "Commercial property insurance for building owners" },
  { href: "/insurance/welding/maine", label: "Welding insurance in Maine" },
  { href: "/insurance/cleaning/new-jersey", label: "Cleaning insurance in New Jersey" },
  { href: "/insurance/snow-removal/virginia", label: "Snow-removal insurance in Virginia" },
  { href: "/insurance/snow-removal/wisconsin", label: "Snow-removal insurance in Wisconsin" },
  // Oklahoma swapped for Texas and Colorado (2026-10-22): our roofing market does not write Oklahoma, so its page has no price.
  { href: "/insurance/roofer/texas", label: "Roofing insurance in Texas" },
  { href: "/insurance/roofer/colorado", label: "Roofing insurance in Colorado" },
  { href: "/insurance/roofer/georgia", label: "Roofing insurance in Georgia" },
  { href: "/insurance/hvac/texas", label: "HVAC insurance in Texas" },
  { href: "/insurance/handyman/new-hampshire", label: "Handyman insurance in New Hampshire" },
  { href: "/insurance/welding/texas", label: "Welding insurance in Texas" },
  { href: "/insurance/deck-builder/missouri", label: "Deck-builder insurance in Missouri" },
  { href: "/insurance/foundation-repair/pennsylvania", label: "Foundation-repair insurance in Pennsylvania" },
  { href: "/insurance/pest-control/pennsylvania", label: "Pest-control insurance in Pennsylvania" },
] as const;

// Cost and workers' comp guides (2026-10-16 discovery pass). On 2026-10-16 URL Inspection reported
// /guides/workers-comp-insurance-for-remodelers, /guides/restaurant-workers-comp-insurance and
// /guides/bakery-insurance-cost as "URL is unknown to Google", and /guides/restaurant-insurance-cost and
// /guides/workers-comp-cost-for-contractors as "Discovered - currently not indexed". The homepage (crawled
// most often), /insurance and /guides link them directly so Googlebot reaches them in one hop. The homepage
// footer renders this same list (`short` labels), so the surfaces cannot drift.
// /insurance/roofer joined on 2026-10-22: the already-indexed roofer hub now answers "roofing insurance cost" with real
// prices by revenue, so it is linked one hop from the homepage like the cost guides.
export const COST_GUIDE_LINKS = [
  { href: "/insurance/roofer", label: "What roofing insurance costs: real prices by revenue", short: "Roofing insurance cost" },
  { href: "/guides/restaurant-insurance-cost", label: "What restaurant insurance costs: real policies and quotes", short: "Restaurant insurance cost" },
  { href: "/guides/restaurant-workers-comp-insurance", label: "Restaurant workers' comp: what sets the price", short: "Restaurant workers' comp" },
  { href: "/guides/bakery-insurance-cost", label: "What bakery insurance costs", short: "Bakery insurance cost" },
  { href: "/guides/coffee-shop-insurance-cost", label: "What coffee shop insurance costs", short: "Coffee shop insurance cost" },
  { href: "/guides/workers-comp-cost-for-contractors", label: "What workers' comp costs contractors: real policies", short: "Workers' comp cost for contractors" },
  { href: "/guides/contractor-workers-comp-insurance", label: "Workers' comp for contractors: what it covers", short: "Contractor workers' comp" },
  { href: "/guides/workers-comp-insurance-for-remodelers", label: "Workers' comp for remodelers", short: "Workers' comp for remodelers" },
] as const;
