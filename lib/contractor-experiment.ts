import {TRADES} from './contractor-trades';
import { acceptedPhoneShape } from './phone-shape';
export const INDUSTRIES = {
  pool:'Pool construction', remodel:'Remodeling', roof:'Roofing',
  tree:'Tree services', painting:'Painting', hvac:'HVAC',
} as const;
export type Industry = keyof typeof INDUSTRIES;
export type Answers = Record<string,string>;
export const ANGLES:Record<Industry,string[]> = {
  pool:['percent','dollars','installation','coi'],
  remodel:['percent','dollars','trade_mix','coi'], roof:['percent','coi','free_gen'],
  tree:['coverage','savings','coi'],painting:['savings','coi','free_gen'],hvac:['installation','coi','free_gen'],
};
export const QUESTION_OPTIONS = {
  revenue:['Under $250k','$250k-$500k','$500k-$1M','$1M-$2M','$2M-$4M','$4M-$8M','Over $8M'],
  payroll:['$0','Under $50k','$50k-$100k','$100k-$250k','$250k-$500k','$500k-$1M','$1M+'],
  subcontractorCosts:['$0 - no subcontractors','Under $25k','$25k-$50k','$50k-$100k','$100k-$250k','$250k-$500k','$500k-$1M','$1M+'],
  currentGl:['Insured - renewing within 30 days','Insured - renewing later','Not insured - need coverage within 30 days','Not insured - comparing options'],
};
export const LABELS:Record<string,string>={email:'Email address',phone:'Phone number',fullName:'Full name',legalName:'Business name',revenue:'Annual revenue',payroll:'Annual W2 payroll',subcontractorCosts:'Annual subcontractor spend',currentGl:'Current insurance / renewal timing',mailingAddress:'Mailing address',trade:'Primary trade'};
export function fieldsFor(_a:Answers,layout:'step'|'long') {
  const business=['revenue','payroll','subcontractorCosts','currentGl'];
  return layout==='step'?[...business,'legalName','fullName','email','phone']:['email','phone','fullName','legalName',...business];
}
export function validField(field:string,value:string|undefined) {
  if(!value?.trim())return false;
  if(field==='email')return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  if(field==='phone')return acceptedPhoneShape(value);
  if(field in QUESTION_OPTIONS)return QUESTION_OPTIONS[field as keyof typeof QUESTION_OPTIONS].includes(value);
  return value.trim().length>=2&&value.length<=200;
}
export function normalizeAnswers(a:Answers):Answers {
  const next={...a};
  // Ignore stale count answers; dollar amounts must be selected explicitly.
  delete next.employees;
  return next;
}
export function experimentValid(a:Answers) {return fieldsFor(a,'long').every(k=>validField(k,a[k]));}
export function validExperiment(industry:string,angle:string):industry is Industry {
  return Object.hasOwn(INDUSTRIES,industry)&&ANGLES[industry as Industry].includes(angle);
}

// Paid contact-first release only; cold-email layouts retain their existing order.
export function contractorScreens(needsTrade=false):string[][] {return [['email','phone','fullName'],[...(needsTrade?['trade']:[]),'revenue'],['payroll'],['subcontractorCosts'],['currentGl'],['legalName','mailingAddress']];}
export function contractorFields(layout:'step'|'long',needsTrade=false):string[] {if(layout==='step')return contractorScreens(needsTrade).flat();const fields=[...fieldsFor({},'long'),'mailingAddress'];if(needsTrade)fields.splice(3,0,'trade');return fields;}
export function validContractorField(field:string,value:string|undefined){return field==='trade'?TRADES.some(t=>t.value===value):field==='mailingAddress'?(!value?.trim()||value.trim().length>=5&&value.length<=200):validField(field,value);}
