export const OPENING_COSTS = [
  "Lease and utility deposits", "Design, professional fees, and permits",
  "Construction and improvements", "Equipment and installation", "Furniture and smallwares",
  "Opening inventory", "Pre-opening training and payroll", "Upfront insurance payment", "Other opening costs",
] as const;
export const MONTHLY_COSTS = [
  "Rent and occupancy", "Payroll and related costs", "Utilities", "Food, packaging, and supplies",
  "Insurance installments", "Software, debt payments, and other bills",
] as const;

export function budgetNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.min(1_000_000_000, Math.max(0, parsed)) : 0;
}

export function calculateBudget(opening: string[], monthly: string[], months: string, contingency: string, cash: string) {
  const oneTime = opening.reduce((sum, value) => sum + budgetNumber(value), 0);
  const monthlyTotal = monthly.reduce((sum, value) => sum + budgetNumber(value), 0);
  const reserveMonths = Math.min(60, budgetNumber(months));
  const contingencyRate = Math.min(100, budgetNumber(contingency));
  const contingencyTotal = oneTime * contingencyRate / 100;
  const reserve = monthlyTotal * reserveMonths;
  const total = oneTime + contingencyTotal + reserve;
  const availableCash = budgetNumber(cash);
  return { oneTime, monthlyTotal, reserveMonths, contingencyRate, contingencyTotal, reserve, total, availableCash, gap: Math.max(0, total - availableCash) };
}

export function budgetCsv(opening: string[], monthly: string[], months: string, contingency: string, cash: string) {
  const result = calculateBudget(opening, monthly, months, contingency, cash);
  const rows: (string | number)[][] = [
    ["Cohesive restaurant opening budget", "USD; your inputs, not market estimates"],
    ["Category", "Amount USD"],
    ...OPENING_COSTS.map((label, i) => [label, budgetNumber(opening[i] ?? "")]),
    ["One-time subtotal", result.oneTime],
    ...MONTHLY_COSTS.map((label, i) => [`Monthly: ${label}`, budgetNumber(monthly[i] ?? "")]),
    ["Monthly subtotal", result.monthlyTotal], ["Reserve months", result.reserveMonths],
    ["Operating reserve (no sales assumed)", result.reserve], ["Contingency percent (one-time costs only)", result.contingencyRate],
    ["Contingency amount", result.contingencyTotal], ["Estimated total cash needed", result.total],
    ["Committed available cash", result.availableCash], ["Funding gap", result.gap],
    ["Note", "Blank inputs count as zero. This worksheet is not a quote or a profitability forecast."],
  ];
  return rows.map((row) => row.map((cell) => `"${String(typeof cell === "number" ? Math.round(cell * 100) / 100 : cell).replaceAll('"', '""')}"`).join(",")).join("\r\n");
}
