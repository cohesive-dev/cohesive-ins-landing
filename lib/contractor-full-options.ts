import {TRADES} from './contractor-trades';
export type Option = { label: string; value: string };

// Web-form trade taxonomy. Keep paid-ad trade targets as first-class choices so
// they do not collapse into "Other trade" and lose downstream attribution.


export const OTHER_TRADES: Option[] = [
  { label: "None - just my primary trade", value: "None" },
  ...TRADES,
];

export const TRACKED_QUESTION_FIELDS = new Set([
  "trade",
  "otherTrades",
  "otherTradeDescription",
  "primaryPct",
  "revenue",
  "employees",
  "payroll",
  "usesSubcontractors",
  "subcontractorCosts",
  "structure",
  "currentGl",
  "currentPremium",
]);

export const PRIMARY_PCT: Option[] = [
  { label: "All of it (100%)", value: "All of it (100%)" },
  { label: "75% - 99%", value: "75% - 99%" },
  { label: "50% - 75%", value: "50% - 75%" },
  { label: "Under 50%", value: "Under 50%" },
];

export const REVENUE: Option[] = [
  { label: "Under $250k", value: "Under $250k" },
  { label: "$250k - $500k", value: "$250k - $500k" },
  { label: "$500k - $1M", value: "$500k - $1M" },
  { label: "$1M - $2M", value: "$1M - $2M" },
  { label: "$2M - $4M", value: "$2M - $4M" },
  { label: "$4M - $8M", value: "$4M - $8M" },
  { label: "Over $8M", value: "Over $8M" },
];

export const EMPLOYEES: Option[] = [
  { label: "0 - no W2 employees", value: "0 - no W2 employees" },
  { label: "1 - 5", value: "1 - 5" },
  { label: "6 - 10", value: "6 - 10" },
  { label: "11 - 20", value: "11 - 20" },
  { label: "More than 20", value: "More than 20" },
];

export const PAYROLL: Option[] = [
  { label: "$0 - $50k", value: "$0 - $50k" },
  { label: "$50k - $100k", value: "$50k - $100k" },
  { label: "$100k - $250k", value: "$100k - $250k" },
  { label: "$250k - $500k", value: "$250k - $500k" },
  { label: "$500k - $1M", value: "$500k - $1M" },
  { label: "$1M+", value: "$1M+" },
];

export const USES_SUBCONTRACTORS: Option[] = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];

export const SUBCONTRACTOR_COSTS: Option[] = [
  { label: "Under $25k", value: "Under $25k" },
  { label: "$25k - $50k", value: "$25k - $50k" },
  { label: "$50k - $100k", value: "$50k - $100k" },
  { label: "$100k - $250k", value: "$100k - $250k" },
  { label: "$250k - $500k", value: "$250k - $500k" },
  { label: "$500k - $1M", value: "$500k - $1M" },
  { label: "$1M+", value: "$1M+" },
];

export const STRUCTURE: Option[] = [
  { label: "Sole proprietor / self-employed", value: "Sole proprietor" },
  { label: "LLC", value: "LLC" },
  { label: "Corporation / Inc", value: "Corporation" },
  { label: "Partnership", value: "Partnership" },
];

// ★ The uninsured answer is SPLIT into buyer vs shopper (Kevin 2026-08-17). Before this, anyone
// uninsured had to pick "ASAP", so the urgency signal was polluted with people just comparing.
// Both urgent answers use the SAME 30-day clock so the two urgent buckets are directly
// comparable ("insured, renewing within 30" vs "uninsured, needs it within 30").
export const CURRENT_GL: Option[] = [
  { label: "Yes - renews within 30 days", value: "Yes - renews within 30 days" },
  { label: "Yes - renews later", value: "Yes - renews later" },
  { label: "No - I need coverage within 30 days", value: "No - need coverage within 30 days" },
  { label: "No - just comparing for now", value: "No - just comparing" },
];

// The two CURRENT_PREMIUM buckets that make a lead a QualifiedLead (self-reported $5K+).
export const QUALIFIED_PREMIUM_VALUES = new Set(["$5K - $20K", "$20K+"]);
// "Not insured yet" is a YELLOW flag (Kevin 2026-08-15): a real, kept lead - they are buying,
// often ASAP - but there is no incumbent premium, so it is NOT the winnability signal and must
// not be folded into QualifiedLead. It gets its own event so it stays separable and trackable.
export const UNINSURED_PREMIUM_VALUE = "Not insured yet";
// Urgency, from the EXISTING current-GL question (no new question asked). Renewing within 30
// days or uninsured-and-ASAP = urgent. Fires LeadUrgentQuoted (any premium) and, stacked on the
// $5K+ self-report, QualifiedUrgentLead - the tightest, most winnable slice. Primary optimisation
// stays QualifiedLead; QualifiedUrgentLead accumulates history until its volume can steer.
// "No - just comparing" is deliberately NOT here: a shopper with no clock is not urgent, and
// including it is what made the old ASAP bucket unreliable.
export const URGENT_GL_VALUES = new Set(["Yes - renews within 30 days", "No - need coverage within 30 days"]);

// ★ LargeBusinessLead = self-reported revenue >= $1M, ANY trade (Kevin 2026-08-17).
// The premium self-report is the truest winnability signal but it is rare - 3 of the first 25
// contractor leads. Revenue >= $1M fired on 6 of those 25 AND caught all 3 of the $5K+ ones,
// plus the large businesses that are uninsured or underpaying (the ARGC shape: $2M revenue,
// a bad incumbent, the biggest win the lane has had). So it is a broader net for the same
// segment and frequent enough for Meta to actually learn from.
// ⚠️ Revenue self-reports round UP in a way premium self-reports do not - watch whether these
// leads actually quote at $5K+ before trusting the proxy.
export const LARGE_REVENUE_VALUES = new Set(["$1M - $2M", "$2M - $4M", "$4M - $8M", "Over $8M"]);

export const CURRENT_PREMIUM: Option[] = [
  { label: "Under $2,000", value: "Under $2K" },
  { label: "$2,000 - $5,000", value: "$2K - $5K" },
  { label: "$5,000 - $20,000", value: "$5K - $20K" },
  { label: "Over $20,000", value: "$20K+" },
  { label: "Not insured yet", value: "Not insured yet" },
];
