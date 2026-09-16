import type { PageContent } from "./data";

export const METRO_UPDATED = "2026-09-16";
export type MetroPage = {
  trade: string; state: string; city: string; cityName: string; stateName: string;
  label: string; path: string; parentPath: string; source: string;
  operationsPrompt: string; content: PageContent;
};
// Explicit, researched pilot. No automatic city x trade expansion or inferred local offices.
export const METRO_PAGES: MetroPage[] = [
  {
    "trade": "cleaning",
    "state": "florida",
    "city": "tampa",
    "cityName": "Tampa",
    "stateName": "Florida",
    "label": "Janitorial & Cleaning insurance",
    "path": "/insurance/cleaning/florida/tampa",
    "parentPath": "/insurance/cleaning/florida",
    "source": "seo-cleaning-florida-tampa",
    "content": {
      "title": "Janitorial & Cleaning Insurance in Tampa, Florida",
      "metaDescription": "Janitorial & cleaning insurance in Tampa, Florida. Review customer-property damage, janitorial contracts, crew coverage and COI requirements. Request a quote.",
      "heroH1": "Janitorial & Cleaning Insurance in Tampa",
      "heroSub": "Cleaning offices, shared buildings or customer homes in Tampa? Compare insurance against the surfaces you clean, the keys you hold and the contracts you sign. Tell us about floor care, occupied premises and hired crews before requesting a certificate.",
      "alsoCovers": "Include janitorial contracts, house cleaning, floor stripping or waxing, and any window work. Identify the customer property your crew actually handles and distinguish routine cleaning from mold, biohazard or disaster cleanup.",
      "reviewedOn": "2026-09-16",
      "costNarrative": [
        "Your Tampa quote should reflect the work and customer requirements you actually take on. Include janitorial contracts, house cleaning, floor stripping or waxing, and any window work. Identify the customer property your crew actually handles and distinguish routine cleaning from mold, biohazard or disaster cleanup.",
        "Use the same gross receipts, employee payroll, subcontractor costs, claims and requested limits for each proposal. Compare accepted operations, exclusions, deductibles, fees and payment terms as well as price. Identify any estimates or unknowns before choosing coverage."
      ],
      "costDisclaimer": "No city-specific starting premium or average is claimed. Coverage, eligibility and price depend on the submitted facts and the policy offered.",
      "costRows": [
        {
          "coverage": "General liability",
          "range": "Individual quote",
          "note": "Review the actual work, customer-property exposures and policy terms."
        },
        {
          "coverage": "Workers’ compensation",
          "range": "Separate review",
          "note": "Use the real staffing arrangement, state rules and customer requirements."
        },
        {
          "coverage": "Equipment, vehicles and other coverage",
          "range": "As needed",
          "note": "Identify the property, vehicles and contract requirements that need a separate review."
        }
      ],
      "priceDrivers": [
        "Residential versus commercial work and specialist cleaning tasks",
        "Annual receipts, W2 payroll and payments to hired businesses",
        "Customer-property exposures, window heights, chemicals and claims",
        "Required limits, deductibles, endorsements and fees"
      ],
      "coverages": [
        {
          "name": "Damage to customer property",
          "desc": "Ask about the surface being cleaned, other property, property in your care and chemical damage. Review actual exclusions, endorsements and sublimits; general liability is not a blanket promise to pay for every cleaning mistake."
        },
        {
          "name": "Keys, access and employee dishonesty",
          "desc": "Discuss missing keys, access credentials and theft allegations separately from accidental damage. Review any crime coverage or janitorial bond, including its conditions and the people it covers."
        },
        {
          "name": "Staff, hired crews and vehicles",
          "desc": "List employees and other cleaning businesses separately. Review worker coverage, subcontractor conditions, equipment and business vehicle use against the work and contract."
        }
      ],
      "stateFacts": [
        {
          "title": "Use the actual Tampa customer contract as your checklist",
          "body": "The City of Tampa publishes an insurance exhibit for agreements that incorporate it. It addresses liability, vehicles, workers’ compensation, additional insured status and evidence before work begins. Those are requirements of the covered City agreement, not a minimum package for every cleaner in Tampa. Send the complete exhibit and contract value for review; a certificate alone does not change policy terms.",
          "source": {
            "label": "City of Tampa: insurance requirements for its agreements",
            "href": "https://www.tampa.gov/sites/default/files/document/2025/insurance-requirements-accessible.pdf"
          }
        },
        {
          "title": "Airport vendor requirements are a separate contract review",
          "body": "Tampa International Airport says supplier insurance is determined by the risk of the work and publishes certificate guidance. If your cleaning customer is the airport authority, use its requirements rather than another building manager’s checklist. The fact that a policy satisfies one customer does not establish acceptance by another.",
          "source": {
            "label": "Tampa International Airport: insurance for suppliers",
            "href": "https://www.tampaairport.com/business/procurement/procurement-policies-procedures/insurance-suppliers"
          }
        },
        {
          "title": "Walk through a floor-care loss before choosing a policy",
          "body": "Example to discuss: a cleaning product damages the floor you were hired to treat, and liquid also reaches an adjoining tenant’s space. Ask separately about the work surface, other property, chemical exclusions and any deductible or sublimit. Describe the product and method; the presence of a property-damage limit does not answer those questions."
        }
      ],
      "faqs": [
        {
          "q": "Does a Tampa janitorial contract mean any general liability policy will work?",
          "a": "No. Compare the actual contract with the policy’s accepted operations, exclusions, limits and endorsements. City or airport requirements apply to their own contracts; a private office manager may ask for different terms."
        },
        {
          "q": "What do I need for a Tampa insurance comparison?",
          "a": "Send the actual work description, job locations, estimated annual sales, W2 payroll, subcontractor costs, claims history and customer insurance requirements. If you have an existing policy, include the declarations and endorsements so coverage differences can be reviewed."
        }
      ]
    },
    "operationsPrompt": "Include janitorial contracts, house cleaning, floor stripping or waxing, and any window work. Identify the customer property your crew actually handles and distinguish routine cleaning from mold, biohazard or disaster cleanup."
  },
  {
    "trade": "cleaning",
    "state": "indiana",
    "city": "indianapolis",
    "cityName": "Indianapolis",
    "stateName": "Indiana",
    "label": "Janitorial & Cleaning insurance",
    "path": "/insurance/cleaning/indiana/indianapolis",
    "parentPath": "/insurance/cleaning/indiana",
    "source": "seo-cleaning-indiana-indianapolis",
    "content": {
      "title": "Janitorial & Cleaning Insurance in Indianapolis, Indiana",
      "metaDescription": "Janitorial & cleaning insurance in Indianapolis, Indiana. Review customer-property damage, janitorial contracts, crew coverage and COI requirements. Request a quote.",
      "heroH1": "Janitorial & Cleaning Insurance in Indianapolis",
      "heroSub": "For an Indianapolis janitorial business, the useful comparison is what happens at the customer’s property. Review cleaning damage, after-hours access, employee theft allegations and subcontracted crews alongside the annual premium.",
      "alsoCovers": "Break down offices, homes, apartment common areas and any specialist facilities. Include carpet extraction, floor machines, window heights, keyholding and work performed by another business. Medical or industrial cleanup needs a specific description rather than an ordinary office-cleaning label.",
      "reviewedOn": "2026-09-16",
      "costNarrative": [
        "Your Indianapolis quote should reflect the work and customer requirements you actually take on. Break down offices, homes, apartment common areas and any specialist facilities. Include carpet extraction, floor machines, window heights, keyholding and work performed by another business. Medical or industrial cleanup needs a specific description rather than an ordinary office-cleaning label.",
        "Use the same gross receipts, employee payroll, subcontractor costs, claims and requested limits for each proposal. Compare accepted operations, exclusions, deductibles, fees and payment terms as well as price. Identify any estimates or unknowns before choosing coverage."
      ],
      "costDisclaimer": "No city-specific starting premium or average is claimed. Coverage, eligibility and price depend on the submitted facts and the policy offered.",
      "costRows": [
        {
          "coverage": "General liability",
          "range": "Individual quote",
          "note": "Review the actual work, customer-property exposures and policy terms."
        },
        {
          "coverage": "Workers’ compensation",
          "range": "Separate review",
          "note": "Use the real staffing arrangement, state rules and customer requirements."
        },
        {
          "coverage": "Equipment, vehicles and other coverage",
          "range": "As needed",
          "note": "Identify the property, vehicles and contract requirements that need a separate review."
        }
      ],
      "priceDrivers": [
        "Residential versus commercial work and specialist cleaning tasks",
        "Annual receipts, W2 payroll and payments to hired businesses",
        "Customer-property exposures, window heights, chemicals and claims",
        "Required limits, deductibles, endorsements and fees"
      ],
      "coverages": [
        {
          "name": "Damage to customer property",
          "desc": "Ask about the surface being cleaned, other property, property in your care and chemical damage. Review actual exclusions, endorsements and sublimits; general liability is not a blanket promise to pay for every cleaning mistake."
        },
        {
          "name": "Keys, access and employee dishonesty",
          "desc": "Discuss missing keys, access credentials and theft allegations separately from accidental damage. Review any crime coverage or janitorial bond, including its conditions and the people it covers."
        },
        {
          "name": "Staff, hired crews and vehicles",
          "desc": "List employees and other cleaning businesses separately. Review worker coverage, subcontractor conditions, equipment and business vehicle use against the work and contract."
        }
      ],
      "stateFacts": [
        {
          "title": "Find the insurance exhibit for the Indianapolis contract you are bidding",
          "body": "Indianapolis provides a public contract search. For City work, locate the relevant agreement and insurance exhibit, or request the current bid package from the buyer. Check the named insured, customer identity, renewal evidence and required endorsements against that specific contract. A public contract is an example to review, not a citywide rule for private janitorial jobs.",
          "source": {
            "label": "Indianapolis: view and search public contracts",
            "href": "https://www.indy.gov/workflow/view-and-search-public-contracts"
          }
        },
        {
          "title": "Resolve Indiana crew status separately from the GL quote",
          "body": "Use the Indiana Worker’s Compensation Board’s employer and independent-contractor guidance to establish your responsibilities. Give the reviewer W2 payroll and payments to other cleaning businesses separately. Calling a worker a subcontractor or having no W2 payroll does not itself establish an exemption or satisfy a customer’s contract.",
          "source": {
            "label": "Indiana Worker’s Compensation Board: employers",
            "href": "https://www.in.gov/wcb/employers/"
          }
        },
        {
          "title": "Separate cleaning damage from missing customer property",
          "body": "Example to discuss: an after-hours crew damages a countertop, while the customer also alleges an item disappeared. Ask which policy, if any, addresses each allegation. A janitorial bond, employee-dishonesty coverage and liability for accidental damage are different reviews. Describe access codes, keys and any hired cleaning business rather than assuming a bond covers everything."
        }
      ],
      "faqs": [
        {
          "q": "What should an Indianapolis cleaner prepare for a property manager’s COI request?",
          "a": "Send the contract’s insurance exhibit, your exact business name, the manager’s requested certificate-holder details and the actual cleaning scope. Include employee and subcontractor arrangements. Have endorsements reviewed before describing the customer as additionally insured; the certificate itself does not create that status."
        },
        {
          "q": "What do I need for a Indianapolis insurance comparison?",
          "a": "Send the actual work description, job locations, estimated annual sales, W2 payroll, subcontractor costs, claims history and customer insurance requirements. If you have an existing policy, include the declarations and endorsements so coverage differences can be reviewed."
        }
      ]
    },
    "operationsPrompt": "Break down offices, homes, apartment common areas and any specialist facilities. Include carpet extraction, floor machines, window heights, keyholding and work performed by another business. Medical or industrial cleanup needs a specific description rather than an ordinary office-cleaning label."
  },
  {
    "trade": "pool",
    "state": "texas",
    "city": "dallas",
    "cityName": "Dallas",
    "stateName": "Texas",
    "label": "Pool Construction insurance",
    "path": "/insurance/pool/texas/dallas",
    "parentPath": "/insurance/pool/texas",
    "source": "seo-pool-texas-dallas",
    "content": {
      "title": "Pool Construction Insurance in Dallas, Texas",
      "metaDescription": "Pool construction insurance in Dallas, Texas. Compare gunite, silica, excavation, subcontractor and completed-work coverage. Request a quote.",
      "heroH1": "Pool Construction Insurance in Dallas",
      "heroSub": "Building or renovating pools in Dallas? Request coverage for the construction stages you contract to deliver: excavation, steel, gunite or shell placement, connections, decking and handover. A pool-maintenance price is not a construction comparison.",
      "alsoCovers": "List gunite/shotcrete, fiberglass or liner systems; excavation and retaining work; equipment ownership; and the crew or subcontractor responsible for each stage. Include renovation of existing shells as well as new installations.",
      "reviewedOn": "2026-09-16",
      "costNarrative": [
        "Your Dallas quote should reflect the work and customer requirements you actually take on. List gunite/shotcrete, fiberglass or liner systems; excavation and retaining work; equipment ownership; and the crew or subcontractor responsible for each stage. Include renovation of existing shells as well as new installations.",
        "Use the same gross receipts, employee payroll, subcontractor costs, claims and requested limits for each proposal. Compare accepted operations, exclusions, deductibles, fees and payment terms as well as price. Identify any estimates or unknowns before choosing coverage."
      ],
      "costDisclaimer": "No city-specific starting premium or average is claimed. Coverage, eligibility and price depend on the submitted facts and the policy offered.",
      "costRows": [
        {
          "coverage": "General liability",
          "range": "Individual quote",
          "note": "Review the actual work, customer-property exposures and policy terms."
        },
        {
          "coverage": "Workers’ compensation",
          "range": "Separate review",
          "note": "Use the real staffing arrangement, state rules and customer requirements."
        },
        {
          "coverage": "Equipment, vehicles and other coverage",
          "range": "As needed",
          "note": "Identify the property, vehicles and contract requirements that need a separate review."
        }
      ],
      "priceDrivers": [
        "Construction, renovation and maintenance shares of receipts",
        "Pool systems, excavation, structural work and largest project",
        "Gross receipts, W2 payroll and subcontractor costs",
        "Claims, equipment, limits, deductibles and exclusions"
      ],
      "coverages": [
        {
          "name": "Installation and completed operations",
          "desc": "Review accepted pool systems, excavation, utilities, structural work and damage after handover. A maintenance classification is not confirmation of coverage for a build."
        },
        {
          "name": "Gunite, silica and pollution",
          "desc": "Disclose gunite/shotcrete application, concrete or tile cutting, and cleanup. Review silica and pollution exclusions in each proposed policy. A separate pollution policy also needs its own exclusions checked."
        },
        {
          "name": "Unfinished work, equipment and crews",
          "desc": "Establish responsibility for materials and the pool during construction. Review owned/rented equipment, employee coverage, vehicles and subcontractor insurance separately from GL."
        }
      ],
      "stateFacts": [
        {
          "title": "Match the Dallas project documents to the insured operations",
          "body": "Dallas publishes residential permit information and a fence and swimming-pool barrier checklist, with its DallasNow portal for permitting. Use the actual site and project scope to identify responsibilities for the pool, barriers and specialist connections. Permit approval and insurance coverage are different checks; neither substitutes for the other.",
          "source": {
            "label": "City of Dallas: residential permits and pool-barrier checklist",
            "href": "https://dallascityhall.com/departments/sustainabledevelopment/buildinginspection/pages/residential.aspx"
          }
        },
        {
          "title": "Check the job jurisdiction across the metro",
          "body": "A Dallas-area mailing address or service territory does not make every project a City of Dallas permit. Confirm the responsible authority for each site, including jobs in neighboring municipalities. Give the broker the actual work locations and contractual role rather than treating the entire metro as one permit area."
        },
        {
          "title": "Price excavation and installation on the same facts",
          "body": "Example to discuss: excavation affects an existing utility, or shell work leads to damage discovered after completion. Compare underground-services, soil-movement, installation and completed-operations terms. Ask separately about unfinished work and materials. A lower premium is not equivalent if one proposal describes only cleaning or uses lower receipts."
        }
      ],
      "faqs": [
        {
          "q": "Does pool construction insurance in Dallas automatically include gunite and silica exposure?",
          "a": "No. Ask the insurer to accept the actual construction operations and review gunite/shotcrete, silica-related dust and pollution wording separately. Identify who applies or cuts materials. Employee exposure and a homeowner or neighbor’s claim also require different coverage reviews."
        },
        {
          "q": "What do I need for a Dallas insurance comparison?",
          "a": "Send the actual work description, job locations, estimated annual sales, W2 payroll, subcontractor costs, claims history and customer insurance requirements. If you have an existing policy, include the declarations and endorsements so coverage differences can be reviewed."
        }
      ]
    },
    "operationsPrompt": "List gunite/shotcrete, fiberglass or liner systems; excavation and retaining work; equipment ownership; and the crew or subcontractor responsible for each stage. Include renovation of existing shells as well as new installations."
  },
  {
    "trade": "pool",
    "state": "florida",
    "city": "tampa",
    "cityName": "Tampa",
    "stateName": "Florida",
    "label": "Pool Construction insurance",
    "path": "/insurance/pool/florida/tampa",
    "parentPath": "/insurance/pool/florida",
    "source": "seo-pool-florida-tampa",
    "content": {
      "title": "Pool Construction Insurance in Tampa, Florida",
      "metaDescription": "Pool construction insurance in Tampa, Florida. Compare gunite, silica, excavation, subcontractor and completed-work coverage. Request a quote.",
      "heroH1": "Pool Construction Insurance in Tampa",
      "heroSub": "For a Tampa pool build, review excavation, shell application, utilities, subcontractors and the unfinished project together. Tell us whether you construct new pools, renovate existing shells or also run a maintenance route.",
      "alsoCovers": "Identify new construction versus service receipts, gunite or other shell systems, plumbing and electrical subcontractors, decking and any retaining walls. Describe who is responsible for the project while work is incomplete and when it is handed to the owner.",
      "reviewedOn": "2026-09-16",
      "costNarrative": [
        "Your Tampa quote should reflect the work and customer requirements you actually take on. Identify new construction versus service receipts, gunite or other shell systems, plumbing and electrical subcontractors, decking and any retaining walls. Describe who is responsible for the project while work is incomplete and when it is handed to the owner.",
        "Use the same gross receipts, employee payroll, subcontractor costs, claims and requested limits for each proposal. Compare accepted operations, exclusions, deductibles, fees and payment terms as well as price. Identify any estimates or unknowns before choosing coverage."
      ],
      "costDisclaimer": "No city-specific starting premium or average is claimed. Coverage, eligibility and price depend on the submitted facts and the policy offered.",
      "costRows": [
        {
          "coverage": "General liability",
          "range": "Individual quote",
          "note": "Review the actual work, customer-property exposures and policy terms."
        },
        {
          "coverage": "Workers’ compensation",
          "range": "Separate review",
          "note": "Use the real staffing arrangement, state rules and customer requirements."
        },
        {
          "coverage": "Equipment, vehicles and other coverage",
          "range": "As needed",
          "note": "Identify the property, vehicles and contract requirements that need a separate review."
        }
      ],
      "priceDrivers": [
        "Construction, renovation and maintenance shares of receipts",
        "Pool systems, excavation, structural work and largest project",
        "Gross receipts, W2 payroll and subcontractor costs",
        "Claims, equipment, limits, deductibles and exclusions"
      ],
      "coverages": [
        {
          "name": "Installation and completed operations",
          "desc": "Review accepted pool systems, excavation, utilities, structural work and damage after handover. A maintenance classification is not confirmation of coverage for a build."
        },
        {
          "name": "Gunite, silica and pollution",
          "desc": "Disclose gunite/shotcrete application, concrete or tile cutting, and cleanup. Review silica and pollution exclusions in each proposed policy. A separate pollution policy also needs its own exclusions checked."
        },
        {
          "name": "Unfinished work, equipment and crews",
          "desc": "Establish responsibility for materials and the pool during construction. Review owned/rented equipment, employee coverage, vehicles and subcontractor insurance separately from GL."
        }
      ],
      "stateFacts": [
        {
          "title": "Use Tampa’s residential pool process for the actual site",
          "body": "The City of Tampa publishes a residential pool-and-spa permit process and an in-ground pool application guide. Assemble the plans, project scope and parties responsible for each stage before the insurance review. These are City resources; confirm the authority for sites outside city limits. A permit does not establish that gunite, excavation or resulting damage is insured.",
          "source": {
            "label": "City of Tampa: residential pool and spa permits",
            "href": "https://www.tampa.gov/construction-services/residential-permits/pool-and-spa"
          }
        },
        {
          "title": "Keep Florida licensing scope and insurance scope separate",
          "body": "Florida DBPR distinguishes pool construction and servicing license scopes. Check the work you and your subcontractors are authorized to perform, then have the insurer review those same operations. A servicing description should not stand in for structural pool construction.",
          "source": {
            "label": "Florida DBPR: construction and pool licensing FAQ",
            "href": "https://www2.myfloridalicense.com/construction-industry/faqs/"
          }
        },
        {
          "title": "Review the build before, during and after shell application",
          "body": "Example to discuss: equipment or materials are damaged while the pool is unfinished, and a separate defect later causes damage after handover. Ask who insures work in progress, how installation and completed operations are treated, and which exclusions apply. Include weather-protection responsibilities in the project plan without assuming a GL policy covers weather damage to your work."
        }
      ],
      "faqs": [
        {
          "q": "What if my Tampa pool company subcontracts all gunite and excavation?",
          "a": "Disclose the entire project you contract to deliver and identify which business performs each stage. Provide gross receipts, subcontractor costs, actual W2 payroll and available subcontractor insurance evidence. Hiring another company does not by itself establish coverage for your contractual or supervisory responsibility."
        },
        {
          "q": "What do I need for a Tampa insurance comparison?",
          "a": "Send the actual work description, job locations, estimated annual sales, W2 payroll, subcontractor costs, claims history and customer insurance requirements. If you have an existing policy, include the declarations and endorsements so coverage differences can be reviewed."
        }
      ]
    },
    "operationsPrompt": "Identify new construction versus service receipts, gunite or other shell systems, plumbing and electrical subcontractors, decking and any retaining walls. Describe who is responsible for the project while work is incomplete and when it is handed to the owner."
  },
  {
    "trade": "tree-service",
    "state": "north-carolina",
    "city": "charlotte",
    "cityName": "Charlotte",
    "stateName": "North Carolina",
    "label": "Tree Service & Removal insurance",
    "path": "/insurance/tree-service/north-carolina/charlotte",
    "parentPath": "/insurance/tree-service/north-carolina",
    "source": "seo-tree-service-north-carolina-charlotte",
    "content": {
      "title": "Tree Service & Removal Insurance in Charlotte, North Carolina",
      "metaDescription": "Tree service & removal insurance in Charlotte, North Carolina. Compare height limits, tree removal, cranes, utility exposures and customer requirements. Request a quote.",
      "heroH1": "Tree Service & Removal Insurance in Charlotte",
      "heroSub": "Removing or pruning trees in Charlotte? Compare policies against the heights, methods and sites you actually accept. Include climbing, bucket trucks, cranes, storm work and nearby utilities before relying on a tree-service label.",
      "alsoCovers": "State the maximum work and tree heights, whether you fell or dismantle trees, and when you use a crane or hired crew. Include stump grinding and work beside roads, buildings and overhead lines. Occasional high-risk jobs belong in the description too.",
      "reviewedOn": "2026-09-16",
      "costNarrative": [
        "Your Charlotte quote should reflect the work and customer requirements you actually take on. State the maximum work and tree heights, whether you fell or dismantle trees, and when you use a crane or hired crew. Include stump grinding and work beside roads, buildings and overhead lines. Occasional high-risk jobs belong in the description too.",
        "Use the same gross receipts, employee payroll, subcontractor costs, claims and requested limits for each proposal. Compare accepted operations, exclusions, deductibles, fees and payment terms as well as price. Identify any estimates or unknowns before choosing coverage."
      ],
      "costDisclaimer": "No city-specific starting premium or average is claimed. Coverage, eligibility and price depend on the submitted facts and the policy offered.",
      "costRows": [
        {
          "coverage": "General liability",
          "range": "Individual quote",
          "note": "Review the actual work, customer-property exposures and policy terms."
        },
        {
          "coverage": "Workers’ compensation",
          "range": "Separate review",
          "note": "Use the real staffing arrangement, state rules and customer requirements."
        },
        {
          "coverage": "Equipment, vehicles and other coverage",
          "range": "As needed",
          "note": "Identify the property, vehicles and contract requirements that need a separate review."
        }
      ],
      "priceDrivers": [
        "Maximum work/tree heights and removal methods",
        "Cranes, storm work, traffic and utilities",
        "Receipts, crew payroll, subcontractors and claims",
        "Equipment, limits, deductibles and required endorsements"
      ],
      "coverages": [
        {
          "name": "Height and removal restrictions",
          "desc": "Request full endorsements for work height, tree-felling height and removal methods. State your highest accepted work and occasional jobs, not only routine pruning."
        },
        {
          "name": "Cranes, bucket work and utilities",
          "desc": "Describe climbing, equipment operators, rigging, traffic and nearby power lines. Check the actual crane, utility and subcontractor conditions before accepting the job."
        },
        {
          "name": "Crews, equipment and vehicles",
          "desc": "Give employee payroll, hired-business costs and vehicle/equipment details separately. Liability for damage to others, worker injuries and damage to your machinery require different reviews."
        }
      ],
      "stateFacts": [
        {
          "title": "Distinguish a street tree from a private yard job",
          "body": "Charlotte’s resident-services guidance describes a permit process for prescribed work on right-of-way trees after its arborist approves the work, with a certified arborist on the company’s staff. Check that process before treating a street-side tree as an ordinary private removal. This specific City process is separate from the insurer’s height and operations restrictions.",
          "source": {
            "label": "City of Charlotte: tree services and right-of-way work permits",
            "href": "https://www.charlottenc.gov/City-Government/Departments/General-Services/Tree-Management/Resident-Services"
          }
        },
        {
          "title": "Compare work height and felling height separately",
          "body": "Example to discuss: the operator works from a bucket below a policy’s stated height, but the tree being removed is taller. Ask how each endorsement measures height and whether a separate felling restriction applies. Give the actual maximums; an average job height cannot establish that the taller job fits."
        },
        {
          "title": "Prepare access, lifting and utility details",
          "body": "For a removal near a building or street, describe the drop zone, rigging, crane operator, traffic exposure and nearby lines. Ask about the proposed policy’s removal, crane, utility and subcontractor conditions. A permit or arborist credential does not remove a policy exclusion."
        }
      ],
      "faqs": [
        {
          "q": "Can a low-height tree-trimming policy cover my Charlotte removals?",
          "a": "Only if the actual removal work and heights are accepted by the insurer under the policy terms. Ask for the full work-height and tree-felling endorsements and review climbing, bucket, crane and utility exposures. Do not describe removal as trimming to fit a quote."
        },
        {
          "q": "What do I need for a Charlotte insurance comparison?",
          "a": "Send the actual work description, job locations, estimated annual sales, W2 payroll, subcontractor costs, claims history and customer insurance requirements. If you have an existing policy, include the declarations and endorsements so coverage differences can be reviewed."
        }
      ]
    },
    "operationsPrompt": "State the maximum work and tree heights, whether you fell or dismantle trees, and when you use a crane or hired crew. Include stump grinding and work beside roads, buildings and overhead lines. Occasional high-risk jobs belong in the description too."
  },
  {
    "trade": "remodeler",
    "state": "north-carolina",
    "city": "raleigh",
    "cityName": "Raleigh",
    "stateName": "North Carolina",
    "label": "Remodeling Contractor insurance",
    "path": "/insurance/remodeler/north-carolina/raleigh",
    "parentPath": "/insurance/remodeler/north-carolina",
    "source": "seo-remodeler-north-carolina-raleigh",
    "content": {
      "title": "Remodeling Contractor Insurance in Raleigh, North Carolina",
      "metaDescription": "Remodeling contractor insurance in Raleigh, North Carolina. Review structural work, occupied-home damage, subcontractors and customer requirements. Request a quote.",
      "heroH1": "Remodeling Contractor Insurance in Raleigh",
      "heroSub": "For a Raleigh kitchen, bathroom or whole-home renovation, describe the work behind the finishes. Compare coverage for structural changes, existing property, occupied rooms and hired trades before choosing a premium.",
      "alsoCovers": "Separate cosmetic updates from load-bearing changes, additions, foundation work and demolition. Identify who disconnects plumbing, performs electrical work and protects the occupied home. Keep sales, W2 payroll and subcontractor costs separate.",
      "reviewedOn": "2026-09-16",
      "costNarrative": [
        "Your Raleigh quote should reflect the work and customer requirements you actually take on. Separate cosmetic updates from load-bearing changes, additions, foundation work and demolition. Identify who disconnects plumbing, performs electrical work and protects the occupied home. Keep sales, W2 payroll and subcontractor costs separate.",
        "Use the same gross receipts, employee payroll, subcontractor costs, claims and requested limits for each proposal. Compare accepted operations, exclusions, deductibles, fees and payment terms as well as price. Identify any estimates or unknowns before choosing coverage."
      ],
      "costDisclaimer": "No city-specific starting premium or average is claimed. Coverage, eligibility and price depend on the submitted facts and the policy offered.",
      "costRows": [
        {
          "coverage": "General liability",
          "range": "Individual quote",
          "note": "Review the actual work, customer-property exposures and policy terms."
        },
        {
          "coverage": "Workers’ compensation",
          "range": "Separate review",
          "note": "Use the real staffing arrangement, state rules and customer requirements."
        },
        {
          "coverage": "Equipment, vehicles and other coverage",
          "range": "As needed",
          "note": "Identify the property, vehicles and contract requirements that need a separate review."
        }
      ],
      "priceDrivers": [
        "Cosmetic work, structural alterations, additions and demolition",
        "Occupied properties, largest job and design responsibility",
        "Annual receipts, W2 payroll and subcontractor costs",
        "Loss history, policy exclusions, limits, deductibles and fees"
      ],
      "coverages": [
        {
          "name": "Structural versus cosmetic work",
          "desc": "Have demolition, load-bearing changes, additions and foundations accepted explicitly. A quote for finish work should not silently stand in for a structural renovation."
        },
        {
          "name": "Existing property and occupied rooms",
          "desc": "Ask separately about the work itself, other parts of the building and damage after completion. Describe temporary openings, water shutoffs, dust and any older materials disturbed."
        },
        {
          "name": "Subcontractors and project property",
          "desc": "Review hired-trade conditions, contracts and insurance evidence. Establish who insures stored materials, tools and unfinished work; GL does not answer every project-property question."
        }
      ],
      "stateFacts": [
        {
          "title": "Use Raleigh’s alteration questions to describe the work",
          "body": "Raleigh’s residential alteration form asks whether work changes the footprint, converts unfinished space or moves load-bearing walls; it also separates building and electrical scope. Use the current project documents to explain those same distinctions to the quote reviewer. A remodeling label alone does not establish acceptance of structural work.",
          "source": {
            "label": "City of Raleigh: residential alteration scope form",
            "href": "https://cityofraleigh0drupal.blob.core.usgovcloudapi.net/drupal-prod/COR15/ResidentialBuildingAlterationForm.pdf"
          }
        },
        {
          "title": "Check the correct residential project process",
          "body": "Raleigh’s residential permit resources distinguish project types and link to its permit workflow. Confirm which process applies to an addition versus an interior alteration before sending the scope for insurance review. A Raleigh-area job outside the City’s jurisdiction may have another permitting authority.",
          "source": {
            "label": "City of Raleigh: residential permit resources",
            "href": "https://raleighnc.gov/planning-and-development/service-unit/permits-residential"
          }
        },
        {
          "title": "Test coverage against an occupied-home loss",
          "body": "Example to discuss: plumbing work causes a leak into an untouched room, or cutting material spreads dust into an occupied area. Ask about the part being worked on, resulting damage elsewhere, completed work and silica, lead, asbestos or pollution wording where relevant. Insuring your tools or redoing defective work is a separate question from third-party liability."
        }
      ],
      "faqs": [
        {
          "q": "Can an all-subcontractor Raleigh remodeler use a no-employees quote?",
          "a": "State zero W2 payroll when accurate, but also disclose gross receipts, subcontractor costs, the full project scope and your contractual role. A business that hires every trade still needs its own operations and subcontractor conditions reviewed. Do not substitute a token payroll figure or a cosmetic-work description."
        },
        {
          "q": "What do I need for a Raleigh insurance comparison?",
          "a": "Send the actual work description, job locations, estimated annual sales, W2 payroll, subcontractor costs, claims history and customer insurance requirements. If you have an existing policy, include the declarations and endorsements so coverage differences can be reviewed."
        }
      ]
    },
    "operationsPrompt": "Separate cosmetic updates from load-bearing changes, additions, foundation work and demolition. Identify who disconnects plumbing, performs electrical work and protects the occupied home. Keep sales, W2 payroll and subcontractor costs separate."
  }
];
export function getMetroPage(trade: string, state: string, city: string): MetroPage | undefined {
  return METRO_PAGES.find(p => p.trade === trade && p.state === state && p.city === city);
}
export function metroLinksFor(trade?: string, state?: string, currentCity?: string) {
  return METRO_PAGES.filter(p => p.trade === trade && (!state || p.state === state) && p.city !== currentCity)
    .map(p => ({ label: `${p.cityName}, ${p.stateName}: ${p.label}`, href: p.path }));
}
export const METRO_RELEASE_PATHS = [...new Set([
  ...METRO_PAGES.flatMap(p => [p.path, p.parentPath, `/insurance/${p.trade}`]), "/insurance",
])];
export function metroUpdatedForPath(path: string): string | undefined {
  return METRO_RELEASE_PATHS.includes(path) ? METRO_UPDATED : undefined;
}
