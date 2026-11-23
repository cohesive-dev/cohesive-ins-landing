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
  fullName?: string; businessName?: string; email?: string; phone?: string; trade?: string; program?: string;
  payoutMethod?: string; payoutHandle?: string; agree?: boolean; website?: string;
  currentBusiness?: string; sourcing?: string[];
  utm?: Partial<Record<"utm_source" | "utm_medium" | "utm_campaign" | "utm_content" | "utm_term" | "fbclid", string>>;
}

// Same list/test as lib/referral-partner-sourcing.ts (client-safe copy for the form; the test asserts they match).
export const SOURCING_OPTIONS = ["My subcontractors / crews", "Other contractors I know", "Suppliers / vendors", "My customers", "Social media / Facebook groups", "Trade groups / associations", "Real estate / property contacts", "Friends / family", "Other"] as const;
// Kevin 11/23: same as lib/referral-partner-sourcing.ts (the test asserts they match).
export const isColdUtm = (utm?: { utm_source?: string | null }) => /^smartlead$/i.test((utm?.utm_source ?? "").trim());
export const INVITE_ONLY_MESSAGE = "Our referral partner program is invite-only right now. If we emailed you about it, please sign up with the link in that email, or email kevin@cohesiveinsure.com.";
export const isFacebookUtm = (utm?: { utm_source?: string | null; fbclid?: string | null }) =>
  /^(facebook|fb|meta|ig|instagram)$/i.test((utm?.utm_source ?? "").trim()) || Boolean((utm?.fbclid ?? "").trim());
const sourcingList = (input: PartnerInput) =>
  (Array.isArray(input.sourcing) ? input.sourcing : []).filter((x): x is string => typeof x === "string" && (SOURCING_OPTIONS as readonly string[]).includes(x));

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
  if (isFacebookUtm(input.utm)) {
    if (clean(input.currentBusiness).length < 3) e.currentBusiness = "Please tell us what your current business is.";
    if (!sourcingList(input).length) e.sourcing = "Please pick at least one.";
  }
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

export const isClientProgram = (input: PartnerInput) => clean(input.program) === "client";
// Kevin 11/23 ("only get referral partners from the cold email campaigns... too many scammers from FB"): the partner
// program accepts a signup only from a cold-email link. /client-referrals (existing clients) is unchanged.
// Off switch: env REFERRAL_PARTNER_COLD_ONLY=off.
export const coldOnlyOn = (env: Record<string, string | undefined>) => (env.REFERRAL_PARTNER_COLD_ONLY ?? "").trim().toLowerCase() !== "off";

export function alertText(input: PartnerInput, code: string): string {
  const utm = input.utm ?? {};
  const client = isClientProgram(input);
  return [
    client ? "New CLIENT referral signup (website /client-referrals). Not an insurance lead." : "New referral partner signup (website /referral-program). Not an insurance lead.",
    `PROGRAM: ${client ? "client" : "partner"}`,
    `PARTNER_CODE: ${code}`,
    `RATE_USD: ${REFERRAL_FEE_USD}`,
    isFacebookUtm(input.utm) && "SIGNUP_CHANNEL: facebook",
    isColdUtm(input.utm) && "SIGNUP_CHANNEL: cold_email",
    `Link: ${partnerLink(code)}`,
    `Name: ${clean(input.fullName)}`,
    `Business: ${clean(input.businessName)}${clean(input.trade) ? ` (${clean(input.trade)})` : ""}`,
    `Email: ${clean(input.email).toLowerCase()}`,
    `Phone: ${clean(input.phone)}`,
    clean(input.currentBusiness) && `Current business: ${clean(input.currentBusiness, 300)}`,
    sourcingList(input).length > 0 && `Sourcing referrals from: ${sourcingList(input).join(", ")}`,
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
    isClientProgram(input)
      ? `Send it to business owners you know who need insurance: contractors, churches, commercial property owners and restaurants. You get $${REFERRAL_FEE_USD} for every one that requests a quote through your link, whether or not they buy. We pay $${PAYOUT_BLOCK_USD} each time you reach ${PAYOUT_BLOCK} referrals, by Venmo.`
      : `Send it to contractors that need insurance (roofers, remodelers, plumbers, tree services and other trades). Only contractor referrals count. You get $${REFERRAL_FEE_USD} for every contractor that requests a quote through your link, whether or not they buy. We pay $${PAYOUT_BLOCK_USD} each time you reach ${PAYOUT_BLOCK} referrals, by Venmo.`,
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
  if (!isClientProgram(input) && coldOnlyOn(env) && !isColdUtm(input.utm)) return { status: 403, body: { ok: false, message: INVITE_ONLY_MESSAGE } };
  const errors = validatePartner(input);
  if (Object.keys(errors).length) return { status: 400, body: { ok: false, errors } };
  const code = makeCode();
  const to = alertRecipients(env);
  let recorded = false;
  try {
    recorded = to.length > 0 && await mail({ to, subject: `${ALERT_SUBJECT_TAG}${isClientProgram(input) ? " (client)" : ""} ${clean(input.businessName)} - ${clean(input.fullName)}`.slice(0, 180), text: alertText(input, code) });
  } catch { recorded = false; }
  if (!recorded) return { status: 502, body: { ok: false, message: "We couldn't sign you up right now. Please call (929) 594-5450 or email kevin@cohesiveinsure.com." } };
  try {
    await mail({ to: [clean(input.email).toLowerCase()], subject: "Your Cohesive referral link", text: welcomeText(input, code), replyTo: "kevin@cohesiveinsure.com" });
  } catch { /* the link is also shown on screen */ }
  return { status: 200, body: { ok: true, code, url: partnerLink(code) } };
}
