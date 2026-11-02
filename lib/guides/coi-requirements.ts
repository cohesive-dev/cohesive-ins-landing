import type { RestaurantGuide } from "./restaurant";

const coiChecklist = {
  label: "General contractor COI request checklist",
  href: "/guides/contractor-certificate-of-insurance-before-starting-work",
};

export const COI_REQUIREMENT_GUIDES: RestaurantGuide[] = [
  {
    slug: "equity-residential-vendor-insurance-coi-checklist",
    title: "Equity Residential vendor COI: class and certificate checklist",
    metaTitle: "Equity Residential Vendor Insurance and COI Checklist",
    description: "Ask for your assigned Equity Residential insurance class and check the COI wording, holder address and expiration before vendor work begins.",
    intro: "Equity Residential publishes an insurance-class guide for suppliers. Its requirements depend on the class level assigned to the vendor, and it says individual circumstances may change them. Get the current class and property-specific instructions from your Equity representative before your agent issues a certificate.",
    category: "Property manager vendor insurance",
    industry: "Contractors",
    tradeLabel: "General contractor",
    insurancePath: "/insurance/general-contractor",
    quoteKind: "service",
    updatedAt: "2026-10-31",
    nationalSlug: "contractor-quote-checklists",
    sections: [
      {
        id: "assigned-class", title: "Find the assigned insurance class first",
        paragraphs: [
          "Equity Residential's published supplier guide says the vendor should be told which insurance class to carry and provides different coverage tables and sample certificates by class. It also says requirements may change for specific vendors. Do not choose a class or copy another contractor's limits; ask your Equity contact for the current assignment and any contract-specific insurance exhibit.",
          "A vendor registration or COI submission is separate from being selected for a job. Describe your actual operations, subcontractors, vehicles and work location to your agent so the policy and documents match the intended work."
        ],
        checklist: ["Get your assigned class and current supplier requirements from the Equity contact.", "Send the complete insurance exhibit and job scope to your agent.", "Compare requested lines and limits with the actual policies before mobilization."],
        links: [{ label: "Equity Residential: published supplier insurance-class guide (PDF)", href: "https://media.equityapartments.com/image/upload/v1733239825/Documents/Insurance-Requirements-6-1-23.pdf" }],
      },
      {
        id: "certificate-review", title: "Check the certificate before submitting it",
        paragraphs: [
          "The published guide asks for Equity Residential and its affiliate companies in the certificate's Description of Operations, the certificate-holder address shown on its sample, and a certificate valid for a year; it says certificates expiring within 30 days will be rejected. Because the posted PDF is dated 2023, confirm the current wording and destination with your representative before issuance.",
          "If the contract requests additional-insured status, have your agent confirm that the actual policy or endorsement provides it. Wording on the COI alone does not grant coverage. Retain the issued certificate and any applicable endorsements, then track renewal so a property-compliance rejection does not interrupt work."
        ],
        checklist: ["Use the current certificate-holder name and address supplied for your vendor file.", "Ask the agent to verify policy dates and any additional-insured endorsement.", "Resolve a rejected certificate with the property contact and insurer before starting work."],
        links: [coiChecklist, { label: "Greystar supplier COI checklist", href: "/guides/greystar-supplier-insurance-coi-checklist" }],
      },
    ],
  },
  {
    slug: "richmond-work-in-streets-permit-insurance",
    title: "Richmond Work in Streets permit: insurance file for contractors",
    metaTitle: "Richmond Work in Streets Permit COI for Contractors",
    description: "Richmond contractors applying for a Work in Streets permit can prepare the certificate of insurance, license information and traffic plan the city requests.",
    intro: "Richmond's Work in Streets permit applies to work in the public right of way, including excavation, construction staging, driveways and utility work. When a contractor applies, the city lists a certificate of insurance and contractor license information among the submission requirements. This checklist helps you assemble that file for your specific job.",
    category: "City permit insurance",
    industry: "Contractors",
    tradeLabel: "General contractor",
    insurancePath: "/insurance/general-contractor/virginia",
    quoteKind: "service",
    updatedAt: "2026-10-31",
    nationalSlug: "contractor-quote-checklists",
    sections: [
      {
        id: "permit-scope", title: "Which Richmond jobs need the permit file?",
        paragraphs: [
          "The city's Right-of-Way Management page says all work in the public right of way requires a Work in Streets permit. Its examples include excavation, cranes, subdivision construction, driveways, utility work and temporary structures. Confirm with the city whether your precise site and activity fall within that boundary before requesting insurance paperwork.",
          "The posted submission list includes a completed application, site plan and traffic-control or maintenance-of-traffic plan. If a contractor makes the application, the list also calls for a certificate of insurance and contractor license information. A sidewalk or lane obstruction can require additional plans; the COI is only one part of the permit file."
        ],
        checklist: ["Identify the right-of-way location, exact work and any sidewalk or lane obstruction.", "Get the current Work in Streets application and project-specific conditions.", "Give your agent the certificate request and actual job description before the permit deadline."],
        links: [{ label: "City of Richmond: Right-of-Way Management and Work in Streets requirements", href: "https://rva.gov/public-works/right-way-management" }],
      },
      {
        id: "insurance-file", title: "What should your agent check?",
        paragraphs: [
          "Send the current city application and any insurance exhibit, rather than guessing a limit from another city's permit. Ask the agent to confirm the named insured, policy dates, operations and any required certificate holder or endorsement against the actual policy. A certificate by itself does not change coverage.",
          "Richmond links an example certificate from its permit page, but your issued document must match your business and the current project terms. Keep the certificate, applicable endorsements, license details and permit approval together; revise the request if the work scope or dates change."
        ],
        checklist: ["Match the legal business name and dates to the permit application.", "Describe excavation, utilities, subcontractors and traffic-control work accurately.", "Confirm any insurance wording with the city and agent before mobilizing."],
        links: [coiChecklist, { label: "City of Alexandria right-of-way COI checklist", href: "/guides/city-of-alexandria-right-of-way-permit-insurance" }],
      },
    ],
  },
  {
    slug: "dc-contractor-license-certificate-of-insurance",
    title: "D.C. contractor license: certificate of insurance checklist",
    metaTitle: "D.C. Contractor License COI Requirements Checklist",
    description: "Prepare the COI that D.C. requests for general contractor or home improvement contractor Basic Business License applications.",
    intro: "A D.C. contractor license application has a different insurance checkpoint from a project permit or a customer's contract. The District's Department of Licensing and Consumer Protection lists a certificate of liability insurance for both general contractor/construction manager and home improvement contractor license applications. Use its current instructions for the license you are seeking.",
    category: "Contractor licensing insurance",
    industry: "Contractors",
    tradeLabel: "General contractor",
    insurancePath: "/insurance/general-contractor/district-of-columbia",
    quoteKind: "service",
    updatedAt: "2026-10-31",
    nationalSlug: "contractor-quote-checklists",
    sections: [
      {
        id: "license-type", title: "Which application needs a COI?",
        paragraphs: [
          "DLCP lists a certificate of liability insurance for both general contractor/construction manager and home improvement contractor Basic Business Licenses. The home improvement application separately lists a home improvement contract, criminal history report and surety bond; a COI does not replace those items.",
          "DLCP says the COI must remain current for the license period. Project contracts can impose additional insurance terms, so keep the licensing COI request separate from a customer or permit certificate request."
        ],
        checklist: ["Confirm whether the application is for general contracting or home improvement.", "Download the current DLCP application checklist.", "Give the licensing and any separate project requirements to your agent."],
        links: [{ label: "D.C. DLCP: Contractor and Construction Services", href: "https://dlcp.dc.gov/page/contractor-and-construction-services" }],
      },
      {
        id: "certificate-details", title: "What belongs on the license COI?",
        paragraphs: [
          "DLCP says the certificate should use the registered organization name and licensed premises address, describe the service and location, and show DLCP at 1100 4th Street SW, Washington, DC 20024 as certificate holder. It says a post-office box is not an acceptable premises address and the insurer must be authorized in the District.",
          "DLCP has an additional commercial general liability and insurer-rating statement for general contractor/construction manager applicants. Ask the agent to check that current rule and the actual policy before submitting. The certificate describes coverage; it does not grant a license or add an insured by itself."
        ],
        checklist: ["Match the COI name and premises address to the license application.", "Confirm the insurer and policy dates with the agent.", "Retain the issued COI and renew it before coverage or the license period expires."],
        links: [{ label: "D.C. DLCP: license types requiring insurance and COI details", href: "https://dlcp.dc.gov/page/license-types-requiring-insurance-1" }, coiChecklist],
      },
    ],
  },
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
