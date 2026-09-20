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
  { href: "/insurance/roofer/oklahoma", label: "Roofing insurance in Oklahoma" },
  { href: "/insurance/roofer/georgia", label: "Roofing insurance in Georgia" },
  { href: "/insurance/hvac/texas", label: "HVAC insurance in Texas" },
  { href: "/insurance/handyman/new-hampshire", label: "Handyman insurance in New Hampshire" },
  { href: "/insurance/welding/texas", label: "Welding insurance in Texas" },
  { href: "/insurance/deck-builder/missouri", label: "Deck-builder insurance in Missouri" },
  { href: "/insurance/foundation-repair/pennsylvania", label: "Foundation-repair insurance in Pennsylvania" },
  { href: "/insurance/pest-control/pennsylvania", label: "Pest-control insurance in Pennsylvania" },
] as const;
