// Roofing-leads offer (Kevin 2026-10-20): the SAME workflow as the Cohesive AI /catering-leads page.
// A signup never enters the insurance intake / CRM. It posts to the Slack group DM (En, Mario, Christopher) via
// ROOFING_LEADS_SLACK_BOT_TOKEN + ROOFING_LEADS_SLACK_CHANNEL (or ROOFING_LEADS_WEBHOOK_URL), then the page asks the
// lead to book the demo Calendly. Kept free of Next.js / React imports so scripts/test-roofing-leads.mjs can run it.

export const OFFERS = {
  "per-lead": { label: "About $30 a lead", slack: "~$30/lead offer" },
  monthly: { label: "3-5 leads a month for $100", slack: "$100/mo offer" },
} as const;
export type OfferId = keyof typeof OFFERS;
export function resolveOffer(v: unknown): OfferId {
  return typeof v === "string" && Object.prototype.hasOwnProperty.call(OFFERS, v) ? (v as OfferId) : "per-lead";
}

export const ROOFING_WORK = ["Residential", "Commercial", "Both", "I'm not a roofer"] as const;
export const NOT_A_ROOFER = "I'm not a roofer";
export const DISQUALIFIED_MESSAGE = "Thanks for your interest. This offer is for roofing businesses right now.";
export const CONTACT_EMAIL = "quotes@cohesiveinsure.com";
export const SLACK_TOKEN_ENV_VAR = "ROOFING_LEADS_SLACK_BOT_TOKEN";
export const SLACK_CHANNEL_ENV_VAR = "ROOFING_LEADS_SLACK_CHANNEL";
export const WEBHOOK_ENV_VAR = "ROOFING_LEADS_WEBHOOK_URL";
export const CALENDLY_DEMO_URL = "https://calendly.com/cohesiveapp/demo";

export interface RoofingLeadInput {
  fullName?: string; businessName?: string; email?: string; phone?: string; serviceArea?: string; roofingWork?: string;
  offer?: string; website?: string; partial?: boolean; pageUrl?: string;
  utm?: Partial<Record<"utm_source" | "utm_medium" | "utm_campaign" | "utm_content" | "utm_term" | "fbclid", string>>;
}

const clean = (v: unknown, max = 200) => (typeof v === "string" ? v.replace(/[\r\n\u2028\u2029]+/g, " ").trim().slice(0, max) : "");
const okEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const okPhone = (v: string) => v.replace(/\D/g, "").length >= 10;

export function validateLead(input: RoofingLeadInput): Record<string, string> {
  const e: Record<string, string> = {};
  if (!clean(input.fullName)) e.fullName = "Please enter your name.";
  if (!clean(input.businessName)) e.businessName = "Please enter your business name.";
  if (!okEmail(clean(input.email))) e.email = "Please enter a valid email.";
  if (!okPhone(clean(input.phone))) e.phone = "Please enter a 10-digit phone number.";
  if (!clean(input.serviceArea)) e.serviceArea = "Please enter your service area.";
  if (!(ROOFING_WORK as readonly string[]).includes(clean(input.roofingWork))) e.roofingWork = "Please choose the roofing work you do.";
  return e;
}

export function slackLeadText(input: RoofingLeadInput): string {
  const offer = resolveOffer(input.offer);
  const utm = input.utm ?? {};
  return [
    input.partial
      ? `Partial roofing-leads signup (website, ${OFFERS[offer].slack}): left without submitting - follow up`
      : `New roofing-leads signup (website, ${OFFERS[offer].slack})`,
    clean(input.businessName) && `Business: ${clean(input.businessName)}${clean(input.roofingWork) ? ` (${clean(input.roofingWork)})` : ""}`,
    clean(input.fullName) && `Name: ${clean(input.fullName)}`,
    clean(input.phone) && `Phone: ${clean(input.phone)}`,
    clean(input.email) && `Email: ${clean(input.email).toLowerCase()}`,
    clean(input.serviceArea) && `Service area: ${clean(input.serviceArea)}`,
    clean(utm.utm_campaign) && `Campaign: ${clean(utm.utm_campaign)}${clean(utm.utm_content) ? ` / ${clean(utm.utm_content)}` : ""}`,
    input.partial
      ? "They left the form before submitting, so they were not asked to book. Reach out with whatever they gave."
      : "They were asked to book a demo (calendly.com/cohesiveapp/demo). Call them if they don't book.",
  ].filter(Boolean).join("\n");
}

