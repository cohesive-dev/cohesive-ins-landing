import type { Fact, PageContent } from "./data";
import { getState } from "./data";
import { CONTRACTOR_STATE_SLUGS } from "./contractor-states";
import { STARTUP_STATES, type StartupState } from "@/lib/guides/states";

export const RESTAURANT_TYPES_UPDATED = "2026-09-20";

export type RestaurantType = {
  slug: string;
  name: string;
  noun: string;
  alsoCovers: string;
  operations: string;
  property: string;
  driversExtra: string[];
  coverageFocus: { name: string; desc: string }[];
  faq: { q: string; a: string };
  alcoholCommon?: boolean;
};

// Each row represents a materially different operation, not a keyword alias.
// The differences below flow into underwriting inputs, price drivers,
// coverages, FAQs, and every state page.
export const RESTAURANT_TYPES: RestaurantType[] = [
  {
    slug: "chinese-restaurant",
    name: "Chinese Restaurant",
    noun: "Chinese restaurant",
    alsoCovers: "For dine-in, takeout, buffet, dim sum, noodle, and regional Chinese concepts.",
    operations: "wok ranges, deep frying, solid-fuel or high-BTU cooking, delivery, buffet service, and any catering",
    property: "Wok lines, hood and suppression systems, grease ducts, refrigeration, and tenant improvements should be described individually.",
    driversExtra: ["Wok, fryer, and open-flame equipment", "Buffet, delivery, late-night, and catering sales", "Hood, duct, suppression, and cleaning records"],
    coverageFocus: [
      { name: "High-heat cooking and fire protection", desc: "Disclose wok ranges, fryers, solid fuel, hood and duct design, suppression, extinguisher service, and cleaning frequency. A generic restaurant description can miss the cooking intensity." },
      { name: "Buffet, takeout, and delivery", desc: "Separate dine-in, buffet, takeout, delivery, and catering receipts. Review foodborne-illness, hired and non-owned auto, and off-premises operations." },
    ],
    faq: { q: "Does wok cooking change a Chinese restaurant insurance quote?", a: "Usually. High-BTU wok ranges, open flame, grease production, hood design, suppression, and cleaning controls can affect property eligibility and price. Describe the actual line rather than selecting only a cuisine label." },
    alcoholCommon: true,
  },
  {
    slug: "coffee-shop",
    name: "Coffee Shop",
    noun: "coffee shop",
    alsoCovers: "For cafés, espresso bars, tea shops, and coffee-and-pastry counters.",
    operations: "espresso and beverage service, pastries, limited cooking, drive-through or walk-up service, Wi-Fi seating, and retail beans or merchandise",
    property: "Espresso machines, grinders, refrigeration, water filtration, point-of-sale equipment, tenant improvements, and spoilage should be valued separately.",
    driversExtra: ["Limited cooking versus grills, fryers, or a full kitchen", "Drive-through, walk-up, seating, and delivery", "Equipment values, water connections, and spoilage exposure"],
    coverageFocus: [
      { name: "Equipment and utility interruption", desc: "List espresso machines, refrigeration, water filtration, and electrical requirements. Ask how equipment breakdown, water damage, spoilage, and utility interruption are treated." },
      { name: "Customer premises and products", desc: "Review burns, spills, slips, food or beverage illness, seating, Wi-Fi use, and any retail products or merchandise." },
    ],
    faq: { q: "Is a coffee shop rated like a full restaurant?", a: "Not always. A beverage-and-pastry café with no cooking is different from a café with grills, fryers, or a full breakfast line. Give the insurer the menu and equipment list so it does not assume the wrong cooking class." },
  },
  {
    slug: "pizzeria",
    name: "Pizzeria",
    noun: "pizzeria",
    alsoCovers: "For pizza shops, slice counters, delivery pizzerias, and dine-in pizza restaurants.",
    operations: "deck, conveyor, wood-fired, or coal-fired ovens; dough preparation; dine-in, takeout, delivery, and alcohol if offered",
    property: "Ovens, hood requirements, refrigeration, dough equipment, tenant improvements, and delivery exposure need separate review.",
    driversExtra: ["Oven type and solid-fuel use", "Owned delivery vehicles versus third-party platforms", "Late-night hours, seating, and alcohol sales"],
    coverageFocus: [
      { name: "Ovens and fire controls", desc: "Identify deck, conveyor, wood-fired, or coal-fired ovens and the hood, flue, suppression, cleaning, and fuel-storage arrangements." },
      { name: "Delivery liability", desc: "Separate employee delivery, owned vehicles, hired or non-owned autos, and third-party platforms. A restaurant GL policy is not commercial auto coverage." },
    ],
    faq: { q: "Does pizza delivery require separate insurance?", a: "Often. Owned delivery vehicles need commercial auto, and employee-owned vehicles create hired and non-owned auto questions. Tell the insurer who drives, who owns each vehicle, and whether a third-party platform handles delivery." },
    alcoholCommon: true,
  },
  {
    slug: "mexican-restaurant",
    name: "Mexican Restaurant",
    noun: "Mexican restaurant",
    alsoCovers: "For taquerias, cantinas with food-forward sales, burrito shops, and regional Mexican restaurants.",
    operations: "grills, fryers, tortilla equipment, table service or counter service, takeout, catering, and beer, wine, or cocktails if offered",
    property: "Cooking equipment, hood and suppression systems, refrigeration, tenant improvements, and alcohol inventory should be scheduled accurately.",
    driversExtra: ["Grill, fryer, and tortilla-production equipment", "Counter service versus full table service", "Alcohol share, margarita service, and late hours"],
    coverageFocus: [
      { name: "Cooking and food-service liability", desc: "Describe grills, fryers, hot holding, salsa bars, catering, and takeout. Review fire protection and food-contamination response." },
      { name: "Liquor liability", desc: "If beer, wine, or cocktails are served, report alcohol receipts and hours and compare liquor liability separately from general liability." },
    ],
    faq: { q: "Does serving margaritas change a Mexican restaurant quote?", a: "Yes. Alcohol share, drink type, hours, server training, entertainment, and state law can change eligibility and liquor-liability pricing. Report food and alcohol receipts separately." },
    alcoholCommon: true,
  },
  {
    slug: "indian-restaurant",
    name: "Indian Restaurant",
    noun: "Indian restaurant",
    alsoCovers: "For dine-in, buffet, takeout, tandoori, vegetarian, and regional Indian concepts.",
    operations: "tandoor ovens, grills, fryers, buffet or hot holding, delivery, catering, and event service",
    property: "Tandoors, hood and suppression systems, refrigeration, buffet equipment, and tenant improvements should be disclosed and valued.",
    driversExtra: ["Tandoor fuel, installation, ventilation, and clearances", "Buffet and hot-holding controls", "Catering, delivery, and event receipts"],
    coverageFocus: [
      { name: "Tandoor and cooking protection", desc: "Identify tandoor fuel and installation, grills, fryers, ventilation, hood and suppression, cleaning, and fire clearances." },
      { name: "Buffet and catering operations", desc: "Describe hot holding, off-premises service, transport, temporary setups, and the contracts or venues involved." },
    ],
    faq: { q: "What should an Indian restaurant disclose about a tandoor?", a: "Give the fuel type, installation, ventilation, clearances, hood and suppression details, cleaning schedule, and whether it is included in the fire inspection. Do not let the quote assume ordinary electric cooking." },
    alcoholCommon: true,
  },
  {
    slug: "sushi-restaurant",
    name: "Sushi Restaurant",
    noun: "sushi restaurant",
    alsoCovers: "For sushi bars, sashimi restaurants, omakase counters, and Japanese restaurants centered on raw fish.",
    operations: "raw-fish preparation, cold storage, rice handling, dine-in and takeout, delivery, and sake or other alcohol if offered",
    property: "Refrigeration, freezers, temperature monitoring, specialty equipment, spoilage values, and tenant improvements drive the property review.",
    driversExtra: ["Raw-fish sourcing, storage, and temperature controls", "Refrigeration breakdown and spoilage values", "Takeout, delivery, and alcohol service"],
    coverageFocus: [
      { name: "Cold chain and foodborne illness", desc: "Document sourcing, receiving, refrigeration, temperature logs, preparation controls, and recall procedures for raw fish." },
      { name: "Spoilage and equipment breakdown", desc: "Value refrigerated stock and ask how equipment breakdown, utility interruption, contamination, and spoilage are covered." },
    ],
    faq: { q: "Why does raw fish matter to a sushi restaurant quote?", a: "Raw-fish handling changes the foodborne-illness and cold-chain review. Insurers may ask about approved suppliers, refrigeration, temperature records, employee training, and prior health violations." },
    alcoholCommon: true,
  },
  {
    slug: "thai-restaurant",
    name: "Thai Restaurant",
    noun: "Thai restaurant",
    alsoCovers: "For dine-in, takeout, noodle, curry, and regional Thai concepts.",
    operations: "wok cooking, open flame, frying, curry preparation, takeout, delivery, catering, and alcohol if offered",
    property: "Wok lines, hood and suppression systems, refrigeration, tenant improvements, and delivery exposure should be described separately.",
    driversExtra: ["Wok, fryer, and open-flame equipment", "Takeout, delivery, and catering share", "Hood, suppression, and grease-cleaning controls"],
    coverageFocus: [
      { name: "Wok and high-heat cooking", desc: "Describe wok ranges, fryers, fuel, hood and duct design, suppression, extinguisher service, and cleaning frequency." },
      { name: "Off-premises sales", desc: "Separate dine-in, takeout, delivery, and catering receipts and review hired and non-owned auto and event requirements." },
    ],
    faq: { q: "Is a Thai restaurant with wok cooking a limited-cooking risk?", a: "Usually not. Wok ranges, open flame, grease production, fryers, and the ventilation setup should be disclosed. The menu and equipment list determine the cooking classification, not the restaurant's size." },
    alcoholCommon: true,
  },
  {
    slug: "italian-restaurant",
    name: "Italian Restaurant",
    noun: "Italian restaurant",
    alsoCovers: "For trattorias, pasta restaurants, Italian cafés, and food-forward wine restaurants.",
    operations: "ranges, ovens, sauté, pasta preparation, table service, takeout, catering, and wine or cocktails if offered",
    property: "Kitchen equipment, hood and suppression, wine inventory, tenant improvements, and refrigeration should be valued accurately.",
    driversExtra: ["Cooking line, oven type, and fire protection", "Table service, catering, and takeout", "Wine and liquor receipts, storage, and hours"],
    coverageFocus: [
      { name: "Kitchen and property", desc: "List ovens, ranges, fryers, refrigeration, hood and suppression, tenant improvements, wine inventory, and business-income exposure." },
      { name: "Alcohol and table service", desc: "Report alcohol receipts and hours and compare liquor liability, assault or battery wording, and server-training controls." },
    ],
    faq: { q: "Does a wine-heavy Italian restaurant need separate liquor liability?", a: "Yes. General liability ordinarily does not replace liquor liability for a business selling alcohol. Report wine, beer, and liquor receipts and compare the liquor form, limits, exclusions, and state requirements." },
    alcoholCommon: true,
  },
  {
    slug: "mediterranean-restaurant",
    name: "Mediterranean Restaurant",
    noun: "Mediterranean restaurant",
    alsoCovers: "For Greek, Lebanese, Middle Eastern, shawarma, kebab, and falafel restaurants.",
    operations: "vertical broilers, grills, fryers, rotisseries, counter or table service, takeout, delivery, and catering",
    property: "Vertical broilers, grills, hood and suppression systems, refrigeration, and tenant improvements need an equipment-level description.",
    driversExtra: ["Vertical broiler, grill, rotisserie, and fryer equipment", "Counter versus table service", "Delivery, catering, and event sales"],
    coverageFocus: [
      { name: "Broilers, grills, and fire protection", desc: "Identify vertical broilers, rotisseries, grills, fryers, fuel, hood and suppression design, cleaning, and clearances." },
      { name: "Catering and delivery", desc: "Describe food transport, temporary setups, delivery drivers, venue contracts, and the portion of receipts earned away from the restaurant." },
    ],
    faq: { q: "What cooking equipment matters for a Mediterranean restaurant quote?", a: "Vertical broilers, rotisseries, charcoal or gas grills, and fryers can change the cooking and fire review. Send the menu, equipment list, fuel type, and hood and suppression details." },
  },
  {
    slug: "barbecue-restaurant",
    name: "Barbecue Restaurant",
    noun: "barbecue restaurant",
    alsoCovers: "For smokehouses, barbecue counters, mobile smokers based at a restaurant, and regional BBQ concepts.",
    operations: "indoor or outdoor smokers, wood or charcoal fuel, overnight cooking, grease and ash handling, catering, and alcohol if offered",
    property: "Smokers, fuel storage, clearances, exhaust, fire protection, refrigeration, and business-income exposure need specific review.",
    driversExtra: ["Smoker location, construction, fuel, and clearances", "Overnight or unattended cooking", "Catering, mobile equipment, and alcohol sales"],
    coverageFocus: [
      { name: "Smokers and solid fuel", desc: "Identify every smoker, its location, construction, fuel, exhaust, clearance, cleaning, ash handling, suppression, and whether cooking continues overnight." },
      { name: "Catering and mobile equipment", desc: "List off-premises receipts, towable or mobile smokers, transport, temporary cooking, event contracts, and vehicle ownership." },
    ],
    faq: { q: "Will insurers cover a barbecue restaurant using wood or charcoal?", a: "Some will, but solid fuel and smokers narrow the market. Complete details on installation, clearances, exhaust, cleaning, ash disposal, fire controls, and unattended cooking help an underwriter decide." },
    alcoholCommon: true,
  },
  {
    slug: "seafood-restaurant",
    name: "Seafood Restaurant",
    noun: "seafood restaurant",
    alsoCovers: "For fish restaurants, oyster bars with food-forward sales, crab houses, and seafood counters.",
    operations: "raw or cooked seafood, shucking, frying or grilling, cold storage, takeout, and alcohol if offered",
    property: "Refrigeration, freezer stock, spoilage, cooking equipment, shellfish handling, and tenant improvements should be valued and described.",
    driversExtra: ["Raw shellfish and seafood sourcing controls", "Refrigeration, freezer, and spoilage values", "Frying, grilling, alcohol, and waterfront exposure"],
    coverageFocus: [
      { name: "Seafood handling and illness", desc: "Document approved suppliers, shellfish records, refrigeration, temperature controls, preparation, and response to a suspected foodborne-illness event." },
      { name: "Cold storage and spoilage", desc: "List refrigerated stock values and ask how equipment breakdown, power interruption, contamination, and spoilage are treated." },
    ],
    faq: { q: "Does serving raw shellfish affect seafood restaurant insurance?", a: "It can. Insurers may review supplier records, tags, refrigeration, temperature controls, training, and loss history. Describe raw and cooked sales rather than reporting only total seafood revenue." },
    alcoholCommon: true,
  },
  {
    slug: "breakfast-restaurant",
    name: "Breakfast & Brunch Restaurant",
    noun: "breakfast and brunch restaurant",
    alsoCovers: "For diners, pancake houses, brunch cafés, and breakfast counters.",
    operations: "griddles, fryers, ranges, coffee service, early hours, high table turnover, takeout, and brunch alcohol if offered",
    property: "Griddles, fryers, hood and suppression, refrigeration, coffee equipment, and tenant improvements should be scheduled.",
    driversExtra: ["Griddle, fryer, and range equipment", "Early opening, table turnover, and slip exposure", "Brunch cocktails, takeout, and delivery"],
    coverageFocus: [
      { name: "Cooking line and premises", desc: "Describe griddles, fryers, ranges, hood and suppression, grease controls, seating, waiting areas, and floor-maintenance procedures." },
      { name: "Brunch alcohol", desc: "If cocktails or other alcohol are offered, separate receipts and compare liquor liability and server controls rather than treating brunch service as incidental." },
    ],
    faq: { q: "Is a breakfast café limited cooking?", a: "Not when it uses griddles, fryers, or ranges. Coffee and pastry service may be limited cooking, but a full egg, meat, and fried-food line should be described as the equipment actually used." },
    alcoholCommon: true,
  },
  {
    slug: "deli",
    name: "Deli & Sandwich Shop",
    noun: "deli or sandwich shop",
    alsoCovers: "For delicatessens, sandwich counters, sub shops, and prepared-food markets.",
    operations: "cold preparation, slicers, limited cooking, hot holding, takeout, delivery, retail grocery sales, and catering",
    property: "Slicers, refrigeration, display cases, stock, spoilage, and any cooking or tenant improvements need separate values.",
    driversExtra: ["Cold preparation versus grills or fryers", "Slicers, refrigerated cases, and spoilage", "Catering, delivery, and retail grocery sales"],
    coverageFocus: [
      { name: "Cold preparation and equipment", desc: "List slicers, refrigeration, display cases, hot holding, grills or fryers, and the value of perishable stock." },
      { name: "Catering and product sales", desc: "Separate walk-in, delivery, catering, wholesale, and packaged retail receipts and review off-premises operations." },
    ],
    faq: { q: "Is a deli without a fryer cheaper to insure?", a: "Often the cooking exposure is easier, but price still depends on sales, property, refrigeration, delivery, catering, claims, and location. Send the menu and equipment list so a carrier can distinguish cold preparation from heavy cooking." },
  },
  {
    slug: "fast-food-restaurant",
    name: "Fast Food & Quick-Service Restaurant",
    noun: "fast-food or quick-service restaurant",
    alsoCovers: "For counter-service, drive-through, franchise, and high-volume quick-service concepts.",
    operations: "high-volume grills and fryers, counter and drive-through service, delivery, late hours, franchise requirements, and multiple locations",
    property: "Cooking equipment, signs, drive-through property, tenant improvements, refrigeration, and business-income exposure need location-level values.",
    driversExtra: ["Fryer and grill volume, hood, and suppression", "Drive-through traffic, late hours, and delivery", "Franchise requirements and multi-location controls"],
    coverageFocus: [
      { name: "High-volume cooking", desc: "Document grills, fryers, filtration, hood and duct cleaning, suppression service, grease handling, and closing procedures." },
      { name: "Drive-through and multi-location liability", desc: "Review vehicle and pedestrian flow, signs, parking areas, delivery, late hours, franchise requirements, and consistent controls across locations." },
    ],
    faq: { q: "Can one policy cover several quick-service locations?", a: "Often, but every location, operation, building interest, equipment value, sales figure, and loss history must be scheduled correctly. Compare location-level deductibles, limits, and business-income treatment." },
  },
  {
    slug: "fine-dining-restaurant",
    name: "Fine Dining Restaurant",
    noun: "fine-dining restaurant",
    alsoCovers: "For chef-driven, tasting-menu, white-tablecloth, and reservation-focused restaurants.",
    operations: "full table service, complex cooking, tasting menus, valet or coat check, private events, high-value wine, and substantial alcohol sales",
    property: "Build-out, fine finishes, kitchen equipment, wine inventory, art or décor, and a longer business-income restoration period should be reviewed.",
    driversExtra: ["Alcohol share and high-value wine inventory", "Valet, coat check, private dining, and events", "High-value build-out and longer income interruption"],
    coverageFocus: [
      { name: "High-value property and income", desc: "Value custom build-out, finishes, equipment, wine, art, and décor and choose a realistic restoration period for business-income coverage." },
      { name: "Guest services and alcohol", desc: "Disclose valet, coat check, private events, entertainment, alcohol receipts, hours, server training, and contractual requirements." },
    ],
    faq: { q: "Why can a fine-dining restaurant need more business-income coverage?", a: "Specialty equipment, custom finishes, permitting, reservations, and staff rebuilding can extend the interruption after a covered loss. Compare the restoration period and limits against a realistic reopening timeline." },
    alcoholCommon: true,
  },
  {
    slug: "ice-cream-shop",
    name: "Ice Cream & Frozen Dessert Shop",
    noun: "ice cream or frozen-dessert shop",
    alsoCovers: "For scoop shops, frozen-yogurt stores, gelato shops, and dessert counters.",
    operations: "freezing and refrigeration, product preparation, self-service toppings, seasonal peaks, walk-up windows, delivery, and limited baking if any",
    property: "Freezers, soft-serve or batch equipment, refrigerated stock, spoilage, water connections, and tenant improvements should be valued.",
    driversExtra: ["Freezer and refrigeration breakdown", "Self-service, walk-up, and seasonal volume", "On-site manufacturing versus resale"],
    coverageFocus: [
      { name: "Freezer breakdown and spoilage", desc: "List freezer, refrigeration, and production equipment and ask how mechanical breakdown, power interruption, contamination, and spoiled stock are covered." },
      { name: "Manufacturing and customer service", desc: "Distinguish on-site production from resale and describe self-service toppings, allergens, seating, walk-up windows, and delivery." },
    ],
    faq: { q: "Does ice cream spoilage require special coverage?", a: "Do not assume every refrigeration failure or outage is covered. Compare equipment breakdown, utility interruption, spoilage triggers, waiting periods, deductibles, and the stock limit." },
  },
  {
    slug: "vegan-restaurant",
    name: "Vegan & Vegetarian Restaurant",
    noun: "vegan or vegetarian restaurant",
    alsoCovers: "For plant-based restaurants, vegetarian cafés, vegan bakeries, and meat-free quick-service concepts.",
    operations: "the actual cooking equipment, allergen controls, packaged products, takeout, delivery, catering, and any alcohol service",
    property: "Cooking equipment, refrigeration, specialty stock, tenant improvements, and any retail products should be scheduled.",
    driversExtra: ["Actual cooking equipment rather than the meat-free label", "Allergen and cross-contact controls", "Packaged products, catering, and delivery"],
    coverageFocus: [
      { name: "Cooking class and property", desc: "Plant-based does not automatically mean limited cooking. List grills, fryers, ranges, ovens, hood and suppression, refrigeration, and tenant improvements." },
      { name: "Ingredients, allergens, and products", desc: "Describe allergen controls, packaged products, labeling, wholesale sales, catering, and delivery and review product-liability treatment." },
    ],
    faq: { q: "Is vegan restaurant insurance automatically less expensive?", a: "No. Insurers price the actual cooking, property, sales, seating, delivery, alcohol, claims, and location. A vegan restaurant with fryers and a full line may resemble other full-service risks." },
  },
  {
    slug: "fried-chicken-restaurant",
    name: "Fried Chicken Restaurant",
    noun: "fried-chicken restaurant",
    alsoCovers: "For chicken counters, wing restaurants, takeout shops, and food-forward sports concepts.",
    operations: "multiple fryers, breading and raw-poultry handling, takeout, delivery, late hours, and alcohol if offered",
    property: "Fryers, hood and suppression systems, grease handling, refrigeration, tenant improvements, and delivery exposure require detailed review.",
    driversExtra: ["Number, type, and maintenance of fryers", "Raw-poultry handling and food-safety controls", "Late-night, delivery, and alcohol sales"],
    coverageFocus: [
      { name: "Fryers and grease fire protection", desc: "Identify every fryer, filtration and grease process, hood and duct cleaning, suppression service, extinguishers, and closing controls." },
      { name: "Poultry handling and delivery", desc: "Document raw and cooked separation, temperature controls, takeout, delivery drivers, vehicles, and third-party platforms." },
    ],
    faq: { q: "Why do fryers matter so much to a chicken restaurant quote?", a: "Fryers increase fire severity and grease-control requirements. Carriers review installation, hood and duct cleaning, suppression service, maintenance, filtration, and loss history before accepting the property exposure." },
    alcoholCommon: true,
  },
  {
    slug: "burger-restaurant",
    name: "Burger Restaurant",
    noun: "burger restaurant",
    alsoCovers: "For burger counters, diners, smash-burger shops, drive-throughs, and food-forward burger bars.",
    operations: "griddles, charbroilers, fryers, counter or table service, drive-through, delivery, late hours, and alcohol if offered",
    property: "Griddles, broilers, fryers, hood and suppression, drive-through property, refrigeration, and tenant improvements should be listed.",
    driversExtra: ["Charbroiler, griddle, and fryer equipment", "Drive-through, delivery, and late-night hours", "Alcohol share and table versus counter service"],
    coverageFocus: [
      { name: "Grills, broilers, and fryers", desc: "Describe charbroilers, griddles, fryers, fuel, hood and suppression, grease handling, cleaning, and maintenance." },
      { name: "Drive-through and delivery", desc: "Review parking and pedestrian flow, signs, employee or third-party delivery, hired and non-owned auto, and late-hour controls." },
    ],
    faq: { q: "Does a charbroiler change burger restaurant insurance?", a: "It can. Charbroilers and fryers produce heat and grease that affect fire-protection review. Give the insurer the equipment, fuel, hood, suppression, cleaning, and maintenance details." },
    alcoholCommon: true,
  },
  {
    slug: "donut-shop",
    name: "Donut Shop",
    noun: "donut shop",
    alsoCovers: "For doughnut shops, coffee-and-donut counters, and bakeries centered on fried pastries.",
    operations: "dough mixing and proofing, fryers or ovens, glazing and filling, early production, coffee service, wholesale, and delivery",
    property: "Fryers, ovens, proofers, mixers, refrigeration, stock, tenant improvements, and equipment-breakdown exposure should be valued.",
    driversExtra: ["Fried versus baked production", "Overnight or early-morning unattended processes", "Wholesale, delivery, and coffee-service receipts"],
    coverageFocus: [
      { name: "Production equipment and fire", desc: "List fryers, ovens, proofers, mixers, ventilation, suppression, cleaning, and whether any process runs unattended." },
      { name: "Wholesale and delivery", desc: "Separate retail, wholesale, catering, and delivery receipts and review products liability, vehicles, and customer contracts." },
    ],
    faq: { q: "Is a donut shop treated like a coffee shop?", a: "Not if it fries or manufactures on site. Fryers, proofers, ovens, overnight production, wholesale sales, and delivery can make the risk different from a beverage-and-pastry café." },
  },
];

