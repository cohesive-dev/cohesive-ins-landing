import type { RestaurantGuide } from "./restaurant";

export const BUYING_RESOURCES: RestaurantGuide[] = [
  {
    "slug": "contractor-certificate-of-insurance-before-starting-work",
    "title": "Customer needs a COI before you start? A contractor’s checklist",
    "description": "Prepare the certificate holder, contract and required endorsements before a job starts. Understand what a COI shows, what it cannot change and what can delay acceptance.",
    "intro": "Prepare the certificate holder, contract and required endorsements before a job starts. Understand what a COI shows, what it cannot change and what can delay acceptance.",
    "category": "Buying insurance",
    "industry": "Contractors",
    "tradeLabel": "General contractor",
    "insurancePath": "/insurance/general-contractor",
    "quoteKind": "service",
    "updatedAt": "2026-09-14",
    "nationalSlug": "contractor-quote-checklists",
    "sections": [
      {
        "id": "first-check",
        "title": "Do you already have the right policy?",
        "paragraphs": [
          "A customer asking for a certificate of insurance is asking for evidence. If you already have coverage, send the request to the agent servicing that policy. If you do not, arrange an appropriate policy before asking for a certificate. A quote or application is not proof that coverage is in force.",
          "Tell the agent when the job starts and send the customer’s written insurance requirements. A same-day deadline does not make an excluded operation covered or guarantee that a new policy can be issued in time."
        ],
        "checklist": [
          "Policy number, named insured and current effective dates, if already insured.",
          "Job description, location and actual start date.",
          "Customer’s insurance exhibit or the complete relevant contract section."
        ]
      },
      {
        "id": "holder",
        "title": "What information belongs in the request?",
        "paragraphs": [
          "Provide the certificate holder’s exact legal name and address, the delivery email and the job or contract reference. Do not substitute the property manager’s brand name for the legal entity the contract specifies. If several parties request protection, identify each party and its role."
        ],
        "checklist": [
          "Certificate holder: legal name, address and recipient email.",
          "Required lines of insurance, limits and effective dates.",
          "Additional-insured requirements, including ongoing or completed operations.",
          "Any waiver of subrogation, primary/noncontributory or cancellation-notice request."
        ],
        "links": [
          {
            "label": "Download the blank COI request checklist",
            "href": "/checklists/contractor-coi-request.txt"
          }
        ]
      },
      {
        "id": "endorsements",
        "title": "Does naming the customer make it an additional insured?",
        "paragraphs": [
          "No. A certificate holder and an additional insured are different roles. Additional-insured protection comes from applicable policy wording or endorsements, and any conditions must be met. Ask the agent to identify the relevant endorsement rather than assuming that a name typed onto a certificate creates coverage.",
          "Texas insurance guidance expressly distinguishes a certificate from a change to the policy. Other jurisdictions have their own rules; the practical step is to compare the contract with the actual policy and obtain any necessary insurer approval."
        ],
        "links": [
          {
            "label": "Texas Department of Insurance: certificate questions",
            "href": "https://www.tdi.texas.gov/certificates/faq.html"
          }
        ]
      },
      {
        "id": "delays",
        "title": "What can delay a certificate or make a customer reject it?",
        "paragraphs": [
          "Common issues to resolve include mismatched legal names, expired policy dates, a missing line of insurance, requested endorsements that are not in place, and a job outside the accepted operations. An agent may need underwriting approval for a change. Sending the full request early helps reveal those gaps before mobilization.",
          "A customer’s acceptance of the certificate does not remove policy exclusions. Keep the policy and endorsements with the contract and ask for clarification when the work changes."
        ],
        "checklist": [
          "Confirm the customer received the document and identify any remaining requirement.",
          "Retain the issued certificate and applicable endorsements.",
          "Do not promise coverage or alter the certificate yourself."
        ]
      }
    ]
  },
  {
    "slug": "new-contractor-insurance-no-employees",
    "title": "New contractor insurance with no employees: what to prepare",
    "description": "Starting with no insurance history or using only subcontractors? Prepare honest estimates, describe the actual work and separate employee payroll from subcontractor spending.",
    "intro": "Starting with no insurance history or using only subcontractors? Prepare honest estimates, describe the actual work and separate employee payroll from subcontractor spending.",
    "category": "Buying insurance",
    "industry": "Contractors",
    "tradeLabel": "General contractor",
    "insurancePath": "/insurance/general-contractor",
    "quoteKind": "service",
    "updatedAt": "2026-09-14",
    "nationalSlug": "contractor-quote-checklists",
    "sections": [
      {
        "id": "new",
        "title": "Can a new business request insurance?",
        "paragraphs": [
          "Yes. Request a review using your actual start date, prior trade experience, planned operations and first projects. Acceptance depends on the market and the risk. A new company may be run by an experienced tradesperson, but experience and years since incorporation are different facts.",
          "Use labeled projections for the coming policy period. Do not enter last year’s receipts for a company that did not exist or invent employees to satisfy a form."
        ],
        "checklist": [
          "Legal entity, state, start date and owner’s relevant experience.",
          "Estimated annual receipts, employee payroll and subcontractor costs as separate figures.",
          "First project, largest anticipated project and requested effective date.",
          "Prior insurance and claims information, including when there is no history."
        ]
      },
      {
        "id": "no-employees",
        "title": "Does zero employee payroll mean no liability exposure?",
        "paragraphs": [
          "No. An owner can perform work without employees, or a contracting business can hire other businesses to perform it. Both arrangements need an accurate description. A policy may rate payroll, receipts, subcontractor cost or more than one basis. A zero in one field does not make the other exposure disappear.",
          "Workers’ compensation requirements and owner treatment depend on state law and entity structure. A general liability policy does not replace workers’ compensation. Have those requirements checked before hiring helpers."
        ],
        "links": [
          {
            "label": "Prepare an all-subcontractor insurance request",
            "href": "/guides/general-contractor-subcontractor-insurance-checklist"
          }
        ]
      },
      {
        "id": "pool-start",
        "title": "What should a new pool builder disclose?",
        "paragraphs": [
          "Separate new construction from cleaning, servicing and equipment repair. For a new build, list excavation, shell method such as gunite or fiberglass, plumbing, electrical connections, decking and any retaining walls. Identify which work the business performs and which it subcontracts.",
          "Discuss the unfinished project, materials and equipment separately from liability. A maintenance-only quote does not establish coverage for installation or construction."
        ],
        "checklist": [
          "Record construction receipts separately from recurring maintenance.",
          "Identify subcontractor costs, contracts and insurance evidence.",
          "Confirm required credentials and customer insurance terms."
        ],
        "links": [
          {
            "label": "Pool construction versus maintenance",
            "href": "/guides/pool-construction-vs-maintenance-insurance"
          },
          {
            "label": "Pool-builder insurance by state",
            "href": "/insurance/pool"
          }
        ]
      },
      {
        "id": "unknown",
        "title": "What if a portal requires an answer you do not know?",
        "paragraphs": [
          "Pause that question and obtain the fact from the person doing the work. Hazard questions about hot work, heights, utility lines and subcontractors can affect eligibility and coverage. An unknown answer must not be changed to “no” simply to obtain a price.",
          "If a market does not fit the disclosed operations, ask about another suitable market. Keep the description accurate across every submission so any resulting quotes can be meaningfully compared."
        ],
        "links": [
          {
            "label": "Compare contractor insurance quotes",
            "href": "/guides/contractor-insurance-quote-comparison"
          }
        ]
      }
    ]
  },
  {
    "slug": "contractor-insurance-real-quote-examples",
    "title": "Three real insurance quote examples: limits, fees and rating inputs",
    "description": "Read three anonymized saved proposals to see why a headline premium or liability limit is only the beginning of a useful insurance comparison.",
    "intro": "Read three anonymized saved proposals to see why a headline premium or liability limit is only the beginning of a useful insurance comparison.",
    "category": "Buying insurance",
    "industry": "Contractors",
    "tradeLabel": "General contractor",
    "insurancePath": "/insurance/general-contractor",
    "quoteKind": "service",
    "updatedAt": "2026-09-14",
    "nationalSlug": "contractor-quote-checklists",
    "sections": [
      {
        "id": "scope",
        "title": "What these examples establish",
        "paragraphs": [
          "These are readings of three saved proposal documents for different businesses. They are historical examples, not current offers, matched quotes for the same risk, paid-claim examples or recommendations that one insurer is cheaper. Names, addresses, quote identifiers and purchase links are omitted.",
          "The figures show what the documents displayed. They do not establish that every rating input was independently confirmed or that the policy was purchased. Missing revenue or other inputs are left unknown rather than reconstructed from price."
        ]
      },
      {
        "id": "cleaner",
        "title": "1. Housekeeping: a $2 million GL limit and a $5,000 property sublimit",
        "paragraphs": [
          "A Thimble/National Specialty housekeeper proposal prepared September 10, 2026 displayed a $2,000,000 GL coverage limit and a separate $5,000 Customer Property Protection sublimit. The summary excluded poor workmanship from that extension. Those are different limits answering different coverage questions.",
          "The annual upfront total was $1,036.69. The installment display showed $258.62 due at purchase and $78.06 monthly. The proposal did not establish an installment count suitable for reconstructing the annual total, so multiplying the monthly figure by 12 would not be a supported comparison.",
          "The retained intake receipt described a Nevada residential cleaner with $50,000 stated gross sales and no employees or subcontractors. Some eligibility answers remained quote-stage assumptions. This example explains the document; it is not a verified benchmark for another cleaner."
        ],
        "checklist": [
          "Compare the customer-property sublimit and exclusions separately from the GL limit.",
          "Obtain the full installment schedule before comparing payment options.",
          "Confirm actual operations and assumptions before accepting coverage."
        ],
        "links": [
          {
            "label": "Cleaning and damage to customer property",
            "href": "/guides/cleaning-insurance-customer-property-damage"
          }
        ]
      },
      {
        "id": "tree-fees",
        "title": "2. Tree work: $1,500 premium is not the complete payment estimate",
        "paragraphs": [
          "A saved Blitz tree-business packet for a Virginia risk, with a proposed September 2026 policy period, showed $1,500 premium, $35.99 taxes and $75 other fees. The displayed pay-in-full estimate was $1,610.99 plus transaction fees. The packet used $25,000 payroll; a verified revenue figure is not established here.",
          "The same packet’s forms schedule listed a work-height-above-60-feet exclusion and a separate tree-felling height limitation. A forms title is a reason to obtain and read the actual endorsement; it does not prove the felling rule’s detailed scope or override another restriction.",
          "The lesson is to compare total charges and the work the proposed policy accepts. A premium-only comparison could miss both the additional charges and a condition affecting the jobs a tree business takes."
        ],
        "checklist": [
          "Ask for the complete payment estimate, including taxes, fees and financing charges.",
          "Review working height and tree-felling wording separately.",
          "Confirm maximum actual heights and equipment before binding."
        ],
        "links": [
          {
            "label": "Tree-service quote preparation",
            "href": "/guides/tree-service-insurance-quote-checklist"
          }
        ]
      },
      {
        "id": "tree-inputs",
        "title": "3. Tree work with subcontractors: two rating bases in one quote",
        "paragraphs": [
          "An August 14, 2026 Crum & Forster Specialty proposal via Pathpoint for a different Virginia tree business displayed $20,000 payroll for the tree classification and $30,000 cost for subcontracted work. The schedule showed a $1,500 minimum class premium plus $286 for the subcontracted-work classification, producing $1,786 GL premium.",
          "The quoted liability terms included $1,000,000 each occurrence, $2,000,000 general aggregate and a $1,000 per-claim deductible including loss-adjustment expense and defense costs. The proposal was subject to audit. Gross revenue was not established by this schedule.",
          "This is not a rate comparison against the previous tree business: the inputs and terms differ. It shows why subcontractor spending must stay visible even when a headline price is described as a tree-service minimum."
        ],
        "checklist": [
          "Match payroll and subcontractor costs across every proposal.",
          "Identify minimum premiums and audit provisions.",
          "Compare deductibles and treatment of defense costs alongside limits."
        ],
        "links": [
          {
            "label": "Blank quote-comparison worksheet",
            "href": "/guides/contractor-insurance-quote-comparison"
          }
        ]
      },
      {
        "id": "your-quote",
        "title": "Use the same facts for your own comparison",
        "paragraphs": [
          "Prepare one description of the business and give it to every reviewer. Match effective dates, operations, locations, receipts, payroll and subcontractor costs. Then record accepted work, exclusions, limits, deductibles and total payment terms.",
          "An apparent saving based on different work or different inputs is not yet a better insurance offer. Ask for a corrected, comparable proposal before deciding."
        ],
        "checklist": [
          "Separate document facts, client-confirmed facts and unresolved assumptions.",
          "Ask for current quotes; do not reuse these historical examples as offers."
        ]
      }
    ]
  }
];