export type SubmitStatus = "ok" | "disqualified" | "invalid" | "not_configured" | "upstream_error";
export interface SubmitResult { status: number; body: { status: SubmitStatus; errors?: Record<string, string>; message?: string } }
type FetchLike = (url: string, init: { method: string; headers: Record<string, string>; body: string; signal?: AbortSignal }) =>
  Promise<{ ok: boolean; status: number; json?: () => Promise<unknown> }>;

/** Order (as /catering-leads): honeypot -> non-roofer stop (never forwarded) -> validation -> Slack group DM, else webhook,
 *  else 503 with the email fallback. A failed upstream is a 502 with the email fallback - nothing dropped silently. */
export async function handleRoofingLeadSubmission(raw: unknown, env: Record<string, string | undefined>, fetchImpl: FetchLike): Promise<SubmitResult> {
  const input = (raw && typeof raw === "object" ? raw : {}) as RoofingLeadInput;
  if (clean(input.website)) return { status: 200, body: { status: "ok" } };
  if (clean(input.roofingWork) === NOT_A_ROOFER) return { status: 200, body: { status: "disqualified", message: DISQUALIFIED_MESSAGE } };
  if (input.partial === true) {
    if (!okEmail(clean(input.email)) && !okPhone(clean(input.phone))) return { status: 400, body: { status: "invalid", errors: {} } };
  } else {
    const errors = validateLead(input);
    if (Object.keys(errors).length) return { status: 400, body: { status: "invalid", errors } };
  }
  const fail = (message: string): SubmitResult => ({ status: 502, body: { status: "upstream_error", message } });
  const token = env[SLACK_TOKEN_ENV_VAR]?.trim();
  const channel = env[SLACK_CHANNEL_ENV_VAR]?.trim();
  if (token && channel) {
    try {
      const res = await fetchImpl("https://slack.com/api/chat.postMessage", {
        method: "POST", headers: { "Content-Type": "application/json; charset=utf-8", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ channel, text: slackLeadText(input), unfurl_links: false }), signal: AbortSignal.timeout(10_000),
      });
      const data = (res.json ? await res.json() : {}) as { ok?: boolean };
      if (!res.ok || data.ok !== true) throw new Error(`slack ${res.status}`);
    } catch { return fail(`We couldn't take your details online right now. Please email us at ${CONTACT_EMAIL}.`); }
    return { status: 200, body: { status: "ok" } };
  }
  const webhook = env[WEBHOOK_ENV_VAR]?.trim();
  if (!webhook) return { status: 503, body: { status: "not_configured", message: `Please email us at ${CONTACT_EMAIL} and we'll get you set up.` } };
  try {
    const res = await fetchImpl(webhook, { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: `roofing-leads-${resolveOffer(input.offer)}`, ...input, text: slackLeadText(input) }), signal: AbortSignal.timeout(10_000) });
    if (!res.ok) throw new Error(`webhook ${res.status}`);
  } catch { return fail(`Something went wrong sending your details. Please email us at ${CONTACT_EMAIL}.`); }
  return { status: 200, body: { status: "ok" } };
}

export function calendlyBookingUrl(input: { fullName?: string; email?: string; phone?: string; offer: string; utm?: RoofingLeadInput["utm"] }): string {
  const url = new URL(CALENDLY_DEMO_URL);
  if (input.fullName?.trim()) url.searchParams.set("name", input.fullName.trim());
  if (input.email?.trim()) url.searchParams.set("email", input.email.trim().toLowerCase());
  if (input.phone?.trim()) url.searchParams.set("a1", input.phone.trim());
  url.searchParams.set("utm_source", "roofing-leads");
  url.searchParams.set("utm_medium", input.offer);
  if (input.utm?.utm_campaign) url.searchParams.set("utm_campaign", input.utm.utm_campaign);
  if (input.utm?.utm_content) url.searchParams.set("utm_content", input.utm.utm_content);
  return url.toString();
}
export function calendlyEmbedUrl(bookingUrl: string, domain = "www.cohesiveinsure.com"): string {
  const url = new URL(bookingUrl);
  url.searchParams.set("embed_domain", domain);
  url.searchParams.set("embed_type", "Inline");
  url.searchParams.set("hide_gdpr_banner", "1");
  return url.toString();
}
