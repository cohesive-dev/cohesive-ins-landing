import { ALERT_SUBJECT_TAG, PAYOUT_BLOCK, type MailFn } from "@/lib/referral-partners";

// Nam 2026-11-19: when a business requests a quote through a partner's /refer link, the partner gets a SEPARATE
// notice naming the business only - never a CC/BCC on the sub's insurance mail (privacy; thread confusion).
// The partner is looked up from the signup alert quotes@ sent ("PARTNER_CODE: <code>"); no new datastore.
// Off switch: env REFERRAL_PARTNER_NOTICE=off.

export interface PartnerRecord { code: string; name: string; email: string; rate: number }
export const LAUNCH_RATE_USD = 40; // partners whose alert predates the RATE_USD line
export type FindText = (q: string) => Promise<string | null>;

const line = (text: string, label: string) => text.match(new RegExp(`^${label}:\\s*(.*)$`, "m"))?.[1]?.trim() ?? "";
const oneLine = (v: string, max = 120) => v.replace(/[\r\n\u2028\u2029]+/g, " ").trim().slice(0, max);

export async function lookupPartner(code: string, find: FindText): Promise<PartnerRecord | null> {
  if (!/^[a-f0-9]{20}$/.test(code)) return null;
  const text = await find(`in:sent subject:"${ALERT_SUBJECT_TAG}" "${code}"`);
  if (!text || line(text, "PARTNER_CODE") !== code) return null;
  const email = line(text, "Email").toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return null;
  const rate = Number(line(text, "RATE_USD"));
  return { code, name: line(text, "Name"), email, rate: Number.isFinite(rate) && rate > 0 ? rate : LAUNCH_RATE_USD };
}

export function noticeText(partner: PartnerRecord, referred: string): string {
  const first = partner.name.split(" ")[0] || "there";
  return [
    `Hi ${first},`,
    "",
    `Good news: ${referred} just requested a quote through your referral link.`,
    "",
    `Once we confirm it qualifies (a contractor or service business we insure), it counts toward your next $${partner.rate * PAYOUT_BLOCK} ($${partner.rate} each, paid every ${PAYOUT_BLOCK} referrals). Keep sharing your link!`,
    "",
    "Thanks,",
    "Kevin",
    "Cohesive Insurance",
  ].join("\n");
}

/** Best effort; never throws. Returns what happened, for logs/tests only. */
export async function notifyReferralPartner(
  opts: { code: string; company?: string; name?: string; email?: string },
  env: Record<string, string | undefined>, find: FindText, mail: MailFn,
): Promise<"off" | "no-partner" | "self" | "sent" | "failed"> {
  try {
    if ((env.REFERRAL_PARTNER_NOTICE ?? "").trim().toLowerCase() === "off") return "off";
    const partner = await lookupPartner(opts.code, find);
    if (!partner) return "no-partner";
    if (opts.email && opts.email.trim().toLowerCase() === partner.email) return "self";
    const referred = oneLine(opts.company || "") || oneLine(opts.name || "") || "A business";
    const ok = await mail({ to: [partner.email], subject: `${referred} used your referral link`.slice(0, 150), text: noticeText(partner, referred), replyTo: "kevin@cohesiveinsure.com" });
    return ok ? "sent" : "failed";
  } catch { return "failed"; }
}
