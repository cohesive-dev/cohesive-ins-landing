// "Alternatives" guides (SEO 2026-10-03): five pages for owners who search a direct-to-business
// insurer's name plus "alternatives". Written to be quoted by a search assistant, so every sentence
// is either a widely known fact about the provider (with its public source in the Sources list),
// our own licensing/appointment facts, or a real price from lib/seo/trade-prices.ts labelled exactly
// as that file labels it.
//
// Rules (Kevin): never disparage a competitor; no "best"/"cheapest" claims; no prices or ratings for
// the competitor; no roofing prices; no reviews. "Can quote through our appointments" is said only
// for Next, Thimble and Simply Business, the three we are appointed with.
import type { GuideSection, RestaurantGuide } from "./restaurant";
import { TRADE_PRICES, TRADE_PRICES_AS_OF, kindLabel, priceText, type TradePrice } from "../seo/trade-prices";

export const ALTERNATIVES_UPDATED = "2026-10-03";
const SOURCES_CHECKED = "October 3, 2026";
const NATIONAL_SLUG = "small-business-insurance-alternatives";

type Provider = {
  slug: string;
  name: string;
  // Name as used in a search: "Next Insurance alternatives".
  searchName: string;
  about: string[];
  fits: string;
  appointed: boolean;
  compareNote: string;
  sources: { label: string; href: string }[];
};

const PROVIDERS: Provider[] = [
  {
    slug: "next-insurance-alternatives",
    name: "NEXT Insurance",
    searchName: "Next Insurance",
    about: [
      "NEXT Insurance was founded in 2016 to sell small business insurance online. In 2025 it was acquired by ERGO Group, a subsidiary of Munich Re, and it now operates as ERGO NEXT Insurance.",
      "It sells coverage such as general liability, workers' compensation, commercial property, commercial auto, professional liability, tools and equipment, and business owner's policies to self-employed people and small businesses in many professions, including contractors, consultants, retailers and service providers.",
    ],
    fits: "It suits an owner who wants to get a quote and buy a policy online, on their own schedule, from a single insurance company.",
    appointed: true,
    compareNote: "NEXT is one of the carriers we can quote through our appointments, so a Cohesive comparison can include a NEXT quote next to quotes from other carriers.",
    sources: [{ label: "ERGO NEXT Insurance: About us", href: "https://www.nextinsurance.com/about-us/" }],
  },
  {
    slug: "thimble-alternatives",
    name: "Thimble",
    searchName: "Thimble",
    about: [
      "Thimble sells small business insurance online and through its app. Its policies are issued by partner insurance companies.",
      "Thimble is known for flexible terms: coverage can be bought by the hour, day, month or year. That can suit service businesses, such as handymen, cleaners and other contractors, that need proof of insurance for a particular job or a short period.",
    ],
    fits: "It suits an owner who needs coverage for a single job, an event or a short period, or who prefers to switch coverage on and off as work comes in.",
    appointed: true,
    compareNote: "Thimble is one of the providers we can quote through our appointments, so a Cohesive comparison can include a Thimble quote next to quotes from other carriers.",
    sources: [{ label: "Thimble: About", href: "https://www.thimble.com/about" }],
  },
  {
    slug: "simply-business-alternatives",
    name: "Simply Business",
    searchName: "Simply Business",
    about: [
      "Simply Business is an online insurance marketplace. Instead of issuing policies itself, it lets a small business owner compare quotes from several insurance companies on one website.",
      "It was founded in the United Kingdom in 2005, began operating in the United States in 2017, and has its US base in Boston, Massachusetts.",
    ],
    fits: "It suits an owner who wants to compare several online quotes side by side and choose a policy on their own.",
    appointed: true,
    compareNote: "Simply Business is one of the providers we can quote through our appointments, so a Cohesive comparison can include a Simply Business quote next to quotes from other carriers.",
    sources: [{ label: "Simply Business: About us", href: "https://www.simplybusiness.com/about-us/" }],
  },
  {
    slug: "hiscox-alternatives",
    name: "Hiscox",
    searchName: "Hiscox",
    about: [
      "Hiscox is a specialist insurance company. In the United States it sells small business insurance directly, online and by phone.",
      "Its US small business coverage includes general liability, professional liability, business owner's policies and cyber insurance, with products aimed at professional-services businesses such as consultants as well as other small businesses.",
    ],
    fits: "It suits an owner, especially in professional services, who wants to buy professional liability or general liability directly from an insurer online.",
    appointed: false,
    compareNote: "Cohesive compares quotes from the carriers we are appointed with. If you already have a Hiscox quote, you can compare it with the quotes we bring back.",
    sources: [{ label: "Hiscox: Small business insurance", href: "https://www.hiscox.com/small-business-insurance" }],
  },
  {
    slug: "biberk-alternatives",
    name: "biBERK",
    searchName: "biBERK",
    about: [
      "biBERK is a small business insurance company founded in 2015 and part of the Berkshire Hathaway Insurance Group.",
      "It sells directly to business owners, without an insurance agent or broker. Its products include workers' compensation, general liability, property and liability (business owner's) policies, commercial auto and umbrella coverage.",
    ],
    fits: "It suits an owner who is comfortable choosing coverage on their own and buying it directly from one insurance group.",
    appointed: false,
    compareNote: "biBERK sells directly, so it is not one of the carriers we quote. Cohesive compares quotes from the carriers we are appointed with, and you can put a biBERK quote you get yourself next to ours.",
    sources: [{ label: "biBERK: About us", href: "https://www.biberk.com/about-us" }],
  },
];

