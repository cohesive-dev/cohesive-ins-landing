export type ContractorArm = 'current' | 'short';

// Kevin's November 11 allocation was 20% current, 80% confirmed-save short.
// Kevin 2026-11-19: "push 100%" - every new visitor gets the confirmed-save short arm, because a saved
// contact is the lead. A visitor already stored on 'current' keeps it (the CI control suite relies on that).
// The input is a uniformly random unsigned 32-bit integer.
const CURRENT_ARM_CUTOFF = 0;

export function contractorArmFromRandom(value: number): ContractorArm {
  return value < CURRENT_ARM_CUTOFF ? 'current' : 'short';
}
