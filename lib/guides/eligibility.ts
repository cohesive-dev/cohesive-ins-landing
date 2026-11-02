// Current placement footprint from reference_kevin_license_numbers_by_state.md:
// all states except CA. Roofing excluded NY/FL until 2026-10-22, when a roofing market that writes both was
// appointed. Recheck before changing.
const ROOFING_RESTRICTED_STATES: string[] = [];
export function startupPlacementRestriction(state: string, industry: string): string | null {
  if (state === "california") return "Cohesive does not currently offer insurance placement in California.";
  if (industry.toLowerCase() === "roofing" && ROOFING_RESTRICTED_STATES.includes(state)) return "Cohesive does not currently offer roofing insurance placement in this state.";
  return null;
}
