// Sourced editorial profiles for existing routes; not a carrier appetite or licensing engine.
// Sources checked September 14, 2026. See docs/seo-state-depth-20260914.md.
import type { Profile } from "./priority-state-content";

export const STATE_EXPANSION_PROFILES: Record<string, Profile> = {
  "pool/arizona": {
    "name": "Swimming Pool Contractor",
    "state": "Arizona",
    "reviewedOn": "2026-09-14",
    "intro": "Building a gunite pool, replacing a shell and maintaining a cleaning route are different operations. For an Arizona pool-construction quote, describe excavation, steel, shotcrete or gunite, equipment installation and the portions subcontracted to other crews.",
    "pricing": "Prepare total receipts, construction versus maintenance revenue, payroll, subcontractor costs, project values and claims history. Compare the same installation scope and completed-operations terms across quotes. A cleaning-route premium does not establish the cost of building a pool.",
    "facts": [
      {
        "title": "Check construction scope against the ROC classification",
        "body": "Arizona lists B-5 for general swimming pool construction and repair, while R-6 is service and minor repair with specific limits. Choose the classification matching the work; a service credential is not evidence that new construction is authorized.",
        "source": {
          "label": "Arizona ROC: pool and other license classifications",
          "href": "https://roc.az.gov/license-classifications"
        }
      },
      {
        "title": "Separate the pool from the rest of the backyard",
        "body": "List retaining walls, outdoor kitchens, shade structures and other work separately. The pool classification does not establish that every backyard project falls within the same licensed scope. Check the ROC description and the local permit requirements.",
        "source": {
          "label": "Arizona ROC: pool and other license classifications",
          "href": "https://roc.az.gov/license-classifications"
        }
      },
      {
        "title": "Build a subcontractor schedule before requesting coverage",
        "body": "For each stage, identify who performs it and provide subcontractor costs and insurance documents. Ask about excavation, damage to underground property, shell work and subcontractor conditions. Do not report zero exposure just because all field work is subcontracted."
      }
    ],
    "questions": [
      "Do you build new pools, remodel existing shells, maintain pools, or combine these services?",
      "Which crews perform excavation, steel, gunite/shotcrete, plumbing and electrical work?",
      "Are other backyard structures included in your contracts?",
      "What are your receipts, payroll, subcontractor costs and largest project value?"
    ],
    "coverages": [
      {
        "name": "Pool-construction liability",
        "desc": "Ask for review of the full installation scope, underground damage, subcontractor conditions and completed operations. Confirm exclusions for the shell and work being performed."
      },
      {
        "name": "Projects, equipment and crews",
        "desc": "Discuss materials awaiting installation, pumps and other equipment, owned or rented machinery, workers’ compensation and business vehicles separately."
      }
    ],
    "faqs": [
      {
        "q": "Can I use a pool-service quote for new pool construction?",
        "a": "Only if the insurer has reviewed and accepted the actual construction operations. A policy priced for cleaning or minor repairs may have a different scope."
      },
      {
        "q": "Is gunite covered automatically?",
        "a": "No. Identify gunite or shotcrete explicitly, including whether your crew or a subcontractor applies it. Ask to review the quoted classification and exclusions before binding."
      },
      {
        "q": "What should an all-subcontractor Arizona pool builder send?",
        "a": "Send the complete project scope, receipts, subcontractor spend and each trade’s role. Include contracts and subcontractor insurance requirements, even when W2 payroll is zero."
      }
    ]
  },
  "pool/florida": {
    "name": "Swimming Pool Contractor",
    "state": "Florida",
    "reviewedOn": "2026-09-14",
    "intro": "A Florida pool builder needs the quote to match the work: new installation, structural renovation, gunite or shotcrete, and the trades hired to finish the project. Keep residential construction, commercial pools and maintenance revenue separate.",
    "pricing": "Pricing depends on accepted operations, residential or commercial projects, receipts, payroll, subcontractor costs, claims and limits. Give every market the same scope and financial figures. We have not established a Florida pool-construction average premium.",
    "facts": [
      {
        "title": "Pool specialty subcontracting is different from contracting with the homeowner",
        "body": "Florida DBPR distinguishes commercial, residential, servicing and specialty pool licenses. Its FAQ says the swimming-pool specialty licenses under Rule 61G4-15.032 are for subcontracting within their scope, not contracting directly with the public.",
        "source": {
          "label": "Florida DBPR: construction and pool licensing FAQ",
          "href": "https://www2.myfloridalicense.com/construction-industry/faqs/"
        }
      },
      {
        "title": "Identify each construction stage in the insurance request",
        "body": "DBPR lists specialties including layout, structural, excavation, trim, decking, piping and finishing. Use that stage-by-stage approach to explain your own crew’s work and the work you hire out; licensing categories do not themselves define policy coverage.",
        "source": {
          "label": "Florida DBPR: construction and pool licensing FAQ",
          "href": "https://www2.myfloridalicense.com/construction-industry/faqs/"
        }
      },
      {
        "title": "Review the contract for an unfinished pool",
        "body": "Identify who is responsible for materials, installed equipment, the open excavation and damage during the build. Ask separately about project property insurance and liability; a certificate showing a GL limit does not settle these questions."
      }
    ],
    "questions": [
      "Do you contract directly with owners or work as a specialty subcontractor?",
      "What share of work is residential construction, commercial construction, renovation and maintenance?",
      "Who handles structural shell work, gunite, excavation and equipment installation?",
      "What are the project values, subcontractor spend and requested completed-operations terms?"
    ],
    "coverages": [
      {
        "name": "Installation and completed operations",
        "desc": "Review structural work, excavation, underground property, subcontracting conditions and damage discovered after the pool is finished."
      },
      {
        "name": "Unfinished work and equipment",
        "desc": "Discuss the property coverage needed for the project and equipment, including responsibility assigned by the contract. Review employee and vehicle exposures separately."
      }
    ],
    "faqs": [
      {
        "q": "Does a pool specialty license let me sell the whole build to a homeowner?",
        "a": "DBPR says the swimming-pool specialty licenses discussed in its FAQ do not permit direct contracts with the public. Confirm the correct license for the proposed contract before bidding."
      },
      {
        "q": "Can a maintenance policy cover a Florida gunite installation?",
        "a": "Do not assume so. Submit installation and shell work explicitly and review the insurer’s acceptance and exclusions."
      },
      {
        "q": "Why do you ask about subcontractors when they have their own insurance?",
        "a": "Your contract and policy can still impose conditions on work you hire out. Provide their operations, costs and coverage evidence so those conditions can be reviewed."
      }
    ]
  },
  "tree-service/connecticut": {
    "name": "Tree Service",
    "state": "Connecticut",
    "reviewedOn": "2026-09-14",
    "intro": "For Connecticut tree-service insurance, describe pruning, removals, maximum working heights, crane use and any plant-health treatments. A tree-care business that climbs or sprays needs a more specific review than a lawn-maintenance description.",
    "pricing": "Prepare the split between pruning, removal, stump grinding and treatments, plus payroll, receipts, subcontractor costs and equipment. Heights and utility exposure need explicit answers. No Connecticut tree-service average premium is claimed here.",
    "facts": [
      {
        "title": "Pruning and tree-health work can require an arborist license",
        "body": "Connecticut DEEP requires an arborist license for advertising, soliciting or contracting to perform arboriculture, which includes pruning, trimming and tree-health work. The program also addresses arborist business registration. Check the scope for your services rather than treating every type of tree job as identical.",
        "source": {
          "label": "Connecticut DEEP: commercial arborist licensing",
          "href": "https://portal.ct.gov/deep/pesticides/arborist/commercial-arborist-license"
        }
      },
      {
        "title": "Treat pesticide work as a separate operation",
        "body": "DEEP describes limits on the arborist credential’s pesticide scope and additional certifications for other sites or applications. Disclose tree treatments and any lawn, shrub or right-of-way spraying separately in the insurance request.",
        "source": {
          "label": "Connecticut DEEP: commercial arborist licensing",
          "href": "https://portal.ct.gov/deep/pesticides/arborist/commercial-arborist-license"
        }
      },
      {
        "title": "Compare both work height and tree-felling restrictions",
        "body": "Give the highest work crews undertake and the tallest trees removed. Ask for the actual height, felling, crane and utility endorsements. A limit on a proposal schedule is not a universal height rule for all tree policies."
      }
    ],
    "questions": [
      "What is the maximum climbing or lift height and tallest removal?",
      "Do you use cranes, subcontract climbers or work near utilities?",
      "Do you provide pruning, removal, stump grinding or plant-health treatments?",
      "Who holds the applicable arborist credential, and is the business registration current?"
    ],
    "coverages": [
      {
        "name": "Tree-work liability",
        "desc": "Review pruning, removal, property damage and completed operations, with height, utility, crane and subcontractor conditions."
      },
      {
        "name": "Treatments, crews and machinery",
        "desc": "Discuss pesticide exposures separately, along with workers’ compensation, commercial vehicles, chippers, lifts and rented equipment."
      }
    ],
    "faqs": [
      {
        "q": "Does an arborist license prove my insurance covers all tree work?",
        "a": "No. Licensing and insurance acceptance are separate. Match your quote to the operations and endorsements, including treatments and removals."
      },
      {
        "q": "Is a 60-foot limit standard for Connecticut tree insurance?",
        "a": "No universal limit is established here. Some proposals have height restrictions; review the wording of your own quote and disclose the maximum work you actually do."
      },
      {
        "q": "Can I leave out occasional crane work?",
        "a": "No. Include occasional operations and who supplies the crane and operator, so the insurer can review them before coverage is arranged."
      }
    ]
  },
  "tree-service/louisiana": {
    "name": "Tree Service",
    "state": "Louisiana",
    "reviewedOn": "2026-09-14",
    "intro": "Louisiana tree work needs a clear scope: routine pruning, hazardous removals, storm cleanup, cranes and work along utility rights of way. Send the actual operations and heights so licensing evidence and the insurance request describe the same business.",
    "pricing": "Include receipts, payroll, subcontractor costs, removal and pruning percentages, claims and the largest trees handled. Separate storm-response travel and utility work from routine local jobs. A landscaping rate is not a tree-removal quote.",
    "facts": [
      {
        "title": "Coordinate arborist credentials and insurance evidence",
        "body": "Louisiana Agriculture and Forestry requires an arborist license for paid tree work such as removal, pruning and trimming. Its compliance guidance calls for current general liability and workers’ compensation evidence, where applicable.",
        "source": {
          "label": "Louisiana Agriculture and Forestry: arborist licensing",
          "href": "https://www.ldaf.la.gov/land/arborists"
        }
      },
      {
        "title": "Utility rights-of-way work has a separate credential",
        "body": "LDAF identifies a Utility Arborist License for removal work along utility rights of way. Tell the broker whether your jobs include that work; a general tree-service description does not communicate it.",
        "source": {
          "label": "Louisiana Agriculture and Forestry: arborist licensing",
          "href": "https://www.ldaf.la.gov/land/arborists"
        }
      },
      {
        "title": "Use the written job scope to review storm work",
        "body": "LDAF’s arborist guidance calls for a written property-owner contract describing the work and price. For insurance review, add standing versus fallen trees, damaged structures, crane arrangements and neighboring access. Debris hauling and hazardous standing-tree removal should not be treated as the same exposure.",
        "source": {
          "label": "Louisiana Agriculture and Forestry: arborist licensing",
          "href": "https://www.ldaf.la.gov/land/arborists"
        }
      }
    ],
    "questions": [
      "Do jobs involve standing trees, fallen debris, utility rights of way or a combination?",
      "What are the maximum working height, removal size and crane arrangements?",
      "Do you travel out of state for storms or hire temporary crews?",
      "What insurance evidence is needed for the license and customer contract?"
    ],
    "coverages": [
      {
        "name": "Removal and storm-work liability",
        "desc": "Review actual operations, heights, utility limitations and damage to nearby structures, including subcontracted work."
      },
      {
        "name": "Crew, vehicle and equipment coverage",
        "desc": "Discuss staffing, workers’ compensation, hauling vehicles, chippers and cranes, including rented equipment and out-of-state work."
      }
    ],
    "faqs": [
      {
        "q": "Does a Louisiana arborist license replace insurance?",
        "a": "No. LDAF lists insurance evidence as a compliance item. The policy still needs to match the work and its conditions."
      },
      {
        "q": "Can storm cleanup change my insurance needs?",
        "a": "Yes. Explain whether the work changes from ground debris to damaged standing trees, utility work or crane-assisted removal before taking on that scope."
      },
      {
        "q": "What should I check beyond the liability limit?",
        "a": "Review height and felling exclusions, utility restrictions, crane arrangements, subcontractor conditions and the relevant completed-operations wording."
      }
    ]
  },
  "remodeler/massachusetts": {
    "name": "Remodeling Contractor",
    "state": "Massachusetts",
    "reviewedOn": "2026-09-14",
    "intro": "Kitchen updates, structural openings and full-home renovations are different insurance submissions. For Massachusetts remodeling work, identify load-bearing changes, occupied homes, plumbing and electrical subcontractors, and work on older painted surfaces.",
    "pricing": "Send the mix of cosmetic and structural jobs, largest project, receipts, payroll, subcontractor costs and claims. Use the same project scope when comparing quotes. A finish-work price does not establish the premium for structural renovation.",
    "facts": [
      {
        "title": "HIC registration and construction supervision are separate",
        "body": "Massachusetts distinguishes Home Improvement Contractor registration from a Construction Supervisor License. Structural remodeling can require both; check the project with the state program and building official rather than assuming registration alone covers every alteration.",
        "source": {
          "label": "Massachusetts: Home Improvement Contractor resources",
          "href": "https://www.mass.gov/info-details/hic-contractor-resources"
        }
      },
      {
        "title": "Check lead-safe requirements before disturbing older painted surfaces",
        "body": "Massachusetts has a separate lead-safe renovation program. For work in older housing, check its scope and applicable exceptions before sanding, demolition or window replacement. Disclose lead-related operations to the insurer; the credential does not remove a policy exclusion.",
        "source": {
          "label": "Massachusetts: lead-safe renovation program",
          "href": "https://www.mass.gov/info-details/lead-safe-renovation-for-contractors"
        }
      },
      {
        "title": "Separate damage to the existing home from the new work",
        "body": "For an occupied kitchen remodel, identify the areas under your control, stored materials and any temporary opening or water connection. Ask how liability and project property coverage address those exposures, and who insures the existing structure."
      }
    ],
    "questions": [
      "Are walls, foundations or other load-bearing elements changed?",
      "Are homes occupied during work, and what is the age of the building?",
      "Which plumbing, electrical and demolition tasks are subcontracted?",
      "What does the owner or GC require for ongoing and completed operations?"
    ],
    "coverages": [
      {
        "name": "Remodeling liability",
        "desc": "Review structural work, damage to existing property, subcontractor conditions and completed operations."
      },
      {
        "name": "Projects, tools and crews",
        "desc": "Discuss materials and work in progress separately from GL, plus employee, vehicle and tool exposures."
      }
    ],
    "faqs": [
      {
        "q": "Can a handyman quote cover structural remodeling?",
        "a": "Only after the insurer reviews and accepts those operations. Name the structural work and subcontractors instead of relying on the business label."
      },
      {
        "q": "Does HIC registration replace a CSL?",
        "a": "No. The Massachusetts programs are different; check which applies to the exact project."
      },
      {
        "q": "Is damage to the part I am rebuilding automatically covered?",
        "a": "No. Property being worked on, faulty work and damage to other property can receive different treatment. Review the actual exclusions and project coverage."
      }
    ]
  },
  "remodeler/pennsylvania": {
    "name": "Remodeling Contractor",
    "state": "Pennsylvania",
    "reviewedOn": "2026-09-14",
    "intro": "Pennsylvania remodeling insurance should describe the work behind the contract: kitchens, bathrooms, additions, structural changes and hired trades. Include the existing building and whether the owner remains in it during construction.",
    "pricing": "Provide annual receipts, payroll, subcontractor costs, the largest project, structural-work percentage and claims. Registration insurance minimums are not price estimates or a recommendation that the minimum is enough for a renovation.",
    "facts": [
      {
        "title": "Check HICPA registration and insurance evidence",
        "body": "Pennsylvania’s Attorney General explains home improvement registration and its exceptions. The registration guidance requires evidence of at least $50,000 personal injury liability and $50,000 property damage coverage. Those figures are registration requirements, not a promise that defects or every project loss are insured.",
        "source": {
          "label": "Pennsylvania Attorney General: home improvement registration FAQ",
          "href": "https://www.attorneygeneral.gov/businesses-and-organizations/home-improvement-contractor-registration/frequently-asked-questions/"
        }
      },
      {
        "title": "Registration is not approval of workmanship",
        "body": "The Attorney General states that registration is not an endorsement of a contractor’s skill. Keep registration, permits, contract obligations and policy coverage as separate checks before work starts.",
        "source": {
          "label": "Pennsylvania Attorney General: home improvement registration FAQ",
          "href": "https://www.attorneygeneral.gov/businesses-and-organizations/home-improvement-contractor-registration/frequently-asked-questions/"
        }
      },
      {
        "title": "Review a change order before the job changes",
        "body": "If a bathroom refit becomes structural repair or an addition, update the insurance scope. Include the new project value, who performs each trade and the customer’s requirements instead of assuming the original finish-work submission still fits."
      }
    ],
    "questions": [
      "Are projects cosmetic, structural, additions or a mix?",
      "What are the largest project value and subcontractor costs?",
      "Do you work in occupied homes or on older painted surfaces?",
      "What limits and endorsements does the owner or GC request?"
    ],
    "coverages": [
      {
        "name": "Residential renovation liability",
        "desc": "Review existing-property damage, structural work, hired trades and damage discovered after completion."
      },
      {
        "name": "Project property and staffing",
        "desc": "Consider materials and work in progress, tools, vehicles and workers’ compensation using the actual staffing arrangements."
      }
    ],
    "faqs": [
      {
        "q": "Are the Pennsylvania registration minimums enough for my contract?",
        "a": "Not necessarily. A customer may ask for different limits or endorsements, and exclusions still matter. Review the contract and operations together."
      },
      {
        "q": "Can I use one policy for kitchen work and additions?",
        "a": "Potentially, if the insurer accepts both. Disclose additions and structural work explicitly before relying on the policy."
      },
      {
        "q": "Does a certificate guarantee faulty work is covered?",
        "a": "No. A certificate summarizes insurance evidence; it does not change exclusions or provide a workmanship warranty."
      }
    ]
  },
  "painter/new-york": {
    "name": "Painting Contractor",
    "state": "New York",
    "reviewedOn": "2026-09-14",
    "intro": "A New York painting quote needs the actual work: occupied apartment interiors, exterior facades, ladders or scaffolds, spray application and surface preparation. Include the cities where you work and any building-management insurance exhibit.",
    "pricing": "Prepare interior versus exterior revenue, maximum working height, payroll, subcontractor costs, claims and requested limits. Separate decorative painting from industrial coatings or lead-related work. There is no verified statewide starting premium on this page.",
    "facts": [
      {
        "title": "Check the local license for the job address",
        "body": "New York City has its own Home Improvement Contractor licensing requirements. Use DCWP’s checklist when the work falls within that program; do not treat an NYC requirement as a statewide rule for every painting job.",
        "source": {
          "label": "NYC DCWP: Home Improvement Contractor checklist",
          "href": "https://www.nyc.gov/site/dca/businesses/license-checklist-home-improvement-contractor.page"
        }
      },
      {
        "title": "Use the right workers’ compensation evidence in NYC",
        "body": "DCWP accepts specified coverage or exemption evidence and explicitly says ACORD forms are not acceptable proof of New York State workers’ compensation coverage. Confirm the document needed for the application instead of sending a generic liability certificate.",
        "source": {
          "label": "NYC DCWP: Home Improvement Contractor checklist",
          "href": "https://www.nyc.gov/site/dca/businesses/license-checklist-home-improvement-contractor.page"
        }
      },
      {
        "title": "Review height and building-management requirements together",
        "body": "Give the broker the scaffold or lift method, maximum height, subcontractor arrangement and the building’s insurance exhibit. Ask about applicable New York job-site exclusions and contractual liability terms. A low interior-painting quote does not establish acceptance of elevated exterior work."
      }
    ],
    "questions": [
      "What percentage is interior, exterior, spraying or specialist coatings?",
      "What are the maximum height and access equipment?",
      "Which cities and building types do you work in?",
      "Does the customer request additional insured, waiver or completed-operations endorsements?"
    ],
    "coverages": [
      {
        "name": "Painting liability and overspray",
        "desc": "Review overspray damage to other property separately from the painted surface, rework and lead or pollution exclusions."
      },
      {
        "name": "Elevated work and crews",
        "desc": "Review scaffolds, lifts, subcontractors, worker coverage and rental-equipment obligations using the actual job scope."
      }
    ],
    "faqs": [
      {
        "q": "Is NYC’s home improvement license a statewide painting license?",
        "a": "No. The cited checklist is for New York City. Check the jurisdiction and work involved for jobs elsewhere."
      },
      {
        "q": "Will a GL certificate satisfy NYC’s workers’ compensation evidence requirement?",
        "a": "Do not assume so. DCWP specifically rejects ACORD forms for that purpose; use its accepted coverage or exemption documentation."
      },
      {
        "q": "Does general liability cover repainting my own poor finish?",
        "a": "Do not assume it does. Correcting your work and damage to a customer’s other property can be treated differently under the policy."
      }
    ]
  },
  "painter/massachusetts": {
    "name": "Painting Contractor",
    "state": "Massachusetts",
    "reviewedOn": "2026-09-14",
    "intro": "Massachusetts painters should separate interior decorating, exterior preparation, spraying and work on older painted surfaces. Heights, lead-related tasks and damage to nearby property need more detail than the label “painting.”",
    "pricing": "Send receipts, payroll, subcontractor costs, interior/exterior split, maximum height and claims. Explain surface preparation and any specialist coatings. A quote based on low-level interior work is not evidence of the price or acceptance of other operations.",
    "facts": [
      {
        "title": "Check lead-safe renovation requirements for older properties",
        "body": "Massachusetts operates a lead-safe renovation licensing program for qualifying renovation, repair and painting work. Check the rules for the building and the surfaces being disturbed before work starts; do not confuse lead-safe renovation with authorization for every type of deleading work.",
        "source": {
          "label": "Massachusetts: lead-safe renovation program",
          "href": "https://www.mass.gov/info-details/lead-safe-renovation-for-contractors"
        }
      },
      {
        "title": "Confirm the credentials for the actual painting project",
        "body": "The Massachusetts HIC program distinguishes registration from construction supervision and lists exterior painting among ordinary repair examples. Check the applicable scope and exemptions instead of assuming all painting jobs require the same credentials.",
        "source": {
          "label": "Massachusetts: Home Improvement Contractor resources",
          "href": "https://www.mass.gov/info-details/hic-contractor-resources"
        }
      },
      {
        "title": "Explain where sprayed material or wash water could go",
        "body": "For an exterior repaint, describe neighboring vehicles, windows, roofs and occupied areas, plus your preparation and containment methods. Ask about overspray, pollution or lead exclusions and the property actually being worked on."
      }
    ],
    "questions": [
      "Are you disturbing older painted surfaces or doing lead-related work?",
      "What is your interior/exterior split and maximum work height?",
      "Do you spray, pressure-wash, sandblast or apply industrial coatings?",
      "Who performs the work and what subcontractors do you hire?"
    ],
    "coverages": [
      {
        "name": "Painting and preparation liability",
        "desc": "Compare accidental damage to other property with exclusions for the work surface, rework, lead and pollution."
      },
      {
        "name": "Tools, access equipment and crews",
        "desc": "Discuss sprayers, rented lifts, business vehicles and worker coverage independently of the GL limit."
      }
    ],
    "faqs": [
      {
        "q": "Does lead-safe licensing mean my policy covers lead claims?",
        "a": "No. Training and licensing do not change a policy’s exclusions. Disclose the work and ask for a specific coverage review."
      },
      {
        "q": "Should I disclose occasional exterior work?",
        "a": "Yes. Include occasional jobs and maximum heights, not just the work that produces most revenue."
      },
      {
        "q": "Is paint spilled on a customer’s floor the same as a poor finish?",
        "a": "They are different situations. Have the broker explain how your policy treats damage to other property, property under your control and correcting your own work."
      }
    ]
  },
  "handyman/new-jersey": {
    "name": "Handyman",
    "state": "New Jersey",
    "reviewedOn": "2026-09-14",
    "intro": "For a New Jersey handyman quote, list the jobs you actually accept: patching, painting, carpentry, fixture work and larger repairs. Home improvement registration and insurance requirements depend on the work, not simply on calling the business a handyman service.",
    "pricing": "Prepare receipts, payroll, subcontractor costs, your largest job, heights and claims. Separate minor repairs from structural changes and specialist trades. A registration minimum is not a recommended limit for every customer or project.",
    "facts": [
      {
        "title": "Check home improvement business registration requirements",
        "body": "New Jersey Consumer Affairs lists at least $500,000 per-occurrence commercial general liability, workers’ compensation unless exempt, and additional security among home improvement business registration requirements. Check how the program applies to your work and entity.",
        "source": {
          "label": "New Jersey Consumer Affairs: home improvement business FAQ",
          "href": "https://www.njconsumeraffairs.gov/hic/Pages/FAQ.aspx"
        }
      },
      {
        "title": "Insurance and additional security serve different purposes",
        "body": "Review the registration application’s security requirements separately from GL. Do not assume an insurance certificate replaces the required security, or that satisfying registration automatically meets a property manager’s contract.",
        "source": {
          "label": "New Jersey Consumer Affairs: home improvement business FAQ",
          "href": "https://www.njconsumeraffairs.gov/hic/Pages/FAQ.aspx"
        }
      },
      {
        "title": "Make the task list part of the quote request",
        "body": "For a turnover job, distinguish drywall patching and door hardware from electrical, plumbing, roofing or structural work. Check the required trade credentials and insurer acceptance before adding a specialist task to the service menu."
      }
    ],
    "questions": [
      "Which tasks make up your service menu, including occasional work?",
      "Do you perform structural, roofing, electrical or plumbing jobs?",
      "What are the maximum height, largest job and subcontractor spend?",
      "What registration and property-manager insurance documents are requested?"
    ],
    "coverages": [
      {
        "name": "Repair and maintenance liability",
        "desc": "Review the declared operations, property being worked on, accidental damage to other property and completed work."
      },
      {
        "name": "Crew, tools and contract requirements",
        "desc": "Review workers’ compensation for the entity and staffing, tools and vehicles, plus required endorsements or security separately."
      }
    ],
    "faqs": [
      {
        "q": "Does the handyman label exempt me from home improvement registration?",
        "a": "Do not rely on the label. Check the actual services against New Jersey’s registration rules and applicable exemptions."
      },
      {
        "q": "Is the registration GL minimum enough for a property manager?",
        "a": "Not necessarily. The manager may request higher limits and specific endorsements. Send the insurance exhibit for review."
      },
      {
        "q": "Can I add roofing to my handyman policy?",
        "a": "Only after disclosing it and obtaining the insurer’s acceptance where available. An existing handyman classification is not evidence of roofing coverage."
      }
    ]
  },
  "handyman/arizona": {
    "name": "Handyman",
    "state": "Arizona",
    "reviewedOn": "2026-09-14",
    "intro": "Arizona handyman insurance should start with a real task list and project size. Door repairs, shelving and patching are different from permitted renovations, gas connections or structural work. Licensing exemptions and insurance coverage are separate questions.",
    "pricing": "Send receipts, payroll, subcontractor costs, heights and the largest total project. Identify specialist tasks even if they are occasional. A small-job exemption does not establish that a carrier will accept every operation.",
    "facts": [
      {
        "title": "Check the limits of Arizona’s minor-work exemption",
        "body": "Section 32-1121(A)(14) describes a limited exemption for casual or minor work with an aggregate project price below $1,000, subject to its counting rules and exclusions. A required local building permit or splitting a larger project into small contracts defeats that exemption.",
        "source": {
          "label": "Arizona law: contractor licensing exemptions, section 32-1121",
          "href": "https://www.azleg.gov/ars/32/01121.htm"
        }
      },
      {
        "title": "Review advertising and excluded tasks as well as price",
        "body": "The statute requires disclosure of unlicensed status in advertising for that exemption and excludes specified fire-safety and fuel-connection work. Read the full rule before advertising a service; a low invoice alone does not establish eligibility.",
        "source": {
          "label": "Arizona law: contractor licensing exemptions, section 32-1121",
          "href": "https://www.azleg.gov/ars/32/01121.htm"
        }
      },
      {
        "title": "Tell the insurer when the job gets larger",
        "body": "If a repair turns into a remodel, explain the revised scope before proceeding. Include who handles electrical, plumbing or structural work and whether other contractors are involved. Do not describe a larger project as minor maintenance to obtain a cheaper classification."
      }
    ],
    "questions": [
      "What is the total project value, including labor and materials under the applicable rules?",
      "Does the work require a permit or form part of a larger renovation?",
      "Are specialist trades, gas connections, heights or structural tasks involved?",
      "Which work is performed by you, employees or subcontractors?"
    ],
    "coverages": [
      {
        "name": "Small-repair liability",
        "desc": "Review accepted tasks, damage to other property, property under your control and exclusions for the work itself."
      },
      {
        "name": "Business assets and workers",
        "desc": "Discuss tools, business vehicles, employee exposure and subcontractor conditions separately from the liability policy."
      }
    ],
    "faqs": [
      {
        "q": "Does every job under $1,000 qualify for the handyman exemption?",
        "a": "No. Permit requirements, the nature of the work, the larger project, advertising and statutory exclusions also matter. Check the full statute or ROC guidance."
      },
      {
        "q": "Does being exempt from licensing mean I do not need insurance?",
        "a": "No. An exemption is not protection against a claim and does not settle a customer’s insurance requirements."
      },
      {
        "q": "Can I divide a larger job into small invoices to qualify?",
        "a": "The statute excludes splitting a larger operation to evade licensing. Describe the whole project when checking the rule and requesting insurance."
      }
    ]
  },
  "roofer/oklahoma": {
    "name": "Roofing Contractor",
    "state": "Oklahoma",
    "reviewedOn": "2026-09-14",
    "intro": "Oklahoma roofing insurance needs to match residential or commercial work, roof systems, tear-offs, heights and subcontracted crews. Disclose hot tar, torch work and heat welding accurately; an unknown method should stay a question until confirmed.",
    "pricing": "Provide receipts, payroll, subcontractor costs, roof-type percentages, maximum height and claims. Keep all-subs operations explicit even when W2 payroll is zero. Registration insurance limits are not premium estimates or proof that exclusions fit the work.",
    "facts": [
      {
        "title": "Match insurance evidence to residential or commercial registration",
        "body": "Oklahoma CIB currently lists minimum GL evidence of $500,000 for active residential-only roofers and $1,000,000 for any commercial roofing. Confirm the registration holder and certificate-holder details against the current CIB requirements.",
        "source": {
          "label": "Oklahoma CIB: active roofing contractor requirements",
          "href": "https://oklahoma.gov/cib/your-industry/roofing/active-roofing-contractor-requirements.html"
        }
      },
      {
        "title": "Plan for the residential endorsement transition",
        "body": "CIB announces a residential endorsement requirement beginning January 1, 2028, with a transition process starting in 2027. These are future milestones as of this page’s review date, not a claim that the 2028 endorsement is already required today.",
        "source": {
          "label": "Oklahoma CIB: residential roofing endorsement transition",
          "href": "https://oklahoma.gov/cib/news/new-residential-roofing-endorsement-required-by-house-bill-1628.html"
        }
      },
      {
        "title": "Ask specifically about an open roof and hired crews",
        "body": "For a tear-off, explain how the building is protected before the new roof is complete. Review water-entry, hot-work, height and subcontractor conditions in the quote. A certificate showing roofing liability does not establish that every method is accepted."
      }
    ],
    "questions": [
      "Is work residential, commercial or both, and what roof systems are installed?",
      "Do any jobs involve torch, hot tar or heat welding?",
      "What are the maximum height, payroll and total subcontractor costs?",
      "What open-roof protection and customer insurance requirements apply?"
    ],
    "coverages": [
      {
        "name": "Roofing liability and completed operations",
        "desc": "Review accepted roof systems, water-entry and hot-work restrictions, heights and damage discovered after completion."
      },
      {
        "name": "Subcontractors, crews and equipment",
        "desc": "Review labor-only crews, subcontractor conditions, worker coverage, lifts and business vehicles without treating zero payroll as zero exposure."
      }
    ],
    "faqs": [
      {
        "q": "Are the CIB limits a quote for my business?",
        "a": "No. They are insurance-evidence minimums. Premium and coverage depend on the accepted operation, rating facts and policy wording."
      },
      {
        "q": "Is the new residential endorsement already mandatory in September 2026?",
        "a": "CIB’s notice sets the requirement for January 1, 2028 and describes earlier transition steps. Check its latest notice for your registration timeline."
      },
      {
        "q": "Can an all-subcontractor roofer obtain a quote?",
        "a": "Submit that arrangement explicitly for review. Acceptance depends on the market and the subcontractor conditions; do not enter invented employee payroll to fit an application."
      }
    ]
  },
  "roofer/texas": {
    "name": "Roofing Contractor",
    "state": "Texas",
    "reviewedOn": "2026-09-14",
    "intro": "Texas roofing quotes should identify residential and commercial jobs, roof systems, tear-offs, heights and subcontracted crews. For coastal projects, coordinate the property’s windstorm inspection requirements separately from your contractor liability insurance.",
    "pricing": "Send receipts, payroll, subcontractor costs, work locations, roof-type percentages and claims. Include hot-work methods and the largest jobs. A roof repair, full replacement and commercial installation should not be quoted as interchangeable operations.",
    "facts": [
      {
        "title": "Check the coastal windstorm inspection requirement for the property",
        "body": "TDI explains that construction and roof repairs in designated catastrophe areas need to meet its construction and inspection requirements to qualify for TWIA wind and hail insurance. This concerns the building’s eligibility; it is not a statewide roofing GL requirement.",
        "source": {
          "label": "Texas Department of Insurance: Windstorm Inspection Program",
          "href": "https://tdi.texas.gov/WIND/generalquestio.html"
        }
      },
      {
        "title": "Arrange the inspection process before starting the job",
        "body": "TDI directs owners or builders to notify it before construction. Its inspectors inspect work in progress; appointed engineers have a separate path for completed construction. Confirm the appropriate process before covering up work and retain the resulting compliance documents.",
        "source": {
          "label": "Texas Department of Insurance: inspection process",
          "href": "https://www.tdi.texas.gov/wind/inspectionproc.html"
        }
      },
      {
        "title": "A WPI-8 is different from your insurance certificate",
        "body": "The windstorm compliance document addresses the structure. Your own liability quote still needs review for open-roof water entry, hot work, heights and subcontractor conditions. Neither document automatically supplies the other’s protection."
      }
    ],
    "questions": [
      "Where are projects located, including any coastal catastrophe areas?",
      "Which roof systems, heights and hot-work methods are used?",
      "Who performs tear-offs and installation, and what is total subcontractor spend?",
      "Who arranges property inspections, and what does the customer’s insurance exhibit request?"
    ],
    "coverages": [
      {
        "name": "Roof installation liability",
        "desc": "Review water-entry, hot-work, height and completed-operations terms for the methods actually used."
      },
      {
        "name": "Crew, equipment and work in progress",
        "desc": "Review workers, hired crews, lifts, tools and vehicles, plus responsibility for project property and materials."
      }
    ],
    "faqs": [
      {
        "q": "Is a WPI-8 my roofing liability insurance?",
        "a": "No. It is a windstorm compliance document for the property. Contractor liability coverage is a separate policy review."
      },
      {
        "q": "Do coastal inspection rules apply to every Texas roof?",
        "a": "The cited program concerns designated areas and TWIA eligibility. Check the property address and project with TDI rather than applying it statewide."
      },
      {
        "q": "Should I say no to torch work if I am unsure what a subcontractor uses?",
        "a": "No. Confirm the method with the crew. Unknown hazard information is a follow-up question, not a reason to provide an unsupported answer."
      }
    ]
  }
};
