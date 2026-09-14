import type { Fact, PageContent } from "./data";

export const PRIORITY_STATE_UPDATED = "2026-09-07";
const njHic = { label: "NJ Consumer Affairs: home improvement contractor requirements", href: "https://www.njconsumeraffairs.gov/hic/Pages/FAQ.aspx" };
const njScope = { label: "NJ Consumer Affairs: work covered by home improvement registration", href: "https://www.njconsumeraffairs.gov/ocp/Pages/hic.aspx" };
const njWc = { label: "NJ Labor: workers’ compensation employer requirements", href: "https://www.nj.gov/labor/workerscompensation/employer-requirements/" };
const mdTree = { label: "Maryland DNR: Licensed Tree Experts", href: "https://dnr.maryland.gov/forests/Pages/programapps/newtreeexpert.aspx" };

const njEmployer: Fact = {
  title: "Check workers’ compensation against your business structure",
  body: "New Jersey’s employer rules distinguish corporations from sole proprietors, partnerships, and LLCs. Working corporate officers can trigger coverage requirements; owner-only exemptions depend on structure. Check the state’s rule before assuming a business without hired staff is exempt.",
  source: njWc,
};
const njRegistration: Fact = {
  title: "Registration evidence and customer requirements are separate",
  body: "NJ home improvement contractor businesses must show at least $500,000 of commercial general liability per occurrence, workers’ compensation unless exempt, and the required additional security. A customer may request higher limits or endorsements. Check the current application before buying coverage.",
  source: njHic,
};

type Profile = {
  name: string;
  reviewedOn?: string;
  state: string;
  intro: string;
  pricing: string;
  facts: Fact[];
  questions: string[];
  coverages: { name: string; desc: string }[];
  faqs: { q: string; a: string }[];
};

