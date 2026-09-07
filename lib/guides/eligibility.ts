// Current placement footprint from reference_kevin_license_numbers_by_state.md:
// all states except CA; roofing also excludes NY/FL. Recheck before changing.
export function startupPlacementRestriction(state: string, industry: string): string | null {
  if (state === "california") return "Cohesive does not currently offer insurance placement in California.";
  if (industry.toLowerCase() === "roofing" && ["new-york", "florida"].includes(state)) return "Cohesive does not currently offer roofing insurance placement in this state.";
  return null;
}
