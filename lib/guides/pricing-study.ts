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
          { label: "Roofing and tree service prices by state and bound policy: 2026", href: "/guides/roofing-and-tree-service-insurance-prices-2026" },
          { label: "Tree service insurance cost: 2026 data", href: "/guides/tree-service-insurance-cost-2026-data" },
          { label: "Compare two roofing GL quotes on the same business", href: "/guides/compare-roofing-general-liability-quotes" },
          { label: "Contractor insurance cost by trade: 2026 data", href: "/guides/contractor-insurance-cost-by-trade-2026" },
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
          { label: "Roofing and tree service prices by state and bound policy: 2026", href: "/guides/roofing-and-tree-service-insurance-prices-2026" },
          { label: "Roofing insurance cost: 2026 data", href: "/guides/roofing-insurance-cost-2026-data" },
          { label: "Contractor insurance cost by trade: 2026 data", href: "/guides/contractor-insurance-cost-by-trade-2026" },
        ],
      },
    ],
  },
  {
    ...common,
    slug: "general-contractor-insurance-cost-2026-data",
    title: "What general contractors pay for liability insurance in 2026: data from 263 quotes",
    metaTitle: "General Contractor Insurance Cost 2026: 263 Quotes",
    description: "Across 263 residential general contractors and remodelers quoted in fall 2026, the cheapest $1M/$2M GL was $894 a year occurrence or $638 claims-made. Other carriers' median was $1,150.",
    intro: "We quoted general liability for 263 residential general contractors and remodelers between September 25 and November 19, 2026, all at $1 million per occurrence and $2 million aggregate. For a contractor under $500,000 in revenue, the cheapest market was $894 a year for an occurrence policy and $638 for claims-made. Other carriers' median quote for the same contractors was $1,150.",
    industry: "General contractors",
    tradeLabel: "General contractor",
    insurancePath: "/insurance/general-contractor",
    sections: [
      {
        id: "headline",
        title: "What a typical general contractor pays",
        paragraphs: [
          "The median contractor we quoted had $200,000 in annual revenue. At the cheapest carrier, an occurrence policy was $894 a year and claims-made was $638, and that price held flat from under $100,000 all the way to $500,000 in revenue.",
          "Other carriers quoted the same contractors a median of $1,150 a year for the same limits.",
        ],
      },
      {
        id: "by-revenue",
        title: "General contractor GL price by revenue",
        paragraphs: [
          "Under $500,000 revenue: $894 occurrence, $638 claims-made (median, 102 businesses).",
          "Over $1 million revenue: $13,827 occurrence, $8,591 claims-made (median, 11 businesses).",
          "Most of the price jump comes after $500,000. Subcontracted work matters too: carriers want to see certificates from your subs, and uninsured subs raise the price.",
        ],
      },
      {
        id: "occurrence-vs-claims-made",
        title: "Occurrence vs claims-made for contractors",
        paragraphs: [
          "Construction claims often come years after the job. Occurrence covers any claim from work done while the policy was active, even if the lawsuit comes after you retire. Claims-made costs about 30% less, but if you retire and a homeowner sues 10 years later, you'd need tail coverage.",
          "Many GC contracts require occurrence coverage. Check yours before choosing the lower price.",
        ],
        checklist: [
          "Get quotes from at least 3 different carriers.",
          "Give every carrier the same revenue, subcontracted cost and type of work.",
          "Ask for both an occurrence and a claims-made price.",
        ],
      },
      {
        id: "method",
        title: "How we got these numbers",
        paragraphs: [
          "These are real quotes from Cohesive Insurance, September 25 to November 19, 2026. We counted only quotes where the carrier rated the business as a residential general contractor or remodeler, kept the cheapest quote per business, carrier and policy form, and used $1 million per occurrence / $2 million aggregate limits. Free to cite with a link to this page.",
        ],
        links: [
          { label: "Contractor insurance cost by trade: 2026 data", href: "/guides/contractor-insurance-cost-by-trade-2026" },
          { label: "Roofing insurance cost: 2026 data", href: "/guides/roofing-insurance-cost-2026-data" },
        ],
      },
    ],
  },
  {
    ...common,
    slug: "contractor-insurance-cost-by-trade-2026",
    title: "Contractor insurance cost by trade in 2026: real quotes for 8 trades",
    metaTitle: "Contractor Insurance Cost by Trade (2026 Data)",
    description: "What roofers, tree services, general contractors, landscapers, painters, handymen, cleaners and HVAC contractors paid for $1M/$2M general liability in fall 2026.",
    intro: "We quoted general liability for more than 900 contracting and service businesses between September 25 and November 19, 2026. Here is the median price at the cheapest carrier for each trade, for $1 million per occurrence and $2 million aggregate limits.",
    industry: "Contractors",
    tradeLabel: "Contractor",
    insurancePath: "/insurance/general-contractor",
    sections: [
      {
        id: "by-trade",
        title: "General liability price by trade",
        paragraphs: [
          "Roofing (271 businesses): $1,895 occurrence, $1,447 claims-made. Other carriers' median: $3,274.",
          "Tree service (226 businesses): $1,707 occurrence, $1,271 claims-made. Other carriers' median: $1,742.",
          "General contractor / remodeler (263 businesses): $894 occurrence, $638 claims-made. Other carriers' median: $1,150.",
          "Landscaping (44 businesses): $1,228 occurrence, $935 claims-made.",
          "Painting (34 businesses): $894 occurrence, $638 claims-made.",
          "Handyman (38 businesses): $869 occurrence, $575 claims-made.",
          "Cleaning / janitorial (28 businesses): $986 occurrence, $693 claims-made.",
          "HVAC (15 businesses): $894 occurrence, $638 claims-made.",
        ],
      },
      {
        id: "what-drives-price",
        title: "What drives the price",
        paragraphs: [
          "Trade comes first: roofing costs about twice what general remodeling does, because falls and water damage claims are expensive. Revenue comes next, and for most trades the price barely moves until about $500,000. Carrier choice is the third big lever; the same business often gets quotes 2-3x apart.",
          "Claims-made ran about 25-35% below occurrence in every trade. Claims-made covers claims made while the policy is active; if you retire and a customer sues years later, you'd need tail coverage. Occurrence covers that automatically.",
        ],
        checklist: [
          "Make sure your policy class matches the work you actually do.",
          "Get quotes from at least 3 different carriers.",
          "Ask for both an occurrence and a claims-made price.",
        ],
      },
      {
        id: "method",
        title: "How we got these numbers",
        paragraphs: [
          "These are real quotes from Cohesive Insurance, September 25 to November 19, 2026. Each trade counts only quotes where the carrier rated the business in that trade. We kept the cheapest quote per business, carrier and policy form, and show the median for businesses under $500,000 in revenue where that differs. Free to cite with a link to this page.",
        ],
        links: [
          { label: "Roofing insurance cost: 2026 data", href: "/guides/roofing-insurance-cost-2026-data" },
          { label: "Tree service insurance cost: 2026 data", href: "/guides/tree-service-insurance-cost-2026-data" },
          { label: "General contractor insurance cost: 2026 data", href: "/guides/general-contractor-insurance-cost-2026-data" },
        ],
      },
    ],
  },
];
