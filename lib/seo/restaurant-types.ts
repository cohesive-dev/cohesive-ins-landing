import type { Fact, PageContent } from "./data";
import { getState, STATES } from "./data";
import { CONTRACTOR_STATE_SLUGS } from "./contractor-states";
import { STARTUP_STATES, type StartupState } from "@/lib/guides/states";
import { BOUND_PRICE_DISCLAIMER, boundPriceRows, costAnswer, floorPhrase } from "./restaurant-prices";
import { typeDetail } from "./restaurant-type-details";
import { extraLiquorFact, extraWcFact, stateQuoteFact, stateQuoteRow, stateQuote } from "./restaurant-states";
import { type RestaurantCity, restaurantCitiesIn, RESTAURANT_CITIES, withArticle } from "./restaurant-cities";
import { STATE_CODES } from "@/lib/licenses";

export const RESTAURANT_TYPES_UPDATED = "2026-09-26";

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
  // "stage" pages cover where the business is (opening, growing, buying), not what it cooks.
  kind?: "concept" | "stage";
  // State pages only: the national URL already belongs to an older food-vertical page (bakery).
  stateOnly?: boolean;
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
  {
    slug: "korean-restaurant",
    name: "Korean Restaurant",
    noun: "Korean restaurant",
    alsoCovers: "For Korean BBQ, tabletop grill, and traditional Korean kitchens.",
    operations: "tabletop gas or charcoal grills, table ventilation, frying, soju and beer service, and takeout",
    property: "Tabletop grills, individual ventilation, hoods, refrigeration and tenant improvements should be scheduled individually.",
    driversExtra: ["Tabletop grills and fuel type", "Alcohol share of sales", "Table ventilation and gas shutoffs"],
    coverageFocus: [
      { name: "Guest-facing grills", desc: "Grills at every table put open flame within reach of guests. Describe ventilation, shutoffs and staff procedures." },
    ],
    faq: { q: "How many tabletop grills should I list?", a: "List every grill with its fuel. The count drives both the property schedule and the liability questions." },
    alcoholCommon: true,
  },
  {
    slug: "hibachi-restaurant",
    name: "Hibachi Restaurant",
    noun: "hibachi restaurant",
    alsoCovers: "For teppanyaki and hibachi grill restaurants with tableside chefs.",
    operations: "teppan grills with tableside chefs, open-flame performance cooking, sushi or kitchen lines, and alcohol service",
    property: "Teppan grills, hoods over each grill, suppression, and dining-room improvements should be valued.",
    driversExtra: ["Number of teppan grills", "Chef flame-trick training", "Alcohol share of sales"],
    coverageFocus: [
      { name: "Tableside performance cooking", desc: "Flame and knife work next to guests is the defining exposure. Document grill suppression and chef training." },
    ],
    faq: { q: "Does every teppan grill need suppression?", a: "Carriers expect each cooking surface under the hood and covered by the suppression system, with cleaning on the NFPA 96 schedule." },
    alcoholCommon: true,
  },
  {
    slug: "vietnamese-restaurant",
    name: "Vietnamese Restaurant",
    noun: "Vietnamese restaurant",
    alsoCovers: "For pho shops, banh mi counters, and Vietnamese restaurants.",
    operations: "long-simmered broth, woks and fryers, banh mi prep, takeout, and beer service",
    property: "Stock pots, ranges, fryers, refrigeration and tenant improvements should be described individually.",
    driversExtra: ["Overnight broth cooking", "Fryers and woks", "Takeout share"],
    coverageFocus: [
      { name: "Broth and scald exposure", desc: "Large pots of hot broth are the main kitchen injury and an unattended-cooking question." },
    ],
    faq: { q: "Is a pho shop a limited-cooking risk?", a: "Not if it simmers broth for hours and fries egg rolls. Describe the full line so the class is right." },
  },
  {
    slug: "ramen-restaurant",
    name: "Ramen Restaurant",
    noun: "ramen shop",
    alsoCovers: "For ramen counters and noodle shops.",
    operations: "long-cooked broths, noodle boiling, fryers or flat-tops, counter service, and beer or sake",
    property: "Stock pots, noodle cookers, fryers, refrigeration and improvements should be valued.",
    driversExtra: ["Overnight broth cooking", "Counter seating near hot service", "Fryers"],
    coverageFocus: [
      { name: "Hot broth served over the counter", desc: "Counter seating puts guests close to hot soup handoffs; procedures matter for burn claims." },
    ],
    faq: { q: "Does counter seating matter for a ramen shop quote?", a: "It can. Counter service puts guests close to hot handoffs, so carriers ask about layout and procedures." },
    alcoholCommon: true,
  },
  {
    slug: "steakhouse",
    name: "Steakhouse",
    noun: "steakhouse",
    alsoCovers: "For steakhouses, chophouses, and grill restaurants.",
    operations: "infrared broilers, charbroilers or wood grills, dry-aging, a full bar, and private dining",
    property: "Broilers, walk-ins, aging cabinets, wine and meat inventory, and improvements should be valued at replacement cost.",
    driversExtra: ["Broiler type", "Alcohol share", "Meat and wine inventory value"],
    coverageFocus: [
      { name: "High-value inventory", desc: "Dry-aged beef and wine are valuable stock; schedule them and ask about spoilage." },
    ],
    faq: { q: "Should I insure my meat inventory separately?", a: "It belongs on the property schedule as stock, with spoilage coverage for refrigeration failure." },
    alcoholCommon: true,
  },
  {
    slug: "wing-restaurant",
    name: "Wing Restaurant",
    noun: "wing shop",
    alsoCovers: "For wing shops, wing bars, and takeout wing concepts.",
    operations: "constant frying, sauces, delivery, sports-bar service, and beer",
    property: "Fryers, hoods, suppression, refrigeration and improvements should be described.",
    driversExtra: ["Fryer count", "Alcohol share and sports-bar format", "Delivery share"],
    coverageFocus: [
      { name: "Fryer-heavy menu", desc: "Fryers run all service, which is the main fire exposure carriers price." },
    ],
    faq: { q: "Why does my wing shop's alcohol share matter?", a: "Past about a third of sales, carriers treat it more like a bar; below that it's a fryer-heavy restaurant." },
    alcoholCommon: true,
  },
  {
    slug: "bagel-shop",
    name: "Bagel Shop",
    noun: "bagel shop",
    alsoCovers: "For bagel shops, bagel bakeries, and bagel caf\u00e9s.",
    operations: "boiling and baking bagels, slicing, spreads and sandwiches, coffee, and early production",
    property: "Kettles, ovens, mixers, slicers, refrigeration and improvements should be valued.",
    driversExtra: ["On-site boiling and baking", "Early production", "Catering and wholesale"],
    coverageFocus: [
      { name: "Boiling and baking", desc: "Kettles and ovens create scald and burn exposures before the shop even opens." },
    ],
    faq: { q: "Is a bagel shop a bakery or a restaurant for insurance?", a: "It sits between them. Describe the boiling and baking and the counter service so it's classed correctly." },
  },
  {
    slug: "juice-bar",
    name: "Juice Bar",
    noun: "juice bar",
    alsoCovers: "For juice bars, smoothie shops, and a\u00e7a\u00ed bowl counters.",
    operations: "fresh juicing, blending, produce prep, supplements, and grab-and-go service",
    property: "Juicers, blenders, refrigeration and improvements should be scheduled.",
    driversExtra: ["Unpasteurized juice", "Supplements", "Bottled or wholesale products"],
    coverageFocus: [
      { name: "Fresh and bottled product", desc: "Unpasteurized juice and any bottled product for resale carry product liability questions." },
    ],
    faq: { q: "Does selling bottled juice change my insurance?", a: "It can: bottled product sold through other stores is product liability beyond your counter. Tell the carrier." },
  },
  {
    slug: "bubble-tea-shop",
    name: "Bubble Tea Shop",
    noun: "bubble tea shop",
    alsoCovers: "For boba, bubble tea, and tea-drink shops.",
    operations: "tapioca cooking, tea brewing, blended drinks, snacks, and delivery apps",
    property: "Pearl cookers, sealing machines, refrigeration and improvements should be valued.",
    driversExtra: ["On-site pearl cooking", "Fried snacks", "Delivery apps"],
    coverageFocus: [
      { name: "Pearl cooking and choking warnings", desc: "Boiling pearls is the main burn exposure, and some carriers ask about choking warnings." },
    ],
    faq: { q: "Do bubble tea shops need special insurance?", a: "Mostly standard caf\u00e9 coverage, with attention to pearl cooking and any fried snacks." },
  },
  {
    slug: "caribbean-restaurant",
    name: "Caribbean Restaurant",
    noun: "Caribbean restaurant",
    alsoCovers: "For Jamaican, Trinidadian, Haitian, and other Caribbean restaurants.",
    operations: "jerk grills and smokers, frying, patties, catering, and events",
    property: "Grills, smokers, fryers, refrigeration and improvements should be described.",
    driversExtra: ["Jerk grill fuel and location", "Fryers", "Catering and festivals"],
    coverageFocus: [
      { name: "Solid-fuel jerk grills", desc: "Charcoal and wood grills are open-flame, solid-fuel cooking with clearance questions." },
    ],
    faq: { q: "Can I insure a charcoal jerk grill?", a: "Yes, with documented clearances, ventilation and ash handling." },
    alcoholCommon: true,
  },
  {
    slug: "halal-restaurant",
    name: "Halal Restaurant",
    noun: "halal restaurant",
    alsoCovers: "For halal restaurants, grills, and kebab shops.",
    operations: "grills, vertical broilers, frying, carts or trucks, and late-night service",
    property: "Grills, rotisseries, fryers, refrigeration and any carts should be scheduled.",
    driversExtra: ["Grills and rotisseries", "Carts or trucks", "Late-night hours"],
    coverageFocus: [
      { name: "Carts and trucks", desc: "A cart or truck alongside the storefront needs its own auto and off-premises coverage." },
    ],
    faq: { q: "Does my halal cart go on the restaurant policy?", a: "The liability can extend to it if disclosed; a driven truck still needs commercial auto." },
  },
  {
    slug: "soul-food-restaurant",
    name: "Soul Food Restaurant",
    noun: "soul food restaurant",
    alsoCovers: "For soul food, Southern, and home-style kitchens.",
    operations: "frying, steam tables, cafeteria lines, catering, and church or family events",
    property: "Fryers, steam tables, refrigeration and improvements should be described.",
    driversExtra: ["Fryers", "Steam table holding", "Catering share"],
    coverageFocus: [
      { name: "Catering and repasts", desc: "Off-site catering needs the policy to extend to events and vehicles to be covered." },
    ],
    faq: { q: "Is a cafeteria-style line a different risk?", a: "It adds holding-temperature exposure. Carriers ask about steam-table temperatures and service." },
  },
  {
    slug: "bakery",
    name: "Bakery",
    noun: "bakery",
    alsoCovers: "For retail bakeries, bakery caf\u00e9s, and cake shops.",
    operations: "ovens, mixers, early production, custom orders, wholesale, and caf\u00e9 seating",
    property: "Ovens, mixers, proofers, refrigeration, stock and improvements should be valued.",
    driversExtra: ["Ovens versus fryers", "Wholesale accounts", "Custom orders and allergens"],
    coverageFocus: [
      { name: "Wholesale and custom orders", desc: "Wholesale supply and custom cakes add product and allergen exposure." },
    ],
    faq: { q: "Does a home-based bakery need business insurance?", a: "Yes. A homeowners policy typically excludes business activity, so a home bakery needs its own general liability, including products." },
    stateOnly: true,
  },
  {
    slug: "new-restaurant",
    name: "New Restaurant",
    noun: "new restaurant",
    alsoCovers: "For restaurants opening their first location, pre-opening through the first year.",
    operations: "build-out, equipment delivery, lease requirements, pre-opening staff, and the planned menu and service",
    property: "Tenant improvements, equipment and stock should be insured from possession, not from opening day.",
    driversExtra: ["No loss history", "Owner restaurant experience", "Build-out value and possession date"],
    coverageFocus: [
      { name: "Coverage from possession", desc: "Your improvements and pre-opening liability need coverage from the day you take possession." },
    ],
    faq: { q: "What do insurers want from a brand-new restaurant?", a: "Owner experience, the business plan, the build-out and equipment list, the lease requirements, and the planned menu, hours and alcohol." },
    kind: "stage",
  },
  {
    slug: "growing-restaurant",
    name: "Growing Restaurant",
    noun: "growing restaurant",
    alsoCovers: "For restaurants adding locations, staff, delivery, catering, or alcohol.",
    operations: "new locations, rising payroll, new service lines, and higher contract limits",
    property: "Each location's equipment and improvements should be scheduled separately on one program.",
    driversExtra: ["Number of locations", "Payroll growth", "New alcohol, delivery or catering"],
    coverageFocus: [
      { name: "One program, many locations", desc: "Scheduling locations on one program is usually simpler and cheaper than separate policies." },
    ],
    faq: { q: "When should I tell my insurer about a new location?", a: "Before you take possession of it, so the new address is covered from day one." },
    kind: "stage",
  },
  {
    slug: "buying-a-restaurant",
    name: "Buying a Restaurant",
    noun: "restaurant purchase",
    alsoCovers: "For buyers taking over an existing restaurant.",
    operations: "takeover date, seller's loss history, equipment condition, lease assignment, and liquor license transfer",
    property: "The equipment and improvements you're buying should be valued at replacement cost from the takeover date.",
    driversExtra: ["Seller's loss runs", "Hood and suppression condition", "Liquor license transfer"],
    coverageFocus: [
      { name: "Coverage from takeover", desc: "The seller's policy doesn't transfer; yours has to start the day you take over." },
    ],
    faq: { q: "Do I need insurance before closing on a restaurant?", a: "You need it in force on the takeover date, so start the quote before closing." },
    kind: "stage",
  },
  {
    slug: "ghost-kitchen",
    name: "Ghost Kitchen",
    noun: "ghost kitchen",
    alsoCovers: "For delivery-only kitchens, virtual brands, and commissary tenants.",
    operations: "delivery-only production, virtual brands, shared or commissary kitchens, and delivery apps",
    property: "Your equipment in a shared kitchen needs its own coverage; the facility insures its building.",
    driversExtra: ["Own or shared kitchen", "Number of virtual brands", "Delivery apps and drivers"],
    coverageFocus: [
      { name: "Shared-kitchen contracts", desc: "Commissary agreements set required limits and additional insureds; bring the contract." },
    ],
    faq: { q: "Can one policy cover several virtual brands?", a: "Usually, if every brand is listed on the application." },
    kind: "stage",
  },
  {
    slug: "restaurant-delivery",
    name: "Restaurant Delivery",
    noun: "restaurant with delivery",
    alsoCovers: "For restaurants adding or running their own delivery.",
    operations: "own drivers, personal vehicles, business-owned vehicles, delivery radius, and third-party apps",
    property: "Business-owned delivery vehicles need a commercial auto policy; the restaurant policy doesn't cover them.",
    driversExtra: ["Own drivers versus apps", "Personal versus business vehicles", "Delivery share of sales"],
    coverageFocus: [
      { name: "Drivers' vehicles", desc: "Hired and non-owned auto covers the business when staff deliver in their own cars." },
    ],
    faq: { q: "Does restaurant insurance cover delivery?", a: "Not the vehicles. Add hired and non-owned auto, and commercial auto for any vehicle the business owns." },
    kind: "stage",
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

export function getRestaurantTypeNational(slug: string) {
  return RESTAURANT_TYPES.find((type) => type.slug === slug && !type.stateOnly);
}

export function getRestaurantTypeState(slug: string) {
  return RESTAURANT_TYPE_STATES.find((state) => state.slug === slug);
}

function commonContent(type: RestaurantType): Omit<PageContent, "title" | "metaDescription" | "heroH1" | "heroSub" | "stateFacts"> {
  const detail = typeDetail(type.slug);
  return {
    reviewedOn: RESTAURANT_TYPES_UPDATED,
    alsoCovers: type.alsoCovers,
    // Answer-first: the searcher asked what it costs, so the real bound price leads (Kevin 2026-09-26).
    costNarrative: [
      costAnswer(type.noun, type.slug),
      `A useful ${type.noun} quote starts with the real operation: ${type.operations}. ${type.property}`,
    ],
    costDisclaimer: BOUND_PRICE_DISCLAIMER,
    costRows: [
      ...boundPriceRows(type.slug),
      { coverage: "Liquor, auto, and umbrella", range: "As applicable", note: "Each is priced on its own exposure; a restaurant package does not automatically include every line." },
    ],
    priceDrivers: [
      "Annual sales, payroll, seating, square footage, hours, years in business, and loss history",
      "Menu, cooking equipment, fuel, hood and suppression, cleaning, and fire inspection details",
      ...type.driversExtra,
      "Building or tenant-property values, refrigeration, equipment, spoilage, and requested deductibles",
    ],
    coverages: [
      ...(detail?.risks ?? []),
      ...type.coverageFocus,
      { name: "General liability and products", desc: "Customer injury, foodborne illness, allergens, premises, delivery and catering, checked against what you actually do." },
      { name: "Property and business income", desc: "Equipment, contents, stock, improvements and lost income after a covered loss. Compare valuation, deductibles, spoilage and restoration time." },
    ],
    faqs: [
      { q: `How much does ${type.noun} insurance cost?`, a: costAnswer(type.noun, type.slug) },
      ...(detail && detail.faq.q !== type.faq.q ? [detail.faq] : []),
      type.faq,
      {
        q: `What information should ${withArticle(type.noun)} gather for a quote?`,
        a: "Start with the current policy if handy, loss runs, menu, equipment list, sales split, payroll, hours, seating, square footage, alcohol and delivery details, property values, hood and suppression records, lease requirements, and requested effective date. Estimates are fine when labeled as estimates.",
      },
      {
        q: `Will the policy meet my landlord's lease requirements?`,
        a: "Usually, for the most common request: $1,000,000 per occurrence and $2,000,000 aggregate in general liability, the landlord named as an additional insured, and a certificate of insurance. Send the insurance section of your lease with the quote request so the limits, additional insured wording, damage to rented premises, liquor and umbrella limits can be checked against it before you buy.",
      },
    ],
  };
}

// The questions an underwriter asks this concept - unique per type, so pages don't read alike.
function questionsFact(type: RestaurantType, where?: string): Fact[] {
  const detail = typeDetail(type.slug);
  if (!detail) return [];
  return [{
    title: `What an underwriter will ask ${withArticle(type.noun)}${where ? ` in ${where}` : ""}`,
    body: detail.questions.join(" "),
  }];
}

export function buildRestaurantTypeNational(type: RestaurantType): PageContent {
  return {
    title: `${type.name} Insurance: Liability From ${floorPhrase()}`,
    metaDescription: `Real bound prices: restaurant liability from ${floorPhrase()}, workers' comp from $509/yr. What drives ${withArticle(type.noun)} quote and what underwriters ask.`,
    heroH1: `${type.name} insurance`,
    heroSub: `Build a quote around the menu, equipment, service model, people, property, and off-premises work your ${type.noun} actually has.`,
    ...commonContent(type),
    stateFacts: [
      {
        title: `Describe the ${type.noun}, not just the category`,
        body: `Tell the underwriter about ${type.operations}. Send the menu and equipment list and separate sales by dine-in, takeout, delivery, catering, alcohol, retail, or wholesale when those operations apply.`,
      },
      ...questionsFact(type),
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
    title: `${type.name} Insurance in ${state.name}: From ${floorPhrase()}`,
    metaDescription: `${state.name} ${type.noun} insurance with real bound prices: restaurant liability from ${floorPhrase()}, workers' comp from $509/yr. What ${state.name} underwriters ask.`,
    heroH1: `${type.name} insurance in ${state.name}`,
    heroSub: `Build ${withArticle(state.name)} quote around the menu, equipment, service model, people, property, and off-premises work your ${type.noun} actually has.`,
    costNarrative: stateQuote(state.name)
      ? [base.costNarrative[0], `In ${state.name}, our lowest restaurant quote so far is $${stateQuote(state.name)!.usd.toLocaleString("en-US")} a year for ${stateQuote(state.name)!.line}.`, ...base.costNarrative.slice(1)]
      : base.costNarrative,
    costRows: [...base.costRows.slice(0, 2), ...stateQuoteRow(state.name), ...base.costRows.slice(2)],
    stateFacts: [
      ...stateQuoteFact(state.name),
      {
        title: `Confirm the food-establishment route in ${state.name}`,
        body: state.food.note,
        source: { label: state.food.label, href: state.food.href },
      },
      {
        title: `${type.name} details to send with the request`,
        body: `For ${withArticle(state.name)} quote, describe ${type.operations}. Include the menu, equipment and fuel, sales split, protection records, property values, staffing, claims, and requested effective date.`,
      },
      ...questionsFact(type, state.name),
      ...(wcFact ? [wcFact] : extraWcFact(state.slug, state.name)),
      ...(type.alcoholCommon || type.slug === "restaurant"
        ? (stateProfile ? [stateProfile.liquorFact] : extraLiquorFact(state.slug, state.name))
        : []),
    ],
    faqs: [
      {
        q: `What information is needed for ${type.noun} insurance in ${state.name}?`,
        a: `Prepare the current policy if handy, loss runs, menu, cooking and refrigeration equipment, ${state.name} location, sales and payroll, seating and hours, alcohol and delivery details, property values, protection records, lease requirements, and requested effective date.`,
      },
      ...base.faqs,
    ],
  };
}

export function restaurantTypeStateLinks(type: RestaurantType, exclude?: string) {
  return RESTAURANT_TYPE_STATES.filter((state) => state.slug !== exclude).map((state) => ({
    label: state.name,
    href: `/insurance/${type.slug}/${state.slug}`,
  }));
}

// General restaurant pages for licensed states that have no hand-profiled restaurant page yet
// (Kevin 2026-09-26). The 26 profiled states keep /insurance/restaurant/{state} from data.ts; the
// rest get the same page shape as a concept page, with the state's official food-establishment
// source, so "{state} restaurant insurance" lands on a restaurant page instead of a pizzeria page.
export const GENERIC_RESTAURANT: RestaurantType = {
  slug: "restaurant",
  name: "Restaurant",
  noun: "restaurant",
  alsoCovers: "For full-service, quick-service, counter, café, and takeout restaurants.",
  operations: "the menu and cooking line, seating and hours, alcohol, delivery, catering, and staff",
  property: "Kitchen equipment, refrigeration, furniture, tenant improvements and stock should be valued at replacement cost.",
  driversExtra: ["Cooking class: fryers and open flame versus limited cooking", "Alcohol share of sales", "Delivery and catering"],
  coverageFocus: [
    { name: "Liquor liability", desc: "If you serve alcohol, liquor liability is priced off your share of alcohol sales and is required by most leases." },
  ],
  faq: { q: "What insurance does a restaurant need?", a: "Most need general liability and property (often together as a businessowners policy), workers' comp once they have employees, liquor liability if they serve alcohol, and hired and non-owned auto if staff deliver." },
};

const PROFILED = new Set(STATES.map((st) => st.slug));
export const RESTAURANT_EXTRA_STATES: RestaurantTypeState[] = RESTAURANT_TYPE_STATES.filter((st) => !PROFILED.has(st.slug));

export function isExtraRestaurantState(slug: string) {
  return RESTAURANT_EXTRA_STATES.some((st) => st.slug === slug);
}

export function buildGenericRestaurantState(state: RestaurantTypeState): PageContent {
  return buildRestaurantTypeState(GENERIC_RESTAURANT, state);
}

// Every licensed restaurant state, profiled or not, for cross-links.
export function allRestaurantStateLinks(exclude?: string) {
  return RESTAURANT_TYPE_STATES.filter((st) => st.slug !== exclude).map((st) => ({
    label: st.name,
    href: `/insurance/restaurant/${st.slug}`,
  }));
}

// City pages: /insurance/{type}/{state}/{city} (Kevin 2026-09-26). Built on the state page, with the
// city's own permitting authority first - the one fact that genuinely differs city to city.
export function buildRestaurantTypeCity(type: RestaurantType, city: RestaurantCity): PageContent | undefined {
  const state = getRestaurantTypeState(city.stateSlug);
  if (!state) return undefined;
  const base = buildRestaurantTypeState(type, state);
  const abbr = STATE_CODES[state.name] ?? "";
  return {
    ...base,
    title: `${type.name} Insurance in ${city.name}, ${abbr}: From ${floorPhrase()}`,
    metaDescription: `${city.name} ${type.noun} insurance with real bound prices: restaurant liability from ${floorPhrase()}, workers' comp from $509/yr. Who permits restaurants in ${city.name} and what underwriters ask.`,
    heroH1: `${type.name} insurance in ${city.name}`,
    heroSub: `Build ${withArticle(city.name)} quote around the menu, equipment, service model, people, property, and off-premises work your ${type.noun} actually has.`,
    // City pages carry the city's own facts. State-wide rules (workers' comp, liquor, the state
    // food regulator, our state quote) live on the state page and are linked, not repeated: repeating
    // them made same-state city pages 84% identical, against 36-63% for the trade city pages that rank.
    stateFacts: [
      { title: `Who permits restaurants in ${city.name}`, body: city.fact, source: city.authority },
      {
        title: `Opening or renewing in ${city.name}`,
        body: city.checklist.join(" "),
        source: city.local ?? city.authority,
      },
      ...questionsFact(type, city.name),
      {
        title: `${state.name} rules that also apply`,
        body: `Workers' comp, liquor licensing and the state food code are set at the ${state.name} level. See the ${state.name} ${type.noun} insurance page for those, and for what we've quoted restaurants across ${state.name}.`,
      },
    ],
    faqs: [
      { q: `Who issues restaurant permits in ${city.name}?`, a: city.fact },
      { q: `How much does ${type.noun} insurance cost in ${city.name}?`, a: costAnswer(type.noun, type.slug) },
      ...base.faqs.filter((f) => !/how much|cost/i.test(f.q) && !f.q.includes(state.name)),
    ],
  };
}

export function restaurantTypeCityLinks(type: RestaurantType, stateSlug: string, excludeCity?: string) {
  return restaurantCitiesIn(stateSlug).filter((c) => c.slug !== excludeCity).map((c) => ({
    label: `${c.name}`,
    href: `/insurance/${type.slug}/${c.stateSlug}/${c.slug}`,
  }));
}

// Every concept that gets city pages: the general restaurant page plus every type.
export const RESTAURANT_CITY_TYPES: RestaurantType[] = [GENERIC_RESTAURANT, ...RESTAURANT_TYPES];

export function getRestaurantCityType(slug: string) {
  return RESTAURANT_CITY_TYPES.find((t) => t.slug === slug);
}

export { RESTAURANT_CITIES };
