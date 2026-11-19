import { randomBytes } from "node:crypto";

// Referral partner program (Nam 2026-11-19): GCs and other contractors sign up, get a personal
// /refer?ref=<code> link, and earn a FLAT $40 per qualified referral, paid in $120 blocks (every 3).
// Each partner keeps the per-referral rate in effect when they signed up (Nam 11/19: future partners may get less);
// the alert's RATE_USD line is the record (payout script + partner notice read it; missing = $40, the launch rate).
// The fee is never contingent on the referred business buying insurance.
// A partner signup is NOT an insurance lead: it never touches /api/intake, the CRM or quotes@ inbound.
// The team alert below is the system of record for code -> partner (scripts/marketing/referral_partner_payouts.py
// reads it from the alert inbox).

export const REFERRAL_FEE_USD = 40;
export const PAYOUT_BLOCK = 3;
export const PAYOUT_BLOCK_USD = REFERRAL_FEE_USD * PAYOUT_BLOCK;
export const ALERT_SUBJECT_TAG = "[referral-partner]";
export const EMAIL_TO_ENV_VAR = "REFERRAL_PARTNERS_EMAIL_TO";
export const DEFAULT_ALERT_TO = ["kevin@cohesiveinsure.com", "nam@cohesiveinsure.com"];
export const PAYOUT_METHODS = ["Venmo"] as const; // Nam 2026-11-19: Venmo only

export interface PartnerInput {
  fullName?: string; businessName?: string; email?: string; phone?: string; trade?: string;
  payoutMethod?: string; payoutHandle?: string; agree?: boolean; website?: string;
  utm?: Partial<Record<"utm_source" | "utm_medium" | "utm_campaign" | "utm_content" | "utm_term" | "fbclid", string>>;
}

const clean = (v: unknown, max = 200) => (typeof v === "string" ? v.replace(/[\r\n\u2028\u2029]+/g, " ").trim().slice(0, max) : "");
const okEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const okPhone = (v: string) => v.replace(/\D/g, "").length >= 10;

export function validatePartner(input: PartnerInput): Record<string, string> {
  const e: Record<string, string> = {};
  if (!clean(input.fullName)) e.fullName = "Please enter your name.";
  if (!clean(input.businessName)) e.businessName = "Please enter your business name.";
  if (!okEmail(clean(input.email))) e.email = "Please enter a valid email.";
  if (!okPhone(clean(input.phone))) e.phone = "Please enter a 10-digit phone number.";
  if (clean(input.payoutHandle).replace(/^@/, "").length < 2) e.payoutHandle = "Please enter your Venmo username.";
  if (input.agree !== true) e.agree = "Please agree to the program terms.";
  return e;
}

export const newPartnerCode = () => randomBytes(10).toString("hex");
export const partnerLink = (code: string) => `https://www.cohesiveinsure.com/refer?ref=${code}`;

export function alertRecipients(env: Record<string, string | undefined>): string[] {
  const raw = env[EMAIL_TO_ENV_VAR]?.trim();
  const list = raw ? raw.split(",").map((x) => x.trim()).filter(okEmail) : DEFAULT_ALERT_TO;
  // Never quotes@: the fleet ingests quotes@ inbound as insurance leads.
  return list.filter((x) => x.toLowerCase() !== "quotes@cohesiveinsure.com");
}

export function alertText(input: PartnerInput, code: string): string {
  const utm = input.utm ?? {};
  return [
    "New referral partner signup (website /referral-program). Not an insurance lead.",
    `PARTNER_CODE: ${code}`,
    `RATE_USD: ${REFERRAL_FEE_USD}`,
    `Link: ${partnerLink(code)}`,
    `Name: ${clean(input.fullName)}`,
    `Business: ${clean(input.businessName)}${clean(input.trade) ? ` (${clean(input.trade)})` : ""}`,
    `Email: ${clean(input.email).toLowerCase()}`,
    `Phone: ${clean(input.phone)}`,
    `Payout: Venmo - @${clean(input.payoutHandle).replace(/^@/, "")}`,
    clean(utm.utm_source) && `Source: ${clean(utm.utm_source)}${clean(utm.utm_campaign) ? ` / ${clean(utm.utm_campaign)}` : ""}${clean(utm.utm_content) ? ` / ${clean(utm.utm_content)}` : ""}`,
    `Terms: flat $${REFERRAL_FEE_USD} per qualified referral, paid $${PAYOUT_BLOCK_USD} per ${PAYOUT_BLOCK}; not contingent on purchase.`,
    "Payouts: scripts/marketing/referral_partner_payouts.py",
  ].filter(Boolean).join("\n");
}

export function welcomeText(input: PartnerInput, code: string): string {
  const first = clean(input.fullName).split(" ")[0] || "there";
  return [
    `Hi ${first},`,
    "",
    "Thanks for joining the Cohesive referral program. Here is your personal link:",
    partnerLink(code),
    "",
    `Send it to subs and other businesses that need insurance. You get $${REFERRAL_FEE_USD} for every business that requests a quote through your link, whether or not they buy. We pay $${PAYOUT_BLOCK_USD} each time you reach ${PAYOUT_BLOCK} referrals, by Venmo.`,
    "",
    "Just share the link. You don't need to explain coverage; our licensed agents handle that.",
    "",
    "Questions? Reply to this email.",
    "",
    "Thanks,",
    "Kevin",
    "Cohesive Insurance",
  ].join("\n");
}

export type MailFn = (opts: { to: string[]; subject: string; text: string; replyTo?: string }) => Promise<boolean>;
export interface PartnerResult { status: number; body: { ok: boolean; code?: string; url?: string; errors?: Record<string, string>; message?: string } }

/** honeypot -> validation -> team alert (must succeed: it is the record) -> welcome email (best effort). */
export async function handlePartnerSignup(raw: unknown, env: Record<string, string | undefined>, mail: MailFn, makeCode = newPartnerCode): Promise<PartnerResult> {
  const input = (raw && typeof raw === "object" ? raw : {}) as PartnerInput;
  if (clean(input.website)) return { status: 200, body: { ok: true } };
  const errors = validatePartner(input);
  if (Object.keys(errors).length) return { status: 400, body: { ok: false, errors } };
  const code = makeCode();
  const to = alertRecipients(env);
  let recorded = false;
  try {
    recorded = to.length > 0 && await mail({ to, subject: `${ALERT_SUBJECT_TAG} ${clean(input.businessName)} - ${clean(input.fullName)}`.slice(0, 180), text: alertText(input, code) });
  } catch { recorded = false; }
  if (!recorded) return { status: 502, body: { ok: false, message: "We couldn't sign you up right now. Please call (929) 594-5450 or email kevin@cohesiveinsure.com." } };
  try {
    await mail({ to: [clean(input.email).toLowerCase()], subject: "Your Cohesive referral link", text: welcomeText(input, code), replyTo: "kevin@cohesiveinsure.com" });
  } catch { /* the link is also shown on screen */ }
  return { status: 200, body: { ok: true, code, url: partnerLink(code) } };
}
