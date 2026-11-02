import { validExperiment } from './contractor-experiment';

/** Reason codes only. Never record arbitrary URL values as telemetry. */
export function contractorFallbackReason(query: Pick<URLSearchParams, 'get'>): string | null {
  const industry = query.get('industry') || '';
  const angle = query.get('angle') || '';
  if (!industry && !angle) return 'missing_industry_and_angle';
  if (!industry) return 'missing_industry';
  if (!angle) return 'missing_angle';
  return validExperiment(industry, angle) ? null : 'invalid_industry_angle_pair';
}
