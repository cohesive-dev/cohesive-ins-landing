import type { Fact, PageContent } from "./data";
import { getState } from "./data";
import {
  CONTRACTOR_STATE_SLUGS,
  getContractorState,
} from "./contractor-states";

export const CHURCH_UPDATED = "2026-09-20";

type ChurchStateProfile = {
  slug: string;
  name: string;
  abbr: string;
  workersComp: Fact;
  propertyNote: Fact;
};

// The five highest-volume states in the current house-of-worship intake sample
// have richer, source-linked overrides. The remaining placeable jurisdictions
// inherit the verified state layer used by the contractor pages.
const FEATURED_CHURCH_STATES: ChurchStateProfile[] = [
  {
    slug: "georgia",
    name: "Georgia",
    abbr: "GA",
    workersComp: {
      title: "Georgia's employee threshold starts at three",
      body: "Georgia generally requires workers' compensation when an organization regularly employs three or more people. Confirm how paid clergy, office staff, maintenance staff, and any separately organized ministry or school are counted before deciding a policy is not required.",
      source: {
        label: "Georgia Department of Labor employer handbook",
        href: "https://dol.georgia.gov/document/unemployment-tax/employer-handbook/download",
      },
    },
    propertyNote: {
      title: "Document the safeguards at the building",
      body: "Georgia's insurance and safety-fire office recommends exterior lighting, clear sight lines, maintained alarms and suppression systems, designated cooking areas, and documented electrical and gas work for places of worship. Tell the underwriter which safeguards are actually present rather than accepting a generic building assumption.",
      source: {
        label: "Georgia safety tips for places of worship",
        href: "https://oci.georgia.gov/safety-tips-places-worship",
      },
    },
  },
  {
    slug: "south-carolina",
    name: "South Carolina",
    abbr: "SC",
    workersComp: {
      title: "South Carolina generally uses a four-employee threshold",
      body: "South Carolina generally requires workers' compensation for organizations that regularly employ four or more people. Part-time workers and family members count. A church should verify how paid clergy and staff affect the count instead of treating nonprofit status as an automatic exemption.",
      source: {
        label: "South Carolina Workers' Compensation Commission",
        href: "https://wcc.sc.gov/employer-faqs",
      },
    },
    propertyNote: {
      title: "Coastal wind terms need their own comparison",
      body: "A coastal South Carolina church may see a named-storm or wind and hail deductible, and wind can be handled separately from the main property policy. Compare the deductible basis, included locations, roof terms, and business-income treatment on the actual proposals.",
    },
  },
  {
    slug: "texas",
    name: "Texas",
    abbr: "TX",
    workersComp: {
      title: "Workers' compensation is usually optional for private Texas employers",
      body: "Texas does not require most private employers to carry workers' compensation, but an organization that does not subscribe has notice and reporting duties and gives up important lawsuit defenses. Treat the coverage decision separately from whether it is mandatory.",
      source: {
        label: "Texas Department of Insurance workers' compensation guide",
        href: "https://www.tdi.texas.gov/pubs/consumer/cb030.html",
      },
    },
    propertyNote: {
      title: "Gulf Coast wind may be a separate placement",
      body: "For a church near the Texas coast, confirm whether wind and hail are included, excluded, or placed through another policy. Compare the named-storm deductible, roof valuation, and how the property and wind policies coordinate after one event.",
    },
  },
  {
    slug: "arkansas",
    name: "Arkansas",
    abbr: "AR",
    workersComp: {
      title: "Arkansas generally requires coverage at three employees",
      body: "Most Arkansas employers with three or more employees must carry workers' compensation. The state notes that exceptions exist, so a church with fewer than three workers should still verify its facts before assuming it falls outside the law.",
      source: {
        label: "Arkansas Workers' Compensation Commission basic facts",
        href: "https://labor.arkansas.gov/workers-comp/awcc-about-us/basic-facts/",
      },
    },
    propertyNote: {
      title: "Describe every building and regular activity",
      body: "List sanctuaries, fellowship halls, parsonages, detached storage, playgrounds, kitchens, schools, and daycare operations separately. Their construction, use, hours, and protection can differ, and a schedule that says only 'church' can leave the quote built on the wrong assumptions.",
    },
  },
  {
    slug: "north-carolina",
    name: "North Carolina",
    abbr: "NC",
    workersComp: {
      title: "North Carolina generally uses a three-employee threshold",
      body: "North Carolina generally requires workers' compensation for an organization with three or more employees. The Industrial Commission says corporate officers count toward the threshold and that certain unpaid nonprofit officers also count for determining whether coverage is required.",
      source: {
        label: "North Carolina Industrial Commission employer guidance",
        href: "https://www.ic.nc.gov/workers-compensation-claims/employers",
      },
    },
    propertyNote: {
      title: "Coastal locations need a clear wind answer",
      body: "For a North Carolina church near the coast, identify whether wind and hail are included in the main property quote and compare named-storm deductibles, roof valuation, and any separate coastal-market placement. Do not compare premiums until those terms match.",
    },
  },
];

