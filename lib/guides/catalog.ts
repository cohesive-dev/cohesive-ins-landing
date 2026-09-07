import { getContractorState, contractorStateBuildable } from "../seo/contractor-states";
import { addStartupVendors } from "./vendors";
import { serviceLeadSections, restaurantLeadSections } from "./leads";
import { RESTAURANT_GUIDES, type RestaurantGuide, type GuideSection } from "./restaurant";
import { STARTUP_STATES, SPECIAL_TRADE_RESOURCES, type StartupState } from "./states";
import { SERVICE_INDUSTRIES, nationalServiceGuide, type ServiceIndustry } from "./services";
import registration from "./registration.json";

type RegistrationLink = { label: string; href: string };
const registrationLinks: Record<string, RegistrationLink> = registration.states;

function businessSection(state: StartupState): GuideSection {
  const office = registrationLinks[state.slug];
  return { id: "business-setup", title: `Business setup in ${state.name}`, paragraphs: [
    `The SBA's state directory lists ${office.label} as a registration starting point. Select the route for your entity type and business name; a trade name, an LLC filing, and an occupational license are different tasks. Ask the office to direct you if your structure is handled by another agency.`,
    "Keep the legal name, owner information, registered address, tax identifiers, and employer setup consistent across applications. Ask the state revenue agency how your exact services are taxed and the local government whether a business or premises permit is needed. Do not assume that forming an entity completes those steps.",
  ], checklist: ["Choose the entity and name-registration route with your adviser.", "Record federal and state tax setup and employer accounts.", "Confirm city or county business and premises requirements."], links: [office, { label: "SBA directory: state registration offices", href: registration.source }] };
}

function restaurantStateGuide(state: StartupState): RestaurantGuide {
  return {
    slug: `how-to-open-a-restaurant-in-${state.slug}`,
    title: `How to open a restaurant in ${state.name}: permits and launch checklist`,
    description: `Find ${state.name} restaurant approval resources, the food-licensing contact, business setup steps, and a checklist for the premises, budget, and opening.`,
    intro: `Plan your ${state.name} restaurant around the premises and menu before committing to construction or an opening date. Start with the food-review route below, then track the business, building, and alcohol approvals separately.`,
    category: `${state.name} restaurant startup`, industry: "Restaurants", stateSlug: state.slug,
    nationalSlug: "how-to-open-a-restaurant", quoteKind: "restaurant", tradeLabel: "Restaurant",
    insurancePath: "/insurance/restaurant", noQuote: state.slug === "california",
    noQuoteReason: state.slug === "california" ? "This California guide is for planning. Cohesive does not currently offer California insurance placement." : undefined,
    sections: [
      { id: "food-authority", title: `Find the food-review route in ${state.name}`, paragraphs: [state.food.note, "Give the reviewer the street address, proposed menu, service model, floor plan, equipment list, and whether you are building, remodeling, or buying an existing operation. Ask which work must wait for approval and what will be needed before an opening inspection."], links: [state.food], checklist: ["Confirm the reviewer for the exact premises address.", "Get the current plan-review and food-permit packet.", "Ask about ownership changes, menu changes, and equipment changes.", "Record the current fee, submission method, and next action."] },
      businessSection(state),
      { id: "premises", title: "Coordinate premises work and contractor credentials", paragraphs: [state.construction.note, "This construction resource helps you check the contractors doing your fit-out; it is not a restaurant operating license. Give your designer and contractors the same menu and plan version. Ask the local building and fire offices about the work and occupancy approvals for the address."], links: [state.construction], checklist: ["Clarify responsibility for hood, plumbing, electrical, and other specialist work.", "Confirm permits before ordering work dependent on approval.", "Record landlord approval and who owns the improvements."] },
      { id: "budget", title: "Budget the launch and the waiting period", paragraphs: ["Obtain written estimates for deposits, professional help, construction, installed equipment, opening stock, and staff training. Record which prices are confirmed and what is excluded. Use agency-confirmed fees instead of assuming another town's permit cost applies.", "Keep monthly cash needs separate from one-time spending. Test a later opening and slower initial sales so you can see whether the business can still meet rent and payroll. The free worksheet lets you enter your own costs without treating an illustrative figure as a local benchmark."], links: [{ label: "Use the restaurant startup budget worksheet", href: "/guides/restaurant-startup-costs" }] },
      { id: "alcohol-and-team", title: "Resolve alcohol, staffing, and coverage separately", paragraphs: ["If alcohol is part of the concept, contact the state alcohol authority and the local licensing office about the proposed location and service. Ask about the application route, supporting documents, and any ownership transfer. A food approval does not establish permission to sell alcohol.", "Prepare the staffing plan and confirm payroll, required training, and workers' compensation questions with the relevant advisers. Give the insurance broker the possession, construction, training, and opening dates so the conversation covers the activities before the first public service."], links: [{ label: "Questions to ask about a restaurant lease", href: "/guides/restaurant-lease-insurance-requirements" }] },
      ...restaurantLeadSections(),
      { id: "opening-file", title: "Build the final opening file", paragraphs: ["Keep agency approvals, corrections, supplier contacts, lease documents, staff responsibilities, and any issued insurance evidence in one accessible file. Assign an owner to unresolved items. A completed planning checklist does not replace the approval required by the responsible authority."], checklist: ["Confirm final food, building, fire, and alcohol items as applicable.", "Resolve corrections and record who confirmed completion.", "Check deliveries, staff training, and operating systems.", "Rehearse the first service and assign fixes.", "Set the public date once the required approvals are confirmed."], links: [{ label: "Full restaurant pre-opening checklist", href: "/guides/restaurant-pre-opening-checklist" }] },
    ],
  };
}

