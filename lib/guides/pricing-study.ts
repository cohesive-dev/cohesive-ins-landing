import type { RestaurantGuide } from "./restaurant";

// 2026 GL pricing study (Kevin 2026-11-19 approved the figures). Source: Cohesive's own quotes, Sep 25 - Nov 19,
// 2026, rated by the carrier as roofing or tree work; cheapest quote per business, carrier and policy form;
// $1M per occurrence / $2M aggregate. Aggregate only - no client or carrier names. This is the URL every
// outside placement (trade pubs, vendor blogs, podcasts) links to, so keep the slugs stable.
const common = { category: "Pricing data", quoteKind: "service" as const, updatedAt: "2026-11-19", nationalSlug: "contractor-quote-checklists" };

export const PRICING_STUDY_GUIDES: RestaurantGuide[] = [
  {
    ...common,
    slug: "roofing-insurance-cost-2026-data",
    title: "What roofers pay for general liability in 2026: data from 271 quotes",
    metaTitle: "Roofing Insurance Cost 2026: Data From 271 Quotes",
    description: "Across 271 roofing businesses quoted in fall 2026, the cheapest $1M/$2M GL came in at $1,359-$1,895 a year. Other carriers' median quote was $3,274.",
    intro: "We quoted general liability for 271 roofing businesses between September 25 and November 19, 2026, all at $1 million per occurrence and $2 million aggregate. The cheapest market for a typical roofer was $1,359-$1,895 a year. The median quote from other carriers for the same roofers was $3,274.",
    industry: "Roofing contractors",
    tradeLabel: "Roofer",
    insurancePath: "/insurance/roofer",
    sections: [
      {
        id: "headline",
        title: "What a typical roofer pays",
        paragraphs: [
          "The median roofing business we quoted had $475,000 in annual revenue. At the cheapest carrier, the most common claims-made price was $1,359 a year and the median was $1,447. Occurrence policies had a median of $1,895 a year.",
          "Other carriers quoted the same roofers a median of $3,274 a year for the same limits. Shopping carriers, not just agents, is the single biggest way roofers lower their GL bill.",
        ],
      },
      {
        id: "by-revenue",
        title: "Roofing GL price by revenue",
        paragraphs: [
          "$100,000-$250,000 revenue: $1,359 claims-made, $1,795 occurrence (median, 28 businesses).",
          "$250,000-$500,000 revenue: $1,447 claims-made, $1,895 occurrence (median, 78 businesses).",
          "$500,000-$1 million revenue: $2,431 claims-made, $3,568 occurrence (median, 10 businesses).",
          "Over $1 million revenue: $10,315 claims-made, $16,688 occurrence (median, 8 businesses).",
          "The price barely moves until about $500,000 in revenue. A roofer doing $200,000 and one doing $450,000 paid nearly the same. Past $500,000 the claims-made median almost doubles.",
        ],
      },
      {
        id: "claims-made-vs-occurrence",
        title: "Claims-made vs occurrence for roofers",
        paragraphs: [
          "Claims-made ran about 25% cheaper: $1,447 vs $1,895 at the median. Claims-made covers claims made while your policy is active. If you retire and a homeowner sues 10 years later over a roof you installed, you'd need tail coverage. Occurrence covers that automatically.",
          "If a general contractor's contract asks for occurrence coverage, get the occurrence price. Otherwise claims-made is the lower-cost way to carry the same limits.",
        ],
        checklist: [
          "Get quotes from at least 3 different carriers.",
          "Give every carrier the same revenue, subcontracted cost and residential/commercial split.",
          "Ask for both a claims-made and an occurrence price.",
        ],
      },
      {
        id: "method",
        title: "How we got these numbers",
        paragraphs: [
          "These are real quotes from Cohesive Insurance, September 25 to November 19, 2026. We counted only quotes where the carrier rated the business as roofing, kept the cheapest quote per business, carrier and policy form, and used $1 million per occurrence / $2 million aggregate limits. Free to cite with a link to this page.",
        ],
        links: [
          { label: "Tree service insurance cost: 2026 data", href: "/guides/tree-service-insurance-cost-2026-data" },
          { label: "Compare two roofing GL quotes on the same business", href: "/guides/compare-roofing-general-liability-quotes" },
        ],
      },
    ],
  },
  {
    ...common,
    slug: "tree-service-insurance-cost-2026-data",
    title: "What tree services pay for general liability in 2026: data from 226 quotes",
    metaTitle: "Tree Service Insurance Cost 2026: 226 Real Quotes",
    description: "Across 226 tree service businesses quoted in fall 2026, most crews under $250K revenue were quoted $1,271 a year for $1M/$2M claims-made GL.",
    intro: "We quoted general liability for 226 tree service businesses between September 25 and November 19, 2026, all at $1 million per occurrence and $2 million aggregate. Most crews under $250,000 in revenue were quoted $1,271 a year claims-made, or $1,707 occurrence.",
    industry: "Tree service",
    tradeLabel: "Tree service",
    insurancePath: "/insurance/tree-service",
    sections: [
      {
        id: "headline",
        title: "What a typical tree service pays",
        paragraphs: [
          "The median tree service we quoted had $200,000 in annual revenue. At the cheapest carrier, the median claims-made price was $1,271 a year and the median occurrence price was $1,707. Other carriers quoted the same businesses a median of $1,742.",
        ],
      },
      {
        id: "by-revenue",
        title: "Tree service GL price by revenue",
        paragraphs: [
          "Under $250,000 revenue: $1,271 claims-made, $1,707 occurrence (median, 96 businesses).",
          "$250,000-$500,000 revenue: $1,431 claims-made, $1,910 occurrence (median, 10 businesses).",
          "Revenue is the biggest driver. Crew size and equipment matter much less for general liability than most owners expect; they drive workers' comp and auto instead.",
        ],
      },
      {
        id: "class",
        title: "Make sure you're rated as tree work",
        paragraphs: [
          "Tree work is often written as landscaping or lawn care. The wrong class can leave tree removal excluded or price the policy for the wrong work. Check that your declarations page says tree trimming or removal.",
          "Claims-made ran about 25% cheaper than occurrence. Claims-made covers claims made while the policy is active. If you retire and a claim comes years later, you'd need tail coverage; occurrence covers that automatically.",
        ],
        checklist: [
          "Confirm your policy class is tree trimming or removal, not landscaping.",
          "Get quotes from at least 3 different carriers.",
          "Ask for both a claims-made and an occurrence price.",
        ],
      },
      {
        id: "method",
        title: "How we got these numbers",
        paragraphs: [
          "These are real quotes from Cohesive Insurance, September 25 to November 19, 2026. We counted only quotes where the carrier rated the business as tree work, kept the cheapest quote per business, carrier and policy form, and used $1 million per occurrence / $2 million aggregate limits. Free to cite with a link to this page.",
        ],
        links: [
          { label: "Roofing insurance cost: 2026 data", href: "/guides/roofing-insurance-cost-2026-data" },
        ],
      },
    ],
  },
];
