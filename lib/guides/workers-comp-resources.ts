import type { RestaurantGuide } from "./restaurant";
import type { RequestedCoverage } from "@/lib/requested-coverage";

// Workers' comp guides for contractors (2026-10-10). The quote form on these pages records a
// WORKERS' COMP request in the CRM (coverageRequested -> `coverage: ["Workers Comp"]`).
// Prices are real policies we placed (trade + premium only, no client names). Never add an
// average, a range or a savings claim here without a source.
const stateOfficials = { label: "U.S. Department of Labor: state workers' compensation agencies", href: "https://www.dol.gov/agencies/owcp/wc" };
const ohio = { label: "Ohio Bureau of Workers' Compensation", href: "https://info.bwc.ohio.gov/" };
const washington = { label: "Washington L&I: workers' compensation insurance", href: "https://lni.wa.gov/insurance/" };
const northDakota = { label: "North Dakota Workforce Safety & Insurance", href: "https://www.workforcesafety.com/" };
const wyoming = { label: "Wyoming Department of Workforce Services: workers' compensation", href: "https://dws.wyo.gov/dws-division/workers-compensation/" };
const workersComp: RequestedCoverage[] = ["Workers Comp"];
const common = {
  quoteKind: "service" as const, updatedAt: "2026-10-10", nationalSlug: "contractor-quote-checklists",
  category: "Workers' compensation", industry: "Contractors", tradeLabel: "Contractor", insurancePath: "/insurance/general-contractor",
  coverageRequested: workersComp,
};
// Real workers' comp policies we placed (CRM policies, status BOUND, read 2026-10-15). Business type, carrier and
// premium only. These are the only workers' comp figures any page may publish; every sentence below is built
// from this table so a page and its trade-page teaser can never disagree. Lowest first.
export type WcPolicy = { usd: number; business: string; carrier: string; state?: string };
export const WC_POLICIES = {
  sandwichShop: { usd: 509, business: "a sandwich and sub shop", carrier: "AmTrust" },
  buffet: { usd: 572, business: "a buffet restaurant", carrier: "Great American" },
  hvac: { usd: 1182, business: "a heating and air conditioning contractor", carrier: "AmTrust", state: "Florida" },
  remodeling: { usd: 1237, business: "a remodeling contractor working on single-family homes", carrier: "AmTrust" },
  masonry: { usd: 1575, business: "a concrete block masonry contractor", carrier: "The Hartford" },
  homeRemodeler: { usd: 2565, business: "a home remodeler working on single-family homes", carrier: "The Hartford" },
  homeBuilder: { usd: 3562, business: "a builder of new single-family homes", carrier: "The Hartford" },
  electrical: { usd: 3774, business: "a general electrical contractor", carrier: "Employers" },
} satisfies Record<string, WcPolicy>;
export const WC_POLICIES_AS_OF = "2026-10-15";
const usd = (n: number) => `$${n.toLocaleString("en-US")}`;
const cap = (t: string) => `${t[0].toUpperCase()}${t.slice(1)}`;
// "A sandwich and sub shop we insure pays $509 a year for workers' comp, written with AmTrust."
export function wcPolicySentence(p: WcPolicy, opts: { inState?: boolean } = {}): string {
  const where = p.state && opts.inState !== false ? ` in ${p.state}` : "";
  return `${cap(p.business)}${where} we insure pays ${usd(p.usd)} a year for workers' comp, written with ${p.carrier}.`;
}
const contractorPolicies: WcPolicy[] = [WC_POLICIES.hvac, WC_POLICIES.remodeling, WC_POLICIES.masonry, WC_POLICIES.homeRemodeler, WC_POLICIES.homeBuilder, WC_POLICIES.electrical];
const notAverage = "Each line is one real policy we placed, not an average or a range. Your price depends on your payroll, the type of work, your state and your claims, and we can't promise a price until we see your details.";

// States where private carriers can't sell the required coverage (state fund only), plus Texas, where we
// don't publish workers' comp pages. Trade pages in these states show no workers' comp teaser.
// Food pages that use the restaurant form but are not restaurants: no restaurant workers' comp teaser.
export const WC_NO_RESTAURANT_TEASER = ["catering", "food-truck", "bakery"];
export const WC_NO_TEASER_STATES = ["ohio", "washington", "north-dakota", "wyoming", "texas"];
const WC_NO_TEASER_NAMES = ["Ohio", "Washington", "North Dakota", "Wyoming", "Texas"];
export function wcTeaserAllowed(stateSlug: string | undefined, areaServed: string): boolean {
  if (stateSlug && WC_NO_TEASER_STATES.includes(stateSlug)) return false;
  return !WC_NO_TEASER_NAMES.some((name) => areaServed === name || areaServed.endsWith(`, ${name}`));
}

const quoteInputs = [
  "Annual payroll, split by the type of work each person does.",
  "Number of full-time and part-time employees.",
  "Years in business.",
  "Claims in the past few years, or a note that there were none.",
  "Whether your subcontractors carry their own workers' comp.",
];