function serviceStateGuide(industry: ServiceIndustry, state: StartupState): RestaurantGuide {
  const specific = SPECIAL_TRADE_RESOURCES[`${industry.id}:${state.slug}`];
  const construction = ["pool-construction", "roofing", "remodeling"].includes(industry.id);
  const noQuote = state.slug === "california" || (industry.id === "roofing" && ["new-york", "florida"].includes(state.slug));
  const insurancePath = !noQuote && getContractorState(state.slug) && contractorStateBuildable(industry.insuranceSlug, state.slug)
    ? `/insurance/${industry.insuranceSlug}/${state.slug}`
    : `/insurance/${industry.insuranceSlug}`;
  const licenseParagraphs = specific ? [specific.note] : construction ? [state.construction.note] : [
    `For a ${industry.noun}, first check the official ${state.name} business-registration route below, then ask about credentials tied to the specific services and staffing model. This guide does not establish that a special license is unnecessary.`,
  ];
  return {
    slug: `${industry.slug}-in-${state.slug}`,
    title: `How to start a ${industry.noun} in ${state.name}`,
    description: `${state.name} ${industry.noun} startup checklist: official registration resources, licensing questions, first-job pricing, equipment, and insurance preparation.`,
    intro: `Build your ${state.name} ${industry.noun} around a defined service area and a first contract you can deliver well. Use the official resources below to check the registration and licensing route, then turn the job scope into a staffing, equipment, and cash plan.`,
    category: `${state.name} service business startup`, industry: industry.name, stateSlug: state.slug,
    nationalSlug: industry.slug, quoteKind: "service", tradeLabel: industry.name,
    insurancePath, noQuote,
    noQuoteReason: noQuote ? `This ${state.name} guide is for planning. Cohesive does not currently offer ${industry.name.toLowerCase()} insurance placement in this state.` : undefined,
    sections: [
      { id: "scope", title: `Choose the ${industry.name.toLowerCase()} work you will sell`, paragraphs: [industry.sections[0].paragraphs[0], "Define the first service area narrowly enough to estimate travel, supervision, and scheduling. Set written boundaries for work needing another specialist or credentials you do not yet hold."], checklist: industry.scope },
      { id: "state-licensing", title: `Check the ${state.name} licensing route`, paragraphs: [...licenseParagraphs, "Describe the work, project type, staffing, and business location to the responsible office. Ask for the current application, scope rules, renewal requirements, and any supporting insurance or bond documents. Confirm before using a license claim in an advertisement or bid."], links: specific ? [specific] : construction ? [state.construction] : [registrationLinks[state.slug]] },
      businessSection(state),
      { id: "local-checks", title: "Questions for the local authority and your advisers", paragraphs: ["These are questions to resolve for your operation, not statements that every listed requirement applies. Keep the agency's response, contact, date, and follow-up action with your first-job file. A state registration does not replace job-specific permits."], checklist: industry.localQuestions },
      { id: "budget-and-bid", title: "Build a startup budget and first-job estimate", paragraphs: ["Get written local estimates for the equipment, training, setup, and supplies you actually need. Compare renting with buying before committing cash to an unproven service. Keep pending financing out of the cash available to pay suppliers and staff.", "Estimate the first job from its scope and payment schedule. Price travel, supervision, overhead, and rework alongside direct labor and materials. Compare the cash needed before collection with your reserve so a signed contract does not create an immediate funding gap."], checklist: industry.costs },
      { id: "bid-inputs", title: "What to include in the customer estimate", paragraphs: ["Use one scope version for your estimate, supplier requests, and customer proposal. Put allowances and exclusions in writing and identify who approves extra work. Have the contract reviewed for the applicable local consumer and commercial requirements."], checklist: industry.bidInputs },
      { id: "insurance", title: "Prepare the insurance and customer requirements", paragraphs: ["Give a broker the exact services, state, expected revenue, payroll, subcontracting plan, equipment, and customer insurance clauses. Ask how the proposed policy addresses the work and which exclusions matter. A certificate of insurance is not permission to perform work outside your licensing or policy scope."], checklist: industry.insuranceQuestions, links: noQuote ? undefined : [{ label: `${industry.name} insurance: coverage and requirements in ${state.name}`, href: insurancePath }] },
      ...serviceLeadSections(industry, state.name),
      { id: "first-job", title: "Make the first job a repeatable process", paragraphs: [industry.sections[industry.sections.length - 1].paragraphs[0], "After completion, compare actual hours, materials, travel, and callbacks with the estimate. Use the result to improve the next bid and decide when the business can support another employee or a wider service area."], checklist: ["Confirm customer scope, permissions, price, and payment timing.", "Verify qualifications, staffing, equipment, and any job approvals.", "Document changes before performing extra work.", "Complete a customer handoff and record outstanding items."], links: [{ label: `Full ${industry.name.toLowerCase()} startup guide`, href: `/guides/${industry.slug}` }] },
    ],
  };
}

