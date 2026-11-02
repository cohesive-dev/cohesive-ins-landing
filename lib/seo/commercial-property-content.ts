import type { PageContent } from "./data";

// The paid landing pages collect underwriting detail. This is the crawlable,
// plain-language companion for owners researching the coverage before they
// are ready to complete that intake.
export const COMMERCIAL_PROPERTY_UPDATED = "2026-09-20";

export const COMMERCIAL_PROPERTY_CONTENT: PageContent = {
  title: "Commercial Property Insurance for Building Owners",
  metaDescription:
    "Compare commercial building insurance for retail, office, mixed-use, apartment, warehouse, and religious properties. Learn which building facts affect a quote.",
  heroH1: "Commercial property insurance for building owners",
  heroSub:
    "Insure the building you own. Prepare the construction, occupancy, roof, systems, value, and loss details an underwriter needs to compare terms.",
  alsoCovers:
    "For retail and office buildings, mixed-use property, apartments with 5+ units, warehouses, and religious institutions.",
  reviewedOn: COMMERCIAL_PROPERTY_UPDATED,
  costNarrative: [
    "Commercial building insurance is priced from the property itself: location, replacement cost, construction, occupancy, protection, roof and system updates, and loss history. A useful comparison keeps those facts and requested limits the same across every quote.",
    "A lower premium is not automatically a better result. Compare covered causes of loss, valuation, coinsurance, deductibles, wind or hail terms, water limitations, vacancy provisions, and business-income or rental-income coverage before choosing.",
  ],
  costDisclaimer:
    "Commercial property pricing is individual to the building and requested coverage. The entries below are quote components, not premium estimates or an offer of insurance.",
  costRows: [
    {
      coverage: "Building",
      range: "Individual quote",
      note: "Start with a supportable replacement-cost estimate and identify building fixtures and improvements.",
    },
    {
      coverage: "Business or landlord property",
      range: "Selected limit",
      note: "Identify property you own at the location instead of assuming the building limit includes every item.",
    },
    {
      coverage: "Business income / rental income",
      range: "Selected period and limit",
      note: "Review the waiting period, covered cause of loss, restoration period, and how income is documented.",
    },
    {
      coverage: "Wind, hail, water, and equipment breakdown",
      range: "Policy-specific",
      note: "Confirm inclusions, exclusions, sublimits, and deductibles on the actual proposal.",
    },
  ],
  priceDrivers: [
    "Full property address and distance to fire protection",
    "Replacement value, square footage, number of stories, and construction type",
    "Current tenants or operations, occupancy percentage, and any vacancy",
    "Building year and the ages of the roof, electrical, plumbing, and heating systems",
    "Sprinklers, alarms, security, and other protection features",
    "Claims and requested effective date, limits, valuation, and deductibles",
  ],
  coverages: [
    {
      name: "Building coverage",
      desc: "Review what the form treats as the building, which causes of loss apply, the valuation basis, coinsurance, and the deductible. The declarations alone do not show every limitation.",
    },
    {
      name: "Business personal property",
      desc: "Furniture, equipment, inventory, and other property may need a separate limit. A landlord and a tenant should each identify what they own and are responsible for insuring.",
    },
    {
      name: "Business or rental income",
      desc: "Income coverage can respond when a covered property loss interrupts operations or rent, subject to the policy's waiting period, limits, and restoration terms.",
    },
    {
      name: "Equipment breakdown",
      desc: "Ask how the proposal treats mechanical and electrical breakdown. Do not assume ordinary wear, deferred maintenance, or every utility interruption is covered.",
    },
    {
      name: "Ordinance or law",
      desc: "Older buildings may need added limits for demolition and code-required upgrades after a covered loss. Confirm the proposed limits against the property and local requirements.",
    },
    {
      name: "Liability and umbrella",
      desc: "Property coverage is not a substitute for reviewing premises liability, contractual requirements, or umbrella limits. Keep the building and liability comparison explicit.",
    },
  ],
  stateFacts: [
    {
      title: "A businessowners policy can combine several coverages",
      body: "The NAIC describes a BOP as commonly combining general liability, commercial property, and business interruption for qualifying small businesses. Building-owner risks may instead use separate property and liability forms, so compare the actual proposal rather than relying on the package name.",
      source: {
        label: "NAIC: business interruption and businessowners policies",
        href: "https://content.naic.org/insurance-topics/business-interruption-and-business-owner-policy",
      },
    },
    {
      title: "Keep an evidence packet for each building",
      body: "Prepare current photos, leases or tenant schedule, loss runs, replacement-cost support, and documentation for roof and system updates. Record unknowns as unknowns; do not turn an estimate into a verified underwriting fact.",
    },
  ],
  faqs: [
    {
      q: "What information do I need for a commercial property quote?",
      a: "Start with the address, ownership, occupancy and tenants, construction, year built, square footage, stories, roof and system ages, fire protection, replacement value, income exposure, claims, and requested effective date. An underwriter may ask for more after reviewing the building.",
    },
    {
      q: "Does my tenant's policy insure my building?",
      a: "Do not assume it does. The lease should allocate responsibilities, but each party must compare that agreement with its own policy. A tenant certificate does not change the landlord's property policy or prove every lease obligation is covered.",
    },
    {
      q: "Should I insure the building for market value?",
      a: "Market price, tax value, loan balance, and reconstruction cost are different figures. Ask how the insurer calculated the proposed building limit and valuation, and review coinsurance and replacement-cost conditions before binding.",
    },
    {
      q: "Can a vacant building use the same policy as an occupied one?",
      a: "Vacancy can change eligibility, pricing, conditions, and covered losses. Disclose the current occupancy and renovation plans and review the vacancy wording in the proposed policy.",
    },
  ],
};
