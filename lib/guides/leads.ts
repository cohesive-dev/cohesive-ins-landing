import type { GuideSection } from "./restaurant";

const certificateSource = { label: "Texas Department of Insurance: what a certificate of insurance does and does not show", href: "https://www.tdi.texas.gov/certificates/faq.html" };
const marketingSource = { label: "SBA: marketing and sales planning", href: "https://www.sba.gov/business-guide/manage-your-business/marketing-sales" };

type LeadProfile = { realtors: string; gcs: string; pms: string; offer: string };
const profiles: Record<string, LeadProfile> = {
  janitorial: {
    realtors: "Offer listing-preparation and move-in or move-out cleaning to real estate agents. Explain what a standard clean includes, which deep-cleaning tasks cost extra, and how much notice you need before a showing or handover.",
    gcs: "Approach general contractors (GCs) about post-construction cleaning and final handover cleans. Define the dust, debris, surfaces, access, and finish-protection requirements before quoting; do not assume ordinary office-cleaning pricing or insurance fits construction cleanup.",
    pms: "Contact property managers (PMs) about recurring common-area or office cleaning and vacant-unit turnovers. Ask who approves vendors, how walkthroughs are arranged, and whether supplies, keys, and after-hours access are part of the contract.",
    offer: "a walkthrough for recurring cleaning or an upcoming turnover",
  },
  "pool-construction": {
    realtors: "Build relationships with real estate agents serving homeowners planning backyard improvements. Offer a construction-planning conversation for buyers considering a new pool or renovation; keep inspections, appraisals, and maintenance outside the offer unless you are qualified and insured for them.",
    gcs: "Meet custom-home builders and general contractors (GCs) whose projects include pools. Ask how they select pool subcontractors, what drawings they need for a bid, and who owns the excavation, utility, decking, and inspection coordination.",
    pms: "Contact property managers (PMs) responsible for communities with planned pool renovations. Ask about capital-project schedules and the vendor approval process. Pursue commercial or public-pool work only when your credentials, team, and insurance fit that scope.",
    offer: "a scope discussion for an upcoming pool installation or renovation",
  },
  roofing: {
    realtors: "Reach out to real estate agents who need a dependable roofing contact for seller repairs or buyer-requested estimates. Explain which roof systems you handle and your actual scheduling capacity. Offer a scoped estimate without promising an inspection certification or insurance-claim outcome.",
    gcs: "Ask general contractors (GCs), remodelers, and home builders about their roofing subcontractor roster. Share the systems you install, service area, crew capacity, and documentation. Ask for their bid invitation process and insurance requirements before committing to a project.",
    pms: "Contact property managers (PMs) about roof repairs, replacement planning, and vendor onboarding for buildings you can service. Clarify access, occupied-building precautions, response hours, and who can authorize work. Do not advertise emergency availability you cannot deliver.",
    offer: "an estimate for a roof repair or replacement within our service scope",
  },
  "tree-service": {
    realtors: "Offer real estate agents a reliable contact for qualified tree pruning or removal estimates before a sale or after a purchase. Describe your credentials and work limits; do not present a sales estimate as an arborist report unless you are qualified to provide that service.",
    gcs: "Introduce your business to general contractors (GCs) and landscapers who need tree-work partners for renovation or site projects. Confirm the specific trees, permissions, access, protection requirements, and whether the requested work fits your crew and equipment.",
    pms: "Approach property managers (PMs) with a defined tree-care service area and process for assessing proposed work. Ask about scheduled maintenance, approval limits, debris removal, and vendor documents. Refer utility-line work and other jobs outside your qualifications to appropriate specialists.",
    offer: "a site visit to scope pruning, removal, or stump work",
  },
  remodeling: {
    realtors: "Contact real estate agents about pre-listing improvements and renovation plans for recent buyers. Offer a defined project type, such as bathroom or interior remodeling, and explain how you handle estimates, allowances, and scheduling around a move.",
    gcs: "Build relationships with general contractors (GCs) who need a specialist subcontractor or a dependable partner for smaller projects. State which work you self-perform and which requires licensed specialty trades. Ask how they prequalify partners and invite bids.",
    pms: "Reach property managers (PMs) with a clear offer for vacant-unit renovations or planned interior upgrades. Ask about finish standards, occupied-site restrictions, change approvals, vendor insurance documents, and payment timing before pricing the first project.",
    offer: "a walkthrough for an upcoming interior renovation",
  },
};

