import { createHash } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { sendIntakeNotification } from "@/lib/notify";

// This route no longer owns lead storage. A completed submission is forwarded to the CRM's
// inbound-lead webhook, which is the single fan-out point for every lead source (FB Lead Ads,
// SmartFinancial, Benepath, and this form): it upserts Contact/Account/Policy, posts the Slack
// lead card, enrolls the lead in the Smartlead inbound campaign, and sends the first-touch SMS.
//
// Partial autosaves and the abandonment beacon deliberately do NOT go to the CRM — that fan-out
// texts and emails the lead, which must not happen to someone who is still typing or who never
// submitted. Those keep the local quotes@ alert as their only signal.

const CRM_BASE_URL = process.env.CRM_BASE_URL ?? "https://crm.cohesiveinsure.com";
const CRM_INBOUND_LEAD_URL = `${CRM_BASE_URL}/api/webhooks/inbound-lead`;

// Meta Conversions API (server-side Lead, deduped with the browser pixel via a
// shared event_id). Dark-safe: if META_CAPI_TOKEN isn't set it no-ops, exactly
// like the quotes@ mailer without a password — so deploying this is harmless
// until the token is added to the environment.
const CAPI_PIXEL_ID = process.env.META_PIXEL_ID ?? "831179966599677";
const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");

type IntakePayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  businessType?: unknown;
  zip?: unknown;
  partial?: unknown;
  final?: unknown;
  source?: unknown;
  // Ordered [{label, value}] answers from a deep intake form (e.g. /church).
  details?: unknown;
  // Browser-pixel Lead event id, forwarded so the CAPI Lead can dedupe to it.
  eventId?: unknown;
  // OPTIONAL server-side CAPI event name. Absent => "Lead" (today's behavior,
  // so /religious and every existing caller are unchanged). Present => fire the
  // CAPI event under THIS name (used by /restaurant to fire a non-Lead signal
  // for E&S and disqualified/bar outcomes, so the ad optimizer only trains on
  // instant-quotable restaurants). "RestaurantDisqualified" is special-cased
  // below: it fires the custom event but NEVER forwards to the CRM.
  capiEventName?: unknown;
};

// Coerce an unknown `details` payload into a safe ordered [{label, value}].
function sanitizeDetails(
  raw: unknown,
): Array<{ label: string; value: string }> | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out: Array<{ label: string; value: string }> = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const label = asTrimmedString((item as Record<string, unknown>).label);
    const value = asTrimmedString((item as Record<string, unknown>).value);
    if (label && value) out.push({ label, value: value.slice(0, 500) });
  }
  return out.length > 0 ? out.slice(0, 40) : undefined;
}

const asTrimmedString = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;
const E164_RE = /^\+[1-9]\d{7,14}$/;

// Normalize to E.164 so the CRM's (email, phone) upsert key can't fragment on formatting and
// downstream tools (OpenPhone, Smartlead) match exactly. US-biased: bare 10 digits get +1.
// A value that won't normalize is still forwarded raw — the CRM standardizes again on its side,
// and a typo'd-but-real number must never be silently dropped.
function toE164(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const digits = raw.replace(/\D/g, "");
  let candidate: string | undefined;

  if (digits.length === 10 && !raw.startsWith("+")) candidate = `+1${digits}`;
  else if (
    digits.length === 11 &&
    digits.startsWith("1") &&
    !raw.startsWith("+")
  )
    candidate = `+${digits}`;
  else if (raw.startsWith("+")) candidate = `+${digits}`;

  return candidate && E164_RE.test(candidate) ? candidate : undefined;
}

async function forwardToCrm(payload: Record<string, string>): Promise<boolean> {
  try {
    const response = await fetch(CRM_INBOUND_LEAD_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "webform", ...payload }),
      // The browser call is fire-and-forget, so a hung CRM would otherwise pin this
      // function open until the platform timeout.
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      console.error(
        "CRM inbound-lead rejected the submission",
        response.status,
        await response.text().catch(() => ""),
      );
      return false;
    }
    return true;
  } catch (error) {
    console.error("CRM inbound-lead request failed", error);
    return false;
  }
}

// Fire a server-side conversion event to the Conversions API. event_id MUST
// match the browser pixel's eventID so Meta dedupes the two into a single
// conversion. `eventName` defaults to "Lead" (the only value the church /
// religious lane ever uses); /restaurant passes "RestaurantLeadES" or
// "RestaurantDisqualified" to emit a NON-Lead signal. Hashes PII (email/phone)
// per Meta's spec; pulls fbp/fbc/ip/ua from the request for match quality.
// Never throws into the route — logs and returns on failure.
async function sendCapiEvent(
  request: NextRequest,
  eventName: string,
  eventId: string,
  email?: string,
  phone?: string,
): Promise<"sent" | "skipped" | "failed"> {
  const token = process.env.META_CAPI_TOKEN;
  if (!token) {
    console.error("META_CAPI_TOKEN not set — skipping CAPI event");
    return "skipped";
  }

  const userData: Record<string, unknown> = {};
  if (email) userData.em = [sha256(email.trim().toLowerCase())];
  if (phone) userData.ph = [sha256(phone.replace(/\D/g, ""))];
  const fbp = request.cookies.get("_fbp")?.value;
  const fbc = request.cookies.get("_fbc")?.value;
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (ip) userData.client_ip_address = ip;
  const ua = request.headers.get("user-agent");
  if (ua) userData.client_user_agent = ua;

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: "website",
        event_source_url:
          request.headers.get("referer") ??
          "https://cohesiveinsure.com/religious",
        user_data: userData,
      },
    ],
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${CAPI_PIXEL_ID}/events?access_token=${encodeURIComponent(
        token,
      )}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!res.ok) {
      console.error(
        "CAPI event rejected",
        res.status,
        await res.text().catch(() => ""),
      );
      return "failed";
    }
    return "sent";
  } catch (error) {
    console.error("CAPI event request failed", error);
    return "failed";
  }
}

