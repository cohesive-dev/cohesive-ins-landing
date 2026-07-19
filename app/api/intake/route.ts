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

type IntakePayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  businessType?: unknown;
  zip?: unknown;
  partial?: unknown;
  final?: unknown;
  source?: unknown;
};

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

  // `source` is a page label (e.g. "restaurants-splash-next-handoff"), not a per-lead id, so it
  // must not go through as providerId — the CRM builds its Activity dedupe key from it, and a
  // shared value would collapse every lead from that page into one Activity. Omitting it lets the
  // CRM fall back to contact.id; the label rides along in the description instead, where it shows
  // up in the Activity notes and the Slack lead card.
  const description = [businessType, source ? `via ${source}` : undefined]
    .filter(Boolean)
    .join(" — ");

  const forwarded = await forwardToCrm({
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
  if (!forwarded) {
    await sendIntakeNotification({
      name,
      email,
      phone,
      businessType,
      zip,
      partial: false,
      source,
    });
  }

  return NextResponse.json(
    { ok: true, crm: forwarded ? "sent" : "failed" },
    { status: 200 },
  );
}
