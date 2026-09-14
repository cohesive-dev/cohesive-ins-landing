import type { PageContent } from "./data";

/** Public pool positioning; state-specific reviewed profiles take precedence. */
export function swimmingPoolContent(state?: string): Partial<PageContent> {
  const where = state ? ` in ${state}` : "";
  return {
    title: `Swimming Pool Contractor Insurance${where}: Construction & Service`,
    metaDescription: `Compare insurance for swimming pool construction, renovation and maintenance${where}. Prepare excavation, subcontractor and equipment details for a quote.`,
    heroH1: `Swimming Pool Contractor Insurance${where}`,
    heroSub: "Build, renovate or maintain swimming pools? Tell us which work you perform and which trades you subcontract. We’ll review your operation and customer requirements before requesting coverage.",
    alsoCovers: "For swimming pool builders, installers, repair businesses and maintenance contractors. Include hot tub installation if it is part of your work.",
    costNarrative: [
      "Pool construction and pool maintenance need different quote inputs. A builder should describe excavation, shell installation, decking, retaining walls and specialist connections. A service business should describe cleaning, chemical treatment, equipment repair and any installation work.",
      "For a useful price comparison, give each insurer the same annual receipts, employee payroll, subcontractor costs, claims history and requested limits. Compare covered operations, exclusions, deductibles and fees alongside the premium. Your quote depends on the work the insurer accepts; a maintenance-only price is not a construction estimate.",
    ],
    costRows: [
      { coverage: "General liability", range: "Individual quote", note: "Construction, renovation and maintenance are reviewed against the actual operations and policy wording." },
      { coverage: "Tools, equipment and unfinished work", range: "Separate review", note: "Identify owned or rented machinery, materials and responsibility for the pool while it is being built." },
      { coverage: "Workers’ compensation and vehicles", range: "Individual quote", note: "Review staffing, state requirements and business vehicle use separately." },
    ],
    costDisclaimer: "No local average or guaranteed starting premium is claimed. Coverage and eligibility depend on the insurer, the accepted operations and policy terms.",
    priceDrivers: ["Revenue split between construction, renovation and maintenance", "Pool systems, excavation depth and largest project value", "Employee payroll and subcontractor costs, stated separately", "Equipment ownership, rental arrangements and claims history"],
    coverages: [
      { name: "New pool construction and renovation", desc: "Ask about excavation, damage to existing property, underground services, structural work and completed operations. Identify the tasks performed by your crew and by subcontractors." },
      { name: "Pool cleaning, servicing and repairs", desc: "Describe chemicals, equipment repairs, liner replacement and any additional installation work. Check whether those tasks are accepted rather than relying on a general pool-service label." },
      { name: "Equipment, work in progress and staff", desc: "Establish who insures unfinished work and materials. Review rented machinery, tools, business vehicles and employee coverage separately from general liability." },
    ],
    faqs: [
      { q: "Can pool cleaning insurance cover pool construction?", a: "Do not assume it does. Disclose excavation, shell installation and structural work before requesting a quote. The insurer must accept the actual activities; a policy described as pool service may have a different scope." },
      { q: "What if I subcontract every part of the pool installation?", a: "Describe your role as the contracting business and provide total receipts, subcontractor costs, agreements and available subcontractor insurance evidence. Markets differ in how they treat this arrangement; it still needs an individual review." },
      { q: "What should I compare besides the annual premium?", a: "Check that both quotes use the same work description and financial estimates. Then compare limits, deductibles, exclusions, subcontractor conditions, completed operations, fees and payment terms. Ask about any missing item before deciding the policies are equivalent." },
      { q: "What should I prepare before asking for a certificate?", a: "Provide the customer’s insurance exhibit and the actual project scope. Have the requested terms reviewed and arrange coverage before presenting evidence. A certificate alone does not add coverage or change exclusions." },
    ],
  };
}