const g = (slug: string) => `/guides/${slug}`;
const WC_GUIDE = {
  remodelers: "workers-comp-insurance-for-remodelers",
  generalContractors: "workers-comp-insurance-for-general-contractors",
  electricians: "workers-comp-insurance-for-electricians",
  hvac: "workers-comp-insurance-for-hvac-contractors",
  concreteMasonry: "workers-comp-insurance-for-concrete-and-masonry-contractors",
  restaurants: "restaurant-workers-comp-insurance",
  florida: "workers-comp-cost-for-contractors-in-florida",
  newYork: "workers-comp-cost-for-contractors-in-new-york",
  georgia: "workers-comp-cost-for-contractors-in-georgia",
  northCarolina: "workers-comp-cost-for-contractors-in-north-carolina",
};
const WC_TRADE_LINKS = [
  { label: "Workers' comp for remodelers", href: g(WC_GUIDE.remodelers) },
  { label: "Workers' comp for general contractors and home builders", href: g(WC_GUIDE.generalContractors) },
  { label: "Workers' comp for electricians", href: g(WC_GUIDE.electricians) },
  { label: "Workers' comp for HVAC contractors", href: g(WC_GUIDE.hvac) },
  { label: "Workers' comp for concrete and masonry contractors", href: g(WC_GUIDE.concreteMasonry) },
  { label: "Restaurant workers' comp", href: g(WC_GUIDE.restaurants) },
];
const WC_STATE_LINKS = [
  { label: "Workers' comp for contractors in Florida", href: g(WC_GUIDE.florida) },
  { label: "Workers' comp for contractors in Georgia", href: g(WC_GUIDE.georgia) },
  { label: "Workers' comp for contractors in New York", href: g(WC_GUIDE.newYork) },
  { label: "Workers' comp for contractors in North Carolina", href: g(WC_GUIDE.northCarolina) },
];
const WC_TRADE_AND_STATE_LINKS = [...WC_TRADE_LINKS, ...WC_STATE_LINKS];
const hubLinks = [
  { label: "Workers' comp for contractors: what it covers", href: g("contractor-workers-comp-insurance") },
  { label: "What workers' comp costs: real policies we placed", href: g("workers-comp-cost-for-contractors") },
  { label: "Workers' comp certificate for a GC job", href: g("workers-comp-certificate-for-gc-jobs") },
];

// Trade-page teaser (components/SeoPage): the matching real policy and a link, on /insurance/<trade>[/<state>[/<metro>]].
export const WC_TRADE_TEASERS: Record<string, { heading: string; sentences: string[]; href: string; label: string }> = {
  remodeler: { heading: "Workers' comp for remodelers", sentences: [wcPolicySentence(WC_POLICIES.remodeling), wcPolicySentence(WC_POLICIES.homeRemodeler)], href: g(WC_GUIDE.remodelers), label: "What sets a remodeler's workers' comp price" },
  "general-contractor": { heading: "Workers' comp for general contractors", sentences: [wcPolicySentence(WC_POLICIES.homeBuilder)], href: g(WC_GUIDE.generalContractors), label: "Workers' comp for GCs, home builders and their subs" },
  electrician: { heading: "Workers' comp for electricians", sentences: [wcPolicySentence(WC_POLICIES.electrical)], href: g(WC_GUIDE.electricians), label: "What sets an electrician's workers' comp price" },
  hvac: { heading: "Workers' comp for HVAC contractors", sentences: [wcPolicySentence(WC_POLICIES.hvac)], href: g(WC_GUIDE.hvac), label: "What sets an HVAC contractor's workers' comp price" },
  concrete: { heading: "Workers' comp for concrete contractors", sentences: [wcPolicySentence(WC_POLICIES.masonry)], href: g(WC_GUIDE.concreteMasonry), label: "Workers' comp for concrete and masonry contractors" },
  masonry: { heading: "Workers' comp for masonry contractors", sentences: [wcPolicySentence(WC_POLICIES.masonry)], href: g(WC_GUIDE.concreteMasonry), label: "Workers' comp for concrete and masonry contractors" },
  restaurant: { heading: "Workers' comp for restaurants", sentences: [wcPolicySentence(WC_POLICIES.sandwichShop), wcPolicySentence(WC_POLICIES.buffet)], href: g(WC_GUIDE.restaurants), label: "Restaurant workers' comp: what sets the price" },
};

const tradeCommon = { nationalSlug: "contractor-workers-comp", updatedAt: "2026-10-15" };

