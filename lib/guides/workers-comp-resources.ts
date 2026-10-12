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
const quoteInputs = [
  "Annual payroll, split by the type of work each person does.",
  "Number of full-time and part-time employees.",
  "Years in business.",
  "Claims in the past few years, or a note that there were none.",
  "Whether your subcontractors carry their own workers' comp.",
];

export const WORKERS_COMP_RESOURCES: RestaurantGuide[] = [
  {
    ...common, slug: "contractor-workers-comp-insurance",
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
    ],
  },
  {
    ...common, slug: "workers-comp-cost-for-contractors",
    title: "How much does workers' comp cost for a contractor? Real policies we placed",
    description: "Real workers' comp premiums from policies we placed, what moves the price for a contractor and what to send for an accurate quote. No averages and no guesses.",
    intro: "Workers' comp is priced from your payroll, your class codes and your claims, so one national number would mislead you. Below are real premiums from policies we placed and the reasons your price will be different.",
    sections: [
      { id: "real-policies", title: "Real workers' comp policies we placed", paragraphs: [
        "A remodeling contractor we insure pays $2,565 a year for workers' comp.",
        "A construction company we insure pays $3,562 a year for workers' comp.",
        "Outside construction, for contrast, a small restaurant we insure pays $572 a year for workers' comp.",
        "These are real policies; yours depends on payroll, class codes and claims. They are not averages or ranges, and we can't promise a price until we see your details.",
      ] },
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
];