export type RestaurantTypeState = StartupState;

const DISTRICT_OF_COLUMBIA: RestaurantTypeState = {
  name: "District of Columbia",
  slug: "district-of-columbia",
  food: {
    label: "DC Health: food establishments",
    href: "https://dchealth.dc.gov/service/food-establishments",
    note: "DC Health inspects restaurants, delicatessens, bakeries, ice cream businesses, mobile vendors, and other food establishments and provides plan-review, food-manager, and inspection resources. Confirm the establishment category and current licensing path before opening or changing the operation.",
  },
  construction: {
    label: "DC contractor licensing",
    href: "https://dlcp.dc.gov/page/contractor-and-construction-services-licensing",
    note: "Construction licensing is separate from the food-establishment review.",
  },
};

const PLACEABLE = new Set(CONTRACTOR_STATE_SLUGS);
export const RESTAURANT_TYPE_STATES: RestaurantTypeState[] = [
  ...STARTUP_STATES.filter((state) => PLACEABLE.has(state.slug)),
  DISTRICT_OF_COLUMBIA,
];

export function getRestaurantType(slug: string) {
  return RESTAURANT_TYPES.find((type) => type.slug === slug);
}

export function getRestaurantTypeState(slug: string) {
  return RESTAURANT_TYPE_STATES.find((state) => state.slug === slug);
}

