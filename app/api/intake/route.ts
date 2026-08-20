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

// Deliberately NOT env-configurable. The Vercel env had CRM_BASE_URL=https://www.cohesiveinsure.com
// (this site), so every forward POSTed to itself, got its own 404 page, and silently dropped the
// CRM handoff for weeks (2026-08-13 diagnosis — 4 church fills that day alone survived only via
// the quotes@ fallback). The CRM host changes ~never; a hard-coded constant fails loudly in code
// review instead of silently in a dashboard. Delete the stale CRM_BASE_URL var from Vercel.
const CRM_INBOUND_LEAD_URL =
  "https://crm.cohesiveinsure.com/api/webhooks/inbound-lead";

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
  // Legal business name — forwarded to the CRM as business_name so the
  // Account gets named after the business, not the person.
  company?: unknown;
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
  // Optional 2nd browser+server event id: when present, the server ALSO sends
  // "QualifiedLead" (deduped with the page's matching fbq call). Set by lanes
  // whose form can tell a high-value lead apart at submit time (see /contractors).
  qualifiedEventId?: unknown;
  // Optional 3rd event id: "UninsuredLead" - the yellow-flag tier (buying, but no incumbent
  // premium to beat). Kept separable from QualifiedLead so the adset can chase only the primary.
  uninsuredEventId?: unknown;
  // Optional: restaurant landing sends this for qualified + now/30d leads; server ALSO
  // fires "LeadUrgentQuoted" (deduped with the page's fbq by shared id).
  urgentEventId?: unknown;
  // Contractors: urgent AND self-reported $5K+ -> "QualifiedUrgentLead" (phase-2 stage).
  qualifiedUrgentEventId?: unknown;
  // Contractors: self-reported revenue >= $1M, any trade -> "LargeBusinessLead". The size proxy
  // for a $5K+ premium; fires ~2x as often as the premium self-report and catches the large
  // uninsured/underpaying businesses the premium filter drops.
  largeBusinessEventId?: unknown;
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

