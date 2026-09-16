// Kevin explicitly requested these eight trades across the same twenty metros, September 16.
// The matrix is editorial scope, not carrier appetite or measured local search demand.
export type TradeMetroCity = {city: string; cityName: string; state: string; stateName: string; url: string; fact: string; question: string};
export type TradeMetroProfile = {slug: string; leadSlug: string; display: string; industry: string; scope: string; pm: string; gc: string; ask: string; questions: string[]; hazards: string[][]; scenario: string; proof: string[]; resource: {label: string; href: string}; note: string};
export const TRADE_METRO_CITIES: TradeMetroCity[] = [
  {
    "city": "dallas",
    "cityName": "Dallas",
    "state": "texas",
    "stateName": "Texas",
    "url": "https://dallascityhall.com/departments/sustainabledevelopment/buildinginspection/pages/residential.aspx",
    "fact": "Dallas publishes residential project checklists and directs applicants to DallasNow. Use the City’s project type and required documents for the address; projects elsewhere in the metro have their own permitting authority.",
    "question": "Is this inside Dallas city limits, and does the buyer have a current project scope or permit checklist?"
  },
  {
    "city": "tampa",
    "cityName": "Tampa",
    "state": "florida",
    "stateName": "Florida",
    "url": "https://www.tampa.gov/document-group/construction-services-forms-and-documents",
    "fact": "Tampa publishes separate alteration guides, contractor-registration resources and trade-permit documents. Match the work to the appropriate document; a general building approval does not answer every trade or insurance question.",
    "question": "Is the work a stand-alone repair or part of a larger alteration with other trade permits and inspections?"
  },
  {
    "city": "houston",
    "cityName": "Houston",
    "state": "texas",
    "stateName": "Texas",
    "url": "https://www.houstonpermittingcenter.org/building-code-enforcement/residential-plan-review",
    "fact": "Houston’s residential review guidance distinguishes remodeling and building repairs from painting/wallpapering and identifies separate registration for licensed electrical, plumbing and mechanical trades. Verify the full scope before assuming a cosmetic-work exception applies.",
    "question": "Does the job include changes behind the finishes, or is it limited to the surface work described?"
  },
  {
    "city": "austin",
    "cityName": "Austin",
    "state": "texas",
    "stateName": "Texas",
    "url": "https://www.austintexas.gov/development-services/express-permits",
    "fact": "Austin’s Express Permit process is limited to specified minor projects, including certain siding and same-size window work. Structural changes and work beyond that route’s qualifications need a different review. Do not assume the express route fits a project merely because it is called a repair.",
    "question": "Are openings, structural members or systems changing, or does the work remain within the specific repair scope?"
  },
  {
    "city": "san-antonio",
    "cityName": "San Antonio",
    "state": "texas",
    "stateName": "Texas",
    "url": "https://www.sa.gov/Directory/Departments/DSD/Constructing/Residential/Permits",
    "fact": "San Antonio’s residential guidance notes that a project may need building, electrical, mechanical and plumbing permits according to its scope. It also distinguishes what different applicants can obtain. Confirm the responsible contractor for each part.",
    "question": "Which contractor is responsible for each permitted trade, and what handoff does the buyer expect from your crew?"
  },
  {
    "city": "orlando",
    "cityName": "Orlando",
    "state": "florida",
    "stateName": "Florida",
    "url": "https://www.orlando.gov/Building-Development/Permits-Inspections/Get-a-Permit/Permitting-Checklists/Residential-Permitting-Requirements",
    "fact": "Orlando’s residential requirements distinguish building permits from trade permits for electrical, plumbing, gas and other work. The project checklist, supporting documents and inspection stages should follow the actual scope.",
    "question": "Has the buyer separated the building scope from trade connections and scheduled access for inspections?"
  },
  {
    "city": "miami",
    "cityName": "Miami",
    "state": "florida",
    "stateName": "Florida",
    "url": "https://www.miami.gov/Permits-Construction/Walk-Thru-Express-Residential",
    "fact": "The City of Miami lists a residential express route for qualifying projects, including certain remodels and trade repairs. Confirm eligibility and jurisdiction: City of Miami, another municipality and unincorporated Miami-Dade are not interchangeable permit offices.",
    "question": "Who is handling the address-specific permit route, and is the project eligible for it without expanding the scope?"
  },
  {
    "city": "jacksonville",
    "cityName": "Jacksonville",
    "state": "florida",
    "stateName": "Florida",
    "url": "https://www.jacksonville.gov/departments/public-works/building-inspection-division/faqs",
    "fact": "Jacksonville’s building FAQs address approved documents at inspections and access for occupied homes and businesses. Coordinate the site representative, documents and inspection sequence with the buyer; use the correct authority for any beach-city address.",
    "question": "Who provides occupied-site access and the current approved documents when your crew or inspector arrives?"
  },
  {
    "city": "cape-coral",
    "cityName": "Cape Coral",
    "state": "florida",
    "stateName": "Florida",
    "url": "https://www.capecoral.gov/departments/development_services/permitting_services_division/permit_document_center.php",
    "fact": "Cape Coral’s document center separates addition/remodel applications, trade applications and contractor-change materials. Establish whether you are joining an existing permit or applying for a new scope, and preserve the handover documents.",
    "question": "Are you taking over an existing contractor’s scope, or starting a new repair or replacement package?"
  },
  {
    "city": "phoenix",
    "cityName": "Phoenix",
    "state": "arizona",
    "stateName": "Arizona",
    "url": "https://www.phoenix.gov/administration/departments/pdd/residential-building/resident-plan-reviews.html",
    "fact": "Phoenix distinguishes residential projects requiring permits from examples of ordinary finish work that may not. Its resources separate remodeling, additions and specialist systems. Ask about what the job actually changes rather than using its marketing name to decide.",
    "question": "Does the scope stop at finishes, or include opening, structural or system changes that need a different review?"
  },
  {
    "city": "tucson",
    "cityName": "Tucson",
    "state": "arizona",
    "stateName": "Arizona",
    "url": "https://www.tucsonaz.gov/Departments/Planning-Development-Services/Permits/Residential-Permits",
    "fact": "Tucson provides a residential permit navigator and Development Center Online. Use the work description to identify the application, plans and responsible applicant. A homeowner’s process is not evidence of a hired business’s authority to perform a trade.",
    "question": "Which project type has the owner or GC selected, and what work is included in that application?"
  },
  {
    "city": "las-vegas",
    "cityName": "Las Vegas",
    "state": "nevada",
    "stateName": "Nevada",
    "url": "https://www.lasvegasnevada.gov/Business/Permits-Licenses/Building-Permits/Permit-Fee-Estimator/Occupancy-Type-Definitions",
    "fact": "The City of Las Vegas distinguishes residential remodeling with mechanical, electrical and plumbing work from other occupancy/project types. Verify the actual use of the property and the authority for City, other municipal or unincorporated County projects.",
    "question": "Is this residential work, a tenant improvement or a different occupancy, and who controls the approved scope?"
  },
  {
    "city": "atlanta",
    "cityName": "Atlanta",
    "state": "georgia",
    "stateName": "Georgia",
    "url": "https://www.atlantaga.gov/government/departments/city-planning/about-dcp/office-of-buildings",
    "fact": "Atlanta’s Office of Buildings publishes current building and trade-code resources and project-submittal policies. Match the application to its scope and submission date. This is City of Atlanta guidance; a metro-area job in another jurisdiction needs that authority’s process.",
    "question": "Does the GC have the current plan set and jurisdiction confirmed before requesting your part of the bid?"
  },
  {
    "city": "charlotte",
    "cityName": "Charlotte",
    "state": "north-carolina",
    "stateName": "North Carolina",
    "url": "https://code.mecknc.gov/permitting",
    "fact": "Mecklenburg Code Enforcement separates building work from electrical, mechanical and plumbing-system work and provides its permit routes. Charlotte zoning and the job’s jurisdiction can add separate checks; one trade’s paperwork does not establish all approvals.",
    "question": "Who coordinates zoning, building and specialty-trade approvals for the address, and what is your responsibility?"
  },
  {
    "city": "raleigh",
    "cityName": "Raleigh",
    "state": "north-carolina",
    "stateName": "North Carolina",
    "url": "https://raleighnc.gov/permits/services/how-get-residential-permit",
    "fact": "Raleigh’s residential permit guidance asks for the complete alteration/repair scope, including additional trade work. It distinguishes its residential route from apartment construction and flags site prerequisites. Confirm building type before choosing the checklist.",
    "question": "Is the property a qualifying residential project or an apartment/commercial scope needing another review route?"
  },
  {
    "city": "charleston",
    "cityName": "Charleston",
    "state": "south-carolina",
    "stateName": "South Carolina",
    "url": "https://www.charleston-sc.gov/2483/Applications-Guidelines",
    "fact": "Charleston provides separate residential, commercial and trade application guidance. Design-review and site conditions can affect the route. Describe the actual building and exterior changes before assuming a simple residential application is sufficient.",
    "question": "Are exterior changes or design-review conditions part of the buyer’s project, and which drawings are approved?"
  },
  {
    "city": "nashville",
    "cityName": "Nashville",
    "state": "tennessee",
    "stateName": "Tennessee",
    "url": "https://www.nashville.gov/departments/codes/construction-and-permits/building-permits-central/renovate-single-family-residence",
    "fact": "Metro Nashville’s renovation instructions distinguish building/rehab permits and trade permits and ask for proposed layouts when plans change. The guidance treats changing a window’s style or size differently from some finish work. Follow the project’s assigned approval checklist.",
    "question": "Is this a finish refresh, a changed opening/layout or a systems alteration, and what approvals are still outstanding?"
  },
  {
    "city": "oklahoma-city",
    "cityName": "Oklahoma City",
    "state": "oklahoma",
    "stateName": "Oklahoma",
    "url": "https://www.okc.gov/Services/Permits/Building-Trade-Permits/Application-Checklists",
    "fact": "Oklahoma City publishes application checklists for different residential and commercial projects and formatting guidance for permit documents. Choose the actual scope rather than treating every PM work order as the same permit category.",
    "question": "Does the work order identify the building use, actual alterations and responsible permit applicant?"
  },
  {
    "city": "greenville",
    "cityName": "Greenville",
    "state": "south-carolina",
    "stateName": "South Carolina",
    "url": "https://www.greenvillecounty.org/BuildingSafety/Permits.aspx",
    "fact": "Greenville County lists alterations and specialty-system work among projects requiring permits, while the City has its own permit center. Confirm City/County jurisdiction and work scope before using a checklist or relying on another project’s approvals.",
    "question": "Is the job in City or County jurisdiction, and are all added trades included in the buyer’s current scope?"
  },
  {
    "city": "richmond",
    "cityName": "Richmond",
    "state": "virginia",
    "stateName": "Virginia",
    "url": "https://www.rva.gov/planning-development-review/permits-and-inspections",
    "fact": "Richmond directs building and residential trade applications to its Online Permit Portal. Its homeowner guide distinguishes separate mechanical, electrical, plumbing and gas applications from the residential building permit. Confirm the City versus surrounding County jurisdiction.",
    "question": "Who owns each trade application and the inspection handoff before work is concealed or the customer takes over?"
  }
];
export const TRADE_METRO_PROFILES: TradeMetroProfile[] = [
  {
    "slug": "remodeler",
    "leadSlug": "remodeling",
    "display": "Remodeling",
    "industry": "Remodeling",
    "scope": "Separate occupied-home renovations, unit turnovers and commercial fit-outs. List demolition, load-bearing changes, additions, design responsibility and every subcontracted trade.",
    "pm": "Property managers planning unit turnovers, common-area improvements or defined renovations, with authority to approve the project.",
    "gc": "GCs that need a defined renovation package or specialist subcontractor; architects and designers can introduce a project but may not select the contractor.",
    "ask": "Do you need a contractor for a defined renovation package, or a team to coordinate the full job and its specialist trades?",
    "questions": [
      "Which rooms and structures change, and is the property occupied?",
      "Does the work alter load-bearing elements, footprint, foundations or building use?",
      "Who provides design, permits, site supervision and licensed specialist trades?",
      "What is the approved scope, budget decision and target handover?"
    ],
    "hazards": [
      [
        "Structural work and accepted operations",
        "Have demolition, additions, load-bearing changes and any foundation work reviewed explicitly. A cosmetic-remodeling description should not stand in for a structural project."
      ],
      [
        "Existing property and completed work",
        "Ask about the part being worked on, the remainder of the building, water damage and losses discovered after completion. Correcting defective work is a separate question."
      ],
      [
        "Dust, subcontractors and project property",
        "Describe lead/asbestos concerns, silica-generating tasks, hired crews and stored materials. Review actual exclusions and responsibilities rather than relying on a subcontractor certificate."
      ]
    ],
    "scenario": "A bathroom renovation leaks into an untouched room after handover. Ask about resulting damage, the faulty work itself and completed operations; do not assume all three have the same answer.",
    "proof": [
      "A real before/after example showing exactly which work your business performed.",
      "A written scope with exclusions, allowances and change-order process.",
      "Your site-supervision and subcontractor responsibilities."
    ],
    "resource": {
      "label": "EPA: renovation, repair and painting contractors",
      "href": "https://www.epa.gov/lead/renovation-repair-and-painting-program-contractors"
    },
    "note": "EPA’s RRP resources address work that disturbs painted surfaces in covered older housing and child-occupied facilities. Establish the building and work facts; a cosmetic label does not decide whether the requirements apply."
  },
  {
    "slug": "siding",
    "leadSlug": "siding-contractor",
    "display": "Siding Contractor",
    "industry": "Siding installation",
    "scope": "List siding materials, removal, replacement, flashing, sheathing repairs, work height, scaffolds/lifts and any roofing, structural or window work added to the contract.",
    "pm": "Property managers with a defined exterior-maintenance or replacement plan, after the owner’s project authority and access requirements are established.",
    "gc": "Exterior-remodeling GCs, custom-home builders and window/roofing firms that need a separate siding scope.",
    "ask": "Do you need siding installation only, or removal, substrate repairs and flashing as a coordinated exterior package?",
    "questions": [
      "What cladding and substrate are present, and what will be removed or replaced?",
      "What are the building height, access equipment and occupied-area protections?",
      "Who handles concealed deterioration, flashing and any structural repair?",
      "What happens if the walls cannot be closed at the end of a workday?"
    ],
    "hazards": [
      [
        "Envelope and water-entry claims",
        "Discuss removal, flashing, sealing, temporary weather protection and completed work. Review exterior-envelope, water-intrusion and material-specific exclusions in the actual policy."
      ],
      [
        "Height, equipment and subcontractors",
        "State the highest work, scaffolding/lift arrangements and hired installers. Ground-level siding experience does not establish acceptance of every elevated job."
      ],
      [
        "Materials and adjacent property",
        "Ask about damaged panels before installation, the customer’s existing property and debris/dust damage separately. Identify responsibility for property in transit and at the site."
      ]
    ],
    "scenario": "Rain enters while cladding is removed and damages the interior. Describe temporary protection and the stage of work; compare water-entry wording, existing-property damage and the cost of replacing your own work.",
    "proof": [
      "Photos of comparable material systems and heights, used with permission.",
      "A written flashing, substrate-repair and temporary-weather plan for the bid.",
      "Equipment, crew and subcontractor responsibilities."
    ],
    "resource": {
      "label": "EPA: renovation, repair and painting contractors",
      "href": "https://www.epa.gov/lead/renovation-repair-and-painting-program-contractors"
    },
    "note": "Removing or preparing painted exterior surfaces may bring older-building lead questions into the scope. Use EPA’s RRP guidance and the site facts; do not promise that a small repair or an exterior job is automatically exempt."
  },
  {
    "slug": "glass-glazing",
    "leadSlug": "window-installation",
    "display": "Window Installation",
    "industry": "Window installation",
    "scope": "Distinguish glass repair, insert-window replacement, full-frame installation, changed openings, doors, storefront and curtain-wall work. State height, lifting equipment, flashing and structural changes.",
    "pm": "Property managers planning a window replacement or repair program, with a defined building and resident-access process.",
    "gc": "Remodeling GCs, exterior contractors and home builders that need a window/door installation package.",
    "ask": "Is the project a same-opening replacement, a full-frame installation or a changed structural opening?",
    "questions": [
      "What window system, glazing and opening dimensions are specified?",
      "Are headers, structure, flashing or exterior finishes changing?",
      "What are the height, glass-handling method and resident access constraints?",
      "Who supplies the units and owns breakage or measurement errors before installation?"
    ],
    "hazards": [
      [
        "Installation and water penetration",
        "Review flashing, sealing, changed openings and water damage after completion. A window-cleaning policy is not an installation policy."
      ],
      [
        "Glass handling and height",
        "Describe breakage exposures, lifts, cranes and the largest units handled. Clarify damage to the unit being installed versus injury or damage to other property."
      ],
      [
        "Product, workmanship and existing buildings",
        "Identify whether you manufacture, supply or only install units. Review faulty work, product responsibilities and protection of the occupied building separately."
      ]
    ],
    "scenario": "A replaced window leaks and damages the wall below it. Ask about replacing the incorrectly installed unit versus resulting damage elsewhere and any water-intrusion exclusions.",
    "proof": [
      "Examples of the actual window systems and installation types you handle.",
      "A measurement, delivery, installation and punch-list handover plan.",
      "Clear responsibility for structural openings, flashing and interior/exterior finish repairs."
    ],
    "resource": {
      "label": "EPA: renovation, repair and painting contractors",
      "href": "https://www.epa.gov/lead/renovation-repair-and-painting-program-contractors"
    },
    "note": "EPA specifically addresses window work under its RRP program. Establish the building age, painted surfaces and exact replacement work; do not use a small-area assumption to dismiss lead-safe-work questions."
  },
  {
    "slug": "electrician",
    "leadSlug": "electrical-contractor",
    "display": "Electrical Contractor",
    "industry": "Electrical contracting",
    "scope": "List service/repair, rewiring, panels, generators, EV chargers, low-voltage work and any industrial or higher-voltage systems. State energized-work practices and employee versus subcontractor tasks.",
    "pm": "Property managers arranging documented electrical maintenance, tenant-turnover repairs or approved equipment upgrades.",
    "gc": "Remodeling and tenant-improvement GCs needing a clearly bounded electrical package, with shutdowns and inspection responsibilities agreed.",
    "ask": "Do you need scheduled maintenance, turnover repairs or an electrical package for an active renovation?",
    "questions": [
      "What building use, system voltage and equipment are involved?",
      "Will work require a service shutdown, utility coordination or energized exposure?",
      "Who obtains trade approvals and coordinates access with occupants?",
      "Does the job include generators, solar, fire alarms or other specialty systems?"
    ],
    "hazards": [
      [
        "Accepted electrical operations",
        "Review the actual systems, voltages and specialty work. A general electrician classification does not establish acceptance of every industrial, alarm or energy project."
      ],
      [
        "Fire, existing property and completed operations",
        "Ask about a fire or equipment damage discovered after completion, and separate correcting the electrical work from resulting damage."
      ],
      [
        "Worker safety, vehicles and tools",
        "Describe crew qualifications, energized tasks, service vehicles and test equipment. Worker injury, tool loss and liability to others require separate coverage reviews."
      ]
    ],
    "scenario": "A connection fails after a tenant improvement and damages building equipment. Compare completed operations, the work itself and other damaged property; disclose the system and contract scope.",
    "proof": [
      "Current credentials relevant to the actual scope and jurisdiction.",
      "A shutdown/access plan and named project or service contact.",
      "A clear list of systems you accept and specialties you do not handle."
    ],
    "resource": {
      "label": "OSHA: electrical contractors",
      "href": "https://www.osha.gov/electrical-contractors"
    },
    "note": "OSHA provides hazard and standards resources specifically for electrical contractors. Use qualified personnel and the applicable safety process; an insurance policy or a customer deadline is not a safe-work authorization."
  },
  {
    "slug": "plumber",
    "leadSlug": "plumbing-contractor",
    "display": "Plumbing Contractor",
    "industry": "Plumbing",
    "scope": "Separate service/repair, fixture changes, repiping, drain cleaning, sewer excavation, gas piping, fire-protection and specialty work. Identify occupied buildings, shutoffs and hired trades.",
    "pm": "Property managers who need a scheduled repair or turnover process, with emergency dispatch expectations kept separate from ordinary service.",
    "gc": "Remodeling, restoration and tenant-improvement GCs that need plumbing rough-in, fixture connections and a documented test/handover.",
    "ask": "Do you need scheduled plumbing support for turnovers or a defined rough-in and fixture package on a project?",
    "questions": [
      "Is the work supply, drainage, gas, sewer or another specialist system?",
      "Are excavation, trenching, hot work or work under slabs involved?",
      "Who approves water/gas shutdowns and coordinates occupants?",
      "What testing, inspection and handover documentation does the buyer require?"
    ],
    "hazards": [
      [
        "Water damage and completed work",
        "Review leaks during work and after handover, including existing-building damage. The cost of correcting a faulty fitting may be treated differently from resulting damage."
      ],
      [
        "Excavation, gas and specialist systems",
        "Have sewer work, trenching, gas piping and fire-protection operations reviewed explicitly if undertaken. Do not hide occasional specialty work under a routine service description."
      ],
      [
        "Subcontractors, tools and vehicles",
        "Disclose hired excavators and specialist trades, receipts, payroll and subcontractor costs. Review worker protection and equipment separately from GL."
      ]
    ],
    "scenario": "A water connection leaks after a repair and affects occupied units below. Ask about resulting property damage, completed work and the faulty connection itself, plus any residential or water-damage restrictions.",
    "proof": [
      "A service-area and dispatch policy you can actually meet.",
      "Credentials for the plumbing or specialty systems offered.",
      "A documented shutoff, testing and job-closeout process."
    ],
    "resource": {
      "label": "Texas Department of Insurance: general liability and exclusions",
      "href": "https://www.tdi.texas.gov/pubs/pc/pcgenliab.html"
    },
    "note": "The insurance regulator’s CGL explanation distinguishes business operations, completed work and exclusions. Use the actual proposal to compare a plumbing repair, resulting damage and contractual promises; the policy title alone does not answer the claim."
  },
  {
    "slug": "handyman",
    "leadSlug": "handyman",
    "display": "Handyman",
    "industry": "Handyman services",
    "scope": "List exact repair tasks, mounting, carpentry, patching, painting and assembly. Identify heights and any electrical, plumbing, HVAC, roofing or structural tasks instead of treating handyman as a universal scope.",
    "pm": "Property managers with recurring punch lists, tenant-turnover repairs and small maintenance work orders in a compact service area.",
    "gc": "Remodeling GCs needing final punch-list completion, trim or other defined small tasks rather than an unlicensed substitute for a specialty trade.",
    "ask": "Do you have a recurring punch list or turnover-repair scope that fits a small-job contractor?",
    "questions": [
      "What exact tasks are on the work order, and what is expressly excluded?",
      "Does any task require a licensed specialist or a separate permit?",
      "What are access, approval limits, materials and resident communication arrangements?",
      "Are there height, structural or occupied-property conditions outside your usual work?"
    ],
    "hazards": [
      [
        "Task-specific liability",
        "Have the insurer review the actual tasks and occasional work. A handyman business name does not establish coverage or legal authority for electrical, plumbing or other licensed trades."
      ],
      [
        "Customer property and completed repairs",
        "Ask about drilling into concealed services, damage to surfaces and repairs that fail after completion. Separate the work itself from other property."
      ],
      [
        "Crew, tools and vehicle use",
        "List helpers and hired specialists separately, including zero W2 payroll when accurate. Review work vehicles, tools and workers’ compensation questions for the real arrangement."
      ]
    ],
    "scenario": "A mounting job strikes a concealed water pipe and damages the room. Describe locating procedures and the actual task, then ask about resulting property damage and work-product exclusions.",
    "proof": [
      "A simple accepted-task and excluded-task list.",
      "A service radius, minimum job process and response times you can meet.",
      "A process for routing work needing specialist credentials."
    ],
    "resource": {
      "label": "EPA: renovation, repair and painting contractors",
      "href": "https://www.epa.gov/lead/renovation-repair-and-painting-program-contractors"
    },
    "note": "Repair and maintenance that disturbs painted surfaces can raise EPA RRP questions on covered properties. A handyman label or small invoice does not settle the building-age, task and surface facts."
  },
  {
    "slug": "hvac",
    "leadSlug": "hvac-contractor",
    "display": "HVAC Contractor",
    "industry": "HVAC",
    "scope": "Separate preventive maintenance, diagnostics, replacements, new installation, refrigeration and duct work. List refrigerants, fuel systems, rooftop equipment, lifting, welding and subcontracted electrical or plumbing.",
    "pm": "Property managers with equipment inventories, planned maintenance and replacement needs; qualify service response expectations before offering a contract.",
    "gc": "Remodeling and tenant-improvement GCs needing equipment selection, installation, connections and commissioning responsibilities documented.",
    "ask": "Are you looking for maintenance coverage for existing equipment or a contractor for planned replacement and installation work?",
    "questions": [
      "What equipment, refrigerant, fuel source and building use are involved?",
      "Is the unit rooftop or otherwise dependent on a crane or specialist access?",
      "Who handles design, sizing, electrical/gas connections and commissioning?",
      "What response time and reporting does the manager expect, and can you deliver it?"
    ],
    "hazards": [
      [
        "Installation and completed operations",
        "Discuss equipment replacement, condensate leaks, fire and losses discovered after commissioning. Identify design or sizing responsibility separately from installation."
      ],
      [
        "Refrigerants, pollution and specialist work",
        "Review actual pollution and refrigerant wording, commercial refrigeration and any hot work. A maintenance class is not proof every installation or chemical exposure is covered."
      ],
      [
        "Rooftop work, lifting and equipment",
        "Describe heights, crane/operator arrangements, tools and equipment in transit or awaiting installation. Liability and property damage to your own equipment need separate checks."
      ]
    ],
    "scenario": "A condensate connection leaks after a replacement and damages an occupied ceiling. Ask about resulting damage and completed work separately from repairing the connection; identify commissioning responsibility.",
    "proof": [
      "An accurate equipment/service scope and applicable technician credentials.",
      "A realistic service territory and response policy.",
      "A commissioning, maintenance-report and replacement handover checklist."
    ],
    "resource": {
      "label": "EPA: Section 608 technician certification",
      "href": "https://www.epa.gov/section608/section-608-technician-certification"
    },
    "note": "EPA’s Section 608 resources explain technician certification for relevant refrigerant work. Establish the equipment and tasks; technician certification, contractor licensing and insurance acceptance are separate checks."
  },
  {
    "slug": "painter",
    "leadSlug": "painting-contractor",
    "display": "Painting Contractor",
    "industry": "Painting",
    "scope": "Separate interior/exterior painting, spray application, surface preparation, heights, lifts, specialist coatings and any drywall, pressure washing or hazardous-material work.",
    "pm": "Property managers planning unit turnovers, common-area refreshes and scheduled exterior repainting, with occupied-area access agreed.",
    "gc": "Remodeling GCs and tenant-improvement contractors needing a defined painting package, preparation standard and final punch-list process.",
    "ask": "Do you need a painting partner for turnovers and scheduled refreshes, or a defined finish package on an active project?",
    "questions": [
      "What surfaces, coatings, preparation and repair work are included?",
      "What are the maximum heights, access equipment and spray/overspray controls?",
      "Are occupants, furnishings, cars or neighboring properties exposed?",
      "What building-age, lead-paint or other hazardous-material questions remain unresolved?"
    ],
    "hazards": [
      [
        "Overspray and customer property",
        "Ask about damage to the surface being painted, other furnishings or vehicles, and spray drift. Review the actual care/custody/control and pollution terms."
      ],
      [
        "Height, preparation and specialist coatings",
        "State the highest work, lifts and scaffolds, surface-removal methods and industrial/specialist coatings. Include occasional exterior work rather than only the easiest interior jobs."
      ],
      [
        "Completed finishes, crews and equipment",
        "Separate repainting defective work from resulting damage. Give employee payroll, subcontractor costs and equipment arrangements accurately."
      ]
    ],
    "scenario": "Overspray reaches vehicles beside the building. Describe the method, protection and site conditions, then compare property-damage and pollution wording rather than assuming every GL policy addresses it.",
    "proof": [
      "Real finish examples and an agreed preparation/acceptance standard.",
      "A list of coatings, heights and job types you accept.",
      "Occupied-site protection and punch-list arrangements."
    ],
    "resource": {
      "label": "EPA: renovation, repair and painting contractors",
      "href": "https://www.epa.gov/lead/renovation-repair-and-painting-program-contractors"
    },
    "note": "EPA’s RRP contractor guidance addresses painting preparation and other disturbance of painted surfaces on covered buildings. Establish the building, materials and tasks before promising that an ordinary repaint avoids lead requirements."
  }
];
export function tradeMetroInsurancePath(t: TradeMetroProfile, c: TradeMetroCity) { return `/insurance/${t.slug}/${c.state}/${c.city}`; }
export function tradeMetroGrowthPath(t: TradeMetroProfile, c: Pick<TradeMetroCity, "state" | "city">) { return `/guides/how-to-get-${t.leadSlug}-leads-in-${c.city}-${c.state}`; }
export function findTradeMetroGrowthLink(trade?: string, state?: string, city?: string) {
 const t=TRADE_METRO_PROFILES.find(t=>t.slug===trade), c=TRADE_METRO_CITIES.find(c=>c.state===state&&c.city===city);
 return t&&c ? {href:tradeMetroGrowthPath(t,c),label:`How to get ${t.display.toLowerCase()} leads in ${c.cityName}`} : undefined;
}
