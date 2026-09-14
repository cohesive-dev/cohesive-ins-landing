import type { Profile } from "./priority-state-content";

// Additional sourced profiles; keep construction distinct from maintenance.
export const POOL_TREE_STATE_PROFILES: Record<string, Profile> = {
  "pool/georgia": {
    "name": "Pool Construction",
    "state": "Georgia",
    "reviewedOn": "2026-09-14",
    "intro": "Georgia pool builders should separate new gunite or fiberglass installation from repair and weekly service. Include excavation, decking, drainage, electrical connections and work performed by subcontractors in the request.",
    "pricing": "Prepare receipts, payroll, subcontractor costs, largest project value and the split between installation, remodeling and maintenance. Identify gunite or shotcrete, excavation depth and structural work. Ask each market to use those same facts; a cleaning-only premium is not a construction comparison.",
    "facts": [
      {
        "title": "Public-pool projects have a separate health review",
        "body": "Georgia DPH and county environmental-health programs oversee public-pool construction and operation. Check their current plan-review process for a community or commercial pool; a residential backyard project is a different scope.",
        "source": {
          "label": "Georgia DPH: public pools",
          "href": "https://dph.georgia.gov/environmental-health/pools"
        }
      },
      {
        "title": "Check the scope of any specialty-contractor exemption",
        "body": "Georgia publishes specialty-contractor policy statements. Have the licensing board review your full contracted scope, including structures and non-pool improvements, before relying on an exemption. Local permits remain a separate question.",
        "source": {
          "label": "Georgia licensing board: specialty-contractor policies",
          "href": "https://sos.ga.gov/page/traditional-specialty-contractors-policy-statements"
        }
      }
    ],
    "questions": [
      "Do you install gunite, fiberglass or vinyl-lined pools, or perform more than one method?",
      "Who performs excavation, shell construction, plumbing, electrical work and decking?",
      "What share of receipts and subcontractor spending belongs to new construction versus repair?"
    ],
    "coverages": [
      {
        "name": "GL and completed operations",
        "desc": "Review whether the accepted operations include installation and completed-work claims. Faulty-workmanship, subsidence and damage-to-your-work provisions can limit a claim."
      },
      {
        "name": "Work in progress",
        "desc": "Discuss builders risk or installation coverage for materials and unfinished work. General liability is not a substitute for insuring the project itself."
      },
      {
        "name": "Subcontractors and equipment",
        "desc": "Provide subcontractor costs and insurance evidence. Review uninsured-subcontractor terms, rented equipment and commercial vehicle coverage separately."
      }
    ],
    "faqs": [
      {
        "q": "Can a maintenance policy cover a new pool installation?",
        "a": "Do not assume it does. Send the actual installation method and project scope for written review of the classification, exclusions and endorsements."
      },
      {
        "q": "Can an all-subcontractor pool builder request a quote?",
        "a": "Yes, describe that structure accurately and provide subcontractor spending and controls. Eligibility depends on the market; zero employee payroll does not mean zero construction exposure."
      }
    ]
  },
  "pool/north-carolina": {
    "name": "Pool Construction",
    "state": "North Carolina",
    "reviewedOn": "2026-09-14",
    "intro": "North Carolina pool construction quotes should describe the shell, excavation, retaining walls and subcontracted trades. A backyard installation and a community-pool renovation can require different credentials, contracts and coverage.",
    "pricing": "Prepare receipts, payroll, subcontractor costs, largest project value and the split between installation, remodeling and maintenance. Identify gunite or shotcrete, excavation depth and structural work. Ask each market to use those same facts; a cleaning-only premium is not a construction comparison.",
    "facts": [
      {
        "title": "Match the license classification to the project",
        "body": "The NC licensing board lists swimming-pool work within specialty classifications and certain broader contractor classifications. Check your classification and project scope with the board instead of treating a maintenance credential as construction authority.",
        "source": {
          "label": "NC Licensing Board: classifications",
          "href": "https://www.nclbgc.org/classifications-and-limitations/"
        }
      },
      {
        "title": "Review public-pool requirements separately",
        "body": "North Carolina publishes separate public-pool design and operating rules. For a community or commercial facility, review the applicable requirements with the local health department before treating a residential-pool specification as sufficient.",
        "source": {
          "label": "NC DPH: public-pool rules",
          "href": "https://www.dph.ncdhhs.gov/media/1809/open"
        }
      }
    ],
    "questions": [
      "Do you install gunite, fiberglass or vinyl-lined pools, or perform more than one method?",
      "Who performs excavation, shell construction, plumbing, electrical work and decking?",
      "What share of receipts and subcontractor spending belongs to new construction versus repair?"
    ],
    "coverages": [
      {
        "name": "GL and completed operations",
        "desc": "Review whether the accepted operations include installation and completed-work claims. Faulty-workmanship, subsidence and damage-to-your-work provisions can limit a claim."
      },
      {
        "name": "Work in progress",
        "desc": "Discuss builders risk or installation coverage for materials and unfinished work. General liability is not a substitute for insuring the project itself."
      },
      {
        "name": "Subcontractors and equipment",
        "desc": "Provide subcontractor costs and insurance evidence. Review uninsured-subcontractor terms, rented equipment and commercial vehicle coverage separately."
      }
    ],
    "faqs": [
      {
        "q": "Can a maintenance policy cover a new pool installation?",
        "a": "Do not assume it does. Send the actual installation method and project scope for written review of the classification, exclusions and endorsements."
      },
      {
        "q": "Can an all-subcontractor pool builder request a quote?",
        "a": "Yes, describe that structure accurately and provide subcontractor spending and controls. Eligibility depends on the market; zero employee payroll does not mean zero construction exposure."
      }
    ]
  },
  "tree-service/texas": {
    "name": "Tree Service & Tree Removal",
    "state": "Texas",
    "reviewedOn": "2026-09-14",
    "intro": "Texas tree-service businesses should distinguish routine pruning from full removals, storm response and work near power lines. Record the maximum tree height and working height, climbing methods and any crane or bucket-truck work.",
    "pricing": "Prepare receipts, payroll, subcontractor costs, loss history and the percentage of pruning, removals, stump work and storm cleanup. Quotes should use the same heights and methods. A lower premium with a height or removal restriction may not fit the jobs you actually take.",
    "facts": [
      {
        "title": "Austin rules are local, not a statewide permit rule",
        "body": "Austin regulates certain trees on residential property and provides a permit-review process for removal or impacts. Check the city guidance for an Austin job and the relevant authority for a site elsewhere in Texas.",
        "source": {
          "label": "Austin Development Services: residential trees",
          "href": "https://www.austintexas.gov/development-services/trees-residential-property"
        }
      },
      {
        "title": "Compare the height wording, not just the certificate",
        "body": "A certificate showing liability limits does not identify every height or operations restriction. Ask for the applicable policy wording and check whether it measures tree height, working height or another condition."
      }
    ],
    "questions": [
      "What are the tallest trees and maximum working heights your crew handles?",
      "Do you climb, use a bucket truck, rent a crane or subcontract aerial work?",
      "Do you work around utility lines, perform full removals or respond to storms?"
    ],
    "coverages": [
      {
        "name": "Liability for the accepted tree work",
        "desc": "Check removals, felling, pruning, rigging and completed operations against the actual wording. Do not infer that every operation is covered because the declaration says tree service."
      },
      {
        "name": "Height and utility restrictions",
        "desc": "Review exclusions and conditions for height, power lines and crane work. An unanswered hazard question remains unknown; it should not be treated as a no."
      },
      {
        "name": "Crew, vehicles and equipment",
        "desc": "Review workers’ compensation for the actual staffing, commercial auto for business vehicles and equipment protection for chippers, saws and rented machinery."
      }
    ],
    "faqs": [
      {
        "q": "Does tree-service insurance include tree removal?",
        "a": "Only the quoted policy and accepted operations can answer that. Describe full removals and rigging explicitly, and ask the reviewer to identify any removal, height or equipment restrictions."
      },
      {
        "q": "Is a stated liability limit enough to compare two quotes?",
        "a": "No. Compare height wording, utility-line work, methods, exclusions, deductibles and subcontractor conditions alongside limits. A certificate is evidence of coverage, not the full policy terms."
      }
    ]
  },
  "tree-service/florida": {
    "name": "Tree Service & Tree Removal",
    "state": "Florida",
    "reviewedOn": "2026-09-14",
    "intro": "Florida tree removal and storm cleanup can involve damaged trees, unstable loads and nearby structures. Give the insurer your actual heights, equipment and utility-line exposure; a trimming description alone does not describe storm-removal work.",
    "pricing": "Prepare receipts, payroll, subcontractor costs, loss history and the percentage of pruning, removals, stump work and storm cleanup. Quotes should use the same heights and methods. A lower premium with a height or removal restriction may not fit the jobs you actually take.",
    "facts": [
      {
        "title": "Check the local removal process before the job",
        "body": "Tampa provides tree-permitting and protected-tree resources. Review the current local process and applicable exceptions for the actual property; this city resource does not establish that every Florida removal needs a permit.",
        "source": {
          "label": "City of Tampa: tree resources",
          "href": "https://www.tampa.gov/construction-services/tree-permitting/tree-resources"
        }
      },
      {
        "title": "Compare the height wording, not just the certificate",
        "body": "A certificate showing liability limits does not identify every height or operations restriction. Ask for the applicable policy wording and check whether it measures tree height, working height or another condition."
      }
    ],
    "questions": [
      "What are the tallest trees and maximum working heights your crew handles?",
      "Do you climb, use a bucket truck, rent a crane or subcontract aerial work?",
      "Do you work around utility lines, perform full removals or respond to storms?"
    ],
    "coverages": [
      {
        "name": "Liability for the accepted tree work",
        "desc": "Check removals, felling, pruning, rigging and completed operations against the actual wording. Do not infer that every operation is covered because the declaration says tree service."
      },
      {
        "name": "Height and utility restrictions",
        "desc": "Review exclusions and conditions for height, power lines and crane work. An unanswered hazard question remains unknown; it should not be treated as a no."
      },
      {
        "name": "Crew, vehicles and equipment",
        "desc": "Review workers’ compensation for the actual staffing, commercial auto for business vehicles and equipment protection for chippers, saws and rented machinery."
      }
    ],
    "faqs": [
      {
        "q": "Does tree-service insurance include tree removal?",
        "a": "Only the quoted policy and accepted operations can answer that. Describe full removals and rigging explicitly, and ask the reviewer to identify any removal, height or equipment restrictions."
      },
      {
        "q": "Is a stated liability limit enough to compare two quotes?",
        "a": "No. Compare height wording, utility-line work, methods, exclusions, deductibles and subcontractor conditions alongside limits. A certificate is evidence of coverage, not the full policy terms."
      }
    ]
  },
  "tree-service/arizona": {
    "name": "Tree Service & Tree Removal",
    "state": "Arizona",
    "reviewedOn": "2026-09-14",
    "intro": "Arizona tree-service quotes should identify palm work, pruning, removals and stump grinding separately. Include maximum heights, climbing or aerial equipment, rigging and any work near structures or energized lines.",
    "pricing": "Prepare receipts, payroll, subcontractor costs, loss history and the percentage of pruning, removals, stump work and storm cleanup. Quotes should use the same heights and methods. A lower premium with a height or removal restriction may not fit the jobs you actually take.",
    "facts": [
      {
        "title": "Protected native plants need a separate check",
        "body": "Arizona has a protected-native-plant program with notice and permit requirements for certain activities. Check whether the plants and proposed removal fall within it; an ordinary tree-service description does not settle that question.",
        "source": {
          "label": "Arizona Department of Agriculture: native-plant questions",
          "href": "https://agriculture.az.gov/frequently-asked-questions"
        }
      },
      {
        "title": "Compare the height wording, not just the certificate",
        "body": "A certificate showing liability limits does not identify every height or operations restriction. Ask for the applicable policy wording and check whether it measures tree height, working height or another condition."
      }
    ],
    "questions": [
      "What are the tallest trees and maximum working heights your crew handles?",
      "Do you climb, use a bucket truck, rent a crane or subcontract aerial work?",
      "Do you work around utility lines, perform full removals or respond to storms?"
    ],
    "coverages": [
      {
        "name": "Liability for the accepted tree work",
        "desc": "Check removals, felling, pruning, rigging and completed operations against the actual wording. Do not infer that every operation is covered because the declaration says tree service."
      },
      {
        "name": "Height and utility restrictions",
        "desc": "Review exclusions and conditions for height, power lines and crane work. An unanswered hazard question remains unknown; it should not be treated as a no."
      },
      {
        "name": "Crew, vehicles and equipment",
        "desc": "Review workers’ compensation for the actual staffing, commercial auto for business vehicles and equipment protection for chippers, saws and rented machinery."
      }
    ],
    "faqs": [
      {
        "q": "Does tree-service insurance include tree removal?",
        "a": "Only the quoted policy and accepted operations can answer that. Describe full removals and rigging explicitly, and ask the reviewer to identify any removal, height or equipment restrictions."
      },
      {
        "q": "Is a stated liability limit enough to compare two quotes?",
        "a": "No. Compare height wording, utility-line work, methods, exclusions, deductibles and subcontractor conditions alongside limits. A certificate is evidence of coverage, not the full policy terms."
      }
    ]
  },
  "tree-service/georgia": {
    "name": "Tree Service & Tree Removal",
    "state": "Georgia",
    "reviewedOn": "2026-09-14",
    "intro": "Georgia arborist and tree-removal businesses should identify climbing, crane-assisted removals, stump grinding and storm work. State both tree height and working height, and identify jobs beside buildings or power lines.",
    "pricing": "Prepare receipts, payroll, subcontractor costs, loss history and the percentage of pruning, removals, stump work and storm cleanup. Quotes should use the same heights and methods. A lower premium with a height or removal restriction may not fit the jobs you actually take.",
    "facts": [
      {
        "title": "Atlanta distinguishes private-property tree review",
        "body": "Atlanta’s planning arborist division handles tree matters on private property, with processes for construction-related impacts and other removals. Check the current process for that site; public-property work follows a different city route.",
        "source": {
          "label": "Atlanta planning: arborist division",
          "href": "https://www.atlantaga.gov/government/departments/city-planning/nature-urban-ecology/arborist"
        }
      },
      {
        "title": "Compare the height wording, not just the certificate",
        "body": "A certificate showing liability limits does not identify every height or operations restriction. Ask for the applicable policy wording and check whether it measures tree height, working height or another condition."
      }
    ],
    "questions": [
      "What are the tallest trees and maximum working heights your crew handles?",
      "Do you climb, use a bucket truck, rent a crane or subcontract aerial work?",
      "Do you work around utility lines, perform full removals or respond to storms?"
    ],
    "coverages": [
      {
        "name": "Liability for the accepted tree work",
        "desc": "Check removals, felling, pruning, rigging and completed operations against the actual wording. Do not infer that every operation is covered because the declaration says tree service."
      },
      {
        "name": "Height and utility restrictions",
        "desc": "Review exclusions and conditions for height, power lines and crane work. An unanswered hazard question remains unknown; it should not be treated as a no."
      },
      {
        "name": "Crew, vehicles and equipment",
        "desc": "Review workers’ compensation for the actual staffing, commercial auto for business vehicles and equipment protection for chippers, saws and rented machinery."
      }
    ],
    "faqs": [
      {
        "q": "Does tree-service insurance include tree removal?",
        "a": "Only the quoted policy and accepted operations can answer that. Describe full removals and rigging explicitly, and ask the reviewer to identify any removal, height or equipment restrictions."
      },
      {
        "q": "Is a stated liability limit enough to compare two quotes?",
        "a": "No. Compare height wording, utility-line work, methods, exclusions, deductibles and subcontractor conditions alongside limits. A certificate is evidence of coverage, not the full policy terms."
      }
    ]
  }
};