async function forwardToCrm(
  // `details` rides through as an array of {label, value} objects, so this cannot be
  // Record<string, string | string[]> any more.
  payload: Record<
    string,
    string | string[] | Array<{ label: string; value: string }>
  >,
): Promise<boolean> {
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
  const company = asTrimmedString(body.company);
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

  // Deep intake forms (e.g. /religious) carry structured answers the CRM webhook can't hold
  // (it takes flat contact fields only), so these ride to quotes@ as a quote-ready detail block.
  // Declared here rather than further down because the abandoned-fill branch below needs it too.
  const details = sanitizeDetails(body.details);

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
        // Partials carried a detail block and this branch dropped it, which threw
        // away the only thing an abandon can tell us: how far they got before
        // leaving. On a completed submit "furthest step" is always the last one,
        // so the abandon path is precisely where it has any value.
        details,
      });
    }
    return NextResponse.json({ ok: true, crm: "skipped" }, { status: 200 });
  }

  // Optional CAPI event name. Absent => "Lead" (today's behavior; /religious
  // and every other caller are untouched).
  const capiEventName = asTrimmedString(body.capiEventName);

  // Disqualified outcome (e.g. a bar from /restaurant): fire the NON-Lead CAPI
  // signal so Meta's optimizer learns to stop serving this segment, and do NOT
  // forward to the CRM (that fan-out would text/email the prospect).
  // ★ Kevin 2026-08-16: "disqualified" is a CAPI signal ONLY, not a dead lead - the page
  // now tells them "we'll need a bit longer ... we will be in touch", so bar / high-alcohol
  // fills MUST still reach quotes@ (route to Hedge + ask for the existing policy). Nothing is
  // dropped - "we can technically quote anything through Hedge" - so even a "Not a food
  // business" pick (often a misclick) lands in quotes@ for a human to triage.
  if (capiEventName === "RestaurantDisqualified") {
    const disqEventId = asTrimmedString(body.eventId);
    {
      const disqDetails = sanitizeDetails(body.details) ?? [];
      await sendIntakeNotification({
        name,
        email,
        phone,
        businessType,
        zip,
        partial: false,
        source,
        details: [
          {
            label: "⚠️ NOT INSTANT-QUOTABLE",
            value: `${businessType === "Not a food business" ? "Picked 'Not a food business' (verify - may be a misclick)" : "Bar / high-alcohol"} - CAPI marked disqualified (non-Lead). Route to Hedge (E&S) + ask for the existing policy. Page told them we need a bit longer and will be in touch.`,
          },
          ...disqDetails,
        ],
      });
    }
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

  // The restaurant lane USED to bypass the CRM inbound-lead webhook entirely (like the Foxquilt FB
  // lane) because upsertInboundLead fires an automated first-touch SMS and we must never auto-text
  // these leads — the supervised auto-quoter (rest_loop.py) sweeps quotes@ and sends the QUOTE
  // itself as the only outbound touch. The bypass worked but made the lane INVISIBLE: a restaurant
  // landing fill existed only as a quotes@ email and a pixel event, so landing-lane volume could
  // not be counted or reconciled in the CRM at all (2026-08-17: 12 pixel-recorded fills, 0 CRM rows,
  // and no way to tell a real lead from test traffic).
  // ★ Kevin 2026-08-17: do what contractors do instead — FORWARD, with suppress_first_touch. The
  // deployed CRM honors that flag (contractor lane has relied on it since 2026-08-13), so the lead
  // is recorded without any automated SMS/dial, and rest_loop.py keeps owning the first touch via
  // quotes@ exactly as before.
  const fbc = request.cookies.get("_fbc")?.value;
  const fbp = request.cookies.get("_fbp")?.value;
  const isRestaurantLane = source === "restaurant-landing";
  // The contractor lane records the contact in the CRM but suppresses the automated
  // first-touch SMS/dial (deployed CRM honors suppress_first_touch): its quote loop
  // (Foxquilt instant-quote or Hedge ack) owns the first outbound touch, church-style.
  const isContractorLane = source === "contractors-landing";
  // Commercial property owns its own first touch too: the lane is Pathpoint-first
  // behind a judgment gate (clean instant quote -> send it; any gap -> ack + Hedge),
  // so a generic automated SMS the moment the form lands would beat our own quote
  // to the client and breaks the standing "never auto-text leads" rule. Covers both
  // A/B cells: "commercial-property-landing" (long) and "-steps".
  const isCommercialPropertyLane = (source ?? "").startsWith(
    "commercial-property",
  );
  const forwarded = await forwardToCrm({
    ...(name ? { name } : {}),
    ...(email ? { email } : {}),
    ...(phone ? { phone } : {}),
    ...(description ? { business_type: description } : {}),
    ...(company ? { business_name: company } : {}),
    ...(zip ? { zip } : {}),
    ...(isContractorLane || isRestaurantLane || isCommercialPropertyLane
      ? { suppress_first_touch: "true" }
      : {}),
    // ★ Kevin 2026-08-19: the CP lane must record Property, not GL. The CRM webhook defaults
    // a lead with no `coverage` to General Liability (inboundLead.ts: `input.coverage?.length
    // ? input.coverage : [Line.GeneralLiability]`), and this route never sent one — so every
    // commercial-property fill landed as a GL lead, indistinguishable from a contractor in any
    // coverage-based query or route (found while reconciling the 8/18-19 CP A/B: 9 real leads
    // in Slack, only 2 findable by coverage in the CRM). The lane is Property-first; GL is at
    // most a secondary line on a building owner, never the requested one.
    ...(isCommercialPropertyLane ? { coverage: ["Property"] } : {}),
    // Meta click/browser ids, read off the pixel's own cookies. Persisted on the CRM's
    // inbound_lead Activity so the LATER LeadQuoted CAPI event (fired after we quote, from
    // lead_quoted_capi.py) can match on fbc/fbp instead of email+phone alone. Without this
    // the ids die with the request and every value event is a weak match.
    ...(fbc ? { fbc } : {}),
    ...(fbp ? { fbp } : {}),
    // The full questionnaire (COPE answers, claims, ad attribution). Already parsed and
    // capped by sanitizeDetails() above. The CRM webhook reads this key as `details` and maps
    // it onto InboundLeadInput.slackExtraFields, the existing pass-through for data-heavy
    // sources, which renders as the Slack card's collapsible "More details" block and is
    // persisted to activities.meta->formAnswers. Note the key: `slackExtraFields` here would
    // be silently ignored. Without this the answers reached quotes@ by email and nowhere else.
    ...(details ? { details } : {}),
  });

  // ZERO-MISS RULE: the CRM is now the system of record, but it's a network hop away and the
  // client call is fire-and-forget — it will never retry. If the handoff fails for any reason,
  // fall back to the quotes@ alert so a real lead still lands somewhere a human reads.
  // (2026-07-09 incident: storage failures 500'd and silently dropped real submissions while
  // the pixel kept counting them.)
  // ★ Kevin 2026-08-18: EVERY completed submission emails quotes@, unconditionally. This used to
  // be gated on `!forwarded || details || isRestaurantLane`, which meant a form with no detail
  // block whose CRM forward SUCCEEDED sent no email at all — precisely the generic homepage
  // QuoteModal (app/page.tsx) and the splash gates (QuoteSplash.tsx), neither of which sends
  // `details`. Those leads existed only as a CRM row and a Slack card, so every quotes@-driven
  // sweep and auto-quoter was structurally blind to them (found via Lauren Parton /
  // billing@poolprosllc.com, a pool contractor asking for GL: Slack card posted, zero email).
  // The old rationale still holds as a floor and is now subsumed: forward failure is still the
  // zero-miss fallback (2026-07-09 incident), deep-form `details` still ride to quotes@ because
  // the CRM webhook carries flat contact fields only, and the restaurant lane still always gets
  // its email because rest_loop.py sweeps this inbox and owns the lane's only outbound touch.
  // A duplicate alert on a lane that was already emailing costs nothing; a silent drop costs a lead.
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
  // ★ QualifiedLead (Kevin 2026-08-15): the /contractors form fires this ONLY when the lead
  // self-reports a current GL premium of $5K+ ("$5K - $20K" / "$20K+"). That is the
  // winnability signal - what the market already extracts from them - not what we would
  // quote (a big quote can just be an uncompetitive market; ARGC said $26K and closed,
  // Steve said $2-5K and was unwinnable at our $8-16K). Sent server-side with the same
  // fbc/fbp/ip/ua match quality as Lead, deduped with the browser fbq by shared event id.
  // The plain Lead above still fires for EVERY submit - this is additive, never a filter.
  const qualifiedEventId = asTrimmedString(body.qualifiedEventId);
  const capiQualified =
    qualifiedEventId && reachable
      ? await sendCapiEvent(
          request,
          "QualifiedLead",
          qualifiedEventId,
          email,
          phone,
        )
      : "skipped";

  const uninsuredEventId = asTrimmedString(body.uninsuredEventId);
  const capiUninsured =
    uninsuredEventId && reachable
      ? await sendCapiEvent(
          request,
          "UninsuredLead",
          uninsuredEventId,
          email,
          phone,
        )
      : "skipped";

  const urgentEventId = asTrimmedString(body.urgentEventId);
  const capiUrgent =
    urgentEventId && reachable
      ? await sendCapiEvent(
          request,
          "LeadUrgentQuoted",
          urgentEventId,
          email,
          phone,
        )
      : "skipped";

  const qualifiedUrgentEventId = asTrimmedString(body.qualifiedUrgentEventId);
  const capiQualifiedUrgent =
    qualifiedUrgentEventId && reachable
      ? await sendCapiEvent(
          request,
          "QualifiedUrgentLead",
          qualifiedUrgentEventId,
          email,
          phone,
        )
      : "skipped";

  const largeBusinessEventId = asTrimmedString(body.largeBusinessEventId);
  const capiLargeBusiness =
    largeBusinessEventId && reachable
      ? await sendCapiEvent(
          request,
          "LargeBusinessLead",
          largeBusinessEventId,
          email,
          phone,
        )
      : "skipped";

  return NextResponse.json(
    {
      ok: true,
      crm: forwarded ? "sent" : "failed",
      capi,
      capiQualified,
      capiUninsured,
      capiUrgent,
      capiQualifiedUrgent,
      capiLargeBusiness,
    },
    { status: 200 },
  );
}
