// General guide coverage remains deliberately narrow. The paid bar form has a
// separate line set so it can record liquor and property requests without changing
// what contractor and other intake pages are permitted to forward.
export const REQUESTED_COVERAGE_ALLOWLIST = ["Workers Comp", "General Liability"] as const;
export type RequestedCoverage = (typeof REQUESTED_COVERAGE_ALLOWLIST)[number];
export const BAR_REQUESTED_COVERAGE_ALLOWLIST = ["General Liability", "Property", "BOP", "Liquor Liability"] as const;
export type BarRequestedCoverage = (typeof BAR_REQUESTED_COVERAGE_ALLOWLIST)[number];

export const REQUESTED_COVERAGE_LABELS: Record<RequestedCoverage, string> = {
  "Workers Comp": "Workers' comp",
  "General Liability": "General liability",
};