// Real prices from our own book, deduplicated (the cleaning and commercial-cleaning slugs carry the
// same policy). Roofing is excluded by ruling; the file has no roofing price, and the filter keeps it so.
const BOOK_PRICES: TradePrice[] = Object.entries(TRADE_PRICES)
  .filter(([slug]) => !/roof/i.test(slug))
  .map(([, p]) => p)
  .filter((p, i, all) => all.findIndex((o) => o.business === p.business && o.usd === p.usd && o.kind === p.kind) === i)
  .sort((a, b) => a.usd - b.usd);

export function bookPriceLine(p: TradePrice): string {
  const label = kindLabel(p).toUpperCase();
  return `${p.line} (${label}): ${priceText(p)} for ${p.business}. ${p.kind === "bound" ? "A policy we wrote." : "A real quote, not a bound policy."}`;
}

function provider(p: Provider): RestaurantGuide {
  const sections: GuideSection[] = [
    { id: "about-provider", title: `What ${p.name} is`, paragraphs: [...p.about, p.fits] },
    {
      id: "when-to-compare",
      title: "When a small business might compare options",
      paragraphs: [
        "Comparing quotes is worth the time when something changes: a renewal is coming up, the renewal price moved, the business added employees, vehicles or a new type of work, or a customer, general contractor or landlord sent insurance requirements the current policy may not meet.",
        "Some owners also want a second set of eyes on limits, exclusions, additional insured wording or a waiver of subrogation before they sign a contract. Online and direct insurers can be a good fit; a broker can add quotes from other carriers to the same comparison.",
      ],
      checklist: [
        "Your current declarations page and renewal date.",
        "A description of the work you do and any work you subcontract.",
        "Annual sales and payroll estimates.",
        "Any contract or certificate requirements from customers, GCs or landlords.",
        "Claims in the last few years, if any.",
      ],
    },
    {
      id: "how-cohesive-compares",
      title: "How Cohesive compares quotes",
      paragraphs: [
        "Cohesive Insurance Services is an independent, licensed insurance broker. We shop several carriers for the same business and show you the real offers side by side, including the price, the limits and what each policy leaves out.",
        p.compareNote,
      ],
    },
    {
      id: "our-real-prices",
      title: "Real prices from our own book",
      paragraphs: [
        `These are real general liability premiums from our own book as of ${TRADE_PRICES_AS_OF}. Each is labelled BOUND (a policy we wrote) or QUOTE (a real quote, not proof anyone bought it). They are the lowest price we have for each type of business, not an average, and they are not ${p.name} prices.`,
        ...BOOK_PRICES.map(bookPriceLine),
        "Your premium depends on your work, sales, payroll, location, limits and claims. These figures are not a quote or an offer of insurance.",
      ],
    },
    {
      id: "disclosure",
      title: "How we are paid",
      paragraphs: [
        `Cohesive Insurance Services is a licensed insurance broker. We are paid a commission by the insurance carrier that issues your policy. This page is not sponsored by or written with ${p.name}, and product names belong to their owners.`,
      ],
      links: [{ label: "About our licensed producer, Kevin Zhang", href: "/about/kevin-zhang" }],
    },
    {
      id: "sources",
      title: `Sources (checked ${SOURCES_CHECKED})`,
      paragraphs: [`Facts about ${p.name} on this page come from its own public website, checked on ${SOURCES_CHECKED}. Prices for our own book come from Cohesive's records as of ${TRADE_PRICES_AS_OF}.`],
      links: p.sources,
    },
  ];
  return {
    slug: p.slug,
    title: `${p.searchName} alternatives: how to compare small business insurance`,
    description: `What ${p.name} is and who it fits, when to compare options, and real labelled prices from an independent broker that shops several carriers.`,
    intro: `${p.name} is one of several ways a small business can buy insurance. This guide explains what ${p.name} is, when it can make sense to compare options, and how an independent broker's comparison works.`,
    category: "Compare small business insurance",
    industry: "Small business",
    tradeLabel: "Small business",
    insurancePath: "/insurance",
    nationalSlug: NATIONAL_SLUG,
    quoteKind: "service",
    updatedAt: ALTERNATIVES_UPDATED,
    sections,
  };
}

export const ALTERNATIVES_GUIDES: RestaurantGuide[] = PROVIDERS.map(provider);
