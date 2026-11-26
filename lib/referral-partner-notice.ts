import { ALERT_SUBJECT_TAG, PAYOUT_BLOCK, type MailFn } from "@/lib/referral-partners";

// Nam 2026-11-19: when a business requests a quote through a partner's /refer link, the partner gets a SEPARATE
// notice naming the business only - never a CC/BCC on the sub's insurance mail (privacy; thread confusion).
// The partner is looked up from the signup alert quotes@ sent ("PARTNER_CODE: <code>"); no new datastore.
// Off switch: env REFERRAL_PARTNER_NOTICE=off.
// Desk 11/20 23:40Z copy QA 5 (Charmaine; Nam 11/20 "$40 for every referral we quote"): env REFERRAL_NOTICE_PER_QUOTE=on
// (default OFF) replaces the "$120 ($40 each, paid every 3 referrals)" sentence with "That's another $40 once we quote it."

// facebook = the partner signed up from a FB/IG ad (alert line SIGNUP_CHANNEL: facebook, or a Source: facebook... line);
// their no-website referrals must carry proof (lib/referral-proof.ts).
// cold = the partner signed up from a cold-email (Smartlead) link (SIGNUP_CHANNEL: cold_email, or a Source: smartlead... line).
// Kevin 11/23: only cold partners keep the lighter proof rule (no-website referrals only); every other partner's
// referrals always need proof.
export interface PartnerRecord { code: string; name: string; email: string; rate: number; facebook?: boolean; cold?: boolean }
export const LAUNCH_RATE_USD = 40; // partners whose alert predates the RATE_USD line
export type FindText = (q: string) => Promise<string | null>;

const line = (text: string, label: string) => text.match(new RegExp(`^${label}:\\s*(.*)$`, "m"))?.[1]?.trim() ?? "";
const oneLine = (v: string, max = 120) => v.replace(/[\r\n\u2028\u2029]+/g, " ").trim().slice(0, max);

// Kevin 11/23: partners shut down for sending fake referrals (Pamela Hayman: forged EIN letter + Articles for Pelko LLC).
// A shut-down code is no partner at all: no partner notice, no proof gate, no credit; the referred business is still a lead.
// More codes without a deploy: env REFERRAL_BLOCKED_CODES (comma-separated).
export const SHUT_DOWN_PARTNER_CODES = new Set(["267047b09879e8e16c95", "1cab0d58e95d5eacf246"]);
export const partnerShutDown = (code: string, env: Record<string, string | undefined> = process.env) =>
  SHUT_DOWN_PARTNER_CODES.has(code) || (env.REFERRAL_BLOCKED_CODES ?? "").toLowerCase().split(",").map((c) => c.trim()).includes(code);

export async function lookupPartner(code: string, find: FindText): Promise<PartnerRecord | null> {
  if (!/^[a-f0-9]{20}$/.test(code)) return null;
  if (partnerShutDown(code)) return null;
  const text = await find(`in:sent subject:"${ALERT_SUBJECT_TAG}" "${code}"`);
  if (!text || line(text, "PARTNER_CODE") !== code) return null;
  const email = line(text, "Email").toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return null;
  const rate = Number(line(text, "RATE_USD"));
  const facebook = line(text, "SIGNUP_CHANNEL").toLowerCase() === "facebook" || /^(facebook|fb|meta|ig|instagram)\b/i.test(line(text, "Source"));
  const cold = line(text, "SIGNUP_CHANNEL").toLowerCase() === "cold_email" || /^smartlead\b/i.test(line(text, "Source"));
  return { code, name: line(text, "Name"), email, rate: Number.isFinite(rate) && rate > 0 ? rate : LAUNCH_RATE_USD, ...(facebook ? { facebook: true } : {}), ...(cold ? { cold: true } : {}) };
}

export const perQuoteCopyOn = (env: Record<string, string | undefined>) =>
  (env.REFERRAL_NOTICE_PER_QUOTE ?? "").trim().toLowerCase() === "on";

export function noticeText(partner: PartnerRecord, referred: string, perQuote = false): string {
  const first = partner.name.split(" ")[0] || "there";
  const earn = perQuote
    ? `That's another $${partner.rate} once we quote it. Keep sharing your link!`
    : `Once we confirm it qualifies (a contractor, trade, home services or facility maintenance business we insure), it counts toward your next $${partner.rate * PAYOUT_BLOCK} ($${partner.rate} each, paid every ${PAYOUT_BLOCK} referrals). Keep sharing your link!`;
  return [
    `Hi ${first},`,
    "",
    `Good news: ${referred} just requested a quote through your referral link.`,
    "",
    earn,
    "",
    "Thanks,",
    "Kevin",
    "Cohesive Insurance",
  ].join("\n");
}

// Nam 11/21: a referral whose business picked Industry = "Other" is still taken in as a lead, but the partner is
// told it is not a qualifying referral (outside the industries the program covers). It never earns credit.
export const INELIGIBLE_INDUSTRIES = new Set(["Other"]);

export function ineligibleNoticeText(partner: PartnerRecord, referred: string): string {
  const first = partner.name.split(" ")[0] || "there";
  return [
    `Hi ${first},`,
    "",
    `${referred} just requested a quote through your referral link, but it doesn't count as a qualifying referral because the business isn't in one of the industries the referral program covers.`,
    "",
    "Thanks,",
    "Kevin",
    "Cohesive Insurance",
  ].join("\n");
}

// Nam 11/21: submitter IP state differs from the mailing-address state (or the IP is outside the US) -> the partner
// gets this instead of "Good news". It never says WHY (so it can't be gamed).
export function suspiciousNoticeText(partner: PartnerRecord): string {
  const first = partner.name.split(" ")[0] || "there";
  return [`Hi ${first},`, "", "Where did this lead come from? It does not seem like a real lead unfortunately based on submission data.", "", "Thanks,", "Kevin", "Cohesive Insurance"].join("\n");
}

/** Best effort; never throws. Returns what happened, for logs/tests only. */
export async function notifyReferralPartner(
  opts: { code: string; company?: string; name?: string; email?: string; industry?: string; suspicious?: boolean; hold?: boolean },
  env: Record<string, string | undefined>, find: FindText, mail: MailFn,
): Promise<"off" | "no-partner" | "self" | "held" | "sent" | "failed"> {
  try {
    if ((env.REFERRAL_PARTNER_NOTICE ?? "").trim().toLowerCase() === "off") return "off";
    const partner = await lookupPartner(opts.code, find);
    if (!partner) return "no-partner";
    if (opts.hold) return "held"; // proof review unclear: the team decides, then tells the partner by hand
    if (opts.email && opts.email.trim().toLowerCase() === partner.email) return "self";
    const referred = oneLine(opts.company || "") || oneLine(opts.name || "") || "A business";
    const ok = await mail({ to: [partner.email], subject: `${referred} used your referral link`.slice(0, 150), text: opts.suspicious ? suspiciousNoticeText(partner) : INELIGIBLE_INDUSTRIES.has((opts.industry || "").trim()) ? ineligibleNoticeText(partner, referred) : noticeText(partner, referred, perQuoteCopyOn(env)), replyTo: "kevin@cohesiveinsure.com" });
    return ok ? "sent" : "failed";
  } catch { return "failed"; }
}
