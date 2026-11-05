import { INDUSTRIES } from './contractor-experiment';

type Detail = { label: string; value: string };
const token = /^[a-z][a-z0-9_]{0,39}$/;
const creative = /^[a-zA-Z0-9_. -]{1,120}$/;
const numericId = /^\d{5,30}$/;
const clickId = /^[a-zA-Z0-9_-]{1,200}$/;

/** Snapshot the URL that opened this form, independently of session first-touch attribution. */
export function contractorSourceDetails(query: URLSearchParams): Detail[] {
  const details: Detail[] = [];
  const add = (label: string, value: string | null, pattern: RegExp) => {
    if (value && pattern.test(value)) details.push({ label, value });
  };
  const industry = query.get('industry');
  if (industry && Object.hasOwn(INDUSTRIES, industry)) {
    details.push({ label: 'Ad URL industry (not confirmed trade)', value: INDUSTRIES[industry as keyof typeof INDUSTRIES] });
    details.push({ label: 'Ad URL industry key', value: industry });
  }
  add('Ad URL angle', query.get('angle'), token);
  add('Ad URL creative variant', query.get('creative_variant'), creative);
  add('Ad URL creative angle', query.get('creative_angle'), creative);
  add('Ad URL creative visual', query.get('creative_visual'), creative);
  add('Ad URL creative CTA', query.get('creative_cta'), creative);
  for (const key of ['ad_id', 'adset_id', 'campaign_id']) add(`Current ${key}`, query.get(key), numericId);
  add('Current Meta click id', query.get('fbclid'), clickId);
  return details;
}
