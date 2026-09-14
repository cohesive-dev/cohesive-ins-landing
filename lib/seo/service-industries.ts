import type { Fact, PageContent } from "./data";

// Editorial page scope only. These are not carrier classes, licensing rulings or quote guarantees.
export const SERVICE_UPDATED = "2026-09-14";
export const SERVICE_STATE_NAMES: Record<string, string> = {
  "texas": "Texas",
  "florida": "Florida",
  "arizona": "Arizona",
  "north-carolina": "North Carolina",
  "georgia": "Georgia"
};
export type ServiceProfile = { intro: string; facts: Fact[]; questions: string[]; faq: { q: string; a: string } };
export type InsuranceService = {
  slug: string; name: string; noun: string; intakeLabel: string; parentSlug: string;
  operationsPrompt: string; guidePath: string; guideLabel: string; intro: string;
  pricing: string[]; questions: string[]; coverages: PageContent["coverages"];
  facts: Fact[]; faqs: PageContent["faqs"]; stateProfiles: Record<string, ServiceProfile>;
};
export const INSURANCE_SERVICES: InsuranceService[] = [
  {
    "slug": "pool-service",
    "name": "Pool Service & Cleaning",
    "noun": "pool service business",
    "intakeLabel": "Pool cleaning and maintenance",
    "parentSlug": "pool",
    "operationsPrompt": "For example: weekly cleaning, chemicals, equipment repairs, resurfacing or construction. Tell us what you actually do.",
    "guidePath": "/guides/pool-construction-vs-maintenance-insurance",
    "guideLabel": "Compare pool maintenance, repairs and construction",
    "intro": "Clean and maintain swimming pools? Describe your route, chemical treatments, equipment servicing and any repair work. We’ll review the actual services before requesting insurance, including work at homes, apartments, hotels or other facilities.",
    "pricing": [
      "A maintenance route needs different quote inputs from a pool builder. Separate recurring cleaning from repairs, equipment installation, resurfacing and structural work; include each service even when it is occasional.",
      "Prepare receipts, payroll, subcontractor spend, customer types, claims and requested limits. Compare accepted operations, deductibles, fees and exclusions alongside price. Your price depends on those details and the policy offered."
    ],
    "questions": [
      "Do you only clean and balance chemicals, or also repair or install equipment?",
      "Are customers homeowners, apartments, hotels, HOAs or public facilities?",
      "Do you drain or acid-wash pools, replace liners or resurface shells?",
      "What are your receipts, payroll, hired-business costs and claims history?"
    ],
    "coverages": [
      {
        "name": "Service liability and customer property",
        "desc": "Review chemical damage, equipment damage and property being serviced. Ask about pollution, faulty-work and care/custody/control exclusions instead of assuming the GL limit covers every loss."
      },
      {
        "name": "Equipment, crews and route vehicles",
        "desc": "Discuss tools carried between stops, stored chemicals, business vehicles and worker coverage. Include hired technicians and their responsibilities."
      },
      {
        "name": "Repairs and installation",
        "desc": "Describe pumps, filters, heaters, plumbing and electrical tasks. Confirm both applicable credentials and insurer acceptance before expanding a cleaning route into installation."
      }
    ],
    "facts": [
      {
        "title": "Service and construction are distinct quote scopes",
        "body": "Pool cleaning has dedicated coverage offerings, but that does not establish eligibility for excavation, new shells or gunite installation. Disclose repairs and construction separately and review the insurer’s actual terms.",
        "source": {
          "label": "Thimble: pool service and cleaning insurance",
          "href": "https://www.thimble.com/industry/contractors-business-insurance/pool-cleaner"
        }
      }
    ],
    "faqs": [
      {
        "q": "Can I use pool-cleaning insurance for new construction?",
        "a": "Only if the insurer has reviewed and accepted the actual construction work. A maintenance description alone is not evidence of coverage for excavation or shell installation."
      },
      {
        "q": "Does a maintenance policy automatically cover chemical damage?",
        "a": "No. Review the circumstances and any pollution, work-product or customer-property limitations in the policy. Explain storage, application and the equipment you service."
      },
      {
        "q": "Should I include work performed by a hired technician?",
        "a": "Yes. Provide the tasks, costs and subcontractor arrangements, even when your own business has no W2 employees."
      }
    ],
    "stateProfiles": {
      "texas": {
        "intro": "Texas pool-service routes can combine regular cleaning, chemical treatment and equipment calls. Separate those tasks from construction and describe the properties served, the technicians involved and any repair subcontractors.",
        "facts": [
          {
            "title": "Separate taxable maintenance from the insurance quote",
            "body": "Texas lists swimming pool maintenance among taxable services, including residential work. Check invoicing and any applicable exemptions with the Comptroller; tax treatment does not establish insurance coverage.",
            "source": {
              "label": "Texas Comptroller: cleaning and janitorial services",
              "href": "https://comptroller.texas.gov/taxes/publications/94-111.php"
            }
          },
          {
            "title": "Review worker coverage and customer contracts",
            "body": "Most Texas private employers may choose whether to carry workers’ compensation, but exceptions and reporting obligations apply. Government work and customer contracts need separate review.",
            "source": {
              "label": "Texas Department of Insurance: workers’ compensation guide",
              "href": "https://www.tdi.texas.gov/pubs/consumer/cb030.html"
            }
          },
          {
            "title": "Prepare a route-and-repair breakdown",
            "body": "For a route that also takes pump or heater calls, identify which business performs each task and which jobs need a licensed specialist. Include the value of equipment in your care and the largest repair."
          }
        ],
        "questions": [
          "Are recurring cleaning and one-off repairs recorded separately?",
          "Do you work under HOA, apartment or hotel vendor contracts?"
        ],
        "faq": {
          "q": "Is Texas pool maintenance treated like an untaxed household favor?",
          "a": "The Comptroller identifies pool maintenance as a taxable service. Review your own situation, invoicing and exemptions against its guidance."
        }
      },
      "florida": {
        "intro": "Florida pool cleaning, equipment servicing and new construction should be described separately. Tell us whether you handle residential routes, commercial facilities, replacement equipment or structural repairs before comparing coverage.",
        "facts": [
          {
            "title": "Confirm credentials when cleaning becomes equipment work",
            "body": "Florida DBPR distinguishes pool construction, servicing and specialty license scopes. Check the exact task before replacing equipment or taking structural work; do not use a routine-cleaning description to cover every service.",
            "source": {
              "label": "Florida DBPR: pool and construction licensing FAQ",
              "href": "https://www2.myfloridalicense.com/construction-industry/faqs/"
            }
          },
          {
            "title": "Check the correct worker-coverage category",
            "body": "Florida uses different construction and non-construction workers’ compensation rules. Confirm classification, worker counts, ownership and exemptions before assuming a small crew is exempt.",
            "source": {
              "label": "Florida DFS: employer coverage requirements",
              "href": "https://myfloridacfo.com/division/wc/employer/coverage-requirements"
            }
          },
          {
            "title": "Review the facility’s operating responsibilities",
            "body": "A hotel or shared pool can assign responsibilities beyond a homeowner’s weekly cleaning contract. Identify who monitors the water, keeps records, closes the pool and handles equipment faults; verify the facility rules with the responsible health authority."
          }
        ],
        "questions": [
          "Do contracts include facility operation or only scheduled cleaning?",
          "Who performs pump, heater, electrical and plumbing work?"
        ],
        "faq": {
          "q": "Does a pool-service policy automatically include structural repairs?",
          "a": "No. Disclose the repair and check both the licensed scope and policy acceptance. Structural work is not established by the words pool service."
        }
      },
      "arizona": {
        "intro": "An Arizona pool route may involve cleaning, minor servicing and calls to repair equipment. Describe those activities separately from replastering, complete surface replacement and new pool construction.",
        "facts": [
          {
            "title": "R-6 has a limited service-and-repair scope",
            "body": "Arizona ROC’s R-6 classification covers service and minor repair with specific exclusions, including complete replacement of plaster or pebble interiors and decks. Confirm the applicable classification before selling a larger renovation.",
            "source": {
              "label": "Arizona ROC: license classifications",
              "href": "https://roc.az.gov/license-classifications"
            }
          },
          {
            "title": "Review your staffing with the Arizona employer resources",
            "body": "Use the Industrial Commission’s employer guidance to check worker coverage and compliance. Describe employees, owners and hired businesses separately; paying a helper as a subcontractor does not settle the working relationship.",
            "source": {
              "label": "Industrial Commission of Arizona: employer resources",
              "href": "https://www.azica.gov/employers-0"
            }
          },
          {
            "title": "List drainage and surface treatments explicitly",
            "body": "If a route includes draining, acid washing or repairs to existing equipment, explain the methods and the property involved. Ask how the quote addresses damage to the pool shell and other property under your control."
          }
        ],
        "questions": [
          "Do you replace full surfaces or only clean and perform minor repairs?",
          "Who accepts responsibility for equipment while it is removed or serviced?"
        ],
        "faq": {
          "q": "Does an R-6 credential establish authority for a full pool renovation?",
          "a": "No. ROC’s published scope is limited. Review the exact work, classification and insurance terms before accepting the job."
        }
      },
      "north-carolina": {
        "intro": "North Carolina pool-service work may be a homeowner route or a contract for a shared facility. Explain cleaning, seasonal opening or closing, equipment work and any responsibility for operating a public pool.",
        "facts": [
          {
            "title": "Public-pool operations have specific responsibilities",
            "body": "North Carolina’s public-pool rules address trained operation, maintenance and record keeping. Check which duties the owner assigns to your business; a residential cleaning agreement does not establish compliance for a public facility.",
            "source": {
              "label": "NC DHHS: public swimming pool rules",
              "href": "https://www.dph.ncdhhs.gov/media/1809/open"
            }
          },
          {
            "title": "Count workers and review subcontracting",
            "body": "North Carolina generally requires coverage at three employees, with entity-specific counting and exceptions. Subcontracting can create additional responsibilities; check the Industrial Commission’s employer guidance.",
            "source": {
              "label": "North Carolina Industrial Commission: employers",
              "href": "https://www.ic.nc.gov/workers-compensation-claims/employers"
            }
          },
          {
            "title": "Document seasonal and repair services",
            "body": "Include openings, closings, equipment removal and stored customer items if performed. Record who will restart and inspect the equipment and which repairs are hired out."
          }
        ],
        "questions": [
          "Are you responsible for operating a public pool or only providing a service visit?",
          "Do you provide seasonal opening/closing or equipment replacement?"
        ],
        "faq": {
          "q": "Are homeowner routes and public-pool operation the same submission?",
          "a": "No. Describe the facility and your contractual duties. Public-pool rules and the scope accepted by an insurer need separate review."
        }
      },
      "georgia": {
        "intro": "For Georgia pool-service insurance, identify private-home routes, shared pools and public-facility contracts. Include chemical treatment, equipment tasks and any role in daily pool operation or record keeping.",
        "facts": [
          {
            "title": "Public pools have state and local health oversight",
            "body": "Georgia DPH and county health authorities regulate public-pool operation, maintenance and construction. Use the current operator guidance and confirm the facility category; do not apply a private-home maintenance checklist to every pool.",
            "source": {
              "label": "Georgia DPH: swimming pools and operator guidance",
              "href": "https://dph.georgia.gov/environmental-health/pools"
            }
          },
          {
            "title": "Include regular part-time staff in the review",
            "body": "Georgia’s Board says businesses regularly employing three or more people generally need coverage; regular part-time staff and corporate officers or LLC members affect the count.",
            "source": {
              "label": "Georgia SBWC: workers’ compensation insurance FAQ",
              "href": "https://sbwc.georgia.gov/frequently-asked-questions/workers-compensation-insurance-faqs"
            }
          },
          {
            "title": "Separate the owner’s duties from the service contract",
            "body": "Write down who keeps operational records, orders repairs, controls access and responds to water-quality issues. Send the contract for coverage review rather than describing all duties as pool cleaning."
          }
        ],
        "questions": [
          "Which operational duties does the facility delegate to you?",
          "Do you hire part-time technicians or subcontract repairs?"
        ],
        "faq": {
          "q": "Does having a pool operator credential prove insurance coverage?",
          "a": "No. Credentials and facility compliance do not change policy exclusions. Review the work, limits and conditions separately."
        }
      }
    }
  },
  {
    "slug": "house-cleaning",
    "name": "House Cleaning & Maid Service",
    "noun": "house cleaning business",
    "intakeLabel": "House cleaning / maid service",
    "parentSlug": "cleaning",
    "operationsPrompt": "For example: regular home cleaning, move-outs, short-term rentals, windows or specialist cleaning.",
    "guidePath": "/guides/cleaning-insurance-customer-property-damage",
    "guideLabel": "Check coverage for property you clean",
    "intro": "Clean homes, apartments or short-term rentals? Tell us what you clean, the products and methods used, and who enters the property. A useful quote should address the customer’s belongings and surfaces as well as the liability limit.",
    "pricing": [
      "Prepare annual receipts, payroll, hired-cleaner costs, customer types and claims. Separate routine housekeeping from carpet treatment, elevated windows, post-construction work or specialist remediation.",
      "Compare customer-property wording, any sublimit and deductible, exclusions for poor work, key-related protection and requested limits. A lower GL premium is not a like-for-like comparison if the property you clean has different protection."
    ],
    "questions": [
      "Do you clean occupied homes, move-outs, short-term rentals or a mix?",
      "Which surfaces, products and equipment do you use?",
      "Are cleaners employees or hired businesses, and who holds customer keys?",
      "Do jobs include windows at height, construction dust or specialist remediation?"
    ],
    "coverages": [
      {
        "name": "Accidental damage to customers’ property",
        "desc": "Ask specifically about the item or surface being cleaned, property in your care and any customer-property extension. Confirm sublimits and exclusions."
      },
      {
        "name": "People, keys and trust requirements",
        "desc": "Review employee injuries separately from GL. Ask about lost keys, theft-related requirements and any bond the customer requests; these are not interchangeable protections."
      },
      {
        "name": "Tools and travel",
        "desc": "Discuss equipment used between homes and business driving, including customer property transported for cleaning."
      }
    ],
    "facts": [
      {
        "title": "Compare the property-damage wording, not just the GL limit",
        "body": "A cleaner can damage a countertop, floor finish or customer’s belongings without the whole loss fitting the headline liability limit. Ask to see any customer-property extension and its restrictions. The coverage guide below includes a specific proposal example, not a rule for every carrier."
      },
      {
        "title": "A bond, certificate and policy do different jobs",
        "body": "Ask what the customer needs before buying a bond or requesting a certificate. A certificate does not add coverage, and a janitorial bond is not a replacement for reviewing accidental property-damage coverage."
      }
    ],
    "faqs": [
      {
        "q": "Does general liability cover damage to the surface I clean?",
        "a": "Do not assume so. Damage to property being worked on or under your care can have exclusions or a separate extension with a lower limit. Ask about the actual surface, cleaning method, deductible, sublimit and poor-workmanship wording."
      },
      {
        "q": "Does a janitorial bond replace liability insurance?",
        "a": "No. Ask what the particular bond covers and what the customer requires. A bond is not a substitute for accidental property-damage coverage."
      },
      {
        "q": "Can I add short-term-rental turnovers to a household cleaning quote?",
        "a": "Disclose the turnovers, access arrangements, laundry or property handling and any work outside normal cleaning so the insurer can review it."
      }
    ],
    "stateProfiles": {
      "texas": {
        "intro": "Texas house-cleaning businesses should separate recurring maid service, move-outs and rental turnovers. Include surfaces, keys and hired cleaners in the quote, and check how your invoices handle taxable cleaning services.",
        "facts": [
          {
            "title": "Check tax treatment when setting household-cleaning prices",
            "body": "The Texas Comptroller identifies maid and household-cleaning services as taxable, subject to applicable exceptions. Check the specific business arrangement and invoicing; this is separate from coverage.",
            "source": {
              "label": "Texas Comptroller: cleaning and janitorial services",
              "href": "https://comptroller.texas.gov/taxes/publications/94-111.php"
            }
          },
          {
            "title": "Review worker coverage and customer contracts",
            "body": "Most Texas private employers may choose whether to carry workers’ compensation, but exceptions and reporting obligations apply. Government work and customer contracts need separate review.",
            "source": {
              "label": "Texas Department of Insurance: workers’ compensation guide",
              "href": "https://www.tdi.texas.gov/pubs/consumer/cb030.html"
            }
          },
          {
            "title": "Prepare a scope for the actual household job",
            "body": "For a move-out cleaning, list appliances, delicate surfaces, any items moved and the handover of keys. Photograph pre-existing damage with permission and keep the agreed task list."
          }
        ],
        "questions": [
          "Do move-out jobs include appliances, damaged surfaces or items moved off site?",
          "What customer-property exclusions, sublimits and deductibles appear in the quote?"
        ],
        "faq": {
          "q": "What should I prepare for a Texas house-cleaning quote?",
          "a": "Send the service menu, receipts, payroll, hired-cleaner costs, claims and any customer insurance requirements. Identify delicate surfaces, access arrangements and occasional specialist work."
        }
      },
      "florida": {
        "intro": "Florida house cleaners may serve occupied homes and vacation-rental turnovers with different access and scheduling arrangements. Tell us who enters the property, which belongings are handled and whether you also clean commercial interiors.",
        "facts": [
          {
            "title": "Separate household cleaning from commercial-service tax questions",
            "body": "Florida Revenue’s cleaning guidance addresses taxable nonresidential cleaning and exclusions. If you serve both homes and business premises, review the actual services and property type rather than applying one invoice treatment to everything.",
            "source": {
              "label": "Florida Revenue: cleaning-service tax guidance",
              "href": "https://floridarevenue.com/Forms_library/current/brochure/gt800015.pdf"
            }
          },
          {
            "title": "Check the correct worker-coverage category",
            "body": "Florida uses different construction and non-construction workers’ compensation rules. Confirm classification, worker counts, ownership and exemptions before assuming a small crew is exempt.",
            "source": {
              "label": "Florida DFS: employer coverage requirements",
              "href": "https://myfloridacfo.com/division/wc/employer/coverage-requirements"
            }
          },
          {
            "title": "Prepare a scope for the actual household job",
            "body": "For a rental turnover, document owner-supplied products, linens, keys, access codes and any responsibility for reporting damage. Laundry or maintenance tasks should appear in the scope if you perform them."
          }
        ],
        "questions": [
          "Do you handle owner property, linens or maintenance during rental turnovers?",
          "What customer-property exclusions, sublimits and deductibles appear in the quote?"
        ],
        "faq": {
          "q": "What should I prepare for a Florida house-cleaning quote?",
          "a": "Send the service menu, receipts, payroll, hired-cleaner costs, claims and any customer insurance requirements. Identify delicate surfaces, access arrangements and occasional specialist work."
        }
      },
      "arizona": {
        "intro": "Arizona housekeeping quotes should distinguish ordinary home cleaning from surface restoration, high windows and other specialist tasks. Describe delicate stone, glass or appliances you work on and the staffing used for each job.",
        "facts": [
          {
            "title": "Review your staffing with the Arizona employer resources",
            "body": "Use the Industrial Commission’s employer guidance to check worker coverage and compliance. Describe employees, owners and hired businesses separately; paying a helper as a subcontractor does not settle the working relationship.",
            "source": {
              "label": "Industrial Commission of Arizona: employer resources",
              "href": "https://www.azica.gov/employers-0"
            }
          },
          {
            "title": "Prepare a scope for the actual household job",
            "body": "For a home with natural-stone floors, identify the products and machines used and ask about damage to the surface itself. Restoring an etched finish is not automatically treated like damage to an unrelated item."
          }
        ],
        "questions": [
          "Do services include stone polishing, exterior windows or other specialist work?",
          "What customer-property exclusions, sublimits and deductibles appear in the quote?"
        ],
        "faq": {
          "q": "What should I prepare for a Arizona house-cleaning quote?",
          "a": "Send the service menu, receipts, payroll, hired-cleaner costs, claims and any customer insurance requirements. Identify delicate surfaces, access arrangements and occasional specialist work."
        }
      },
      "north-carolina": {
        "intro": "For a North Carolina home-cleaning quote, describe recurring visits, move-ins or move-outs and any hired cleaners. Include the homes and contents you work on, access arrangements and occasional tasks beyond basic housekeeping.",
        "facts": [
          {
            "title": "Count workers and review subcontracting",
            "body": "North Carolina generally requires coverage at three employees, with entity-specific counting and exceptions. Subcontracting can create additional responsibilities; check the Industrial Commission’s employer guidance.",
            "source": {
              "label": "North Carolina Industrial Commission: employers",
              "href": "https://www.ic.nc.gov/workers-compensation-claims/employers"
            }
          },
          {
            "title": "Prepare a scope for the actual household job",
            "body": "For a move-in clean after remodeling, distinguish ordinary dust removal from ongoing construction, hazardous debris and remediation. Tell the insurer if your role changes from maid service to construction cleanup."
          }
        ],
        "questions": [
          "Do you take post-renovation cleans, and what materials or hazards remain?",
          "What customer-property exclusions, sublimits and deductibles appear in the quote?"
        ],
        "faq": {
          "q": "What should I prepare for a North Carolina house-cleaning quote?",
          "a": "Send the service menu, receipts, payroll, hired-cleaner costs, claims and any customer insurance requirements. Identify delicate surfaces, access arrangements and occasional specialist work."
        }
      },
      "georgia": {
        "intro": "Georgia home-cleaning businesses should describe regular visits, larger cleanouts, rental turnovers and their crew arrangements. Include part-time staff and independent cleaning businesses when preparing the coverage review.",
        "facts": [
          {
            "title": "Include regular part-time staff in the review",
            "body": "Georgia’s Board says businesses regularly employing three or more people generally need coverage; regular part-time staff and corporate officers or LLC members affect the count.",
            "source": {
              "label": "Georgia SBWC: workers’ compensation insurance FAQ",
              "href": "https://sbwc.georgia.gov/frequently-asked-questions/workers-compensation-insurance-faqs"
            }
          },
          {
            "title": "Prepare a scope for the actual household job",
            "body": "For a regular route, list who has access to keys or alarm codes, how substitute cleaners are assigned and whether the customer contracts with you or another business. Submit that arrangement with receipts and payroll."
          }
        ],
        "questions": [
          "Who contracts with the homeowner and controls access when cleaners change?",
          "What customer-property exclusions, sublimits and deductibles appear in the quote?"
        ],
        "faq": {
          "q": "What should I prepare for a Georgia house-cleaning quote?",
          "a": "Send the service menu, receipts, payroll, hired-cleaner costs, claims and any customer insurance requirements. Identify delicate surfaces, access arrangements and occasional specialist work."
        }
      }
    }
  },
  {
    "slug": "commercial-cleaning",
    "name": "Commercial Cleaning & Janitorial",
    "noun": "commercial cleaning business",
    "intakeLabel": "Commercial cleaning / janitorial",
    "parentSlug": "cleaning",
    "operationsPrompt": "For example: offices, retail, restaurants, healthcare, floor care or post-construction cleanup.",
    "guidePath": "/guides/cleaning-insurance-customer-property-damage",
    "guideLabel": "Review cleaning-related customer-property damage",
    "intro": "Clean offices, stores or other commercial premises? Start with the buildings, floor-care methods, after-hours access and contract requirements. Include construction cleanup or specialist facilities explicitly rather than treating every job as office janitorial work.",
    "pricing": [
      "Prepare receipts, payroll, subcontractor costs, building types, methods and claims. Describe stripping or waxing floors, elevated windows, food-service premises, healthcare work and post-construction cleanup if performed.",
      "Send the customer’s insurance exhibit before comparing prices. Check accepted operations, property-damage restrictions, additional insured wording, worker coverage, fees and deductibles. Contractual requirements are not automatically met by a generic certificate."
    ],
    "questions": [
      "Which facilities do you clean, and is any work medical, industrial or post-construction?",
      "Do you strip/wax floors, work at height, pressure-wash or handle hazardous debris?",
      "Who provides staff and holds keys or alarm codes?",
      "What limits, endorsements, bonds or other evidence does the customer request?"
    ],
    "coverages": [
      {
        "name": "Janitorial liability and customer property",
        "desc": "Review accidental damage, property being cleaned and customer-property extensions, including any lower limits or faulty-work exclusions."
      },
      {
        "name": "Vendor contracts and hired crews",
        "desc": "Review additional insured requests, waivers and subcontractor conditions alongside worker coverage. A COI alone does not add endorsements."
      },
      {
        "name": "Equipment and specialist jobs",
        "desc": "Discuss machines, business vehicles and any construction cleanup, hazardous materials, biohazards or remediation. Do not assume ordinary janitorial acceptance extends to those tasks."
      }
    ],
    "facts": [
      {
        "title": "Compare the property-damage wording, not just the GL limit",
        "body": "A cleaner can damage a countertop, floor finish or customer’s belongings without the whole loss fitting the headline liability limit. Ask to see any customer-property extension and its restrictions. The coverage guide below includes a specific proposal example, not a rule for every carrier."
      },
      {
        "title": "A bond, certificate and policy do different jobs",
        "body": "Ask what the customer needs before buying a bond or requesting a certificate. A certificate does not add coverage, and a janitorial bond is not a replacement for reviewing accidental property-damage coverage."
      },
      {
        "title": "Keep post-construction cleanup separate in the scope",
        "body": "State whether construction is complete, which trades remain on site, the debris to remove, access equipment and who controls the premises. Ordinary dust removal, hazardous-material cleanup and repair work should not be described as the same operation."
      }
    ],
    "faqs": [
      {
        "q": "Does general liability cover damage to the surface I clean?",
        "a": "Do not assume so. Damage to property being worked on or under your care can have exclusions or a separate extension with a lower limit. Ask about the actual surface, cleaning method, deductible, sublimit and poor-workmanship wording."
      },
      {
        "q": "Does an office-cleaning quote cover post-construction cleanup?",
        "a": "Do not assume so. Describe the condition of the site, debris, methods and any work at height or remediation, then ask the insurer to confirm acceptance."
      },
      {
        "q": "Does a $1 million COI prove my vendor contract is satisfied?",
        "a": "No. The contract may require particular endorsements or other policies, and exclusions still apply. Have the insurance exhibit reviewed before presenting evidence."
      }
    ],
    "stateProfiles": {
      "texas": {
        "intro": "Texas janitorial contracts can combine office interiors, floor care and other property services. Itemize the work, review tax treatment and send the customer’s vendor requirements with the insurance request.",
        "facts": [
          {
            "title": "Include tax treatment in the commercial bid",
            "body": "Texas identifies janitorial and custodial cleaning as taxable services. Review exemptions or resale arrangements where applicable; the tax rule is distinct from liability coverage and the customer’s insurance exhibit.",
            "source": {
              "label": "Texas Comptroller: cleaning and janitorial services",
              "href": "https://comptroller.texas.gov/taxes/publications/94-111.php"
            }
          },
          {
            "title": "Review worker coverage and customer contracts",
            "body": "Most Texas private employers may choose whether to carry workers’ compensation, but exceptions and reporting obligations apply. Government work and customer contracts need separate review.",
            "source": {
              "label": "Texas Department of Insurance: workers’ compensation guide",
              "href": "https://www.tdi.texas.gov/pubs/consumer/cb030.html"
            }
          },
          {
            "title": "Turn the vendor contract into a quote checklist",
            "body": "For an office contract that includes floor stripping, identify products, machines and who controls access while floors are wet. Ask about damage to the floor finish itself and requirements for additional insured status."
          }
        ],
        "questions": [
          "Does the contract include floor stripping, exterior work or maintenance beyond cleaning?",
          "Which customer-property terms and endorsements does the contract require?"
        ],
        "faq": {
          "q": "What should a Texas janitorial business send for review?",
          "a": "Send the facility list, cleaning methods, receipts, payroll, subcontractor costs, claims and customer insurance exhibit. Identify post-construction work or specialist hazards separately."
        }
      },
      "florida": {
        "intro": "Florida commercial-cleaning quotes need the facility types, floor-care methods, access arrangements and exact vendor insurance requirements. Keep office cleaning, restaurant work and specialist facilities distinct in the submission.",
        "facts": [
          {
            "title": "Review nonresidential cleaning tax and its exclusions",
            "body": "Florida Revenue identifies taxable interior nonresidential cleaning services and exclusions in its cleaning guidance. Check the service actually sold and resale documentation before treating all cleaning invoices alike.",
            "source": {
              "label": "Florida Revenue: cleaning-service tax guidance",
              "href": "https://floridarevenue.com/Forms_library/current/brochure/gt800015.pdf"
            }
          },
          {
            "title": "Check the correct worker-coverage category",
            "body": "Florida uses different construction and non-construction workers’ compensation rules. Confirm classification, worker counts, ownership and exemptions before assuming a small crew is exempt.",
            "source": {
              "label": "Florida DFS: employer coverage requirements",
              "href": "https://myfloridacfo.com/division/wc/employer/coverage-requirements"
            }
          },
          {
            "title": "Turn the vendor contract into a quote checklist",
            "body": "For a retail closing shift, describe floor care, ladders, glass and entry-control responsibilities. If you also take restaurant kitchens or medical facilities, name them rather than calling everything office cleaning."
          }
        ],
        "questions": [
          "Are sites offices, stores, kitchens, medical facilities or a combination?",
          "Which customer-property terms and endorsements does the contract require?"
        ],
        "faq": {
          "q": "What should a Florida janitorial business send for review?",
          "a": "Send the facility list, cleaning methods, receipts, payroll, subcontractor costs, claims and customer insurance exhibit. Identify post-construction work or specialist hazards separately."
        }
      },
      "arizona": {
        "intro": "Arizona janitorial businesses may clean offices, retail premises and sites being handed over after construction. Explain the condition of each site, equipment used, access responsibilities and any work hired out.",
        "facts": [
          {
            "title": "Review your staffing with the Arizona employer resources",
            "body": "Use the Industrial Commission’s employer guidance to check worker coverage and compliance. Describe employees, owners and hired businesses separately; paying a helper as a subcontractor does not settle the working relationship.",
            "source": {
              "label": "Industrial Commission of Arizona: employer resources",
              "href": "https://www.azica.gov/employers-0"
            }
          },
          {
            "title": "Turn the vendor contract into a quote checklist",
            "body": "For a new commercial tenant’s cleanup, state whether trades remain on site and whether the job involves dust removal, high glass or construction debris. Confirm responsibility for newly installed finishes before working on them."
          }
        ],
        "questions": [
          "Is the post-construction site complete and clear, or are other trades still working?",
          "Which customer-property terms and endorsements does the contract require?"
        ],
        "faq": {
          "q": "What should a Arizona janitorial business send for review?",
          "a": "Send the facility list, cleaning methods, receipts, payroll, subcontractor costs, claims and customer insurance exhibit. Identify post-construction work or specialist hazards separately."
        }
      },
      "north-carolina": {
        "intro": "North Carolina commercial-cleaning contractors should describe the premises, shift schedules and employee or subcontractor arrangements. A recurring office contract and a construction cleanup can need different policy reviews.",
        "facts": [
          {
            "title": "Count workers and review subcontracting",
            "body": "North Carolina generally requires coverage at three employees, with entity-specific counting and exceptions. Subcontracting can create additional responsibilities; check the Industrial Commission’s employer guidance.",
            "source": {
              "label": "North Carolina Industrial Commission: employers",
              "href": "https://www.ic.nc.gov/workers-compensation-claims/employers"
            }
          },
          {
            "title": "Turn the vendor contract into a quote checklist",
            "body": "For a subcontracted cleaning contract, document which business hires the workers, the facilities each crew enters and the insurance requirements passed down to them. Include both payroll and subcontractor spend accurately."
          }
        ],
        "questions": [
          "Do you staff the contract directly or subcontract part of it?",
          "Which customer-property terms and endorsements does the contract require?"
        ],
        "faq": {
          "q": "What should a North Carolina janitorial business send for review?",
          "a": "Send the facility list, cleaning methods, receipts, payroll, subcontractor costs, claims and customer insurance exhibit. Identify post-construction work or specialist hazards separately."
        }
      },
      "georgia": {
        "intro": "Georgia janitorial teams should include regular part-time crews, substitute workers and specialist sites in their coverage review. Provide the customer’s insurance exhibit with the cleaning methods and contract scope.",
        "facts": [
          {
            "title": "Include regular part-time staff in the review",
            "body": "Georgia’s Board says businesses regularly employing three or more people generally need coverage; regular part-time staff and corporate officers or LLC members affect the count.",
            "source": {
              "label": "Georgia SBWC: workers’ compensation insurance FAQ",
              "href": "https://sbwc.georgia.gov/frequently-asked-questions/workers-compensation-insurance-faqs"
            }
          },
          {
            "title": "Turn the vendor contract into a quote checklist",
            "body": "For a multi-site office contract, identify every type of premises, after-hours access and whether crews also serve kitchens or clinical areas. Track the work and staffing by location without treating the contract’s title as a full operations description."
          }
        ],
        "questions": [
          "Do your teams rotate between ordinary offices and specialist facilities?",
          "Which customer-property terms and endorsements does the contract require?"
        ],
        "faq": {
          "q": "What should a Georgia janitorial business send for review?",
          "a": "Send the facility list, cleaning methods, receipts, payroll, subcontractor costs, claims and customer insurance exhibit. Identify post-construction work or specialist hazards separately."
        }
      }
    }
  }
];