function commonContent(type: RestaurantType): Omit<PageContent, "title" | "metaDescription" | "heroH1" | "heroSub" | "stateFacts"> {
  return {
    reviewedOn: RESTAURANT_TYPES_UPDATED,
    alsoCovers: type.alsoCovers,
    costNarrative: [
      `A useful ${type.noun} quote starts with the real operation: ${type.operations}. The cuisine or concept helps route the request, but the menu, equipment, service model, sales, people, and property determine the insurance terms.`,
      `Keep every quote based on the same facts. ${type.property} Then compare accepted operations, valuation, deductibles, exclusions, business-income treatment, fees, and liability limits alongside premium.`,
    ],
    costDisclaimer: "Pricing is individual to the restaurant, property, sales, cooking, alcohol, delivery, people, claims, location, and requested coverage. These are quote components, not premium estimates or an offer of insurance.",
    costRows: [
      { coverage: "Businessowners policy", range: "Individual quote", note: `General liability and property should reflect the actual ${type.noun} operation.` },
      { coverage: "Building / contents / improvements", range: "Selected limits", note: type.property },
      { coverage: "Business income and equipment breakdown", range: "Policy-specific", note: "Compare covered causes, waiting periods, restoration time, utility terms, spoilage, and the actual equipment schedule." },
      { coverage: "Liquor, auto, workers' compensation, and umbrella", range: "As applicable", note: "Review each exposure separately; a restaurant package does not automatically include every line." },
    ],
    priceDrivers: [
      "Annual sales, payroll, seating, square footage, hours, years in business, and loss history",
      "Menu, cooking equipment, fuel, hood and suppression, cleaning, and fire inspection details",
      ...type.driversExtra,
      "Building or tenant-property values, refrigeration, equipment, spoilage, and requested deductibles",
    ],
    coverages: [
      { name: "General liability and products", desc: "Review customer injury, foodborne illness, products, premises, delivery, catering, and contractual requirements against the actual operations." },
      { name: "Property and business income", desc: "Value equipment, contents, stock, improvements, signs, and income exposure. Compare valuation, coinsurance, deductibles, water, wind, spoilage, and restoration terms." },
      ...type.coverageFocus,
      { name: "Workers, vehicles, and umbrella", desc: "Employees, owners, delivery, catering vehicles, hired or non-owned autos, and higher liability limits require separate facts and sometimes separate policies." },
    ],
    faqs: [
      {
        q: `How much does ${type.noun} insurance cost?`,
        a: `There is no reliable price from the concept name alone. Insurers need sales, payroll, menu, cooking equipment, alcohol, delivery, property values, protection, location, claims, and requested limits. Compare proposals built from the same facts.`,
      },
      type.faq,
      {
        q: `What information should a ${type.noun} gather for a quote?`,
        a: "Start with the current policy if handy, loss runs, menu, equipment list, sales split, payroll, hours, seating, square footage, alcohol and delivery details, property values, hood and suppression records, lease requirements, and requested effective date. Estimates are acceptable when labeled honestly.",
      },
      {
        q: "Does a landlord's certificate request tell me what policy to buy?",
        a: "No. It identifies evidence the landlord wants, but it does not replace a review of the lease, operations, property, exclusions, deductibles, and limits. Compare the actual proposal with the written requirement before binding.",
      },
    ],
  };
}