const authoredRestaurants = RESTAURANT_GUIDES.map((guide): RestaurantGuide => {
  const state = STARTUP_STATES.find((s) => guide.slug === `how-to-open-a-restaurant-in-${s.slug}`);
  return { ...guide, sections: guide.slug === "how-to-open-a-restaurant" || state ? [...guide.sections, ...restaurantLeadSections()] : guide.sections, industry: "Restaurants", quoteKind: "restaurant", tradeLabel: "Restaurant", nationalSlug: "how-to-open-a-restaurant", ...(state ? { stateSlug: state.slug } : {}) };
});
const authoredSlugs = new Set(authoredRestaurants.map((guide) => guide.slug));

export const STARTUP_GUIDES: RestaurantGuide[] = [
  ...authoredRestaurants,
  ...STARTUP_STATES.map(restaurantStateGuide).filter((guide) => !authoredSlugs.has(guide.slug)),
  ...SERVICE_INDUSTRIES.map(nationalServiceGuide),
  ...SERVICE_INDUSTRIES.flatMap((industry) => STARTUP_STATES.map((state) => serviceStateGuide(industry, state))),
].map(addStartupVendors);

export const NATIONAL_STARTUP_GUIDES = STARTUP_GUIDES.filter((g) => !g.stateSlug && g.slug === g.nationalSlug);
export function getStartupGuide(slug: string) { return STARTUP_GUIDES.find((guide) => guide.slug === slug); }
export function getStateGuides(guide: RestaurantGuide) { return STARTUP_GUIDES.filter((other) => other.stateSlug && other.nationalSlug === guide.nationalSlug).sort((a, b) => a.stateSlug!.localeCompare(b.stateSlug!)); }
export function getRelatedGuides(guide: RestaurantGuide) { return STARTUP_GUIDES.filter((other) => other.slug !== guide.slug && !other.stateSlug && other.nationalSlug === guide.nationalSlug); }