const FEATURED_BY_SLUG = new Map(
  FEATURED_CHURCH_STATES.map((state) => [state.slug, state]),
);

// The contractor SEO footprint is also the agency's placeable footprint.
// California remains excluded because the agency cannot currently place it.
// Church pages use that same boundary so a search page never promises service
// where it cannot be placed.
export const CHURCH_STATES: ChurchStateProfile[] = CONTRACTOR_STATE_SLUGS.map(
  (slug) => {
    const featured = FEATURED_BY_SLUG.get(slug);
    if (featured) return featured;

    const state = getContractorState(slug);
    if (!state) return undefined;
    const sharedState = getState(slug);
    const workersCompOverrides: Record<string, string> = {
      florida:
        "Florida generally requires workers' compensation for a non-construction employer with four or more employees. Confirm how clergy, officers, school or daycare staff, and any separate ministry entity affect the count.",
      kansas:
        "Kansas generally requires workers' compensation when annual payroll exceeds the state's threshold. Confirm current exemptions and how paid clergy and staff are counted before deciding coverage is not required.",
      maine:
        "Maine generally requires workers' compensation when an organization has employees, subject to statutory exclusions. Confirm the treatment of clergy, officers, and any separately organized ministry or school.",
      massachusetts:
        "Massachusetts generally requires workers' compensation for employees, including part-time employees, with limited statutory exceptions. Confirm how clergy and officers are treated for the congregation's structure.",
      michigan:
        "Michigan generally requires workers' compensation when an organization regularly employs three or more people at one time, including part-time employees, or one or more people at least 35 hours a week for 13 weeks or longer. Confirm how clergy and officers are counted.",
      missouri:
        "Missouri generally requires workers' compensation for an employer with five or more employees. Confirm how clergy, officers, and separately organized ministry or school staff affect the count.",
      "new-mexico":
        "New Mexico generally requires workers' compensation for an employer with three or more employees. Confirm how clergy, officers, and separately organized ministry or school staff affect the count.",
      "new-york":
        "New York generally requires workers' compensation when an organization has employees. Religious and nonprofit structures can have fact-specific rules, so verify the status of clergy, officers, staff, and any school or daycare operation.",
      "south-dakota":
        "South Dakota does not generally require every private employer to buy workers' compensation, but carrying it can protect employees and limit uninsured injury exposure. Confirm the organization's duties and any contractual requirements.",
      wisconsin:
        "Wisconsin generally requires workers' compensation once an employer has three employees or pays at least $500 in wages in a calendar quarter. Confirm how clergy, officers, and ministry staff are counted.",
      washington:
        "Washington generally requires workers' compensation for employees and other covered workers through Labor & Industries. Confirm how clergy, officers, volunteers, and any separately organized ministry, school, or daycare are classified.",
      wyoming:
        "Wyoming's mandatory workers' compensation system applies by industry and work classification rather than one simple employee threshold. Confirm whether the congregation's employees and operations fall within required coverage.",
    };
    const wcBody =
      workersCompOverrides[slug] ??
      `${state.wc} Confirm how clergy, officers, part-time staff, and any separately organized ministry, school, or daycare affect the rule.`;
    const propertyNote = sharedState?.windFact
      ? sharedState.windFact
      : {
          title: `Build a complete ${state.name} location schedule`,
          body: `List every sanctuary, fellowship hall, parsonage, office, school, daycare, kitchen, playground, and detached structure in ${state.name}. Record the construction, use, values, roof and system ages, protection, and occupancy of each instead of letting the quote default to one generic "church" building.`,
        };

    return {
      slug: state.slug,
      name: state.name,
      abbr: state.abbr,
      workersComp: {
        title: `Check ${state.name}'s employee coverage rule`,
        body: wcBody,
      },
      propertyNote,
    };
  },
).filter((state): state is ChurchStateProfile => Boolean(state));

