export type ContractorArm = 'current' | 'short' | 'trade_first';
export type ContractorHero = 'ai' | 'trust';

// Kevin's November 11 allocation was 20% current, 80% confirmed-save short.
// Kevin 2026-11-19: "push 100%" to the confirmed-save short arm, because a saved contact is the lead.
// Kevin 2026-11-19 (later): test a trade-first page 1 (one tap on the trade, then contact) on 10% of new visitors.
// A visitor already stored on an arm keeps it (the CI control suite relies on 'current').
// The input is a uniformly random unsigned 32-bit integer.
const TRADE_FIRST_CUTOFF = Math.floor(0x100000000 / 10);

export function contractorArmFromRandom(value: number): ContractorArm {
  return value < TRADE_FIRST_CUTOFF ? 'trade_first' : 'short';
}

// Independent 50/50 hero test (Kevin 2026-11-19): the AI subhead vs a shorter trust line.
export function contractorHeroFromRandom(value: number): ContractorHero {
  return value < 0x80000000 ? 'ai' : 'trust';
}

// Form versions from 2026-11-19 carry both the arm and the hero, e.g. 2026-11-19-tradefirst-trust-v2.
export const CONTRACTOR_V2_VERSION = /^2026-11-19-(current|short|tradefirst)-(ai|trust)-v2$/;
export function contractorFormVersion(arm: ContractorArm, hero: ContractorHero): string {
  return `2026-11-19-${arm === 'trade_first' ? 'tradefirst' : arm}-${hero}-v2`;
}

// One-tap trade chips for the trade-first arm. The advertised trade (from ?industry=) comes first.
const AD_TRADE: Record<string, string> = {
  pool: 'Pool construction / service', remodel: 'Remodeling / renovations', remodeling: 'Remodeling / renovations',
  roof: 'Roofing', roofing: 'Roofing', tree: 'Tree service', painting: 'Painting',
  hvac: 'HVAC / heating and air conditioning', electrical: 'Electrical', plumbing: 'Plumbing',
  welding: 'Welding / metal fabrication', fire_sprinkler: 'Fire sprinkler installation',
  home_builder: 'New home construction / builder', excavation: 'Excavation / grading / site work',
  concrete_masonry: 'Masonry / concrete', windows_siding: 'Siding / gutters',
};
const COMMON = ['General contractor', 'Remodeling / renovations', 'Roofing', 'Plumbing', 'Electrical', 'HVAC / heating and air conditioning', 'Painting'];
export const CHIP_LABEL: Record<string, string> = {
  'Remodeling / renovations': 'Remodeling', 'HVAC / heating and air conditioning': 'HVAC',
  'Pool construction / service': 'Pools', 'Welding / metal fabrication': 'Welding',
  'Fire sprinkler installation': 'Fire sprinklers', 'New home construction / builder': 'Home builder',
  'Excavation / grading / site work': 'Excavation', 'Masonry / concrete': 'Concrete / masonry', 'Siding / gutters': 'Siding / gutters',
};
export function tradeChips(industry: string | null): string[] {
  const first = AD_TRADE[industry || ''];
  return [...new Set([...(first ? [first] : []), ...COMMON])].slice(0, 5);
}