const profiles: Record<string, Profile> = {
  "carpenter/massachusetts": {
    "name": "Carpenter",
    "state": "Massachusetts",
    "reviewedOn": "2026-09-14",
    "intro": "Finish carpentry, cabinet installation, framing and deck building create different insurance questions. Describe your Massachusetts projects, working heights and subcontractors so Cohesive can review the actual work and the customer contract.",
    "pricing": "Prepare annual receipts, payroll, subcontractor costs, claims history and a split of finish work, framing and other operations. Include your largest project and any structural changes. Compare quotes on the same basis; a finish-carpentry price does not establish the cost of framing or elevated exterior work.",
    "facts": [
      {
        "title": "HIC registration and a supervisor license are different",
        "body": "Massachusetts distinguishes Home Improvement Contractor registration from a Construction Supervisor License. They are not interchangeable. Ask the relevant program and local building official which credentials apply to your project, particularly when it involves structural work.",
        "source": {
          "label": "Massachusetts: HIC contractor resources",
          "href": "https://www.mass.gov/info-details/hic-contractor-resources"
        }
      },
      {
        "title": "Check the scope requiring a Construction Supervisor License",
        "body": "The state provides a separate guide to work requiring a CSL. Describe the building and proposed alterations when checking that guidance; do not assume that cabinet fitting and structural framing have the same requirements.",
        "source": {
          "label": "Massachusetts: when a CSL is required",
          "href": "https://www.mass.gov/info-details/when-is-a-construction-supervisor-license-required"
        }
      },
      {
        "title": "Review workers’ compensation before hiring",
        "body": "Massachusetts generally requires employers to insure employees, including owners who are employees of their company. Exemptions and owner treatment depend on the circumstances. Confirm the rules for your entity and working relationships rather than assuming that paying a helper as a subcontractor settles the question.",
        "source": {
          "label": "Massachusetts: workers’ compensation requirements",
          "href": "https://www.mass.gov/info-details/workers-compensation-insurance-requirements"
        }
      },
      {
        "title": "Prepare the GC’s insurance exhibit before the bid",
        "body": "Collect requested limits, additional insured language, completed-operations requirements and any waiver requests. Give the broker your project scope and the exhibit together. A certificate is evidence of insurance; it does not itself change the policy to satisfy the contract."
      }
    ],
    "questions": [
      "What percentage is finish carpentry, framing, decks or structural repairs?",
      "What heights do crews reach, and is exterior work included?",
      "Do you use employees, subcontractors or both?",
      "What does the customer or GC require before you start?"
    ],
    "coverages": [
      {
        "name": "Carpentry liability and completed operations",
        "desc": "Review the actual tasks, damage to property being worked on, subcontractors and damage discovered after completion. Compare exclusions as well as the limit."
      },
      {
        "name": "Tools, vehicles and workforce",
        "desc": "List tools taken to jobs, rented equipment and business vehicle use. Review employee coverage and owner elections separately from general liability."
      }
    ],
    "faqs": [
      {
        "q": "Can a finish-carpentry quote cover framing or deck construction?",
        "a": "Only if the insurer accepts those operations under the proposed policy. List them when requesting the quote, including heights and structural work, instead of relying on the broad label carpenter."
      },
      {
        "q": "Does insurance replace Massachusetts contractor registration or licensing?",
        "a": "No. Check HIC registration, CSL and project permits with the responsible authorities. Coverage and credentials are separate requirements."
      },
      {
        "q": "What do I need for a Massachusetts carpenter insurance quote?",
        "a": "Prepare your legal business details, service area, operation split, receipts, payroll, subcontractor costs, claims history and the customer insurance requirements. Include your desired coverage start date."
      }
    ]
  },
  "pool/texas": {
    "name": "Pool Construction",
    "state": "Texas",
    "reviewedOn": "2026-09-14",
    "intro": "Building a pool involves excavation, structural work and several trades. Describe what your crew builds and what you subcontract so Cohesive can request insurance for the actual operation, including gunite, fiberglass or vinyl-lined installations.",
    "pricing": "Separate new pool construction, renovation and maintenance receipts. Include annual payroll, subcontractor costs, project values and claims history. Compare quotes using the same revenue and work description: a pool-cleaning starting price does not establish the cost of insuring a builder. This page does not claim a verified Texas construction premium.",
    "facts": [
      {
        "title": "Ask about the work and the completed project",
        "body": "Texas Department of Insurance distinguishes premises/operations liability from products/completed operations. For a pool builder, ask how the proposed policy treats injuries or property damage during construction and after handover. Coverage for repairing your own work and damage to other property must be reviewed in the actual policy.",
        "source": {
          "label": "Texas Department of Insurance: commercial general liability",
          "href": "https://www.tdi.texas.gov/pubs/pc/pcgenliab.html"
        }
      },
      {
        "title": "Put each construction stage in the quote request",
        "body": "List excavation, shell installation, shotcrete or gunite, plumbing, electrical connections, decking and retaining walls. Identify the responsible business at each stage. Include residential versus commercial pools and any work on an existing structure; a maintenance-only description leaves out the construction you need reviewed."
      },
      {
        "title": "Separate the builder’s contract from subcontractor insurance",
        "body": "Send the customer insurance exhibit, subcontractor agreements and available insurance evidence. Ask about uninsured subcontractors and any subcontractor conditions before accepting the quote. An all-subcontracted builder still needs its own role and receipts described accurately."
      },
      {
        "title": "Review local approvals for the job address",
        "body": "Ask the relevant city or county about the project’s permits and inspections, and verify the credentials required for electrical, plumbing and other specialist tasks. Business registration, job approval and insurance are separate checks; do not treat a policy as permission to perform licensed work."
      }
    ],
    "questions": [
      "What share of receipts is new construction, renovation and maintenance?",
      "Who excavates, installs the shell and performs electrical or plumbing connections?",
      "Do you build retaining walls, raised pools or commercial pools?",
      "What are your largest project value, subcontractor costs and required start date?"
    ],
    "coverages": [
      {
        "name": "Pool-builder liability and completed operations",
        "desc": "Request review of the construction methods, excavation, underground property, subcontractors and post-completion damage. Compare exclusions and endorsements alongside limits and price."
      },
      {
        "name": "Unfinished work, equipment and crew",
        "desc": "Establish who insures materials and the pool while it is being built. Review equipment, business vehicles and workers’ compensation separately; general liability is not a substitute for those coverages."
      }
    ],
    "faqs": [
      {
        "q": "Can pool maintenance insurance cover gunite construction?",
        "a": "Do not assume it does. Disclose gunite, excavation and structural work, then obtain a quote that accepts the actual operations. A policy issued for cleaning or servicing pools may have a different scope."
      },
      {
        "q": "Can I request a quote if every trade is subcontracted?",
        "a": "Yes, submit the actual all-subcontracted arrangement for review. Provide gross receipts, subcontractor costs, agreements and insurance requirements. We’ll check which markets accept that arrangement before offering terms."
      },
      {
        "q": "What should I send to compare Texas pool-builder quotes?",
        "a": "Send the same operation description, receipts, payroll, subcontractor costs, loss history and requested limits to each review. Include the existing policy and customer contract if available. Check completed operations and exclusions before treating a lower premium as equivalent coverage."
      }
    ]
  },
  "tree-service/north-carolina": {
    "name": "Tree Service",
    "state": "North Carolina",
    "reviewedOn": "2026-09-14",
    "intro": "Pruning, removals, stump grinding and crane-assisted jobs create different insurance questions. Tell Cohesive your maximum working height, equipment and proximity to utilities so the quote reflects the tree work you actually perform.",
    "pricing": "Prepare annual receipts, payroll, subcontractor costs and a split of pruning, removal and other work. Include maximum height, climbing or aerial-lift use, crane arrangements and claims history. Compare accepted operations before price: this page does not claim a verified North Carolina tree-service premium.",
    "facts": [
      {
        "title": "Check North Carolina’s employer coverage rules",
        "body": "The Industrial Commission generally requires workers’ compensation for businesses regularly employing three or more people, with exceptions. Corporate officers count toward the threshold; sole proprietors, partners and LLC members are not automatically counted. Review your entity and workforce with the Commission rather than relying only on a W2 payroll number.",
        "source": {
          "label": "North Carolina Industrial Commission: employer requirements",
          "href": "https://www.ic.nc.gov/workers-compensation-claims/employers"
        }
      },
      {
        "title": "Disclose height and utility exposure directly",
        "body": "Record maximum working height, climbing, lifts, removals and any work near power lines. Include occasional jobs as well as routine work. If you are unsure about a hazard or working method, flag it so the question can be resolved before coverage is arranged."
      },
      {
        "title": "Make the crane and subcontractor arrangements explicit",
        "body": "Distinguish your own equipment from a rented crane, a crane supplied with an operator and an independent subcontractor. Share the rental or subcontract agreement and the customer insurance exhibit. Ask which policy responds to equipment damage and which business is responsible for the work."
      },
      {
        "title": "Prepare a removal-job review file",
        "body": "For a job near a house, prepare the height, access, rigging method, surrounding property, utility exposure and disposal plan. Explain storm-damaged or unstable trees separately. Request coverage review before promising a customer that a certificate covers every part of the job."
      }
    ],
    "questions": [
      "What is the maximum height, including occasional jobs?",
      "Do crews climb, use aerial lifts or hire cranes?",
      "Is utility-line work, storm response or land clearing included?",
      "Who performs the work, and what are employee payroll and subcontractor costs?"
    ],
    "coverages": [
      {
        "name": "Tree-work liability",
        "desc": "Ask about pruning, removals, stump grinding, height conditions, utility exclusions and subcontractors. Review the proposed wording for the actual work before accepting a price."
      },
      {
        "name": "Workers, vehicles and equipment",
        "desc": "Review employer obligations, work classifications, trucks, chippers, lifts and owned or rented equipment. Customer contract requirements may differ from state requirements."
      }
    ],
    "faqs": [
      {
        "q": "Is tree removal the same insurance classification as lawn care?",
        "a": "Do not assume so. Describe the removals, heights, equipment and utility exposure. Tree operations need to be accepted by the insurer even if the business also mows lawns or installs landscaping."
      },
      {
        "q": "Does having no W2 payroll settle whether I need workers’ compensation?",
        "a": "No. Review the business structure and actual working relationships against North Carolina’s requirements. Corporate officers and subcontractor arrangements can raise questions that a payroll total alone does not answer."
      },
      {
        "q": "What if I only occasionally remove a tall tree?",
        "a": "Include occasional work and the maximum height in the quote request. A policy based on a lower limit may not match the job. Ask for review before accepting work outside the scope used for the quote."
      }
    ]
  },
  "welding/maine": {
    "name": "Welding Contractor",
    "state": "Maine",
    "reviewedOn": "2026-09-14",
    "intro": "A mobile welding business, a fabrication shop and a structural welding subcontractor need different insurance reviews. Describe the metals, finished products and job sites, including any hot work on existing buildings or equipment.",
    "pricing": "Provide the split between shop fabrication and work at customer sites, annual receipts, payroll, subcontracting costs and claims history. Identify structural, vehicle, marine, pressure-vessel or other specialist work explicitly. We have not established a Maine welding premium benchmark; a generic artisan starting price is not a quote for those operations.",
    "facts": [
      {
        "title": "Check employment status against the actual working relationship",
        "body": "Maine’s Workers’ Compensation Board explains that paid workers are presumed employees unless the employing unit proves otherwise under its criteria. Calling a helper an independent contractor does not settle that status. Use the Board’s guidance when planning staffing and coverage.",
        "source": {
          "label": "Maine Workers’ Compensation Board: independent contractor FAQ",
          "href": "https://www.maine.gov/wcb/Departments/coverage/independentcontractorFAQ.html"
        }
      },
      {
        "title": "Describe what you weld and where it goes",
        "body": "List shop products and site tasks separately: ornamental rails, equipment repairs, structural components and any specialist products. Include who designs the item, who installs it and how it is used. A business name or a general welding category does not explain those exposures."
      },
      {
        "title": "Prepare the hot-work questions before arriving on site",
        "body": "Ask the customer about its hot-work permit, fire-watch requirements, nearby combustible materials and site access. Share the contract with Cohesive and disclose cutting and welding methods. Flag any fire-control arrangements that still need to be confirmed with the customer."
      }
    ],
    "questions": [
      "What percentage is shop work versus mobile work?",
      "Are any welds structural or on vehicles, vessels or pressure equipment?",
      "Who designs and installs the product, and is inspection required?",
      "What hot-work procedures and customer insurance requirements apply?"
    ],
    "coverages": [
      {
        "name": "Welding operations and completed products",
        "desc": "Request review of hot work, property being worked on and products or completed operations. Discuss design responsibility separately where relevant."
      },
      {
        "name": "Shop, mobile equipment and workers",
        "desc": "Review shop property, welding rigs, tools taken to jobs, business vehicles and staffing. Match the insured property and vehicle use to the actual operation."
      }
    ],
    "faqs": [
      {
        "q": "Can one quote cover both shop and mobile welding?",
        "a": "Submit both operations and their revenue split for review. Whether one policy can cover them depends on the insurer and the proposed terms; do not leave mobile work out of a shop-only application."
      },
      {
        "q": "Is structural welding automatically covered by artisan contractor insurance?",
        "a": "No automatic assumption is appropriate. Describe the structural work, project types and inspection responsibilities so the insurer can decide whether it will accept them."
      },
      {
        "q": "What should I prepare for a Maine welding insurance quote?",
        "a": "Send the work description, shop and service locations, receipts, payroll, subcontractors, claims history and any contract insurance exhibit. Include hot-work procedures and specialist products rather than relying only on a welding business label."
      }
    ]
  },
  "roofer/new-jersey": {
    name: "Roofing", state: "New Jersey",
    intro: "Describe the roofs you work on before choosing a policy: residential or commercial, flat or pitched, repairs or replacement, and maximum working height. Cohesive can review the roofing scope alongside your NJ registration evidence and customer contract.",
    pricing: "A small roof-repair operation and a crew replacing commercial flat roofs need different underwriting. Send your revenue split, payroll, subcontracted cost, roof materials, and any heat application. Ask whether a quoted policy permits each activity and how it treats damage while a roof is open. We have not established a New Jersey roofing premium benchmark for this page.",
    facts: [
      { title: "Residential roofing belongs in the home improvement registration check", body: "New Jersey lists roofing among residential home improvements. Confirm the registration route for your business and project scope; forming an LLC does not complete that process.", source: njScope },
      njRegistration, njEmployer,
      { title: "Prepare a roof-specific submission before approaching GCs", body: "Build a short file with roof types, maximum height, tear-off methods, temporary weather protection, and subcontractor responsibilities. Send Cohesive the GC’s insurance exhibit before agreeing to it. Ask us to review additional insured and completed-operations requests, then provide issued insurance evidence when coverage is bound. A certificate alone does not change policy exclusions." },
    ],
    questions: ["What percentage of receipts comes from repairs, replacement, and new construction?", "Do you use torches, hot asphalt, or other heat application?", "Who is responsible for temporary waterproofing and overnight weather protection?", "Do employees or subcontractors perform the work, and what heights do they reach?"],
    coverages: [
      { name: "Roofing liability and completed work", desc: "Check the insured operations, height limits, subcontracting conditions, and open-roof or water-damage exclusions. Ask what happens if a leak is reported after handover." },
      { name: "Crew, vehicles, and equipment", desc: "Review workers’ compensation for the actual roofing tasks, vehicle use, and owned or rented equipment. Compare deductibles and exclusions as well as the premium." },
    ],
    faqs: [
      { q: "Does meeting NJ registration requirements satisfy a GC’s contract?", a: "Not necessarily. Compare the GC’s limits, additional insured wording, waiver requests, and completed-operations requirements with the proposed policies. Have Cohesive review the exhibit before you sign." },
      { q: "Can I use a general handyman policy for roofing?", a: "Do not assume it permits roofing. Give the insurer the actual roof work, materials, and working heights, and obtain confirmation of the covered operations and exclusions before accepting the job." },
      { q: "What should I send with a New Jersey roofing quote request?", a: "Send the legal entity name, NJ work locations, scope and height information, revenue, payroll, subcontracting costs, claims history, and any registration or customer insurance documents. Include the date coverage must begin." },
    ],
  },
  "pool/new-jersey": {
    name: "Pool Construction", state: "New Jersey",
    intro: "Pool construction needs a different insurance conversation from routine pool cleaning. Tell Cohesive whether you excavate, install shells, build decks, or subcontract electrical and plumbing work, then share the project’s insurance requirements.",
    pricing: "A maintenance-only premium is not a useful estimate for excavation and structural pool installation. For a New Jersey construction quote, separate new installations, renovations, and service revenue. Include excavation depth, equipment, subcontracted work, and who carries responsibility for each construction stage. This page does not claim a verified local average premium.",
    facts: [
      { title: "Check the residential pool registration route", body: "Swimming pools appear in New Jersey’s list of residential home improvements. Confirm how the registration rules apply to your installation business and keep job permits separate from business registration.", source: njScope },
      njRegistration, njEmployer,
      { title: "Coordinate the scope before excavation", body: "Make a responsibility list for utility locating, excavation, shell installation, drainage, decking, and specialist connections. Ask the local construction office which approvals apply to the actual address. For the insurance review, identify what your crew does and what each subcontractor does; do not describe the entire operation as pool service if you also build pools." },
    ],
    questions: ["Do you install concrete, fiberglass, or vinyl-lined pools?", "Who performs excavation and who owns or rents the equipment?", "Are retaining walls, decks, and drainage part of your contract?", "Who performs electrical and plumbing work, and what subcontractor evidence is required?"],
    coverages: [
      { name: "Construction liability", desc: "Discuss excavation, damage to existing property, underground services, and completed operations. Ask how exclusions apply to the pool itself and surrounding property." },
      { name: "Work in progress and equipment", desc: "Establish who insures materials and unfinished work. Separately review rented machinery, tools, vehicles, and employees; a liability policy does not automatically insure every project asset." },
    ],
    faqs: [
      { q: "Will pool cleaning insurance cover a new pool installation?", a: "Do not assume so. Installation, excavation, and structural work must be disclosed and accepted under the proposed policy. Tell Cohesive when you add construction to an existing service business." },
      { q: "What should a New Jersey pool builder ask a subcontractor for?", a: "Request a written scope, relevant credentials, and insurance evidence matching the work. Have the subcontract and any additional insured requirements reviewed. A subcontractor’s certificate does not establish that every loss will be covered." },
      { q: "How do I prepare for GC and landscape-contractor referrals?", a: "Prepare a project portfolio, service area, scope exclusions, registration details, and issued insurance evidence. Resolve the referring contractor’s insurance requirements before committing to a start date." },
    ],
  },
  "remodeler/new-jersey": {
    name: "Remodeling", state: "New Jersey",
    intro: "An occupied kitchen renovation has different exposures from a vacant-property structural remodel. Give Cohesive the work scope, occupancy, and subcontracting plan so we can review coverage against both the project and NJ registration requirements.",
    pricing: "For a New Jersey remodeling quote, break out cosmetic updates, kitchens and bathrooms, structural alterations, and additions. Identify whether customers remain in the property and which work is subcontracted. Those details matter more than applying a national starting price to every remodeler in the state. We do not present a verified NJ average on this page.",
    facts: [
      { title: "Match registration to the residential work", body: "New Jersey’s home improvement scope includes kitchens, bathrooms, additions, and finished basements. Check the registration route for your business and identify any separate specialist credentials needed for the work.", source: njScope },
      njRegistration, njEmployer,
      { title: "Separate the existing building from the work being installed", body: "Before demolition, record who is responsible for the existing property, new materials, and work in progress. Ask whether the homeowner’s insurer needs notice of the project and who arranges any construction property coverage. Give Cohesive the contract so we can discuss existing-property damage, subcontracting, and completed work without assuming general liability covers every repair cost." },
    ],
    questions: ["Will occupants remain during construction?", "Does the scope include load-bearing work, additions, or exterior openings?", "Which electrical, plumbing, and other specialist tasks are subcontracted?", "Who insures materials at the site and who approves changes in scope?"],
    coverages: [
      { name: "Liability for the remodeling operation", desc: "Review damage to existing property, occupied-premises exposures, and completed operations. Ask about exclusions tied to structural work or work performed by subcontractors." },
      { name: "Materials, tools, and the team", desc: "Discuss installation or project property coverage where appropriate, alongside tools, business driving, and workers’ compensation. Confirm who buys each policy rather than leaving gaps between owner and contractor." },
    ],
    faqs: [
      { q: "Does an NJ home improvement registration insure the renovation?", a: "No. Registration and insurance are separate. Keep required coverage in force and review the specific project, exclusions, and customer obligations before work starts." },
      { q: "What should I prepare for realtor referral work?", a: "Create a clear scope and change-order process for pre-sale repairs or move-in renovations. Share your service area, registration details, references, and issued insurance evidence. Clarify whether the property is occupied and who can authorize additional work." },
      { q: "Should I tell Cohesive when a cosmetic remodel becomes structural work?", a: "Yes. Discuss the revised scope before performing it. A policy quoted for one set of operations may not accommodate load-bearing alterations, additions, or other expanded work." },
    ],
  },
  "cleaning/new-jersey": {
    name: "Janitorial & Cleaning", state: "New Jersey",
    intro: "Office cleaning, residential turnovers, and post-construction cleanup create different customer-property risks. Cohesive can review your cleaning scope and a property manager’s insurance requirements before you accept access to the building.",
    pricing: "For a New Jersey janitorial quote, describe the premises, cleaning methods, staff, and annual revenue. Separate ordinary cleaning from floor refinishing, exterior work at height, hazardous cleanup, and other specialist services. Include key access and any bond requested by the customer. A national cleaning price does not establish the premium for your NJ contracts.",
    facts: [
      { title: "Use the state’s cleaning-specific startup route", body: "Business.NJ.gov provides a cleaning and janitorial starter kit covering formation, tax and employer registration, insurance, and business vehicles. Use the personalized route for your operation rather than treating an LLC filing as the entire setup process.", source: { label: "Business.NJ.gov: cleaning and janitorial starter kit", href: "https://account.business.nj.gov/starter-kits/cleaning-janitorial-services" } },
      njEmployer,
      { title: "Prepare a property-manager onboarding file", body: "Ask the manager for the insurance exhibit before agreeing to limits or endorsements. Record building types, after-hours access, keys, alarm codes, subcontractors, and the surfaces you clean. Send the exhibit to Cohesive, resolve coverage questions, and share issued insurance evidence before starting the contract. Keep access credentials out of marketing materials and quote descriptions." },
      { title: "Distinguish a janitorial bond from liability insurance", body: "Ask the customer what protection they expect from a bond and compare that request with the actual bond wording. Separately ask how liability coverage treats property being cleaned, chemicals, and accidental damage. Do not promise that either product pays every theft or damage claim." },
    ],
    questions: ["Are customers offices, homes, medical premises, or active construction sites?", "Do you hold keys or work when occupants are absent?", "Do you use employees, subcontractors, or both?", "Are high windows, hazardous materials, or floor treatments included?"],
    coverages: [
      { name: "Customer property and liability", desc: "Ask about property in your care, surfaces being worked on, chemical damage, and additional insured requests. Match the description of operations to the cleaning you actually sell." },
      { name: "Staff, vehicles, equipment, and dishonesty", desc: "Discuss workers’ compensation, business vehicle use, equipment, and any employee dishonesty or bond request separately. Compare the purpose and exclusions of each product." },
    ],
    faqs: [
      { q: "Does every NJ janitorial business need the same coverage?", a: "No. Start with applicable employer requirements and the work itself, then review the customer contract. A residential turnover and a commercial facility may ask for different limits, endorsements, and access controls." },
      { q: "Is a property manager’s requested limit a statewide legal minimum?", a: "A customer’s insurance exhibit states contractual requirements; it does not by itself establish a legal minimum for all New Jersey cleaning businesses. Have the contract and applicable state requirements reviewed separately." },
      { q: "How can insurance support realtor and property-manager outreach?", a: "Build a turnover-cleaning offer with a service area, checklist, scheduling process, and references. Arrange suitable coverage first, then provide accurate evidence when a prospect requests it. Cohesive can review the prospect’s insurance requirements before you commit." },
    ],
  },
  "tree-service/maryland": {
    name: "Tree Service", state: "Maryland",
    intro: "Maryland has a Licensed Tree Expert program, so a tree-care business needs to coordinate credentials and insurance. Tell Cohesive whether you prune, remove trees, grind stumps, use cranes, or perform plant-health work before requesting coverage.",
    pricing: "A Maryland tree-service quote needs the actual working heights, removal methods, equipment, payroll, and subcontracting plan. Separate ground work from climbing and crane-assisted jobs, and disclose work near utilities. A landscaping starting price is not a reliable tree-removal estimate. We have not established a Maryland premium benchmark for this page.",
    facts: [
      { title: "Start with Maryland’s Licensed Tree Expert program", body: "Maryland requires a DNR license for the work or business of a tree expert; supervised employees may not need an individual license. Check who holds the license covering your operation before advertising tree-expert services.", source: mdTree },
      { title: "Keep insurance evidence aligned with the license", body: "DNR requires licensees to maintain liability and property damage insurance in its required form and amount. Its program also requires reporting companies working under the license and their insurance information, including changes. Use the current DNR instructions for your application or update.", source: mdTree },
      { title: "Describe the job before offering a certificate", body: "For a removal near a house, give Cohesive the height, access, rigging method, crane arrangement, and subcontracted tasks. Ask about tree-work and utility exclusions. Discuss who insures rented machinery and who is responsible for damage to adjacent property. The policy’s operations and terms matter beyond the limit printed on a certificate." },
      { title: "Make referral work traceable", body: "For realtor and property-manager referrals, prepare a written scope, site photos, credential details, and issued insurance evidence. Record customer authorization and any neighboring access needed. If a storm changes the work from cleanup to hazardous standing-tree removal, review the revised scope before taking the job." },
    ],
    questions: ["What is the maximum height, and do crews climb or use aerial lifts?", "Are cranes owned, rented with an operator, or hired through a subcontractor?", "Do jobs involve utilities, storm-damaged trees, or neighboring property?", "Who holds the tree-expert license and which companies operate under it?"],
    coverages: [
      { name: "Tree-work liability", desc: "Confirm pruning, removal, stump grinding, and any plant-health operations in the submission. Review height, utility, crane, and subcontracting conditions rather than assuming a landscape policy permits all tree work." },
      { name: "Crew and heavy equipment", desc: "Review workers’ compensation for the actual work, business vehicles, chippers, lifts, and cranes. Discuss owned and rented equipment separately, including any rental-contract obligations." },
    ],
    faqs: [
      { q: "Does insurance replace Maryland’s tree-expert license?", a: "No. Check licensing eligibility with DNR and arrange the insurance evidence required for the license. These are separate tasks; buying a policy does not authorize otherwise unlicensed work." },
      { q: "What should I send Cohesive for a Maryland tree-service quote?", a: "Send your legal business name, service scope, heights, payroll, receipts, equipment, subcontracting plan, claims history, and DNR or customer insurance requirements. Explain any crane use or work near utilities." },
      { q: "Can I promise a property manager that every tree-damage claim is covered?", a: "No. Coverage depends on policy wording and the circumstances of the claim. Have the manager’s insurance exhibit reviewed and describe the operation accurately before supplying a certificate." },
    ],
  },
};