const NATIONAL_FACTS: Fact[] = [
  {
    title: "Build one safety plan around people, property, and continuity",
    body: "CISA recommends a layered security plan with assigned responsibilities, emergency and continuity planning, a vulnerability assessment, child-safety measures, and cybersecurity practices. These controls should be described accurately on the application and kept current after the policy is issued.",
    source: {
      label: "CISA security guide for houses of worship",
      href: "https://www.cisa.gov/resources-tools/resources/mitigating-attacks-houses-worship-security-guide",
    },
  },
  {
    title: "Emergency planning should reflect the congregation and facility",
    body: "FEMA's house-of-worship planning guide covers fires, severe weather, violence, and other hazards and recommends planning with first responders and community partners. A written plan does not replace insurance, but it can expose property, safety, and continuity gaps that belong in the coverage review.",
    source: {
      label: "FEMA emergency planning guide for houses of worship",
      href: "https://www.fema.gov/sites/default/files/2020-07/developing-eops-for-houses-of-worship.pdf",
    },
  },
];

function baseContent(place: string): Omit<PageContent, "title" | "metaDescription" | "heroH1" | "heroSub" | "stateFacts"> {
  return {
    reviewedOn: CHURCH_UPDATED,
    alsoCovers: "For churches, synagogues, mosques, temples, ministries, and other houses of worship.",
    costNarrative: [
      `A useful ${place} house-of-worship quote starts with the real operations: attendance, employees and volunteers, outreach, counseling, childcare or school programs, events, food service, vehicles, and every building or location. Two policies with the same headline limit can treat those activities very differently.`,
      "For property coverage, compare the building limit and valuation, roof and system details, deductibles, coinsurance, ordinance or law, water and wind terms, and business-income or extra-expense coverage. For liability, check abuse or molestation, counseling, special events, hired and non-owned auto, and umbrella terms rather than assuming a general-liability form covers each exposure.",
    ],
    costDisclaimer: "Church insurance pricing is individual to the organization, property, activities, people, claims, and requested coverage. These are quote components, not premium estimates or an offer of insurance.",
    costRows: [
      {
        coverage: "General liability",
        range: "Individual quote",
        note: "Attendance, activities, events, premises, and requested limits shape eligibility and price.",
      },
      {
        coverage: "Building and contents",
        range: "Selected limits",
        note: "Use supportable values and disclose each building, occupancy, roof, system age, and safeguard.",
      },
      {
        coverage: "Abuse or molestation / counseling liability",
        range: "Policy-specific",
        note: "Compare eligibility, limits, exclusions, retroactive dates, and required prevention controls.",
      },
      {
        coverage: "Workers' compensation / commercial auto / umbrella",
        range: "Quoted separately",
        note: "Employee count, vehicles, drivers, payroll, and underlying limits determine what is needed.",
      },
    ],
    priceDrivers: [
      "Weekly attendance, membership, annual receipts, payroll, and number of employees and volunteers",
      "Daycare, school, youth, counseling, outreach, food service, athletic, and special-event operations",
      "Building values, construction, age, square footage, roof and system updates, and fire protection",
      "Protection policies such as screening, two-adult rules, incident reporting, alarms, and security plans",
      "Owned, hired, borrowed, or volunteer-driven vehicles",
      "Prior claims, requested effective date, limits, deductibles, and umbrella requirements",
    ],
    coverages: [
      {
        name: "General liability",
        desc: "Review premises and operations liability, medical payments, products or food-service exposure, special events, and who qualifies as an insured or volunteer.",
      },
      {
        name: "Building, contents, and income",
        desc: "Schedule every location and compare valuation, coinsurance, deductibles, ordinance or law, water and wind terms, equipment breakdown, and extra expense.",
      },
      {
        name: "Abuse or molestation",
        desc: "Ask for the actual limits and exclusions and disclose youth, childcare, school, counseling, and volunteer activities. Prevention controls and screening matter to eligibility.",
      },
      {
        name: "Counseling and clergy liability",
        desc: "Pastoral or lay counseling can require professional-liability treatment beyond ordinary general liability. Confirm who and which services the form covers.",
      },
      {
        name: "Crime and cyber",
        desc: "Review employee or volunteer theft, funds-transfer fraud, privacy incidents, ransomware, and payment systems. These are not automatically covered by property insurance.",
      },
      {
        name: "Auto, workers' compensation, and umbrella",
        desc: "Owned vans, hired or borrowed vehicles, employee injuries, and higher liability limits are separate comparisons. Volunteer driving should be disclosed even when the church owns no vehicle.",
      },
    ],
    faqs: [
      {
        q: "What information should a church gather before requesting a quote?",
        a: "Gather the current policy if handy, loss runs, requested effective date, attendance, receipts and payroll, employee and volunteer counts, activities, protection policies, vehicles and drivers, plus a schedule of buildings with values, construction, square footage, roof and system updates, and safeguards. You can start without every document, but label estimates and unknowns honestly.",
      },
      {
        q: "Does a church policy automatically cover daycare, school, counseling, or special events?",
        a: "No. Those operations can change eligibility and may need specific coverage, limits, or endorsements. Disclose them and compare the proposal wording instead of relying on the policy's package name.",
      },
      {
        q: "Does the church need abuse or molestation coverage if it has background checks?",
        a: "Background checks are one control, not a substitute for coverage or a complete prevention program. Review supervision rules, screening, training, reporting, limits, exclusions, and which employees or volunteers are covered.",
      },
      {
        q: "Can a rented church space be insured?",
        a: "Yes, but the request should distinguish the landlord's building from the congregation's contents, improvements, liability, and income or extra-expense exposure. Review the lease and any additional-insured or property requirements.",
      },
      {
        q: "How quickly can a house of worship get a quote?",
        a: "Timing depends on the property and operations. A complete, consistent submission moves faster. Older or high-value buildings, coastal wind, schools or daycare, prior claims, and complex activities may need underwriter review and additional documents.",
      },
    ],
  };
}

