import type { Industry } from './contractor-experiment';

export const COLD_CAMPAIGNS = {
  'roof-link-first': { industry: 'roof', angle: 'email_link_first' },
  'roof-quick-link': { industry: 'roof', angle: 'email_quick_link' },
  'pool-link-first': { industry: 'pool', angle: 'email_link_first' },
  'pool-quick-link': { industry: 'pool', angle: 'email_quick_link' },
} as const;
export type ColdLayout = 'step' | 'long';
export function coldEmailContext(query: Pick<URLSearchParams, 'get'>, layout: ColdLayout) {
  const campaign = query.get('utm_campaign') || '';
  const configured = Object.hasOwn(COLD_CAMPAIGNS, campaign)
    ? COLD_CAMPAIGNS[campaign as keyof typeof COLD_CAMPAIGNS] : undefined;
  const industry = configured?.industry || query.get('industry') || '';
  const angle = configured?.angle || 'email_direct';
  return { campaign: configured ? campaign : 'unattributed', industry, angle,
    cellId: `${industry}__${angle}__${layout}__v1` };
}
export function coldEmailUrl(layout: ColdLayout, campaign: keyof typeof COLD_CAMPAIGNS) {
  const query = new URLSearchParams({ industry: COLD_CAMPAIGNS[campaign].industry,
    utm_source: 'smartlead', utm_medium: 'email', utm_campaign: campaign });
  return `https://www.cohesiveinsure.com/email/contractors/${layout}?${query}`;
}
export function isColdIndustry(value: string): value is Industry {
  return ['pool', 'remodel', 'roof', 'tree', 'painting', 'hvac'].includes(value);
}
