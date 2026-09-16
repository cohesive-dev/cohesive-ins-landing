import type { RestaurantGuide, GuideSection } from "./restaurant";
import { GROWTH_BUNDLE } from "./lead-bundle";
import { contractorStateBuildable } from "../seo/contractor-states";
import { getTrade } from "../seo/contractors";
import { TRADE_METRO_CITIES, TRADE_METRO_PROFILES, tradeMetroInsurancePath, tradeMetroGrowthPath } from "../seo/trade-metro-research";
const emailRules={label:"FTC: commercial-email requirements",href:"https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business"};
export const TRADE_METRO_GROWTH_GUIDES: RestaurantGuide[] = TRADE_METRO_PROFILES.flatMap(t=>
 TRADE_METRO_CITIES.filter(c=>contractorStateBuildable(t.slug,c.state)).map(c=>{
  const trade=getTrade(t.slug);if(!trade)throw new Error(`Unknown editorial trade: ${t.slug}`);
  const sections: GuideSection[]=[
   {id:"find-the-right-buyers",title:`Who buys ${t.display.toLowerCase()} work in ${c.cityName}?`,paragraphs:[
    `Property-manager route: ${t.pm}`,
    `GC and referral route: ${t.gc}`,
    `Start with a service territory you can support around ${c.cityName}. Check the company's actual projects and contact role, not just its industry label. Ask whether it buys your service directly, refers clients or maintains a subcontractor bid list. A business name on a list is a prospect, not a qualified lead.`],checklist:["Record the business, public contact, relevant work and source URL.","Separate direct project buyers from referral partners.","Choose a specific work type and service radius before sending an introduction."]},
   {id:"local-project-context",title:`A useful ${c.cityName} project conversation`,paragraphs:[c.fact,
    `Ask the buyer: ${c.question} Then clarify your trade scope: ${t.questions[0]}`,
    "Use public project resources to prepare for a conversation, not to imply a permit owner requested contact or that a public record is an available job. Confirm the actual municipality and site before discussing a start date."],links:[{label:`${c.cityName}: official project resources`,href:c.url}]},
   {id:"pm-introduction",title:"A property-manager introduction to adapt",paragraphs:[
    `Subject: ${t.display.toLowerCase()} support in ${c.cityName}`,
    `Hi [Name] — I run [Business], serving [actual service area]. We handle [specific tasks your business performs]. ${t.ask} If useful, I can send a short capability sheet and review a work order with whoever handles vendor selection. — [Your real name and business]`,
    "Keep the ask relevant to the recipient's buildings and buying process. Do not claim its current contractor is failing, pretend to be an existing vendor or promise a response time your team cannot deliver. Replace every placeholder before sending."],links:[emailRules]},
   {id:"gc-introduction",title:"Use a defined package when approaching GCs",paragraphs:[
    `For a GC, ask about the next bid package rather than asking for any work. Explain your exact ${t.display.toLowerCase()} scope, the construction stages you handle and where another trade takes over. ${t.gc}`,
    `Draft: Hi [Name] — does your team use outside ${t.display.toLowerCase()} contractors on projects in [actual service area]? We can price [defined package] from a written scope. Who handles subcontractor invitations, and what do you need for vendor qualification? — [Real name and business]`,
    "Use accurate commercial-email identity, required postal-address details and a working opt-out. Honor requests to stop. A short relevant introduction is a proposed approach, not a measured response-rate promise."],links:[emailRules]},
   {id:"qualify-the-lead",title:`Turn interest into a real ${t.display.toLowerCase()} opportunity`,paragraphs:[
    "Confirm the project and the decision-maker before requesting a long application or sending a generic price. A reply asking for information, a scoped work order and an awarded job are different outcomes.",
    "Request the address, customer type, plans or photographs where appropriate, target schedule and agreed next step. Clarify whether you are bidding directly, subcontracting to a GC or receiving a referral to another buyer."],checklist:t.questions},
   {id:"vendor-proof",title:"Make the vendor packet easy to review",paragraphs:[
    `Show evidence for the work you actually perform: ${t.scope}`,
    "Share your relevant business credentials, real examples used with permission and a clear contact for estimating. Keep customer information private. Do not send a certificate or claim to be insured for a task until the actual coverage and customer requirements have been checked."],checklist:t.proof},
   {id:"insurance-before-the-job",title:"Compare coverage before promising a COI",paragraphs:[
    ...t.hazards.map(([name,description])=>`${name}: ${description}`),
    "Give the broker the actual GC or property-manager insurance exhibit. Keep gross receipts, W2 payroll and subcontractor costs separate and identify unknown facts. A COI does not create additional insured status or amend policy exclusions.",t.note],links:[{label:`${c.cityName} ${t.display.toLowerCase()} insurance`,href:tradeMetroInsurancePath(t,c)},t.resource]},
   {id:"cohesive-ai-referrals",title:"Get a free PM/GC list and lead-generation help with insurance",paragraphs:[
    GROWTH_BUNDLE.summary,
    `For ${t.display.toLowerCase()} work in ${c.cityName}, specify your territory, accepted tasks, crew capacity and preferred buyer type. The list and outreach should reflect those choices. ${t.ask}`,
    "Ask about the included service with your insurance request. Insurance placement depends on your business, state and insurer. Leads, replies, appointments and jobs are not guaranteed; the list is not an endorsement or an agreed referral relationship. You can read and use this guide without an insurance purchase."],links:[{label:"Explore Cohesive AI outreach",href:"https://getcohesiveai.com"},{label:"Ask about insurance and a free PM/GC list",href:"#quote"}]},
   {id:"first-month-plan",title:`A first-month ${c.cityName} outreach plan`,paragraphs:[
    "Week 1: select one work type and a practical territory, research relevant businesses and prepare your capability sheet. Week 2: send tailored introductions and record human replies. Week 3: qualify genuine opportunities and follow up on agreed scope calls, site walks or bid invitations. Week 4: compare which buyer type produced suitable work and refine the next list.",
    "Track contacted businesses, genuine interest, qualified opportunities, site walks, bids and jobs separately. Count each real opportunity once, not every message. Include list, tool and labor costs; a free included list does not make your own sales time costless. Judge success by jobs your team can deliver profitably, not email opens."],checklist:["Give each interested buyer an owner and agreed next action.","Separate PM work orders from GC bids and referral introductions.","Exclude autoresponders, wrong-fit projects and duplicate conversations from qualified leads.","Honor opt-outs and use actual results to choose the next territory or work type."]},
  ];
  return {slug:tradeMetroGrowthPath(t,c).slice('/guides/'.length),kind:"growth",cityName:c.cityName,
   title:`How to get ${t.display.toLowerCase()} leads in ${c.cityName}, ${c.stateName}`,
   description:`Find ${t.display.toLowerCase()} leads in ${c.cityName}: PM and GC outreach, qualification and vendor preparation. Get a free local contact list with insurance purchase.`,
   intro:`To find ${t.display.toLowerCase()} leads in ${c.cityName}, give the right buyer a specific reason to speak with you. ${t.ask} Build separate approaches for property-manager work orders and GC project packages, then qualify the work before calling it a lead.`,
   category:"Local customer acquisition",industry:t.industry,stateSlug:c.state,nationalSlug:`${t.slug}-metro-growth`,quoteKind:"service",tradeLabel:trade.intakeLabel??trade.name,
   insurancePath:tradeMetroInsurancePath(t,c),updatedAt:"2026-09-16",sections,
  };
 }));