export function buildRestaurantTypeNational(type: RestaurantType): PageContent {
  return {
    title: `${type.name} Insurance | Coverage & Quote Guide`,
    metaDescription: `Compare ${type.noun} insurance for cooking, property, food liability, employees, delivery, alcohol, equipment, and business income.`,
    heroH1: `${type.name} insurance`,
    heroSub: `Build a quote around the menu, equipment, service model, people, property, and off-premises work your ${type.noun} actually has.`,
    ...commonContent(type),
    stateFacts: [
      {
        title: `Describe the ${type.noun}, not just the category`,
        body: `Tell the underwriter about ${type.operations}. Send the menu and equipment list and separate sales by dine-in, takeout, delivery, catering, alcohol, retail, or wholesale when those operations apply.`,
      },
    ],
  };
}

function workersCompFact(stateSlug: string): Fact | undefined {
  const state = getState(stateSlug);
  if (!state) return undefined;
  return {
    title: `Check the employee rule in ${state.name}`,
    body: state.slug === "texas"
      ? "Texas does not require most private employers to carry workers' compensation, but non-subscribers have notice and reporting duties and give up important lawsuit defenses. Restaurant contracts and ownership structure may create separate considerations."
      : `${state.name} generally requires workers' compensation ${state.wcWhen}. Confirm how owners, officers, part-time employees, and any separately organized catering or delivery operation are counted.`,
  };
}

