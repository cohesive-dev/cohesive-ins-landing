export type ContractorArm = 'current' | 'short';

// Kevin's November 11 allocation: 20% current, 80% confirmed-save short.
// The input is a uniformly random unsigned 32-bit integer.
const CURRENT_ARM_CUTOFF = Math.floor(0x100000000 / 5);

export function contractorArmFromRandom(value: number): ContractorArm {
  return value < CURRENT_ARM_CUTOFF ? 'current' : 'short';
}
