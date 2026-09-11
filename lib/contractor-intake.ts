export type ContractorFields = Record<string, string>;
export const WORK_MARKETS = ["Residential", "Commercial", "Both"];
export const PROJECT_TYPES = ["Repairs & maintenance", "Remodeling", "New construction"];
export const POOL_WORK = ["Gunite / shotcrete pools", "Fiberglass pools", "Vinyl-liner pools", "Pool repairs / resurfacing", "Cleaning / maintenance", "Other pool work"];
function tradesFor(f: ContractorFields) { return [f.trade, ...(f.otherTrades ?? "").split(", ")].filter(v => v && v !== "None"); }
export function hasPoolWork(f: ContractorFields) { return tradesFor(f).includes("Pool construction / service"); }
export function needsGeneralWorkQuestions(f: ContractorFields) { return tradesFor(f).some(t => t !== "Pool construction / service"); }
export function needsDevelopmentQuestion(f: ContractorFields): boolean {
  const trades = [f.trade, ...(f.otherTrades ?? "").split(", ")].filter(v => v && v !== "None");
  return trades.some(trade => !["Tree service", "Pool construction / service"].includes(trade));
}
export function normalizeContractor(f: ContractorFields): ContractorFields {
  const next = { ...f };
  if (next.otherTrades === "None") next.primaryPct = "All of it (100%)";
  else delete next.primaryPct; // Other-trade percentages remain unknown; no extra question.
  if (next.employees?.startsWith("0")) next.payroll = "0";
  if (next.usesSubcontractors === "No") next.subcontractorCosts = "0";
  if (!needsGeneralWorkQuestions(next)) { delete next.workMarket; delete next.projectTypes; }
  if (!hasPoolWork(next)) { delete next.poolWork; delete next.poolWorkDescription; }
  if (!(next.poolWork ?? "").split(", ").includes("Other pool work")) delete next.poolWorkDescription;
  if (!needsDevelopmentQuestion(next)) delete next.developmentWork;
  return next;
}
export function contractorCanSubmit(input: ContractorFields): boolean {
  const f = normalizeContractor(input);
  const poolWork = (f.poolWork ?? "").split(", ").filter(Boolean);
  const projects = (f.projectTypes ?? "").split(", ").filter(Boolean);

  return !!(f.fullName?.trim() && /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test((f.email ?? "").trim()) &&
    f.phone?.trim() && f.legalName?.trim() && f.address?.trim() && f.trade && f.otherTrades &&
    (!(f.trade === "Other trade" || (f.otherTrades ?? "").split(", ").includes("Other trade")) || f.otherTradeDescription?.trim()) &&
    (!needsGeneralWorkQuestions(f) || (WORK_MARKETS.includes(f.workMarket) && projects.length > 0 && projects.every(v => PROJECT_TYPES.includes(v)))) &&
    (!hasPoolWork(f) || (poolWork.length > 0 && poolWork.every(v => POOL_WORK.includes(v)) && (!poolWork.includes("Other pool work") || f.poolWorkDescription?.trim()))) &&
    (!needsDevelopmentQuestion(f) || ["Yes", "No", "Not sure"].includes(f.developmentWork)) &&
    f.revenue && f.employees &&
    (f.employees.startsWith("0") || f.payroll) && f.usesSubcontractors &&
    (f.usesSubcontractors !== "Yes" || f.subcontractorCosts));
}
export function contractorDetails(input: ContractorFields) {
  const f = normalizeContractor(input);
  const mapping: Record<string, string> = {
    legalName: "Legal business name", address: "Business address", trade: "Primary trade",
    otherTrades: "Other trades", otherTradeDescription: "Other trade description", primaryPct: "Primary trade % of work",
    workMarket: "Residential / commercial work", projectTypes: "Project types", developmentWork: "Apartment / townhome / tract-development work",
    poolWork: "Pool operations (including subcontracted work)", poolWorkDescription: "Other pool work description",
    revenue: "Annual revenue", employees: "W2 employees", payroll: "Annual W2 payroll",
    usesSubcontractors: "Uses subcontractors", subcontractorCosts: "Annual subcontractor costs",
    structure: "Business structure", yearStarted: "Year started", currentGl: "Current GL / renewal", currentPremium: "Current annual GL premium",
  };
  return Object.entries(mapping).flatMap(([key, label]) => {
    if (key === "payroll" && !f.employees) return [];
    if (key === "subcontractorCosts" && !f.usesSubcontractors) return [];
    if (key === "otherTradeDescription" && f.trade !== "Other trade" && !(f.otherTrades ?? "").split(", ").includes("Other trade")) return [];
    const value = f[key]?.trim();
    return value ? [{ label, value }] : [];
  });
}