export function priorityStateUpdated(path: string): string | undefined {
  const profile = profiles[path.replace(/^\/insurance\//, "")];
  return profile ? profile.reviewedOn ?? PRIORITY_STATE_UPDATED : undefined;
}

export const PRIORITY_STATE_PATHS = Object.keys(profiles).map((key) => `/insurance/${key}`);

export function priorityStateContent(trade: string, state: string): Partial<PageContent> {
  const profile = profiles[`${trade}/${state}`];
  if (!profile) return {};
  return {
    title: `${profile.name} Insurance in ${profile.state}: Coverage & Requirements`,
    metaDescription: `Review ${profile.state} ${profile.name.toLowerCase()} insurance, official state resources, job-specific coverage questions, and the information Cohesive needs for a quote.`,
    heroH1: `${profile.name} Insurance in ${profile.state}`,
    heroSub: profile.intro,
    reviewedOn: profile.reviewedOn ?? PRIORITY_STATE_UPDATED,
    costNarrative: [profile.pricing],
    costRows: [
      { coverage: "General liability", range: "Individual quote", note: "Based on accepted operations, limits, deductibles, revenue, and claims." },
      { coverage: "Workers’ compensation", range: "Individual quote", note: "Review state requirements, entity structure, payroll, and work classifications." },
      { coverage: "Vehicles, tools, and other coverage", range: "Separate review", note: "Match each policy to owned or rented assets and customer requirements." },
    ],
    costDisclaimer: "No state-specific average premium is claimed here. Cohesive can request quotes after reviewing your operation. Coverage is subject to insurer acceptance and policy terms.",
    priceDrivers: profile.questions,
    coverages: profile.coverages,
    stateFacts: profile.facts,
    faqs: profile.faqs,
  };
}
