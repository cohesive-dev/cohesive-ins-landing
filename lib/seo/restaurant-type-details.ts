// Concept-specific underwriting detail for every restaurant type and stage page (Kevin 2026-09-26).
//
// Why this file exists: cuisine pages shared about half their text with each other and state
// pages about two-thirds. Ranking analysis showed our pages only win where they say something
// the competing pages don't. Each entry below is what an underwriter actually asks about THAT
// concept - equipment, standards, exposures - so no two pages read alike.
//
// Standards named here are real and stable: NFPA 96 (commercial kitchen ventilation and hood
// cleaning), UL 300 (wet-chemical fire suppression over cooking lines), Class K extinguishers
// (cooking-oil fires), and the FDA Food Code consumer advisory for raw or undercooked foods.
// Nothing here states carrier eligibility or a price; prices come only from restaurant-prices.ts.

export type TypeDetail = {
  risks: { name: string; desc: string }[];
  questions: string[];
  faq: { q: string; a: string };
};

const HOOD =
  "Hood and duct cleaning on the schedule NFPA 96 sets for your cooking volume, a UL 300 wet-chemical suppression system over the line, and a Class K extinguisher near the fryers.";

export const TYPE_DETAILS: Record<string, TypeDetail> = {
  "chinese-restaurant": {
    risks: [
      { name: "Wok ranges and high-BTU cooking", desc: `Wok burners run far hotter than a standard range and throw grease into the hood. Underwriters want to see ${HOOD}` },
      { name: "Hibachi or tableside cooking", desc: "If a chef cooks in front of guests, say so. Flames and hot surfaces within reach of customers are a separate liability exposure from a closed kitchen." },
      { name: "Buffet holding and delivery", desc: "Food held on a buffet line and long delivery runs raise foodborne-illness exposure, and delivery drivers using their own cars need hired and non-owned auto coverage." },
    ],
    questions: ["How many wok burners, and what BTU?", "When was the hood last cleaned, and by whom?", "Is there a UL 300 suppression system?", "Buffet, dine-in, takeout, delivery: what share of sales each?", "Do drivers use their own vehicles?"],
    faq: { q: "Why do some carriers decline Chinese restaurants?", a: "Usually it's the cooking line, not the cuisine. High-BTU wok stations with an old hood, overdue duct cleaning, or no UL 300 system read as a fire risk. Current cleaning certificates and a suppression inspection tag fix most of those declines." },
  },
  "coffee-shop": {
    risks: [
      { name: "Hot-liquid burns", desc: "Spilled coffee and tea are the most common coffee-shop injury claim. Lids, handoff procedures and counter layout all matter to the carrier." },
      { name: "Espresso equipment and water", desc: "Espresso machines are expensive and plumbed in. A failed line or machine can flood the space and stop sales, which is where equipment breakdown and business income coverage earn their keep." },
      { name: "Seating, laptops, and slips", desc: "Long-stay seating, power cords and wet floors near the bar create premises claims that a grab-and-go counter doesn't have." },
    ],
    questions: ["Any cooking beyond pastries: toasters, panini presses, ovens?", "Drive-through or walk-up window?", "How many seats, and hours?", "Value of espresso machines and grinders?", "Do you sell beans or merchandise wholesale?"],
    faq: { q: "Does a coffee shop need workers' comp for a barista?", a: "In most states, yes, once you have employees; the head-count threshold varies by state. Baristas file burn and repetitive-strain claims, and workers' comp is priced on payroll, so a small café pays far less than a full-service restaurant." },
  },
  pizzeria: {
    risks: [
      { name: "Delivery drivers", desc: "Delivery is the single biggest pizzeria exposure. Drivers in their own cars need hired and non-owned auto liability; a crash on a delivery run otherwise lands on the business with no auto policy behind it." },
      { name: "Wood-fired, coal-fired, and deck ovens", desc: "Solid-fuel ovens have their own NFPA 96 venting and spark-arrester rules and are rated differently from gas deck or conveyor ovens. Tell the carrier which you run." },
      { name: "Dough equipment injuries", desc: "Mixers, sheeters and slicers cause hand injuries. Guards and training show up in the workers' comp price." },
    ],
    questions: ["What type of oven: gas deck, conveyor, wood or coal?", "What share of sales is delivery, and do drivers use their own cars?", "Beer and wine service?", "Seating count and hours?", "Any third-party delivery apps?"],
    faq: { q: "Do I need commercial auto for pizza delivery?", a: "If the business owns the delivery car, yes. If drivers use their own, you need hired and non-owned auto liability, which is usually an inexpensive add-on to the restaurant policy and covers the business when a driver's personal policy doesn't respond." },
  },
  "mexican-restaurant": {
    risks: [
      { name: "Flat-tops, fryers, and charbroilers", desc: `Tortilla chips, carnitas and grilled meats mean fryers and open flame. Carriers price a full cooking line above a counter operation and expect ${HOOD}` },
      { name: "Margaritas and liquor share", desc: "Alcohol as a share of sales moves the price more than almost anything else. A cantina at 40% alcohol is rated like a bar; a family restaurant at 10% is not." },
      { name: "Salsa bars and self-serve", desc: "Self-serve salsa and toppings bars add temperature-control and contamination exposure. Sneeze guards and holding temperatures are what the carrier asks about." },
    ],
    questions: ["What share of sales is alcohol?", "Fryers and charbroilers on the line?", "Self-serve salsa or toppings bar?", "Catering or events off-site?", "Seating, hours, and annual sales?"],
    faq: { q: "Does serving margaritas change my restaurant insurance?", a: "Yes. Once alcohol passes roughly a third of sales, most standard restaurant programs step back and it's written as a higher-alcohol risk. Under that line, liquor liability is usually a modest add-on." },
  },
  "indian-restaurant": {
    risks: [
      { name: "Tandoor ovens", desc: "Tandoors run at very high temperatures and may burn charcoal or gas. Charcoal is solid fuel, with its own venting and clearance requirements; tell the carrier which you use." },
      { name: "Deep frying", desc: `Samosas, pakoras and puris mean fryers, which carriers want to see protected: ${HOOD}` },
      { name: "Buffets and holding temperatures", desc: "Lunch buffets and long-held curries raise foodborne-illness exposure. Holding-temperature logs are good evidence to have on hand." },
    ],
    questions: ["Tandoor fuel: charcoal or gas?", "Fryers on the line?", "Lunch buffet?", "Alcohol service and share of sales?", "Catering for weddings or events?"],
    faq: { q: "Is a tandoor oven a problem for insurance?", a: "Not usually, if it's installed and vented properly. Carriers want to know the fuel, the clearances, and that the hood and suppression cover it. A charcoal tandoor is solid-fuel cooking and gets more scrutiny than gas." },
  },
  "sushi-restaurant": {
    risks: [
      { name: "Raw fish and foodborne illness", desc: "Serving raw fish triggers the FDA Food Code consumer advisory and raises product liability exposure: parasites, scombroid and contamination claims. Supplier records and freezing logs are the evidence carriers value." },
      { name: "Knife work", desc: "Constant fine knife work means lacerations are the main workers' comp exposure, and sharpening, gloves and training bring that cost down." },
      { name: "Refrigeration and spoilage", desc: "A sushi case full of fish is high-value, perishable stock. Spoilage coverage for a refrigeration failure is worth asking about specifically." },
    ],
    questions: ["Do you post a consumer advisory for raw fish?", "Fish suppliers and parasite-destruction freezing?", "Any hibachi or cooked line?", "Sake, beer, or full bar?", "Value of refrigerated stock?"],
    faq: { q: "Does serving raw fish make sushi insurance more expensive?", a: "It adds product-liability exposure that a cooked menu doesn't have, but it's standard for carriers that write restaurants. Documented suppliers, freezing logs and a posted consumer advisory keep it routine." },
  },
  "thai-restaurant": {
    risks: [
      { name: "Wok cooking and fryers", desc: `Stir-fry woks and deep fryers run hot and grease-heavy. Carriers look for ${HOOD}` },
      { name: "Peanut and shellfish allergens", desc: "Peanuts, shellfish and fish sauce appear across a Thai menu. Allergen reactions are product-liability claims, and clear menu labelling plus kitchen procedures are the defense." },
      { name: "Takeout and delivery volume", desc: "Heavy takeout and delivery shift exposure to packaging, holding times, and drivers' vehicles." },
    ],
    questions: ["Woks and fryers on the line?", "How do you label allergens?", "Delivery share of sales, own drivers or apps?", "Alcohol service?", "Seating and hours?"],
    faq: { q: "Do allergen claims fall under restaurant liability?", a: "Generally yes: an allergic reaction to food you served is a products claim under general liability. Carriers still want to see allergen labelling and kitchen procedures, because they're what makes a claim defensible." },
  },
  "italian-restaurant": {
    risks: [
      { name: "Wood-fired pizza and open flame", desc: "Wood-fired ovens and grills are solid-fuel cooking with their own NFPA 96 venting rules. Gas-only kitchens are rated differently." },
      { name: "Wine and full-bar service", desc: "Italian restaurants often carry a real wine list. Alcohol share of sales, bar seating and service hours set the liquor liability price." },
      { name: "Pasta boilers and burns", desc: "Boiling water and hot pans make scald burns a leading staff injury. Workers' comp pricing follows kitchen payroll." },
    ],
    questions: ["Wood-fired oven or gas only?", "Alcohol share of sales, and is there a bar?", "Private events or catering?", "Seating, hours, and sales?", "Do you own the building?"],
    faq: { q: "Does a wine list mean I need liquor liability?", a: "Yes, if you serve alcohol. Most leases require it, and in states with dram shop laws a single over-service claim can exceed a restaurant's general liability limit. For a restaurant where wine is a modest share of sales, it's usually an affordable add-on." },
  },
  "mediterranean-restaurant": {
    risks: [
      { name: "Vertical rotisseries and open grills", desc: "Gyro and shawarma broilers and charcoal grills are open-flame cooking with grease. Carriers want the rotisseries under the hood and the suppression system covering them." },
      { name: "Fryers", desc: `Falafel and fries mean fryers on the line; expect questions about ${HOOD}` },
      { name: "Hookah or late hours", desc: "Hookah service or late-night hours change the risk considerably and should be disclosed up front; many restaurant programs treat hookah separately." },
    ],
    questions: ["Vertical rotisseries under the hood?", "Charcoal or gas grills?", "Fryers?", "Hookah service or late-night hours?", "Alcohol service?"],
    faq: { q: "Does a gyro or shawarma machine affect my quote?", a: "It can. A vertical broiler is open-flame, grease-producing equipment, so carriers check it's under the hood and covered by suppression. Properly installed, it's routine." },
  },
  "barbecue-restaurant": {
    risks: [
      { name: "Smokers and solid fuel", desc: "Wood and charcoal smokers are solid-fuel cooking. Carriers want to know where they sit (indoors under a hood, or outdoors), clearances from the building, and ash handling." },
      { name: "Overnight cooks", desc: "Long unattended smokes run overnight in a lot of BBQ joints. Tell the carrier; unattended solid-fuel cooking is a fire question they will ask." },
      { name: "Catering and events", desc: "BBQ caters heavily. Off-site events need the liability policy to extend there, and trailers or smokers taken on the road raise auto and property questions." },
    ],
    questions: ["Smoker fuel and location: indoor or outdoor?", "Any unattended overnight cooking?", "Catering share of sales, and do you tow a smoker?", "Alcohol service?", "Seating and hours?"],
    faq: { q: "Do outdoor smokers change BBQ restaurant insurance?", a: "Yes. Carriers look at the distance from the building, what's underneath, ash disposal and whether it runs unattended. A well-placed outdoor smoker with clearances documented is usually fine." },
  },
  "seafood-restaurant": {
    risks: [
      { name: "Raw bars and shellfish", desc: "Raw oysters and clams carry a Vibrio and contamination exposure, and the FDA Food Code consumer advisory applies. Shellfish tags and supplier records are the evidence carriers want." },
      { name: "Fryers", desc: `Fried seafood means heavy fryer use: ${HOOD}` },
      { name: "Live tanks and refrigeration", desc: "Lobster tanks and seafood cases are valuable, perishable stock, so spoilage and equipment-breakdown coverage matter." },
    ],
    questions: ["Raw bar or raw shellfish?", "How many fryers?", "Live tanks and value of seafood stock?", "Waterfront or outdoor deck seating?", "Alcohol share of sales?"],
    faq: { q: "Does a raw oyster bar affect insurance?", a: "It adds product-liability exposure. Keeping shellfish tags, buying from certified sources and posting the consumer advisory make it a routine risk for carriers that write seafood restaurants." },
  },
  "breakfast-restaurant": {
    risks: [
      { name: "Griddles and early hours", desc: "Flat-top griddles run continuously through service. Early opening means the first staff arrive in the dark; parking-lot and entrance lighting come up in premises claims." },
      { name: "High table turnover", desc: "Busy brunch service means crowded floors, hot plates and coffee refills: slip and burn claims are the main exposure." },
      { name: "Mimosas and brunch alcohol", desc: "If you serve mimosas or a brunch cocktail list, that's liquor liability, even at a low alcohol share." },
    ],
    questions: ["Griddles, fryers, or both?", "Hours: breakfast only, or lunch too?", "Brunch alcohol service?", "Seating and weekend covers?", "Catering?"],
    faq: { q: "Is a breakfast diner cheaper to insure than a dinner restaurant?", a: "Often, if there's little frying and little or no alcohol. Griddle-and-coffee operations sit in a lower cooking class than a full fry line, and short hours help. Brunch cocktails change that." },
  },
  deli: {
    risks: [
      { name: "Meat slicers", desc: "Slicers cause the most serious deli staff injuries. Guards, cut gloves and training show up directly in the workers' comp price." },
      { name: "Limited cooking", desc: "A deli with no fryer or open flame sits in a lower cooking class than a full restaurant, which is why sandwich shops are among the least expensive food businesses we place." },
      { name: "Refrigerated cases and spoilage", desc: "Meat, cheese and prepared foods are perishable stock; spoilage coverage for a cooler failure is worth asking about." },
    ],
    questions: ["Any cooking: fryers, grills, panini presses?", "How many slicers, and are guards in place?", "Catering platters or delivery?", "Beer and wine?", "Value of refrigerated stock?"],
    faq: { q: "How cheap can deli insurance be?", a: "Our lowest bound sandwich shop policies are general liability at $749 a year and workers' comp at $509 a year. Limited cooking is the reason. Fryers, alcohol or high sales move it up." },
  },
  "fast-food-restaurant": {
    risks: [
      { name: "Fryers and volume", desc: `Quick-service kitchens fry constantly at high volume. Carriers expect ${HOOD}` },
      { name: "Drive-through lanes", desc: "Drive-throughs add vehicle traffic next to the building: cars striking the building, the menu board, or pedestrians. Mention it; it's a distinct exposure." },
      { name: "Late-night hours and staff", desc: "Late hours, cash handling and young staff shape both premises security and workers' comp. Security measures and training are worth documenting." },
    ],
    questions: ["Fryers and how many?", "Drive-through lane?", "Hours, including late-night?", "Staff count and payroll?", "Franchise or independent?"],
    faq: { q: "Do franchise restaurants need specific insurance?", a: "Franchise agreements usually spell out required limits, additional-insured wording and sometimes approved carriers. Send the insurance section of the agreement with your quote request so the policy matches it the first time." },
  },
  "fine-dining-restaurant": {
    risks: [
      { name: "Wine cellar and alcohol share", desc: "A serious wine list is both valuable stock and a liquor liability exposure. Cellar value belongs on the property schedule, and alcohol share sets the liquor price." },
      { name: "Tableside cooking and flambé", desc: "Tableside flambé and carving put flame and knives next to guests. Disclose it; it's a different exposure from a closed kitchen." },
      { name: "High-value build-out", desc: "Fine-dining interiors, custom millwork and equipment are expensive to replace. Insure improvements at replacement cost and check business income is long enough for a real rebuild." },
    ],
    questions: ["Value of the wine cellar?", "Alcohol share of sales?", "Tableside flambé or open-flame service?", "Private dining and events?", "Value of tenant improvements?"],
    faq: { q: "How do I insure a restaurant wine cellar?", a: "List the wine as stock on the property schedule at replacement cost, and ask how spoilage and temperature-control failure are treated. Valuable single bottles may need a scheduled limit." },
  },
  "ice-cream-shop": {
    risks: [
      { name: "Freezers and spoilage", desc: "The whole inventory depends on freezers. A power cut or compressor failure can wipe out stock, so spoilage and equipment breakdown matter more here than for most food businesses." },
      { name: "Dairy and allergens", desc: "Dairy, nuts and mix-ins make allergen labelling and cross-contact procedures the main product-liability defense." },
      { name: "Seasonal staffing", desc: "Seasonal and young staff affect workers' comp and training. Payroll swings through the year, and some policies are audited on actual payroll." },
    ],
    questions: ["Do you make ice cream on site, or buy it in?", "Freezer and equipment values?", "Seasonal or year-round?", "Staff count at peak?", "Catering, trucks, or wholesale?"],
    faq: { q: "Does an ice cream shop need spoilage coverage?", a: "It's one of the most useful add-ons for an ice cream shop, because the inventory is only good while the freezers run. Ask how the policy treats utility outages as well as equipment failure." },
  },
  "vegan-restaurant": {
    risks: [
      { name: "Nut and soy allergens", desc: "Vegan menus lean heavily on nuts, soy and seeds. Allergen labelling and cross-contact controls are the main product-liability defense." },
      { name: "Menu claims", desc: "Claims like 'allergen-free' or 'gluten-free' create exposure if a guest reacts. Say what the kitchen actually controls." },
      { name: "Cooking line", desc: "Many vegan kitchens run limited cooking, which rates lower than a full fry line. Tell the carrier what equipment you really use." },
    ],
    questions: ["Fryers or open flame?", "How are allergens labelled?", "Any gluten-free or allergen-free menu claims?", "Alcohol service?", "Retail or packaged products?"],
    faq: { q: "Is a vegan restaurant cheaper to insure?", a: "It can be, if the cooking is limited: less frying and no charbroiling sit in a lower cooking class. The allergen exposure from nuts and soy is the thing to manage carefully." },
  },
  "fried-chicken-restaurant": {
    risks: [
      { name: "Pressure fryers and open fryers", desc: `Fryers are the core of the operation and the core fire exposure. Carriers expect ${HOOD}` },
      { name: "Oil handling and burns", desc: "Filtering and disposing of hot oil is where many staff burns happen. Filtration equipment and procedures reduce workers' comp claims." },
      { name: "Drive-through and volume", desc: "High-volume counter and drive-through service add premises and vehicle exposures." },
    ],
    questions: ["How many fryers, and pressure or open?", "Oil filtration method?", "Drive-through?", "Hours and staff count?", "Catering or delivery?"],
    faq: { q: "Why is fried chicken rated higher than other restaurants?", a: "Heavy frying is the leading cause of restaurant kitchen fires, so fryer-heavy menus sit in a higher cooking class. A current suppression inspection and hood cleaning records narrow the gap." },
  },
  "burger-restaurant": {
    risks: [
      { name: "Flat-tops, charbroilers, and fryers", desc: `Burgers and fries mean grease on the flat-top and fryers on the line: ${HOOD}` },
      { name: "Counter service and volume", desc: "Counter-service burger shops see crowded floors and spills; premises claims are the main liability exposure." },
      { name: "Beer and shakes", desc: "Beer service means liquor liability, even at a low share of sales." },
    ],
    questions: ["Charbroiler, flat-top, or both?", "How many fryers?", "Counter service or table service?", "Beer or full bar?", "Delivery share?"],
    faq: { q: "Does a charbroiler change burger restaurant insurance?", a: "It can. Charbroiling produces more grease and flame than a flat-top, so carriers check the hood, duct cleaning and suppression. Documented maintenance keeps it standard." },
  },
  "donut-shop": {
    risks: [
      { name: "Fryers and early production", desc: `Frying starts before dawn, often with a small crew. Carriers ask about ${HOOD}` },
      { name: "Unattended processes", desc: "Proofers and fryers running while staff are away from the line is a fire question; disclose any unattended production." },
      { name: "Wholesale accounts", desc: "Supplying cafés or stores adds product liability and sometimes contract requirements from the buyer." },
    ],
    questions: ["How many fryers?", "What time does production start, and with how many staff?", "Any unattended processes?", "Wholesale customers?", "Coffee service?"],
    faq: { q: "Is a donut shop insured like a bakery?", a: "Not quite: frying puts it in a higher cooking class than a bakery that only uses ovens. Wholesale accounts and early unattended production also come up." },
  },
  // ---- added types (Kevin 2026-09-26: every concept, in bulk) ----
  "korean-restaurant": {
    risks: [
      { name: "Tabletop grills", desc: "Korean BBQ puts a gas or charcoal grill at every table, with its own ventilation. That's open flame within reach of guests and a distinct exposure from a closed kitchen." },
      { name: "Soju and alcohol share", desc: "Korean BBQ often has a real alcohol share. It sets the liquor liability price and can move the whole risk." },
      { name: "Kitchen frying", desc: `Fried chicken and pancakes add fryers to the line: ${HOOD}` },
    ],
    questions: ["Tabletop grills: gas or charcoal, and how many?", "Individual table ventilation?", "Alcohol share of sales?", "Fryers?", "Seating and hours?"],
    faq: { q: "Can Korean BBQ restaurants get insured with tabletop grills?", a: "Yes. Carriers that write them look at the grill type, the table ventilation, gas shutoffs and staff training. Charcoal gets more scrutiny than gas." },
  },
  "hibachi-restaurant": {
    risks: [
      { name: "Teppanyaki flames next to guests", desc: "Hibachi chefs cook with open flame and knife tricks inches from customers. That tableside exposure is the first thing a carrier asks about." },
      { name: "Grill ventilation and suppression", desc: "Each teppan grill needs hood coverage and suppression, with cleaning on the NFPA 96 schedule." },
      { name: "Birthday parties and alcohol", desc: "Celebrations, sake and cocktails raise the alcohol share and crowd exposure." },
    ],
    questions: ["How many teppan grills?", "Are all grills under the hood and suppression?", "Chef training on flame tricks?", "Alcohol share of sales?", "Seating per grill?"],
    faq: { q: "Is a hibachi restaurant harder to insure?", a: "It's specialized rather than hard. The tableside flame is a known exposure, so carriers want grill suppression, hood cleaning records and chef training documented." },
  },
  "vietnamese-restaurant": {
    risks: [
      { name: "Broth pots and burns", desc: "Pho stock simmers in large pots for hours. Scalds from moving or ladling broth are the main kitchen injury, so workers' comp pricing follows that." },
      { name: "Overnight simmering", desc: "Stock left simmering overnight is unattended cooking. Tell the carrier how it's managed." },
      { name: "Fryers and woks", desc: `Egg rolls and stir-fries add fryers and woks: ${HOOD}` },
    ],
    questions: ["Is broth simmered unattended overnight?", "Fryers and woks on the line?", "Takeout and delivery share?", "Beer or wine?", "Seating and hours?"],
    faq: { q: "Does simmering pho broth overnight affect insurance?", a: "It can. Unattended cooking is a fire question, so carriers ask how the pots are managed overnight. Low-heat equipment designed for it, and a documented procedure, help." },
  },
  "ramen-restaurant": {
    risks: [
      { name: "Long-simmered stock", desc: "Tonkotsu and other broths cook for many hours, sometimes overnight. Unattended cooking and large-pot burns are the exposures to explain." },
      { name: "Fryers", desc: `Karaage and gyoza add fryers or flat-tops: ${HOOD}` },
      { name: "Counter seating", desc: "Guests seated at the counter sit close to hot broth being served. Handoff procedures matter for burn claims." },
    ],
    questions: ["Overnight or unattended broth cooking?", "Fryers or flat-tops?", "Counter seating?", "Alcohol service?", "Takeout share?"],
    faq: { q: "What makes ramen shop insurance different?", a: "The long broth cook and the hot soup served across a counter. Carriers ask about unattended cooking and scald exposure; everything else looks like a small restaurant." },
  },
  steakhouse: {
    risks: [
      { name: "Charbroilers and high-heat grills", desc: `Steakhouses run infrared broilers and charbroilers at extreme heat: ${HOOD}` },
      { name: "Full bar and wine", desc: "Steakhouses usually carry a significant alcohol share. It drives the liquor liability price and sometimes the whole program." },
      { name: "Dry-aging and meat inventory", desc: "Dry-aged beef in walk-ins is high-value stock. Spoilage and equipment breakdown coverage protect it." },
    ],
    questions: ["Broiler type: infrared, charbroiler, or wood?", "Alcohol share and bar seating?", "Value of meat inventory and dry-aging?", "Private dining?", "Seating and sales?"],
    faq: { q: "Does a full bar change steakhouse insurance?", a: "Yes. Alcohol share is one of the biggest price drivers. Under about a third of sales, liquor liability is usually an add-on; above that, the risk is written more like a bar." },
  },
  "wing-restaurant": {
    risks: [
      { name: "Heavy frying", desc: `Wings mean fryers running all service. Carriers expect ${HOOD}` },
      { name: "Game-day crowds and beer", desc: "Sports-bar crowds and beer sales raise premises and liquor exposure, especially on game nights." },
      { name: "Delivery volume", desc: "Wing shops rely on delivery. Drivers in their own cars need hired and non-owned auto coverage." },
    ],
    questions: ["How many fryers?", "Alcohol share and TVs or sports-bar format?", "Delivery share, own drivers or apps?", "Hours?", "Seating?"],
    faq: { q: "Is a wing shop rated like a sports bar?", a: "It depends on the alcohol share. A takeout-heavy wing shop is a fryer-heavy restaurant; a wing bar selling a lot of beer is rated closer to a bar." },
  },
  "bagel-shop": {
    risks: [
      { name: "Boiling and baking", desc: "Bagels are boiled and then baked, so scald burns and oven burns are the kitchen injuries to plan for." },
      { name: "Early production", desc: "Production starts before dawn with a small crew, so premises lighting and lone-worker procedures matter." },
      { name: "Slicers and toasters", desc: "Bagel slicers and toasters cause the typical counter injuries; guards and procedures help the workers' comp price." },
    ],
    questions: ["Do you boil and bake on site?", "Any fryers or griddles?", "Production start time and crew size?", "Catering or wholesale?", "Seating?"],
    faq: { q: "Is a bagel shop insured like a bakery or a café?", a: "Somewhere between: on-site boiling and baking looks like a bakery, while counter service and coffee look like a café. Describe both so it isn't classed as a full restaurant." },
  },
  "juice-bar": {
    risks: [
      { name: "Unpasteurized juice", desc: "Fresh unpasteurized juice carries a foodborne-illness exposure that bottled juice doesn't, and some states require warning labels on it. Carriers ask which you sell." },
      { name: "Blenders and cutting", desc: "Blenders and produce prep cause the typical staff injuries." },
      { name: "Supplements and add-ins", desc: "Protein powders and supplements add a product-liability question. Keep the supplier documentation." },
    ],
    questions: ["Fresh unpasteurized juice?", "Supplements or wellness shots?", "Any cooking?", "Wholesale or bottled products?", "Hours and staff?"],
    faq: { q: "Does a juice bar need product liability?", a: "It's included in general liability for most small food businesses. What changes the price is unpasteurized juice, supplements and any bottled wholesale product." },
  },
  "bubble-tea-shop": {
    risks: [
      { name: "Tapioca cooking", desc: "Tapioca pearls are boiled in large batches, so scald burns are the main kitchen exposure." },
      { name: "Choking and cup design", desc: "Pearls and jellies carry a choking-hazard question some carriers ask about. Warnings for young children help." },
      { name: "Fast-growing menus", desc: "Adding snacks or fried foods changes the cooking class. Tell the carrier the actual menu." },
    ],
    questions: ["Do you cook pearls on site?", "Any fried snacks?", "Warning signage?", "Seating and hours?", "Delivery apps?"],
    faq: { q: "Is bubble tea insured like a coffee shop?", a: "Mostly. A beverage counter with limited cooking sits in a low class; boiling pearls on site and adding fried snacks move it up a step." },
  },
  "caribbean-restaurant": {
    risks: [
      { name: "Jerk grills and smokers", desc: "Charcoal and wood jerk grills are solid-fuel, open-flame cooking. Location, clearances and ventilation are what carriers check." },
      { name: "Fryers", desc: `Festival, fried plantains and patties mean fryers: ${HOOD}` },
      { name: "Catering and events", desc: "Caribbean restaurants often cater events and festivals, and the policy needs to extend off premises." },
    ],
    questions: ["Jerk grill fuel and location?", "Fryers?", "Catering or festival stands?", "Alcohol service?", "Seating and hours?"],
    faq: { q: "Do charcoal jerk grills affect insurance?", a: "Yes, they're solid-fuel open-flame cooking. Where the grill sits, its clearances and ash handling are what carriers ask about. Set up properly, it's insurable." },
  },
  "halal-restaurant": {
    risks: [
      { name: "Grills and rotisseries", desc: `Grilled meats, shawarma and kebabs mean open grills and vertical broilers under the hood: ${HOOD}` },
      { name: "Food carts and trucks", desc: "Many halal concepts run carts or trucks alongside a storefront. Those need auto and off-premises coverage the storefront policy doesn't include." },
      { name: "Late-night hours", desc: "Late-night trade changes premises security exposure; disclose hours." },
    ],
    questions: ["Grills, rotisseries, fryers?", "Any carts or trucks?", "Hours, including late night?", "Delivery share?", "Seating?"],
    faq: { q: "Does a halal cart need separate insurance from my restaurant?", a: "Usually yes. A cart or truck needs commercial auto if it's driven, and the liability policy must extend to where it operates. Tell the carrier about both." },
  },
  "soul-food-restaurant": {
    risks: [
      { name: "Frying", desc: `Fried chicken and fish mean fryers running all service: ${HOOD}` },
      { name: "Steam tables and holding", desc: "Cafeteria-style lines and steam tables raise holding-temperature and foodborne-illness exposure." },
      { name: "Catering", desc: "Church events, repasts and family gatherings mean off-site catering the policy has to extend to." },
    ],
    questions: ["How many fryers?", "Steam table or cafeteria line?", "Catering share of sales?", "Alcohol service?", "Seating and hours?"],
    faq: { q: "Does catering from my restaurant need extra insurance?", a: "The liability policy has to cover off-premises operations, and vehicles used for catering need auto coverage. Tell the carrier what share of sales is catering." },
  },
  bakery: {
    risks: [
      { name: "Ovens and early production", desc: "Ovens run before dawn with a small crew. Unattended baking and lone-worker procedures come up." },
      { name: "Mixers and burns", desc: "Commercial mixers cause hand injuries and ovens cause burns, the main workers' comp exposures." },
      { name: "Wholesale and custom orders", desc: "Supplying cafés or stores, and custom cakes with allergen requests, add product-liability exposure." },
    ],
    questions: ["Ovens only, or fryers too?", "Production start time and crew size?", "Wholesale customers?", "Custom orders and allergen handling?", "Café seating?"],
    faq: { q: "Is a bakery cheaper to insure than a restaurant?", a: "Usually, if it bakes rather than fries and has limited seating: ovens rate lower than a full cooking line. Wholesale and fryers move it up." },
  },
  // ---- stage pages (Kevin 2026-09-26: starting, growing, buying) ----
  "new-restaurant": {
    risks: [
      { name: "No loss history yet", desc: "Carriers price a first-time restaurant without loss runs. Owner experience in restaurants, a written business plan and the build-out details stand in for the history you don't have yet." },
      { name: "Build-out and pre-opening", desc: "During construction the landlord and contractor carry the main risks, but your improvements, equipment deliveries and pre-opening liability need coverage from the day you take possession." },
      { name: "Lease requirements", desc: "Your lease sets required limits and additional-insured wording. Bind before you get the keys or the landlord may not hand them over." },
    ],
    questions: ["Opening date and possession date?", "Your restaurant experience?", "Build-out value and equipment list?", "Lease insurance requirements?", "Planned menu, seating, hours and alcohol?"],
    faq: { q: "Can I get restaurant insurance before I open?", a: "Yes, and you usually need it before you get the keys. Policies can start at possession, covering the build-out and pre-opening liability, and then run into opening day." },
  },
  "growing-restaurant": {
    risks: [
      { name: "Second locations", desc: "Adding a location means adding it to the policy: new address, sales, equipment and lease. Most carriers can schedule multiple locations on one program, which is often cheaper than separate policies." },
      { name: "Growing payroll", desc: "Workers' comp is priced on payroll and audited. Hiring fast without updating the estimate leads to a large audit bill at year end." },
      { name: "Higher limits", desc: "Bigger landlords, franchise agreements and catering clients often ask for higher limits. An umbrella is usually the cheapest way to meet them." },
    ],
    questions: ["New location address, lease and opening date?", "Projected sales and payroll per location?", "Shared kitchen or commissary?", "New alcohol, delivery or catering?", "Current policy and renewal date?"],
    faq: { q: "Should each restaurant location have its own policy?", a: "Usually not. One program listing every location is simpler and often cheaper, with each location's property scheduled separately. Separate LLCs per location can change that." },
  },
  "buying-a-restaurant": {
    risks: [
      { name: "The seller's policy doesn't transfer", desc: "You need your own coverage in force the day you take over. The seller's policy covers the seller, not you." },
      { name: "Unknown condition", desc: "Check the hood, suppression tag, grease duct and electrical before closing. Carriers inspect, and an overdue system becomes your problem after the sale." },
      { name: "Liquor license transfer", desc: "If the sale includes a liquor license, liquor liability has to be in place for the new owner by the effective date." },
    ],
    questions: ["Closing and takeover date?", "Seller's loss runs?", "Last hood cleaning and suppression inspection?", "Is a liquor license transferring?", "Any renovations planned?"],
    faq: { q: "Can I keep the seller's restaurant insurance?", a: "No, a policy doesn't transfer with the business. Bind your own to start on the takeover date. The seller's loss runs help price it." },
  },
  "ghost-kitchen": {
    risks: [
      { name: "Delivery-only exposure", desc: "No dining room means fewer premises claims, but all the product liability sits in packaged food and delivery times." },
      { name: "Shared kitchens", desc: "In a shared or commissary kitchen, the facility's contract sets required limits and additional insureds. Your equipment there needs its own coverage." },
      { name: "Multiple virtual brands", desc: "Several brands out of one kitchen can sit on one policy if disclosed. List each brand name." },
    ],
    questions: ["Your own space or a shared kitchen?", "Facility contract insurance requirements?", "Virtual brands operated?", "Delivery apps and own drivers?", "Equipment value?"],
    faq: { q: "Do ghost kitchens need restaurant insurance?", a: "Yes: general liability with products coverage, workers' comp for staff, and property for your equipment. Delivery-only removes most dining-room claims but not the food liability." },
  },
  "restaurant-delivery": {
    risks: [
      { name: "Hired and non-owned auto", desc: "When staff deliver in their own cars, their personal policy may exclude business use. Hired and non-owned auto liability covers the restaurant if a driver causes a crash." },
      { name: "Owned delivery vehicles", desc: "A car or van the business owns needs a commercial auto policy; the restaurant policy doesn't cover it." },
      { name: "Third-party apps", desc: "App-based delivery shifts driver risk to the platform, but the food liability stays with you." },
    ],
    questions: ["Own drivers, apps, or both?", "Do drivers use personal vehicles?", "Any business-owned vehicles?", "Delivery radius and share of sales?", "Current restaurant policy?"],
    faq: { q: "Does my restaurant insurance cover delivery drivers?", a: "Not by default. Hired and non-owned auto, usually an inexpensive add-on, covers the business when employees drive their own cars. Business-owned vehicles need commercial auto." },
  },
};

export function typeDetail(slug: string): TypeDetail | undefined {
  return TYPE_DETAILS[slug];
}