// "How much is workers' comp for a contractor in <state>?" The rule paragraphs must come from the state's
// own agency or statute (linked in `sources`). A state we couldn't verify gets no page.
function stateGuide(o: {
  slug: string; state: string; description: string; inState?: WcPolicy;
  rule: string[]; construction: string[]; sources: { label: string; href: string }[];
}): RestaurantGuide {
  const others = contractorPolicies.filter((p) => p !== o.inState);
  return {
    ...common, ...tradeCommon, slug: o.slug,
    title: `${o.state} contractor workers' comp: what it costs`,
    description: o.description,
    intro: `There is no single ${o.state} price. Workers' comp is priced on your payroll, the class code for each kind of work, ${o.state}'s rates and your claims. Below are real contractor policies we placed, then ${o.state}'s rules on who must carry it.`,
    sections: [
      { id: "real-prices", title: "Real contractor policies we placed", paragraphs: [
        ...(o.inState ? [wcPolicySentence(o.inState)] : []),
        ...(o.inState ? [`Outside ${o.state}, for scale:`] : [`None of these policies is in ${o.state}, and rates differ by state, so treat them as a sense of scale, not a ${o.state} price.`]),
        ...others.map((p) => wcPolicySentence(p)),
        notAverage,
      ] },
      { id: "who-must-carry", title: `Who must carry workers' comp in ${o.state}`, paragraphs: o.rule, links: o.sources },
      { id: "construction-rules", title: `Construction and subcontractor rules in ${o.state}`, paragraphs: o.construction },
      { id: "quote-inputs", title: "What we need to quote", paragraphs: [
        `Send the items below. If you also work outside ${o.state}, list each state and the payroll for work there.`,
        "We can't promise a price before we see your details. We will tell you what we found and what each quote assumed.",
      ], checklist: quoteInputs, links: [...WC_TRADE_LINKS.filter((l) => !l.href.includes("restaurant")), ...hubLinks] },
    ],
  };
}

