import type { VendorComparison } from "./vendors";
export type GuideSection = {
  id: string;
  title: string;
  paragraphs: string[];
  checklist?: string[];
  comparison?: VendorComparison;
  links?: { label: string; href: string }[];
};

export type RestaurantGuide = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  category: string;
  insurancePath: string;
  sections: GuideSection[];
  budget?: boolean;
  industry?: string;
  stateSlug?: string;
  nationalSlug?: string;
  quoteKind?: "restaurant" | "service";
  tradeLabel?: string;
  noQuote?: boolean;
  noQuoteReason?: string;
  updatedAt?: string;
};

// Editorial dates are changed deliberately when the content is checked, not at build time.
export const GUIDE_UPDATED = "2026-09-07";
const sba = { label: "SBA: planning your business", href: "https://www.sba.gov/counseling/plan-your-business/" };
const launch = { label: "SBA: launching your business", href: "https://www.sba.gov/counseling/launch-your-business/" };
const insurance = "/insurance/restaurant";

export const RESTAURANT_GUIDES: RestaurantGuide[] = [
  {
    slug: "how-to-open-a-restaurant",
    title: "How to open a restaurant: from concept to opening day",
    description: "Plan your restaurant launch in the right order: concept, budget, location, permits, insurance, staffing, and opening-day readiness.",
    intro: "Start with a menu and a financial plan, then verify that your proposed space can support them before committing to a lease or equipment. Work backward from the approvals you need to open, with a named owner and a budget for each step.",
    category: "Start here",
    insurancePath: insurance,
    sections: [
      { id: "concept", title: "1. Turn your concept into an operating plan", paragraphs: [
        "Write down what you will serve, who will buy it, how orders will reach the kitchen, and how many people you expect to serve in a shift. A counter-service lunch shop, a delivery kitchen, and a late-night restaurant need different staffing, equipment, and premises.",
        "Build a sample menu before choosing equipment. For each dish, list preparation, storage, cooking, and service steps. Use those steps to discuss the layout with your designer and the agency reviewing your food operation. Speak with potential customers and compare nearby alternatives before assuming that a busy street guarantees demand.",
      ], checklist: ["Draft a menu and service model.", "Estimate customers per service and average spending per customer.", "Identify delivery, catering, alcohol, or outdoor-service plans early."], links: [sba] },
      { id: "budget", title: "2. Separate opening costs from operating cash", paragraphs: [
        "Create one list for spending before opening and another for recurring bills. Include deposits, professional help, construction, equipment, opening inventory, and training wages. Then model rent, payroll, utilities, supplies, and other payments during a slower-than-expected launch.",
        "Request written estimates and record what each excludes. A kitchen equipment price may leave out freight, installation, electrical work, or servicing. Keep a contingency separate from operating cash so an overrun does not silently consume the money reserved for payroll.",
      ], links: [{ label: "Build your restaurant opening budget", href: "/guides/restaurant-startup-costs" }] },
      { id: "space", title: "3. Check the space before you commit", paragraphs: [
        "Bring your menu and proposed layout to the relevant local planning, building, fire, and food-safety offices. Ask which reviews apply to this address and this operation. A space previously used as a restaurant can still require changes for your menu, equipment, ownership, or layout.",
        "Have qualified advisers review the lease and the premises. Clarify who pays for improvements, which equipment belongs to the landlord, when rent starts, and what happens if approvals are delayed. Ask your insurance broker to compare the lease's insurance language with available coverage before you agree to it.",
      ], links: [{ label: "Read restaurant lease insurance requirements", href: "/guides/restaurant-lease-insurance-requirements" }] },
      { id: "approvals", title: "4. Build an approval tracker", paragraphs: [
        "Keep business registration, tax setup, food approval, building work, and alcohol permissions as separate tasks. For each, record the responsible agency, application, fee confirmed by that agency, prerequisites, submission date, and next action. Filing one application does not complete the others.",
        "Ask your local agencies which work must wait for plan approval and what must be ready for a final inspection. Treat any estimated processing time as an input to your schedule, not a promised opening date. Check separately for changes of ownership when buying an existing operation.",
      ], links: [launch, { label: "Opening a restaurant in Ohio", href: "/guides/how-to-open-a-restaurant-in-ohio" }, { label: "Opening a restaurant in North Carolina", href: "/guides/how-to-open-a-restaurant-in-north-carolina" }] },
      { id: "team", title: "5. Prepare the team, suppliers, and coverage", paragraphs: [
        "Write a staffing plan for preparation, service, cleaning, and closing. Budget time for training before the first paying customer arrives. Confirm food-safety training requirements with your local authority and payroll obligations with your payroll adviser.",
        "List the dates you take possession, start improvements, receive equipment, bring staff on site, and begin service. Give that timeline to your broker so coverage can be considered for the actual stages of the launch. Do not assume a policy starting on opening night addresses earlier exposures.",
      ], checklist: ["Confirm supplier delivery windows and backup contacts.", "Test point-of-sale, payment settlement, and order routing.", "Confirm policy effective dates and requested evidence of coverage."], links: [{ label: "Explore restaurant insurance coverage", href: insurance }] },
      { id: "opening", title: "6. Run a rehearsal before announcing the opening", paragraphs: [
        "Walk through receiving, storage, prep, service, payment, cleaning, and closing with the people who will actually do the work. Use a mock service to find unclear handoffs and missing supplies. Record each issue, its owner, and the condition that will count as resolved.",
        "Keep required approvals and unresolved safety issues separate from improvements that can wait. A marketing deadline should not be the reason you overlook an opening requirement. Set the public opening once the responsible people have confirmed that the restaurant is ready.",
      ], links: [{ label: "Use the pre-opening checklist", href: "/guides/restaurant-pre-opening-checklist" }] },
    ],
  },
  {
    slug: "restaurant-startup-costs",
    title: "Restaurant startup costs: build your opening budget",
    description: "Use a free restaurant startup budget calculator to separate one-time costs, monthly cash needs, contingency, and your funding gap. Download your figures as CSV.",
    intro: "Your opening budget depends on the premises, menu, equipment, staffing, and launch schedule. Build it from written estimates rather than a single national average. Use the worksheet below to total opening spending, a simple operating reserve, and the amount still to fund.",
    category: "Free budget worksheet",
    insurancePath: insurance,
    budget: true,
    sections: [
      { id: "opening-costs", title: "What belongs in the one-time budget?", paragraphs: [
        "Start with the cash you expect to pay before service begins: lease and utility deposits, design and professional fees, permit applications, improvements, kitchen equipment, furniture, smallwares, initial inventory, and pre-opening training. Include sales tax, freight, installation, and other charges in the relevant estimate when they apply.",
        "Treat this as a cash-planning worksheet, not a tax classification. A refundable deposit still uses cash. A financed appliance may require a deposit now and payments later; enter the upfront amount here and put its ongoing payment in monthly costs. Avoid counting the full purchase price and the financed balance as two separate opening expenses.",
      ], links: [sba] },
      { id: "monthly", title: "Estimate monthly cash needs", paragraphs: [
        "Build recurring costs from your planned schedule: occupancy, payroll and related costs, utilities, food and packaging, insurance installments, software, debt payments, and other bills. The calculator multiplies your monthly total by the number of reserve months you choose. That is a simple scenario assuming no incoming sales; it is not a profit forecast or a recommended reserve duration.",
        "For a fuller forecast, create a month-by-month cash-flow sheet with expected receipts and payments. Include slower sales, supplier payment dates, loan repayments, and delays in receiving funds. Do not count sales tax collected for remittance as money freely available for operating expenses.",
      ] },
      { id: "uncertainty", title: "Make uncertain estimates visible", paragraphs: [
        "Mark each estimate as confirmed, quoted, or still to research in your working notes. Ask contractors whether their price includes permit work, utility upgrades, hood work, and change orders. Ask the landlord to confirm the condition and ownership of equipment left by a previous tenant.",
        "The worksheet applies your chosen contingency percentage to one-time costs only. It does not inflate the operating reserve. Change the percentage to compare scenarios, and separately add extra reserve months if the opening schedule is uncertain.",
      ] },
      { id: "insurance-budget", title: "Budget insurance against the actual operation", paragraphs: [
        "Request estimates using your address, menu, expected sales, alcohol service, payroll, equipment values, and lease requirements. Keep the deposit or upfront premium separate from later installments. If you enter a full annual premium as an opening payment, do not add the same premium again as monthly installments.",
        "Review limits, deductibles, exclusions, payment fees, and effective dates alongside price. The insurance allowance in your startup budget is a planning input; the worksheet does not generate an insurance quote.",
      ], links: [{ label: "Restaurant insurance: coverage and quoting", href: insurance }] },
      { id: "funding", title: "Use the funding gap to plan your next step", paragraphs: [
        "Subtract cash actually committed and available for the project from the estimated total. Keep pending financing and money restricted to another purpose out of the available-cash field. A zero gap in this scenario does not establish that the business will be profitable or that a lender will approve financing.",
        "Download the worksheet and replace remaining placeholders with supplier or adviser estimates. Revisit it when the menu, premises, staffing, or construction scope changes. The calculator starts blank so none of its values can be mistaken for a market benchmark.",
      ], links: [{ label: "Return to the restaurant opening guide", href: "/guides/how-to-open-a-restaurant" }] },
    ],
  },
  {
    slug: "restaurant-lease-insurance-requirements",
    title: "Restaurant lease insurance requirements: what to check before signing",
    description: "Understand a restaurant lease's insurance checklist: policy limits, additional insureds, certificates, property responsibilities, and coverage start dates.",
    intro: "Before signing a restaurant lease, send the complete insurance clause to your broker and have your legal adviser review the lease. Compare what the landlord requests with the coverage and endorsements an insurer can actually provide, including when they must take effect.",
    category: "Before signing a lease",
    insurancePath: insurance,
    sections: [
      { id: "extract", title: "Turn the clause into a checklist", paragraphs: [
        "Copy each requested policy, limit, deductible condition, endorsement, named party, and document deadline into a checklist. Include the exact legal name and address of the landlord and any property manager. Read provisions elsewhere in the lease about repairs, equipment, improvements, indemnity, and early access with your adviser; the insurance paragraph may not describe every obligation.",
        "For each item, record whether the broker has confirmed it, whether additional information is needed, and whether the landlord needs to consider alternative wording. Resolve the differences before treating a quote as evidence that the entire lease is satisfied.",
      ], checklist: ["Policy types and requested limits", "Additional insured names and requested endorsements", "Property, equipment, and improvement responsibilities", "Effective date, certificate deadline, and renewal requirements"] },
      { id: "example", title: "Worked example: a fictional lease request", paragraphs: [
        "Illustration only, not a standard lease requirement: a landlord asks for $1 million per occurrence and $2 million aggregate in general liability, additional insured status, and a certificate before keys are released. This is a checklist exercise, not a recommended limit or a statement of what your landlord will accept.",
        "First, ask the broker to confirm the quoted policy's limits. Next, provide the full clause and legal names so the relevant additional insured coverage can be checked. Finally, agree on the required evidence and timing. A price estimate by itself does not show that coverage has been bound or that the requested endorsement is included.",
      ] },
      { id: "certificate", title: "Certificate holder and additional insured are different", paragraphs: [
        "A certificate summarizes insurance information; it does not itself amend the policy. Listing a landlord as a certificate holder does not, by itself, make that landlord an additional insured. The policy and applicable endorsement determine additional insured coverage.",
        "Ask the broker which endorsement responds to the lease and whether its conditions fit your situation. Keep the certificate and relevant policy documents together so you can answer the landlord's follow-up questions without assuming one document replaces the other.",
      ], links: [{ label: "IRMI: certificates and additional insured coverage", href: "https://www.irmi.com/articles/expert-commentary/questions-and-answers-on-additional-insured-issues-part-2" }] },
      { id: "property", title: "Clarify who is responsible for the physical space", paragraphs: [
        "Make an inventory of equipment, contents, and improvements, identifying what you own, lease, or use with the landlord's permission. Ask your legal adviser how the lease allocates responsibility for damage and repair. Give the inventory and lease language to the broker to discuss the insurance treatment.",
        "Avoid assuming that the landlord's building coverage includes your equipment, your stock, or your lost income. Ask separately about the coverage proposed for each, including valuation, deductibles, exclusions, and any conditions that matter for your kitchen. Record unresolved questions instead of filling gaps with assumptions.",
      ], links: [{ label: "Explore restaurant insurance coverage", href: insurance }] },
      { id: "timing", title: "Match coverage to possession and work dates", paragraphs: [
        "Create a timeline for taking keys, storing equipment, starting construction, training employees, and opening to customers. Explain each stage to the broker. Ask whether the proposed policy accommodates the pre-opening activities or whether a different arrangement is needed.",
        "If the landlord asks for cancellation notice, waiver wording, or coverage that applies before other insurance, send the exact request to the broker. Have the legal adviser address obligations the insurer cannot meet. Keep the agreed wording and final insurance evidence in the same lease file.",
      ], links: [{ label: "Add deposits and premiums to your opening budget", href: "/guides/restaurant-startup-costs" }] },
    ],
  },
  {
    slug: "how-to-open-a-restaurant-in-ohio",
    title: "How to open a restaurant in Ohio: approvals and launch checklist",
    description: "Plan an Ohio restaurant opening with official business registration, local food licensing, and liquor permit resources, plus a practical approval tracker.",
    intro: "For an Ohio restaurant, start by identifying the local health district for the proposed address and asking how your menu, layout, and ownership affect the application. Track business setup, food licensing, premises approvals, and any liquor permit as separate workstreams.",
    category: "Ohio opening guide",
    insurancePath: "/insurance/restaurant/ohio",
    sections: [
      { id: "business", title: "1. Organize the business and its records", paragraphs: [
        "Use the Ohio Secretary of State's business roadmap to identify registration, tax, employer, and licensing tasks that apply to your structure. Keep your business name, ownership details, and address consistent across applications. Confirm the current requirements with the relevant agency or professional adviser rather than copying another restaurant's filings.",
        "Create an opening file with the proposed menu, premises address, ownership information, floor plan, equipment list, and target milestones. Keep a separate list of questions so a missing answer does not get mistaken for a completed approval.",
      ], links: [{ label: "Ohio Secretary of State: starting a business", href: "https://www.ohiosos.gov/business/ohio-business-roadmap/starting-a-business" }] },
      { id: "health", title: "2. Contact the health district for the restaurant address", paragraphs: [
        "Ohio's food-service application statute directs a nonmobile, noncatering food service operation to the licensor for the health district where it is located. Ask that office to confirm the right application for your operation and whether plan review is needed before work starts.",
        "Prepare specific questions: Which drawings and menu details are needed? Who reviews equipment changes? How is an ownership change handled? What must be installed and working before an inspection? Ask for the current forms, fee schedule, and a contact for follow-up. Mobile and catering operations can follow different application routing; this guide focuses on a fixed-location restaurant.",
      ], links: [{ label: "Ohio law: food-service license applications", href: "https://codes.ohio.gov/ohio-revised-code/section-3717.43" }] },
      { id: "premises", title: "3. Resolve the premises questions before construction", paragraphs: [
        "Ask the local planning, building, and fire offices what applies to your address, proposed use, and work. Discuss cooking equipment, ventilation, plumbing, occupancy, signage, and any outdoor seating with the responsible reviewers. Do not treat a food application as approval of all building work.",
        "Create a simple tracker with columns for office, required submission, prerequisite, fee, contact, and next action. Put an owner beside every outstanding item. Ask each reviewer which steps can proceed together and which depend on another sign-off; use those answers to set your construction schedule.",
      ], links: [{ label: "Check the lease's insurance requirements", href: "/guides/restaurant-lease-insurance-requirements" }] },
      { id: "alcohol", title: "4. Investigate alcohol permissions early if needed", paragraphs: [
        "Ohio's OPAL system handles new liquor permit applications and transfers. A new business starts with an OHID account and business entity setup. Confirm the permit class, location eligibility, and whether you need a new permit or a transfer with the Division of Liquor Control.",
        "Keep the alcohol workstream separate from food approval. Ask about the current process before building alcohol sales into your opening assumptions. Give your broker the planned alcohol service and expected sales mix when discussing coverage.",
      ], links: [{ label: "Ohio OPAL: liquor permits and transfers", href: "https://opal.ohio.gov/" }] },
      { id: "budget", title: "5. Build an address-specific budget and opening file", paragraphs: [
        "Use written local estimates for improvements and equipment, and agency-confirmed fees for applications. Add cash needed for rent, training, and other bills while approvals are in progress. There is no single cost or completion date established by this guide; the scope of your project determines both.",
        "Before announcing service, confirm the approvals required for your operation, the status of final inspections, and the effective dates of your insurance. Keep a copy of each approval and policy document accessible to the person running the restaurant.",
      ], checklist: ["Confirm the responsible health district and application.", "Record premises review requirements and outstanding corrections.", "Confirm alcohol permission separately if applicable.", "Check hiring obligations and coverage with the relevant advisers.", "Resolve opening requirements before setting the public date."], links: [{ label: "Restaurant opening-budget worksheet", href: "/guides/restaurant-startup-costs" }, { label: "Ohio restaurant insurance", href: "/insurance/restaurant/ohio" }] },
    ],
  },
  {
    slug: "how-to-open-a-restaurant-in-north-carolina",
    title: "How to open a restaurant in North Carolina: a practical checklist",
    description: "Find the right North Carolina restaurant plan-review path, local opening requirements, and ABC application resources before committing to an opening date.",
    intro: "Start a North Carolina restaurant opening by confirming who will review the food operation: your local environmental health office or, for certain chain and franchise projects, the state Plan Review Unit. Then coordinate that process with premises approvals and any ABC permits.",
    category: "North Carolina opening guide",
    insurancePath: "/insurance/restaurant/north-carolina",
    sections: [
      { id: "reviewer", title: "1. Confirm the correct plan-review route", paragraphs: [
        "NCDHHS's Plan Review Unit reviews plans for franchised or chain food establishments, with review based on the proposed menu and operation. Contact your local environmental health office about your project and confirm whether local or state review applies before submitting plans.",
        "Send a concise project summary: address, new or existing operation, ownership change, franchise status, proposed menu, and construction scope. Ask which drawings and equipment details the reviewer needs. Keep the response with your project documents so your designer and contractor work from the same instructions.",
      ], links: [{ label: "NCDHHS: Plan Review Unit", href: "https://ehs.dph.ncdhhs.gov/faf/food/planreview/index.htm" }] },
      { id: "local", title: "2. Check local requirements, including an ownership change", paragraphs: [
        "Use the county or local office serving the address, not the location of your home or registered agent. For example, Durham County states that a sold establishment's new owner must obtain a new permit before opening. This local example is a reason to ask directly about an acquisition rather than assume the seller's paperwork carries over.",
        "Ask the responsible planning, building, fire, and environmental health offices how their reviews fit together. Confirm the requirements for your work and proposed use, including the final opening process. Keep local instructions distinct from statewide resources; a neighboring county's application is not a substitute for the right office.",
      ], links: [{ label: "Durham County: food-service establishment requirements", href: "https://dconc.gov/Public-Health/Environmental-Health/General-Inspections/Basic-Requirements-for-Food-Service-Establishments" }] },
      { id: "abc", title: "3. Build a separate ABC application checklist", paragraphs: [
        "If you plan to sell alcohol, use the NC ABC Commission's retail application instructions. The required packet depends on ownership structure and permit type. The Commission provides links for supporting documents including local government opinion, inspection/zoning compliance, and seller/server training.",
        "Start from the current packet for your business rather than a generic list from another restaurant. Assign someone to track documents supplied by other parties and ask the Commission about questions specific to your operation. Do not assume food approval authorizes alcohol sales.",
      ], links: [{ label: "NC ABC Commission: how to apply for a retail permit", href: "https://www.abc.nc.gov/permits/retail-permits/how-apply-retail-permit" }] },
      { id: "schedule", title: "4. Plan the lease, work, and cash together", paragraphs: [
        "Before agreeing to a fixed opening date, ask your reviewers about current turnaround and prerequisites. A review estimate is not the full schedule: design revisions, contractor work, equipment delivery, and inspection corrections can each add time. Put those dependencies into your budget discussion with the landlord and contractors.",
        "Use separate budget lines for premises work, equipment, applications, opening inventory, and training. Add recurring cash needs for the period before steady sales. Review the lease with your legal adviser and have your broker check its insurance request before you accept it.",
      ], links: [{ label: "Build the opening budget", href: "/guides/restaurant-startup-costs" }, { label: "Understand lease insurance requests", href: "/guides/restaurant-lease-insurance-requirements" }] },
      { id: "ready", title: "5. Confirm readiness with each responsible party", paragraphs: [
        "Complete business, tax, and employer setup with the appropriate agencies and advisers. For the restaurant itself, ask the food reviewer what must happen before opening and keep that answer in a shared checklist. Confirm any remaining building, fire, and alcohol items separately.",
        "Give your broker the dates for possession, work, staff training, and service, along with the address, menu, alcohol plans, payroll estimate, and equipment values. Request confirmation of the coverage you arrange and its effective date. Finish with a mock service so the team can resolve operational issues before customers arrive.",
      ], checklist: ["Confirm local versus state food plan review.", "Check new-operation and ownership-change requirements.", "Track ABC paperwork separately where applicable.", "Confirm inspection corrections and opening authorization.", "Check policy documents and staff readiness."], links: [{ label: "North Carolina restaurant insurance", href: "/insurance/restaurant/north-carolina" }, { label: "Use the pre-opening checklist", href: "/guides/restaurant-pre-opening-checklist" }] },
    ],
  },
  {
    slug: "restaurant-pre-opening-checklist",
    title: "Restaurant pre-opening checklist: approvals, team, and first service",
    description: "Use this printable restaurant pre-opening checklist to assign owners, resolve dependencies, check insurance timing, and prepare for your first service.",
    intro: "Use this checklist after you have chosen a concept and premises. Work through the stages in order, mark what applies to your restaurant, and give every unresolved item an owner. Print a copy for your opening meeting; the local agencies and your advisers determine the requirements for your operation.",
    category: "Printable checklist",
    insurancePath: insurance,
    sections: [
      { id: "before-spending", title: "Before committing to the space", paragraphs: [
        "Start with questions that could change the project. A layout problem or unclear repair obligation is easier to address before equipment is ordered and construction is underway. Keep a written record of the assumptions you are relying on.",
      ], checklist: ["Match the proposed menu to the kitchen and storage plan.", "Ask local offices what reviews apply to the address and project.", "Review the lease, improvements, and equipment ownership with advisers.", "Send the full insurance clause to your broker.", "Separate confirmed funding from pending financing."], links: [{ label: "Restaurant lease insurance checklist", href: "/guides/restaurant-lease-insurance-requirements" }] },
      { id: "before-work", title: "Before work and equipment installation", paragraphs: [
        "Confirm with the relevant reviewers which approvals must precede work. Coordinate the plans used by the food reviewer, designer, and contractors so a late menu or equipment change does not leave everyone working from different versions.",
      ], checklist: ["Record required approvals, submission dates, and next actions.", "Confirm the scope and exclusions in contractor estimates.", "Confirm equipment dimensions, delivery access, installation, and utilities.", "Clarify insurance for possession, improvements, and stored equipment.", "Recalculate the opening budget when scope changes."], links: [{ label: "Update your restaurant budget", href: "/guides/restaurant-startup-costs" }] },
      { id: "before-inspection", title: "Before final inspections", paragraphs: [
        "Ask each responsible office what must be complete for its inspection. Keep the checklist supplied by that office alongside this planning checklist. Record any correction, who owns it, and how the office will confirm that it has been resolved.",
      ], checklist: ["Confirm required equipment is installed and ready for review.", "Prepare the menu, plans, and other documents the reviewer requested.", "Arrange access for the responsible manager and contractors.", "Track food, building, fire, and alcohol items separately.", "Keep evidence of completed corrections and approvals together."], links: [launch] },
      { id: "before-team", title: "Before staff training and receiving stock", paragraphs: [
        "Prepare the people and the operating systems together. Give the manager a single place to find supplier contacts, emergency contacts, servicing instructions, and the opening schedule. Build training time into payroll and the cash plan.",
      ], checklist: ["Confirm hiring, payroll, and required training with the relevant advisers.", "Agree receiving windows and storage arrangements with suppliers.", "Prepare opening, cleaning, and closing responsibilities.", "Test payment processing, receipts, refunds, and order routing.", "Confirm the effective dates of arranged coverage before the relevant activities begin."], links: [{ label: "Restaurant insurance coverage", href: insurance }] },
      { id: "first-service", title: "Before the first public service", paragraphs: [
        "Run a mock service using a realistic mix of orders. Follow a delivery, a dine-in order, a payment issue, and a closing task from start to finish. Ask the team to flag missing tools and unclear decisions, then assign fixes before repeating the exercise.",
        "Hold a final opening meeting. Separate required approvals and safety issues from optional improvements. Do not treat a checked box on this worksheet as a substitute for the agency's approval or the insurer's confirmation of coverage.",
      ], checklist: ["Confirm required approvals with each responsible office.", "Resolve outstanding safety issues and inspection conditions.", "Check issued insurance documents and landlord evidence requirements.", "Confirm suppliers, staff assignments, and customer-facing hours.", "Assign a manager to review issues after the first service."], links: [{ label: "See the complete restaurant launch sequence", href: "/guides/how-to-open-a-restaurant" }] },
    ],
  },
];

export function getRestaurantGuide(slug: string) {
  return RESTAURANT_GUIDES.find((guide) => guide.slug === slug);
}