export function buildRestaurantTypeState(type: RestaurantType, state: RestaurantTypeState): PageContent {
  const base = buildRestaurantTypeNational(type);
  const stateProfile = getState(state.slug);
  const wcFact = workersCompFact(state.slug);
  return {
    ...base,
    title: `${type.name} Insurance in ${state.name} | Coverage Guide`,
    metaDescription: `Compare ${state.name} ${type.noun} insurance for cooking, property, food liability, employees, delivery, alcohol, equipment, and business income.`,
    heroH1: `${type.name} insurance in ${state.name}`,
    heroSub: `Build a ${state.name} quote around the menu, equipment, service model, people, property, and off-premises work your ${type.noun} actually has.`,
    stateFacts: [
      {
        title: `Confirm the food-establishment route in ${state.name}`,
        body: state.food.note,
        source: { label: state.food.label, href: state.food.href },
      },
      {
        title: `${type.name} details to send with the request`,
        body: `For a ${state.name} quote, describe ${type.operations}. Include the menu, equipment and fuel, sales split, protection records, property values, staffing, claims, and requested effective date.`,
      },
      ...(wcFact ? [wcFact] : []),
      ...(type.alcoholCommon && stateProfile ? [stateProfile.liquorFact] : []),
    ],
    faqs: [
      {
        q: `What information is needed for ${type.noun} insurance in ${state.name}?`,
        a: `Prepare the current policy if handy, loss runs, menu, cooking and refrigeration equipment, ${state.name} location, sales and payroll, seating and hours, alcohol and delivery details, property values, protection records, lease requirements, and requested effective date.`,
      },
      ...base.faqs.slice(1),
    ],
  };
}

export function restaurantTypeStateLinks(type: RestaurantType, exclude?: string) {
  return RESTAURANT_TYPE_STATES.filter((state) => state.slug !== exclude).map((state) => ({
    label: state.name,
    href: `/insurance/${type.slug}/${state.slug}`,
  }));
}
