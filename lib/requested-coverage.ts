// Coverage a page may request on a lead (CRM line names; the CRM normalises them in
// src/lib/insuranceLines.ts). /api/intake forwards ONLY these, so a crafted body can't write an
// arbitrary line onto a lead; the type keeps a guide from setting a value the route would drop.
export const REQUESTED_COVERAGE_ALLOWLIST = ["Workers Comp", "General Liability"] as const;
export type RequestedCoverage = (typeof REQUESTED_COVERAGE_ALLOWLIST)[number];