export async function POST(request: NextRequest) {
  let body: IntakePayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // A final beacon always represents an abandoned form, even if the client
  // somehow omitted `partial`.
  const isFinal = body.final === true;
  const isPartial = body.partial === true || isFinal;

  const rawEmail = asTrimmedString(body.email)?.toLowerCase();
  // Partial saves may carry a half-typed email; only use it once it parses.
  const email = rawEmail && EMAIL_RE.test(rawEmail) ? rawEmail : undefined;

  const name = asTrimmedString(body.name);
  const rawPhone = asTrimmedString(body.phone);
  const phone = toE164(rawPhone) ?? rawPhone;
  const businessType = asTrimmedString(body.businessType);
  const zip = asTrimmedString(body.zip);
  const source = asTrimmedString(body.source);

  // Minimum to accept a submission: some way to reach the person. Phone-only submissions are
  // valid leads — the CRM keys those on phone alone.
  const reachable = Boolean(email || phone);
  if (!isPartial && !reachable) {
    return NextResponse.json(
      { error: "An `email` or `phone` is required" },
      { status: 400 },
    );
  }

  // Abandoned fill: quotes@ only. Nothing reaches the CRM, so nothing texts or emails the lead.
  if (isPartial) {
    if (isFinal && reachable) {
      await sendIntakeNotification({
        name,
        email,
        phone,
        businessType,
        zip,
        partial: true,
        source,
      });
    }
    return NextResponse.json({ ok: true, crm: "skipped" }, { status: 200 });
  }

  // Optional CAPI event name. Absent => "Lead" (today's behavior; /religious
  // and every other caller are untouched).
  const capiEventName = asTrimmedString(body.capiEventName);

  // Disqualified outcome (e.g. a bar from /restaurant): fire the NON-Lead CAPI
  // signal so Meta's optimizer learns to stop serving this segment, but do NOT
  // forward to the CRM (that fan-out would text/email a prospect we can't help)
  // and do NOT alert quotes@ — a disqualified bar is intentionally low-noise.
  if (capiEventName === "RestaurantDisqualified") {
    const disqEventId = asTrimmedString(body.eventId);
    const capi =
      disqEventId && reachable
        ? await sendCapiEvent(
            request,
            "RestaurantDisqualified",
            disqEventId,
            email,
            phone,
          )
        : "skipped";
    return NextResponse.json(
      { ok: true, crm: "skipped", capi },
      { status: 200 },
    );
  }

  // `source` is a page label (e.g. "restaurants-splash-next-handoff"), not a per-lead id, so it
  // must not go through as providerId — the CRM builds its Activity dedupe key from it, and a
  // shared value would collapse every lead from that page into one Activity. Omitting it lets the
  // CRM fall back to contact.id; the label rides along in the description instead, where it shows
  // up in the Activity notes and the Slack lead card.
  const description = [businessType, source ? `via ${source}` : undefined]
    .filter(Boolean)
    .join(" — ");

  // Deep intake forms (e.g. /religious) carry structured answers the CRM webhook can't hold
  // (it takes flat contact fields only), so these ride to quotes@ as a quote-ready detail block.
  const details = sanitizeDetails(body.details);

  // The restaurant lane BYPASSES the CRM inbound-lead webhook — exactly like the Foxquilt FB lane.
  // upsertInboundLead fires an automated first-touch SMS, and we must NOT auto-text these leads: the
  // supervised auto-quoter (rest_loop.py) sweeps quotes@ and sends the QUOTE itself as the only
  // outbound touch. So restaurant submissions go to quotes@ (+ CAPI) only, never the CRM. Church and
  // every other lane are unchanged.
  const isRestaurantLane = source === "restaurant-landing";
  const forwarded = isRestaurantLane
    ? false
    : await forwardToCrm({
        ...(name ? { name } : {}),
        ...(email ? { email } : {}),
        ...(phone ? { phone } : {}),
        ...(description ? { business_type: description } : {}),
        ...(zip ? { zip } : {}),
      });

  // ZERO-MISS RULE: the CRM is now the system of record, but it's a network hop away and the
  // client call is fire-and-forget — it will never retry. If the handoff fails for any reason,
  // fall back to the quotes@ alert so a real lead still lands somewhere a human reads.
  // (2026-07-09 incident: storage failures 500'd and silently dropped real submissions while
  // the pixel kept counting them.)
  // Send quotes@ when the CRM forward failed (zero-miss) OR whenever a deep-form detail block
  // exists — the CRM webhook only carries flat contact fields, so quotes@ is how the agent gets
  // the quote-ready building answers even on a successful forward.
  if (!forwarded || details) {
    await sendIntakeNotification({
      name,
      email,
      phone,
      businessType,
      zip,
      partial: false,
      source,
      details,
    });
  }

  // Server-side CAPI event, deduped with the browser pixel via the shared event
  // id. Real submissions only — partials returned above, so they never count as
  // a conversion (and thus never train ad optimization on non-submitters).
  // eventName defaults to "Lead" (church/religious + any legacy caller); the
  // /restaurant lane sends "Lead" for instant-quotable and "RestaurantLeadES"
  // for the E&S lane so Meta captures the lead without optimizing toward it.
  const eventId = asTrimmedString(body.eventId);
  const eventName = capiEventName ?? "Lead";
  const capi =
    eventId && reachable
      ? await sendCapiEvent(request, eventName, eventId, email, phone)
      : "skipped";

  return NextResponse.json(
    { ok: true, crm: forwarded ? "sent" : "failed", capi },
    { status: 200 },
  );
}
