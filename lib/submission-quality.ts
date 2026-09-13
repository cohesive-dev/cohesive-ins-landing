import { createHash, createHmac } from 'node:crypto';

export type QualityInput = {name?:string;email?:string;phone?:string;company?:string;honeypot?:unknown};
export type QualityDecision = {kind:'accept'|'reject'|'review';reason:string};
const clean=(v:string|undefined)=>(v||'').trim().toLowerCase().replace(/\s+/g,' ');
export const identityHash=(v:string)=>createHash('sha256').update(clean(v)).digest('hex');
// Server-only confirmed-fake identifiers. Never match by name alone.
const confirmedFakeHashes=['17f6803e9410842a96cd7a74f9cd51377c960aa55c23e9d8887fe727c7b20f9b','c76957ec53858fe1a7b846b7f59aa42e44be7f47a60d59b35f1c58253ac0e8fa'];
export function assessSubmission(input:QualityInput,blockedHashes:string[]=[]):QualityDecision {
 if(typeof input.honeypot==='string'&&input.honeypot.trim())return {kind:'reject',reason:'honeypot'};
 const email=clean(input.email),phone=(input.phone||'').replace(/\D/g,'');
 if(!email||! /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))return {kind:'reject',reason:'invalid_email'};
 const phoneShape=/^1?[2-9]\d{2}[2-9]\d{6}$/.test(phone)||(input.phone?.startsWith('+')&&!phone.startsWith('1')&&/^[2-9]\d{7,14}$/.test(phone));
 if(!phoneShape||/^(\d)\1+$/.test(phone))return {kind:'reject',reason:'invalid_phone'};
 if(!clean(input.name)||!clean(input.company))return {kind:'reject',reason:'missing_identity'};
 const blocked=new Set([...confirmedFakeHashes,...blockedHashes]);
 if(blocked.has(identityHash(email))||blocked.has(identityHash(phone))||(/^\d{10}$/.test(phone)&&blocked.has(identityHash('1'+phone))))return {kind:'reject',reason:'known_fake'};
 // Exact observed combination only. Do not reject people on an unfamiliar name alone.
 if(clean(input.name)==='dick butts'&&clean(input.company)==='b')return {kind:'review',reason:'manual_review'};
 if(/@(?:example\.(?:com|invalid)|test\.com)$/.test(email))return {kind:'review',reason:'test_identity'};
 return {kind:'accept',reason:'passed_basic_checks'};
}

/** Stable within an Eastern calendar day. Meta dedupes retries across instances/ad cells.
 * Uses a secret HMAC, never a raw contact hash sent to the browser. This is NOT a
 * qualified-lead decision, a rolling-24h suppression rule, or a durable send outbox.
 */
export function acquisitionEventId(input:QualityInput,secret:string,date=new Date()):string {
 if(!secret)throw Error('Missing conversion identity secret');
 const day=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
 return 'accepted-'+createHmac('sha256',secret).update(JSON.stringify([day,clean(input.email),clean(input.company)])).digest('hex');
}
