/** Strict allowlist: no entered answers, contact values, URLs or error prose. */
export const FUNNEL_EVENTS = ['form_view','field_view','field_focus','field_complete','field_clear','field_error','submit_attempt','intake_accepted','submit_error','session_exit'] as const;
export type FunnelEvent = {
  eventId:string; sessionId:string; cellId:string; version:string;
  event:typeof FUNNEL_EVENTS[number]; field?:string; elapsedMs:number;
  adId?:string; adsetId?:string; campaignId?:string; submissionId?:string;
};
const UUID=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
const FIELDS=new Set(['email','phone','fullName','legalName','revenue','employees','payroll','subcontractorCosts','currentGl']);
const CELL=/^(pool|remodel|roof|tree|painting|hvac)__([a-z_]+)__(step|long)__v1$/;
export function validateFunnelEvent(input:unknown):FunnelEvent|null {
  if (!input || typeof input!=='object') return null;
  const v=input as Record<string,unknown>;
  const allowed=new Set(['eventId','sessionId','cellId','version','event','field','elapsedMs','adId','adsetId','campaignId','submissionId']);
  if(Object.keys(v).some(k=>!allowed.has(k)))return null;
  if(typeof v.eventId!=='string'||!UUID.test(v.eventId)||typeof v.sessionId!=='string'||!UUID.test(v.sessionId))return null;
  if(typeof v.cellId!=='string'||!CELL.test(v.cellId)||v.version!=='2026-09-12-v1')return null;
  if(!FUNNEL_EVENTS.includes(v.event as typeof FUNNEL_EVENTS[number]))return null;
  if(!Number.isInteger(v.elapsedMs)||(v.elapsedMs as number)<0||(v.elapsedMs as number)>86400000)return null;
  if(v.field!==undefined&&(typeof v.field!=='string'||!FIELDS.has(v.field)))return null;
  if(String(v.event).startsWith('field_')&&!v.field)return null;
  for(const key of ['adId','adsetId','campaignId'])if(v[key]!==undefined&&(typeof v[key]!=='string'||!/^\d{5,30}$/.test(v[key] as string)))return null;
  if(v.submissionId!==undefined&&(typeof v.submissionId!=='string'||!UUID.test(v.submissionId)))return null;
  return v as FunnelEvent;
}
