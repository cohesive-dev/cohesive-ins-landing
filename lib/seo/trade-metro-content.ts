import type { MetroPage } from "./metro-pages";
import { contractorStateBuildable } from "./contractor-states";
import { TRADE_METRO_CITIES, TRADE_METRO_PROFILES, tradeMetroInsurancePath } from "./trade-metro-research";

// No starting premiums or guessed carrier eligibility. Each page combines the
// relevant city process with the trade's actual work and a labelled hypothetical.
export const TRADE_METRO_PAGES: MetroPage[] = TRADE_METRO_PROFILES.flatMap(t =>
 TRADE_METRO_CITIES.filter(c=>contractorStateBuildable(t.slug,c.state)).map(c=>({
  trade:t.slug,state:c.state,city:c.city,cityName:c.cityName,stateName:c.stateName,
  label:`${t.display} insurance`,path:tradeMetroInsurancePath(t,c),parentPath:`/insurance/${t.slug}/${c.state}`,
  source:`seo-${t.slug}-${c.state}-${c.city}`,operationsPrompt:t.scope,
  content:{
   title:`${t.display} Insurance in ${c.cityName}, ${c.stateName}`,
   metaDescription:`${c.cityName} ${t.display.toLowerCase()} insurance: review actual operations, customer requirements, exclusions and local project scope. Request a quote comparison.`,
   heroH1:`${t.display} Insurance in ${c.cityName}`,
   heroSub:`Work with homeowners, property managers or GCs in ${c.cityName}? Explain the jobs you actually perform before comparing insurance. ${t.scope}`,
   alsoCovers:`For work around ${c.cityName}, establish the job address and buyer's scope first. ${c.question}`,
   reviewedOn:"2026-09-16",
   costNarrative:[`Compare proposals using the same operations, gross receipts, W2 payroll, subcontractor costs, claims and required limits. A ${c.cityName} address alone does not determine price. Keep zero payroll when accurate and identify any estimated figures instead of inventing an application answer.`,
    `For ${t.display.toLowerCase()} work, check the largest jobs and occasional tasks as well as the routine work. ${t.questions[0]} Compare deductibles, fees, exclusions and endorsements alongside the premium.`],
   costDisclaimer:"No city-specific starting rate or average is claimed. Coverage and pricing depend on the submitted facts and actual policy terms.",
   costRows:[{coverage:"General liability",range:"Individual quote",note:"Match accepted operations, limits, exclusions and customer requirements."},{coverage:"Worker, vehicle and equipment coverage",range:"Separate review",note:"Use the actual crew, vehicles, tools and project-property responsibilities."}],
   priceDrivers:[t.scope,"Gross receipts, W2 payroll, subcontractor costs and claim history","Largest project, property types, work locations and height","Required limits, deductibles, fees and actual endorsements"],
   coverages:t.hazards.map(([name,desc])=>({name,desc})),
   stateFacts:[
    {title:`Start with the actual ${c.cityName} project process`,body:c.fact,source:{label:`${c.cityName}: official project and permitting resources`,href:c.url}},
    {title:`A scope question for your ${t.display.toLowerCase()} job`,body:`${c.question} ${t.questions[1]} Give the customer and insurance reviewer the same work description. A permit, a contractor credential and an insurance policy answer different questions.`},
    {title:"Review trade-specific evidence before making a promise",body:t.note,source:t.resource},
    {title:"Walk through a potential loss before choosing coverage",body:`Illustrative scenario, not a reported claim: ${t.scenario}`},
    {title:"Prepare the GC or property-manager requirements",body:"Send the full insurance exhibit, legal business name, contracts and any requested endorsements. A COI summarizes evidence; it does not create additional insured status or override exclusions. Identify who insures unfinished work and materials separately from liability to others."},
   ],
   faqs:[
    {q:`What should I prepare for a ${c.cityName} ${t.display.toLowerCase()} quote?`,a:`${t.scope} Also provide expected sales, employee payroll, subcontractor costs, claims, project locations and the actual customer insurance requirements. Identify unknowns rather than answering them to reach eligibility.`},
    {q:"Does the lowest premium mean the same work is covered?",a:"No. Compare accepted operations, limits, deductibles, fees and actual exclusions. Ask about the work itself, damage to other property and completed operations separately. A cheaper quote using different business facts is not an equivalent comparison."},
   ],
  },
 })));