export const WORKERS_COMP_RESOURCES: RestaurantGuide[] = [
  {
    ...common, slug: "contractor-workers-comp-insurance", updatedAt: "2026-10-15",
    title: "Workers' comp insurance for contractors: what it covers and what we need to quote",
    description: "What workers' compensation covers for a contracting business, who needs it, the four state-fund-only states, what drives the price and what to have ready for a quote.",
    intro: "Workers' compensation pays for an employee's work injury. For a contractor, it is also the policy a GC or property manager often asks to see before you start. Here is what it covers, how the price is set and what we need to quote it.",
    sections: [
      { id: "what-it-covers", title: "What workers' comp covers", paragraphs: [
        "Workers' compensation pays the medical bills of an employee who is hurt or gets sick because of the job. It also replaces part of the wages they lose while they can't work. State law sets those benefits.",
        "Most policies also include employer's liability. That part responds when someone sues the business over a work injury. It has its own limits, which are shown on the policy.",
      ], checklist: ["Medical care for a work injury or illness.", "Part of the wages lost while the employee recovers.", "Employer's liability for lawsuits tied to a work injury."] },
      { id: "who-needs-it", title: "Who needs workers' comp", paragraphs: [
        "Most states require workers' comp once you have employees. The rules vary by state, including who counts as an employee and whether construction is treated differently. Check your state's rule with the state workers' comp agency before you decide you don't need a policy.",
        "A customer can require it even when the state doesn't. Many GCs and property managers ask every contractor for a workers' comp certificate before work starts.",
      ], checklist: ["Check your state's rule for your number and type of workers.", "Read each contract's insurance section for a workers' comp requirement."], links: [stateOfficials] },
      { id: "state-fund-states", title: "Ohio, Washington, North Dakota and Wyoming: state fund only", paragraphs: [
        "In Ohio, Washington, North Dakota and Wyoming, the workers' comp the state requires comes from the state fund. Private carriers and brokers, including us, can't sell that coverage there. If your employees work in one of those states, get it from the state agency.",
        "Who must be covered differs between those states. Wyoming, for example, requires coverage for work it classifies as extrahazardous, so check the agency's rules for your type of work.",
        "State fund coverage generally does not include employer's liability. If a contract in one of those states asks for employer's liability, ask about stop gap coverage.",
      ], links: [ohio, washington, northDakota, wyoming] },
      { id: "price-drivers", title: "What drives the price", paragraphs: [
        "Workers' comp is priced on payroll. Each type of work has a class code, and each class code has its own rate. Payroll for roofing work costs more to insure than payroll for office work because the work carries more risk.",
        "Once you have enough history, an experience modification adjusts your price up or down. It compares your past claims with what is expected for businesses like yours. Your claims history matters to the insurer even before you have a modification.",
        "Subcontractors matter too. If a sub doesn't carry its own workers' comp, the insurer can count what you paid that sub as your payroll at audit. Collect a certificate of insurance from every sub before they start.",
      ], checklist: ["Payroll for each type of work.", "Class codes that match what each person actually does.", "Your experience modification, if you have one.", "Claims history.", "Certificates of insurance from your subs."] },
      { id: "quote-inputs", title: "What we need to quote workers' comp", paragraphs: [
        "Send us the items below and the state or states where you work. Estimates are fine if you tell us they are estimates. Workers' comp policies are usually audited after the term, so the final premium follows your actual payroll.",
        "We can't promise a price before we see your details. We will tell you what we found and what each quote assumed.",
      ], checklist: quoteInputs },
      { id: "no-employees", title: "Sole proprietors with no employees", paragraphs: [
        "If you work alone with no employees, you may be able to exclude yourself from coverage. Whether you can, and how, depends on your state and how your business is set up.",
        "A GC may still ask for a workers' comp certificate before you start, even if the law doesn't require you to have a policy. Ask us about your options before you sign the contract.",
      ], links: [
        { label: "Workers' comp certificate for a GC job", href: "/guides/workers-comp-certificate-for-gc-jobs" },
        { label: "What workers' comp costs: real policies we placed", href: "/guides/workers-comp-cost-for-contractors" },
        { label: "New contractor insurance with no employees", href: "/guides/new-contractor-insurance-no-employees" },
      ] },
      { id: "by-trade-and-state", title: "Workers' comp by trade and by state", paragraphs: [
        "Each trade page below shows a real policy we placed for that kind of work and what moves its price. Each state page sets out who must carry workers' comp there, with the state's own source.",
      ], links: WC_TRADE_AND_STATE_LINKS },
    ],
  },
  {
    ...common, slug: "workers-comp-cost-for-contractors", updatedAt: "2026-10-15",
    title: "How much does workers' comp cost for a contractor? Real policies we placed",
    description: "Real workers' comp premiums from policies we placed, what moves the price for a contractor and what to send for an accurate quote. No averages and no guesses.",
    intro: "Workers' comp is priced from your payroll, your class codes and your claims, so one national number would mislead you. Below are real premiums from policies we placed and the reasons your price will be different.",
    sections: [
      { id: "real-policies", title: "Real workers' comp policies we placed", paragraphs: [
        ...contractorPolicies.map((p) => wcPolicySentence(p)),
        `Outside construction, for contrast, ${wcPolicySentence(WC_POLICIES.sandwichShop).replace(/^A /, "a ")}`,
        notAverage,
      ], links: WC_TRADE_AND_STATE_LINKS },
      { id: "why-yours-differs", title: "Why your price will be different", paragraphs: [
        "The biggest input is payroll. More payroll means more premium, and the type of work behind that payroll sets the rate. A crew that works on roofs is rated differently from a crew that paints interiors.",
        "Your state matters because each state sets its own rules and rates. Your experience modification and claims history can move the price up or down. Uninsured subcontractors can add to your payroll at audit.",
      ], checklist: ["Payroll by type of work.", "Class codes for each kind of work.", "State where the work happens.", "Experience modification and claims.", "Subcontractors with and without their own workers' comp."] },
      { id: "estimate-and-audit", title: "Your estimate and the audit", paragraphs: [
        "The premium at the start of the policy is based on the payroll you estimate. After the term, the carrier usually audits your actual payroll and what you paid subcontractors.",
        "If your payroll was higher than estimated, or an uninsured sub's pay is counted, you may owe more. If it was lower, you may get money back. An honest estimate split by type of work avoids surprises.",
      ], checklist: ["Keep payroll records by type of work.", "Keep every sub's certificate with its policy dates.", "Tell us when your work or payroll changes during the year."] },
      { id: "quote-inputs", title: "What to send for a quote", paragraphs: [
        "Send the items below and we will shop your workers' comp. If a quote looks low, check the payroll and class codes it used, because a quote built on the wrong payroll can change at audit.",
      ], checklist: quoteInputs, links: [
        { label: "Workers' comp for contractors: what it covers", href: "/guides/contractor-workers-comp-insurance" },
        { label: "Workers' comp certificate for a GC job", href: "/guides/workers-comp-certificate-for-gc-jobs" },
        { label: "How to compare contractor insurance quotes", href: "/guides/contractor-insurance-quote-comparison" },
      ] },
    ],
  },
  {
    ...common, slug: "workers-comp-certificate-for-gc-jobs",
    title: "Workers' comp certificate for a GC job: what to send before you start",
    description: "A GC or property manager wants proof of workers' comp before you start. What the certificate shows, what a waiver of subrogation is and why your subs' coverage matters.",
    intro: "Before you start a job, a GC or property manager will often ask for a certificate showing your workers' comp. Here is what the certificate shows, what else they may ask for and how to avoid a delay.",
    sections: [
      { id: "why-they-ask", title: "Why the GC asks for it", paragraphs: [
        "A GC wants to know that every crew on site has workers' comp. In many states, a GC can be held responsible for an injured worker whose own employer had no coverage. Asking each contractor for a certificate is how the GC checks.",
        "Property managers ask for the same reason. Their contract usually lists the coverage and limits they want to see.",
      ] },
      { id: "what-it-shows", title: "What the certificate shows", paragraphs: [
        "A certificate of insurance summarizes your policies on one page. For workers' comp it shows the insurer, the policy number, the policy dates, the employer's liability limits and the certificate holder.",
        "A certificate is evidence of coverage. It cannot add to or change your policy. If a contract needs a change, the carrier has to make it on the policy.",
      ], checklist: ["The certificate holder's exact legal name and address.", "The job address and your start date.", "The contract's insurance section.", "Any waiver of subrogation request."] },
      { id: "waiver-of-subrogation", title: "Waiver of subrogation", paragraphs: [
        "Many contracts ask for a waiver of subrogation on your workers' comp. After paying a claim, an insurer may try to recover its costs from another party that caused the injury. A waiver gives up that right against the party named in the contract.",
        "A waiver is generally an endorsement requested from the carrier, not a box checked on the certificate. Some carriers charge for it. Ask for it as soon as you see it in a contract.",
      ] },
      { id: "your-subs", title: "Why your subs' workers' comp matters", paragraphs: [
        "If you hire subcontractors, collect their workers' comp certificates before they start. An uninsured sub's crew can be charged to your policy at audit. The carrier may count what you paid that sub as your payroll and bill you for it.",
        "Keep each certificate on file and check its dates. It should cover the whole time the sub works for you.",
      ], checklist: ["Get a workers' comp certificate from every sub before work starts.", "Check that the policy dates cover the job.", "Keep the certificates with your payroll records for the audit."] },
      { id: "no-policy-yet", title: "If you don't have workers' comp yet", paragraphs: [
        "A certificate can only be issued for a policy that is in force. A quote or an application is not proof of coverage.",
        "Send us your start date and the contract's insurance section with the quote request below. We will tell you what we need. We can't promise a policy by a specific date, so start early.",
      ], links: [
        { label: "Workers' comp for contractors: what it covers", href: "/guides/contractor-workers-comp-insurance" },
        { label: "What workers' comp costs: real policies we placed", href: "/guides/workers-comp-cost-for-contractors" },
        { label: "Customer needs a COI before you start? A contractor's checklist", href: "/guides/contractor-certificate-of-insurance-before-starting-work" },
      ] },
    ],
  },
  // ---- Trade pages (Kevin 2026-10-15). Real bound policies only, from WC_POLICIES. ----
  {
    ...common, ...tradeCommon, slug: WC_GUIDE.remodelers,
    tradeLabel: "Remodeling", insurancePath: "/insurance/remodeler", relatedInsurancePaths: ["/insurance/general-contractor"],
    title: "Remodeler workers' comp: real policies from $1,237/yr",
    description: "Two real remodeler workers' comp policies we placed: $1,237 and $2,565 a year. What sets a remodeler's price, how subs count and what to send for a quote.",
    intro: "A remodeling crew may frame, demolish, hang drywall and set tile on the same job. Workers' comp is priced on the payroll for each kind of work, so how you describe the work matters. Here are two real remodeler policies we placed and what moves the price.",
    sections: [
      { id: "real-policies", title: "Two real remodeler policies", paragraphs: [
        wcPolicySentence(WC_POLICIES.remodeling),
        wcPolicySentence(WC_POLICIES.homeRemodeler),
        "Both businesses remodel single-family homes. The second pays about twice as much, which is normal for workers' comp: payroll, the class of work and claims differ from one business to the next.",
        notAverage,
      ] },
      { id: "price-drivers", title: "What sets a remodeler's price", paragraphs: [
        "Payroll is split by the work each person does. Carpentry, demolition, drywall and office work can each fall under a different class code with a different rate. If payroll sits under the wrong class, the audit after the policy term can change the price.",
        "Tell us about any roofing, structural work or work at height, even if it is a small share of your jobs. Insurers rate it differently, and leaving it out is how a quote ends up wrong.",
      ], checklist: ["Payroll for carpentry, demolition, finish work and office staff, listed separately.", "Any roofing, structural or exterior work at height.", "Whether you are the only worker or have a crew."] },
      { id: "subs", title: "Subcontractors on your jobs", paragraphs: [
        "Plumbers, electricians and other trades you hire as subs should carry their own workers' comp. If one doesn't, the carrier can add what you paid that sub to your payroll at audit and charge you for it.",
        "Collect a workers' comp certificate from each sub before they start and keep it with your payroll records.",
      ], links: [{ label: "Workers' comp certificate for a GC job", href: g("workers-comp-certificate-for-gc-jobs") }] },
      { id: "quote-inputs", title: "What we need to quote", paragraphs: [
        "Send the items below with the state where you work. Estimates are fine if you say they are estimates.",
      ], checklist: quoteInputs, links: [{ label: "Remodeling contractor insurance", href: "/insurance/remodeler" }, ...hubLinks, ...WC_STATE_LINKS] },
    ],
  },
  {
    ...common, ...tradeCommon, slug: WC_GUIDE.generalContractors,
    tradeLabel: "General contractor", insurancePath: "/insurance/general-contractor",
    title: "GC workers' comp: a real $3,562/yr home builder policy",
    description: "A home builder we insure pays $3,562 a year for workers' comp. How a GC's crew and subs are counted, what an uninsured sub costs you and what to send.",
    intro: "A general contractor's workers' comp covers its own employees. The harder question is the subs: who covers their workers, and what happens to you when a sub has no policy. Here is a real home builder policy we placed and how subs change a GC's price and risk.",
    sections: [
      { id: "real-policy", title: "A real home builder policy", paragraphs: [
        wcPolicySentence(WC_POLICIES.homeBuilder),
        notAverage,
      ] },
      { id: "your-crew", title: "Your own crew", paragraphs: [
        "Your policy covers the people on your payroll: supervisors, carpenters, laborers and office staff. Each kind of work has its own class code and rate, so split your payroll by what people actually do. Supervisors who don't do physical work and office staff are usually rated lower than people doing the building.",
      ], checklist: ["Payroll for field workers by type of work.", "Payroll for supervisors who don't do physical work.", "Payroll for office staff."] },
      { id: "subs", title: "Your subcontractors", paragraphs: [
        "Each sub's own workers' comp should cover that sub's workers. You confirm it by collecting a workers' comp certificate before the sub starts and checking that the dates cover the job.",
        "When a sub has no coverage, two things can happen. At audit, your carrier can count what you paid that sub as your payroll and charge premium on it. And if one of the sub's workers is hurt, you can be held responsible. Florida, Georgia and North Carolina all say this in their own rules; New York presumes a worker doing construction for a contractor is that contractor's employee unless the contractor proves otherwise. See the state pages below for each rule and its source.",
      ], checklist: ["Get a workers' comp certificate from every sub before work starts.", "Check that the policy dates cover the whole job.", "Use your state's coverage lookup where one exists.", "Keep certificates with your payroll records for the audit."], links: [...WC_STATE_LINKS, { label: "Prepare an all-subcontractor GC insurance request", href: g("general-contractor-subcontractor-insurance-checklist") }] },
      { id: "no-employees", title: "If you sub out all the work", paragraphs: [
        "If you have no employees and sub out every job, check your state's rule before deciding you need no policy. Even when the law doesn't require one, property owners and lenders may ask for a workers' comp certificate.",
      ], links: [{ label: "New contractor insurance with no employees", href: g("new-contractor-insurance-no-employees") }] },
      { id: "quote-inputs", title: "What we need to quote", paragraphs: [
        "Send the items below, plus what you paid subs last year and how many of them carry their own workers' comp.",
      ], checklist: quoteInputs, links: [{ label: "General contractor insurance", href: "/insurance/general-contractor" }, ...hubLinks] },
    ],
  },
  {
    ...common, ...tradeCommon, slug: WC_GUIDE.electricians,
    tradeLabel: "Electrician", insurancePath: "/insurance/electrician",
    title: "Electrician workers' comp: a real $3,774/yr policy",
    description: "A general electrical contractor we insure pays $3,774 a year for workers' comp. What sets an electrician's price and what to send for a quote.",
    intro: "Workers' comp for an electrical contractor is priced on the payroll of the people doing the electrical work. Here is a real policy we placed for an electrical contractor, what moves the price and what we need to quote yours.",
    sections: [
      { id: "real-policy", title: "A real electrical contractor policy", paragraphs: [
        wcPolicySentence(WC_POLICIES.electrical),
        notAverage,
      ] },
      { id: "not-liability", title: "Workers' comp is not general liability", paragraphs: [
        "Workers' comp pays for your employees' work injuries. General liability pays for injury or damage you cause to other people and their property. They are separate policies with separate prices.",
        "The lowest electrician general liability price on our electrician page is a quote, not a workers' comp policy. Don't compare the two numbers.",
      ], links: [{ label: "Electrician insurance", href: "/insurance/electrician" }] },
      { id: "price-drivers", title: "What sets an electrician's price", paragraphs: [
        "Payroll for wiring and installation work carries the electrical class rate. Office and estimating staff who don't go to job sites are usually rated separately at a lower rate, so list them separately.",
        "Apprentices and helpers are payroll too. Tell us whether you do new construction, service calls, commercial or industrial work, and any work at height or on energized equipment, because those details can change the class or which insurers will quote.",
      ], checklist: ["Payroll for electricians, apprentices and helpers.", "Payroll for office and estimating staff.", "Mix of residential, commercial and new construction work.", "Subcontractors and their certificates."] },
      { id: "quote-inputs", title: "What we need to quote", paragraphs: [
        "Send the items below with the state where you work.",
      ], checklist: quoteInputs, links: [...hubLinks, ...WC_STATE_LINKS] },
    ],
  },
  {
    ...common, ...tradeCommon, slug: WC_GUIDE.hvac,
    tradeLabel: "HVAC contractor", insurancePath: "/insurance/hvac",
    title: "HVAC workers' comp: a real $1,182/yr policy",
    description: "An HVAC contractor in Florida we insure pays $1,182 a year for workers' comp. What sets an HVAC contractor's price and what to send for a quote.",
    intro: "Workers' comp for an HVAC business is priced on the payroll of your installers and service techs, the class of work and your claims. Here is a real policy we placed for a heating and air conditioning contractor and what moves the price.",
    sections: [
      { id: "real-policy", title: "A real HVAC contractor policy", paragraphs: [
        wcPolicySentence(WC_POLICIES.hvac),
        notAverage,
      ] },
      { id: "price-drivers", title: "What sets an HVAC contractor's price", paragraphs: [
        "Installers and service techs are the payroll that drives the price. Office staff and dispatchers who stay off job sites are usually rated separately at a lower rate.",
        "Tell us about rooftop units, attic and crawl space work, ductwork you fabricate in a shop, and any refrigeration or commercial work. Those details can change the class or which insurers will quote.",
        "Workers' comp doesn't insure your vans. They need a commercial auto policy.",
      ], checklist: ["Payroll for installers and service techs.", "Payroll for office staff and dispatchers.", "Residential versus commercial work.", "Rooftop, attic and shop fabrication work."] },
      { id: "florida", title: "Working in Florida", paragraphs: [
        "In Florida, a construction business with even one employee must carry workers' comp, and that count includes owners who are corporate officers or LLC members. Up to three officers can apply for an exemption if they meet the state's rules.",
      ], links: [{ label: "Workers' comp for contractors in Florida", href: g(WC_GUIDE.florida) }] },
      { id: "quote-inputs", title: "What we need to quote", paragraphs: [
        "Send the items below with the state where you work.",
      ], checklist: quoteInputs, links: [{ label: "HVAC contractor insurance", href: "/insurance/hvac" }, ...hubLinks, ...WC_STATE_LINKS] },
    ],
  },
  {
    ...common, ...tradeCommon, slug: WC_GUIDE.concreteMasonry,
    tradeLabel: "Concrete", insurancePath: "/insurance/concrete", relatedInsurancePaths: ["/insurance/masonry"],
    title: "Concrete and masonry workers' comp: a real $1,575/yr",
    description: "A concrete block masonry contractor we insure pays $1,575 a year for workers' comp. What sets a concrete or masonry price and what to send for a quote.",
    intro: "Concrete and masonry work means heavy lifting, scaffolds and power tools, and workers' comp is priced on the payroll doing that work. Here is a real policy we placed for a masonry contractor and what moves the price.",
    sections: [
      { id: "real-policy", title: "A real masonry contractor policy", paragraphs: [
        wcPolicySentence(WC_POLICIES.masonry),
        notAverage,
      ] },
      { id: "price-drivers", title: "What sets a concrete or masonry contractor's price", paragraphs: [
        "Flatwork, foundations, block, brick and stone can fall under different class codes with different rates. Split your payroll by the kind of work your crew does most, and list office staff separately.",
        "Tell us about scaffold work, work above one story, concrete pumping and any demolition or cutting. Those details can change the class or which insurers will quote.",
      ], checklist: ["Payroll by type of work: flatwork, foundations, block, brick or stone.", "Payroll for office staff.", "Scaffold or above-one-story work.", "Subcontractors and their certificates."] },
      { id: "subs", title: "Subcontractors", paragraphs: [
        "If you hire subs or day crews, collect a workers' comp certificate from each before they start. An uninsured sub's pay can be counted as your payroll at audit.",
      ], links: [{ label: "Workers' comp certificate for a GC job", href: g("workers-comp-certificate-for-gc-jobs") }] },
      { id: "quote-inputs", title: "What we need to quote", paragraphs: [
        "Send the items below with the state where you work.",
      ], checklist: quoteInputs, links: [{ label: "Concrete contractor insurance", href: "/insurance/concrete" }, { label: "Masonry contractor insurance", href: "/insurance/masonry" }, ...hubLinks, ...WC_STATE_LINKS] },
    ],
  },
  {
    ...common, slug: WC_GUIDE.restaurants,
    industry: "Restaurants", tradeLabel: "Restaurant", insurancePath: "/insurance/restaurant", nationalSlug: "how-to-open-a-restaurant",
    category: "Workers' compensation", quoteKind: "restaurant", quoteForm: "restaurant-short", updatedAt: "2026-10-15",
    title: "Restaurant workers' comp from $509/yr: real policies",
    description: "A sandwich shop we insure pays $509 a year and a buffet restaurant $572 for workers' comp. What sets the price, state employee rules and what to send.",
    intro: "Restaurant workers' comp is priced on your payroll and the kind of food service you run. Here are two real restaurant policies we placed, what moves the price and the employee rules in four states we write often.",
    sections: [
      { id: "real-policies", title: "Two real restaurant policies", paragraphs: [
        wcPolicySentence(WC_POLICIES.sandwichShop),
        wcPolicySentence(WC_POLICIES.buffet),
        notAverage,
      ] },
      { id: "price-drivers", title: "What sets a restaurant's price", paragraphs: [
        "Payroll comes first. Cooks, servers, dishwashers and cashiers are the payroll most restaurants report. Delivery drivers and catering work away from the restaurant may be rated differently, so tell us about them.",
        "Claims history matters. Burns, cuts and slips are common kitchen injuries, and a record of claims can raise the price.",
      ], checklist: ["Yearly payroll, and how much of it is kitchen, front of house and delivery.", "Number of full-time and part-time employees.", "Catering or delivery done by your own staff.", "Claims in the past few years, or a note that there were none."] },
      { id: "who-needs-it", title: "Who must carry it", paragraphs: [
        "New York: virtually every employer must carry workers' comp, and part-time workers count. Family members working in a for-profit business count as employees, paid or not.",
        "Florida: a business outside construction must carry it once it has four or more employees, counting owners who are corporate officers or LLC members.",
        "Georgia: a business that regularly employs three or more people, full-time or part-time, must carry it.",
        "North Carolina: a business that regularly employs three or more people must carry it. Corporate officers count toward the three.",
        "In Ohio, Washington, North Dakota and Wyoming, required coverage comes from the state fund, and we can't sell it there.",
      ], links: [
        { label: "New York Workers' Compensation Board: is coverage required?", href: "https://www.wcb.ny.gov/content/main/coverage-requirements-wc/wc-coverage-required.jsp" },
        { label: "Florida Division of Workers' Compensation: coverage requirements", href: "https://www.myfloridacfo.com/division/wc/employer/coverage-requirements" },
        { label: "Georgia State Board of Workers' Compensation: insurance FAQs", href: "https://sbwc.georgia.gov/frequently-asked-questions/workers-compensation-insurance-faqs" },
        { label: "North Carolina Industrial Commission: employers", href: "https://www.ic.nc.gov/wcinsrqmt.html" },
      ] },
      { id: "quote-inputs", title: "What to send for a quote", paragraphs: [
        "Fill in the short form below. We will ask for payroll and employee counts after, and tell you what each quote assumed.",
      ], links: [
        { label: "Restaurant insurance", href: "/insurance/restaurant" },
        { label: "What restaurant insurance costs: real policies and quotes", href: g("restaurant-insurance-cost") },
      ] },
    ],
  },
  // ---- State pages (Kevin 2026-10-15). Every rule is from the state's own agency or statute, linked. ----
  stateGuide({
    slug: WC_GUIDE.florida, state: "Florida", inState: WC_POLICIES.hvac,
    description: "A Florida HVAC contractor we insure pays $1,182 a year for workers' comp. Florida requires it for construction businesses with even one employee.",
    rule: [
      "Florida sets a lower bar for construction than for other businesses. A construction business with one or more employees must carry workers' comp. Outside construction, the rule starts at four employees.",
      "In both cases the count includes owners who are corporate officers or LLC members.",
    ],
    construction: [
      "A construction company can have no more than three officers exempt from coverage. Each must own at least 10 percent of the company and apply to the state, with a $50 fee.",
      "If your subcontractor has no workers' comp, Florida treats the sub's workers as your employees, and you are responsible for their benefits if they are hurt.",
    ],
    sources: [
      { label: "Florida Division of Workers' Compensation: coverage requirements", href: "https://www.myfloridacfo.com/division/wc/employer/coverage-requirements" },
      { label: "Florida Division of Workers' Compensation: construction industry exemptions", href: "https://www.myfloridacfo.com/division/wc/employer/exemptions/construction" },
    ],
  }),
  stateGuide({
    slug: WC_GUIDE.newYork, state: "New York",
    description: "Real contractor workers' comp policies we placed, and New York's rule: virtually every employer must carry it, part-time workers included.",
    rule: [
      "Virtually every employer in New York must carry workers' comp, and that includes part-time, temporary and seasonal workers. Family members working in a for-profit business count as employees, paid or not.",
      "A sole proprietor, partnership or LLC with no employees doesn't need a policy. A corporation owned by one or two people who hold all the stock and offices, with no other employees, also doesn't. A corporation with more than two officers does.",
    ],
    construction: [
      "Under New York's Construction Industry Fair Play Act, a worker doing construction for a contractor is presumed to be that contractor's employee. The contractor has to prove the person is independent, under a three-part test, or that the person's business is separate, under a twelve-part test.",
      "The Board also notes that carriers often charge general contractors for every sub on the job unless the sub shows its own policy, and that GCs routinely require it. That is why many one-person contracting businesses in New York buy a policy that covers themselves.",
    ],
    sources: [
      { label: "New York Workers' Compensation Board: is coverage required?", href: "https://www.wcb.ny.gov/content/main/coverage-requirements-wc/wc-coverage-required.jsp" },
    ],
  }),
  stateGuide({
    slug: WC_GUIDE.georgia, state: "Georgia",
    description: "Real contractor workers' comp policies we placed, and Georgia's rule: three or more regular employees, part-time included, and liability for subs.",
    rule: [
      "A Georgia business that regularly employs three or more people, full-time or part-time, must carry workers' comp. Regular part-time employees count.",
      "In a corporation, every officer counts as an employee. Up to five officers or LLC members can waive coverage for themselves by filing form WC-10 with the insurer, but a waiver doesn't lower the employee count. Sole proprietors and partners are treated as employers, not employees, and can choose coverage in writing.",
    ],
    construction: [
      "Georgia law makes a contractor liable for compensation to an employee of its subcontractor who is hurt on the job (O.C.G.A. 34-9-8(a)), when the sub has no coverage.",
      "Georgia's Insurance Commissioner recommends checking every sub's coverage in the state's online lookup, even when you hold a certificate. If you can't show an uninsured sub had coverage, your insurer will charge you for that sub at audit.",
    ],
    sources: [
      { label: "Georgia State Board of Workers' Compensation: insurance FAQs", href: "https://sbwc.georgia.gov/frequently-asked-questions/workers-compensation-insurance-faqs" },
      { label: "Georgia Office of Insurance Commissioner: verifying a sub's coverage", href: "https://oci.georgia.gov/insurance-resources/business/how-verify-workers-compensation-coverage-and-avoid-audit-surprises" },
    ],
  }),
  stateGuide({
    slug: WC_GUIDE.northCarolina, state: "North Carolina",
    description: "Real contractor workers' comp policies we placed, and North Carolina's rule: three or more regular employees, and GC liability for an uncovered sub.",
    rule: [
      "In general, a North Carolina business that regularly employs three or more people must carry workers' comp. Corporate officers count toward the three. Sole proprietors, partners and LLC members are not counted automatically.",
      "A business with even one employee working with radiation must carry it.",
    ],
    construction: [
      "The three-employee rule does not protect a GC from a small sub. Under G.S. 97-19, a contractor who sublets work without getting a certificate of the sub's workers' comp is liable for the sub's injured workers, even when the sub has fewer than three employees.",
      "Getting the certificate before the sub starts protects you for the term it shows. Collect one from every sub, every time.",
    ],
    sources: [
      { label: "North Carolina Industrial Commission: employers", href: "https://www.ic.nc.gov/wcinsrqmt.html" },
      { label: "N.C. General Statutes 97-19: liability of contractors for subcontractors' employees", href: "https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_97/GS_97-19.html" },
    ],
  }),
];