export function serviceLeadSections(industry: { id: string; name: string }, stateName?: string): GuideSection[] {
  const profile = profiles[industry.id];
  if (!profile) throw new Error(`Missing lead-generation profile: ${industry.id}`);
  return [
    { id: "get-leads", title: `How to get ${industry.name.toLowerCase()} leads${stateName ? ` in ${stateName}` : ""}`, paragraphs: [
      "Build a referral pipeline around people who repeatedly hire or recommend your type of business: real estate agents, general contractors (GCs), and property managers (PMs). Choose prospects whose properties, projects, and locations match your actual capabilities. The goal is a relevant conversation and a place in their vendor process, not a promise of immediate jobs.",
      "Get appropriate insurance in place first, before pitching yourself as an insured, job-ready vendor. You can ask a prospect for its vendor requirements while arranging coverage, but do not claim you are insured until the coverage is actually in force. Complete required licensing and vendor approval before accepting work that depends on them.",
    ] },
    { id: "insurance-before-outreach", title: "Get insured and prepare your vendor packet first", paragraphs: [
      "Ask a prospective partner for its written insurance requirements and give them to your broker with an accurate description of the work. Discuss general liability, workers' compensation where applicable, business vehicles, and any requested endorsements or bonds. Confirm the policy's effective date, covered operations, exclusions, and your ability to meet the contract before committing to the job.",
      "Have your agent provide a current certificate of insurance (COI) and any required supporting endorsements. A certificate summarizes policy information; it does not create coverage. Being a certificate holder does not by itself make a partner an additional insured. Ask the broker to resolve missing requirements rather than editing the certificate or promising coverage that has not been arranged.",
      "Prepare a concise vendor packet: services and exclusions, service area, verified credentials, current insurance evidence, real project examples or references used with permission, contact details, and realistic availability. Send tax and banking documents only through the partner's verified onboarding process when requested. Refresh insurance documents when coverage renews or changes.",
    ], checklist: ["Obtain the partner's written vendor and insurance requirements.", "Arrange appropriate coverage and confirm it is in force before claiming insured status.", "Request the COI and any required endorsements from the agent.", "Prepare service-area, scope, credentials, references, and availability information."], links: [certificateSource] },
    { id: "referral-partners", title: "Reach realtors, GCs, and property managers with a specific offer", paragraphs: [profile.realtors, profile.gcs, profile.pms,
      "For a manageable first outreach batch, make a list of 20 relevant local businesses using their public business websites and professional directories. This is a suggested working target, not a forecast. Record the business contact, relevant service need, introduction route, and next action. Start with existing relationships where possible and ask who manages approved vendors.",
    ] },
    { id: "outreach-and-follow-up", title: "Use a short introduction, then track the next step", paragraphs: [
      `Adapt this example only after the insurance statement is true: “Hi [name], I run [business], a ${industry.name.toLowerCase()} business serving [area]. We carry insurance for the services we offer and can send our COI for review against your requirements. We can help with ${profile.offer}. Who handles vendor approval, and would a short introduction be useful?”`,
      "Personalize the note to the partner's work. Ask for one next step: a vendor application, introductory call, site walkthrough, or permission to send your service sheet. Use a public business contact channel, keep follow-up relevant, and honor requests to stop. Do not say you are already approved or guarantee that your coverage meets their requirements before review.",
      "Keep a simple lead sheet with partner name, source, contact date, insurance or onboarding items outstanding, next follow-up, walkthrough date, proposal value, outcome, and expected margin. Review it weekly. Measure qualified conversations, vendor approvals, bids, and profitable won jobs separately; an approved-vendor listing does not guarantee work. After a successful handoff, ask for an honest review or an introduction to another suitable contact.",
    ], checklist: ["List 20 relevant local referral partners and the need you can address.", "Send a truthful introduction and ask for the vendor approval process.", "Record follow-up dates and close out missing onboarding documents.", "Track walkthroughs, proposals, won jobs, margin, and referral sources."], links: [marketingSource] },
  ];
}

export function restaurantLeadSections(): GuideSection[] {
  return [
    { id: "get-leads", title: "How to get your first customers and local referrals", paragraphs: [
      "Build local demand around the service you can deliver: dine-in visits, takeaway, office meals, or catering. Set up clear menu, location, ordering, and opening-hours information, then approach nearby businesses with a specific offer. Keep launch dates tentative until required approvals are complete.",
      "Real estate agents can be contacts for open-house catering or new-neighbor recommendations. Property managers (PMs) can connect you with tenant events and nearby office communities. General contractors (GCs) and other local employers may need crew lunches or meeting meals. Ask about the actual need, ordering lead time, headcount, budget, and delivery access; these relationships are prospects, not guaranteed accounts.",
    ] },
    { id: "insurance-before-outreach", title: "Arrange insurance before pitching an insured catering or event service", paragraphs: [
      "Get appropriate insurance in place before presenting the restaurant as an insured vendor. Tell your broker about off-premises catering, delivery, events, and alcohol service if offered; a policy for one operation should not be assumed to cover every expansion. Obtain the customer's or venue's written vendor requirements, and resolve coverage and approval requirements before accepting the event.",
      "Have the agent supply the certificate of insurance and any required endorsements. The certificate reports coverage rather than creating it, and listing a certificate holder does not itself provide additional insured status. Describe your current capabilities truthfully while any insurance or food-service approvals are still pending.",
    ], checklist: ["Define the meals, catering, or event service you can fulfill.", "Confirm approvals and insurance for the actual service before accepting orders.", "Prepare a menu, minimum order, lead time, service area, and current insurance evidence."], links: [certificateSource] },
    { id: "local-outreach", title: "Turn an introduction into a repeat order", paragraphs: [
      "Once ready, adapt this introduction: “Hi [name], I run [restaurant] near [location]. We offer [specific meal or catering service] for [group size] with [lead time]. We carry insurance for that service and can send a COI for your vendor review. Who coordinates meals or events for your team?” Use the insurance statement only when true and quote capacity you can actually handle.",
      "Track the contact, referral source, requested menu, event or order date, vendor requirements, next follow-up, quoted value, and margin after food, labor, packaging, and delivery. Ask satisfied customers about repeat orders and introductions. Start with a manageable number of orders so your first referrals are supported by dependable service.",
    ], checklist: ["Contact relevant local agents, property managers, and employers with one specific offer.", "Track vendor approval, follow-up dates, orders, and contribution after delivery costs.", "Ask satisfied customers for feedback and a relevant introduction."], links: [marketingSource] },
  ];
}
