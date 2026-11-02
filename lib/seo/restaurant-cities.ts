// Restaurant city pages (Kevin 2026-09-26: "the state and city version is very important").
//
// Why cities: trade city pages are our best-ranking family (average position 18.8 against 47 for
// trade x state), and city restaurant searches had no restaurant page to land on (average 77).
//
// What makes each city page real rather than a swapped name: WHO permits and inspects restaurants
// there is genuinely different - a city health department, a county, a state sanitarian office,
// or (Florida) a state licensing division - and each fact below comes from that authority's own
// official page, researched 2026-09-26. Nothing here states carrier appetite or a price.
export const RESTAURANT_CITIES_UPDATED = "2026-09-26";

export type RestaurantCity = {
  slug: string;
  name: string;
  stateSlug: string;
  stateName: string;
  authority: { label: string; href: string };
  fact: string;
  // What to know when opening or renewing here - each item from the authority's own pages.
  checklist: string[];
  // A second official source where the local step is not the food permit (Florida business tax).
  local?: { label: string; href: string };
};

const FL_DBPR = {
  label: "Florida DBPR, Division of Hotels and Restaurants",
  href: "https://www2.myfloridalicense.com/hotels-restaurants/licensing/general/",
};
const FL_FACT =
  "Florida licenses restaurants at the state level: the Department of Business and Professional Regulation's Division of Hotels and Restaurants issues the food service license, and each food operation on a premises needs its own license, renewed every year.";

// "an Austin restaurant", "a Utah restaurant": vowel sound, not letter, so U-names keep "a".
export function withArticle(word: string) {
  return /^[AEIO]/i.test(word) ? `an ${word}` : `a ${word}`;
}

// Letters read aloud: "an IL restaurant", "an NY roofer", "a TX roofer".
export function withAbbrArticle(abbr: string) {
  return /^[AEFHILMNORSX]/.test(abbr) ? `an ${abbr}` : `a ${abbr}`;
}