export function getInsuranceService(slug: string): InsuranceService | undefined {
  return INSURANCE_SERVICES.find(s => s.slug === slug);
}
export function serviceStateLinks(service: InsuranceService) {
  return Object.keys(service.stateProfiles).map(state => ({ label: SERVICE_STATE_NAMES[state], href: `/insurance/${service.slug}/${state}` }));
}
export const SERVICE_PATHS = INSURANCE_SERVICES.flatMap(service => [
  `/insurance/${service.slug}`, ...serviceStateLinks(service).map(link => link.href),
]);
export function serviceContent(slug: string, state?: string): PageContent | undefined {
  const service = getInsuranceService(slug);
  if (!service || (state && !Object.hasOwn(service.stateProfiles, state))) return undefined;
  const profile = state ? service.stateProfiles[state] : undefined;
  const where = state ? ` in ${SERVICE_STATE_NAMES[state]}` : "";
  return {
    title: `${service.name} Insurance${where}: Coverage & Quotes`,
    metaDescription: `Review ${service.name.toLowerCase()} insurance${where}, customer-property coverage, job details and quote requirements.`,
    heroH1: `${service.name} Insurance${where}`,
    heroSub: profile?.intro ?? service.intro,
    costNarrative: service.pricing,
    costDisclaimer: "Coverage and price depend on your operations and the policy offered. Request a quote for your own business.",
    reviewedOn: SERVICE_UPDATED,
    costRows: [
      { coverage: "General liability", range: "Individual quote", note: "Review accepted services, limits, deductibles and exclusions." },
      { coverage: "Customer-property protection", range: "Check the wording", note: "Ask about property being worked on, extensions, sublimits and poor-workmanship exclusions." },
      { coverage: "Workers, vehicles and equipment", range: "Separate review", note: "Match staffing, business travel and equipment to the appropriate coverage." },
    ],
    priceDrivers: [...(profile?.questions ?? []), ...service.questions],
    coverages: service.coverages,
    stateFacts: [...(profile?.facts ?? []), ...service.facts],
    faqs: [...(profile ? [profile.faq] : []), ...service.faqs],
  };
}

// Structured route identity avoids matching pool-service as if it were pool construction.
export function relatedServiceLinks(tradeSlug?: string, stateSlug?: string) {
  if (!tradeSlug) return [];
  const current = getInsuranceService(tradeSlug);
  const family = current?.parentSlug ?? tradeSlug;
  const peers = INSURANCE_SERVICES.filter(s => s.parentSlug === family && s.slug !== tradeSlug);
  const links = peers.map(service => ({
    label: `${service.name} insurance`,
    href: `/insurance/${service.slug}${stateSlug && Object.hasOwn(service.stateProfiles, stateSlug) ? `/${stateSlug}` : ""}`,
  }));
  if (current) {
    links.unshift({ label: family === "pool" ? "Pool construction and installation insurance" : "All cleaning business insurance", href: `/insurance/${family}${stateSlug ? `/${stateSlug}` : ""}` });
    links.push({ label: current.guideLabel, href: current.guidePath });
  }
  return links;
}
