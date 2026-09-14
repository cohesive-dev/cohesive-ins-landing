import { BUYING_RESOURCES } from "./buying-resources";
import { TRADE_COVERAGE_RESOURCES } from "./trade-coverage-resources";
import { CLEANING_RESOURCE } from "./cleaning-resource";
import type { RestaurantGuide } from "./restaurant";

const liability = { label: "Texas Department of Insurance: general liability and quote comparisons", href: "https://www.tdi.texas.gov/pubs/pc/pcgenliab.html" };
const certificate = { label: "Texas Department of Insurance: certificates of insurance", href: "https://www.tdi.texas.gov/certificates/faq.html" };
const common = { quoteKind: "service" as const, updatedAt: "2026-09-14", nationalSlug: "contractor-quote-checklists" };

export const CONTRACTOR_RESOURCES: RestaurantGuide[] = [
  ...BUYING_RESOURCES,
  CLEANING_RESOURCE,
  ...TRADE_COVERAGE_RESOURCES,
  {
    ...common, slug: "contractor-insurance-quote-comparison", title: "How to compare contractor insurance quotes", category: "Quote comparison", industry: "Contractors", tradeLabel: "General contractor", insurancePath: "/insurance/general-contractor",
    description: "Compare contractor insurance using the same work description, revenue, subcontractors, coverage and total cost. Download a blank quote-comparison worksheet.",
    intro: "A lower premium is useful only when you understand what changed. Put both quotes next to the same description of your business, then compare their terms before selecting one.",
    sections: [
      { id: "same-risk", title: "Start with the same risk information", paragraphs: ["Give each reviewer the same legal entity, work locations, services, revenue, employee payroll, subcontractor costs and claims history. Identify the coverage period and limits you requested. If one quote used an estimate you later corrected, have it revised before comparing prices.", "Construction, repair and maintenance can lead to different underwriting. Include occasional operations and your largest projects, not only the routine jobs."], checklist: ["Match the named insured, locations and proposed effective dates.", "Match the operations, receipts, employee payroll and subcontractor costs.", "Record estimates that still need confirmation."], links: [liability] },
      { id: "terms", title: "Compare covered operations and policy terms", paragraphs: ["Ask for the quote, proposed forms and endorsements, not only a premium screenshot or certificate. Compare requested limits, deductibles, covered operations, exclusions and subcontractor conditions. Ask how the proposal treats claims involving completed work, property being worked on and any design responsibility.", "Do not assume an exclusion is absent because the quote summary does not mention it. Put unresolved questions in writing and have them answered before accepting the policy."], checklist: ["Compare limits, deductibles and any self-insured retention.", "Check operations, height, excavation, roofing or other relevant restrictions.", "Review subcontractor and completed-operations conditions.", "Ask about any occurrence versus claims-made difference."], links: [certificate] },
      { id: "total-cost", title: "Compare the full cost and payment terms", paragraphs: ["Record premium, taxes, policy fees, financing charges and the total amount payable. Compare the same policy period. Ask which charges are refundable, whether there is a minimum earned premium, and whether estimated exposures can be audited.", "If the policy is auditable, a low initial estimate may not be the final cost. Ask what payroll, receipts and subcontractor records you should retain and how changes should be reported."], checklist: ["Record annual cost separately from deposit and installments.", "Compare fees, financing and cancellation terms.", "Confirm the rating estimates and audit basis."], links: [{ label: "Download the blank contractor quote-comparison CSV", href: "/checklists/contractor-quote-comparison.csv" }] },
      { id: "example", title: "Use a comparison example without guessing a market price", paragraphs: ["Suppose two proposals cover the same contractor, but only one explicitly accepts the subcontracted installation work. The premiums alone cannot tell you which is better. Ask the other reviewer to confirm that work and revise the quote if necessary, then compare the full terms again.", "This is an illustrative decision example, not a customer result or a price benchmark. Enter the figures from your own current insurer documents in the worksheet."], checklist: ["Resolve missing operations and unanswered terms.", "Ask for corrected documents before selecting a proposal.", "Confirm acceptance and the effective date before telling a customer coverage is in force."] },
    ],
  },
  {
    ...common, slug: "general-contractor-subcontractor-insurance-checklist", title: "Insurance checklist for a general contractor using subcontractors", category: "General contractor planning", industry: "General contractors", tradeLabel: "General contractor", insurancePath: "/insurance/general-contractor",
    description: "Prepare an all-subcontractor GC insurance request with accurate receipts, subcontractor costs, contracts and coverage questions. No invented employee payroll.",
    intro: "A general contractor can coordinate work without employing the crews who perform it. Explain that arrangement directly so the insurance review reflects your contractual role and the work you subcontract.",
    sections: [
      { id: "operations", title: "Map the work and responsibility", paragraphs: ["List the projects you accept, the services you contract to deliver and each trade you subcontract. Distinguish residential, commercial, new construction and remodeling. Explain whether you supervise work, buy materials, perform any hands-on tasks or provide design services.", "An all-subcontractor arrangement is not the same as a business with no exposure. Insurers may apply different conditions or decline particular arrangements; the application needs the actual facts."], checklist: ["Describe your contract with the customer and supervision role.", "List subcontracted trades and occasional specialist work.", "State the largest project, building types and work locations."] },
      { id: "money", title: "Separate receipts, payroll and subcontractor costs", paragraphs: ["Use separate figures for gross business receipts, employee payroll and subcontractor costs. If employee payroll is zero, state zero; do not enter a token payroll amount to satisfy a form. If you only know a range, identify it as a range and confirm the estimate used for rating.", "Ask the reviewer which accounting period and subcontractor amounts the market requires. Do not silently substitute net profit for gross receipts or assume all markets calculate the same way."], checklist: ["Prepare receipts, employee payroll and subcontractor costs separately.", "Identify known figures versus estimates and their time periods.", "Confirm unresolved inputs before accepting the quote."] },
      { id: "documents", title: "Prepare contracts and subcontractor evidence", paragraphs: ["Gather the customer insurance exhibit, subcontractor agreements, available certificates and any requested endorsements. Ask the broker to review required limits, additional insured wording and completed-operations requirements.", "A certificate summarizes evidence; it does not itself amend coverage. Review what the policy requires when a subcontractor is uninsured or fails to maintain the requested protection."], checklist: ["Collect customer and subcontractor insurance requirements.", "Ask how uninsured subcontractors are treated.", "Resolve missing evidence and responsibility before work begins."], links: [certificate, { label: "Compare contractor quote terms", href: "/guides/contractor-insurance-quote-comparison" }] },
    ],
  },
  {
    ...common, slug: "pool-construction-vs-maintenance-insurance", title: "Pool construction vs. pool maintenance insurance", category: "Swimming pool operations", industry: "Pool construction", tradeLabel: "Pool construction", insurancePath: "/insurance/pool",
    description: "Separate pool building, renovation and maintenance when requesting insurance. Prepare excavation, shell, subcontractor and completed-work questions.",
    intro: "A pool builder and a pool-cleaning business may serve the same homeowner, but perform different work. Separate those services before using a price or policy description as a comparison.",
    sections: [
{
  "id": "pool-quote-questions",
  "title": "Can I compare a pool-service quote with an installation quote?",
  "paragraphs": [
    "Only after confirming that both proposals accept the same construction work. Write a stage-by-stage scope: excavation, steel, gunite/shotcrete or shell placement, plumbing, electrical connections, decking and commissioning. Mark which stages your crew performs and which you subcontract.",
    "Give every reviewer the same gross receipts, employee payroll and subcontractor costs. If a service-only proposal omits installation or uses different figures, ask for correction before comparing prices. A lower number based on different operations is not evidence of a better deal.",
    "For a concrete review, ask about shell damage during installation, damage to the existing home or utilities, and a leak discovered after handover. Separate the cost of correcting your work from resulting damage and ask which forms govern each question."
  ],
  "checklist": [
    "Match installed pool systems and each construction stage.",
    "Match receipts, payroll and subcontractor cost estimates.",
    "Resolve installation and completed-work questions before comparing premiums."
  ],
  "links": [
    {
      "label": "Compare the full terms of contractor quotes",
      "href": "/guides/contractor-insurance-quote-comparison"
    }
  ]
},
      {
  "id": "installation-exclusions",
  "title": "Check pool installation, gunite and excavation exclusions",
  "paragraphs": [
    "A policy described as pool insurance may be intended for cleaning or servicing. If you build pools, have the reviewer explicitly check new installation, gunite or shotcrete application, excavation and structural work against the proposed forms. A maintenance classification or an accepted business name is not confirmation that construction is covered.",
    "List the pool systems you install: gunite/concrete, fiberglass, vinyl liner or above-ground. Identify who excavates, places steel, forms the shell and handles plumbing, electrical work and decking. If a subcontractor performs a stage, disclose it; subcontracting does not by itself establish coverage for your responsibility.",
    "Ask how exclusions or conditions address subsidence, soil movement, underground utilities, damage to existing property and completed work. Discuss responsibility for materials and the unfinished pool separately. These are coverage-review questions, not a claim that every policy excludes these hazards or that all resulting damage is insurable."
  ],
  "checklist": [
    "Get written clarification of installation, gunite/shotcrete and excavation scope.",
    "Check the actual exclusions and required endorsements before binding.",
    "Identify direct and subcontracted stages, including completed-work responsibilities."
  ],
  "links": [
    {
      "label": "Texas Department of Insurance: compare policy coverage and exclusions",
      "href": "https://www.tdi.texas.gov/pubs/pc/pcgenliab.html"
    }
  ]
},
      { id: "construction", title: "Describe construction and renovation stages", paragraphs: ["List excavation, shell installation, gunite or shotcrete, plumbing, electrical connections, decking, drainage and retaining walls. Identify what your business performs and what another contractor performs. Include structural renovations and any work on an existing pool.", "State the pool systems, project values and construction share of receipts. Ask how the proposal treats damage to existing property, underground services and damage discovered after completion."], checklist: ["Map each stage and responsible contractor.", "Record construction and renovation receipts separately from service.", "Identify equipment, depth, site access and specialist connections."] },
      { id: "maintenance", title: "Describe servicing beyond the word maintenance", paragraphs: ["List cleaning, chemical treatment, pump repairs, equipment installation, liner replacement and other services individually. Some repair or installation tasks may change the insurance review even if most visits are routine cleaning.", "If you do both construction and maintenance, disclose both and their shares of receipts. Do not use a maintenance-only price as a promised premium for building pools."], checklist: ["List chemicals, equipment repairs and installation work.", "Include occasional tasks as well as recurring service visits.", "Confirm the proposed policy accepts each operation."] },
      { id: "startup", title: "Connect the quote to your first-project plan", paragraphs: ["Prepare the customer contract, subcontractor responsibilities and a cash plan before committing to the first build. Establish who insures unfinished work and materials. Review job permits and specialist credentials with the responsible local authority.", "Use the startup guide to work through services, approvals, first customers and the optional Cohesive AI outreach offer available with eligible insurance placement."], checklist: ["Prepare the project insurance exhibit and quote inputs.", "Check responsibility for unfinished work and equipment.", "Build the first-project cash plan before accepting a payment schedule."], links: [{ label: "Start a pool construction business", href: "/guides/how-to-start-a-pool-construction-business" }, { label: "Texas pool construction startup plan", href: "/guides/how-to-start-a-pool-construction-business-in-texas" }, { label: "Compare pool contractor insurance", href: "/insurance/pool" }] },
    ],
  },
  {
    ...common, slug: "tree-service-insurance-quote-checklist", title: "Tree-service insurance quote checklist: heights, cranes and subcontractors", category: "Tree-work preparation", industry: "Tree services", tradeLabel: "Tree service", insurancePath: "/insurance/tree-service",
    description: "Prepare a tree-service quote with heights, removal methods, cranes, utilities, crew and subcontractor details. Download a working checklist.",
    intro: "The details that make a tree job workable also matter to an insurer. Describe the work directly, including occasional removals, instead of relying only on the label landscaping or tree care.",
    sections: [
{
  "id": "documented-height-example",
  "title": "A documented tree quote lists two separate height restrictions",
  "paragraphs": [
    "An August 2026 tree-service proposal reviewed by Cohesive listed a work-height exclusion above 60 feet and a separate tree-felling height limitation in its coverage modifications. That is why a quote labelled tree service needs more review than checking its premium and main liability limit.",
    "This anonymized example records what one proposal’s schedule listed. The schedule title does not explain how work height or felling height is measured, or every condition and exception. Request the full endorsements before deciding a particular job fits. This is not a bound-policy or paid-claim example, and 60 feet is not a universal market limit."
  ],
  "checklist": [
    "Look for separate restrictions on work height and tree felling.",
    "Get the full endorsement rather than relying on its title.",
    "Compare the wording against climbing, bucket work and the trees you remove."
  ]
},
      {
  "id": "height-exclusions",
  "title": "A height exclusion can leave your normal tree work outside the policy",
  "paragraphs": [
    "Do not stop at a quote labelled tree service. Ask for every height restriction or exclusion and confirm how height is defined: the tree, the work being performed or another measure in the wording. Give the highest work you actually accept, including occasional jobs. Climbing and bucket-truck operations should both be described.",
    "A quote limited to lower-height trimming is not interchangeable with protection for taller removals. As an appetite example, Thimble’s April 2026 guide lists an above-ground trimming/pruning activity below 30 feet. That is a specific product activity, not a universal insurance height limit or the wording of your policy.",
    "Also check removal, crane, storm-work and utility restrictions. Do not omit a tall job, call removal trimming or assume an insured subcontractor removes your exposure. If a planned job exceeds the documented scope, have coverage reviewed before accepting it."
  ],
  "checklist": [
    "Record the maximum accepted height, not the average job height.",
    "Request the exact height wording and how it is measured.",
    "Confirm trimming versus removal, climbing, bucket trucks, cranes and utility exposure.",
    "Obtain any required coverage change before doing work outside the existing scope."
  ],
  "links": [
    {
      "label": "Thimble April 2026 appetite guide: specific tree-work activities",
      "href": "https://www.thimble.com/wp-content/uploads/2026/04/Thimble_Appetite_Guide_Apr02_2026.pdf"
    }
  ]
},
      { id: "work", title: "Record work types and maximum height", paragraphs: ["Separate pruning, removal, stump grinding, land clearing and any plant-health services. Give the maximum working height, including occasional jobs, and explain climbing, aerial lifts and rigging methods. Identify storm-damaged or unstable trees and work near utilities.", "If a fact is unknown, mark it for clarification. A limit on the jobs you accept is useful information to discuss with the reviewer."], checklist: ["List work types and their receipt shares.", "Record maximum height and access methods.", "Describe utility proximity and storm work."] },
      { id: "equipment", title: "Explain crane and crew arrangements", paragraphs: ["Distinguish owned machinery, rented machinery, rentals with operators and subcontractors. Share relevant agreements and insurance requirements. Ask which policy is intended to cover equipment damage and which business is responsible for the operation.", "Prepare employee payroll and subcontractor costs separately, together with your claims history. State which roles the owners perform and check employer coverage obligations for the business structure and state."], checklist: ["List owned and rented chippers, lifts and cranes.", "Identify operators, subcontractors and contract responsibilities.", "Prepare receipts, payroll, subcontractor costs and claims records."] },
      { id: "review", title: "Review the quote against the jobs you accept", paragraphs: ["Ask about height, utility, crane and subcontractor restrictions before comparing premiums. Check completed operations and the customer’s requested limits or endorsements. If a new job is outside the description used for the quote, ask for review before accepting it."], checklist: ["Compare the accepted operations and restrictions.", "Resolve the customer insurance exhibit.", "Confirm the policy effective date before starting insured work."], links: [{ label: "Contractor quote comparison worksheet", href: "/guides/contractor-insurance-quote-comparison" }, { label: "Start a tree-service business", href: "/guides/how-to-start-a-tree-service-business" }, { label: "North Carolina tree insurance preparation", href: "/insurance/tree-service/north-carolina" }] },
    ],
  },
];