export const RESTAURANT_CITIES: RestaurantCity[] = [
  { slug: "new-york-city", name: "New York City", stateSlug: "new-york", stateName: "New York",
    authority: { label: "NYC Health: restaurants and food service establishments", href: "https://www.nyc.gov/site/doh/business/permits-and-licenses/restaurants.page" },
    checklist: ["Apply for the Food Service Establishment Permit before opening; a supervisor with a Food Protection Certificate has to be on site during all hours of operation.", "Expect an unscheduled inspection each year, and renew the permit annually from the month you applied."],
    fact: "Restaurants need a Food Service Establishment Permit from the NYC Health Department, with a supervisor holding a Food Protection Certificate on site whenever the restaurant is open. Each permitted restaurant gets an unscheduled inspection every year." },
  { slug: "chicago", name: "Chicago", stateSlug: "illinois", stateName: "Illinois",
    authority: { label: "City of Chicago: Retail Food Establishment license", href: "https://www.chicago.gov/city/en/depts/bacp/supp_info/retailfoodestablishment0.html" },
    checklist: ["The Retail Food Establishment license runs for two years and must be renewed before it expires.", "Inspection frequency follows your risk category: the highest-risk restaurants are inspected twice a year, the lowest every other year.", "A priority violation that can't be fixed on the spot suspends the license until it is."],
    fact: "Chicago requires a Retail Food Establishment license whenever perishable food is prepared or served, and the premises must pass a Chicago Department of Public Health inspection before the license is issued. Someone holding a City of Chicago Food Service Sanitation Certificate has to be on the premises at all times." },
  { slug: "houston", name: "Houston", stateSlug: "texas", stateName: "Texas",
    authority: { label: "City of Houston: starting a food service business", href: "https://www.houstontx.gov/business/start/food-service.html" },
    checklist: ["Food service permits cover restaurants, caterers, mobile units and farmers-market stands, all subject to periodic inspection.", "The Houston Health Department runs its own food manager certification classes, and grease trap inspections are handled separately from the food permit."],
    fact: "The Houston Health Department permits and periodically inspects restaurants, caterers and mobile food units inside the city." },
  { slug: "dallas", name: "Dallas", stateSlug: "texas", stateName: "Texas",
    authority: { label: "City of Dallas Consumer Health: food establishments", href: "https://dallascityhall.com/departments/codecompliance/consumer-health/Pages/food-establishment.aspx" },
    checklist: ["Bring a photo ID, your sales tax permit and the fee when you apply for the food establishment permit.", "Customers can ask to see your most recent inspection report, so keep it on hand."],
    fact: "Dallas restaurants and bars need a food establishment permit from the city's Consumer Health Division, which asks for photo ID, a sales tax permit and the application fee." },
  { slug: "san-antonio", name: "San Antonio", stateSlug: "texas", stateName: "Texas",
    authority: { label: "San Antonio Metropolitan Health District: food licensing", href: "https://www.sa.gov/Directory/Departments/SAMHD/Licenses-Food-Permits/Food-Establishment-License" },
    checklist: ["Metro Health requires a current permit for every food establishment, and permit billing questions go through the city's 311 line.", "Temporary and mobile food operations have their own permits separate from the restaurant's."],
    fact: "Metro Health's Food and Environmental Health Services division licenses and inspects every food establishment in the City of San Antonio." },
  { slug: "austin", name: "Austin", stateSlug: "texas", stateName: "Texas",
    authority: { label: "Austin Public Health: fixed food establishments", href: "https://www.austintexas.gov/department/fixed-food-establishments" },
    checklist: ["Plan review is required for new construction and remodels, and a pre-opening inspection is required for new restaurants, remodels and changes of ownership.", "The operating permit covers Austin and Travis County and renews every year."],
    fact: "Austin and Travis County restaurants go through plan review, a pre-opening inspection and then an operating permit that renews every year." },
  { slug: "fort-worth", name: "Fort Worth", stateSlug: "texas", stateName: "Texas",
    authority: { label: "City of Fort Worth Consumer Health: food business", href: "https://www.fortworthtexas.gov/departments/environmental-services/consumer-health/food-business" },
    checklist: ["The annual food permit fee combines a per-establishment charge with a per-employee charge, so payroll growth raises it.", "Events need a separate temporary permit, good for up to 14 consecutive days."],
    fact: "Fort Worth's Consumer Health division permits and inspects restaurants; the annual permit fee is set per establishment plus a per-employee charge." },
  { slug: "phoenix", name: "Phoenix", stateSlug: "arizona", stateName: "Arizona",
    authority: { label: "Maricopa County Environmental Services: food and restaurants", href: "https://www.maricopa.gov/5114/Food-Restaurants" },
    checklist: ["Your county permit class depends on seating and on how many menu items are prepared from scratch.", "Maricopa County publishes every permit and inspection record online."],
    fact: "Phoenix restaurants are permitted by Maricopa County Environmental Services, not the city. Permit classes depend on seating capacity and how complex the menu preparation is." },
  { slug: "philadelphia", name: "Philadelphia", stateSlug: "pennsylvania", stateName: "Pennsylvania",
    authority: { label: "City of Philadelphia: Food Preparation and Serving License", href: "https://www.phila.gov/services/permits-violations-licenses/get-a-license/business-licenses/food-businesses/get-a-food-preparation-and-serving-license/" },
    checklist: ["Stationary food businesses go through plan review before the Food Preparation and Serving License is issued.", "Inspection reports from the past three years are searchable by anyone, including landlords and lenders."],
    fact: "Restaurants and bars in Philadelphia need a Food Preparation and Serving License, and the Department of Public Health's Office of Food Protection inspects them; three years of inspection reports are public." },
  { slug: "pittsburgh", name: "Pittsburgh", stateSlug: "pennsylvania", stateName: "Pennsylvania",
    authority: { label: "Allegheny County Health Department: food permits and registration", href: "https://www.alleghenycounty.us/Services/Health-Department/Food-Safety/Permits-and-Registration" },
    checklist: ["Apply through the Allegheny County Citizen Access Portal; the county determines which food permit you need.", "Food trucks and trailers need their own annual permit, and events need a temporary permit."],
    fact: "Pittsburgh restaurants are permitted and inspected by the Allegheny County Health Department's Food Safety Program, which takes applications through its Citizen Access Portal." },
  { slug: "jacksonville", name: "Jacksonville", stateSlug: "florida", stateName: "Florida", authority: FL_DBPR, fact: FL_FACT, checklist: ["Beyond the state DBPR food license, Duval County's Tax Collector issues a Local Business Tax Receipt for every business in Jacksonville, separate from any state license."], local: { label: "Duval County Tax Collector", href: "https://www.coj.net/tc" } },
  { slug: "miami", name: "Miami", stateSlug: "florida", stateName: "Florida", authority: FL_DBPR, fact: FL_FACT, checklist: ["Beyond the state DBPR food license, a restaurant inside a Miami-Dade municipality needs both a city and a county Local Business Tax Receipt, displayed in public view and renewed every October 1."], local: { label: "Miami-Dade County: Local Business Tax Receipt", href: "https://www.miamidade.gov/global/service.page?Mduid_service=ser149979632911111" } },
  { slug: "tampa", name: "Tampa", stateSlug: "florida", stateName: "Florida", authority: FL_DBPR, fact: FL_FACT, checklist: ["Beyond the state DBPR food license, Hillsborough County requires a Business Tax Receipt, and a restaurant inside Tampa city limits needs a City of Tampa receipt as well."], local: { label: "City of Tampa: business tax", href: "https://www.tampa.gov/business-tax" } },
  { slug: "orlando", name: "Orlando", stateSlug: "florida", stateName: "Florida", authority: FL_DBPR, fact: FL_FACT, checklist: ["Beyond the state DBPR food license, an Orlando restaurant needs the City of Orlando Business Tax Receipt first and then the Orange County receipt; both expire September 30."], local: { label: "City of Orlando: get a business tax receipt", href: "https://www.orlando.gov/Building-Development/Permits-Inspections/Other/Get-a-Permit-for-Your-Business/Get-a-Business-Tax-Receipt" } },
  { slug: "atlanta", name: "Atlanta", stateSlug: "georgia", stateName: "Georgia",
    authority: { label: "Fulton County Board of Health: food service", href: "https://fultoncountyboh.com/environmental-health/food-service/" },
    checklist: ["Fulton County's Environmental Health Services permits more than 6,000 food service establishments and inspects for cross-contamination, cooking temperatures and pest control.", "Construction plans need approval before the operating permit."],
    fact: "Atlanta restaurants in Fulton County are permitted and inspected by the Fulton County Board of Health's Environmental Health Services, which covers more than 6,000 food service establishments." },
  { slug: "charlotte", name: "Charlotte", stateSlug: "north-carolina", stateName: "North Carolina",
    authority: { label: "Mecklenburg County Environmental Health: food and facilities sanitation", href: "https://eh.mecknc.gov/food" },
    checklist: ["Plan review comes first; the program issues permits to more than 4,400 food service facilities and runs over 13,000 inspections a year.", "If you're buying a restaurant, ask about a transitional permit: the seller's permit won't transfer."],
    fact: "Mecklenburg County permits Charlotte restaurants after plan review. Permits do not transfer when a restaurant is sold, so a new owner needs its own permit." },
  { slug: "raleigh", name: "Raleigh", stateSlug: "north-carolina", stateName: "North Carolina",
    authority: { label: "Wake County: restaurants and meat markets", href: "https://www.wake.gov/departments-government/environmental-health-safety/regulated-facilities/restaurants-and-meat-markets" },
    checklist: ["Wake County plan review must be approved before you build or remodel.", "Restaurants are inspected one to four times a year depending on menu and food processes."],
    fact: "Wake County Environmental Health permits and inspects Raleigh restaurants one to four times a year depending on the menu and food processes, and permits do not transfer on sale." },
  { slug: "columbus", name: "Columbus", stateSlug: "ohio", stateName: "Ohio",
    authority: { label: "Columbus Public Health: Food Protection Program", href: "https://www.columbus.gov/Services/Food-Protection-Program" },
    checklist: ["Submit plans at least 45 days before opening; new owners and major remodels also go through plan review.", "A person in charge has to be present during all hours of operation, and licenses renew by March 1."],
    fact: "Columbus Public Health licenses restaurants as Food Service Operations. Plans are due at least 45 days before opening, and licenses renew every year by March 1." },
  { slug: "cleveland", name: "Cleveland", stateSlug: "ohio", stateName: "Ohio",
    authority: { label: "Cleveland Department of Public Health: food safety", href: "https://www.clevelandohio.gov/city-hall/departments/public-health/programs-services/food-safety" },
    checklist: ["Book the pre-licensing inspection before opening.", "Renewals received after March 1 carry a late-fee penalty."],
    fact: "Anyone serving food to the public in Cleveland needs a license from the Department of Public Health, renewed by March 1 each year to avoid a late fee." },
  { slug: "cincinnati", name: "Cincinnati", stateSlug: "ohio", stateName: "Ohio",
    authority: { label: "Cincinnati Health Department: food businesses and licensing", href: "https://www.cincinnati-oh.gov/health/chd-programs/food-safety-and-inspections/food-businesses-and-licensing/" },
    checklist: ["The food facility review, with menu, equipment specifications and scaled drawings, usually has to be approved before a license is issued.", "Licenses expire every March 1."],
    fact: "The Cincinnati Health Department licenses restaurants inside city limits under the Ohio Uniform Food Safety Code; a food facility review usually has to be approved before a license is issued." },
  { slug: "indianapolis", name: "Indianapolis", stateSlug: "indiana", stateName: "Indiana",
    authority: { label: "Marion County Public Health Department: food and consumer safety", href: "https://marionhealth.org/programs/environmental-health/food-and-consumer-safety/" },
    checklist: ["Marion County's Department of Food and Consumer Safety licenses retail and temporary food establishments.", "Temporary event applications and fees are due at least 48 hours before you operate."],
    fact: "Indianapolis restaurants are licensed and inspected by the Marion County Public Health Department's Department of Food and Consumer Safety." },
  { slug: "detroit", name: "Detroit", stateSlug: "michigan", stateName: "Michigan",
    authority: { label: "Detroit Health Department: food safety", href: "https://detroitmi.gov/departments/detroit-health-department/programs-and-services/food-safety" },
    checklist: ["Licenses expire every April 30, and routine inspections follow about every six months after you open.", "Inspection results since 2016 are public on the city's open data portal."],
    fact: "Detroit food licenses expire every April 30, routine inspections run about every six months, and under the city's Dining with Confidence ordinance restaurants post a green or red inspection placard." },
  { slug: "nashville", name: "Nashville", stateSlug: "tennessee", stateName: "Tennessee",
    authority: { label: "Metro Public Health: Food Protection and Public Facilities", href: "https://www.nashville.gov/departments/health/environmental-health/food-and-public-facilities" },
    checklist: ["The division inspects more than 6,800 permitted facilities in Davidson County, unannounced.", "Permits can be paid online with the permit number and establishment details."],
    fact: "Metro Public Health's Food Protection and Public Facilities Division permits Davidson County restaurants and conducts unannounced routine inspections." },
  { slug: "memphis", name: "Memphis", stateSlug: "tennessee", stateName: "Tennessee",
    authority: { label: "Shelby County Health Department: environmental health and food safety", href: "https://www.shelbytnhealth.com/186/Environmental-Health-Food-Safety-Program" },
    checklist: ["Submit two sets of plans and the proposed menu before construction starts, then notify the health department a week before opening to book the inspection.", "The annual permit fee is tiered by seat count, with a lower fee for 50 seats or fewer."],
    fact: "Shelby County permits Memphis restaurants after plan and menu review; the annual permit fee is lower for restaurants with 50 seats or fewer than for larger dining rooms." },
  { slug: "denver", name: "Denver", stateSlug: "colorado", stateName: "Colorado",
    authority: { label: "City and County of Denver: retail food license", href: "https://www.denvergov.org/Government/Agencies-Departments-Offices/Agencies-Departments-Offices-Directory/Business-Licensing/Business-licenses/Retail-Food" },
    checklist: ["New and remodeled food facilities go through public health plan review before licensing.", "Once public health approves, the license itself comes from Denver's Department of Excise and Licenses."],
    fact: "Denver requires a retail food license for any business selling food directly to consumers, from restaurants and caterers to food trucks, with public health review before licensing." },
  { slug: "seattle", name: "Seattle", stateSlug: "washington", stateName: "Washington",
    authority: { label: "Public Health Seattle & King County: permanent food business permit", href: "https://kingcounty.gov/en/dept/dph/certificates-permits-licenses/food-business-permits/permanent-food-business-permit" },
    checklist: ["Plan review approval and a pre-operational inspection come before the operating permit, and review has recently been taking weeks.", "Every employee needs a Washington State Food Worker Card."],
    fact: "King County requires plan review approval and a pre-operational inspection before a Seattle restaurant can open, and every food worker needs a Washington State Food Worker Card. Plan review has been taking weeks, so it's worth starting early." },
  { slug: "portland", name: "Portland", stateSlug: "oregon", stateName: "Oregon",
    authority: { label: "Multnomah County: restaurant license", href: "https://multco.us/services/restaurant-license" },
    checklist: ["Inspections are unannounced, twice a year, and the scores are posted publicly.", "Every restaurant worker needs an Oregon food handler card within 30 days of hire."],
    fact: "Multnomah County licenses Portland restaurants and inspects them unannounced twice a year, with scores posted publicly. Every restaurant worker needs a food handler card within 30 days of hire." },
  { slug: "las-vegas", name: "Las Vegas", stateSlug: "nevada", stateName: "Nevada",
    authority: { label: "Southern Nevada Health District: food establishment operations", href: "https://www.southernnevadahealthdistrict.org/permits-and-regulations/food-establishment-operations/" },
    checklist: ["New, remodeled and change-of-ownership permits all go through plan review on the health district's EH Portal.", "Your risk category, from 1 to 4, sets how often you're inspected, and results are searchable online."],
    fact: "The Southern Nevada Health District permits restaurants across Clark County and assigns each a risk category from 1 to 4 based on how complex its food preparation is, which sets how often it's inspected." },
  { slug: "boston", name: "Boston", stateSlug: "massachusetts", stateName: "Massachusetts",
    authority: { label: "Boston Inspectional Services: how to get a food service permit", href: "https://www.boston.gov/departments/inspectional-services/how-get-food-service-permit" },
    checklist: ["The Health Division approves the restaurant design before construction, and you can start the permit while building.", "Your menu has to include consumer advisories where they apply."],
    fact: "Boston restaurants need a food service permit from the Inspectional Services Department's Health Division, with at least one full-time employee certified as a food manager. You can start the permit while the restaurant is still under construction." },
  { slug: "baltimore", name: "Baltimore", stateSlug: "maryland", stateName: "Maryland",
    authority: { label: "Baltimore City Health Department: food facilities", href: "https://health.baltimorecity.gov/environmental-health/food-facilities" },
    checklist: ["The Food Control Section inspects and licenses more than 5,000 facilities and runs plan review for new ones.", "Operating with an expired food license can close the restaurant."],
    fact: "The Baltimore City Health Department's Food Control Section licenses and inspects more than 5,000 food facilities; operating without a current food license can mean closure." },
  { slug: "milwaukee", name: "Milwaukee", stateSlug: "wisconsin", stateName: "Wisconsin",
    authority: { label: "Milwaukee Health Department: Consumer Environmental Health", href: "https://city.milwaukee.gov/Health/Services-and-Programs/CEH" },
    checklist: ["Restaurants are inspected at least once a year.", "Posting the A, B or C sanitation grade from that inspection has been mandatory since 2019."],
    fact: "Milwaukee's Consumer Environmental Health division licenses and inspects restaurants at least once a year, and each restaurant must post the A, B or C sanitation grade from its annual inspection." },
  { slug: "minneapolis", name: "Minneapolis", stateSlug: "minnesota", stateName: "Minnesota",
    authority: { label: "City of Minneapolis: food and restaurant licenses", href: "https://www.minneapolismn.gov/business-services/licenses-permits-inspections/business-licenses/food-restaurants/" },
    checklist: ["The restaurant application includes a floor plan, a certified food protection manager, a background check, the menu, a food plan review and a sewer availability charge.", "How you handle food sets how often the city inspects."],
    fact: "Minneapolis licenses restaurants directly. The application includes a floor plan, a certified food protection manager, a background check and the menu, and how you handle food sets how often the city inspects." },
  { slug: "st-louis", name: "St. Louis", stateSlug: "missouri", stateName: "Missouri",
    authority: { label: "City of St. Louis: Food and Beverage Control Program", href: "https://www.stlouis-mo.gov/government/departments/health/environmental-health/food-control/index.cfm" },
    checklist: ["Apply for the permanent food permit at least 30 days before opening.", "Inspection reports are published, and restaurants are rated publicly."],
    fact: "The City of St. Louis Department of Health permits restaurants and taverns through its Food and Beverage Control Program; new restaurants should apply at least 30 days before opening." },
  { slug: "kansas-city", name: "Kansas City", stateSlug: "missouri", stateName: "Missouri",
    authority: { label: "Kansas City Health Department: opening a restaurant", href: "https://www.kcmo.gov/city-hall/departments/health/if-you-want-to-open-a-restaurant-in-kansas-city-mo/" },
    checklist: ["The restaurant has to be fully operational at the pre-opening inspection.", "Permit and inspection fees can be paid online, and vary by employee count and establishment type."],
    fact: "Kansas City, Missouri issues a Food Establishment Permit after a pre-opening inspection, with fees based on employee count and establishment type." },
  { slug: "louisville", name: "Louisville", stateSlug: "kentucky", stateName: "Kentucky",
    authority: { label: "Louisville Metro Public Health and Wellness: food safety program", href: "https://louisvilleky.gov/government/health-wellness/food-safety-program" },
    checklist: ["Plan review approval comes before the plumbing, building or food service permit is issued.", "Permits run January 1 to December 31, with invoices mailed each October; adding catering to an existing permit is a separate annual add-on."],
    fact: "Louisville Metro food service permits run January through December and require plan review approval first. Adding catering to an existing permit is a separate annual add-on." },
  { slug: "new-orleans", name: "New Orleans", stateSlug: "louisiana", stateName: "Louisiana",
    authority: { label: "Louisiana Department of Health: retail food for new businesses", href: "https://ldh.la.gov/page/for-new-businesses" },
    checklist: ["Plans and permits go through the state sanitarians for Orleans Parish, not a city department.", "Inspections happen one to four times a year based on your type of operation."],
    fact: "New Orleans restaurants are permitted by the Louisiana Department of Health's state sanitarians, not the city, and are inspected one to four times a year depending on the type of operation." },
  { slug: "oklahoma-city", name: "Oklahoma City", stateSlug: "oklahoma", stateName: "Oklahoma",
    authority: { label: "OKC-County Health Department: food establishments", href: "https://occhd.org/foodest/" },
    checklist: ["Submit the plan review application and fee first; the establishment is inspected before a license is issued.", "Seasonal stands and mobile units have their own permit types and rules."],
    fact: "The Oklahoma City-County Health Department must inspect and license a restaurant before it operates; submitting the application alone does not authorise opening." },
  { slug: "salt-lake-city", name: "Salt Lake City", stateSlug: "utah", stateName: "Utah",
    authority: { label: "Salt Lake County Health Department: food protection permits", href: "https://www.saltlakecounty.gov/health/food-protection/permits/" },
    checklist: ["Permanent restaurants, food trucks and event booths each need their own permit type from the county.", "Inspections are unscheduled."],
    fact: "Under Utah law, a Salt Lake County restaurant needs a food service permit from the county health department, which inspects unannounced." },
  { slug: "birmingham", name: "Birmingham", stateSlug: "alabama", stateName: "Alabama",
    authority: { label: "Jefferson County Department of Health: food protection", href: "https://www.jcdh.org/SitePages/Programs-Services/EnvironmentalHealth/FoodProtection/FoodProt.aspx" },
    checklist: ["Plans have to be reviewed and approved before you open.", "The permit is tied to one site, and a sanitation score under 85 brings more frequent inspections."],
    fact: "Jefferson County's food permit is site-specific and doesn't move with you to a new location, and restaurants scoring under 85 on their last inspection are inspected more often." },
  { slug: "richmond", name: "Richmond", stateSlug: "virginia", stateName: "Virginia",
    authority: { label: "Richmond City Health District: food safety", href: "https://www.vdh.virginia.gov/richmond-city/food-safety/" },
    checklist: ["New and remodeled restaurants, and any that add or change equipment, go through plan review.", "A Certified Food Protection Manager and an employee health policy must be in place before the permit is issued."],
    fact: "The Richmond City Health District issues food establishment permits after plan review and a pre-opening inspection, and a Certified Food Protection Manager must be in place before the permit is issued." },
];

export function getRestaurantCity(stateSlug: string, citySlug: string) {
  return RESTAURANT_CITIES.find((c) => c.stateSlug === stateSlug && c.slug === citySlug);
}

export function restaurantCitiesIn(stateSlug: string) {
  return RESTAURANT_CITIES.filter((c) => c.stateSlug === stateSlug);
}