export const CHURCH_CONTENT: PageContent = {
  title: "Church & House of Worship Insurance | Coverage Guide",
  metaDescription: "Compare church and house-of-worship insurance for property, liability, abuse or molestation, counseling, vehicles, employees, and ministry activities.",
  heroH1: "Church and house-of-worship insurance",
  heroSub: "Compare the coverage around your people, ministries, buildings, events, and vehicles, then start a quote with the facts an underwriter needs.",
  ...baseContent("church or"),
  stateFacts: NATIONAL_FACTS,
};

export function getChurchState(slug: string) {
  return CHURCH_STATES.find((state) => state.slug === slug);
}

export function buildChurchStateContent(state: ChurchStateProfile): PageContent {
  return {
    title: `Church Insurance in ${state.name} | House of Worship Coverage`,
    metaDescription: `Compare ${state.name} church insurance for buildings, liability, abuse or molestation, counseling, employees, vehicles, and ministry activities.`,
    heroH1: `Church insurance in ${state.name}`,
    heroSub: `Build a ${state.name} house-of-worship insurance comparison around the congregation, ministries, property, people, and vehicles you actually have.`,
    ...baseContent(`${state.name}`),
    stateFacts: [state.workersComp, state.propertyNote, ...NATIONAL_FACTS],
    faqs: [
      {
        q: `What information is needed for a church insurance quote in ${state.name}?`,
        a: `Start with the current policy if handy, loss runs, attendance, receipts and payroll, employees and volunteers, activities, protection policies, vehicles, and a building schedule. For each ${state.abbr} location, include value, construction, square footage, year built, roof and system updates, fire protection, occupancy, and requested deductibles.`,
      },
      ...baseContent(state.name).faqs.slice(1),
    ],
  };
}

export function churchStateLinks(exclude?: string) {
  return CHURCH_STATES.filter((state) => state.slug !== exclude).map((state) => ({
    label: state.name,
    href: `/insurance/church/${state.slug}`,
  }));
}
