// Producer licensing by state, shown on every state page (Kevin 2026-09-26).
//
// License numbers are not a ranking signal. They are a trust and compliance line: insurance is a
// "your money or your life" category, where who is responsible for the page is part of how a page
// is judged, and a visitor who sees their own state's license is more likely to fill the form.
//
// NPN 22277482 carries the NY broker license the homepage already shows (BR-1983645), so it is the
// primary. Where a state is licensed only under NPN 22278962, Kevin's ruling is NPN only, no license
// number. Where a state's license number IS the NPN, the line shows the NPN once rather than the
// same number twice. California is absent on purpose: the site excludes it everywhere.
export const PRIMARY_NPN = "22277482";
export const SECONDARY_NPN = "22278962";

type License = { npn: string; license?: string };

const PRIMARY: Record<string, string> = {
  AL: "3004335591", AK: "3004348026", AR: "22277482", CT: "22277482", DC: "3004348023",
  DE: "3004348030", GA: "3918174", HI: "22277482", IA: "22277482", ID: "22277482",
  KS: "22277482", KY: "DOI-1473727", MA: "22277482", MD: "3004335400", ME: "PRN555823",
  MI: "22277482", MN: "41050365", MS: "11226059", MT: "3004348031", NC: "22277482",
  ND: "22277482", NE: "22277482", NH: "22277482", NM: "22277482", NV: "4242323",
  NY: "BR-1983645 / PC-1983645", OK: "3004348033", OR: "22277482", PA: "1327142",
  RI: "3004348034", SC: "22277482", SD: "22277482", TN: "3004335395", TX: "3522662",
  UT: "1129040", VA: "1601363", VT: "3004348028", WA: "1374257", WI: "22277482",
  WV: "22277482", WY: "676371",
};

// Licensed only under the secondary NPN: shown as NPN only (Kevin 2026-09-26).
const SECONDARY_ONLY = ["AZ", "CO", "FL", "IL", "IN", "LA", "MO", "NJ", "OH"];

export function licenseFor(abbr: string): License | null {
  const code = abbr.toUpperCase();
  if (PRIMARY[code]) {
    const license = PRIMARY[code];
    return license === PRIMARY_NPN ? { npn: PRIMARY_NPN } : { npn: PRIMARY_NPN, license };
  }
  if (SECONDARY_ONLY.includes(code)) return { npn: SECONDARY_NPN };
  return null;
}

// "Licensed in South Carolina · NPN 22277482" / "Licensed in Texas · License #3522662 · NPN 22277482"
export function licenseLine(stateName: string, abbr: string): string | null {
  const l = licenseFor(abbr);
  if (!l) return null;
  return [`Licensed in ${stateName}`, l.license ? `License #${l.license}` : null, `NPN ${l.npn}`]
    .filter(Boolean)
    .join(" · ");
}

// Full name -> code map. Deliberately independent of lib/seo/data.ts STATES, which lists only the
// food-vertical states (27): contractor pages cover every state, and a partial map silently
// dropped the line on Wyoming, Oregon, Vermont and North Dakota in the first build.
const STATE_CODES: Record<string, string> = {
  Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA", Colorado: "CO",
  Connecticut: "CT", Delaware: "DE", "District of Columbia": "DC", Florida: "FL", Georgia: "GA",
  Hawaii: "HI", Idaho: "ID", Illinois: "IL", Indiana: "IN", Iowa: "IA", Kansas: "KS",
  Kentucky: "KY", Louisiana: "LA", Maine: "ME", Maryland: "MD", Massachusetts: "MA",
  Michigan: "MI", Minnesota: "MN", Mississippi: "MS", Missouri: "MO", Montana: "MT",
  Nebraska: "NE", Nevada: "NV", "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM",
  "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", Ohio: "OH", Oklahoma: "OK",
  Oregon: "OR", Pennsylvania: "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", Tennessee: "TN", Texas: "TX", Utah: "UT", Vermont: "VT",
  Virginia: "VA", Washington: "WA", "West Virginia": "WV", Wisconsin: "WI", Wyoming: "WY",
};

// areaServed is a state name, "City, State", or "United States". The state is its last segment.
export function licenseLineForArea(areaServed: string): string | null {
  const name = areaServed.split(",").pop()?.trim() ?? "";
  const code = STATE_CODES[name];
  return code ? licenseLine(name, code) : null;
}
