import { createHash, createHmac } from 'node:crypto';
import { acceptedPhoneShape } from './phone-shape';

export type QualityInput = {name?:string;email?:string;phone?:string;company?:string;honeypot?:unknown};
export type QualityDecision = {kind:'accept'|'reject'|'review';reason:string};
const clean=(v:string|undefined)=>(v||'').trim().toLowerCase().replace(/\s+/g,' ');
export const identityHash=(v:string)=>createHash('sha256').update(clean(v)).digest('hex');
// Server-only confirmed-fake identifiers. Never match by name alone.
const confirmedFakeHashes=['17f6803e9410842a96cd7a74f9cd51377c960aa55c23e9d8887fe727c7b20f9b','c76957ec53858fe1a7b846b7f59aa42e44be7f47a60d59b35f1c58253ac0e8fa'];
// requireCompany:false is the contact-step save (Kevin 2026-11-19: a saved contact is a lead); the business
// name is asked on the next page, so only that one check is skipped.
export function assessSubmission(input:QualityInput,blockedHashes:string[]=[],{requireCompany=true}:{requireCompany?:boolean}={}):QualityDecision {
 if(typeof input.honeypot==='string'&&input.honeypot.trim())return {kind:'reject',reason:'honeypot'};
 const email=clean(input.email),phone=(input.phone||'').replace(/\D/g,'');
 if(!email||! /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))return {kind:'reject',reason:'invalid_email'};
 const phoneShape=acceptedPhoneShape(input.phone);
 if(!phoneShape||/^(\d)\1+$/.test(phone))return {kind:'reject',reason:'invalid_phone'};
 if(!clean(input.name)||(requireCompany&&!clean(input.company)))return {kind:'reject',reason:'missing_identity'};
 const blocked=new Set([...confirmedFakeHashes,...blockedHashes]);
 if(blocked.has(identityHash(email))||blocked.has(identityHash(phone))||(/^\d{10}$/.test(phone)&&blocked.has(identityHash('1'+phone))))return {kind:'reject',reason:'known_fake'};
 // Exact observed combination only. Do not reject people on an unfamiliar name alone.
 if(clean(input.name)==='dick butts'&&clean(input.company)==='b')return {kind:'review',reason:'manual_review'};
 if(/@(?:example\.(?:com|invalid)|test\.com)$/.test(email))return {kind:'review',reason:'test_identity'};
 return {kind:'accept',reason:'passed_basic_checks'};
}

/** Stable within an Eastern calendar day. Meta dedupes retries across instances/ad cells.
 * Keyed on email only (2026-11-19, was email + company): the contact-step Lead, sent before the business
 * name is known, and the later full submit must share one event ID so Meta counts the person once.
 * Uses a secret HMAC, never a raw contact hash sent to the browser. This is NOT a
 * qualified-lead decision, a rolling-24h suppression rule, or a durable send outbox.
 */
export function acquisitionEventId(input:QualityInput,secret:string,date=new Date()):string {
 if(!secret)throw Error('Missing conversion identity secret');
 const day=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
 return 'accepted-'+createHmac('sha256',secret).update(JSON.stringify([day,clean(input.email)])).digest('hex');
}
