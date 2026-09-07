import type { GuideSection, RestaurantGuide } from "./restaurant";
import registration from "./registration.json";

type Vendor = { name: string; href: string; fit: string; cost: string; watch: string };
export type VendorComparison = { caption: string; rows: Vendor[] };

export function startupVendorSection(guide: RestaurantGuide): GuideSection {
  const stateOffice = guide.stateSlug ? (registration.states as Record<string, { label: string; href: string }>)[guide.stateSlug] : undefined;
  const restaurant = guide.industry === "Restaurants";
  const rows: Vendor[] = [
    { name: stateOffice ? `File directly: ${stateOffice.label}` : "File directly with your state", href: stateOffice?.href ?? registration.source,
      fit: "Our first route to compare for a straightforward local LLC when you are comfortable handling the filing yourself.",
      cost: "State filing fees and ongoing state obligations; no third-party formation-service fee.",
      watch: "You handle the application, registered-agent arrangements, deadlines, and operating documents. Get legal or tax help for ownership or entity-choice questions." },
    { name: "Northwest Registered Agent", href: "https://www.northwestregisteredagent.com/llc",
      fit: "Our paid-service shortlist pick when you want LLC filing help and a provider that also offers registered-agent service.",
      cost: "Advertised formation: $39 plus state fees. Registered-agent service is separately listed at $125/year; confirm the package inclusion and renewal date.",
      watch: "Compare the full first-year and renewal total. A registered agent receives legal notices; it does not replace permits, bookkeeping, or insurance." },
    { name: "ZenBusiness Starter", href: "https://www.zenbusiness.com/pricing-formation-plans/",
      fit: "An alternative for guided filing with a low advertised formation-service price.",
      cost: "Starter advertises $0 plus state fees. Optional services, trials, and higher plans can add recurring charges.",
      watch: "Review the final cart and renewal terms for registered-agent service, compliance, website, and other add-ons. Compare the services you need, not only the headline price." },
    { name: "Stripe Atlas", href: "https://stripe.com/atlas",
      fit: "Consider when you have deliberately chosen a Delaware LLC or C corporation with your adviser. It is not our default for a local service business.",
      cost: "$500 setup, including Delaware filing fees and the first year of registered-agent service; $100/year for the agent after that. Other ongoing obligations are separate.",
      watch: "Operating in another state can require additional registration and fees there. Atlas is a formation product, separate from Stripe payment processing." },
    { name: "IRS EIN application", href: "https://www.irs.gov/businesses/small-businesses-self-employed/get-an-employer-identification-number",
      fit: "Get your federal employer identification number directly from the IRS when needed.",
      cost: "The IRS does not charge an EIN application fee.",
      watch: "Check online eligibility and use the IRS's other application methods if necessary. A formation service may charge to apply on your behalf; that is a service charge." },
    { name: "Bluevine Business Checking", href: "https://www.bluevine.com/business-checking",
      fit: "A banking option to compare for a business that mainly receives and pays money digitally. It does not form your LLC.",
      cost: "Standard has a $0 monthly fee. Some transactions, including cash deposits, carry fees; paid plans have different terms.",
      watch: restaurant ? "For a restaurant handling cash, compare cash-deposit fees, locations, limits, and branch access with a local bank before choosing. Bluevine is a financial technology company, not a bank; banking services are provided through Coastal Community Bank, Member FDIC." : "Check deposit holds, cash-deposit access, transfer limits, and bookkeeping compatibility. Bluevine is a financial technology company, not a bank; banking services are provided through Coastal Community Bank, Member FDIC." },
    restaurant ? {
      name: "Square for Restaurants", href: "https://squareup.com/help/us/en/article/6407-get-started-with-square-for-restaurants",
      fit: "A point-of-sale option to evaluate for menus, orders, and in-person payments.",
      cost: "Compare the current software plan, hardware, payment-processing fees, and optional features together.",
      watch: "Run a sample service before choosing: modifiers, kitchen routing, tips, refunds, and your busiest ordering channel. Confirm which features your selected plan includes." } : {
      name: "Jobber", href: "https://www.getjobber.com/features/",
      fit: "A shortlist option for customer records, quotes, scheduling, invoices, and taking payments for service jobs.",
      cost: "Paid software plans; compare user limits, billing terms, feature availability, and payment-processing fees.",
      watch: "Try one real workflow before subscribing. For pool builds or larger remodels, test milestone billing, change tracking, and subcontractor coordination rather than assuming scheduling software covers the full project." },
  ];
  if (!restaurant) rows.push({ name: "Stripe Payment Links", href: "https://stripe.com/payments/payment-links",
    fit: "An option for accepting online payments through a shareable link when you do not need a full job-management system.",
    cost: "Payment-processing and any applicable product or payment-method fees apply; check current pricing.",
    watch: "Choose the payment workflow before buying overlapping software. You do not need to buy Stripe Atlas to use Payment Links. Confirm settlement timing, refunds, and deposit terms for your jobs." });
  return { id: "startup-vendors", title: "Which services should you use to set up the business?", paragraphs: [
    "Start with the state filing route below if you want to handle a simple formation yourself. If you want paid filing help, our starting shortlist is Northwest Registered Agent, with ZenBusiness as an alternative to compare. These are editorial fit recommendations based on the providers' published services, not a claim that one provider is best for every owner.",
    "Choose the entity and formation state before buying a package. For a business operating locally, compare formation in that state first; a Delaware entity can still need registration where it operates. An LLC filing does not replace trade credentials, operating permits, or business insurance.",
    "Provider features and advertised prices checked September 7, 2026. Links go directly to the providers or government offices. Confirm the checkout total, optional subscriptions, renewal charges, and current terms before ordering.",
  ], comparison: { caption: "Formation, banking, and operating tools: fit, cost, and tradeoffs", rows }, links: [
    { label: "SBA: registration and operating in more than one state", href: "https://www.sba.gov/counseling/launch-your-business/" },
    { label: "Northwest: registered-agent pricing", href: "https://www.northwestregisteredagent.com/registered-agent" },
    { label: "Bluevine: cash-deposit options and fees", href: "https://support.bluevine.com/s/article/How-do-I-deposit-cash-into-my-Bluevine-Business-Checking-account" },
  ] };
}

export function addStartupVendors(guide: RestaurantGuide): RestaurantGuide {
  if (!guide.slug.startsWith("how-to-")) return guide;
  const section = startupVendorSection(guide);
  const preferred = ["business-setup", "approvals", "setup", "credentials", "licenses", "licensing"];
  const anchor = preferred.map((id) => guide.sections.findIndex((s) => s.id === id)).find((index) => index >= 0) ?? 0;
  return { ...guide, sections: [...guide.sections.slice(0, anchor + 1), section, ...guide.sections.slice(anchor + 1)] };
}
