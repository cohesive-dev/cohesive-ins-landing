import type { RestaurantGuide } from "./restaurant";

const coiChecklist = {
  label: "General contractor COI request checklist",
  href: "/guides/contractor-certificate-of-insurance-before-starting-work",
};

export const COI_REQUIREMENT_GUIDES: RestaurantGuide[] = [
  {
    slug: "city-of-fairfax-right-of-way-permit-insurance",
    title: "City of Fairfax right-of-way permit: COI checklist for contractors",
    metaTitle: "City of Fairfax Right-of-Way Permit Insurance and COI",
    description: "For work in the City of Fairfax right of way, check the permit packet, general liability certificate and additional-insured endorsement before work starts.",
    intro: "Planning work in a City of Fairfax street, sidewalk or easement? The city's right-of-way permit process is a specific case where a contractor may need insurance documents before the permit is issued. Start with the current city packet for your job, then give its exact requirements to your agent.",
    category: "City permit insurance",
    industry: "Contractors",
    tradeLabel: "General contractor",
    insurancePath: "/insurance/general-contractor/virginia",
    quoteKind: "service",
    updatedAt: "2026-10-30",
    nationalSlug: "contractor-quote-checklists",
    sections: [
      {
        id: "when-it-applies", title: "Does this right-of-way requirement apply to your job?",
        paragraphs: [
          "The City of Fairfax says a right-of-way permit is required for disturbance in its roads, streets and easements. Its examples include excavation, line work, sidewalk or curb replacement and some lane or sidewalk closures. A building permit for work on a private site is a different process. Ask Public Works which permit applies to your exact location and scope.",
          "The city's posted right-of-way application says a valid general liability certificate and an endorsement naming the City of Fairfax as an additional insured are required for permit issuance, subject to the form's waiver provision. Check the current online permit instructions and any project-specific conditions before ordering a certificate. Do not assume this wording applies to every Virginia city or every Fairfax permit."
        ],
        checklist: ["Confirm the work is inside the City of Fairfax right of way.", "Get the current permit packet and any project-specific insurance exhibit.", "Give your agent the permit name, job scope, location and intended start date."],
        links: [
          { label: "City of Fairfax: current right-of-way permit instructions", href: "https://www.fairfaxva.gov/Property-Business/Permit-License-Hub/Permit-Applications/Right-of-Way-Permit-Information" },
          { label: "City of Fairfax: posted right-of-way permit form (PDF)", href: "https://www.fairfaxva.gov/files/assets/city/v/1/permitting/documents/permit-applications/row-permit-2021.pdf" },
        ],
      },
      {
        id: "request-documents", title: "What should you send your insurance agent?",
        paragraphs: [
          "Send the city's current form and the contract or permit insurance section. Ask the agent to check whether the existing general liability policy accepts your actual work and can provide the requested endorsement. A certificate names the policy and holder; it does not create additional-insured coverage by itself.",
          "If the policy, named insured, dates or endorsement do not match the request, resolve the difference before promising a permit date. Work involving excavation, utilities, traffic control or subcontractors should be described accurately rather than folded into a generic construction label."
        ],
        checklist: ["Check the legal business name and policy dates.", "Ask for the City of Fairfax additional-insured endorsement if required by the current packet.", "Keep the issued certificate and endorsement with the permit file."],
        links: [coiChecklist, { label: "City of Alexandria right-of-way COI checklist", href: "/guides/city-of-alexandria-right-of-way-permit-insurance" }],
      },
    ],
  },
  {
    slug: "city-of-alexandria-right-of-way-permit-insurance",
    title: "City of Alexandria right-of-way permit: COI checklist for contractors",
    metaTitle: "City of Alexandria Right-of-Way Permit Insurance and COI",
    description: "Check Alexandria's right-of-way permit guidelines, general liability certificate, city additional-insured requirement and job-specific documents.",
    intro: "A contractor using a City of Alexandria street, sidewalk, public alley or other public right of way should check the city's permit category before work begins. The published permit guidelines call for a general liability certificate for most right-of-way permits. Use the current city instructions for your particular permit, not a generic Virginia COI template.",
    category: "City permit insurance",
    industry: "Contractors",
    tradeLabel: "General contractor",
    insurancePath: "/insurance/general-contractor/virginia",
    quoteKind: "service",
    updatedAt: "2026-10-30",
    nationalSlug: "contractor-quote-checklists",
    sections: [
      {
        id: "permit-scope", title: "Which Alexandria work needs this COI?",
        paragraphs: [
          "Alexandria says work in or use of its public right of way requires a Transportation & Environmental Services permit. The city lists streets, sidewalks, public alleys and the landscaping strip by the street. Its guidelines say a general liability certificate must be provided before issuance of right-of-way work/use permits, except hauling permits.",
          "The same city guidance says Alexandria must be named as an additional insured or co-insured on the certificate. Ask your agent to review the contract and actual policy endorsement before using that wording; putting a name on a certificate alone does not amend the policy. Confirm the current limit and document requirements with the permit office because permit type and project terms can differ."
        ],
        checklist: ["Identify the exact right-of-way activity and permit type.", "Ask the city for its current insurance and bonding instructions.", "Send the full requirements to your agent before the permit deadline."],
        links: [{ label: "City of Alexandria: right-of-way permit guidelines", href: "https://www.alexandriava.gov/permits/permit-guidelines-transportation-environmental-services" }],
      },
      {
        id: "agent-file", title: "Build the certificate request file",
        paragraphs: [
          "Give the agent the legal named insured, work location, project dates, job description and the city's requested certificate holder and additional-insured language. Include any excavation, subcontractor, commercial auto or bonding terms from your actual permit packet. Keep those separate from the general liability certificate question.",
          "If the policy does not cover an operation or cannot supply a required endorsement, ask for a corrected insurance solution before telling the city the documentation is complete. Keep the issued certificate, endorsement and permit confirmation together."
        ],
        checklist: ["Match named insured and policy dates to the application.", "Confirm any additional-insured endorsement with the agent.", "Recheck the document if the scope or permit dates change."],
        links: [coiChecklist, { label: "City of Fairfax right-of-way COI checklist", href: "/guides/city-of-fairfax-right-of-way-permit-insurance" }],
      },
    ],
  },
  {
    slug: "greystar-supplier-insurance-coi-checklist",
    title: "Greystar supplier onboarding: insurance and COI checklist",
    metaTitle: "Greystar Supplier Insurance and COI Checklist",
    description: "Prepare the supplier compliance file, current COIs and policy endorsements requested for work at a Greystar-managed property.",
    intro: "A contractor seeking work at a Greystar-managed community should separate supplier registration from the insurance review for a particular property. Greystar's public US supplier materials describe a credentialing process, while its terms describe the COI and endorsement evidence a property owner may request. The property contract sets the actual coverage amounts and parties. This independent checklist is not Greystar's approval of a supplier.",
    category: "Property manager vendor insurance",
    industry: "Contractors",
    tradeLabel: "General contractor",
    insurancePath: "/insurance/general-contractor",
    quoteKind: "service",
    updatedAt: "2026-10-30",
    nationalSlug: "contractor-quote-checklists",
    sections: [
      {
        id: "supplier-process", title: "Start with the supplier and property requirements",
        paragraphs: [
          "Greystar's US supplier page says suppliers servicing its communities must register and maintain compliance through its supplier credentialing program, which uses NetVendor for insurance and trade-license verification. This is separate from being selected for a particular job. Ask the property contact which legal owner, property contract and credentialing invitation apply.",
          "The supplier terms say current certificates must be on file with the owner's compliance provider before services begin, with coverage types and amounts requested by the owner or property contract. There is no single published dollar limit in those general terms that fits every contractor or property. Do not copy a limit from another vendor's packet."
        ],
        checklist: ["Confirm the invitation and current credentialing route with the property contact.", "Obtain the property-specific insurance exhibit and legal owner name.", "Describe the exact work, subcontractors, vehicles and locations to your agent."],
        links: [
          { label: "Greystar: US supplier partnerships and credentialing", href: "https://www.greystar.com/contact-us/supplier-and-vendor-opportunities/us-supplier-partnerships" },
          { label: "Greystar: supplier general terms and conditions", href: "https://www.greystar.com/contact-us/supplier-and-vendor-opportunities/us-supplier-partnerships/us-supplier-general-term-conditions" },
        ],
      },
      {
        id: "endorsement-review", title: "Check the COI and endorsements, not only the certificate holder",
        paragraphs: [
          "Greystar's terms call for additional-insured endorsements on general liability for Greystar, the owner and other required parties. They also address ongoing and completed operations as appropriate, primary and non-contributory wording, and waiver of subrogation where permitted. Ask your agent which terms apply to your actual contract and policy. A certificate alone does not add those protections.",
          "The terms call for certificates to stay current and for annual renewal with the compliance provider. Save the issued certificate, applicable endorsements, policy renewal date and any rejection notice. If a requested term is unavailable, resolve it with the property contact and insurer before mobilizing."
        ],
        checklist: ["Verify the legal certificate holder and every party the contract names.", "Review additional-insured, completed-operations, primary/non-contributory and waiver terms with the agent.", "Track renewal and resubmit current evidence through the applicable portal."],
        links: [coiChecklist, { label: "How to prepare a GC subcontractor insurance file", href: "/guides/general-contractor-subcontractor-insurance-checklist" }],
      },
    ],
  },
];
